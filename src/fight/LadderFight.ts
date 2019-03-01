class LadderFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private Ladderarena_MapId: number = 10009;
	private Self_rebronNode: number = 62;
	private Enemy_rebronNode: number = 17;

	private currHeroHp: number = 0;//开战血量
	private resultHp: number = 0;//结算血量

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	public get ladderData(): LadderAreneData {
		return DataManager.getInstance().arenaManager.ladderArenaData;
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);

		this.currHeroHp = this.ladderData.heroHpNum;
		this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);
		if (this.enemyDatas[0].bodyType == BODY_TYPE.PLAYER) {
			this.resultHp = msg.getLong();
		} else if (this.enemyDatas[0].bodyType == BODY_TYPE.ROBOT) {
			this.resultHp = this.currHeroHp;
		}
		this.mainscene.getBodyManager().fightPause = true;
		GameDispatcher.getInstance().addEventListener(GameEvent.LADDER_FIGHT_START_EVENT, this.onEnterLadderMap, this);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LadderReadyPanel", this.enemyDatas[0]));
	}
	private onEnterLadderMap(): void {
		GameDispatcher.getInstance().removeEventListener(GameEvent.LADDER_FIGHT_START_EVENT, this.onEnterLadderMap, this);
		this.onSwitchMap(this.Ladderarena_MapId);
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		this.mainscene.heroBody.hp = this.currHeroHp;
		if (this.enemyDatas) {
			this.mainscene.getBodyManager().onInitAreraScene(this.enemyDatas, this.Self_rebronNode, this.Enemy_rebronNode);
			this.mainscene.heroBody.data.shieldValue = this.ladderData.heroShieldNum;
			this.mainscene.heroBody.data.reborncount = this.ladderData.heroRebornNum;
		}
	}
	//请求结果
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_RESULT_MESSAGE);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		var resultParam = null;
		var msg: Message = event.message;
		var fightResult: number = msg.getByte();

		if (fightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler(msg);
		} else {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		Tool.callbackTime(this.onShowWinPanel, this, 1000, msg);
	}
	private onShowWinPanel(msg: Message): void {
		let oldscore: number = msg.getByte();
		let contiuneWin: number = msg.getInt();
		let ladderParam: LadderArenaParam = new LadderArenaParam();
		ladderParam.result = FightDefine.FIGHT_RESULT_SUCCESS;
		ladderParam.hpValue = this.resultHp;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ArenaWinPanel", ladderParam));
	}
	//失败处理
	private onResultLoseHandler(): void {
		// let awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(data.model.winreward);
		let ladderParam: LadderArenaParam = new LadderArenaParam();
		// ladderParam.dropList = awards;
		ladderParam.result = FightDefine.FIGHT_RESULT_FAIL;
		ladderParam.hpValue = this.resultHp;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ArenaWinPanel", ladderParam));
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DupLosePanel");
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_LADDER);
	}
	//生物被打处理
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk) {
			var hurdEnemys: ActionBody[] = attacker.data.targets;
			if (hurdEnemys.indexOf(hurtBody) < 0) {
				return;
			}
			let isPlayerWin: boolean = this.resultHp > 0;
			if (isPlayerWin) return;
			let isDie: boolean = true;
			for (let i: number = 0; i < attacker.data.targets.length; i++) {
				if (!attacker.data.targets[i].data.isDie) {
					isDie = false;
					break;
				}
			}
			if (isDie) {
				hurtBody.hp = 10;
				attacker.hp = 0;
				attacker.onDeath();
			}
		} else if (hurtBody.data.bodyType == BODY_TYPE.SELF) {
			let isPlayerWin: boolean = this.resultHp > 0;
			if (!isPlayerWin) return;
			if (hurtBody.data.isDie) {
				hurtBody.hp = this.resultHp;
				attacker.hp = 0;
				attacker.onDeath();
			}
		}
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