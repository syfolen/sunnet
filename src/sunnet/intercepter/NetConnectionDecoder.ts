
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
            let done: boolean = false;

            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                if (suncom.Test.ENABLE_MICRO_SERVER === true && cmd > 0) {
                    if (data !== null) {
                        const protocal: { Name: string } = ProtobufManager.getInstance().getProtocalByCommand(cmd);
                        bytes = ProtobufManager.getInstance().encode("msg." + protocal.Name, data);
                    }
                    done = true;
                    data = void 0;
                }
            }

            if (done === false) {
                const input: Laya.Byte = this.$connection.input || null;
                if (input === null) {
                    suncom.Logger.error(suncom.DebugMode.ANY, `Decoder 网络己断开！！！`);
                    return null;
                }

                cmd = input.getUint16();
                srvId = input.getUint16();

                const buffer: ArrayBuffer = input.buffer.slice(input.pos);
                input.pos += buffer.byteLength;

                done = true;
                bytes = new Uint8Array(buffer);
            }

            // 清除缓冲区中的数据
            // input.clear();

            return [cmd, srvId, bytes, data];
        }
    }
}