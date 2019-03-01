// TypeScript file
class GoodsInstance extends eui.Component {
    public model: ModelThing;
    protected id;
    protected type;
    protected quality;
    protected num;
    protected uid;
    protected lv;

    public item_icon: eui.Image;
    public item_frame: eui.Image;
    // public item_back: eui.Image;
    public num_label: eui.Label;
    public name_label: eui.Label;
    public label_gemLv: eui.Label;
    public item_name_bg: eui.Image;

    // private jobIcon: eui.Image;
    private orangeLayer: eui.Group;
    private orangeAnim: Animation;
    private specialAnim: Animation;
    private isLoaded: boolean;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.skinName = skins.GoodsInstanceSkin;
    }
    private onLoadComplete(): void {
        this.isLoaded = true;

        if (this.model) {
            this.refresh();
        }
    }
    private onAddStage(): void {
        this.touchEnabled = false;
        this.item_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.item_frame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    public updateByAward(awarditem: AwardItem) {
        if (awarditem) {
            this.onUpdate(awarditem.type, awarditem.id, 0, -1, awarditem.num);
        }
    }
    public onUpdate(type, id, uid = 0, quality = -1, num = 0, lv = 1): void {
        this.type = type;
        this.id = id;
        this.num = num;
        this.uid = uid;
        this.lv = lv;
        this.model = GameCommon.getInstance().getThingModel(this.type, this.id, quality);
        if (this.model) {
            this.quality = quality > 0 ? quality : this.model.quality;
            this.refresh();
        }
    }
    public onReset() {
        this.type = 0;
        this.id = 0;
        this.quality = -1;
        this.num = 0;
        this.model = null;
        if (this.isLoaded) {
            this.item_icon.source = "";
            this.name_label.text = "";
            this.num_label.text = "";
            this.item_frame.source = "bag_whiteframe_png";
            this.item_name_bg.source = "equip_dengjikuang_bai_png";
        }
        // this.jobIcon.visible = false;
        if (this.orangeAnim) {
            this.orangeAnim.onStop();
        }
        this.orangeLayer.visible = false;
    }
    protected refresh() {
        if (!this.isLoaded)
            return;
        this.item_icon.source = this.model.icon;
        var name: string = "";
        switch (this.type) {
            case GOODS_TYPE.YUANSHEN:
                name = (this.lv > 0 ? this.lv + Language.instance.getText("level") : "") + this.model.name;
                break;
            case GOODS_TYPE.GEM:
                if (this.lv > 0) {
                    this.label_gemLv.text = this.lv + Language.instance.getText("level");
                }
                name = this.model.name;
                break;
            case GOODS_TYPE.MASTER_EQUIP:
                // if (this.quality == GoodsQuality.Gold) {
                //     name = this.model.name;
                // } else {
                name = this.model.coatardLv + Language.instance.getText("grade");
                // }
                break;
            case GOODS_TYPE.SERVANT_EQUIP:
                name = this.model.starNum + Language.instance.getText("star");
                break;
            default:
                name = this.model.name;
                break;
        }
        this.name_label.textFlow = new Array<egret.ITextElement>({ text: name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.quality) } });
        // this.item_back.source = GameCommon.getInstance().getIconBack(this.quality);
        this.item_frame.source = GameCommon.getInstance().getIconFrame(this.quality);
        this.item_name_bg.source = GameCommon.getInstance().getIconFrameDi(this.quality);
        if (this.num > 0) {
            this.num_label.text = GameCommon.getInstance().getFormatNumberShow(this.num);
        } else {
            this.num_label.text = "";
        }

        //橙装特效
        if (this.quality >= GoodsQuality.Orange) {
            this.orangeLayer.visible = true;
            let pinzhiAnim: string = "";
            let scale: number = 1;
            switch (this.quality) {
                case GoodsQuality.Red:
                    pinzhiAnim = 'hongzhuang';
                    break;
                case GoodsQuality.Gold:
                    pinzhiAnim = 'jinzhuang';
                    break;
                case GoodsQuality.Orange:
                    if (this.type != GOODS_TYPE.MASTER_EQUIP) {
                        pinzhiAnim = 'chengzhuang';
                    }
                    scale = 0.95;
                    break;
            }
            if (pinzhiAnim) {
                if (!this.orangeAnim) {
                    this.orangeAnim = new Animation(pinzhiAnim, -1);
                    this.orangeAnim.touchEnabled = false;
                    this.orangeAnim.touchChildren = false;
                    this.orangeLayer.addChild(this.orangeAnim);
                } else {
                    this.orangeAnim.onUpdateRes(pinzhiAnim, -1);
                }
                this.orangeAnim.scaleX = scale;
                this.orangeAnim.scaleY = scale;
                this.orangeAnim.onPlay();
            } else {
                if (this.orangeAnim) {
                    this.orangeAnim.onStop();
                }
                this.orangeLayer.visible = false;
            }
        }
        else {
            if (this.orangeAnim) {
                this.orangeAnim.onStop();
            }
            this.orangeLayer.visible = false;
        }
        // if (this.type == GOODS_TYPE.MASTER_EQUIP) {
        //     this.jobIcon.visible = true;
        //     var job: number = this.model.occupation;
        //     this.jobIcon.source = job == -1 ? "" : GameCommon.getInstance().getOccpationIcon(job);
        // } else {
        //     this.jobIcon.visible = false;
        // }

    }
    public onHideName(bl: boolean): void {
        this.name_label.visible = !bl;
    }
    public onTouch(event: egret.TouchEvent): void {
        if (!this.model) return;
        // if (this.type == GOODS_TYPE.SHOW) return;
        var base;
        var tipsType: number;
        if (this.type == GOODS_TYPE.MASTER_EQUIP || this.type == GOODS_TYPE.SERVANT_EQUIP) {
            base = new EquipThing(this.type);
            base.onupdate(this.id, this.quality, 0);
            tipsType = INTRODUCE_TYPE.EQUIP;
        } else {
            base = new ThingBase(this.type);
            base.onupdate(this.id, this.quality, 0);
            tipsType = INTRODUCE_TYPE.IMG;
        }
        if (this.type == GOODS_TYPE.YUANSHEN) {
            var psych: Modelyuanshen = JsonModelManager.instance.getModelyuanshen()[this.id];
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("PsychIntroducebar",
                    new PsychIntroducebarParam(psych))
            );
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("ItemIntroducebar",
                    new IntroduceBarParam(tipsType, this.type, base, this.uid)
                )
            );
        }
    }
    public addAnimation(key: string, num: number = -1): void {
        this.remAnimation();
        this.orangeAnim = new Animation(key, num, true);
        this.orangeAnim.touchEnabled = false;
        this.orangeAnim.touchChildren = false;
        this.orangeAnim.scaleX = this.orangeAnim.scaleY = 0.9;
        this.orangeLayer.addChild(this.orangeAnim);
    }
    public remAnimation() {
        if (this.orangeAnim) {
            this.orangeAnim.onDestroy();
            if (this.orangeAnim.parent) {
                this.orangeAnim.parent.removeChild(this.orangeAnim);
            }
            this.orangeAnim = null;
        }
    }
    public addSpecialAnim(key: string, num: number = -1, x: number = 0, y: number = 0): void {
        this.remSpecialAnim();
        this.specialAnim = new Animation(key, num, true);
        this.specialAnim.y = 4;
        this.specialAnim.touchEnabled = false;
        this.specialAnim.touchChildren = false;
        this.orangeLayer.addChild(this.specialAnim);
    }
    public remSpecialAnim() {
        if (this.specialAnim) {
            this.specialAnim.onDestroy();
            if (this.specialAnim.parent) {
                this.specialAnim.parent.removeChild(this.specialAnim);
            }
            this.specialAnim = null;
        }
    }
    protected _bl: boolean = false;
    public set shieldTip(bl: boolean) {
        this._bl = bl;
    }
    //The end
}