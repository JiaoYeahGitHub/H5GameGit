class ActivityZhongqiuPoker extends ActivityZhongqiuBase {

	private btnFire: eui.Button;
	private btnFire10: eui.Button;
	private groupItem: eui.Group;
	private imgRockers: eui.Image[];
	private rect: eui.Rect;
	private lbAlert: eui.Label;
	private rewards: AwardItem[];
	private mountBody: Animation;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.type = ZHUANPAN_TYPE.poker;
		this.skinName = skins.ActivityzhongqiuPoker;
	}
	protected onInit(): void {
		super.onInit();
		this.imgRockers = [this['imgRocker0'],this['imgRocker1'],this['imgRocker2']];
		let instance = this;
		this.btnFire.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			instance.onEventRocker(1);
		}, this);
		this.btnFire10.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			instance.onEventRocker(10);
		}, this);
		this.initItemList();
		this.initRed(this.btnFire, GameDefine.RED_BTN_POS, 1);
		this.initRed(this.btnFire10, GameDefine.RED_BTN_POS, 10);
	}
	protected onRegist(): void {
		super.onRegist();
		this.onActionInit();
	}
	// protected onRemove(): void {
	// 	super.onRemove();
	// }
	protected onDealRocker(){
		let time = 500;
		this.onActionRun(this.imgRockers[0], this.imgRockers[1].x - 200, time);
		this.onActionRun(this.imgRockers[2], this.imgRockers[1].x + 200, time, true);
	}
	private onActionRun(img: eui.Image, move: number, time: number, isShow: boolean = false){
		let instance = this;
		let tw = egret.Tween.get(img);
		tw.to({x: this.imgRockers[1].x, y: this.imgRockers[1].y, rotation: this.imgRockers[1].rotation}, time);
		tw.to({x: move}, time);
		tw.call(()=>{
			if(isShow){
				instance.onActionShow(Tool.randomInt(0, 3), time);
			}
		}, this);
	}
	private setLayer(idx: number = -1){
		let j = 0;
		for(let i = 0; i < this.imgRockers.length; ++i){
			if(idx != i){
				this.imgRockers[i].parent.setChildIndex(this.imgRockers[i], j);
				++j;
			}
		}
		if(idx != -1){
			this.imgRockers[idx].parent.setChildIndex(this.imgRockers[idx], j);
		}
	}
	private onActionShow(idx: number, time: number, wait: number = 50){
		this.setLayer(idx);
		let instance = this;
		let endx = this.imgRockers[1].x;
		let endy = 680 - 210;
		let zx = Math.floor(this.imgRockers[idx].x + (endx - this.imgRockers[idx].x) / 3 * 2);
		let zy = Math.floor(this.imgRockers[idx].y + (endy - this.imgRockers[idx].y) / 3 * 2);
		let tw = egret.Tween.get(this.imgRockers[idx]);
		tw.wait(wait);
		tw.to({x: zx, y: zy, scaleX: -1}, time);
		tw.to({x: endx, y: endy, scaleX: 0}, time / 2);
		tw.call(()=>{
			//egret.Tween.removeTweens(instance.imgRockers[idx]);
			instance.imgRockers[idx].visible = false;
			instance.onActionFinish();
		}, this);
	}
	private onActionFinish(){
		for(let i = 0; i < this.imgRockers.length; ++i){
			egret.Tween.removeTweens(this.imgRockers[i]);
		}
		this.onRewardShow();
	}
	protected onPlayDone(awarditem: AwardItem) {
		this.showAwardPanel.visible = true;
		if (awarditem) {
			this.updateGoods(this.itemNb, awarditem);
		}
		// this.showAwardGroup.scaleX = this.showAwardGroup.scaleY = 0.3;
		// egret.Tween.get(this.showAwardGroup).to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backInOut);
		
		let instance = this;
		this.rect.visible = this.lbAlert.visible = false;
		this.showAwardGroup.scaleX = 0;
		let tw = egret.Tween.get(this.showAwardGroup);
		tw.to({scaleX: 1}, 500);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.showAwardGroup);
			instance.rect.visible = instance.lbAlert.visible = true;
			instance.resetUI();
		}, this);
	}
	private onActionInit(){
		let centerY = 300;
		let centerX = 300;

		this.imgRockers[1].x = centerX;
		this.imgRockers[1].y = centerY;
		this.imgRockers[1].rotation = 0;
		this.imgRockers[1].scaleX = 1;
		this.imgRockers[1].visible = true;

		this.imgRockers[0].x = centerX - 50;
		this.imgRockers[0].y = centerY + 12;
		this.imgRockers[0].rotation = -15;
		this.imgRockers[0].scaleX = 1;
		this.imgRockers[0].visible = true;
		

		this.imgRockers[2].x = centerX + 50;
		this.imgRockers[2].y = centerY + 12;
		this.imgRockers[2].rotation = 15;
		this.imgRockers[2].scaleX = 1;
		this.imgRockers[2].visible = true;
		this.setLayer();
	}
	protected onCloseAwdShow(): void {
		if(!this.isAction){
			super.onCloseAwdShow();
			this.onActionInit();
		}
	}
	private initItemList(){
		this.rewards = this.getCurrModel().rewards;
		let scale = 0.65;
		let itemW = 90;
		let disW = 8;

		let left = (this.groupItem.width - itemW * scale * this.rewards.length - disW * (this.rewards.length - 1)) / 2;
		for (let i: number = 0; i < this.rewards.length; i++) {
			let goodsLeft: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goodsLeft.x = left - 10;
			goodsLeft.y = 30;
			this.groupItem.addChild(goodsLeft);
			//goodsLeft.anchorOffsetX = goodsLeft.width / 2;
			goodsLeft.scaleX = goodsLeft.scaleY = scale;
			left += itemW * scale + disW;
		}
	}
}