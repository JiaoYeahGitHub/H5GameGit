class ActivityZhuanpan extends ActivityLabaBase {
	private scroller: eui.Scroller;
	private group: eui.Group;
	private groupReward: eui.Group;
	private groupRewards: eui.Group[];
	private imgRockers: eui.Image[];
	private btnFire: eui.Group;
	private rewardRuns: AwardItem[][];
	private rewards: AwardItem[];
	private timeDelays: number[];
	private timeSps: number[];
	private goodsLit: GoodsInstance[][];
	private groupRunTop: number;
	private isRunEnd: boolean;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.Activityzhuanpan;
	}
	protected onInit(): void {
		super.onInit();
		this.groupReward.mask = new egret.Rectangle(0, -10, this.groupReward.width, this.groupReward.height + 20);
		this.groupRewards = [this['groupReward0'], this['groupReward1'], this['groupReward2']];
		this.timeDelays = [400, 0, 700];
		this.timeSps = [200, 100, 150];
		this.imgRockers = [this['imgRocker0'],this['imgRocker1']];
		this.groupRunTop = this.groupRewards[0].y;
		let instance = this;
		this.btnFire.touchEnabled = true;
		this.btnFire.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			instance.onEventRocker(1);
		}, this);
		this.initItemList();
	}
	protected onRegist(){
		super.onRegist();
		this.resetGroups();
		var item = this.labaManager.getRewardItem() || this.rewards[1];
		if(item){
			this.rewardRuns[1][1] = item;
			this.updateGoods(this.goodsLit[1][1], this.rewardRuns[1][1]);
		}
	}
	protected onEventRocker(count: number = 1){
		if(!this.isAction){
			super.onEventRocker(count);
			this.setActionState(1);
		}
	}
	protected onDealRocker(){
		this.isRunEnd = false;
		this.setActionState(0);
		Tool.callbackTime(this.resetState, this, 500);
		this.resetGroups();
		this.timeDelays = [Tool.randomFloat(300, 600), 0, Tool.randomFloat(300, 600)];
		this.timeSps = [Tool.randomFloat(100, 200), Tool.randomFloat(100, 200), Tool.randomFloat(100, 200)];
		this.groupRunStart(0, this.timeDelays[0]);
		this.groupRunStart(1, this.timeDelays[1]);
		this.groupRunStart(2, this.timeDelays[2]);
		Tool.callbackTime(this.onActionEnd, this, 1500);
	}
	private groupRunStart(idx: number, delayTime: number = 0){
		var tw = egret.Tween.get(this.groupRewards[idx]);
		if(delayTime > 0){
			tw.wait(delayTime);
		}
		tw.to({y: 0}, this.timeSps[idx]);
		let instance = this;
		tw.call(()=>{
			egret.Tween.removeTweens(instance.groupRewards[idx]);
			instance.groupRunEnd(idx);
		}, this);
	}
	private groupRunEnd(idx){
		if(this.isAction){
			if(!this.isRunEnd){
				this.rewardRuns[idx][1] = this.rewardRuns[idx][0];
				this.rewardRuns[idx][0] = this.getRewardRandom();
				this.updateGoods(this.goodsLit[idx][0], this.rewardRuns[idx][0]);
				this.updateGoods(this.goodsLit[idx][1], this.rewardRuns[idx][1]);
				this.resetGroups(idx);
				this.groupRunStart(idx);
			} else {
				let tw = egret.Tween.get(this.groupRewards[idx]);
				if(idx == 1){
					this.rewardRuns[idx][1] = this.rewardRuns[idx][0];
					this.rewardRuns[idx][0] = this.labaManager.getRewardItem();
					this.updateGoods(this.goodsLit[idx][0], this.rewardRuns[idx][0]);
					this.updateGoods(this.goodsLit[idx][1], this.rewardRuns[idx][1]);
					this.resetGroups(idx);
					tw.to({y: 0}, this.timeSps[idx]);
					let instance = this;
					tw.call(()=>{
						egret.Tween.removeTweens(this.groupRewards[idx]);
						instance.onActionEnd(true);
					}, this);
				} else {
					tw.to({y: -this.groupRunTop}, this.timeSps[idx]);
					tw.call(()=>{
						egret.Tween.removeTweens(this.groupRewards[idx]);
					}, this);
				}
			}
		}
	}
	private onActionEnd(isLogic){
		this.isRunEnd = true;
		if(isLogic){
			this.resetUI();
			this.onRewardShow();
		}
	}
	private resetGroups(idx: number = -1){
		if(idx == -1){
			this.groupRewards[0].y = this.groupRunTop - this.groupReward.height - 10;
			this.groupRewards[1].y = this.groupRunTop;
			this.groupRewards[2].y = this.groupRunTop - this.groupReward.height - 10;
		} else{
			this.groupRewards[idx].y = this.groupRunTop;
		}
	}
	protected resetUI(){
		super.resetUI();
		this.setActionState(0);
	}
	private resetState(){
		this.setActionState(0);
	}
	private initItemList(){
		this.rewards = this.labaManager.currModel.rewards;
		for (let i: number = 0; i < this.rewards.length; i++) {
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			goodsinstance.x = i * 130;
			goodsinstance.y = 30;
			this.group.addChild(goodsinstance);
		}
		this.scroller.horizontalScrollBar.visible = false;
		this.scroller.horizontalScrollBar.autoVisibility = false;

		this.rewardRuns = [];
		this.goodsLit = [];
		for(let i = 0; i < this.groupRewards.length; ++i){
			this.rewardRuns[i] = [];
			this.goodsLit[i] = [];
			for(let j = 0; j < 2; ++j){
				this.rewardRuns[i][j] = this.getRewardRandom();
				// if(i == 1 && j == 1){
				// 	this.rewardRuns[i][j] = this.rewards[1];
				// } else {
				// 	this.rewardRuns[i][j] = this.getRewardRandom();
				// }
				this.goodsLit[i][j] = GameCommon.getInstance().createGoodsIntance(this.rewardRuns[i][j]);
				this.groupRewards[i].addChild(this.goodsLit[i][j]);
				this.goodsLit[i][j].y = j * (110 + 30);
			}
		}
		this.resetGroups();
	}
	private getRewardRandom(){
		return this.rewards[Tool.randomInt(0, this.rewards.length)];
	}
	private setActionState(state){
		for(let i = 0; i < this.imgRockers.length; ++i){
			this.imgRockers[i].visible = state == i;
			this.imgRockers[i].visible = state == i;
		}
	}
}