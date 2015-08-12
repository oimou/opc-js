/*
 *  カメラの電源をONにしてカメラのWi-Fiに接続し
 *  このサンプルコードを実行してください。
 */

"use strict";

var async = require("async");
var OPC = require("../");
var opc = new OPC();

opc.on("error", function (err) {
    console.error("OPC ERR:", err);

    setTimeout(function () {
        opc.destroy();
        process.exit(1); // eslint-disable-line
    }, 2000);
});

opc.on("liveview:frame", function (jpg) {
    require("fs").writeFile("tmp/frame." + Math.random() + ".jpg", jpg);
});

process.on("SIGINT", function () {
    opc.destroy();
    process.exit(1); // eslint-disable-line
});

process.on("uncaughtException", function () {
    opc.destroy();
    process.exit(1); // eslint-disable-line
});

async.series([
    function (next) {
        opc.getConnectmode(function (err, data) {
            if (err) {
                next(err);
            } else if (data.connectmode !== "OPC") {
                next("NOT OPC DEVICE");
            } else {
                next();
            }
        });
    },

    function (next) {
        opc.switchCommpath({
            path: "wifi"
        }, next);
    },

    function (next) {
        opc.startPushevent({
            port: 65000
        }, next);
    },

    function (next) {
        opc.switchCameramode({
            mode: "standalone"
        }, next);
    },

    function (next) {
        opc.once("cameramode", function () {
            next();
        });
    },

    function (next) {
        opc.switchCameramode({
            mode: "rec"
        }, next);
    },

    function (next) {
        opc.once("cameramode", function () {
            next();
        });
    },

    function (next) {
        opc.execTakemisc({
            com: "startliveview",
            port: 5555
        }, next);
    },

    function (next) {
        setTimeout(function () {
            next();
        }, 3000);
    },

    function (next) {
        opc.execTakemotion({
            com: "newstarttake"
        }, next);
    },

    function (next) {
        setTimeout(function () {
            next();
        }, 3000);
    }
], function onFinish(err) {
    if (err) {
        opc.destroy();
        console.error(err);
        return;
    }

    opc.destroy();
});
