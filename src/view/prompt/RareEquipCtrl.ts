class RareEquipCtrl extends eui.Component {
	private isPlay: boolean = false;
	private _queue: egret.DisplayObject[] = [];
	private _grp: eui.Group;
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(event: egret.Event): void {
		var a: eui.LayoutBase = new eui.LayoutBase();
		a.useVirtualLayout = true;
		this._grp = new eui.Group();
		this._grp.layout = a;
		this._grp.bottom = 352;
		this.addChild(this._grp);
	}
	public push(base: egret.DisplayObject): void {
		if (!this.isPlay) {
			this.isPlay = true;
			this.onDisappear(base);
		} else {
			this._queue.push(base);
		}

	}
	public play(): void {
		var a = this._queue.shift();
		if (a) {
			this.onDisappear(a)
		} else {
			this.isPlay = false;
		}
	}
	public onDisappear(a): void {
		a.y = 1100;
		a.x = (GameDefine.GAME_STAGE_WIDTH - 470) / 2;
		this.addChild(a);
		egret.Tween.get(a).to({ y: 800 }, 500, egret.Ease.sineIn).call(this.onBackFunc0, this, [a]).to({ alpha: 1 }, 1000, egret.Ease.sineInOut).call(this.onBackFunc, this, [a]);
	}
	public onBackFunc0(param): void {
		this.play();
	}

	public onBackFunc(param): void {
		if (param.parent) {
			param.parent.removeChild(param);
			param = null;
		}
	}
}