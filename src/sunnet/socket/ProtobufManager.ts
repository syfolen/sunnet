/**
 * MIT License
 * 
 * Copyright (c) 2019 Binfeng Sun<christon.sun@qq.com>
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunnet
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * export
 */
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
            const root = new Laya.Browser.window.protobuf.Root();
            const protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        }

        /**
         * 构建协议信息
         * export
         */
        buildProtocal(url: string): void {
            const json = Laya.loader.getRes(url);
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
         */
        getProtocalByCommand(cmd: any): any {
            return this.$protocals[cmd] || null;
        }

        /**
         * 根据名字获取协议信息
         * export
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
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                console.log(`打包数据成功 ==> ${JSON.stringify(data)}`);
            }
            return this.getProtoClass(name).encode(data).finish();
        }

        /**
         * 解码
         * export
         */
        decode(name: string, bytes: Uint8Array): any {
            return this.getProtoClass(name).decode(bytes);
        }
    }
}