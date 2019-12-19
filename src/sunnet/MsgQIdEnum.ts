
module sunnet {
    /**
     * MsgQId枚举
     * export
     */
    export enum MsgQIdEnum {
        /**
         * 发送数据
         * export
         */
        NET_SEND_DATA = suncore.MsgQIdEnum.NET_MSG_ID_BEGIN,

        /**
         * 接收数据
         * export
         */
        NET_RECV_DATA
    }
}