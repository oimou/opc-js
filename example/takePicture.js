/*
 *  カメラの電源をONにしてカメラのWi-Fiに接続し
 *  このサンプルコードを実行してください。
 *  tmpディレクトリにライブビュー画像が保存されます。
 */

"use strict";

var fs = require("fs");
var async = require("async");
var OPC = require("../");
var opc = new OPC();

process.on("SIGINT", function () {
    opc.destroy();
    process.exit(1); // eslint-disable-line
});

process.on("uncaughtException", function (err) {
    opc.destroy();
    console.error(err);
    process.exit(1); // eslint-disable-line
});

async.series([
    function (next) {
        opc.negotiate(null, next);
    },

    function (next) {
        opc.execTakemotion({
            com: "newstarttake"
        }, next);
    },

    function (next) {
        opc.once("image:finished", function () {
            next();
        });
    },

    function (next) {
        opc.execTakemisc({
            com: "getrecview"
        }, function () {
            next();
        });
    },

    function (next) {
        opc.getCamprop({
            com: "get",
            propname: "DESTINATION_FILE"
        }, function (err, data) {
            console.log(err, data);
            next();
        });
    },

    function (next) {
        opc.once("transfer:request", function () {
            next();
        });
    },

    function (next) {
        opc.execStoreimage(function (err, data) {
            console.log(data);
            next();
        });
    }
], function onFinish(err) {
    if (err) {
        console.error(err);
    }

    console.log("FINISHED");
});
