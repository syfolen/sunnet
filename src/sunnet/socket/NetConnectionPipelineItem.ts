
module sunnet {

    /**
     * 网络消息管道拦截器
     */
    export class NetConnectionPipelineItem implements INetConnectionPipelineItem {

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