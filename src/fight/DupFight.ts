class DupFight extends BaseFightScene implements IFightScene {
	private enterdupId: number;
	private teamOwnerId: number;//房主ID
	private currPointIndex: number;//野外关卡内刷哪一个怪的编号
	private fightDrops: AwardItem[];

	private unionBossAtkTime: number;//BOSS攻击所用时间 就是抛出他在走的时候
	private unionPassed: boolean;//帮会副本是否有人通过此关
	private blessdupRushTime: number;//祝福值副本下一波怪来临时间
	private blessdupMsgStemp: number;//消息间隔
	private blessRushCount: number;
	private blessLeftCount: number;//祝福值副本剩余怪数量
	private unionBoossBody: MonsterBody;
	private unionNpcBody: NpcBody;
	private sixiangNpcBody: ActionBody;
	private sixiangLeftTime: number;//四象本剩余时间
	private sixiangAtkTime: number;//四象本怪物攻击时间戳
	private sixiangRushPoints: number[] = [309, 520, 563, 353];
	private teamdupDatas: TeamDupData[];//组队副本的其他玩家列表
	private teamdupOthers: PlayerBody[];
	private teamRushCount: number = 0;//组队副本当前波数
	private upDamage: number;//伤害增长
	private startDamage: number;//当前伤害
	private totalDamage: number;//总伤害值
	private _dupinfo: DupInfo;
	private LiveRound: number = 0;//存活回合
	private currRound: number = 0;//当前回合
	private oneDamage: number;//每次攻击伤害
	private fulingBossBody: MonsterBody;
	private lingxingCopyModel: Modelcopy;
	/**常量**/
	private timerRunTime: number = 500;
	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_FIGHT_DUP_RESULT.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_SIXIANG_PROGRESS_MSG.toString(), this.onReciveSixiangResultMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TEAMDUP_TEAMDAMAGE_MESSAGE.toString(), this.onTeamDupUpdateMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TEAMDUP_DROPGOODS_MESSAGE.toString(), this.onReciveTeamdupDropMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TEAMDUP_QUITSCENE_MESSAGE.toString(), this.onTeamDupTimeout, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_FIGHT_DUP_RESULT.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_SIXIANG_PROGRESS_MSG.toString(), this.onReciveSixiangResultMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TEAMDUP_TEAMDAMAGE_MESSAGE.toString(), this.onTeamDupUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TEAMDUP_DROPGOODS_MESSAGE.toString(), this.onReciveTeamdupDropMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TEAMDUP_QUITSCENE_MESSAGE.toString(), this.onTeamDupTimeout, this);
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(message: Message): void {
		super.onParseFightMsg(message);
		var dupmodelID: number = message.getByte();
		this.enterdupId = message.getInt();
		var enterSuccess: boolean = message.getBoolean();
		if (!enterSuccess) {
			this.onQuitScene();
			return;
		}
		GameFight.getInstance().onEnterDupSuccess(dupmodelID);
		var model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupmodelID];
		var dupSubType: number;

		if (model.type == DUP_TYPE.DUP_PERSONALLY) {
			dupSubType = message.getByte();
		} else if (model.type == DUP_TYPE.DUP_TEAM || model.type == DUP_TYPE.DUP_VIP_TEAM || model.type == DUP_TYPE.DUP_MARRY || model.type == DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS) {
			this.teamdupDatas = [];
			this.teamOwnerId = message.getInt();
			var teamsize: number = message.getByte();
			for (var n: number = 0; n < teamsize; n++) {
				var playerDatas: PlayerData[] = GameFight.getInstance().onParsePVPEnemyMsg(message);
				var otherdata: PlayerData = playerDatas[0];
				this.teamdupDatas.push(new TeamDupData(otherdata));
			}
			this.teamdupDatas.push(new TeamDupData(this.mainscene.heroBody.data));
			dupSubType = model.subType;
		} else if (model.type == DUP_TYPE.DUP_LINGXING) {
			this.lingxingCopyModel = model;
			this.upDamage = message.getLong();
			this.totalDamage = message.getLong();
			this.startDamage = Math.max(0, this.totalDamage - this.upDamage);
			dupSubType = model.subType;
		}
		else {
			dupSubType = model.subType;
		}
		this._dupinfo = DataManager.getInstance().dupManager.getDupInfo(model.type, dupSubType);
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_PERSONALLY:
				GameFight.getInstance().dupfight_waveIndex = dupSubType;
				break;
			case DUP_TYPE.DUP_CAILIAO:
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
			case DUP_TYPE.DUP_VIP_TEAM:
				GameFight.getInstance().dupfight_waveIndex = dupmodelID;
				break;
			case DUP_TYPE.DUP_CHALLENGE:
				GameFight.getInstance().dupfight_waveIndex = this._dupinfo.pass;
				break;
			case DUP_TYPE.DUP_UNION:
				GameFight.getInstance().dupfight_waveIndex = this._dupinfo.pass - 1;
				this.unionPassed = message.getBoolean();
				GameFight.getInstance().unionCheerNum = message.getShort();
				break;
			case DUP_TYPE.DUP_ZHUFU:
				GameFight.getInstance().dupfight_waveIndex = this._dupinfo.pass;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				GameFight.getInstance().dupfight_waveIndex = 1;
				break;
			case DUP_TYPE.DUP_XIANSHAN:
				GameFight.getInstance().dupfight_waveIndex = this._dupinfo.pass;
				break;
			case DUP_TYPE.DUP_BLESS:
				GameFight.getInstance().dupfight_waveIndex = this._dupinfo.pass;
				break;
		}
		this.onSwitchMap(this._dupinfo.dupModel.mapid);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.DupInfoBarSkin;
			if (DataManager.IS_PC_Game) {
				this.fight_info_bar.x = Globar_Pos.x;
			} else {
				this.fight_info_bar.width = size.width;
			}
			this.fight_info_bar.y = size.height - this.fight_info_bar.height;
		}
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		this.fightDrops = [];
		this.currPointIndex = 0;
		let dup_time_out: number = 0;
		/**副本初始化**/
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_PERSONALLY:
				this.fight_info_bar.currentState = "gerenboss";
				let gerenAwardGrp: eui.Group = this.fight_info_bar['geren_reward_grp'];
				gerenAwardGrp.removeChildren();
				let gerenmodel: Modelgerenboss = JsonModelManager.instance.getModelgerenboss()[GameFight.getInstance().dupfight_waveIndex];
				let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(gerenmodel.show);
				rewards = GameCommon.getInstance().concatAwardAry([rewards, gerenmodel.rewards]);
				for (let i: number = 0; i < rewards.length; i++) {
					var instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(rewards[i]);
					gerenAwardGrp.addChild(instance);
				}
				break;
			case DUP_TYPE.DUP_CAILIAO:
				this.fight_info_bar.currentState = "cailiao";
				let nextmodel: Modelcopy = this._dupinfo.nextModel;
				let awarditem: AwardItem = this._dupinfo.dupModel.rewards[0];
				(this.fight_info_bar['cailiao_awd_item'] as GoodsInstance).onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
				if (nextmodel) {
					let coatardlvDesc: string = Language.instance.getText(`coatard_level${nextmodel.lvlimit}`, 'jingjie');
					let nextlevelDes: string = `[#ecd6a2${coatardlvDesc}]` + Language.instance.getText('kaiqixiayinandu');
					this.fight_info_bar['cailiao_tisheng_lab'].text = Language.instance.getText(`chanchutisheng`);
					this.fight_info_bar['cailiao_limit_lab'].textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(nextlevelDes));
				} else {
					this.fight_info_bar['cailiao_tisheng_lab'].text = "";
					this.fight_info_bar['cailiao_limit_lab'].text = "";
				}
				break;
			case DUP_TYPE.DUP_ZHUFU:
				this.fight_info_bar.currentState = "blessdup";
				this.blessRushCount = 0;
				let modelZhufu: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex];
				this.blessLeftCount = modelZhufu.maxNum;
				this.fight_info_bar[`bless_pro_bar`].maximum = modelZhufu.maxNum;
				this.fight_info_bar[`bless_pro_bar`].value = 0;
				this.fight_info_bar[`bless_pro_bar`].labelDisplay.visible = false;
				this.fight_info_bar[`bless_pronum_lab`].text = `${0}/${modelZhufu.maxNum}`;
				/**波数奖励**/
				var countRewards: string[] = modelZhufu.numReward.split("#");
				for (var i: number = 0; i < 3; i++) {
					if (countRewards.length > i) {
						this.fight_info_bar['bless_awd_grp' + i].visible = true;
						var awardboshu: number = Math.min(modelZhufu.maxNum, parseInt(countRewards[i]));
						(this.fight_info_bar['bless_awdstage_lab' + i] as eui.Label).text = awardboshu + Language.instance.getText('kill');
					} else {
						this.fight_info_bar['bless_awd_grp' + i].visible = false;
					}
				}
				dup_time_out = modelZhufu.maxTimes;
				GameFight.getInstance().onSendBlessDupProgressMsg(0);
				break;
			case DUP_TYPE.DUP_UNION:
				dup_time_out = DupDefine.UnionDup_Limit_Time;
				break;
			case DUP_TYPE.DUP_CHALLENGE:
				this.fight_info_bar.currentState = "tiaozhan";
				let awardGrp: eui.Group = this.fight_info_bar['tiaozhan_reward_grp'];
				awardGrp.removeChildren();
				let modelzhuxian: Modelzhuxiantai = JsonModelManager.instance.getModelzhuxiantai()[this._dupinfo.pass];
				if (modelzhuxian) {
					for (let aIndex: number = 0; aIndex < modelzhuxian.rewards.length; aIndex++) {
						let awarditem: AwardItem = modelzhuxian.rewards[aIndex];
						let _instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
						_instance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
						awardGrp.addChild(_instance);
					}
				}
				this.playBossIncomeAnim();
				break;
			case DUP_TYPE.DUP_SIXIANG:
				this.fight_info_bar.currentState = "sixiang";
				let sixiang_awd_grp: eui.Group = this.fight_info_bar['sixiang_awd_grp'];
				if (sixiang_awd_grp.numChildren == 0) {
					for (let i: number = 0; i < DupDefine.SixiangDup_Drops_Id.length; i++) {
						let awarditem: AwardItem = new AwardItem(GOODS_TYPE.ITEM, DupDefine.SixiangDup_Drops_Id[i]);
						let instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
						instance.num_label.text = '0';
						sixiang_awd_grp.addChild(instance);
					}
				} else {
					for (let i: number = 0; i < sixiang_awd_grp.numChildren; i++) {
						let instance: GoodsInstance = sixiang_awd_grp.getChildAt(i) as GoodsInstance;
						instance.num_label.text = '0';
					}
				}

				this.sixiangNpcBody = this.mainscene.getBodyManager().onCreateMapBody(DupDefine.SixiangDup_Npc_Id, [this.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId)], BODY_TYPE.NPC, false);
				break;
			case DUP_TYPE.DUP_TEAM:
				this.fight_info_bar.currentState = "teamdup";
				this.teamRushCount = 0;
				this._teamheartSign = 0;
				this.teamdupOthers = [];
				var name_label: string = "";
				var damage_label: string = "";
				for (var i: number = 0; i < this.teamdupDatas.length; i++) {
					var playerdata: PlayerData = this.teamdupDatas[i].playerdata;
					var index: number = i + 1;
					name_label += index + " " + GameCommon.getInstance().getNickname(playerdata.name) + "\n";
					damage_label += 0 + "\n";
					(this.fight_info_bar['teamdup_name_lab'] as eui.Label).text = name_label;
					(this.fight_info_bar['teamdup_dmgnum_lab'] as eui.Label).text = damage_label;
					if (playerdata.playerId == DataManager.getInstance().playerManager.player.id)
						continue;
					var otherbody: PlayerBody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [this.getRandomRebornNode()]);
					this.teamdupOthers.push(otherbody);
				}
				let dupdiffcult: number = Math.max(1, this._dupinfo.diffcult);
				this.fight_info_bar['teamdup_dropdec_lab'].text = Language.instance.getText(`zuduifuben_drop_diff${dupdiffcult}`);
				dup_time_out = DupDefine.TeamDup_Limit_Time;
				this.startTeamdupHeart();
				break;
			case DUP_TYPE.DUP_VIP_TEAM:
				this.fight_info_bar.currentState = "vipteam";
				this.teamRushCount = 0;
				this._teamheartSign = 0;
				this.teamdupOthers = [];
				var name_label: string = "";
				var damage_label: string = "";
				for (var i: number = 0; i < this.teamdupDatas.length; i++) {
					var playerdata: PlayerData = this.teamdupDatas[i].playerdata;
					var index: number = i + 1;
					name_label += index + " " + GameCommon.getInstance().getNickname(playerdata.name) + "\n";
					damage_label += 0 + "\n";
					(this.fight_info_bar['teamdup_name_lab'] as eui.Label).text = name_label;
					(this.fight_info_bar['teamdup_dmgnum_lab'] as eui.Label).text = damage_label;
					if (playerdata.playerId == DataManager.getInstance().playerManager.player.id)
						continue;
					var otherbody: PlayerBody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [this.getRandomRebornNode()]);
					this.teamdupOthers.push(otherbody);
				}
				this.fight_info_bar['teamdup_dropdec_lab'].text = '诛仙礼包';
				dup_time_out = DupDefine.VipTeam_Limit_Time;
				this.startTeamdupHeart();
				break;
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				this.fight_info_bar.currentState = "marry";
				this.teamRushCount = 0;
				this._teamheartSign = 0;
				this.teamdupOthers = [];
				var name_label: string = "";
				var damage_label: string = "";
				for (var i: number = 0; i < this.teamdupDatas.length; i++) {
					var playerdata: PlayerData = this.teamdupDatas[i].playerdata;
					var index: number = i + 1;
					name_label += index + " " + GameCommon.getInstance().getNickname(playerdata.name) + "\n";
					damage_label += 0 + "\n";
					(this.fight_info_bar['teamdup_name_lab'] as eui.Label).text = name_label;
					// (this.fight_info_bar['teamdup_dmgnum_lab'] as eui.Label).text = damage_label;
					if (playerdata.playerId == DataManager.getInstance().playerManager.player.id)
						continue;
					var otherbody: PlayerBody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [this.getRandomRebornNode()]);
					this.teamdupOthers.push(otherbody);
				}
				this.fight_info_bar['teamdup_dropdec_lab'].text = '仙缘礼包';
				dup_time_out = DupDefine.MarryTeam_Limit_Time;
				this.startTeamdupHeart();
				break;
			case DUP_TYPE.DUP_XIANSHAN:
				this.fight_info_bar.currentState = "tiaozhan";
				let awardGrp1: eui.Group = this.fight_info_bar['tiaozhan_reward_grp'];
				awardGrp1.removeChildren();
				// let xianshan: Modelxianshan = JsonModelManager.instance.getModelxianshan()[DataManager.getInstance().xiandanManager.curLayer+1];
				// if (xianshan) {
				// 	for (let aIndex: number = 0; aIndex < xianshan.rewards.length; aIndex++) {
				// 		let awarditem: AwardItem = xianshan.rewards[aIndex];
				// 		let _instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
				// 		_instance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
				// 		awardGrp.addChild(_instance);
				// 	}
				// }
				this.playBossIncomeAnim();
				break;
			case DUP_TYPE.DUP_BLESS:
				this.fight_info_bar.currentState = "gerenboss";
				let gerenAwardGrp1: eui.Group = this.fight_info_bar['geren_reward_grp'];
				gerenAwardGrp1.removeChildren();
				let peishiModel: Modelpeishiboss = JsonModelManager.instance.getModelpeishiboss()[DataManager.getInstance().newactivitysManager.blessTp];
				let rewards1: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(peishiModel.show);
				for (let i: number = 0; i < rewards1.length; i++) {
					var instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(rewards1[i]);
					gerenAwardGrp1.addChild(instance);
				}
				break;
			case DUP_TYPE.DUP_LINGXING:
				this.fight_info_bar.currentState = "lingxingBoss";
				var _awardStrAry: string[] = [];
				if (Constant.get('FULING_BOSS_GAINID').indexOf("#") >= 0) {
					_awardStrAry = Constant.get('FULING_BOSS_GAINID').split("#");
				}
				var showAward: string = '';
				for (let i: number = 0; i < 1; i++) {
					var awardstrItem: string[] = _awardStrAry[_awardStrAry.length - 1].split(",");
					showAward += '3,' + awardstrItem[1] + ',1';
				}
				let rewards2: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(showAward);
				let yulanAward: AwardItem = rewards2[0];
				(this.fight_info_bar['yulan_goods'] as GoodsInstance).onUpdate(yulanAward.type, yulanAward.id, null, yulanAward.quality);

				let fightBossID: number = parseInt(Constant.get('FULING_BOSS_MODEL_ID'));;
				let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
				this.fulingBossBody = this.mainscene.getBodyManager().onCreateMapBody(fightBossID, [mapNode], BODY_TYPE.BOSS) as MonsterBody;
				this.fulingBossBody.isDamageFalse = true;
				this.fulingBossBody.ignoreDist = true;
				this.fulingBossBody.onClearTargets();
				this.mainscene.getModuleLayer().onShowBossHpBar(this.fulingBossBody.data);
				this.currRound = 0;
				//各种属性初始化
				this.LiveRound = parseInt(Constant.get('FULING_BOSS_HUIHE'));
				let liveRound: number = this.LiveRound;
				if (this.mainscene.heroBody.data.reborncount > 0) {
					liveRound += 2;
				}
				this.oneDamage = Tool.toInt(this.upDamage / liveRound);
				//本场战斗总伤害
				this.fight_info_bar['curr_damage_lab'].text = '0';
				//总共对BOSS造成
				// this.fight_info_bar['total_damage_lab'].text = (this.totalDamage - this.upDamage).toString();
				//BOSS触发技能剩余
				this.fight_info_bar['live_left_lab'].text = '倒计时：10';

				Tool.addTimer(this.onTimerDown, this, this.timerRunTime);
				Tool.callbackTime(this.onShowBossSpeak, this, 1000, '灰飞烟灭...');
				return;
		}
		this.onFightHandler();
		if (dup_time_out > 0) {
			this.onStartDupTimer(dup_time_out);
		} else {
			this._leftDupTime = egret.getTimer();
		}
	}
	//场景倒计时
	private onTimerDown(): void {
		//通用逻辑显示时间
		// this.fight_info_bar['lefttime_lab'].text = Language.instance.getText('shengyushijian') + "：" + GameCommon.getInstance().getTimeStrForSec2(this.PVEBossData.lefttime, false);
		// //如果时间到了BOSS死亡
		// if (this.PVEBossData.lefttime <= 0) {
		// 	if (this.monsterBody) {
		// 		this.monsterBody.data.onRestHpInfo(0, this.totalTime);
		// 		this.monsterBody.onDeath();
		// 	}
		// }
		// //更新BOSS血条
		// this.onUpdateBossHP();
	}
	//战斗处理
	private onFightHandler(): void {
		this.onUpdateDupWave();
		if (this._rushData.refreshNum == 0) {
			return;
		}
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_UNION:
				this.mainscene.onPauseBodys(this.mainscene.heroBodys, true);
				//刷出NPC
				if (!this.unionNpcBody) {
					let npcRush: RushEnemyData = new RushEnemyData();
					npcRush.monsterId = DupDefine.SixiangDup_Npc_Id;
					npcRush.refreshGrid = this.mainscene.mapInfo.bronNodeId;
					this.unionNpcBody = this.mainscene.getBodyManager().onRushNpcToScene(npcRush, NPC_BODY_TYPE.SIXIANG);
				}
				else {
					this.unionNpcBody.data.onRebirth();
				}
				//刷出怪物
				this.unionBoossBody = this.mainscene.getBodyManager().onCreateMapBody(this.rushData.monsterId, [this.mapInfo.getNodeModelByIndex(GameDefine.UnionDup_Boss_Node)], BODY_TYPE.BOSS) as MonsterBody;
				this.unionBoossBody.isDamageFalse = true;

				if (this.unionPassed) {
					var monsterHp: number = Math.ceil(this.unionBoossBody.data.currentHp * (100 - DupDefine.UnionDup_Derate_Rate) / 100);
					this.unionBoossBody.data.onRestHpInfo(monsterHp, monsterHp);
					this.unionBoossBody.onRefreshData();
				}
				this.unionBoossBody.onAddEnemyBodyList([this.unionNpcBody]);
				this.unionBossAtkTime = 0;
				this.mainscene.getModuleLayer().onShowBossHpBar(this.unionBoossBody.data);
				this.mainscene.getModuleLayer().onUpdateBossHpBar(this.unionBoossBody.data.currentHp, this.unionBoossBody.data.maxHp);
				//判断我是否有助威加成
				if (GameFight.getInstance().unionCheerNum > 0) {
					var addRate: number = DataManager.getInstance().unionManager.getCheerAttrAddRate(GameFight.getInstance().unionCheerNum);
					for (var i: number = 0; i < this.mainscene.heroBodys.length; i++) {
						var herodata: PlayerData = this.mainscene.heroBodys[i].data;
						var currHerohp: number = Math.ceil(herodata.currentHp * (100 + addRate) / 100);
						herodata.onRestHpInfo(currHerohp, currHerohp);
						this.mainscene.heroBodys[i].onRefreshData();
					}
				}
				break;
			case DUP_TYPE.DUP_ZHUFU:
				let rushPoint: number;
				let points: number[] = [];
				for (let num: number = 0; num < this._rushData.refreshNum; num++) {
					if (points.length == 0) {
						for (let i: number = 0; i < DupDefine.BLESSDUP_POINTS.length; i++) {
							points.push(DupDefine.BLESSDUP_POINTS[i]);
						}
					}
					rushPoint = points[Math.floor(Math.random() * points.length)];
					let mapnode: ModelMapNode = this.mapInfo.getNodeModelByIndex(rushPoint);
					let monsterBody: MonsterBody = this.mainscene.getBodyManager().onCreateMapBody(this._rushData.monsterId, [mapnode], BODY_TYPE.MONSTER) as MonsterBody;
					monsterBody.data.warnDist = DupDefine.BlessDup_WarnDist;
				}
				let modelZhufu: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex];
				this.blessdupRushTime = modelZhufu.rushTime * 1000 + egret.getTimer();
				this.blessdupMsgStemp = 0;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				GameFight.getInstance().onSendSixiangDupResultMsg(0);

				let part_prompt_bar: eui.Component = new eui.Component();
				part_prompt_bar.skinName = skins.FightWavePromptBarSkin;//GameSkin.getFightWavePromptBar(Language.instance.parseInsertText('dijibo', GameFight.getInstance().dupfight_waveIndex));
				(part_prompt_bar["part_num_lab"] as eui.Label).text = Language.instance.parseInsertText('dijibo', GameFight.getInstance().dupfight_waveIndex);
				this.mainscene.getModuleLayer().addToMainview(part_prompt_bar);
				part_prompt_bar.x = -500;
				part_prompt_bar.y = size.height - 460;
				egret.Tween.get(part_prompt_bar).to({ x: 0 }, 600, egret.Ease.backInOut);
				Tool.callbackTime(function (bar: eui.Component) {
					if (bar.parent) {
						bar.parent.removeChild(bar);
					}
					egret.Tween.removeTweens(bar);
					bar = null;
				}, this, 1500, part_prompt_bar);

				this.sixiangNpcBody.data.onRebirth();
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				this.mainscene.getBodyManager().onRushMonster(this.rushData);
				for (var i: number = 0; i < this.teamdupOthers.length; i++) {
					var otherbody: ActionBody = this.teamdupOthers[i];
					otherbody.isDamageFalse = this._rushData.isBoss;
					otherbody.onClearTargets();
					otherbody.onAddEnemyBodyList(this.mainscene.heroBody.data.targets);
				}
				for (var i: number = 0; i < this.mainscene.heroBody.data.targets.length; i++) {
					var monsterbody: ActionBody = this.mainscene.heroBody.data.targets[i];
					monsterbody.isDamageFalse = true;
				}
				this.mainscene.heroBody.isDamageFalse = this._rushData.isBoss;
				break;
			default:
				this.mainscene.getBodyManager().onRushMonster(this.rushData);
				break;
		}
		//BOSS局 每次重置状态
		if (this._rushData && this._rushData.isBoss) {
			this.mainscene.onupdateHero();
		}
	}
	/**四象刷怪**/
	private onSixiangRushMonster(): void {
		this.sixiangLeftTime = this.rushData.limittime;
		this.sixiangAtkTime = 0;
		this.mainscene.getBodyManager().onRushMonster(this.rushData);
		for (var i: number = 0; i < this.mainscene.heroBody.data.targets.length; i++) {
			var monsterbody: ActionBody = this.mainscene.heroBody.data.targets[i];
			monsterbody.isDamageFalse = true;
			monsterbody.onAddEnemyBodyList([this.sixiangNpcBody]);
			if (this._rushData.isBoss) {
				this.mainscene.getModuleLayer().onShowBossHpBar(monsterbody.data);
				this.mainscene.getModuleLayer().onUpdateBossHpBar(monsterbody.data.currentHp, monsterbody.data.maxHp);
			} else {
				this.mainscene.getModuleLayer().onHideBossHpBar();
			}
		}
	}
	//启动副本倒计时 totalTime倒计时总时间(单位秒)
	private _leftDupTime: number = 0;
	private onStartDupTimer(totalTime: number): void {
		this._leftDupTime = totalTime * 1000 + egret.getTimer();
		if (totalTime > 0) {
			Tool.addTimer(this.onTimerHandler, this, 1000);
		}
	}
	//关闭副本倒计时
	private onStopDupTimer(): void {
		Tool.removeTimer(this.onTimerHandler, this, 1000);
	}
	//副本倒计时处理
	private onTimerHandler(): void {
		//通用逻辑显示时间
		this.fight_info_bar['lefttime_lab'].text = Language.instance.getText('shengyushijian') + "：" + GameCommon.getInstance().getTimeStrForSec2(this.lefttime, false);
		//对应副本内的逻辑处理
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_UNION:
				if (this.mainscene.heroBody.data.isStop && this.unionNpcBody.distanceToSelf(this.unionBoossBody) < 400) {
					this.mainscene.onPauseBodys(this.mainscene.heroBodys, false);
				}
				break;
			case DUP_TYPE.DUP_ZHUFU:
				this.blessdupMsgStemp++;
				var rushLefttime: number = this.blessdupRushTime - egret.getTimer();
				if (rushLefttime <= 0 && this.lefttime > 0 && this.mainscene.heroBody.data.targets.length < 60) {
					this.onFightWin();
				} else if (this.blessdupMsgStemp > 5) {
					this.blessdupMsgStemp = 0;
					GameFight.getInstance().onSendBlessDupProgressMsg(1, this.blessLeftCount);
				}
				break;
		}
		//副本时间到了失败
		if (this.lefttime <= 0) {
			this.onFightLose();
		}
	}
	//副本剩余时间
	private get lefttime(): number {
		return Math.max(0, Math.ceil((this._leftDupTime - egret.getTimer()) / 1000));
	}
	private get useTime(): number {
		return Math.ceil((egret.getTimer() - this._leftDupTime) / 1000);
	}
	//组队副本轮询
	private startTeamdupHeart(): void {
		Tool.addTimer(this.onTeamDupHeart, this, 1000);
	}
	private stopTeamdupHeart(): void {
		Tool.removeTimer(this.onTeamDupHeart, this, 1000);
	}
	private onTeamDupHeart(): void {
		if (this._teamheartSign < egret.getTimer()) {
			this.sendTeamDupHeartMsg();
		}
	}
	//组队副本上行轮询协议
	private _teamheartSign: number = 0;
	private sendTeamDupHeartMsg(damageNum: number = 0): void {
		if (this._status == FIGHT_STATUS.Fighting) {
			this._teamheartSign = egret.getTimer() + 1000;
			var damageMsg: Message = new Message(MESSAGE_ID.TEAMDUP_TEAMDAMAGE_MESSAGE);
			damageMsg.setByte(this.teamRushCount);
			damageMsg.setLong(damageNum);
			GameCommon.getInstance().sendMsgToServer(damageMsg);
		}
	}
	//请求结果
	public onFinishFight(result: number): void {
		if (this._status == FIGHT_STATUS.Result)
			return;
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_DUP_RESULT);
		resultFightMsg.setByte(result);
		resultFightMsg.setInt(this.enterdupId);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
		this.onStopDupTimer();
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

		this.stopTeamdupHeart();//关闭组队本轮询
	}
	//四象副本返回掉落
	private onReciveSixiangResultMsg(event: GameMessageEvent): void {
		let msg: Message = event.message;
		let isCheat: boolean = msg.getBoolean();
		if (!isCheat) {
			let dropitems: AwardItem[] = GameFight.getInstance().onParseDropItems(msg);
			let sixiang_awd_grp: eui.Group = this.fight_info_bar['sixiang_awd_grp'];
			this.mainscene.getBodyManager().onPlayDropEffect(dropitems);
			for (let id in dropitems) {
				for (let i: number = 0; i < sixiang_awd_grp.numChildren; i++) {
					let itemaward: AwardItem = dropitems[id];
					let instance: GoodsInstance = sixiang_awd_grp.getChildAt(i) as GoodsInstance;
					let model: ModelThing = instance.model;
					if (model.id == itemaward.id) {
						let count: number = itemaward.num + parseInt(instance.num_label.text);
						instance.num_label.text = count + "";
						break;
					}
				}
			}
			this.fightDrops = GameCommon.getInstance().concatAwardAry([this.fightDrops, dropitems]);
		}
		this.onSixiangRushMonster();
	}
	//组队本返回伤害更新
	private onTeamDupUpdateMsg(event: GameMessageEvent): void {
		let player: Player = DataManager.getInstance().playerManager.player;
		let msg: Message = event.message;
		let isPass: boolean = false;
		let _bossLeftHp: number = msg.getLong();
		let currStage: number = msg.getByte();
		if (currStage > this.teamRushCount) {
			this.teamRushCount = currStage;
			isPass = true;
		}
		let teamsize: number = msg.getByte();
		let teamdupdata: TeamDupData;
		for (let i: number = 0; i < teamsize; i++) {
			let playerId: number = msg.getInt();
			let playername: string = msg.getString();
			for (let idx in this.teamdupDatas) {
				teamdupdata = this.teamdupDatas[idx];
				if (teamdupdata.playerName == playername) {
					teamdupdata.parseDamageMsg(msg);
					break;
				}
			}
		}

		if (this._rushData.isBoss) {
			this.teamdupDatas.sort((data1: TeamDupData, data2: TeamDupData) => {
				if (data1.damageNum > data2.damageNum) {
					return -1;
				} else if (data1.damageNum == data2.damageNum) {
					return 0;
				} else {
					return 1;
				}
			});
			let name_label: string = "";
			let damage_label: string = "";
			for (let i: number = 0; i < this.teamdupDatas.length; i++) {
				teamdupdata = this.teamdupDatas[i];
				let index: number = i + 1;
				name_label += index + " " + GameCommon.getInstance().getNickname(teamdupdata.playerName) + "\n";
				damage_label += GameCommon.getInstance().getFormatNumberShow(teamdupdata.damageNum) + "\n";
			}
			(this.fight_info_bar['teamdup_name_lab'] as eui.Label).text = name_label;
			(this.fight_info_bar['teamdup_dmgnum_lab'] as eui.Label).text = damage_label;
		}

		if (isPass) {
			this.mainscene.getModuleLayer().onHideBossHpBar();
			if (this.mainscene.heroBody.data.targets.length > 0) {
				this.mainscene.getBodyManager().onDestroyAllHeroTarget();
			}
			for (var i: number = 0; i < this.teamdupOthers.length; i++) {
				var otherbody: ActionBody = this.teamdupOthers[i];
				otherbody.onClearTargets();
			}
			Tool.callbackTime(this.onFightWin, this, 2000);
		} else {
			var bossBody: BossBody = this.mainscene.heroBody.currTarget as BossBody;
			if (bossBody) {
				bossBody.hp = _bossLeftHp;
				if (_bossLeftHp <= 0) {
					bossBody.onDeath();
				} else {
					this.mainscene.getModuleLayer().onUpdateBossHpBar(_bossLeftHp, bossBody.data.maxHp);
				}
			}
		}
	}
	//组队副本掉落物品通用
	private onReciveTeamdupDropMsg(event: GameMessageEvent): void {
		let message: Message = event.message;
		let dropitems: AwardItem[] = GameFight.getInstance().onParseDropItems(message);
		this.mainscene.getBodyManager().onPlayDropEffect(dropitems);
		this.fightDrops = GameCommon.getInstance().concatAwardAry([this.fightDrops, dropitems]);
	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		let dupId: number = GameFight.getInstance().fightDupId;
		let model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
		let dupSubType: number;
		let dupPassnum: number;

		if (model.type == DUP_TYPE.DUP_PERSONALLY) {
			dupSubType = msg.getShort();
			dupPassnum = dupSubType;
		} else {
			dupSubType = model.subType;
			dupPassnum = msg.getShort();
		}

		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(model.type, dupSubType);
		dupinfo.pass = dupPassnum;
		if (dupinfo.dupModel.type == DUP_TYPE.DUP_CHALLENGE) {
			DataManager.getInstance().playerManager.player.updateZhuxianTai(dupPassnum);
		}

		//掉落
		let winparam: DupWinParam = new DupWinParam();
		winparam.dupinfo = dupinfo;
		winparam.dropList = GameFight.getInstance().onParseDropItems(msg);
		for (let i: number = this.fightDrops.length - 1; i >= 0; i--) {
			winparam.dropList.unshift(this.fightDrops.shift());
		}

		Tool.callbackTime(this.onOpenResultPanel, this, 1000, winparam);
	}
	//打开结算面板
	private onOpenResultPanel(param: DupWinParam): void {
		let result_desc: string = "";
		let special_desc: string = "";
		let length: number = 0;
		switch (this._dupinfo.type) {
			case DUP_TYPE.DUP_CAILIAO:
				let nextmodel: Modelcopy = this._dupinfo.nextModel;
				if (nextmodel) {
					let coatardlvDesc: string = Language.instance.getText(`coatard_level${nextmodel.lvlimit}`, 'jingjie');
					let nextlevelDes: string = `[#ecd6a2${coatardlvDesc}]` + Language.instance.getText('kaiqixiayinandu');
					// special_desc = nextlevelDes;
				} else {
					// special_desc = Language.instance.getText('current', 'dadao', 'zuigaonandu');
				}
				result_desc = Language.instance.getText("tongguan", "time") + "：" + GameCommon.getInstance().getTimeStrForSec2(this.useTime, false);
				break;
			case DUP_TYPE.DUP_ZHUFU:
				let zhufumodel: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex];
				let killCount: number = zhufumodel.maxNum - this.blessLeftCount;
				result_desc = Language.instance.getText("current2", "jisha") + "：" + killCount + "/" + zhufumodel.maxNum;
				if (this.blessLeftCount <= 0) {
					zhufumodel = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex + 1];
					if (zhufumodel) {
						special_desc = Language.instance.getText('gongxitongguan', '！', '\n', 'dup', 'open');
						special_desc += `[#ecd6a2${Language.instance.parseInsertText('dijizhang', zhufumodel.id)}],`;
						special_desc += Language.instance.getText('nadutisheng', 'jianglitisheng');
					} else {
						special_desc = Language.instance.getText('current', 'dadao', 'zuigaonandu');
					}
				} else {
					special_desc = Language.instance.getText('jisha', zhufumodel.maxNum, 'zhiguai', 'kaiqixiayinandu');
				}
				break;
			case DUP_TYPE.DUP_SIXIANG:
				special_desc = Language.instance.getText('gongxitongguan');
				length = ModelManager.getInstance().getModelLength('sixiangfuben');
				result_desc = Language.instance.parseInsertText("bencijishaboshu", GameFight.getInstance().dupfight_waveIndex - 1);
				for (let i: number = GameFight.getInstance().dupfight_waveIndex; i < length; i++) {
					let modelsixiang: Modelsixiangfuben = JsonModelManager.instance.getModelsixiangfuben()[i];
					if (modelsixiang.firstRewards) {
						let sixiangAwdThing: ModelThing = GameCommon.getInstance().getModelThingByParam(modelsixiang.firstRewards);
						special_desc = Language.instance.parseInsertText('tongguankeerwaihuode', modelsixiang.id) + sixiangAwdThing.name;
						break;
					}
				}
				break;
			case DUP_TYPE.DUP_CHALLENGE:
				special_desc = Language.instance.getText('gongxitongguan');
				result_desc = Language.instance.getText('gongxitongguan') + Language.instance.parseInsertText('dijiguan', GameFight.getInstance().dupfight_waveIndex);
				length = ModelManager.getInstance().getModelLength('zhuxiantai');
				let zxAwardThing: ModelThing;
				for (let i: number = GameFight.getInstance().dupfight_waveIndex; i < length; i++) {
					let modelzhuxian: Modelzhuxiantai = JsonModelManager.instance.getModelzhuxiantai()[i];
					for (let idx in modelzhuxian.rewards) {
						let zxAwdItem: AwardItem = modelzhuxian.rewards[idx];
						if (zxAwdItem.id == GoodsDefine.ITEM_ID_CZSP) {
							zxAwardThing = GameCommon.getInstance().getThingModel(zxAwdItem.type, zxAwdItem.id);
							break;
						}
					}
					if (zxAwardThing) {
						special_desc = Language.instance.parseInsertText('tongguankeerwaihuode', modelzhuxian.id) + zxAwardThing.name;
						break;
					}
				}
				break;
			case DUP_TYPE.DUP_TEAM:
				let rankNum: number;
				let teamdupdata: TeamDupData;
				for (let i: number = 0; i < this.teamdupDatas.length; i++) {
					rankNum = i + 1;
					teamdupdata = this.teamdupDatas[i];
					if (teamdupdata.playerId == DataManager.getInstance().playerManager.player.id) {
						result_desc = Language.instance.getText('wodepaiming', rankNum, ' ', 'dps', teamdupdata.damageNum);
						break;
					}
				}
				let zuduimodel: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[GameFight.getInstance().dupfight_waveIndex];
				let teamMvpThing: ModelThing = GameCommon.getInstance().getModelThingByParam(zuduimodel.viprewards);
				special_desc = Language.instance.parseInsertText('MPVkedejiangli', teamMvpThing.name);
				break;
			case DUP_TYPE.DUP_VIP_TEAM:
				let vipteamdupdata: TeamDupData;
				for (let i: number = 0; i < this.teamdupDatas.length; i++) {
					vipteamdupdata = this.teamdupDatas[i];
					if (vipteamdupdata.playerId == this.teamOwnerId) {
						result_desc = Language.instance.getText('zhaohuanzhe', '：', vipteamdupdata.playerName);
						break;
					}
				}
				break;
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				let marryTeamDupData: TeamDupData;
				for (let i: number = 0; i < this.teamdupDatas.length; i++) {
					marryTeamDupData = this.teamdupDatas[i];
					if (marryTeamDupData.playerId == this.teamOwnerId) {
						result_desc = Language.instance.getText('zhaohuanzhe', '：', marryTeamDupData.playerName);
						break;
					}
				}
				break;
			case DUP_TYPE.DUP_XIANSHAN:
				special_desc = Language.instance.getText('gongxitongguan');
				DataManager.getInstance().xiandanManager.curLayer = DataManager.getInstance().xiandanManager.curLayer + 1;
				break;
			case DUP_TYPE.DUP_BLESS:
				special_desc = Language.instance.getText('gongxitongguan');
				break;
			case DUP_TYPE.DUP_LINGXING:
				special_desc = Language.instance.getText('gongxitongguan');
				break;
		}
		param.resultParam = result_desc;
		param.specialDesc = special_desc;
		if (this._dupinfo.dupModel.type == DUP_TYPE.DUP_SIXIANG) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("SixiangDupResultPanel", param));
		} else {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", param));
		}
	}
	//失败处理
	private onResultLoseHandler(): void {
		if (!this.isQuit) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupLosePanel", null));
		}
	}
	//关闭面板反馈
	private onCloseResultView(event: egret.Event): void {
		if (GameFight.getInstance().canContiuneDup(this._dupinfo.id)) {
			GameFight.getInstance().onSendEnterDupMsg(this._dupinfo.id);
		} else {
			this.mainscene.onReturnYewaiScene();
			if (this._rushData.back_goType > 0) {
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this._rushData.back_goType);
			}
		}
	}
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		switch (this._dupinfo.type) {
			case DUP_TYPE.DUP_ZHUFU:
				if (isHeroAtk) {
					let hurdEnemys: ActionBody[] = this.mainscene.heroBody.data.targets;
					if (hurdEnemys.indexOf(hurtBody) < 0) {
						return;
					}
					if (hurtBody.data.targets.length == 0) {
						hurtBody.onAddEnemyBodyList(this.mainscene.heroBodys);
					}
				}
				break;
			case DUP_TYPE.DUP_UNION:
				super.onBodyHurtHanlder(attacker, hurtBody, damage);
				if (!isHeroAtk && this.unionNpcBody && hurtBody === this.unionNpcBody) {
					if (this.unionBossAtkTime == 0) {
						this.unionBossAtkTime = this.lefttime + 1;
					}
					var damageHp: number = Math.floor((this.unionBossAtkTime - this.lefttime) / this.unionBossAtkTime * hurtBody.data.maxHp);
					var _currHp: number = hurtBody.data.maxHp - damageHp;
					if (_currHp < hurtBody.data.currentHp) {
						hurtBody.hp = _currHp;
					}
				}
				break;
			case DUP_TYPE.DUP_SIXIANG:
				if (isHeroAtk) {
					if (this._rushData.isBoss) {
						this.mainscene.getModuleLayer().onUpdateBossHpBar(hurtBody.data.currentHp, hurtBody.data.maxHp);
					}
				} else {
					if (this.sixiangNpcBody && hurtBody === this.sixiangNpcBody) {
						var losetime: number = this.sixiangAtkTime ? egret.getTimer() - this.sixiangAtkTime : 500;
						this.sixiangAtkTime = egret.getTimer();
						this.sixiangLeftTime = Math.max(0, this.sixiangLeftTime - losetime);
						var npcdata: BodyData = this.sixiangNpcBody.data;
						var currNpcHp: number = Math.floor(this.sixiangLeftTime / this.rushData.limittime * npcdata.maxHp);
						if (currNpcHp < npcdata.currentHp) {
							this.sixiangNpcBody.hp = currNpcHp;
						}
						if (currNpcHp <= 0) {
							this.onFightLose();
						}
					}
				}
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				super.onBodyHurtHanlder(attacker, hurtBody, damage);
				if (isHeroAtk && this._rushData.isBoss) {
					this.sendTeamDupHeartMsg(damage.value);
					hurtBody.addFlyFont(damage);
				}
				break;
			case DUP_TYPE.DUP_LINGXING:
				if (attacker.data.bodyType == BODY_TYPE.SELF) {
					this.currRound++;
					//伤害累计
					let addDamage: number = this.currRound * this.oneDamage;
					//本场战斗总伤害
					this.fight_info_bar['curr_damage_lab'].text = Math.min(this.upDamage, addDamage).toString();
					//总共对BOSS造成
					// this.fight_info_bar['total_damage_lab'].text = Math.min(this.totalDamage, this.startDamage + addDamage).toString();
					//BOSS触发技能剩余
					// var damageData: DamageData = new DamageData();
					// 		damageData.attacker = attacker;
					// 		damageData.scenetype = FIGHT_SCENE.DUP;
					// 		damageData.value = this.oneDamage;
					// 		damageData.fromDire = attacker.checkFace(hurtBody.x, hurtBody.y);
					// 		hurtBody.onHurt(damageData);
					// hurtBody.data.
					hurtBody.hp = hurtBody.data.maxHp - this.oneDamage * this.currRound;
					hurtBody.data.onRestHpInfo(hurtBody.data.maxHp - this.oneDamage * this.currRound, 0)
					this.mainscene.getModuleLayer().onUpdateBossHpBar(hurtBody.data.currentHp, hurtBody.data.maxHp);
					if (this.LiveRound > this.currRound) {
						let lefttime: number = Math.ceil((this.LiveRound - this.currRound) * 10 / this.LiveRound);
						this.fight_info_bar['live_left_lab'].text = '倒计时：' + lefttime;
					} else {
						this.fight_info_bar['live_left_lab'].text = '灰飞烟灭！';
						//BOSS进行一次秒杀式攻击
						if (!this.fulingBossBody.currTarget) {
							this.fulingBossBody.onAddEnemyBodyList([this.mainscene.heroBody]);
							this.fulingBossBody.currTarget = this.mainscene.heroBody;
						}
						if (this.LiveRound == this.currRound || this.currRound == this.LiveRound + 2) {
							this.fulingBossBody.data.getCanUseSkill();
							this.fulingBossBody.onAttack();
							//特效来袭
							this.onShowBossAtkEffect();
							// if (this.robots) {
							this.onShowBossSpeak('灰飞烟灭！');
							// }
							//BOSS对角色进行一次伤害
							var damageData1: DamageData = new DamageData();
							damageData1.attacker = hurtBody;
							damageData1.scenetype = FIGHT_SCENE.DUP;
							damageData1.value = this.mainscene.heroBody.data.maxHp + this.mainscene.heroBody.data.shieldValue;
							damageData1.fromDire = attacker.checkFace(attacker.x, attacker.y);
							attacker.onHurt(damageData1);
						}
					}
				}
			default:
				super.onBodyHurtHanlder(attacker, hurtBody, damage);
				break;
		}
	}
	//显示BOSS的说话
	private onShowBossSpeak(speak: string): void {
		this.fulingBossBody.bodySpeak(speak);
	}
	//场景显示BOSS的技能特效
	private onShowBossAtkEffect(): void {
		let effectPos: egret.Point = new egret.Point(this.fulingBossBody.x, this.fulingBossBody.y - (this.fulingBossBody.data.model.high / 2));
		let rotations: number[] = [0, 90, 180, 270];
		for (let i: number = 0; i < rotations.length; i++) {
			let anim = GameCommon.getInstance().addAnimation('kf_pveboss_skill', effectPos, this.mainscene.heroBody.parent, 1);
			anim.rotation = rotations[i];
		}
		effectPos = null;
	}
	//主角击杀目标
	public onKillTargetHandle(): void {
		super.onKillTargetHandle();
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_ZHUFU:
				if (this._status == FIGHT_STATUS.Fighting) {
					this.blessLeftCount = Math.max(this.blessLeftCount - 1, 0);
					this.onupdateBlessProInfo();
					if (this.blessLeftCount == 0) {
						this.onFightWin();
					}
				}
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				for (var i: number = 0; i < this.teamdupOthers.length; i++) {
					var otherbody: ActionBody = this.teamdupOthers[i];
					for (var tIdx: number = otherbody.data.targets.length - 1; tIdx >= 0; tIdx--) {
						var monsterbody: ActionBody = otherbody.data.targets[tIdx];
						if (!monsterbody || monsterbody.data.isDie) {
							otherbody.onRemoveTarget(monsterbody);
						}
					}
				}
				break;
		}
	}
	//更新祝福值副本的进度信息
	private onupdateBlessProInfo(): void {
		let modelZhufu: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex];
		let killCount: number = modelZhufu.maxNum - this.blessLeftCount;
		let countRewards: string[] = modelZhufu.numReward.split("#");
		for (let i: number = 0; i < 3; i++) {
			if (countRewards.length > i) {
				let awardboshu: number = Math.min(modelZhufu.maxNum, parseInt(countRewards[i]));
				(this.fight_info_bar['bless_box_img' + i] as eui.Image).source = awardboshu > killCount ? "jianchi_box_2_png" : "jianchi_box_1_png";
			}
		}
		this.fight_info_bar[`bless_pro_bar`].value = killCount;
		this.fight_info_bar[`bless_pronum_lab`].text = `${killCount}/${modelZhufu.maxNum}`;
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		var bornPoint: egret.Point;
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_CAILIAO://从地图的出生点出生
			case DUP_TYPE.DUP_CHALLENGE:
			case DUP_TYPE.DUP_UNION:
			case DUP_TYPE.DUP_ZHUFU:
			case DUP_TYPE.DUP_SIXIANG:
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
			case DUP_TYPE.DUP_XIANSHAN:
			case DUP_TYPE.DUP_BLESS:
				bornPoint = this.mainscene.mapInfo.getXYByGridIndex(this.mainscene.mapInfo.bronNodeId);
				break;
			case DUP_TYPE.DUP_PERSONALLY://从怪物的周围格子出生
				var gerenbossModel: Modelgerenboss = this._dupinfo.gerenModel;
				var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(gerenbossModel.point);
				var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 3);
				var ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
				bornPoint = this.mainscene.mapInfo.getXYByGridIndex(ramdomNode.nodeId);
				break;
			case DUP_TYPE.DUP_LINGXING:
				var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
				var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 2);
				var ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
				bornPoint = this.mainscene.mapInfo.getXYByGridIndex(ramdomNode.nodeId);
				break;
		}
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		var isFinish: boolean = false;
		var dupId: number = GameFight.getInstance().fightDupId;
		switch (this._dupinfo.type) {
			case DUP_TYPE.DUP_CAILIAO:
				isFinish = this._rushData.isBoss;
				if (!isFinish) {
					this.currPointIndex++;
				}
				break;
			case DUP_TYPE.DUP_ZHUFU:
				isFinish = this.blessLeftCount == 0;
				if (isFinish) {
					GameFight.getInstance().onSendBlessDupProgressMsg(1, 0);
				}
				break;
			case DUP_TYPE.DUP_SIXIANG:
				GameFight.getInstance().dupfight_waveIndex++;
				isFinish = JsonModelManager.instance.getModelsixiangfuben()[GameFight.getInstance().dupfight_waveIndex] ? false : true;
				GameFight.getInstance().onSendSixiangDupResultMsg();
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				if (this._rushData.isBoss) {
					this.currPointIndex = 0;
				} else {
					this.currPointIndex++;
				}
				var modelteamdup: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[GameFight.getInstance().dupfight_waveIndex];
				isFinish = modelteamdup.point.split("#").length == this.teamRushCount;
				break;
			case DUP_TYPE.DUP_PERSONALLY:
			case DUP_TYPE.DUP_CHALLENGE:
			case DUP_TYPE.DUP_XIANSHAN:
			case DUP_TYPE.DUP_BLESS:
			case DUP_TYPE.DUP_UNION:
				isFinish = true;
				break;
			case DUP_TYPE.DUP_LINGXING:
				this.fight_info_bar['curr_damage_lab'].text = this.upDamage.toString();
				//总共对BOSS造成
				// this.fight_info_bar['total_damage_lab'].text = this.totalDamage.toString();
				Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
				this.mainscene.getModuleLayer().onHideBossHpBar();
				Tool.callbackTime(this.onFinishFight, this, 1000);
				return;
		}

		if (isFinish) {
			this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
		} else {
			this.onFightHandler();
		}
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	protected onTouchLeaveBtn(): void {
		if (this._dupinfo.type == DUP_TYPE.DUP_TEAM || this._dupinfo.type == DUP_TYPE.DUP_VIP_TEAM || this._dupinfo.type == DUP_TYPE.DUP_MARRY || this._dupinfo.type == DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS) {
			var quitNotice = [{ text: Language.instance.getText("zhongtutuichushuoming") }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onQuitScene, this))
			);
		} else {
			this.onQuitScene();
		}
	}
	//组队副本轮询超时
	private onTeamDupTimeout(): void {
		GameCommon.getInstance().addAlert('error_tips_10003');
		this.mainscene.onReturnYewaiScene();
	}
	private isQuit: boolean;
	public onQuitScene(): void {
		this.isQuit = true;
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.DUP) {
			return;
		}
		if (this._dupinfo.type == DUP_TYPE.DUP_TEAM || this._dupinfo.type == DUP_TYPE.DUP_VIP_TEAM || this._dupinfo.type == DUP_TYPE.DUP_MARRY || this._dupinfo.type == DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS) {
			GameFight.getInstance().onSendQuitTeamDupMsg();
			this.mainscene.onReturnYewaiScene();
		} else if (this._dupinfo.type == DUP_TYPE.DUP_LINGXING) {
			var quitMsg: Message = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
			quitMsg.setByte(DUP_TYPE.DUP_LINGXING);
			GameCommon.getInstance().sendMsgToServer(quitMsg);
			this.mainscene.onReturnYewaiScene();
		}
		else {
			this.onFightLose();
			this.mainscene.onReturnYewaiScene();
		}
	}
	private onDistroyUnionDupBody(): void {
		if (this.unionBoossBody) {
			BodyFactory.instance.onRecovery(this.unionBoossBody);
			this.unionBoossBody = null;
		}
		if (this.unionNpcBody) {
			BodyFactory.instance.onRecovery(this.unionNpcBody);
			this.unionNpcBody = null;
		}
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_UNION:
				this.onDistroyUnionDupBody();
				GameFight.getInstance().unionCheerNum = 0;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				if (this.sixiangNpcBody) {
					this.sixiangNpcBody.onDestroy();
					this.sixiangNpcBody = null;
				}
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				this.stopTeamdupHeart();
				this.teamdupDatas = null;
				this.teamdupOthers = null;
				this.teamOwnerId = null;
				break;
		}
		this.isQuit = null;
		this.onStopDupTimer();
	}
	/***属性接口***/
	//根据地图出生点随机出角色出生点
	private getRandomRebornNode(): ModelMapNode {
		let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		let rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 2);
		let ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
		ramdomNode = ramdomNode ? ramdomNode : mapNode;
		return ramdomNode;
	}
	private onUpdateDupWave(): void {
		this._rushData.back_goType = 0;
		switch (this._dupinfo.dupModel.type) {
			case DUP_TYPE.DUP_CAILIAO:
				let modelCailiao: Modelcailiaofuben = JsonModelManager.instance.getModelcailiaofuben()[GameFight.getInstance().dupfight_waveIndex];
				let _rebornPoints: string[] = modelCailiao.point.split(",");
				this._rushData.isBoss = this.currPointIndex == _rebornPoints.length - 1;
				this._rushData.monsterId = this._rushData.isBoss ? modelCailiao.bossId : modelCailiao.monsterId;
				this._rushData.refreshGrid = parseInt(_rebornPoints[this.currPointIndex]);
				this._rushData.refreshNum = this._rushData.isBoss ? 1 : modelCailiao.num;
				this._rushData.back_goType = FUN_TYPE.FUN_DUP_CAILIAO;
				break;
			case DUP_TYPE.DUP_CHALLENGE:
				let modelZhuxian: Modelzhuxiantai = JsonModelManager.instance.getModelzhuxiantai()[GameFight.getInstance().dupfight_waveIndex];
				this._rushData.isBoss = true;
				this._rushData.monsterId = modelZhuxian.fightId;
				this._rushData.refreshGrid = modelZhuxian.point;
				this._rushData.refreshNum = 1;
				this._rushData.back_goType = FUN_TYPE.FUN_DUP_TIAOZHAN;
				break;
			case DUP_TYPE.DUP_PERSONALLY:
				let gerenbossModel: Modelgerenboss = this._dupinfo.gerenModel;
				this._rushData.isBoss = true;
				this._rushData.monsterId = gerenbossModel.bossId;
				this._rushData.refreshGrid = gerenbossModel.point;
				this._rushData.refreshNum = 1;
				this._rushData.back_goType = FUN_TYPE.FUN_GEREN_BOSS;
				break;
			case DUP_TYPE.DUP_UNION:
				let modelUnionDup: Modelguildfuben = JsonModelManager.instance.getModelguildfuben()[GameFight.getInstance().dupfight_waveIndex];
				this._rushData.isBoss = true;
				this._rushData.monsterId = modelUnionDup.fightId;
				this._rushData.refreshGrid = GameDefine.UnionDup_Boss_Node;
				this._rushData.refreshNum = 1;
				// this._rushData.back_goType = FUN_TYPE.FUN_GEREN_BOSS;
				break;
			case DUP_TYPE.DUP_ZHUFU:
				let modelZhufu: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[GameFight.getInstance().dupfight_waveIndex];
				let rushNum: number = Math.min(modelZhufu.rushNum, modelZhufu.maxNum - this.blessRushCount);
				this._rushData.monsterId = modelZhufu.monsterId;
				this._rushData.refreshGrid = this.mainscene.mapInfo.bronNodeId;
				this._rushData.refreshNum = rushNum;
				this._rushData.back_goType = FUN_TYPE.FUN_DUP_ZHUFU;
				this.blessRushCount += rushNum;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				let modelsixiang: Modelsixiangfuben = JsonModelManager.instance.getModelsixiangfuben()[GameFight.getInstance().dupfight_waveIndex];
				this._rushData.monsterId = modelsixiang.fighterId;
				this._rushData.refreshGrid = this.sixiangRushPoints[Math.floor(Math.random() * this.sixiangRushPoints.length)];
				this._rushData.refreshNum = modelsixiang.Num;
				this._rushData.isBoss = modelsixiang.Num == 1;
				this._rushData.limittime = modelsixiang.time * 1000;
				this._rushData.back_goType = FUN_TYPE.FUN_DUP_SIXIANG;
				break;
			case DUP_TYPE.DUP_TEAM:
			case DUP_TYPE.DUP_VIP_TEAM:
			case DUP_TYPE.DUP_MARRY:
			case DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS:
				let modelteamdup: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[GameFight.getInstance().dupfight_waveIndex];
				let bornPoints: string[] = modelteamdup.point.split("#")[this.teamRushCount].split(",");
				this._rushData.isBoss = true;
				this._rushData.monsterId = parseInt(modelteamdup.bossId.split(",")[this.teamRushCount]);
				this._rushData.refreshNum = 1;
				this._rushData.refreshGrid = parseInt(bornPoints[this.currPointIndex]);
				if (this._dupinfo.dupModel.type == DUP_TYPE.DUP_VIP_TEAM) {
					this._rushData.back_goType = FUN_TYPE.FUN_VIPTEAM;
				} else if (this._dupinfo.dupModel.type == DUP_TYPE.DUP_MARRY) {
					this._rushData.back_goType = FUN_TYPE.FUN_MARRY_DUP;
				} else if (this._dupinfo.dupModel.type == DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS) {
					this._rushData.back_goType = FUN_TYPE.FUN_MARRY_EQUIP_SUIT_DUP;
				} else {
					this._rushData.back_goType = FUN_TYPE.FUN_DUP_ZUDUI;
				}
				break;
			case DUP_TYPE.DUP_XIANSHAN:
				let modelxianshan: Modelxianshan = JsonModelManager.instance.getModelxianshan()[DataManager.getInstance().xiandanManager.curLayer];
				this._rushData.isBoss = true;
				this._rushData.monsterId = modelxianshan.fightId;
				this._rushData.refreshGrid = modelxianshan.point;
				this._rushData.refreshNum = 1;
				this._rushData.back_goType = FUN_TYPE.FUN_XIANSHAN;
				break;
			case DUP_TYPE.DUP_BLESS:
				let modelpeishi: Modelpeishiboss = JsonModelManager.instance.getModelpeishiboss()[DataManager.getInstance().newactivitysManager.blessTp];
				this._rushData.isBoss = true;
				this._rushData.monsterId = modelpeishi.bossId;
				this._rushData.refreshGrid = modelpeishi.point;
				this._rushData.refreshNum = 1;
				this._rushData.back_goType = FUN_TYPE.FUN_BLESSDUP;
				break;
			case DUP_TYPE.DUP_LINGXING:
				this._rushData.isBoss = true;
				this._rushData.monsterId = Constant.get('FULING_BOSS_MODEL_ID');
				this._rushData.refreshGrid = Number(Constant.get('FULING_BOSS_BORN'));
				this._rushData.refreshNum = 1;
				this._rushData.back_goType = FUN_TYPE.FUN_FULINGBOSS;
				break;
		}
	}
	//心跳间隔
	public get TickInterval(): number {
		if (this._dupinfo && (this._dupinfo.dupModel.type == DUP_TYPE.DUP_TEAM || this._dupinfo.dupModel.type == DUP_TYPE.DUP_VIP_TEAM || this._dupinfo.dupModel.type == DUP_TYPE.DUP_MARRY || this._dupinfo.dupModel.type == DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS)) {
			return 1000;
		}
		return 5000;
	}
	//The end
}