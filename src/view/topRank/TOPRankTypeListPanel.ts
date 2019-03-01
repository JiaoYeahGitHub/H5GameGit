class TOPRankTypeListPanel extends BaseTabView {
    public static tab: number = 0;
    //private showHeroBody: PlayerBody;
    // private closeBtn: eui.Button;
    private listLayer: eui.List;
    private bar: eui.Scroller;
    private tabs: eui.Group[];
    private label_myRank: eui.Label;
    private item: TopRankItem;
    private data: TopRankBase[];
    private jiaose: AppearPlayerData;
    private roleAppear: RoleAppearBody;
    private hero_show_group: eui.Group;
    private layer_left: eui.Group;
    private nulldateLab: eui.Label;
    // private mountdown_img: eui.Image;
    // private body_img: eui.Image;
    // private weapon_img: eui.Image;
    // private mountup_img: eui.Image;
    // private wing_img: eui.Image;
    private chenghaobox: eui.Group;
    private firstLayer: eui.Group;
    private data1st: TopRankBase;
    private titleBody: TitleBody;
    private rankName: eui.Label;
    public static rankTypeNames: string[] = ['战力榜', '转生榜', '战功榜', '成就榜', '飞剑榜', '神装榜', '神兵榜', '仙羽榜', '宝器榜', '宠物榜', '试炼榜'];
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TOPRankingListSkin;
    }
    protected onInit(): void {
        this.tabs = [];
        for (var i = 0; i < TOPRANK_TYPE.NUM; i++) {
            this.tabs.push(this["layer_tab" + i]);
            var slot: eui.Button = this[`layer_tab${i}`];
            slot.name = "" + i;
            (slot['iconDisplay'] as eui.Image).source = 'rankIcon_' + i + '_png';
            (slot['iconFrame'] as eui.Image).visible = false;
        }
        this.listLayer.itemRenderer = TopRankItem;
        this.listLayer.itemRendererSkinName = skins.TopRankItemSkin;
        this.listLayer.useVirtualLayout = true;
        this.bar.viewport = this.listLayer;
        this.bar.verticalScrollBar.autoVisibility = false;
        this.bar.verticalScrollBar.visible = false;

        this.roleAppear = new RoleAppearBody();
        this.hero_show_group.addChild(this.roleAppear);
        // (this['layer_tab0']['iconFrame'] as eui.Image).visible = true;
        // this.rankName.text = TOPRankTypeListPanel.rankTypeNames[0];
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        if (TOPRankTypeListPanel.tab == TOPRANK_TYPE.FIELD_PVP) {
            var message: Message = new Message(MESSAGE_ID.PAIHANGBANG_ZAOYUBANG_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);

            this.onSelected();
        } else {
            this.onSelected();
        }
    }
    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < this.tabs.length; i++) {
            this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        this.firstLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchFirst, this);
        // this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_TOPRANK_INFO_MESSAGE.toString(), this.onInfoReturn, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OTHER_MESSAGE.toString(), this.otherdate, this);//MESSAGE_ID.GAME_TOPRANK_INFO_MESSAGE
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PAIHANGBANG_ZAOYUBANG_MESSAGE.toString(), this.zaoyudate, this);
    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < this.tabs.length; i++) {
            this.tabs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        this.firstLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchFirst, this);
        // this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_TOPRANK_INFO_MESSAGE.toString(), this.onInfoReturn, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OTHER_MESSAGE.toString(), this.otherdate, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PAIHANGBANG_ZAOYUBANG_MESSAGE.toString(), this.zaoyudate, this);
    }
    private GetTopManager() {
        return DataManager.getInstance().topRankManager;
    }
    private otherdate() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherplayerDate");
    }
    private onShowMyRankInfo() {
        var rank: number = this.GetTopManager().myRanks[TOPRankTypeListPanel.tab];
        if (rank < 1 || rank == undefined) {
            this.label_myRank.text = "我的排名: 未上榜        战斗力:" + DataManager.getInstance().playerManager.player.playerTotalPower;
        } else {
            this.label_myRank.text = '我的排名: ' + rank + "        战斗力:" + DataManager.getInstance().playerManager.player.playerTotalPower;
        }
    }

    //更新外形展示
    private updateAvatarAnim(): void {
        this.roleAppear.updateAvatarAnim(this.jiaose.appears, this.jiaose.sex);
    }

    private onUpdateAvata(): void {
        if (this.chenghaobox.numChildren > 0) {
            this.chenghaobox.removeChildren();
        }
        this.hero_show_group.visible = this.jiaose ? true : false;
        if (this.jiaose) {
            // var roleAvatar: string = `r${this.jiaose.sex}`;
            // var mountResID: number = this.jiaose.appears[BLESS_TYPE.HORSE];
            // this.body_img.source = `juese_${roleAvatar}_body${this.jiaose.appears[BLESS_TYPE.CLOTHES]}_png`;
            // this.mountdown_img.source = `juese_mount${mountResID}_down_png`;
            // this.mountup_img.source = `juese_mount${mountResID}_up_png`;
            // this.weapon_img.source = `juese_${roleAvatar}_weapon${this.jiaose.appears[BLESS_TYPE.WEAPON]}_png`;
            // var wingResID: number = this.jiaose.appears[BLESS_TYPE.WING];
            // this.wing_img.source = wingResID > 0 ? `juese_wing_${wingResID}_png` : "";
            this.updateAvatarAnim();
            //TODO chengy 称号
            let titleModel: Modelchenghao = JsonModelManager.instance.getModelchenghao()[TOPRankTypeListPanel.tab + 1];
            if (!this.titleBody) {
                this.titleBody = new TitleBody(titleModel);
            } else {
                this.titleBody.onupdate(titleModel);
            }
            this.chenghaobox.addChild(this.titleBody);
            // switch (TOPRankTypeListPanel.tab) {
            //     case 1:
            //         var anim = new Animation("chenghao_1");
            //         this.chenghaobox.addChild(anim);
            //         break;
            //     case 3:
            //         // var anim = new Animation("gongfa");
            //         //     this.chenghaobox.addChild(anim);
            //         break;
            //     case 4:
            //         // var anim = new Animation("gongfa");
            //         //     this.chenghaobox.addChild(anim);
            //         break;
            //     case 5:
            //         // var anim = new Animation("gongfa");
            //         //     this.chenghaobox.addChild(anim);
            //         break;
            //     case 6:
            //         // var anim = new Animation("chenghao_6");
            //         // this.chenghaobox.addChild(anim);
            //         break;
            // }
        }
    }

    private zaoyudate() {
        this.data = DataManager.getInstance().topRankManager.zaoyuList;
        this.jiaose = DataManager.getInstance().topRankManager.outline1st[TOPRankTypeListPanel.tab];
        this.onUpdateRankListHandler();
    }

    private onInfoReturn(): void {

        if (TOPRankTypeListPanel.tab == TOPRANK_TYPE.FIELD_PVP) {
            var message: Message = new Message(MESSAGE_ID.PAIHANGBANG_ZAOYUBANG_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);
            return
        }
        this.data = DataManager.getInstance().topRankManager.getTabInfo(TOPRankTypeListPanel.tab);
        this.jiaose = DataManager.getInstance().topRankManager.outline1st[TOPRankTypeListPanel.tab];
        this.onUpdateRankListHandler();
    }

    private onUpdateRankListHandler() {
        if (!this.data || this.data.length <= 1) {
            this.layer_left.visible = false;
            this.nulldateLab.visible = true;
            this.data1st = null;
            this.item.data = null;
            if (this.data.length == 0) {
                this.jiaose = null;
                this.item.data = null;
                this.item.onInit();
                this.hero_show_group.visible = false;
                if (this.chenghaobox.numChildren > 0) {
                    this.chenghaobox.removeChildren();
                }
            }
            else {
                var data = this.data.concat();
                this.data1st = data.shift();
                this.nulldateLab.visible = false;
                this.item.data = this.data1st;
            }

        } else {
            this.layer_left.visible = true;
            var data = this.data.concat();
            this.bar.stopAnimation();
            this.bar.viewport.scrollV = 0;
            this.data1st = data.shift();
            this.nulldateLab.visible = false;
            this.item.data = this.data1st;
            this.listLayer.dataProvider = new eui.ArrayCollection(data);
        }
        this.onShowMyRankInfo();
        // this["tab" + TOPRankTypeListPanel.tab].selected = true;
        this.onUpdateAvata();
    }

    private onTouchItem(e: egret.TouchEvent): void {

        // this.cachedate.push(this.data[e.target.name]);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherplayerDate");
    }

    private onSelected() {
        for (var i = 0; i < TOPRANK_TYPE.NUM; i++) {
            var slot: eui.Button = this[`layer_tab${i}`];
            (slot['iconFrame'] as eui.Image).visible = false;
        }
        (this['layer_tab' + (TOPRankTypeListPanel.tab)]['iconFrame'] as eui.Image).visible = true;
        this.rankName.text = TOPRankTypeListPanel.rankTypeNames[TOPRankTypeListPanel.tab];
        if (!DataManager.getInstance().topRankManager.getTabInfo(TOPRankTypeListPanel.tab)) {
            this.onSendGetInfo();
        } else {
            this.onInfoReturn();
        }
    }
    private onTouchFirst(): void {
        if (!this.data1st) return;
        var message = new Message(MESSAGE_ID.OTHER_MESSAGE);
        message.setInt(this.data1st.id);
        GameCommon.getInstance().sendMsgToServer(message);
    }

    private onTouchTab(e: egret.TouchEvent) {
        var name: string = (<eui.Group>e.target).name;
        //去掉layerTab之后的
        (this['layer_tab' + (TOPRankTypeListPanel.tab)]['iconFrame'] as eui.Image).visible = false;
        TOPRankTypeListPanel.tab = parseInt(name);

        (this['layer_tab' + (TOPRankTypeListPanel.tab)]['iconFrame'] as eui.Image).visible = true;

        this.rankName.text = TOPRankTypeListPanel.rankTypeNames[TOPRankTypeListPanel.tab];
        this.onRefresh();
    }

    private getPlayer(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private getPlayerjiaoseData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData(0);
    }
    private onSendGetInfo() {
        var message: Message = new Message(MESSAGE_ID.GAME_TOPRANK_INFO_MESSAGE);
        message.setByte(TOPRankTypeListPanel.tab);
        var num: number = TOPRankTypeListPanel.tab;
        GameCommon.getInstance().sendMsgToServer(message);
    }
    public onShow(): void {
        super.onShow();
    }
}
class TopRankItem extends eui.ItemRenderer {
    private rank_img: eui.Image;
    private bmt_rank: eui.BitmapLabel;
    private label_info: eui.Label;
    private label_info1: eui.Label;
    private label_info2: eui.Label;
    private label_vip: eui.Image;
    public cachedate: TopRankBase[];
    private awardLayer: eui.Group;
    private img_title: eui.Image;
    private powerbar: PowerBar;
    private rankDi: eui.Image;
    public constructor() {
        super();
    }
    protected dataChanged(): void {
        var _data: TopRankBase = this.data as TopRankBase;
        if (!_data) {
            return;
        }
        this.currentState = 'normal';
        this.bmt_rank.visible = false;
        if (this.powerbar)
            this.powerbar.visible = false;
        if (this.rankDi)
            this.rankDi.visible = _data.rank % 2 == 0;

        switch (_data.rank) {
            case 1:
                this.rank_img.visible = true;
                this.rank_img.source = "rank_1_png";
                this.bmt_rank.visible = false;
                break;
            default:
                this.rank_img.visible = false;
                this.rank_img.source = "";
                this.bmt_rank.visible = true;
                this.bmt_rank.text = _data.rank.toString();
                break;
        }

        var arr: Array<egret.ITextElement> = new Array<egret.ITextElement>();
        this.awardLayer.visible = TOPRankTypeListPanel.tab == TOPRANK_TYPE.FIELD_PVP;
        this.img_title.visible = TOPRankTypeListPanel.tab != TOPRANK_TYPE.FIELD_PVP;
        this.label_vip.visible = (!this.awardLayer.visible || _data.rank != 1)
        switch (TOPRankTypeListPanel.tab) {
            case TOPRANK_TYPE.LEVEL:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "等级：" + this.getlevelStr(_data), style: { "textColor": 0xE2DA91 } });
                    arr.push({ text: "\n", style: {} });
                    // arr.push({ text: "战斗力：" + GameCommon.getInstance().getFormatNumberShow(_data.fightvalue), style: { "textColor": 0xE2DA91 } });
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue// GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = this.getlevelStr(_data) + " ";
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.CHENGJIU:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "成就:" + _data.info1, style: { "textColor": 0xE2DA91 } });
                    arr.push({ text: "\n", style: {} });
                    // arr.push({ text: "战斗力：" + _data.info1, style: { "textColor": 0xE2DA91 } });
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue// GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = _data.info1;
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.FIGHTING:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "等级：" + this.getlevelStr(_data), style: { "textColor": 0xE2DA91 } });
                    arr.push({ text: "\n", style: {} });
                    // arr.push({ text: "战斗力：" + _data.info1, style: { "textColor": 0xE2DA91 } });
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue//GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = _data.info1;
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.ZHANGONG:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "战功:" + _data.info1, style: { "textColor": 0xE2DA91 } });
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = _data.info1;
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.HORSE:
            case TOPRANK_TYPE.CLOTHES:
            case TOPRANK_TYPE.WEAPON:
            case TOPRANK_TYPE.WING:

                var stage = Tool.toInt(_data.info1 / 10);
                var star = _data.info1 % 10;
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue//GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "阶段：" + stage + "级" + star + "星", style: { "textColor": 0xE2DA91 } });
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = stage + "级" + star + "星";
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.MAGIC:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue//GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "阶段：" + _data.info1 + "级", style: { "textColor": 0xE2DA91 } });
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = _data.info1 + "级";
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.CHONGWU:
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    if (this.powerbar) {
                        this.powerbar.visible = true;
                        this.powerbar.power = _data.fightvalue//GameCommon.getInstance().getFormatNumberShow(_data.fightvalue);
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "阶段：" + _data.info1 + "阶", style: { "textColor": 0xE2DA91 } });
                    this.label_info1.textFlow = arr;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = _data.info1 + "阶";
                    if (_data.rank <= 10) {
                        this.img_title.visible = true;
                        this.img_title.source = "xiaochenghao" + (TOPRankTypeListPanel.tab + 101) + "_png";
                        this.img_title.scaleX = 0.8;
                        this.img_title.scaleY = 0.8;
                    } else {
                        this.img_title.visible = false;
                    }
                }
                break;
            case TOPRANK_TYPE.FIELD_PVP:
                this.currentState = 'shengwang';
                if (_data.rank == 1) {
                    if (_data.viplevel > 0) {
                        this.label_vip.source = "vip_v_png";
                    }
                    this.label_info.text = _data.name;
                    arr.push({ text: "奖励：", style: { "textColor": 0xE2DA91 } });
                    this.label_info1.textFlow = arr;
                    this.label_info2.text = "声望" + _data.info1;
                } else {
                    this.label_info.text = _data.name;
                    this.label_info1.text = "声望" + _data.info1;
                    this.img_title.visible = false;
                }
                var zaoyuAwdModel: Modelzaoyubang = this.getRankAwdModel(_data.rank);
                for (var i: number = 0; i < 2; i++) {
                    if (zaoyuAwdModel.rewards.length > i) {
                        var modelthing: ModelThing = GameCommon.getInstance().getThingModel(zaoyuAwdModel.rewards[i].type, zaoyuAwdModel.rewards[i].id);
                        (this["awd_icon" + i] as eui.Image).source = modelthing.dropicon;
                        (this["awd_num_label" + i] as eui.Label).text = zaoyuAwdModel.rewards[i].num + "";
                    } else {
                        this.awardLayer.visible = false;
                    }
                }
                break;
        }

        if (_data.viplevel > 0) {
            this.label_vip.visible = true;
        } else {
            this.label_vip.visible = false;
        }

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this)//屏蔽排行榜
    }
    public getlevelStr(_data: TopRankBase): string {
        return _data.rebirthLv + "转" + _data.level + "级";
    }
    private getRankAwdModel(rankNum: number): Modelzaoyubang {
        var models: Modelzaoyubang[] = JsonModelManager.instance.getModelzaoyubang();
        for (var key in models) {
            var modelAwdAY = models[key];
            if (modelAwdAY.rankMax > rankNum) {
                return modelAwdAY;
            }
        }

        return models[models.length];
    }
    public onInit(): void {
        this.powerbar.power = 0;
        this.awardLayer.visible = false;
        this.label_info.text = '暂无榜首';
        this.label_info1.text = '';
    }
    private onTouchItem() {
        if (!this.data)
            return;
        var message = new Message(MESSAGE_ID.OTHER_MESSAGE);
        message.setInt(this.data.id);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}
enum TOPRANK_TYPE {
    FIGHTING = 0,// "战力榜"),
    LEVEL = 1,// "等级榜"),   
    ZHANGONG = 2,//战功
    CHENGJIU = 3,//成就 
    HORSE = 4,// 
    CLOTHES = 5,// 
    WEAPON = 6,// 
    WING = 7,// 
    MAGIC = 8,
    CHONGWU = 9,//宠物
    FIELD_PVP = 10,// "遭遇战榜"),

    NUM = 11,
}