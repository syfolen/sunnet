
module sunnet {
    /**
     * 网络连接创建器
     * export
     */
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
            while (this.$messages.length > 0 && this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                const data: ISocketData = this.$messages.shift();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port, data.care);
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
            if (ip === null || port === 0) {
                return false;
            }
            // 若网络未连接，则需要重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            // 若网络己连接
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                // 若当前IP和PORT与请求的不一致，则需要重连
                if (this.$connection.ip !== ip || this.$connection.port !== port) {
                    return true;
                }
            }
            // 否则不需要重连
            return false;
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number, care: boolean): Array<any> {
            if (this.$needCreate(ip, port) == true) {
                this.$connection.connect(ip, port, false);
                this.$connection.cacheData = true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                return [cmd, bytes, ip, port, care];
            }
            else if (this.$connection.cacheData === true) {
                const data: ISocketData = {
                    cmd: cmd,
                    bytes: bytes,
                    ip: ip,
                    port: port,
                    care: care
                };
                this.$messages.push(data);
            }
            return null;
        }
    }
}