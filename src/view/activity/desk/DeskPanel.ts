/**
 * 
 */
class DeskPanel extends BaseWindowPanel{

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private label1:eui.Label;
	private label2:eui.Label;
	private receiveBtn:eui.Button;

	private goods1:GoodsInstance;
    private goods2:GoodsInstance;

	public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();
		this.setTitle("activity_banba_desktop_png");
		// this.goods1 = new GoodsInstance();
        // this.goods1.x=200;
		// this.goods1.y=460;
        this.goods1.onUpdate(5,0,0,4,30);
		// this.addChild(this.goods1);
        // this.goods2 = new GoodsInstance();
        // this.goods2.x=330;
		// this.goods2.y=460;
        this.goods2.onUpdate(2,1,0,3,5);
		// this.addChild(this.goods2);
        this.onRefresh();
    }

	protected onSkinName(): void {
        this.skinName = skins.DeskSkin;
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
		SDKWanBa.getInstance().sendToDesktop();
		this.onHide();
	}
}