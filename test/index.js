"use strict";

var expect = require("chai").expect;

describe("OPC", function () {
    var net = require("net");
    var OPC = require("../lib/opc");
    var nop = function () {};
    var opc;
    var server;

    beforeEach(function () {
        opc = new OPC();
        opc.host = "localhost";
    });

    afterEach(function () {
        opc && opc.stopPushevent();
        server && server.close();
    });

    /*
     *  lib/core
     */
    describe("core module", function () {
        xit("#destroy should close connections to camera", function () {
        });
    });

    /*
     *  lib/ble
     */
    describe("ble module", function () {
    });

    /*
     *  lib/command
     */
    describe("command module", function () {
        it("#someCommand should send HTTP commands with specified headers", function () {
            opc._request = function (opt) {
                expect(opt).to.be.an("object");
                expect(opt.headers).to.be.an("object");
                expect(opt.headers["User-Agent"]).to.equal("OlympusCameraKit");
            };

            opc.getConnectmode(nop);
        });
    });

    /*
     *  lib/event
     */
    describe("event module", function () {
        it("#startPushevent should start an event server", function (done) {
            var expectedEventServerPort = 65000;

            server = net.createServer();

            server.listen(expectedEventServerPort, function () {
                opc._request = function (opt, cb) {
                    cb(null, { statusCode: 200 }, "");
                };

                var param = {
                    port: expectedEventServerPort
                };

                expect(opc.eventServer).to.not.exist;

                opc.startPushevent(param, function () {
                    expect(opc.eventServer).to.exist;
                    expect(opc.eventServerPort).to.equal(expectedEventServerPort);

                    done();
                });
            });
        });
    });
});
