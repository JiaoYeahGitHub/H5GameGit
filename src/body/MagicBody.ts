class MagicBody extends BaseBody {
	private _body: BodyAnimation;
	private _data: PlayerData;
	private _action: ACTION;

	private MOVING_TIME: number = 800;

	public constructor() {
		super();
		this._action = ACTION.STAND;
	}
	//角色数据
	public set data(data: PlayerData) {
		this._data = data;
		this.onChangeBody();
	}
	//更换人物模型
	private onChangeBody(): void {
		if (this._data && this._data.magic_res) {
			let resName: string;
			let playNum: number = -1;
			switch (this._action) {
				case ACTION.ATTACK:
					playNum = 1;
					resName = LoadManager.getInstance().getMagicResUrl(this._data.magic_res, "attack");
					break;
				default:
					resName = LoadManager.getInstance().getMagicResUrl(this._data.magic_res, "");
					break;
			}
			if (!this._body) {
				this._body = new BodyAnimation(resName, playNum, null);
				this._body.scaleX = this._body.scaleY = 0.7;
				this.addChild(this._body);
			} else {
				this._body.onUpdateRes(resName, playNum, null);
			}
			if (playNum > 0) {
				this._body.playFinishCallBack(this.bodyPlayFinish, this);
			}
		} else {
			if (this._body) {
				this._body.onDestroy();
				this._body = null;
			}
		}
	}
	private bodyPlayFinish(): void {
		if (this._action == ACTION.ATTACK) {
			this._action = ACTION.STAND;
			this.onChangeBody();
		}
	}
	//更新移动
	public setRandomMove(randomPos: egret.Point): void {
		if (this._action == ACTION.ATTACK) return;
		this.setMovePoint([randomPos]);
		this.moveSpeed = GameDefine.MAGIC_Move_Speed;
	}
	private _followDist: number = 0;
	private _followTotalTime: number = 0;
	private _followTime: number = 0;
	public setFollowPaths(pointPath: egret.Point) {
		this.setMovePoint([pointPath]);
		let distance: number = this.getDistToTarget();
		this._followTotalTime = Math.ceil(distance / this.MOVING_TIME);
		this._followTime = 0;
		this._followDist = this.getDistToTarget();
	}
	public onStop(): void {
		this.stopMove();
	}
	//终止移动
	protected stopMove() {
		super.stopMove();
		this._followTime = 0;
		this._followTotalTime = 0;
	}
	public onAttack(): void {
		this._action = ACTION.ATTACK;
		this.onChangeBody();
		let movePoint: egret.Point = this.movePaths && this.movePaths.length > 0 ? this.movePaths[this.movePaths.length - 1] : this.moveTarget;
		if (movePoint) {
			this.x = movePoint.x;
			this.y = movePoint.y;
			this.onStop();
		}
	}
	public onMove(): void {
		let dt: number = 40;
		if (this._followTotalTime > 0 && this._followDist > 0) {//匀减速
			this._followTime = Math.min(this._followTotalTime, this._followTime + dt);
			this.moveSpeed = this._followDist / this._followTime;
		}
		super.logicMove(dt);
	}
	public get isMoving(): boolean {
		return this.isMove();
	}
	public refreshBodyHeight(offY: number): void {
		if (this._body) {
			this._body.y = offY - this._data.model.high - 30;
		}
	}
	public set bodyVisible(bool: boolean) {
		if (this._body) {
			this._body.visible = bool;
		}
	}
	public onDestroy(): void {
		if (this._body) {
			this._body.onDestroy();
			this._body = null;
		}
	}
	//The end
}