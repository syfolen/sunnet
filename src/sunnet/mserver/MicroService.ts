
module sunnet {
    /**
     * 微服务器服务
     * export
     */
    export class MicroService extends suncore.BaseService {
        /**
         * 按钮集合
         */
        private $buttonMap: { [id: number]: IClientButton } = {};

        /**
         * 按钮点击列表
         */
        private $clickList: IClientClickInfo[] = [];

        /**
         * 启动回调
         * export
         */
        protected $onRun(): void {
            this.facade.registerObserver(suncom.NotifyKey.TEST_REG_BUTTON, this.$onTestRegButton, this);
            this.facade.registerObserver(suncom.NotifyKey.TEST_CLICK_BUTTON, this.$onTestClickButton, this);
        }

        /**
         * 停止回调
         * export
         */
        protected $onStop(): void {
            this.facade.removeObserver(suncom.NotifyKey.TEST_REG_BUTTON, this.$onTestRegButton, this);
            this.facade.removeObserver(suncom.NotifyKey.TEST_CLICK_BUTTON, this.$onTestClickButton, this);
        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         * export
         */
        protected $frameLoop(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                if (suncom.Test.ENABLE_MICRO_SERVER === true) {
                    MicroServer.run();
                    this.$doClickButton();
                }
            }
        }

        /**
         * 测试注册按钮
         */
        private $onTestRegButton(id: number, button: any, once: boolean): void {
            if (id === -1) {
                this.$buttonMap = {};
            }
            else {
                const info: IClientButton = {
                    button: button,
                    once: once,
                    clickTime: 0
                };
                this.$buttonMap[id] = info;
            }
        }

        /**
         * 测试点击按钮
         */
        private $onTestClickButton(btnId: number, event: string | Laya.Event): void {
            if (typeof event === "string") {
                event = new Laya.Event().setTo(event, null, null);
            }
            const info: IClientClickInfo = {
                btnId: btnId,
                event: event,
                seqId: 0
            };
            this.$clickList.push(info);
            const out: suncore.ITestSeqInfo = { seqId: 0 };
            this.facade.sendNotification(suncom.NotifyKey.TEST_EVENT, [btnId, "reg", out]);
            suncom.Test.expect(out.seqId).not.toBe(0);
            info.seqId = out.seqId;
        }

        /**
         * 点击按钮
         */
        private $doClickButton(): void {
            if (this.$clickList.length === 0) {
                return;
            }
            const info: IClientClickInfo = this.$clickList[0];
            if (info.seqId !== suncore.TestTask.currentTestSeqId) {
                return;
            }
            const button: IClientButton = this.$buttonMap[info.btnId] || null;
            if (button === null) {
                return;
            }

            if (button.clickTime === 0) {
                button.clickTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
                return;
            }
            if (button.clickTime + 500 > suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return;
            }
            button.clickTime = 0;

            if (button.once === true) {
                delete this.$buttonMap[info.btnId];
            }
            this.$clickList.shift();

            const event: Laya.Event = info.event;
            event.setTo(event.type, button.button, button.button);
            button.button.event(event.type, event);
            this.facade.sendNotification(suncom.NotifyKey.TEST_EVENT, [info.btnId, "exe"]);
        }
    }
}