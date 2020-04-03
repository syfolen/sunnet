
module sunnet {
    /**
     * 协议追踪器
     * 说明：
     * 1. 用于计算ping值
     */
    export interface IProtocalTracker {
        /**
         * 请求
         */
        rsp: number;

        /**
         * 应答
         */
        rep: number;

        /**
         * 发送时间
         */
        time: number;
    }
}