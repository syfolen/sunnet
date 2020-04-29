
module sunnet {
    /**
     * 时间片段
     * export
     */
    export abstract class SequentialTimeSlice extends SequentialSlice implements ISequentialTimeSlice {
        /**
         * 网络连接对象
         */
        private $connection: INetConnection = null;

        /**
         * 对象在服务端的创建时间
         */
        private $srvCreateTime: number = 0;

        /**
         * 生命时长
         */
        private $lifeTime: number = 0;

        /**
         * 过去时长
         * 说明：
         * 1. 当此时长等于生命时长时，时间片断失效
         * 2. 此时间最终必然与生命时长相等，此时长的增长受$timeMultiple的影响
         */
        private $pastTime: number = 0;

        /**
         * 浪费掉的时间（如冰冻时间）
         */
        private $killedTime: number = 0;

        /**
         * 时间流逝倍数
         */
        private $timeMultiple: number = 1;

        /**
         * 追帧倍率
         */
        private $chaseMultiple: number = 1;

        /**
         * @timeLen: 时间片断长度
         * @conName: 默认为"default"
         * 说明：
         * 1. 客户端对象是不需要追帧的
         * export
         */
        constructor(lifeTime: number, conName: string = "default") {
            super();
            this.$lifeTime = lifeTime;
            this.$connection = M.connetionMap[conName] || null;
            this.$srvCreateTime = this.$connection.getCurrentServerTimestamp();
        }

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @pastTime: 默认过去时长
         * @chaseMultiple: 追帧时的时间倍率，默认为：1
         * export
         */
        updateCreateTime(createTime: number = 0, pastTime: number = 0, chaseMultiple: number = 1): void {
            this.$pastTime = pastTime;
            this.$chaseMultiple = chaseMultiple;
            this.$srvCreateTime = createTime > 0 ? createTime : this.$srvCreateTime;
            this.$onEnterFrame();
        }

        /**
         * 帧事件回调（追帧算法实现函数）
         * export
         */
        protected $onEnterFrame(): void {
            // 当前时间流逝倍率不允许小于0
            if (this.$timeMultiple < 0) {
                suncom.Logger.error(suncom.DebugMode.ANY, `当前时间流逝倍率不允许小于0`);
                return;
            }

            // 流逝的时间应当受当前时间倍率影响
            let delta: number = suncore.System.getDelta() * this.$timeMultiple;
            // 如果流逝的时间小于当前系统时间间隔，则不足的时间视为浪费掉的时间
            if (delta < suncore.System.getDelta()) {
                this.$killedTime += suncore.System.getDelta() - delta;
            }

            // 当前时间流逝倍率若为0，则直接返回
            if (this.$timeMultiple === 0) {
                return;
            }
            // 对过去时间进行累加
            this.$pastTime += delta;

            // 时序与服务端的时间差
            let timeDiff: number = this.$connection.getCurrentServerTimestamp() - (this.$srvCreateTime + this.$pastTime + this.$killedTime);
            if (timeDiff > 0) {
                delta *= this.$chaseMultiple;
                if (delta > timeDiff) {
                    delta = timeDiff;
                }
                // 追帧
                this.$pastTime += delta;
            }
            // $pastTime不允许超过lifeTime
            if (this.$pastTime > this.$lifeTime) {
                this.$pastTime = this.$lifeTime;
            }

            // 自定义帧事件
            this.$frameLoop();
            // 时间结束
            if (this.$pastTime >= this.$lifeTime) {
                this.$onTimeup();
            }
        }

        /**
         * 获取当前服务端时间戳
         * export
         */
        getCurrentServerTimestamp(): number {
            return this.$connection.getCurrentServerTimestamp();
        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         * export
         */
        protected abstract $frameLoop(): void;

        /**
         * 时间结束回调（回调前会先执行$frameLoop方法）
         * export
         */
        protected abstract $onTimeup(): void;

        /**
         * 对象的生命时长
         * export
         */
        get timeLen(): number {
            return this.$lifeTime;
        }

        /**
         * 对象过去的时间
         * export
         */
        get pastTime(): number {
            // 对外使用生命时间作为过去时间
            return this.$pastTime;
        }

        /**
         * 时间流逝的倍率
         * export
         */
        get timeMultiple(): number {
            return this.$timeMultiple;
        }
        /**
         * depends
         */
        set timeMultiple(value: number) {
            this.$timeMultiple = value;
        }
    }
}