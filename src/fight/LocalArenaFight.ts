class LocalArenaFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private MapId: number = 10019;
	private Self_rebronNode: number = 62;
	private Enemy_rebronNode: number = 17;
	private targetRank: number;
	private fightResult: number;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_FIGHT_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_FIGHT_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		this.targetRank = msg.getInt();
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
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		var msg: Message = event.message;
		var result: number = msg.getByte();
		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler(msg);
		} else if (result == FightDefine.FIGHT_RESULT_FAIL) {
			this.onResultLoseHandler();
		}
	}

	//请求结果
	public onFinishFight(result: number): void {
		if (this._status == FIGHT_STATUS.Result)
			return;
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.ARENE_FIGHT_RESULT_MESSAGE);
		resultFightMsg.setInt(this.targetRank);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);

		// super.onFinishFight(result);
		// if (GameFight.getInstance().heroServerFightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
		// 	this.onResultWinHandler();
		// } else {
		// 	this.onResultLoseHandler();
		// }
	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		var enemyInfo = {};

		let winnerAward: string = Constant.get(Constant.ARENA_REWARD_POINT_SUCC);
		enemyInfo["award"] = GameCommon.getInstance().onParseAwardItemstr(winnerAward);
		enemyInfo["oldRank"] = msg.getInt();
		enemyInfo["newRank"] = msg.getInt();
		Tool.callbackTime(function (param): void {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LocalArenaWinPanel", param));
		}, this, 1000, enemyInfo);
	}
	//失败处理
	private onResultLoseHandler(): void {
		let loserAward: string = Constant.get(Constant.ARENA_REWARD_POINT_FAIL);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiPVPLosePanel", GameCommon.getInstance().onParseAwardItemstr(loserAward)));
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_ARENA);
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