"use strict";

var request = require("request");
var parseXML = require("xml2js").parseString;

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

    this._request(opt, function (err, resp, body) {
        if (err) {
            cb(err);
            return;
        }

        if (resp.statusCode !== 200) {
            cb(new Error("Invalid status code: " + resp.statusCode + " body: " + body));
            return;
        }

        parseXML(body, function (errXml, res) {
            if (errXml) {
                console.error(errXml);
                return;
            }

            cb && cb(null, res);
        });
    });
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
