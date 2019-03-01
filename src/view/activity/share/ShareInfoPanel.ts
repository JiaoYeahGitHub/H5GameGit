class ShareInfoPanel extends BaseWindowPanel implements ISDKShareContainer{
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private labelCD:eui.Label;
    private labelCDDesc:eui.Label;
    private labelDesc2:eui.Label;
    private labelTimes:eui.Label;
	private closeBtn1:eui.Button;
    private yaoqingBtn:eui.Button;
    private share_img:eui.Image;

    private allItem: ShareRewardItem[];
    private share_item_group:eui.Group;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }

	protected onSkinName(): void {
        this.skinName = "skins.ShareInfoSkin";
    }

    private get funData():FunctionManager{
        return DataManager.getInstance().functionManager;
    }

	protected onRefresh(): void {
        this.share_img.visible=false;
        this.labelTimes.text = "(" + this.funData.shareDayNum.toString() + "/3)";
        if(this.funData.shareDayNum < 3){
            this.labelCDDesc.visible = true;
            this.labelCD.visible = true;
            this.labelCD.text = Tool.getTimeStr(this.funData.cd);
            if(this.funData.cd > 0){
                Tool.addTimer(this.onCountDown,this);
            }
        }else{
            this.labelCDDesc.visible = false;
            this.labelCD.visible = false;
        }
    }

	private onCountDown():void{
        if (this.funData.cd > 0) {
            this.labelCD.text = Tool.getTimeStr(this.funData.cd);
            this.funData.cd --;
        } else {
            this.labelCDDesc.visible = false;
            this.labelCD.visible = false;
            Tool.removeTimer(this.onCountDown,this);
        }
    }

    public updateData(event: egret.Event){
        this.onRefresh();
    }

    protected onRegist(): void {
		super.onRegist();
        GameDispatcher.getInstance().addEventListener(GameEvent.SDK_SHARE_INFO_UPDATE, this.updateData, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SHARE_INFO_MESSAGE.toString(), this.onRefresh, this);
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);
        this.yaoqingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onInvitation,this);
    }

    protected onRemove(): void {
		super.onRemove();
        Tool.removeTimer(this.onCountDown,this);

        GameDispatcher.getInstance().removeEventListener(GameEvent.SDK_SHARE_INFO_UPDATE, this.updateData, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SHARE_INFO_MESSAGE.toString(), this.onRefresh, this);
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);

        this.yaoqingBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onInvitation,this);
	}

    private onInvitation(event:egret.Event):void{
        if(SDKManager.loginInfo.channel==EChannel.CHANNEL_CRAZY){
            this.share_img.visible=true;
        }
        if(SDKManager.loginInfo.channel==EChannel.CHANNEL_SOEZ){
           if(!SDKEZJS.isHaveShareMethod())
                this.share_img.visible=true;
        }
        SDKManager.share(this, null);
    }

    /**
     * 分享信息提示
     */
    public showShareInfo(info: ISDKShareInfo): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ShareInfoPanel", info));
    }

    /**
     * 更新分享信息
     */
    public updateShareInfo(info: ISDKShareInfo): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SDK_SHARE_INFO_UPDATE), info);
    }

    public shareComplete():void{
        var message:Message=new Message(MESSAGE_ID.SHARE_COMPLETE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}

class ShareRewardItem extends eui.ItemRenderer {

	private model: Modelfenxiang;
	private rewardLabel: eui.Label;
	private awards: eui.Group;
	public btn_reward: eui.Button;
    protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onInit, this);
		// this.skinName = skins.shareRewardItemSkin;
	}
	private onInit(): void {
	}

	public onUpdate(model: Modelfenxiang): void {
		this.model = model;
		this.refresh();
	}

	protected refresh() {
		var rewards: AwardItem[]=this.model.rewards;
        this.points[0].register(this.btn_reward, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this.funData, "rewardPoint",this.model.id,this.model.times);

		this.awards.removeChildren();
		for (var i: number = 0; i < rewards.length; i++) {
			var award: AwardItem = rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.scaleX = 0.8;
			goodsInstace.scaleY = 0.8;
			goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.awards.addChild(goodsInstace);
		}

         if(this.funData.getReceive(this.model.id)==1){
            this.btn_reward.label="已领取";
            this.btn_reward.enabled=false;
        }else{
            this.btn_reward.label="领取";
            if(this.funData.shareNum>=5){
                this.btn_reward.enabled=true;
            }else{
                this.btn_reward.enabled=false;
            }
        }
        var times=this.model.times;
        this.rewardLabel.text="("+(this.funData.shareNum>times?times:this.funData.shareNum)+"/"+times+")";
        this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchButton,this);
	}

	public onTouchButton(): void {
		let rewardMsg: Message = new Message(MESSAGE_ID.SHARE_REWARD_MESSAGE);
		rewardMsg.setByte(this.model.id);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}

    private get funData():FunctionManager{
        return DataManager.getInstance().functionManager;
    }
}