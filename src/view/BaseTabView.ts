//tab容器内显示对象
class BaseTabView extends eui.Component {
	protected owner: BaseSystemPanel;
	private onloadComp: boolean = false;
	protected points: redPoint[] = RedPointManager.createPoint(0);
	public constructor(owner: BaseSystemPanel) {
		super();
		this.owner = owner;
		this.once(eui.UIEvent.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	public getRegisterSystemParam(): RegisterSystemParam {
		return this.owner.getRegisterSystemParam();
	}
	//添加到舞台
	private onAddToStage(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LOADING_OPEN));
		this.onSkinName();
	}
	//设置皮肤
	protected onSkinName(): void {
	}
	//皮肤加载完成
	private onLoadComplete(): void {
		this.onloadComp = true;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LOADING_CLOSE));

		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}

		this.onInit();
		if (this.parent) {
			this.onRegist();
		}
	}
	public isOnloadComp(): boolean {
		return this.onloadComp;
	}
	//供子类覆盖
	protected onInit(): void {
	}
	protected onRefresh(): void {
	}
	protected onRegist(): void {
	}
	protected onRemove(): void {
	}
	public onShow(): void {
		if (this.onloadComp) {
			this.onRegist();
			this.onRefresh();
			// this.onReloadUIResource();
		}
	}
	// protected _ResIsDispose: boolean;
	// protected onReloadUIResource(): void {
	// 	if (this._ResIsDispose) {
	// 		this._ResIsDispose = false;
	// 		for (let i: number = 0; i < this.numChildren; i++) {
	// 			let reloadObj = this.getChildAt(i);
	// 			LoadManager.getInstance().reloadUIImageAndAnim(reloadObj);
	// 		}
	// 	}
	// }
	public onHide(): void {
		if (this.parent) {
			if (this.onloadComp) {
				this.onRemove();
			}
			this.parent.removeChild(this);
		}
		// this._ResIsDispose = true;
	}
	public createRedPoint() {
		var point: redPoint = new redPoint();
		this.points.push(point);
		return point;
	}
	public trigger(): void {
		if (this.onloadComp) {
			for (var i: number = 0; i < this.points.length; i++) {
				if (this.points[i].func) {
					this.points[i].checkPoint();
				}
			}
		}
	}
	public onChangeRole(): void {
	}
}