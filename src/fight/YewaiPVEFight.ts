class YewaiPVEFight extends BaseFightScene implements IFightScene {
	private stageModels: ModelYewaiWave[];
	private curstageModel: ModelYewaiWave;
	private startWave: number;//起始关卡数
	private currPointIndex: number;//野外关卡内刷哪一个怪的编号
	private oldMapId: number;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_FIGHT_START_MSG.toString(), this.onReceiveFightMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_FIGHT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_JACKAROO_COMPLETE, this.onStartFight, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_FIGHT_START_MSG.toString(), this.onReceiveFightMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_FIGHT_RESULT_MSG.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_JACKAROO_COMPLETE, this.onStartFight, this);
	}
	/***-------------战斗逻辑处理---------------***/
	private onReceiveFightMsg(event: GameMessageEvent): void {
		var msg: Message = event.message;
		var isSuccess: boolean = msg.getBoolean();
		if (isSuccess) {
			this._status = FIGHT_STATUS.Fighting;
			var isYewaiBoss: boolean = msg.getByte() == 1;
			if (isYewaiBoss) {
				return;
			}
			this.onUpdateYewaiWave();
			/**野外PVP的出现敌人的点**/
			// let pkStageIdx: number = 0;
			// if (this.currPointIndex > this.startWave) {
			// 	pkStageIdx = this.currPointIndex + (Math.random() * 2 > 1 ? 1 : -1);
			// } else {
			// 	pkStageIdx = this.currPointIndex + 1;
			// }
			// let pkRushModel: ModelYewaiWave = this.yewaiwaveModels[pkStageIdx];
			// let posLen: number = pkRushModel.monterFightNodes.length;
			// GameFight.getInstance().zaoyuRebornNodeid = pkRushModel.monterFightNodes[Math.floor(Math.random() * posLen)];

			// var waveMonsterModel: RushEnemyData = this.rushData;
			// this.mainscene.getBodyManager().onRushMonster(waveMonsterModel, FightDefine.getXgDeathCount());
			let intervalTime: number = this.mainscene.heroBody.data.skillStampTime - egret.getTimer();
			Tool.callbackTime(this.onRushMonster, this, intervalTime > 0 ? intervalTime + 200 : 0);
		} else {
			Tool.log("receive message2001: PVE-Fight is Fail!");
			this.mainscene.gameworld.setAlertDisconnect(Language.ALERT_DISCONNECT_3);
		}
	}
	//请求战斗
	private onRequsetYewaiFight(): void {
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return;
		if (this.fightStatus == FIGHT_STATUS.Fighting || this.fightStatus == FIGHT_STATUS.Requset) {
			return;
		}
		this._status = FIGHT_STATUS.Requset;
		GameFight.getInstance().onSendCommonFightMsg(false);
	}
	//请求异常处理
	private onErrorHanlder(): void {
		this._status = FIGHT_STATUS.Result;
		Tool.callbackTime(this.onRequsetYewaiFight, this, 1000, false);
	}
	//刷怪
	private Rush_Monster_Ary: number[][] = [[3, 200], [3, 250], [3, 300]];//参数1：刷怪数量，参数2刷怪距离
	public onRushMonster(): void {
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return;
		let monsterBody: ActionBody;
		let deathNum: number = FightDefine.getXgDeathCount();
		let refreshPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this._rushData.refreshGrid);
		let randomPonit: egret.Point;

		this.mainscene.heroBody.onJump(refreshPoint, true);

		for (let i: number = 0; i < this.Rush_Monster_Ary.length; i++) {
			let rushNum: number = this.Rush_Monster_Ary[i][0];
			let rushDis: number = this.Rush_Monster_Ary[i][1];
			for (let num: number = 0; num < rushNum; num++) {
				monsterBody = BodyFactory.instance.createMonsterBody(this._rushData.monsterId, BODY_TYPE.MONSTER);
				monsterBody.direction = Direction.DOWN;
				//设置怪物几下被打死
				if (deathNum > 0) {
					monsterBody.setDeathCount(deathNum, deathNum);
				}
				//设置出生点
				randomPonit = Tool.randomPosByDistance(refreshPoint.x, refreshPoint.y, rushDis);
				this.mainscene.getBodyManager().addEmenyBodyToAry(monsterBody, randomPonit);
				//设置移动点
				let startX: number = randomPonit.x;
				let startY: number = randomPonit.y;
				let angle = (-(Math.atan2((refreshPoint.y - startY), (refreshPoint.x - startX))) * (180 / Math.PI));
				angle = angle < 0 ? 360 + angle : angle;
				randomPonit = Tool.getPosByRadiiAndAngle(startX, startY, angle, Tool.randomInt(100, 150));
				monsterBody.setWalkOn([randomPonit]);
				monsterBody.isDamageFalse = true;
				monsterBody.ignoreDist = true;
				//设置攻击目标
				monsterBody.onAddEnemyBodyList(this.mainscene.heroBodys);
			}
		}
	}
	//请求结果
	private _resultTime: number = 0;
	public onFinishFight(result: number): void {
		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			if (this._resultTime > egret.getTimer()) {
				this.onErrorHanlder();
				return;
			}
			if (this._status == FIGHT_STATUS.Requset || this._status == FIGHT_STATUS.Leave) {
				return;
			}
			if (this.mainscene.heroBody.data.targets.length > 0) {
				return;
			}
		}

		this._status = FIGHT_STATUS.Result;

		var resultFightMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_RESULT_MSG);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
		this._resultTime = egret.getTimer() + 3000;
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		let msg: Message = event.message;
		let result: number = msg.getByte();

		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.currPointIndex++;
			let totalNum: number = this.stageModels.length;
			let stageIdx: number = (this.currPointIndex + 1) % (2 * totalNum - 1);
			if (stageIdx == 0) {
				stageIdx = 1;
			} else if (stageIdx > totalNum) {
				stageIdx = 2 * totalNum - stageIdx;
			}
			stageIdx = stageIdx - 1;
			if (stageIdx == 0) {
				this.currPointIndex = 0;
			}
			this.curstageModel = this.stageModels[stageIdx];

			this.oldMapId = GameFight.getInstance().yewaiMapId;
			let oldWaveIndex: number = GameFight.getInstance().yewai_waveIndex;
			GameFight.getInstance().yewaiMapId = msg.getShort();
			GameFight.getInstance().yewai_waveIndex = msg.getShort();
			GameFight.getInstance().yewai_batch = msg.getByte();
			let dropitems: AwardItem[] = GameFight.getInstance().onParseDropItems(msg);
			this.mainscene.getBodyManager().onPlayDropEffect(dropitems);
			// if (!GameFight.getInstance().isGuideTask) {//杀死小怪飘动进度动画
			// 	this.mainscene.getModuleLayer().addKillAnimToView();
			// }

			var isAutofightBoss: boolean = false;
			if (this.rushData.progress <= GameFight.getInstance().yewai_batch && !GameFight.getInstance().isteamdupReady) {
				isAutofightBoss = GameSetting.getLocalSetting(GameSetting.YEWAI_AUTO_FIGHT);
			}
			if (this.fightStatus == FIGHT_STATUS.Result) {
				if (isAutofightBoss) {
					this.mainscene.onEnterYewaiBoss();
				} else {
					this.onRequsetYewaiFight();
				}
			}
		} else if (result == FightDefine.FIGHT_RESULT_FAIL) {
			if (this.mainscene.onCheckPlayerFail()) {
				var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.curstageModel.monterFightNodes[0]);
				this.mainscene.setHeroMapPostion(bornPoint);
			}
			this.onRequsetYewaiFight();
		}
	}
	//打开过关奖励面板
	private onShowWinPanel(dropitems: AwardItem[]): void {
		if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
			this.mainscene.getModuleLayer().onShowPassProceedsView();
			// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("YewaiFieldWinPanel", dropitems));
		}
	}
	//如果普通战斗没有打完的发个平局处理
	// private onStepYewaiFight(result: number = FightDefine.FIGHT_RESULT_TIE): void {


	// 	var heroBody: PlayerBody = this.mainscene.heroBody;
	// 	this.mainscene.getBodyManager().onDestroyAllHeroTarget();
	// }
	//收到服务器返回的附近玩家列表消息
	private onReceiveNearOhterMsg(): void {
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG.toString(), this.onReceiveNearOhterMsg, this);
		// this.onCreatePVPOtherPlayer();
	}
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk) {
			// super.onBodyHurtHanlder(attacker, hurtBody, damage);
		} else if (attacker.data.bodyType != BODY_TYPE.MONSTER && attacker.data.bodyType != BODY_TYPE.BOSS) {
			for (let i: number = 0; i < this.mainscene.getBodyManager().otherPlayerBodys.length; i++) {
				let otherbody: PlayerBody = this.mainscene.getBodyManager().otherPlayerBodys[i];
				for (let n: number = otherbody.data.targets.length - 1; n >= 0; n--) {
					let enemybody: ActionBody = otherbody.data.targets[n];
					enemybody.hp = enemybody.data.currentHp - 1;
					if (enemybody.data.isDie) {
						otherbody.onRemoveTarget(enemybody);
						BodyFactory.instance.onRecovery(enemybody);
					}
				}
				if (otherbody.data.targets.length == 0) {
					this.onRushOhterEmeny(otherbody);
				}
			}
		}
	}
	//刷出野外其他玩家
	private onCreatePVPOtherPlayer(): void {
		this.mainscene.getBodyManager().onDestroyOtherBodys();
		if (!this.curstageModel) return;
		try {
			let otherbody: PlayerBody;
			let mapinfo: MapInfo = this.mainscene.mapInfo;
			let yewaipvpData: YewaiPvPManager = DataManager.getInstance().yewaipvpManager;
			let length: number = 1;//Math.max(yewaipvpData.pvpfightterInfos.length, FightDefine.PVP_MAX_NUM - 1);
			for (let i: number = 0; i < length; i++) {
				let fightterData: OtherFightData = yewaipvpData.pvpfightterInfos[i];
				let otherPlayerData: RobotData;
				//随机生成一个假人出生点
				let randomMapNode: ModelMapNode = mapinfo.getNodeModelByIndex(this.curstageModel.monterFightNodes[this.curstageModel.monterFightNodes.length - 1]);
				if (!randomMapNode) break;
				let rebronNearNodeList: ModelMapNode[] = mapinfo.getGridNearByNode(randomMapNode, 2, 2);
				if (!rebronNearNodeList) break;
				if (fightterData && fightterData.appears) {
					//创建假人
					let randomAppearIndex: number = Math.floor(Math.random() * fightterData.appears.length);//三角色随机出来一个
					otherPlayerData = new RobotData(randomAppearIndex + 1, BODY_TYPE.PLAYER);
					otherPlayerData.playerId = fightterData.playerId;
					otherPlayerData.name = fightterData.playerName;
					otherPlayerData.onUpdateOnlyAppear(fightterData.appears[randomAppearIndex]);
					otherbody = this.mainscene.getBodyManager().onCreateOtherPlayer(otherPlayerData, rebronNearNodeList);
				} else {
					otherbody = this.mainscene.getBodyManager().onCreateFakerPlayerToSnece(0.7, 0.8, rebronNearNodeList);
					otherbody.data.playerId = -1;
				}
				otherbody.isDamageFalse = true;
				otherbody.onHideHeadBar(false);
				this.onRushOhterEmeny(otherbody);
			}
		} catch (e) {
			if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
				Tool.throwException("更新野外其他玩家出错！");
			}
		}
	}
	//为假人刷怪
	private onRushOhterEmeny(otherbody: PlayerBody): void {
		let randomMapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByXY(otherbody.x, otherbody.y);
		//给假人刷一只小怪在那假打
		let monsterId: number = this.monsterID;
		this.mainscene.getBodyManager().onCreateOhterEnemyList(otherbody, monsterId, 1, randomMapNode);
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		super.onEnterSuccessScene();
		//重置场景的刷怪信息
		this.startWave = 1;
		var mapDict = JsonModelManager.instance.getModelmap();
		for (var mapID in mapDict) {
			var _mapmodel: Modelmap = mapDict[mapID];
			if (_mapmodel.nextid == this.mainscene.mapInfo.mapId) {
				this.startWave = this.startWave + _mapmodel.boshu;
				break;
			}
		}
		if (!this.stageModels) {
			this.stageModels = [];
		} else {
			for (var i: number = this.stageModels.length - 1; i >= 0; i--) {
				this.stageModels[i] = null;
				this.stageModels.splice(i, 1);
			}
		}
		ModelManager.getInstance().parseXmlToModel(this.stageModels, ModelYewaiWave, this.mainscene.mapInfo.fightId + "_fight_xml");
		this.currPointIndex = 0;
		this.curstageModel = this.stageModels[this.currPointIndex];

		let bornPoint: egret.Point;
		if (GameFight.getInstance().isJackaroo) {
			bornPoint = this.mainscene.mapInfo.getXYByGridIndex(509);
			this.mainscene.setHeroMapPostion(bornPoint);
			this.mainscene.heroBody.onshoworhideShodow(false);
		} else {
			bornPoint = this.mainscene.mapInfo.getXYByGridIndex(this.curstageModel.monterFightNodes[0]);
			this.mainscene.setHeroMapPostion(bornPoint);
			this.onRequestPVPFightterInfoMsg();
		}
		// if (GameFight.getInstance().yewaiMapId == 2)
		// 	GameCommon.getInstance().onSendShowGuideEvent(GUIDE_TYPE.CLEARANCE_BOX);
	}
	//进入战斗
	protected onStartFight(): void {
		if (GameFight.getInstance().isJackaroo) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_YEWAI_FIGHT_UPDATE));
			GameFight.getInstance().onJackarooHandler();
		} else {
			this.onRequsetYewaiFight();
		}
		this.mainscene.getBodyManager().fightPause = false;
	}
	//加载列表
	protected onCraeteLoadRes(mapid): void {
		super.onCraeteLoadRes(mapid);
		// var backIndex: number = (mapid - 1) % 3;
		// this.lodingResList.push(`map_poetry${backIndex}_png`);
		// this.lodingResList.push(`map_name_${this.mainscene.mapInfo.mapResId}_png`);
	}
	//请求一下附近玩家的列表
	private onRequestPVPFightterInfoMsg(): void {
		// GameFight.getInstance().onRequstYewaiFightterInfoMsg();
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG.toString(), this.onReceiveNearOhterMsg, this);
	}
	public onDeath(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SET_AUTO_FIGHT), false);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("RevivePanel", null));
	}
	public onFightWin(): void {
		if (!GameFight.getInstance().onCheckStoyTalk()) {
			this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
		} else {
			GameFight.getInstance().isFightEndStory = true;
		}
	}
	public onFightLose(): void {
		this.mainscene.getBodyManager().onDestroyAllHeroTarget();
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		if (this._status == FIGHT_STATUS.Fighting) {
			this.onFinishFight(FightDefine.FIGHT_RESULT_TIE);
		}
	}
	public onQuitScene(): void {
	}
	/***属性接口***/
	private onUpdateYewaiWave(): void {
		this._rushData.progress = this.mapInfo.yewaiprogress;
		this._curMonsterID = this.monsterID;
		this._rushData.monsterId = this._curMonsterID;
		this._rushData.refreshGrid = this.curstageModel.monterFightNodes[0];
		for (let i: number = 0; i < FightDefine.PVE_MONSTER_NUM.length; i++) {
			let _waveNum: number = FightDefine.PVE_MONSTER_NUM[i][0];
			if (_waveNum >= GameFight.getInstance().yewaiMapId) {
				this._rushData.refreshNum = FightDefine.PVE_MONSTER_NUM[i][1];
				break;
			}
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_YEWAI_FIGHT_UPDATE));
	}
	//获取当前野外刷怪ID
	private _curMonsterID: number;//记录一下当前这波小怪的ID
	private get monsterID(): number {
		return FightDefine.PVE_MONSTER_COMID + (Math.floor((GameFight.getInstance().yewai_waveIndex - 1) / 5) % FightDefine.TOTAL_MONSTER_MODELNUM);
	}
	//The end
}