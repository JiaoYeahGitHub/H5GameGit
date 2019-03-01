class UnionBattleGroupView extends BaseWindowPanel {
	private btn_join: eui.Button;
	private award_btn: eui.Label;
	private cangku_btn: eui.Label;
	private time_desc_label: eui.Label;
	private timedown_label: eui.Label;
	private explain_label: eui.Label;
	private explainLayer: eui.Group;
	private loop_rank: eui.Label;
	private zhizun_explain_layer: eui.Group;
	private mini_explain_label: eui.Label;
	private btn_sure: eui.Button;
	private closebtn: eui.Button;
	private zhizun_awd_grp: eui.Group;

	private basic2: eui.Component;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleGroupSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		GameCommon.getInstance().addUnderlineStr(this.explain_label);
		GameCommon.getInstance().addUnderlineStr(this.loop_rank);
		GameCommon.getInstance().addUnderlineStr(this.award_btn);
		GameCommon.getInstance().addUnderlineStr(this.cangku_btn);

		// this.setTitle("union_battle_title_png");
		this.setTitle("仙盟战");
		super.onInit();
		this.onRefresh();

		this.mini_explain_label.text = Language.instance.getText('unionbattle_explain2');
		let awarditems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr('3,48,1#2,152,1#3,49,1#3,83,20#3,76,5');
		for (let i: number = 0; i < awarditems.length; i++) {
			let goodsitem = GameCommon.getInstance().createGoodsIntance(awarditems[i]);
			this.zhizun_awd_grp.addChild(goodsitem);
		}
		(this.basic2["closeBtn2"] as eui.Button).visible = false;
		(this.basic2["label_title"] as eui.Label).text = "至尊奖励";
		this.zhizun_explain_layer.visible = true;
	}
	protected onRegist(): void {
		super.onRegist();
		this.closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideZhizunLayer, this);
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideZhizunLayer, this);
		this.btn_join.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJoinBattle, this);
		this.award_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdView, this);
		this.cangku_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDepotView, this);
		this.loop_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRankView, this);
		this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onResUnionBattleGroup, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		for (let roundNum: number = 0; roundNum < this.roundMax; roundNum++) {
			let maxsize: number = Math.pow(2, this.roundMax - roundNum);
			for (let i: number = 0; i < maxsize; i++) {
				let index: number = Tool.toInt(i / 2);
				let witnessBtn: eui.Button = this[`round${roundNum}_witnessbtn${index}`];
				witnessBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWitnessBattle, this);
			}
		}
		this.onReqUnionBattleGroup();
	}
	protected onRemove(): void {
		super.onRemove();
		this.closebtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideZhizunLayer, this);
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideZhizunLayer, this);
		this.btn_join.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onJoinBattle, this);
		this.award_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdView, this);
		this.cangku_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDepotView, this);
		this.loop_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRankView, this);
		this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onResUnionBattleGroup, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		for (let roundNum: number = 0; roundNum < this.roundMax; roundNum++) {
			let maxsize: number = Math.pow(2, this.roundMax - roundNum);
			for (let i: number = 0; i < maxsize; i++) {
				let index: number = Tool.toInt(i / 2);
				let witnessBtn: eui.Button = this[`round${roundNum}_witnessbtn${index}`];
				witnessBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWitnessBattle, this);
			}
		}
		this.examineCD(false);
	}
	//隐藏至尊奖励
	private onHideZhizunLayer(): void {
		this.zhizun_explain_layer.visible = false;
	}
	//请求公会列表
	private onReqUnionListMsg(pageNum: number): void {
		var unionlistMsg: Message = new Message(MESSAGE_ID.UNION_LIST_MESSAGE);
		unionlistMsg.setShort(pageNum);
		GameCommon.getInstance().sendMsgToServer(unionlistMsg);
	}
	//请求帮会战分组
	private onReqUnionBattleGroup(): void {
		this.timedown_label.text = "";
		this.examineCD(false);

		var battlegroupREQMSG: Message = new Message(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE);
		battlegroupREQMSG.setBoolean(true);
		GameCommon.getInstance().sendMsgToServer(battlegroupREQMSG);
	}
	//帮会战分组返回
	private onResUnionBattleGroup(): void {
		//时间状态描述
		if (this.battleInfo.state == UNIONBATTLE_STATE.NOT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_NOT_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.READY) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_READY_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.FIGHT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_FIGHT_timedesc');
		} else if (this.battleInfo.state == UNIONBATTLE_STATE.RESULT) {
			this.time_desc_label.text = Language.instance.getText('unionbattle_RESULT_timedesc');
		}
		if (this.battleInfo.state == UNIONBATTLE_STATE.FIGHT) {
			this.examineCD(false);
			this.timedown_label.text = '';
		} else {
			this.examineCD(true);
		}
		//参战状态
		this.btn_join.visible = this.battleInfo.canJoin && this.battleInfo.state == UNIONBATTLE_STATE.FIGHT;
		//匹配状态
		if (this.battleInfo.joinUnions.length > 0) {
			var currRoundNum: number = 0;
			// var cacheEnemyName: string[] = [];
			for (var i: number = 0; i <= this.roundMax; i++) {
				var groups: FightUnionInfo[] = [];
				for (var uIndex: number = 0; uIndex < this.battleInfo.joinUnions.length; uIndex++) {
					var groupinfo: FightUnionInfo = this.battleInfo.joinUnions[uIndex];
					if (groupinfo.roundCount > currRoundNum) {
						groups.push(groupinfo);
					}
				}
				this.onRefreshGroupInfo(groups, currRoundNum);
				currRoundNum++;
			}
		} else {
			//如果没有开战就实时取公会排行数据
			var unionlistMsg: Message = new Message(MESSAGE_ID.UNION_LIST_MESSAGE);
			unionlistMsg.setShort(1);
			GameCommon.getInstance().sendMsgToServer(unionlistMsg);
		}
	}
	//接收帮会排行信息 如果是未开战走这套
	private Groups_SortAry: number[] = [1, 4, 2, 3];
	private onResUnionListMsg(): void {
		if (this.battleInfo.state == UNIONBATTLE_STATE.NOT) {
			var groups: FightUnionInfo[] = [];
			var hasGroup: boolean = true;
			for (var i: number = 0; i < this.Groups_SortAry.length; i++) {
				var rankIndex: number = this.Groups_SortAry[i] - 1;
				var unionInfo: UnionInfo = DataManager.getInstance().unionManager.applyUnionList[rankIndex];
				var fightInfo: FightUnionInfo = null;
				if (i % 2 == 0 && !unionInfo) {
					hasGroup = false;
				} else {
					hasGroup = true;
				}

				if (unionInfo) {
					fightInfo = new FightUnionInfo();
					fightInfo.name = unionInfo.name;
					fightInfo.badgesIndex = unionInfo.badgesIndex;
				} else if (!unionInfo && hasGroup) {
					fightInfo = new FightUnionInfo();
					fightInfo.name = "";
				}

				if (fightInfo) {
					fightInfo.roundCount = 0;
					fightInfo.state = UNIONBATTLE_RESULT.UNRESULT;
				}

				groups.push(fightInfo);
			}

			for (var i: number = 0; i <= this.roundMax; i++) {
				if (0 == i) {
					this.onRefreshGroupInfo(groups, i);
				} else {
					this.onRefreshGroupInfo(null, i);
				}
			}
		}
	}
	//显示分组信息groups当前分组的所有信息,roundCount处于第几轮
	private onRefreshGroupInfo(groups: FightUnionInfo[], roundCount: number): void {
		let maxsize: number = Math.pow(2, this.roundMax - roundCount);
		let resultAry: number[] = [];
		for (let i: number = 0; i < maxsize; i++) {
			let groupBar: UnionBattleGroupBar = this[`round${roundCount}_ubgroupbar${i}`];
			let groupInfo: FightUnionInfo = groups ? groups[i] : null;
			if (!groupInfo) {
				groupBar.onReset();
			} else {
				groupBar.updateData(groupInfo, roundCount);
			}
			groupBar.setBadgesBg();
			if (roundCount >= this.roundMax) break;
			//画线逻辑
			if (!resultAry[Tool.toInt(i / 2)]) {
				let lineIndex: number = Tool.toInt(i / 2);
				let lineBar: UnionBattleGroupLine = this[`round${(roundCount)}_line${lineIndex}`];
				let witnessBtn: eui.Button = this[`round${roundCount}_witnessbtn${lineIndex}`];
				witnessBtn.visible = false;
				if (!groupInfo) {//轮空
					lineBar.currentState = "normal";
					continue;
				}
				if (groupInfo.state == UNIONBATTLE_RESULT.WIN || groupInfo.roundCount - 1 > roundCount) {
					lineBar.currentState = i % 2 == 0 ? "left" : "right";
				} else if (groupInfo.state == UNIONBATTLE_RESULT.LOSE) {
					lineBar.currentState = i % 2 == 0 ? "right" : "left";
				} else if (groupInfo.state == UNIONBATTLE_RESULT.UNRESULT) {
					lineBar.currentState = "normal";
					if (!this.battleInfo.canJoin && this.battleInfo.state == UNIONBATTLE_STATE.FIGHT) {
						witnessBtn.visible = true;
						witnessBtn.name = groupInfo.unionId + '';
					}
				}
				resultAry[Tool.toInt(i / 2)] = groupInfo.state;
			}
		}
	}
	//倒计时
	private _timeOpen: boolean;
	public examineCD(open: boolean) {
		if (this._timeOpen != open) {
			this._timeOpen = open;
			if (open) {
				Tool.addTimer(this.onCountDown, this, 1000);
			} else {
				Tool.removeTimer(this.onCountDown, this, 1000);
			}
		}
	}
	private onCountDown(): void {
		var leftime: number = Math.ceil((this.battleInfo.timecount - egret.getTimer()) / 1000);
		if (leftime > 0) {
		} else {
			leftime = 0;
			this.examineCD(false);
			this.onReqUnionBattleGroup();
		}
		this.timedown_label.text = GameCommon.getInstance().getTimeStrForSec1(leftime);
	}
	//帮会战信息数据
	private get battleInfo(): UnionBattleInfo {
		return DataManager.getInstance().unionManager.unionbattleInfo;
	}
	//获取最大的分组值
	public get roundMax(): number {
		return Math.round(Math.sqrt(UnionDefine.Union_Battle_JoinMax));
	}
	//打开奖励预览面板
	private onOpenAwdView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionBattleAwdPanel");
	}
	//前往参与公会战
	private onJoinBattle(): void {
		GameFight.getInstance().onSendUnionBattleFightMsg(this.battleInfo.myUnionFightInfo.unionId);
	}
	//进入观战
	private onWitnessBattle(event: egret.Event): void {
		let unionId: number = parseInt(event.currentTarget.name);
		GameFight.getInstance().onSendUnionBattleFightMsg(unionId);
	}
	//打开仓库面板
	private onOpenDepotView(): void {
		// this.owner.onShowAlertByName("UnionDepotView");
		// UnionDepotView

		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN),"UnionDepotView");
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionBattleWarehousePanel");
	}
	//打开历史排行
	private onOpenRankView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionRankView", UNIONBATTLE_RANKTYPE.UNION_BALLTE));
	}
	//打开个人排行
	private onOpenSingleRankView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionBattleRankPanel", UNIONBATTLE_RANKTYPE.UNION_SINGLE));
	}
	//打开仙盟城市面板
	private onTouchBack(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
	}
	//打开说明面板
	private onTouchExplain() {
		GameDispatcher.getInstance().dispatchEvent(
			new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("ExplainPanel", GameCommon.getInstance().readStringToHtml(Language.instance.getText('unionbattle_explain')))
		);
	}
	//关闭时打开帮会主城
	protected onTouchCloseBtn(): void {
		super.onTouchCloseBtn();
		this.onTouchBack();
	}
	//The end
}
//帮会战分组信息条
class UnionBattleGroupBar extends eui.Component {
	private union_name_label: eui.Label;
	private badges_bg: eui.Image;
	private badges_icon: eui.Image;
	private fail_img: eui.Image;
	private animGrp: eui.Group;
	// private self_flag: eui.Image;

	public constructor() {
		super();
		// this.skinName = skins.BattleGroupBarSkin;
	}
	//更新
	public updateData(info: FightUnionInfo, roundCount: number): void {
		this.animGrp.removeChildren();
		if (!info) {
			this.onReset();
		} else {
			if (info.name) {
				this.union_name_label.textColor = 0xFFFFFF;
				this.union_name_label.text = GameCommon.getInstance().getOutServerName(info.name);
				this.fail_img.visible = info.state == UNIONBATTLE_RESULT.LOSE && info.roundCount - 1 <= roundCount;
				let colorIndex: number = Tool.toInt(info.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
				this.badges_bg.source = `union_badges_bg${colorIndex}_png`;
				let iconIndex: number = info.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
				this.badges_icon.source = `union_badges_icon${iconIndex}_png`;
				if (info.name == DataManager.getInstance().unionManager.unionInfo.info.name) {
					GameCommon.getInstance().addAnimation('xianmengqizhi', null, this.animGrp, -1);
				}
			} else {
				this.onNullHandler();
			}
		}
	}
	//轮空
	private onNullHandler(): void {
		this.fail_img.visible = true;
		this.badges_bg.source = 'union_badges_bg1_png';
		this.badges_icon.source = '';
		this.union_name_label.textColor = 0xFFFF00;
		this.union_name_label.text = Language.instance.getText("lunkong");
	}
	//未开启
	public onReset(): void {
		this.fail_img.visible = false;
		this.badges_bg.source = 'union_badges_bg1_png';
		this.badges_icon.source = '';
		this.union_name_label.text = '';
	}
	// 隐藏旗帜底图
	public setBadgesBg(vis: boolean = false){
		this.badges_bg.visible = vis;
	}
	//The end
}
//帮会战的画线组件
class UnionBattleGroupLine extends eui.Component {
	public constructor() {
		super();
		this.skinName = skins.BattleGroupLineSkin;
	}
}