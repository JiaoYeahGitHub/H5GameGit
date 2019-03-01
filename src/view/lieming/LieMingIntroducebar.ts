class LieMingIntroducebar extends BaseWindowPanel {
    private param: LieMingIntroducebarParam;
    private model: Modelmingge;
    private pingfen_label: eui.Label;
    private tips_mask: eui.Group;
    private name_label: eui.Label;
    private bmlable_power: PowerBar;
    private basic_attr_layer: eui.Group;
    private item_icon:eui.Image;
    private btnReplace:eui.Button;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private modelID:number;
    private fateLv:number;
    private lv_label:eui.Label;
    private btnLvUp:eui.Button;
    private avatar_grp:eui.Group;
    private effectImg:eui.Image;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingIntroducebarSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btnReplace.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onReplace,this)
        this.btnLvUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this)
        
    }
    protected onRemove(): void {
        super.onRemove();
        this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btnReplace.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onReplace,this)
        this.btnLvUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this)
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    private onLvUp():void
    {
        
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingMainPanel",3));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_LVUP),this.param.fData);
    }
    private onReplace():void
    {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_LVUP),null);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingPackagePanel",new LieMingData(1,this.param.fData.slot,'tihuan')));
        this.onHide();
    }
    public onShowWithParam(param: LieMingIntroducebarParam): void {
        this.param = param;
        this.modelID = this.param.fData.modelID;
        this.fateLv = this.param.fData.lv;
        this.onShow();
    }
    protected onRefresh(): void {
        this.showAttributeInfo();
    }
    private showAttributeInfo() {
        if(this.param.fData.slot>=0)
        {
            this.btnReplace.visible =true;
            this.btnLvUp.visible = true;
        }
        else
        {
            this.btnLvUp.visible = false;
            this.btnReplace.visible =false;
        }
        
        var i: number = 0;
        var index: number;
        var n: number = 0;
        var len: number = 0;
        var addInfo;

        this.model = JsonModelManager.instance.getModelmingge()[this.param.fData.modelID];
        var lvCfg =JsonModelManager.instance.getModelminggelv()[this.param.fData.lv-1];
        this.name_label.textFlow = new Array<egret.ITextElement>({ text: this.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.model.pinzhi) } });
        //实际战斗力
        this.lv_label.text = this.param.fData.lv +'级'

        var attr: number[] = [];
        for(let k in this.model.attrAry){  
            if(this.model.attrAry[k]>0)
            {
                switch(this.model.pinzhi)
                {
                    case 1:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lv  / 100))  
                    break;
                    case 2:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lan  / 100))  
                    break;
                    case 3:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.zi  / 100))  
                    break;
                    case 4:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.cheng  / 100))  
                    break;
                    case 5:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.hong  / 100))  
                    break;
                }
               
                // attr[Number(k)] = this.model.attrAry[k];
            }
            else
            {
                attr.push(0)
            }
            
        }
        var fightValue = GameCommon.calculationFighting(attr);
        this.bmlable_power.power = fightValue.toString();
        this.pingfen_label.text = "评分：" + fightValue;
        // this.psych.onUpdate(base, PSYCHSTATE_TYPE.NOLABEL, 0);
        // this.psych.touchEnabled = false;
        this.item_icon.source = this.model.icon;
        this.effectImg.source = '';
         while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
                if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                    (display as Animation).onDestroy();
                } else {
                    this.avatar_grp.removeChild(display);
                }
		        }

        if(this.model.pinzhi>2)
                {
                this.effectImg.source = '';
				let _mountBody: Animation = new Animation('yuanhun'+this.model.pinzhi);
				this.avatar_grp.addChild(_mountBody);
				this.avatar_grp.x = 200;
                    
                }
                else
                {
                    this.effectImg.source = 'liemingEffect'+this.model.pinzhi+'_png';
                }

                


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
			var attrValue: number = attr[i];
            if (attrValue > 0) {
				attributeItem = new AttributeItem();
				attributeItem.data = [i, attrValue];
				this.basic_attr_layer.addChild(attributeItem);
			}
		}
    }
}
class LieMingIntroducebarParam {
    public fData:FateBase;
    public constructor(data:FateBase) {
        this.fData = data;
    }
}

