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
    var PopupFlagEnum;
    (function (PopupFlagEnum) {
        PopupFlagEnum[PopupFlagEnum["NONE"] = 0] = "NONE";
        PopupFlagEnum[PopupFlagEnum["SIMPLY"] = 1] = "SIMPLY";
        PopupFlagEnum[PopupFlagEnum["TRANSPARENT"] = 2] = "TRANSPARENT";
        PopupFlagEnum[PopupFlagEnum["MOUSE_THROUGH"] = 4] = "MOUSE_THROUGH";
        PopupFlagEnum[PopupFlagEnum["SYNC_FADE_TIME"] = 8] = "SYNC_FADE_TIME";
    })(PopupFlagEnum = sunui.PopupFlagEnum || (sunui.PopupFlagEnum = {}));
    var ResourceDownloadSpeedEnum;
    (function (ResourceDownloadSpeedEnum) {
        ResourceDownloadSpeedEnum[ResourceDownloadSpeedEnum["NONE"] = 0] = "NONE";
        ResourceDownloadSpeedEnum[ResourceDownloadSpeedEnum["HIGH"] = 131072] = "HIGH";
        ResourceDownloadSpeedEnum[ResourceDownloadSpeedEnum["MID"] = 32768] = "MID";
        ResourceDownloadSpeedEnum[ResourceDownloadSpeedEnum["LOW"] = 8192] = "LOW";
    })(ResourceDownloadSpeedEnum = sunui.ResourceDownloadSpeedEnum || (sunui.ResourceDownloadSpeedEnum = {}));
    var RetryMethodEnum;
    (function (RetryMethodEnum) {
        RetryMethodEnum[RetryMethodEnum["AUTO"] = 16] = "AUTO";
        RetryMethodEnum[RetryMethodEnum["CONFIRM"] = 32] = "CONFIRM";
        RetryMethodEnum[RetryMethodEnum["TERMINATE"] = 64] = "TERMINATE";
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
        UILevel[UILevel["LAMP_TIPS"] = 13] = "LAMP_TIPS";
        UILevel[UILevel["TIPS"] = 14] = "TIPS";
        UILevel[UILevel["TOP"] = 15] = "TOP";
        UILevel[UILevel["DEBUG"] = 16] = "DEBUG";
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
            if (duration === 0 || (props.flags & PopupFlagEnum.SIMPLY)) {
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
                if (props.scaleX !== void 0) {
                    view.scaleX = props.scaleX;
                }
                if (props.scaleY !== void 0) {
                    view.scaleY = props.scaleY;
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
                    if (props.scaleX === void 0) {
                        props.scaleX = 1;
                    }
                    if (props.scaleY === void 0) {
                        props.scaleY = 1;
                    }
                }
                Tween.get(view, props.mod).to(props, duration, props.ease);
            }
        };
        AbstractPopupCommand.prototype.$applyCloseProps = function (view, props, duration) {
            if (duration > 0 && (props.flags & PopupFlagEnum.SIMPLY) === PopupFlagEnum.NONE) {
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
    var AbstractSceneTask = (function (_super) {
        __extends(AbstractSceneTask, _super);
        function AbstractSceneTask(info, data) {
            var _this = _super.call(this) || this;
            _this.$info = null;
            _this.$info = info;
            _this.$data = data;
            return _this;
        }
        return AbstractSceneTask;
    }(suncore.AbstractTask));
    sunui.AbstractSceneTask = AbstractSceneTask;
    var AssetLoader = (function (_super) {
        __extends(AssetLoader, _super);
        function AssetLoader(url, complete) {
            var _this = _super.call(this) || this;
            _this.$loading = false;
            _this.$complete = null;
            _this.$url = null;
            _this.$loaders = [];
            _this.$doneCount = 0;
            _this.$url = url;
            _this.$complete = complete;
            Resource.lock(_this.$url);
            return _this;
        }
        AssetLoader.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            for (var i = 0; i < this.$loaders.length; i++) {
                this.$loaders[i].destroy();
            }
            Resource.unlock(this.$url);
        };
        AssetLoader.prototype.load = function () {
            if (this.$loading === false && this.$destroyed === false) {
                this.$loading = true;
                this.$doLoad();
            }
        };
        AssetLoader.prototype.$loadAssets = function (urls) {
            this.$doneCount = this.$loaders.length;
            for (var i = 0; i < urls.length; i++) {
                this.$loaders.push(new UrlSafetyLoader(urls[i], suncom.Handler.create(this, this.$onLoadAsset)));
            }
        };
        AssetLoader.prototype.$onLoadAsset = function (ok) {
            if (ok === false) {
                this.$onAssetsLoaded(false);
            }
            else {
                this.$doneCount++;
                if (this.$doneCount === this.$loaders.length) {
                    this.$onAssetsLoaded(true);
                }
            }
        };
        AssetLoader.prototype.$onComplete = function (ok) {
            if (this.$destroyed === false) {
                this.$complete.runWith(ok);
            }
            this.destroy();
            this.$loading = false;
        };
        return AssetLoader;
    }(puremvc.Notifier));
    sunui.AssetLoader = AssetLoader;
    var AssetSafetyLoader = (function (_super) {
        __extends(AssetSafetyLoader, _super);
        function AssetSafetyLoader(url, complete) {
            var _this = _super.call(this) || this;
            _this.$url = null;
            _this.$complete = null;
            _this.$loader = null;
            _this.$retryer = new Retryer(RetryMethodEnum.TERMINATE, suncom.Handler.create(_this, _this.$onRetryConfirmed), "资源加载失败，点击确定重新尝试！");
            Resource.lock(url);
            _this.$url = url;
            _this.$complete = complete;
            _this.$doLoad();
            return _this;
        }
        AssetSafetyLoader.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.$retryer.cancel();
            this.$loader !== null && this.$loader.destroy();
            Resource.unlock(this.$url);
        };
        AssetSafetyLoader.prototype.$doLoad = function () {
            var handler = suncom.Handler.create(this, this.$onLoad);
            if (Resource.isRes3dUrl(this.$url) === true) {
                this.$loader = new Res3dLoader(this.$url, handler);
            }
            else if (suncom.Common.getFileExtension(this.$url) === "sk") {
                this.$loader = new SkeletonLoader(this.$url, handler);
            }
            else {
                this.$loader = new UrlLoader(this.$url, handler);
            }
            this.$loader.load();
        };
        AssetSafetyLoader.prototype.$onLoad = function (ok) {
            if (ok === true) {
                this.$complete.runWith(this.$url);
            }
            else {
                this.$retryer.run(1000, suncom.Handler.create(this, this.$doLoad), 2);
            }
            this.$loader = null;
        };
        AssetSafetyLoader.prototype.$onRetryConfirmed = function (option) {
            if (option === ConfirmOptionValueEnum.NO) {
                this.$retryer.reset();
                suncom.Logger.warn(suncom.DebugMode.ANY, "\u5931\u8D25\uFF1A" + this.$url);
                this.facade.sendNotification(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED);
                this.facade.registerObserver(NotifyKey.ASSET_SAFETY_LOADER_RETRY, this.$onAssetSafetyLoaderRetry, this, true);
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
        };
        AssetSafetyLoader.prototype.$onAssetSafetyLoaderRetry = function () {
            if (this.$destroyed === false) {
                suncom.Logger.warn(suncom.DebugMode.ANY, "\u91CD\u8BD5\uFF1A" + this.$url);
                this.$doLoad();
            }
        };
        Object.defineProperty(AssetSafetyLoader.prototype, "complete", {
            get: function () {
                return this.$complete;
            },
            enumerable: true,
            configurable: true
        });
        return AssetSafetyLoader;
    }(puremvc.Notifier));
    sunui.AssetSafetyLoader = AssetSafetyLoader;
    var ClosePopupCommand = (function (_super) {
        __extends(ClosePopupCommand, _super);
        function ClosePopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClosePopupCommand.prototype.execute = function (view, duration, destroy) {
            var info = M.viewLayer.getInfoByView(view);
            if (info === null) {
                suncom.Logger.error(suncom.DebugMode.ANY, view + "[" + (view && view.name) + "]'s infomation is not exist.");
                return;
            }
            if (destroy !== void 0) {
                info.keepNode = !destroy;
            }
            if (info.closed === true) {
                return;
            }
            info.closed = true;
            M.viewLayer.onViewClose(view);
            this.facade.sendNotification(NotifyKey.ON_POPUP_CLOSED, view);
            if ((info.props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                var tween = Tween.get(info.mask, info.props.mod);
                if (duration > 200 && (info.props.flags & PopupFlagEnum.SYNC_FADE_TIME) === PopupFlagEnum.NONE) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }
            this.$applyCloseProps(view, info.props, duration);
            var handler = suncom.Handler.create(this, this.$onCloseFinish, [view]);
            suncore.System.addTrigger(info.props.mod, duration, handler);
        };
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            M.viewLayer.removeStackInfoByView(view);
        };
        return ClosePopupCommand;
    }(AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
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
    var Res3dLoader = (function (_super) {
        __extends(Res3dLoader, _super);
        function Res3dLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Res3dLoader.prototype.$doLoad = function () {
            var url = Resource.getRes3dJsonUrl(this.$url);
            var loaded = Laya.loader.getRes(this.$url) === void 0 ? false : true;
            if (suncom.Common.getFileExtension(this.$url) === "ls" || loaded === true) {
                this.$loadAssets([url]);
            }
            else {
                this.$loaders.push(new UrlSafetyLoader(url, suncom.Handler.create(this, this.$onUrlLoaded)));
            }
        };
        Res3dLoader.prototype.$onUrlLoaded = function (ok, url) {
            if (ok === true) {
                var res = M.cacheMap[this.$url] || null;
                if (res === null) {
                    this.$loadAssets([this.$url]);
                }
                else {
                    this.$onAssetsLoaded(true);
                }
            }
            else {
                this.$onComplete(false);
            }
        };
        Res3dLoader.prototype.$onAssetsLoaded = function (ok) {
            if (suncom.Common.getFileExtension(this.$url) === "ls") {
                this.$onComplete(ok);
            }
            else {
                var res = M.cacheMap[this.$url] || null;
                if (res === null) {
                    res = M.cacheMap[this.$url] = Laya.loader.getRes(this.$url);
                }
                this.$onComplete(ok);
            }
        };
        return Res3dLoader;
    }(AssetLoader));
    sunui.Res3dLoader = Res3dLoader;
    var ResourceService = (function (_super) {
        __extends(ResourceService, _super);
        function ResourceService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$undoList = [];
            _this.$loadingList = [];
            _this.$isRetryPrompting = false;
            return _this;
        }
        ResourceService.prototype.$onRun = function () {
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.registerObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        };
        ResourceService.prototype.$onStop = function () {
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.removeObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        };
        ResourceService.prototype.$onUrlSafetyLoaderCreated = function (loader) {
            this.$undoList.unshift(loader);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "create loader for url " + loader.url + ", loading list length:" + this.$loadingList.length + ", undo list length:" + this.$undoList.length);
            }
            this.$next();
        };
        ResourceService.prototype.$onUrlSafetyLoaderComplete = function (loader) {
            var index = this.$loadingList.indexOf(loader);
            suncom.Test.expect(index).toBeGreaterOrEqualThan(0);
            this.$loadingList.splice(index, 1);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "remove loader for url " + loader.url + ", loading list length:" + this.$loadingList.length + ", undo list length:" + this.$undoList.length);
            }
            this.$next();
        };
        ResourceService.prototype.$next = function () {
            while (this.$undoList.length > 0 && this.$loadingList.length < ResourceService.MAX_LOAD_COUNT) {
                var ok = false;
                for (var i = this.$undoList.length - 1; i > -1; i--) {
                    var loader = this.$undoList[i];
                    if (loader.destroyed === true) {
                        this.$undoList.splice(i, 1);
                        continue;
                    }
                    if (this.$isUrlInLoading(loader.url) === true) {
                        continue;
                    }
                    if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                        suncom.Logger.trace(suncom.DebugMode.ANY, "load next url " + loader.url + ", loading list length:" + this.$loadingList.length + " + 1");
                    }
                    ok = true;
                    loader.load();
                    this.$loadingList.push(loader);
                    break;
                }
                if (ok === false) {
                    break;
                }
            }
        };
        ResourceService.prototype.$isUrlInLoading = function (url) {
            for (var i = 0; i < this.$loadingList.length; i++) {
                var loader = this.$loadingList[i];
                if (loader.url === url) {
                    return true;
                }
            }
            return false;
        };
        ResourceService.prototype.$onAssetSafetyLoaderFailed = function () {
            if (this.$isRetryPrompting === false) {
                this.$isRetryPrompting = true;
                this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [
                    suncore.ModuleEnum.SYSTEM,
                    "资源加载失败，点击确定重新尝试！",
                    [ConfirmOptionValueEnum.YES, "确定", ConfirmOptionValueEnum.NO, "取消"],
                    suncom.Handler.create(this, this.$onRetryConfirmed)
                ]);
            }
        };
        ResourceService.prototype.$onRetryConfirmed = function (option) {
            if (option === ConfirmOptionValueEnum.YES) {
                this.facade.sendNotification(NotifyKey.ASSET_SAFETY_LOADER_RETRY);
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
            this.$isRetryPrompting = false;
        };
        ResourceService.MAX_LOAD_COUNT = 5;
        return ResourceService;
    }(suncore.BaseService));
    sunui.ResourceService = ResourceService;
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
            else if ((modOrMethod & RetryMethodEnum.TERMINATE) === RetryMethodEnum.TERMINATE) {
                _this.$method = RetryMethodEnum.TERMINATE;
            }
            else {
                _this.$method = RetryMethodEnum.AUTO;
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
            if (this.$method === RetryMethodEnum.AUTO || this.$currentRetries < maxRetries) {
                if (this.$retryTimerId === 0) {
                    this.$retryHandler = handler;
                    this.$retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$onRetryTimer, this);
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, "\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u8BF7\u6C42 method:" + suncom.Common.getMethodName(handler.method, handler.caller) + ", caller:" + suncom.Common.getQualifiedClassName(handler.caller));
                }
            }
            else {
                if (this.$prompting === false) {
                    this.$prompting = true;
                    if (this.$method === RetryMethodEnum.TERMINATE) {
                        var handler_1 = suncom.Handler.create(this, this.$onConfirmReplied, [ConfirmOptionValueEnum.NO]);
                        suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler_1);
                    }
                    else {
                        var handler_2 = suncom.Handler.create(this, this.$onConfirmReplied);
                        this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$mod, this.$prompt, this.$options, handler_2]);
                    }
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, "\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u7684\u8BE2\u95EE\u8BF7\u6C42 prompt:" + this.$prompt);
                }
            }
        };
        Retryer.prototype.$onConfirmReplied = function (option) {
            if (this.$prompting === true) {
                this.$prompting = false;
                if (this.$confirmHandler !== null) {
                    this.$confirmHandler.runWith(option);
                }
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
    var SceneIniClass = (function (_super) {
        __extends(SceneIniClass, _super);
        function SceneIniClass(info, data) {
            var _this = _super.call(this, info, data) || this;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, true, suncom.EventPriorityEnum.EGL);
            return _this;
        }
        SceneIniClass.prototype.$onEnterScene = function () {
        };
        return SceneIniClass;
    }(AbstractSceneTask));
    sunui.SceneIniClass = SceneIniClass;
    var SceneLayer = (function (_super) {
        __extends(SceneLayer, _super);
        function SceneLayer() {
            var _this = _super.call(this) || this;
            _this.$ready = true;
            _this.$sceneName = 0;
            _this.$scene2d = null;
            _this.$scene3d = null;
            _this.$data = null;
            _this.facade.registerObserver(NotifyKey.ENTER_SCENE, _this.$onEnterScene, _this, false, suncom.EventPriorityEnum.OSL);
            return _this;
        }
        SceneLayer.prototype.$enterScene = function (name, data) {
            var info = SceneManager.getConfigByName(name);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$beforeLoadScene, [info, data]));
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$loadScene, [info]));
        };
        SceneLayer.prototype.$beforeLoadScene = function (info, data) {
            this.$data = data;
            this.$sceneName = info.name;
            this.facade.sendNotification(NotifyKey.BEFORE_LOAD_SCENE);
            info.iniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, new info.iniCls(info, data));
        };
        SceneLayer.prototype.$loadScene = function (info) {
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            info.scene3d = info.scene3d || null;
            this.facade.sendNotification(NotifyKey.LOAD_SCENE, info);
        };
        SceneLayer.prototype.$onEnterScene = function (scene2d, scene3d) {
            this.$ready = true;
            this.$scene2d = scene2d || null;
            this.$scene3d = scene3d || null;
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        };
        SceneLayer.prototype.$exitScene = function () {
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            var info = SceneManager.getConfigByName(this.$sceneName);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$onLeaveScene, [info]));
        };
        SceneLayer.prototype.$onLeaveScene = function (info) {
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, new info.uniCls(info, this.$data));
            this.facade.sendNotification(NotifyKey.LEAVE_SCENE);
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, [this.$scene2d, this.$scene3d]);
            info.scene2d !== null && Resource.clearResByUrl(info.scene2d);
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, 0, new suncore.SimpleTask(suncom.Handler.create(this, this.$onExitScene)));
        };
        SceneLayer.prototype.$onExitScene = function () {
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
            var info = SceneHeap.getLastestSceneInfo();
            info !== null && this.$enterScene(info.name, info.data);
        };
        SceneLayer.prototype.replaceScene = function (name, data) {
            var info = SceneHeap.getLastestSceneInfo();
            if (this.enterScene(name, data) === true) {
                info !== null && SceneHeap.removeHistory(info.name);
            }
        };
        SceneLayer.prototype.deleteHistories = function (deleteCount) {
            SceneHeap.deleteHistories(deleteCount);
        };
        Object.defineProperty(SceneLayer.prototype, "scene2d", {
            get: function () {
                return this.$scene2d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "scene3d", {
            get: function () {
                return this.$scene3d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "sceneName", {
            get: function () {
                return this.$ready === false ? 0 : this.$sceneName;
            },
            enumerable: true,
            configurable: true
        });
        return SceneLayer;
    }(puremvc.Notifier));
    sunui.SceneLayer = SceneLayer;
    var SceneUniClass = (function (_super) {
        __extends(SceneUniClass, _super);
        function SceneUniClass(info, data) {
            var _this = _super.call(this, info, data) || this;
            _this.facade.registerObserver(NotifyKey.LEAVE_SCENE, _this.$onLeaveScene, _this, true, suncom.EventPriorityEnum.EGL);
            return _this;
        }
        SceneUniClass.prototype.$onLeaveScene = function () {
        };
        return SceneUniClass;
    }(AbstractSceneTask));
    sunui.SceneUniClass = SceneUniClass;
    var ShowPopupCommand = (function (_super) {
        __extends(ShowPopupCommand, _super);
        function ShowPopupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowPopupCommand.prototype.execute = function (view, duration, props) {
            if (M.viewLayer.getInfoByView(view) !== null) {
                suncom.Logger.error(suncom.DebugMode.ANY, view + "[" + view.name + "] is already popup.");
                return;
            }
            if (props.mod === void 0) {
                props.mod = suncore.ModuleEnum.CUSTOM;
            }
            if (props.ease === void 0) {
                props.ease = Laya.Ease.backOut;
            }
            if (props.flags === void 0) {
                props.flags = PopupFlagEnum.NONE;
            }
            if (props.keepNode === void 0) {
                props.keepNode = false;
            }
            var args = props.args;
            var level = props.level || view.zOrder || UILevel.POPUP;
            var keepNode = props.keepNode;
            delete props.args;
            delete props.level;
            delete props.keepNode;
            this.$makeProps(props);
            if (props.trans === true && (props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                suncom.Logger.warn(suncom.DebugMode.ANY, "ViewFacade\uFF1Aprops\u7684trans\u5C5E\u6027\u5DF1\u5F03\u7528\uFF0C\u8BF7\u4F7F\u7528flags\u4EE3\u66FF\uFF01\uFF01\uFF01");
                props.flags |= PopupFlagEnum.TRANSPARENT;
            }
            var mask = M.viewLayer.createMask(view, props);
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
            suncom.Test.expect(view["pivot"]).anything();
            view["pivot"](view.width * 0.5, view.height * 0.5);
            M.viewLayer.onViewCreate(view, args);
            if ((props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                if (props.flags & PopupFlagEnum.SYNC_FADE_TIME) {
                    Tween.get(mask, info.props.mod).from({ alpha: 0 }, duration);
                }
                else {
                    Tween.get(mask, info.props.mod).from({ alpha: 0 }, duration > 200 ? 200 : duration);
                }
            }
            this.$applyShowProps(view, props, duration);
            var handler = suncom.Handler.create(this, this.$onPopupFinish, [view]);
            suncore.System.addTrigger(info.props.mod, duration, handler);
        };
        ShowPopupCommand.prototype.$onPopupFinish = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false) {
                info.displayed = true;
                M.viewLayer.onViewOpen(view);
            }
        };
        return ShowPopupCommand;
    }(AbstractPopupCommand));
    sunui.ShowPopupCommand = ShowPopupCommand;
    var SkeletonLoader = (function (_super) {
        __extends(SkeletonLoader, _super);
        function SkeletonLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SkeletonLoader.prototype.$doLoad = function () {
            this.$loadAssets([this.$url, suncom.Common.replacePathExtension(this.$url, "png")]);
        };
        SkeletonLoader.prototype.$onAssetsLoaded = function (ok) {
            if (ok === true) {
                var templet = M.cacheMap[this.$url] || null;
                if (templet === null) {
                    templet = M.cacheMap[this.$url] = new Laya.Templet();
                    templet.on(Laya.Event.COMPLETE, this, this.$onTempletCreated);
                    templet.loadAni(this.$url);
                }
                else if (templet.isParserComplete === false) {
                    templet.on(Laya.Event.COMPLETE, this, this.$onTempletCreated);
                }
                else {
                    var handler = suncom.Handler.create(this, this.$onTempletCreated);
                    suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
                }
                Resource.lock(this.$url);
            }
            else {
                this.$onComplete(false);
            }
        };
        SkeletonLoader.prototype.$onTempletCreated = function () {
            if (this.destroyed === false) {
                var templet = M.cacheMap[this.$url];
                this.$onComplete(true);
            }
            Resource.unlock(this.$url);
        };
        return SkeletonLoader;
    }(AssetLoader));
    sunui.SkeletonLoader = SkeletonLoader;
    var Templet = (function (_super) {
        __extends(Templet, _super);
        function Templet(id, urls, handler) {
            var _this = _super.call(this) || this;
            _this.$id = 0;
            _this.$handler = null;
            _this.$doneList = [];
            _this.$loaders = [];
            _this.$id = id;
            _this.$handler = handler;
            urls = Resource.checkLoadList(urls);
            suncom.Test.expect(urls.length).toBeGreaterThan(0);
            while (urls.length > 0) {
                var url = urls.shift();
                var handler_3 = suncom.Handler.create(_this, _this.$onResourceCreated);
                var loader = new AssetSafetyLoader(url, handler_3);
                _this.$loaders.push(loader);
            }
            return _this;
        }
        Templet.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            var handler = suncom.Handler.create(this, this.$releaseAllResources);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
        };
        Templet.prototype.$onResourceCreated = function (url) {
            this.$doneList.push(url);
            if (this.$doneList.length < this.$loaders.length) {
                return;
            }
            if (this.$destroyed === true) {
                return;
            }
            this.$handler.runWith([this.$id]);
        };
        Templet.prototype.$releaseAllResources = function () {
            for (var i = 0; i < this.$loaders.length; i++) {
                this.$loaders[i].destroy();
            }
        };
        return Templet;
    }(puremvc.Notifier));
    sunui.Templet = Templet;
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween(item, mod) {
            var _this = _super.call(this) || this;
            _this.$infos = [];
            _this.$props = null;
            _this.$mod = mod;
            _this.$item = item;
            if (suncore.System.isModuleStopped(mod) === false) {
                _this.facade.sendNotification(NotifyKey.REGISTER_TWEEN_OBJECT, _this);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, "\u5C1D\u8BD5\u6DFB\u52A0\u7F13\u52A8\uFF0C\u4F46\u65F6\u95F4\u8F74\u5DF1\u505C\u6B62\uFF0Cmod:" + suncore.ModuleEnum[mod]);
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
            this.$createTweenInfo(keys, item, props, duration, ease, props.update || null, handler);
            return this;
        };
        Tween.prototype.from = function (props, duration, ease, handler) {
            if (ease === void 0) { ease = null; }
            if (handler === void 0) { handler = null; }
            var keys = Object.keys(props);
            var item = this.$props === null ? this.$item : this.$props;
            this.$createTweenInfo(keys, props, item, duration, ease, props.update || null, handler);
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
        Tween.prototype.$createTweenInfo = function (keys, from, to, duration, ease, update, handler) {
            this.$props = this.$props || {};
            var actions = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key === "update") {
                    continue;
                }
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
                if (this.$infos.length === 0) {
                    this.$item[action.prop] = action.from;
                }
            }
            var info = {
                ease: ease,
                actions: actions,
                update: update,
                handler: handler,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: duration
            };
            this.$infos.push(info);
        };
        Tween.prototype.wait = function (delay, handler) {
            if (handler === void 0) { handler = null; }
            var info = {
                ease: null,
                actions: [],
                update: null,
                handler: handler,
                time: suncore.System.getModuleTimestamp(this.$mod),
                duration: delay
            };
            this.$infos.push(info);
            return this;
        };
        Tween.prototype.doAction = function () {
            var time = suncore.System.getModuleTimestamp(this.$mod);
            var info = this.$infos[0];
            if (this.$item.destroyed === true) {
                this.cancel();
                return 0;
            }
            var done = false;
            var timeLeft = 0;
            var duration = time - info.time;
            if (duration > info.duration) {
                done = true;
                timeLeft = duration - info.duration;
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
            if (info.update !== null) {
                info.update.run();
            }
            if (done === false) {
                return 0;
            }
            this.$infos.shift();
            if (this.$infos.length > 0) {
                this.$infos[0].time = suncore.System.getModuleTimestamp(this.$mod);
            }
            info.handler !== null && info.handler.run();
            return timeLeft;
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
            this.facade.registerObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this, false, suncom.EventPriorityEnum.EGL);
        };
        TweenService.prototype.$onStop = function () {
            this.facade.removeObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onAddTweenObject, this);
            this.facade.removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
        };
        TweenService.prototype.$frameLoop = function () {
            this.$tweens[0] = true;
            var tweens = this.$tweens;
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) === false) {
                    var length_1 = tweens.length;
                    for (var i = 0; i < length_1; i++) {
                        var tween = tweens[i];
                        if (tween.mod === mod) {
                            var timeLeft = 1;
                            while (timeLeft > 0 && tween.canceled === false) {
                                timeLeft = tween.doAction();
                            }
                        }
                    }
                }
            }
            for (var i = this.$tweens.length - 1; i > 0; i--) {
                var tween = this.$tweens[i];
                if (tween.canceled === true) {
                    tweens.splice(i, 1);
                }
            }
            this.$tweens[0] = false;
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
            M.sceneLayer = new SceneLayer();
            if (Laya.Scene3D === void 0) {
                M.viewLayer = new ViewLayerLaya2D();
            }
            else {
                M.viewLayer = new ViewLayerLaya3D();
            }
            suncom.DBService.put(-1, new TweenService()).run();
            suncom.DBService.put(-1, new ResourceService()).run();
            _this.facade.registerCommand(NotifyKey.SHOW_POPUP, ShowPopupCommand, suncom.EventPriorityEnum.OSL);
            _this.facade.registerCommand(NotifyKey.CLOSE_POPUP, ClosePopupCommand, suncom.EventPriorityEnum.OSL);
            return _this;
        }
        UIManager.getInstance = function () {
            if (UIManager.$inst === null) {
                UIManager.$inst = new UIManager();
            }
            return UIManager.$inst;
        };
        UIManager.prototype.enterScene = function (name, data) {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.enterScene(name, data);
            puremvc.MutexLocker.restore();
        };
        UIManager.prototype.exitScene = function () {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.exitScene();
            puremvc.MutexLocker.restore();
        };
        UIManager.prototype.replaceScene = function (name, data) {
            puremvc.MutexLocker.backup(this);
            M.sceneLayer.replaceScene(name, data);
            puremvc.MutexLocker.restore();
        };
        UIManager.prototype.deleteHistories = function (deleteCount) {
            M.sceneLayer.deleteHistories(deleteCount);
        };
        UIManager.prototype.removeView = function (view) {
            M.viewLayer.removeStackInfoByView(view);
        };
        Object.defineProperty(UIManager.prototype, "scene2d", {
            get: function () {
                return M.sceneLayer.scene2d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "scene3d", {
            get: function () {
                return M.sceneLayer.scene3d;
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
    var UrlDownloadLimiter = (function (_super) {
        __extends(UrlDownloadLimiter, _super);
        function UrlDownloadLimiter(url, handler) {
            var _this = _super.call(this) || this;
            _this.$url = null;
            _this.$data = null;
            _this.$handler = null;
            _this.$totalSize = 0;
            _this.$currentSize = 0;
            _this.$priority = 0;
            _this.$url = url;
            _this.$handler = handler;
            _this.$priority = suncom.Mathf.random(0, 6);
            if (Laya.loader.getRes(url) !== void 0) {
                _this.$totalSize = -1;
            }
            M.downloadLimiters.push(_this);
            return _this;
        }
        UrlDownloadLimiter.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            var index = M.downloadLimiters.indexOf(this);
            if (index < 0) {
                throw Error("\u52A0\u8F7D\u9650\u5236\u5668\u4E0D\u5B58\u5728\uFF1Aindex:" + index);
            }
            M.downloadLimiters.splice(index, 1);
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        UrlDownloadLimiter.prototype.updateDownloadSize = function (res) {
            if (res === null || this.$totalSize === -1) {
                this.$totalSize = 1;
            }
            else if (suncom.Common.getFileExtension(this.$url) === "atlas") {
                var png = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "png")) || null;
                var size = (png === null ? 0 : png["gpuMemory"]) || 1;
                this.$totalSize = size + this.$getStringSize(Laya.loader.getRes(this.$url) || null);
            }
            else if (suncom.Common.getFileExtension(this.$url) === "png" || suncom.Common.getFileExtension(this.$url) === "jpg") {
                var png = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "png")) || null;
                this.$totalSize = (png === null ? 0 : png.bitmap["gpuMemory"]) || 1;
            }
            else if (suncom.Common.getFileExtension(this.$url) === "json") {
                this.$totalSize = this.$getStringSize(Laya.loader.getRes(this.$url) || null);
            }
            else if (suncom.Common.getFileExtension(this.$url) === "sk") {
                var sk = res;
                this.$totalSize = sk.byteLength;
            }
            else if (suncom.Common.getFileExtension(this.$url) === "lh") {
                var json = Laya.loader.getRes(suncom.Common.replacePathExtension(this.$url, "json"));
                var urls = Resource.getAssetUrlsByRes3dJson(json);
                for (var i = 0; i < urls.length; i++) {
                    var url = urls[i];
                    var data = Laya.loader.getRes(url) || null;
                    if (data["gpuMemory"] > 0) {
                        this.$totalSize += data["gpuMemory"];
                    }
                    else {
                        try {
                            this.$totalSize += this.$getStringSize(data);
                        }
                        catch (error) {
                            this.$totalSize += 1;
                        }
                    }
                }
            }
            else {
                this.$totalSize = 1;
            }
            this.$data = res;
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        };
        UrlDownloadLimiter.prototype.$onEnterFrame = function () {
            this.$currentSize += this.$getDowloadSpeed() * (10 - this.$priority) / 10;
            if (this.$totalSize > 0 && this.$currentSize > this.$totalSize) {
                suncom.Logger.log(suncom.DebugMode.DEBUG, "[100%] " + this.$url + ":{" + this.$currentSize + ":" + this.$totalSize + "}");
                this.$handler.runWith(this.$data);
                this.destroy();
            }
            else {
                if (this.$totalSize > 0) {
                    suncom.Logger.log(suncom.DebugMode.DEBUG, "[" + Math.floor(this.$currentSize / this.$totalSize * 100) + "%] " + this.$url + ":{" + this.$currentSize + ":" + this.$totalSize + "}");
                }
                else {
                    suncom.Logger.log(suncom.DebugMode.DEBUG, "[0%] " + this.$url + ":{" + this.$currentSize + ":" + this.$totalSize + "}");
                }
            }
        };
        UrlDownloadLimiter.prototype.$getDowloadSpeed = function () {
            if (M.downloadLimiters.length <= 1) {
                return M.downloadSpeed;
            }
            else {
                return M.downloadSpeed / M.downloadLimiters.length;
            }
        };
        UrlDownloadLimiter.prototype.$getStringSize = function (data) {
            var str = null;
            var size = 0;
            if (data === null) {
                return 1;
            }
            if (typeof data === "number" || typeof data === "string") {
                str = data.toString();
            }
            else {
                str = JSON.stringify(data);
            }
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) <= 255) {
                    size++;
                }
                else {
                    size += 2;
                }
            }
            return size;
        };
        return UrlDownloadLimiter;
    }(puremvc.Notifier));
    sunui.UrlDownloadLimiter = UrlDownloadLimiter;
    var UrlLoader = (function (_super) {
        __extends(UrlLoader, _super);
        function UrlLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UrlLoader.prototype.$doLoad = function () {
            this.$loadAssets([this.$url]);
        };
        UrlLoader.prototype.$onAssetsLoaded = function (ok) {
            this.$onComplete(ok);
        };
        return UrlLoader;
    }(AssetLoader));
    sunui.UrlLoader = UrlLoader;
    var UrlSafetyLoader = (function (_super) {
        __extends(UrlSafetyLoader, _super);
        function UrlSafetyLoader(url, complete) {
            var _this = _super.call(this) || this;
            _this.$url = null;
            _this.$limiter = null;
            _this.$complete = null;
            _this.$loading = false;
            _this.$url = url;
            _this.$complete = complete;
            _this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, _this);
            return _this;
        }
        UrlSafetyLoader.prototype.load = function () {
            if (this.$loading === false && this.$destroyed === false) {
                this.$loading = true;
                UrlLocker.lock(this.$url);
                if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                    suncom.Logger.trace(suncom.DebugMode.ANY, "load " + this.$url);
                }
                if (Resource.isRes3dUrl(this.$url) === false || Resource.getRes3dJsonUrl(this.$url) === this.$url) {
                    Laya.loader.load(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
                else {
                    Laya.loader.create(this.$url, Laya.Handler.create(this, this.$onComplete));
                }
                if (M.downloadSpeed !== ResourceDownloadSpeedEnum.NONE) {
                    this.$limiter = new UrlDownloadLimiter(this.$url, suncom.Handler.create(this, this.$onDownloaded));
                }
            }
        };
        UrlSafetyLoader.prototype.$onComplete = function (data) {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "load " + this.$url + " complete");
            }
            if (this.$limiter === null) {
                if (this.$destroyed === false) {
                    this.$destroyed = true;
                    this.$complete.runWith([data === null ? false : true, this.$url]);
                }
                this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this);
                UrlLocker.unlock(this.$url);
                this.$loading = false;
            }
            else {
                this.$limiter.updateDownloadSize(data);
            }
        };
        UrlSafetyLoader.prototype.$onDownloaded = function (data) {
            this.$limiter = null;
            this.$onComplete(data);
        };
        Object.defineProperty(UrlSafetyLoader.prototype, "url", {
            get: function () {
                return this.$url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UrlSafetyLoader.prototype, "destroyed", {
            get: function () {
                return this.$destroyed;
            },
            enumerable: true,
            configurable: true
        });
        return UrlSafetyLoader;
    }(puremvc.Notifier));
    sunui.UrlSafetyLoader = UrlSafetyLoader;
    var ViewContact = (function (_super) {
        __extends(ViewContact, _super);
        function ViewContact(popup, caller) {
            var _this = _super.call(this) || this;
            _this.$closedHandler = null;
            _this.$removedHandler = null;
            _this.$popup = popup || null;
            _this.$caller = caller || null;
            if (M.viewLayer.getInfoByView(popup) === null) {
                throw Error("\u627E\u4E0D\u5230" + popup.name + "\u7684\u5F39\u51FA\u4FE1\u606F\uFF0C\u8BF7\u786E\u8BA4\u5176\u4E3A\u5F39\u51FA\u5BF9\u8C61");
            }
            _this.facade.registerObserver(NotifyKey.ON_POPUP_CLOSED, _this.$onPopupClosed, _this, false, suncom.EventPriorityEnum.FWL);
            _this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, _this.$onPopupRemoved, _this, false, suncom.EventPriorityEnum.FWL);
            if (M.viewLayer.getInfoByView(caller) !== null) {
                _this.facade.registerObserver(NotifyKey.ON_POPUP_REMOVED, _this.$onCallerDestroy, _this, false, suncom.EventPriorityEnum.FWL);
            }
            else {
                _this.facade.registerObserver(NotifyKey.ON_CALLER_DESTROYED, _this.$onCallerDestroy, _this, false, suncom.EventPriorityEnum.FWL);
            }
            _this.facade.registerObserver(NotifyKey.LEAVE_SCENE, _this.$onLeaveScene, _this, false, suncom.EventPriorityEnum.OSL);
            return _this;
        }
        ViewContact.prototype.$onLeaveScene = function () {
            this.facade.removeObserver(NotifyKey.ON_POPUP_CLOSED, this.$onPopupClosed, this);
            this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onPopupRemoved, this);
            this.facade.removeObserver(NotifyKey.LEAVE_SCENE, this.$onCallerDestroy, this);
            this.facade.removeObserver(NotifyKey.ON_POPUP_REMOVED, this.$onCallerDestroy, this);
            this.facade.removeObserver(NotifyKey.ON_CALLER_DESTROYED, this.$onCallerDestroy, this);
        };
        ViewContact.prototype.$onCallerDestroy = function (caller) {
            if (caller === this.$caller) {
                this.$onLeaveScene();
            }
        };
        ViewContact.prototype.$onPopupClosed = function (popup) {
            if (popup === this.$popup) {
                if (this.$closedHandler !== null) {
                    this.$closedHandler.run();
                    this.$closedHandler = null;
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
            _this.facade.registerObserver(NotifyKey.UNLOAD_SCENE, _this.$onUnloadScene, _this, false, suncom.EventPriorityEnum.EGL);
            return _this;
        }
        ViewLayer.prototype.$onUnloadScene = function () {
            var array = this.$stack.concat();
            for (var i = array.length - 1; i > -1; i--) {
                var info = array[i];
                if (info.props.mod !== suncore.ModuleEnum.SYSTEM) {
                    this.removeStackInfo(info);
                }
            }
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
        ViewLayer.prototype.removeStackInfo = function (info) {
            var index = this.$stack.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$stack.splice(index, 1);
            this.onViewRemove(info.view);
            this.removeChild(info.view);
            this.removeChild(info.mask);
            if (info.keepNode === false) {
                this.destroyView(info.view);
                this.destroyMask(info.mask);
            }
            this.facade.sendNotification(NotifyKey.ON_POPUP_REMOVED, info.view);
        };
        ViewLayer.prototype.removeStackInfoByView = function (view) {
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
    var ViewLayerLaya = (function (_super) {
        __extends(ViewLayerLaya, _super);
        function ViewLayerLaya() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya.prototype.addChild = function (view) {
            var node = view;
            if (M.sceneLayer.scene2d === null || view.zOrder >= sunui.UILevel.LOADING) {
                Laya.stage.addChild(node);
            }
            else {
                M.sceneLayer.scene2d.addChild(node);
            }
        };
        ViewLayerLaya.prototype.removeChild = function (view) {
            var node = view;
            var parent = node.parent || null;
            if (parent === null) {
                throw Error("\u65E0\u6CD5\u79FB\u9664\u663E\u793A\u5BF9\u8C61\uFF0C\u56E0\u4E3A\u7236\u8282\u70B9\u4E0D\u5B58\u5728 " + node.name);
            }
            parent.removeChild(node);
        };
        ViewLayerLaya.prototype.createMask = function (view, props) {
            var mask = new Laya.Image("common/mask_b.png");
            mask.left = mask.right = mask.top = mask.bottom = 0;
            mask.sizeGrid = "1,1,1,1";
            if (props.flags & PopupFlagEnum.TRANSPARENT) {
                mask.alpha = 0;
            }
            else {
                mask.alpha = 1;
            }
            if ((props.flags & PopupFlagEnum.MOUSE_THROUGH) === PopupFlagEnum.NONE) {
                mask.mouseThrough = false;
                mask.on(Laya.Event.CLICK, this, this.$onMaskClick, [view]);
            }
            return mask;
        };
        ViewLayerLaya.prototype.$onMaskClick = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false && info.cancelAllowed === true) {
                new ViewFacade(view).close();
            }
        };
        ViewLayerLaya.prototype.destroyMask = function (mask) {
            mask.off(Laya.Event.CLICK, this, this.$onMaskClick);
            mask.destroy();
        };
        ViewLayerLaya.prototype.destroyView = function (view) {
            var node = view;
            node.destroy();
        };
        return ViewLayerLaya;
    }(ViewLayer));
    sunui.ViewLayerLaya = ViewLayerLaya;
    var ViewLayerLaya2D = (function (_super) {
        __extends(ViewLayerLaya2D, _super);
        function ViewLayerLaya2D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya2D.prototype.onViewCreate = function (view, args) {
            var node = view;
            if (node.$onCreate) {
                if (args instanceof Array === false) {
                    node.$onCreate.call(node, args);
                }
                else {
                    node.$onCreate.apply(node, args);
                }
            }
        };
        ViewLayerLaya2D.prototype.onViewOpen = function (view) {
            var node = view;
            if (node.$onOpen) {
                node.$onOpen.call(node);
            }
        };
        ViewLayerLaya2D.prototype.onViewClose = function (view) {
            var node = view;
            if (node.$onClose) {
                node.$onClose.call(node);
            }
        };
        ViewLayerLaya2D.prototype.onViewRemove = function (view) {
            var node = view;
            if (node.$onRemove) {
                node.$onRemove.call(node);
            }
        };
        return ViewLayerLaya2D;
    }(ViewLayerLaya));
    sunui.ViewLayerLaya2D = ViewLayerLaya2D;
    var ViewLayerLaya3D = (function (_super) {
        __extends(ViewLayerLaya3D, _super);
        function ViewLayerLaya3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLaya3D.prototype.onViewCreate = function (view, args) {
            var components = view.getComponents(Laya.Component) || [];
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.$onCreate) {
                    if (args instanceof Array === false) {
                        component.$onCreate.call(component, args);
                    }
                    else {
                        component.$onCreate.apply(component, args);
                    }
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
        return ViewLayerLaya3D;
    }(ViewLayerLaya));
    sunui.ViewLayerLaya3D = ViewLayerLaya3D;
    var M;
    (function (M) {
        M.downloadSpeed = ResourceDownloadSpeedEnum.NONE;
        M.cacheMap = {};
        M.templets = {};
        M.references = {};
        M.downloadLimiters = [];
    })(M = sunui.M || (sunui.M = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.RETRY_CONFIRM = "sunui.NotifyKey.RETRY_CONFIRM";
        NotifyKey.REGISTER_SCENES = "sunui.NotifyKey.REGISTER_SCENES";
        NotifyKey.BEFORE_LOAD_SCENE = "sunui.NotifyKey.BEFORE_LOAD_SCENE";
        NotifyKey.LOAD_SCENE = "sunui.NotifyKey.LOAD_SCENE";
        NotifyKey.UNLOAD_SCENE = "sunui.NotifyKey.UNLOAD_SCENE";
        NotifyKey.ENTER_SCENE = "sunui.NotifyKey.ENTER_SCENE";
        NotifyKey.EXIT_SCENE = "sunui.NotifyKey.EXIT_SCENE";
        NotifyKey.LEAVE_SCENE = "sunui.NotifyKey.LEAVE_SCENE";
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        NotifyKey.ON_POPUP_CLOSED = "sunui.NotifyKey.ON_POPUP_CLOSED";
        NotifyKey.ON_POPUP_REMOVED = "sunui.NotifyKey.ON_POPUP_REMOVED";
        NotifyKey.ON_CALLER_DESTROYED = "sunui.NotifyKey.ON_CALLER_DESTROYED";
        NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED = "sunui.NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED";
        NotifyKey.ON_URL_SAFETY_LOADER_CREATED = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_CREATED";
        NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE";
        NotifyKey.ASSET_SAFETY_LOADER_RETRY = "sunui.NotifyKey.ASSET_SAFETY_LOADER_RETRY";
        NotifyKey.REGISTER_TWEEN_OBJECT = "sunui.NotifyKey.REGISTER_TWEEN_OBJECT";
    })(NotifyKey = sunui.NotifyKey || (sunui.NotifyKey = {}));
    var Resource;
    (function (Resource) {
        Resource.res3dRoot = null;
        function setDownloadSpeed(speed) {
            M.downloadSpeed = speed;
        }
        Resource.setDownloadSpeed = setDownloadSpeed;
        function lock(url) {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    return;
                }
            }
            var ext = suncom.Common.getFileExtension(url);
            var str = url.substr(0, url.length - ext.length);
            var urls = [url];
            if (ext === "sk" || ext === "atlas") {
                urls.push(str + "png");
            }
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }
            for (var i = 0; i < urls.length; i++) {
                UrlLocker.lock(urls[i]);
            }
        }
        Resource.lock = lock;
        function unlock(url) {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    return;
                }
            }
            var ext = suncom.Common.getFileExtension(url);
            var str = url.substr(0, url.length - ext.length);
            var urls = [url];
            if (ext === "sk" || ext === "atlas") {
                urls.push(str + "png");
            }
            else if (Resource.isRes3dUrl(url) === true) {
                urls.push(str + "json");
            }
            for (var i = 0; i < urls.length; i++) {
                UrlLocker.unlock(urls[i]);
            }
        }
        Resource.unlock = unlock;
        function prepare(urls, method, caller) {
            var handler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, function (id) { });
            }
            else {
                handler = suncom.Handler.create(caller, method);
            }
            var id = suncom.Common.createHashId();
            M.templets[id] = new Templet(id, urls, handler);
            return id;
        }
        Resource.prepare = prepare;
        function release(id) {
            var templet = M.templets[id] || null;
            if (templet !== null) {
                delete M.templets[id];
                templet.destroy();
            }
            return 0;
        }
        Resource.release = release;
        function createSync(url, data) {
            var res = M.cacheMap[url] || null;
            if (suncom.Common.getFileExtension(url) === "sk") {
                return res.buildArmature(data);
            }
            else if (Resource.isRes3dUrl(url) === true) {
                if (res === null) {
                    res = M.cacheMap[url] = Laya.loader.getRes(url);
                }
                return Laya.Sprite3D.instantiate(res);
            }
            else {
                return Laya.loader.getRes(url);
            }
        }
        Resource.createSync = createSync;
        function createRes3dSync(name) {
            return Resource.createSync(Resource.getRes3dUrlByName(name));
        }
        Resource.createRes3dSync = createRes3dSync;
        function clearResByUrl(url) {
            UrlLocker.clearResByUrl(url);
        }
        Resource.clearResByUrl = clearResByUrl;
        function getRes3dPackRoot(pack) {
            if (Resource.res3dRoot === null) {
                throw Error("\u8BF7\u5148\u6307\u5B9A3D\u8D44\u6E90\u76EE\u5F55\uFF1Asunui.Resource.res3dRoot=");
            }
            return Resource.res3dRoot + "/LayaScene_" + pack + "/Conventional/";
        }
        Resource.getRes3dPackRoot = getRes3dPackRoot;
        function isRes3dUrl(url) {
            return url.indexOf(Resource.res3dRoot) === 0;
        }
        Resource.isRes3dUrl = isRes3dUrl;
        function getRes3dJsonUrl(url) {
            return suncom.Common.replacePathExtension(url, "json");
        }
        Resource.getRes3dJsonUrl = getRes3dJsonUrl;
        function getRes3dUrlByName(name) {
            if (suncom.Common.getFileExtension(name) === null) {
                name += ".lh";
            }
            return Resource.getRes3dPackRoot(suncom.Common.getFileName(name)) + name;
        }
        Resource.getRes3dUrlByName = getRes3dUrlByName;
        function getAssetUrlsByRes3dJson(json) {
            var urls = [];
            var root = Resource.getRes3dPackRoot(json.pack);
            for (var i = 0; i < json.files.length; i++) {
                urls.push(root + json.files[i]);
            }
            for (var i = 0; i < json.resources.length; i++) {
                urls.push(root + json.resources[i]);
            }
            return urls;
        }
        Resource.getAssetUrlsByRes3dJson = getAssetUrlsByRes3dJson;
        function checkLoadList(urls) {
            Resource.removeUnnecessaryResources(urls, "sk", "png", "龙骨预加载无需指定PNG资源");
            Resource.removeUnnecessaryResources(urls, "atlas", "png", "图集预加载无需指定PNG资源");
            return Resource.removeDuplicateResources(urls);
        }
        Resource.checkLoadList = checkLoadList;
        function removeDuplicateResources(urls) {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                var array = [];
                for (var i = 0; i < urls.length; i++) {
                    var url = urls[i];
                    if (array.indexOf(url) === -1) {
                        array.push(url);
                    }
                    else {
                        suncom.Logger.error(suncom.DebugMode.ANY, "\u91CD\u590D\u7684\u9884\u52A0\u8F7D\u8D44\u6E90\u6587\u4EF6 " + url);
                    }
                }
                return array;
            }
            return urls;
        }
        Resource.removeDuplicateResources = removeDuplicateResources;
        function removeUnnecessaryResources(urls, match, remove, msg) {
            if (suncom.Global.debugMode & suncom.DebugMode.ENGINE) {
                var array = [];
                for (var i = 0; i < urls.length; i++) {
                    var url = urls[i];
                    if (suncom.Common.getFileExtension(url) === match) {
                        array.push(url);
                    }
                }
                for (var i = 0; i < array.length; i++) {
                    var url = array[i];
                    var png = url.substring(0, url.length - match.length) + remove;
                    do {
                        var index = urls.indexOf(png);
                        if (index === -1) {
                            break;
                        }
                        urls.splice(index, 1);
                        suncom.Logger.error(suncom.DebugMode.ANY, msg + " " + url);
                    } while (true);
                }
            }
        }
        Resource.removeUnnecessaryResources = removeUnnecessaryResources;
    })(Resource = sunui.Resource || (sunui.Resource = {}));
    var SceneHeap;
    (function (SceneHeap) {
        var $infos = [];
        function findLatestHeapIndexByName(name) {
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
            var index = findLatestHeapIndexByName(name);
            if (index > -1) {
                $infos.splice(index, 1);
            }
            return index > -1;
        }
        SceneHeap.removeHistory = removeHistory;
        function hasHistory(name) {
            return findLatestHeapIndexByName(name) > -1;
        }
        SceneHeap.hasHistory = hasHistory;
        function getLastestSceneInfo() {
            if ($infos.length > 0) {
                return $infos[$infos.length - 1];
            }
            return null;
        }
        SceneHeap.getLastestSceneInfo = getLastestSceneInfo;
        function getLastestSceneInfoByName(name) {
            var index = findLatestHeapIndexByName(name);
            if (index > -1) {
                return $infos[index];
            }
            return null;
        }
        SceneHeap.getLastestSceneInfoByName = getLastestSceneInfoByName;
        function deleteHistories(deleteCount) {
            while ($infos.length > 1 && deleteCount > 0) {
                $infos.pop();
                deleteCount--;
            }
        }
        SceneHeap.deleteHistories = deleteHistories;
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
    var UrlLocker;
    (function (UrlLocker) {
        function lock(url) {
            var reference = M.references[url] || 0;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "reference:" + reference + ", lock:" + url);
            }
            M.references[url] = reference + 1;
        }
        UrlLocker.lock = lock;
        function unlock(url) {
            var reference = M.references[url] || 0;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "reference:" + reference + ", unlock:" + url);
            }
            suncom.Test.expect(reference).interpret("\u5C1D\u8BD5\u89E3\u9501\u4E0D\u5B58\u5728\u7684\u8D44\u6E90 url\uFF1A" + url).toBeGreaterThan(0);
            if (reference > 1) {
                M.references[url] = reference - 1;
            }
            else {
                delete M.references[url];
                $clearRes(url);
            }
        }
        UrlLocker.unlock = unlock;
        function clearResByUrl(url) {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.trace(suncom.DebugMode.ANY, "clearResUrl:" + url);
            }
            var item = M.cacheMap[url] || null;
            if (item !== null) {
                item.dispose && item.dispose();
                item.destroy && item.destroy();
                delete M.cacheMap[url];
            }
            var res = Laya.loader.getRes(url) || null;
            if (res === null) {
                Laya.loader.cancelLoadByUrl(url);
            }
            else {
                res.dispose && res.dispose();
                res.destroy && res.destroy();
                Laya.loader.clearRes(url);
            }
        }
        UrlLocker.clearResByUrl = clearResByUrl;
        function $clearRes(url) {
            if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                var urls = Resource.getAssetUrlsByRes3dJson(Laya.loader.getRes(url));
                for (var i = 0; i < urls.length; i++) {
                    UrlLocker.clearResByUrl(urls[i]);
                }
            }
            UrlLocker.clearResByUrl(url);
        }
    })(UrlLocker = sunui.UrlLocker || (sunui.UrlLocker = {}));
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
