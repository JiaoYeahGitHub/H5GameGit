class AlertReLogin extends eui.Component {
	private _gameworld: GameWorld;
	private viewmask: egret.Shape;

	public constructor(gameworld: GameWorld) {
		super();
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
			this.height = size.height;
		}
		this._gameworld = gameworld;
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);

		this.skinName = skins.AlertReloginSkin;

		this.viewmask = new egret.Shape();
		this.viewmask.touchEnabled = true;
		this.addChildAt(this.viewmask, 0);
	}
	private onComplete() {
	}
	public onShow(container: egret.DisplayObjectContainer): void {
		this.viewmask.graphics.clear();
		this.viewmask.graphics.beginFill(0, 0);
		this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, size.width + Globar_Pos.x, size.height);
		this.viewmask.graphics.endFill();

		if (!this.parent) {
			if (DataManager.IS_PC_Game) {
				this.x = Globar_Pos.x;
			}
			container.addChild(this);
			this._timeout = 10;
			Tool.addTimer(this.onTimer, this, 1000);
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_RELOGIN_EVENT));
		}
	}
	private _timeout: number;
	private onTimer(): void {
		if (this._timeout <= 0) {
			if (this.parent) {
				this.onClose();
				this._gameworld.setAlertDisconnect(Language.ALERT_DISCONNECT_1);
			} else {
				Tool.removeTimer(this.onTimer, this, 1000);
			}
		} else {
			this._timeout--;
		}
	}
	public onClose(): void {
		Tool.removeTimer(this.onTimer, this, 1000);
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
	//The end
}