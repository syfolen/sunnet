
module sunnet {

    /**
     * protobuf管理类
     */
    export class ProtobufManager {

        private static $protos: Array<any> = [];

        /**
         * 构建protobuf
         */
        static buildProto(urls: Array<string>): void {
            for (let i: number = 0; i < urls.length; i++) {
                const url: string = urls[i];
                const root = new Laya.Browser.window.protobuf.Root();
                const protostr = Laya.loader.getRes(url);
                Laya.Browser.window.protobuf.parse(protostr, root);
                ProtobufManager.$protos.push(root);
            }
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