class ZhanWenComposePanel extends BaseTabView {
    private boss_name_lab: eui.Label;
    private btn_xiangqian: eui.Button;
    private selectIndex: number;
    private runesData: ZhanWenItem[];
    private index: number = 1;
    private tabindex: number = 2;
    private curPro: eui.Label;
    private powerBar: PowerBar;
    // private effectGroup1:eui.Group;
    // private effectGroup2:eui.Group;
    // private animLayer:eui.Group;
    // private item_icon2:eui.Image;
    // private item_icon1:eui.Image;
    // private itemName1:eui.Label;
    private item1: GoodsInstance;
    private item2: GoodsInstance;
    private batch_bar: BatchDisposebar;
    private curNum: eui.Label;
    private animLayer: eui.Group;

    private readonly ZHANWEN_NAMEs: string[] = ["金战纹", "木战纹", "水战纹", "火战纹", "土战纹"];
    protected points: redPoint[] = RedPointManager.createPoint(5);
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ZhanWenComposeSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RUNE_COMPOS.toString(), this.onheChengRefresh, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onheChengRefresh, this);

        this.btn_xiangqian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeCheng, this);

        // this.item_icon1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips1, this);
        // this.item_icon2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips2, this);
        this.batch_bar.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
        this.batch_bar.onRemove();
        //  this.item_icon1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips1, this);
        // this.item_icon2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips2, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onheChengRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RUNE_COMPOS.toString(), this.onheChengRefresh, this);
        this.btn_xiangqian.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeCheng, this);
    }
    protected onInit(): void {
        // this.setTitle("");
        //this.setBg("zhanen_bj1_jpg");
        this.runesData = [];
        for (let i: number = 1; i <= this.ZHANWEN_NAMEs.length; i++) {
            (this['tab' + i] as ZhanWenTabBtnItem).onUpdate(false);
            (this['tab' + i] as ZhanWenTabBtnItem).onInit(i);
            (this['tab' + i] as ZhanWenTabBtnItem).name_lab.text = this.ZHANWEN_NAMEs[i - 1];
            (this['tab' + i] as ZhanWenTabBtnItem).selectIcon.name = i + '';
            (this['tab' + i] as ZhanWenTabBtnItem).selectIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
            (this['tab' + i] as ZhanWenTabBtnItem).itemList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClockText, this);
            this.points[i - 1].register((this['tab' + i] as ZhanWenTabBtnItem), new egret.Point(155, 10), DataManager.getInstance().bagManager, "getRnuesLvPoint", i - 1);
            var cfgModels = this.models(i);
            for (var j: number = 1; j < cfgModels.length; j++) {
                ((this['tab' + i] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).onUpdate(cfgModels[j]);
                ((this['tab' + i] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).isSelect(false);
            }
        }
        ((this['tab' + 1] as ZhanWenTabBtnItem)['tab' + 2] as ZhanWenItemLabelItem).isSelect(true);
        (this['tab' + 1] as ZhanWenTabBtnItem).onUpdate(true);
        this.batch_bar.onSetUpdateCall(this.onBatchUpdateHandler, this);
        super.onInit();
        this.onRefresh();
        this.showInfo();
    }
    // public getEquipRnuesPoint(idx:number = -1):boolean{
    //             var num:number = 0;
    //             for (var i: number = idx*5-5; i < idx*5; i++) {
    //                 var modelId:number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
    //                 if(modelId>0)
    //                 {	
    //                         if (DataManager.getInstance().bagManager.getRnuesList(modelId)>=2) {
    //                             return true;
    //                         }
    //                 }
    //             }
    //     return false;
    // }
    private rewardArr: Array<Modelzhanwen> = new Array<Modelzhanwen>();
    private models(idx: number): Modelzhanwen[] {
        this.rewardArr = [];
        for (let k in JsonModelManager.instance.getModelzhanwen()) {
            if (JsonModelManager.instance.getModelzhanwen()[k].type == idx - 1) {
                this.rewardArr.push(JsonModelManager.instance.getModelzhanwen()[k])
            }
        }
        return this.rewardArr;
    }
    //检测红点
    private checkPoint1(idx): number {
        var cfgModels = this.models(this.index);
        for (var j: number = 0; j < cfgModels.length; j++) {
            if (DataManager.getInstance().bagManager.getRnuesList(cfgModels[j].id) > 1) {
                return j + 2;
            }
        }
        return 2;
    }
    private onClockText(event: egret.Event): void {
        var name: number = Number(event.target.name);
        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + this.tabindex] as ZhanWenItemLabelItem).isSelect(false);
        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + name] as ZhanWenItemLabelItem).isSelect(true);
        this.tabindex = name;
        this.showInfo();
    }
    //数量回调
    private onBatchUpdateHandler(): void {
        // this.totalmoney_num_label.text = this.batch_bar.count * this.buyPrice[0].num + "";
    }
    private orangeAnim: Animation;
    private orangeAnim1: Animation;
    private _curModel: Modelzhanwen;
    private showInfo(): void {
        var model: Modelzhanwen = this.models(this.index)[this.tabindex - 2];
        var nextModel: Modelzhanwen = this.models(this.index)[this.tabindex - 1];
        this._curModel = model;
        if (!nextModel) {
            this.item2.onUpdate(26, model.id)
            var num: number = DataManager.getInstance().bagManager.getRnuesList(model.id);
            this.curNum.text = '当前拥有数量:' + num;
            var batchParam: BatchParam = new BatchParam();
            batchParam.maxNum = Math.floor(num / 2);
            this.batch_bar.onUpdate(batchParam);
            return;
        }
        else {
            this.item1.onUpdate(26, nextModel.id)
        }
        this.item2.onUpdate(26, model.id)
        var num: number = DataManager.getInstance().bagManager.getRnuesList(model.id);
        this.curNum.text = '当前拥有数量:' + num;
        var batchParam: BatchParam = new BatchParam();
        batchParam.maxNum = Math.floor(num / 2);
        this.batch_bar.onUpdate(batchParam);
    }
    private okAnim: Animation;
    private onheChengRefresh() {

        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + this.tabindex] as ZhanWenItemLabelItem).isSelect(false);

        if (this.tabindex + 1 <= 13) {
            this.tabindex = this.tabindex + 1;
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (this.tabindex)] as ZhanWenItemLabelItem).isSelect(true);
        }
        else {
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (this.tabindex)] as ZhanWenItemLabelItem).isSelect(true);
        }

        var cfgModels = this.models(this.index);
        for (var j: number = 1; j < cfgModels.length; j++) {
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).setName();
        }
        this.showInfo();
        // this.onRefresh();
        if (!this.okAnim) {
            this.okAnim = new Animation("zhuangbeiqianghua", 1, false);
            this.animLayer.addChild(this.okAnim);
        } else {
            this.okAnim.visible = true;
            this.okAnim.playNum = 1;
        }
        this.okAnim.playFinishCallBack(this.onAnimPlayEnd, this);
    }
    private onAnimPlayEnd(): void {
        if (this.okAnim) {
            this.okAnim.visible = false;
        }
    }
    private effEctScale: number = 0;
    private effectName(quality: number): string {
        //橙装特效
        var scale: number = 1;
        var pinzhiAnim: string = "";


        switch (quality) {
            case GoodsQuality.Red:
                pinzhiAnim = 'hongzhuang';
                break;
            case GoodsQuality.Gold:
                pinzhiAnim = 'jinzhuang';
                scale = 0.8;
                break;
            case GoodsQuality.Orange:
                pinzhiAnim = 'chengzhuang';
                scale = 0.95;
                break;
        }

        this.effEctScale = scale;
        return pinzhiAnim;
    }
    private onTab(event: egret.Event): void {
        var name: number = Number(event.currentTarget.name);
        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + this.tabindex] as ZhanWenItemLabelItem).isSelect(false);
        if (this.index == name) {
            this['tab' + name].onUpdate(!this['tab' + name].bool);
        }
        else {
            this['tab' + this.index].onUpdate(false);
            this['tab' + name].onUpdate(true);
        }

        this.index = name;
        this.tabindex = this.checkPoint1(this.index);
        if (this.tabindex > 13)
            this.tabindex = 13;
        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + this.tabindex] as ZhanWenItemLabelItem).isSelect(true);
        this.showInfo();
    }
    protected onRefresh(): void {
        var cfgModels = this.models(this.index);
        for (var j: number = 1; j < cfgModels.length; j++) {
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).onUpdate(cfgModels[j]);
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).isSelect(false);
            ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + (j + 1)] as ZhanWenItemLabelItem).setName();
        }
        this.tabindex = this.checkPoint1(this.index);
        if (this.tabindex > 13)
            this.tabindex = 13;
        ((this['tab' + this.index] as ZhanWenTabBtnItem)['tab' + this.tabindex] as ZhanWenItemLabelItem).isSelect(true);
    }

    private onResBossListInfoMsg(): void {
        let data: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
        for (let i: number = 1; i < 10; i++) {
            let info: XuezhanBossInfo = data.xuezhanInfos[i];
            if (!info) break;
            let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(info.bossID);
            let tabbtn: eui.RadioButton = this['tab' + i];
            tabbtn.label = modelfighter.name;
            tabbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }

        if (Tool.isNumber(this.selectIndex)) {
            let selectIndex: number = this.selectIndex;
            this.selectIndex = null;
            this.onchangeTab(selectIndex);
        } else {
            this.onchangeTab(0);
        }
    }
    private onTouchTab(event: egret.Event): void {
        let radioBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
        this.onchangeTab(radioBtn.value);
    }
    private onchangeTab(index: number): void {
        if (this.selectIndex != index) {
            this.selectIndex = index;
        }
    }
    private onHeCheng(): void {
        if (DataManager.getInstance().bagManager.getRnuesList(this._curModel.id) < 2 || this.batch_bar.count <= 0) {
            return;
        }
        var num: number = this.batch_bar.count;
        var message = new Message(MESSAGE_ID.RUNE_COMPOS);
        message.setShort(this._curModel.id)
        message.setShort(num);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    //The end
}
class ZhanWenTabBtnItem extends eui.Component {
    public selectIcon: eui.Image;
    public bool: boolean;
    public itemList: eui.Group;
    public name_lab: eui.Label;
    private scroll: eui.Scroller;
    private nameImg: eui.Image;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.skinName = skins.ZhanWenTabBtnSkin;
        // this.itemList.itemRenderer = ZhanWenItemLabelItem;
        // this.itemList.itemRendererSkinName = skins.ZhanWenLabelSkin;
        // this.itemList.useVirtualLayout = true;
        // this.scroll.viewport = this.itemList;
    }
    private onLoadComplete(): void {
        this.itemList.visible = false;
    }

    private index: number = 1;
    public onInit(idx: number): void {
        this.index = idx;
        this.nameImg.source = 'wx_newIcon' + idx + '_png';
        //  this.itemList.dataProvider = new eui.ArrayCollection(this.models);

    }
    private onAddStage(): void {
        this.touchEnabled = false;
    }
    public onUpdate(bo: boolean): void {
        this.bool = bo;
        if (bo) {
            this.itemList.visible = true;
            this.height = 420;
        }
        else {
            this.itemList.visible = false;
            this.height = 64;
        }
    }
    public onTouch(event: egret.TouchEvent): void {
        Tool.log('wodetian')
    }
}
class ZhanWenItemLabelItem extends eui.Component {
    public nameLable: eui.Label;
    private selectImg: eui.Image;
    private model_Cfg: Modelzhanwen;
    // private reward_grp:eui.Group;
    // public curFtData :FateBase;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.skinName = skins.ZhanWenLabelSkin;
        // var shape:egret.Shape = new egret.Shape();
        // shape.graphics.lineStyle(2, 0xffff00);
        // shape.graphics.beginFill(0xff0000);
        // shape.graphics.lineTo(0, 5);
        // shape.graphics.moveTo(50,5);
        // shape.graphics.endFill();
        // shape.y = 5;
        // this.reward_grp.addChild(shape);
    }
    private onLoadComplete(): void {
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    public setName(): void {
        if (DataManager.getInstance().bagManager.getRnuesList(this.model_Cfg.id - 1) > 1) {
            var str = this.model_Cfg.name + '(' + '<font color=#00ff00>' + Tool.toInt(DataManager.getInstance().bagManager.getRnuesList(this.model_Cfg.id - 1) / 2) + '</font>' + ')';
            this.nameLable.textFlow = (new egret.HtmlTextParser).parser(GameCommon.getInstance().readStringToHtml(str));
        }
        else {
            this.nameLable.text = this.model_Cfg.name;
        }
    }
    public isSelect(bo: boolean): void {
        this.selectImg.source = bo ? 'zwBtn2_png' : 'zwBtn3_png';
    }
    private onAddStage(): void {
    }
    public onUpdate(cfg: Modelzhanwen): void {
        this.model_Cfg = cfg;
        this.name = cfg.level.toString();
        this.setName();

    }
    public onTouch(event: egret.TouchEvent): void {
        // Tool.log('wodetian')
    }

}