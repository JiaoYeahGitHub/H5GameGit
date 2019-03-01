class HefuXunBaoPanel extends HefuTreasurePanel {
	// private disc_outside: eui.Group;
	// private btn_turn: eui.Button;
	// private playLayer: eui.Group;
	// private currHasNum: number[];
	// // private week_times_lab: eui.Label;
	// // private reward_week_btn: eui.Button;
	// // private WEEK_AWD_MAX: number = 4;
	// private consumItem: ConsumeBar;
	// private nbItem: eui.Group;
	// private btn_turn1: eui.Button;
	// private timeLab: eui.Label;
	// private nextNBItemDesc: eui.Label;
	// private bar: eui.Scroller;
	// private label_log: eui.Label;
	private best12: eui.Group;
	private selectEffct:eui.Image;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuXunBaoPanelSkin;
	}
	protected onInit(): void {
        super.onInit();
        this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.best12.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.best12.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
	}
	//点击动画
    private onTouchAnim(event: egret.Event): void {
        var gro: eui.Group = event.currentTarget as eui.Group;
        var box: Modelbox = JsonModelManager.instance.getModelbox()[gro.name];
        var base = new ThingBase(GOODS_TYPE.BOX);
        base.onupdate(gro.name, box.quality, 0);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
        );
    }
	//覆盖方法  更新奖励预览
	protected onShowTurnplate(): void {
		let goods: GoodsInstance;
        let awarditems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
        for (let i: number = 0; i < awarditems.length; i++) {
            let awarditem: AwardItem = awarditems[i];
            goods = this[`item${i}`];
            if (goods) {
				if(i == 0)
				{	
					let modelitem: ModelThing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id, awarditem.quality);
					if (this[`best${12}_icon`]) {
						this[`best${12}_icon`].source = modelitem.icon;
					}
					if (this[`best${12}_name_lab`]) {
						this[`best${12}_name_lab`].text = modelitem.name;
					}
					if (this[`best${12}`]) {
						this[`best${12}`].name = modelitem.id;
					}
				}
                goods.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num, awarditem.lv);
            } 
        }
	}
	protected onRefresh(): void {
		super.onRefresh();
		// this.isRun = false;
		// this.onShowTurnplate();
	}
	// private onTouchBtnAward(): void {
	// 	let message: Message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
	// 	message.setByte(2);
	// 	GameCommon.getInstance().sendMsgToServer(message);
	// }
	// private adjustChatBar() {
	// 	this.bar.viewport.scrollV = Math.max(this.bar.viewport.contentHeight - this.bar.viewport.height, 0);
	// }
	// private onNextData(): void {
	// 	this.week_times_lab.text = "" + (DataManager.getInstance().festivalWuYiManager.zhuanpanNum);
	// 	var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.manager.zhuanpanModel.costList[0].id);
	// 	var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
	// 	if (_itemThing && _itemThing.num > 0) {
	// 		this.consumItem.visible = true;
	// 		this.consumItem.setConsumeModel(JsonModelManager.instance.getModelitem()[this.manager.zhuanpanModel.costList[0].id], this.manager.zhuanpanModel.costList[0].num);
	// 		this.label_points.text = '';
	// 		this.img_cons.visible = false;
	// 	}
	// 	else {
	// 		this.consumItem.visible = false;
	// 		this.img_cons.visible = true;
	// 		// iconModel = GameCommon.getInstance().getThingModel(this.model.costList[1].type, this.model.costList[1].id);
	// 		this.label_points.text = this.manager.zhuanpanModel.costList[1].num.toString();
	// 		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
	// 		if (_has < this.manager.zhuanpanModel.costList[1].num) {
	// 			this.label_points.textColor = 0xFF0000;
	// 		} else {
	// 			this.label_points.textColor = 0xe9deb3;
	// 		}
	// 	}
	// 	var tenAward: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.costTen);
	// 	this.label_points1.text = tenAward[0].num.toString();
	// 	var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
	// 	if (_has < tenAward[0].num) {
	// 		this.label_points1.textColor = 0xFF0000;
	// 	} else {
	// 		this.label_points1.textColor = 0xe9deb3;
	// 	}
	// }
	// private onPlayDone() {
	// 	// this.onShowAward();
	// 	this.onRefresh();
	// }
	// //查看奖品的TIPS
	// private onShowAwardTips(event: egret.Event): void {
	// 	let index: number = parseInt(event.currentTarget.name);
	// 	let _rewardItem: AwardItem = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)[index];
	// 	if (_rewardItem) {
	// 		var base;
	// 		var tipsType: number;
	// 		if (_rewardItem.type == GOODS_TYPE.MASTER_EQUIP || _rewardItem.type == GOODS_TYPE.SERVANT_EQUIP) {
	// 			base = new EquipThing(_rewardItem.type);
	// 			base.onupdate(_rewardItem.id, _rewardItem.quality, 0);
	// 			tipsType = INTRODUCE_TYPE.EQUIP;
	// 		} else {
	// 			base = new ThingBase(_rewardItem.type);
	// 			base.onupdate(_rewardItem.id, _rewardItem.quality, 0);
	// 			tipsType = INTRODUCE_TYPE.IMG;
	// 		}
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
	// 			new WindowParam("ItemIntroducebar",
	// 				new IntroduceBarParam(tipsType, _rewardItem.type, base, _rewardItem.uid)
	// 			)
	// 		);
	// 	}
	// }
	/**方法覆盖 抽奖的动画**/

	protected onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			this.selectEffct.visible = true;
			var i: number = 0;
			var param;
			var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)
			for (i = 0; i < _rewards.length; i++) {
				if (DataManager.getInstance().festivalWuYiManager.zhuanpanId == _rewards[i].id && DataManager.getInstance().festivalWuYiManager.zhuanpanType == _rewards[i].type && DataManager.getInstance().festivalWuYiManager.zhuanpanAwardNum == _rewards[i].num) {
					this.endPos = 24+i;
					Tool.addTimer(this.onSelectEffect, this, 100);
					return;
				}
			}
			this.isRun = false;
			super.onRefresh();
			super.onShowAward();
		}
	}
	private endPos:number = 0;
	private effectNum:number = 0;
    private indexPosX=[85,206,327,447,447,447,447,327,206,85,85,85];
    private indexPosY=[305,305,305,305,420,536,653,653,653,653,536,420];
    private iconIndex:number = 0;
    private onSelectEffect():void{
		this.selectEffct.x = this.indexPosX[this.iconIndex];
		this.selectEffct.y = this.indexPosY[this.iconIndex];
        this.iconIndex = this.iconIndex+1;
		if(this.iconIndex>=11){
			this.iconIndex = 0;
		}
		this.effectNum = this.effectNum+1;
		if(this.effectNum>=this.endPos)
		{
			this.effectNum = 0;
			Tool.removeTimer(this.onSelectEffect, this, 100);
			this.isRun = false;
			super.onRefresh();
			super.onShowAward();
			this.iconIndex = 0;
			return;
		}
    }
}