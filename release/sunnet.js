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
        MsgQIdEnum[MsgQIdEnum["NSL_SEND_DATA"] = 1] = "NSL_SEND_DATA";
        MsgQIdEnum[MsgQIdEnum["NSL_RECV_DATA"] = 2] = "NSL_RECV_DATA";
    })(MsgQIdEnum = sunnet.MsgQIdEnum || (sunnet.MsgQIdEnum = {}));
    var NetConnectionStateEnum;
    (function (NetConnectionStateEnum) {
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        NetConnectionStateEnum[NetConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(NetConnectionStateEnum = sunnet.NetConnectionStateEnum || (sunnet.NetConnectionStateEnum = {}));
    var ServerTimeUpdateFlagEnum;
    (function (ServerTimeUpdateFlagEnum) {
        ServerTimeUpdateFlagEnum[ServerTimeUpdateFlagEnum["RESET"] = 0] = "RESET";
        ServerTimeUpdateFlagEnum[ServerTimeUpdateFlagEnum["UPDATE"] = 1] = "UPDATE";
    })(ServerTimeUpdateFlagEnum = sunnet.ServerTimeUpdateFlagEnum || (sunnet.ServerTimeUpdateFlagEnum = {}));
    var VirtualNetworkLevelEnum;
    (function (VirtualNetworkLevelEnum) {
        VirtualNetworkLevelEnum[VirtualNetworkLevelEnum["NONE"] = 0] = "NONE";
        VirtualNetworkLevelEnum[VirtualNetworkLevelEnum["GOOD"] = 1] = "GOOD";
        VirtualNetworkLevelEnum[VirtualNetworkLevelEnum["BAD"] = 2] = "BAD";
        VirtualNetworkLevelEnum[VirtualNetworkLevelEnum["UNSTABLE"] = 3] = "UNSTABLE";
    })(VirtualNetworkLevelEnum = sunnet.VirtualNetworkLevelEnum || (sunnet.VirtualNetworkLevelEnum = {}));
    var NetConnection = (function (_super) {
        __extends(NetConnection, _super);
        function NetConnection(name) {
            var _this = _super.call(this, suncore.MsgQModEnum.NSL) || this;
            _this.$hashId = 0;
            _this.$socket = null;
            _this.$pipeline = null;
            _this.$state = NetConnectionStateEnum.DISCONNECTED;
            _this.$closedByError = false;
            _this.$ping = 0;
            _this.$latency = 0;
            _this.$srvTime = 0;
            _this.$clientTime = 0;
            _this.$dispatcher = new suncom.EventSystem();
            _this.$name = name;
            _this.$pipeline = new NetConnectionPipeline(_this);
            M.connetionMap[name] = _this;
            _this.facade.registerObserver(suntdd.NotifyKey.GET_WEBSOCKET_INFO, _this.$onGetWebSocketInfo, _this);
            _this.facade.registerObserver(suntdd.NotifyKey.TEST_WEBSOCKET_STATE, _this.$onTestWebSocketState, _this);
            _this.facade.registerObserver(suntdd.NotifyKey.TEST_WEBSOCKET_PROTOCAL, _this.$onTestWebSocketPacket, _this);
            return _this;
        }
        NetConnection.prototype.$onGetWebSocketInfo = function (out) {
            var connection = M.connetionMap[out.name] || null;
            if (connection === null) {
                return;
            }
            if (connection.state === NetConnectionStateEnum.CONNECTED) {
                out.state = suntdd.MSWSConnectionStateEnum.CONNECTED;
            }
            else if (connection.state === NetConnectionStateEnum.CONNECTING) {
                out.state = suntdd.MSWSConnectionStateEnum.CONNECTING;
            }
            else {
                out.state = suntdd.MSWSConnectionStateEnum.DISCONNECTED;
            }
        };
        NetConnection.prototype.$onTestWebSocketState = function (state) {
            this.testChangeState(state);
        };
        NetConnection.prototype.$onTestWebSocketPacket = function (name, data) {
            this.testProtocal(name, data);
        };
        NetConnection.prototype.connect = function (ip, port, byDog) {
            var byError = byDog === false ? false : this.$closedByError;
            this.close(byError);
            this.$ip = ip;
            this.$port = port;
            this.$state = NetConnectionStateEnum.CONNECTING;
            this.$socket = new Laya.Socket();
            this.$socket.endian = Laya.Byte.LITTLE_ENDIAN;
            this.$socket.on(Laya.Event.OPEN, this, this.$onOpen);
            this.$socket.on(Laya.Event.CLOSE, this, this.$onClose);
            this.$socket.on(Laya.Event.ERROR, this, this.$onError);
            this.$socket.on(Laya.Event.MESSAGE, this, this.$onMessage);
            this.$hashId = suncom.Common.createHashId();
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
            }
            else {
                this.$socket.connectByUrl("ws://" + ip + ":" + port);
            }
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> \u8BF7\u6C42\u8FDE\u63A5 ws://" + this.$ip + ":" + this.$port);
            }
            this.addEventListener(EventKey.CLOSE_CONNECT_BY_VIRTUAL, this.$onError, this);
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, false]);
        };
        NetConnection.prototype.close = function (byError) {
            if (byError === void 0) { byError = false; }
            if (byError === false) {
                this.$closedByError = false;
            }
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$closedByError = true;
                this.dispatchEvent(EventKey.CLEAR_REQUEST_DATA);
            }
            if (this.$socket !== null) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> \u5173\u95ED\u8FDE\u63A5 ws://" + this.$ip + ":" + this.$port);
                }
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);
                this.$socket.close();
                this.$socket = null;
                this.$hashId = 0;
            }
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(EventKey.SOCKET_DISCONNECTED, byError);
            }
            if (byError === false) {
                this.dispatchEvent(EventKey.KILL_WATCH_DOG);
            }
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.$state = NetConnectionStateEnum.DISCONNECTED;
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, byError]);
            }
        };
        NetConnection.prototype.send = function (bytes) {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, "NetConnection=> 网络未连接，发送数据失败！！！");
            }
        };
        NetConnection.prototype.sendBytes = function (cmd, bytes, ip, port) {
            if (bytes === void 0) { bytes = null; }
            if (ip === void 0) { ip = null; }
            if (port === void 0) { port = 0; }
            this.$pipeline.send(cmd, bytes, ip, port);
        };
        NetConnection.prototype.flush = function () {
            this.$socket.flush();
        };
        NetConnection.prototype.testChangeState = function (state) {
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                var handler = suncom.Handler.create(this, this.$onTestChangeState, [this.$hashId, state]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        };
        NetConnection.prototype.$onTestChangeState = function (hashId, state) {
            if (this.$hashId === hashId) {
                if (state === suntdd.MSWSStateEnum.CONNECTED) {
                    this.$onOpen();
                }
                else if (state === suntdd.MSWSStateEnum.CLOSE) {
                    this.$onClose();
                }
                else if (state === suntdd.MSWSStateEnum.ERROR) {
                    this.$onError();
                }
            }
        };
        NetConnection.prototype.testPacket = function (cmd) {
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                var handler = suncom.Handler.create(this, this.$onTestPacket, [this.$hashId, cmd]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        };
        NetConnection.prototype.$onTestPacket = function (hashId, cmd) {
            if (this.$hashId === hashId) {
                var protocal = ProtobufManager.getInstance().getProtocalByCommand(cmd);
                this.facade.sendNotification(suntdd.NotifyKey.TEST_WEBSOCKET_SEND_DATA, protocal && protocal.Name);
            }
        };
        NetConnection.prototype.testProtocal = function (name, data) {
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                var handler = suncom.Handler.create(this, this.$onTestProtocal, [this.$hashId, name, data]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        };
        NetConnection.prototype.$onTestProtocal = function (hashId, name, data) {
            if (this.$hashId === hashId) {
                var protocal = ProtobufManager.getInstance().getProtocalByName(name);
                this.$pipeline.recv(protocal.Id, 0, null, data);
            }
        };
        NetConnection.prototype.logMsgIsSent = function (cmd, bytes, ip, port) {
            var protocal = ProtobufManager.getInstance().getProtocalByCommand(cmd);
            var data = protocal === null ? null : ProtobufManager.getInstance().decode("msg." + protocal.Name, bytes);
            if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "\u53D1\u9001\u5FC3\u8DF3 name:" + protocal.Name + ", data:" + JSON.stringify(data));
                }
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "\u53D1\u9001\u6D88\u606F name:" + protocal.Name + ", data:" + JSON.stringify(data));
            }
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
        NetConnection.prototype.$onOpen = function () {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 网络连接成功！");
            }
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);
            this.dispatchEvent(EventKey.CACHE_SEND_BYTES, false);
            this.dispatchEvent(EventKey.FLUSH_CACHED_BYTES);
            this.$closedByError = false;
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, false]);
        };
        NetConnection.prototype.$onClose = function () {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        };
        NetConnection.prototype.$onError = function () {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 连接异常断开！");
            }
            this.close(true);
        };
        NetConnection.prototype.$onMessage = function (event) {
            this.$pipeline.recv(0, 0, null, void 0);
        };
        Object.defineProperty(NetConnection.prototype, "name", {
            get: function () {
                return this.$name || null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "ip", {
            get: function () {
                return this.$ip || null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "port", {
            get: function () {
                return this.$port || 0;
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
                if (this.$socket === null) {
                    return null;
                }
                else {
                    return this.$socket.input || null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "output", {
            get: function () {
                if (this.$socket === null) {
                    return null;
                }
                else {
                    return this.$socket.output || null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "ping", {
            get: function () {
                return this.$ping;
            },
            set: function (value) {
                this.$ping = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "latency", {
            get: function () {
                return this.$latency;
            },
            set: function (value) {
                this.$latency = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "srvTime", {
            get: function () {
                return this.$srvTime;
            },
            set: function (value) {
                this.$srvTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "clientTime", {
            get: function () {
                return this.$clientTime;
            },
            set: function (value) {
                this.$clientTime = value;
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
        return NetConnection;
    }(puremvc.Notifier));
    sunnet.NetConnection = NetConnection;
    var NetConnectionInterceptor = (function (_super) {
        __extends(NetConnectionInterceptor, _super);
        function NetConnectionInterceptor(connection) {
            var _this = _super.call(this, suncore.MsgQModEnum.NSL) || this;
            _this.$connection = null;
            _this.$connection = connection;
            _this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, _this.$onConnected, _this, false, suncom.EventPriorityEnum.FWL);
            _this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, _this.$onDisconnected, _this, false, suncom.EventPriorityEnum.FWL);
            return _this;
        }
        NetConnectionInterceptor.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
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
    var NetConnectionPing = (function (_super) {
        __extends(NetConnectionPing, _super);
        function NetConnectionPing() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$trackers = [];
            return _this;
        }
        NetConnectionPing.prototype.$onConnected = function () {
            this.$trackers.length = 0;
        };
        NetConnectionPing.prototype.send = function (cmd, bytes, ip, port) {
            if (this.$isReliableProtocal(cmd) === true) {
                var tracker = {
                    rsp: cmd,
                    rep: this.$getProtocalReplyCommand(cmd),
                    time: new Date().valueOf()
                };
                this.$trackers.push(tracker);
            }
            return [cmd, bytes, ip, port];
        };
        NetConnectionPing.prototype.recv = function (cmd, srvId, bytes, data) {
            if (this.$trackers.length > 0) {
                var tracker = this.$trackers[0];
                if (tracker.rep === cmd) {
                    this.$trackers.shift();
                    this.$connection.ping = new Date().valueOf() - tracker.time;
                    this.$dealRecvData(cmd, data);
                }
            }
            return [cmd, srvId, bytes, data];
        };
        NetConnectionPing.prototype.$updateServerTimestamp = function (time, flag) {
            var latency = Math.ceil(this.$connection.ping / 2);
            if (flag === ServerTimeUpdateFlagEnum.RESET || latency < this.$connection.latency) {
                this.$connection.srvTime = time;
                this.$connection.latency = latency;
                this.$connection.clientTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                var srvTime = this.$connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - this.$connection.clientTime;
                suncom.Logger.log(suncom.DebugMode.ANY, "\u670D\u52A1\u5668\u65F6\u95F4\uFF1A" + suncom.Common.formatDate("yy-MM-dd hh:mm:ss MS", srvTime) + "\uFF0CPing\uFF1A" + this.$connection.ping + "\uFF0C\u65F6\u95F4\u63A8\u7B97\u5EF6\u5EF6\uFF1A" + this.$connection.latency);
            }
        };
        return NetConnectionPing;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionPing = NetConnectionPing;
    var NetConnectionPipeline = (function (_super) {
        __extends(NetConnectionPipeline, _super);
        function NetConnectionPipeline(connection) {
            var _this = _super.call(this) || this;
            _this.$items = [];
            _this.$connection = connection;
            return _this;
        }
        NetConnectionPipeline.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
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
                suncom.Logger.warn(suncom.DebugMode.ANY, "NetConnectionPipeline=> decode \u610F\u5916\u7684\u6307\u4EE4 cmd:" + params[0].toString() + ", buff:" + (params[1] ? "[Object]" : "null"));
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
    }(puremvc.Notifier));
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
            if (newData === bytes) {
                throw Error("请勿返回未处理的消息！！！");
            }
            var msg = {
                id: cmd,
                name: null,
                data: newData
            };
            if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.NONE) {
                suncore.MsgQ.send(suncore.MsgQModEnum.NSL, MsgQIdEnum.NSL_RECV_DATA, msg);
            }
            else {
                this.$connection.dispatchEvent(EventKey.SOCKET_MESSAGE_DECODED, msg);
            }
            return [cmd, srvId, bytes, newData];
        };
        return NetConnectionProtobufDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionProtobufDecoder = NetConnectionProtobufDecoder;
    var NetConnectionVirtualNetwork = (function (_super) {
        __extends(NetConnectionVirtualNetwork, _super);
        function NetConnectionVirtualNetwork() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$datas = [];
            _this.$currentSeconds = 0;
            _this.$isNetworkWaving = false;
            _this.$lastConnectedTimestamp = 0;
            _this.$currentConnectionReliableTime = 0;
            return _this;
        }
        NetConnectionVirtualNetwork.prototype.$onConnected = function () {
            this.$lastConnectedTimestamp = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            this.$currentConnectionReliableTime = this.$getReliableTimeOfConnection() * 1000;
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.$connection.addEventListener(EventKey.SOCKET_MESSAGE_DECODED, this.$onSocketMessageDecoded, this);
        };
        NetConnectionVirtualNetwork.prototype.$onDisconnected = function (byError) {
            this.$datas.length = 0;
            this.$currentSeconds = 0;
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.$connection.removeEventListener(EventKey.SOCKET_MESSAGE_DECODED, this.$onSocketMessageDecoded, this);
        };
        NetConnectionVirtualNetwork.prototype.$onEnterFrame = function () {
            var time = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            if (this.$lastConnectedTimestamp > 0 && time > this.$lastConnectedTimestamp + this.$currentConnectionReliableTime) {
                this.$connection.dispatchEvent(EventKey.CLOSE_CONNECT_BY_VIRTUAL);
                return;
            }
            var seconds = Math.floor(time / 1000);
            if (this.$currentSeconds !== seconds) {
                this.$currentSeconds = seconds;
                this.$isNetworkWaving = suncom.Mathf.random(0, 100) < this.$getProbabilyOfNetworkWave();
            }
            if (this.$datas.length > 0) {
                var data = this.$datas[0];
                if (time > data.time + data.delay) {
                    suncore.MsgQ.send(suncore.MsgQModEnum.NSL, MsgQIdEnum.NSL_RECV_DATA, this.$datas.shift().msg);
                }
            }
        };
        NetConnectionVirtualNetwork.prototype.$onSocketMessageDecoded = function (msg) {
            var data = {
                msg: msg,
                time: suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM),
                delay: this.$calculateMessageDelayTime()
            };
            this.$datas.push(data);
        };
        NetConnectionVirtualNetwork.prototype.$getReliableTimeOfConnection = function () {
            if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
                return suncom.Mathf.random(180, 300);
            }
            else {
                return 1440 * 30;
            }
        };
        NetConnectionVirtualNetwork.prototype.$getProbabilyOfNetworkWave = function () {
            if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.BAD) {
                return 10;
            }
            else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
                return 25;
            }
            else {
                return 0;
            }
        };
        NetConnectionVirtualNetwork.prototype.$calculateMessageDelayTime = function () {
            if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.GOOD) {
                return suncom.Mathf.random(60, 150);
            }
            else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.BAD) {
                if (this.$isNetworkWaving === false) {
                    return suncom.Mathf.random(200, 800);
                }
                else {
                    return suncom.Mathf.random(1000, 2000);
                }
            }
            else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
                if (this.$isNetworkWaving === false) {
                    return suncom.Mathf.random(1000, 2500);
                }
                else {
                    return suncom.Mathf.random(3000, 8000);
                }
            }
            else {
                return 0;
            }
        };
        return NetConnectionVirtualNetwork;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionVirtualNetwork = NetConnectionVirtualNetwork;
    var NetConnectionWatchDog = (function (_super) {
        __extends(NetConnectionWatchDog, _super);
        function NetConnectionWatchDog(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$retryer = null;
            _this.$retryer = new sunui.Retryer(sunui.RetryMethodEnum.TERMINATE, suncom.Handler.create(_this, _this.$onConnectFailed, [connection.name]));
            _this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, _this.$onKillWatchDog, _this);
            return _this;
        }
        NetConnectionWatchDog.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            _super.prototype.destroy.call(this);
        };
        NetConnectionWatchDog.prototype.$onConnected = function () {
            this.$retryer.cancel();
            this.$retryer.reset();
        };
        NetConnectionWatchDog.prototype.$onDisconnected = function (byError) {
            if (byError === true) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "NetConnectionWatchDog=> \u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C" + Config.TCP_RETRY_DELAY + "\u6BEB\u79D2\u540E\u91CD\u8FDE\uFF01");
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$retryer.run(Config.TCP_RETRY_DELAY, suncom.Handler.create(this, this.$doConnect), Config.TCP_MAX_RETRIES);
            }
        };
        NetConnectionWatchDog.prototype.$onKillWatchDog = function () {
            this.$retryer.cancel();
        };
        NetConnectionWatchDog.prototype.$doConnect = function () {
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "\u68C0\u6D4B\u72D7\u4E0D\u80FD\u6B63\u5E38\u5DE5\u4F5C\uFF0C\u56E0\u4E3A state:" + NetConnectionStateEnum[this.$connection.state]);
            }
        };
        NetConnectionWatchDog.prototype.$onConnectFailed = function (name) {
            this.$retryer.reset();
            this.facade.sendNotification(NotifyKey.SOCKET_CONNECT_FAILED, name);
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
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                if (name === "msg.Common_Heartbeat") {
                    if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                        suncom.Logger.log(suncom.DebugMode.ANY, "\u6253\u5305\u5FC3\u8DF3\u6210\u529F ==> " + JSON.stringify(data));
                    }
                }
                else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "\u6253\u5305\u6570\u636E\u6210\u529F ==> " + JSON.stringify(data));
                }
            }
            return this.getProtoClass(name).encode(data).finish();
        };
        ProtobufManager.prototype.decode = function (name, bytes) {
            var data = this.getProtoClass(name).decode(bytes);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                if (name === "msg.Common_Heartbeat") {
                    if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                        suncom.Logger.log(suncom.DebugMode.ANY, "\u89E3\u6790\u5FC3\u8DF3\u6210\u529F ==> " + JSON.stringify(data));
                    }
                }
                else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "\u89E3\u6790\u6570\u636E\u6210\u529F ==> " + JSON.stringify(data));
                }
            }
            return data;
        };
        ProtobufManager.instance = new ProtobufManager();
        return ProtobufManager;
    }());
    sunnet.ProtobufManager = ProtobufManager;
    var SequentialSlice = (function (_super) {
        __extends(SequentialSlice, _super);
        function SequentialSlice() {
            var _this = _super.call(this) || this;
            _this.$hashId = suncom.Common.createHashId();
            _this.$destroyed = false;
            _this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, _this.$onEnterFrameCB, _this, false, suncom.EventPriorityEnum.FWL);
            return _this;
        }
        SequentialSlice.prototype.release = function () {
            if (this.$destroyed === true) {
                return;
            }
            this.$destroyed = true;
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrameCB, this);
        };
        SequentialSlice.prototype.$onEnterFrameCB = function () {
            if (this.$destroyed === false) {
                this.$onEnterFrame();
            }
        };
        Object.defineProperty(SequentialSlice.prototype, "hashId", {
            get: function () {
                return this.$hashId;
            },
            enumerable: true,
            configurable: true
        });
        return SequentialSlice;
    }(puremvc.Notifier));
    sunnet.SequentialSlice = SequentialSlice;
    var SequentialTimeSlice = (function (_super) {
        __extends(SequentialTimeSlice, _super);
        function SequentialTimeSlice(lifeTime, conName) {
            if (conName === void 0) { conName = "default"; }
            var _this = _super.call(this) || this;
            _this.$connection = null;
            _this.$srvCreateTime = 0;
            _this.$lifeTime = 0;
            _this.$pastTime = 0;
            _this.$killedTime = 0;
            _this.$timeMultiple = 1;
            _this.$chaseMultiple = 1;
            _this.$lifeTime = lifeTime;
            _this.$connection = M.connetionMap[conName] || null;
            _this.$srvCreateTime = getCurrentServerTimestamp(conName);
            return _this;
        }
        SequentialTimeSlice.prototype.updateCreateTime = function (createTime, pastTime, chaseMultiple) {
            if (createTime === void 0) { createTime = 0; }
            if (pastTime === void 0) { pastTime = 0; }
            if (chaseMultiple === void 0) { chaseMultiple = 1; }
            this.$pastTime = pastTime;
            this.$chaseMultiple = chaseMultiple;
            this.$srvCreateTime = createTime > 0 ? createTime : this.$srvCreateTime;
            this.$onEnterFrame();
        };
        SequentialTimeSlice.prototype.$onEnterFrame = function () {
            if (this.$timeMultiple < 0) {
                suncom.Logger.error(suncom.DebugMode.ANY, "\u5F53\u524D\u65F6\u95F4\u6D41\u901D\u500D\u7387\u4E0D\u5141\u8BB8\u5C0F\u4E8E0");
                return;
            }
            var delta = suncore.System.getDelta() * this.$timeMultiple;
            if (delta < suncore.System.getDelta()) {
                this.$killedTime += suncore.System.getDelta() - delta;
            }
            if (this.$timeMultiple === 0) {
                return;
            }
            this.$pastTime += delta;
            var timeDiff = getCurrentServerTimestamp(this.$connection.name) - (this.$srvCreateTime + this.$pastTime + this.$killedTime);
            if (timeDiff > 0) {
                delta *= this.$chaseMultiple;
                if (delta > timeDiff) {
                    delta = timeDiff;
                }
                this.$pastTime += delta;
            }
            if (this.$pastTime > this.$lifeTime) {
                this.$pastTime = this.$lifeTime;
            }
            this.$frameLoop();
            if (this.$pastTime >= this.$lifeTime) {
                this.$onTimeup();
            }
        };
        Object.defineProperty(SequentialTimeSlice.prototype, "timeLen", {
            get: function () {
                return this.$lifeTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SequentialTimeSlice.prototype, "pastTime", {
            get: function () {
                return this.$pastTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SequentialTimeSlice.prototype, "timeMultiple", {
            get: function () {
                return this.$timeMultiple;
            },
            set: function (value) {
                this.$timeMultiple = value;
            },
            enumerable: true,
            configurable: true
        });
        return SequentialTimeSlice;
    }(SequentialSlice));
    sunnet.SequentialTimeSlice = SequentialTimeSlice;
    var NetConnectionCreator = (function (_super) {
        __extends(NetConnectionCreator, _super);
        function NetConnectionCreator(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$datas = [];
            _this.$cacheSendBytes = false;
            _this.$connection.addEventListener(EventKey.CACHE_SEND_BYTES, _this.$onCacheSendBytes, _this);
            _this.$connection.addEventListener(EventKey.FLUSH_CACHED_BYTES, _this.$onFlushCachedBytes, _this);
            _this.$connection.addEventListener(EventKey.CLEAR_REQUEST_DATA, _this.$onClearRequestData, _this);
            return _this;
        }
        NetConnectionCreator.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            this.$connection.removeEventListener(EventKey.CACHE_SEND_BYTES, this.$onCacheSendBytes, this);
            this.$connection.removeEventListener(EventKey.FLUSH_CACHED_BYTES, this.$onFlushCachedBytes, this);
            this.$connection.removeEventListener(EventKey.CLEAR_REQUEST_DATA, this.$onClearRequestData, this);
            _super.prototype.destroy.call(this);
        };
        NetConnectionCreator.prototype.$onCacheSendBytes = function (yes) {
            this.$cacheSendBytes = yes;
        };
        NetConnectionCreator.prototype.$onFlushCachedBytes = function () {
            while (this.$datas.length > 0 && this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                var data = this.$datas.shift();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        };
        NetConnectionCreator.prototype.$onClearRequestData = function () {
            this.$datas.length = 0;
        };
        NetConnectionCreator.prototype.$needCreate = function (ip, port) {
            if (ip === null || port === 0) {
                return false;
            }
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                if (this.$connection.ip !== ip || this.$connection.port !== port) {
                    return true;
                }
            }
            return false;
        };
        NetConnectionCreator.prototype.send = function (cmd, bytes, ip, port) {
            if (this.$needCreate(ip, port) == true) {
                this.$connection.connect(ip, port, false);
                this.$cacheSendBytes = true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                return [cmd, bytes, ip, port];
            }
            else if (this.$cacheSendBytes === true) {
                var data = {
                    cmd: cmd,
                    bytes: bytes,
                    ip: ip,
                    port: port
                };
                this.$datas.push(data);
            }
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
            var done = false;
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                if (data !== null) {
                    var protocal = ProtobufManager.getInstance().getProtocalByCommand(cmd);
                    bytes = ProtobufManager.getInstance().encode("msg." + protocal.Name, data);
                }
                done = true;
                data = void 0;
            }
            if (done === false) {
                var input = this.$connection.input || null;
                if (input === null) {
                    suncom.Logger.error(suncom.DebugMode.ANY, "Decoder \u7F51\u7EDC\u5DF1\u65AD\u5F00\uFF01\uFF01\uFF01");
                    return null;
                }
                cmd = input.getUint16();
                srvId = input.getUint16();
                var buffer = input.buffer.slice(input.pos);
                input.pos += buffer.byteLength;
                done = true;
                bytes = new Uint8Array(buffer);
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
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                this.$connection.testPacket(cmd);
                this.$connection.logMsgIsSent(cmd, bytes, ip, port);
                return null;
            }
            var output = this.$connection.output || null;
            if (output === null) {
                suncom.Logger.error(suncom.DebugMode.ANY, "Encoder \u7F51\u7EDC\u5DF1\u65AD\u5F00\uFF01\uFF01\uFF01");
                return null;
            }
            output.writeUint16(cmd);
            output.writeUint16(0);
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();
            this.$connection.logMsgIsSent(cmd, bytes, ip, port);
            return null;
        };
        return NetConnectionEncoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionEncoder = NetConnectionEncoder;
    var NetConnectionHeartbeat = (function (_super) {
        __extends(NetConnectionHeartbeat, _super);
        function NetConnectionHeartbeat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionHeartbeat.prototype.$onConnected = function () {
            this.$lastRecvTime = this.$lastSendTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        NetConnectionHeartbeat.prototype.$onDisconnected = function () {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        NetConnectionHeartbeat.prototype.$onEnterFrame = function () {
            var timestamp = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            if (this.$lastRecvTime < this.$lastSendTime) {
                if (timestamp - this.$lastSendTime > Config.HEARTBEAT_TIMEOUT_MILLISECONDS) {
                    this.$lastRecvTime = this.$lastSendTime;
                    this.$connection.close(true);
                }
            }
            else if (timestamp - this.$lastSendTime > Config.HEARTBEAT_INTERVAL_MILLISECONDS) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                }
                var bytes = ProtobufManager.getInstance().encode("msg.Common_Heartbeat", { Cnt: 1 });
                this.$connection.sendBytes(Config.HEARTBEAT_REQUEST_COMMAND, bytes);
            }
        };
        NetConnectionHeartbeat.prototype.send = function (cmd, bytes, ip, port) {
            if (Config.HEARTBEAT_FIXED_FREQUENCY === false || cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                        if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                            suncom.Logger.log(suncom.DebugMode.ANY, "send heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                        }
                    }
                    else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                        suncom.Logger.log(suncom.DebugMode.ANY, "send bytes=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                    }
                }
                this.$lastSendTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            return [cmd, bytes, ip, port];
        };
        NetConnectionHeartbeat.prototype.recv = function (cmd, srvId, bytes, data) {
            if (Config.HEARTBEAT_FIXED_FREQUENCY === false || cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                        if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                            suncom.Logger.log(suncom.DebugMode.ANY, "recv heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                        }
                    }
                    else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                        suncom.Logger.log(suncom.DebugMode.ANY, "recv bytes=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                    }
                }
                this.$lastRecvTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionHeartbeat;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionHeartbeat = NetConnectionHeartbeat;
    var Config;
    (function (Config) {
        Config.TCP_RETRY_DELAY = 20 * 1000;
        Config.TCP_MAX_RETRIES = 10;
        Config.HEARTBEAT_REQUEST_COMMAND = -1;
        Config.HEARTBEAT_RESPONSE_COMMAND = -1;
        Config.HEARTBEAT_TIMEOUT_MILLISECONDS = 3000;
        Config.HEARTBEAT_INTERVAL_MILLISECONDS = 5000;
        Config.HEARTBEAT_FIXED_FREQUENCY = false;
        Config.VIRTUAL_NETWORK_LEVEL = VirtualNetworkLevelEnum.NONE;
    })(Config = sunnet.Config || (sunnet.Config = {}));
    var EventKey;
    (function (EventKey) {
        EventKey.SOCKET_CONNECTED = "sunnet.EventKey.SOCKET_CONNECTED";
        EventKey.SOCKET_DISCONNECTED = "sunnet.EventKey.SOCKET_DISCONNECTED";
        EventKey.SOCKET_CONNECTING = "sunnet.EventKey.SOCKET_CONNECTING";
        EventKey.SOCKET_CONNECT_FAILED = "sunnet.EventKey.SOCKET_CONNECT_FAILED";
        EventKey.KILL_WATCH_DOG = "sunnet.EventKey.KILL_WATCH_DOG";
        EventKey.CACHE_SEND_BYTES = "sunnet.EventKey.CACHE_SEND_BYTES";
        EventKey.FLUSH_CACHED_BYTES = "sunnet.EventKey.FLUSH_CACHED_BYTES";
        EventKey.CLEAR_REQUEST_DATA = "sunnet.EventKey.CLEAR_REQUEST_DATA";
        EventKey.SOCKET_MESSAGE_DECODED = "sunnet.EventKey.SOCKET_MESSAGE_DECODED";
        EventKey.CLOSE_CONNECT_BY_VIRTUAL = "sunnet.EventKey.CLOSE_CONNECT_BY_VIRTUAL";
    })(EventKey = sunnet.EventKey || (sunnet.EventKey = {}));
    var M;
    (function (M) {
        M.HEAD_LENGTH = 28;
        M.connetionMap = {};
    })(M = sunnet.M || (sunnet.M = {}));
    var MessageNotifier;
    (function (MessageNotifier) {
        var $notifier = new suncom.EventSystem();
        function notify(name, data, cancelable) {
            if (name === "msg.Common_Heartbeat") {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "响应心跳");
                }
            }
            else {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "响应消息 name:" + name + ", data:" + JSON.stringify(data));
                }
            }
            $notifier.dispatchEvent(name, data, cancelable);
        }
        MessageNotifier.notify = notify;
        function register(name, method, caller, priority) {
            $notifier.addEventListener(name, method, caller, false, priority);
        }
        MessageNotifier.register = register;
        function unregister(name, method, caller) {
            $notifier.removeEventListener(name, method, caller);
        }
        MessageNotifier.unregister = unregister;
    })(MessageNotifier = sunnet.MessageNotifier || (sunnet.MessageNotifier = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.SOCKET_STATE_CHANGE = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
        NotifyKey.SOCKET_CONNECT_FAILED = "sunnet.NotifyKey.SOCKET_CONNECT_FAILED";
        NotifyKey.SEQUENTIAL_SLICE_RELEASED = "sunnet.NotifyKey.SEQUENTIAL_SLICE_RELEASED";
        NotifyKey.GUI_SEQUENTIAL_NOTIFICATION = "sunnet.NotifyKey.GUI_SEQUENTIAL_NOTIFICATION";
    })(NotifyKey = sunnet.NotifyKey || (sunnet.NotifyKey = {}));
    function getCurrentServerTimestamp(connName) {
        if (connName === void 0) { connName = "default"; }
        var connection = M.connetionMap[connName] || null;
        if (connection === null) {
            return 0;
        }
        return connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - connection.clientTime;
    }
    sunnet.getCurrentServerTimestamp = getCurrentServerTimestamp;
})(sunnet || (sunnet = {}));
