var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
    var PopupWinSizeEnum;
    (function (PopupWinSizeEnum) {
        PopupWinSizeEnum[PopupWinSizeEnum["NORMAL"] = 0] = "NORMAL";
        PopupWinSizeEnum[PopupWinSizeEnum["SMALL"] = 1] = "SMALL";
        PopupWinSizeEnum[PopupWinSizeEnum["MIDDLE"] = 2] = "MIDDLE";
        PopupWinSizeEnum[PopupWinSizeEnum["LARGE"] = 3] = "LARGE";
    })(PopupWinSizeEnum = sunui.PopupWinSizeEnum || (sunui.PopupWinSizeEnum = {}));
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
        AbstractPopupCommand.prototype.$makeProps = function (view, props) {
            if (props.x === void 0 && props.left === void 0 && props.right === void 0 && props.centerX === void 0) {
                props.centerX = 0;
            }
            if (props.y === void 0 && props.top === void 0 && props.bottom === void 0 && props.centerY === void 0) {
                switch (view.winSize) {
                    case PopupWinSizeEnum.LARGE:
                        props.y = 70;
                        break;
                    case PopupWinSizeEnum.MIDDLE:
                        props.y = 219;
                        break;
                    case PopupWinSizeEnum.SMALL:
                        props.y = 299;
                        break;
                    default:
                        props.centerY = 0;
                        break;
                }
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
            if (view instanceof fairygui.GComponent) {
                props.centerX !== void 0 && this.$setProp(view, "centerX");
                props.centerY !== void 0 && this.$setProp(view, "centerY");
            }
            if (duration === 0 || (props.flags & PopupFlagEnum.SIMPLY) === PopupFlagEnum.SIMPLY) {
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
                if (view instanceof fairygui.GComponent) {
                    props.left !== void 0 && this.$setProp(view, "left");
                    props.right !== void 0 && this.$setProp(view, "right");
                    props.top !== void 0 && this.$setProp(view, "top");
                    props.bottom !== void 0 && this.$setProp(view, "bottom");
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
                var data = suncom.Common.copy(props);
                if (view instanceof fairygui.GComponent) {
                    data.update = suncom.Handler.create(this, this.$applyProps, [view, data], false);
                }
                var mod = props.autoDestroy === true ? suncore.ModuleEnum.CUSTOM : suncore.ModuleEnum.SYSTEM;
                Tween.get(view, mod).to(data, duration, props.ease);
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
                var data = suncom.Common.copy(props);
                if (view instanceof fairygui.GComponent) {
                    data.update = suncom.Handler.create(this, this.$applyProps, [view, data], false);
                }
                var mod = props.autoDestroy === true ? suncore.ModuleEnum.CUSTOM : suncore.ModuleEnum.SYSTEM;
                Tween.get(view, mod).to(data, duration);
            }
        };
        AbstractPopupCommand.prototype.$applyProps = function (view, props) {
            var keys = ["x", "y", "left", "right", "top", "bottom", "scaleX", "scaleY", "alpha", "centerX", "centerY"];
            for (var i = keys.length - 1; i > -1; i--) {
                var key = keys[i];
                if (props[key] === void 0) {
                    keys.splice(i, 1);
                }
            }
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                this.$setProp(view, key);
            }
        };
        AbstractPopupCommand.prototype.$setProp = function (view, key) {
            switch (key) {
                case "left":
                    view.x = view.left;
                    break;
                case "right":
                    view.x = suncom.Global.width - view.right;
                    break;
                case "top":
                    view.y = view.top;
                    break;
                case "bottom":
                    view.y = suncom.Global.height - view.bottom;
                    break;
                case "centerX":
                    view.x = (suncom.Global.width - view.width * view.scaleX) * 0.5 + view.centerX;
                    break;
                case "centerY":
                    view.y = (suncom.Global.height - view.height * view.scaleY) * 0.5 + view.centerY;
                    break;
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
            _this.$complete = null;
            _this.$url = null;
            _this.$loaders = [];
            _this.$doneCount = 0;
            _this.$url = url;
            _this.$complete = complete;
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
        };
        AssetLoader.prototype.load = function () {
            if (this.$destroyed === false) {
                this.$doLoad();
            }
        };
        AssetLoader.prototype.$loadAssets = function (urls) {
            this.$doneCount = this.$loaders.length;
            for (var i = 0; i < urls.length; i++) {
                this.$loaders.push(new UrlSafetyPuppetLoader(urls[i], suncom.Handler.create(this, this.$onLoadAsset)));
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
        };
        Object.defineProperty(AssetLoader.prototype, "progress", {
            get: function () {
                var value = 0;
                for (var i = 0; i < this.$loaders.length; i++) {
                    value += this.$loaders[i].progress;
                }
                return value / this.$loaders.length;
            },
            enumerable: false,
            configurable: true
        });
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
            _this.$retryer = new Retryer(RetryMethodEnum.TERMINATE, suncom.Handler.create(_this, _this.$onRetryConfirmed), "资源加载失败！");
            Resource.lock(url);
            _this.$url = url;
            _this.$complete = complete;
            _this.$doLoad();
            return _this;
        }
        AssetSafetyLoader.prototype.$doLoad = function () {
            var handler = suncom.Handler.create(this, this.$onLoad);
            if (Resource.isFGuiUrl(this.$url) === true) {
                this.$loader = new FGuiLoader(this.$url, handler);
            }
            else if (Resource.isRes3dUrl(this.$url) === true) {
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
        };
        AssetSafetyLoader.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.facade.removeObserver(NotifyKey.ASSET_SAFETY_LOADER_RETRY, this.$onAssetSafetyLoaderRetry, this);
            this.$loader.destroy();
            this.$retryer.cancel();
            Resource.unlock(this.$url);
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
        Object.defineProperty(AssetSafetyLoader.prototype, "progress", {
            get: function () {
                return this.$loader.progress;
            },
            enumerable: false,
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
            var mod = info.autoDestroy === true ? suncore.ModuleEnum.CUSTOM : suncore.ModuleEnum.SYSTEM;
            if ((info.props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                var tween = Tween.get(info.mask, mod);
                if (duration > 200 && (info.props.flags & PopupFlagEnum.SYNC_FADE_TIME) === PopupFlagEnum.NONE) {
                    tween.wait(duration - 200).to({ alpha: 0 }, 200);
                }
                else {
                    tween.to({ alpha: 0 }, duration);
                }
            }
            this.$applyCloseProps(view, info.props, duration);
            suncore.System.addTimer(mod, duration, this.$onCloseFinish, this, [info, view]);
        };
        ClosePopupCommand.prototype.$onCloseFinish = function (view) {
            M.viewLayer.removeInfoByView(view);
        };
        return ClosePopupCommand;
    }(AbstractPopupCommand));
    sunui.ClosePopupCommand = ClosePopupCommand;
    var FGuiLoader = (function (_super) {
        __extends(FGuiLoader, _super);
        function FGuiLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FGuiLoader.prototype.$doLoad = function () {
            this.$loadAssets([this.$url]);
        };
        FGuiLoader.prototype.$onAssetsLoaded = function (ok) {
            this.$onComplete(ok);
        };
        return FGuiLoader;
    }(AssetLoader));
    sunui.FGuiLoader = FGuiLoader;
    var LoadingService = (function (_super) {
        __extends(LoadingService, _super);
        function LoadingService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$undoList = [];
            _this.$isRetryPrompting = false;
            _this.$loadingMap = {};
            return _this;
        }
        LoadingService.prototype.$onRun = function () {
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.registerObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.registerObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        };
        LoadingService.prototype.$onStop = function () {
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, this.$onUrlSafetyLoaderCreated, this);
            this.facade.removeObserver(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this.$onUrlSafetyLoaderComplete, this);
            this.facade.removeObserver(NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED, this.$onAssetSafetyLoaderFailed, this);
        };
        LoadingService.prototype.$onUrlSafetyLoaderCreated = function (loader) {
            this.$undoList.unshift(loader);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "create loader for url " + loader.url + ", loading list length:" + M.loaders.length + ", undo list length:" + this.$undoList.length);
            }
            this.$next();
        };
        LoadingService.prototype.$onUrlSafetyLoaderComplete = function (loader) {
            var index = M.loaders.indexOf(loader);
            suncom.Test.expect(index).toBeGreaterOrEqualThan(0);
            M.loaders.splice(index, 1);
            delete this.$loadingMap[loader.url];
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "remove loader for url " + loader.url + ", loading list length:" + M.loaders.length + ", undo list length:" + this.$undoList.length);
            }
            this.$next();
        };
        LoadingService.prototype.$next = function () {
            while (this.$undoList.length > 0 && M.loaders.length < Laya.loader.maxLoader) {
                var ok = false;
                for (var i = this.$undoList.length - 1; i > -1; i--) {
                    var loader = this.$undoList[i];
                    var url = loader.url;
                    if (this.$loadingMap[url] === true) {
                        continue;
                    }
                    this.$undoList.splice(i, 1);
                    if (loader.destroyed === true) {
                        continue;
                    }
                    this.$loadingMap[url] = true;
                    ok = true;
                    M.loaders.push(loader);
                    if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                        suncom.Logger.log(suncom.DebugMode.ANY, "load next url " + loader.url + ", loading list length:" + M.loaders.length);
                    }
                    loader.load();
                    break;
                }
                if (ok === false) {
                    break;
                }
            }
        };
        LoadingService.prototype.$onAssetSafetyLoaderFailed = function () {
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
        LoadingService.prototype.$onRetryConfirmed = function (option) {
            if (option === ConfirmOptionValueEnum.YES) {
                this.facade.sendNotification(NotifyKey.ASSET_SAFETY_LOADER_RETRY);
            }
            else {
                this.facade.sendNotification(suncore.NotifyKey.SHUTDOWN);
            }
            this.$isRetryPrompting = false;
        };
        return LoadingService;
    }(suncore.BaseService));
    sunui.LoadingService = LoadingService;
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
            var loaded = Laya.loader.getRes(this.$url) ? true : false;
            if (suncom.Common.getFileExtension(this.$url) === "ls" || loaded === true) {
                this.$loadAssets([url]);
            }
            else {
                this.$loaders.push(new UrlSafetyPuppetLoader(url, suncom.Handler.create(this, this.$onUrlLoaded)));
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
    var Retryer = (function (_super) {
        __extends(Retryer, _super);
        function Retryer(method, confirmHandler, prompt) {
            if (confirmHandler === void 0) { confirmHandler = null; }
            if (prompt === void 0) { prompt = null; }
            var options = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                options[_i - 3] = arguments[_i];
            }
            var _this = _super.call(this, suncore.MsgQModEnum.MMI) || this;
            _this.$var_method = RetryMethodEnum.AUTO;
            _this.$var_confirmHandler = null;
            _this.$var_prompt = null;
            _this.$var_options = [];
            _this.$var_currentRetries = 0;
            _this.$var_retryHandler = null;
            _this.$var_retryTimerId = 0;
            _this.$var_prompting = false;
            _this.$var_method = method;
            _this.$var_confirmHandler = confirmHandler;
            _this.$var_prompt = prompt;
            _this.$var_options = options;
            return _this;
        }
        Retryer.prototype.run = function (delay, handler, maxRetries) {
            if (maxRetries === void 0) { maxRetries = 2; }
            if (this.$var_method === RetryMethodEnum.AUTO || this.$var_currentRetries < maxRetries) {
                if (this.$var_retryTimerId === 0) {
                    this.$var_retryHandler = handler;
                    this.$var_retryTimerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, delay, this.$func_onRetryTimer, this);
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, "\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u8BF7\u6C42 method:" + suncom.Common.getMethodName(handler.method, handler.caller) + ", caller:" + suncom.Common.getQualifiedClassName(handler.caller));
                }
            }
            else {
                if (this.$var_prompting === false) {
                    this.$var_prompting = true;
                    if (this.$var_method === RetryMethodEnum.TERMINATE) {
                        suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$func_onConfirmReplied, [ConfirmOptionValueEnum.NO]);
                    }
                    else {
                        var handler_1 = suncom.Handler.create(this, this.$func_onConfirmReplied);
                        this.facade.sendNotification(NotifyKey.RETRY_CONFIRM, [this.$var_prompt, this.$var_options, handler_1]);
                    }
                }
                else {
                    suncom.Logger.warn(suncom.DebugMode.ANY, "\u5DF1\u5FFD\u7565\u7684\u91CD\u8BD5\u7684\u8BE2\u95EE\u8BF7\u6C42 prompt:" + this.$var_prompt);
                }
            }
        };
        Retryer.prototype.$func_onConfirmReplied = function (option) {
            if (this.$var_prompting === true) {
                this.$var_prompting = false;
                if (this.$var_confirmHandler !== null) {
                    this.$var_confirmHandler.runWith(option);
                }
            }
        };
        Retryer.prototype.$func_onRetryTimer = function () {
            this.$var_retryTimerId = 0;
            this.$var_currentRetries++;
            this.$var_retryHandler.run();
        };
        Retryer.prototype.cancel = function () {
            this.$var_prompting = false;
            this.$var_retryTimerId = suncore.System.removeTimer(this.$var_retryTimerId);
        };
        Retryer.prototype.reset = function () {
            this.$var_currentRetries = 0;
        };
        Object.defineProperty(Retryer.prototype, "currentRetries", {
            get: function () {
                return this.$var_currentRetries;
            },
            enumerable: false,
            configurable: true
        });
        return Retryer;
    }(puremvc.Notifier));
    sunui.Retryer = Retryer;
    var Runnable = (function (_super) {
        __extends(Runnable, _super);
        function Runnable(command, condition) {
            var _this = _super.call(this) || this;
            _this.$var_command = null;
            _this.$var_released = false;
            _this.$var_condition = null;
            _this.$var_command = command;
            _this.$var_condition = condition;
            _this.facade.registerObserver(command, _this.$func_onCommandCallback, _this, false, suncom.EventPriorityEnum.HIGHEST);
            return _this;
        }
        Runnable.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.facade.removeObserver(this.$var_command, this.$func_onCommandCallback, this);
        };
        Object.defineProperty(Runnable.prototype, "var_command", {
            get: function () {
                return this.$var_command;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Runnable.prototype, "var_released", {
            get: function () {
                return this.$var_released;
            },
            enumerable: false,
            configurable: true
        });
        return Runnable;
    }(puremvc.Notifier));
    sunui.Runnable = Runnable;
    var Runtime = (function (_super) {
        __extends(Runtime, _super);
        function Runtime(timeout) {
            if (timeout === void 0) { timeout = 0; }
            var _this = _super.call(this) || this;
            _this.$var_timerId = 0;
            _this.$var_commands = [];
            if (timeout > 0) {
                _this.$var_timerId = suncore.System.addTimer(suncore.ModuleEnum.TIMELINE, timeout, _this.destroy, _this);
            }
            _this.facade.registerObserver(NotifyKey.NEXT_COMMAND, _this.$func_onNextCommand, _this);
            return _this;
        }
        Runtime.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.$var_timerId > 0 && suncore.System.removeTimer(this.$var_timerId);
            this.facade.removeObserver(NotifyKey.NEXT_COMMAND, this.$func_onNextCommand, this);
            for (var i = 0; i < this.$var_commands.length; i++) {
                this.$var_commands[i].destroy();
            }
        };
        Runtime.prototype.$func_onNextCommand = function (command) {
            var index = -1;
            for (var i = 0; i < this.$var_commands.length; i++) {
                if (this.$var_commands[i] === command) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return;
            }
            index++;
            this.facade.notifyCancel();
            if (index < this.$var_commands.length) {
                var command_1 = this.$var_commands[index];
                if (command_1.running === false) {
                    command_1.run();
                }
            }
        };
        Runtime.prototype.$addCommand = function (command, condition, caller, monitors) {
            this.$var_commands.push(new Command(command, suncom.Handler.create(caller, condition, void 0, false), monitors));
            if (this.$var_commands[0].running === false) {
                this.$var_commands[0].run();
            }
        };
        return Runtime;
    }(puremvc.Notifier));
    sunui.Runtime = Runtime;
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
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$beforeLoadScene, [info, data]);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$loadScene, [info, data]);
        };
        SceneLayer.prototype.$beforeLoadScene = function (info, data) {
            this.$data = data;
            this.$sceneName = info.name;
            this.facade.sendNotification(NotifyKey.BEFORE_LOAD_SCENE);
            info.iniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.iniCls(info, data));
        };
        SceneLayer.prototype.$loadScene = function (info, data) {
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            info.scene3d = info.scene3d || null;
            this.facade.sendNotification(NotifyKey.LOAD_SCENE, [info, data]);
        };
        SceneLayer.prototype.$onEnterScene = function (scene2d, scene3d) {
            this.$ready = true;
            this.$scene2d = scene2d || null;
            this.$scene3d = scene3d || null;
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, true);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
        };
        SceneLayer.prototype.$exitScene = function () {
            this.facade.sendNotification(NotifyKey.EXIT_SCENE, this.$sceneName);
            this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            var info = SceneManager.getConfigByName(this.$sceneName);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$onLeaveScene, [info]);
        };
        SceneLayer.prototype.$onLeaveScene = function (info) {
            info.uniCls && suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new info.uniCls(info, this.$data));
            this.facade.sendNotification(NotifyKey.BEFORE_LEAVE_SCENE);
            this.facade.sendNotification(NotifyKey.LEAVE_SCENE);
            this.facade.sendNotification(NotifyKey.UNLOAD_SCENE, [this.$scene2d, this.$scene3d]);
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(this, this.$onExitScene));
        };
        SceneLayer.prototype.$onExitScene = function () {
            this.$sceneName = 0;
        };
        SceneLayer.prototype.enterScene = function (name, data) {
            if (this.$ready === false) {
                return false;
            }
            this.$ready = false;
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, false);
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
            this.facade.sendNotification(NotifyKey.SCENE_IS_READY, false);
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
        Object.defineProperty(SceneLayer.prototype, "ready", {
            get: function () {
                return this.$ready;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "scene2d", {
            get: function () {
                return this.$scene2d;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "scene3d", {
            get: function () {
                return this.$scene3d;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneLayer.prototype, "sceneName", {
            get: function () {
                return this.$sceneName;
            },
            enumerable: false,
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
            if (props.ease === void 0) {
                props.ease = Laya.Ease.backOut;
            }
            if (props.flags === void 0) {
                props.flags = PopupFlagEnum.NONE;
            }
            if (props.keepNode === void 0) {
                props.keepNode = false;
            }
            var autoDestroy = true;
            if (props.autoDestroy !== void 0) {
                autoDestroy = props.autoDestroy;
            }
            else if (view.autoDestroy !== void 0) {
                autoDestroy = view.autoDestroy;
            }
            props.autoDestroy = autoDestroy;
            var args = props.args;
            var level = props.level || view.zOrder || UILevel.POPUP;
            var keepNode = props.keepNode;
            delete props.args;
            delete props.level;
            delete props.keepNode;
            if (view instanceof fairygui.GComponent && view.is1920x1080 === false) {
                var scale = suncom.Global.height / 720;
                view["setScale"](scale, scale);
            }
            if (view instanceof Laya.View) {
                view.pivot(view.width * 0.5, view.height * 0.5);
            }
            this.$makeProps(view, props);
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
                cancelAllowed: true,
                autoDestroy: autoDestroy
            };
            M.viewLayer.addToStack(info);
            M.viewLayer.addChild(mask);
            M.viewLayer.addChild(view);
            M.viewLayer.onViewCreate(view, args);
            var mod = autoDestroy === true ? suncore.ModuleEnum.CUSTOM : suncore.ModuleEnum.SYSTEM;
            if ((props.flags & PopupFlagEnum.TRANSPARENT) === PopupFlagEnum.NONE) {
                if (props.flags & PopupFlagEnum.SYNC_FADE_TIME) {
                    Tween.get(mask, mod).from({ alpha: 0 }, duration);
                }
                else {
                    Tween.get(mask, mod).from({ alpha: 0 }, Math.min(200, duration));
                }
            }
            this.$applyShowProps(view, props, duration);
            suncore.System.addTimer(mod, duration, this.$onPopupFinish, this, [info, view]);
        };
        ShowPopupCommand.prototype.$onPopupFinish = function (info, view) {
            if (info.closed === false) {
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
                Resource.lock(this.$url);
                new Laya.Skeleton().load(this.$url, Laya.Handler.create(this, this.$onSkeletonCreated));
            }
            else {
                this.$onComplete(false);
            }
        };
        SkeletonLoader.prototype.$onSkeletonCreated = function (skeleton) {
            skeleton.destroy();
            if (this.destroyed === false) {
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
            _this.$loaders = [];
            _this.$doneList = [];
            _this.$progress = -1;
            _this.$id = id;
            _this.$handler = handler;
            urls = Resource.checkLoadList(urls);
            suncom.Test.expect(urls.length).toBeGreaterThan(0);
            while (urls.length > 0) {
                var url = urls.shift();
                var handler_2 = suncom.Handler.create(_this, _this.$onResourceCreated);
                var loader = new AssetSafetyLoader(url, handler_2);
                _this.$loaders.push(loader);
            }
            _this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, _this.$onEnterFrame, _this);
            return _this;
        }
        Templet.prototype.$onResourceCreated = function (url) {
            if (this.$destroyed === true) {
                return;
            }
            this.$doneList.push(url);
            if (this.$doneList.length < this.$loaders.length) {
                return;
            }
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.$handler.runWith([this.$id, 1]);
        };
        Templet.prototype.$onEnterFrame = function () {
            var progress = 0;
            for (var i = 0; i < this.$loaders.length; i++) {
                progress += this.$loaders[i].progress;
            }
            progress /= this.$loaders.length;
            if (this.$progress === progress) {
                return;
            }
            this.$progress = progress;
            if (this.$handler.method.length === 2) {
                this.$handler.runWith([this.$id, this.$progress]);
            }
        };
        Templet.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$releaseAllResources);
        };
        Templet.prototype.$releaseAllResources = function () {
            while (this.$loaders.length > 0) {
                this.$loaders.pop().destroy();
            }
        };
        return Templet;
    }(puremvc.Notifier));
    sunui.Templet = Templet;
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$var_hashId = 0;
            _this.$var_mod = suncore.ModuleEnum.SYSTEM;
            _this.$var_target = null;
            _this.$var_props = null;
            _this.$var_actions = [];
            _this.$var_usePool = false;
            return _this;
        }
        Tween.prototype.$func_setTo = function (target, mod) {
            if (this.$var_hashId === -1) {
                throw Error("Tween\u5DF1\u88AB\u56DE\u6536\uFF01\uFF01\uFF01");
            }
            this.$var_mod = mod;
            this.$var_target = target;
            this.$var_hashId = suncom.Common.createHashId();
            if (suncore.System.isModuleStopped(mod) === false) {
                this.facade.sendNotification(NotifyKey.REGISTER_TWEEN_OBJECT, this);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, "\u5C1D\u8BD5\u6DFB\u52A0\u7F13\u52A8\uFF0C\u4F46\u65F6\u95F4\u8F74\u5DF1\u505C\u6B62\uFF0Cmod:" + suncore.ModuleEnum[mod]);
            }
            return this;
        };
        Tween.prototype.cancel = function () {
            this.$var_props = null;
            while (this.$var_actions.length > 0) {
                this.$var_actions.pop().recover();
            }
            return this;
        };
        Tween.prototype.recover = function () {
            if (suncom.Pool.recover("sunui.Tween", this.cancel()) === true) {
                this.$var_hashId = -1;
            }
        };
        Tween.prototype.to = function (props, duration, ease, complete) {
            if (ease === void 0) { ease = null; }
            if (complete === void 0) { complete = null; }
            var keys = Object.keys(props);
            var item = this.$var_props === null ? this.$var_target : this.$var_props;
            this.$func_createTweenInfo(keys, item, props, duration, ease, props.update || null, complete);
            return this;
        };
        Tween.prototype.from = function (props, duration, ease, complete) {
            if (ease === void 0) { ease = null; }
            if (complete === void 0) { complete = null; }
            var keys = Object.keys(props);
            var item = this.$var_props === null ? this.$var_target : this.$var_props;
            this.$func_createTweenInfo(keys, props, item, duration, ease, props.update || null, complete);
            return this;
        };
        Tween.prototype.by = function (props, duration, ease, complete) {
            if (ease === void 0) { ease = null; }
            if (complete === void 0) { complete = null; }
            var keys = Object.keys(props);
            var item = this.$var_props === null ? this.$var_target : this.$var_props;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (this.$var_props === null || this.$var_props[key] === void 0) {
                    props[key] += this.$var_target[key];
                }
                else {
                    props[key] += item[key];
                }
            }
            this.to(props, duration, ease, complete);
            return this;
        };
        Tween.prototype.$func_createTweenInfo = function (keys, from, to, duration, ease, update, complete) {
            this.$var_props = this.$var_props || {};
            var action = TweenAction.create();
            action.ease = ease;
            action.update = update;
            action.complete = complete;
            action.time = suncore.System.getModuleTimestamp(this.$var_mod);
            action.duration = duration;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key === "update") {
                    continue;
                }
                var clip = TweenActionClip.create();
                clip.to = to[key];
                clip.from = from[key];
                clip.prop = key;
                if (clip.from === void 0) {
                    clip.from = this.$var_target[key];
                }
                this.$var_props[key] = to[key];
                if (this.$var_actions.length === 0) {
                    this.$var_target[clip.prop] = clip.from;
                }
                action.clips.push(clip);
            }
            if (action.update !== null) {
                action.update.run();
            }
            this.$func_addAction(action);
        };
        Tween.prototype.$func_addAction = function (action) {
            if (this.$var_hashId === -1) {
                throw Error("Tween\u5DF1\u88AB\u56DE\u6536\uFF01\uFF01\uFF01");
            }
            this.$var_actions.push(action);
        };
        Tween.prototype.wait = function (delay, complete) {
            if (complete === void 0) { complete = null; }
            var action = TweenAction.create();
            action.complete = complete;
            action.time = suncore.System.getModuleTimestamp(this.$var_mod);
            action.duration = delay;
            this.$func_addAction(action);
            return this;
        };
        Tween.prototype.func_doAction = function () {
            var time = suncore.System.getModuleTimestamp(this.$var_mod);
            var action = this.$var_actions[0];
            if (this.$var_target instanceof fairygui.GObject) {
                if (this.$var_target.isDisposed === true) {
                    this.cancel();
                    return 0;
                }
            }
            else if (this.$var_target.destroyed === true) {
                this.cancel();
                return 0;
            }
            var done = false;
            var timeLeft = 0;
            var duration = time - action.time;
            if (duration > action.duration) {
                done = true;
                timeLeft = duration - action.duration;
                duration = action.duration;
            }
            var func = action.ease || this.$func_easeNone;
            for (var i = 0; i < action.clips.length; i++) {
                var clip = action.clips[i];
                if (done === true) {
                    this.$var_target[clip.prop] = clip.to;
                }
                else {
                    this.$var_target[clip.prop] = func(duration, clip.from, clip.to - clip.from, action.duration);
                }
            }
            if (action.update !== null) {
                action.update.run();
            }
            if (done === false) {
                return 0;
            }
            this.$var_actions.shift();
            if (this.$var_actions.length > 0) {
                this.$var_actions[0].time = suncore.System.getModuleTimestamp(this.$var_mod);
            }
            action.complete !== null && action.complete.run();
            action.recover();
            return timeLeft;
        };
        Tween.prototype.$func_easeNone = function (t, b, c, d) {
            var a = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        };
        Tween.prototype.usePool = function (value) {
            this.$var_usePool = value;
            return this;
        };
        Tween.prototype.func_getUsePool = function () {
            return this.$var_usePool;
        };
        Object.defineProperty(Tween.prototype, "var_mod", {
            get: function () {
                return this.$var_mod;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "var_canceled", {
            get: function () {
                return this.$var_actions.length === 0;
            },
            enumerable: false,
            configurable: true
        });
        Tween.get = function (target, mod) {
            if (mod === void 0) { mod = suncore.ModuleEnum.CUSTOM; }
            var tween = new Tween();
            tween.$var_hashId = 0;
            return tween.usePool(true).$func_setTo(target, mod);
        };
        return Tween;
    }(puremvc.Notifier));
    sunui.Tween = Tween;
    var TweenAction = (function () {
        function TweenAction() {
            this.ease = null;
            this.clips = [];
            this.update = null;
            this.complete = null;
            this.time = 0;
            this.duration = 0;
        }
        TweenAction.prototype.recover = function () {
            this.ease = null;
            while (this.clips.length > 0) {
                this.clips.pop().recover();
            }
            this.update = null;
            this.complete = null;
            this.time = 0;
            this.duration = 0;
            suncom.Pool.recover("sunui.TweenAction", this);
        };
        TweenAction.create = function () {
            return suncom.Pool.getItemByClass("sunui.TweenAction", TweenAction);
        };
        return TweenAction;
    }());
    sunui.TweenAction = TweenAction;
    var TweenActionClip = (function () {
        function TweenActionClip() {
            this.prop = null;
            this.from = 0;
            this.to = 0;
        }
        TweenActionClip.prototype.recover = function () {
            this.prop = null;
            this.from = 0;
            this.to = 0;
            suncom.Pool.recover("sunui.TweenActionClip", this);
        };
        TweenActionClip.create = function () {
            return suncom.Pool.getItemByClass("sunui.TweenActionClip", TweenActionClip);
        };
        return TweenActionClip;
    }());
    sunui.TweenActionClip = TweenActionClip;
    var TweenService = (function (_super) {
        __extends(TweenService, _super);
        function TweenService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$locker = false;
            _this.$tweens = [];
            return _this;
        }
        TweenService.prototype.$onRun = function () {
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this, false, suncom.EventPriorityEnum.EGL);
            this.facade.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this, false, suncom.EventPriorityEnum.EGL);
            this.facade.registerObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        };
        TweenService.prototype.$onStop = function () {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.facade.removeObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
            this.facade.removeObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        };
        TweenService.prototype.$onEnterFrame = function () {
            this.$locker = true;
            var tweens = this.$tweens;
            for (var mod = 0; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) === false) {
                    for (var i = 0; i < tweens.length; i++) {
                        var tween = tweens[i];
                        if (tween.var_mod === mod) {
                            var timeLeft = 1;
                            while (timeLeft > 0 && tween.var_canceled === false) {
                                timeLeft = tween.func_doAction();
                            }
                        }
                    }
                }
            }
            for (var i = this.$tweens.length - 1; i > -1; i--) {
                var tween = this.$tweens[i];
                if (tween.var_canceled === true && tween.func_getUsePool() === true) {
                    suncom.Pool.recover("sunui.Tweeen", tweens.splice(i, 1)[0]);
                }
            }
            this.$locker = false;
        };
        TweenService.prototype.$onTimelinePause = function (mod, stop) {
            if (stop === true) {
                for (var i = 0; i < this.$tweens.length; i++) {
                    var tween = this.$tweens[i];
                    if (tween.var_mod === mod) {
                        tween.cancel();
                    }
                }
            }
        };
        TweenService.prototype.$onRegisterTweenObject = function (tween) {
            if (this.$locker === true) {
                this.$tweens = this.$tweens.slice(0);
                this.$locker = false;
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
            M.viewLayer = new ViewLayerLayaFui();
            suncom.DBService.put(-1, new TweenService()).run();
            suncom.DBService.put(-1, new LoadingService()).run();
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
            M.viewLayer.removeInfoByView(view);
        };
        Object.defineProperty(UIManager.prototype, "ready", {
            get: function () {
                return M.sceneLayer.ready;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "scene2d", {
            get: function () {
                return M.sceneLayer.scene2d;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "scene3d", {
            get: function () {
                return M.sceneLayer.scene3d;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UIManager.prototype, "sceneName", {
            get: function () {
                return M.sceneLayer.sceneName;
            },
            enumerable: false,
            configurable: true
        });
        UIManager.$inst = null;
        return UIManager;
    }(puremvc.Notifier));
    sunui.UIManager = UIManager;
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
            _this.$complete = null;
            _this.$progress = 0;
            _this.$url = url;
            _this.$complete = complete;
            _this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_CREATED, _this);
            return _this;
        }
        UrlSafetyLoader.prototype.load = function () {
            RES.addReference(this.$url);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "load " + this.$url);
            }
            var complete = Laya.Handler.create(this, this.$onComplete);
            var progress = Laya.Handler.create(this, this.$onProgress, void 0, false);
            if (Resource.isFGuiUrl(this.$url) === true) {
                fairygui.UIPackage.loadPackage(this.$url, complete, progress);
            }
            else if (Resource.isRes3dUrl(this.$url) === false || Resource.getRes3dJsonUrl(this.$url) === this.$url) {
                Laya.loader.load(this.$url, complete, progress);
            }
            else {
                Laya.loader.create(this.$url, complete, progress);
            }
        };
        UrlSafetyLoader.prototype.$onComplete = function (data) {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "load " + this.$url + " complete");
            }
            this.$complete.runWith([data ? true : false, this.$url]);
            this.facade.sendNotification(NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE, this);
            RES.removeReference(this.$url);
        };
        UrlSafetyLoader.prototype.$onProgress = function (value) {
            this.$progress = value;
        };
        Object.defineProperty(UrlSafetyLoader.prototype, "url", {
            get: function () {
                return this.$url;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UrlSafetyLoader.prototype, "progress", {
            get: function () {
                return this.$progress;
            },
            enumerable: false,
            configurable: true
        });
        return UrlSafetyLoader;
    }(puremvc.Notifier));
    sunui.UrlSafetyLoader = UrlSafetyLoader;
    var UrlSafetyPuppetLoader = (function (_super) {
        __extends(UrlSafetyPuppetLoader, _super);
        function UrlSafetyPuppetLoader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$data = null;
            _this.$totalSize = 0;
            _this.$currentSize = 0;
            _this.$priority = suncom.Mathf.random(0, 6);
            return _this;
        }
        UrlSafetyPuppetLoader.prototype.load = function () {
            if (Laya.loader.getRes(this.url) !== void 0) {
                this.$totalSize = -1;
            }
            _super.prototype.load.call(this);
        };
        UrlSafetyPuppetLoader.prototype.$onComplete = function (data) {
            if (M.downloadSpeed === ResourceDownloadSpeedEnum.NONE) {
                _super.prototype.$onComplete.call(this, data);
            }
            else {
                this.$data = data;
                this.$setDownloadSize();
                this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            }
        };
        UrlSafetyPuppetLoader.prototype.$onProgress = function (value) {
            if (M.downloadSpeed === ResourceDownloadSpeedEnum.NONE) {
                _super.prototype.$onProgress.call(this, value);
            }
        };
        UrlSafetyPuppetLoader.prototype.$onEnterFrame = function () {
            this.$currentSize += this.$getDowloadSpeed() * (10 - this.$priority) / 10;
            if (this.$totalSize > 0 && this.$currentSize >= this.$totalSize) {
                if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "[100%] " + this.url + ":{" + this.$totalSize + ":" + this.$totalSize + "}");
                }
                this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
                this.$progress = 1;
                _super.prototype.$onComplete.call(this, this.$data);
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                this.$progress = this.$currentSize / this.$totalSize;
                suncom.Logger.log(suncom.DebugMode.ANY, "[" + Math.floor(this.$progress * 100) + "%] " + this.url + ":{" + this.$currentSize + ":" + this.$totalSize + "}");
            }
        };
        UrlSafetyPuppetLoader.prototype.$getDowloadSpeed = function () {
            if (M.loaders.length <= 1) {
                return M.downloadSpeed;
            }
            else {
                return M.downloadSpeed / M.loaders.length;
            }
        };
        UrlSafetyPuppetLoader.prototype.$setDownloadSize = function () {
            if (this.$data === null || this.$totalSize === -1) {
                this.$totalSize = 1;
            }
            else if (suncom.Common.getFileExtension(this.url) === "atlas") {
                this.$totalSize = 2 * 1024 * 1024;
            }
            else if (suncom.Common.getFileExtension(this.url) === "png" || suncom.Common.getFileExtension(this.url) === "jpg") {
                this.$totalSize = 64 * 1024;
            }
            else if (suncom.Common.getFileExtension(this.url) === "json") {
                this.$totalSize = 1024;
            }
            else if (suncom.Common.getFileExtension(this.url) === "sk") {
                this.$totalSize = 1024 * 1024;
            }
            else if (suncom.Common.getFileExtension(this.url) === "lh") {
                this.$totalSize = 256 * 1024;
            }
            else {
                this.$totalSize = 128 * 1024;
            }
        };
        return UrlSafetyPuppetLoader;
    }(UrlSafetyLoader));
    sunui.UrlSafetyPuppetLoader = UrlSafetyPuppetLoader;
    var ViewFacade = (function (_super) {
        __extends(ViewFacade, _super);
        function ViewFacade(view, duration) {
            var _this = _super.call(this) || this;
            _this.$var_info = null;
            _this.$var_view = view;
            if (_this.var_info !== null) {
                _this.$var_duration = _this.var_info.duration;
            }
            else if (duration === void 0) {
                _this.$var_duration = 200;
            }
            else {
                _this.$var_duration = duration;
            }
            return _this;
        }
        ViewFacade.prototype.popup = function (props) {
            if (props === void 0) { props = {}; }
            this.facade.sendNotification(NotifyKey.SHOW_POPUP, [this.$var_view, this.$var_duration, props]);
            return this;
        };
        ViewFacade.prototype.close = function (destroy) {
            this.facade.sendNotification(NotifyKey.CLOSE_POPUP, [this.$var_view, this.$var_duration, destroy]);
        };
        Object.defineProperty(ViewFacade.prototype, "cancelAllowed", {
            get: function () {
                return this.var_info.cancelAllowed;
            },
            set: function (yes) {
                this.var_info.cancelAllowed = yes;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewFacade.prototype, "var_info", {
            get: function () {
                if (this.$var_info === null) {
                    this.$var_info = M.viewLayer.getInfoByView(this.$var_view);
                }
                return this.$var_info;
            },
            enumerable: false,
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
                if (info.autoDestroy === true) {
                    this.removeFromStack(info);
                }
            }
        };
        ViewLayer.prototype.addToStack = function (newInfo) {
            this.$stack.push(newInfo);
        };
        ViewLayer.prototype.removeFromStack = function (info) {
            var index = this.$stack.indexOf(info);
            if (index < 0) {
                return;
            }
            this.$stack.splice(index, 1);
            info.closed = true;
            this.onViewRemove(info.view);
            this.removeChild(info.view);
            this.removeChild(info.mask);
            this.destroyMask(info.mask);
            if (info.keepNode === false) {
                this.destroyView(info.view);
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
        ViewLayer.prototype.removeInfoByView = function (view) {
            for (var i = 0; i < this.$stack.length; i++) {
                var info = this.$stack[i];
                if (info.view === view) {
                    this.removeFromStack(info);
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
    var ViewLayerLayaFui = (function (_super) {
        __extends(ViewLayerLayaFui, _super);
        function ViewLayerLayaFui() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewLayerLayaFui.prototype.addChild = function (view) {
            var node = view;
            fairygui.GRoot.inst.addChild(node);
        };
        ViewLayerLayaFui.prototype.removeChild = function (view) {
            var node = view;
            var parent = node.parent || null;
            if (parent === null) {
                throw Error("\u65E0\u6CD5\u79FB\u9664\u663E\u793A\u5BF9\u8C61\uFF0C\u56E0\u4E3A\u7236\u8282\u70B9\u4E0D\u5B58\u5728 " + node.name);
            }
            fairygui.GRoot.inst.removeChild(node);
        };
        ViewLayerLayaFui.prototype.createMask = function (view, props) {
            var mask = new fairygui.GLoader();
            mask.url = "ui://Public_Resource/B_bantoumingbeijing";
            mask.fill = fairygui.LoaderFillType.ScaleFree;
            mask.setSize(suncom.Global.width, suncom.Global.height);
            if (props.flags & PopupFlagEnum.TRANSPARENT) {
                mask.alpha = 0;
            }
            else {
                mask.alpha = 1;
            }
            if ((props.flags & PopupFlagEnum.MOUSE_THROUGH) === PopupFlagEnum.NONE) {
                mask.on(Laya.Event.CLICK, this, this.$onMaskClick, [view]);
            }
            else {
                mask.touchable = false;
            }
            return mask;
        };
        ViewLayerLayaFui.prototype.$onMaskClick = function (view) {
            var info = M.viewLayer.getInfoByView(view);
            if (info !== null && info.closed === false && info.cancelAllowed === true) {
                new ViewFacade(view).close();
            }
        };
        ViewLayerLayaFui.prototype.destroyMask = function (mask) {
            mask.off(Laya.Event.CLICK, this, this.$onMaskClick);
            mask.dispose();
        };
        ViewLayerLayaFui.prototype.destroyView = function (view) {
            var node = view;
            node.dispose();
        };
        ViewLayerLayaFui.prototype.onViewCreate = function (view, args) {
            var init = view["init"];
            init && init.call(view, args);
        };
        ViewLayerLayaFui.prototype.onViewOpen = function (view) {
            var onOpen = view["onOpen"];
            onOpen && onOpen.call(view);
        };
        ViewLayerLayaFui.prototype.onViewClose = function (view) {
            var onClose = view["onClose"];
            onClose && onClose.call(view);
        };
        ViewLayerLayaFui.prototype.onViewRemove = function (view) {
        };
        return ViewLayerLayaFui;
    }(ViewLayer));
    sunui.ViewLayerLayaFui = ViewLayerLayaFui;
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(command, condition, monitors) {
            var _this = _super.call(this, command, condition) || this;
            _this.$dataList = [];
            _this.$running = false;
            _this.$monitors = null;
            _this.$monitors = monitors;
            if (_this.$monitors.length === 0) {
                throw Error("没有为需要拦截的命令指定监视器！");
            }
            _this.facade.registerObserver(NotifyKey.RELEASE_MONITOR, _this.$onMonitorReleased, _this);
            return _this;
        }
        Command.prototype.destroy = function () {
            if (this.$destroyed === true) {
                return;
            }
            _super.prototype.destroy.call(this);
            this.facade.removeObserver(NotifyKey.RELEASE_MONITOR, this.$onMonitorReleased, this);
        };
        Command.prototype.run = function () {
            if (this.$running === false) {
                this.$running = true;
                for (var i = 0; i < this.$monitors.length; i++) {
                    this.$monitors[i].var_active = true;
                }
            }
        };
        Command.prototype.$onMonitorReleased = function (monitor) {
            if (this.$var_released === true) {
                return;
            }
            if (this.$monitors.indexOf(monitor) === -1) {
                return;
            }
            this.facade.notifyCancel();
            var released = true;
            for (var i = 0; i < this.$monitors.length; i++) {
                if (this.$monitors[i].var_released === false) {
                    released = false;
                    break;
                }
            }
            if (released === true) {
                suncore.System.addMessage(suncore.ModuleEnum.TIMELINE, suncore.MessagePriorityEnum.PRIORITY_0, this, this.$releaseSelf);
            }
        };
        Command.prototype.$releaseSelf = function () {
            if (this.$destroyed === false && this.$var_released === false) {
                this.$var_released = true;
                this.facade.sendNotification(NotifyKey.NEXT_COMMAND, this, true);
                for (var i = 0; i < this.$dataList.length; i++) {
                    this.facade.sendNotification(this.$var_command, this.$dataList[i]);
                }
            }
        };
        Command.prototype.$func_onCommandCallback = function () {
            if (this.$var_released === true) {
                return;
            }
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            if (this.$var_condition.runWith(args) === false) {
                return;
            }
            this.$var_released = true;
            for (var i = 0; i < this.$monitors.length; i++) {
                if (this.$monitors[i].var_released === false) {
                    this.$var_released = false;
                    break;
                }
            }
            if (this.$var_released === false) {
                this.$dataList.push(args);
                this.facade.notifyCancel();
            }
        };
        Object.defineProperty(Command.prototype, "running", {
            get: function () {
                return this.$running;
            },
            enumerable: false,
            configurable: true
        });
        return Command;
    }(Runnable));
    sunui.Command = Command;
    var Monitor = (function (_super) {
        __extends(Monitor, _super);
        function Monitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$var_active = false;
            return _this;
        }
        Monitor.prototype.$func_onCommandCallback = function () {
            if (this.$var_active === true && this.$var_released === false) {
                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                if (this.$var_condition.runWith(args) === true) {
                    this.$var_released = true;
                    this.facade.sendNotification(NotifyKey.RELEASE_MONITOR, this, true);
                }
            }
        };
        Object.defineProperty(Monitor.prototype, "var_active", {
            get: function () {
                return this.$var_active;
            },
            set: function (value) {
                this.$var_active = value;
            },
            enumerable: false,
            configurable: true
        });
        return Monitor;
    }(Runnable));
    sunui.Monitor = Monitor;
    var M;
    (function (M) {
        M.downloadSpeed = ResourceDownloadSpeedEnum.NONE;
        M.loaders = [];
        M.cacheMap = {};
        M.templets = {};
        M.references = {};
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
        NotifyKey.BEFORE_LEAVE_SCENE = "sunui.NotifyKey.BEFORE_LEAVE_SCENE";
        NotifyKey.LEAVE_SCENE = "sunui.NotifyKey.LEAVE_SCENE";
        NotifyKey.SHOW_POPUP = "sunui.NotifyKey.SHOW_POPUP";
        NotifyKey.CLOSE_POPUP = "sunui.NotifyKey.CLOSE_POPUP";
        NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED = "sunui.NotifyKey.ON_ASSET_SAFETY_LOADER_FAILED";
        NotifyKey.ON_URL_SAFETY_LOADER_CREATED = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_CREATED";
        NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE = "sunui.NotifyKey.ON_URL_SAFETY_LOADER_COMPLETE";
        NotifyKey.ASSET_SAFETY_LOADER_RETRY = "sunui.NotifyKey.ASSET_SAFETY_LOADER_RETRY";
        NotifyKey.REGISTER_TWEEN_OBJECT = "sunui.NotifyKey.REGISTER_TWEEN_OBJECT";
        NotifyKey.NEXT_COMMAND = "sunui.NotifyKey.NEXT_COMMAND";
        NotifyKey.RELEASE_MONITOR = "sunui.NotifyKey.RELEASE_MONITOR";
        NotifyKey.SCENE_IS_READY = "sunui.NotifyKey.SCENE_IS_READY";
    })(NotifyKey = sunui.NotifyKey || (sunui.NotifyKey = {}));
    var RES;
    (function (RES) {
        function addReference(url) {
            var reference = M.references[url] || 0;
            M.references[url] = reference + 1;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "reference:" + (reference + 1) + ", lock:" + url);
            }
        }
        RES.addReference = addReference;
        function removeReference(url) {
            var reference = M.references[url] || 0;
            suncom.Test.expect(reference).interpret("\u5C1D\u8BD5\u89E3\u9501\u4E0D\u5B58\u5728\u7684\u8D44\u6E90 url\uFF1A" + url).toBeGreaterThan(0);
            M.references[url] = reference - 1;
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "reference:" + (reference - 1) + ", unlock:" + url);
            }
            if (reference === 1) {
                delete M.references[url];
                $deleteCachedObject(url);
            }
        }
        RES.removeReference = removeReference;
        function $deleteCachedObject(url) {
            if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                var urls = $parseRes3dJson(Laya.loader.getRes(url));
                for (var i = 0; i < urls.length; i++) {
                    RES.clearResByUrl(urls[i]);
                }
            }
            RES.clearResByUrl(url);
        }
        function $parseRes3dJson(json) {
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
        function clearResByUrl(url) {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                suncom.Logger.log(suncom.DebugMode.ANY, "clearResUrl:" + url);
            }
            if (Resource.isFGuiUrl(url) === true) {
                return fairygui.UIPackage.removePackage(url);
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
            var suffix = suncom.Common.getFileExtension(url);
            if (suffix === "ani") {
                Laya.Animation.clearCache(url);
            }
            else if (suffix === "sk") {
                Laya.Templet.TEMPLET_DICTIONARY[url] && Laya.Templet.TEMPLET_DICTIONARY[url].destroy();
                delete Laya.Templet.TEMPLET_DICTIONARY[url];
            }
        }
        RES.clearResByUrl = clearResByUrl;
    })(RES = sunui.RES || (sunui.RES = {}));
    var Resource;
    (function (Resource) {
        Resource.res3dRoot = null;
        function setDownloadSpeed(speed) {
            M.downloadSpeed = speed;
        }
        Resource.setDownloadSpeed = setDownloadSpeed;
        function lock(url) {
            if (suncom.Global.debugMode > 0) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    console.error("\u7981\u6B62\u76F4\u63A5\u8C03\u7528\u6B64\u65B9\u6CD5\u6765\u5355\u72EC\u9501\u5B9A3d\u8D44\u6E90\u914D\u7F6E\u6587\u4EF6");
                    return;
                }
            }
            var urls = [url];
            if (Resource.isRes3dUrl(url) === true) {
                var ext = suncom.Common.getFileExtension(url);
                var str = url.substr(0, url.length - ext.length);
                urls.push(str + "json");
            }
            for (var i = 0; i < urls.length; i++) {
                RES.addReference(urls[i]);
            }
        }
        Resource.lock = lock;
        function unlock(url) {
            if (suncom.Global.debugMode > 0) {
                if (Resource.isRes3dUrl(url) === true && Resource.getRes3dJsonUrl(url) === url) {
                    console.error("\u7981\u6B62\u76F4\u63A5\u8C03\u7528\u6B64\u65B9\u6CD5\u6765\u5355\u72EC\u89E3\u95013d\u8D44\u6E90\u914D\u7F6E\u6587\u4EF6");
                    return;
                }
            }
            var urls = [url];
            if (Resource.isRes3dUrl(url) === true) {
                var ext = suncom.Common.getFileExtension(url);
                var str = url.substr(0, url.length - ext.length);
                urls.push(str + "json");
            }
            for (var i = 0; i < urls.length; i++) {
                RES.removeReference(urls[i]);
            }
        }
        Resource.unlock = unlock;
        function prepare(urls, method, caller) {
            var handler = null;
            if (method === null) {
                handler = suncom.Handler.create(null, function (id) { }, void 0, false);
            }
            else {
                handler = suncom.Handler.create(caller, method, void 0, false);
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
        function createPrefab(url) {
            var prefab = new Laya.Prefab();
            prefab.json = Laya.loader.getRes(url);
            return prefab.create();
        }
        Resource.createPrefab = createPrefab;
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
        function isFGuiUrl(url) {
            return url.substr(0, 4) === "fgui";
        }
        Resource.isFGuiUrl = isFGuiUrl;
        function getRes3dUrlByName(name) {
            if (suncom.Common.getFileExtension(name) === null) {
                name += ".lh";
            }
            return Resource.getRes3dPackRoot(suncom.Common.getFileName(name)) + name;
        }
        Resource.getRes3dUrlByName = getRes3dUrlByName;
        function checkLoadList(urls) {
            Resource.removeUnnecessaryResources(urls, "sk", "png", "龙骨预加载无需指定PNG资源");
            Resource.removeUnnecessaryResources(urls, "fui", "png", "FGUI预加载无需指定PNG资源");
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
//# sourceMappingURL=sunui.js.map