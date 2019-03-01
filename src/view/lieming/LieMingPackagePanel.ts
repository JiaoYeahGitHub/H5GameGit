class LieMingPackagePanel extends BaseWindowPanel {
    private itemGroup: eui.List;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private closeBtn1: eui.Button;
    private tp: number;
    private param: LieMingData;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    public onShowWithParam(param): void {
        // this.allotParam = param as UnionAllotParam1;
        this.param = param;

        this.onShow();
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingPackageSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
        this.itemGroup.itemRenderer = LieMingItemRenderer;
        this.itemGroup.itemRendererSkinName = skins.LieMingItemSkin;
        this.itemGroup.useVirtualLayout = true;
    }
    protected onRegist(): void {
        super.onRegist();

        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_DOWN.toString(), this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_ACTIVE_MESSAGE.toString(), this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_DOWN.toString(), this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_ACTIVE_MESSAGE.toString(), this.onHide, this);
    }
    protected onRefresh(): void {
        this.itemGroup.dataProvider = null;
        // this.itemGroup.removeDataProviderListener();
        this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
    }
    private onTouch(): void {
        this.onHide();
    }
    //获取对应标签的数据结构
    private rewardArr: Array<MingGeItem> = new Array<MingGeItem>();
    private get models(): MingGeItem[] {
        this.rewardArr = [];
        var models: Modelmingge[];
        models = JsonModelManager.instance.getModelmingge()
        var i = 0;
        var fates: FateBase[] = DataManager.getInstance().playerManager.player.fates;
        if (this.param.from == 'lvUp') {
            for (let k in fates) {
                if (fates[k]) {
                    this.rewardArr[i] = new MingGeItem(models[fates[k].modelID], this.param, fates[k])
                    i = i + 1;
                }

            }

            var fateThings: FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
            for (let k in fateThings) {
                if (fateThings[k].modelID > 0) {

                    this.rewardArr[i] = new MingGeItem(models[fateThings[k].modelID], new LieMingData(3, this.param.solt - 1, 'isEquip'), fateThings[k])
                    i = i + 1;
                }
            }
        }
        else if (this.param.from == 'tihuan') {
            var fateThings: FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;



            for (let k in fates) {
                if (fates[k] && this.isEquip(Tool.toInt((this.param.solt - 1) / 7), fates[k].modelID, this.param.solt - 1, fates[k].lv, true)) {
                    this.rewardArr[i] = new MingGeItem(models[fates[k].modelID], new LieMingData(1, this.param.solt - 1, 'equip'), fates[k])
                    i = i + 1;
                }
            }
        }
        else {

            for (let k in fates) {
                if (fates[k] && this.isEquip(Tool.toInt((this.param.solt - 1) / 7), fates[k].modelID, this.param.solt - 1, 0, false)) {
                    this.rewardArr[i] = new MingGeItem(models[fates[k].modelID], this.param, fates[k])
                    i = i + 1;
                }
            }
        }
        return this.rewardArr;
    }

    public isEquip(index: number, id: number, slot: number, lv: number, isFight: boolean): Boolean {
        var fateThings: FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
        var curCfg = JsonModelManager.instance.getModelmingge()[id];

        // if(isFight)
        // {
        //      let curPower = DataManager.getInstance().fateManager.getOnePsychByID(fateThings[slot].modelID,fateThings[slot].lv)
        //     if(DataManager.getInstance().fateManager.getOnePsychByID(id,lv)<=curPower)
        //     {
        //         return false;
        //     }
        // }
        switch (index) {
            case 0:
                for (var i = 0; i < 7; i++) {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i].modelID]
                    if (cfg&&isFight) {
                            if (i != slot) {
                                for (let k in curCfg.attrAry) {
                                    if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                                        return false;
                                    }
                                }
                            }
                        // else {
                        //     for (let k in curCfg.attrAry) {
                        //         if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                        //             return false;
                        //         }
                        //     }
                        // }

                    }
                }

                break;

            case 1:
                for (var i = 0; i < 7; i++) {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i + 7].modelID]
                    if (cfg&&isFight) {
                            if (i + 7 != slot) {
                                for (let k in curCfg.attrAry) {
                                    if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                                        return false;
                                    }
                                }
                            }
                        // else {
                        //     for (let k in curCfg.attrAry) {
                        //         if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                        //             return false;
                        //         }
                        //     }
                        // }
                    }
                }

                break;

            case 2:
                for (var i = 0; i < 7; i++) {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i + 14].modelID]
                    if (cfg&&isFight) {
                            if (i + 14 != slot) {
                                for (let k in curCfg.attrAry) {
                                    if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                                        return false;
                                    }
                                }
                            }
                        // else {
                        //     for (let k in curCfg.attrAry) {
                        //         if (curCfg.attrAry[k] > 0 && cfg.attrAry[k] == curCfg.attrAry[k]) {
                        //             return false;
                        //         }
                        //     }
                        // }
                    }
                }

                break;
        }
        return true;
    }
}
class LieMingData {
    public tp: number;//展示外形
    public solt: number;
    public from: string;
    public constructor(tp: number, solt: number, from: string) {
        this.tp = tp;
        this.solt = solt;
        this.from = from;
    }
}