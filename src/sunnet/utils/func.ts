
module sunnet {

    /**
     * 获取当前服务器时间戳
     * export
     */
    export function getCurrentServerTimestamp(connName: string = "default"): number {
        const connection: INetConnection = M.connetionMap[connName] || null;
        if (connection === null) {
            return 0;
        }
        return connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - connection.clientTime;
    }
}