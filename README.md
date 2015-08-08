[![Build Status](https://travis-ci.org/oimou/opc-js.svg)](https://travis-ci.org/oimou/opc-js)

# OPC.js
JS library for [Open Platform Camera](https://opc.olympus-imaging.com/).

## Usage

```javascript
var OPC = require("opc-js");
var opc = new OPC();

opc.getConnectmode(function (err, resp, body) {
    // ...
});
```

## API

See [APIDOC.md](APIDOC.md).

## References

- [CAMERA KIT FOR DEVELOPERS | オリンパス OPC Hack & Make Project](https://opc.olympus-imaging.com/tools/sdk/)
