"use strict";

var dgram = require("dgram");
var async = require("async");
var OPC = require("./lib/opc");
var opc = new OPC();

async.series([
    function (next) {
        console.log("GET CONNECTMODE");

        opc.getConnectmode(function (err, resp, body) {
            if (err) {
                console.error("GET CONNECTMODE ERR:", err);
                return next(err);
            }

            if (true /* isOPC */) {
                next();
            } else {
                next("NOT OPC DEVICE");
            }
        });
    },

    function (next) {
        console.log("SWITCH COMMPATH");

        opc.switchCommpath({
            path: "wifi"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH COMMPATH ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                next();
            } else {
                next("FAILED TO SWITCH COMMPATH");
            }
        });
    },

    function (next) {
        console.log("START PUSHEVENT");

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
        console.log("SWITCH CAMERAMODE");

        opc.switchCameramode({
            mode: "standalone"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH CAMERAMODE ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                next();
            } else {
                next("FAILED TO SWITCH CAMERAMODE");
            }
        });
    },

    function (next) {
        console.log("WAIT UNTIL READY");

        opc.once("cameramode", function () {
            next();
        });
    },

    function (next) {
        console.log("SWITCH CAMERAMODE");

        opc.switchCameramode({
            mode: "rec"
        }, function (err, resp, body) {
            if (err) {
                console.error("SWITCH CAMERAMODE ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                next();
            } else {
                next("FAILED TO SWITCH CAMERAMODE");
            }
        });
    },

    function (next) {
        console.log("WAIT UNTIL READY");

        opc.once("cameramode", function () {
            next();
        });
    },

    function (next) {
        console.log("GET CAMPROP");

        opc.getCamprop({
            com: "get",
            propname: "APERTURE",
        }, function (err, resp, body) {
            if (err) {
                console.error("GET CAMPROP ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                console.log(body);
                next();
            } else {
                console.log(body);
                next("FAILED TO GET CAMPROP");
            }
        });
    },

    //function (next) {
    //    console.log("SET CAMPROP");

    //    opc.setCamprop({
    //        com: "set",
    //        propname: "SOUND_VOLUME_LEVEL",
    //        body: '<?xml version="1.0"?><set><value>OFF</value></set>'
    //    }, function (err, resp, body) {
    //        if (err) {
    //            console.error("SET CAMPROP ERR:", err);
    //            return next(err);
    //        }

    //        if (resp.statusCode === 200) {
    //            next();
    //        } else {
    //            console.log(body);
    //            next("FAILED TO SET CAMPROP");
    //        }
    //    });
    //},

    function (next) {
        console.log("GET STATE");

        opc.getState(function (err, resp, body) {
            if (err) {
                console.error("GET STATE ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                console.log(body);
                next();
            } else {
                console.log(body);
                next("FAILED TO GET STATE");
            }
        });
    },

    function (next) {
        var server = opc.liveviewServer = dgram.createSocket("udp4");

        server.on("message", function (msg, rinfo) {
            //console.log("MESSAGE: %s from %s:%s", msg, rinfo.address, rinfo.port);
        });

        server.on("listening", function () {
            console.log("UDP SERVER STARTED LISTENING");

            opc.execTakemisc({
                com: "startliveview",
                port: 5555
            }, function (err, resp, body) {
                if (err) {
                    console.error("EXEC TAKEMISC ERR:", err);
                    return next(err);
                }

                if (resp.statusCode === 200) {
                    next();
                } else {
                    console.error(body);
                    next("FAILED TO EXEC TAKEMISC");
                }
            });
        });

        server.bind(5555);
    },

    function (next) {
        console.log("EXEC TAKEMOTION");

        opc.execTakemotion({
            com: "newstarttake"
        }, function (err, resp, body) {
            if (err) {
                console.error("EXEC TAKEMOTION ERR:", err);
                return next(err);
            }

            if (resp.statusCode === 200) {
                console.log(body);
                next();
            } else {
                console.error(body);
                console.error(resp.statusCode);
                next("FAILED TO EXEC TAKEMOTION");
            }
        });
    }
], function onFinish(err, res) {
    if (err) {
        opc.stopPushevent();
        opc.execTakemisc({
            com: "stopliveview"
        });
        opc.liveviewServer && opc.liveviewServer.close();
        console.error(err);
        return;
    }

    console.log("DONE");
});

process.on("SIGINT", function () {
    opc.stopPushevent();
    opc.execTakemisc({
        com: "stopliveview"
    });
    opc.liveviewServer && opc.liveviewServer.close();
    process.exit(1);
});

process.on("uncaughtException", function () {
    opc.stopPushevent();
    opc.execTakemisc({
        com: "stopliveview"
    });
    opc.liveviewServer && opc.liveviewServer.close();
    process.exit(1);
});
