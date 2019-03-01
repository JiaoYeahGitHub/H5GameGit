class FuLingViewPanel extends BaseTabView {
    private powerbar: PowerBar;
    private btn_advance: eui.Button;
    private label_money: eui.Label;
    private role_list_bar: RoleSelectBar;
    private animPos: egret.Point = new egret.Point(344, 600);
    private consumeLayer: eui.Group;
    protected points: redPoint[] = RedPointManager.createPoint(4);
    private index: number = 0;
    private lab_tier: eui.Label;
    private lab_lv: eui.Label;
    private itemGroup: eui.List;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    private fuLingBtn: eui.Button;
    private avatar_grp: eui.Group;
    private fulings: FuLingItem[];
    private progress: eui.ProgressBar;
    private prooooo: eui.Group;
    private currency: ConsumeBar;
    private progress1: eui.ProgressBar;
    private leftMask: eui.Image;
    private rightMask: eui.Image;
    private mask1: eui.Image;
    private mask2: eui.Image;
    private curr_addattr_lab: eui.Label;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.FuLingPanelSkin;
    }
    protected onInit(): void {
        // this.powerbar.power_bg.visible = false;
        super.onInit();

        this.fulings = [];
        while (this.avatar_grp.numChildren > 0) {
            let display = this.avatar_grp.getChildAt(0);
            if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                (display as Animation).onDestroy();
            } else {
                this.avatar_grp.removeChild(display);
            }
        }
        let _mountBody: Animation = new Animation('fuling_02');
        this.avatar_grp.addChild(_mountBody);
        this.avatar_grp.y = 330;
        for (var i: number = 0; i < 4; i++) {
            var fuLingItem: FuLingItem = new FuLingItem();
            fuLingItem.onUpdate(this.models[i]);
            fuLingItem.isSelect(i, false);
            if (i == 0) {
                fuLingItem.isSelect(i, true);
            }
            fuLingItem.x = ((fuLingItem.width + 30) * i);
            this.itemGroup.addChild(fuLingItem);
            this.fulings.push(fuLingItem);
            fuLingItem.name = i + '';
            fuLingItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectFuLing, this);

        }
        // this.progress.minimum  =0;
        // this.progress.maximum = 100;
        // this.progress.value = 0;

        // this.progress1.minimum = 0;
        // this.progress1.maximum = 100;
        // this.progress1.value = 0;

        // this.progress.mask = this.mask1;
        // this.progress1.mask = this.mask2;
        // var flPro:FulingPross = new FulingPross();
        // this.onDraw();
        // this.prooooo.addChild(flPro);
        this.onRefresh();
    }
    private _shape: egret.Shape;
    private onDraw(): void {
        var w = 378;
        var h = 378;
        var r = Math.max(w, h) / 2;
        this._shape = new egret.Shape();
        // this.progress.mask = this._shape;
        this.prooooo.addChild(this._shape);
        this._shape.x = 180;
        this._shape.y = 180;
        // this._shape.rotation = -95;
        var shepe1: egret.Shape = new egret.Shape();
        this.prooooo.addChild(shepe1);
        shepe1.graphics.beginFill(0x0000ff);
        shepe1.graphics.drawRect(this.progress.width / 2, 0, this.progress.width / 2, 378);
        // shape.graphics.lineTo(0, 0);
        shepe1.graphics.endFill();
        this.progress1.mask = this._shape;
        this.progress.mask = shepe1;

        this.changeGraphics(-2);

    }


    private changeGraphics(angle): void {
        // this._shape.graphics.beginFill(0x00ffff, 1);
        this._shape.graphics.beginFill(0x0000ff);
        this._shape.graphics.drawRect(0, 0, this.progress.width / 2, 378);
        // shape.graphics.lineTo(0, 0);
        this._shape.graphics.endFill();
    }
    protected onRegist(): void {
        super.onRegist();

        this.fuLingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TouchBtnAdvance, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FULING_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.fuLingBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TouchBtnAdvance, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FULING_MESSAGE.toString(), this.onRefresh, this);
    }
    private onSelectFuLing(event: egret.Event): void {
        var flData: FuLingItem = event.currentTarget as FuLingItem;
        for (var i: number = 0; i < this.fulings.length; i++) {
            this.fulings[i].isSelect(i, false);
            if (this.fulings[i].name == flData.name) {
                this.index = Number(flData.name)
                this.fulings[i].isSelect(i, true);
            }
        }
        let costModel: ModelThing = GameCommon.getInstance().getThingModel(this.models[this.index].cost.type, this.models[this.index].cost.id);
        this.currency.setCostByAwardItem(this.models[this.index].cost);
    }
    private rewardArr: Array<Modelfuling> = new Array<Modelfuling>();
    private get models(): Modelfuling[] {
        this.rewardArr = [];
        var cfgs = JsonModelManager.instance.getModelfuling();
        for (let k in cfgs) {
            this.rewardArr.push(cfgs[k])
        }
        return this.rewardArr;
    }
    protected onRefresh(): void {
        // this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
        var curCfg = DataManager.getInstance().fuLingManager.onGetLingXingCfg();
        var nextCfg = DataManager.getInstance().fuLingManager.nextlingxingCfg;
        // if(!nextCfg)
        // {
        //     this.progress.minimum = 0;
        //     this.progress.maximum = curCfg.max/2;
        //     this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6];
        //      this.progress1.value = 0;
        //     if(DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6]>=curCfg.max/2)
        //     {
        //         this.progress1.minimum = curCfg.max/2;
        //         this.progress1.maximum = curCfg.max;
        //         this.progress1.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6];
        //     }
        // }
        // else
        // {
        // this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6];

        // this.progress1.value = 0;
        if (nextCfg.id == 1) {
            this.progress.minimum = 0;
            this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData().fuling[6];
            this.progress.maximum = nextCfg.max;
            this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData().fuling[6];
            // this.progress.maximum = nextCfg.max-((nextCfg.max-curCfg.max)/2);
            // this.progress1.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6];
            // this.progress1.minimum = nextCfg.max-((nextCfg.max-curCfg.max)/2);
            // this.progress1.maximum = nextCfg.max;
            // this.progress1.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6];
        }
        else {
            // this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData()._fuling[6]-curCfg.max;
            this.progress.minimum = 0;
            this.progress.maximum = nextCfg.max - curCfg.max;
            this.progress.value = DataManager.getInstance().playerManager.player.getPlayerData().fuling[6] - curCfg.max;
        }
        // this.progress.maximum = nextCfg.max-((nextCfg.max-curCfg.max)/2);

        // }


        // onGetLingXingCfg
        let costModel: ModelThing = GameCommon.getInstance().getThingModel(this.models[this.index].cost.type, this.models[this.index].cost.id);
        this.currency.setCostByAwardItem(this.models[this.index].cost);

        var attrAry: number[] = this.models[1].attrAry;
        var str: string = '';
        var nextStr: string = '';
        let i: number = 0;
        var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();

        //附灵属性加成
        for (; i < GameDefine.FULING_ATTR.length; i++) {
            tempAttribute[GameDefine.FULING_ATTR[i]] += DataManager.getInstance().playerManager.player.getPlayerData(0).fuling[i];
            if (i > 2) {
                nextStr = nextStr + GameDefine.Attr_FontName[GameDefine.FULING_ATTR[i]] + "：" + (0 + DataManager.getInstance().playerManager.player.getPlayerData(0).fuling[i]) + "\n";
            }
            else {
                str = str + GameDefine.Attr_FontName[GameDefine.FULING_ATTR[i]] + "：" + (0 + DataManager.getInstance().playerManager.player.getPlayerData(0).fuling[i]) + "\n";
            }
        }

        // for (; i <attrAry.length;i++) {
        //     if ( attrAry[i]> 0 ) {
        // 		if (i > 2) {
        //             if(i>3)
        //             {

        //             }
        //             else
        //             {
        //                 nextStr = nextStr+GameDefine.Attr_FontName[i] + "："+(0+DataManager.getInstance().playerManager.player.getPlayerData(0)._fuling[i]) +"\n";
        //             }
        //         }
        //         else
        //         {

        //         }
        // 	}
        //         if(i<4)
        //         {   
        //         tempAttribute[i] = DataManager.getInstance().playerManager.player.getPlayerData(0)._fuling[i];
        //         }
        // }
        var atr_add_desc: string = '';
        var fulingProPlus: number[] = GameCommon.getInstance().getAttributeAry();
        var cfgs = JsonModelManager.instance.getModellingxing();
        for (let ken in cfgs) {
            if (DataManager.getInstance().playerManager.player.getPlayerData(0).fuling[6] >= cfgs[ken].max) {
                for (i = 10; i < cfgs[ken].attrAry.length * 2; i++) {
                    if (cfgs[ken][GameDefine.getAttrPlusKey(i)] > 0) {
                        fulingProPlus[i % ATTR_TYPE.SIZE] = cfgs[ken][GameDefine.getAttrPlusKey(i)];
                    }
                }
            }
        }
        for (i = 0; i < 4; ++i) {
            atr_add_desc += Language.instance.getAttrName(i) + Language.instance.getText('shuxingjiacheng') + ":" + (fulingProPlus[i] / 100).toFixed(1) + "%\n";
        }
        this.curr_addattr_lab.text = atr_add_desc;
        this.curPro.text = str;
        this.nextPro.text = nextStr;
        this.powerbar.power = GameCommon.calculationFighting(tempAttribute);
        super.onRefresh();
    }
    public getPlayData(index) {
        return DataManager.getInstance().playerManager.player.getPlayerData(index);
    }
    private cost: AwardItem;
    private TouchBtnAdvance() {
        var message: Message = new Message(MESSAGE_ID.FULING_MESSAGE);
        message.setByte(0);
        message.setShort(this.index + 1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onUpdateBack() {
        GameCommon.getInstance().addAnimation("shengjichenggong", this.animPos, this);
        this.onRefresh();
    }
    public onChangeRole() {
        this.onRefresh();
    }
    public trigger(): void {

    }
}
class FuLingItem extends eui.Component {
    private selectImg: eui.Image;
    private name_lab: eui.Label;
    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.FuLingItemSkin;
    }
    private onLoadComplete(): void {
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    public onUpdate(cfg: Modelfuling): void {
        this.name_lab.text = cfg.name;
    }
    public isSelect(num: number, bo: boolean): void {
        if (bo)
            this.selectImg.source = 'fuling_dan' + (num + 1) + '_sel_png';
        else {
            this.selectImg.source = 'fuling_dan' + (num + 1) + '_png';
        }

    }
}