class MysBossFight extends BaseFightScene implements IFightScene {
	private RANK_SHOW_NUM: number = 4;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameDispatcher.getInstance().addEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_OTHERBODY_MSG.toString(), this.onResAddOtherFightBodyMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT_INFO.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_TARGET_MESSAGE.toString(), this.onResBossAttackTargetMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_TOP_MESSAGE.toString(), this.onResRankMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_REVIVE_MESSAGE.toString(), this.onResReborn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_QUIT_MESSAGE.toString(), this.onResOhterLeaveMsg, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		this.fight_info_bar['loop_award_btn'].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopSamsaraAward, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_OTHERBODY_MSG.toString(), this.onResAddOtherFightBodyMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT_INFO.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_TARGET_MESSAGE.toString(), this.onResBossAttackTargetMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_TOP_MESSAGE.toString(), this.onResRankMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_REVIVE_MESSAGE.toString(), this.onResReborn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_MYSTERIOUS_QUIT_MESSAGE.toString(), this.onResOhterLeaveMsg, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		this.fight_info_bar['loop_award_btn'].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopSamsaraAward, this);
	}
	private onLoopSamsaraAward(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MysteriousRewardsPanel");
	}

	private durationTime: number;
	private intervalId;
	private countDown(): void {
		this.durationTime = this.durationTime - 1000;
		var count: eui.Label = this.fight_info_bar['loop_award_label'] as eui.Label;
		count.text = "剩余时间：" + GameCommon.getInstance().getTimeStrForSec2(this.durationTime / 1000, false);
		if (this.durationTime < 60000)
			count.textColor = 0xFF0000;
		if (this.durationTime < 0)
			return;
		this.intervalId = Tool.callbackTime(this.countDown, this, 1000);
	}
	/***-------------战斗逻辑处理---------------***/
	private bossMaxHp: number = 0;
	private currBossHp: number = 0;
	private beforeBossHp: number = 0;
	public onParseFightMsg(enterMsg: Message): void {
		super.onParseFightMsg(enterMsg);
		GameFight.getInstance().mysteriousbossId = enterMsg.getShort();
		this.bossMaxHp = enterMsg.getLong();
		this.currBossHp = enterMsg.getLong();
		this.beforeBossHp = this.currBossHp;
		var msbossModel: Modelzhaohuanboss = JsonModelManager.instance.getModelzhaohuanboss()[GameFight.getInstance().mysteriousbossId];
		this.onSwitchMap(msbossModel.map);
		this.mainscene.getModuleLayer().showorhideDupRebornBar(true);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		super.onInitFightInfoBar();
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.MysBossInfoBarSkin;
			this.fight_info_bar.x = Globar_Pos.x;
			this.fight_info_bar.y = size.height - 198;
		}
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);

		//倒计时
		(this.fight_info_bar['loop_award_btn'] as eui.Button).visible = false;
		(this.fight_info_bar['loop_award_label'] as eui.Label).visible = true;
		this.durationTime = DataManager.getInstance().unionManager.durTime + 1000;
		if (this.intervalId)
			egret.clearTimeout(this.intervalId);
		this.countDown();

		super.onInitFightInfoBar();
	}
	//开始战斗
	private monsterBody: MonsterBody;
	protected onStartFight(): void {
		super.onStartFight();
		this.mainscene.heroBody.isDamageFalse = true;
		let mysBossModel: Modelzhaohuanboss = JsonModelManager.instance.getModelzhaohuanboss()[GameFight.getInstance().mysteriousbossId];
		//初始化信息界面
		let awarditem: AwardItem = GameCommon.parseAwardItem(mysBossModel.yulan);
		(this.fight_info_bar['show_award_icon'] as GoodsInstance).onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);

		let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		this.monsterBody = this.mainscene.getBodyManager().onCreateMapBody(mysBossModel.modelId, [mapNode], BODY_TYPE.BOSS) as MonsterBody;
		this.monsterBody.isDamageFalse = true;
		this.monsterBody.onHideHeadBar(false);
		// this.monsterBody.addEventListener(GameEvent.OTHERBODY_ATTACK_EVENT, this.onBossAttack, this);
		for (let i: number = 0; i < DataManager.getInstance().dupManager.mysteriousData.otherFightDatas.length; i++) {
			this.onCreateOtherFightBody(DataManager.getInstance().dupManager.mysteriousData.otherFightDatas[i], this.mainscene.mapInfo.getGridNearByNode(mapNode, 2, 2));
		}
		this.monsterBody.data.onRestHpInfo(this.currBossHp, this.bossMaxHp);
		this.mainscene.getModuleLayer().onUpdateBossHpBar(this.currBossHp, this.bossMaxHp);
		Tool.addTimer(this.onTimerDown, this, this.timerRunTime);
		if (GameFight.getInstance().mysteriousTargetMsg) {
			this.onResBossAttackTargetMsg();
		}
		this.mainscene.getModuleLayer().onShowBossHpBar(this.monsterBody.data);
	}
	//服务器返回战斗轮询协议
	private isFightOver: boolean;
	private onResFightUpdateMsg(messageEvenet: GameMessageEvent): void {
		var message: Message = messageEvenet.message;
		var bossid: number = message.getShort();
		if (bossid != GameFight.getInstance().mysteriousbossId)
			return;
		this.isFightOver = message.getByte() == 0;
		this.beforeBossHp = Math.max(0, this.currBossHp - this.currDamageNum);
		this._status = FIGHT_STATUS.Fighting;
		this.currBossHp = message.getLong();
		this.currDamageNum = 0;
		this.currRunTime = 0;
		this.monsterBody.data.onRestHpInfo(this.beforeBossHp);
		// Tool.log(`时间戳：${egret.getTimer()}` + "~~~~当前BOSS的血量" + this.currBossHp);
		// if (this.isFightOver && this.currBossHp <= 0) {
		// 	this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
		// }
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
		for (var i: number = 0; i < otherFightData.appears.length; i++) {
			var otherPlayerData: RobotData = new RobotData(i + 1, BODY_TYPE.PLAYER);
			otherPlayerData.playerId = otherFightData.playerId;
			otherPlayerData.name = otherFightData.playerName;
			otherPlayerData.coatardLv = otherFightData.reinLv;
			otherPlayerData.onUpdateOnlyAppear(otherFightData.appears[i]);
			var otherbody: PlayerBody = this.mainscene.getBodyManager().onCreateOtherPlayer(otherPlayerData, rebronNearNodeList);
			if (otherbody) {
				otherbody.isDamageFalse = true;
				otherbody.onAddEnemyBodyList([this.monsterBody]);
				otherbody.onShowOrHideHpBar(false);
			}
		}
	}
	//根据地图出生点随机出角色出生点
	private getRandomRebornNode(): ModelMapNode {
		var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 3);
		var ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
		ramdomNode = ramdomNode ? ramdomNode : mapNode;
		return ramdomNode;
	}
	//主角复活
	//战斗轮询计时器
	private intervalTime: number = 1000;//1秒一轮询
	private timerRunTime: number = 500;//计时器运行频率
	private currRunTime: number = 0;//记录当前运行时间
	private currDamageNum: number = 0;//我的积累伤害值
	private onTimerDown(): void {
		this.currRunTime += this.timerRunTime;
		//播放BOSS掉血 如果有服务器的减血就播服务器的减血 没有则播放自己的伤害
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
		this.mainscene.getModuleLayer().onUpdateBossHpBar(_currBossHp, this.bossMaxHp);
		if (_currBossHp == 0) {
			this.onSendFightInfo2Server();
		}
		// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~我在攻击BOSS 造成伤害：${this.currDamageNum}`);
		// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~其他人攻击BOSS 造成伤害：${Math.ceil(totalLossHp * (this.currRunTime / this.intervalTime))}`);
	}
	//通知服务器战斗轮询
	private onSendFightInfo2Server(): void {
		if (this.isFightOver && this.currBossHp <= 0) {
			if (this.currBossHp <= 0) {
				this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
			} else {
				this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
			}
			return;
		}
		if (this.fightStatus == FIGHT_STATUS.Fighting) {
			this._status = FIGHT_STATUS.Requset;
			var fightinfoMsg: Message = new Message(MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT_INFO);
			fightinfoMsg.setShort(GameFight.getInstance().mysteriousbossId);
			fightinfoMsg.setLong(this.currDamageNum);
			GameCommon.getInstance().sendMsgToServer(fightinfoMsg);
		}
	}
	//攻击逻辑
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk && this.monsterBody === hurtBody) {
			if (this.fightStatus == FIGHT_STATUS.Fighting) {
				this.currDamageNum += damage.value;
				this.selfRankDamage += damage.value;
				this.onUpdateBossHp();
				this.monsterBody.addFlyFont(damage);
			}
		} else if (attacker === this.monsterBody && hurtBody.data.bodyType == BODY_TYPE.PLAYER) {
			this.onBossAttack(hurtBody as PlayerBody);
		} else if (hurtBody.data.bodyType == BODY_TYPE.SELF && attacker === this.monsterBody) {
			this.onBossAttack(hurtBody as PlayerBody);
		}
	}
	//服务器返回BOSS攻击的目标
	private targetLiveTime: number = 0;//目标生存时间
	private targetMaxHp: number = 0;//目标血量总值
	private targetHpValue: number = 0;//目标血量当前值
	private targetIsSelf: boolean = false;
	private selfLiveTimes: number[];//按照我的人物顺序分配存活时间 单位毫秒
	private bossStartAttTime: number = 0;//BOSS开始攻击的时间戳
	private onResBossAttackTargetMsg(): void {
		if (!GameFight.getInstance().mysteriousTargetMsg) return;

		var msg: Message = GameFight.getInstance().mysteriousTargetMsg;
		GameFight.getInstance().mysteriousTargetMsg = null;
		var playerId: number = msg.getInt();
		this.targetIsSelf = DataManager.getInstance().playerManager.player.id == playerId;
		var playerName: string = msg.getString();
		var zsCfg:Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[msg.getShort()];
		var coatardLv: number = zsCfg.zhuansheng;
		this.targetMaxHp = msg.getInt();
		this.targetHpValue = msg.getInt();
		this.targetLiveTime = msg.getInt() * 1000;
		this.bossStartAttTime = egret.getTimer();
		// Tool.log(`时间戳：${egret.getTimer()}` + "~~~~切换目标了，目标是:" + playerName);

		if (this.monsterBody.data.targets.length > 0) {//如果之前有目标
			var beforeTargetData: PlayerData = this.monsterBody.data.targets[0].data as PlayerData;
			if (beforeTargetData && beforeTargetData.playerId != playerId) {//目标换了 相当于上次的目标被打死了
				if (beforeTargetData.bodyType != BODY_TYPE.SELF) {
					this.onUpdateOtherTargetHp(this.monsterBody.data.targets, 0, this.targetMaxHp);
				} else {
					for (var i: number = 0; i < this.mainscene.heroBodys.length; i++) {
						this.mainscene.heroBodys[i].data.onRestHpInfo(0);
						this.mainscene.heroBodys[i].onDeath();
					}
				}
			}
		}
		this.monsterBody.onClearTargets();

		var targetData: PlayerData;
		if (this.targetIsSelf) {//判断下目标是不是自己
			var player: Player = DataManager.getInstance().playerManager.player;
			// this.mainscene.getBodyManager().onResetAllHeroSkillCD();
			this.mainscene.onupdateHero();
			targetData = this.mainscene.heroBody.data;
			this.monsterBody.onAddEnemyBodyList(this.mainscene.heroBodys);
			this.mainscene.getModuleLayer().onShowOhterHpBar(this.mainscene.heroBody.data, DataManager.getInstance().playerManager.player.headIndex, DataManager.getInstance().playerManager.player.headFrameIndex);
			this.mainscene.getModuleLayer().onUpdateOtherHpBar(player.getPlayerMaxHp(), player.getPlayerMaxHp());
			this.selfLiveTimes = [];
			var _lastlivetime: number = this.targetLiveTime;
			for (var i: number = 0; i < this.mainscene.heroBodys.length; i++) {
				var herodata: PlayerData = this.mainscene.heroBodys[i].data;
				if (i == this.mainscene.heroBodys.length - 1) {
					this.selfLiveTimes.push(_lastlivetime);
				} else {
					this.selfLiveTimes.push(Math.floor((herodata.maxHp / player.getPlayerMaxHp()) * this.targetLiveTime));
					_lastlivetime = _lastlivetime - this.selfLiveTimes[i];
				}
			}
			// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~我总共应该活${this.targetLiveTime}毫秒。。1活${this.selfLiveTimes[0]}毫秒/2活${this.selfLiveTimes[1] ? this.selfLiveTimes[1] : 0}毫秒/3活${this.selfLiveTimes[2] ? this.selfLiveTimes[2] : 0}毫秒` + playerName);
		} else {
			var targetBodys: PlayerBody[] = this.getOhterBodysById(playerId);
			if (targetBodys.length == 0) {//如果没有在场景里找到目标对象
				var ohterfightData = new OtherFightData();
				ohterfightData.playerId = playerId;
				ohterfightData.playerName = playerName;
				ohterfightData.reinLv = coatardLv;
				ohterfightData.parseAppears(msg);
				DataManager.getInstance().dupManager.mysteriousData.addOhterFightData(ohterfightData);
				var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByXY(this.monsterBody.x, this.monsterBody.y);
				var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridNearByNode(mapNode);
				this.onCreateOtherFightBody(ohterfightData, rebornNodes);
				targetBodys = this.getOhterBodysById(playerId);
			}
			this.monsterBody.onAddEnemyBodyList(targetBodys);
			targetData = targetBodys[targetBodys.length - 1].data;
			this.onUpdateOtherTargetHp(targetBodys, this.targetHpValue, this.targetMaxHp);
			var otherTargetData: OtherFightData = DataManager.getInstance().dupManager.mysteriousData.findOneOtherFightData(targetData.playerId);
			this.mainscene.getModuleLayer().onShowOhterHpBar(targetData, otherTargetData.headIndex, otherTargetData.headFrame);
		}
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
	//接收服务器的其他人离开的协议
	private onResOhterLeaveMsg(msgEvent: GameMessageEvent): void {
		var msg: Message = msgEvent.message;
		var playerId: number = msg.getInt();

		this.onOtherLeaveHandler(this.getOhterBodysById(playerId), playerId);
	}
	//移除其他角色
	private onOtherLeaveHandler(otherbodys: PlayerBody[], playerId: number): void {
		if (otherbodys.length > 0) {
			for (var i: number = otherbodys.length - 1; i >= 0; i--) {
				this.mainscene.getBodyManager().onDestroyOhterOne(otherbodys[i], false);
			}
			DataManager.getInstance().dupManager.mysteriousData.removeOneOhterFightData(playerId);
		}
	}
	/**
	 * BOSS攻击的逻辑
	 * 固定的规则：BOSS的技能必须只能是CD是1秒 并且只有单体攻击的技能
	 * */
	private onBossAttack(hurtHeroBody: PlayerBody): void {
		var currHeroLiveTime: number = Math.ceil(egret.getTimer() - this.bossStartAttTime);//当前存活了多少毫秒
		if (this.targetIsSelf && hurtHeroBody.data.bodyType == BODY_TYPE.SELF) {
			var damageData: DamageData = new DamageData();
			//护盾值
			var shieldValue: number = Tool.toInt(hurtHeroBody.data.maxHp * hurtHeroBody.data.shieldEffect / GameDefine.GAME_ADD_RATIO);
			//复活血值
			var rebornHpValue: number = Tool.toInt(hurtHeroBody.data.maxHp * hurtHeroBody.data.rebornEffect / GameDefine.GAME_ADD_RATIO);
			//总HP值 = 护盾值 + 玩家血量 + 复活血值
			var totalHpValue: number = hurtHeroBody.data.maxHp + shieldValue + rebornHpValue;
			//玩家的存活时间
			var liveTimeCount: number = this.selfLiveTimes[hurtHeroBody.data.occupation];
			//根据时间差的百分比 计算出当前剩余血量
			var currLeftHp: number = totalHpValue - Math.ceil(Math.min(1, currHeroLiveTime / liveTimeCount) * totalHpValue);
			//计算是否在复活血量中
			var rebornLeftHp: number = totalHpValue - shieldValue - hurtHeroBody.data.maxHp;
			if (currLeftHp < rebornLeftHp && hurtHeroBody.data.reborncount > 0) {
				if (hurtHeroBody.data.reborncount > 0) {
					hurtHeroBody.data.reborncount = 0;
					hurtHeroBody.onPlayRebornAnim();
				}
				damageData.value = hurtHeroBody.data.currentHp - currLeftHp;
				hurtHeroBody.hp = currLeftHp;
			} else {
				damageData.value = hurtHeroBody.data.currentHp + hurtHeroBody.data.shieldValue - (currLeftHp - rebornHpValue);
				hurtHeroBody.hp = Math.min(hurtHeroBody.data.maxHp, currLeftHp - rebornHpValue);
			}
			//计算护盾的剩余值
			var shieldLeftHp = Math.max(0, shieldValue - (totalHpValue - currLeftHp));
			//判断护盾情况
			if (shieldLeftHp > 0) {
				damageData.xishou = Math.max(0, hurtHeroBody.data.shieldValue - shieldLeftHp);
				hurtHeroBody.data.shieldValue = shieldLeftHp;
			} else {
				damageData.xishou = hurtHeroBody.data.shieldValue;
				if (hurtHeroBody.data.shieldValue > 0) {
					hurtHeroBody.removeShieldAnim();
					hurtHeroBody.data.shieldValue = 0;
				}
			}
			//伤害属性
			damageData.attacker = this.monsterBody;
			damageData.value = Math.max(0, hurtHeroBody.data.currentHp - currLeftHp);
			damageData.fromDire = this.monsterBody.checkFace(hurtHeroBody.x, hurtHeroBody.y);
			hurtHeroBody.addFlyFont(damageData);

			var heroCurHp: number = 0;
			for (var i: number = 0; i < this.mainscene.heroBodys.length; i++) {
				heroCurHp += this.mainscene.heroBodys[i].data.currentHp;
			}
			this.mainscene.getModuleLayer().onUpdateOtherHpBar(heroCurHp, DataManager.getInstance().playerManager.player.getPlayerMaxHp());
			// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~我第${hurtHeroBody.data.modelid}个角色现存活了${currHeroLiveTime}毫秒${damageData.value}`);
			if (hurtHeroBody.data.currentHp <= 0) {
				this.bossStartAttTime = egret.getTimer();
				this.monsterBody.onRemoveTarget(hurtHeroBody);
			}
		} else {
			var currLeftHp: number = this.targetMaxHp - Math.floor(Math.min(1, currHeroLiveTime / this.targetLiveTime) * this.targetMaxHp);
			this.onUpdateOtherTargetHp(this.monsterBody.data.targets, currLeftHp, this.targetMaxHp);
			// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~BOSS在攻击：${this.monsterBody.data.targets[0].data.name}   剩余血量：${currLeftHp}`);
		}
	}
	/**
	 * 当BOSS目标非是自己的时候设置血量
	 * 目的：把血量平分到三个人身上
	 * */
	private onUpdateOtherTargetHp(targetBodys: ActionBody[], currPlayerHp, totalHp): void {
		var _len: number = targetBodys.length;
		var _heroMaxHp: number = Math.floor(totalHp / _len);//每个人的最大血量
		var detroyOtherId: number;
		var deathCount: number = this.monsterBody.data.targets.length;
		for (var i: number = 0; i < _len; i++) {
			var heroIndex: number = i + 1;
			var _heroCurrHp: number = currPlayerHp - (targetBodys.length - heroIndex) * _heroMaxHp;
			_heroCurrHp = _heroCurrHp > _heroMaxHp ? _heroMaxHp : (_heroCurrHp < 0 ? 0 : _heroCurrHp);
			var _targetBody: PlayerBody = targetBodys[i] as PlayerBody;
			_targetBody.data.onRestHpInfo(_heroCurrHp, _heroMaxHp);
			detroyOtherId = _targetBody.data.playerId;
			if (_targetBody.data.isDie) {
				if (_targetBody.parent)
					_targetBody.parent.removeChild(_targetBody);
				deathCount--;
			}
		}
		this.mainscene.getModuleLayer().onUpdateOtherHpBar(currPlayerHp, totalHp);
		if (Tool.isNumber(detroyOtherId) && deathCount == 0) {
			this.onOtherLeaveHandler(this.monsterBody.data.targets as PlayerBody[], detroyOtherId);
			this.monsterBody.onClearTargets();
		}
	}
	//更新排行榜
	private selfRankDamage: number = 0;//我的排行榜总伤害
	private rankDamages: BossDamageParam[];
	private selfRank: number = -1;
	public onResRankMsg(msgEvent: GameMessageEvent): void {
		var msg: Message = msgEvent.message;
		this.selfRankDamage = msg.getLong();
		this.selfRank = -1;
		this.rankDamages = [];
		var ranksize: number = msg.getShort();
		for (var i: number = 0; i < ranksize; i++) {
			var damageData: BossDamageParam = new BossDamageParam();
			damageData.playerId = msg.getInt();
			damageData.playerName = msg.getString();
			damageData.damageNum = msg.getLong();
			damageData.index = i + 1;
			this.rankDamages.push(damageData);
			if (damageData.playerId == DataManager.getInstance().playerManager.player.id) {
				this.selfRank = i;
			}
		}
		this.onUpdateRank(false);
	}
	public onUpdateRank(isChange: boolean = true): void {
		if (!this.rankDamages)
			return;
		if (isChange) {
			var player: Player = DataManager.getInstance().playerManager.player;
			if (this.rankDamages.length == 0) {
				var tempData: BossDamageParam = new BossDamageParam();
				tempData.index = 1;
				tempData.playerId = player.id;
				tempData.playerName = player.name;
				tempData.damageNum = this.selfRankDamage;
				this.rankDamages.push(tempData);
			} else {
				if (this.selfRank >= 0) {
					this.rankDamages[this.selfRank].damageNum = this.selfRankDamage;
				} else {
					var tempData: BossDamageParam;
					if (this.rankDamages.length >= 5) {
						tempData = this.rankDamages[this.rankDamages.length - 1];
					} else {
						tempData = new BossDamageParam();
					}
					tempData.playerId = player.id;
					tempData.playerName = player.name;
					tempData.damageNum = this.selfRankDamage;
				}
				this.rankDamages.sort(function (a, b): number {
					return b.damageNum - a.damageNum;
				});
			}

			for (var i: number = 0; i < this.rankDamages.length; i++) {
				var rankDamageData: BossDamageParam = this.rankDamages[i];
				rankDamageData.index = i + 1;
				if (rankDamageData.playerId == DataManager.getInstance().playerManager.player.id) {
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
		(this.fight_info_bar['dmg_name_lab'] as eui.Label).text = name_label;
		(this.fight_info_bar['dmg_value_lab'] as eui.Label).text = damage_label;
		let self_rank_desc: string = this.selfRank >= 0 && this.selfRank < 10 ? (this.selfRank + 1) + '' : Language.instance.getText('weishangbang');
		(this.fight_info_bar['self_dmginfo_lab'] as eui.Label).text = Language.instance.getText('wodepaiming') + "：" + self_rank_desc;
		(this.fight_info_bar['slef_dmg_value_lab'] as eui.Label).text = Language.instance.getText('dps') + "：" + GameCommon.getInstance().getFormatNumberShow(this.selfRankDamage);
		// this.mainscene.getModuleLayer().onUpdateDamageRank(this.selfRankDamage, this.rankDamages);
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		// this.targetCurrHp = DataManager.getInstance().playerManager.player.getPlayerMaxHp();
		// this.targetMaxHp = DataManager.getInstance().playerManager.player.getPlayerMaxHp();
		//设置人物出生点
		var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.getRandomRebornNode().nodeId);
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	//请求结果
	public onFinishFight(result: number): void {
		if (this._status == FIGHT_STATUS.Result)
			return;
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
		super.onFinishFight(result);
		if (result == FightDefine.FIGHT_RESULT_FAIL) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupLosePanel", null));
		} else if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MyBossKillPanel", new SamsaraBossKillLogParam(GameFight.getInstance().mysteriousbossId, 11, true)));
		}
		this.mainscene.getBodyManager().onDestroyAllHeroTarget();
	}
	public onDeath(): void {
		this.mainscene.getModuleLayer().onShowSamsaraReborn(FightDefine.SAMSARA_REBORN_CD);
		// this.mainscene.getModuleLayer().onHideOhterHpBar();
		// Tool.log(`时间戳：${egret.getTimer()}` + `~~~~BOSS已将我杀死`);
	}
	private onResReborn(msgEvent: GameMessageEvent): void {
		var msg: Message = msgEvent.message;
		var rebornTime: number = msg.getInt();
		if (rebornTime > 0) {
			this.mainscene.getModuleLayer().onShowSamsaraReborn(rebornTime);
		} else {
			this.mainscene.getModuleLayer().onHideSamsaraReborn();
			this.mainscene.onupdateHero();
			var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(this.getRandomRebornNode().nodeId);
			this.mainscene.setHeroMapPostion(bornPoint);
		}
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		DataManager.getInstance().dupManager.mysteriousData.removeAllOtherFightData();
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
		// this.monsterBody.removeEventListener(GameEvent.OTHERBODY_ATTACK_EVENT, this.onBossAttack, this);
		this.monsterBody = null;
		GameFight.getInstance().mysteriousbossId = null;
		this.rankDamages = null;
		this.isFightOver = false;
		this.mainscene.getModuleLayer().onHideOhterHpBar();
		this.mainscene.getModuleLayer().onDamageRankBar(false);
		this.mainscene.getModuleLayer().showorhideDupRebornBar(false);
		GameFight.getInstance().mysteriousTargetMsg = null;
	}
	private onCloseResultView(): void {
		this.mainscene.onReturnYewaiScene();
	}
	/***属性接口***/
	// public get isServerFight(): boolean {
	// 	return true;
	// }
}