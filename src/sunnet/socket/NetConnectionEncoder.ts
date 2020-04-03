
module sunnet {
    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     * export
     */
    export class NetConnectionEncoder extends NetConnectionInterceptor {

		/**
		 * 拦截数据
		 */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any> {
            const output: Laya.Byte = this.$connection.output || null;
            if (output === null) {
                suncom.Logger.error(`Encoder 网络己断开！！！`);
                return null;
            }

            // 写入包头
            output.writeUint16(cmd);
            output.writeUint16(0);

            // 写入包体，这里实际上可以直接写入Uint8Array
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();

            if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`发送数据 cmd:${cmd.toString()}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
                }
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`发送数据 cmd:${cmd.toString()}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
            }

            return null;
        }
    }
}