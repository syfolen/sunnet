
declare module Laya {

	class Scene3D {

		static load(url: string, handler: Laya.Handler): void;

		destroy(): void;
	}

	class Prefab {

		json: any;

		create(): any;
	}
}