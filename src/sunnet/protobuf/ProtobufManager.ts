
module sunnet {
    /**
     * protobuf管理类
     * export
     */
    export class ProtobufManager {
        /**
         * 单例对象
         */
        private static instance: ProtobufManager = new ProtobufManager();

        /**
         * export
         */
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
         * export
         */
        buildProto(url: string): void {
            const root: any = new Laya.Browser.window.protobuf.Root();
            const protostr: any = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        }

        /**
         * 构建协议信息
         * export
         */
        buildProtocal(url: string): void {
            const json: any = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        }

        /**
         * 构建协议信息
         * export
         */
        buildProtocalJson(json: any): void {
            this.$commands = Object.keys(json);
            this.$protocals = json;
        }

        /**
         * 根据编号获取协议信息
         * export
         */
        getProtocalByCommand(cmd: any): any {
            return this.$protocals[cmd] || null;
        }

        /**
         * 根据名字获取协议信息
         * export
         */
        getProtocalByName(name: string): any {
            for (let i: number = 0; i < this.$commands.length; i++) {
                const command: string = this.$commands[i];
                const protocal: any = this.getProtocalByCommand(command);
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
         * export
         */
        getProtoEnum(name: string): any {
            return this.getProtoClass(name).values;
        }

        /**
         * 编码
         * export
         */
        encode(name: string, data: any): Uint8Array {
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                if (name === "msg.Common_Heartbeat") {
                    if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                        suncom.Logger.log(suncom.DebugMode.ANY, `打包心跳成功 ==> ${JSON.stringify(data)}`);
                    }
                }
                else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, `打包数据成功 ==> ${JSON.stringify(data)}`);
                }
            }
            return this.getProtoClass(name).encode(data).finish();
        }

        /**
         * 解码
         * export
         */
        decode(name: string, bytes: Uint8Array): any {
            const data: any = this.getProtoClass(name).decode(bytes);
            if (suncom.Global.debugMode & suncom.DebugMode.DEBUG) {
                if (name === "msg.Common_Heartbeat") {
                    if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                        suncom.Logger.log(suncom.DebugMode.ANY, `解析心跳成功 ==> ${JSON.stringify(data)}`);
                    }
                }
                else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, `解析数据成功 ==> ${JSON.stringify(data)}`);
                }
            }
            return data;
        }
    }
}