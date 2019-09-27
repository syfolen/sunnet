
module sunnet {

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截
		 */
        recv(cmd: number, srvId: number, buffer: any, data?: any): Array<any> {
            // 若 data 不为 void 0 ，则说明己处理
            if (data !== void 0) {
                return [cmd, srvId, buffer, data];
            }
            // 消息解析失败时返回 null
            const newData: any = this.$decode(cmd, buffer);
            if (newData === null) {
                return [cmd, srvId, buffer, data];
            }
            suncom.Logger.log("消息解析成功 ==> " + JSON.stringify(newData));
            if (newData === buffer) {
                throw Error("请勿返回未处理的消息！！！");
            }
            // 消息解析成功
            suncore.System.addSocketMessage(cmd, newData);
            // 消息解析成功
            return [cmd, srvId, buffer, newData];
        }

        /**
         * 数据解析执行函数
         */
        protected abstract $decode(cmd: number, buffer: ArrayBuffer): any;
    }
}