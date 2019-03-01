/**
 * 
 */
class OnlineGiftPanel extends BaseWindowPanel{

	private label1:eui.Label;
	private label2:eui.Label;
	private receiveBtn:eui.Button;

	private goods:GoodsInstance;

	public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();
		this.goods = new GoodsInstance();
        this.goods.x=274;
		this.goods.y=480;
		this.addChild(this.goods);
        this.onRefresh();
    }

	protected onSkinName(): void {
        this.skinName = skins.OnlineGiftSkin;
    }

	protected onRefresh(): void {
		// var modelOnlineGift:ModelOnlineGift=ModelManager.getInstance().modelOnlineGift[DataManager.getInstance().playerManager.player.onlineGift];
		// if(modelOnlineGift){
       	// 	this.goods.onUpdate(modelOnlineGift.reward.type, modelOnlineGift.reward.id, 0, modelOnlineGift.reward.quality, modelOnlineGift.reward.num);
		// 	this.label1.text="累计"+Tool.toInt(modelOnlineGift.time/60)+"分钟后领取";
		// 	if(DataManager.getInstance().playerManager.player.getOnlineGiftCountDown()>modelOnlineGift.time){
		// 		this.label2.text="";
		// 		this.receiveBtn.visible=true;
		// 		Tool.removeTimer(this.onCountDown,this);
		// 	}else{
		// 		this.receiveBtn.visible=false;
		// 		Tool.addTimer(this.onCountDown,this);
		// 	}
		// }else{
		// 	this.receiveBtn.visible=false;
		// 	Tool.removeTimer(this.onCountDown,this);
		// }
    }
    protected onRegist(): void {
		super.onRegist();
		this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
    }

    protected onRemove(): void {
		super.onRemove();
		this.receiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
	}

	private onReceiveClick(event:egret.TouchEvent):void{
		var message:Message=new Message(MESSAGE_ID.RECEIVE_ONLINE_GIFT);
		GameCommon.getInstance().sendMsgToServer(message);
		
		this.onHide();
	}

	private onCountDown():void{
		// var modelOnlineGift:ModelOnlineGift=ModelManager.getInstance().modelOnlineGift[DataManager.getInstance().playerManager.player.onlineGift];
		// if(modelOnlineGift){
		// 	if(DataManager.getInstance().playerManager.player.getOnlineGiftCountDown()>modelOnlineGift.time){
		// 		this.onRefresh();
		// 	}else{
		// 		var time:number=modelOnlineGift.time-DataManager.getInstance().playerManager.player.getOnlineGiftCountDown();
		// 		this.label2.text="距离领取时间 "+Tool.getTimeStr(time);
		// 	}
		// }else{
		// 	this.onRefresh();
		// }
    }
}