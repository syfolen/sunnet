/**
 * MIT License
 * 
 * Copyright (c) 2019 Binfeng Sun<christon.sun@qq.com>
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunnet
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
    var HeartbeatCommandEnum;
    (function (HeartbeatCommandEnum) {
        HeartbeatCommandEnum[HeartbeatCommandEnum["REQUEST"] = 0] = "REQUEST";
        HeartbeatCommandEnum[HeartbeatCommandEnum["RESPONSE"] = 1] = "RESPONSE";
    })(HeartbeatCommandEnum = sunnet.HeartbeatCommandEnum || (sunnet.HeartbeatCommandEnum = {}));
    var NetConnectionStateEnum;
    (function (NetConnectionStateEnum) {
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        NetConnectionStateEnum[NetConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(NetConnectionStateEnum = sunnet.NetConnectionStateEnum || (sunnet.NetConnectionStateEnum = {}));
    var BuildProtoTask = (function (_super) {
        __extends(BuildProtoTask, _super);
        function BuildProtoTask(url) {
            var _this = _super.call(this) || this;
            _this.$url = url;
            return _this;
        }
        BuildProtoTask.prototype.run = function () {
            Laya.Browser.window.protobuf.load(this.$url, this.$onLoadProto.bind(this));
            return false;
        };
        BuildProtoTask.prototype.$onLoadProto = function (error, root) {
            ProtobufManager.addProto(root);
            this.done = true;
        };
        return BuildProtoTask;
    }(suncore.AbstractTask));
    sunnet.BuildProtoTask = BuildProtoTask;
    var EventKey = (function () {
        function EventKey() {
        }
        EventKey.SOCKET_CONNECTED = "sunnet.EventKey.SOCKET_CONNECTED";
        EventKey.SOCKET_DISCONNECTED = "sunnet.EventKey.SOCKET_DISCONNECTED";
        EventKey.KILL_WATCH_DOG = "sunnet.EventKey.KILL_WATCH_DOG";
        EventKey.CLEAR_MESSAGE_QUEUE = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
        return EventKey;
    }());
    sunnet.EventKey = EventKey;
    var NetConnection = (function (_super) {
        __extends(NetConnection, _super);
        function NetConnection(name) {
            var _this = _super.call(this) || this;
            _this.$closedByError = false;
            _this.$socket = null;
            _this.$state = NetConnectionStateEnum.DISCONNECTED;
            _this.$pipeline = new NetConnectionPipeline(_this);
            _this.$name = name;
            _this.$pipeline = new NetConnectionPipeline(_this);
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
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 0);
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
        NetConnection.prototype.send = function (buffer) {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(buffer);
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        };
        NetConnection.prototype.flush = function () {
            this.$socket.flush();
        };
        NetConnection.prototype.sendPB = function (cmd, data, ip, port) {
            this.$pipeline.send(cmd, null, ip, port);
        };
        NetConnection.prototype.sendBytes = function (cmd, buffer, ip, port) {
            this.$pipeline.send(cmd, buffer, ip, port);
        };
        NetConnection.prototype.$onOpen = function () {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }
            if (this.$closedByError === true) {
                this.$closedByError = false;
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 1);
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
                return this.$socket.input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetConnection.prototype, "output", {
            get: function () {
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
    }(suncom.EventSystem));
    sunnet.NetConnection = NetConnection;
    var NetConnectionInterceptor = (function () {
        function NetConnectionInterceptor(connection) {
            this.$connection = connection;
            this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
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
        NetConnectionInterceptor.prototype.recv = function (cmd, srvId, buffer, data) {
            return [cmd, srvId, buffer, data];
        };
        return NetConnectionInterceptor;
    }());
    sunnet.NetConnectionInterceptor = NetConnectionInterceptor;
    var NetConnectionPipeline = (function (_super) {
        __extends(NetConnectionPipeline, _super);
        function NetConnectionPipeline() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$items = [];
            return _this;
        }
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
        NetConnectionPipeline.prototype.recv = function (cmd, srvId, buffer, data) {
            var params = [cmd, srvId, buffer, data];
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
                    suncom.Logger.warn("NetConnectionPipeline=> decode \u610F\u5916\u7684\u6307\u4EE4 cmd:" + params[0].toString(16) + ", buff:" + (params[1] ? "[Object]" : "null"));
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
    }(NetConnectionInterceptor));
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
        NetConnectionProtobufDecoder.prototype.recv = function (cmd, srvId, buffer, data) {
            if (data !== void 0) {
                return [cmd, srvId, buffer, data];
            }
            var newData = this.$decode(cmd, buffer);
            if (newData === null) {
                return [cmd, srvId, buffer, data];
            }
            if (newData === buffer) {
                throw Error("请勿返回未处理的消息！！！");
            }
            suncore.System.addSocketMessage(cmd, newData);
            return [cmd, srvId, buffer, newData];
        };
        return NetConnectionProtobufDecoder;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionProtobufDecoder = NetConnectionProtobufDecoder;
    var NetConnectionWatchDog = (function (_super) {
        __extends(NetConnectionWatchDog, _super);
        function NetConnectionWatchDog(connection) {
            var _this = _super.call(this, connection) || this;
            _this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, _this.$onKillWatchDog, _this);
            return _this;
        }
        NetConnectionWatchDog.prototype.destroy = function () {
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            _super.prototype.destroy.call(this);
        };
        NetConnectionWatchDog.prototype.$onConnected = function () {
            this.$onKillWatchDog();
        };
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
        NetConnectionWatchDog.prototype.$onKillWatchDog = function () {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        };
        NetConnectionWatchDog.prototype.$onDoingConnect = function () {
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$connection.connect(suncom.Global.TCP_IP, suncom.Global.TCP_PORT, true);
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
    var NotifyKey = (function () {
        function NotifyKey() {
        }
        NotifyKey.SOCKET_STATE_CHANGE = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
        return NotifyKey;
    }());
    sunnet.NotifyKey = NotifyKey;
    var ProtobufManager = (function () {
        function ProtobufManager() {
        }
        ProtobufManager.buildProto = function (urls) {
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new BuildProtoTask(url));
            }
        };
        ProtobufManager.addProto = function (root) {
            ProtobufManager.$protos.push(root);
        };
        ProtobufManager.getProtoClass = function (className) {
            for (var i = 0; i < ProtobufManager.$protos.length; i++) {
                var root = ProtobufManager.$protos[i];
                var protoClass = root.lookup(className);
                if (protoClass !== void 0 && protoClass !== null) {
                    return protoClass;
                }
            }
            throw Error("No protoClass " + className);
        };
        ProtobufManager.getProtoObject = function (className, data) {
            return ProtobufManager.getProtoClass(className).encode(data).finish();
        };
        ProtobufManager.decode = function (className, buffer) {
            return ProtobufManager.getProtoClass(className).decode(buffer);
        };
        ProtobufManager.$protos = [];
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
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                if (ip !== void 0 && port !== void 0 && this.$connection.ip !== ip && this.$connection.port !== port) {
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
    var NetConnectionDecoder = (function (_super) {
        __extends(NetConnectionDecoder, _super);
        function NetConnectionDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionDecoder.prototype.recv = function (cmd, srvId, buffer, data) {
            var input = this.$connection.input;
            cmd = input.getUint16();
            srvId = input.getUint16();
            buffer = input.buffer.slice(input.pos);
            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + input.bytesAvailable);
                }
            }
            input.clear();
            return [cmd, srvId, buffer, data];
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
            var output = this.$connection.output;
            output.writeUint16(cmd);
            output.writeUint16(0);
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
    var NetConnectionHeartBeat = (function (_super) {
        __extends(NetConnectionHeartBeat, _super);
        function NetConnectionHeartBeat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetConnectionHeartBeat.prototype.$onConnected = function () {
            this.$lastRecvTime = this.$lastSendTime = new Date().valueOf();
            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        NetConnectionHeartBeat.prototype.$onDisconnected = function () {
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        NetConnectionHeartBeat.prototype.$onFrameEnter = function () {
            var timestamp = suncore.System.engine.getTime();
            if (this.$lastRecvTime < this.$lastSendTime) {
                if (timestamp - this.$lastSendTime > 6000) {
                    this.$lastRecvTime = this.$lastSendTime;
                    this.$connection.close(true);
                }
            }
            else if (timestamp - this.$lastSendTime > 5000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                this.$lastSendTime = timestamp;
                this.$connection.sendPB(HeartbeatCommandEnum.REQUEST);
            }
        };
        NetConnectionHeartBeat.prototype.recv = function (cmd, srvId, buffer, data) {
            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                this.$lastRecvTime = suncore.System.engine.getTime();
            }
            return [cmd, srvId, buffer, data];
        };
        return NetConnectionHeartBeat;
    }(NetConnectionInterceptor));
    sunnet.NetConnectionHeartBeat = NetConnectionHeartBeat;
})(sunnet || (sunnet = {}));