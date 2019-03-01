/**
 * 
 */
class WanbaGiftPanel extends BaseWindowPanel{

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private bg:eui.Image;

 	private closeBtn1: eui.Button;
	private label2:eui.Label;
	private label3:eui.Label;
	private label4:eui.Label;
	private label5:eui.Label;
	private reward_grp:eui.Group;

	public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();			
		this.basic.height=360;
		this.bg.height=225;
		// this.label2.y=270;
		// this.label3.y=300;

		// var offsetX:number=0;
		// offsetX=120;
		// var w=480;
		// var goods = new GoodsInstance();
		// SDKWanBa.getInstance().boxId
		// goods.onUpdate(GOODS_TYPE.BOX,SDKWanBa.getInstance().boxId);
		// this.addChild(goods);
		// goods.x=180+120*+offsetX;
		// goods.y=480;

		this.reward_grp.removeChildren();
			let awarditem: AwardItem = new AwardItem();
			awarditem.id=SDKWanBa.getInstance().boxId;
			awarditem.type=GOODS_TYPE.BOX;
			awarditem.num=1;
			awarditem.quality=1;
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.reward_grp.addChild(goodsinstance);

		if(SDKWanBa.getInstance().giftOK){
			this.label4.text="领取成功";
			this.label5.text="恭喜您获得：";
		}else{
			this.label4.text="每天只能领取一次哦";
			this.label5.text="您今天已经领取过：";
		}
        this.onRefresh();
    }
	protected onSkinName(): void {
        this.skinName = skins.WanbaGiftSkin;
    }

    protected onRegist(): void {
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		super.onRegist();
    }

    protected onRemove(): void {
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		super.onRemove();
	}
}