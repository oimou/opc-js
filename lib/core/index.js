"use strict";

var request = require("request");

var OPC = {};

OPC._request = request;

OPC._command = function (method, cmd, param, cb) {
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
 *  接続解除
 *
 *  @memberof OPC#
 */
OPC.destroy = function () {
    this.stopPushevent();
    this.execTakemisc({
        com: "stopliveview"
    });
    this.liveviewServer && this.liveviewServer.close();
};

module.exports = OPC;
