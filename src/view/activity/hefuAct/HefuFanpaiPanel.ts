class HefuFanpaiPanel extends HefuTreasurePanel {
	private showawd_grp: eui.Group;
	private cardRecords: ForgePosInfo[];
	private lottery_result_grp: eui.Group;
	private lottery_awd_grp: eui.Group;
	private one_lottery_goods: GoodsInstance;
	private LOTTRY_CARD_MAX: number = 3;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuFanPaiPanelSkin;
	}
	protected onInit(): void {
		this.cardRecords = [];
		for (let i: number = 0; i < this.LOTTRY_CARD_MAX; i++) {
			let cardImg: eui.Image = this['lottery_card' + i];
			this.cardRecords[i] = new ForgePosInfo(cardImg.x, cardImg.y, cardImg.rotation, cardImg.parent.getChildIndex(cardImg));
		}
		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();
		this.lottery_result_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeLotteryGrp, this);
		this.lottery_result_grp.visible = false;
	}
	protected onRemove(): void {
		super.onRemove();
		this.lottery_result_grp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeLotteryGrp, this);
		this.onResetQianPos();
	}
	//覆盖方法  更新奖励预览
	protected onShowTurnplate(): void {
		this.showawd_grp.removeChildren();
		let _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
		let iconModel: ModelThing;
		let _len: number = Math.min(_rewards.length, 8);
		for (let i: number = 0; i < _len; i++) {
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(_rewards[i]);
			this.showawd_grp.addChild(goodsinstance);
		}
	}
	/**方法覆盖 抽奖的动画**/
	protected onRotateback() {
		if (!this.isRun) {
			this.isRun = true;

			egret.Tween.get(this['lottery_card1']).to({ y: 341, x: 100, rotation: 0 }, 200).wait(100).to({ x: 302 }, 300);
			egret.Tween.get(this['lottery_card2']).to({ y: 341, x: 100, rotation: 0 }, 200).wait(100).to({ x: -102 }, 300).call(function onCardTop(): void {
				let randomIdx: number = Tool.toInt(Math.random() * this.LOTTRY_CARD_MAX);
				let imgCard: eui.Image = this['lottery_card' + randomIdx];
				imgCard.parent.setChildIndex(imgCard, imgCard.parent.numChildren - 1);
				egret.Tween.get(imgCard).to({ scaleX: 0 }, 200).to({ scaleX: 1 }, 200).to({ scaleX: 0 }, 200);
				egret.Tween.get(imgCard).to({ x: 100, y: 200 }, 600).wait(100).call(this.onPlayDone, this);
			}, this);
		}
	}
	protected onPlayDone(): void {
		if (this.manager.tp == 1) {
			this.one_lottery_goods.onUpdate(this.manager.zhuanpanType, this.manager.zhuanpanId, 0, null, this.manager.zhuanpanAwardNum);
			this.lottery_result_grp.visible = true;
			this.lottery_awd_grp.scaleX = 0;
			egret.Tween.get(this.lottery_awd_grp).to({ scaleX: 1 }, 500, egret.Ease.circIn);
		}
		else {
			super.onShowTenAward();
			egret.Tween.get(this.lottery_awd_grp).wait(200).call(this.onResetQianPos, this);
		}
	}
	//卡片归位
	private onResetQianPos(): void {
		for (let i: number = 0; i < this.LOTTRY_CARD_MAX; i++) {
			let cardImg: eui.Image = this['lottery_card' + i];
			egret.Tween.removeTweens(cardImg);
			let posinfo: ForgePosInfo = this.cardRecords[i];
			cardImg.x = posinfo.posX;
			cardImg.y = posinfo.posY;
			cardImg.rotation = posinfo.scale;
			cardImg.scaleX = cardImg.scaleY = 1;
			cardImg.parent.setChildIndex(cardImg, posinfo.childNum);
		}
		this.isRun = false;
	}
	protected onShowTenAward(): void {
		this.onRotateback();
	}
	private closeLotteryGrp(): void {
		this.onResetQianPos();
		this.lottery_result_grp.visible = false;
	}
	//The end
}