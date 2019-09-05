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
    var ProtobufDecoder = /** @class */ (function (_super) {
        __extends(ProtobufDecoder, _super);
        function ProtobufDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 数据解析执行函数
         */
        ProtobufDecoder.prototype.$decode = function (cmd, buffer) {
        };
        return ProtobufDecoder;
    }(sunnet.NetConnectionProtobufDecoder));
    sunnet.ProtobufDecoder = ProtobufDecoder;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=ProtobufDecoder.js.map