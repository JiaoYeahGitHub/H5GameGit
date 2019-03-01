class Activity666Panel extends ActivityLabaBase{
	public static BOX_MAX: number = 4;
	private manager: Activity666Manager;
    private goodLists: GoodsInstance[];
	private lbUsedCount: eui.Label;
	private groupReward: eui.Group;
	private groupRewards: eui.Group[];
	private imgRockers: eui.Image[];
	private btnFire: eui.Group;
	private rewardRuns: number[][];
	private rewards: number[];
	private timeDelays: number[];
	private timeSps: number[];
	private goodsLit: eui.Image[][];
	private btnReceive: eui.Button;
	private groupRunTop: number;
	private isRunFinish: boolean[];
	private isRunEnd: boolean;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private reward_anim_grps: eui.Group[];
	private award_box_imgs: eui.Image[];
	private award_times_labs: eui.Label[];
	public constructor(owner) {
        super(owner);
    }
	protected onSkinName(): void {
        this.skinName = skins.Activity666PanelSkin;
    }
    protected onInit(): void {
		this.manager = DataManager.getInstance().a666Manager;
		this.points[0].register(this.btnReceive, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().a666Manager, "checkRedPointBox");
		this.isRunFinish = [false, false, false];
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
		this.examineCD();
		this.showAwardPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		this.btnReceive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventReceiveBox, this);
		for (let i: number = 0; i < Activity666Panel.BOX_MAX; i++) {
			this.award_box_imgs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
		}
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_666_LABA_MESSAGE.toString(), this.onCallLaba, this);
		this.checkModelInfo();
		this.resetUI();
		this.updateBoxs();
		this.onCloseAwdShow();
		this.resetGroups();
		this.manager.sendLabaMessage();
	}
	protected onRemove(): void {
		this.examineCD(false);
		this.isAction = false;
		for (let i: number = 0; i < Activity666Panel.BOX_MAX; i++) {
			this.award_box_imgs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
		}
		this.showAwardPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseAwdShow, this);
		this.btnReceive.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventReceiveBox, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_666_LABA_MESSAGE.toString(), this.onCallLaba, this);
	}
	protected onCallLaba(){
		this.progressBar.maximum = this.manager.currModel.costNum;
		this.progressBar.value = this.manager.getMoneyStr();
		this.lbCount.text = this.manager.getHaveCount().toString();
		this.lbUsedCount.text = this.manager.usedCount.toString();
		this.updateBoxs();
		if(this.manager.type == 1){
			this.onDealRocker();
		}
	}
	private onEventReceiveBox(){
		this.manager.sendLabaMessage(2);
	}
	private updateBoxs(){
		this.btnReceive.enabled = false;
		let weekAwdParams: string[] = this.manager.currModel.box.split("#");
		for (let i: number = 0; i < Activity666Panel.BOX_MAX; i++) {
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let count: number = parseInt(params[0]);
			this.award_times_labs[i].text = Language.instance.getText(count, 'times');
			this.reward_anim_grps[i].removeChildren();
			if (count <= this.manager.receiveBoxIdx) {
				this.award_box_imgs[i].source = 'hefuActbox_open_png';
				this.award_box_imgs[i].y = -12;
			} else if (this.manager.usedCount >= count){
				this.btnReceive.enabled = true;
				this.award_box_imgs[i].y = -0;
				this.award_box_imgs[i].source = 'hefuActbox_png';
				GameCommon.getInstance().addAnimation('baoxiangtixing', null, this.reward_anim_grps[i], -1);
			}
		}
	}
	//查看宝箱的TIPS
	private onTouchBox(event: egret.Event): void {
		let id: string = this.manager.currModel.box.split("#")[parseInt(event.target.name)].split(",")[1];
		var box: Modelbox = JsonModelManager.instance.getModelbox()[id];
		var base = new ThingBase(GOODS_TYPE.BOX);
		base.onupdate(box.id, box.quality, 0);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
		);
	}
	private checkModelInfo(){
		let list: AwardItem[] = this.manager.currModel.rewards;
        for(let i = 0; i < 4; i++) {
			this.goodLists[i].onUpdate(list[i].type, list[i].id, 0, list[i].quality, list[i].num);
        }
		if(this.lbCost){
			this.lbCost.text = this.manager.currModel.costNum.toString();
		}
		if(this.lbCost1){
			this.lbCost1.text = this.manager.currModel.costNum + "元";
		}
	}
	protected examineCD(open: boolean = true) {
		if (open) {
			Tool.addTimer(this.updateTime, this, 1000);
		} else {
			Tool.removeTimer(this.updateTime, this, 1000);
		}
	}
	protected updateTime(){
		let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ACT_666SHENQI2);
		if(time <= 0){
			time = 0;
			this.examineCD(false);
		}
		this.lbTime.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	protected onRewardShow(){
		this.onPlayDone(this.manager.getRewardItem());
	}
	protected onEventRocker(count: number = 1){
		if(!this.isAction){
			//super.onEventRocker(count);
            if(this.sendRocker()){
				this.setActionState(1);
				Tool.callbackTime(this.resetState, this, 1000);
			}
		}
	}
    private sendRocker(count: number = 1): boolean{
		if(this.manager.getHaveCount() >= count){
			this.isAction = true;
			this.manager.sendLabaMessage(1);
			return true;
		}
		GameCommon.getInstance().addAlert("error_tips_6");
		return false;
    }
	protected onDealRocker(){
		this.isRunEnd = false;
		this.updateRewardList();
		//this.setActionState(0);
		//Tool.callbackTime(this.resetState, this, 500);
		this.resetGroups();
		this.isRunFinish = [false, false, false];
		this.timeDelays = [Tool.randomFloat(0, 600), Tool.randomFloat(0, 600), Tool.randomFloat(0, 600)];
		this.timeSps = [Tool.randomFloat(100, 200), Tool.randomFloat(100, 200), Tool.randomFloat(100, 200)];
		this.groupRunStart(0, this.timeDelays[0]);
		this.groupRunStart(1, this.timeDelays[1]);
		this.groupRunStart(2, this.timeDelays[2]);
		Tool.callbackTime(this.onActionEnd, this, 1500);
	}
	private updateRewardList(){
		let reIdx = this.manager.rewardIdx;
		if(reIdx == 0){
			this.rewards = [this.getRewardRandom(), this.getRewardRandom(), this.getRewardRandom()];
		} else if(reIdx == 1){
			this.rewards = [this.getRewardRandom(), this.getRewardRandom(), this.getRewardRandom()];
			this.rewards[Tool.randomInt(0, 3)] = 6;
		} else if(reIdx == 2){
			this.rewards = [6, 6, 6];
			this.rewards[Tool.randomInt(0, 3)] = this.getRewardRandom();
		} else if(reIdx == 3){
			this.rewards = [6, 6, 6];
		}
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
				this.updateItem(this.goodsLit[idx][0], this.rewardRuns[idx][0]);
				this.updateItem(this.goodsLit[idx][1], this.rewardRuns[idx][1]);
				this.resetGroups(idx);
				this.groupRunStart(idx);
			} else {
				//let tw = egret.Tween.get(this.groupRewards[idx]);
				this.rewardRuns[idx][1] = this.rewards[idx];
				this.rewardRuns[idx][0] = this.getRewardRandom();
				this.updateItem(this.goodsLit[idx][0], this.rewardRuns[idx][0]);
				this.updateItem(this.goodsLit[idx][1], this.rewardRuns[idx][1]);
				this.checkRunFinishAll(idx);
				//tw.to({y: 0}, this.timeSps[idx]);
				//let instance = this;
				//tw.call(()=>{
					//egret.Tween.removeTweens(this.groupRewards[idx]);
					//instance.checkRunFinishAll(idx);
				//}, this);
			}
		}
	}
    private updateItem(img: eui.Image, num: number){
        img.source = "z_666_" + num + "_png";
    }
	private checkRunFinishAll(idx): boolean{
		this.isRunFinish[idx] = true;
		this.resetGroups(idx);
		for(let i = 0; i < this.isRunFinish.length; ++i){
			if(!this.isRunFinish[i]){
				return;
			}
		}
		this.onActionEnd(true);
	}
	private onActionEnd(isLogic = false){
		this.isRunEnd = true;
		if(isLogic){
			this.resetUI();
			this.onRewardShow();
		}
	}
	private resetGroups(idx: number = -1){
		if(idx == -1){
			this.groupRewards[0].y = this.groupRunTop;// - this.groupReward.height - 10;
			this.groupRewards[1].y = this.groupRunTop;
			this.groupRewards[2].y = this.groupRunTop;// - this.groupReward.height - 10;
		} else{
			this.groupRewards[idx].y = this.groupRunTop;
		}
	}
	protected resetUI(){
		this.isAction = false;
		this.setActionState(0);
	}
	private resetState(){
		this.setActionState(0);
	}
	private initItemList(){
        this.goodLists = [];
        for(let i = 0; i < 4; i++) {
            this.goodLists[i] = this['good' + i];
			this.goodLists[i].name_label.visible = false;
        }

		this.rewardRuns = [];
		this.goodsLit = [];
		for(let i = 0; i < this.groupRewards.length; ++i){
			this.rewardRuns[i] = [];
			this.goodsLit[i] = [];
			for(let j = 0; j < 2; ++j){
				this.rewardRuns[i][j] = this.getRewardRandom();
				this.goodsLit[i][j] = new eui.Image();
				this.updateItem(this.goodsLit[i][j], this.rewardRuns[i][j]);
				this.groupRewards[i].addChild(this.goodsLit[i][j]);
				this.goodsLit[i][j].y = j * (114 + 30);
			}
		}
		this.reward_anim_grps = [];
		this.award_box_imgs = [];
		this.award_times_labs = [];
		for (let i: number = 0; i < Activity666Panel.BOX_MAX; i++) {
			this.reward_anim_grps[i] = this['reward_anim_grp' + i];
			this.award_box_imgs[i] = this['award_box_img' + i];
			this.award_box_imgs[i].name = i.toString();
			this.award_box_imgs[i].touchEnabled = true;
			this.award_times_labs[i] = this['award_times_lab' + i];
		}
		this.resetGroups();
	}
	private getRewardRandom(): number{
        let num = Tool.randomInt(0, 9);
        if(num > 5){
            num += 1;
        }
		return num % 10;
	}
	private setActionState(state){
		for(let i = 0; i < this.imgRockers.length; ++i){
			this.imgRockers[i].visible = state == i;
			this.imgRockers[i].visible = state == i;
		}
	}
}