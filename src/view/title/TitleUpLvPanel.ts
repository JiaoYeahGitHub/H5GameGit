// TypeScript file
class TitleUpLvPanel extends BaseWindowPanel {
    private lvUpBtn: eui.Button;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private param;
    private consumItem: ConsumeBar;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    private chuandaiBtn: eui.Button;//穿戴、卸下
    private unWearLabel: eui.Label;
    private ani: eui.Group;
    private consume_name_label: eui.Label;
    private consume_num_label: eui.Label;
    private btnJiHuo: eui.Button;
    private titleId: number;
    private desc: eui.Label;
    private titleItem: TitleItem;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("称号");
        this.onRefresh();
    }
    public onShowWithParam(param): void {
        this.titleId = param;
        this.onShow();
    }
    protected onRegist(): void {
        super.onRegist();
        this.lvUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleUpLv, this);
        this.chuandaiBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleBtn, this);
        this.btnJiHuo.addEventListener(egret.TouchEvent.TOUCH_END, this.onTitleJiHuo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TITLE_WEAR_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TITLE_JIHUO_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.lvUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleUpLv, this);
        this.chuandaiBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleBtn, this);
        this.btnJiHuo.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTitleJiHuo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TITLE_WEAR_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TITLE_JIHUO_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRefresh(): void {
        var modelTitle: Modelchenghao = JsonModelManager.instance.getModelchenghao()[this.titleId];
        this.desc.text = modelTitle.desc;
        var attr: number[] = GameCommon.getInstance().getAttributeAry();
        attr[ATTR_TYPE.HP] = modelTitle.hp;
        attr[ATTR_TYPE.ATTACK] = modelTitle.attack;
        attr[ATTR_TYPE.PHYDEF] = modelTitle.phyDef;
        attr[ATTR_TYPE.MAGICDEF] = modelTitle.magicDef;
        var str: string = '';
        let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
        var nextStr: string = '';
        var titleData: TitleData = DataManager.getInstance().titleManager.getTitleData(modelTitle.id);
        var lv: number = 0;
        if (titleData)
            lv = titleData.lv;

        for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
            attr[j] += GameCommon.getInstance().getAttributeAry(modelTitle)[j] * lv;
        }
        for (let i = 0; i < modelTitle.attrAry.length; ++i) {
            if (modelTitle.attrAry[i] > 0) {
                str = str + GameDefine.Attr_FontName[i] + "：" + (modelTitle.attrAry[i] * lv) + '\n';
                nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + (modelTitle.attrAry[i] * (lv + 1)) + '\n';
            }
        }
        this.titleItem.data = modelTitle;
        this.curPro.text = str;
        this.nextPro.text = nextStr;
        if (DataManager.getInstance().titleManager.isTitleActive(this.titleId)) {
            this.consumItem.visible = true;
            this.chuandaiBtn.visible = true;
            if (DataManager.getInstance().playerManager.player.getPlayerData().titleId == this.titleId) {
                this.chuandaiBtn.label = '卸 下';
            }
            else {
                this.chuandaiBtn.label = '穿 戴';
            }
            if (titleData.time < 0 || modelTitle.time == -1) {
                this.currentState = 'uplv';
                this.btnJiHuo.visible = false;
                this.upInfo(modelTitle);
            }
            else {
                this.currentState = 'normal';
                this.btnJiHuo.visible = false;
                this.consumItem.visible = false;
                
            }
        }
        else {
            if (modelTitle.time == -1) {
                this.currentState = 'normal';
                this.btnJiHuo.visible = true;
                this.chuandaiBtn.visible = false;
                this.consumItem.visible = true;
                this.upInfo(modelTitle);
            }
            else {
                this.currentState = 'noUp';
                this.curPro.text = nextStr;
                this.btnJiHuo.visible = false;
                this.chuandaiBtn.visible = false;
                this.consumItem.visible = false;
            }
        }
    }
    private upInfo(modelTitle: Modelchenghao): void {
        let modelthing: ModelThing = GameCommon.getInstance().getThingModel(modelTitle.cost.type, modelTitle.cost.id)
        this.consumItem.setCostByAwardItem(modelTitle.cost);
    }
    protected onSkinName(): void {
        this.skinName = skins.TitleUpLvSkin;
    }
    private onTitleUpLv(): void {
        var message: Message = new Message(MESSAGE_ID.TITLE_JIHUO_MESSAGE);
        message.setShort(this.titleId);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onChangeRole() {
        this.onRefresh();
    }
    private getPlayerjiaoseData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    private onTitleBtn(): void {
        DataManager.getInstance().titleManager.curTitleId = this.titleId;
        this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
        var message: Message = new Message(MESSAGE_ID.TITLE_WEAR_MESSAGE);
        message.setByte(0);
        if (DataManager.getInstance().playerManager.player.getPlayerData().titleId == this.titleId) {
            message.setShort(0);
        } else {
            message.setShort(this.titleId);
        }
        GameCommon.getInstance().sendMsgToServer(message);
    }

    private onTitleJiHuo(): void {
        DataManager.getInstance().titleManager.curTitleId = this.titleId;
        this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
        var message: Message = new Message(MESSAGE_ID.TITLE_JIHUO_MESSAGE);
        message.setShort(this.titleId);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    //The end
}