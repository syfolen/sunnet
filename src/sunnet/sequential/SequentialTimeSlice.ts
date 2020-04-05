
module sunnet {
    /**
     * 时间片段
     */
    export abstract class SequentialTimeSlice extends SequentialSlice {
        /**
         * 网络连接对象
         */
        private $connection: INetConnection = null;

        /**
         * 创建在服务器上创建的时间
         */
        private $srvCreateTime: number = this.$connection.srvTime;

        /**
         * 片段时长
         */
        private $timeLen: number = 0;

        /**
         * 过去的时间（服务端时长）
         * 说明：
         * 1. 当过去的时间与片段时长一致，此时间片断的生命周期结束
         * 2. 此时间最终必然与片段时长相等，不因加速、减速、冰冻或眩晕等状态的施加而缩短或延长
         */
        private $pastTime: number = 0;

        /**
         * 生命时长（客户端时长）
         */
        private $lifeTime: number = 0;

        /**
         * 追帧时间（最小时间）
         */
        private $chaseTime: number = 0;

        /**
         * 当前时间流逝倍数
         */
        private $multiple: number = 1;

        /**
         * 追帧倍率
         * 说明：
         * 1. 当时差大于追帧时间时，时间应当以指定倍数来流逝
         * 2. 当时差小于或等于追帧时间时，时间流逝倍数将会在追帧时间内递减至0倍
         */
        private $chaseMultiple: number = 1;

        /**
         * 追帧生命时间（客户端时间）
         * 说明：
         * 1. 当此时间等于追帧时间时，追帧结束
         */
        private $chaseLifeTime: number = 0;

        /**
         * @timeLen: 时间片断长度
         * @name: 网络连接对象名，默认为"default"
         * 说明：
         * 1. 客户端对象是不需要追帧的
         * export
         */
        constructor(timeLen: number, name: string = "default") {
            super();
            this.$timeLen = timeLen;
            this.$connection = M.connetionMap[name] || null;
        }

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @chaseTime: 追帧时间（秒），若为0，则不作追帧处理，默认为：2
         * @chaseMultiple: 追帧时的时间倍率，默认为：1
         * 说明：
         * 1. 若chaseTime为0，则chaseMultiple的值是无效的
         * export
         */
        updateCreateTime(createTime: number = 0, chaseTime: number = 2, chaseMultiple: number = 1): void {
            this.$chaseTime = chaseTime;
            this.$srvCreateTime = createTime > 0 ? createTime : this.$srvCreateTime;
            // 若追帧时间为0，则时间的流逝倍数是无效的
            this.$chaseMultiple = chaseTime === 0 ? 0 : chaseMultiple;
            // 若追帧时间为0，则表示无需追帧
            if (chaseTime === 0) {
                // 立即计算过去时间
                this.$pastTime = this.$getCurrentServerTimestamp() - this.$srvCreateTime;
            }
        }

        /**
         * 帧事件回调（追帧算法实现函数）
         * export
         */
        protected $onEnterFrame(): void {
            // 当前时间流逝倍率不允许小于0
            if (this.$multiple < 0) {
                suncom.Logger.error(`当前时间流逝倍率不允许小于0`);
                return;
            }
            // 当前时间流逝倍率若为0，则直接返回
            else if (this.$multiple === 0) {
                return;
            }
            // 流逝的时间应当受当前时间倍率影响
            let delta: number = suncore.System.getDelta() * this.$multiple;

            // 对生命时间和过去时间进行累加
            this.$lifeTime += delta;
            this.$pastTime += delta;

            // 若追帧倍率大于0，则需要追帧处理
            if (this.$chaseMultiple > 0) {
                // 真实追帧时间=追帧倍率，如：以2秒0.5倍的速率追帧时，实际上2秒内总计只需要走0.5秒即可
                const realChaseTime: number = this.$chaseMultiple;

                // 计算当前时差
                let timeDiff: number = this.$pastTime - this.$lifeTime;
                // 时差大于追帧时间的部分，时间应当以指定倍数来流逝
                if (timeDiff > realChaseTime) {
                    let diff: number = timeDiff - realChaseTime;
                    if (diff < delta) {
                        delta -= diff;
                    }
                    else {
                        diff = delta;
                        delta = 0;
                    }
                    this.$lifeTime += diff;
                }
                // 时差小于或等于追帧时间的部分，时间流逝倍数应当在追帧时间内递减至0倍
                if (delta > 0) {
                    const less: number = this.$chaseTime - this.$chaseLifeTime;
                    const chassLifeTime: number = this.$chaseLifeTime;
                    if (delta < less) {
                        this.$chaseLifeTime += delta;
                    }
                    else {
                        delta = less;
                        this.$chaseLifeTime = this.$chaseTime;
                    }
                    // 历史追帧所用时间
                    const a: number = Laya.Ease.cubicOut(chassLifeTime, 0, this.$chaseMultiple, this.$chaseTime);
                    // 当前追帧所用时间
                    const b: number = Laya.Ease.cubicOut(this.$chaseLifeTime, 0, this.$chaseMultiple, this.$chaseTime);
                    // 累加追帧所增加的时间
                    this.$lifeTime += b - a;
                }
                // 判断是否己完成追帧
                if (this.$chaseLifeTime === this.$chaseTime) {
                    this.$chaseMultiple = 0;
                }
            }

            // 自定义帧事件
            this.$frameLoop();
        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         * export
         */
        protected abstract $frameLoop(): void;

        /**
         * 获取当前服务器时间戳
         */
        private $getCurrentServerTimestamp(): number {
            return this.$connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - this.$connection.clientTime;
        }

        /**
         * 对象过去的时间
         * export
         */
        get pastTime(): number {
            return this.$pastTime;
        }
    }
}