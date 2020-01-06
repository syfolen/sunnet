
module sunnet {
    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     * export
     */
    export abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            // 若 data 不为 void 0 ，则说明己处理
            if (data !== void 0) {
                return [cmd, srvId, bytes, data];
            }
            // 消息解析失败时返回 null
            const newData: any = this.$decode(cmd, bytes);
            if (newData === null) {
                return [cmd, srvId, bytes, data];
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("消息解析成功 ==> " + JSON.stringify(newData));
            }
            if (newData === bytes) {
                throw Error("请勿返回未处理的消息！！！");
            }
            // 消息解析成功
            const msg: ISocketMessage = {
                id: cmd,
                name: null,
                data: newData
            };
            suncore.MsgQ.send(suncore.MsgQModEnum.NSL, suncore.MsgQModEnum.NSL, <any>MsgQIdEnum.NSL_RECV_DATA, msg);
            // 消息解析成功
            return [cmd, srvId, bytes, newData];
        }

        /**
         * 数据解析执行函数
         * export
         */
        protected abstract $decode(cmd: number, bytes: Uint8Array): any;
    }
}