
module sunnet {

    /**
     * 消息处理管道接口
     */
    export interface INetConnectionPipeline {

        /**
         * 新增责任处理者
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void;

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void;

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, buffer: any, data?: any): Array<any>;

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any>;
    }
}