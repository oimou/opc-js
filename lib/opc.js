"use strict";

var util = require("util");
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

    request(opt, cb);
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
    this._command("GET", "/start_pushevent.cgi", param, function (err, resp, body) {
        if (err) {
            cb(err);
            return;
        }

        var client = self.eventServer = net.connect({
            host: self.host,
            port: self.eventServerPort
        }, function () {
            console.log("CONNECTED TO EVENT SERVER");
            cb();
        });

        client.on("error", function (err) {
            console.log("EVENT SERVER ERR:", err);
        });

        client.on("data", function (buf) {
            console.log("BUF(HEX):", buf.toString("hex"));
            console.log("BUF(STR):", buf.toString("binary"));

            var hex = buf.toString("hex");

            if (hex.match(/^02c9/i)) {
                self.emit("cameramode");
            }
        });

        client.on("end", function () {
            console.log("DISCONNECTED FROM SERVER");
        });
    });
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
    this._command("GET", "/exec_takemisc.cgi", param, cb);
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
