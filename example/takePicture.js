"use strict";

var async = require("async");
var OPC = require("../");
var opc = new OPC();

opc.on("error", function (err) {
    console.error("OPC ERR:", err);

    setTimeout(function () {
        opc.destroy();
        process.exit(1);
    }, 2000);
});

opc.on("liveview:frame", function (jpg) {
    require("fs").writeFile("tmp/frame." + Math.random() + ".jpg", jpg);
});

async.series([
    function (next) {
        opc.getConnectmode(function (err, data) {
            if (err) {
                console.error("GET CONNECTMODE ERR:", err);
                return next(err);
            }

            console.log("connect mode:", data);

            if (true /* isOPC */) {
                next();
            } else {
                next("NOT OPC DEVICE");
            }
        });
    },

    function (next) {
        opc.switchCommpath({
            path: "wifi"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH COMMPATH ERR:", err);
                return next(err);
            }

            next();
        });
    },

    function (next) {
        opc.startPushevent({
            port: 65000
        }, function (err) {
            if (err) {
                console.error("START PUSHEVENT ERR:", err);
                return next(err);
            }

            next();
        });
    },

    function (next) {
        opc.switchCameramode({
            mode: "standalone"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH CAMERAMODE ERR:", err);
                return next(err);
            }

            next();
        });
    },

    function (next) {
        opc.once("cameramode", function () {
            next();
        });
    },

    function (next) {
        opc.switchCameramode({
            mode: "rec"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH CAMERAMODE ERR:", err);
                return next(err);
            }

            next();
        });
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
        }, function (err, resp, body) {
            if (err) {
                console.error("EXEC TAKEMISC ERR:", err);
                return next(err);
            }

            next();
        });
    },

    function (next) {
        setTimeout(function () {
            next();
        }, 3000);
    },

    function (next) {
        opc.execTakemotion({
            com: "newstarttake"
        }, function (err, resp, body) {
            if (err) {
                console.error("EXEC TAKEMOTION ERR:", err);
                return next(err);
            }

            next();
        });
    },

    function (next) {
        setTimeout(function () {
            next();
        }, 3000);
    }
], function onFinish(err, res) {
    if (err) {
        opc.destroy();
        console.error(err);
        return;
    }

    opc.destroy();
});

process.on("SIGINT", function () {
    opc.destroy();
    process.exit(1);
});

process.on("uncaughtException", function () {
    opc.destroy();
    process.exit(1);
});
