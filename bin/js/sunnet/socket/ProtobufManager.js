var sunnet;
(function (sunnet) {
    /**
     * protobuf管理类
     */
    var ProtobufManager = /** @class */ (function () {
        function ProtobufManager() {
            /**
             * Protobuf定义
             */
            this.$proto = null;
            /**
             * 命令集合
             */
            this.$commands = null;
            /**
             * 协议信息集合
             */
            this.$protocals = null;
        }
        ProtobufManager.getInstance = function () {
            return ProtobufManager.instance;
        };
        /**
         * 构建protobuf
         */
        ProtobufManager.prototype.buildProto = function (url) {
            var root = new Laya.Browser.window.protobuf.Root();
            var protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root);
            this.$proto = root;
        };
        /**
         * 构建协议信息
         */
        ProtobufManager.prototype.buildProtocal = function (url) {
            var json = Laya.loader.getRes("other/protocal.json");
            this.$commands = Object.keys(json);
            this.$protocals = json.data;
        };
        /**
         * 根据编号获取协议信息
         */
        ProtobufManager.prototype.getProtocalByCommand = function (cmd) {
            return this.$protocals[cmd] || null;
        };
        /**
         * 根据名字获取协议信息
         */
        ProtobufManager.prototype.getProtocalByName = function (name) {
            for (var i = 0; i < this.$commands.length; i++) {
                var cmd = this.$commands[i];
                var protocal = this.getProtocalByCommand(cmd);
                if (protocal === null) {
                    continue;
                }
                if (protocal.Name === name) {
                    return protocal;
                }
            }
            return null;
        };
        /**
         * 获取protobuf定义
         */
        ProtobufManager.prototype.getProtoClass = function (name) {
            return this.$proto.lookup(name);
        };
        /**
         * 根据protobuf枚举定义
         */
        ProtobufManager.prototype.getProtoEnum = function (name) {
            return this.getProtoClass(name).values;
        };
        /**
         * 编码
         */
        ProtobufManager.prototype.encode = function (name, data) {
            return this.getProtoClass(name).encode(data).finish();
        };
        /**
         * 解码
         */
        ProtobufManager.prototype.decode = function (name, bytes) {
            return this.getProtoClass(name).decode(bytes);
        };
        /**
         * 单例对象
         */
        ProtobufManager.instance = new ProtobufManager();
        return ProtobufManager;
    }());
    sunnet.ProtobufManager = ProtobufManager;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=ProtobufManager.js.map