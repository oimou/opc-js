/*
 *  カメラの電源をONにしてカメラのWi-Fiに接続し
 *  このサンプルコードを実行してください。
 *  tmpディレクトリに5秒分のライブビュー画像が保存されます。
 */

"use strict";

var fs = require("fs");
var async = require("async");
var OPC = require("../");
var opc = new OPC();

if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
}

opc.on("liveview:frame", function (jpg) {
    fs.writeFile("tmp/liveview." + Math.random() + ".jpg", jpg);
});

opc.negotiate();

setTimeout(function () {
    opc.destroy();
}, 5000);
