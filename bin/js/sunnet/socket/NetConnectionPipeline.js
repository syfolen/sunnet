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
            var item = new sunnet.NetConnectionPipelineItem();
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
                    suncom.Logger.warn("NetConnectionPipeline=> decode \u610F\u5916\u7684\u6307\u4EE4 cmd:" + params[0].toString() + ", buff:" + (params[1] ? "[Object]" : "null"));
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
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionPipeline = NetConnectionPipeline;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionPipeline.js.map