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
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     * export
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
            var protocal = sunnet.ProtobufManager.getInstance().getProtocalByCommand(cmd);
            sunnet.MessageNotifier.notify(protocal.Name, newData);
            // 消息解析成功
            return [cmd, srvId, bytes, newData];
        };
        return NetConnectionProtobufDecoder;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionProtobufDecoder = NetConnectionProtobufDecoder;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionProtobufDecoder.js.map