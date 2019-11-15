
module sunnet {

    /**
     * 网络消息管道拦截器信息
     */
    export interface INetConnectionPipelineItem {
        /**
         * 类型
         */
        type?: string;

        /**
         * 拦截器
         */
        interceptor: INetConnectionInterceptor;
    }
}