
module sunnet {
    /**
     * 网络环境模拟等级枚举
     * export
     */
    export enum VirtualNetworkLevelEnum {
        /**
         * 无任何模拟
         * export
         */
        NONE,

        /**
         * 好
         * export
         */
        GOOD,

        /**
         * 差
         * export
         */
        BAD,

        /**
         * 极差
         * export
         */
        UNSTABLE
    }
}