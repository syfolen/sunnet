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
     * 弹出标记枚举
     */
    enum PopupFlagEnum {
        /**
         * 无
         */
        NONE = 0x0,

        /**
         * 禁用缓动
         */
        SIMPLY = 0x1,

        /**
         * 背景通透
         */
        TRANSPARENT = 0x2,

        /**
         * 允许鼠标穿透
         */
        MOUSE_THROUGH = 0x4,

        /**
         * 同步淡入淡出时间
         * 说明：
         * 1. 正常情况下背景蒙灰时间为200毫秒
         * 2. 若启用此标记，则蒙灰时间与弹出设定时间一致
         */
        SYNC_FADE_TIME = 0x8
    }

    /**
     * 弹框大小
     */
    enum PopupWinSizeEnum {
        /**
         * 正常（默认）
         */
        NORMAL,

        /**
         * 小
         */
        SMALL,

        /**
         * 中
         */
        MIDDLE,

        /**
         * 大
         */
        LARGE
    }

    /**
     * 下载速度限制
     */
    enum ResourceDownloadSpeedEnum {
        /**
         * 无限制
         */
        NONE = 0,

        /**
         * 快（1M）
         */
        HIGH = 1024 * 1024 / 8,

        /**
         * 中等（256K）
         */
        MID = 256 * 1024 / 8,

        /**
         * 慢（64K）
         */
        LOW = 64 * 1024 / 8
    }

    /**
     * 重试类型枚举
     */
    enum RetryMethodEnum {
        /**
         * 自动重试（默认）
         */
        AUTO = 0x10,

        /**
         * 请求确认，包含是和否选项
         */
        CONFIRM = 0x20,

        /**
         * 终止重试
         */
        TERMINATE = 0x40
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
         * 跑马灯提示
         */
        LAMP_TIPS,

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
     * 重试机制接口
     */
    interface IRetryer extends puremvc.INotifier {
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
         * 2D场景文件
         */
        scene2d: string;

        /**
         * 3D场景文件
         */
        scene3d?: string;

        /**
         * 初始化类
         */
        iniCls?: new (info: ISceneInfo, data?: any) => sunui.SceneIniClass;

        /**
         * 反初始化类
         */
        uniCls?: new (info: ISceneInfo, data?: any) => sunui.SceneUniClass;
    }

    /**
     * 弹出缓动信息接口，接口数据展示了执行弹出时支持的所有属性
     */
    interface IViewProps {
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
         * 标记集合（多个标记允许并存）
         */
        flags?: PopupFlagEnum;

        /**
         * 显示层级
         */
        level?: UILevel;

        /**
         * 是否自动销毁，默认为 true
         */
        autoDestroy?: boolean;

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
     * 场景入口抽象类
     */
    abstract class AbstractSceneTask extends suncore.AbstractTask {
        /**
         * 场景配置信息
         */
        protected $info: ISceneInfo;

        /**
         * 场景跳转参数
         */
        protected $data: any;

        /**
         * @info: 当前场景信息
         * @data: 当前场景构建时的传入数据
         */
        constructor(info: ISceneInfo, data?: any);
    }

    /**
     * 注册场景信息
     */
    class RegisterScenesCommand extends puremvc.SimpleCommand {

        /**
         * @infos: 场景信息配置列表
         */
        execute(infos: ISceneInfo[]): void;
    }

    /**
     * 重试机制
     */
    class Retryer extends puremvc.Notifier implements IRetryer {

        /**
         * @confirmHandler: 若重试超过最大次数，则会执行此回调，默认为: null
         * @options: [ConfirmOptionValueEnum, string, ...]，默认为: null
         */
        constructor(method: RetryMethodEnum, confirmHandler?: suncom.IHandler, prompt?: string, ...options: Array<ConfirmOptionValueEnum | string>);

        /**
         * 执行接口
         * @delay: 重试延时，单位为毫秒
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
     * 可运行对象
     */
    abstract class Runnable extends puremvc.Notifier {

        /**
         * @condition: 返回true时表示符合拦截条件
         */
        constructor(command: string, condition: suncom.IHandler);
    }

    /**
     * 运行时，可用于维护复杂的UI逻辑次序
     * 适合处理即需要加载、卸载资源，又需要在网络中异步获取数据，且两者频繁交错发生的业务
     */
    class Runtime extends puremvc.Notifier {

        /**
         * @timeout: 超时时间，默认不会超时
         */
        constructor(timeout?: number);

        /**
         * 添加命令次序，运行时将拦截所有符合指定的条件的命令，并在条件满足后将它们重新派发
         * @condition: 拦截条件，返回 true 时进行拦截
         * @monitors[]：拦截将在所有监视结束的同时被解除
         */
        protected $addCommand(command: string, condition: Function, caller: Object, monitors: Monitor[]): void;
    }

    /**
     * 场景初始化入口类
     */
    abstract class SceneIniClass extends AbstractSceneTask {

        constructor(info: ISceneInfo, data?: any);

        /**
         * 进入场景回调，场景数据建议在此方法中初始化
         * 说明：
         * 1. 此方法会后于run执行
         */
        protected $onEnterScene(): void;
    }

    /**
     * 场景反初始化入口类
     */
    abstract class SceneUniClass extends AbstractSceneTask {

        constructor(info: ISceneInfo, data?: any);

        /**
         * 离开场景回调，场景数据建议在此方法中反初始化，场景将在此方法执行完毕后销毁
         * 说明：
         * 1. 此方法会先于run执行
         */
        protected $onLeaveScene(): void;
    }

    /**
     * 缓动类
     * 说明：
     * 1. 缓动类内置了对象池，当缓动结束或被取消后没有立即被指定动作，则会在下一帧自动回收
     * 2. 由于缓动对象只有在被回收后才会自动释放资源，故不建议在外部持有不工作的缓动对象
     * 3. 若你的需求必须这么做，则可以这么来防止Tween被回收：Tween.get(target).usePool(false);
     * 4. 当外部持有的Tween被弃用时，请记得及时回收
     */
    class Tween extends puremvc.Notifier {

        /**
         * 取消缓动
         */
        cancel(): Tween;

        /**
         * 回收到对象池
         */
        recover(): void;

        /**
         * 从当前属性缓动至props属性
         * @props: 变化的属性集合，其中update属性的类型只能指定为suncom.Handler，可用其来观察缓动数值的变化
         * @duration: 缓动时长
         * @ease: 缓动函数，默认为: null
         * @complete: 缓动结束时的回调，默认为: null
         */
        to(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 从props属性缓动至当前属性
         * @参数详细说明请参考Tween.to
         */
        from(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 以props属性的幅度进行缓动
         * @参数详细说明请参考Tween.to
         */
        by(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 等待指定时间
         */
        wait(delay: number, complete?: suncom.IHandler): Tween;

        /**
         * 是否使用对象池
         * 说明：
         * 1. 若使用了对象池，且缓动结束或被取消后没有重新指定动作，则在下一帧自动回收
         */
        usePool(value: boolean): Tween;

        /**
         * @target: 执行缓动的对象
         * @mod: 执行缓动的模块，默认为：CUSTOM
         */
        static get(target: any, mod?: suncore.ModuleEnum): Tween;
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
         * 删除历史
         * @deleteCount: 需要删除的历史场景个数
         */
        deleteHistories(deleteCount: number): void;

        /**
         * 移除视图
         */
        removeView(view: any): void;

        /**
         * 场景是否己就绪
         */
        readonly ready: boolean;

        /**
         * 获取2D场景对象
         */
        readonly scene2d: Laya.Scene | fairygui.GComponent;

        /**
         * 获取3D场景对象
         */
        readonly scene3d: Laya.Scene3D;

        /**
         * 获取场景名字
         */
        readonly sceneName: number;
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
     * 监视器
     */
    class Monitor extends Runnable {
    }

    /**
     * 命令枚举
     */
    namespace NotifyKey {
        /**
         * 重试确认请求 { prompt: string, options: IRetryOption[], handler: suncom.IHandler }
         */
        const RETRY_CONFIRM: string;

        /**
         * 注册场景信息 { infos: ISceneInfo[] }
         * 说明：
         * 1. 此命令由sunui实现，但需要在外部进行注册
         */
        const REGISTER_SCENES: string;

        /**
         * 加载场景之前 { none }
         * 说明：
         * 1. 此事件主要用于展示LoadingView
         */
        const BEFORE_LOAD_SCENE: string;

        /**
         * 加载场景 { info: ISceneInfo }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 当场景加载完成时，外部应当派发ENTER_SCENE命令以通知sunui继续逻辑
         */
        const LOAD_SCENE: string;

        /**
         * 卸载场景 { scene2d: Laya.Scene, scene3d: Laya.Scene3D }
         * 说明：
         * 1. 此命令由外部注册并实现
         * 2. 不同于LOAD_SCENE命令，当场景卸载完成时，EXIT_SCENE命令不需要由外部派发
         */
        const UNLOAD_SCENE: string;

        /**
         * 进入场景命令 { scene2d: Laya.Scene, scene3d: Laya.Scene3D }
         * 说明：
         * 1. sunui优先响应此命令
         * 2. 此命令由外部在实现LOAD_SCENE命令时于场景加载完成时派发
         * 3. 此命令必然在iniCls.run()被执行之后被派发
         */
        const ENTER_SCENE: string;

        /**
         * 退出场景命令 { sceneName: SceneNameEnum }
         * 说明：
         * 1. 此命令被派发时，意味着退出场景的逻辑即将被执行
         * 2. 场景时间轴将此命令被派发后自动停止，sunui开始进入退出与销毁场景的流程
         * 3. SceneNameEnum 为由外部定义的枚举值
         */
        const EXIT_SCENE: string;

        /**
         * 离开场景之前
         */
        const BEFORE_LEAVE_SCENE: string;

        /**
         * 离开场景命令 { none }
         * 说明：
         * 1. 此命令在完成uniCls的构建之后被派发（此时uniCls.run尚未执行）
         * 2. 表现层中的数据应当在此处销毁
         */
        const LEAVE_SCENE: string;

        /**
         * 场景己就绪 { ready: boolean }
         */
        const SCENE_IS_READY: string;
    }

    /**
     * 资源管理器（主要用于资源的动态创建和销毁）
     */
    namespace Resource {
        /**
         * 3D资源目录
         */
        let res3dRoot: string;

        /**
         * 设置资源的加载速度
         */
        function setDownloadSpeed(speed: ResourceDownloadSpeedEnum): void;

        /**
         * 锁定资源，此方法可确保正在使用的资源的安全性
         * 说明：
         * 1. 每次请求锁定资源，资源的引用次数会+1
         * 2. 若为3d资源，则会同时自动锁定关联的资源配置文件
         * 3. 禁止直接调用此方法来单独锁定3d资源配置文件
         */
        function lock(url: string): void;

        /**
         * 解锁资源，此方法可确保未在使用的资源不会出现内存泄露问题
         * 说明：
         * 1. 每次请求解锁资源时，资源的引用次数会-1
         * 2. 若为3d资源，则会同时自动解锁关联的资源配置文件
         * 3. 禁止直接调用此方法来单独解锁3d资源配置文件
         * 4. 当2d资源的引用次数为0时，资源会自动释放，当前的加载亦会取消
         * 5. 3d资源只有在资源包的配置文件的引用次数为0时才会释放
         */
        function unlock(url: string): void;

        /**
         * 资源预加载
         * @method: 预加载完成时，会执行此方法
         * @return: 返回资源组ID
         * 说明：
         * 1. 建议将业务逻辑的初始化代码放在资源加载完成之后，这样的话，在加载被取消时，也不需要对初始化进行撤销
         */
        function prepare(urls: string[], method: (id: number, progress?: number) => void, caller: Object): number;

        /**
         * 释放资源组
         * @id: 资源组ID
         * @return: 始终返回0
         */
        function release(id: number): number;

        /**
         * 立即创建对象
         * 说明：
         * 1. 通过此方法创建对象并不会产生引用计数，且只需要在外部销毁即可
         */
        function createSync(url: string, data?: any): any;

        /**
         * 立即创建 3d 对象
         * 说明：
         * 1. 同 createSync
         */
        function createRes3dSync(name: string): any;

        /**
         * 创建预置体
         */
        function createPrefab(url: string): Laya.View;

        /**
         * 获取3D资源的配置文件地址
         */
        function getRes3dJsonUrl(url: string): string;

        /**
         * 判断是否为fairygui资源
         */
        function isFGuiUrl(url: string): boolean;

        /**
         * 获取3D资源地址
         * @name: 如xxx或xxx.lh，若未指定扩展名，则认为是.lh
         * 说明：
         * 1. 所有3d资源都必须放在${Resource.res3dRoot}目录下
         * 2. 完整的3D资源目录必须为 ${Resource.res3dRoot}/LayaScene_${pack}/Conventional/ 否则将不能正确解析
         */
        function getRes3dUrlByName(name: string): string;

        /**
         * 确认加载列表中的url正确性
         * 注意：此方法修改和返回的数组均为数据源
         */
        function checkLoadList(urls: string[]): string[];
    }

    /**
     * 在对象或子对象中查找
     */
    function find<T>(path: string, parent: Laya.Node): T;
}