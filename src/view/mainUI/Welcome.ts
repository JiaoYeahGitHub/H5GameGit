class Welcome extends BaseWindowPanel {
	private closBtn: eui.Button;
    private reward_grp:eui.Group;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.Welcome;
	}
	protected onRefresh(): void {
		this.reward_grp.removeChildren();
		var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.WELCOME_REWARDS));
        if (awards) {
			for(var i :number=0;i<awards.length;i++)
			{
				var gData:GoodsInstance = new GoodsInstance();
				gData.onUpdate(awards[i].type,awards[i].id)
				this.reward_grp.addChild(gData);
			}
        }

        
	}
	protected onRegist(): void {
		super.onRegist();
		this.closBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	public onTouch() {
		this.onHide();
	}
	//The end
}