class ActivityZhongqiuDan extends ActivityZhongqiuBase{
	private btnFire: eui.Button;
	private btnFire10: eui.Button;
	private groups: eui.Group[];
	private groupEffect: eui.Group;
	private imgRockers: eui.Image[];
	private rewards: AwardItem[];
	private mountBody: Animation;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.type = ZHUANPAN_TYPE.dan;
		this.skinName = skins.ActivityZhongqiuDan;
	}
	protected onInit(): void {
		super.onInit();
		this.groups = [this['group0'],this['group1']];
		this.imgRockers = [this['imgRocker0'],this['imgRocker1']];
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
	private initItemList(){
		this.rewards = this.getCurrModel().rewards;
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
	protected onRemove(): void {
		super.onRemove();
		this.closeEffect();
	}
	protected onDealRocker(){
		let doudongDis = 20;
		let doudongTime = 50;
		var tw = egret.Tween.get(this.imgRockers[0]);
		tw.to({rotation: doudongDis}, doudongTime);
		tw.to({rotation: -doudongDis}, doudongTime * 2);
		tw.to({rotation: doudongDis / 2}, doudongTime * 1.5);
		tw.to({rotation: -doudongDis / 2}, doudongTime);
		tw.to({rotation: 0}, doudongTime / 2);
		let instance = this;
		tw.call(()=>{
			egret.Tween.removeTweens(instance.imgRockers[0]);
			instance.openEffect();
		}, this);
	}
	private openEffect(){
		this.mountBody = new Animation('zadan_01');
		this.mountBody.autoRemove = false;
		this.mountBody.playNum = 1;
		this.mountBody.playFinishCallBack(this.onActionFinish, this)
		this.groupEffect.addChild(this.mountBody);
		this.mountBody.x = this.groupEffect.width / 2;
		this.mountBody.y = this.groupEffect.height / 2;
	}
	private closeEffect(){
		if(this.mountBody){
			this.mountBody.onStop();
			this.groupEffect.removeChild(this.mountBody);
			this.mountBody = null;
		}
	}
	private onActionFinish(){
		this.closeEffect();
		this.setActionState(1);
		this.onRewardShow();
	}
	protected onCloseAwdShow(): void {
		super.onCloseAwdShow();
		this.resetUI();
	}
	protected resetUI(){
		super.resetUI();
		this.setActionState(0);
		this.imgRockers[0].rotation = 0;
	}
	private setActionState(state){
		for(let i = 0; i < this.imgRockers.length; ++i){
			this.imgRockers[i].visible = state == i;
			this.imgRockers[i].visible = state == i;
		}
	}
	// private runFinish(){
	// 	this.onRewardShow();
	// 	this.resetUI();
	// }
}