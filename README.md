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

### References

- [CAMERA KIT FOR DEVELOPERS | オリンパス OPC Hack & Make Project](https://opc.olympus-imaging.com/tools/sdk/)
