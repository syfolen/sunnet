
module sunnet {
    /**
     * 客户端按钮点击信息
     */
    export interface IClientClickInfo {
        /**
         * 按钮编号
         */
        btnId: number;

        /**
         * 测试序号
         */
        seqId: number;

        /**
         * 点击事件
         */
        event: Laya.Event;
    }
}