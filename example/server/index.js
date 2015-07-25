"use strict";

var express = require("express");
var async = require("async");
var OPC = require("../../");
var opc = new OPC();
var app = express();
var server = app.listen(8081);
var io = require("socket.io")(server);

// server
app.set("views", __dirname);
app.set("view engine", "jade");
app.use(express["static"](__dirname));

app.get("/", function (req, res) {
    res.render("./index");
});

// opc
opc.on("event", function (event) {
    console.log("OPC EVENT:", event);
});

opc.on("error", function (err) {
    console.error("OPC ERR:", err);

    setTimeout(function () {
        opc.destroy();
        process.exit(1);
    }, 2000);
});

opc.on("liveview:frame", function (jpg) {
    //require("fs").writeFile("tmp/frame." + Math.random() + ".jpg", jpg);
    io.emit("liveview:frame", {
        jpg: jpg
    });
});

io.on("connection", function (socket) {
    socket.on("takemotion:start", takePicture);
});

function takePicture() {
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
        },

        function (next) {
            opc.execTakemisc({
                com: "changelvqty",
                lvqty: "1280x0960"
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
        },

        function (next) {
            setTimeout(function () {
                next();
            }, 3000);
        },

        function (next) {
            console.log("EXEC TAKEMOTION");

            opc.execTakemotion({
                com: "newstarttake",

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
        },

        function (next) {
            setTimeout(function () {
                next();
            }, 3000);
        }
    ], function onFinish(err, res) {
        if (err) {
            console.error(err);
            return;
        }

        console.log("DONE");
        io.emit("takemotion:finish");
    });
}

process.on("SIGINT", function () {
    console.log("EXITTING..");

    opc.destroy();

    setTimeout(function () {
        process.exit(1);
    }, 2000);
});

process.on("uncaughtException", function () {
    console.log("EXITTING..");

    opc.destroy();

    setTimeout(function () {
        process.exit(1);
    }, 2000);
});
