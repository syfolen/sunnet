
module sunnet {
    /**
     * 微服务器WebSocket状态包
     * export
     */
    export interface IMSWSStatePacket extends IMSWSPacket {
        /**
         * WebSocket状态
         * export
         */
        state: MSWSStateEnum;

        /**
         * 是否为非阻塞式，默认为：false
         * 说明：
         * 1. 若为true，则此消息不会对Protocal类型的消息形成阻塞
         * export
         */
        nonBlock?: boolean;
    }
}