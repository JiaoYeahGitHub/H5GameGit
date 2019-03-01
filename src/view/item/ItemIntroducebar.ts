class ItemIntroducebar extends BaseWindowPanel {
    private tips_mask: eui.Group;
    private param: IntroduceBarParam;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }

    public onShowWithParam(param: IntroduceBarParam): void {
        this.param = param;
        this.onShow();
    }
    public onShow(): void {
        if (this.param) {
            this.width = size.width;
            this.height = size.height;
            super.onShow();
        }
    }
    /**获取当前的Tips**/
    private _allTipsViews;//所有Tips引用
    private getTipsView(): BaseTipsBar {
        if (!this._allTipsViews)
            this._allTipsViews = {};

        var tipType: number = this.param.location;
        if (this._allTipsViews[tipType]) {
            return this._allTipsViews[tipType];
        }
        switch (tipType) {
            case INTRODUCE_TYPE.CLOTH:
                this._allTipsViews[tipType] = new ClothEquipTips(this);
                break;
            case INTRODUCE_TYPE.SHENQI:
            case INTRODUCE_TYPE.EQUIP:
                this._allTipsViews[tipType] = new EquipTipsBar(this);
                break;
            case INTRODUCE_TYPE.IMG:
                this._allTipsViews[tipType] = new NormalTipsBar(this);
                break;
            case INTRODUCE_TYPE.BOX:
                this._allTipsViews[tipType] = new BoxTipsBar(this);
                break;
            case INTRODUCE_TYPE.SHOP:
                this._allTipsViews[tipType] = new ShopTipsBar(this);
                break;
            case INTRODUCE_TYPE.OTHER_CLOHT:
                this._allTipsViews[tipType] = new OtherEquipTips(this);
                break;
            case INTRODUCE_TYPE.OTHER_CLOHT:
                this._allTipsViews[tipType] = new OtherEquipTips(this);
                break;
            case INTRODUCE_TYPE.SKILL:
                this._allTipsViews[tipType] = new SkillTipsPanel(this);
                break;
        }
        return this._allTipsViews[tipType];
    }
    /**显示Tips 界面处理**/
    private _currTipsBar: BaseTipsBar;
    private onShowTips(): void {
        this.onHideTips();
        this._currTipsBar = this.getTipsView();
        if (this._currTipsBar) {
            // this._currTipsBar.onRegist();
            this._currTipsBar.setParam(this.param);
            this.addChild(this._currTipsBar);
        }
    }
    /**移除Tips 界面处理**/
    private onHideTips(): void {
        if (this._currTipsBar) {
            if(this._currTipsBar.isOnloadComp()){
                this._currTipsBar.onRemove();
            }
            this._currTipsBar = null;
        }
    }
    protected onSkinName(): void {
        this.skinName = skins.ItemIntroducebarSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.onShowTips();
    }
    protected onRegist(): void {
        // this.buyBar.onRegist();
        super.onRegist();
        this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        // this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    protected onRemove(): void {
        // this.buyBar.onRemove();
        super.onRemove();
        this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        // this.btn_equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    // private countDown(): void {
    //     if (this._currTipsBar) {
    //         this._currTipsBar.updateLimitTime();
    //     }
    // }
}
class IntroduceBarParam {
    public location: number = 0;
    public type: number;
    public model;//可以传model 或者 thing
    public uid: number = 0;
    public pos: number = 0;
    public roleID: number = 0;
    public quenchingLv: number = 0;
    public constructor(location: number, type, model, uid = 0, pos = 0, roleID = 0, quenchingLv = 0) {
        this.location = location;
        this.type = type;
        this.model = model;
        this.uid = uid;
        this.pos = pos;
        this.roleID = roleID;
        this.quenchingLv = quenchingLv;
    }
}
enum INTRODUCE_TYPE {
    OTHER = -1,
    IMG = 0,
    CLOTH = 1,//身穿装备
    EQUIP = 2,//装备类型
    BOX = 3,//开宝箱
    SHOP = 4,//购买物品
    OTHER_CLOHT = 5,//其他玩家的装备TIPS
    SHENQI = 6,
    SKILL = 7,
}