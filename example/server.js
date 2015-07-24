"use strict";

var express = require("express");
var async = require("async");
var OPC = require("../");
var opc = new OPC();
var app = express();

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
});

app.listen(8081);
