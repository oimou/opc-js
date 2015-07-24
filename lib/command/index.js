"use strict";

var dgram = require("dgram");

var OPC = {};

/**
 *  システム関連
 */
OPC.getConnectmode = function (cb) {
    this._command("GET", "/get_connectmode.cgi", null, cb);
};

OPC.switchCameramode = function (param, cb) {
    this._command("GET", "/switch_cameramode.cgi", param, cb);
};

OPC.getCommpath = function (cb) {
    this._command("GET", "/get_commpath.cgi", null, cb);
};

OPC.switchCommpath = function (param, cb) {
    this._command("GET", "/switch_commpath.cgi", param, cb);
};

OPC.execPwoff = function (cb) {
    this._command("GET", "/exec_pwoff.cgi", null, cb);
};

OPC.startPushevent = function (param, cb) {
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

OPC.stopPushevent = function (cb) {
    if (this.eventServer && this.eventServer.end) {
        this.eventServer.end();
    }

    this._command("GET", "/stop_pushevent.cgi", null, cb);
};

OPC.getState = function (cb) {
    this._command("GET", "/get_state.cgi", null, cb);
};

/**
 *  カメラプロパティ操作
 */
OPC.getCamprop = function (param, cb) {
    this._command("GET", "/get_camprop.cgi", param, cb);
};

OPC.setCamprop = function (param, cb) {
    this._command("POST", "/set_camprop.cgi", param, cb);
};

/**
 *  再生・転送
 */
OPC.getResizeimg = function (param, cb) {
    this._command("GET", "/get_resizeimg.cgi", param, cb);
};

OPC.getImglist = function (param, cb) {
    this._command("GET", "/get_imglist.cgi", param, cb);
};

OPC.getScreennail = function (param, cb) {
    this._command("GET", "/get_screennail.cgi", param, cb);
};

OPC.getMovfileinfo = function (param, cb) {
    this._command("GET", "/get_movfileinfo.cgi", param, cb);
};

OPC.getImageinfo = function (param, cb) {
    this._command("GET", "/get_imageinfo.cgi", param, cb);
};

OPC.getThumbnail = function (param, cb) {
    this._command("GET", "/get_thumbnail.cgi", param, cb);
};

OPC.execStoreimage = function (cb) {
    this._command("GET", "/exec_storeimage.cgi", null, cb);
};

/**
 *  撮影
 */
OPC.execTakemotion = function (param, cb) {
    this._command("GET", "/exec_takemotion.cgi", param, cb);
};

OPC.execTakemisc = function (param, cb) {
    var self = this;

    if (param.com === "startliveview") {
        var port = param.port;
        var server = this.liveviewServer = dgram.createSocket("udp4");

        server.on("message", function (msg, rinfo) {
            var rtpHeaderByteLength = 12;
            var extensionHeaderByteLength = 4;
            var extensionBit;
            var hasExtensionHeader;
            var jpgChunk;

            extensionBit = parseInt(msg[0].toString(2)[3], 2);

            console.log("extensionBit", extensionBit);

            hasExtensionHeader = (extensionBit === 1);

            if (hasExtensionHeader) {
                self.emit("liveview:frame", self._jpgBuffer);

                self._jpgBuffer = new Buffer(0);

                var extensionWordLength = msg.readUInt16BE(14);
                var extensionByteLength = extensionWordLength * 4;

                console.log("extensionByteLength", extensionByteLength);

                jpgChunk = msg.slice(rtpHeaderByteLength + extensionByteLength + extensionHeaderByteLength);
            } else {
                jpgChunk = msg.slice(rtpHeaderByteLength);
            }

            self._jpgBuffer = Buffer.concat([self._jpgBuffer, jpgChunk]);

            // イベント発火
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
OPC.execErase = function (param, cb) {
    this._command("GET", "/exec_erase.cgi", param, cb);
};

OPC.releaseAllprotect = function (cb) {
    this._command("GET", "/release_allprotect.cgi", null, cb);
};

OPC.execProtect = function (param, cb) {
    this._command("GET", "/exec_protect.cgi", param, cb);
};

module.exports = OPC;
