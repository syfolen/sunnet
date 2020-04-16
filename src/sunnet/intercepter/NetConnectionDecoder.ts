
module sunnet {
    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     * export
     */
    export class NetConnectionDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any> {
            const input: Laya.Byte = this.$connection.input || null;
            if (input === null) {
                suncom.Logger.error(suncom.DebugMode.ANY, `Decoder 网络己断开！！！`);
                return;
            }

            cmd = input.getUint16();
            srvId = input.getUint16();

            const buffer: ArrayBuffer = input.buffer.slice(input.pos);
            input.pos += buffer.byteLength;

            bytes = new Uint8Array(buffer);

            if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "响应心跳");
                }
            }
            else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.NONE) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + bytes.byteLength);
                }
            }

            // 清除缓冲区中的数据
            // input.clear();

            return [cmd, srvId, bytes, data];
        }
    }
}