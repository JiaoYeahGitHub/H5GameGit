class ActivityZhuanpanDraw  extends ActivityLabaBase{
	private btnFire: eui.Button;
	private btnFire10: eui.Button;
	private imgZhong: eui.Image;
	private groups: eui.Group[];
	private rewards: AwardItem[];
	private lbAlert: eui.Label;
	private rect: eui.Rect;
	public constructor(owner) {
		super(owner);
	}

	protected onSkinName(): void {
		this.skinName = skins.ActivityZhuanpanDraw;
	}
	protected onInit(): void {
		super.onInit();
		let instance = this;
		this.btnFire.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			instance.onEventRocker(1);
		}, this);
		this.btnFire10.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			instance.onEventRocker(10);
		}, this);
		this.groups = [this['group0'],this['group1']];
		this.initItemList();
		this.initRed(this.btnFire, GameDefine.RED_BTN_POS, 1);
		this.initRed(this.btnFire10, GameDefine.RED_BTN_POS, 10);
	}
	private initItemList(){
		this.rewards = this.labaManager.currModel.rewards;
		let scale = 0.9;
		for (let i: number = 0; i < 4; i++) {
			let goodsLeft: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goodsLeft.x = this.groups[0].width / 2;
			goodsLeft.y = i * (90 + 30) * scale;
			this.groups[0].addChild(goodsLeft);
			goodsLeft.anchorOffsetX = goodsLeft.width / 2;
			//goodsLeft.anchorOffsetY = goodsLeft.height / 2;
			goodsLeft.scaleX = goodsLeft.scaleY = scale;

			let goodsRight: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i + 4]);
			goodsRight.x = this.groups[1].width / 2;
			goodsRight.y = i * (90 + 30) * scale;
			this.groups[1].addChild(goodsRight);
			goodsRight.anchorOffsetX = goodsRight.width / 2;
			//goodsRight.anchorOffsetY = goodsRight.height / 2;
			goodsRight.scaleX = goodsRight.scaleY = scale;
		}
	}
	protected onRegist(){
		super.onRegist();
	}
	protected onDealRocker(){
		this.onRewardShow();
	}
	protected onPlayDone(awarditem: AwardItem) {
		this.showAwardPanel.visible = true;
		if (awarditem) {
			this.updateGoods(this.itemNb, awarditem);
		}
		this.actionInit();
	}
	private actionInit(){
		this.rect.visible = this.lbAlert.visible = false;
		this.imgZhong.visible = true;
		let scale = 0.5;
		let time = 300;
		let top = 380;
		let bottom = 537;
		let dis = (bottom - top) / 4;
		this.showAwardGroup.scaleX = this.showAwardGroup.scaleY = scale;
		this.showAwardGroup.y = bottom;

		var tw = egret.Tween.get(this.showAwardGroup);
		let instance = this;
		tw.to({y: bottom - dis, scaleX: -scale}, time);
		tw.to({y: bottom - dis * 2, scaleX: scale}, time);
		tw.to({y: bottom - dis * 3, scaleX: -scale}, time);
		tw.to({y: top, scaleX: scale}, time);
		tw.wait(300);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.showAwardGroup);
			instance.actionDown();
		}, this);
	}
	private actionDown(){
		this.imgZhong.visible = false;
		let instance = this;
		var tw = egret.Tween.get(this.showAwardGroup);

		tw.to({y: 510, scaleX: 1, scaleY: 1}, 300);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.showAwardGroup);
			instance.lbAlert.visible = instance.rect.visible = true;
			instance.resetUI();
		}, this);
	}
	// protected resetUI(){
	// 	super.resetUI();
	// }
	// private runFinish(){
	// 	this.onRewardShow();
	// 	this.resetUI();
	// }
}