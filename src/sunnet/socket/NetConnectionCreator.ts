
module sunnet {
    /**
     * 网络连接创建器
     * export
     */
    export class NetConnectionCreator extends NetConnectionInterceptor {
        /**
         * 数据请求队列
         */
        private $datas: Array<ISocketRequestData> = [];

        /**
         * 是否缓存当前正在发送的数据流
         */
        private $cacheSendBytes: boolean = false;

        constructor(connection: INetConnection) {
            super(connection);
            this.$connection.addEventListener(EventKey.CACHE_SEND_BYTES, this.$onCacheSendBytes, this);
            this.$connection.addEventListener(EventKey.CLEAR_REQUEST_DATA, this.$onClearRequestData, this);
        }

        destroy(): void {
            this.$connection.removeEventListener(EventKey.CACHE_SEND_BYTES, this.$onCacheSendBytes, this);
            this.$connection.removeEventListener(EventKey.CLEAR_REQUEST_DATA, this.$onClearRequestData, this);
            super.destroy();
        }

        /**
         * 网络连接成功回调
         */
        protected $onConnected(): void {
            while (this.$datas.length > 0 && this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                const data: ISocketRequestData = this.$datas.shift();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port, data.care);
            }
        }

        /**
         * 是否缓存当前正在发送的数据流
         */
        private $onCacheSendBytes(yes: boolean): void {
            this.$cacheSendBytes = yes;
        }

        /**
         * 清空队列
         */
        private $onClearRequestData(): void {
            this.$datas.length = 0;
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
                this.$cacheSendBytes = true;
            }
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                return [cmd, bytes, ip, port, care];
            }
            else if (this.$cacheSendBytes === true) {
                const data: ISocketRequestData = {
                    cmd: cmd,
                    bytes: bytes,
                    ip: ip,
                    port: port,
                    care: care
                };
                this.$datas.push(data);
            }
            return null;
        }
    }
}