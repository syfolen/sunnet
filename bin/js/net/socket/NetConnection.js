var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sunnet;
(function (sunnet) {
    /**
     * 网络连接象
     */
    var NetConnection = /** @class */ (function (_super) {
        __extends(NetConnection, _super);
        function NetConnection(name) {
            var _this = _super.call(this) || this;
            /**
             * 是否因为连接错误而关闭
             */
            _this.$closedByError = false;
            /**
             * 连接状态
             */
            _this.$state = sunnet.NetConnectionStateEnum.DISCONNECTED;
            /**
             * 网络消息管道
             */
            _this.$pipeline = new sunnet.NetConnectionPipeline(_this);
            // 网络连接名字
            _this.$name = name;
            // 消息处理管道
            _this.$pipeline = new sunnet.NetConnectionPipeline(_this);
            return _this;
        }
        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         */
        NetConnection.prototype.connect = function (ip, port, byDog) {
            // 正常关闭连接
            if (byDog === false) {
                this.close(false);
            }
            // 被狗关闭的链接视为因网络错误而断开
            else {
                this.close(this.$closedByError);
            }
            this.$ip = ip;
            this.$port = port;
            this.$state = sunnet.NetConnectionStateEnum.CONNECTING;
            this.$socket = new Laya.Socket();
            this.$socket.endian = "LITTLE_ENDIAN";
            this.$socket.on(Laya.Event.OPEN, this, this.$onOpen);
            this.$socket.on(Laya.Event.CLOSE, this, this.$onClose);
            this.$socket.on(Laya.Event.ERROR, this, this.$onError);
            this.$socket.on(Laya.Event.MESSAGE, this, this.$onMessage);
            this.$socket.connectByUrl("ws://" + ip + ":" + port);
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> \u8BF7\u6C42\u8FDE\u63A5 ws://" + this.$ip + ":" + this.$port);
            }
        };
        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         */
        NetConnection.prototype.close = function (byError) {
            if (byError === void 0) { byError = false; }
            // 主动断网
            if (byError === false) {
                this.$closedByError = false;
            }
            // 非正常断网时，若网络己处于连接状态，则标记为异常断开
            else if (this.$state === sunnet.NetConnectionStateEnum.CONNECTED) {
                // 更新标记
                this.$closedByError = true;
                // 清除队列消息
                this.dispatchEvent(sunnet.EventKey.CLEAR_MESSAGE_QUEUE);
                // 异常断网时，需要通知
                puremvc.Facade.getInstance().sendNotification(sunnet.NotifyKey.SOCKET_STATE_CHANGE, 0);
            }
            if (this.$socket) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("Netconnection=> \u5173\u95ED\u8FDE\u63A5 ws://" + this.$ip + ":" + this.$port);
                }
                // 清除 socket 事件侦听
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);
                // 关闭 socket
                this.$socket.close();
                this.$socket = null;
            }
            // 若当前网络未处于断开状态，则派发网络断开事件
            if (this.$state != sunnet.NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(sunnet.EventKey.SOCKET_DISCONNECTED, byError);
            }
            // 非异常断网时，不需要自动重连
            if (byError === false) {
                this.dispatchEvent(sunnet.EventKey.KILL_WATCH_DOG);
            }
            this.$state = sunnet.NetConnectionStateEnum.DISCONNECTED;
        };
        /**
         * 发送二进制数据
         */
        NetConnection.prototype.send = function (buffer) {
            if (this.$state === sunnet.NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(buffer);
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        };
        /**
         * 发送protobuf数据
         */
        NetConnection.prototype.sendPB = function (cmd, data, ip, port) {
            this.$pipeline.send(cmd, null, ip, port);
        };
        /**
         * 发送二进制数据
         */
        NetConnection.prototype.sendBytes = function (cmd, buffer, ip, port) {
            this.$pipeline.send(cmd, buffer, ip, port);
        };
        /**
         * 连接成功
         */
        NetConnection.prototype.$onOpen = function () {
            this.$state = sunnet.NetConnectionStateEnum.CONNECTED;
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }
            // 若是异常断网成功重连，则需要通知网络状态变更
            if (this.$closedByError === true) {
                this.$closedByError = false;
                puremvc.Facade.getInstance().sendNotification(sunnet.NotifyKey.SOCKET_STATE_CHANGE, 1);
            }
            // 网络重连成功
            this.dispatchEvent(sunnet.EventKey.SOCKET_CONNECTED);
        };
        /**
         * 连接断开
         */
        NetConnection.prototype.$onClose = function () {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        };
        /**
         * 连接异常
         */
        NetConnection.prototype.$onError = function () {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常断开！");
            }
            this.close(true);
        };
        /**
         * 响应数据
         */
        NetConnection.prototype.$onMessage = function (event) {
            this.$pipeline.recv(null, null, null);
        };
        Object.defineProperty(NetConnection.prototype, "name", {
            /**
             * 网络连接名称
             */
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "ip", {
            /**
             * 服务器地址
             */
            get: function () {
                return this.$ip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "port", {
            /**
             * 服务器端口
             */
            get: function () {
                return this.$port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "state", {
            /**
             * 网络连接状态
             */
            get: function () {
                return this.$state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "input", {
            /**
             * 数据接收缓冲区
             */
            get: function () {
                return this.$socket.input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "output", {
            /**
             * 数据发送缓冲区
             */
            get: function () {
                return this.$socket.output;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "pipeline", {
            /**
             * 获取消息管道对象
             */
            get: function () {
                return this.$pipeline;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 包头长度
         */
        NetConnection.HEAD_LENGTH = 28;
        return NetConnection;
    }(suncom.EventSystem));
    sunnet.NetConnection = NetConnection;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnection.js.map