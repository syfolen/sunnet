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
var suntdd;
(function (suntdd) {
    var MSWSConnectionStateEnum;
    (function (MSWSConnectionStateEnum) {
        MSWSConnectionStateEnum[MSWSConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        MSWSConnectionStateEnum[MSWSConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        MSWSConnectionStateEnum[MSWSConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(MSWSConnectionStateEnum = suntdd.MSWSConnectionStateEnum || (suntdd.MSWSConnectionStateEnum = {}));
    var MSWSStateEnum;
    (function (MSWSStateEnum) {
        MSWSStateEnum[MSWSStateEnum["CONNECTED"] = 0] = "CONNECTED";
        MSWSStateEnum[MSWSStateEnum["CLOSE"] = 1] = "CLOSE";
        MSWSStateEnum[MSWSStateEnum["ERROR"] = 2] = "ERROR";
    })(MSWSStateEnum = suntdd.MSWSStateEnum || (suntdd.MSWSStateEnum = {}));
    var TestActionKindEnum;
    (function (TestActionKindEnum) {
        TestActionKindEnum[TestActionKindEnum["NONE"] = 0] = "NONE";
        TestActionKindEnum[TestActionKindEnum["BUTTON_CLICK"] = 1] = "BUTTON_CLICK";
        TestActionKindEnum[TestActionKindEnum["SIGNAL_EMIT"] = 2] = "SIGNAL_EMIT";
        TestActionKindEnum[TestActionKindEnum["SIGNAL_WAIT"] = 3] = "SIGNAL_WAIT";
        TestActionKindEnum[TestActionKindEnum["WS_STATE"] = 4] = "WS_STATE";
        TestActionKindEnum[TestActionKindEnum["WS_PROTOCAL"] = 5] = "WS_PROTOCAL";
    })(TestActionKindEnum = suntdd.TestActionKindEnum || (suntdd.TestActionKindEnum = {}));
    var TestActionResultEnum;
    (function (TestActionResultEnum) {
        TestActionResultEnum[TestActionResultEnum["NONE"] = 1] = "NONE";
        TestActionResultEnum[TestActionResultEnum["NOT_YET"] = 2] = "NOT_YET";
        TestActionResultEnum[TestActionResultEnum["COMPLETE"] = 4] = "COMPLETE";
        TestActionResultEnum[TestActionResultEnum["SUSPEND"] = 8] = "SUSPEND";
    })(TestActionResultEnum = suntdd.TestActionResultEnum || (suntdd.TestActionResultEnum = {}));
    var TestCaseRegOptionEnum;
    (function (TestCaseRegOptionEnum) {
        TestCaseRegOptionEnum[TestCaseRegOptionEnum["INSERT"] = 0] = "INSERT";
        TestCaseRegOptionEnum[TestCaseRegOptionEnum["APPEND"] = 1] = "APPEND";
    })(TestCaseRegOptionEnum = suntdd.TestCaseRegOptionEnum || (suntdd.TestCaseRegOptionEnum = {}));
    var TestCaseStatusEnum;
    (function (TestCaseStatusEnum) {
        TestCaseStatusEnum[TestCaseStatusEnum["PREPARE"] = 0] = "PREPARE";
        TestCaseStatusEnum[TestCaseStatusEnum["EXECUTE"] = 1] = "EXECUTE";
        TestCaseStatusEnum[TestCaseStatusEnum["FINISH"] = 2] = "FINISH";
    })(TestCaseStatusEnum = suntdd.TestCaseStatusEnum || (suntdd.TestCaseStatusEnum = {}));
    var CancelCommand = (function (_super) {
        __extends(CancelCommand, _super);
        function CancelCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CancelCommand.prototype.execute = function (id) {
            delete M.buttonMap[id];
            var cfgs = M.waitMap[id] || null;
            if (cfgs === null) {
                return;
            }
            for (var i = 0; i < cfgs.length; i++) {
                var cfg = cfgs[i];
                if (cfg.line === true) {
                    continue;
                }
                cfg.canceled = true;
            }
        };
        return CancelCommand;
    }(puremvc.SimpleCommand));
    suntdd.CancelCommand = CancelCommand;
    var ClickCommand = (function (_super) {
        __extends(ClickCommand, _super);
        function ClickCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClickCommand.prototype.execute = function (id) {
            var cfg = {
                id: id
            };
            this.facade.sendNotification(NotifyKey.ADD_ACTION, [TestActionKindEnum.BUTTON_CLICK, cfg]);
        };
        return ClickCommand;
    }(puremvc.SimpleCommand));
    suntdd.ClickCommand = ClickCommand;
    var DoClickCommand = (function (_super) {
        __extends(DoClickCommand, _super);
        function DoClickCommand() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$click = null;
            _this.$button = null;
            return _this;
        }
        DoClickCommand.prototype.execute = function (click) {
            this.$click = click;
            this.$button = M.buttonMap[click.id] || null;
            suncom.Test.expect(this.$button).not.toBeNull();
            if (this.$button.once === true) {
                delete M.buttonMap[click.id];
            }
            suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 500, this.$doClick, this);
        };
        DoClickCommand.prototype.$doClick = function () {
            var event = new Laya.Event();
            event.setTo(Laya.Event.CLICK, this.$button.button, this.$button.button);
            this.$button.button.event(Laya.Event.CLICK, event);
            this.$click.done = true;
        };
        return DoClickCommand;
    }(puremvc.SimpleCommand));
    suntdd.DoClickCommand = DoClickCommand;
    var DoEmitCommand = (function (_super) {
        __extends(DoEmitCommand, _super);
        function DoEmitCommand() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$cfg = null;
            return _this;
        }
        DoEmitCommand.prototype.execute = function (cfg) {
            this.$cfg = cfg;
            suncom.Test.expect(cfg.id).toBeGreaterThan(0);
            if (cfg.delay <= 0) {
                this.$doEmit();
            }
            else {
                suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, cfg.delay, this.$doEmit, this);
            }
        };
        DoEmitCommand.prototype.$doEmit = function () {
            suncom.Test.expect(M.currentSignalId).interpret("\u4FE1\u53F7\u53D1\u5C04\u5E72\u6270").toBe(0);
            M.currentSignalId = this.$cfg.id;
            var array = M.waitMap[this.$cfg.id] || null;
            if (array !== null) {
                for (var i = 0; i < array.length; i++) {
                    var item = array[i];
                    if (item.once === true && item.done === true) {
                        continue;
                    }
                    if (item.once === true) {
                        item.done = true;
                    }
                    if (item.canceled === true) {
                        continue;
                    }
                    var handler = item.handler || null;
                    if (handler === null) {
                        continue;
                    }
                    handler.runWith(this.$cfg.args);
                }
            }
            this.$cfg.done = true;
            M.currentSignalId = 0;
        };
        return DoEmitCommand;
    }(puremvc.SimpleCommand));
    suntdd.DoEmitCommand = DoEmitCommand;
    var EmitCommand = (function (_super) {
        __extends(EmitCommand, _super);
        function EmitCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EmitCommand.prototype.execute = function (id, args, line, delay) {
            var cfg = {
                id: id,
                args: args,
                line: line,
                delay: delay
            };
            if (line === false) {
                this.facade.sendNotification(NotifyKey.DO_EMIT, cfg);
            }
            else {
                this.facade.sendNotification(NotifyKey.ADD_ACTION, [TestActionKindEnum.SIGNAL_EMIT, cfg]);
            }
        };
        return EmitCommand;
    }(puremvc.SimpleCommand));
    suntdd.EmitCommand = EmitCommand;
    var MicroService = (function (_super) {
        __extends(MicroService, _super);
        function MicroService() {
            var _this = _super.call(this, 0) || this;
            _this.$actions = [];
            M.timeDiff = suncom.Mathf.random(-8000, 8000);
            if (suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM) === true) {
                throw Error("\u5FAE\u670D\u52A1\u5668\u672A\u8FD0\u884C\uFF0C\u56E0\u4E3ASYSTEM\u65F6\u95F4\u8F74\u672A\u5F00\u542F");
            }
            return _this;
        }
        MicroService.prototype.$onRun = function () {
            this.facade.registerCommand(NotifyKey.EMIT, EmitCommand);
            this.facade.registerCommand(NotifyKey.WAIT, WaitCommand);
            this.facade.registerCommand(NotifyKey.CLICK, ClickCommand);
            this.facade.registerCommand(NotifyKey.CANCEL, CancelCommand);
            this.facade.registerCommand(NotifyKey.DO_EMIT, DoEmitCommand);
            this.facade.registerCommand(NotifyKey.DO_CLICK, DoClickCommand);
            this.facade.registerCommand(NotifyKey.REG_BUTTON, RegButtonCommand);
            this.facade.registerCommand(NotifyKey.PREPARE_PROTOCAL_PACKET, PrepareProtocalPacketCommand);
            this.facade.registerCommand(NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET, SerializeWebSocketStatePacketCommand);
            this.facade.registerCommand(NotifyKey.SERIALIZE_WEBSOCKET_PROTOCAL_PACKET, SerializeWebSocketProtocalPacketCommand);
            this.facade.registerObserver(NotifyKey.ADD_WAIT, this.$addWait, this);
            this.facade.registerObserver(NotifyKey.ADD_ACTION, this.$addAction, this);
            this.facade.registerObserver(NotifyKey.TEST_WEBSOCKET_SEND_DATA, this.$onWebSocketSendData, this);
        };
        MicroService.prototype.$onStop = function () {
            this.facade.removeCommand(NotifyKey.EMIT);
            this.facade.removeCommand(NotifyKey.WAIT);
            this.facade.removeCommand(NotifyKey.CLICK);
            this.facade.removeCommand(NotifyKey.CANCEL);
            this.facade.removeCommand(NotifyKey.DO_EMIT);
            this.facade.removeCommand(NotifyKey.DO_CLICK);
            this.facade.removeCommand(NotifyKey.REG_BUTTON);
            this.facade.removeCommand(NotifyKey.PREPARE_PROTOCAL_PACKET);
            this.facade.removeCommand(NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET);
            this.facade.removeCommand(NotifyKey.SERIALIZE_WEBSOCKET_PROTOCAL_PACKET);
            this.facade.removeObserver(NotifyKey.ADD_WAIT, this.$addWait, this);
            this.facade.removeObserver(NotifyKey.ADD_ACTION, this.$addAction, this);
            this.facade.removeObserver(NotifyKey.TEST_WEBSOCKET_SEND_DATA, this.$onWebSocketSendData, this);
        };
        MicroService.prototype.$frameLoop = function () {
            var protocalNotified = false;
            while (this.$actions.length > 0) {
                var action = this.$actions[0];
                var result = TestActionResultEnum.NONE;
                switch (action.kind) {
                    case TestActionKindEnum.SIGNAL_WAIT:
                        result = this.$doWait(action.cfg);
                        break;
                    case TestActionKindEnum.SIGNAL_EMIT:
                        result = this.$doEmit(action.cfg);
                        break;
                    case TestActionKindEnum.BUTTON_CLICK:
                        result = this.$doClick(action.cfg);
                        break;
                    case TestActionKindEnum.WS_STATE:
                        result = this.$notifyStatePacket(action.cfg);
                        break;
                    case TestActionKindEnum.WS_PROTOCAL:
                        result = this.$notifyProtocalPacket(action.cfg);
                        break;
                    default:
                        suncom.Test.notExpected();
                        break;
                }
                if (result & TestActionResultEnum.NOT_YET) {
                    break;
                }
                if (result & TestActionResultEnum.COMPLETE) {
                    this.$actions.shift();
                }
                if (result & TestActionResultEnum.SUSPEND) {
                    break;
                }
                if (action.kind === TestActionKindEnum.WS_PROTOCAL) {
                    protocalNotified = true;
                }
                if (protocalNotified === true && this.$actions.length > 0) {
                    var next = this.$actions[0];
                    if (next.kind === TestActionKindEnum.WS_PROTOCAL) {
                        var packet = next.cfg;
                        if (packet.asNewMsg === true) {
                            break;
                        }
                    }
                }
            }
            if (this.$actions.length > 0) {
                return;
            }
            if (M.currentTestCase === null) {
                var cfg = M.tccQueue.shift() || null;
                M.currentTestCase = cfg === null ? null : new cfg.taskCls(cfg.tcId);
            }
            else if (M.currentTestCase.status === TestCaseStatusEnum.EXECUTE) {
                M.currentTestCase.done();
            }
            else if (M.currentTestCase.status === TestCaseStatusEnum.FINISH) {
                suncom.Test.expect(this.$actions.length).toBe(0);
                M.currentTestCase = null;
            }
        };
        MicroService.prototype.$onWebSocketSendData = function (name) {
            for (var i = 0; i < this.$actions.length; i++) {
                var action = this.$actions[i];
                if (action.kind === TestActionKindEnum.WS_PROTOCAL) {
                    var packet = action.cfg;
                    if (packet.waitName === name && packet.waitTimes > 0 && packet.waitCount < packet.waitTimes) {
                        packet.waitCount++;
                    }
                    break;
                }
            }
        };
        MicroService.prototype.$addAction = function (kind, cfg) {
            var action = {
                kind: kind,
                cfg: cfg
            };
            this.$actions.push(action);
        };
        MicroService.prototype.$addWait = function (cfg) {
            var array = M.waitMap[cfg.id] || null;
            if (array === null) {
                array = M.waitMap[cfg.id] = [];
            }
            var index = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === cfg) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                array.push(cfg);
            }
        };
        MicroService.prototype.$notifyProtocalPacket = function (packet) {
            if (this.$notYet(packet) === true) {
                return TestActionResultEnum.NOT_YET;
            }
            this.facade.sendNotification(NotifyKey.PREPARE_PROTOCAL_PACKET, packet);
            this.facade.sendNotification(NotifyKey.TEST_WEBSOCKET_PROTOCAL, [packet.replyName, packet.data]);
            if (packet.repeatTimes === 1) {
                return TestActionResultEnum.COMPLETE;
            }
            packet.repeatTimes--;
            packet.waitCount = 0;
            delete packet.createTime;
            return TestActionResultEnum.SUSPEND;
        };
        MicroService.prototype.$notifyStatePacket = function (packet) {
            var out = {
                name: packet.connName,
                state: MSWSConnectionStateEnum.DISCONNECTED
            };
            this.facade.sendNotification(NotifyKey.GET_WEBSOCKET_INFO, out);
            if (out.state === MSWSConnectionStateEnum.DISCONNECTED) {
                return TestActionResultEnum.NOT_YET;
            }
            if (this.$notYet(packet) === true) {
                return TestActionResultEnum.NOT_YET;
            }
            if (out.state === MSWSConnectionStateEnum.CONNECTING) {
                suncom.Test.assertTrue(packet.state === MSWSStateEnum.CONNECTED || packet.state === MSWSStateEnum.ERROR, "\u5F53\u524D\u7F51\u7EDC\u6B63\u5728\u8FDE\u63A5\uFF0C\u4EC5\u5141\u8BB8\u4E0B\u884CCONNECTED\u6216ERROR\u72B6\u6001");
            }
            else if (out.state === MSWSConnectionStateEnum.CONNECTED) {
                suncom.Test.assertTrue(packet.state === MSWSStateEnum.CLOSE || packet.state === MSWSStateEnum.ERROR, "\u5F53\u524D\u7F51\u7EDC\u5DF1\u8FDE\u63A5\uFF0C\u4EC5\u5141\u8BB8\u4E0B\u884CCLOSE\u6216ERROR\u72B6\u6001");
            }
            this.facade.sendNotification(NotifyKey.TEST_WEBSOCKET_STATE, packet.state);
            return TestActionResultEnum.COMPLETE & TestActionResultEnum.SUSPEND;
        };
        MicroService.prototype.$notYet = function (packet) {
            if (packet.waitName !== null && packet.waitCount < packet.waitTimes) {
                return true;
            }
            if (packet.createTime === void 0) {
                packet.createTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            if (packet.createTime + packet.delay > suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return true;
            }
            if (packet.asNewMsg === true && packet.createTime === suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return true;
            }
            return false;
        };
        MicroService.prototype.$doClick = function (cfg) {
            if (cfg.actTime === void 0) {
                if (M.buttonMap[cfg.id] === void 0) {
                    return TestActionResultEnum.NOT_YET;
                }
                cfg.actTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
                this.facade.sendNotification(NotifyKey.DO_CLICK, cfg);
                return TestActionResultEnum.NONE;
            }
            else if (cfg.done === true) {
                return TestActionResultEnum.COMPLETE;
            }
            else {
                return TestActionResultEnum.NOT_YET;
            }
        };
        MicroService.prototype.$doEmit = function (cfg) {
            if (cfg.done === true) {
                return TestActionResultEnum.COMPLETE;
            }
            if (cfg.actTime === void 0) {
                cfg.actTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
                this.facade.sendNotification(NotifyKey.DO_EMIT, cfg);
            }
            else {
                return TestActionResultEnum.NOT_YET;
            }
            return TestActionResultEnum.NONE;
        };
        MicroService.prototype.$doWait = function (cfg) {
            if (cfg.done === true) {
                return TestActionResultEnum.COMPLETE;
            }
            if (cfg.actTime === void 0) {
                cfg.actTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
                this.$addWait(cfg);
            }
            else {
                return TestActionResultEnum.NOT_YET;
            }
            return TestActionResultEnum.NONE;
        };
        return MicroService;
    }(suncore.BaseService));
    suntdd.MicroService = MicroService;
    var PrepareProtocalPacketCommand = (function (_super) {
        __extends(PrepareProtocalPacketCommand, _super);
        function PrepareProtocalPacketCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PrepareProtocalPacketCommand.prototype.execute = function (packet) {
            if (packet.data === null) {
                return;
            }
            for (var i = 0; i < packet.hashFileds.length; i++) {
                this.$setFieldValue(packet.data, packet.hashFileds[i], suncom.Common.createHashId());
            }
            for (var i = 0; i < packet.timeFields.length; i++) {
                var timeFiled = packet.timeFields[i];
                var timestamp = new Date().valueOf() + M.timeDiff + timeFiled.arg1;
                this.$setFieldValue(packet.data, timeFiled.arg2, dcodeIO.Long.fromNumber(timestamp));
            }
        };
        PrepareProtocalPacketCommand.prototype.$setFieldValue = function (data, field, value) {
            var array = field.split(".");
            while (array.length > 1) {
                data = data[array.shift()];
            }
            data[array.shift()] = value;
        };
        return PrepareProtocalPacketCommand;
    }(puremvc.SimpleCommand));
    suntdd.PrepareProtocalPacketCommand = PrepareProtocalPacketCommand;
    var RegButtonCommand = (function (_super) {
        __extends(RegButtonCommand, _super);
        function RegButtonCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegButtonCommand.prototype.execute = function (id, button, once) {
            suncom.Test.expect(button).anything();
            suncom.Test.expect(M.buttonMap[id]).toBeUndefined();
            var cfg = {
                button: button,
                once: once
            };
            M.buttonMap[id] = cfg;
        };
        return RegButtonCommand;
    }(puremvc.SimpleCommand));
    suntdd.RegButtonCommand = RegButtonCommand;
    var SerializeWebSocketPacketCommand = (function (_super) {
        __extends(SerializeWebSocketPacketCommand, _super);
        function SerializeWebSocketPacketCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SerializeWebSocketPacketCommand.prototype.$initializePacket = function (packet) {
            if (packet.delay === void 0) {
                packet.delay = 0;
            }
            if (packet.connName === void 0) {
                packet.connName = "default";
            }
            if (packet.asNewMsg === void 0) {
                packet.asNewMsg = true;
            }
            if (packet.waitName === void 0) {
                packet.waitName = null;
            }
            if (packet.waitTimes === void 0) {
                packet.waitTimes = 1;
            }
            packet.waitCount = 0;
            suncom.Test.expect(packet.delay).interpret("消息下行延时必须大于或等于0").toBeGreaterOrEqualThan(0);
            suncom.Test.expect(packet.waitTimes).interpret("消息上行等待次数必须大于0").toBeGreaterThan(0);
        };
        SerializeWebSocketPacketCommand.prototype.$initializePacketDefaultValue = function (packet, timeFields, hashFields) {
            if (timeFields === void 0) { timeFields = []; }
            if (hashFields === void 0) { hashFields = []; }
            if (packet.data === null) {
                return;
            }
            packet.hashFileds = hashFields;
            packet.timeFields = [];
            for (var i = 0; i < timeFields.length; i++) {
                var value = this.$getFieldValue(packet.data, timeFields[i], 0);
                packet.timeFields.push({
                    arg1: value,
                    arg2: timeFields[i]
                });
            }
        };
        SerializeWebSocketPacketCommand.prototype.$getFieldValue = function (data, field, defaultValue) {
            var array = field.split(".");
            while (array.length > 0) {
                data = data[array.shift()];
            }
            return data === void 0 ? defaultValue : data;
        };
        return SerializeWebSocketPacketCommand;
    }(puremvc.SimpleCommand));
    suntdd.SerializeWebSocketPacketCommand = SerializeWebSocketPacketCommand;
    var SerializeWebSocketProtocalPacketCommand = (function (_super) {
        __extends(SerializeWebSocketProtocalPacketCommand, _super);
        function SerializeWebSocketProtocalPacketCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SerializeWebSocketProtocalPacketCommand.prototype.execute = function (packet, timeFields, hashFields) {
            this.$initializePacket(packet);
            if (packet.data === void 0) {
                packet.data = null;
            }
            if (packet.replyName === void 0) {
                packet.replyName = null;
            }
            if (packet.repeatTimes === void 0) {
                packet.repeatTimes = 1;
            }
            this.$initializePacketDefaultValue(packet, timeFields, hashFields);
            suncom.Test.expect(packet.repeatTimes).interpret("消息的下行次数必须大于或等于1").toBeGreaterOrEqualThan(1);
            this.facade.sendNotification(NotifyKey.ADD_ACTION, [TestActionKindEnum.WS_PROTOCAL, packet]);
        };
        return SerializeWebSocketProtocalPacketCommand;
    }(SerializeWebSocketPacketCommand));
    suntdd.SerializeWebSocketProtocalPacketCommand = SerializeWebSocketProtocalPacketCommand;
    var SerializeWebSocketStatePacketCommand = (function (_super) {
        __extends(SerializeWebSocketStatePacketCommand, _super);
        function SerializeWebSocketStatePacketCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SerializeWebSocketStatePacketCommand.prototype.execute = function (packet) {
            this.$initializePacket(packet);
            suncom.Test.expect(packet.state).interpret("必须指定WebSocket状态包的状态值").not.toBeUndefined();
            this.facade.sendNotification(NotifyKey.ADD_ACTION, [TestActionKindEnum.WS_STATE, packet]);
        };
        return SerializeWebSocketStatePacketCommand;
    }(SerializeWebSocketPacketCommand));
    suntdd.SerializeWebSocketStatePacketCommand = SerializeWebSocketStatePacketCommand;
    var TestCase = (function (_super) {
        __extends(TestCase, _super);
        function TestCase(caseId) {
            var _this = _super.call(this, 0) || this;
            _this.$status = TestCaseStatusEnum.PREPARE;
            _this.$caseId = caseId;
            M.currentTestCase = _this;
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(_this, _this.$doPrepare));
            return _this;
        }
        TestCase.prototype.done = function () {
            this.$afterAll();
            this.$status = TestCaseStatusEnum.FINISH;
        };
        TestCase.prototype.$doPrepare = function () {
            this.$status = TestCaseStatusEnum.EXECUTE;
            this.$beforeAll();
        };
        TestCase.prototype.$addTest = function (tcId, taskCls, regOption) {
            if (regOption === void 0) { regOption = TestCaseRegOptionEnum.APPEND; }
            var cfg = {
                tcId: tcId,
                taskCls: taskCls
            };
            if (regOption === TestCaseRegOptionEnum.APPEND) {
                M.tccQueue.push(cfg);
            }
            else {
                M.tccQueue.unshift(cfg);
            }
        };
        TestCase.prototype.$describe = function (str) {
            suncom.Logger.log(suncom.DebugMode.TDD, str);
        };
        TestCase.prototype.$beforeAll = function () {
        };
        TestCase.prototype.$afterAll = function () {
        };
        TestCase.prototype.$emit = function (id, args, delay) {
            if (delay === void 0) { delay = 0; }
            this.facade.sendNotification(NotifyKey.EMIT, [id, args, true, delay]);
        };
        TestCase.prototype.$wait = function (id, handler, line, once) {
            if (handler === void 0) { handler = null; }
            if (line === void 0) { line = true; }
            if (once === void 0) { once = true; }
            if (line === true) {
                once = true;
            }
            else {
                suncom.Test.expect(handler).interpret("\u5F53\u53C2\u6570line\u4E3Afalse\u65F6\u5FC5\u987B\u6307\u5B9Ahandler").toBeInstanceOf(suncom.Handler);
            }
            this.facade.sendNotification(NotifyKey.WAIT, [id, handler, line, once]);
        };
        TestCase.prototype.$click = function (id) {
            this.facade.sendNotification(NotifyKey.CLICK, id);
        };
        TestCase.prototype.$cancel = function (id) {
            this.facade.sendNotification(NotifyKey.CANCEL, id);
        };
        TestCase.prototype.$serializeWebSocketStatePacket = function (packet) {
            this.facade.sendNotification(NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET, packet);
        };
        TestCase.prototype.$serializeWebSocketProtocalPacket = function (packet, data, timeFields, hashFields) {
            packet.data = data;
            this.facade.sendNotification(NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET, [packet, timeFields, hashFields]);
        };
        Object.defineProperty(TestCase.prototype, "status", {
            get: function () {
                return this.$status;
            },
            enumerable: true,
            configurable: true
        });
        return TestCase;
    }(puremvc.Notifier));
    suntdd.TestCase = TestCase;
    var WaitCommand = (function (_super) {
        __extends(WaitCommand, _super);
        function WaitCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WaitCommand.prototype.execute = function (id, handler, line, once) {
            var cfg = {
                id: id,
                handler: handler,
                line: line,
                once: once
            };
            if (line === true) {
                this.facade.sendNotification(NotifyKey.ADD_ACTION, [TestActionKindEnum.SIGNAL_WAIT, cfg]);
            }
            else {
                this.facade.sendNotification(NotifyKey.ADD_WAIT, cfg);
            }
        };
        return WaitCommand;
    }(puremvc.SimpleCommand));
    suntdd.WaitCommand = WaitCommand;
    var M;
    (function (M) {
        M.timeDiff = 0;
        M.currentSignalId = 0;
        M.currentTestCase = null;
        M.tccQueue = [];
        M.waitMap = {};
        M.buttonMap = {};
    })(M = suntdd.M || (suntdd.M = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.EMIT = "suntdd.NotifyKey.EMIT";
        NotifyKey.WAIT = "suntdd.NotifyKey.WAIT";
        NotifyKey.DO_EMIT = "suntdd.NotifyKey.DO_EMIT";
        NotifyKey.CANCEL = "suntdd.NotifyKey.CANCEL";
        NotifyKey.CLICK = "suntdd.NotifyKey.CLICK";
        NotifyKey.DO_CLICK = "suntdd.NotifyKey.DO_CLICK";
        NotifyKey.REG_BUTTON = "suntdd.NotifyKey.REG_BUTTON";
        NotifyKey.ADD_WAIT = "suntdd.NotifyKey.ADD_WAIT";
        NotifyKey.ADD_ACTION = "suntdd.NotifyKey.ADD_ACTION";
        NotifyKey.GET_WEBSOCKET_INFO = "suntdd.NotifyKey.GET_WEBSOCKET_INFO";
        NotifyKey.TEST_WEBSOCKET_STATE = "suntdd.NotifyKey.TEST_WEBSOCKET_STATE";
        NotifyKey.TEST_WEBSOCKET_PROTOCAL = "suntdd.NotifyKey.TEST_WEBSOCKET_PROTOCAL";
        NotifyKey.TEST_WEBSOCKET_SEND_DATA = "suntdd.NotifyKey.TEST_WEBSOCKET_SEND_DATA";
        NotifyKey.PREPARE_PROTOCAL_PACKET = "suntdd.NotifyKey.PREPARE_PROTOCAL_PACKET";
        NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET = "suntdd.NotifyKey.SERIALIZE_WEBSOCKET_STATE_PACKET";
        NotifyKey.SERIALIZE_WEBSOCKET_PROTOCAL_PACKET = "suntdd.NotifyKey.SERIALIZE_WEBSOCKET_PROTOCAL_PACKET";
    })(NotifyKey = suntdd.NotifyKey || (suntdd.NotifyKey = {}));
    var Test;
    (function (Test) {
        function emit(id, args, delay) {
            if (delay === void 0) { delay = 0; }
            puremvc.Facade.getInstance().sendNotification(NotifyKey.EMIT, [id, args, false, delay]);
        }
        Test.emit = emit;
        function regButton(id, button, once) {
            if (once === void 0) { once = true; }
            puremvc.Facade.getInstance().sendNotification(NotifyKey.REG_BUTTON, [id, button, once]);
        }
        Test.regButton = regButton;
    })(Test = suntdd.Test || (suntdd.Test = {}));
})(suntdd || (suntdd = {}));
