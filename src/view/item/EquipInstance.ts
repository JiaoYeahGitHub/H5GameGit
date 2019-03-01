// TypeScript file
class EquipInstance extends eui.Component {
    private isLoaded: boolean = false;
    private equipThing: EquipThing;

    private equip_icon: eui.Image;
    private default_equip_icon: eui.Image;
    private equip_frame: eui.Image;
    private level_label: eui.Label;
    private soul: eui.Group;
    private soul_label: eui.Label;
    private intensify: eui.Group;
    private intensify_label: eui.Label;
    private orangeAnim: Animation;
    private orangeLayer: eui.Group;
    public pos: number;
    public _ownID: number = 0;
    private equi_soulframe: eui.Image;
    private quenchingLv: number = 0;
    private equi_soulframeDi: eui.Image;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.EquipInstanceSkin;
    }
    private onLoadComplete(): void {
        this.isLoaded = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        if (this.equipThing) {
            this.refresh();
        }
    }
    public onUpdate(equipThing: EquipThing, quenchingLv: number): void {
        this.equipThing = equipThing;
        this.quenchingLv = quenchingLv;
        this.refresh();
    }
    private refresh() {
        if (!this.isLoaded)
            return;
        this.equi_soulframe.visible = false;
        if (this.equipThing && this.equipThing.model) {
            this.default_equip_icon.source = "";
            this.equip_icon.source = this.equipThing.model.icon;
            var lvName: string = this.equipThing.model.coatardLv + Language.instance.getText("grade");
            this.level_label.text = lvName;
            this.equi_soulframeDi.source = GameCommon.getInstance().getIconFrameDi(this.equipThing.quality);
            this.equip_frame.source = GameCommon.getInstance().getIconFrame(this.equipThing.quality);
            //橙装特效
            if (this.equipThing.quality >= GoodsQuality.Red) {
                let pinzhiAnim: string = "";
                let scale: number = 1;
                switch (this.equipThing.quality) {
                    case GoodsQuality.Red:
                        pinzhiAnim = 'hongzhuang';
                        break;
                    case GoodsQuality.Gold:
                        pinzhiAnim = 'jinzhuang';
                        scale = 0.8;
                        break;
                }
                if (pinzhiAnim) {
                    this.orangeLayer.visible = true;
                    if (!this.orangeAnim) {
                        this.orangeAnim = new Animation(pinzhiAnim, -1);
                        this.orangeLayer.addChild(this.orangeAnim);
                    } else {
                        this.orangeAnim.onUpdateRes(pinzhiAnim, -1);
                    }
                    this.orangeAnim.scaleX = scale;
                    this.orangeAnim.scaleY = scale;
                    this.orangeAnim.onPlay();
                } else {
                    this.orangeLayer.visible = false;
                }
            } else {
                this.orangeLayer.visible = false;
            }
        } else {
            this.equip_icon.source = "";
            if (this.equipThing) {
                if (this.equipThing.position >= MASTER_EQUIP_TYPE.SIZE * 2) {
                    this.default_equip_icon.source = "public_slot_" + this.equipThing.position + "_png";
                } else {
                    this.default_equip_icon.source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this.equipThing.position % MASTER_EQUIP_TYPE.SIZE] + "_png";
                }
            } else {
                this.default_equip_icon.source = "";
            }

            this.level_label.text = "";
            this.equip_frame.source = "bag_whiteframe_png";
            this.equi_soulframeDi.source = 'equip_dengjikuang_bai_png';
        }
        if (this.equipThing && Tool.isNumber(this.equipThing.playerIndex)) {
            var equipSlotThing: EquipSlotThing = GameCommon.getInstance().getEquipSlotThingByIndexSlot(this.equipThing.playerIndex, this.equipThing.position);
            this.showSoulFrame(equipSlotThing && equipSlotThing.zhLv > 0)
        }
        // this.orangeLayer.visible = false;
        // if (this.quenchingLv > 0) {
        //     var animRes: string;
        //     this.orangeLayer.visible = true;
        //     var curr: Modelcuilian = JsonModelManager.instance.getModelcuilian()[(this.quenchingLv)];
        //     if (curr) {
        //         switch (curr.pinzhi) {
        //             case 2:
        //                 animRes = "guanghuanlan";
        //                 break;
        //             case 3:
        //                 animRes = "guanghuanzi";
        //                 break;
        //             case 4:
        //                 animRes = "guanghuancheng";
        //                 break;
        //         }
        //     }
        //     if (!this.orangeAnim) {
        //         this.orangeAnim = new Animation(animRes, -1);
        //         this.orangeAnim.y = 4;
        //         this.orangeLayer.addChild(this.orangeAnim);
        //     } else {
        //         this.orangeAnim.onUpdateRes(animRes, -1);
        //     }
        //     this.orangeAnim.onPlay();
        // }
    }
    public showSoulFrame(bool: boolean): void {
        this.equi_soulframe.visible = bool;
    }
    /*清除锻造信息*/
    private clearForgeInfo() {
        this.soul.visible = false;
        this.soul_label.text = "";
        this.intensify.visible = false;
        this.intensify_label.text = "";
    }
    /*显示锻造信息*/
    public set forgeInfo(thing: EquipSlotThing) {
        this.intensify_label.visible = thing == null ? false : true;
        if (thing) {
            if (thing.infuseLv > 0) {
                this.soul.visible = true;
                this.soul_label.text = "+" + thing.infuseLv;
            } else {
                this.soul.visible = false;
            }
            if (thing.intensifyLv > 0) {
                this.intensify.visible = true;
                this.intensify_label.text = "+" + thing.intensifyLv;
            } else {
                this.intensify.visible = false;
            }
            // this.soul_bg.visible = true;
            // this.intensify_bg.visible = true;
        }
    }
    public getEquipThing(): EquipThing {
        return this.equipThing;
    }
    public setEquipThing(equipThing: EquipThing) {
        this.equipThing = equipThing;
    }
    private _bl: boolean = false;
    public set shieldTip(bl: boolean) {
        this._bl = bl;
    }
    public onTouch(event: egret.TouchEvent): void {
        if (!(this.equipThing && this.equipThing.model))
            return;
        if (this._bl) return;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar",
                new IntroduceBarParam(INTRODUCE_TYPE.CLOTH, this.equipThing.type, this.equipThing, this.equipThing.equipId, this.equipThing.position, 0, this.quenchingLv)
            ));
    }
    /**播放穿装备的特效**/
    private _animPos: egret.Point = new egret.Point(50, 50);
    public onPlayClothAnim(): void {
        this._animPos.x = 50;
        this._animPos.y = 50;
        GameCommon.getInstance().addAnimation("zhuangbeiqianghua", this._animPos, this);
    }
    //The end
}