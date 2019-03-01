class VerifyPanel extends BaseWindowPanel{

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private bg:eui.Image;

 	private closeBtn1: eui.Button;
	private reward_grp:eui.Group;
	private gift_btn:eui.Button;

	private  rewards: number[][] = [[2,1,300],[2,2,20],[4,0,300000]];	

	public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();	
		this.reward_grp.removeChildren();
		for (var i = 0; i < this.rewards.length; i++) {
            var goods = new GoodsInstance();
            goods.onUpdate(this.rewards[i][0], this.rewards[i][1], 0, 0, this.rewards[i][2])
            this.reward_grp.addChild(goods);
        }	
		// 	let awarditem: AwardItem = new AwardItem();
		// 	awarditem.id=SDKWanBa.getInstance().boxId;
		// 	awarditem.type=GOODS_TYPE.BOX;
		// 	awarditem.num=1;
		// 	awarditem.quality=1;
		// 	let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
		// 	this.reward_grp.addChild(goodsinstance);
        this.onRefresh();
    }
	protected onSkinName(): void {
        this.skinName = skins.VerifyPanelSkin;
    }

    protected onRegist(): void {
		this.gift_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VERIFY_GIFT.toString(), this.callback, this);
		super.onRegist();
    }

    protected onRemove(): void {
		this.gift_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VERIFY_GIFT.toString(), this.callback, this);
		super.onRemove();
	}

	protected onRefresh(){
		 var verify = SDKUtil.getQueryString("verify");
		 var wallow = SDKUtil.getQueryString("wallow");
		 egret.log("verify分别为 url的="+verify+" 游戏内的="+SDKAWY.getInstance().verify)
		if((verify&&verify=="1")||SDKAWY.getInstance().verify==0){
			 this.gift_btn.label="领 取";
		 }else{
			  this.gift_btn.label="我要领取";
		 }
		if(DataManager.getInstance().playerManager.verify==1){
             this.gift_btn.label="已领取";
			  this.gift_btn.enabled=false;
		 }
	}

	private onClick(){
		if(this.gift_btn.label=="我要领取"){
			SDKAWY.getInstance().doCheckVerify();
		}else if(this.gift_btn.label="领 取"){
		var url=SDKAWY.getInstance().getGiftInfo(1);
		egret.log("onEnterGame get url="+url);
		HttpUtil.sendGetRequest(url, this.clickCallback, this);
		}
	}

	private clickCallback(event: egret.Event){
      	var request = <egret.HttpRequest>event.currentTarget;
    	var result = JSON.parse(request.response);
		egret.log(result);
		if(result==2+""){
		 var message = new Message(MESSAGE_ID.VERIFY_GIFT);
		 message.setByte(1);
		 GameCommon.getInstance().sendMsgToServer(message);
		}

	}

	private callback(){
		 GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
		 this.onRefresh();
	}
}