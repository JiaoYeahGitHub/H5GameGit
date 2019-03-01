class ShenQiTreasurePanel extends BaseTabView {
	private disc_outside: eui.Group;
	private btn_turn: eui.Button;
	private label_points: eui.Label;
	private label_points1: eui.Label;
	private img_cons: eui.Image;
	protected isRun: boolean = false;
	private playLayer: eui.Group;
	private currHasNum: number[];
	private week_times_lab: eui.Label;
	// private reward_week_btn: eui.Button;
	private WEEK_AWD_MAX: number = 4;
	private consumItem: ConsumeBar;
	private consumItem1: ConsumeBar;
	private nbItem: eui.Group;
	private btn_turn1: eui.Button;
	private timeLab: eui.Label;
	private nextNBItemDesc: eui.Label;
	private bar: eui.Scroller;
	private label_log: eui.Label;
	private img_cons1:eui.Image;
	private bar_exp: eui.ProgressBar;
	private groups: eui.Group[];
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private rewards: AwardItem[];
	private rect: eui.Rect;
	private lbAlert: eui.Label;
	private imgZhong: eui.Image;
	private showAwardGroup: eui.Group;
	private showAwardPanel:eui.Group;
	private itemNb: GoodsInstance;
	private nbItem1: GoodsInstance;
	private nbItem1Name:eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ShenQiTreasurePanelSkin;
	}
	protected get manager(): ShenQiZhuanPanManager {
		return DataManager.getInstance().shenqiZhuanPanManager;
	}
	protected onInit(): void {
		var item: FSTreasureItem;
		super.onInit();
		this.currHasNum = [];
		this.consumItem.nameColor = 0xf3f3f3;
		this.consumItem1.nameColor = 0xf3f3f3;
		this.bar_exp.maximum = 10000;
		this.groups = [this['group0'],this['group1']];
		this.onRefresh();
		this.initItemList();
	}
	private initItemList(){
		this.rewards = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
		let itemH = 120;
		for (let i: number = 0; i < this.rewards.length; i++) {
			let goodsLeft: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goodsLeft.y = Math.floor((i % 8) / 2) * itemH;
			if(i==8)
			{
				this.nbItem1.onUpdate(this.rewards[i].type,this.rewards[i].id)
				this.nbItem1.currentState = 'notName';
				this.nbItem1Name.text = GameCommon.getInstance().getThingModel(this.rewards[i].type, this.rewards[i].id,-1).name;
			}
			else
			{
				if(i % 2 == 0){
				goodsLeft.x = Math.floor(i / 8) * 158;
				this.groups[0].addChild(goodsLeft);
				} else {
					goodsLeft.x = Math.floor(i / 8) * -158;
					this.groups[1].addChild(goodsLeft);
				}
			}
		}
		
	}
	protected onDealRocker(){
		this.onPlayDone();
	}
	protected onRegist(): void {
		super.onRegist();
		this.showAwardPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		this.btn_turn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		this.btn_turn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn1, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_PLATE.toString(), this.onTreasureBackMsg, this);
		this.examineCD(true);

	}
	protected onRemove(): void {
		super.onRemove();
		this.showAwardPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		this.btn_turn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		this.btn_turn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn1, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_PLATE.toString(), this.onTreasureBackMsg, this);
		this.examineCD(false);
	}
	private onCloseAwdShow(): void {
		this.showAwardPanel.visible = false;
		egret.Tween.removeTweens(this.showAwardGroup);
		this.isAction = false;
	}
	protected onRefresh(): void {
		this.onUpdateWeekAward();
		this.onUpdateCost();
		this.week_times_lab.text = "" + DataManager.getInstance().shenqiZhuanPanManager.zhuanpanNum;
	}
	private actionInit(){
		this.rect.visible = this.lbAlert.visible = false;
		this.imgZhong.visible = true;
		let scale = 0.1;
		let time = 300;
		let top = 444;
		let bottom = 312;
		let dis = (top - bottom) / 4;
		this.showAwardGroup.scaleX = this.showAwardGroup.scaleY = scale;
		this.showAwardGroup.y = bottom;

		var tw = egret.Tween.get(this.showAwardGroup);
		let instance = this;
		tw.to({scaleX: -(scale + 0.1), scaleY: scale + 0.1}, time);
		tw.to({scaleX: scale + 0.2, scaleY: scale + 0.2}, time);
		tw.to({scaleX: -(scale + 0.3), scaleY: scale + 0.3}, time);
		tw.to({scaleX: scale + 0.4, scaleY: scale + 0.4}, time);
		tw.wait(300);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.showAwardGroup);
			instance.actionDown();
		}, this);
	}
	private isAction: boolean;
	private actionDown(){
		this.imgZhong.visible = false;
		let instance = this;
		var tw = egret.Tween.get(this.showAwardGroup);

		tw.to({y: 444, scaleX: 0.6, scaleY: 0.6}, 300);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.showAwardGroup);
			instance.lbAlert.visible = instance.rect.visible = true;
			instance.resetUI();
		}, this);
	}
	private resetUI(){
		this.isAction = false;
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
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ACT_SHENQICHOUQIAN);
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
		this.week_times_lab.text = "" + (DataManager.getInstance().shenqiZhuanPanManager.zhuanpanNum);
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		this.bar_exp.value = DataManager.getInstance().shenqiZhuanPanManager.treasureAwdIdx;
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
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costFive);
		if(_hasitemNum>=tenAward[0].num)
		{
			this.consumItem1.visible = true;
			this.consumItem1.setCostByAwardItem(tenAward[0]);
			this.img_cons1.visible = false;
			this.label_points1.text = '';
		}
		else
		{
			this.consumItem1.visible = false;
			this.img_cons1.visible = true;
			this.label_points1.text = tenAward[1].num.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < tenAward[1].num) {
				this.label_points1.textColor = 0xFF0000;
			} else {
				this.label_points1.textColor = 0xe9deb3;
			}
		}
		
	}
	protected onPlayDone() {
		this.showAwardPanel.visible = true;
		
		var item:AwardItem = new AwardItem(DataManager.getInstance().shenqiZhuanPanManager.zhuanpanType, DataManager.getInstance().shenqiZhuanPanManager.zhuanpanId, DataManager.getInstance().shenqiZhuanPanManager.zhuanpanNum);
		if(item)
		{
			this.updateGoods(this.itemNb, item);
		}
		this.actionInit();
	}
	private updateGoods(goodsitem: GoodsInstance, awarditem: AwardItem) {
        goodsitem.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
    }
	//更新周奖励
	private onUpdateWeekAward(): void {
		// this.reward_week_btn.enabled = false;
		let model: Modelshenqichouqian = this.manager.zhuanpanModel;
		this.bar_exp.value = DataManager.getInstance().shenqiZhuanPanManager.treasureAwdIdx;
	}
	//抽奖返回
	private onTreasureBackMsg(): void {
		var tp:number = DataManager.getInstance().shenqiZhuanPanManager.tp ;
		if (tp== 1||tp== 2) {
			this.onNextData();
			this.onRotateback();
		}
		else if (tp == 3 || tp== 4) {
			this.onShowTenAward();
		}
		else {
			this.onRefresh();
		}
	}

	protected onShowTenAward(): void {
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "五连抽获得以下奖励";
		param.titleSource = "";
		param.itemAwards = DataManager.getInstance().shenqiZhuanPanManager.temAward;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
		this.onRefresh();
	}
	protected onShowAward(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)
		for (var i: number = 0; i < _rewards.length; i++) {
			if (DataManager.getInstance().shenqiZhuanPanManager.zhuanpanId == _rewards[i].id && DataManager.getInstance().shenqiZhuanPanManager.zhuanpanType == _rewards[i].type && DataManager.getInstance().festivalWuYiManager.zhuanpanAwardNum == _rewards[i].num) {
				// var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type) - this.currHasNum[i];
				// if (add > 0) {
				var model = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
				GameCommon.getInstance().onGetThingAlert(model, _rewards[i].num, GOODS_CHANGE_TYPE.DELAY_ADD);
				break;
				// }
			}
		}
	}
	//覆盖方法 抽奖动画
	protected onRotateback() {
		this.onPlayDone();
	}
	public onHide(): void {
		super.onHide();
	}
	private onTouchBtnTurn1(): void {
		if (this.isAction) return;
		// this.onRotateback();
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costFive);
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_hasitemNum == 0) {
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < tenAward[1].num) {
			GameCommon.getInstance().addAlert('钻石不足');
			return;
			}
		}
		else
		{
			if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
			message.setByte(3);
			GameCommon.getInstance().sendMsgToServer(message);
			}
		}
		if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
			message.setByte(4);
			GameCommon.getInstance().sendMsgToServer(message);
		}
	}
	private onTouchBtnTurn(): void {
		if (this.isAction) return;
		// this.onRotateback();
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_hasitemNum == 0) {
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.manager.zhuanpanModel.costList[1].num) {
				GameCommon.getInstance().addAlert('钻石不足');
				return;
			}
		}
		else
		{
			if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
			message.setByte(1);
			GameCommon.getInstance().sendMsgToServer(message);
			}
		}
		if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
			message.setByte(2);
			GameCommon.getInstance().sendMsgToServer(message);
		}
		
	}
	//更新消耗
	private onUpdateCost(): void {
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
			let iconModel: ModelThing = GameCommon.getInstance().getThingModel(this.manager.zhuanpanModel.costList[1].type, this.manager.zhuanpanModel.costList[1].id);
			this.label_points.text = this.manager.zhuanpanModel.costList[1].num.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.manager.zhuanpanModel.costList[1].num) {
				this.label_points.textColor = 0xFF0000;
			} else {
				this.label_points.textColor = 0xe9deb3;
			}
			this.img_cons.source = iconModel.dropicon;
		}
		var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costFive);
		if(_hasitemNum>=tenAward[0].num)
		{
			this.consumItem1.visible = true;
			this.consumItem1.setCostByAwardItem(tenAward[0]);
			this.img_cons1.visible = false;
			this.label_points1.text = '';
		}
		else
		{
			this.consumItem1.visible = false;
			this.img_cons1.visible = true;
			this.label_points1.text = tenAward[1].num.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < tenAward[1].num) {
				this.label_points1.textColor = 0xFF0000;
			} else {
				this.label_points1.textColor = 0xe9deb3;
			}
		}
	}
	//覆盖方法  更新奖励预览
	protected onShowTurnplate(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
		var arr = this.manager.zhuanpanModel.show.split("#");
		var i: number = 0;
		var param;
		var iconModel: ModelThing;
		for (i = 0; i < _rewards.length; i++) {
			var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type);
			this.currHasNum[i] = add;
			iconModel = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
			// (this[`img_icon${i}`] as eui.Image).source = iconModel.icon;
			let goods: GoodsInstance;
			goods = this[`img_icon${i}`];
			goods.onUpdate(_rewards[i].type, _rewards[i].id, 0, _rewards[i].quality, _rewards[i].num, _rewards[i].lv);
			goods.name_label.text = '';
			goods.num_label.text = '';
			goods.currentState = 'notName';
			(this[`label_num${i}`] as eui.Label).text = 'X' + _rewards[i].num;
			// (this[`label_num${i}`] as eui.Label).textFlow = new Array<egret.ITextElement>({ text: 'x' + _rewards[i].num, style: { "textColor": GameCommon.getInstance().CreateNameColer(iconModel.quality) } });
		}
	}
	//The end
}