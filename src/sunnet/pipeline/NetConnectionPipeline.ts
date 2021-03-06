
module sunnet {
    /**
     * 消息处理管道
     * 此类以责任链模式处理即将发送或己接收的网络数据，专门为 core.NetConnection 服务
     */
    export class NetConnectionPipeline extends puremvc.Notifier implements INetConnectionInterceptor, INetConnectionPipeline {
        /**
         * 拦截器列表
         */
        private $items: Array<INetConnectionPipelineItem> = [];

        /**
         * 网络连接对象
         */
        protected $connection: INetConnection;

        constructor(connection: INetConnection) {
            super();
            this.$connection = connection;
        }

        /**
         * 销毁拦截器
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            while (this.$items.length > 0) {
                const item: INetConnectionPipelineItem = this.$items.shift();
                item.interceptor.destroy();
            }
        }

        /**
         * 新增责任处理者
         * 说明：
         * 1. 当网络发送数据时，后添加的拦截器先执行
         * 2. 当网络接收数据时，先添加的拦截器先执行
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void {
            const item: INetConnectionPipelineItem = new NetConnectionPipelineItem();

            item.type = typeof arg0 === "string" ? arg0 : null;
            item.interceptor = typeof arg0 !== "string" ? new arg0(this.$connection) : new arg1(this.$connection);

            this.$items.push(item);
        }

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void {
            for (let i: number = 0; i < this.$items.length; i++) {
                const interceptor: INetConnectionInterceptor = this.$items[i].interceptor;
                if (interceptor instanceof cls) {
                    this.$items.splice(i, 1);
                    interceptor.destroy();
                    break;
                }
            }
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any> {
            let params: Array<any> = [cmd, srvId, bytes, data];

            // 数据将保持传递，直至处理完毕，或返回 null
            for (let i: number = 0; i < this.$items.length; i++) {
                const item: INetConnectionPipelineItem = this.$items[i];
                if (item.type === "send") {
                    continue;
                }
                const interceptor: INetConnectionInterceptor = item.interceptor;
                params = interceptor.recv.apply(interceptor, params);
                if (params === null) {
                    return;
                }
            }

            // 消息解析失败
            if (params[3] === void 0) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `NetConnectionPipeline=> decode 意外的指令 cmd:${params[0].toString()}, buff:${params[1] ? "[Object]" : "null"}`);
            }
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any> {
            for (let i: number = this.$items.length - 1; i > -1; i--) {
                // 数据将保持传递，直至处理完毕
                const item: INetConnectionPipelineItem = this.$items[i];
                if (item.type === "recv") {
                    continue;
                }
                const interceptor: INetConnectionInterceptor = item.interceptor;
                const res: any = interceptor.send.call(interceptor, cmd, bytes, ip, port);
                if (res === null) {
                    return null;
                }
            }
            return null;
        }
    }
}