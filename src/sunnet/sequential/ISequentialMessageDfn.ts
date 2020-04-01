
module sunnet {
    /**
     * 时序消息定义（仅指网络消息）
     * 说明：
     * 1. 来自GUI的消息是不需要记录的
     * export
     */
    export interface ISequentialMessageDfn {
        /**
         * 名字
         * export
         */
        name: string;

        /**
         * 数据
         * export
         */
        data?: any;
    }
}