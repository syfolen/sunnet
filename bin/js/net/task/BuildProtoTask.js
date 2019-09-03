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
    var BuildProtoTask = /** @class */ (function (_super) {
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
            sunnet.ProtobufManager.addProto(root);
            this.done = true;
        };
        return BuildProtoTask;
    }(suncore.AbstractTask));
    sunnet.BuildProtoTask = BuildProtoTask;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=BuildProtoTask.js.map