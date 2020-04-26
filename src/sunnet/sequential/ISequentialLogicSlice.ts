
module sunnet {
    /**
     * 逻辑时序接口
     * export
     */
    export interface ISequentialLogicSlice extends ISequentialSlice {

        /**
         * 等待条件
         * @ids: 先决时序ID
         * @conditions: 条件
         * @handler: 回调执行器
         * 说明：
         * 1. 若调用此接口，则当前时序不会立即执行，而是会先等待所有先决时序执行完毕，然后执行handler，由外部触发时间序的运行
         * 2. 一般调用此接口情况，时序命令列表中的命令应当是GUI时序消息而非网络时序消息，因为网络时序消息在接收到之后是自动解锁的
         * export
         */
        wait(ids: number[], conditions: any, handler?: suncom.IHandler): void;

        /**
         * 时序ID
         */
        readonly SEQ_ID: number;
    }
}