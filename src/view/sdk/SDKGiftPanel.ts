class SDKGiftPanel extends BaseWindowPanel{
    private labelTips:eui.Label;
    private imageResult:eui.Image;
    private imageTitle:eui.Image;
	private closeBtn1:eui.Button;
    private closeBtn2:eui.Button;
    private goods:GoodsInstance=new GoodsInstance();
    private result:boolean;
    private box;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();
         if(SDKManager.loginInfo.channel==EChannel.CHANNEL_WANBA){
            this.goods.onUpdate(GOODS_TYPE.BOX,  SDKWanBa.getInstance().gift);
        }
        this.onRefresh();
    }

	protected onSkinName(): void {
        this.skinName = "skins.SDKGiftPanelSkin";
    }

    public onShowWithParam(param): void {
        this.result = param.result;
        this.box = param.box;
		this.onShow();
    }

    protected onRefresh(): void {
        if(this.result){
            this.goods.onUpdate(GOODS_TYPE.BOX, this.box, 0, 1, 1);
            this.labelTips.text = "恭喜你获得";
            this.imageResult.source = "gift_tip_success_png";
            this.imageTitle.source = "gift_nice_png";
        }else{
            // 已领取或错误
            this.goods.onUpdate(GOODS_TYPE.BOX, this.box, 0, 1, 1);
            this.labelTips.text = "你今天已经领取过";
            this.imageResult.source = "gift_tip_daily_png";
            this.imageTitle.source = "gift_reward_png";
        }
    }

    protected onRegist(): void {
        super.onRegist();
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);
        this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);
        this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this);
    }

}