// TypeScript file
class RolePanel extends BaseSystemPanel {
    /**技能换肤参数**/
    public curSkill_ID: number;//当前选中的技能ID
    public curSkin_ID: number;//当前选中的皮肤ID
    public curSkinBtnIdx: number;//当前选中的按钮序号

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        var sysQueue = [];
        /**--------------主角----------------**/
        var param = new RegisterSystemParam();
        param.funcID = FUN_TYPE.FUN_ROLE;
        param.btnRes = "主角";
        param.redP = this.createRedPoint();
        param.tabBtns = [];// 三级菜单结构体数组
        param.redP.redName = 'role';

        let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
        pItem.sysName = "RoleEquipPanel";
        pItem.funcID = FUN_TYPE.FUN_EQUIP;
        pItem.tabBtnRes = "juese_shizhuang_png";
        pItem.title = '装备';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(FunDefine, "getRoleEquipPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "WuxingPanel";//五行
        pItem.funcID = FUN_TYPE.FUN_WUXING;
        pItem.tabBtnRes = "juese_wuxing_png";
        pItem.title = '五行';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(FunDefine, "getWuxingRedPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "PulsePanel";//经脉
        pItem.funcID = FUN_TYPE.FUN_PULSE;
        pItem.title = '经脉';
        pItem.tabBtnRes = "juese_tab_jingmai_png";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().pulseManager, "getCanPulseUpgrade");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "DragonSoulPanel";//龙魂
        pItem.funcID = FUN_TYPE.FUN_DRAGONSOUL;
        pItem.tabBtnRes = "juese_shenqi_png";
        pItem.title = '龙魂';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().dragonSoulManager, "checkRedPoint");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "PsychPanel";//元神
        pItem.funcID = FUN_TYPE.FUN_YUANSHEN;
        pItem.tabBtnRes = "juese_btn_yuanshen_png";
        pItem.title = '元神';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(FunDefine, "getPsychPoint");
        param.tabBtns.push(pItem);

        sysQueue.push(param);
        /**--------------技能----------------**/
        param = new RegisterSystemParam();
        param.funcID = FUN_TYPE.FUN_SKILL;
        param.btnRes = "技能";
        param.redP = this.createRedPoint();
        param.tabBtns = [];

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "SkillRolePanel";
        pItem.funcID = FUN_TYPE.FUN_SKILL;
        pItem.tabBtnRes = "skill_btn_png";
        pItem.title = '技能';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().skillManager, "checkMainSkillUp");
        param.tabBtns.push(pItem);

        pItem = new RegisterTabBtnParam();
        pItem.sysName = "SkillEnchantLevelPanel";
        pItem.funcID = FUN_TYPE.FUN_SKILL;
        pItem.tabBtnRes = "xinfashengji_png";
        pItem.title = '技能';
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().skillEnhantM, "checkSkillEnhantUplevelRed");
        param.tabBtns.push(pItem);

        // pItem = new RegisterTabBtnParam();
        // pItem.sysName = "SkillEnchantGradePanel";
        // // pItem.funcID = FUN_TYPE.FUN_SKILL;
        // pItem.tabBtnRes = "xinfajinjie_png";
        // pItem.title = '技能';
        // pItem.redP = this.createRedPoint();
        // pItem.redP.addTriggerFuc(DataManager.getInstance().skillEnhantM, "checkSkillEnhantUpGradeRed");
        // param.tabBtns.push(pItem);

        sysQueue.push(param);

        /**--------------四象----------------**/
        param = new RegisterSystemParam();
        param.btnRes = "四象";
        param.funcID = FUN_TYPE.FUN_SIXIANG;
        param.redP = this.createRedPoint();
        // param.redP.addTriggerFuc(FunDefine, "checkSixiangPoint");
        param.tabBtns = [];// 三级菜单结构体数组
        let sixiangTabImgs: Array<string> = ["z_btn_icon_qinglong_png", "z_btn_icon_baihu_png", "z_btn_icon_zhuque_png", "z_btn_icon_xuanwu_png"];
        for (let i: number = 0; i < sixiangTabImgs.length; i++) {
            pItem = new RegisterTabBtnParam();
            pItem.sysName = "SpecialEquipPanel";
            pItem.funcID = FUN_TYPE.FUN_SIXIANG;
            pItem.tabBtnRes = sixiangTabImgs[i];
            pItem.title = '四象';
            pItem.redP = this.createRedPoint();
            pItem.redP.addTriggerFuc(FunDefine, "checkSixiangUplevelBySlot", i);
            param.tabBtns.push(pItem);
        }
        sysQueue.push(param);

        /**--------------图鉴----------------**/
        param = new RegisterSystemParam();
        param.btnRes = "图鉴";
        param.redP = this.createRedPoint();
        param.tabBtns = [];
        let tujianTabImgs: Array<string> = ["sanguoyanyi_png", "shuihuzhuan_png", "xiyouji_png", "hongloumeng_png", "qunxiazhuan_png"];
        for (let i: number = 0; i < tujianTabImgs.length; i++) {
            pItem = new RegisterTabBtnParam();
            pItem.sysName = "TuJianPanel";
            pItem.tabBtnRes = tujianTabImgs[i];
            pItem.title = '图鉴';
            pItem.redP = this.createRedPoint();
            pItem.redP.addTriggerFuc(FunDefine, "checkTujianRedPointByType", i);
            param.tabBtns.push(pItem);
        }
        sysQueue.push(param);

        /**--------------称号----------------**/
        param = new RegisterSystemParam();
        param.sysName = "RoleTitlePanel";
        param.funcID = FUN_TYPE.FUN_TITLE;
        param.btnRes = "称号";
        param.tabBtns = [];
        param.redP = this.createRedPoint();
        let titleTabs: Array<string> = ["z_btn_title_cb_png", "z_btn_title_zs_png", "z_btn_title_act_png"];
        for (let i: number = 0; i < titleTabs.length; i++) {
            pItem = new RegisterTabBtnParam();
            pItem.sysName = "RoleTitlePanel";
            pItem.tabBtnRes = titleTabs[i];
            pItem.title = '称号';
            pItem.redP = this.createRedPoint();
            pItem.redP.addTriggerFuc(DataManager.getInstance().titleManager, "getTitlePoint", i);
            param.tabBtns.push(pItem);
        }
        param.redP.addTriggerFuc(DataManager.getInstance().titleManager, "getTitlePoint", 4);
        sysQueue.push(param);

        this.registerPage(sysQueue, "roleGrp", GameDefine.RED_TAB_POS);

        // var img: eui.Image = new eui.Image();
        // img.source = "activity_chongbang_png";
        // this.basic["tipsLayer"].visible = false;
        // this.basic["tipsLayer"].addChild(img);
        super.onInit();
        this.onRefresh();
    }

    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onRefresh(): void {
        super.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.checkActivity();
    }
    private checkActivity() {
        var model: Modeldabiaorewards = DataManager.getInstance().newactivitysManager.dabiao_model;
        if (model) {
            if (model.type == 11 && this.tabs[3].enabled == true) {
                this.basic["tipsLayer"].visible = true;
                this.basic["tipsLayer"].x = 101 * 3;
            } else if (model.type == 12 && this.tabs[2].enabled == true) {
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
    //The end
}
//选择人物栏
class RoleSelectBar extends eui.Component {
    private _isInit: Boolean = false;
    private _index: number;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.RoleSelectBarSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
    }
    private onLoadComplete(): void {
    }
    private onShow(): void {
        if (!this._isInit) {
            this._isInit = true;
            for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
                this["roleHeadBorder" + i].name = "" + i;
            }
            this.onChange(0);
        }
        this.onRegist();
        this.onRefresh();
    }
    //更新槽位对应的角色信息
    private onRefreshHeadInfo(index: number, occupation: number): void {
        if (occupation < 0) {
            (this["head_icon" + index] as eui.Image).source = "";
            (this["race_name_icon" + index] as eui.Image).source = "";
            this["label_name" + index].text = "";
        } else {
            // (this["head_icon" + index] as eui.Image).source = GameCommon.getInstance().getHeadIconByIndex(occupation);
            (this["race_name_icon" + index] as eui.Image).source = GameCommon.getInstance().getOccpationIcon(occupation);
            this["label_name" + index].text = GameCommon.Occupation_RoleName(occupation);
        }
    }

    //注册一个点击回调
    private _callBack;
    private _backObj;
    public registFuncBack(callback, backobj): void {
        this._callBack = callback;
        this._backObj = backobj;
    }
    //启动关闭点击选择
    // private _enableTouch: boolean = true;
    // public set enableTouch(bool: boolean) {
    //     this._enableTouch = bool;
    // }
    private onRegist(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPEN_PLAYER_MESSAGE.toString(), this.onRefresh, this);
        for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
            this["roleHeadBorder" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHeadBorder, this);
        }
    }
    private onRemove(): void {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPEN_PLAYER_MESSAGE.toString(), this.onRefresh, this);
        for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
            this["roleHeadBorder" + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHeadBorder, this);
        }
    }
    public getHeadGroup(playerIndex: number): eui.Group {
        return this["roleHeadBorder" + playerIndex];
    }
    public onRefresh(): void {
        if (this.isSelf) {
            this.updateOpenRoleList();
        }
    }
    //更新角色开启列表
    private updateOpenRoleList(): void {
        var player: Player = DataManager.getInstance().playerManager.player;
        for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
            var playerData: PlayerData = player.getPlayerData(i);
            if (playerData) {
                this["unopen_group" + i].visible = false;
                // this["race_name_icon" + i].visible = true;
                this["redpoint" + i].visible = false;
            } else {
                this["unopen_group" + i].visible = true;
                // this["race_name_icon" + i].visible = false;
                if (player.onCheckRoleCanOpen(i)) {
                    this["unopen_label" + i].text = "点击开启";
                    this["redpoint" + i].visible = true;
                }
                else {
                    this["unopen_label" + i].text = '';//GameDefine.Open_Role_Desc[i];
                    this["redpoint" + i].visible = false;
                }
            }
            this.onRefreshHeadInfo(i, playerData ? playerData.occupation : -1);
        }
    }
    //将组件设置成非当前玩家的 0重置成自己的 大于0其他玩家
    private otherNum: number = 0;
    public registOtherBar(roleOccps: number[]): void {
        this.otherNum = roleOccps.length;
        if (this.otherNum > 0) {
            for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
                this["redpoint" + i].visible = false;
                if (this.otherNum > i) {
                    this["unopen_group" + i].visible = false;
                    this.onRefreshHeadInfo(i, roleOccps[i]);
                } else {
                    this["unopen_group" + i].visible = true;
                    this["unopen_label" + i].text = "未开启";
                    this.onRefreshHeadInfo(i, -1);
                }
            }
        }
    }
    //点击打开开启角色
    private showOpenRolePanel(): void {
        if (this.isSelf) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ActivateRolePanel");
        }
    }
    //切换选择角色
    private onTouchHeadBorder(event: egret.Event): void {
        // if (!this._enableTouch)
        //     return;
        var selectedIndex: number = parseInt(event.currentTarget.name);
        if (this.isSelf) {
            if (!DataManager.getInstance().playerManager.player.getPlayerData(selectedIndex)) {
                this.showOpenRolePanel();
            } else {
                this.onChange(selectedIndex);
            }
        } else {
            if (this.otherNum > selectedIndex) {
                this.onChange(selectedIndex);
            }
        }
    }
    private onChange(selectedIndex: number, isCall: boolean = true): void {
        if (selectedIndex != this._index) {
            for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
                this["selectedImg" + i].visible = false;
            }
            this._index = selectedIndex;
            this["selectedImg" + this._index].visible = true;
            if (this._callBack && this._backObj && isCall) {
                Tool.callback(this._callBack, this._backObj);
            }
        }
    }
    //获取当前选中的序号
    public get index(): number {
        return this._index;
    }
    //设置选择的标签
    public set index(index: number) {
        this.onChange(index);
    }
    private onHide(): void {
        this.onRemove();
    }
    //是不是自己
    private get isSelf(): boolean {
        return this.otherNum == 0;
    }
    //The end
}