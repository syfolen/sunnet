"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var sunnet;
(function (sunnet) {
    var HeartbeatCommandEnum;
    (function (HeartbeatCommandEnum) {
        /**
         * 请求
         */
        HeartbeatCommandEnum[HeartbeatCommandEnum["REQUEST"] = -1] = "REQUEST";
        /**
         * 回复
         */
        HeartbeatCommandEnum[HeartbeatCommandEnum["RESPONSE"] = -2] = "RESPONSE";
    })(HeartbeatCommandEnum = sunnet.HeartbeatCommandEnum || (sunnet.HeartbeatCommandEnum = {}));
    /**
     * 网络状态枚举
     */
    var NetConnectionStateEnum;
    (function (NetConnectionStateEnum) {
        /**
         * 己连接
         */
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        /**
         * 正在连接
         */
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        /**
         * 己断开
         */
        NetConnectionStateEnum[NetConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(NetConnectionStateEnum = sunnet.NetConnectionStateEnum || (sunnet.NetConnectionStateEnum = {}));
    var EventKey = /** @class */ (function () {
        function EventKey() {
        }
        // 网络己连接
        EventKey.SOCKET_CONNECTED = "sunnet.EventKey.SOCKET_CONNECTED";
        // 网络己断开
        EventKey.SOCKET_DISCONNECTED = "sunnet.EventKey.SOCKET_DISCONNECTED";
        // 杀死检测狗
        EventKey.KILL_WATCH_DOG = "sunnet.EventKey.KILL_WATCH_DOG";
        // 清空未发送的网络消息队列
        EventKey.CLEAR_MESSAGE_QUEUE = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
        return EventKey;
    }());
    sunnet.EventKey = EventKey;
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
             * Socket对象
             */
            _this.$socket = null;
            /**
             * 连接状态
             */
            _this.$state = NetConnectionStateEnum.DISCONNECTED;
            /**
             * 网络消息管道
             */
            _this.$pipeline = new NetConnectionPipeline(_this);
            // 网络连接名字
            _this.$name = name;
            // 消息处理管道
            _this.$pipeline = new NetConnectionPipeline(_this);
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
            this.$state = NetConnectionStateEnum.CONNECTING;
            this.$socket = new Laya.Socket();
            this.$socket.endian = Laya.Byte.LITTLE_ENDIAN;
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
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                // 更新标记
                this.$closedByError = true;
                // 清除队列消息
                this.dispatchEvent(EventKey.CLEAR_MESSAGE_QUEUE);
                // 异常断网时，需要通知
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 0);
            }
            if (this.$socket !== null) {
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
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(EventKey.SOCKET_DISCONNECTED, byError);
            }
            // 非异常断网时，不需要自动重连
            if (byError === false) {
                this.dispatchEvent(EventKey.KILL_WATCH_DOG);
            }
            this.$state = NetConnectionStateEnum.DISCONNECTED;
        };
        /**
         * 发送二进制数据
         */
        NetConnection.prototype.send = function (bytes) {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        };
        /**
         * 发送数据
         */
        NetConnection.prototype.flush = function () {
            this.$socket.flush();
        };
        /**
         * 发送二进制数据
         */
        NetConnection.prototype.sendBytes = function (cmd, bytes, ip, port) {
            if (bytes === void 0) { bytes = null; }
            this.$pipeline.send(cmd, bytes, ip, port);
        };
        /**
         * 连接成功
         */
        NetConnection.prototype.$onOpen = function () {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }
            // 若是异常断网成功重连，则需要通知网络状态变更
            if (this.$closedByError === true) {
                this.$closedByError = false;
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 1);
            }
            // 网络重连成功
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);
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
    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     */
    var NetConnectionInterceptor = /** @class */ (function () {
        function NetConnectionInterceptor(connection) {
            this.$connection = connection;
            this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
        }
        /**
         * 销毁拦截器
         */
        NetConnectionInterceptor.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        };
        /**
         * 网络连接成功
         */
        NetConnectionInterceptor.prototype.$onConnected = function () {
        };
        /**
         * 网络连接断开
         */
        NetConnectionInterceptor.prototype.$onDisconnected = function (byError) {
        };
        /**
         * 数据发送拦截接口
         */
        NetConnectionInterceptor.prototype.send = function (cmd, bytes, ip, port) {
            return [cmd, bytes, ip, port];
        };
        /**
         * 数据接收拦截接口
         */
        NetConnectionInterceptor.prototype.recv = function (cmd, srvId, bytes, data) {
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionInterceptor;
    }());
    sunnet.NetConnectionInterceptor = NetConnectionInterceptor;
    /**
     * 消息处理管道
     * 此类以责任链模式处理即将发送或己接收的网络数据，专门为 core.NetConnection 服务
     */
    var NetConnectionPipeline = /** @class */ (function (_super) {
        __extends(NetConnectionPipeline, _super);
        function NetConnectionPipeline() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 拦截器列表
             */
            _this.$items = [];
            return _this;
        }
        /**
         * 新增责任处理者
         */
        NetConnectionPipeline.prototype.add = function (arg0, arg1) {
            var item = new NetConnectionPipelineItem();
            item.type = typeof arg0 === "string" ? arg0 : null;
            item.interceptor = typeof arg0 !== "string" ? new arg0(this.$connection) : new arg1(this.$connection);
            this.$items.push(item);
        };
        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        NetConnectionPipeline.prototype.remove = function (cls) {
            for (var i = 0; i < this.$items.length; i++) {
                var interceptor = this.$items[i].interceptor;
                if (interceptor instanceof cls) {
                    this.$items.splice(i, 1);
                    interceptor.destroy();
                    break;
                }
            }
        };
        /**
         * 数据接收拦截接口
         */
        NetConnectionPipeline.prototype.recv = function (cmd, srvId, bytes, data) {
            var params = [cmd, srvId, bytes, data];
            // 数据将保持传递，直至处理完毕，或返回 null
            for (var i = 0; i < this.$items.length; i++) {
                var item = this.$items[i];
                if (item.type === "send") {
                    continue;
                }
                var interceptor = item.interceptor;
                params = interceptor.recv.apply(interceptor, params);
                if (params === null) {
                    return;
                }
            }
            // 消息解析失败
            if (params[3] === void 0) {
                if (suncom.Global.debugMode) {
                    suncom.Logger.warn("NetConnectionPipeline=> decode \u610F\u5916\u7684\u6307\u4EE4 cmd:" + params[0].toString(16) + ", buff:" + (params[1] ? "[Object]" : "null"));
                }
            }
        };
        /**
         * 数据发送拦截接口
         */
        NetConnectionPipeline.prototype.send = function (cmd, bytes, ip, port) {
            for (var i = this.$items.length - 1; i > -1; i--) {
                // 数据将保持传递，直至处理完毕
                var item = this.$items[i];
                if (item.type === "recv") {
                    continue;
                }
                var interceptor = item.interceptor;
                var res = interceptor.send.call(interceptor, cmd, bytes, ip, port);
                if (res === null) {
                    return null;
                }
            }
            return null;
        };
        return NetConnectionPipeline;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionPipeline = NetConnectionPipeline;
    /**
     * 网络消息管道拦截器
     */
    var NetConnectionPipelineItem = /** @class */ (function () {
        function NetConnectionPipelineItem() {
        }
        return NetConnectionPipelineItem;
    }());
    sunnet.NetConnectionPipelineItem = NetConnectionPipelineItem;
    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    var NetConnectionProtobufDecoder = /** @class */ (function (_super) {
        __extends(NetConnectionProtobufDecoder, _super);
        function NetConnectionProtobufDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 数据接收拦截
         */
        NetConnectionProtobufDecoder.prototype.recv = function (cmd, srvId, bytes, data) {
            // 若 data 不为 void 0 ，则说明己处理
            if (data !== void 0) {
                return [cmd, srvId, bytes, data];
            }
            // 消息解析失败时返回 null
            var newData = this.$decode(cmd, bytes);
            if (newData === null) {
                return [cmd, srvId, bytes, data];
            }
            suncom.Logger.log("消息解析成功 ==> " + JSON.stringify(newData));
            if (newData === bytes) {
                throw Error("请勿返回未处理的消息！！！");
            }
            // 消息解析成功，需要将cmd转化为name才能让消息进入队列
            var protocal = ProtobufManager.getInstance().getProtocalByCommand(cmd);
            suncore.System.addSocketMessage(protocal.Name, newData);
            // 消息解析成功
            return [cmd, srvId, bytes, newData];
        };
        return NetConnectionProtobufDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionProtobufDecoder = NetConnectionProtobufDecoder;
    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     */
    var NetConnectionWatchDog = /** @class */ (function (_super) {
        __extends(NetConnectionWatchDog, _super);
        function NetConnectionWatchDog(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, _this.$onKillWatchDog, _this);
            return _this;
        }
        /**
         * 销毁拦截器
         */
        NetConnectionWatchDog.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            _super.prototype.destroy.call(this);
        };
        /**
         * 当网络连接被建立时，需要移除检测狗
         */
        NetConnectionWatchDog.prototype.$onConnected = function () {
            this.$onKillWatchDog();
        };
        /**
         * 网络连接断开回调，若因异常断开，则在1000毫秒后开始重连
         */
        NetConnectionWatchDog.prototype.$onDisconnected = function (byError) {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("NetConnectionWatchDog=> \u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C1000\u6BEB\u79D2\u540E\u91CD\u8FDE\uFF01");
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 1000, this.$onDoingConnect, this);
            }
        };
        /**
         * 杀死检测狗
         */
        NetConnectionWatchDog.prototype.$onKillWatchDog = function () {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        };
        /**
         * 重连
         */
        NetConnectionWatchDog.prototype.$onDoingConnect = function () {
            // 只有在网络处于未连接状态时才会进行重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("检测狗不能正常工作，因为：", "state:" + suncom.Common.convertEnumToString(this.$connection.state, NetConnectionStateEnum));
                }
            }
        };
        return NetConnectionWatchDog;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionWatchDog = NetConnectionWatchDog;
    var NotifyKey = /** @class */ (function () {
        function NotifyKey() {
        }
        // 网络状态变化 
        NotifyKey.SOCKET_STATE_CHANGE = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
        return NotifyKey;
    }());
    sunnet.NotifyKey = NotifyKey;
    /**
     * protobuf管理类
     */
    var ProtobufManager = /** @class */ (function () {
        function ProtobufManager() {
            /**
             * Protobuf定义
             */
            this.$proto = null;
            /**
             * 命令集合
             */
            this.$commands = null;
            /**
             * 协议信息集合
             */
            this.$protocals = null;
        }
        ProtobufManager.getInstance = function () {
            return ProtobufManager.instance;
        };
        /**
         * 构建protobuf
         */
        ProtobufManager.prototype.buildProto = function (url) {
            var root = new Laya.Browser.window.protobuf.Root();
            var protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        };
        /**
         * 构建协议信息
         */
        ProtobufManager.prototype.buildProtocal = function (url) {
            var json = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        };
        /**
         * 根据编号获取协议信息
         */
        ProtobufManager.prototype.getProtocalByCommand = function (cmd) {
            return this.$protocals[cmd] || null;
        };
        /**
         * 根据名字获取协议信息
         */
        ProtobufManager.prototype.getProtocalByName = function (name) {
            for (var i = 0; i < this.$commands.length; i++) {
                var command = this.$commands[i];
                var protocal = this.getProtocalByCommand(command);
                if (protocal === null) {
                    continue;
                }
                if (protocal.Name === name) {
                    return protocal;
                }
            }
            return null;
        };
        /**
         * 获取protobuf定义
         */
        ProtobufManager.prototype.getProtoClass = function (name) {
            return this.$proto.lookup(name);
        };
        /**
         * 根据protobuf枚举定义
         */
        ProtobufManager.prototype.getProtoEnum = function (name) {
            return this.getProtoClass(name).values;
        };
        /**
         * 编码
         */
        ProtobufManager.prototype.encode = function (name, data) {
            return this.getProtoClass(name).encode(data).finish();
        };
        /**
         * 解码
         */
        ProtobufManager.prototype.decode = function (name, bytes) {
            return this.getProtoClass(name).decode(bytes);
        };
        /**
         * 单例对象
         */
        ProtobufManager.instance = new ProtobufManager();
        return ProtobufManager;
    }());
    sunnet.ProtobufManager = ProtobufManager;
    var NetConnectionCreator = /** @class */ (function (_super) {
        __extends(NetConnectionCreator, _super);
        function NetConnectionCreator(connection) {
            var _this = _super.call(this, connection) || this;
            /**
             * 等待发送的消息队列
             */
            _this.$messages = [];
            _this.$connection.addEventListener(EventKey.CLEAR_MESSAGE_QUEUE, _this.$onClearMessageQueue, _this);
            return _this;
        }
        NetConnectionCreator.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
            _super.prototype.destroy.call(this);
        };
        /**
         * 网络连接成功回调
         */
        NetConnectionCreator.prototype.$onConnected = function () {
            while (this.$messages.length) {
                var data = this.$messages.pop();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        };
        /**
         * 清除所有网络消息缓存
         */
        NetConnectionCreator.prototype.$onClearMessageQueue = function () {
            this.$messages.length = 0;
        };
        /**
         * 是否需要重连
         */
        NetConnectionCreator.prototype.$needCreate = function (ip, port) {
            // 若网络未连接，则需要重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            // 若网络己连接
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                // 若IP和PORT有效且与请求的数据不一致，则需要重连
                if (ip !== void 0 && port !== void 0 && this.$connection.ip !== ip && this.$connection.port !== port) {
                    return true;
                }
            }
            // 否则不需要重连
            return false;
        };
        /**
         * 数据发送拦截接口
         */
        NetConnectionCreator.prototype.send = function (cmd, bytes, ip, port) {
            if (this.$needCreate(ip, port) == false) {
                // 网络尚未成功连接
                if (this.$connection.state === NetConnectionStateEnum.CONNECTING) {
                    return null;
                }
                return [cmd, bytes, ip, port];
            }
            this.$connection.connect(ip, port, false);
            var data = {
                cmd: cmd,
                bytes: bytes,
                ip: ip,
                port: port
            };
            this.$messages.push(data);
            return null;
        };
        return NetConnectionCreator;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionCreator = NetConnectionCreator;
    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    var NetConnectionDecoder = /** @class */ (function (_super) {
        __extends(NetConnectionDecoder, _super);
        function NetConnectionDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 数据接收拦截接口
         */
        NetConnectionDecoder.prototype.recv = function (cmd, srvId, bytes, data) {
            var input = this.$connection.input;
            cmd = input.getUint16();
            srvId = input.getUint16();
            var buffer = input.buffer.slice(input.pos);
            input.pos += buffer.byteLength;
            bytes = new Uint8Array(buffer);
            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + bytes.byteLength);
                }
            }
            // 清除缓冲区中的数据
            // input.clear();
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionDecoder = NetConnectionDecoder;
    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    var NetConnectionEncoder = /** @class */ (function (_super) {
        __extends(NetConnectionEncoder, _super);
        function NetConnectionEncoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 拦截数据
         */
        NetConnectionEncoder.prototype.send = function (cmd, bytes, ip, port) {
            var output = this.$connection.output;
            // 写入包头
            output.writeUint16(cmd);
            output.writeUint16(0);
            // 写入包体，这里实际上可以直接写入Uint8Array
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();
            if (cmd === HeartbeatCommandEnum.REQUEST) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString(16) + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
                }
            }
            else if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString(16) + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
            }
            return null;
        };
        return NetConnectionEncoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionEncoder = NetConnectionEncoder;
    /**
     * 心跳检测器
     */
    var NetConnectionHeartBeat = /** @class */ (function (_super) {
        __extends(NetConnectionHeartBeat, _super);
        function NetConnectionHeartBeat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 当网络成功连接时，开始心跳
         */
        NetConnectionHeartBeat.prototype.$onConnected = function () {
            this.$lastRecvTime = this.$lastSendTime = new Date().valueOf();
            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        /**
         * 连接断开后不再发送心跳
         */
        NetConnectionHeartBeat.prototype.$onDisconnected = function () {
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        /**
         * 心跳验证
         */
        NetConnectionHeartBeat.prototype.$onFrameEnter = function () {
            var timestamp = suncore.System.engine.getTime();
            // 心跳未回复
            if (this.$lastRecvTime < this.$lastSendTime) {
                // 若时间己超过6秒，则视为网络掉线
                if (timestamp - this.$lastSendTime > 6000) {
                    // 更新最新接收消息的时间，防止任务连续被派发
                    this.$lastRecvTime = this.$lastSendTime;
                    // 强行关闭网络连接
                    this.$connection.close(true);
                }
            }
            // 若心跳己回复，则5秒后再次发送心跳
            else if (timestamp - this.$lastSendTime > 5000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                // 记录心跳被发送的时间
                this.$lastSendTime = timestamp;
                // 发送心跳
                this.$connection.sendBytes(HeartbeatCommandEnum.REQUEST);
            }
        };
        /**
         * 数据接收拦截接口
         */
        NetConnectionHeartBeat.prototype.recv = function (cmd, srvId, bytes, data) {
            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                // 记录心跳响应的时间
                this.$lastRecvTime = suncore.System.engine.getTime();
            }
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionHeartBeat;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionHeartBeat = NetConnectionHeartBeat;
})(sunnet = exports.sunnet || (exports.sunnet = {}));
//# sourceMappingURL=sunnet.js.map