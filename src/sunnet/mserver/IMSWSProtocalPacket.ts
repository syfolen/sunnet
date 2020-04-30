
module sunnet {
    /**
     * 微服务器WebSocket协议包
     * export
     */
    export interface IMSWSProtocalPacket extends IMSWSPacket {
        /**
         * 回复的消息名字
         * export
         */
        replyName?: string;

        /**
         * 下行的数据内容
         * export
         */
        data?: any;
    }
}