class ForgePanel extends BaseSystemPanel {
    protected funcID: number = FUN_TYPE.FUN_QIANGHUA;

    private time: egret.Timer;
    private _isReset: boolean = false;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        // 锻造 二级菜单结构体
        var param = new RegisterSystemParam();
        param.btnRes = "锻造";
        param.redP = this.createRedPoint();
        //param.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "getIntensifyPointShow");
        param.tabBtns = [];// 三级菜单结构体数组

        let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
        pItem.sysName = "IntensifyPanel";
        pItem.funcID = FUN_TYPE.FUN_QIANGHUA;
        pItem.tabBtnRes = "z_btn_icon_qianghua_png";
        pItem.title = "强化";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "getIntensifyPointShow");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "InfusePanel";
        pItem.funcID = FUN_TYPE.FUN_ZHULING;
        pItem.tabBtnRes = "z_btn_icon_zhuling_png";
        pItem.title = "注灵";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "getInfusePointShow");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "GemInlayPanel";
        pItem.funcID = FUN_TYPE.FUN_BAOSHI;
        pItem.tabBtnRes = "z_btn_icon_baoshi_png";
        pItem.title = "宝石";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "getGemPointShow");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "ZhuHunPanel";
        pItem.funcID = FUN_TYPE.FUN_LIANHUA;
        pItem.tabBtnRes = "z_btn_icon_lianhua_png";
        pItem.title = "炼化";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "checkLianhuaPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "QuenchingPanel";
        pItem.funcID = FUN_TYPE.FUN_CUILIAN;
        pItem.tabBtnRes = "z_btn_icon_cuilian_png";
        pItem.title = "淬炼";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().forgeManager, "checkQuenchingPoint");
        param.tabBtns.push(pItem);
        sysQueue.push(param);

        // 仙玉
        param = new RegisterSystemParam();
        param.btnRes = "仙玉";
        param.funcID = FUN_TYPE.FUN_FIGHTSPRITE;
        param.redP = this.createRedPoint();
        //param.redP.addTriggerFuc(DataManager.getInstance().magicManager, "checkMagicUpgradePoint");
        param.tabBtns = [];

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "FSUpgradePanel";
        pItem.tabBtnRes = "z_btn_icon_levelup_png";
        pItem.title = "仙玉";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().magicManager, "checkMagicUpgradePoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "FSAdvancePanel";
        pItem.tabBtnRes = "z_btn_icon_jinjie_png";
        pItem.title = "仙玉";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().magicManager, "checkMagicAdvancePoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "FSTreasurePanel";
        pItem.tabBtnRes = "z_btn_icon_xunbao_png";
        pItem.title = "仙玉";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().magicManager, "checkMagicTurnplatePoint");
        param.tabBtns.push(pItem);
        sysQueue.push(param);

        // 战纹
        param = new RegisterSystemParam();
        param.btnRes = "战纹";
        param.funcID = FUN_TYPE.FUN_RNUES;
        param.redP = this.createRedPoint();

        param.tabBtns = [];
        pItem = new RegisterTabBtnParam();
        pItem.sysName = "ZhanWenViewPanel";
        pItem.funcID = FUN_TYPE.FUN_RNUES;
        pItem.tabBtnRes = "z_btn_icon_levelup_png";
        pItem.title = "战纹";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().bagManager, "checkAllEquipPointPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "ZhanWenComposePanel";
        pItem.tabBtnRes = "z_btn_icon_hecheng_png";
        pItem.title = "战纹";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getRnuesLvPoint");
        param.tabBtns.push(pItem);
        sysQueue.push(param);

        // 天书
        param = new RegisterSystemParam();
        param.btnRes = "天书";
        param.funcID = FUN_TYPE.FUN_TIANSHU;
        param.redP = this.createRedPoint();
        param.tabBtns = [];
        // param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckRPTianshuLevel");
        pItem = new RegisterTabBtnParam();
        pItem.sysName = "TianshuLevelUpPanel";
        pItem.funcID = FUN_TYPE.FUN_TIANSHU;
        pItem.tabBtnRes = "z_btn_icon_levelup_png";
        pItem.title = "天书";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckRPTianshuLevel");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "TianshuUpgradePanel";
        pItem.funcID = FUN_TYPE.FUN_TIANSHU_TUPO;
        pItem.tabBtnRes = "z_btn_icon_jinjie_png";
        pItem.title = "天书";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckRPTianshuGrade");
        param.tabBtns.push(pItem);

        // 元戒
        pItem = new RegisterTabBtnParam();
        pItem.sysName = "YuanJiePanel";
        pItem.tabBtnRes = "z_btn_icon_yuanjie_png";
        pItem.title = "元戒";
        pItem.funcID = FUN_TYPE.FUN_YUANJIE
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().yuanjieManager, "checkRedPoint");
        param.tabBtns.push(pItem);

        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.btnRes = "仙山";
        param.funcID = FUN_TYPE.FUN_XIANSHAN;
        param.redP = this.createRedPoint();
        param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianShanPoint");
        param.tabBtns = [];

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "XianDanDupPanel";
        pItem.title = "仙山";
        pItem.tabBtnRes = "z_btn_icon_xianshan_png";
        pItem.redP = this.createRedPoint();
        pItem.funcID = FUN_TYPE.FUN_XIANSHAN;
        pItem.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianShanPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "XianDanTabView";
        pItem.title = "仙丹";
        // pItem.funcID = 16;
        pItem.tabBtnRes = "z_btn_icon_xd0_png";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 1);
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "XianDanTabView";
        pItem.title = "仙丹";
        // pItem.funcID = 17;
        pItem.tabBtnRes = "z_btn_icon_xd1_png";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 2);
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "XianDanTabView";
        pItem.title = "仙丹";
        pItem.tabBtnRes = "z_btn_icon_xd2_png";
        pItem.redP = this.createRedPoint();
        // pItem.funcID = 18;
        pItem.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 3);
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "XianDanTabView";
        pItem.title = "仙丹";
        pItem.tabBtnRes = "z_btn_icon_xd3_png";
        pItem.redP = this.createRedPoint();
        // pItem.funcID = 19;
        pItem.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 4);
        param.tabBtns.push(pItem);
        sysQueue.push(param);
        this.registerPage(sysQueue, "forgeGrp", GameDefine.RED_TAB_POS);

        // var img: eui.Image = new eui.Image();
        // img.source = "activity_chongbang_png";
        // this.basic["tipsLayer"].visible = false;
        // this.basic["tipsLayer"].addChild(img);

        super.onInit();
        this.onRefresh();

    }
    protected onRegist(): void {
        super.onRegist();
        this.checkActivity();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    protected onRefresh(): void {
        if (this.index == 4) {
            this.setTitle('z_title_yuanjie_png');
        }
        super.onRefresh();
    }
    private checkActivity() {
        var model: Modeldabiaorewards = DataManager.getInstance().newactivitysManager.dabiao_model;
        if (model) {
            if (model.type == 14 && this.tabs[2].enabled == true) {
                this.basic["tipsLayer"].visible = true;
                this.basic["tipsLayer"].x = 101 * 2;
            } else {
                this.basic["tipsLayer"].visible = false;
            }
        }
    }
    public onHide(): void {
        super.onHide();
    }
}
class ForgeSlot extends eui.Component {
    private slot_icon_img: eui.Image;
    private info1_lab: eui.Label;
    private selectLayer: eui.Group;
    /**通用**/
    public currCircleIndex: number;
    /**自用**/
    private _slottype: MASTER_EQUIP_TYPE;
    private selectedAnim: Animation;
    public slotDI: eui.Image;
    public constructor() {
        super();
    }
    public set slotType(value: number) {
        if (this._slottype != value) {
            this._slottype = value;
            this.slot_icon_img.source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this._slottype] + "_png";
        }
    }
    public setinfo(value: number) {
        this.info1_lab.text = "+" + value;
    }
    public set selected(bl: boolean) {
        this.selectLayer.visible = bl;
        if (bl) {
            if (!this.selectedAnim) {
                this.selectedAnim = new Animation("zhuangbeixuanzhong", -1);
                this.selectedAnim.scaleX = 0.6;
                this.selectedAnim.scaleY = 0.58;
                this.selectedAnim.y = -38;
                this.selectLayer.addChild(this.selectedAnim);
            }
            this.selectedAnim.onPlay();
        } else {
            if (this.selectedAnim) {
                this.selectedAnim.onStop();
            }
        }
    }
    //The end
}
class suitAttributeItem extends BaseComp {
    private attrname_label: eui.Label;
    private attrvalue_label: eui.Label;
    private img_up: eui.Group;
    private img_bg: eui.Image;
    private param;
    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onInit, this);
    }
    protected setSkinName(): void {
        this.skinName = skins.suitAttributeItemSkin;
    }
    protected onInit() {
    }
    protected dataChanged() {
        this.param = this._data;
        this.attrname_label.text = this.param[0];
        if (this.param[2] > 0) {
            this.attrvalue_label.textFlow = [{ text: this.param[1], style: { textColor: 0x00FF00 } }];
        } else {
            this.attrvalue_label.textFlow = [{ text: this.param[1], style: { textColor: 0xFFFFFF } }];
        }
        this.onInit();
    }
    //The end
}
class ForgePosInfo {
    public posX: number;//X位置
    public posY: number;//Y位置
    public scale: number;//缩放
    public childNum: number;//层级
    public rotationNum: number;//角度
    public constructor(x: number, y: number, scale: number, childNum: number = -1, rotation = 0) {
        this.posX = x;
        this.posY = y;
        this.scale = scale;
        this.childNum = childNum;
        this.rotationNum = rotation;
    }
}