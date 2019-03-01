class YewaiBossFight extends BaseFightScene implements IFightScene {
	private oldMapId: number;
	private YEWAIBOSS_MAP_ID: number = 10018;
	private HERO_SHOW_NODE = 1207;
	private BOSS_SHOW_NODE = 840;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_FIGHT_START_MSG.toString(), this.onReceiveFightMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_FIGHT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_FIGHT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_FIGHT_START_MSG.toString(), this.onReceiveFightMsg, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(message: Message): void {
		super.onParseFightMsg(message);
		this.onUpdateYewaiWave();
		this.onSwitchMap(this.YEWAIBOSS_MAP_ID);
	}
	//请求结果
	public onFinishFight(result: number): void {
		this._status = FIGHT_STATUS.Result;

		var resultFightMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_RESULT_MSG);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		if (this._status != FIGHT_STATUS.Result) return;
		let msg: Message = event.message;
		let result: number = msg.getByte();

		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			GameFight.getInstance().yewaiMapId = msg.getShort();
			GameFight.getInstance().yewai_waveIndex = msg.getShort();
			GameFight.getInstance().yewai_batch = msg.getByte();
			let dropitems: AwardItem[] = GameFight.getInstance().onParseDropItems(msg);
			this.mainscene.getBodyManager().onPlayDropEffect(dropitems);
			Tool.callbackTime(this.onResultWinHandler, this, 1000, dropitems);
		} else if (result == FightDefine.FIGHT_RESULT_FAIL) {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(dropitems: AwardItem[]): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiFieldWinPanel", dropitems));
	}
	//失败处理
	private onResultLoseHandler(): void {
		this.mainscene.onReturnYewaiScene();
	}
	public onEnterSuccessScene(): void {
		var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.HERO_SHOW_NODE);
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	//进入战斗
	protected onStartFight(): void {
		GameFight.getInstance().onSendCommonFightMsg(true);
	}
	private onReceiveFightMsg(event: GameMessageEvent): void {
		var msg: Message = event.message;
		var isSuccess: boolean = msg.getBoolean();
		if (isSuccess) {
			this.mainscene.getBodyManager().fightPause = false;
			this._status = FIGHT_STATUS.Fighting;
			this.onUpdateYewaiWave();
			var monsterBody: ActionBody = BodyFactory.instance.createMonsterBody(this._rushData.monsterId, BODY_TYPE.BOSS);
			let refreshPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this._rushData.refreshGrid);
			monsterBody.direction = Direction.DOWN;
			this.mainscene.getBodyManager().addEmenyBodyToAry(monsterBody, refreshPoint);
		} else {
			this.mainscene.onReturnYewaiScene();
		}
	}
	public onDeath(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SET_AUTO_FIGHT), false);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("RevivePanel", null));
		this.onFightLose();
	}
	public onFightWin(): void {
		if (!GameFight.getInstance().onCheckStoyTalk()) {
			this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
		} else {
			GameFight.getInstance().isFightEndStory = true;
		}
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	private onCloseResultView(): void {
		this.mainscene.onReturnYewaiScene();
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
	}
	public onQuitScene(): void {
		this.onFightLose();
	}
	/***属性接口***/
	private onUpdateYewaiWave(): void {
		this._rushData.monsterId = FightDefine.PVE_BOSS_COMID + (GameFight.getInstance().yewai_waveIndex % FightDefine.PVE_BOSS_TOTALMODEL) + 1;
		this._rushData.refreshGrid = this.BOSS_SHOW_NODE;
		this._rushData.refreshNum = FightDefine.PVE_BOSS_NUM;
	}
	//The end
}