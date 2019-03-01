class SevenDayCarnivalPanel extends BaseWindowPanel {
    public static index: number = 0;
    private tab: number = 0;
    public awardLayer: eui.Group;
    public itemLayer: eui.Group;
    public tabs: eui.RadioButton[];
    public tabTitles: eui.Label[];
    public tab_days: eui.RadioButton[];
    public bmt_days: eui.BitmapLabel[];
    private btn_sevDayLogin: eui.Button;
    private objectiveBar: eui.Scroller;
    private label_endTime: eui.Label;
    private img_banner: eui.Image;
    private img_loginAward: eui.Image;
    private img_getEd: eui.Image;
    private img_pointLogin: eui.Image;
    private img_pointTab1: eui.Image;
    private img_pointTab2: eui.Image;
    private img_pointTab3: eui.Image;
    private img_pointTab4: eui.Image;
    private img_pointDay1: eui.Image;
    private img_pointDay2: eui.Image;
    private img_pointDay3: eui.Image;
    private img_pointDay4: eui.Image;
    private img_pointDay5: eui.Image;
    private img_pointDay6: eui.Image;
    private img_pointDay7: eui.Image;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SevenDayCarnivalPanelSkin;
    }
    protected onInit(): void {
        this.basic["closeBtn1"].y = 20;
        this.img_getEd.visible = false;
        var i: number = 0;
        this.tabs = [];
        this.tabTitles = [];
        for (i = 0; i < 4; i++) {
            this.tabs.push(this["tab_" + i]);
            this.tabTitles.push(this["label_tab" + i]);
        }
        this.tab_days = [];
        this.bmt_days = [];
        for (i = 0; i < 7; i++) {
            this.tab_days.push(this["tab_day" + i]);
            this.bmt_days.push(this["bmt_day" + i]);
        }
        SevenDayCarnivalPanel.index = DataManager.getInstance().sevenDayCarnivalManager.today - 1;
        if (SevenDayCarnivalPanel.index > 6)
            SevenDayCarnivalPanel.index = 6;
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        // this.chageHierarchy(this.tab);
        this.showTabstate();
        this.onShowInfo();
        this.onShowPoint();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sevDayLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSevDayLogin, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAY_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAYLOGIN_AWARD_RECEIVE.toString(), this.onReceiveLogin, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAYOBJECTIVE_AWARD_RECEIVE.toString(), this.onReceiveObjective, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SEVDAY_CLOSE, this.onHide, this);
        var i: number = 0;
        for (i = 0; i < 4; i++) {
            this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabs, this);
        }
        for (i = 0; i < 7; i++) {
            this.tab_days[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabDays, this);
        }
        this.getMessage();
        Tool.addTimer(this.onCountDown, this, 1000);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_sevDayLogin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSevDayLogin, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAY_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAYLOGIN_AWARD_RECEIVE.toString(), this.onReceiveLogin, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_SEVDAYOBJECTIVE_AWARD_RECEIVE.toString(), this.onReceiveObjective, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SEVDAY_CLOSE, this.onHide, this);
        var i: number = 0;
        for (i = 0; i < 4; i++) {
            this.tabs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabs, this);
        }
        for (i = 0; i < 7; i++) {
            this.tab_days[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabDays, this);
        }
        Tool.removeTimer(this.onCountDown, this, 1000);
    }
    public onCountDown() {
        var time: number = DataManager.getInstance().sevenDayCarnivalManager.getCountDown();
        if (time > 0) {
        } else {
            time = 0;
            // DataManager.getInstance().activityManager._activityInfoList[1].isOpen = false;
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
        this.onShowCD(time);
        // Tool.log(time);
    }
    public onShowCD(time: number) {
        this.label_endTime.text = "任务截止时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }
    private getMessage() {
        var message = new Message(MESSAGE_ID.ACTIVITY_SEVDAY_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onRefreshList() {
        // var i: number = 0;
        // var item: SevDayObjectiveItem;
        // for (i = this.itemLayer.numChildren - 1; i >= 0; i--) {
        //     item = this.itemLayer.getChildAt(i) as SevDayObjectiveItem;
        //     item.onUpdate();
        // }
    }
    private onTouchSevDayLogin() {
        var message = new Message(MESSAGE_ID.ACTIVITY_SEVDAYLOGIN_AWARD_RECEIVE);
        message.setByte(SevenDayCarnivalPanel.index + 1);
        GameCommon.getInstance().sendMsgToServer(message);
        var base: SevDayLoginBase = DataManager.getInstance().sevenDayCarnivalManager.sevDayLogin[SevenDayCarnivalPanel.index + 1];
        base.state = 2;
    }
    private onShowInfo() {
        this.onShowTabTitle();
        this.onShowSevDaySignInfo();
        this.onShowSevDayObjectiveInfo();
    }
    private onTouchTabs(e: egret.TouchEvent) {
        this.tab = parseInt((<eui.RadioButton>e.target).value);
        this.objectiveBar.stopAnimation();
        this.onShowSevDayObjectiveInfo();
    }
    //改变层级
    private chageHierarchy(tab: number) {
        // for (var i: number = 0; i < 4; i++) {
        //       this.tabs[this.tab]
        // }
    }
    private onTouchTabDays(e: egret.TouchEvent) {
        SevenDayCarnivalPanel.index = parseInt((<eui.RadioButton>e.target).value);
        this.objectiveBar.stopAnimation();
        this.onShowInfo();
        this.onShowPoint();
    }
    //显示按钮状态
    private showTabstate() {
        var index: number = (SevenDayCarnivalPanel.index + 1);
        var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
        this.tabs[this.tab].selected = true;
        if (SevenDayCarnivalPanel.index >= this.tab_days.length)
            return;
        this.tab_days[SevenDayCarnivalPanel.index].selected = true;
        var btn: eui.RadioButton;
        var bmt: eui.BitmapLabel;
        for (var i: number = 0; i < this.bmt_days.length; i++) {
            bmt = this.bmt_days[i];
            if (today < (parseInt(bmt.text))) {
                bmt.font = "sevDayGrayFont_fnt";
            } else {
                bmt.font = "tiantiFont_fnt";
            }
        }
    }
    //显示tab按钮标题
    private onShowTabTitle() {
        var item: SevDayObjectiveItem;
        var info = DataManager.getInstance().sevenDayCarnivalManager.getCurrDayInfo(SevenDayCarnivalPanel.index + 1);
        for (var i: number = 0; i < 4; i++) {
            item = info[i][0];
            if (!item)
                break;
            this.tabTitles[i].text = item.name;
        }
    }
    private onReceiveLogin() {
        this.onShowSevDaySignInfo();
        this.onShowPoint();
    }
    private onReceiveObjective() {
        this.onShowSevDayObjectiveInfo();
        this.onShowPoint();
    }
    //显示七日登录奖励
    private onShowSevDaySignInfo() {
        var award: AwardItem;
        var instance: GoodsInstance;
        // var model: ModelSevDayLogin = ModelManager.getInstance().modelSevDayLogin[(SevenDayCarnivalPanel.index + 1)];
        // if (!model)
        //     return;
        // var data = model.rewards;
        // this.awardLayer.removeChildren();
        // this.img_pointLogin.visible = false;
        // for (var i: number = 0; i < data.length; i++) {
        //     award = data[i];
        //     instance = new GoodsInstance();
        //     instance.scaleX = instance.scaleY = 0.8;
        //     instance.onUpdate(award.type, award.id, 0, award.quality, award.num);
        //     this.awardLayer.addChild(instance);
        // }
        // var base: SevDayLoginBase = DataManager.getInstance().sevenDayCarnivalManager.sevDayLogin[SevenDayCarnivalPanel.index + 1];
        // if (base) {
        //     if (base.state == 2) {//已领取
        //         this.btn_sevDayLogin.label = "已领取";
        //         GameCommon.getInstance().onButtonEnable(this.btn_sevDayLogin, false);
        //     } else {
        //         this.btn_sevDayLogin.label = "领取";
        //         this.img_pointLogin.visible = true;
        //         GameCommon.getInstance().onButtonEnable(this.btn_sevDayLogin, true);
        //     }
        // } else {
        //     this.btn_sevDayLogin.label = "领取";
        //     GameCommon.getInstance().onButtonEnable(this.btn_sevDayLogin, false);
        // }
        var index: number = (SevenDayCarnivalPanel.index + 1);
        var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
        this.img_getEd.visible = false;
        if (index == 1) {
            this.img_banner.source = "sevDay_banner_1_jpg";
            if (today > 1) {
                GameCommon.getInstance().onImgSetGray(this.img_banner, true);
                this.img_getEd.visible = true;
            } else {
                GameCommon.getInstance().onImgSetGray(this.img_banner, false);
            }
        } else if (index == 2) {
            this.img_banner.source = "sevDay_banner_5_jpg";
            if (today > 2) {
                GameCommon.getInstance().onImgSetGray(this.img_banner, true);
                this.img_getEd.visible = true;
            } else {
                GameCommon.getInstance().onImgSetGray(this.img_banner, false);
            }
        } else if (index >= 3 && index <= 7) {
            this.img_banner.source = "sevDay_banner_7_jpg";
            if (today > 7) {
                GameCommon.getInstance().onImgSetGray(this.img_banner, true);
                this.img_getEd.visible = true;
            } else {
                GameCommon.getInstance().onImgSetGray(this.img_banner, false);
            }
        }
        this.img_loginAward.source = "sevDay_bmt_dljl" + index + "_png";

    }
    private onShowPoint() {
        this.showLoginRedPoint();
        this.showTabRedPoint();
    }
    private showLoginRedPoint() {
        this.img_pointLogin.visible = DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainLoginByDay(SevenDayCarnivalPanel.index + 1);
    }
    //显示七日目标
    private onShowSevDayObjectiveInfo() {
        var i: number = 0;
        var model;
        var item: SevDayObjectiveItem;
        var info = DataManager.getInstance().sevenDayCarnivalManager.getCurrDayInfo(SevenDayCarnivalPanel.index + 1);
        var infoTab = info[this.tab].concat();
        var index: number = (SevenDayCarnivalPanel.index + 1);
        var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
        model = infoTab[0];
        if (!model)
            return;
        var base: SevDayObjectivebase = DataManager.getInstance().sevenDayCarnivalManager.sevDayObjective[model.key];
        if (today >= index && base) {
            for (i = 0; i < infoTab.length; i++) {
                model = infoTab[i];
                model.sortKey = i;
                if (GameCommon.getInstance().getBit2BooleanValue(base.getNum, model.level)) {//领取
                    model.sortKey += 10000;
                } else {//未领取
                    if (base.getNum < model.param) {
                        model.sortKey += 100;
                    }
                }
            }
            infoTab = infoTab.sort((n1, n2) => {
                if (n1.sortKey < n2.sortKey) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }

        for (i = this.itemLayer.numChildren - 1; i >= 0; i--) {
            item = this.itemLayer.getChildAt(i) as SevDayObjectiveItem;
            item.onDestroy();
            this.itemLayer.removeChildAt(i);
        }
        this.itemLayer.removeChildren();
        for (i = 0; i < infoTab.length; i++) {
            item = new SevDayObjectiveItem();
            item.data = infoTab[i];
            this.itemLayer.addChild(item);
        }
        this.adjustBar();
        // setTimeout(this.adjustBar.bind(this), 60);
    }
    private showTabRedPoint() {
        var info = DataManager.getInstance().sevenDayCarnivalManager.getCurrDayInfo(SevenDayCarnivalPanel.index + 1);
        for (var i: number = 0; i < info.length; i++) {
            this["img_pointTab" + (i + 1)].visible = DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainOneDayByTab(info[i], SevenDayCarnivalPanel.index + 1);
        }
    }

    private adjustBar() {
        this.objectiveBar.viewport.scrollV = 0;
    }
    public onHide(): void {
        super.onHide();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
    }
}
class SevDayObjectiveItem extends eui.Component {
    private _data;
    public awardLayer: eui.Group;
    public label_progress: eui.Label;
    public btn_receive: eui.Button;
    public constructor() {
        super();
        // this.skinName = skins.SevDayObjectiveItemSkin;
        this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnReceive, this);
    }
    public set data(da) {
        this._data = da;
        this.onUpdate();
    }
    public get data() {
        return this._data;
    }
    public onUpdate() {
        var award: AwardItem;
        var instance: GoodsInstance;
        var awards = this._data.rewardList;
        this.awardLayer.removeChildren();
        for (var i: number = 0; i < awards.length; i++) {
            award = awards[i];
            instance = new GoodsInstance();
            instance.scaleX = instance.scaleY = 0.8;
            instance.onUpdate(award.type, award.id, 0, award.quality, award.num);
            this.awardLayer.addChild(instance);
        }
        var currNum: number = 0;
        var base: SevDayObjectivebase = DataManager.getInstance().sevenDayCarnivalManager.sevDayObjective[this._data.key];
        this.btn_receive.visible = true;
        var index: number = (SevenDayCarnivalPanel.index + 1);
        var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
        if (base && today >= index) {
            currNum = base.currNum;
            this.btn_receive.skinName = skins.Common_ButtonSkin;
            if (GameCommon.getInstance().getBit2BooleanValue(base.getNum, this._data.level)) {//已领取
                this.btn_receive.label = "已领取";
                GameCommon.getInstance().onButtonEnable(this.btn_receive, false);
            } else {
                if (base.currNum >= this._data.param) {
                    this.btn_receive.label = "领取";
                    GameCommon.getInstance().onButtonEnable(this.btn_receive, true);
                } else {
                    this.btn_receive.skinName = skins.Common_ButtonSkin;
                    this.btn_receive.label = "前往";
                    GameCommon.getInstance().onButtonEnable(this.btn_receive, true);
                    if (this._data.goType == 0) {
                        this.btn_receive.visible = false;
                    }
                }
            }
        } else {
            this.btn_receive.skinName = skins.Common_ButtonSkin;
            this.btn_receive.label = "前往";
            if (DataManager.getInstance().sevenDayCarnivalManager.today >= this._data.day) {
                GameCommon.getInstance().onButtonEnable(this.btn_receive, true);
            } else {
                GameCommon.getInstance().onButtonEnable(this.btn_receive, false);
            }
            if (this._data.goType == 0) {
                this.btn_receive.visible = false;
            }
        }
        this.label_progress.text = this._data.desc + "(" + currNum + "/" + this._data.param + ")";
    }
    private onTouchBtnReceive(e: egret.TouchEvent) {
        var btn: eui.Button = e.target;
        if (btn.label == "前往") {
            // if (!FunDefine.isFunOpenByGoType(this._data.goType)) {
            //     var model: ModelOpenfunc;
            //     var data = ModelManager.getInstance().modelOpenfunc;
            //     for (var key in data) {
            //         model = data[key];
            //         if (model.goType == this._data.goType) {
            //             GameCommon.getInstance().addAlert(model.level + "级开启");
            //             break;
            //         }
            //     }
            //     return;
            // }

            // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SEVDAY_CLOSE));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this._data.goType);
        } else if (btn.label == "领取") {
            var message = new Message(MESSAGE_ID.ACTIVITY_SEVDAYOBJECTIVE_AWARD_RECEIVE);
            message.setShort(this._data.key);
            message.setByte(this._data.level);
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }
    public onDestroy() {
        this.btn_receive.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnReceive, this);
    }
}