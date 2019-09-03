
module sunnet {

    /**
     * protobuf管理类
     */
    export class ProtobufManager implements IProtobufManager {

        private static $protos: Array<any> = [];

        /**
         * 构建protobuf
         */
        static buildProto(urls: Array<string>): void {
            for (let i: number = 0; i < urls.length; i++) {
                const url: string = urls[i];
                suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new BuildProtoTask(url));
            }
        }

        /**
         * 添加protobuf库
         */
        static addProto(root: any): void {
            ProtobufManager.$protos.push(root);
        }

        /**
         * 获取protobuf定义
         */
        static getProtoClass(className: string): any {
            for (let i: number = 0; i < ProtobufManager.$protos.length; i++) {
                const root: any = ProtobufManager.$protos[i];
                const protoClass: any = root.lookup(className);
                if (protoClass !== void 0 && protoClass !== null) {
                    return protoClass;
                }
            }
            throw Error(`No protoClass ${className}`);
        }

        /**
         * 获取protobuf对象
         */
        static getProtoObject(className: string, data: any): any {
            return ProtobufManager.getProtoClass(className).encode(data).finish();
        }

        /**
         * 解析数据
         */
        static decode(className: string, buffer: ArrayBuffer): any {
            return ProtobufManager.getProtoClass(className).decode(buffer);
        }
    }
}