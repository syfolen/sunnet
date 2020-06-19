/**
 * @license suntdd (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suntdd
 */
declare module suntdd {
    /**
     * 微服务器WebSocket连接状态枚举
     */
    enum MSWSConnectionStateEnum {
        /**
         * 己连接
         */
        CONNECTED,

        /**
         * 连接中
         */
        CONNECTING,

        /**
         * 己断开
         */
        DISCONNECTED
    }

    /**
     * 微服务器WebSocket状态枚举
     */
    enum MSWSStateEnum {
        /**
         * 己连接
         */
        CONNECTED,

        /**
         * 服务器关闭连接
         */
        CLOSE,

        /**
         * 网络异常断开
         */
        ERROR
    }

    /**
     * 测试用例注册可选项枚举
     */
    enum TestCaseRegOptionEnum {
        /**
         * 插入（优先执行）
         */
        INSERT,

        /**
         * 追加（默认）
         */
        APPEND
    }

    /**
     * 微服务器信息接口
     */
    interface IMSWSInfo {
        /**
         * 连接名称
         */
        name: string;

        /**
         * 连接状态
         */
        state: MSWSConnectionStateEnum;
    }

    /**
     * 微服务器WebSocket数据包接口
     * 说明：
     * 1. 若不默认任何配置项，则消息以逐帧的形式进行派发
     * 2. 若指定的网络连接不存在，则数据包不会被处理
     */
    interface IMSWSPacket {
        /**
         * 下行延时，默认为：0
         */
        delay?: number;

        /**
         * 是否为新消息，若为false，则紧随上一条消息下行，否则在下一帧下行，默认为：true
         */
        asNewMsg?: boolean;

        /**
         * 等待消息名字，默认为：null
         * 说明：
         * 1. 该消息会在客户端上行与此名字一致的消息后再开始下行
         */
        waitName?: string;

        /**
         * 等待次数，不小于1，默认为：1
         * 说明：
         * 1. 该消息会在指定名字的消息上行达到指定次数时再开始下行
         */
        waitTimes?: number;
    }

    /**
     * 微服务器WebSocket协议包
     */
    interface IMSWSProtocalPacket extends IMSWSPacket {
        /**
         * 回复的消息名字，默认为：null
         */
        replyName?: string;

        /**
         * 下行重复次数，默认为：1
         */
        repeatTimes?: number;
    }

    /**
     * 微服务器WebSocket状态包
     */
    interface IMSWSStatePacket extends IMSWSPacket {
        /**
         * WebSocket状态
         */
        state: MSWSStateEnum;
    }

    /**
     * 微服务器
     * 说明：
     * 1. 此服务一旦实例化则自运运行且不可停止
     */
    class MicroService extends suncore.BaseService {

        protected $onRun(): void;

        protected $onStop(): void;
    }

    /**
     * 测试用例抽象类
     * 说明：
     * 1. 同一时间只会有一个测试用例被运行
     */
    abstract class TestCase extends puremvc.Notifier {
        /**
         * 测试用例编号
         */
        protected $caseId: number;

        /**
         * @caseId: 测试用例ID
         */
        constructor(caseId: number);

        /**
         * 新增测试用例
         * @regOption: 默认为：APPEND
         */
        protected $addTest(tcId: number, taskCls: new (tcId: number) => TestCase, regOption?: TestCaseRegOptionEnum): void;

        /**
         * 测试描述
         */
        protected $describe(str: string): void;

        /**
         * 在所有脚本执行以前
         */
        protected $beforeAll(): void;

        /**
         * 在所有脚本执行以后
         */
        protected $afterAll(): void;

        /**
         * 发射信号
         * @delay: 信号发射延时
         */
        protected $emit(id: number, args?: any, delay?: number): void;

        /**
         * 等待信号
         * @line: 是否进入队列，若为false，则必须指定handler，默认：true
         * @once: 是否只响应一次，若line为true，则once必然为true，默认为：true
         */
        protected $wait(id: number, handler: suncom.IHandler, line?: boolean, once?: boolean): void;

        /**
         * 点击按钮
         * 说明：
         * 1. 按钮的点击会延时500毫秒执行
         */
        protected $click(id: number): void;

        /**
         * 功能有二：
         * 1. 取消信号的监听
         * 2. 注销按钮的注册
         * 说明：
         * 1. 在队列中的信号监听无法取消
         */
        protected $cancel(id: number): void;

        /**
         * 序列化WebSocket状态数据包
         */
        protected $serializeWebSocketStatePacket(packet: suntdd.IMSWSStatePacket): void;

        /**
         * 序列化WebSocket协议数据包
         */
        protected $serializeWebSocketProtocalPacket(packet: suntdd.IMSWSProtocalPacket, data?: any, timeFields?: string[], hashFields?: string[]): void;
    }

    /**
     * 消息枚举
     */
    namespace NotifyKey {
        /**
         * 获取WebSocket连接信息 { out: IMSWSInfo }
         */
        const GET_WEBSOCKET_INFO: string;

        /**
         * 测试服务器连接状态 { state: MSWSStateEnum }
         */
        const TEST_WEBSOCKET_STATE: string;

        /**
         * 测试服务器协议数据 { data: any }
         */
        const TEST_WEBSOCKET_PROTOCAL: string;

        /**
         * 测试WebSocket上行协议 { name: number }
         */
        const TEST_WEBSOCKET_SEND_DATA: string;
    }

    /**
     * 测试类
     */
    namespace Test {

        /**
         * 发射信号
         * @delay: 信号发射延时
         */
        function emit(id: number, args?: any, delay?: number): void;

        /**
         * 注册按钮
         * @once: 是否为一次性的按钮，默认为：true
         * 说明：
         * 1. 通过 TestCase.cancel() 方法可以取消按钮的注册
         */
        function regButton(id: number, button: any, once?: boolean): void;
    }
}