"use strict";

var expect = require("chai").expect;

describe("OPC", function () {
    var net = require("net");
    var OPC = require("../lib/opc");
    var nop = function () {};
    var opc;

    beforeEach(function () {
        opc = new OPC();
        opc.host = "localhost";
    });

    it("should send HTTP commands with specified headers", function () {
        opc._request = function (opt) {
            expect(opt).to.be.an("object");
            expect(opt.headers).to.be.an("object");
            expect(opt.headers["User-Agent"]).to.equal("OlympusCameraKit");
        };

        opc.getConnectmode(nop);
    });

    it("should start an event server on calling startPushevent", function (done) {
        var server = net.createServer();
        var expectedEventServerPort = 65000;

        server.listen(expectedEventServerPort, function () {
            opc._request = function (opt, cb) {
                cb();
            };

            var param = {
                port: expectedEventServerPort
            };

            expect(opc.eventServer).to.not.exist;

            opc.startPushevent(param, function () {
                expect(opc.eventServer).to.exist;
                expect(opc.eventServerPort).to.equal(expectedEventServerPort);

                server.close();
                done();
            });
        });
    });
});
