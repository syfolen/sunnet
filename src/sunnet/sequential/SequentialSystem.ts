
module sunnet {
    /**
     * 时序系统接口
     * 设计说明：
     * 1. 时序系统仅为GUI服务，用于解决游戏业务
     * 2. 解决在多人联网游戏中，有状态对象在不同客户端的表现可能会因网络延时，或加载延时导致的不同步出现各种问题
     * 例如：
     * 1. 有些行为的发起具有先决条件，如：捕鱼三叉戟的发射必须等待炮台的加载和搭建完成，但基于1，有可能发生玩家A己点击的发射子弹，但玩家B还处于加载资源的情况
     * 2. 若碰到2中的情况，则玩家B将会错过玩家A的子弹发射消息，导致玩家B中的玩家A炮台搭建完成之后，三叉戟的逻辑再也不能继续进行
     * 3. 又或者玩家B舞台中的玩家A击中一个漩涡，但由于资源加载延时了漩涡的表现，而玩家A在漩涡完成之后，发起了更改炮台倍率的请求，玩家B收到了这个更改通知
     * 4. 继续3，因为游戏规则为漩涡期间不能更改倍率，故这个更改消息必须被延迟到漩涡完成之后才能执行
     * 5. 又或者客户端收到了一条鱼的生成消息，但时间戳是在5秒前，鱼的游动需要作追帧处理
     * 6. 基于上述诸多情况，故设计时序系统
     * 如何创建：
     * 1. 考虑到性能问题，时序服务不能被玩家实例化，它伴随着名为"default"的NetConnection的创建而创建，且一旦创建，则永远不能被销毁
     * export
     */
    export namespace SequentialSystem {

        /**
         * 匹配指定ID的所有时序片断，并将满足条件的时序片断哈希值放入dependencies
         */
        export function matchSequentials(ids: number[], conditions: any, dependencies: number[]): void {
            const keys: string[] = Object.keys(conditions);
            for (let i: number = 0; i < M.seqLogicSliceList.length; i++) {
                const ls: SequentialLogicSlice = M.seqLogicSliceList[i];
                let match: boolean = true;
                for (let i: number = 0; i < keys.length; i++) {
                    const key: string = keys[i];
                    if (ls[key] !== conditions[key]) {
                        match = false;
                        break;
                    }
                }
                if (match === true) {
                    dependencies.push(ls.hashId);
                }
            }
        }
    }
}