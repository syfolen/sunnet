
module sunnet {
    /**
     * 时序命令定义接口
     * export
     */
    export interface ISequentialCommandDfn {
        /**
         * 类型
         * export
         */
        type: SequentialCommandTypeEnum;

        /**
         * 名称
         * export
         */
        name: number | string;
    }
}