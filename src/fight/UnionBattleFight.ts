class UnionBattleFight extends BaseFightScene implements IFightScene {
	/**地图常量**/
	private MapId: number = 10023;
	private Map_A_Node: number = 233;//A帮会参战点
	private Map_B_Node: number = 235;//B帮会参战点
	private Map_AEnter_Node: number = 225;//A帮会的入场点
	private Map_BEnter_Node: number = 243;//B帮会的入场点
	private Map_Match_Node: number = 234;//观战点
	/**UI**/
	private union_badges_A: eui.Component;
	private union_badges_B: eui.Component;
	private xianhun_probar_A: eui.ProgressBar;
	private xianhun_probar_B: eui.ProgressBar;
	private xianhun_lab_A: eui.Label;
	private xianhun_lab_B: eui.Label;
	private unionA_name_lab: eui.Label;
	private unionB_name_lab: eui.Label;
	private unionA_level_lab: eui.Label;
	private unionB_level_lab: eui.Label;
	private ready_bar_A: eui.Group;
	private ready_bar_B: eui.Group;
	private readytimeA_lab: eui.Label;
	private readytimeB_lab: eui.Label;
	private player_bar_A: eui.ProgressBar;
	private player_bar_B: eui.ProgressBar;
	private playerA_Hp_Lab: eui.Label;
	private playerB_Hp_Lab: eui.Label;
	private btn_fight: eui.Button;
	private guwu_btn: eui.Button;
	private fight_rule_lab: eui.Label;
	private inspire_times_lab: eui.Label;
	private unionA_inspireinfo_lab: eui.Label;
	private unionB_inspireinfo_lab: eui.Label;
	private minChat_lab: eui.Label;
	private label_input: eui.Label;
	private chatwicket: eui.Group;
	private btn_send: eui.Button;
	private chat_scroller: eui.Scroller;
	private reborn_time_lab: eui.Label;
	private life_lefttimes_lab: eui.Label;
	/**A帮会信息**/
	private unionA_FightInfo: FightUnionInfo;//A帮会信息
	private unionA_Fighter: PlayerBody;//A帮会的出战者
	private fighterA_MaxHp: number;//总血量
	private fighterA_CurHp: number;//当前血量
	private fighterA_EndHp: number;//结束血量
	private A_Lost_HP: number;//A方本次战斗总掉血
	private A_Shield_Num: number;//A开场时的血量
	private A_Reborn_Num: number;//A本场战斗复活的血量
	private A_End_RebornNum: number;//A战斗结束剩余复活次数
	private unionA_PlayerName: string;//A帮会的名字
	private unionA_memberDatas;
	private unionA_members: PlayerBody[];
	private unionA_witness: PlayerBody[];
	private MemberA_Pos_Ary: number[] = [223, 295, 154, 298];
	private WitnessA_Pos_Ary: number[] = [194, 302];
	/**B帮会信息**/
	private unionB_FightInfo: FightUnionInfo;//B帮会信息
	private unionB_Fighter: PlayerBody;//B帮会的出战者
	private fighterB_MaxHp: number;
	private fighterB_CurHp: number;
	private fighterB_EndHp: number;
	private B_Lost_HP: number;//B方本次战斗总掉血
	private B_Shield_Num: number;//B开场时的血量
	private B_Reborn_Num: number;//B本场战斗复活的血量
	private B_End_RebornNum: number;//B战斗结束剩余复活次数
	private unionB_PlayerName: string;
	private unionB_memberDatas;
	private unionB_members: PlayerBody[];
	private unionB_witness: PlayerBody[];
	private MemberB_Pos_Ary: number[] = [209, 281, 170, 314];
	private WitnessB_Pos_Ary: number[] = [203, 311];
	/**变量**/
	private fightTotalTime: number = 0;//战斗总时间
	private fightLefttime: number = 0;//战斗剩余时间
	private readyLefttime: number = 0;//准备的剩余时间
	private winnerId: number = 0;//获胜者的ID
	private rebornTime: number = 0;//复活时间
	private deathTimes: number = 0;//复活次数
	private fightPosition: number = 0;//0代表我是观战者 1代表我是A方参战者  2代表我是B方参战者
	private battleChats: ChatBase[];
	private playRunTime: number = 0;
	private followBody: PlayerBody;
	private isEntranceAnim: boolean;//是否在播入场动画
	private isInit: boolean;

	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_FIGHT_MESSAGE.toString(), this.onReciveFightMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_FIGHTRESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_BUYBUFF_MESSAGE.toString(), this.onReciveBuyBuffMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_COMEIN_MESSAGE.toString(), this.onReciveComeinMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.reciveChatMsg, this);
		// GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		this.btn_fight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJoinBattle, this);
		this.guwu_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openInspireView, this);
		this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendChatMsg, this);
		Tool.addTimer(this.onFightTimeDown, this, 10);

	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_FIGHT_MESSAGE.toString(), this.onReciveFightMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_FIGHTRESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_BUYBUFF_MESSAGE.toString(), this.onReciveBuyBuffMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_COMEIN_MESSAGE.toString(), this.onReciveComeinMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.reciveChatMsg, this);
		// GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		this.btn_fight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onJoinBattle, this);
		this.guwu_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openInspireView, this);
		this.btn_send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendChatMsg, this);
		Tool.removeTimer(this.onFightTimeDown, this, 50);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.UnionBattleFightSkin;
			this.fight_info_bar.x = Globar_Pos.x;
			this.fight_info_bar.y = 0;
			this.fight_info_bar.height = size.height;
			/**初始化UI**/
			this.union_badges_A = this.fight_info_bar['union_badges_A'];
			this.union_badges_B = this.fight_info_bar['union_badges_B'];
			this.xianhun_probar_A = this.fight_info_bar['xianhun_probar_A'];
			this.xianhun_probar_B = this.fight_info_bar['xianhun_probar_B'];
			this.xianhun_lab_A = this.fight_info_bar['xianhun_lab_A'];
			this.xianhun_lab_B = this.fight_info_bar['xianhun_lab_B'];
			this.unionA_name_lab = this.fight_info_bar['unionA_name_lab'];
			this.unionB_name_lab = this.fight_info_bar['unionB_name_lab'];
			this.unionA_level_lab = this.fight_info_bar['unionA_level_lab'];
			this.unionB_level_lab = this.fight_info_bar['unionB_level_lab'];
			this.ready_bar_A = this.fight_info_bar['ready_bar_A'];
			this.ready_bar_B = this.fight_info_bar['ready_bar_B'];
			this.readytimeA_lab = this.fight_info_bar['readytimeA_lab'];
			this.readytimeB_lab = this.fight_info_bar['readytimeB_lab'];
			this.player_bar_A = this.fight_info_bar['player_bar_A'];
			this.player_bar_B = this.fight_info_bar['player_bar_B'];
			this.btn_fight = this.fight_info_bar['fight_btn'];
			this.guwu_btn = this.fight_info_bar['guwu_btn'];
			this.playerA_Hp_Lab = this.player_bar_A['hp_label'];
			this.playerB_Hp_Lab = this.player_bar_B['hp_label'];
			this.fight_rule_lab = this.fight_info_bar['fight_rule_lab'];
			this.inspire_times_lab = this.fight_info_bar['inspire_times_lab'];
			this.unionA_inspireinfo_lab = this.fight_info_bar['unionA_inspireinfo_lab'];
			this.unionB_inspireinfo_lab = this.fight_info_bar['unionB_inspireinfo_lab'];
			this.minChat_lab = this.fight_info_bar['minChat_lab'];
			this.label_input = this.fight_info_bar['label_input'];
			this.chatwicket = this.fight_info_bar['chatwicket'];
			this.btn_send = this.fight_info_bar['btn_send'];
			this.chat_scroller = this.fight_info_bar['chat_scroller'];
			this.reborn_time_lab = this.fight_info_bar['reborn_time_lab'];
			this.life_lefttimes_lab = this.fight_info_bar['life_lefttimes_lab'];
		}
		this.player_bar_A.visible = false;
		this.player_bar_B.visible = false;
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	//获取主角的数据
	private get heroPlayer(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	//我的公会信息
	private get myUnionData(): MyUnionData {
		return DataManager.getInstance().unionManager.unionInfo;
	}
	//我的工会战斗信息
	private get myBattleInfo(): FightUnionInfo {
		if (this.fightPosition == 1) {
			return this.unionA_FightInfo;
		} else if (this.fightPosition == 2) {
			return this.unionB_FightInfo;
		}
		return null;
	}
	/******--------聊天相关---------*******/
	//根据log类型 参数  解析出Log要表现的内容
	private parseBattleLogStr(type: number, param: string[]): string {
		return Language.instance.parseInsertText('unionbattle_notice' + type, ...param);
	}
	private addOneBattleLog(type: number, param: string[]): void {
		let chatbase: ChatBase = new ChatBase(CHANNEL.SYS);
		chatbase.content = this.parseBattleLogStr(type, param);
		this.addBattleChatText([chatbase]);
	}
	//添加聊天及战报信息
	private addBattleChatText(chatInfos: ChatBase[] = null): void {
		if (chatInfos) {
			for (let i: number = 0; i < chatInfos.length; i++) {
				let base: ChatBase = chatInfos[i];
				this.battleChats.push(base);
				if (this.battleChats.length > 100) {
					this.battleChats.shift();
				}
			}
		}
		let ret: egret.ITextElement[] = [];
		var curr: egret.ITextElement[] = [];
		let base: ChatBase;
		for (let i: number = 0; i < this.battleChats.length; i++) {
			base = this.battleChats[i];
			switch (base.type) {
				case CHANNEL.GUILD:
					ret.push({ text: "[仙盟]", style: { textColor: 0xce2af1 } });
					ret.push({ text: "[" + UnionDefine.Union_Postions[base.job] + "]", style: { textColor: 0xce2af1 } });
					ret.push({ text: GameCommon.getInstance().getNickname(base.player.name) + ":", style: { textColor: 0x289aea } });
					ret.push({ text: base.content, style: { textColor: 0XFFFFFF } });
					ret.push({ text: "\n", style: {} });
					break;
				case CHANNEL.SYS:
					base.content = GameCommon.getInstance().readStringToHtml(base.content);
					ret.push({ text: "[系统]", style: { textColor: 0xffae21 } });
					curr = (new egret.HtmlTextParser).parser(base.content);
					for (let j: number = 0; j < curr.length; j++) {
						ret.push(curr[j]);
					}
					ret.push({ text: "\n", style: {} });
					break;
			}
		}
		this.minChat_lab.textFlow = ret;
		if (!this.checkNotBottom()) {
			setTimeout(this.adjustBar.bind(this), 50);
		}
	}
	private adjustBar() {
		this.chat_scroller.stopAnimation();
		this.chat_scroller.viewport.scrollV = Math.max(this.chat_scroller.viewport.contentHeight - this.chat_scroller.viewport.height, 0);
	}
	private checkNotBottom(): boolean {
		if (this.chat_scroller.viewport.contentHeight > this.chat_scroller.viewport.height && this.chat_scroller.viewport.scrollV < this.chat_scroller.viewport.contentHeight - this.chat_scroller.viewport.height - 50)
			return true;
		else
			return false;
	}
	//接收到聊天信息
	private reciveChatMsg(event: GameMessageEvent): void {
		if (DataManager.getInstance().chatManager.currType != CHANNEL.GUILD) return;
		let chatbase: ChatBase = event.message;
		if (chatbase.type != CHANNEL.GUILD) return;
		this.addBattleChatText([chatbase]);
	}
	//发送聊天信息
	private onSendChatMsg(): void {
		let sendStr: string = this.label_input.text;
		let message = new Message(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE);
		message.setByte(CHANNEL.GUILD);//注：后期增加频道需要改动对应类型
		message.setString(sendStr);
		message.setInt(-1);
		GameCommon.getInstance().sendMsgToServer(message);
		this.label_input.text = '';
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);
		this.battleChats = [];
		this.unionA_memberDatas = {};
		this.unionB_memberDatas = {};
		this.unionA_members = [];
		this.unionB_members = [];
		this.readyLefttime = msg.getByte() * 1000 + egret.getTimer();
		this.fightPosition = 0;

		let playerData: PlayerData;
		let rolesize: number;
		let battleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
		let unionA_ID: number = msg.getInt();
		this.unionA_FightInfo = battleInfo.getUnionFightInfoById(unionA_ID);
		this.unionA_FightInfo.score = msg.getByte();
		// let unionA_Has_Player: boolean = msg.getBoolean();
		// if (unionA_Has_Player) {
		// this.fighterA_CurHp = msg.getLong();
		// this.fighterA_MaxHp = msg.getLong();
		// playerData = GameFight.getInstance().onParsePVPEnemyMsg(msg, false)[0];
		// this.onCreateFightBody(unionA_ID, playerData);
		// }
		if (this.myUnionData.info.id == this.unionA_FightInfo.unionId) {
			this.fightPosition = 1;
		}
		rolesize = msg.getByte();
		for (let i: number = 0; i < rolesize; i++) {
			this.parseEnterMember(msg, unionA_ID);
		}

		let unionB_ID: number = msg.getInt();
		this.unionB_FightInfo = battleInfo.getUnionFightInfoById(unionB_ID);
		this.unionB_FightInfo.score = msg.getByte();
		// let unionB_Has_Player: boolean = msg.getBoolean();
		// if (unionB_Has_Player) {
		// this.fighterB_CurHp = msg.getLong();
		// this.fighterB_MaxHp = msg.getLong();
		// playerData = GameFight.getInstance().onParsePVPEnemyMsg(msg, false)[0];
		// this.onCreateFightBody(unionB_ID, playerData);
		// }
		if (this.myUnionData.info.id == this.unionB_FightInfo.unionId) {
			this.fightPosition = 2;
		}
		rolesize = msg.getByte();
		for (let i: number = 0; i < rolesize; i++) {
			this.parseEnterMember(msg, unionB_ID);
		}

		this.rebornTime = msg.getInt() * 1000 + egret.getTimer();
		this.deathTimes = msg.getByte();

		//帮会战LOG
		let logsize: number = msg.getByte();
		for (let i: number = 0; i < logsize; i++) {
			let logmessage: string = msg.getString();
			let param: string[] = logmessage.split('#');
			let logtext: string = this.parseBattleLogStr(parseInt(param[0]), param[1].split(','));
			let chatInfo: ChatBase = new ChatBase(CHANNEL.SYS);
			chatInfo.content = logtext;
			this.battleChats.push(chatInfo);
		}
		//切换地图
		this.onSwitchMap(this.MapId);
	}
	//接受到帮会玩家进入场景的消息
	private onReciveComeinMsg(msg: Message): void {
		let unionId: number = msg.getInt();
		this.parseEnterMember(msg, unionId);
	}
	//战场进入玩家
	private parseEnterMember(msg: Message, unionID: number): void {
		let playerId = msg.getInt();
		let playerName = msg.getString();
		let unionJob = msg.getByte();
		let appear: PlayerAppears = new PlayerAppears();
		appear.parseMsg(msg);

		let playerData: PlayerData;
		if (unionID == this.unionA_FightInfo.unionId) {
			if (!this.unionA_memberDatas[playerId]) {
				playerData = new PlayerData(1, BODY_TYPE.PLAYER);
				playerData.playerId = playerId;
				playerData.name = playerName + "·" + UnionDefine.Union_Postions[unionJob];
				playerData.index = 0;
				playerData.sex = appear.appears[0].sex;
				playerData.setAppear(appear.appears[0]);

				this.unionA_memberDatas[playerId] = playerData;
			}
		} else if (unionID == this.unionB_FightInfo.unionId) {
			if (!this.unionB_memberDatas[playerId]) {
				playerData = new PlayerData(1, BODY_TYPE.PLAYER);
				playerData.playerId = playerId;
				playerData.name = playerName + "·" + UnionDefine.Union_Postions[unionJob];
				playerData.index = 0;
				playerData.sex = appear.appears[0].sex;
				playerData.setAppear(appear.appears[0]);

				this.unionB_memberDatas[playerId] = playerData;
			}
		}
	}
	//更新积分
	private onUpdateScore(): void {
		let unionA_Score: number = UnionDefine.UNIONBATTLE_SCORE_MAX - this.unionB_FightInfo.score;
		this.xianhun_lab_A.text = Language.instance.getText('unionbattle_score') + ":" + unionA_Score + "/" + UnionDefine.UNIONBATTLE_SCORE_MAX;
		let unionB_Score: number = UnionDefine.UNIONBATTLE_SCORE_MAX - this.unionA_FightInfo.score;
		this.xianhun_lab_B.text = Language.instance.getText('unionbattle_score') + ":" + unionB_Score + "/" + UnionDefine.UNIONBATTLE_SCORE_MAX;
		this.xianhun_probar_A.value = unionA_Score;
		this.xianhun_probar_B.value = unionB_Score;
	}
	//初始化玩家头像信息
	private onUpdatePlayerHead(): void {
		let hpPercent: number = 0;
		if (this.unionA_Fighter) {
			hpPercent = this.getHpPercent(this.fighterA_CurHp, this.fighterA_MaxHp);
			(this.player_bar_A['playerHead'] as PlayerHeadPanel).setHead(this.unionA_Fighter.data.headiconIdx, this.unionA_Fighter.data.headFrame);
			(this.player_bar_A['name_lab'] as eui.Label).text = this.unionA_Fighter.data.name;
			this.player_bar_A.maximum = 100;
			this.player_bar_A.value = hpPercent;
			this.playerA_Hp_Lab.text = hpPercent + '%';

			this.ready_bar_A.visible = false;
			if (!this.player_bar_A.visible) {
				this.player_bar_A.visible = true;
			}
		} else {
			this.player_bar_A.visible = false;
			this.ready_bar_A.visible = true;
		}

		if (this.unionB_Fighter) {
			this.ready_bar_B.visible = false;
			hpPercent = this.getHpPercent(this.fighterB_CurHp, this.fighterB_MaxHp);
			(this.player_bar_B['playerHead'] as PlayerHeadPanel).setHead(this.unionB_Fighter.data.headiconIdx, this.unionB_Fighter.data.headFrame);
			(this.player_bar_B['name_lab'] as eui.Label).text = this.unionB_Fighter.data.name;
			this.player_bar_B.maximum = 100;
			this.player_bar_B.value = hpPercent;
			this.playerB_Hp_Lab.text = hpPercent + '%';

			if (!this.player_bar_B.visible) {
				this.player_bar_B.visible = true;
			}
		} else {
			this.player_bar_B.visible = false;
			this.ready_bar_B.visible = true;
		}
	}
	//接收到战斗的协议
	private onReciveFightMsg(): void {
		let msg: Message = GameFight.getInstance().unionbattlePkMsg;
		let ismidway: boolean = this.isInit;

		if (!GameFight.getInstance().unionbattlePkMsg) return;
		if (this.isFightting) return;

		let A_is_new: boolean = ismidway || this.unionA_Fighter ? false : true;
		let B_is_new: boolean = ismidway || this.unionB_Fighter ? false : true;
		this.unionA_PlayerName = null;
		this.unionB_PlayerName = null;
		// this.unionA_Fighter = null;
		// this.unionB_Fighter = null;
		// this.mainscene.getBodyManager().onDestroyOtherBodys();

		let fightTime: number = msg.getLong();
		let fightRound: number = msg.getShort();
		this.fightTotalTime = Math.min(fightRound * 500, UnionDefine.UNION_BATTLE_OVER_TIME - 1000);

		let playersize: number = msg.getByte();
		for (let i: number = 0; i < playersize; i++) {
			let unionID: number = msg.getInt();
			let playerCurHp: number = msg.getLong();
			let playerEndHp: number = msg.getLong();
			let playerMaxHp: number = msg.getLong();
			let leftReborn: number = msg.getByte();
			let playerData: PlayerData = GameFight.getInstance().onParsePVPEnemyMsg(msg, false)[0];
			if (this.unionA_FightInfo.unionId == unionID) {
				this.unionA_PlayerName = playerData.name;
				this.fighterA_MaxHp = playerMaxHp;
				this.fighterA_CurHp = playerCurHp;
				this.fighterA_EndHp = playerEndHp;
				this.A_End_RebornNum = leftReborn;
			} else if (this.unionB_FightInfo.unionId == unionID) {
				this.unionB_PlayerName = playerData.name;
				this.fighterB_MaxHp = playerMaxHp;
				this.fighterB_CurHp = playerCurHp;
				this.fighterB_EndHp = playerEndHp;
				this.B_End_RebornNum = leftReborn;
			}
			this.onCreateFightBody(unionID, playerData);
		}
		this.onUpdatePlayerHead();

		if (this.unionA_Fighter && this.unionB_Fighter && ismidway) {//是不是中途进入 第一次解析的时候如果
			fightTime = fightTime + this.fightTotalTime;
			this.fightLefttime = Math.max(0, fightTime - this.heroPlayer.curServerTime + egret.getTimer());
		} else {
			this.fightLefttime = 0;
		}

		let targetPoint: egret.Point;
		let mapNodeId: number;
		if (this.unionA_Fighter) {
			mapNodeId = A_is_new ? this.Map_AEnter_Node : this.Map_A_Node;
			if (!this.unionA_Fighter.parent) {
				if (this.unionA_Fighter.data.playerId == this.heroPlayer.getPlayerData().playerId) {
					targetPoint = this.mapInfo.getGridRdXYByIndex(mapNodeId);
					this.mainscene.setHeroMapPostion(targetPoint);
				} else {
					let nodeModel: ModelMapNode = this.mapInfo.getNodeModelByIndex(mapNodeId);
					this.mainscene.getBodyManager().setOtherPlayerPos(this.unionA_Fighter, [nodeModel]);
				}
			}
			if (A_is_new) {
				targetPoint = this.mainscene.mapInfo.getXYByGridIndex(this.Map_A_Node);
				this.unionA_Fighter.setMove([targetPoint]);
				this.onCameraFollow(this.unionA_Fighter, this.unionA_FightInfo.unionId);
				let jobname: string = this.getJobNameByPlayerId(this.unionA_Fighter.data.playerId, this.unionA_members);
				this.memberSpeak(this.unionA_Fighter, this.unionA_members, jobname);
				this.witnessSpeak(this.unionA_Fighter, this.unionA_witness);
			} else {
				this.unionA_Fighter.direction = Direction.RIGHT;
			}
		}

		if (this.unionB_Fighter) {
			mapNodeId = B_is_new ? this.Map_BEnter_Node : this.Map_B_Node;
			if (!this.unionB_Fighter.parent) {
				if (this.unionB_Fighter.data.playerId == this.heroPlayer.getPlayerData().playerId) {
					targetPoint = this.mapInfo.getGridRdXYByIndex(mapNodeId);
					this.mainscene.setHeroMapPostion(targetPoint);
				} else {
					let nodeModel: ModelMapNode = this.mapInfo.getNodeModelByIndex(mapNodeId);
					this.mainscene.getBodyManager().setOtherPlayerPos(this.unionB_Fighter, [nodeModel]);
				}
			}
			if (B_is_new) {
				targetPoint = this.mainscene.mapInfo.getXYByGridIndex(this.Map_B_Node);
				this.unionB_Fighter.setMove([targetPoint]);
				this.onCameraFollow(this.unionB_Fighter, this.unionB_FightInfo.unionId);
				let jobname: string = this.getJobNameByPlayerId(this.unionB_Fighter.data.playerId, this.unionB_members);
				this.memberSpeak(this.unionB_Fighter, this.unionB_members, jobname);
				this.witnessSpeak(this.unionB_Fighter, this.unionB_witness);
			} else {
				this.unionB_Fighter.direction = Direction.LEFT;
			}
		}

		if (this.unionB_Fighter && this.unionA_Fighter) {
			if (this.fighterA_EndHp > 0) {
				this.winnerId = this.unionA_Fighter.data.playerId;
			} else {
				this.winnerId = this.unionB_Fighter.data.playerId;
			}
			this.onPlayPKFight(ismidway);
		}

		GameFight.getInstance().unionbattlePkMsg = null;
	}
	//创建出战的玩家
	private onCreateFightBody(unionID: number, playerData: PlayerData): void {
		if (this.unionA_FightInfo.unionId == unionID) {
			if (playerData.playerId == this.heroPlayer.getPlayerData().playerId) {
				if (!this.unionA_Fighter) {
					this.mainscene.heroBody.data.onRebirth();
					this.mainscene.heroBody.onRefreshData();
				}
				this.unionA_Fighter = this.mainscene.heroBody;
			} else {
				if (this.unionA_Fighter) {
					playerData.onRebirth();
					playerData.shieldValue = this.unionA_Fighter.data.shieldValue;
					playerData.reborncount = this.unionA_Fighter.data.reborncount;
					this.unionA_Fighter.data = playerData;
				} else {
					this.unionA_Fighter = this.mainscene.getBodyManager().onCreateOtherPlayer(playerData);
				}
			}
			if (this.unionA_Fighter.data.shieldValue > 0 && this.fighterA_CurHp < this.fighterA_MaxHp) {
				this.unionA_Fighter.data.shieldValue = 0;
				this.unionA_Fighter.removeShieldAnim();
			}
			this.unionA_Fighter.onShowOrHideHpBar(false);
		} else if (this.unionB_FightInfo.unionId == unionID) {
			if (playerData.playerId == this.heroPlayer.getPlayerData().playerId) {
				if (!this.unionB_Fighter) {
					this.mainscene.heroBody.data.onRebirth();
					this.mainscene.heroBody.onRefreshData();
				}
				this.unionB_Fighter = this.mainscene.heroBody;
			} else {
				if (this.unionB_Fighter) {
					playerData.onRebirth();
					playerData.shieldValue = this.unionB_Fighter.data.shieldValue;
					playerData.reborncount = this.unionB_Fighter.data.reborncount;
					this.unionB_Fighter.data = playerData;
				} else {
					this.unionB_Fighter = this.mainscene.getBodyManager().onCreateOtherPlayer(playerData);
				}
			}
			if (this.unionB_Fighter.data.shieldValue > 0 && this.fighterB_CurHp < this.fighterB_MaxHp) {
				this.unionB_Fighter.data.shieldValue = 0;
				this.unionB_Fighter.removeShieldAnim();
			}
			this.unionB_Fighter.onShowOrHideHpBar(false);
		}

		this.onUpdatePlayerHead();
	}
	//摄像机视角跟随
	private onCameraFollow(playerbody: PlayerBody, unionID: number): void {
		this.playRunTime = UnionDefine.UNIONBATTLE_RUNTIME + egret.getTimer();
		if (this.followBody) return;
		if (this.fightPosition > 0) {
			if (this.fightPosition == 1 && !this.unionA_Fighter) {
				return;
			} else if (this.fightPosition == 2 && !this.unionB_Fighter) {
				return;
			}
		}
		this.followBody = playerbody;
		this.updateMemberBodys(unionID);
		this.onFightTimeDown();
	}
	//从观战者信息中获取帮派职位
	private getJobNameByPlayerId(playerid, datas): string {
		let jobname: string = '';
		for (let idx in datas) {
			let playerdata: PlayerData = datas[idx];
			if (playerid == playerdata.playerId) {
				jobname = playerdata.name;
				break;
			}
		}
		return jobname;
	}
	//判断是不是在战斗中
	private get isFightting(): boolean {
		return this.winnerId > 0;
	}
	//战斗场景计时器
	private stampTime: number = 0;
	private onFightTimeDown(): void {
		if (this.stampTime < egret.getTimer()) {
			switch (this._status) {
				case FIGHT_STATUS.Requset:
					let signupTime: number = Math.max(0, Math.ceil((this.readyLefttime - egret.getTimer()) / 1000));
					let isWaiting: boolean = null;
					if (UnionDefine.UNIONBATTLE_LIFE_TIMES > this.deathTimes) {
						switch (this.fightPosition) {
							case 1:
								isWaiting = this.unionA_Fighter ? true : false;
								break;
							case 2:
								isWaiting = this.unionB_Fighter ? true : false;
								break;
						}
						if (isWaiting != null) {
							if (isWaiting) {
								if (this.btn_fight.enabled) {
									this.btn_fight.enabled = false;
									this.btn_fight.label = Language.instance.getText('unionbattle_wait');
								}
							} else {
								if (!this.btn_fight.enabled) {
									this.btn_fight.enabled = true;
								}
								this.btn_fight.label = Language.instance.parseInsertText('unionbattle_join', signupTime);
							}
						}
					} else {
						if (this.btn_fight.enabled) {
							this.btn_fight.enabled = false;
							this.btn_fight.label = Language.instance.getText('error_tips_10002');
						}
					}

					if (this.ready_bar_A.visible) {
						this.readytimeA_lab.text = signupTime + 'S';
					}
					if (this.ready_bar_B.visible) {
						this.readytimeB_lab.text = signupTime + 'S';
					}
					break;
				case FIGHT_STATUS.Fighting:
					if (!this.isFightting) break;
					if (this.fightLefttime <= 0) break;
					let lefttime: number = Math.max(0, this.fightLefttime - egret.getTimer());
					// egret.log(`~~<公会战> 战斗当前的剩余时间${lefttime}毫秒~~~~!`);

					let hpPercent: number = 0;//当前血量百分比
					let curr_A_lost: number = this.A_Lost_HP - Tool.toInt(this.A_Lost_HP * (lefttime / this.fightTotalTime));
					let playerA_Hp: number = this.fighterA_CurHp + this.A_Shield_Num - curr_A_lost;
					if (playerA_Hp <= 0) {
						if (this.unionA_Fighter.data.reborncount > 0) {
							this.unionA_Fighter.data.reborncount = 0;
							this.unionA_Fighter.onPlayRebornAnim();
						}
						playerA_Hp = Math.max(0, this.A_Reborn_Num + playerA_Hp);
					}
					hpPercent = this.getHpPercent(playerA_Hp, this.fighterA_MaxHp);
					this.player_bar_A.value = hpPercent;
					this.playerA_Hp_Lab.text = hpPercent + '%';
					//检测护盾
					if (this.unionA_Fighter.data.shieldValue > 0 && hpPercent < 100) {
						this.unionA_Fighter.data.shieldValue = 0;
						this.unionA_Fighter.removeShieldAnim();
					}
					// egret.log(`~~<公会战> A方角色的血量为${hpPercent}%%%%~~~~!`);

					let curr_B_lost: number = this.B_Lost_HP - Tool.toInt(this.B_Lost_HP * (lefttime / this.fightTotalTime));
					let playerB_Hp: number = this.fighterB_CurHp + this.B_Shield_Num - curr_B_lost;
					if (playerB_Hp <= 0) {
						if (this.unionB_Fighter.data.reborncount > 0) {
							this.unionB_Fighter.data.reborncount = 0;
							this.unionB_Fighter.onPlayRebornAnim();
						}
						playerB_Hp = Math.max(0, this.B_Reborn_Num + playerB_Hp);
					}
					hpPercent = this.getHpPercent(playerB_Hp, this.fighterB_MaxHp);
					this.player_bar_B.value = hpPercent;
					this.playerB_Hp_Lab.text = hpPercent + '%';
					//检测护盾
					if (this.unionB_Fighter.data.shieldValue > 0 && hpPercent < 100) {
						this.unionB_Fighter.data.shieldValue = 0;
						this.unionB_Fighter.removeShieldAnim();
					}
					// egret.log(`~~<公会战> B方角色的血量为${hpPercent}%%%%~~~~!`);

					if (playerA_Hp == 0 || playerB_Hp == 0 || lefttime == 0) {
						this.onOverPKFight();
					}
					break;
			}
			/**复活逻辑**/
			if (this.rebornTime > 0 && this.fightPosition > 0) {
				let lefttime: number = Math.floor((this.rebornTime - egret.getTimer()) / 1000);
				if (lefttime >= 0) {
					let lefttimeDesc: string = GameCommon.getInstance().getTimeStrForSec1(lefttime);
					this.reborn_time_lab.text = Language.instance.getText('shengyu', 'fuhuoshijian') + "：" + lefttimeDesc;
				} else {
					this.rebornTime = 0;
					this.reborn_time_lab.text = '';
				}
				this.updateFightBtnStatus();
			}
			this.stampTime = egret.getTimer() + 500;
		}

		/**视角逻辑**/
		if (this.playRunTime > 0) {
			let runlefttime: number = Math.ceil((this.playRunTime - egret.getTimer()) / 1000);
			if (runlefttime > 0 && this.followBody) {
				if (this.followBody.data.playerId != DataManager.getInstance().playerManager.player.id) {
					this.mainscene.getMapLayer().onCameraFollowForBody(this.followBody);
				}

			} else {
				this.playRunTime = 0;
				this.followBody = null;
				this.mainscene.getMapLayer().onCameraFollowForBody(null);
				if (this._status == FIGHT_STATUS.Fighting) {
					this.unionA_Fighter.onAddEnemyBodyList([this.unionB_Fighter]);
					this.unionB_Fighter.onAddEnemyBodyList([this.unionA_Fighter]);
				}
			}
		}
	}
	//更新复活次数
	private set deathCount(value: number) {
		this.deathTimes = value;
		if (this.fightPosition > 0) {
			let left_reborn_times: number = Math.max(0, UnionDefine.UNIONBATTLE_LIFE_TIMES - value);
			this.life_lefttimes_lab.text = Language.instance.getText('shengyu', 'fuhuocishu') + "：" + left_reborn_times + "/" + UnionDefine.UNIONBATTLE_LIFE_TIMES;
		} else {
			this.life_lefttimes_lab.text = '';
		}
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		let msg: Message = event.message;
		let union1_ID: number = msg.getInt();
		let score1: number = msg.getByte();
		let union2_ID: number = msg.getInt();
		let score2: number = msg.getByte();
		if (union1_ID == this.unionA_FightInfo.unionId) {
			this.unionA_FightInfo.score = score1;
			this.unionB_FightInfo.score = score2;
		} else if (union2_ID == this.unionA_FightInfo.unionId) {
			this.unionA_FightInfo.score = score2;
			this.unionB_FightInfo.score = score1;
		}

		this._status = FIGHT_STATUS.Requset;
		// this.mainscene.getBodyManager().fightPause = true;
		this.guwu_btn.visible = this.fightPosition > 0;
		this.updateFightBtnStatus();

		this.onUpdateScore();

		if (!this.unionA_PlayerName && !this.unionB_PlayerName) {//无人出战
			this.addOneBattleLog(UnionBattle_Log.NOBODY_FIGHT, []);
		} else if (this.unionA_PlayerName && this.unionB_PlayerName) {//战斗结果
			let paramstr: string[] = ['', ''];
			if (!this.unionA_Fighter) {
				paramstr[0] = `${this.unionB_FightInfo.name}的${this.unionB_PlayerName}`;
				paramstr[1] = `${this.unionA_FightInfo.name}的${this.unionA_PlayerName}`;
				this.unionA_PlayerName = null;
			} else {
				paramstr[0] = `${this.unionA_FightInfo.name}的${this.unionA_PlayerName}`;
				paramstr[1] = `${this.unionB_FightInfo.name}的${this.unionB_PlayerName}`;
				this.unionB_PlayerName = null;
			}
			this.addOneBattleLog(UnionBattle_Log.FIGHT_RESULT, paramstr);
		} else {//轮空
			if (!this.unionA_PlayerName) {
				this.addOneBattleLog(UnionBattle_Log.ENEMY_NULL, [this.unionA_FightInfo.name]);
			} else if (!this.unionB_PlayerName) {
				this.addOneBattleLog(UnionBattle_Log.ENEMY_NULL, [this.unionB_FightInfo.name]);
			}
		}
		this.onOverPKFight();

		let winneerPos: number = 0;//1-A胜利  2-B胜利
		if (this.unionA_FightInfo.score >= UnionDefine.UNIONBATTLE_SCORE_MAX) {
			winneerPos = 1;
		} else if (this.unionB_FightInfo.score >= UnionDefine.UNIONBATTLE_SCORE_MAX) {
			winneerPos = 2;
		}
		if (winneerPos > 0) {
			this.player_bar_A.visible = false;
			this.player_bar_B.visible = false;
			Tool.callbackTime(this.onResultHandler, this, 2000, winneerPos);
		} else {
			this.onUpdatePlayerHead();
			this.readyLefttime = UnionDefine.UNION_BATTLE_READY_TIME * 1000 + egret.getTimer();
			this.onFightTimeDown();
		}
	}
	//初始化战斗场景
	protected onStartFight(): void {
		this._status = FIGHT_STATUS.Requset;
		this.mainscene.getBodyManager().fightPause = false;

		this.mainscene.heroBody.isDamageFalse = true;
		this.isInit = true;
		//初始化 UI 信息
		let badgesAIndex: number = this.unionA_FightInfo.badgesIndex;
		let badgesBIndex: number = this.unionB_FightInfo.badgesIndex;
		let unionALevel: number = this.unionA_FightInfo.level;
		let unionBLevel: number = this.unionB_FightInfo.level;
		let colorIndex: number = 0;
		let iconIndex: number = 0;
		colorIndex = Tool.toInt(badgesAIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges_A["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		iconIndex = badgesAIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges_A["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.unionA_name_lab.text = this.unionA_FightInfo.name;
		this.unionA_level_lab.text = Language.instance.getText('dengji') + "：" + unionALevel;
		colorIndex = Tool.toInt(badgesBIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges_B["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		iconIndex = badgesBIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges_B["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.unionB_name_lab.text = this.unionB_FightInfo.name;
		this.unionB_level_lab.text = Language.instance.getText('dengji') + "：" + unionBLevel;
		this.reborn_time_lab.text = '';
		this.xianhun_probar_A.maximum = UnionDefine.UNIONBATTLE_SCORE_MAX;
		this.xianhun_probar_B.maximum = UnionDefine.UNIONBATTLE_SCORE_MAX;
		this.guwu_btn.visible = this.fightPosition > 0;
		this.chatwicket.visible = this.fightPosition > 0;
		this.fight_rule_lab.text = this.fightPosition == 0 ? Language.instance.getText('unionbattle_rule_2') : Language.instance.getText('unionbattle_rule_1');

		this.deathCount = this.deathTimes;
		this.updateFightBtnStatus();
		this.onUpdateInsprite();
		this.onUpdateScore();
		this.onUpdatePlayerHead();
		this.initWitnessBodys();
		//初始化聊天信息
		let info = DataManager.getInstance().chatManager.chat[CHANNEL.GUILD].concat();
		for (let i: number = 0; i <= 10; i++) {
			let chatinfo: ChatBase = info[i];
			if (!chatinfo) break;
			this.battleChats.unshift(chatinfo);
		}
		this.addBattleChatText();
		if (GameFight.getInstance().unionbattlePkMsg) {
			this.onReciveFightMsg();
		}
		this.isInit = false;
	}
	//更新鼓舞信息
	private onReciveBuyBuffMsg(eventmsg: GameMessageEvent): void {
		let msg: Message = eventmsg.message;
		let unionId: number = msg.getInt();
		let buffIndex: number = msg.getByte();
		let playerName: string = msg.getString();
		let battleinfo: FightUnionInfo = DataManager.getInstance().unionManager.unionbattleInfo.getUnionFightInfoById(unionId);
		if (battleinfo) {
			battleinfo.buffCount = buffIndex;
		}
		this.onUpdateInsprite();
		this.addOneBattleLog(UnionBattle_Log.BUY_BUFF, [battleinfo.name + '的' + playerName]);
	}
	private onUpdateInsprite(): void {
		if (this.myBattleInfo) {
			this.inspire_times_lab.text = Language.instance.getText('yiguwu') + ":" + this.myBattleInfo.buffCount + "/" + UnionDefine.UNIONBATTLE_BUFF_MAX;
		}
		this.unionA_inspireinfo_lab.text = Language.instance.getText('inspire', this.unionA_FightInfo.buffCount, 'level', ' ', 'attr1_name', '+', this.unionA_FightInfo.buffCount * 20, '%');
		this.unionB_inspireinfo_lab.text = Language.instance.getText('inspire', this.unionB_FightInfo.buffCount, 'level', ' ', 'attr1_name', '+', this.unionB_FightInfo.buffCount * 20, '%');
	}
	//打开鼓舞界面
	private openInspireView(): void {
		if (this.myBattleInfo) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionInspirePanel", this.myBattleInfo.buffCount));
		}
	}
	//攻击统计
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		if (attacker == this.unionA_Fighter || hurtBody == this.unionA_Fighter || attacker == this.unionB_Fighter || hurtBody == this.unionB_Fighter) {
			if (this.fightLefttime == 0) {
				this.fightLefttime = egret.getTimer() + this.fightTotalTime;
			}

			if (hurtBody.data.shieldValue > 0) {
				let oldShield: number = hurtBody.data.shieldValue;
				let lostHp: number = Math.max(0, damage.value - hurtBody.data.shieldValue);
				hurtBody.data.shieldValue = Math.max(0, hurtBody.data.shieldValue - damage.value)
				damage.xishou = Math.max(0, oldShield - hurtBody.data.shieldValue);
			}

			let lefttime: number = Math.max(0, this.fightLefttime - egret.getTimer());
			// if (lefttime < 2000 && hurtBody.data.isHitMaBi) {
			// 	hurtBody.data.onHitMaBi(0);//如果出现麻痹对不上的情况打开注释
			// }
			hurtBody.addFlyFont(damage);
			// egret.log(`~~<公会战> 非常重要！！！从这一刻真正开始计算掉血~~~~~~`);
		}
	}
	//开始战斗
	private onPlayPKFight(ismidway: boolean = false): void {
		this._status = FIGHT_STATUS.Fighting;

		this.unionA_Fighter.isDamageFalse = true;
		this.unionB_Fighter.isDamageFalse = true;

		// if (!this.unionA_Fighter.data.hasArtifactEft) {
		// 	this.unionA_Fighter.data.hasArtifactEft = true;
		// 	this.unionA_Fighter.data.onRebirth();
		// }
		// if (!this.unionA_Fighter.data.hasArtifactEft) {
		// 	this.unionA_Fighter.data.hasArtifactEft = true;
		// 	this.unionB_Fighter.data.onRebirth();
		// }
		//计算A方的损血量
		this.A_Lost_HP = 0;
		this.A_Reborn_Num = 0;
		this.A_Shield_Num = this.unionA_Fighter.data.shieldValue;
		if (this.unionA_Fighter.data.reborncount > 0) {
			this.A_Reborn_Num = Tool.toInt(this.fighterA_MaxHp * this.unionA_Fighter.data.rebornEffect / GameDefine.GAME_ADD_RATIO);
		}
		//如果本场战斗有损血情况
		if (this.fighterA_CurHp - this.fighterA_EndHp > 0) {
			//1.将当前剩余的盾都算进去
			this.A_Lost_HP += this.unionA_Fighter.data.shieldValue;
			//人身上有复活次数 但是最后次数没了 说明用了复活
			if (this.A_Reborn_Num > 0 && this.A_End_RebornNum == 0) {
				//复活损血算法=当前所有血量+（复活血量-最终剩余血量）
				if (this.fighterA_EndHp > this.A_Reborn_Num) {
					this.A_Reborn_Num = this.fighterA_EndHp;
				}
				this.A_Lost_HP += this.fighterA_CurHp + (this.A_Reborn_Num - this.fighterA_EndHp);
			} else {
				//非复活损血=当前所有血量-最终剩余血量
				this.A_Lost_HP += this.fighterA_CurHp - this.fighterA_EndHp;
			}
		}
		//算B方的
		this.B_Lost_HP = 0;
		this.B_Reborn_Num = 0;
		this.B_Shield_Num = this.unionB_Fighter.data.shieldValue;
		if (this.unionB_Fighter.data.reborncount > 0) {
			this.B_Reborn_Num = Tool.toInt(this.fighterB_MaxHp * this.unionB_Fighter.data.rebornEffect / GameDefine.GAME_ADD_RATIO);
		}
		if (this.fighterB_CurHp - this.fighterB_EndHp > 0) {
			this.B_Lost_HP += this.unionB_Fighter.data.shieldValue;
			if (this.B_Reborn_Num > 0 && this.B_End_RebornNum == 0) {
				if (this.fighterB_EndHp > this.B_Reborn_Num) {
					this.B_Reborn_Num = this.fighterB_EndHp;
				}
				this.B_Lost_HP += this.fighterB_CurHp + (this.B_Reborn_Num - this.fighterB_EndHp);
			} else {
				this.B_Lost_HP += this.fighterB_CurHp - this.fighterB_EndHp;
			}
		}

		this.guwu_btn.visible = false;
		this.updateFightBtnStatus();

		if (ismidway) {
			this.unionA_Fighter.onAddEnemyBodyList([this.unionB_Fighter]);
			this.unionB_Fighter.onAddEnemyBodyList([this.unionA_Fighter]);
		} else {
			Tool.callbackTime(this.figtherSpeak, this, Math.floor(Math.random() * 2000 + 3000), this.unionA_Fighter);
			Tool.callbackTime(this.figtherSpeak, this, Math.floor(Math.random() * 2000 + 3000), this.unionB_Fighter);
		}
		// egret.log(`~~<公会战> 战斗开始 战斗总时长为${this.fightTotalTime}毫秒~~~~!`);
	}
	//结束战斗
	private onOverPKFight(): void {
		if (!this.isFightting) return;
		// if (!this.unionA_Fighter || !this.unionB_Fighter) return;

		this.unionA_Fighter.onClearTargets();
		this.mainscene.getBodyManager().playStandForPlayer(this.unionA_Fighter);
		this.unionB_Fighter.onClearTargets();
		this.mainscene.getBodyManager().playStandForPlayer(this.unionB_Fighter);
		let playerAID: number = this.unionA_Fighter && this.unionA_Fighter.data.playerId;
		let playerBID: number = this.unionB_Fighter && this.unionB_Fighter.data.playerId;
		let hpPercent: number = 0;
		if (playerAID != this.winnerId) {
			if (playerAID != this.heroPlayer.id) {
				this.mainscene.getBodyManager().onDestroyOhterOne(this.unionA_Fighter, false);
			} else {
				this.onPutHeroMatchPosition();
				this.deathCount = this.deathTimes + 1;
				this.rebornTime = egret.getTimer() + UnionDefine.UNIONBATTLE_REBORN_TIME * 1000;
			}
			this.unionA_Fighter = null;
			this.fighterA_CurHp = 0;
			this.fighterA_EndHp = 0;
			this.fighterB_CurHp = this.fighterB_EndHp;
			this.player_bar_A.value = 0;
			this.playerA_Hp_Lab.text = 0 + '%';
			hpPercent = this.getHpPercent(this.fighterB_CurHp, this.fighterB_MaxHp);
			this.player_bar_B.value = hpPercent;
			this.playerB_Hp_Lab.text = hpPercent + '%';
		}

		if (playerBID != this.winnerId) {
			if (playerBID != this.heroPlayer.id) {
				this.mainscene.getBodyManager().onDestroyOhterOne(this.unionB_Fighter, false);
			} else {
				this.onPutHeroMatchPosition();
				this.deathCount = this.deathTimes + 1;
				this.rebornTime = egret.getTimer() + UnionDefine.UNIONBATTLE_REBORN_TIME * 1000;
			}
			this.unionB_Fighter = null;
			this.fighterB_CurHp = 0;
			this.fighterB_EndHp = 0;
			this.fighterA_CurHp = this.fighterA_EndHp;
			this.player_bar_B.value = 0;
			this.playerB_Hp_Lab.text = 0 + '%';
			hpPercent = this.getHpPercent(this.fighterA_CurHp, this.fighterA_MaxHp);
			this.player_bar_A.value = hpPercent;
			this.playerA_Hp_Lab.text = hpPercent + '%';
		}

		this.winnerId = 0;
		this.fightLefttime = 0;
	}
	//获取血量百分比
	private getHpPercent(curHp: number, maxHp: number): number {
		let hpPercent = Math.min(100, Math.floor(curHp / maxHp * 100));
		if (curHp > 0) {
			hpPercent = Math.max(hpPercent, 1);
		}
		return hpPercent;
	}
	//将主角放置到地图的观战位置 并 隐藏
	private onPutHeroMatchPosition(): void {
		let heroPoint: egret.Point = this.mapInfo.getGridRdXYByIndex(this.Map_Match_Node);
		this.mainscene.heroBody.x = heroPoint.x;
		this.mainscene.heroBody.y = heroPoint.y;
		// this.mainscene.getBodyManager().addPlayerRetinueToMap(this.mainscene.heroBody);
		this.mainscene.onRemoveHero(this.mainscene.heroBody);
	}
	//更改参战按钮的显示状态
	private updateFightBtnStatus(): void {
		if (this.fightPosition == 0) {
			if (this.btn_fight.visible) {
				this.btn_fight.visible = false;
			}
		} else {
			let lefttime: number = Math.floor((this.rebornTime - egret.getTimer()) / 1000);
			let isshowBtn: boolean = lefttime < 0 && this._status != FIGHT_STATUS.Fighting;
			if (isshowBtn != this.btn_fight.visible) {
				this.btn_fight.visible = isshowBtn;
			}
		}
	}
	//发送参战的协议
	private onJoinBattle(): void {
		if (this.fightPosition > 0 && !this.isFightting) {
			let joinbattleMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_FIGHT_MESSAGE);
			GameFight.getInstance().parseFightRandom(joinbattleMsg);
			GameCommon.getInstance().sendMsgToServer(joinbattleMsg);
		}
	}
	public onEnterSuccessScene(): void {
		this.onPutHeroMatchPosition();
		super.onEnterSuccessScene();
	}
	/**************围观者逻辑****************/
	//初始化路人形象
	private initWitnessBodys(): void {
		let playerbody: PlayerBody;
		let rebornNode: ModelMapNode;

		let dire_ary: number[] = [Direction.RIGHTDOWN, Direction.RIGHTUP];
		this.unionA_witness = [];
		for (let i: number = 0; i < this.WitnessA_Pos_Ary.length; i++) {
			rebornNode = this.mapInfo.getNodeModelByIndex(this.WitnessA_Pos_Ary[i]);
			playerbody = this.mainscene.getBodyManager().onCreateFakerPlayerToSnece(0.6, 1.2, [rebornNode], '');
			// playerbody.visible = false;
			playerbody.direction = dire_ary[i];
			playerbody.onShowOrHideHpBar(false);
			this.unionA_witness.push(playerbody);
		}

		dire_ary = [Direction.LEFTDOWN, Direction.LEFTUP];
		this.unionB_witness = [];
		for (let i: number = 0; i < this.WitnessB_Pos_Ary.length; i++) {
			rebornNode = this.mapInfo.getNodeModelByIndex(this.WitnessB_Pos_Ary[i]);
			playerbody = this.mainscene.getBodyManager().onCreateFakerPlayerToSnece(0.6, 1.2, [rebornNode], '');
			// playerbody.visible = false;
			playerbody.direction = dire_ary[i];
			playerbody.onShowOrHideHpBar(false);
			this.unionB_witness.push(playerbody);
		}
	}
	//初始化帮众外形
	private updateMemberBodys(unionID: number): void {
		let rebornNode: ModelMapNode;
		let playerdata: PlayerData;
		let playerbody: PlayerBody;
		if (unionID == this.unionA_FightInfo.unionId) {
			let A_AllDatas: PlayerData[] = [];
			for (let key in this.unionA_memberDatas) {
				let data: PlayerData = this.unionA_memberDatas[key];
				A_AllDatas.push(data);
			}
			for (let i: number = 0; i < this.MemberA_Pos_Ary.length; i++) {
				if (A_AllDatas.length == 0) break;
				let randomidx: number = Math.floor(Math.random() * A_AllDatas.length);
				playerdata = A_AllDatas[randomidx];
				A_AllDatas.splice(randomidx, 1);
				if (playerdata.playerId == this.unionA_Fighter.data.playerId) continue;
				playerbody = this.unionA_members[i];
				if (!playerbody) {
					rebornNode = this.mapInfo.getNodeModelByIndex(this.MemberA_Pos_Ary[i]);
					playerbody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [rebornNode]);
					this.unionA_members.push(playerbody);
				} else {
					playerbody.data.onRebirth();
					playerbody.data = playerdata;
				}
				// playerbody.visible = true;
				playerbody.onShowOrHideHpBar(false);
			}

			for (let i: number = 0; i < this.unionA_witness.length; i++) {
				playerbody = this.unionA_witness[i];
				playerbody.data.onRebirth();
				// playerbody.visible = true;
				playerbody.onShowOrHideHpBar(false);
			}
		} else if (unionID == this.unionB_FightInfo.unionId) {
			let B_AllDatas: PlayerData[] = [];
			for (let key in this.unionB_memberDatas) {
				let data: PlayerData = this.unionB_memberDatas[key];
				B_AllDatas.push(data);
			}
			for (let i: number = 0; i < this.MemberB_Pos_Ary.length; i++) {
				if (B_AllDatas.length == 0) break;
				let randomidx: number = Math.floor(Math.random() * B_AllDatas.length);
				playerdata = B_AllDatas[randomidx];
				B_AllDatas.splice(randomidx, 1);
				if (playerdata.playerId == this.unionB_Fighter.data.playerId) continue;
				playerbody = this.unionB_members[i];
				if (!playerbody) {
					rebornNode = this.mapInfo.getNodeModelByIndex(this.MemberB_Pos_Ary[i]);
					playerbody = this.mainscene.getBodyManager().onCreateOtherPlayer(playerdata, [rebornNode]);
					this.unionB_members.push(playerbody);
				} else {
					playerbody.data.onRebirth();
					playerbody.data = playerdata;
				}
				// playerbody.visible = true;
				playerbody.onShowOrHideHpBar(false);
			}

			for (let i: number = 0; i < this.unionB_witness.length; i++) {
				playerbody = this.unionB_witness[i];
				playerbody.data.onRebirth();
				// playerbody.visible = true;
				playerbody.onShowOrHideHpBar(false);
			}
		}
	}
	/**------气泡的相关逻辑------**/
	//帮众说话
	private memberSpeak(enterBody: PlayerBody, speakbodys: PlayerBody[], jobname: string): void {
		let max_word: number = 9;
		let word_index: number = Math.ceil(Math.random() * max_word);
		if (speakbodys.length > 0) {
			let speakbody: PlayerBody = speakbodys[Math.floor(Math.random() * speakbodys.length)];
			let speakword: string = GameCommon.getInstance().readStringToHtml(Language.instance.parseInsertText('bangzhong_' + word_index, jobname));
			speakbody.bodySpeak(speakword);
		}
	}
	//旁观者说话
	private witnessSpeak(enterBody: PlayerBody, speakbodys: PlayerBody[]): void {
		let max_word: number = 8;
		let word_index: number = Math.ceil(Math.random() * max_word);
		let speakbody: PlayerBody = speakbodys[Math.floor(Math.random() * speakbodys.length)];
		let speakword: string = GameCommon.getInstance().readStringToHtml(Language.instance.parseInsertText('luren_' + word_index, enterBody.data.name));
		speakbody.bodySpeak(speakword);
	}
	//战前讲话
	private figtherSpeak(body: PlayerBody): void {
		if (!body) return;
		let max_word: number = 6;
		let word_index: number = Math.ceil(Math.random() * max_word);
		let speakword: string = GameCommon.getInstance().readStringToHtml(Language.instance.getText('duizhan_' + word_index));
		body.bodySpeak(speakword);
	}
	//结算处理
	private onResultHandler(winneerPos: number): void {
		let resultParam: UnionBattleResultParam = new UnionBattleResultParam();
		if (this.fightPosition > 0) {
			let MaxRound: number = Math.round(Math.sqrt(UnionDefine.Union_Battle_JoinMax));
			let roundcount: number = this.myBattleInfo.roundCount;
			if (this.fightPosition == winneerPos) {//胜利
				if (roundcount >= MaxRound) {
					resultParam.resultParam = Language.instance.getText('unionbattle_champion_result');
					let model: Modelguildreward = JsonModelManager.instance.getModelguildreward()[1];
					resultParam.awardList = GameCommon.getInstance().onParseAwardItemstr(model.tongyongReward);
					resultParam.specialAwdList = GameCommon.getInstance().onParseAwardItemstr(model.cangkuReward);
				} else {
					resultParam.contiuneDesc = Language.instance.getText('unionbattle_win_result');
				}
			} else {//失败
				let groups: FightUnionInfo[] = [];
				let unionbattleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
				for (let index: number = 0; index < unionbattleInfo.joinUnions.length; index++) {
					let groupinfo: FightUnionInfo = unionbattleInfo.joinUnions[index];

					if (groupinfo.roundCount == this.myBattleInfo.roundCount) {
						groups.push(groupinfo);
					}
				}
				let minrank: number = Tool.toInt(groups.length / 2) + 1;
				let rankcount: number = 1;
				for (let i: number = 0; i < groups.length; i++) {
					let groupinfo: FightUnionInfo = groups[i];
					if (groupinfo.name == this.myUnionData.info.name) {
						break;
					}
					rankcount++;
				}
				rankcount = Math.max(minrank, rankcount);
				resultParam.resultParam = Language.instance.parseInsertText('unionbattle_lost_result', rankcount);
				let model: Modelguildreward = JsonModelManager.instance.getModelguildreward()[rankcount];
				if (model) {
					resultParam.awardList = GameCommon.getInstance().onParseAwardItemstr(model.tongyongReward);
					resultParam.specialAwdList = GameCommon.getInstance().onParseAwardItemstr(model.cangkuReward);
				}
			}
		} else {//观战离开
			let unionName: string = winneerPos == 1 ? this.unionA_FightInfo.name : this.unionB_FightInfo.name;
			resultParam.contiuneDesc = Language.instance.parseInsertText('unionbattle_witness_result', unionName);
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionBattleResultPanel", resultParam));
	}
	/***-------------战斗逻辑结束---------------***/
	public onDeath(): void {
	}
	public onFightWin(): void {
	}
	public onFightLose(): void {
	}
	protected onTouchLeaveBtn(): void {
		var quitNotice = [{ text: Language.instance.getText("unionbattle_quit_desc") }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onQuitScene, this))
		);
	}
	public onQuitScene(): void {
		if (GameFight.getInstance().fightsceneTpye != this.sceneTpye) {
			return;
		}

		let quitMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_QUIT_MESSAGE);
		quitMsg.setInt(this.unionA_FightInfo.unionId);
		GameCommon.getInstance().sendMsgToServer(quitMsg);

		this.mainscene.onReturnYewaiScene();
	}
	public onDestroyScene(): void {
		this.unionA_FightInfo = null;
		this.unionB_FightInfo = null;
		this.unionA_Fighter = null;
		this.unionB_Fighter = null;
		this.unionA_memberDatas = null;
		this.unionB_memberDatas = null;
		this.unionA_members = null;
		this.unionB_members = null;
		this.unionA_witness = null;
		this.unionB_witness = null;
		this.battleChats = null;
		GameFight.getInstance().unionbattlePkMsg = null;
		this.winnerId = 0;

		super.onDestroyScene();
	}
	/** ----属性接口---- **/
	public get TickInterval(): number {
		return 1000;
	}
	//The end
}
enum UnionBattle_Log {
	FIGHT_RESULT = 1,//战斗结果
	BUY_BUFF = 2,//购买BUFF 
	ENEMY_NULL = 3,//战斗轮空
	NOBODY_FIGHT = 4,//双方无人参战
}