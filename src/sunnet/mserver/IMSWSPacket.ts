
module sunnet {
    /**
     * 微服务器WebSocket数据包
     * 说明：
     * 1. 若不默认任何配置项，则消息以逐帧的形式进行派发
     * export
     */
    export interface IMSWSPacket {
        /**
         * 数据包类型
         */
        kind?: MSWSPacketKindEnum;

        /**
         * 网络连接包字，默认为：default
         */
        connName?: string;

        /**
         * 是否为新消息，若为false，则紧随上一条消息下行，默认为：true
         * export
         */
        asNewMsg?: boolean;

        /**
         * 延时，默认为：0
         * export
         */
        delay?: number;

        /**
         * 生效时间戳
         */
        timestamp?: number;

        /**
         * 等待消息名字，默认为：null
         * 说明：
         * 1. 该消息会在客户端上行与此名字一致的消息后再开始下行
         * export
         */
        waitName?: string;

        /**
         * 等待次数，不小于1，默认为：1
         * 说明：
         * 1. 该消息会在上行的消息达到指定次数时再开始下行
         * export
         */
        waitTimes?: number;
    }
}