class ActivityYuekaPanel extends BaseTabView {
	private btn1: eui.Button;
	private btn2: eui.Button;
	private label_monthCard: eui.Label;
	private label_monthCard0:eui.Label;
	private tips_mask1:eui.Group;
	private tips_mask2:eui.Group;
	private viewmask:egret.Shape;
	private btn_pageDown:eui.Button;
	private group2:eui.Group;
	private btn_pageUp:eui.Button;
	private group1:eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityyuekaSkin;
	}
	private group1Pos:number[] = [50,290,0.9,0.9,1];
	private group2Pos:number[] = [110,250,1,1,3];
	//供子类覆盖
	protected onInit(): void {
		this.viewmask = new egret.Shape();
        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.5);

        this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.viewmask.graphics.endFill();
		this.tips_mask1.addChild(this.viewmask);
		this.tips_mask1.setChildIndex(this.viewmask, 0);   
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();//添加事件
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yuekafunc, this);//正常购买在下面
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.superCard, this);//正常购买在下面
		this.btn_pageDown.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPage, this);
		this.btn_pageUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPage, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MONTHCARD_MESSAGE.toString(), this.onRefresh, this);
		if(SDKManager.getChannel()==EChannel.CHANNEL_EGRET){
            //IOS微端特殊充值项
            if(SDKEgret.getInstance().isIOS22698()){
                this.btn1.label="30元抢购";
            }
        }
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.yuekafunc, this);
		this.btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.superCard, this);
		this.btn_pageDown.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPage, this);
		this.btn_pageUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPage, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MONTHCARD_MESSAGE.toString(), this.onRefresh, this);
	}
	private onPage():void{
		if(!this.isAction)
		{
			this.isAction = true;
			this.actionInit();
		}
	}
	private actionInit(){
		let time = 100;
		var tw = egret.Tween.get(this.group1);
		var tw1 = egret.Tween.get(this.group2);
		if(this.group1.x==this.group1Pos[0])
		{
			tw.to({scaleX:0.95,scaleY:0.95}, 150).wait(0).call(this.onCall1, this);
			tw1.to({scaleX:0.95,scaleY:0.95}, 150).wait(0).call(this.onCall1, this);
			tw.to({x:this.group2Pos[0],y:this.group2Pos[1],scaleX:this.group2Pos[3],scaleY:this.group2Pos[3]}, 300);
			tw1.to({x:this.group1Pos[0],y:this.group1Pos[1],scaleX:this.group1Pos[3],scaleY:this.group1Pos[3]}, 300);
		}
		else
		{
			// this.group2.child
			tw.to({scaleX:0.95,scaleY:0.95}, 150).wait(0).call(this.onCall, this);
			tw1.to({scaleX:0.95,scaleY:0.95}, 150).wait(0).call(this.onCall, this);
			tw.to({x:this.group1Pos[0],y:this.group1Pos[1],scaleX:this.group1Pos[3],scaleY:this.group1Pos[3]}, 300);
			tw1.to({x:this.group2Pos[0],y:this.group2Pos[1],scaleX:this.group2Pos[3],scaleY:this.group2Pos[3]}, 300);
		}
		let instance = this;
		tw.wait(100);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.group1);
			instance.actionDown();
		}, this);
	}
	private onCall1():void{
		// var tw = egret.Tween.get(this.group1);
		// var tw1 = egret.Tween.get(this.group2);
		this.group1.parent.setChildIndex(this.group1, this.group2Pos[4]);
		this.group2.parent.setChildIndex(this.group2, this.group1Pos[4]);
		// tw.to({scaleX:this.group2Pos[3],scaleY:this.group2Pos[3]}, 150);
		// tw1.to({scaleX:this.group1Pos[3],scaleY:this.group1Pos[3]}, 150);
	}
	private onCall():void{
		// var tw = egret.Tween.get(this.group1);
		// var tw1 = egret.Tween.get(this.group2);
		this.group1.parent.setChildIndex(this.group1, this.group1Pos[4]);
		this.group2.parent.setChildIndex(this.group2, this.group2Pos[4]);
		// tw.to({scaleX:this.group1Pos[3],scaleY:this.group1Pos[3]}, 150);
		// tw1.to({scaleX:this.group2Pos[3],scaleY:this.group2Pos[3]}, 150);
	}
	private isAction: boolean;
	private actionDown(){
		let instance = this;
		var tw = egret.Tween.get(this.group1);
		tw.to({rotation:0}, 100);
		tw.call(()=>{
			egret.Tween.removeTweens(instance.group1);
			instance.resetUI();
		}, this);
	}
	private resetUI(){
		this.isAction = false;
	}
	protected onRefresh(): void {
		this.isAction = false
		var base: cardData = DataManager.getInstance().monthCardManager.card[1];
		this.label_monthCard.text = '';
		this.label_monthCard0.text = '';
		if (base && base.param > 0) {
			this.btn1.label="已激活";
			this.btn1.enabled = false;
			this.btn1.touchEnabled = false;
			this.btn1.touchChildren = false;
			// this.label_monthCard.visible = true;
			this.label_monthCard.text = `月卡已激活，剩余${base.day}天`;
		}
		base = DataManager.getInstance().monthCardManager.card[2];
		if (base && base.param > 0) {
			this.btn2.label = "已激活";
			this.btn2.enabled = false;
			this.btn2.touchEnabled = false;
			this.btn2.touchChildren = false;
			// this.label_monthCard0.visible = true;
			this.label_monthCard0.text="超级卡已激活，剩余"+base.day+"天";
		}
	}
	//正常的购买月卡
	private yuekafunc() {
		var amount = 28;//0.01;
		var goodsName = "超值月卡";
		SDKManager.pay(
			{goodsName: goodsName, 
				amount: amount, 
			playerInfo: DataManager.getInstance().playerManager.player}, 
			new BasePayContainer(this));
	}
	//正常的购买超级卡
	private superCard() {
		var amount = 88;//0.01;
		var goodsName = "至尊月卡";
		SDKManager.pay(
			{goodsName: goodsName, 
				amount: amount, 
			playerInfo: DataManager.getInstance().playerManager.player}, 
			new BasePayContainer(this));
	}
	//领取双卡
	private cardGift(){
		var message: Message = new Message(MESSAGE_ID.MONTHLY_CARD_REWARD);
		message.setByte(CARD_TYPE.MONTH);

		GameCommon.getInstance().sendMsgToServer(message);
	}
	private superCardGift(){
		var message: Message = new Message(MESSAGE_ID.MONTHLY_CARD_REWARD);
		message.setByte(CARD_TYPE.LIFELONG);

		GameCommon.getInstance().sendMsgToServer(message);
	}
}