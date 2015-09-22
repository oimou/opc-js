/*
 *  カメラの電源をONにしてカメラのWi-Fiに接続し
 *  このサンプルコードを実行してください。
 *  tmpディレクトリに撮影結果画像が保存されます。
 */

"use strict";

var fs = require("fs");
var async = require("async");
var OPC = require("../");
var opc = new OPC();

if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
}

async.series([
    function (next) {
        opc.negotiate(null, next);
    },

    function (next) {
        opc.setCamprop({
            com: "set",
            propname: "RAW",
            body: "<?xml version=\"1.0\"?><set><value>OFF</value></set>"
        }, function (err, data) {
            console.log(err, data);
            next();
        });
    },

    function (next) {
        opc.setCamprop({
            com: "set",
            propname: "DESTINATION_FILE",
            body: "<?xml version=\"1.0\"?><set><value>DESTINATION_FILE_WIFI</value></set>"
        }, function (err, data) {
            console.log(err, data);
            next();
        });
    },

    function (next) {
        opc.execTakemotion({
            com: "newstarttake"
        }, next);
    },

    function (next) {
        opc.once("transfer:request", function () {
            next();
        });
    },

    function (next) {
        opc.execStoreimage(function (err, image) {
            fs.writeFileSync("tmp/result.jpg", image);
            next(err);
        });
    }
], function onFinish(err) {
    if (err) {
        console.error(err);
    }

    opc.destroy();
});
