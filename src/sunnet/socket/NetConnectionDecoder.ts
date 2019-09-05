
module sunnet {

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export class NetConnectionDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, buffer: ArrayBuffer, data?: any): Array<any> {
            const input: Laya.Byte = this.$connection.input;

            cmd = input.getUint16();
            srvId = input.getUint16();
            buffer = input.buffer.slice(input.pos);

            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + input.bytesAvailable);
                }
            }

            // 清除缓冲区中的数据
            input.clear();

            return [cmd, srvId, buffer, data];
        }
    }
}