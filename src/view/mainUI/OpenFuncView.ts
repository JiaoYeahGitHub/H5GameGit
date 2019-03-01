// TypeScript file
class OpenFuncView extends BaseWindowPanel {
    private scroll: eui.Scroller;
    private itemlist: eui.List;
    private reward_grp: eui.Group;
    private reward_btn: eui.Button;
    private funcmodels: ModelfunctionLv[];

    protected points: redPoint[] = RedPointManager.createPoint(0);
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        this.setTitle("function_open_title_png");
        this.scroll.verticalScrollBar.autoVisibility = false;
        this.scroll.verticalScrollBar.visible = false;
        this.itemlist.itemRenderer = FuncOpenItem;
        this.itemlist.itemRendererSkinName = skins.OpenFuncItemSkin;
        this.itemlist.percentWidth = 135;
        this.itemlist.percentHeight = 210;
        this.itemlist.useVirtualLayout = true;
        this.scroll.viewport = this.itemlist;
        this.itemlist.selectedIndex = 0;
        let funcDict = JsonModelManager.instance.getModelfunctionLv();
        this.funcmodels = [];
        for (let id in funcDict) {
            var model: ModelfunctionLv = funcDict[id];
            if (model.functionType > 0) {
                this.funcmodels.push(model);
            }
        }
        this.funcmodels.sort(function (m1, m2) {
            if (FunDefine.funOpenLevel(m1.id) - FunDefine.funOpenLevel(m2.id) < 0) {
                return -1;
            }
            return 1;
        });
        super.onInit();
        this.onRefresh();
    }
    protected onSkinName(): void {
        this.skinName = skins.OpenFuncViewSkin;
    }
    protected onRefresh(): void {
        this.itemlist.dataProvider = new eui.ArrayCollection(this.funcmodels);
        this.onUpdate();
    }
    private onUpdate(): void {
        for (var i: number = 0; i < this.funcmodels.length; i++) {
            let model: ModelfunctionLv = this.funcmodels[i];
            if (FunDefine.isFunOpen(model.id) && !DataManager.getInstance().playerManager.getFunIsAwarded(model.id)) {
                Tool.callbackTime(this.onSelectItem, this, 100, i);
                break;
            }
        }
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FUNCTION_REWARD_MESSAGE.toString(), this.onReciveRewardMsg, this);
        this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
        this.itemlist.addEventListener(egret.Event.CHANGE, this.selectedItemHandler, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FUNCTION_REWARD_MESSAGE.toString(), this.onReciveRewardMsg, this);
        this.reward_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
        this.itemlist.addEventListener(egret.Event.CHANGE, this.selectedItemHandler, this);
    }
    private onReciveRewardMsg(): void {
        for (let i: number = 0; i < this.itemlist.numChildren; i++) {
            let item: FuncOpenItem = this.itemlist.getChildAt(i) as FuncOpenItem;
            item.data = item.data;
        }
        this.selectedItemHandler();
        this.onUpdate();
    }
    private onSelectItem(idx: number): void {
        this.scroll.viewport.scrollV = Math.floor(idx / 4) * 210;
        this.itemlist.selectedIndex = idx;
        this.selectedItemHandler();
    }
    private selectedItemHandler(): void {
        this.reward_grp.removeChildren();
        let model: ModelfunctionLv = this.itemlist.selectedItem;
        if (model) {
            for (let i: number = 0; i < model.rewards.length; i++) {
                let rewarditem: AwardItem = model.rewards[i];
                let instance: GoodsInstance = new GoodsInstance();
                instance.onUpdate(rewarditem.type, rewarditem.id, 0, rewarditem.quality, rewarditem.num);
                this.reward_grp.addChild(instance);
            }
            if (!FunDefine.isFunOpen(model.id)) {
                this.reward_btn.enabled = false;
            } else {
                if (DataManager.getInstance().playerManager.getFunIsAwarded(model.id)) {
                    this.reward_btn.enabled = false;
                } else {
                    this.reward_btn.enabled = true;
                }
            }
        }
    }
    private onReward(): void {
        let model: ModelfunctionLv = this.itemlist.selectedItem;
        if (model) {
            var rewardMessage: Message = new Message(MESSAGE_ID.FUNCTION_REWARD_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(rewardMessage);
        }
    }
    //The end
}
class FuncOpenItem extends eui.ItemRenderer {
    private condition_lab: eui.Label;
    private desc_lab: eui.Label;
    private func_icon_img: eui.Image;
    private select_img: eui.Rect;

    public constructor() {
        super();
    }
    protected dataChanged(): void {
        var model: ModelfunctionLv = this.data;
        this.condition_lab.text = FunDefine.getFunOpenDesc(model.id);
        this.func_icon_img.source = model.icon;
        this.desc_lab.text = model.desc;
        if (!FunDefine.isFunOpen(model.id)) {
            this.currentState = "unopen";
        } else if (DataManager.getInstance().playerManager.getFunIsAwarded(model.id)) {
            this.currentState = "rewarded";
        } else {
            this.currentState = "open";
        }
    }
    public set selected(bool: boolean) {
        egret.superSetter(FuncOpenItem, this, "selected", bool);
        this.select_img.visible = bool;
    }
    //The end
}