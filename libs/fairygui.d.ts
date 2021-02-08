
declare namespace fairygui {

    enum LoaderFillType {
        ScaleFree
    }

    class GRoot extends GComponent {
        static inst: GComponent;
    }

    class GObject {
        name: string;
        touchable: boolean;
        isDisposed: boolean;
        setSize(width: number, height: number): void;
        on(type: string, caller: any, method: Function, args?: any[]): void;
        off(type: string, caller: any, method: Function): void;
    }

    class GLoader extends GObject {
        url: string;
        fill: LoaderFillType;
        alpha: number;
        zOrder: number;
    }

    class GComponent extends GObject {
        name: string;
        parent: GComponent;
        readonly displayObject: Laya.Sprite;
        addChild(node: GObject): void;
        removeChild(node: GObject): void;
        dispose(): void;
    }

    namespace UIPackage {
        function loadPackage(url: string, complete: Laya.Handler, progress?: Laya.Handler): void;
        function removePackage(url: string): void;
    }
}