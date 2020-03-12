
module sunnet {
    /**
     * 网络消息拦截器接口
     * export
     */
    export interface INetConnectionInterceptor {

        /**
         * 销毁拦截器
         * export
         */
        destroy(): void;

        /**
         * 数据发送拦截接口
         * @care: 心跳是否会关心此协议
         * export
         */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number, care: boolean): Array<any>;

        /**
         * 数据接收拦截接口
         * export
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any>;
    }
}