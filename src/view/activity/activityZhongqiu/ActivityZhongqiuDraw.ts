class ActivityZhongqiuDraw extends ActivityZhongqiuBase{
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
		this.type = ZHUANPAN_TYPE.draw;
		this.skinName = skins.ActivityZhongqiuDraw;
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
		this.rewards = this.getCurrModel().rewards;
		let itemH = 120;
		for (let i: number = 0; i < this.rewards.length; i++) {
			let goodsLeft: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goodsLeft.y = Math.floor((i % 8) / 2) * itemH;
			if(i % 2 == 0){
				goodsLeft.x = Math.floor(i / 8) * 158;
				this.groups[0].addChild(goodsLeft);
			} else {
				goodsLeft.x = Math.floor(i / 8) * -158;
				this.groups[1].addChild(goodsLeft);
			}
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
	// protected resetUI(){
	// 	super.resetUI();
	// }
	// private runFinish(){
	// 	this.onRewardShow();
	// 	this.resetUI();
	// }
}