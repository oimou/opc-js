"use strict";

var DEBUG = require("debug")("opc:command");
var dgram = require("dgram");

var OPC = {

    /*
     *  システム関連
     */
    /**
     *  接続モード取得
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getConnectmode: function (cb) {
        DEBUG("command getConnectmode");
        this._command("GET", "/get_connectmode.cgi", null, cb);
    },

    /**
     *  動作モード切り替え
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    switchCameramode: function (param, cb) {
        DEBUG("command switchCameramode");
        this._command("GET", "/switch_cameramode.cgi", param, cb);
    },

    /**
     *  コマンド受付元取得
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getCommpath: function (cb) {
        DEBUG("command getCommpath");
        this._command("GET", "/get_commpath.cgi", null, cb);
    },

    /**
     *  コマンド受付元切り替え
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    switchCommpath: function (param, cb) {
        DEBUG("command switchCommpath");
        this._command("GET", "/switch_commpath.cgi", param, cb);
    },

    /**
     *  電源OFF
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execPwoff: function (cb) {
        DEBUG("command execPwoff");
        this._command("GET", "/exec_pwoff.cgi", null, cb);
    },

    /**
     *  イベント通知開始
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    startPushevent: function (param, cb) {
        DEBUG("command startPushevent");

        var self = this;

        this.eventServerPort = param.port;
        this._command(
            "GET",
            "/start_pushevent.cgi",
            param,
            function (err) {
                if (err) {
                    cb(err);
                    return;
                }

                self._initEventServer(cb);
            }
        );
    },

    /**
     *  イベント通知終了
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    stopPushevent: function (cb) {
        DEBUG("command stopPushevent");

        if (this.eventServer && this.eventServer.end) {
            this.eventServer.end();
        }

        this._command("GET", "/stop_pushevent.cgi", null, cb);
    },

    /**
     *  カメラ状態取得
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getState: function (cb) {
        DEBUG("command getState");

        this._command("GET", "/get_state.cgi", null, cb);
    },

    /*
     *  カメラプロパティ操作
     */
    /**
     *  カメラプロパティ取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getCamprop: function (param, cb) {
        DEBUG("command getCamprop");

        this._command("GET", "/get_camprop.cgi", param, cb);
    },

    /**
     *  カメラプロパティ設定
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    setCamprop: function (param, cb) {
        DEBUG("command setCamprop");

        this._command("POST", "/set_camprop.cgi", param, cb);
    },

    /*
     *  再生・転送
     */
    /**
     *  リサイズ画像取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getResizeimg: function (param, cb) {
        DEBUG("command getResizeimg");

        this._command("GET", "/get_resizeimg.cgi", param, cb);
    },

    /**
     *  画像リスト取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getImglist: function (param, cb) {
        DEBUG("command getImglist");

        this._command("GET", "/get_imglist.cgi", param, cb);
    },

    /**
     *  デバイス用再生画像取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getScreennail: function (param, cb) {
        DEBUG("command getScreennail");

        this._command("GET", "/get_screennail.cgi", param, cb);
    },

    /**
     *  動画ファイル情報取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getMovfileinfo: function (param, cb) {
        DEBUG("command getMovfileinfo");

        this._command("GET", "/get_movfileinfo.cgi", param, cb);
    },

    /**
     *  静止画ファイル情報取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getImageinfo: function (param, cb) {
        DEBUG("command getImageinfo");

        this._command("GET", "/get_imageinfo.cgi", param, cb);
    },

    /**
     *  サムネイル画像取得
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    getThumbnail: function (param, cb) {
        DEBUG("command getThumbnail");

        this._command("GET", "/get_thumbnail.cgi", param, cb);
    },

    /**
     *  記録画像転送
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execStoreimage: function (cb) {
        DEBUG("command execStoreimage");

        this._command("GET", "/exec_storeimage.cgi", null, cb);
    },

    /*
     *  撮影
     */
    /**
     *  撮影制御
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execTakemotion: function (param, cb) {
        DEBUG("command execTakemotion");

        this._command("GET", "/exec_takemotion.cgi", param, cb);
    },

    /**
     *  撮影補助
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execTakemisc: function (param, cb) {
        DEBUG("command execTakemisc");

        var self = this;

        if (param.com === "startliveview") {
            var port = param.port;
            var server = this.liveviewServer = dgram.createSocket("udp4");

            server.on("message", function (msg, rinfo) {
                var rtpHeaderByteLength = 12;
                var extensionHeaderByteLength = 4;
                var extensionBit;
                var hasExtensionHeader;
                var jpgChunk;

                extensionBit = parseInt(msg[0].toString(2)[3], 2);

                hasExtensionHeader = (extensionBit === 1);

                if (hasExtensionHeader) {
                    self.emit("liveview:frame", self._jpgBuffer);

                    self._jpgBuffer = new Buffer(0);

                    var extensionWordLength = msg.readUInt16BE(14);
                    var extensionByteLength = extensionWordLength * 4;

                    jpgChunk = msg.slice(rtpHeaderByteLength + extensionByteLength + extensionHeaderByteLength);
                } else {
                    jpgChunk = msg.slice(rtpHeaderByteLength);
                }

                self._jpgBuffer = Buffer.concat([self._jpgBuffer, jpgChunk]);

                // イベント発火
                self.emit("liveview:message", msg, rinfo);
            });

            server.on("listening", function () {
                self.emit("liveview:listening");
                self._command("GET", "/exec_takemisc.cgi", param, cb);
            });

            server.bind(port);
        } else {
            this._command("GET", "/exec_takemisc.cgi", param, cb);
        }
    },

    /*
     *  保守
     */
    /**
     *  1コマ消去
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execErase: function (param, cb) {
        DEBUG("command execErase");

        this._command("GET", "/exec_erase.cgi", param, cb);
    },

    /**
     *  全コマプロテクト解除
     *
     *  @param {Function} cb
     *  @memberof OPC#
     */
    releaseAllprotect: function (cb) {
        DEBUG("command releaseAllprotect");

        this._command("GET", "/release_allprotect.cgi", null, cb);
    },

    /**
     *  1コマプロテクト設定・解除
     *
     *  @param {Object} param
     *  @param {Function} cb
     *  @memberof OPC#
     */
    execProtect: function (param, cb) {
        DEBUG("command execProtect");

        this._command("GET", "/exec_protect.cgi", param, cb);
    }
};

module.exports = OPC;
