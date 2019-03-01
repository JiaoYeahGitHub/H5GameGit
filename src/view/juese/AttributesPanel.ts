// TypeScript file
class AttributesPanel extends BaseWindowPanel {
    // private btn_sure: eui.Button;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("属性");
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    protected onRefresh(): void {
        for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
            this["attr_value_label" + i].text = this.getPlayerjiaoseData().attributes[i];
            this["attrname_label" + i].text = GameCommon.getInstance().getPropertyTitle(i) + '';
        }
    }
    protected onSkinName(): void {
        this.skinName = skins.AttributesPanelSkin;
    }
    private onChangeRole() {
        this.onRefresh();
    }
    private getPlayerjiaoseData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    //The end
}
class AttributesText extends eui.Component {
    private name_Label: eui.Label;
    private attr_value_label: eui.Label;
    private isUp: eui.Image;
    public constructor() {
        super();
        this.skinName = skins.Attr_Item_Skin2;
    }
    public updateAttr(attrtype, value, color: number = 0x5c0000) {
        // this.attr_value_label.text = "+" + value;
        // this.name_Label.text = GameDefine.Attr_FontName[attrtype];
        // this.attr_value_label.textColor = color;
        // this.name_Label.textColor = color;
        if(!GameDefine.Attr_FontName[attrtype])
        this.updateStr(attrtype, "+" + value, color);
        else
        this.updateStr(GameDefine.Attr_FontName[attrtype], "+" + value, color);
    }
    public updateStr(nameStr: string, valueStr: string, color: number = 0x5c0000) {
        this.name_Label.text = nameStr;
        this.attr_value_label.text = valueStr;
        this.name_Label.textColor = this.attr_value_label.textColor = color;
    }

    //The end
}
class AttributesNewText extends eui.Component {
    private attr_name: eui.Label;
    private attr_value_label: eui.Label;

    public constructor() {
        super();
        this.skinName = skins.Attr_Item_Skin3;
    }
    public updateAttr(attrtype, value: number, color?: number) {
        this.attr_name.text = GameDefine.Attr_FontName[attrtype];
        this.attr_value_label.text = "+" + value;
        if (color) {
            this.attr_value_label.textColor = color;
        }
    }
    //The end
}