
module sunnet {

    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    export class NetConnectionEncoder extends NetConnectionInterceptor {

		/**
		 * 拦截数据
		 */
        send(cmd: number, bytes: ArrayBuffer, ip?: string, port?: number): Array<any> {
            const input: Laya.Byte = this.$connection.input;

            // 写入包头
            input.writeUint16(cmd);
            input.writeUint16(0);

            // 写入包体
            bytes !== null && input.writeArrayBuffer(bytes);

            if (cmd === HeartbeatCommandEnum.REQUEST) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`发送数据 cmd:${cmd.toString(16)}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
                }
            }
            else if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`发送数据 cmd:${cmd.toString(16)}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
            }

            return null;
        }
    }
}