
module sunnet {
    /**
     * 客户端按钮信息
     */
    export interface IClientButton {
        /**
         * 按钮对象
         */
        button: any;

        /**
         * 是否为一次性按钮
         */
        once: boolean;

        /**
         * 点击时间
         */
        clickTime: number;
    }
}