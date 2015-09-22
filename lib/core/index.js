"use strict";

var DEBUG = require("debug")("opc:core");
var request = require("request");
var parseXML = require("xml2js").parseString;

var OPC = {

    /**
     *  コマンド送信時のHTTPリクエストの実装
     *
     *  @memberof OPC#
     *  @private
     */
    _request: request,

    /**
     *  コマンド送信
     *
     *  @param {String} method
     *  @param {String} cmd
     *  @param {Boolean} isBinary
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     *  @private
     */
    _command: function (method, cmd, isBinary, param, cb) {
        cb = cb || function () {};

        var opt = {
            method: method,
            baseUrl: "http://" + this.host,
            uri: cmd,
            qs: param,
            headers: {
                "User-Agent": "OlympusCameraKit"
            },
            body: param && param.body,
            encoding: null
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

            if (isBinary) {
                cb(null, body);
                return;
            }

            parseXML(body, function (errXml, res) {
                if (errXml) {
                    cb(errXml);
                    return;
                }

                cb(null, res);
            });
        });
    },

    /**
     *  接続解除
     *
     *  @memberof OPC#
     */
    destroy: function () {
        var self = this;

        this.execTakemisc({
            com: "stopliveview"
        }, function () {
            self.stopPushevent();
            self.liveviewServer && self.liveviewServer.close();
        });
    }

};

module.exports = OPC;
