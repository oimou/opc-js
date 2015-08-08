"use strict";

var util = require("util");
var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

/**
 *  OPC
 *
 *  @class OPC
 */
function OPC() {
    this.host = "192.168.0.10";
    this.commandServerPort = 80;
    this.eventServer = null;
    this.eventServerPort = null;
    this.liveviewServer = null;
    this._jpgBuffer = new Buffer(0);
}

util.inherits(OPC, EventEmitter);

_.extend(OPC.prototype, require("./core"));
_.extend(OPC.prototype, require("./event"));
_.extend(OPC.prototype, require("./ble"));
_.extend(OPC.prototype, require("./command"));

module.exports = OPC;
