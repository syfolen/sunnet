
module sunnet {

    /**
     * protobuf管理类
     */
    export class ProtobufManager {
        /**
         * 单例对象
         */
        private static instance: ProtobufManager = new ProtobufManager();

        static getInstance(): ProtobufManager {
            return ProtobufManager.instance;
        }

        /**
         * Protobuf定义
         */
        private $proto: any = null;

        /**
         * 命令集合
         */
        private $commands: Array<string> = null;

        /**
         * 协议信息集合
         */
        private $protocals: any = null;

        /**
         * 构建protobuf
         */
        buildProto(url: string): void {
            const root = new Laya.Browser.window.protobuf.Root();
            const protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        }

        /**
         * 构建协议信息
         */
        buildProtocal(url: string): void {
            const json = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        }

        /**
         * 根据编号获取协议信息
         */
        getProtocalByCommand(cmd): any {
            return this.$protocals[cmd] || null;
        }

        /**
         * 根据名字获取协议信息
         */
        getProtocalByName(name: string): any {
            for (let i = 0; i < this.$commands.length; i++) {
                const command = this.$commands[i];
                const protocal = this.getProtocalByCommand(command);
                if (protocal === null) {
                    continue;
                }
                if (protocal.Name === name) {
                    return protocal;
                }
            }
            return null;
        }

        /**
         * 获取protobuf定义
         */
        getProtoClass(name: string): any {
            return this.$proto.lookup(name);
        }

        /**
         * 根据protobuf枚举定义
         */
        getProtoEnum(name) {
            return this.getProtoClass(name).values;
        }

        /**
         * 编码
         */
        encode(name: string, data: any): Uint8Array {
            return this.getProtoClass(name).encode(data).finish();
        }

        /**
         * 解码
         */
        decode(name: string, bytes: Uint8Array): any {
            return this.getProtoClass(name).decode(bytes);
        }
    }
}