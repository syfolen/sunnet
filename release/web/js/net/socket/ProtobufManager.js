var sunnet;
(function (sunnet) {
    /**
     * protobuf管理类
     */
    var ProtobufManager = /** @class */ (function () {
        function ProtobufManager() {
        }
        /**
         * 构建protobuf
         */
        ProtobufManager.buildProto = function (urls) {
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new sunnet.BuildProtoTask(url));
            }
        };
        /**
         * 添加protobuf库
         */
        ProtobufManager.addProto = function (root) {
            ProtobufManager.$protos.push(root);
        };
        /**
         * 获取protobuf定义
         */
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
        /**
         * 获取protobuf对象
         */
        ProtobufManager.getProtoObject = function (className, data) {
            return ProtobufManager.getProtoClass(className).encode(data).finish();
        };
        /**
         * 解析数据
         */
        ProtobufManager.decode = function (className, buffer) {
            return ProtobufManager.getProtoClass(className).decode(buffer);
        };
        ProtobufManager.$protos = [];
        return ProtobufManager;
    }());
    sunnet.ProtobufManager = ProtobufManager;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=ProtobufManager.js.map