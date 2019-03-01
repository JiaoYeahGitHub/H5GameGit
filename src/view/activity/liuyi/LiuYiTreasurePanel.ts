class LiuYiTreasurePanel extends BaseTabView {
	private disc_outside: eui.Group;
	private btn_turn: eui.Button;
	private label_points: eui.Label;
	private label_points1: eui.Label;
	private img_cons: eui.Image;
	private isRun: boolean = false;
	private playLayer: eui.Group;
	private currHasNum: number[];
	private week_times_lab: eui.Label;
	private reward_week_btn: eui.Button;
	private WEEK_AWD_MAX: number = 4;
	private consumItem: ConsumeBar;
	private nbItem: eui.Group;
	private btn_turn1: eui.Button;
	private timeLab: eui.Label;
	private nextNBItemDesc: eui.Label;
	private bar: eui.Scroller;
	private label_log: eui.Label;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LiuYiTreasurePanelSkin;
	}
	private get manager(): FestivalWuYiManager {
		return DataManager.getInstance().festivalWuYiManager;
	}
	protected onInit(): void {
		var item: FSTreasureItem;
		super.onInit();
		this.currHasNum = [];
		this.points[0].register(this.reward_week_btn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().festivalWuYiManager, "checkTreasurePoint");
		let weekAwdParams: string[] = this.manager.zhuanpanModel.box.split("#");
		for (let i: number = 0; i < 4; i++) {
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let count: number = parseInt(params[0]);
			(this[`award_times_lab${i}`] as eui.Label).text = Language.instance.getText(count, 'times');
			(this[`award_box_img${i}`] as eui.Image).name = params[1];
			(this[`award_box_img${i}`] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
		}
		for (let i = 0; i < 8; i++) {
			(this[`img_icon${i}`] as eui.Image).name = i + '';
		}
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_turn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		this.btn_turn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn1, this);
		this.reward_week_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_INVESTTURNPLATE_MESSAGE.toString(), this.onUpdateLog, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE.toString(), this.onTreasureBackMsg, this);
		for (let i = 0; i < 8; i++) {
			(this[`img_icon${i}`] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAwardTips, this);
		}
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.reward_week_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		this.btn_turn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		this.btn_turn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn1, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_INVESTTURNPLATE_MESSAGE.toString(), this.onUpdateLog, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE.toString(), this.onTreasureBackMsg, this);
		for (let i = 0; i < 8; i++) {
			(this[`img_icon${i}`] as eui.Image).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAwardTips, this);
		}
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.isRun = false;
		this.onUpdateLog();
		this.onUpdateWeekAward();
		this.onShowTurnplate();
		this.week_times_lab.text = "" + DataManager.getInstance().festivalWuYiManager.zhuanpanNum;
	}
	private onTouchBtnAward(): void {
		let message: Message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
		message.setByte(2);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//更新抽奖的LOG
	private onUpdateLog(): void {
		this.label_log.textFlow = DataManager.getInstance().festivalWuYiManager.getTextFlow();
		setTimeout(this.adjustChatBar.bind(this), 10);
	}
	private adjustChatBar() {
		this.bar.viewport.scrollV = Math.max(this.bar.viewport.contentHeight - this.bar.viewport.height, 0);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.WUYIACTIVITY);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
			// this.owner.onTimeOut();
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private onNextData(): void {
		this.week_times_lab.text = "" + (DataManager.getInstance().festivalWuYiManager.zhuanpanNum);
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_itemThing && _itemThing.num > 0) {
			this.consumItem.visible = true;
			this.consumItem.setCostByAwardItem(this.manager.zhuanpanModel.costList[0]);
			this.label_points.text = '';
			this.img_cons.visible = false;
		}
		else {
			this.consumItem.visible = false;
			this.img_cons.visible = true;
			// iconModel = GameCommon.getInstance().getThingModel(this.model.costList[1].type, this.model.costList[1].id);
			this.label_points.text = this.manager.zhuanpanModel.costList[1].num.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.manager.zhuanpanModel.costList[1].num) {
				this.label_points.textColor = 0xFF0000;
			} else {
				this.label_points.textColor = 0xe9deb3;
			}
		}
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costTen);
		this.label_points1.text = tenAward[0].num.toString();
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
		if (_has < tenAward[0].num) {
			this.label_points1.textColor = 0xFF0000;
		} else {
			this.label_points1.textColor = 0xe9deb3;
		}
	}
	private onPlayDone() {
		this.onShowAward();
		this.onRefresh();
	}
	//更新周奖励
	private onUpdateWeekAward(): void {
		this.reward_week_btn.enabled = false;
		let manager: FestivalWuYiManager = DataManager.getInstance().festivalWuYiManager;
		let model: Modelzhuanpanhuodong = this.manager.zhuanpanModel;
		let weekAwdParams: string[] = model.box.split("#");
		var curBox: number = 0;
		this.nextNBItemDesc.text = '';
		while (this.nbItem.numChildren > 0) {
			let display = this.nbItem.getChildAt(0);
			this.nbItem.removeChild(display);
		}
		for (let i: number = 0; i < this.WEEK_AWD_MAX; i++) {
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let times: number = parseInt(params[0]);
			let boxImg: eui.Image = (this[`award_box_img${i}`] as eui.Image);
			let animgrp: eui.Group = (this[`reward_anim_grp${i}`] as eui.Group);
			let count: number = parseInt(params[0]);
			(this[`award_times_lab${i}`] as eui.Label).text = Language.instance.getText(count, 'times');
			animgrp.removeChildren();
			if (manager.treasureAwdIdx >= times) {
				curBox = curBox + 1;
				boxImg.source = 'icon_tangguo01_png';
			} else {
				boxImg.source = 'icon_tangguo02_png';
				if (manager.zhuanpanNum >= times) {
					if (!this.reward_week_btn.enabled) {
						this.reward_week_btn.enabled = true;
					}
					GameCommon.getInstance().addAnimation('baoxiangtixing', null, animgrp, -1);
					curBox = curBox + 1;
				}
				else {
					if (curBox == i) {
						var box: Modelbox = JsonModelManager.instance.getModelbox()[parseInt(params[1])];
						var goodsItem: GoodsInstance = new GoodsInstance();
						var awardItem: AwardItem = box.rewards[0];
						goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
						this.nextNBItemDesc.text = '再抽' + (times - manager.zhuanpanNum) + '次可获得';
						this.nbItem.addChild(goodsItem);
					}
				}
			}
		}
	}
	//查看宝箱的TIPS
	private onTouchBox(event: egret.Event): void {
		var img: eui.Image = event.currentTarget as eui.Image;
		var box: Modelbox = JsonModelManager.instance.getModelbox()[img.name];
		var base = new ThingBase(GOODS_TYPE.BOX);
		base.onupdate(img.name, box.quality, 0);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
		);
	}
	//查看奖品的TIPS
	private onShowAwardTips(event: egret.Event): void {
		let index: number = parseInt(event.currentTarget.name);
		let _rewardItem: AwardItem = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)[index];
		if (_rewardItem) {
			var base;
			var tipsType: number;
			if (_rewardItem.type == GOODS_TYPE.MASTER_EQUIP || _rewardItem.type == GOODS_TYPE.SERVANT_EQUIP) {
				base = new EquipThing(_rewardItem.type);
				base.onupdate(_rewardItem.id, _rewardItem.quality, 0);
				tipsType = INTRODUCE_TYPE.EQUIP;
			} else {
				base = new ThingBase(_rewardItem.type);
				base.onupdate(_rewardItem.id, _rewardItem.quality, 0);
				tipsType = INTRODUCE_TYPE.IMG;
			}
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("ItemIntroducebar",
					new IntroduceBarParam(tipsType, _rewardItem.type, base, _rewardItem.uid)
				)
			);
		}
	}
	//抽奖返回
	private onTreasureBackMsg(): void {
		if (DataManager.getInstance().festivalWuYiManager.tp == 1) {
			this.onNextData();
			this.onRotateback();
		}
		else if (DataManager.getInstance().festivalWuYiManager.tp == 10 || DataManager.getInstance().festivalWuYiManager.tp == 9) {
			this.onShowTenAward();
		}
		else {
			this.onRefresh();
		}
	}

	private onShowTenAward(): void {
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "十连抽获得以下奖励";
		param.titleSource = "";
		param.itemAwards = DataManager.getInstance().festivalWuYiManager.temAward;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
		this.onRefresh();
	}
	private onShowAward(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)
		for (var i: number = 0; i < _rewards.length; i++) {
			if (DataManager.getInstance().festivalWuYiManager.zhuanpanId == _rewards[i].id && DataManager.getInstance().festivalWuYiManager.zhuanpanType == _rewards[i].type && DataManager.getInstance().festivalWuYiManager.zhuanpanAwardNum == _rewards[i].num) {
				var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type) - this.currHasNum[i];
				if (add > 0) {
					var model = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
					GameCommon.getInstance().onGetThingAlert(model, add, GOODS_CHANGE_TYPE.DELAY_ADD);
				}
			}
		}
	}
	private onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			var arr = this.manager.zhuanpanModel.show.split("#");
			var i: number = 0;
			var param;
			var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)
			for (i = 0; i < _rewards.length; i++) {
				if (DataManager.getInstance().festivalWuYiManager.zhuanpanId == _rewards[i].id && DataManager.getInstance().festivalWuYiManager.zhuanpanType == _rewards[i].type && DataManager.getInstance().festivalWuYiManager.zhuanpanAwardNum == _rewards[i].num) {
					var RotationLong;
					RotationLong = this.getRotationLong(8, 4, 3, i, 1);//获取总长度
					egret.Tween.get(this.disc_outside).to({ rotation: RotationLong }, 2000, egret.Ease.sineInOut).call(this.onPlayDone, this).wait(2300).call(this.onReady, this);
					return;
				}
			}
			//前后端配置对不上了
			this.isRun = false;
		}
	}
	public onHide(): void {
		this.isRun = false;
		super.onHide();
	}
	private onReady(): void {
		// this.effectGroup.visible = false;
		this.isRun = false;
	}
	//获取总长度函数
	private getRotationLong(Scores, Qmin, Qmax, Location, direction: number = 1) {
		var _location = (360 / Scores) * Location * direction;//目标奖区的起始点
		var _q = 360 * (Math.floor(Math.random() * (Qmax - Qmin)) + Qmin) * direction;//整圈长度
		return _q + _location;
	}
	private onTouchBtnTurn1(): void {
		if (this.isRun) return;
		// this.onRotateback();
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costTen);
		this.label_points1.text = tenAward[0].num.toString();
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
		if (_has < tenAward[0].num) {
			GameCommon.getInstance().addAlert('error_tips_2');
			return;
		}

		if (!GameFight.getInstance().checkBagIsFull()) {

			var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
			// var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
			// var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
			// if (_hasitemNum > 0) {
			// 	message.setByte(10);
			// }
			// else {
			message.setByte(9);
			// }
			GameCommon.getInstance().sendMsgToServer(message);
		}
	}
	private onTouchBtnTurn(): void {
		if (this.isRun) return;
		// this.onRotateback();
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_hasitemNum == 0) {
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.manager.zhuanpanModel.costList[1].num) {
				GameCommon.getInstance().addAlert('error_tips_2');
				return;
			}
		}
		if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
			message.setByte(1);
			GameCommon.getInstance().sendMsgToServer(message);
		}

	}
	private onShowTurnplate(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
		var arr = this.manager.zhuanpanModel.show.split("#");
		var i: number = 0;
		var param;
		var iconModel
		for (i = 0; i < _rewards.length; i++) {
			var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type);
			this.currHasNum[i] = add;

			iconModel = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
			(this[`img_icon${i}`] as eui.Image).source = iconModel.icon;
			(this[`label_num${i}`] as eui.Label).textFlow = new Array<egret.ITextElement>({ text: iconModel.name + '*' + _rewards[i].num, style: { "textColor": GameCommon.getInstance().CreateNameColer(iconModel.quality) } });
		}
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_hasitemNum > 0) {
			this.consumItem.visible = true;
			this.consumItem.setCostByAwardItem(this.manager.zhuanpanModel.costList[0]);
			this.label_points.text = '';
			this.img_cons.visible = false;
		}
		else {
			this.consumItem.visible = false;
			this.img_cons.visible = true;
			iconModel = GameCommon.getInstance().getThingModel(this.manager.zhuanpanModel.costList[1].type, this.manager.zhuanpanModel.costList[1].id);
			this.label_points.text = this.manager.zhuanpanModel.costList[1].num.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.manager.zhuanpanModel.costList[1].num) {
				this.label_points.textColor = 0xFF0000;
			} else {
				this.label_points.textColor = 0xe9deb3;
			}
			this.img_cons.source = iconModel.dropicon;
		}
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costTen);
		this.label_points1.text = tenAward[0].num.toString();
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
		if (_has < tenAward[0].num) {
			this.label_points1.textColor = 0xFF0000;
		} else {
			this.label_points1.textColor = 0xe9deb3;
		}
	}

}