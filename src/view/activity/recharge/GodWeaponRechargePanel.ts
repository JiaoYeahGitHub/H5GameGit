class GodWeaponRechargePanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private closeBtn1: eui.Button;
    private tab_group: eui.Group;
    private coatard_exp_pro: eui.ProgressBar;
    private btn_coatard: eui.Button;
    private tabList: TujianTabItem[];
    private anim_grp: eui.Group;
    private names: String[] = [];
    private shenqi_name: eui.Label;
    private shenqiModelMap;
    private shenqi_desc: eui.Label;
    private show_label: eui.Label;
    private tab_num: number = 1;
    private shenqi_z: eui.Image;
    private shenqi_time: eui.Label;
    private red_point_img: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.GodWeaponRechargeSkin;
    }
    protected onInit(): void {
        this.shenqiModelMap = JsonModelManager.instance.getModelshenqi();
        this.tab_group.removeChildren();
        this.tabList = [];
        for (var key in this.shenqiModelMap) {
            var tab: TujianTabItem = new TujianTabItem;
            tab.type = parseInt(key);
            tab.tabFace = "shenqi_icon_" + tab.type + "_png";
            tab.name = "tab_" + tab.type;
            tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
            this.tab_group.addChild(tab);
            this.tabList.push(tab);
            var shenqiModelDataArray = this.shenqiModelMap[key];
            this.names.push(shenqiModelDataArray[1].name);
            //this.points[tab.id-1].register(tab, GameDefine.RED_MAIN_POS, FunDefine, "checkTujianRedPointByType",i);
        }
        this.coatard_exp_pro.maximum = 1000;

        super.onInit();
        this.onRefresh();
    }

    private shenqiTimeCircle() {
        if (this.currentState == 'pay') {
            let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.NEWGODGIFT);
            this.shenqi_time.text = "活动剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 2);
        }
    }
    protected onRegist(): void {
        super.onRegist();
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_coatard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.show_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquipt, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
        Tool.addTimer(this.shenqiTimeCircle, this, 1000);
    }
    protected onRemove(): void {
        super.onRemove();
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_coatard.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.anim_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        this.show_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquipt, this);
        this.anim_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onRefresh, this);
        Tool.removeTimer(this.shenqiTimeCircle, this, 1000);
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }
    protected onRefresh(): void {
        //判断当前活动
        if (DataManager.getInstance().activityManager.activity[ACTIVITY_BRANCH_TYPE.NEWGODGIFT]) {
            //活动已开启,跳转到当前活动神器tab
            var shenqiData: ShenQiData = DataManager.getInstance().newactivitysManager.shenqiData1;
            this.coatard_exp_pro.value = shenqiData.sum;
            var tabItem: TujianTabItem = this.tabList[shenqiData.round];
            tabItem.data = shenqiData;
            this.selectTab(tabItem);
        } else {
            this.selectTab(this.tabList[this.tab_num - 1]);
        }
        super.onRefresh();
    }

    private onTouchTab(e: egret.Event) {
        var tab: TujianTabItem = e.currentTarget as TujianTabItem;
        this.selectTab(tab);

    }
    private selectTab(tab: TujianTabItem) {
        this.tab_num = tab.type;
        this.currentState = "active"
        var shenqiData: ShenQiData = tab.data;
        if (shenqiData) {
            //如果活动存在
            this.currentState = "pay"
            if (shenqiData.isgoal) {
                this.currentState = "active";
                this.red_point_img.visible = DataManager.getInstance().legendManager.getCanLegendAdvance(shenqiData.round + 1);
            }
        }
        //获取当前神器状态
        var legendData: LegendData = this.getPlayerData().getLegendBase(this.tab_num);
        //如果已激活
        var lv = 1;
        if (this.getPlayerData().isLegendActive(this.tab_num)) {
            this.currentState = "upgrade";
            lv = legendData.lv;
        }
        for (var key in this.tabList) {
            if (this.tabList[key].type == tab.type) {
                this.tabList[key].tabBack = "tujian_tab_back_selected_png";
            } else {
                this.tabList[key].tabBack = "tujian_tab_back_png";
            }
        }
        //显示动画
        this.anim_grp.removeChildren();
        let anim: Animation = new Animation(`shenqi_` + tab.type);
        this.anim_grp.addChild(anim);
        //动画上下浮动
        this.onStartFloatAnim();

        var modelData: Modelshenqi = this.shenqiModelMap[tab.type][lv - 1];
        //显示描述
        this.getDesc(modelData);
        //显示战斗力
        var attr: number[] = GameCommon.getInstance().getAttributeAry();
        for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
            attr[j] += GameCommon.getInstance().getAttributeAry(modelData)[j];
        }
        var powerbar: PowerBar;
        powerbar = (this["powerbar"] as PowerBar);
        powerbar.power = (GameCommon.calculationFighting(attr) + modelData.ewaizhanli).toString();
        //显示名字
        this.shenqi_name.text = this.names[tab.type - 1] + "";
        //换描述图片
        this.shenqi_z.source = "shenqi_z" + tab.type + "_png"
    }

    private getDesc(modelData: Modelshenqi): void {
        var gailv: number = modelData.gailv;
        var xiaoguo: number = modelData.xiaoguo;
        var attack = modelData.attack;
        var hp = modelData.hp;
        var phyDef = modelData.phyDef;
        var magicDef = modelData.magicDef;
        var value: string = "";
        switch (modelData.id) {
            case 1:
                value = "每一次攻击有[#07FF00" + gailv / 100 + "]%的概率造成对方眩晕，持续[#07FF00" + xiaoguo / 1000 + "]秒\n";
                break;
            case 5:
                value = "每一次攻击有[#07FF00" + gailv / 100 + "]%的概率造成对方沉默，只能释放基础剑法持续[#07FF00" + xiaoguo / 1000 + "]秒\n";
                break;
            case 2:
                value = "死亡后自动复活，恢复最大生命值的[#07FF00" + xiaoguo / 100 + "]%\n";
                break;
            case 3:
                value = "直接忽视对方防御，对其额外造成自身攻击力[#07FF00" + xiaoguo / 100 + "]%的伤害\n";
                break;
            case 4:
                value = "增加一层护盾状态，有效吸收对方[#07FF00" + xiaoguo / 100 + "]%的伤害\n";
                break;
        }
        value = value + "生命+[#07FF00" + hp + "]\n" +
            "攻击+[#07FF00" + attack + "]\n" +
            "物防+[#07FF00" + phyDef + "]\n" +
            "法防+[#07FF00" + magicDef + "]\n";
        var str = GameCommon.getInstance().readStringToHtml(value);
        this.shenqi_desc.lineSpacing = 5;
        this.shenqi_desc.textFlow = new egret.HtmlTextParser().parser(str);
    }

    private onClick(e: egret.Event) {
        var btn: eui.Button = e.currentTarget as eui.Button;
        if (this.currentState == "pay") {
            //跳转
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
        } else if (this.currentState == "active") {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("RolePanel", 0));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LegendMainView");
        } else if (this.currentState == "upgrade") {
            var message = new Message(MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE);
            message.setByte(this.tab_num);
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }

    private moveUp: boolean;
    private flag = false;
    private start_posY: number;
    private onStartFloatAnim(): void {
        // if(this.flag)
        //    return;
        // this.flag=true;
        this.moveUp = true;
        this.start_posY = 50;
        this.anim_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    }
    private onFrame(): void {
        if (this.moveUp) {
            this.anim_grp.verticalCenter--;
            if (this.anim_grp.verticalCenter < this.start_posY - 50) {
                this.moveUp = false;
            }
        } else {
            this.anim_grp.verticalCenter++;
            if (this.anim_grp.verticalCenter > this.start_posY) {
                this.moveUp = true;
            }
        }
    }

    private onTouchEquipt() {
        var lv = 1;
        var shenqiModelData: Modelshenqi = this.shenqiModelMap[this.tab_num][lv];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar",
                new IntroduceBarParam(INTRODUCE_TYPE.SHENQI, INTRODUCE_TYPE.SHENQI, shenqiModelData)
            )
        );
    }
}