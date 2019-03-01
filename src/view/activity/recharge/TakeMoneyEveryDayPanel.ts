class TakeMoneyEveryDayPanel  extends BaseWindowPanel  {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private leijidate: Modelleijichongzhi[];

	private chongzhibox: eui.Group;
	private chongzhibox1:eui.Group;
	private closeBtn1: eui.Button;
	private leijilab: eui.BitmapLabel;
	private jump_to_charge:eui.Button;
	private tips_mask: eui.Group;
	private viewmask:egret.Shape;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TakeMoneyEveryDaySkin;
	}
	protected onInit(): void {
		super.onInit();
		this.viewmask = new egret.Shape();
        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.6);

        this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.viewmask.graphics.endFill();
		this.tips_mask.addChild(this.viewmask);
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.leijidate = JsonModelManager.instance.getModelleijichongzhi();
		var leijisever = DataManager.getInstance().newactivitysManager.leiji;
		if (this.chongzhibox.numChildren > 0) {
			this.chongzhibox.removeChildren();
		}
		if (this.chongzhibox1.numChildren > 0) {
			this.chongzhibox1.removeChildren();
		}
		var activityitem: ActivitysChongzhiitem;
		var model:Modelleijichongzhi;
		var leijiyuanbao:number=leijisever["atyuanbao"];
		var idx:number = 0;
		for(var key in this.leijidate){
			model = this.leijidate[key];
			if(model.round == leijisever["lunci"]){
				// activityitem = new ActivitysChongzhiitem(model, false);			
				if(leijiyuanbao>=model.costNum)
				continue;
				var  itemarr = model.rewards;
				for (var i = 0; i < itemarr.length; i++) {
					var goods:GoodsInstance = new GoodsInstance();
					goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num, itemarr[i].lv);
					goods.currentState = 'notName'
					if(idx <2)
					{
					this.chongzhibox1.addChild(goods);
					idx = idx+1;
					}
					else
					{
					this.chongzhibox.addChild(goods);
					idx = idx+1;
					}
						
				}
				return
				
			}
		}
		this.leijilab.text = model.costNum- leijiyuanbao+"";
	}
	protected onRegist(): void {
		super.onRegist();
		this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.jump_to_charge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToCharge, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);

	}
	protected onRemove(): void {
		super.onRemove();
		this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.jump_to_charge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToCharge, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
	}

	private jumpToCharge(){
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}

}