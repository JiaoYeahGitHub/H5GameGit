class AllPeopleBossFight extends BaseFightScene implements IFightScene {
	private RANK_SHOW_NUM: number = 4;
	private fightOhterData: BossDamageParam;//请求战斗的数据对象
	private fightInfos;//战斗信息

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameDispatcher.getInstance().addEventListener(GameEvent.OTHERBODY_ENTER_SCENE, this.onResAddOtherFightBodyMsg, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_BOSS_RESULT_MSG.toString(), this.onResFightResult, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_PK_MESSAGE.toString(), this.onResOtherPKMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_PVP_REVIVE.toString(), this.onResReborn, this);
			this.fight_info_bar['snatch_btn'].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSnatch, this);
		} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_RESULT_MSG.toString(), this.onResFightResult, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_OTHERPK_MSG.toString(), this.onResOtherPKMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_REBORN_MSG.toString(), this.onResReborn, this);
			this.fight_info_bar['snatch_btn'].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSnatch, this);
		} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPBOSS_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPBOSS_RESULT_MSG.toString(), this.onResFightResult, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPBOSS_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPBOSS_OTHERPK_MSG.toString(), this.onResOtherPKMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPBOSS_REBORN_MSG.toString(), this.onResReborn, this);
			this.fight_info_bar['snatch_btn'].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSnatch, this);
		} else if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_PILL_TOP_MESSAGE.toString(), this.onResRankMsg, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_PILL_REWARD_MESSAGE.toString(), this.onResFightResult, this);
			GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_PILL_FIGHT_MESSAGE.toString(), this.onXianShanResFightUpdateMsg, this);

		}
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameDispatcher.getInstance().removeEventListener(GameEvent.OTHERBODY_ENTER_SCENE, this.onResAddOtherFightBodyMsg, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_BOSS_RESULT_MSG.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_RESULT_MSG.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_OTHERPK_MSG.toString(), this.onResOtherPKMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_REBORN_MSG.toString(), this.onResReborn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_PK_MESSAGE.toString(), this.onResOtherPKMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_PVP_REVIVE.toString(), this.onResReborn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPBOSS_FIGHT_UPDATE_MSG.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPBOSS_RESULT_MSG.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPBOSS_RANK_INFO_MSG.toString(), this.onResRankMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPBOSS_OTHERPK_MSG.toString(), this.onResOtherPKMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPBOSS_REBORN_MSG.toString(), this.onResReborn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_PILL_FIGHT_MESSAGE.toString(), this.onXianShanResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_PILL_REWARD_MESSAGE.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_PILL_TOP_MESSAGE.toString(), this.onResRankMsg, this);
		this.fight_info_bar['snatch_btn'].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSnatch, this);
	}
	/***-------------战斗逻辑处理---------------***/
	private currBossHp: number = 0;
	private beforeBossHp: number = 0;
	private curXianShanId: number = 0;
	private xsBossId: number = 0;
	public onParseFightMsg(enterMsg: Message): void {
		super.onParseFightMsg(enterMsg);
		if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			this.curXianShanId = enterMsg.getInt();
			let xianShanBossId: number = enterMsg.getShort();
			this.currBossHp = enterMsg.getLong();
			GameFight.getInstance().allpeopleBossId = xianShanBossId;
			let xianShanCfg: Modelxianshanzhaohuan = JsonModelManager.instance.getModelxianshanzhaohuan()[xianShanBossId];
			this.xsBossId = xianShanCfg.modelId;
			this.mainscene.getModuleLayer().showorhideDupRebornBar(true);
			this.beforeBossHp = this.currBossHp;
			this.onSwitchMap(xianShanCfg.map);
			return;
		}
		let bossid: number = enterMsg.getShort();
		GameFight.getInstance().allpeopleBossId = bossid;
		this.currBossHp = enterMsg.getLong();
		this.beforeBossHp = this.currBossHp;
		let mapId: number = 0;
		if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
			let allpeoplebossModel: Modelquanminboss = JsonModelManager.instance.getModelquanminboss()[bossid];
			mapId = allpeoplebossModel.map;
			this.mainscene.getModuleLayer().showorhideDupRebornBar(true);
		} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
			let xuezhanbossModel: Modelxuezhanboss = JsonModelManager.instance.getModelxuezhanboss()[bossid];
			mapId = xuezhanbossModel.map;
			this.mainscene.getModuleLayer().showorhideDupRebornBar(true);
		} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			let vipbossModel: Modelvipboss = JsonModelManager.instance.getModelvipboss()[bossid];
			mapId = vipbossModel.map;
			this.mainscene.getModuleLayer().showorhideDupRebornBar(true);
		}

		this.onSwitchMap(mapId);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.AllPeopleInfoBarSkin;
			if (DataManager.IS_PC_Game) {
				this.fight_info_bar.x = Globar_Pos.x;
			} else {
				this.fight_info_bar.width = size.width;
			}
			this.fight_info_bar.y = size.height - 200;
		}
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	//开始战斗
	private monsterBody: MonsterBody;
	protected onStartFight(): void {
		super.onStartFight();
		this.fightInfos = {};
		this.mainscene.heroBody.isDamageFalse = true;
		let dataInfo: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
		let bossmodelId: number = 0;
		let showawarditem: AwardItem;
		if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
			this.fight_info_bar.currentState = 'pk';
			let allpeoplebossModel: Modelquanminboss = JsonModelManager.instance.getModelquanminboss()[GameFight.getInstance().allpeopleBossId];
			bossmodelId = allpeoplebossModel.modelId;
			//初始化信息界面
			showawarditem = allpeoplebossModel.rewards[0];
		} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
			this.fight_info_bar.currentState = 'pk';
			let info: XuezhanBossInfo;
			for (let index in dataInfo.xuezhanInfos) {
				info = dataInfo.xuezhanInfos[index];
				if (info.id == GameFight.getInstance().allpeopleBossId) {
					bossmodelId = info.bossID;
					break;
				}
			}
			showawarditem = info.model.rewards[0];
		} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			this.fight_info_bar.currentState = 'pk';
			let info: VipBossInfo = dataInfo.vipbossInfos[GameFight.getInstance().allpeopleBossId];
			bossmodelId = info.model.modelId;
			showawarditem = info.model.rewards[0];
		}
		else if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			this.fight_info_bar.currentState = 'xianshan';
			let info: XianShanBossInfo;
			for (let index in dataInfo.xianshanInfos) {
				info = dataInfo.xianshanInfos[index];
				if (info.id == GameFight.getInstance().allpeopleBossId) {
					bossmodelId = this.xsBossId;
					break;
				}
			}
			showawarditem = info.model.rewards[0];
		}
		(this.fight_info_bar['other_probar'] as eui.ProgressBar).slideDuration = 0;
		this.fight_info_bar['other_probar'].maximum = 100;
		(this.fight_info_bar['show_award_icon'] as GoodsInstance).onUpdate(showawarditem.type, showawarditem.id, 0, showawarditem.quality, showawarditem.num);

		let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		this.monsterBody = this.mainscene.getBodyManager().onCreateMapBody(bossmodelId, [mapNode], BODY_TYPE.BOSS) as MonsterBody;
		this.monsterBody.isDamageFalse = true;
		this.monsterBody.ignoreDist = true;
		this.monsterBody.onClearTargets();
		if (GameFight.getInstance().allpeopleOtherMsg) {
			let bodysize: number = GameFight.getInstance().allpeopleOtherMsg.getByte();
			for (let i: number = 0; i < bodysize; i++) {
				let otherData: OtherFightData = DataManager.getInstance().dupManager.allpeoplebossData.addOtherFightData(GameFight.getInstance().allpeopleOtherMsg);
				this.onCreateOtherFightBody(otherData, this.mainscene.mapInfo.getGridNearByNode(mapNode, 1, 1));
			}
		} else {
			for (let i: number = 0; i < DataManager.getInstance().dupManager.allpeoplebossData.otherFightDatas.length; i++) {
				this.onCreateOtherFightBody(DataManager.getInstance().dupManager.allpeoplebossData.otherFightDatas[i], this.mainscene.mapInfo.getGridNearByNode(mapNode, 1, 1));
			}
		}
		this.monsterBody.hp = this.currBossHp;
		Tool.addTimer(this.onTimerDown, this, this.timerRunTime);
		this.mainscene.getModuleLayer().onShowBossHpBar(this.monsterBody.data);
		GameFight.getInstance().allpeopleOtherMsg = null;
	}
	//服务器返回战斗轮询协议
	private onXianShanResFightUpdateMsg(messageEvenet: GameMessageEvent): void {
		let message: Message = messageEvenet.message;
		let bossid: number = message.getInt();
		this.beforeBossHp = Math.max(0, this.currBossHp - this.currDamageNum);
		this.monsterBody.hp = this.beforeBossHp;
		this._status = FIGHT_STATUS.Fighting;
		this.currBossHp = message.getLong();
		this.currDamageNum = 0;
		if (this.beforeBossHp <= 0) {
			this.mainscene.getBodyManager().fightPause = true;
			this.mainscene.getModuleLayer().onUpdateBossHpBar(0, this.monsterBody.data.maxHp);
		}
	}
	//服务器返回战斗轮询协议
	private onResFightUpdateMsg(messageEvenet: GameMessageEvent): void {
		let message: Message = messageEvenet.message;
		let bossid: number = message.getShort();
		this.beforeBossHp = Math.max(0, this.currBossHp - this.currDamageNum);
		this.monsterBody.hp = this.beforeBossHp;
		this._status = FIGHT_STATUS.Fighting;
		this.currBossHp = message.getLong();
		this.currDamageNum = 0;
		if (this.beforeBossHp <= 0) {
			this.mainscene.getBodyManager().fightPause = true;
			this.mainscene.getModuleLayer().onUpdateBossHpBar(0, this.monsterBody.data.maxHp);
		}
	}
	//服务器返回场景添加其他玩家协议
	private onResAddOtherFightBodyMsg(event: egret.Event): void {
		var otherData: OtherFightData = event.data as OtherFightData;
		if (otherData) {
			this.onCreateOtherFightBody(otherData, [this.getRandomRebornNode()]);
		}
	}
	//添加其他玩家
	private onCreateOtherFightBody(otherFightData: OtherFightData, rebronNearNodeList: ModelMapNode[]): void {
		if (this.getOhterBodysById(otherFightData.playerId).length > 0)
			return;
		let bodys: PlayerBody[] = [];
		for (let i: number = 0; i < otherFightData.appears.length; i++) {
			let otherPlayerData: RobotData = new RobotData(i + 1, BODY_TYPE.PLAYER);
			otherPlayerData.playerId = otherFightData.playerId;
			otherPlayerData.name = otherFightData.playerName;
			otherPlayerData.coatardLv = otherFightData.reinLv;
			otherPlayerData.onUpdateOnlyAppear(otherFightData.appears[i]);
			let otherbody: PlayerBody = this.mainscene.getBodyManager().onCreateOtherPlayer(otherPlayerData, rebronNearNodeList);
			if (otherbody) {
				otherbody.isDamageFalse = true;
				otherbody.onAddEnemyBodyList([this.monsterBody]);
				otherbody.onShowOrHideHpBar(false);
				this.monsterBody.onAddEnemyBodyList([otherbody]);
			}
		}
	}
	//接收到PK的消息
	private onResOtherPKMsg(messageEvenet: GameMessageEvent): void {
		let heroData: PlayerData = this.mainscene.heroBody.data;
		if (heroData.isDie) return;

		let message: Message = messageEvenet.message;
		let bossid: number = message.getShort();
		let atkerFightInfo: AllPeoplePKInfo = new AllPeoplePKInfo();
		atkerFightInfo.parseInfo(message);
		let deferFightInfo: AllPeoplePKInfo = new AllPeoplePKInfo();
		deferFightInfo.parseInfo(message);
		this.fightInfos[atkerFightInfo.playerId + "vs" + deferFightInfo.playerId] = atkerFightInfo;
		this.fightInfos[deferFightInfo.playerId + "vs" + atkerFightInfo.playerId] = deferFightInfo;
		let playerdata: PlayerData = GameFight.getInstance().onParsePVPEnemyMsg(message, false)[0];
		//创建PK对手实例
		let otherPKBody: PlayerBody = this.getOhterBodysById(playerdata.playerId)[0];
		if (!otherPKBody) {
			otherPKBody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [this.getRandomRebornNode()]);
			otherPKBody.data.hasArtifactEft = true;
		} else {
			if (!otherPKBody.data.hasArtifactEft) {
				otherPKBody.data.hasArtifactEft = true;
				otherPKBody.data = playerdata;
			}
		}
		otherPKBody.isDamageFalse = true;
		otherPKBody.onRefreshShield();

		let atkerPlayerData: PlayerData;
		let deferPlayerData: PlayerData;
		if (atkerFightInfo.playerId == this.player.id) {//我是攻击方
			atkerPlayerData = this.mainscene.heroBody.data;
			if (!this.isPk) {
				atkerPlayerData.onRestHpInfo(atkerFightInfo.startHp, atkerFightInfo.totalHp);
			}
			deferPlayerData = otherPKBody.data;
			deferPlayerData.onRestHpInfo(deferFightInfo.startHp, deferFightInfo.totalHp);
			GameCommon.getInstance().addAlert(Language.instance.parseInsertText('allpeople_alert_2', playerdata.name));
		} else {
			atkerPlayerData = otherPKBody.data;
			atkerPlayerData.onRestHpInfo(atkerFightInfo.startHp, atkerFightInfo.totalHp);
			deferPlayerData = this.mainscene.heroBody.data;
			if (!this.isPk) {
				deferPlayerData.onRestHpInfo(deferFightInfo.startHp, deferFightInfo.totalHp);
			}
			GameCommon.getInstance().addAlert(Language.instance.parseInsertText('allpeople_alert_1', playerdata.name));
		}
		//检测我自己的护盾
		if (this.mainscene.heroBody.data.shieldValue > 0 && this.mainscene.heroBody.data.currentHp < this.mainscene.heroBody.data.maxHp) {
			this.mainscene.heroBody.data.shieldValue = 0;
			this.mainscene.heroBody.removeShieldAnim();
		}
		//检测对方的护盾
		if (otherPKBody.data.shieldValue > 0 && otherPKBody.data.currentHp < otherPKBody.data.maxHp) {
			otherPKBody.data.shieldValue = 0;
			otherPKBody.removeShieldAnim();
		}
		/**
		 * 根据固定回合 计算每回合的掉血量 
		 * 公式：
		 * 如果有复活：  每回合掉血 = （对方当前血量 + 对方护盾值 + （对方复活血量-对方剩余血量））/ 回合数 
		 * 如果没有复活： 每回合掉血 = （对方当前血量 + 对方护盾值 - 对方剩余血量）/ 回合数
		 **/
		let rebornValue: number;
		let roundNum: number = 0;
		//计算攻击方的伤害：
		rebornValue = 0;
		//回合数：如果是我自己 = N回合 ; 如果不是我 = 对方赢了? N回合 : N-1回合; 
		roundNum = atkerFightInfo.playerId == this.player.id ? FightDefine.ALLPEOPLE_FIGHT_ROUND : (atkerFightInfo.endHp > 0 ? FightDefine.ALLPEOPLE_FIGHT_ROUND : FightDefine.ALLPEOPLE_FIGHT_ROUND - 1);
		if (deferPlayerData.reborncount > 0 && deferFightInfo.leftReborn == 0) {
			rebornValue = Tool.toInt(deferFightInfo.totalHp * deferPlayerData.rebornEffect / GameDefine.GAME_ADD_RATIO);
			if (rebornValue < deferFightInfo.endHp) {
				rebornValue = 0;
			}
		}

		if (deferFightInfo.startHp > deferFightInfo.endHp) {
			atkerFightInfo.attackNum = Math.ceil((deferFightInfo.startHp + deferPlayerData.shieldValue + (rebornValue - deferFightInfo.endHp)) / roundNum);
		} else {
			atkerFightInfo.attackNum = 0;
		}

		//计算放手方的伤害：
		rebornValue = 0;
		roundNum = deferFightInfo.playerId == this.player.id ? FightDefine.ALLPEOPLE_FIGHT_ROUND : (deferFightInfo.endHp > 0 ? FightDefine.ALLPEOPLE_FIGHT_ROUND : FightDefine.ALLPEOPLE_FIGHT_ROUND - 1);
		if (atkerPlayerData.reborncount > 0 && atkerFightInfo.leftReborn == 0) {
			rebornValue = Tool.toInt(atkerFightInfo.totalHp * atkerPlayerData.rebornEffect / GameDefine.GAME_ADD_RATIO);
			if (rebornValue < atkerFightInfo.endHp) {
				rebornValue = 0;
			}
		}
		if (atkerFightInfo.startHp > atkerFightInfo.endHp) {
			deferFightInfo.attackNum = Math.ceil((atkerFightInfo.startHp + atkerPlayerData.shieldValue + (rebornValue - atkerFightInfo.endHp)) / FightDefine.ALLPEOPLE_FIGHT_ROUND);
		} else {
			deferFightInfo.attackNum = 0;
		}

		this.mainscene.getBodyManager().addEmenyBodyToAry(otherPKBody);
		this.mainscene.heroBody.currTarget = otherPKBody;
		otherPKBody.onClearTargets();
		otherPKBody.onAddEnemyBodyList(this.mainscene.heroBodys);
		otherPKBody.onShowOrHideHpBar(true);

		if (!this.fightOhterData && this.rankDamages && this.rankDamages[0]) {//锁定当时第一名的数据
			this.fightOhterData = this.rankDamages[0];
		}
		// Tool.log('攻击方：ID ==== ' + atkerFightInfo.playerId + '  名字：：：' + atkerPlayerData.name);
		// Tool.log('>>>>>起始血量===== ' + atkerFightInfo.startHp + '  剩余血量====' + atkerFightInfo.endHp + '  总血量====' + atkerFightInfo.totalHp);
		// Tool.log('>>>>>最终复活次数===== ' + atkerFightInfo.leftReborn);
		// Tool.log('防守方：ID ==== ' + deferFightInfo.playerId + '  名字：：：' + deferPlayerData.name);
		// Tool.log('>>>>>起始血量===== ' + deferFightInfo.startHp + '  剩余血量====' + deferFightInfo.endHp + '  总血量====' + deferFightInfo.totalHp);
		// Tool.log('>>>>>最终复活次数===== ' + deferFightInfo.leftReborn);
	}
	//是否处于PK状态中
	private get isPk(): boolean {
		return this.fightOhterData ? true : false;
	}
	//根据PlayerId从场景的其他人列表人找到body对象列表
	private getOhterBodysById(playerid: number): PlayerBody[] {
		var _bodys: PlayerBody[] = [];
		for (var i: number = 0; i < this.mainscene.getBodyManager().otherPlayerBodys.length; i++) {
			var _otherbody: PlayerBody = this.mainscene.getBodyManager().otherPlayerBodys[i];
			if (_otherbody.data.playerId == playerid) {
				_bodys.push(_otherbody);
			}
		}
		return _bodys;
	}
	//根据地图出生点随机出角色出生点
	private getRandomRebornNode(): ModelMapNode {
		var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 2);
		var ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
		ramdomNode = ramdomNode ? ramdomNode : mapNode;
		return ramdomNode;
	}
	//战斗轮询计时器
	private intervalTime: number = 1000;//1秒一轮询
	private timerRunTime: number = 500;//计时器运行频率
	private currRunTime: number = 0;//记录当前运行时间
	private currDamageNum: number = 0;//我的积累伤害值
	private onTimerDown(): void {
		this.currRunTime += this.timerRunTime;
		this.onUpdateBossHp();
		if (this.currRunTime >= this.intervalTime) {
			this.onSendFightInfo2Server();
		} else {
			this.onUpdateRank();
		}
	}
	//更新BOSS血量
	private onUpdateBossHp(): void {
		if (!this.monsterBody)
			return;
		//播放BOSS掉血 如果有服务器的减血就播服务器的减血 没有则播放自己的伤害
		var totalLossHp: number = this.beforeBossHp - this.currBossHp;
		var _currBossHp: number = 0;
		_currBossHp = Math.max(0, this.beforeBossHp - Math.ceil(totalLossHp * (this.currRunTime / this.intervalTime)) - this.currDamageNum);
		this.mainscene.getModuleLayer().onUpdateBossHpBar(_currBossHp, this.monsterBody.data.maxHp);
		if (_currBossHp == 0) {
			this.onSendFightInfo2Server();
		}
	}
	//通知服务器战斗轮询
	private onSendFightInfo2Server(): void {
		if (this.fightStatus == FIGHT_STATUS.Fighting) {
			this._status = FIGHT_STATUS.Requset;
			let messageID: number;
			if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
				messageID = MESSAGE_ID.ALLPEOPLE_FIGHT_UPDATE_MSG;
			} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
				messageID = MESSAGE_ID.XUEZHANBOSS_FIGHT_UPDATE_MSG;
			} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
				messageID = MESSAGE_ID.VIPBOSS_FIGHT_UPDATE_MSG;
			} else if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
				messageID = MESSAGE_ID.BOSS_PILL_FIGHT_MESSAGE;
				let fightinfoMsg: Message = new Message(messageID);
				fightinfoMsg.setInt(this.curXianShanId);
				fightinfoMsg.setLong(this.currDamageNum);
				GameCommon.getInstance().sendMsgToServer(fightinfoMsg);
				this.currRunTime = 0;
				return;
			}
			let fightinfoMsg: Message = new Message(messageID);
			fightinfoMsg.setShort(GameFight.getInstance().allpeopleBossId);
			fightinfoMsg.setLong(this.currDamageNum);
			GameCommon.getInstance().sendMsgToServer(fightinfoMsg);
			this.currRunTime = 0;
		}
	}
	//主角击杀目标
	public onKillTargetHandle(): void {
	}
	//BOSS被我攻击的反馈
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (this.monsterBody === hurtBody && isHeroAtk) {
			if (!this.monsterBody || !damage)
				return;
			for (var i: number = this.monsterBody.data.targets.length - 1; i >= 0; i--) {
				var _attackTarget: ActionBody = this.monsterBody.data.targets[i];
				if (_attackTarget.data.isDie) {
					this.monsterBody.onRemoveTarget(_attackTarget);
				}
			}
			if (this.monsterBody.data.targets.length == 0) {
				this.monsterBody.onAddEnemyBodyList(this.mainscene.heroBodys);
			}
			if (this.fightStatus == FIGHT_STATUS.Fighting) {
				this.currDamageNum += damage.value;
				this.selfRankDamage += damage.value;
				this.onUpdateBossHp();
			}
			hurtBody.addFlyFont(damage);
		} else if ((hurtBody.data.bodyType == BODY_TYPE.PLAYER && attacker.data.bodyType == BODY_TYPE.SELF) ||
			(hurtBody.data.bodyType == BODY_TYPE.SELF && attacker.data.bodyType == BODY_TYPE.PLAYER)) {

			let atckPlayer: PlayerBody = attacker as PlayerBody;
			let hurtPlayer: PlayerBody = hurtBody as PlayerBody;
			let attackerInfo: AllPeoplePKInfo = this.fightInfos[atckPlayer.data.playerId + "vs" + hurtPlayer.data.playerId];
			if (!attackerInfo) return;
			let deferInfo: AllPeoplePKInfo = this.fightInfos[hurtPlayer.data.playerId + "vs" + atckPlayer.data.playerId];
			let oldShield: number = hurtPlayer.data.shieldValue;
			let lostHp: number = Math.max(0, attackerInfo.attackNum - hurtPlayer.data.shieldValue);
			let left_shield: number = Math.max(0, hurtPlayer.data.shieldValue - attackerInfo.attackNum);
			let _leftHp: number = hurtPlayer.data.currentHp - lostHp;
			damage.xishou = Math.max(0, oldShield - hurtPlayer.data.shieldValue);
			//检查受伤者的护盾
			if (hurtPlayer.data.shieldValue > 0 && left_shield == 0) {
				hurtPlayer.removeShieldAnim();
			}
			hurtPlayer.data.shieldValue = left_shield;
			hurtPlayer.hp = _leftHp;
			//检查受伤者最终是否死亡
			if (hurtPlayer.data.currentHp <= 0) {
				if (hurtPlayer.data.reborncount > 0) {//检查受伤者的复活
					hurtPlayer.data.reborncount = 0;
					let rebornNum: number = Tool.toInt(deferInfo.totalHp * hurtPlayer.data.rebornEffect / GameDefine.GAME_ADD_RATIO);
					hurtPlayer.hp = Math.max(1, _leftHp <= 0 ? rebornNum + _leftHp : rebornNum);
					hurtPlayer.onPlayRebornAnim();
				} else {
					if (deferInfo.endHp > 0) {
						hurtPlayer.hp = deferInfo.endHp;
					} else {
						if (hurtPlayer.data.playerId == this.mainscene.heroBody.data.playerId) {
							GameCommon.getInstance().addAlert(Language.instance.parseInsertText('allpeople_alert_4', atckPlayer.data.name));
						} else {
							GameCommon.getInstance().addAlert(Language.instance.parseInsertText('allpeople_alert_3', hurtPlayer.data.name));
						}
						atckPlayer.hp = attackerInfo.endHp;
						hurtPlayer.onDeath();
						if (this.fightOhterData && (this.fightOhterData.playerId == hurtPlayer.data.playerId || this.fightOhterData.playerId == atckPlayer.data.playerId)) {
							this.fightOhterData = null;
						}
						this.onPkFinishHandle(atckPlayer, hurtPlayer);
					}
				}
			}
			//更新血量
			let other_probar: eui.ProgressBar = this.fight_info_bar['other_probar'];
			if (this.fightOhterData) {
				let targetBody: PlayerBody;
				if (atckPlayer.data.playerId == this.fightOhterData.playerId) {
					targetBody = atckPlayer;
				} else if (hurtPlayer.data.playerId == this.fightOhterData.playerId) {
					targetBody = hurtPlayer;
				}
				if (targetBody) {
					let hpPercent: number = Tool.toInt(targetBody.data.currentHp / targetBody.data.maxHp * 100);
					if (hpPercent == 0) {
						hpPercent = targetBody.data.currentHp > 0 ? 1 : 0;
					}
					other_probar.value = hpPercent;
					(other_probar["hp_label"] as eui.Label).text = `${hpPercent}%`;
				}
			}

			hurtBody.addFlyFont(damage);
		}
	}
	//移除当前锁定的目标
	private onPkFinishHandle(atckPlayer: PlayerBody, hurtPlayer: PlayerBody): void {
		delete this.fightInfos[atckPlayer.data.playerId + "vs" + hurtPlayer.data.playerId];
		delete this.fightInfos[hurtPlayer.data.playerId + "vs" + atckPlayer.data.playerId];
		if (this.rankDamages && this.rankDamages[0]) {
			let other_probar: eui.ProgressBar = this.fight_info_bar['other_probar'];
			// (other_probar["head_icon"] as eui.Image).source = GameCommon.getInstance().getBigHeadByOccpation(this.rankDamages[0].headidx);
			(other_probar["playerHead"] as PlayerHeadPanel).setHead(this.rankDamages[0].headidx, this.rankDamages[0].headFrame);
			(other_probar["name_lab"] as eui.Label).text = this.rankDamages[0].playerName;
			other_probar.value = this.rankDamages[0].hpPercent;
			(other_probar["hp_label"] as eui.Label).text = `${this.rankDamages[0].hpPercent}%`;
		}
	}
	//请求结果
	public onFinishFight(result: number): void {
	}
	//更新排行榜
	private selfRankDamage: number = 0;//我的排行榜总伤害
	private rankDamages: BossDamageParam[];
	private selfRank: number = -1;
	public onResRankMsg(msgEvent: GameMessageEvent): void {
		var msg: Message = msgEvent.message;
		this.selfRankDamage = msg.getInt();
		this.selfRank = -1;
		this.rankDamages = [];
		var ranksize: number = msg.getShort();
		for (var i: number = 0; i < ranksize; i++) {
			var damageData: BossDamageParam = new BossDamageParam();
			damageData.index = i + 1;
			damageData.playerId = msg.getInt();
			damageData.playerName = msg.getString();
			damageData.headidx = msg.getByte();
			damageData.headFrame = msg.getByte();
			damageData.damageNum = msg.getInt();
			damageData.isFight = msg.getByte() == 1;
			damageData.unionID = msg.getInt();
			damageData.hpPercent = msg.getByte();
			this.rankDamages.push(damageData);
			if (damageData.playerId == this.player.id) {
				this.selfRank = i;
			}
		}

		this.onUpdateRank(false);
	}
	public onUpdateRank(isChange: boolean = true): void {
		if (!this.rankDamages)
			return;
		if (1 + 1 != 2) {
			if (isChange) {//客户端进行实时刷新榜单
				if (this.rankDamages.length == 0) {
					let tempData: BossDamageParam = new BossDamageParam();
					tempData.index = 1;
					tempData.playerId = this.player.id;
					tempData.playerName = this.player.name;
					tempData.damageNum = this.selfRankDamage;
					this.rankDamages.push(tempData);
				} else {
					if (this.selfRank >= 0) {
						this.rankDamages[this.selfRank].damageNum = this.selfRankDamage;
					} else {
						let tempData: BossDamageParam;
						tempData = new BossDamageParam();
						tempData.playerId = this.player.id;
						tempData.playerName = this.player.name;
						tempData.damageNum = this.selfRankDamage;
					}
					this.rankDamages.sort(function (a, b): number {
						return b.damageNum - a.damageNum;
					});
				}
				for (let i: number = 0; i < this.rankDamages.length; i++) {
					let rankDamageData: BossDamageParam = this.rankDamages[i];
					rankDamageData.index = i + 1;
					if (rankDamageData.playerId == this.player.id) {
						this.selfRank = i;
					}
				}
			}
			let name_label: string = "";
			let damage_label: string = "";
			for (let i: number = 0; i < this.RANK_SHOW_NUM; i++) {
				let damagedata: BossDamageParam = this.rankDamages[i];
				if (damagedata) {
					name_label += damagedata.index + " " + GameCommon.getInstance().getNickname(damagedata.playerName) + "\n";
					damage_label += GameCommon.getInstance().getFormatNumberShow(damagedata.damageNum) + "\n";
				}
			}
			let self_rank_desc: string = this.selfRank >= 0 && this.selfRank < 10 ? (this.selfRank + 1) + '' : Language.instance.getText('weishangbang');
			(this.fight_info_bar['dmg_name_lab'] as eui.Label).text = name_label;
			(this.fight_info_bar['dmg_value_lab'] as eui.Label).text = damage_label;
			(this.fight_info_bar['self_dmginfo_lab'] as eui.Label).text = Language.instance.getText('wodepaiming') + "：" + self_rank_desc;
			(this.fight_info_bar['slef_dmg_value_lab'] as eui.Label).text = Language.instance.getText('dps') + "：" + GameCommon.getInstance().getFormatNumberShow(this.selfRankDamage);
		} else if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS || this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS || this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			let other_probar: eui.ProgressBar = this.fight_info_bar['other_probar'];
			var damageData: BossDamageParam;
			if (!this.fightOhterData) {
				damageData = this.rankDamages[0];
				if (damageData) {
					other_probar.visible = true;
					this.fight_info_bar['snatch_btn'].visible = damageData.playerId != DataManager.getInstance().playerManager.player.id;
					// (other_probar["head_icon"] as eui.Image).source = GameCommon.getInstance().getBigHeadByOccpation(damageData.headidx);
					(other_probar["playerHead"] as PlayerHeadPanel).setHead(damageData.headidx, damageData.headFrame);
					(other_probar["name_lab"] as eui.Label).text = damageData.playerName;
					other_probar.value = damageData.hpPercent;
					(other_probar["hp_label"] as eui.Label).text = `${damageData.hpPercent}%`;
				} else {
					other_probar.visible = false;
					this.fight_info_bar['snatch_btn'].visible = false;
				}
			}
		}
	}
	//请求争夺
	private onSnatch(): void {
		if (!this.rankDamages) return;
		if (this.rankDamages[0]) {
			GameFight.getInstance().sendBossFightPkRequset(this.rankDamages[0].playerId);
		}
	}
	//复活消息
	private onResReborn(msgEvent: GameMessageEvent): void {
		let msg: Message = msgEvent.message;
		let rebornTime: number = msg.getInt();
		if (rebornTime > 0) {
			this.mainscene.getModuleLayer().onShowSamsaraReborn(rebornTime);
		} else {
			this.mainscene.getModuleLayer().onHideSamsaraReborn();
			this.mainscene.onupdateHero();
			let bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.getRandomRebornNode().nodeId);
			this.mainscene.setHeroMapPostion(bornPoint);
			this.mainscene.heroBody.isDamageFalse = true;
		}
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		super.onFinishFight(result);
		if (this.monsterBody) {
			this.mainscene.getModuleLayer().onUpdateBossHpBar(0, this.monsterBody.data.maxHp);
			this.monsterBody.onDeath();
		}
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);

		let winparam: DupWinParam = new DupWinParam();
		var resultMsg: Message = event.message;
		var result: number = resultMsg.getByte();
		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			var firstName: string = resultMsg.getString();
			winparam.resultParam = firstName;
			winparam.dropList = GameFight.getInstance().onParseDropItems(resultMsg);
			this.mainscene.getBodyManager().onPlayDropEffect(winparam.dropList);
			Tool.callbackTime(this.onOpenResultPanel, this, 2000, winparam);
		} else {
			this.onCloseResultView();
		}

		this.fightOhterData = null;
		this.onUpdateRank();
	}
	//打开结算面板
	private onOpenResultPanel(param: DupWinParam): void {
		if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
			param.specialDesc = Language.instance.getText('quanmin_teshushuoming');
		} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
			param.specialDesc = Language.instance.getText('xuezhan_teshushuoming');
		} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			param.specialDesc = Language.instance.getText('xuezhan_teshushuoming');
		} else if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			param.specialDesc = Language.instance.getText('xianshanboss_teshushuoming');
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", param));
	}
	private get player(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	private onCloseResultView(): void {
		this.mainscene.onReturnYewaiScene();
		if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XianDanMainViewPanel");
		}
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		//设置人物出生点
		var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.getRandomRebornNode().nodeId);
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	public onDeath(): void {
		let hurdEnemys: ActionBody[] = this.mainscene.heroBody.data.targets;
		for (let i: number = 0; i < hurdEnemys.length; i++) {
			if (hurdEnemys[i].data.bodyType != BODY_TYPE.PLAYER && hurdEnemys[i].data.bodyType != BODY_TYPE.ROBOT) continue;
			let otherbody: PlayerBody = hurdEnemys[i] as PlayerBody;
			otherbody.onClearTargets();
			otherbody.onAddEnemyBodyList([this.monsterBody]);
			otherbody.currTarget = this.monsterBody;
			this.mainscene.getBodyManager().removeEmenyBodyToAry(otherbody);
			otherbody.onShowOrHideHpBar(false);
			this.onPkFinishHandle(this.mainscene.heroBody, otherbody);
		}
		this.mainscene.getModuleLayer().onShowSamsaraReborn(FightDefine.ALLPEOPLE_REBORN_CD);
		this.mainscene.getBodyManager().refreshShieldOtherBody();
		this.fightOhterData = null;
	}
	public onFightWin(): void {
	}
	public onFightLose(): void {
	}
	public onQuitScene(): void {
		if (GameFight.getInstance().fightsceneTpye != this.sceneTpye) {
			return;
		}
		let messageID: number;
		if (this._scenetype == FIGHT_SCENE.ALLPEOPLE_BOSS) {
			messageID = MESSAGE_ID.ALLPEOPLE_BOSS_LEAVE_MSG;
		} else if (this._scenetype == FIGHT_SCENE.XUEZHAN_BOSS) {
			messageID = MESSAGE_ID.XUEZHANBOSS_LEAVE_MSG;
		} else if (this._scenetype == FIGHT_SCENE.VIP_BOSS) {
			messageID = MESSAGE_ID.VIPBOSS_LEAVE_MSG;
		} else if (this._scenetype == FIGHT_SCENE.XIANSHAN_BOSS) {
			let quitmessage: Message = new Message(MESSAGE_ID.BOSS_PILL_QUIT_MESSAGE);
			quitmessage.setInt(this.curXianShanId);
			GameCommon.getInstance().sendMsgToServer(quitmessage);
			this.mainscene.onReturnYewaiScene();
			return;
		}
		let quitmessage: Message = new Message(messageID);
		quitmessage.setShort(GameFight.getInstance().allpeopleBossId);
		GameCommon.getInstance().sendMsgToServer(quitmessage);
		this.mainscene.onReturnYewaiScene();
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
		DataManager.getInstance().dupManager.allpeoplebossData.removeAllOtherFightData();
		this.monsterBody = null;
		GameFight.getInstance().allpeopleBossId = null;
		this.rankDamages = null;
		this.fightOhterData = null;
		this.fightInfos = null;
		this.mainscene.getModuleLayer().showorhideDupRebornBar(false);
	}
	//The end
}