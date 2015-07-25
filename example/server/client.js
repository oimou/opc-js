"use strict";

var socket = io.connect();
var button = document.querySelector("#takemotion");
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

socket.on("connect", function () {
    console.log("connected");
});

socket.on("liveview:frame", function (data) {
    var img = new Image();
    var jpgStr = arrayBufferToBase64(data.jpg);

    img.src = "data:image/png;base64," + jpgStr;
    ctx.drawImage(img, 0, 0);
    img = null;
});

button.addEventListener("click", function () {
    button.disabled = true;
    socket.emit("takemotion:start");
}, false);

socket.on("takemotion:finish", function () {
    button.disabled = false;
});

/**
 * arrayBufferToBase64
 *
 * @param {ArrayBuffer} buffer
 * @return {String}
 */
function arrayBufferToBase64( buffer ) {
    var binary = ''
    var bytes = new Uint8Array( buffer )
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] )
    }
    return window.btoa( binary );
}
