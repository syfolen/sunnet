
module sunnet {
    /**
     * MsgQId枚举（谨慎修改）
     * 说明：
     * 1. 请勿轻易修改此处的数据，否则可能会影响suncore中MsgQ的业务
     * export
     */
    export enum MsgQIdEnum {
        /**
         * 发送数据
         * export
         */
        NSL_SEND_DATA = 1,

        /**
         * 接收数据
         * export
         */
        NSL_RECV_DATA = 2
    }
}