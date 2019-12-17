var sunnet;
(function (sunnet) {
    /**
     * protobuf管理类
     * export
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
        /**
         * export
         */
        ProtobufManager.getInstance = function () {
            return ProtobufManager.instance;
        };
        /**
         * 构建protobuf
         * export
         */
        ProtobufManager.prototype.buildProto = function (url) {
            var root = new Laya.Browser.window.protobuf.Root();
            var protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        };
        /**
         * 构建协议信息
         * export
         */
        ProtobufManager.prototype.buildProtocal = function (url) {
            var json = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        };
        /**
         * 构建协议信息
         * export
         */
        ProtobufManager.prototype.buildProtocalJson = function (json) {
            this.$commands = Object.keys(json);
            this.$protocals = json;
        };
        /**
         * 根据编号获取协议信息
         */
        ProtobufManager.prototype.getProtocalByCommand = function (cmd) {
            return this.$protocals[cmd] || null;
        };
        /**
         * 根据名字获取协议信息
         * export
         */
        ProtobufManager.prototype.getProtocalByName = function (name) {
            for (var i = 0; i < this.$commands.length; i++) {
                var command = this.$commands[i];
                var protocal = this.getProtocalByCommand(command);
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
         * export
         */
        ProtobufManager.prototype.getProtoEnum = function (name) {
            return this.getProtoClass(name).values;
        };
        /**
         * 编码
         * export
         */
        ProtobufManager.prototype.encode = function (name, data) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                console.log("\u6253\u5305\u6570\u636E\u6210\u529F ==> " + JSON.stringify(data));
            }
            return this.getProtoClass(name).encode(data).finish();
        };
        /**
         * 解码
         * export
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