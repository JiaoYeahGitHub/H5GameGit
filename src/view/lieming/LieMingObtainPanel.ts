class LieMingObtainPanel extends BaseTabView {
    private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private progress: eui.ProgressBar;
    private currency: ConsumeBar;
    private btn_getMingGe: eui.Button;
    private btn_getMingGe1: eui.Button;
    private label_points: eui.Label;
    private img_cons: eui.Image;
    private itemGroup: eui.List;
    private itemDatas: ThingBase[];
    private label_name1: eui.Label;
    private label_name2: eui.Label;
    private label_name3: eui.Label;
    private label_name4: eui.Label;
    private label_name5: eui.Label;
    private effectMove: eui.Image;
    private avatar_grp: eui.Group;
    private curItemNum: number = 0;
    private curpostion: number = 0;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingMainPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.curpostion = DataManager.getInstance().playerManager.player.fateIndex;
        this.label_points.text = Constant.get(Constant.FATE_GOD_COST);
        this.onRefresh();
        this.onShowSelectEffect();
        this.itemGroup.itemRenderer = LieMingItemRenderer;
        this.itemGroup.itemRendererSkinName = skins.LieMingItemSkin;
        this.itemGroup.useVirtualLayout = true;
        this._isGet = true;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_getMingGe.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btn_getMingGe1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch1, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_LOTTERY_MESSAGE.toString(), this.onChouJiang, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_getMingGe.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btn_getMingGe1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch1, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FATE_LOTTERY_MESSAGE.toString(), this.onChouJiang, this);
    }
    protected onRefresh(): void {
        this._isGet = true;
        this.curItemNum = 0;
        this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
        var cfg = JsonModelManager.instance.getModelchouqian()[DataManager.getInstance().playerManager.player.fateIndex + 1];
        this.currency.setConsume(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_FATE, cfg.costNum)
        var _has: number = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.DIAMOND);
        if (_has < 200) {
            this.label_points.textColor = 0xFF0000;
        } else {
            this.label_points.textColor = 0xe9deb3;
        }
    }
    private isGet: boolean = false;
    private onChouJiang(): void {
        var targetPoint: egret.Point = new egret.Point(this._effectPosX, this._effectPosY);
        this.onShowSelectEffect();

        if (this.isGet) {
            this.effectMove.y = 545;
            this.effectMove.x = 25 + this.curpostion * 125
            this.effectMove.visible = true;
            TweenLiteUtil.beelineTween(this.effectMove, this.onHideEffect, this, targetPoint);
            this.curpostion = DataManager.getInstance().playerManager.player.fateIndex;
        }
        else if (DataManager.getInstance().playerManager.player.fateIndex == 3) {
            this.curpostion = DataManager.getInstance().playerManager.player.fateIndex;
            this.onRefresh();
        }
    }
    private onShowSelectEffect(): void {
        while (this.avatar_grp.numChildren > 0) {
            let display = this.avatar_grp.getChildAt(0);
            if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                (display as Animation).onDestroy();
            } else {
                this.avatar_grp.removeChild(display);
            }
        }
        let _mountBody: Animation = new Animation('liemingxuanzhong');
        this.avatar_grp.addChild(_mountBody);
        this.avatar_grp.x = DataManager.getInstance().playerManager.player.fateIndex * 122 + 66;
    }
    private onHideEffect(effect: eui.Image): void {
        effect.visible = false;
        this.onRefresh();
    }
    //获取对应标签的数据结构
    private _effectPosX = 0;
    private _effectPosY = 0;
    private rewardArr: Array<MingGeItem> = new Array<MingGeItem>();
    private get models(): MingGeItem[] {
        this.rewardArr = [];
        var i = 0;

        for (let k in DataManager.getInstance().playerManager.player.fates) {
            if (DataManager.getInstance().playerManager.player.fates[k]) {
                this.rewardArr[i] = new MingGeItem(JsonModelManager.instance.getModelmingge()[DataManager.getInstance().playerManager.player.fates[k].modelID], new LieMingData(2, 0, ''), DataManager.getInstance().playerManager.player.fates[k])
                i = i + 1;
            }
        }
        this._effectPosY = Math.ceil((i + 1) / 7) * 95 - 35;
        this._effectPosX = (i % 7) * 82 + 23;
        this.curItemNum = i;
        for (i; i < 28; i++) {
            this.rewardArr[i] = new MingGeItem(null, new LieMingData(1, 0, ''), null);

        }

        return this.rewardArr;
    }
    //更新人物战斗力
    private onUpdatePower(): void {

    }
    private onShowInfo(): void {
        // if (next) {
        // 	let costModel: ModelThing = GameCommon.getInstance().getThingModel(next.cost.type, next.cost.id);
        // 	this.currency.visible = true;
        // 	this.currency.setConsumeModel(costModel, next.cost.num);
        // }
    }
    private _isGet: boolean = true;
    private onTouch(): void {
        this.isGet = true;
        if (!this._isGet) {
            return;
        }
        if (this.curItemNum >= 28) {
            GameCommon.getInstance().addAlert("命魂背包已满清清理后再进行抽取!");
            return;
        }
        this._isGet = false;
        var allotMsg: Message = new Message(MESSAGE_ID.FATE_LOTTERY_MESSAGE);
        allotMsg.setByte(1);
        GameCommon.getInstance().sendMsgToServer(allotMsg);
    }
    private onTouch1(): void {
        this.isGet = false;
        this._isGet = true;
        if (DataManager.getInstance().playerManager.player.fateIndex == 3) {
            GameCommon.getInstance().addAlert("当前已到达橙色品质,请操作普通抽签获取高品质命魂!");
            return;
        }
        if (DataManager.getInstance().playerManager.player.fateIndex == 4) {
            GameCommon.getInstance().addAlert("当前已到达红色品质,请操作普通抽签获取高品质命魂!");
            return;
        }
        var allotMsg: Message = new Message(MESSAGE_ID.FATE_LOTTERY_MESSAGE);
        allotMsg.setByte(2);
        GameCommon.getInstance().sendMsgToServer(allotMsg);
    }
    private getPlayer() {
        return DataManager.getInstance().playerManager.player;
    }
}
class LieMingItemRenderer extends eui.ItemRenderer {
    private point: redPoint;
    private item_icon: eui.Image;
    private name_label: eui.Label;
    private lv_label: eui.Label;
    public biaoqian: eui.Image
    private avatar_grp: eui.Group;
    private effectImg: eui.Image;
    private bg: eui.Image;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onComplete, this);
    }
    private onComplete(): void {
        this.effectImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);


    }
    protected dataChanged(): void {
        this.biaoqian.visible = false;

        if (this.data) {
            if (this.data.cfg) {
                if (this.data.cfg.pinzhi > 2) {
                    this.effectImg.source = '';
                    if (this.avatar_grp.numChildren == 0) {
                        // let display = this.avatar_grp.getChildAt(0);
                        //     if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                        //         (display as Animation).onDestroy();
                        //     } else {
                        //         this.avatar_grp.removeChild(display);
                        //     }
                        let _mountBody: Animation = new Animation('yuanhun' + this.data.cfg.pinzhi);
                        _mountBody.touchEnabled = false;
                        // _mountBody.toucht
                        _mountBody.x = 48;
                        _mountBody.y = 49;
                        this.avatar_grp.addChild(_mountBody);

                        this.avatar_grp.touchEnabled = false;
                        // clipAndEnableScrolling
                        // mask = new egret.Rectangle(x,x,x,x)。没有效率问题的。
                        this.avatar_grp.scrollEnabled = true;
                        // this.avatar_grp.scro = true;


                    }

                }
                else {
                    this.effectImg.source = 'liemingEffect' + this.data.cfg.pinzhi + '_png';
                }


            }
            else
                this.effectImg.source = '';
            if (this.data.lmData.from == 'isEquip')
                this.biaoqian.visible = true;
            switch (this.data.lmData.tp) {
                case 1:
                    this.item_icon.visible = true;
                    if (this.data.ftData) {
                        this.item_icon.source = this.data.cfg.icon;
                        this.name_label.text = this.data.cfg.name;
                        this.lv_label.text = 'Lv.' + this.data.ftData.lv;
                        this.currentState = "haveLv";
                    }
                    else {
                        this.item_icon.visible = false;
                        this.currentState = "";
                    }

                    break;
                case 2:
                    this.item_icon.source = this.data.cfg.icon;
                    this.name_label.text = this.data.cfg.name;
                    // this.lv_label.text = 'Lv.'+this.data.ftData.lv;
                    this.currentState = "notName";
                    break;
                case 3:
                    this.item_icon.source = this.data.cfg.icon;
                    this.name_label.text = this.data.cfg.name;
                    this.lv_label.text = 'Lv.' + this.data.ftData.lv;
                    this.currentState = "haveLv";
                    break;
                case 4:
                    this.item_icon.source = this.data.cfg.icon;
                    this.name_label.text = this.data.cfg.name;
                    this.lv_label.text = 'Lv.' + this.data.ftData.lv;
                    this.currentState = "haveLv";
                    break;
            }
        }
    }
    private onTouch(): void {
        if (this.data) {
            switch (this.data.lmData.tp) {
                case 1:
                    if (this.data.lmData.from == 'equip' || this.data.lmData.from == 'lvUp') {

                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_EQUIP), this.data);
                    }

                    break;
                case 2:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                        new WindowParam("LieMingIntroducebar",
                            new LieMingIntroducebarParam(this.data.ftData)));

                    break;
                case 3:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_DOWN), this.data);
                    break;
                case 4:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_DOWN), this.data);
                    break;
            }
        }
    }
}
class MingGeItem {
    public cfg: Modelmingge;
    public lmData: LieMingData;
    public ftData: FateBase;

    // public curFtData :FateBase;
    public constructor(cfg: Modelmingge, lmData: LieMingData, ftData: FateBase) {

        this.cfg = cfg;
        this.lmData = lmData;
        this.ftData = ftData;
        // this.curFtData = curFateData;
        // this.playerdata = playerdata;
    }

}