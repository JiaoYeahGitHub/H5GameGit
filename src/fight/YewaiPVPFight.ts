class YewaiPVPFight extends BaseFightScene implements IFightScene {
	// private otherPkBody: PlayerBody;
	private enemyDatas: PlayerData[];
	private MapId: number = 10019;
	private Self_rebronNode: number = 62;
	private Enemy_rebronNode: number = 17;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);
		let isSuccess: boolean = msg.getBoolean();
		if (isSuccess) {
			this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);
		} else {
			this.mainscene.onReturnYewaiScene();
		}

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
	/**上行战斗结果**/
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		var pkResultMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG);
		pkResultMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(pkResultMsg);
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		let resultMsg: Message = event.message;
		let fightResult: number = resultMsg.getByte();
		let expNum: number = resultMsg.getInt();
		let prestigeNum: number = resultMsg.getByte();
		let rewardItems: AwardItem[];
		if (fightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
			rewardItems = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.FIELD_PVP_REWARD_SUCC));
		} else {
			rewardItems = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.FIELD_PVP_REWARD_FAIL));
		}
		rewardItems.push(new AwardItem(GOODS_TYPE.EXP, 0, expNum));
		rewardItems.push(new AwardItem(GOODS_TYPE.SHOW, 0, prestigeNum));
		//装备奖励
		let equipsize: number = resultMsg.getByte();
		for (let i: number = 0; i < equipsize; i++) {
			var equipId: number = resultMsg.getShort();
			var equipQulity: number = resultMsg.getByte();
			let equipItem: AwardItem = new AwardItem(GOODS_TYPE.MASTER_EQUIP, equipId, 1, equipQulity);
			rewardItems.push(equipItem);
		}

		if (fightResult > 0) {
			this.onResultWinHandler(rewardItems);
		} else {
			this.onResultLoseHandler(rewardItems);
		}
	}
	//胜利处理
	private onResultWinHandler(rewardItems: AwardItem[]): void {
		this.mainscene.getBodyManager().onPlayDropEffect(rewardItems);
		Tool.callbackTime(function () {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiFieldWinPanel", rewardItems));
		}, this, 2000);
	}
	//失败处理
	private onResultLoseHandler(rewardItems: AwardItem[]): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiPVPLosePanel", rewardItems));
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_YEWAIPVP);
	}
	// public onInitScene(scenetype: FIGHT_SCENE): void {
	// 	this._scenetype = scenetype;
	// 	this.registFightMessage();
	// 	this.mainscene.onResetAllHeroBody();
	// 	this.mainscene.getModuleLayer().onRefreshScene();
	// }
	// //加载资源
	// public onLoadingSceneRes(mapid: number): void {
	// }
	// //切换地图
	// public onSwitchMap(mapid: number): void {
	// }
	// protected registFightMessage(): void {
	// 	super.registFightMessage();
	// 	GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG.toString(), this.onResFightResult, this);
	// }
	// protected removeFightMessage(): void {
	// 	super.removeFightMessage();
	// 	GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG.toString(), this.onResFightResult, this);
	// }
	// /***-------------战斗逻辑处理---------------***/
	// public onParseFightMsg(msg: Message): void {
	// 	super.onParseFightMsg(msg);
	// 	let isSuccess: boolean = msg.getBoolean();
	// 	if (isSuccess) {
	// 		this._status = FIGHT_STATUS.Fighting;
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SCENE_ENTER_SUCCESS));
	// 		let yewaipvpData: YewaiPvPManager = DataManager.getInstance().yewaipvpManager;
	// 		let heroBody: PlayerBody = this.mainscene.heroBody;
	// 		if (heroBody.data.targets.length != 0) {
	// 			this.mainscene.getBodyManager().onDestroyAllHeroTarget();
	// 			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_EARTHQUAKE_STRAT));
	// 		}

	// 		let fightterData: PlayerData = GameFight.getInstance().onParsePVPEnemyMsg(msg)[0];
	// 		if (fightterData.bodyType == BODY_TYPE.ROBOT) {
	// 			fightterData.sex = fightterData.figthPower % 2;
	// 		}

	// 		for (let i: number = 0; i < yewaipvpData.pvpfightterInfos.length; i++) {
	// 			if (yewaipvpData.pvpfightterInfos[i].playerName == fightterData.name) {
	// 				fightterData.coatardLv = yewaipvpData.pvpfightterInfos[i].reinLv;
	// 				break;
	// 			}
	// 		}
	// 		let randomMapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(GameFight.getInstance().zaoyuRebornNodeid);
	// 		if (!randomMapNode) {
	// 			randomMapNode = this.mainscene.mapInfo.getNodeModelByXY(heroBody.x, heroBody.y);
	// 		}
	// 		let rebronNearNodeList: ModelMapNode[] = this.mainscene.mapInfo.getGridNearByNode(randomMapNode, 3, 3);
	// 		this.otherPkBody = this.mainscene.getBodyManager().onCreateOtherPlayer(fightterData, rebronNearNodeList);
	// 		this.otherPkBody.onHideHeadBar(true);
	// 		// if (!this.otherPkBody) {
	// 		// 	let randomMapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByXY(heroBody.x, heroBody.y);
	// 		// 	let rebronNearNodeList: ModelMapNode[] = this.mainscene.mapInfo.getGridNearByNode(randomMapNode, 3, 3);
	// 		// 	this.otherPkBody = this.mainscene.getBodyManager().onCreateOtherPlayer(fightterData, rebronNearNodeList);
	// 		// } else {
	// 		// 	this.mainscene.getBodyManager().onRemoveAllOtherTarget(this.otherPkBody);
	// 		// 	this.otherPkBody.data = fightterData;
	// 		// }
	// 		this.mainscene.getBodyManager().addEmenyBodyToAry(this.otherPkBody);

	// 		this.onEnterSuccessScene();
	// 	} else {
	// 		this.mainscene.onReturnYewaiScene();
	// 	}
	// }
	// //请求结果
	// public onFinishFight(result: number): void {
	// 	super.onFinishFight(result);
	// 	var pkResultMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG);
	// 	pkResultMsg.setByte(result);
	// 	GameCommon.getInstance().sendMsgToServer(pkResultMsg);
	// }
	// //战斗结果返回
	// private onResFightResult(event: GameMessageEvent): void {
	// 	var resultMsg: Message = event.message;
	// 	var fightResult: number = resultMsg.getByte();
	// 	var stoneNum: number = resultMsg.getByte();
	// 	var expNum: number = resultMsg.getInt();
	// 	var goldNum: number = resultMsg.getInt();
	// 	var prestigeNum: number = resultMsg.getByte();
	// 	var equips: number[][] = [];
	// 	var equipsize: number = resultMsg.getByte();
	// 	for (var i: number = 0; i < equipsize; i++) {
	// 		var equipAry: number[] = [];
	// 		equipAry[0] = resultMsg.getShort();
	// 		equipAry[1] = resultMsg.getByte();
	// 		equips.push(equipAry);
	// 	}
	// 	var rewardItems: AwardItem[] = DataManager.getInstance().yewaipvpManager.getPVPAwardList(stoneNum, expNum, goldNum, prestigeNum, equips);
	// 	if (fightResult > 0) {
	// 		this.onResultWinHandler(rewardItems);
	// 	} else {
	// 		this.onResultLoseHandler(rewardItems);
	// 	}
	// 	// this.mainscene.getBodyManager().onDestroyOtherBodys();
	// }
	// //胜利处理
	// private onResultWinHandler(rewardItems: AwardItem[]): void {
	// 	this.mainscene.getBodyManager().onPlayDropEffect(rewardItems);
	// 	Tool.callbackTime(function () {
	// 		this.mainscene.onReturnYewaiScene();
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiFieldWinPanel", rewardItems));
	// 	}, this, 2000);
	// }
	// //失败处理
	// private onResultLoseHandler(rewardItems: AwardItem[]): void {
	// 	this.mainscene.onReturnYewaiScene();
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiPVPLosePanel", rewardItems));
	// }
	// //生物被打处理
	// public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
	// 	let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
	// 	if (hurtBody === this.otherPkBody && isHeroAtk) {
	// 		if (!hurtBody.currTarget || hurtBody.data.targets.indexOf(attacker) < 0) {
	// 			this.mainscene.getBodyManager().onRemoveAllOtherTarget(this.otherPkBody);
	// 			hurtBody.onAddEnemyBodyList(this.mainscene.heroBodys);
	// 			hurtBody.currTarget = attacker;
	// 			hurtBody.isDamageFalse = false;
	// 		}
	// 	} else if (attacker === this.otherPkBody) {
	// 		for (let i: number = 0; i < this.mainscene.getBodyManager().otherPlayerBodys.length; i++) {
	// 			let otherbody: PlayerBody = this.mainscene.getBodyManager().otherPlayerBodys[i];
	// 			if (otherbody.currTarget && otherbody.currTarget === this.mainscene.heroBody) continue;
	// 			for (let n: number = otherbody.data.targets.length - 1; n >= 0; n--) {
	// 				let enemybody: ActionBody = otherbody.data.targets[n];
	// 				enemybody.hp = enemybody.data.currentHp - 1;
	// 				if (enemybody.data.isDie) {
	// 					otherbody.onRemoveTarget(enemybody);
	// 					BodyFactory.instance.onRecovery(enemybody);
	// 				}
	// 			}
	// 			if (otherbody.data.targets.length == 0) {
	// 				this.onRushOhterEmeny(otherbody);
	// 			}
	// 		}
	// 	}
	// }
	// //为假人刷怪
	// private onRushOhterEmeny(otherbody: PlayerBody): void {
	// 	let randomMapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByXY(otherbody.x, otherbody.y);
	// 	// otherbody.isDamageFalse = true;
	// 	//给假人刷一只小怪在那假打
	// 	let monsterId: number = FightDefine.PVE_MONSTER_COMID + ((GameFight.getInstance().yewai_waveIndex - 1) % FightDefine.TOTAL_MONSTER_MODELNUM);
	// 	this.mainscene.getBodyManager().onCreateOhterEnemyList(otherbody, monsterId, 1, randomMapNode);
	// }
	// /***-------------战斗逻辑结束---------------***/
	// public onEnterSuccessScene(): void {
	// 	this.mainscene.getModuleLayer().removeAllWindows();
	// 	this.mainscene.getBodyManager().fightPause = false;
	// }
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	public onQuitScene(): void {
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		this.mainscene.getBodyManager().onDestroyAllHeroTarget();
		// this.otherPkBody = null;
	}
	/***属性接口***/
}