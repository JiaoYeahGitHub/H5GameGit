class UnionCopyView extends BaseTabView {
	private btn_challenge: eui.Button;
	private btn_saodang: eui.Button;
	private btn_zhuwei: eui.Button;
	private btn_reward_all: eui.Button;
	private award_wave_item: GoodsInstance;
	private pass_num_label: eui.Label;
	private attr_rate_label: eui.Label;
	private curr_wavenum_label: eui.Label;
	private saodang_num_label: eui.Label;
	private best_player_name: eui.Label;
	private loop_rank_label: eui.Label;
	private best_wavenum_label: eui.Label;
	private zhuwei_attr_label: eui.Label;
	private passdup_desc_grp: eui.Group;
	private yes_best_grp: eui.Group;
	private awardbox_grp: eui.Group;
	private end_label: eui.Label;
	private rank_null_label: eui.Label;
	private not_passdup_desc: eui.Label;
	private not_yes_best_desc: eui.Label;
	private best_headIcon: eui.Image;
	private left_page_btn: eui.Button;
	private right_page_btn: eui.Button;

	private rankData: TopRankSimpleParam;
	private yesBestData: UnionDupYesFirstData;
	private Max_Show_Rank: number = 3;
	private today_maxWave: number = 0;
	private Page_Show_Num: number = 4;
	private Max_Page_Num: number;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionDupSkin;
	}
	protected onInit(): void {
		GameCommon.getInstance().addUnderlineStr(this.loop_rank_label);
		this.Max_Page_Num = Math.ceil(JsonModelManager.instance.getModelguildBoss().length / UnionDefine.Union_Dup_AwardWave / this.Page_Show_Num);
		this.currPageNum = 1;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onRequestDupInofMsg();
		this.onRequestDupRankMsg();
	}
	//请求副本的信息
	private onRequestDupInofMsg(): void {
		var dupinfoReqMsg: Message = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
		dupinfoReqMsg.setByte(DUP_TYPE.DUP_UNION);
		GameCommon.getInstance().sendMsgToServer(dupinfoReqMsg);
	}
	//请求排行榜数据
	private onRequestDupRankMsg(): void {
		var rankInfoReqMsg: Message = new Message(MESSAGE_ID.UNION_DUP_RANK_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(rankInfoReqMsg);
	}

	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DUP_RANK_MESSAGE.toString(), this.onResDupRankMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_BUYNUM_MESSAGE.toString(), this.onResDupSweepMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DUP_REWARD_MESSAGE.toString(), this.onResGetPassReward, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_DUP_ZHUWEI_MESSAGE.toString(), this.onRefreshCheerInfo, this);
		this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallange, this);
		this.btn_saodang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodang, this);
		this.btn_zhuwei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendCheerMsg, this);
		this.btn_reward_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendGetPassAward, this);
		this.left_page_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchPageBtn, this);
		this.right_page_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchPageBtn, this);
		this.loop_rank_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRank, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DUP_RANK_MESSAGE.toString(), this.onResDupRankMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_BUYNUM_MESSAGE.toString(), this.onResDupSweepMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DUP_REWARD_MESSAGE.toString(), this.onResGetPassReward, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_DUP_ZHUWEI_MESSAGE.toString(), this.onRefreshCheerInfo, this);
		this.btn_challenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallange, this);
		this.btn_saodang.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodang, this);
		this.btn_zhuwei.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendCheerMsg, this);
		this.btn_reward_all.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendGetPassAward, this);
		this.left_page_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPageBtn, this);
		this.right_page_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPageBtn, this);
		this.loop_rank_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRank, this);
		this.awardbox_grp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdNotice, this);
	}
	//副本信息返回
	private onResDupInfoMsg(): void {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_UNION)[0];
		this.onUpdateSweep();
		var passTotal: number = JsonModelManager.instance.getModelguildBoss().length;
		var currPassNum: number = dupinfo.pass - 1;
		this.curr_wavenum_label.text = currPassNum < passTotal ? currPassNum + "关" : passTotal + "关";
		if (dupinfo.pass > passTotal) {
			this.end_label.text = `恭喜您通关全部关卡`;
		} else {
			this.end_label.text = `当前第${dupinfo.pass}关`;
		}
		GameCommon.getInstance().onButtonEnable(this.btn_challenge, dupinfo.pass <= passTotal);
		this.award_wave_item.visible = dupinfo.pass < passTotal;
		var uniondupModel: ModelguildBoss = JsonModelManager.instance.getModelguildBoss()[dupinfo.pass - 1];
		// if (uniondupModel) {
		// 	this.award_wave_item.onUpdate(uniondupModel.firstAward.type, uniondupModel.firstAward.id, 0);
		// }
	}
	//副本排行信息返回
	private onResDupRankMsg(msgEvent: GameMessageEvent): void {
		var rankMsg: Message = msgEvent.message;
		if (!this.rankData) {
			this.rankData = new TopRankSimpleParam();
			this.rankData.currType = TopRankManager.RANK_SIMPLE_TYPE_UNIONDUP;
		}
		this.rankData.dataList = [];
		var len: number = rankMsg.getByte();
		for (var i: number = 0; i < len; i++) {
			var rankInfo: TopRankSimple = new TopRankSimple();
			rankInfo.rank = i + 1;
			rankInfo.name = rankMsg.getString();
			rankInfo.vip = rankMsg.getInt();
			rankInfo.vip = GameCommon.getInstance().getVipLevel(rankInfo.vip);
			rankInfo.value = rankMsg.getShort();
			this.rankData.dataList.push(rankInfo);
		}
		this.rank_null_label.visible = len == 0;
		for (var i: number = 0; i < this.Max_Show_Rank; i++) {
			if (this.rankData.dataList.length > i) {
				this["rank_group" + i].visible = true;
				(this["label_rank_vip" + i] as eui.BitmapLabel).text = this.rankData.dataList[i].vip + "";
				(this["label_rank_name" + i] as eui.Label).text = this.rankData.dataList[i].name;
				(this["label_rank_value" + i] as eui.Label).text = this.rankData.dataList[i].value + "关";
			} else {
				this["rank_group" + i].visible = false;
			}
		}
		var _passCount = rankMsg.getShort();
		this.not_passdup_desc.visible = _passCount == 0;
		this.passdup_desc_grp.visible = _passCount > 0;
		if (_passCount > 0) {
			this.pass_num_label.text = _passCount + "";
			this.attr_rate_label.text = `-${DupDefine.UnionDup_Derate_Rate}%`;
		}
		var hasYESFirst: boolean = rankMsg.getBoolean();
		this.not_yes_best_desc.visible = !hasYESFirst;
		this.yes_best_grp.visible = hasYESFirst;
		if (hasYESFirst) {
			if (!this.yesBestData) {
				this.yesBestData = new UnionDupYesFirstData();
			}
			this.yesBestData.onParse(rankMsg);
			this.best_player_name.text = this.yesBestData.name;
			this.best_wavenum_label.text = this.yesBestData.passNum + "关";
			this.zhuwei_attr_label.text = `攻血+${DataManager.getInstance().unionManager.getCheerAttrAddRate(this.yesBestData.cheerNum)}%`;
			// this.best_headIcon.source = GameCommon.getInstance().getHeadIconByIndex(this.yesBestData.headIndex);
		}
		var isCheer: boolean = rankMsg.getBoolean();
		this.btn_zhuwei.label = isCheer ? "已助威" : "助威";
		GameCommon.getInstance().onButtonEnable(this.btn_zhuwei, !isCheer);
		var isRewardPassAwd: boolean = rankMsg.getBoolean();
		DataManager.getInstance().unionManager.hasDupPassAward = !isRewardPassAwd && this.today_maxWave >= UnionDefine.Union_Dup_AwardWave;
		this.btn_reward_all.label = isRewardPassAwd ? "已领取" : "一键领取";
		if (!isRewardPassAwd) {
			this.awardbox_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdNotice, this);
		} else {
			this.awardbox_grp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdNotice, this);
		}
		this.today_maxWave = rankMsg.getShort();
		GameCommon.getInstance().onButtonEnable(this.btn_reward_all, !isRewardPassAwd && this.today_maxWave >= UnionDefine.Union_Dup_AwardWave);
		this.onUpdatePassAward();
	}
	//每日奖励领取返回
	private onResGetPassReward(msgEvent: GameMessageEvent): void {
		var msg = msgEvent.message;
		var awardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
		awardNoticeParam.desc = "获得奖励如下：";
		awardNoticeParam.itemAwards = [];
		var awardSize: number = msg.getByte();
		for (var i: number = 0; i < awardSize; i++) {
			var awardItem: AwardItem = new AwardItem(GOODS_TYPE.SERVANT_EQUIP, msg.getShort());
			awardNoticeParam.itemAwards.push(awardItem);
		}
		awardNoticeParam.itemAwards.push(new AwardItem(GOODS_TYPE.GOLD, 0, msg.getInt()));
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", awardNoticeParam));
		this.btn_reward_all.label = "已领取";
		GameCommon.getInstance().onButtonEnable(this.btn_reward_all, false);
		this.onUpdatePassAward();
	}
	//奖励翻页相关
	private onTouchPageBtn(event: egret.Event): void {
		var btnName: string = event.currentTarget.name;
		if (btnName == "btn_right") {
			this.currPageNum = this._currPageNum + 1;
		} else if (btnName == "btn_left") {
			this.currPageNum = this._currPageNum - 1;
		}
		this.onUpdatePassAward();
	}
	//更新每日领取的宝箱状态
	private onUpdatePassAward(): void {
		var isAwarded: boolean = !this.btn_reward_all.enabled;
		for (var i: number = 0; i < this.Page_Show_Num; i++) {
			var currAwardIndex: number = ((this._currPageNum - 1) * this.Page_Show_Num + i + 1) * UnionDefine.Union_Dup_AwardWave;
			if (currAwardIndex <= JsonModelManager.instance.getModelguildBoss().length) {
				(this["grp_pass_award" + i] as eui.Group).visible = true;
				(this["award_wavenum_label" + i] as eui.Label).text = `第${currAwardIndex}关奖励`;
				if (currAwardIndex > this.today_maxWave) {
					(this["award_boxImg" + i] as eui.Image).source = "newactivity_box1_png";
					(this["awarded_grp" + i] as eui.Group).visible = false;
					this.awardbox_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdNotice, this);
				} else {
					if (isAwarded) {
						(this["award_boxImg" + i] as eui.Image).source = "newactivity_box3_png";
						(this["awarded_grp" + i] as eui.Group).visible = true;
					} else {
						(this["award_boxImg" + i] as eui.Image).source = "newactivity_box2_png";
						(this["awarded_grp" + i] as eui.Group).visible = false;
					}
				}
			} else {
				(this["grp_pass_award" + i] as eui.Group).visible = false;
			}
		}
	}
	//翻页处理
	private _currPageNum: number;
	public set currPageNum(pageNum: number) {
		this._currPageNum = pageNum <= 0 ? 1 : (pageNum > this.Max_Page_Num ? this.Max_Page_Num : pageNum);
		GameCommon.getInstance().onButtonEnable(this.left_page_btn, this._currPageNum > 1);
		this.left_page_btn.visible = this.left_page_btn.enabled;
		GameCommon.getInstance().onButtonEnable(this.right_page_btn, this._currPageNum < this.Max_Page_Num);
		this.right_page_btn.visible = this.right_page_btn.enabled;
	}
	//助威信息返回
	private onRefreshCheerInfo(msgEvent: GameMessageEvent): void {
		GameCommon.getInstance().addAlert("助威成功");
		var msg: Message = msgEvent.message;
		if (this.yesBestData) {
			this.yesBestData.cheerNum = msg.getShort();
			this.zhuwei_attr_label.text = `攻血+${DataManager.getInstance().unionManager.getCheerAttrAddRate(this.yesBestData.cheerNum)}%`;
			this.btn_zhuwei.label = "已助威";
			GameCommon.getInstance().onButtonEnable(this.btn_zhuwei, false);
		}
	}
	//开始挑战
	private onChallange(): void {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_UNION)[0];
		GameFight.getInstance().onSendEnterDupMsg(dupinfo.id);
	}
	//返回扫荡的协议
	private onResDupSweepMsg(msgEvent: GameMessageEvent): void {
		this.onUpdateSweep();
		var msg = msgEvent.message;
		var sweepAwardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
		sweepAwardNoticeParam.desc = "扫荡成功获得以下奖励";
		sweepAwardNoticeParam.itemAwards = [];
		var awardSize: number = msg.getByte();
		for (var i: number = 0; i < awardSize; i++) {
			var awardItem: AwardItem = new AwardItem(GOODS_TYPE.SERVANT_EQUIP, msg.getShort());
			sweepAwardNoticeParam.itemAwards.push(awardItem);
		}
		sweepAwardNoticeParam.itemAwards.push(new AwardItem(GOODS_TYPE.GOLD, 0, msg.getInt()));
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", sweepAwardNoticeParam));
		this.onRequestDupRankMsg();
	}
	//更新扫荡状态
	private onUpdateSweep(): void {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_UNION)[0];
		this.saodang_num_label.text = `${dupinfo.leftSweepNum}/${dupinfo.totalSweepNum}`;
		GameCommon.getInstance().onButtonEnable(this.btn_saodang, dupinfo.leftSweepNum > 0 && dupinfo.pass > 1);
		this.btn_saodang.label = dupinfo.leftSweepNum > 0 ? "扫荡" : "已扫荡";
	}
	//扫荡处理
	private onSaodang(event: egret.Event): void {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_UNION)[0];
		var saodangNotice = [{ text: `是否确认扫荡至第${dupinfo.pass - 1}关？（每天仅有一次扫荡机会）`, style: {} }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(saodangNotice, function () {
				var saodangMsg: Message = new Message(MESSAGE_ID.GAME_DUP_BUYNUM_MESSAGE);
				saodangMsg.setByte(dupinfo.id);
				GameCommon.getInstance().sendMsgToServer(saodangMsg);
			}, this))
		);
	}
	//打开排行榜
	private onOpenRank(): void {
		TopRankSimplePanel.NAME2_VISIBLE = false;
		TopRankSimplePanel.ADD_STR = "关";
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TopRankSimplePanel", this.rankData));
	}
	//打开奖励描述
	private onOpenAwdNotice(): void {
		var saodangNotice = [{ text: `可随机获得坐骑装备、银币`, style: {} }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(saodangNotice, null, this))
		);
	}
	//助威处理
	private onSendCheerMsg(): void {
		var cheerMsg: Message = new Message(MESSAGE_ID.UNION_DUP_ZHUWEI_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(cheerMsg);
	}
	//一键领取处理
	private onSendGetPassAward(): void {
		var cheerMsg: Message = new Message(MESSAGE_ID.UNION_DUP_REWARD_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(cheerMsg);
	}
	//The end
}
//昨日第一名
class UnionDupYesFirstData {
	public playerid: number;
	public name: string;
	public headIndex: number;
	public headFrame: number;
	public passNum: number;//过关数

	public onParse(msg: Message): void {
		this.playerid = msg.getInt();
		this.name = msg.getString();
		this.headIndex = msg.getByte();
		this.headFrame = msg.getByte();
		this.passNum = msg.getShort();
		this.cheerNum = msg.getShort();
	}

	private _cheerNum: number;//助威数
	public set cheerNum(value: number) {
		this._cheerNum = value;
	}
	public get cheerNum(): number {
		return this._cheerNum;
	}
}