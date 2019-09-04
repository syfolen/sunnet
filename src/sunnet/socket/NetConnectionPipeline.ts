
module sunnet {

    /**
     * 消息处理管道
     * 此类以责任链模式处理即将发送或己接收的网络数据，专门为 core.NetConnection 服务
     */
    export class NetConnectionPipeline extends NetConnectionInterceptor implements INetConnectionPipeline {

        /**
         * 拦截器列表
         */
        private $items: Array<INetConnectionPipelineItem> = [];

        /**
         * 新增责任处理者
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
        recv(cmd: number, srvId: number, buffer: any, data?: any): Array<any> {
            let params: Array<any> = [cmd, srvId, buffer, data];

            // 数据将保持传递，直至处理完毕，或返回 null
            for (let i: number = this.$items.length - 1; i > -1; i--) {
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
                if (suncom.Global.debugMode) {
                    suncom.Logger.warn(`NetConnectionPipeline=> decode 意外的指令 cmd:${params[0].toString(16)}, buff:${params[1] ? "[Object]" : "null"}`);
                }
            }
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any> {
            // 数据将保持传递，直至处理完毕
            for (let i: number = 0; i < this.$items.length; i++) {
                const item: INetConnectionPipelineItem = this.$items[i];
                if (item.type === "recv") {
                    continue;
                }
                const interceptor: INetConnectionInterceptor = item.interceptor;
                const res = interceptor.send.call(interceptor, cmd, bytes, ip, port);
                if (res === null) {
                    return null;
                }
            }
            return null;
        }
    }
}