
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
            if (suncom.Global.debugMode & suncom.DebugMode.TDD) {
                this.$connection.testPacket(cmd);
                this.$connection.logMsgIsSent(cmd, bytes, ip, port);
                return null;
            }

            const output: Laya.Byte = this.$connection.output || null;
            if (output === null) {
                suncom.Logger.error(suncom.DebugMode.ANY, `Encoder 网络己断开！！！`);
                return null;
            }

            // 写入包头
            output.writeUint16(cmd);
            output.writeUint16(0);

            // 写入包体，这里实际上可以直接写入Uint8Array
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();
            this.$connection.logMsgIsSent(cmd, bytes, ip, port);

            return null;
        }
    }
}