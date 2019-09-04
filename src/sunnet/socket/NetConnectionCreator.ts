
module sunnet {

    export class NetConnectionCreator extends NetConnectionInterceptor {

        /**
         * 等待发送的消息队列
         */
        private $messages: Array<ISocketData> = [];

        constructor(connection: INetConnection) {
            super(connection);
            this.$connection.addEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
        }

        destroy(): void {
            this.$connection.removeEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
            super.destroy();
        }

        /**
         * 网络连接成功回调
         */
        protected $onConnected(): void {
            while (this.$messages.length) {
                const data: ISocketData = this.$messages.pop();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        }

        /**
         * 清除所有网络消息缓存
         */
        private $onClearMessageQueue(): void {
            this.$messages.length = 0;
        }

        /**
         * 是否需要重连
         */
        private $needCreate(ip: string, port: number): boolean {
            // 若网络未连接，则需要重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            // 若网络己连接
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                // 若IP和PORT有效且与请求的数据不一致，则需要重连
                if (ip !== void 0 && port !== void 0 && this.$connection.ip !== ip && this.$connection.port !== port) {
                    return true;
                }
            }
            // 否则不需要重连
            return false;
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any> {
            if (this.$needCreate(ip, port) == false) {
                return [cmd, bytes, ip, port];
            }
            this.$connection.connect(ip, port, false);

            const data: ISocketData = {
                cmd: cmd,
                bytes: bytes,
                ip: ip,
                port: port
            };
            this.$messages.push(data);

            return null;
        }
    }
}