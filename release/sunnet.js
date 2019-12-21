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
    var HttpResStatus;
    (function (HttpResStatus) {
        HttpResStatus[HttpResStatus["OK"] = 0] = "OK";
        HttpResStatus[HttpResStatus["IO_ERROR"] = -1] = "IO_ERROR";
        HttpResStatus[HttpResStatus["PARSE_ERROR"] = -2] = "PARSE_ERROR";
    })(HttpResStatus = sunnet.HttpResStatus || (sunnet.HttpResStatus = {}));
    var MsgQIdEnum;
    (function (MsgQIdEnum) {
        MsgQIdEnum[MsgQIdEnum["NET_SEND_DATA"] = 1] = "NET_SEND_DATA";
        MsgQIdEnum[MsgQIdEnum["NET_RECV_DATA"] = 2] = "NET_RECV_DATA";
    })(MsgQIdEnum = sunnet.MsgQIdEnum || (sunnet.MsgQIdEnum = {}));
    var NetConnectionStateEnum;
    (function (NetConnectionStateEnum) {
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        NetConnectionStateEnum[NetConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(NetConnectionStateEnum = sunnet.NetConnectionStateEnum || (sunnet.NetConnectionStateEnum = {}));
    var NetConnection = (function (_super) {
        __extends(NetConnection, _super);
        function NetConnection(name) {
            var _this = _super.call(this, suncore.MsgQModEnum.NET) || this;
            _this.$closedByError = false;
            _this.$socket = null;
            _this.$state = NetConnectionStateEnum.DISCONNECTED;
            _this.$pipeline = null;
            _this.$dispatcher = null;
            _this.$name = name;
            _this.$pipeline = new NetConnectionPipeline(_this);
            _this.$dispatcher = new suncom.EventSystem();
            return _this;
        }
        NetConnection.prototype.connect = function (ip, port, byDog) {
            if (byDog === false) {
                this.close(false);
            }
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
        NetConnection.prototype.close = function (byError) {
            if (byError === void 0) { byError = false; }
            if (byError === false) {
                this.$closedByError = false;
            }
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$closedByError = true;
                this.dispatchEvent(EventKey.CLEAR_MESSAGE_QUEUE);
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 1);
            }
            if (this.$socket !== null) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("Netconnection=> \u5173\u95ED\u8FDE\u63A5 ws://" + this.$ip + ":" + this.$port);
                }
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);
                this.$socket.close();
                this.$socket = null;
            }
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(EventKey.SOCKET_DISCONNECTED, byError);
            }
            if (byError === false) {
                this.dispatchEvent(EventKey.KILL_WATCH_DOG);
            }
            this.$state = NetConnectionStateEnum.DISCONNECTED;
        };
        NetConnection.prototype.send = function (bytes) {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        };
        NetConnection.prototype.flush = function () {
            this.$socket.flush();
        };
        NetConnection.prototype.sendBytes = function (cmd, bytes, ip, port) {
            if (bytes === void 0) { bytes = null; }
            this.$pipeline.send(cmd, bytes, ip, port);
        };
        NetConnection.prototype.$onOpen = function () {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }
            if (this.$closedByError === true) {
                this.$closedByError = false;
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 0);
            }
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);
        };
        NetConnection.prototype.$onClose = function () {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        };
        NetConnection.prototype.$onError = function () {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常断开！");
            }
            this.close(true);
        };
        NetConnection.prototype.$onMessage = function (event) {
            this.$pipeline.recv(null, null, null);
        };
        NetConnection.prototype.dispatchCancel = function () {
            this.$dispatcher.dispatchCancel();
        };
        NetConnection.prototype.dispatchEvent = function (type, args, cancelable) {
            this.$dispatcher.dispatchEvent(type, args, cancelable);
        };
        NetConnection.prototype.addEventListener = function (type, method, caller, receiveOnce, priority) {
            this.$dispatcher.addEventListener(type, method, caller, receiveOnce, priority);
        };
        NetConnection.prototype.removeEventListener = function (type, method, caller) {
            this.$dispatcher.removeEventListener(type, method, caller);
        };
        Object.defineProperty(NetConnection.prototype, "name", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "ip", {
            get: function () {
                return this.$ip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "port", {
            get: function () {
                return this.$port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "state", {
            get: function () {
                return this.$state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "input", {
            get: function () {
                var socket = this.$socket || null;
                if (socket === null) {
                    return null;
                }
                return this.$socket.input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "output", {
            get: function () {
                var socket = this.$socket || null;
                if (socket === null) {
                    return null;
                }
                return this.$socket.output;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "pipeline", {
            get: function () {
                return this.$pipeline;
            },
            enumerable: true,
            configurable: true
        });
        NetConnection.HEAD_LENGTH = 28;
        return NetConnection;
    }(puremvc.Notifier));
    sunnet.NetConnection = NetConnection;
    var NetConnectionInterceptor = (function (_super) {
        __extends(NetConnectionInterceptor, _super);
        function NetConnectionInterceptor(connection) {
            var _this = _super.call(this, suncore.MsgQModEnum.NET) || this;
            _this.$connection = connection;
            _this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, _this.$onConnected, _this);
            _this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, _this.$onDisconnected, _this);
            return _this;
        }
        NetConnectionInterceptor.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        };
        NetConnectionInterceptor.prototype.$onConnected = function () {
        };
        NetConnectionInterceptor.prototype.$onDisconnected = function (byError) {
        };
        NetConnectionInterceptor.prototype.send = function (cmd, bytes, ip, port) {
            return [cmd, bytes, ip, port];
        };
        NetConnectionInterceptor.prototype.recv = function (cmd, srvId, bytes, data) {
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionInterceptor;
    }(puremvc.Notifier));
    sunnet.NetConnectionInterceptor = NetConnectionInterceptor;
    var NetConnectionPipeline = (function () {
        function NetConnectionPipeline(connection) {
            this.$items = [];
            this.$connection = connection;
        }
        NetConnectionPipeline.prototype.destroy = function () {
            while (this.$items.length > 0) {
                var item = this.$items.shift();
                item.interceptor.destroy();
            }
        };
        NetConnectionPipeline.prototype.add = function (arg0, arg1) {
            var item = new NetConnectionPipelineItem();
            item.type = typeof arg0 === "string" ? arg0 : null;
            item.interceptor = typeof arg0 !== "string" ? new arg0(this.$connection) : new arg1(this.$connection);
            this.$items.push(item);
        };
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
        NetConnectionPipeline.prototype.recv = function (cmd, srvId, bytes, data) {
            var params = [cmd, srvId, bytes, data];
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
            if (params[3] === void 0) {
                if (suncom.Global.debugMode) {
                    suncom.Logger.warn("NetConnectionPipeline=> decode \u610F\u5916\u7684\u6307\u4EE4 cmd:" + params[0].toString() + ", buff:" + (params[1] ? "[Object]" : "null"));
                }
            }
        };
        NetConnectionPipeline.prototype.send = function (cmd, bytes, ip, port) {
            for (var i = this.$items.length - 1; i > -1; i--) {
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
    }());
    sunnet.NetConnectionPipeline = NetConnectionPipeline;
    var NetConnectionPipelineItem = (function () {
        function NetConnectionPipelineItem() {
        }
        return NetConnectionPipelineItem;
    }());
    sunnet.NetConnectionPipelineItem = NetConnectionPipelineItem;
    var NetConnectionProtobufDecoder = (function (_super) {
        __extends(NetConnectionProtobufDecoder, _super);
        function NetConnectionProtobufDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionProtobufDecoder.prototype.recv = function (cmd, srvId, bytes, data) {
            if (data !== void 0) {
                return [cmd, srvId, bytes, data];
            }
            var newData = this.$decode(cmd, bytes);
            if (newData === null) {
                return [cmd, srvId, bytes, data];
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("消息解析成功 ==> " + JSON.stringify(newData));
            }
            if (newData === bytes) {
                throw Error("请勿返回未处理的消息！！！");
            }
            var msg = {
                id: cmd,
                name: null,
                data: newData
            };
            suncore.MsgQ.send(suncore.MsgQModEnum.NET, suncore.MsgQModEnum.NET, MsgQIdEnum.NET_RECV_DATA, msg);
            return [cmd, srvId, bytes, newData];
        };
        return NetConnectionProtobufDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionProtobufDecoder = NetConnectionProtobufDecoder;
    var NetConnectionWatchDog = (function (_super) {
        __extends(NetConnectionWatchDog, _super);
        function NetConnectionWatchDog(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$retryCount = 0;
            _this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, _this.$onKillWatchDog, _this);
            return _this;
        }
        NetConnectionWatchDog.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            _super.prototype.destroy.call(this);
        };
        NetConnectionWatchDog.prototype.$onConnected = function () {
            this.$retryCount = 0;
            this.$onKillWatchDog();
        };
        NetConnectionWatchDog.prototype.$onDisconnected = function (byError) {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("NetConnectionWatchDog=> \u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C" + Config.TCP_RETRY_DELAY + "\u6BEB\u79D2\u540E\u91CD\u8FDE\uFF01");
                }
                if (this.$retryCount >= Config.TCP_MAX_RETRY_TIME) {
                    this.$retryCount = 0;
                    this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 2);
                    return;
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, Config.TCP_RETRY_DELAY, this.$onDoingConnect, this);
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_ANOMALY, this.$retryCount);
            }
        };
        NetConnectionWatchDog.prototype.$onKillWatchDog = function () {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        };
        NetConnectionWatchDog.prototype.$onDoingConnect = function () {
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$retryCount++;
                this.facade.sendNotification(NotifyKey.SOCKET_RETRY_CONNECT, this.$retryCount);
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
    var ProtobufManager = (function () {
        function ProtobufManager() {
            this.$proto = null;
            this.$commands = null;
            this.$protocals = null;
        }
        ProtobufManager.getInstance = function () {
            return ProtobufManager.instance;
        };
        ProtobufManager.prototype.buildProto = function (url) {
            var root = new Laya.Browser.window.protobuf.Root();
            var protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        };
        ProtobufManager.prototype.buildProtocal = function (url) {
            var json = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        };
        ProtobufManager.prototype.buildProtocalJson = function (json) {
            this.$commands = Object.keys(json);
            this.$protocals = json;
        };
        ProtobufManager.prototype.getProtocalByCommand = function (cmd) {
            return this.$protocals[cmd] || null;
        };
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
        ProtobufManager.prototype.getProtoClass = function (name) {
            return this.$proto.lookup(name);
        };
        ProtobufManager.prototype.getProtoEnum = function (name) {
            return this.getProtoClass(name).values;
        };
        ProtobufManager.prototype.encode = function (name, data) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                console.log("\u6253\u5305\u6570\u636E\u6210\u529F ==> " + JSON.stringify(data));
            }
            return this.getProtoClass(name).encode(data).finish();
        };
        ProtobufManager.prototype.decode = function (name, bytes) {
            return this.getProtoClass(name).decode(bytes);
        };
        ProtobufManager.instance = new ProtobufManager();
        return ProtobufManager;
    }());
    sunnet.ProtobufManager = ProtobufManager;
    var NetConnectionCreator = (function (_super) {
        __extends(NetConnectionCreator, _super);
        function NetConnectionCreator(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$messages = [];
            _this.$connection.addEventListener(EventKey.CLEAR_MESSAGE_QUEUE, _this.$onClearMessageQueue, _this);
            return _this;
        }
        NetConnectionCreator.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
            _super.prototype.destroy.call(this);
        };
        NetConnectionCreator.prototype.$onConnected = function () {
            while (this.$messages.length) {
                var data = this.$messages.pop();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        };
        NetConnectionCreator.prototype.$onClearMessageQueue = function () {
            this.$messages.length = 0;
        };
        NetConnectionCreator.prototype.$needCreate = function (ip, port) {
            if (ip === void 0 || port === void 0) {
                return false;
            }
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                if (this.$connection.ip !== ip && this.$connection.port !== port) {
                    return true;
                }
            }
            return false;
        };
        NetConnectionCreator.prototype.send = function (cmd, bytes, ip, port) {
            if (this.$needCreate(ip, port) == false) {
                if (this.$connection.state === NetConnectionStateEnum.CONNECTING) {
                    return null;
                }
                return [cmd, bytes, ip, port];
            }
            if (ip !== void 0 && port !== void 0) {
                this.$connection.connect(ip, port, false);
            }
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
    var NetConnectionDecoder = (function (_super) {
        __extends(NetConnectionDecoder, _super);
        function NetConnectionDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionDecoder.prototype.recv = function (cmd, srvId, bytes, data) {
            var input = this.$connection.input || null;
            if (input === null) {
                console.error("Decoder \u7F51\u7EDC\u5DF1\u65AD\u5F00\uFF01\uFF01\uFF01");
                return;
            }
            cmd = input.getUint16();
            srvId = input.getUint16();
            var buffer = input.buffer.slice(input.pos);
            input.pos += buffer.byteLength;
            bytes = new Uint8Array(buffer);
            if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + bytes.byteLength);
                }
            }
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionDecoder = NetConnectionDecoder;
    var NetConnectionEncoder = (function (_super) {
        __extends(NetConnectionEncoder, _super);
        function NetConnectionEncoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionEncoder.prototype.send = function (cmd, bytes, ip, port) {
            var output = this.$connection.output || null;
            if (output === null) {
                console.error("Encoder \u7F51\u7EDC\u5DF1\u65AD\u5F00\uFF01\uFF01\uFF01");
                return;
            }
            output.writeUint16(cmd);
            output.writeUint16(0);
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();
            if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString() + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
                }
            }
            else if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString() + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
            }
            return null;
        };
        return NetConnectionEncoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionEncoder = NetConnectionEncoder;
    var NetConnectionHeartBeat = (function (_super) {
        __extends(NetConnectionHeartBeat, _super);
        function NetConnectionHeartBeat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionHeartBeat.prototype.$onConnected = function () {
            this.$lastRecvTime = this.$lastSendTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        NetConnectionHeartBeat.prototype.$onDisconnected = function () {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        NetConnectionHeartBeat.prototype.$onEnterFrame = function () {
            var timestamp = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            if (this.$lastRecvTime < this.$lastSendTime) {
                if (timestamp - this.$lastSendTime > 1000) {
                    this.$lastRecvTime = this.$lastSendTime;
                    this.$connection.close(true);
                }
            }
            else if (timestamp - this.$lastSendTime > 3000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                this.$lastSendTime = timestamp;
                var bytes = ProtobufManager.getInstance().encode("msg.Common_Heartbeat", { Cnt: 1 });
                this.$connection.sendBytes(Config.HEARTBEAT_REQUEST_COMMAND, bytes);
            }
        };
        NetConnectionHeartBeat.prototype.recv = function (cmd, srvId, bytes, data) {
            if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                this.$lastRecvTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionHeartBeat;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionHeartBeat = NetConnectionHeartBeat;
    var Config;
    (function (Config) {
        Config.TCP_RETRY_DELAY = 20 * 1000;
        Config.TCP_MAX_RETRY_TIME = 10;
        Config.HEARTBEAT_REQUEST_COMMAND = -1;
        Config.HEARTBEAT_RESPONSE_COMMAND = -1;
    })(Config = sunnet.Config || (sunnet.Config = {}));
    var EventKey;
    (function (EventKey) {
        EventKey.SOCKET_CONNECTED = "sunnet.EventKey.SOCKET_CONNECTED";
        EventKey.SOCKET_DISCONNECTED = "sunnet.EventKey.SOCKET_DISCONNECTED";
        EventKey.KILL_WATCH_DOG = "sunnet.EventKey.KILL_WATCH_DOG";
        EventKey.CLEAR_MESSAGE_QUEUE = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
    })(EventKey = sunnet.EventKey || (sunnet.EventKey = {}));
    var MessageNotifier;
    (function (MessageNotifier) {
        var $inst = new suncom.EventSystem();
        function notify(name, data) {
            $inst.dispatchEvent(name, data);
        }
        MessageNotifier.notify = notify;
        function register(name, method, caller) {
            $inst.addEventListener(name, method, caller);
        }
        MessageNotifier.register = register;
        function unregister(name, method, caller) {
            $inst.removeEventListener(name, method, caller);
        }
        MessageNotifier.unregister = unregister;
    })(MessageNotifier = sunnet.MessageNotifier || (sunnet.MessageNotifier = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.SOCKET_STATE_CHANGE = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
        NotifyKey.SOCKET_STATE_ANOMALY = "sunnet.NotifyKey.SOCKET_STATE_ANOMALY";
        NotifyKey.SOCKET_RETRY_CONNECT = "sunnet.NotifyKey.SOCKET_RETRY_CONNECT";
    })(NotifyKey = sunnet.NotifyKey || (sunnet.NotifyKey = {}));
})(sunnet || (sunnet = {}));
