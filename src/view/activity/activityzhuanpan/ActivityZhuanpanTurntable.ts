class ActivityZhuanpanTurntable  extends ActivityLabaBase{
	private btnFire: eui.Button;
	private btnFire10: eui.Button;
	private groupRound: eui.Group;
	private rewards: AwardItem[];
	public constructor(owner) {
		super(owner);
	}

	protected onSkinName(): void {
		this.skinName = skins.ActivityZhuanpanTurntable;
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
		this.initItemList();
		this.initRed(this.btnFire, GameDefine.RED_BTN_POS, 1);
		this.initRed(this.btnFire10, GameDefine.RED_BTN_POS, 10);
	}
	private initItemList(){
		this.rewards = this.labaManager.currModel.rewards;
		for(var i = 0; i < 8/*this.rewards.length*/; ++i){
			let goods: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goods.x = this.groupRound.width / 2;
			goods.y = this.groupRound.height / 2;
			goods.anchorOffsetX = goods.width / 2;
			goods.anchorOffsetY = 220;
			goods.scaleX = goods.scaleY = 0.6;
			this.groupRound.addChild(goods);
			goods.rotation = i * -45;

			goods.num_label.text = "";
			goods.name_label.text = this.rewards[i].num.toString();
			goods.name_label.size = 34;
			goods.name_label.textColor = GameCommon.getInstance().CreateNameColer(goods.model.quality);
		}
	}
	// protected onRegist(){
	// 	super.onRegist();
	// }
	private getRewardIdx(){
		var type = this.labaManager.itemList[0].itemType;
		var id = this.labaManager.itemList[0].itemId;
		var count = this.labaManager.itemList[0].itemCount;
		for(var i = 0; i < this.rewards.length; ++i){
			if(type == this.rewards[i].type && id == this.rewards[i].id && count == this.rewards[i].num){
				return i % 8;
			}
		}
		return 0;
	}
	protected onDealRocker(){
		var tw = egret.Tween.get(this.groupRound);
		var oneTime = 500;
		var rotaEnd = 360 * 4 + this.getRewardIdx() * 45;
		tw.to({rotation: rotaEnd}, 2000);
		tw.to({rotation: rotaEnd + 360}, oneTime + 100);

		let instance = this;
		tw.call(()=>{
			egret.Tween.removeTweens(instance.groupRound);
			instance.runFinish();
		}, this);
	}
	protected resetUI(){
		super.resetUI();
		this.groupRound.rotation = this.groupRound.rotation % 360;
	}
	private runFinish(){
		this.onRewardShow();
		this.resetUI();
	}
}