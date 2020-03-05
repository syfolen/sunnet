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
var sunui;
(function (sunui) {
    var ConfirmOptionValueEnum;
    (function (ConfirmOptionValueEnum) {
        ConfirmOptionValueEnum[ConfirmOptionValueEnum["NONE"] = 0] = "NONE";
        ConfirmOptionValueEnum[ConfirmOptionValueEnum["YES"] = 1] = "YES";
        ConfirmOptionValueEnum[ConfirmOptionValueEnum["NO"] = 2] = "NO";
        ConfirmOptionValueEnum[ConfirmOptionValueEnum["CANCEL"] = 3] = "CANCEL";
    })(ConfirmOptionValueEnum = sunui.ConfirmOptionValueEnum || (sunui.ConfirmOptionValueEnum = {}));
    var RetryMethodEnum;
    (function (RetryMethodEnum) {
        RetryMethodEnum[RetryMethodEnum["NONE"] = 16] = "NONE";
        RetryMethodEnum[RetryMethodEnum["CONFIRM"] = 32] = "CONFIRM";
    })(RetryMethodEnum = sunui.RetryMethodEnum || (sunui.RetryMethodEnum = {}));
    var UILevel;
    (function (UILevel) {
        UILevel[UILevel["NONE"] = 0] = "NONE";
        UILevel[UILevel["BACKGROUND"] = 1] = "BACKGROUND";
        UILevel[UILevel["SCENE"] = 2] = "SCENE";
        UILevel[UILevel["PANEL"] = 3] = "PANEL";
        UILevel[UILevel["FLOAT"] = 4] = "FLOAT";
        UILevel[UILevel["GOLD_TIPS"] = 5] = "GOLD_TIPS";
        UILevel[UILevel["HIGH_GOLD_TIPS"] = 6] = "HIGH_GOLD_TIPS";
        UILevel[UILevel["NOTICE"] = 7] = "NOTICE";
        UILevel[UILevel["BIGWINNER"] = 8] = "BIGWINNER";
        UILevel[UILevel["MINI_GAME"] = 9] = "MINI_GAME";
        UILevel[UILevel["POPUP"] = 10] = "POPUP";
        UILevel[UILevel["WAITINGBOX"] = 11] = "WAITINGBOX";
        UILevel[UILevel["LOADING"] = 12] = "LOADING";
        UILevel[UILevel["TIPS"] = 13] = "TIPS";
        UILevel[UILevel["TOP"] = 14] = "TOP";
        UILevel[UILevel["DEBUG"] = 15] = "DEBUG";
    })(UILevel = sunui.UILevel || (sunui.UILevel = {}));
    var AbstractPopupCommand = (function (_super) {
        __extends(AbstractPopupCommand, _super);
        function AbstractPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractPopupCommand.prototype.$makeProps = function (props) {
            if (props.x === void 0 && props.left === void 0 && props.right === void 0) {
                props.centerX = 0;
            }
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0) {
                props.centerY = 0;
            }
            if (suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM) === true) {
                props.mod = suncore.ModuleEnum.SYSTEM;
            }
        };
        AbstractPopupCommand.prototype.$applyShowProps = function (view, props, duration) {
            if (props.x !== void 0) {
                view.x = props.x;
            }
            if (props.y !== void 0) {
                view.y = props.y;
            }
            if (props.centerX !== void 0) {
                view.centerX = props.centerX;
            }
            if (props.centerY !== void 0) {
                view.centerY = props.centerY;
            }
            if (duration === 0) {
                if (props.left !== void 0) {
                    view.left = props.left;
                }
                if (props.right !== void 0) {
                    view.right = props.right;
                }
                if (props.top !== void 0) {
                    view.top = props.top;
                }
                if (props.bottom !== void 0) {
                    view.bottom = props.bottom;
                }
            }
            else {
                if (props.left !== void 0) {
                    view.left = -view.width;
                }
                if (props.right !== void 0) {
                    view.right = -view.width;
                }
                if (props.top !== void 0) {
                    view.top = -view.height;
                }
                if (props.bottom !== void 0) {
                    view.bottom = -view.height;
                }
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    view.alpha = 0;
                    view.scaleX = 0;
                    view.scaleY = 0;
                    props.alpha = 1;
                    props.scaleX = 1;
                    props.scaleY = 1;
                }
                Tween.get(view, props.mod).to(props, duration, props.ease);
            }
        };
        AbstractPopupCommand.prototype.$applyCloseProps = function (view, props, duration) {
            if (duration > 0) {
                if (props.left !== void 0) {
                    props.left = -view.width;
                }
                if (props.right !== void 0) {
                    props.right = -view.width;
                }
                if (props.top !== void 0) {
                    props.top = -view.height;
                }
                if (props.bottom !== void 0) {
                    props.bottom = -view.height;
                }
                if (props.left === void 0 && props.right === void 0 && props.top === void 0 && props.bottom === void 0) {
                    props.alpha = 0;
                    props.scaleX = 0;
                    props.scaleY = 0;
                }
                Tween.get(view, props.mod).to(props, duration);
            }
        };
        return AbstractPopupCommand;
    }(puremvc.SimpleCommand));
    sunui.AbstractPopupCommand = AbstractPopupCommand;
    var AbstractSceneIniClass = (function (_super) {
        __extends(AbstractSceneIniClass, _super);
        function AbstractSceneIniClass(data) {
            var _this = _super.call(this) || this;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, true);
            return _this;
        }
        AbstractSceneIniClass.prototype.run = function () {
            return true;
        };
        AbstractSceneIniClass.prototype.$onEnterScene = function () {
        };
        return AbstractSceneIniClass;
    }(suncore.AbstractTask));
    sunui.AbstractSceneIniClass = AbstractSceneIniClass;
    var ClosePopupCommand = (function (_super) {
        __extends(ClosePopupCommand, _super);
        function ClosePopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClosePopupCommand.prototype.execute = function (view, duration, destroy) {
            var info = M.viewLayer.getInfoByView(view);
            if (info === null) {
                console.error(view + "[" + view.name + "]'s infomation is not exist.");
                return;
            }
            if (info.closed === true) {
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }
            info.closed = true;
            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);
            this.$applyCloseProps(view, info.props, duration);
            if (info.props.trans === false) {
                var tween = Tween.get(info.mask, info.props.mod);
                if (duration > 200) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }
            var handler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
            suncore.System.addTrigger(info.props.mod, duration, handler);
        };
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            M.viewLayer.removeStackByView(view);
        };
        return ClosePopupCommand;
    }(AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            var _this = _super.call(this) || this;
            _this.$hashId = suncom.Common.createHashId();
            _this.$url = null;
            _this.$templet = null;
            _this.$handler = null;
            _this.$loading = false;
            _this.$retryer = null;
            _this.$retryer = new Retryer(RetryMethodEnum.CONFIRM | suncore.ModuleEnum.SYSTEM, suncom.Handler.create(_this, _this.$onRetryConfirmed, [_this.$hashId]), "资源加载失败，点击确定重新尝试！", ConfirmOptionValueEnum.YES, "确定", ConfirmOptionValueEnum.NO, "取消");
            return _this;
        }
        Loader.prototype.load = function (url, handler) {
            if (this.$loading === false) {
                this.$loading = true;
                this.$url = url;
                this.$handler = handler;
                this.$doLoad();
            }
        };
        Loader.prototype.$doLoad = function () {
            if (this.$templet === null) {
                Laya.loader.load(Resource.getLoadList(this.$url), Laya.Handler.create(this, this.$onLoad));
            }
            else {
                this.$templet.loadAni(this.$url);
            }
        };
        Loader.prototype.$onLoad = function (ok) {
            if (ok === false) {
                this.$retryer.run(1000, suncom.Handler.create(this, this.$doLoad), 2);
            }
            else if (this.getResExtByUrl(this.$url) === "sk" && this.$templet === null) {
                this.$templet = new Laya.Templet();
                this.$templet.on(Laya.Event.ERROR, this, this.$onLoad, [false]);
                this.$templet.on(Laya.Event.COMPLETE, this, this.$onLoad, [true]);
                this.$templet.loadAni(this.$url);
            }
            else {
                this.$loading = false;
                this.$handler.run();
            }
        };
        Loader.prototype.$onRetryConfirmed = function (hashId, option) {
            if (this.$hashId === hashId) {
                if (option === ConfirmOptionValueEnum.YES) {
                    this.$doLoad();
                    this.$retryer.reset();
                }
                else {
                    this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
                }
            }
        };
        Loader.prototype.destroy = function () {
            this.$hashId = 0;
            this.$handler = null;
            this.$loading = false;
            if (this.$templet !== null) {
                this.$templet.off(Laya.Event.ERROR, this, this.$onLoad);
                this.$templet.off(Laya.Event.COMPLETE, this, this.$onLoad);
                this.$templet.destroy();
                this.$templet = null;
            }
        };
        Loader.prototype.getResExtByUrl = function (url) {
            return url.substr(url.lastIndexOf(".") + 1);
        };
        Loader.prototype.create = function () {
            var res = null;
            if (this.$templet === null) {
                res = Laya.loader.getRes(this.$url) || null;
            }
            else {
                res = this.$templet.buildArmature(2) || null;
            }
            if (res === null) {
                throw Error("\u8D44\u6E90\u9884\u52A0\u8F7D\u51FA\u9519 url:" + this.$url);
            }
            return res;
        };
        Object.defineProperty(Loader.prototype, "loading", {
            get: function () {
                return this.$loading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "url", {
            get: function () {
                return this.$url;
            },
            enumerable: true,
            configurable: true
        });
        return Loader;
    }(puremvc.Notifier));
    sunui.Loader = Loader;
    var RegisterScenesCommand = (function (_super) {
        __extends(RegisterScenesCommand, _super);
        function RegisterScenesCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegisterScenesCommand.prototype.execute = function (infos) {
            for (var i = 0; i < infos.length; i++) {
                var info = infos[i];
                SceneManager.regScene(info);
            }
        };
        return RegisterScenesCommand;
    }(puremvc.SimpleCommand));
    sunui.RegisterScenesCommand = RegisterScenesCommand;
    var Retryer = (function (_super) {
        __extends(Retryer, _super);
        function Retryer(modOrMethod, confirmHandler, prompt) {
            if (confirmHandler === void 0) { confirmHandler = null; }
            if (prompt === void 0) { prompt = null; }
            var options = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                options[_i - 3] = arguments[_i];
            }
            var _this = _super.call(this, suncore.MsgQModEnum.MMI) || this;
            _this.$options = [];
            _this.$currentRetries = 0;
            _this.$retryHandler = null;
            _this.$retryTimerId = 0;
            _this.$prompting = false;
            if ((modOrMethod & RetryMethodEnum.CONFIRM) === RetryMethodEnum.CONFIRM) {
                _this.$method = RetryMethodEnum.CONFIRM;
            }
            else {
                _this.$method = RetryMethodEnum.NONE;
            }
            var mode = modOrMethod &= 0xF;
            if (modOrMethod === suncore.ModuleEnum.CUSTOM || modOrMethod === suncore.ModuleEnum.TIMELINE) {
                _this.$mod = modOrMethod;
            }
            else {
                _this.$mod = suncore.ModuleEnum.SYSTEM;
            }
            _this.$prompt = prompt;
            _this.$options = options;
            _this.$confirmHandler = confirmHandler;
            return _this;
        }
        Retryer.prototype.run = function (delay, handler, maxRetries) {
            if (maxRetries === void 0) { maxRetries = 2; }
            if (this.$currentRetries < maxRetries) {
                if (this.$retryTimerId === 0) {
                    this.$retryHandler = handler;
                    this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$onRetryTimer, this, 1);
                }
                else {
                    console.warn("\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u8BF7\u6C42 method:" + suncom.Common.getMethodName(handler.method, handler.caller) + ", caller:" + suncom.Common.getQualifiedClassName(handler.caller));
                }
            }
            else if (this.$method === RetryMethodEnum.NONE) {
                this.$confirmHandler.runWith(ConfirmOptionValueEnum.YES);
            }
            else {
                if (this.$prompting === false) {
                    this.$prompting = true;
                    var handler_1 = suncom.Handler.create(this, this.$onConfirmRely);
                    this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$mod, this.$prompt, this.$options, handler_1]);
                }
                else {
                    console.warn("\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u7684\u8BE2\u95EE\u8BF7\u6C42 prompt:" + this.$prompt);
                }
            }
        };
        Retryer.prototype.$onConfirmRely = function (option) {
            if (this.$prompting === true) {
                this.$prompting = false;
                this.$confirmHandler.runWith(option);
            }
        };
        Retryer.prototype.$onRetryTimer = function () {
            this.$retryTimerId = 0;
            this.$currentRetries++;
            this.$retryHandler.run();
        };
        Retryer.prototype.cancel = function () {
            this.$prompting = false;
            this.$retryTimerId = suncore.System.removeTimer(this.$retryTimerId);
        };
        Retryer.prototype.reset = function () {
            this.$currentRetries = 0;
        };
        Object.defineProperty(Retryer.prototype, "currentRetries", {
            get: function () {
                return this.$currentRetries;
            },
            enumerable: true,
            configurable: true
        });
        return Retryer;
    }(puremvc.Notifier));
    sunui.Retryer = Retryer;
    var SceneLayer = (function (_super) {
        __extends(SceneLayer, _super);
        function SceneLayer() {
            var _this = _super.call(this) || this;
            _this.$ready = true;
            _this.$sceneName = 0;
            _this.$uiScene = null;
            _this.$d3Scene = null;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, false, 5);
            return _this;
        }
        SceneLayer.prototype.$enterScene = function (name, data) {
            var str = null;
            if (typeof data === "object") {
                try {
                    str = JSON.stringify(data);
                }
                catch (error) {
                    str = data;
                    suncom.Logger.warn("\u53C2\u6570\u65E0\u6CD5\u8F6C\u5316\u4E3AJSON");
                }
            }
            else {
                str = data;
            }
            var info = SceneManager.getConfigByName(name);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeLoadScene, [info, data]));
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$loadScene, [info, data]));
        };
        SceneLayer.prototype.$beforeLoadScene = function (info, data) {
            this.$sceneName = info.name;
            var task = data === void 0 ? new info.iniCls() : new info.iniCls(data);
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, task);
        };
        SceneLayer.prototype.$loadScene = function (info, data) {
            this.facade.sendNotification(NotifyKey.LOAD_SCENE, [info, data]);
        };
        SceneLayer.prototype.$onEnterScene = function (uiScene, d3Scene) {
            this.$ready = true;
            this.$uiScene = uiScene;
            this.$d3Scene = d3Scene;
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        };
        SceneLayer.prototype.$exitScene = function () {
            var info = SceneManager.getConfigByName(this.$sceneName);
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.uniCls());
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(suncom.Handler.create(this, this.$onExitScene)));
        };
        SceneLayer.prototype.$onExitScene = function () {
            var info = SceneManager.getConfigByName(this.$sceneName);
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, info);
            this.$sceneName = 0;
        };
        SceneLayer.prototype.enterScene = function (name, data) {
            if (this.$ready === false) {
                return false;
            }
            this.$ready = false;
            this.$sceneName != 0 && this.$exitScene();
            this.$enterScene(name, data);
            SceneHeap.addHistory(name, data);
            return true;
        };
        SceneLayer.prototype.exitScene = function () {
            if (this.$ready === false) {
                return;
            }
            this.$ready = false;
            this.$sceneName != 0 && this.$exitScene();
            SceneHeap.removeHistory(this.$sceneName);
            var info = SceneHeap.pop();
            info !== null && this.$enterScene(info.name, info.data);
        };
        SceneLayer.prototype.replaceScene = function (name, data) {
            var info = SceneHeap.pop();
            if (this.enterScene(name, data) === false) {
                return;
            }
            info !== null && SceneHeap.removeHistory(info.name);
        };
        Object.defineProperty(SceneLayer.prototype, "uiScene", {
            get: function () {
                return this.$uiScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "d3Scene", {
            get: function () {
                return this.$d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "sceneName", {
            get: function () {
                return this.$sceneName;
            },
            enumerable: true,
            configurable: true
        });
        return SceneLayer;
    }(puremvc.Notifier));
    sunui.SceneLayer = SceneLayer;
    var ShowPopupCommand = (function (_super) {
        __extends(ShowPopupCommand, _super);
        function ShowPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowPopupCommand.prototype.execute = function (view, duration, props) {
            if (M.viewLayer.getInfoByView(view) !== null) {
                console.error(view + "[" + view.name + "] is already popup.");
                return;
            }
            if (props.mod === void 0) {
                props.mod = suncore.ModuleEnum.CUSTOM;
            }
            if (props.ease === void 0) {
                props.ease = Laya.Ease.backOut;
            }
            if (props.trans === void 0) {
                props.trans = false;
            }
            if (props.keepNode === void 0) {
                props.keepNode = false;
            }
            var args = props.args;
            var trans = props.trans;
            var level = props.level || view.zOrder || UILevel.POPUP;
            var keepNode = props.keepNode;
            delete props.args;
            delete props.trans;
            delete props.level;
            delete props.keepNode;
            this.$makeProps(props);
            var mask = M.viewLayer.createMask(view, trans);
            mask.name = "Mask$" + view.name;
            mask.zOrder = view.zOrder = level;
            var info = {
                view: view,
                mask: mask,
                props: props,
                closed: false,
                keepNode: keepNode,
                displayed: false,
                duration: duration,
                cancelAllowed: false
            };
            M.viewLayer.addToStack(info);
            M.viewLayer.addChild(mask);
            M.viewLayer.addChild(view);
            view["pivot"](view.width * 0.5, view.height * 0.5);
            M.viewLayer.onViewCreate(view, args);
            if (args === void 0) {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, view);
            }
            else if (args instanceof Array) {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view].concat(args));
            }
            else {
                this.facade.sendNotification(NotifyKey.ON_POPUP_CREATED, [view, args]);
            }
            this.$applyShowProps(view, props, duration);
            if (trans === false) {
                Tween.get(mask, info.props.mod).from({ alpha: 0 }, duration > 200 ? 200 : duration);
            }
            var handler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
            suncore.System.addTrigger(info.props.mod, duration, handler);
        };
        ShowPopupCommand.prototype.$onPopupFinish = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
                this.facade.sendNotification(NotifyKey.ON_POPUP_OPENED, view);
            }
        };
        return ShowPopupCommand;
    }(AbstractPopupCommand));
    sunui.ShowPopupCommand = ShowPopupCommand;
    var Templet = (function () {
        function Templet() {
            this.$loader = new Loader();
            this.$referenceCount = 0;
            this.$handlers = [];
        }
        Templet.prototype.create = function (url, method, caller) {
            this.$referenceCount++;
            if (method !== null) {
                this.$handlers.push(suncom.Handler.create(caller, method));
            }
            this.$loader.loading === false && this.$loader.load(url, suncom.Handler.create(this, this.$doCreate));
        };
        Templet.prototype.$doCreate = function () {
            var handlers = this.$handlers.slice(0);
            this.$handlers = [];
            while (handlers.length > 0) {
                var handler = handlers.shift();
                handler.runWith([this.$loader.create(), this.$loader.url]);
            }
        };
        Templet.prototype.destroy = function (url, method, caller) {
            for (var i = 0; i < this.$handlers.length; i++) {
                var handler = this.$handlers[i];
                if (handler.method === method && handler.caller === caller) {
                    this.$handlers.splice(i, 1);
                    break;
                }
            }
            this.$referenceCount--;
            if (this.$referenceCount > 0) {
                return;
            }
            else if (this.$referenceCount < 0) {
                throw Error("\u8D44\u6E90\u8BA1\u6570\u4E0D\u5E94\u5F53\u5C0F\u4E8E0 url:" + url + ", references:" + this.$referenceCount);
            }
            if (this.$referenceCount === 0) {
                this.$loader.destroy();
            }
        };
        Object.defineProperty(Templet.prototype, "referenceCount", {
            get: function () {
                return this.$referenceCount;
            },
            enumerable: true,
            configurable: true
        });
        return Templet;
    }());
    sunui.Templet = Templet;
    var TempletGroup = (function () {
        function TempletGroup(id, urls, handler) {
            this.$id = 0;
            this.$urls = null;
            this.$handler = null;
            this.$doneList = [];
            this.$id = id;
            this.$urls = urls;
            this.$handler = handler;
            for (var i = 0; i < this.$urls.length; i++) {
                var url = this.$urls[i];
                Resource.create(url, this.$onResourceCreated, this);
            }
        }
        TempletGroup.prototype.$onResourceCreated = function (res, url) {
            if (res instanceof Laya.Skeleton) {
                res.destroy();
            }
            this.$doneList.push(url);
            if (this.$doneList.length === this.$urls.length) {
                this.$handler.runWith([this.$id]);
            }
        };
        TempletGroup.prototype.release = function () {
            for (var i = 0; i < this.$urls.length; i++) {
                var url = this.$urls[i];
                Resource.destroy(url, this.$onResourceCreated, this);
            }
        };
        return TempletGroup;
    }());
    sunui.TempletGroup = TempletGroup;
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween(item, mod) {
            var _this = _super.call(this) || this;
            _this.$infos = [];
            _this.$props = null;
            _this.$mod = mod;
            _this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                _this.facade.sendNotification(NotifyKey.ADD_TWEEN_OBJECT, _this);
            }
            else {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u7F13\u52A8\uFF0C\u4F46\u65F6\u95F4\u8F74\u5DF1\u505C\u6B62\uFF0Cmod:" + suncore.ModuleEnum[mod]);
            }
            return _this;
        }
        Tween.prototype.cancel = function () {
            this.$props = null;
            this.$infos.length = 0;
            return this;
        };
        Tween.prototype.to = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, item, props, duration, ease, handler);
            return this;
        };
        Tween.prototype.from = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, props, item, duration, ease, handler);
            return this;
        };
        Tween.prototype.by = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$props === null ? this.$item : this.$props;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (this.$props === null || this.$props[key] === void 0) {
                    props[key] += this.$item[key];
                }
                else {
                    props[key] += item[key];
                }
            }
            this.to(props, duration, ease, handler);
            return this;
        };
        Tween.prototype.$createTweenInfo = function (keys, from, to, duration, ease, handler) {
            this.$props = this.$props || {};
            var actions = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var action = {
                    prop: key,
                    from: from[key],
                    to: to[key]
                };
                if (action.from === void 0) {
                    action.from = this.$item[key];
                }
                actions.push(action);
                this.$props[key] = to[key];
            }
            var info = {
                ease: ease,
                actions: actions,
                handler: handler,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: duration
            };
            this.$infos.push(info);
        };
        Tween.prototype.wait = function (delay) {
            var info = {
                ease: null,
                actions: [],
                handler: null,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: delay
            };
            this.$infos.push(info);
            return this;
        };
        Tween.prototype.doAction = function () {
            var time = suncore.System.getModuleTimestamp(this.$mod);
            var info = this.$infos[0];
            if (this.$item instanceof Laya.Node && this.$item.destroyed === true) {
                this.cancel();
                return;
            }
            var done = false;
            var duration = time - info.time;
            if (duration > info.duration) {
                done = true;
                duration = info.duration;
            }
            var func = info.ease || this.$easeNone;
            for (var i = 0; i < info.actions.length; i++) {
                var action = info.actions[i];
                if (done === true) {
                    this.$item[action.prop] = action.to;
                }
                else {
                    this.$item[action.prop] = func(duration, action.from, action.to - action.from, info.duration);
                }
            }
            if (done === false) {
                return;
            }
            this.$infos.shift();
            if (this.$infos.length > 0) {
                this.$infos[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
            info.handler !== null && info.handler.run();
        };
        Tween.prototype.$easeNone = function (t, b, c, d) {
            var a = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        };
        Object.defineProperty(Tween.prototype, "mod", {
            get: function () {
                return this.$mod;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "canceled", {
            get: function () {
                return this.$infos.length === 0;
            },
            enumerable: true,
            configurable: true
        });
        Tween.get = function (item, mod) {
            if (mod === void 0) { mod = suncore.ModuleEnum.CUSTOM; }
            return new Tween(item, mod);
        };
        return Tween;
    }(puremvc.Notifier));
    sunui.Tween = Tween;
    var TweenService = (function (_super) {
        __extends(TweenService, _super);
        function TweenService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$tweens = [false];
            return _this;
        }
        TweenService.prototype.$onRun = function () {
            this.facade.registerObserver(NotifyKey.ADD_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        };
        TweenService.prototype.$onStop = function () {
            this.facade.removeObserver(NotifyKey.ADD_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        };
        TweenService.prototype.$frameLoop = function () {
            var tweens = this.$tweens;
            this.$tweens[0] = true;
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) === false) {
                    for (var i = tweens.length - 1; i > 0; i--) {
                        var tween = tweens[i];
                        if (tween.mod === mod && tween.canceled === false) {
                            tween.doAction();
                        }
                    }
                }
            }
            this.$tweens[0] = false;
            for (var i = this.$tweens.length - 1; i > 0; i--) {
                var tween = this.$tweens[i];
                if (tween.canceled === true) {
                    tweens.splice(i, 1);
                }
            }
        };
        TweenService.prototype.$onTimelinePause = function (mod, stop) {
            if (stop === true) {
                for (var i = 1; i < this.$tweens.length; i++) {
                    var tween = this.$tweens[i];
                    if (tween.mod === mod) {
                        tween.cancel();
                    }
                }
            }
        };
        TweenService.prototype.$onAddTweenObject = function (tween) {
            if (this.$tweens[0] === true) {
                this.$tweens = this.$tweens.slice(0);
                this.$tweens[0] = false;
            }
            this.$tweens.push(tween);
        };
        return TweenService;
    }(suncore.BaseService));
    sunui.TweenService = TweenService;
    var UIManager = (function (_super) {
        __extends(UIManager, _super);
        function UIManager() {
            var _this = _super.call(this) || this;
            M.viewLayer = new ViewLayerLaya3D();
            M.sceneLayer = new SceneLayer();
            new TweenService().run();
            _this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand);
            _this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand);
            return _this;
        }
        UIManager.getInstance = function () {
            if (UIManager.$inst === null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        };
        UIManager.prototype.enterScene = function (name, data) {
            M.sceneLayer.enterScene(name, data);
        };
        UIManager.prototype.exitScene = function () {
            M.sceneLayer.exitScene();
        };
        UIManager.prototype.replaceScene = function (name, data) {
            M.sceneLayer.replaceScene(name, data);
        };
        UIManager.prototype.removeView = function (view) {
            M.viewLayer.removeStackByView(view);
        };
        Object.defineProperty(UIManager.prototype, "uiScene", {
            get: function () {
                return M.sceneLayer.uiScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "d3Scene", {
            get: function () {
                return M.sceneLayer.d3Scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "sceneName", {
            get: function () {
                return M.sceneLayer.sceneName;
            },
            enumerable: true,
            configurable: true
        });
        UIManager.$inst = null;
        return UIManager;
    }(puremvc.Notifier));
    sunui.UIManager = UIManager;
    var ViewContact = (function (_super) {
        __extends(ViewContact, _super);
        function ViewContact(caller, popup) {
            var _this = _super.call(this) || this;
            _this.$closedHandler = null;
            _this.$removedHandler = null;
            _this.$popup = popup;
            _this.$caller = caller;
            if (M.viewLayer.getInfoByView(popup) === null) {
                throw Error("\u627E\u4E0D\u5230" + popup.name + "\u7684\u5F39\u51FA\u4FE1\u606F\uFF0C\u8BF7\u786E\u8BA4\u5176\u4E3A\u5F39\u51FA\u5BF9\u8C61");
            }
            _this.facade.registerObserver(NotifyKey.ON_POPUP_CLOSED, _this.$onPopupClosed, _this);
            _this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, _this.$onPopupRemoved, _this);
            _this.facade.registerObserver(NotifyKey.EXIT_SCENE, _this.$onCallerDestroy, _this);
            var info = M.viewLayer.getInfoByView(caller);
            if (info !== null) {
                _this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, _this.$onCallerDestroy, _this);
            }
            else {
                _this.facade.registerObserver(NotifyKey.ON_CALLER_DESTROYED, _this.$onCallerDestroy, _this);
            }
            return _this;
        }
        ViewContact.prototype.$onExitScene = function () {
            this.$onCallerDestroy(this.$caller);
        };
        ViewContact.prototype.$onCallerDestroy = function (caller) {
            if (caller === this.$caller) {
                this.facade.removeObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
                this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);
                this.facade.removeObserver(NotifyKey.EXIT_SCENE, this.$onCallerDestroy, this);
                this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
                this.facade.removeObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
            }
        };
        ViewContact.prototype.$onPopupClosed = function (popup) {
            if (popup === this.$popup) {
                if (this.$closedHandler !== null) {
                    this.$closedHandler.run();
                    this.$closedHandler = null;
                }
                if (this.$removedHandler === null) {
                    this.$onCallerDestroy(this.$caller);
                }
            }
        };
        ViewContact.prototype.$onPopupRemoved = function (popup) {
            if (popup === this.$popup) {
                if (this.$removedHandler !== null) {
                    this.$removedHandler.run();
                    this.$removedHandler = null;
                }
                this.$onCallerDestroy(this.$caller);
            }
        };
        ViewContact.prototype.onPopupClosed = function (method, caller, args) {
            if (this.$caller !== caller) {
                throw Error("caller\u4E0E\u6267\u884C\u8005\u4E0D\u4E00\u81F4");
            }
            if (this.$closedHandler === null) {
                this.$closedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error("\u91CD\u590D\u6CE8\u518C\u5F39\u6846\u5173\u95ED\u4E8B\u4EF6");
            }
            return this;
        };
        ViewContact.prototype.onPopupRemoved = function (method, caller, args) {
            if (this.$caller !== caller) {
                throw Error("caller\u4E0E\u6267\u884C\u8005\u4E0D\u4E00\u81F4");
            }
            if (this.$removedHandler === null) {
                this.$removedHandler = suncom.Handler.create(caller, method, args);
            }
            else {
                throw Error("\u91CD\u590D\u6CE8\u518C\u5F39\u6846\u79FB\u9664\u4E8B\u4EF6");
            }
            return this;
        };
        return ViewContact;
    }(puremvc.Notifier));
    sunui.ViewContact = ViewContact;
    var ViewFacade = (function (_super) {
        __extends(ViewFacade, _super);
        function ViewFacade(view, duration) {
            var _this = _super.call(this) || this;
            _this.$info = null;
            _this.$view = view;
            if (_this.info !== null) {
                _this.$duration = _this.info.duration;
            }
            else if (duration === void 0) {
                _this.$duration = 200;
            }
            else {
                _this.$duration = duration;
            }
            return _this;
        }
        ViewFacade.prototype.popup = function (props) {
            if (props === void 0) { props = {}; }
            this.facade.sendNotification(NotifyKey.SHOW_POPUP, [this.$view, this.$duration, props]);
            return this;
        };
        ViewFacade.prototype.close = function (destroy) {
            this.facade.sendNotification(NotifyKey.CLOSE_POPUP, [this.$view, this.$duration, destroy]);
        };
        Object.defineProperty(ViewFacade.prototype, "cancelAllowed", {
            get: function () {
                return this.info.cancelAllowed;
            },
            set: function (yes) {
                this.info.cancelAllowed = yes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewFacade.prototype, "info", {
            get: function () {
                if (this.$info === null) {
                    this.$info = M.viewLayer.getInfoByView(this.$view);
                }
                return this.$info;
            },
            enumerable: true,
            configurable: true
        });
        return ViewFacade;
    }(puremvc.Notifier));
    sunui.ViewFacade = ViewFacade;
    var ViewLayer = (function (_super) {
        __extends(ViewLayer, _super);
        function ViewLayer() {
            var _this = _super.call(this) || this;
            _this.$stack = [];
            _this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, _this.$onUnloadScene, _this, false, 0);
            return _this;
        }
        ViewLayer.prototype.$onUnloadScene = function () {
            var array = this.$stack.concat();
            while (array.length > 0) {
                this.removeStackInfo(array.pop());
            }
        };
        ViewLayer.prototype.removeStackInfo = function (info) {
            var index = this.$stack.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$stack.splice(index, 1);
            this.facade.sendNotification(NotifyKey.BEFORE_POPUP_REMOVE, info.view);
            this.onViewRemove(info.view);
            this.removeChild(info.view);
            this.removeChild(info.mask);
            if (info.keepNode === false) {
                this.destroyView(info.view);
                this.destroyMask(info.mask);
            }
            this.facade.sendNotification(NotifyKey.ON_POPUP_REMOVED, info.view);
        };
        ViewLayer.prototype.getInfoByView = function (view) {
            for (var i = 0; i < this.$stack.length; i++) {
                var info = this.$stack[i];
                if (info.view === view) {
                    return info;
                }
            }
            return null;
        };
        ViewLayer.prototype.addToStack = function (newInfo) {
            this.$stack.push(newInfo);
        };
        ViewLayer.prototype.removeStackByView = function (view) {
            for (var i = 0; i < this.$stack.length; i++) {
                var info = this.$stack[i];
                if (info.view === view) {
                    this.removeStackInfo(info);
                    break;
                }
            }
        };
        return ViewLayer;
    }(puremvc.Notifier));
    sunui.ViewLayer = ViewLayer;
    var ViewLayerLaya3D = (function (_super) {
        __extends(ViewLayerLaya3D, _super);
        function ViewLayerLaya3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya3D.prototype.addChild = function (view) {
            var node = view;
            if (M.sceneLayer.uiScene === null) {
                Laya.stage.addChild(node);
            }
            else {
                M.sceneLayer.uiScene.addChild(node);
            }
        };
        ViewLayerLaya3D.prototype.removeChild = function (view) {
            var node = view;
            var parent = node.parent || null;
            if (parent === null) {
                throw Error("\u65E0\u6CD5\u79FB\u9664\u663E\u793A\u5BF9\u8C61\uFF0C\u56E0\u4E3A\u7236\u8282\u70B9\u4E0D\u5B58\u5728 " + node.name);
            }
            parent.removeChild(node);
        };
        ViewLayerLaya3D.prototype.createMask = function (view, trans) {
            var mask = new Laya.Image("common/mask.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";
            mask.alpha = trans === true ? 0 : 0.5;
            mask.mouseEnabled = true;
            mask.mouseThrough = false;
            mask.on(Laya.Event.CLICK, this, this.$onMaskClick, [view]);
            return mask;
        };
        ViewLayerLaya3D.prototype.$onMaskClick = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false && info.cancelAllowed === true) {
                new ViewFacade(view).close();
            }
        };
        ViewLayerLaya3D.prototype.destroyMask = function (mask) {
            mask.off(Laya.Event.CLICK, this, this.$onMaskClick);
            mask.destroy();
        };
        ViewLayerLaya3D.prototype.onViewCreate = function (view, args) {
            var components = view.getComponents(Laya.Component) || [];
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.$onCreate) {
                    component.$onCreate.apply(component, args);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewOpen = function (view) {
            var components = view.getComponents(Laya.Component) || [];
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.$onOpen) {
                    component.$onOpen.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewClose = function (view) {
            var components = view.getComponents(Laya.Component) || [];
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.$onClose) {
                    component.$onClose.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.onViewRemove = function (view) {
            var components = view.getComponents(Laya.Component) || [];
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.$onRemove) {
                    component.$onRemove.call(component);
                }
            }
        };
        ViewLayerLaya3D.prototype.destroyView = function (view) {
            var node = view;
            node.destroy();
        };
        return ViewLayerLaya3D;
    }(ViewLayer));
    sunui.ViewLayerLaya3D = ViewLayerLaya3D;
    var M;
    (function (M) {
        M.templets = {};
    })(M = sunui.M || (sunui.M = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.LOAD_SCENE = "sunui.NotifyKey.LOAD_SCENE";
        NotifyKey.UNLOAD_SCENE = "sunui.NotifyKey.UNLOAD_SCENE";
        NotifyKey.REGISTER_SCENES = "sunui.NotifyKey.REGISTER_SCENES";
        NotifyKey.ENTER_SCENE = "sunui.NotifyKey.ENTER_SCENE";
        NotifyKey.EXIT_SCENE = "sunui.NotifyKey.EXIT_SCENE";
        NotifyKey.ADD_TWEEN_OBJECT = "sunui.NotifyKey.ADD_TWEEN_OBJECT";
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        NotifyKey.APPLY_POPUP_METHOD = "sunui.NotifyKey.APPLY_POPUP_METHOD";
        NotifyKey.ON_POPUP_CREATED = "sunui.NotifyKey.ON_POPUP_CREATED";
        NotifyKey.ON_POPUP_OPENED = "sunui.NotifyKey.ON_POPUP_OPENED";
        NotifyKey.ON_POPUP_CLOSED = "sunui.NotifyKey.ON_POPUP_CLOSED";
        NotifyKey.BEFORE_POPUP_REMOVE = "sunui.NotifyKey.BEFORE_POPUP_REMOVE";
        NotifyKey.ON_POPUP_REMOVED = "sunui.NotifyKey.ON_POPUP_REMOVED";
        NotifyKey.ON_CALLER_DESTROYED = "sunui.NotifyKey.ON_CALLER_DESTROYED";
        NotifyKey.RETRY_CONFIRM = "sunui.NotifyKey.RETRY_CONFIRM";
    })(NotifyKey = sunui.NotifyKey || (sunui.NotifyKey = {}));
    var Resource;
    (function (Resource) {
        var $seedId = 0;
        var $groups = {};
        var $templets = {};
        var $references = {};
        function createGroupId() {
            $seedId++;
            return $seedId;
        }
        function lock(url) {
            var array = Resource.getLoadList(url);
            for (var i = 0; i < array.length; i++) {
                var link = array[i];
                var reference = $references[link] || 0;
                $references[link] = reference + 1;
            }
        }
        Resource.lock = lock;
        function unlock(url) {
            var array = Resource.getLoadList(url);
            for (var i = 0; i < array.length; i++) {
                var reference = $references[url] || 0;
                if (reference === 0) {
                    throw Error("\u5C1D\u8BD5\u89E3\u9501\u4E0D\u5B58\u5728\u7684\u8D44\u6E90 url\uFF1A" + url);
                }
                if (reference === 1) {
                    delete $references[url];
                    Laya.loader.clearRes(url);
                    Laya.loader.cancelLoadByUrl(url);
                }
                else {
                    $references[url] = reference - 1;
                }
            }
        }
        Resource.unlock = unlock;
        function getReferenceByUrl(url) {
            return $references[url] || 0;
        }
        Resource.getReferenceByUrl = getReferenceByUrl;
        function create(url, method, caller) {
            if (method === void 0) { method = null; }
            if (caller === void 0) { caller = null; }
            var templet = $templets[url] || null;
            if (templet === null) {
                templet = $templets[url] = new Templet();
            }
            Resource.lock(url);
            templet.create(url, method, caller);
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                console.log("================== resouce debug ==================");
                var keys = Object.keys($templets);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    var templet_1 = $templets[key];
                    console.log("url:" + key + ", references:" + templet_1.referenceCount);
                }
                console.log("================== resouce debug ==================");
            }
        }
        Resource.create = create;
        function destroy(url, method, caller) {
            if (method === void 0) { method = null; }
            if (caller === void 0) { caller = null; }
            var templet = $templets[url] || null;
            if (templet !== null) {
                templet.destroy(url, method, caller);
                Resource.unlock(url);
                if (templet.referenceCount === 0) {
                    delete $templets[url];
                }
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.DEBUG) === suncom.DebugMode.DEBUG) {
                console.log("================== resouce debug ==================");
                var keys = Object.keys($templets);
                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                    var key = keys_2[_i];
                    var templet_2 = $templets[key];
                    console.log("url:" + key + ", references:" + templet_2.referenceCount);
                }
                console.log("================== resouce debug ==================");
            }
        }
        Resource.destroy = destroy;
        function prepare(urls, method, caller) {
            var handler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, function (id) { });
            }
            else {
                handler = suncom.Handler.create(caller, method);
            }
            var id = createGroupId();
            $groups[id] = new TempletGroup(id, urls, handler);
            return id;
        }
        Resource.prepare = prepare;
        function release(id) {
            if (id > 0) {
                var handler = suncom.Handler.create(null, releaseTempletGroup, [id]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
            return 0;
        }
        Resource.release = release;
        function releaseTempletGroup(id) {
            var group = $groups[id] || null;
            if (group !== null) {
                delete $groups[id];
                group.release();
            }
        }
        function getLoadList(url) {
            var index = url.lastIndexOf(".");
            var str = url.substr(0, index);
            var ext = url.substr(index + 1);
            if (ext === "sk") {
                return [
                    str + ".sk",
                    str + ".png"
                ];
            }
            else {
                return [url];
            }
        }
        Resource.getLoadList = getLoadList;
    })(Resource = sunui.Resource || (sunui.Resource = {}));
    var SceneHeap;
    (function (SceneHeap) {
        var $infos = [];
        function findHeapIndexByName(name) {
            for (var i = $infos.length - 1; i > -1; i--) {
                if ($infos[i].name === name) {
                    return i;
                }
            }
            return -1;
        }
        function addHistory(name, data) {
            var info = {
                name: name,
                data: data
            };
            $infos.push(info);
        }
        SceneHeap.addHistory = addHistory;
        function removeHistory(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }
        SceneHeap.removeHistory = removeHistory;
        function hasHistory(name) {
            return findHeapIndexByName(name) > -1;
        }
        SceneHeap.hasHistory = hasHistory;
        function pop() {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }
        SceneHeap.pop = pop;
        function popByName(name) {
            var index = findHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }
        SceneHeap.popByName = popByName;
    })(SceneHeap = sunui.SceneHeap || (sunui.SceneHeap = {}));
    var SceneManager;
    (function (SceneManager) {
        var $infos = [];
        function regScene(info) {
            for (var i = 0; i < $infos.length; i++) {
                if ($infos[i].name === info.name) {
                    throw Error("重复注册场景");
                }
            }
            $infos.push(info);
        }
        SceneManager.regScene = regScene;
        function getConfigByName(name) {
            for (var i = 0; i < $infos.length; i++) {
                var info = $infos[i];
                if (info.name === name) {
                    return info;
                }
            }
            throw Error("场景配置不存在");
        }
        SceneManager.getConfigByName = getConfigByName;
    })(SceneManager = sunui.SceneManager || (sunui.SceneManager = {}));
    function find(path, parent) {
        var array = path.split("/");
        while (parent != null && array.length > 0) {
            var name_1 = array.shift();
            parent = parent.getChildByName(name_1);
        }
        return parent;
    }
    sunui.find = find;
})(sunui || (sunui = {}));
