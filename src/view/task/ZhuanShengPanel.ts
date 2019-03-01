class ZhuanShengPanel extends BaseTabView {
    private imgZhuan: eui.BitmapLabel;
    private imgDuan: eui.BitmapLabel;
    private anim_grp: eui.Group;
    private ani: eui.Group;
    private titleName: eui.Label;
    private curName: eui.Label;
    private nextName: eui.Label;
    private powerBar: PowerBar;
    private itemName1: eui.Label;
    private itemName2: eui.Label;
    private curZhuanTitle: eui.Label;
    private btn_tuPo: eui.Button;
    private curPro: eui.Group;
    private nextPro: eui.Group;
    private curZhuanPro: eui.Label;
    private item_icon2: eui.Image;
    private item_icon1: eui.Image;
    private desc1: eui.Label;
    private desc2: eui.Label;
    private curr_coatard_name: eui.Image;
    private coatard_exp_pro: eui.ProgressBar;
    private func_btn_grp: eui.Group;
    private scroll: eui.Scroller;
    private itemsGrp: eui.Group;
    private btn_coatard: eui.Button;
    private next_open_desc: eui.Label;
    private itemsDict;
    private curr_coatardLv: number;
    private zhuanshengDict;
    private reward_grp: eui.Group;
    private progress2: eui.ProgressBar;
    private progress1: eui.ProgressBar;
    private item1: GoodsInstance;
    private item2: GoodsInstance;
    private label_r: eui.Label;
    private titlePower: eui.Label;
    private label_get: eui.Label;
    protected points: redPoint[] = RedPointManager.createPoint(1);

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ZhuanShengPanelSkin;
    }
    protected onInit(): void {
        this.zhuanshengDict = JsonModelManager.instance.getModelzhuansheng();
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_tuPo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTuPo, this);
        this.item_icon1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoBtn, this);
        //   this.item_icon2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        // GameDispatcher.getInstance().addEventListener(MESSAGE_ID.REBIRTH_TASK_INIT_MSG.toString(), this.onRefresh, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onReciveStateMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onReciveStateMsg, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.item_icon1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btn_tuPo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTuPo, this);
        this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoBtn, this);
        // GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.REBIRTH_TASK_INIT_MSG.toString(), this.onRefresh, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onReciveStateMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onReciveStateMsg, this);
    }
    protected onRefresh(): void {
        this.onShowInfo();
    }
    private onReciveStateMsg(event: GameMessageEvent): void {
        this.onRefresh();
    }
    /**更新开启功能**/
    private onShowInfo(): void {
        var zsCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.playerData.zhuanshengID];
        var curZhuanShengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.playerData.zhuanshengID];
        this.imgZhuan.text = zsCfg.zhuansheng + '';
        this.imgDuan.text = zsCfg.duanwei + '';
        this.curPro.removeChildren();
        this.nextPro.removeChildren();
        var nextDuanCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.playerData.zhuanshengID + 1];
        if (!curZhuanShengCfg) {
            this.next_open_desc.text = Language.instance.getText("full_level_3");
        } else {
            var proStrAry: string[];
            if (curZhuanShengCfg.duanweiShuxing.indexOf("#") >= 0) {
                proStrAry = curZhuanShengCfg.duanweiShuxing.split("#");
            }
            var proStrAry1: string[];
            if (nextDuanCfg.duanweiShuxing.indexOf("#") >= 0) {
                proStrAry1 = nextDuanCfg.duanweiShuxing.split("#");
            }
            var proNum: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var attributeItem: AttributesText;
            for (var i: number = 0; i < proStrAry.length; i++) {
                var proStr: string[] = proStrAry[i].split(",");
                attributeItem = new AttributesText();
                attributeItem.updateAttr(i, proStr[1]);
                this.curPro.addChild(attributeItem);

                var proStr1: string[] = proStrAry1[i].split(",");
                attributeItem = new AttributesText();
                attributeItem.updateAttr(i, proStr1[1]);
                this.nextPro.addChild(attributeItem);
                proNum[i] = Number(proStr[1])
            }
            this.powerBar.power = GameCommon.calculationFighting(proNum);
        }

        var zhuanNum: number = nextDuanCfg.zhuansheng;

        if (nextDuanCfg.zhuanshengRewards == '') {
            for (var i: number = 1; i < 10; i++) {
                var modelCfg = JsonModelManager.instance.getModelzhuansheng()[this.playerData.zhuanshengID + i];
                if (modelCfg.zhuanshengRewards != '') {
                    var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(modelCfg.zhuanshengRewards);
                    var modelChenghao: Modelchenghao;
                    var chenghaomodels = JsonModelManager.instance.getModelchenghao();
                    for (let k in chenghaomodels) {
                        if (chenghaomodels[k].type == 1) {
                            var modelTitle: Modelchenghao = chenghaomodels[k];
                            if (modelTitle.cost.id == awards[0].id) {
                                modelChenghao = modelTitle;
                            }
                        }

                    }
                    this.titleName.text = modelChenghao.name;
                    this.titlePower.text = '战力:' + GameCommon.calculationFighting(modelChenghao.attrAry) + '';
                    if (!this.anim) {
                        this.anim = new TitleBody(modelChenghao);
                        this.anim.scaleX = 1.2;
                        this.anim.scaleY = 1.2;
                        this.ani.addChild(this.anim);
                    } else {
                        this.anim.onupdate(modelChenghao);
                    }

                    zhuanNum = nextDuanCfg.zhuansheng;
                    break;
                }
            }
        }
        else {
            var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(nextDuanCfg.zhuanshengRewards);
            var modelChenghao: Modelchenghao;
            var chenghaomodels = JsonModelManager.instance.getModelchenghao();
            for (let k in chenghaomodels) {
                if (chenghaomodels[k].type == 1) {
                    var modelTitle: Modelchenghao = chenghaomodels[k];
                    if (modelTitle.cost.id == awards[0].id) {
                        modelChenghao = modelTitle;
                    }
                }
            }
            this.titleName.text = modelChenghao.name;
            this.titlePower.text = '战力:' + GameCommon.calculationFighting(modelChenghao.attrAry) + '';
            if (!this.anim) {
                this.anim = new TitleBody(modelChenghao);
                this.anim.scaleX = 1.2;
                this.anim.scaleY = 1.2;
                this.ani.addChild(this.anim);
            } else {
                this.anim.onupdate(modelChenghao);
            }

            zhuanNum = nextDuanCfg.zhuansheng;
        }
        // var str1: string = '';
        // str1 = '人物全属性+' + (GameDefine.ZHUANSHENG_PLUS[zhuanNum] / 100).toFixed(0) + '%\n';
        // this.curZhuanPro.text = str1;
        var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(nextDuanCfg.duanweiRewards);
        if (awards) {
            this.label_r.text = awards[0].num + '';
        }
        if (nextDuanCfg.tiaojianGuanqia == 0) {
            this.progress1.maximum = nextDuanCfg.tiaojianLv;
            this.progress1.value = DataManager.getInstance().playerManager.player.level;
            this.desc1.text = '达到' + nextDuanCfg.tiaojianLv + '级';
        }
        else {
            this.progress1.maximum = nextDuanCfg.tiaojianGuanqia;
            this.progress1.value = GameFight.getInstance().yewai_waveIndex;
            this.desc1.text = '关卡达到' + nextDuanCfg.tiaojianGuanqia + '关';
        }

    }
    private anim: TitleBody;
    private zhuanshengId: number = 0;
    private zhuanshengId1: number = 0;
    private _item: AwardItem;
    public onTouch(event: egret.TouchEvent): void {
        if (this._item.type == GOODS_TYPE.SHOW) return;
        var base;
        var tipsType: number;
        if (this._item.type == GOODS_TYPE.MASTER_EQUIP || this._item.type == GOODS_TYPE.SERVANT_EQUIP) {
            base = new EquipThing(this._item.type);
            base.onupdate(this._item.id, this._item.quality, 0);
            tipsType = INTRODUCE_TYPE.EQUIP;
        } else {
            base = new ThingBase(this._item.type);
            base.onupdate(this._item.id, this._item.quality, 0);
            tipsType = INTRODUCE_TYPE.IMG;
        }
        {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("ItemIntroducebar",
                    new IntroduceBarParam(tipsType, this._item.type, base, 0)
                )
            );
        }
    }
    /**转生突破**/
    private onTouchBtnTuPo(): void {
        let upcoatardlvMsg: Message = new Message(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(upcoatardlvMsg);
    }
    private onGotoBtn(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_PVE);
    }
    private get playerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    public trigger(): void {
        this.points[0].checkPoint();
    }
    private onCheckPoint1(): boolean {
        return this.btn_coatard.enabled;
    }
    //The end
}