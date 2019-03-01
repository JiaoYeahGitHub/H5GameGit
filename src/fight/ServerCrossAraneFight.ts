class ServerCrossAraneFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private MapId: number = 10019;
	private Self_rebronNode: number = 62;
	private Enemy_rebronNode: number = 17;
	private oldRank: number;
	private newRank: number;
	private fightResult: number;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		this.fightResult = msg.getByte();
		this.oldRank = msg.getByte();
		this.newRank = msg.getByte();
		this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);
		GameFight.getInstance().fight_randomIndex = Math.abs(DataManager.getInstance().playerManager.player.id - this.enemyDatas[0].playerId) % RandomDefine.FIGHT_RANDOM.length;
		GameFight.getInstance().hero_randomIndex = DataManager.getInstance().playerManager.player.id % RandomDefine.FIGHT_RANDOM[GameFight.getInstance().fight_randomIndex].length;
		GameFight.getInstance().enemy_randomIndex = Math.max(0, this.enemyDatas[0].playerId) % RandomDefine.FIGHT_RANDOM[GameFight.getInstance().fight_randomIndex].length;
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
	//生物被打处理
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk) {
			var hurdEnemys: ActionBody[] = attacker.data.targets;
			if (hurdEnemys.indexOf(hurtBody) < 0) {
				return;
			}
			if (this.fightResult) return;
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
			if (!this.fightResult) return;
			if (hurtBody.data.isDie) {
				hurtBody.hp = 10;
				attacker.hp = 0;
				attacker.onDeath();
			}
		}
	}
	//请求结果
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		if (this.fightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler();
		} else {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(): void {
		var enemyInfo = {};
		let winnerAward: string = Constant.get(Constant.CROSSARENA_REWARD_POINT_SUCC);
		enemyInfo["award"] = GameCommon.getInstance().onParseAwardItemstr(winnerAward);
		enemyInfo["oldRank"] = this.oldRank;
		enemyInfo["newRank"] = this.newRank;
		Tool.callbackTime(function (param): void {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LocalArenaWinPanel", param));
		}, this, 1000, enemyInfo);
	}
	//失败处理
	private onResultLoseHandler(): void {
		let loserAward: string = Constant.get(Constant.CROSSARENA_REWARD_POINT_FAIL);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiPVPLosePanel", GameCommon.getInstance().onParseAwardItemstr(loserAward)));
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_SERVERFIGHT_ARENA);
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