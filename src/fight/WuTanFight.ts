class WuTanFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private MapId: number = 10019;
	private Self_rebronNode: number = 225;
	private Enemy_rebronNode: number = 243;
	private fightResult: number;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		//GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		//GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		this.fightResult = msg.getByte();
		this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);
		super.onParseFightMsg(msg);
		this.onSwitchMap(this.MapId);
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		if (this.enemyDatas) {
			this.mainscene.getBodyManager().onInitAreraScene(this.enemyDatas, this.Self_rebronNode, this.Enemy_rebronNode);
		}
	}
	/**处理双方伤害的计算**/
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
	}
	//请求结果
	public onFinishFight(result: number): void {
		if (this._status == FIGHT_STATUS.Result)
			return;
		super.onFinishFight(result);
		if (this.fightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler();
		} else {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(): void {
		GameCommon.getInstance().addAlert("挑战成功");
		DataManager.getInstance().wuTanManager.setWuTanUp();
		Tool.callbackTime(function () {
			this.mainscene.onReturnYewaiScene();
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_WUTAN);
		}, this, 2000);
	}
	//失败处理
	private onResultLoseHandler(): void {
		//GameCommon.getInstance().addAlert("挑战失败");
		//this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupLosePanel", null));
	}
	/***-------------战斗逻辑结束---------------***/
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	public onDestroyScene(): void {
		this.enemyDatas = null;
		super.onDestroyScene();
	}
	/***属性接口***/
	//The end
}