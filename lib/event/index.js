"use strict";

var DEBUG = require("debug")("opc:event");
var net = require("net");
var parseXML = require("xml2js").parseString;

var OPC = {

    /**
     *  イベント通知を受け取るサーバを初期化する
     *
     *  @param {Function} cb
     *  @memberof OPC#
     *  @private
     */
    _initEventServer: function (cb) {
        var self = this;

        var client = self.eventServer = net.connect({
            host: this.host,
            port: this.eventServerPort
        }, function () {
            DEBUG("connected to event server");
            cb();
        });

        client.on("error", function (error) {
            console.error("event server error:", error);
        });

        client.on("data", function (buf) {
            DEBUG("BUF(HEX):", buf.toString("hex"));
            DEBUG("BUF(STR):", buf.toString("binary"));

            while (buf.length) {
                var appId = buf.readUInt8(0);
                var eventId = buf.readUInt8(1);
                var eventBodyLength = buf.readUInt16BE(2);
                var body;
                var event;

                body = buf.slice(4, 4 + eventBodyLength).toString();
                buf = buf.slice(4 + eventBodyLength);

                event = {
                    appId: appId,
                    eventId: eventId,
                    body: body
                };

                if (appId !== 2) {
                    console.error(event);
                    self.emit("error", new Error("Invalid appId " + appId));
                    return;
                }

                // イベント通知全般に対する処理
                self.emit("event", event);

                // 各イベント通知に対する処理
                switch (eventId) {
                    // バッテリー残量
                    case 0x05:
                        self.emit("battery", body);
                        break;

                    // 合焦結果通知
                    case 0x65:
                        parseXML(body, function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            self.emit("focal", res);
                        });
                        break;

                    // 撮影準備完了
                    case 0x66:
                        break;

                    // 撮影開始
                    case 0x67:
                        break;

                    // 撮影完了
                    case 0x6a:
                        break;

                    // 撮影終了処理完了
                    case 0x6b:
                        self.emit("shoot:finished");
                        break;

                    // 撮影確認画像生成完了
                    case 0x6c:
                        self.emit("image:finished");
                        break;

                    // 動画撮影停止
                    case 0x6e:
                        break;

                    // 進捗率
                    case 0x6f:
                        parseXML(body, function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            self.emit("process", res);
                        });
                        break;

                    // 記録画像転送要求
                    case 0x75:
                        self.emit("transfer:request");
                        break;

                    // レンズ状態変化
                    case 0x78:
                        break;

                    // 駆動停止通知
                    case 0x7a:
                        break;

                    // メディア状態変化
                    case 0x84:
                        break;

                    // 撮像温度変化
                    case 0x85:
                        break;

                    // 全プロテクト解除処理完了
                    case 0x86:
                        break;

                    // 動画撮影開始
                    case 0x87:
                        break;

                    // 動作モード切替完了
                    case 0xc9:
                        self.emit("cameramode", body);
                        break;

                    // カメラプロパティ取得要求
                    case 0xce:
                        parseXML(body, function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            self.emit("camprop", res);
                        });
                        break;

                    // 不明なイベント通知
                    default:
                        DEBUG("received invalid type of event");
                        break;
                }
            }
        });

        client.on("end", function () {
            DEBUG("disconnected from server");
        });
    }

};

module.exports = OPC;
