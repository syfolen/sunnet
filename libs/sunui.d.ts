/**
 * @license sunui (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunui
 */
declare module sunui {
    /**
     * 确认框结果类型
     */
    enum ConfirmOptionValueEnum {
        /**
         * 无
         */
        NONE,

        /**
         * 是
         */
        YES,

        /**
         * 否
         */
        NO,

        /**
         * 取消
         */
        CANCEL
    }

    /**
     * 重试类型枚举
     */
    enum RetryMethodEnum {
        /**
         * 直接重试（默认）
         */
        NONE = 0x10,

        /**
         * 确认框，包含是和否选项
         */
        CONFIRM = 0x20
    }

    enum UILevel {
        /**
         * 未设置
         */
        NONE = 0,

        /**
         * 背景
         */
        BACKGROUND,

        /**
         * 场景
         */
        SCENE,

        /**
         * 面板，可同时显示多个，且可同时操作多个，当前被操作的面板将置顶显示
         * TODO: 面板暂时是没有实现的，因为没有使用的地方
         */
        PANEL,

        /**
         * 飘浮对象
         */
        FLOAT,

        /**
         * 金币获得
         */
        GOLD_TIPS,

        /**
         * 高倍金币
         */
        HIGH_GOLD_TIPS,

        /**
         * 播报信息
         */
        NOTICE,

        /**
         * 大赢家
         */
        BIGWINNER,

        /**
         * 小游戏
         */
        MINI_GAME,

        /**
         * 通用类型，默认的弹出方式，可同时显示多个，但只允许操作最新弹出的视图
         */
        POPUP,

        /**
         * 异步框对象
         */
        WAITINGBOX,

        /**
         * 加载界面
         * 说明：
         * 1. 层级低于加载界面的在场景中显示
         * 2. 层级等于或高于加载界面的在舞台中显示
         */
        LOADING,

        /**
         * 轻提示
         */
        TIPS,

        /**
         * 顶级弹出对象，特性与POPUP相同，一般情况下只适用于警告、错误等信息提示
         */
        TOP,

        /**
         * 测试对象，处在最顶层
         */
        DEBUG
    }

    /**
     * 弹框组件支持的接口
     */
    interface IPopupView {

        /**
         * 在弹框创建后调用
         */
        $onCreate?(...args: any[]): void;

        /**
         * 在弹框打开后调用，弹框将在弹出缓动完成之后被启用
         */
        $onOpen?(): void;

        /**
         * 在弹框被关闭前调用，弹框将在关闭缓动执行之前被禁用
         */
        $onClose?(): void;

        /**
         * 在弹框被移除前调用
         */
        $onRemove?(): void;
    }

    /**
     * Retryer接口
     */
    interface IRetryer {
        /**
         * 当前重试次数
         */
        readonly currentRetries: number;

        /**
         * 执行接口
         * @delay: 重试延时
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         */
        run(delay: number, handler: suncom.IHandler, maxRetries?: number): void;

        /**
         * 取消重试
         */
        cancel(): void;

        /**
         * 重置（仅会重置次数统计）
         */
        reset(): void;
    }

    /**
     * 场景信息
     */
    interface ISceneInfo {
        /**
         * 场景名字
         */
        name: number;

        /**
         * 初始化类
         */
        iniCls?: new (data?: any) => suncore.ITask;

        /**
         * 反初始化类
         */
        uniCls?: new () => suncore.ITask;
    }

    /**
     * 缓动类
     */
    interface ITween {

        /**
         * 取消缓动
         */
        cancel(): ITween;

        /**
         * 从当前属性缓动至props属性
         */
        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 从props属性缓动至当前属性
         */
        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 以props属性的幅度进行缓动
         */
        by(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 等待指定时间
         */
        wait(delay: number, handler?: suncom.IHandler): ITween;
    }

    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     */
    interface IViewProps {
        /**
         * 弹框的时间模块
         */
        mod?: suncore.ModuleEnum;

        /**
         * 坐标
         */
        x?: number;

        y?: number;

        /**
         * 缓动方法
         */
        ease?: Function;

        /**
         * 背景是否通透
         */
        trans?: boolean;

        /**
         * 显示层级
         */
        level?: UILevel;

        /**
         * 是否允许取消
         */
        cancelAllowed?: boolean;

        /**
         * 弹框的左右自适应参数
         */
        left?: number;

        right?: number;

        /**
         * 弹框的上下自适应参数
         */
        top?: number;

        bottom?: number;

        /**
         * 弹框的居中自适应参数
         */
        centerX?: number;

        centerY?: number;

        /**
         * 弹出的变形系数
         */
        scaleX?: number;

        scaleY?: number;

        /**
         * 参数列表，此参数会通过IPopupView的$onOpen方法传入IPopupView，用于支持窗口之间的交互
         */
        args?: any;

        /**
         * 弹框关闭时是否保留节点，默认为false
         */
        keepNode?: boolean;
    }

    /**
     * 场景初始化抽象入口类
     */
    abstract class AbstractSceneIniClass extends suncore.AbstractTask {

        /**
         * 进入场景回调，场景元素建议在此方法中初始化
         */
        protected $onEnterScene(): void;
    }

    /**
     * 注册场景信息
     */
    class RegisterScenesCommand extends puremvc.SimpleCommand {

        /**
         * @infos: 场景信息配置列表
         */
        execute(infos: Array<ISceneInfo>): void;
    }

    /**
     * 重试机制
     */
    class Retryer extends puremvc.Notifier implements IRetryer {

        /**
         * @confirmHandler: 若重试超过最大次数，则会执行此回调
         * @options: [ConfirmOptionValueEnum, string, ...]
         * 说明：
         * 1. method允许值为 RetryMethodEnum 或 suncore.ModuleEnum 或同时输入这两种值
         * 2. 若未输入 RetryMethodEnum ，则默认值为 RetryMethodEnum.NONE
         * 3. 若未输入 suncore.ModuleEnum ，则默认值为 suncore.ModuleEnum.SYSTEM
         */
        constructor(modOrMethod: suncore.ModuleEnum | RetryMethodEnum, confirmHandler?: suncom.IHandler, prompt?: string, ...options: Array<ConfirmOptionValueEnum | string>);

        /**
         * 执行接口
         * @delay: 重试延时
         * @maxRetries: 最大重试次数，默认为：2
         * @return: 返回true表示允许重试
         */
        run(delay: number, handler: suncom.IHandler, maxRetries?: number): void;

        /**
         * 取消重试
         */
        cancel(): void;

        /**
         * 重置（仅会重置次数统计）
         */
        reset(): void;

        /**
         * 当前重试次数
         */
        readonly currentRetries: number;
    }

    /**
     * 缓动类
     */
    class Tween extends puremvc.Notifier implements ITween {

        /**
         * 取消缓动
         */
        cancel(): ITween;

        /**
         * 从当前属性缓动至props属性
         */
        to(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 从props属性缓动至当前属性
         */
        from(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 以props属性的幅度进行缓动
         */
        by(props: any, duration: number, ease?: Function, handler?: suncom.IHandler): ITween;

        /**
         * 等待指定时间
         */
        wait(delay: number, handler?: suncom.IHandler): ITween;

        /**
         * @mod: 执行缓动的模块，默认为：CUSTOM
         */
        static get(item: any, mod?: suncore.ModuleEnum): ITween;
    }

    class UIManager extends puremvc.Notifier {

        static getInstance(): UIManager;

        /**
         * 进入新场景，并将当前场景压入历史
         * @data: 参数对象，保存在此对象中的数据的生命周期与场景历史的生命周期一致，当场景存在于当前或存在于历史时，数据就不会被销毁
         */
        enterScene(name: number, data?: any): void;

        /**
         * 退出当前场景，并返回历史
         */
        exitScene(): void;

        /**
         * 替换当前场景
         * @data: 参数说明请参考enterScene方法的注释
         * 说明：被替换的场景不会进入历史
         */
        replaceScene(name: number, data?: any): void;

        /**
         * 获取2D场景对象
         */
        readonly uiScene: Laya.Scene;

        /**
         * 获取3D场景对象
         */
        readonly d3Scene: Laya.Scene3D;

        /**
         * 获取场景名字
         */
        readonly sceneName: number;
    }

    /**
     * 视图关系对象
     */
    class ViewContact extends puremvc.Notifier {

        /**
         * @caller: 脚本回调对象，允许为非弹框对象
         * @popup: 被监视的视图对象，必须为弹框对象
         */
        constructor(caller: any, popup: any);

        /**
         * 注册弹框被关闭时需要执行的回调（详见ON_POPUP_CLOSED）
         */
        onPopupClosed(method: Function, caller: any, args?: any[]): ViewContact;

        /**
         * 注册弹框被销毁时需要执行的回调（详见ON_POPUP_REMOVED）
         */
        onPopupRemoved(method: Function, caller: any, args?: any[]): ViewContact;
    }

    /**
     * 弹框外观类，实现通用的弹窗功能
     */
    class ViewFacade extends puremvc.Notifier {
        /**
         * 设置是否允许取消，默认为false
         */
        cancelAllowed: boolean;

        /**
         * 弹出框外观
         * @view 弹出对象
         * @duration 缓动时间，默认为200毫秒
         */
        constructor(view: any, duration?: number);

        /**
         * 执行弹出逻辑
         */
        popup(props?: IViewProps): ViewFacade;

        /**
         * 执行关闭逻辑
         * @destroy: 关闭后是否销毁节点，默认为true
         */
        close(destroy?: boolean): void;
    }

    /**
     * 命令枚举
     */
    namespace NotifyKey {
        /**
         * 加载场景 { info: ISceneInfo, data: any }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 当场景加载完成时，外部应当派发ENTER_SCENE以通知sunui继续逻辑
         */
        const LOAD_SCENE: string;

        /**
         * 卸载场景 { info: ISceneInfo }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 不同于LOAD_SCENE命令，当场景卸载完成时，EXIT_SCENE命令不需要由外部派发
         */
        const UNLOAD_SCENE: string;

        /**
         * 加载场景之前 { none }
         */
        const BEFORE_LOAD_SCENE: string;

        /**
         * 注册场景信息 { infos: ISceneInfo[] }
         * 说明：
         * 1. 此命令由sunui实现，但需要在外部进行注册
         */
        const REGISTER_SCENES: string;

        /**
         * 进入场景命令 { uiScene: Laya.Scene, d3Scene: Laya.Scene3D }
         * 说明：
         * 1. 此命令由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 2. 此命令必然在iniCls被执行之后被派发
         */
        const ENTER_SCENE: string;

        /**
         * 退出场景命令 { sceneName: SceneNameEnum }
         * 说明：
         * 1. 此命令由sunui在执行退出场景逻辑时派发
         * 2. 此命令必然在uniCls被执行之前被派发
         * 3. 场景退出与销毁并不相同，场景销毁的逻辑会执行在uniCls被执行之后
         * 4. SceneNameEnum 为由外部定义的枚举值
         */
        const EXIT_SCENE: string;

        /**
         * 弹框己关闭 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onClose方法执行完毕之后被派发
         */
        const ON_POPUP_CLOSED: string;

        /**
         * 弹框移除之前 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行之前被派发
         */
        const BEFORE_POPUP_REMOVE: string;

        /**
         * 弹框己移除 { view: Laya.Sprite }
         * 说明：
         * 1. 此事件会在IPopupView的$onRemove方法执行完毕之后被派发
         * 2. 为了避免不同对象之间的销毁逻辑形成相互干扰，此命令被派发时，意味着弹框对象己被销毁
         */
        const ON_POPUP_REMOVED: string;

        /**
         * 对象被销毁事件 { caller: any }
         * 说明：
         * 1. 此事件主要被设计用来避免与非弹框对象存在联系的弹框在对象被销毁时可能意外残留的问题
         * 2. 若某个非视图对象曾使用ViewContact与某个弹框建立过联系，则对象销毁时应当派发此事件
         */
        const ON_CALLER_DESTROYED: string;

        /**
         * 重试确认请求 { mod: suncore.ModuleEnum, prompt: string, options: IRetryOption[], handler: suncom.IHandler }
         */
        const RETRY_CONFIRM: string;
    }

    /**
     * 资源管理器（主要用于资源的动态创建和销毁）
     */
    namespace Resource {

        /**
         * 锁定资源
         * 说明：
         * 1. 每次请求锁定资源，则资源的引用次数会加一
         */
        function lock(url: string): void;

        /**
         * 解锁资源
         * 说明：
         * 1. 每次请求解释资源时，资源的引用次数会减一
         * 2. 当资源引用次数为0时，资源会自动释放，当前的加载亦会取消
         */
        function unlock(url: string): void;

        /**
         * 根据url创建对象
         * @method: 仅支持Skeleton和Texture的创建
         * 说明：
         * 1. 调用此接口创建对象时，会产生一个计数，当计数为0时，资源会被彻底释放
         * 2. 见destroy方法
         */
        function create(url: string, method?: (res: any, url: string) => void, caller?: Object): any;

        /**
         * 销毁对象
         * 说明：
         * 1. 见create方法
         * 2. 调用此接口销毁对象时，会移除一个计数，当计数为0时，当计数为0时，资源会被彻底释放
         * 3. 若存在有部分逻辑未使用此接口加载资源，却调用此接口销毁资源，则可能会导致该资源被卸载或不可用，请注意
         */
        function destroy(url: string, method?: (res: any, url: string) => void, caller?: Object): void;

        /**
         * 资源预加载
         * @method: 预加载完成时，id大于0，否则等于0，仅支持Skeleton和Texture
         * @return: 返回资源组ID
         */
        function prepare(urls: string[], method: (id: number) => void, caller: Object): number;

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         */
        function release(id: number): number;
    }

    /**
     * 在对象或子对象中查找
     */
    function find(path:string, parent:Laya.Node): any;
}