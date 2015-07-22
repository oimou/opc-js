"use strict";

var util = require("util");
var dgram = require("dgram");
var net = require("net");
var EventEmitter = require("events").EventEmitter;
var request = require("request");

/**
 *  OPC
 *
 *  @class OPC
 */
var OPC = function () {
    this.host = "192.168.0.10";
    this.commandServerPort = 80;
    this.eventServer = null;
    this.eventServerPort = null;
    this.liveviewServer = null;
};

util.inherits(OPC, EventEmitter);

OPC.prototype._request = request;

OPC.prototype._command = function (method, cmd, param, cb) {
    var opt = {
        method: method,
        baseUrl: "http://" + this.host,
        uri: cmd,
        qs: param,
        headers: {
            "User-Agent": "OlympusCameraKit"
        },
        body: param && param.body
    };

    this._request(opt, cb);
};

/**
 *  イベント通知を受け取るサーバを初期化する
 *
 *  @param {Function} cb
 *  @memberof OPC
 */
OPC.prototype._initEventServer = function (cb) {
    var self = this;

    var client = self.eventServer = net.connect({
        host: this.host,
        port: this.eventServerPort
    }, function () {
        console.log("CONNECTED TO EVENT SERVER");
        cb();
    });

    client.on("error", function (error) {
        console.log("EVENT SERVER ERR:", error);
    });

    client.on("data", function (buf) {
        console.log("BUF(HEX):", buf.toString("hex"));
        console.log("BUF(STR):", buf.toString("binary"));

        while (buf.length) {
            var appId = buf.readUInt8(0);
            var eventId = buf.readUInt8(1);
            var eventBodyLength = buf.readUInt16BE(2);
            var body;

            body = buf.slice(4, 4 + eventBodyLength).toString();
            buf = buf.slice(4 + eventBodyLength + 1);

            if (appId !== 2) {
                self.emit("error", new Error("Invalid appId " + appId));
                return;
            }

            // イベント通知全般に対する処理
            self.emit("event", {
                appId: appId,
                eventId: eventId,
                body: body
            });

            // 各イベント通知に対する処理
            switch (eventId) {
                // バッテリー残量
                case 0x05:
                    self.emit("battery", body);
                    break;

                // 動作モード切替完了
                case 0xc9:
                    self.emit("cameramode", body);
                    break;

                // カメラプロパティ取得要求
                case 0xce:
                    self.emit("camprop", body);
                    break;

                // 不明なイベント通知
                default:
                    self.emit("error", new Error("Invalid event type " + eventId));
                    break;
            }
        }
    });

    client.on("end", function () {
        console.log("DISCONNECTED FROM SERVER");
    });
};

/**
 *  接続解除
 */
OPC.prototype.destroy = function () {
    this.stopPushevent();
    this.execTakemisc({
        com: "stopliveview"
    });
    this.liveviewServer && this.liveviewServer.close();
};

/**
 *  電源ON
 *
 *  @param {Function} cb
 */
OPC.prototype.execPwon = function (cb) { // eslint-disable-line
    // BLEの仕様が公開されていないため保留
};

/**
 *  システム関連
 */
OPC.prototype.getConnectmode = function (cb) {
    this._command("GET", "/get_connectmode.cgi", null, cb);
};

OPC.prototype.switchCameramode = function (param, cb) {
    this._command("GET", "/switch_cameramode.cgi", param, cb);
};

OPC.prototype.getCommpath = function (cb) {
    this._command("GET", "/get_commpath.cgi", null, cb);
};

OPC.prototype.switchCommpath = function (param, cb) {
    this._command("GET", "/switch_commpath.cgi", param, cb);
};

OPC.prototype.execPwoff = function (cb) {
    this._command("GET", "/exec_pwoff.cgi", null, cb);
};

OPC.prototype.startPushevent = function (param, cb) {
    var self = this;

    this.eventServerPort = param.port;
    this._command(
        "GET",
        "/start_pushevent.cgi",
        param,
        function (err) {
            if (err) {
                cb(err);
                return;
            }

            self._initEventServer(cb);
        }
    );
};

OPC.prototype.stopPushevent = function (cb) {
    if (this.eventServer && this.eventServer.end) {
        this.eventServer.end();
    }

    this._command("GET", "/stop_pushevent.cgi", null, cb);
};

OPC.prototype.getState = function (cb) {
    this._command("GET", "/get_state.cgi", null, cb);
};

/**
 *  カメラプロパティ操作
 */
OPC.prototype.getCamprop = function (param, cb) {
    this._command("GET", "/get_camprop.cgi", param, cb);
};

OPC.prototype.setCamprop = function (param, cb) {
    this._command("POST", "/set_camprop.cgi", param, cb);
};

/**
 *  再生・転送
 */
OPC.prototype.getResizeimg = function (param, cb) {
    this._command("GET", "/get_resizeimg.cgi", param, cb);
};

OPC.prototype.getImglist = function (param, cb) {
    this._command("GET", "/get_imglist.cgi", param, cb);
};

OPC.prototype.getScreennail = function (param, cb) {
    this._command("GET", "/get_screennail.cgi", param, cb);
};

OPC.prototype.getMovfileinfo = function (param, cb) {
    this._command("GET", "/get_movfileinfo.cgi", param, cb);
};

OPC.prototype.getImageinfo = function (param, cb) {
    this._command("GET", "/get_imageinfo.cgi", param, cb);
};

OPC.prototype.getThumbnail = function (param, cb) {
    this._command("GET", "/get_thumbnail.cgi", param, cb);
};

OPC.prototype.execStoreimage = function (cb) {
    this._command("GET", "/exec_storeimage.cgi", null, cb);
};

/**
 *  撮影
 */
OPC.prototype.execTakemotion = function (param, cb) {
    this._command("GET", "/exec_takemotion.cgi", param, cb);
};

OPC.prototype.execTakemisc = function (param, cb) {
    var self = this;

    if (param.com === "startliveview") {
        var port = param.port;
        var server = this.liveviewServer = dgram.createSocket("udp4");

        server.on("message", function (msg, rinfo) {
            self.emit("liveview:message", msg, rinfo);
        });

        server.on("listening", function () {
            self.emit("liveview:listening");
            self._command("GET", "/exec_takemisc.cgi", param, cb);
        });

        server.bind(port);
    } else {
        this._command("GET", "/exec_takemisc.cgi", param, cb);
    }
};

/**
 *  保守
 */
OPC.prototype.execErase = function (param, cb) {
    this._command("GET", "/exec_erase.cgi", param, cb);
};

OPC.prototype.releaseAllprotect = function (cb) {
    this._command("GET", "/release_allprotect.cgi", null, cb);
};

OPC.prototype.execProtect = function (param, cb) {
    this._command("GET", "/exec_protect.cgi", param, cb);
};

module.exports = OPC;
