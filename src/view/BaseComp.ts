class BaseComp extends eui.Component implements eui.UIComponent {
	protected _data;
	protected _isRegist: number = -1;
	protected isLoaded: boolean = false;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.setSkinName();
	}
	// protected childrenCreated(): void {
	// 	super.childrenCreated();
	// 	this.onLoadComplete();
	// }
	private onLoadComplete(): void {
		this.isLoaded = true;
		this.onInit();
		if (this._isRegist == 0) {
			this.onRegist();
			this._isRegist = 1;
		}
		if (this._data) {
			this.dataChanged();
		}
	}
	protected setSkinName(): void {
	}
	protected onInit(): void {
	}
	protected onRegist(): void {
	}
	protected onRemove(): void {
	}
	protected dataChanged() {
	}
	public onShow(container: egret.DisplayObjectContainer): void {
		container.addChild(this);
		this._isRegist = 0;
		if (this.isLoaded) {
			this.onRegist();
			this._isRegist = 1;
			for (let i: number = 0; i < this.numChildren; i++) {
				let reloadObj = this.getChildAt(i);
				LoadManager.getInstance().reloadUIImageAndAnim(reloadObj);
			}
		}
	}
	public set data(source) {
		this._data = source;
		if (this.isLoaded) {
			this.dataChanged();
		}
	}
	public get data() {
		return this._data;
	}
	public onDestory(): void {
		if (this._isRegist == 1) {
			this.onRemove();
		}
		this._isRegist = -1;
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}