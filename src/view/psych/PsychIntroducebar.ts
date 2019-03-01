class PsychIntroducebar extends BaseWindowPanel {
    private model: Modelyuanshen;
    private param: PsychIntroducebarParam;
    private pingfen_label: eui.Label;
    private tips_mask: eui.Group;
    private name_label: eui.Label;
    private bmlable_power: PowerBar;
    private basic_attr_layer: eui.Group;
    private psych: PsychInstance;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PsychIntroducebarSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    public onShowWithParam(param: PsychIntroducebarParam): void {
        this.param = param;
        this.model = this.param.model;
        this.onShow();
    }
    protected onRefresh(): void {
        this.showAttributeInfo();
    }
    private showAttributeInfo() {
        var i: number = 0;
        var index: number;
        var n: number = 0;
        var len: number = 0;
        var addInfo;
        this.name_label.textFlow = new Array<egret.ITextElement>({ text: this.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.model.pinzhi) } });
        //实际战斗力
        var fightValue = GameCommon.calculationFighting(this.model.attrAry);
        this.bmlable_power.power = fightValue.toString();
        this.pingfen_label.text = "评分：" + fightValue;
        var base: PsychBase = new PsychBase();
        base.modelID = this.model.id;
        this.psych.onUpdate(base, PSYCHSTATE_TYPE.NOLABEL, 0);
        this.psych.touchEnabled = false;

        //显示主属性
        // var basic_attr_desc: string = "";
        // for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
        //     var attrValue: number = this.model.attrAry[i];
        //     if (attrValue > 0) {
        //         basic_attr_desc += Language.instance.getAttrName(i) + "：" + Tool.getHtmlColorStr(attrValue + "", "FFFFFF");
        //         basic_attr_desc += "\n";
        //     }
        // }
        // this.basic_attr_label.textFlow = (new egret.HtmlTextParser).parse(basic_attr_desc);

        //显示主属性
		var attributeItem: AttributeItem;
		this.basic_attr_layer.removeChildren();
		for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			var attrValue: number = this.model.attrAry[i];
            if (attrValue > 0) {
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue];
				this.basic_attr_layer.addChild(attributeItem);
			}
		}
    }
}
class PsychIntroducebarParam {
    public model: Modelyuanshen;
    public constructor(model: Modelyuanshen) {
        this.model = model;
    }
}

