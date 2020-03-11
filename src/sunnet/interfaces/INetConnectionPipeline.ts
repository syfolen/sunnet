
module sunnet {
    /**
     * 消息处理管道接口
     * export
     */
    export interface INetConnectionPipeline extends INetConnectionInterceptor {

        /**
         * 新增责任处理者
         * export
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void;

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         * export
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void;
    }
}