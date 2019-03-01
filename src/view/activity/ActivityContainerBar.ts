/** 
 * 
 * 活动界面管理
 * @author	lzn
 * 
 * */
class ActivityContainerBar extends eui.Component {
    private layer: eui.Group;
    // private fixationPos = {};
    protected points = {};
    // private delAnimRecord = {};
    private activityIDOrder: number[];
    public constructor(layer) {
        super();
        this.layer = layer;
        this.layer.removeChildren();
        // this.fixationPos[ACTIVITY_TYPE.ACTIVITY_FIRST_PAY] = new egret.Point(-size.width + 100, 400);
        // this.fixationPos[ACTIVITY_TYPE.ACTIVITY_MONTHCARD] = new egret.Point(-size.width + 100, 310);
        this.activityIDOrder = [];
        this.checkActivityBtn();
        //  GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onLevelUp, this);
        // Tool.addTimer(this.onTimer, this, 1000);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WANBA_DESK_INFO_MESSAGE.toString(), this.onWanbaInfo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.WANBAVIP_MAX, this.onRemoveWanBaVipBtn, this);
    }
    private onRemoveWanBaVipBtn(): void {
        var actBtn: eui.Button;
        actBtn = this.layer.getChildByName("Activity_Button_" + 20) as eui.Button;
        if (actBtn) {
            this.layer.removeChild(actBtn);
            actBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActivityBtnClick, this);
            actBtn = null;
            this.adjusetChild(this.layer);
            delete this.points[20];
        }
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_WANBA_VIPTEQUAN, this.layer, this.onActivityBtnClick, this, "");
    }
    //检查活动是否开启按钮是否需要关闭
    public checkActivityBtn(): void {
        var group: ModelactivityGroup[] = JsonModelManager.instance.getModelactivityGroup();
        for (var key in group) {
            let modelgourp: ModelactivityGroup = group[key];
            if (modelgourp.level > DataManager.getInstance().playerManager.player.level) {
                continue;
            }
            if (SDKManager.isHidePay && modelgourp.isIos > 0) {
                continue;
            }
            this.onCheckActBtnRemove(modelgourp.id, this.layer);
        }
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_HALL, this.layer, this.onActivityBtnClick, this, "activity_hall_png");//暂时用这个。。要换的
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_DENGLUJIANGLI, this.layer, this.onActivityBtnClick, this, "newactivity_meiridenglu_png");//登录奖励暂时用这个。。要换的
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_SEVENPAY, this.layer, this.onActivityBtnClick, this, "sevenpay_btn_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_FULIDATING, this.layer, this.onActivityBtnClick, this, "newactivity_fulidatingicon_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_CHONGZHISHENGYAN, this.layer, this.onActivityBtnClick, this, "newactivity_chongzhishengyan_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_CHONGZHI, this.layer, this.onActivityBtnClick, this, "newactivity_fanli_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_TREASURE_RANK, this.layer, this.onActivityBtnClick, this, "activity_treasure_rank_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_TREASURE, this.layer, this.onActivityBtnClick, this, "mainview_treasure_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_FIRST_PAY, this.layer, this.onActivityBtnClick, this, "activity_welfare_png", 1);
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_MONTHCARD, this.layer, this.onActivityBtnClick, this, "newactivity_yueka_png", 1);
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_VIPTLSHOP, this.layer, this.onActivityBtnClick, this, "vipTLShop_btn_png");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_FESTIVAL, this.layer, this.onActivityBtnClick, this, "activity_daily_btn_png");//activity_festival_png
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_WEEKEND, this.layer, this.onActivityBtnClick, this, "activity_daily_btn_png");//activity_weekend_discount_png
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_PLAY_CAFE, this.layer, this.onActivityBtnClick, this, "activity_playcafe_png");


        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_SHARE, this.layer, this.onTouchBtnShare, this, "");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_FOCUS, this.layer, this.onTouchBtnFocus, this, "");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_WANBA_FOCUS, this.layer, this.onActivityBtnClick, this, "");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_CLIENT_DOWM, this.layer, this.onActivityBtnClick, this, "");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_CLIENT_FOCUS, this.layer, this.onActivityBtnClick, this, "");
        // this.onCheckActBtnRemove(ACTIVITY_TYPE.ACTIVITY_WANBA_DESK, this.layer, this.onActivityBtnClick, this, "activity_wanba_desk_png");
    }
    public trigger(): void {
        for (var key in this.points) {
            this.points[key].checkPoint();
        }
    }
    private onCheckActBtnRemove(actType: ACTIVITY_TYPE, parent: egret.DisplayObjectContainer): void {
        if (this.activityIDOrder.indexOf(actType) == -1) {
            this.activityIDOrder.push(actType);
        }
        let source: string = '';
        var modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[actType];
        if (modelGroup && modelGroup.icon && modelGroup.icon.length > 0) {
            source = modelGroup.icon;
        }
        var actIsOpen: boolean = false;
        if (ACTIVITY_TYPE.ACTIVITY_FOCUS == actType) {
            source = SDKManager.getFocusSkin();
            if (!SDKManager.loginInfo.focus && source) {
                actIsOpen = true;
                //通过ezsdk需要判断是否支持关注     
                if (SDKManager.loginInfo.channel == EChannel.CHANNEL_SOEZ) {
                    actIsOpen = SDKEZJS.isSupportFocus();
                    //07073渠道非常各路，先屏蔽他的关注
                    if (SDKManager.loginInfo.subChannel == 10410) {
                        actIsOpen = false;
                    }
                }
            }
        } else if (ACTIVITY_TYPE.ACTIVITY_SHARE == actType) {
            // if(SDKManager.getChannel() == EChannel.CHANNEL_WANBA||SDKManager.getChannel() == EChannel.CHANNEL_AWY||SDKManager.getChannel() == EChannel.CHANNEL_CRAZY){
            //     actIsOpen = true;
            // }else{
            //     actIsOpen = false;
            // }
            actIsOpen = true;
            if (!SDKManager.getShareSkin())
                actIsOpen = false;
            //通过ezsdk需要判断是否支持分享
            if (SDKManager.getChannel() == EChannel.CHANNEL_SOEZ) {
                actIsOpen = SDKEZ.getInstance().isSupportShare;
            }
        } else if (ACTIVITY_TYPE.VERIFY_GIFT == actType) {
            if (SDKManager.loginInfo.channel == EChannel.CHANNEL_AWY && DataManager.getInstance().playerManager.verify == 0) {
                var verify = SDKUtil.getQueryString("verify");
                if (!verify || verify == "0") {
                    actIsOpen = true;
                }
            }
        } else if (ACTIVITY_TYPE.ACTIVITY_WANBA_FOCUS == actType) {
            // source = "activity_wanba_foucs_png";
            if (!DataManager.getInstance().functionManager.wanbaFoucs && (SDKManager.loginInfo.channel == EChannel.CHANNEL_WANBA)) {
                actIsOpen = true;
            } else {
                actIsOpen = false;
            }
        } else if (ACTIVITY_TYPE.WANBA_XQBL == actType) {
            if (SDKManager.loginInfo.channel == EChannel.CHANNEL_WANBA)
                actIsOpen = true;
        } else if (ACTIVITY_TYPE.ACTIVITY_WANBA_DESK == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WANBA) {
                // if (DataManager.getInstance().playerManager.player.getCreateDisCurDay() < 7 || DataManager.getInstance().playerManager.player.sendDesk == 0) {
                //     actIsOpen = true;
                // } else {
                //     actIsOpen = false;
                // }
                actIsOpen = true;
            } else {
                actIsOpen = false;
            }
        } else if (ACTIVITY_TYPE.ACTIVITY_WANBA_VIPTEQUAN == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WANBA) {
                actIsOpen = true;
                var wanbaLv: number = 0;
                var url = SDKWanBa.getInstance().getVipInfo();
                HttpUtil.sendGetRequest(
                    url, function (event: egret.Event) {
                        var request = <egret.HttpRequest>event.currentTarget;
                        var result = JSON.parse(JSON.parse(request.response).ret);
                        if (result) {
                            wanbaLv = result.level;
                            if (wanbaLv > 0 && !result.isGetGift) {
                                DataManager.getInstance().playerManager.player.wanbaVip = true;
                            }
                            else {
                                if (wanbaLv >= 6 && result.isGetGift) {
                                    actIsOpen = false;
                                    this.onRemoveWanBaVipBtn();
                                }
                                DataManager.getInstance().playerManager.player.wanbaVip = false;
                            }
                        }
                    }, this);
            } else {
                actIsOpen = false;
            }
            // actIsOpen = true;
        } else if (ACTIVITY_TYPE.ACTIVITY_YUGAO == actType) {
            source = '';
            let yugaoIdx: number = DataManager.getInstance().activityManager.getActYugaoIdx();
            actIsOpen = yugaoIdx > 0;
            if (actIsOpen) {
                source = `activity_yugao_icon${yugaoIdx}_png`;
            }
        } else if (ACTIVITY_TYPE.FANGKUAI_GENGDUOYOUXI == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX && FunDefine.getXYXFuncIsOpen(Constant.XYX_MOREGAME_SWITCH)) {
                actIsOpen = true;
            }
        } else if (ACTIVITY_TYPE.VIP_SERVICE == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX && FunDefine.getXYXFuncIsOpen(Constant.XYX_CUSTOMSERVICE_SWITCH)) {
                actIsOpen = true;
            }
        } else if (ACTIVITY_TYPE.WXGAME_COLLECTION == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX && FunDefine.getXYXFuncIsOpen(Constant.XYX_SHOUCANGYOUXI_SWITCH)) {
                actIsOpen = !DataManager.getInstance().playerManager.player.wxcolletion;
            }
        } else if (ACTIVITY_TYPE.WXGAME_FIRST_SHARE == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
                actIsOpen = FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE) && DataManager.getInstance().wxgameManager.isFirstShare;
            } else {
                actIsOpen = false;
            }
        } else if (ACTIVITY_TYPE.WXGAME_INVITE == actType || ACTIVITY_TYPE.WXGAME_SHARE == actType) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
                actIsOpen = FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE);
            } else {
                actIsOpen = false;
            }
        }
        // else if (ACTIVITY_TYPE.ACTIVITY_YIYUANLIBAO == actType) {
        //     if (DataManager.getInstance().rechargeManager.oneRecharge()) {
        //         actIsOpen = true;
        //     } else {
        //         actIsOpen = false;
        //     }
        // }
        else {
            actIsOpen = DataManager.getInstance().activityManager.getIsOpenByGroupID(actType);
        }

        var actBtn: ActivityButton;
        if (actIsOpen) {
            actBtn = parent.getChildByName("Activity_Button_" + actType) as ActivityButton;
            if (!actBtn) {
                actBtn = new ActivityButton(source);
                actBtn.name = "Activity_Button_" + actType;
                actBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActivityBtnClick, this);
                parent.addChild(actBtn);
                // if (!this.delAnimRecord[actType]) {//添加特效
                this.addButtonAnimation(actBtn);
                // }
                this.adjusetChild(parent);
            }
            this.onAddRedPoint(actType, actBtn);
        } else {
            actBtn = parent.getChildByName("Activity_Button_" + actType) as ActivityButton;
            if (actBtn) {
                this.delButtonAnimation(actBtn);
                parent.removeChild(actBtn);
                actBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActivityBtnClick, this);
                actBtn = null;
                this.adjusetChild(parent);
                delete this.points[actType];
            }
            switch (actType) {
                case ACTIVITY_TYPE.ACTIVITY_HALL:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_CLOSE), "HallActivityPanel")
                    break;
            }
        }
    }
    private addButtonAnimation(btn: egret.DisplayObjectContainer) {//animRes: string = "huodong2"
        var anim: Animation;
        if (btn && !btn.getChildByName("Activity_Button_effect")) {
            anim = new Animation("huodong");
            anim.name = "Activity_Button_effect";
            anim.x = 35;
            anim.y = 35;
            btn.addChildAt(anim, 1);
        }
    }
    private delButtonAnimation(btn: egret.DisplayObjectContainer) {
        var anim: Animation;
        if (btn && btn.getChildByName("Activity_Button_effect")) {
            anim = btn.getChildByName("Activity_Button_effect") as Animation;
            anim.onDestroy();
            anim = null;
        }
    }

    private adjusetChild(parent: egret.DisplayObjectContainer) {
        var actBtn: eui.Button;
        var offX: number = -73;
        var offY: number = 75;
        var rows: number = 8;
        var n: number = 0;
        for (var i: number = 0; i < this.activityIDOrder.length; i++) {
            actBtn = parent.getChildByName("Activity_Button_" + this.activityIDOrder[i]) as eui.Button;
            if (actBtn) {
                // var pos: egret.Point = this.fixationPos[actBtn.name.split("_")[2]];
                // if (pos) {
                //     actBtn.x = pos.x;
                //     actBtn.y = pos.y;
                // } else {
                actBtn.x = Math.floor(n % rows) * offX;
                actBtn.y = Math.floor(n / rows) * offY;
                n++;
                // }
            }
        }
    }
    //添加红点
    private onAddRedPoint(actType, parent: egret.DisplayObjectContainer) {
        var point: redPoint;
        if (!this.points[actType]) {
            this.points[actType] = new redPoint();
            this.points[actType].addRedPointImg(parent, GameDefine.RED_CRICLE_STAGE_PRO);
            point = this.points[actType];
        } else {
            point = this.points[actType];
        }
        switch (actType) {
            case ACTIVITY_TYPE.ACTIVITY_TREASURE:
                point.addTriggerFuc(DataManager.getInstance().celestialManager, "checkEpicTierEquipPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_WANBA_DESK:
                point.addTriggerFuc(DataManager.getInstance().playerManager, "checkDeskPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_YIYUANLIBAO:
                point.addTriggerFuc(DataManager.getInstance().rechargeManager, "oneRecharge");
                break;
            case ACTIVITY_TYPE.ACTIVITY_SHARE:
                point.addTriggerFuc(DataManager.getInstance().functionManager, "sharePoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_FOCUS:
                break;
            case ACTIVITY_TYPE.ACTIVITY_SHENQI:
                point.addTriggerFuc(DataManager.getInstance().playerManager, "shenqiPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_WANBA_VIPTEQUAN:
                point.addTriggerFuc(DataManager.getInstance().playerManager, "checkWanBaVipPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_VIP_ZHUANPAN:
                point.addTriggerFuc(DataManager.getInstance().vipManager, "getZhuanPanPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_WUYi:
                point.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "getActivityPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_TREASURE:
                point.register(this['bottom_72'], GameDefine.RED_MAIN_II_POS, DataManager.getInstance().celestialManager, "checkEpicTierEquipPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_HEFU:
                point.addTriggerFuc(DataManager.getInstance().hefuActManager, "checkHefuMissionRedPoint");
                break;
            case ACTIVITY_TYPE.ACTIVITY_SMELT:
                point.addTriggerFuc(DataManager.getInstance().bagManager, "getEquipSmeltPointShow");
                break;

            // case ACTIVITY_TYPE.ACTIVITY_HALL:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_DENGLUJIANGLI:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_FULIDATING:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_FESTIVAL:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_WEEKEND:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_PLAY_CAFE:
            //     point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            // case ACTIVITY_TYPE.ACTIVITY_TARGET_MAIN:
            //      point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
            //     break;
            default:
                point.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPoint", actType);
                break;
        }
    }
    public onActivityBtnClick(event: egret.Event) {
        let actBtn: ActivityButton = event.currentTarget as ActivityButton;
        let actType: number = parseInt(actBtn.name.replace("Activity_Button_", ""));
        let modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[actType];
        switch (actType) {
            case ACTIVITY_TYPE.ACTIVITY_SHOP:
                ShopDefine.openDefaultShopView();
                break;
            // case ACTIVITY_TYPE.ACTIVITY_FIRST_PAY:
            // this.delAnimRecord[actType] = actType;
            // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), modelGroup ? modelGroup.panel : "WelfarePanel");
            // break;
            case ACTIVITY_TYPE.ACTIVITY_TREASURE_RANK:
                DataManager.getInstance().treasureRankManager.onSendMessage();
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), modelGroup ? modelGroup.panel : "TreasureRankPanel");
                break;
            case ACTIVITY_TYPE.ACTIVITY_TREASURE:
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam(modelGroup ? modelGroup.panel : "EquipNBPanel", 0));
                break;
            case ACTIVITY_TYPE.FANGKUAI_GENGDUOYOUXI:
                platform.navigateToMiniProgram({
                    appId: 'wx20194e7827347870',
                    path: ""
                });
                break;
            case ACTIVITY_TYPE.VIP_SERVICE:
                platform.openCustomerServiceConversation({});
                break;
            case ACTIVITY_TYPE.ACTIVITY_FESTIVAL:
                // FestivalActivityPanel.Type = ACTIVITY_TYPE.ACTIVITY_FESTIVAL;
                // ModelManager.getInstance().onModelReset(0);
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), modelGroup ? modelGroup.panel : "FestivalActivityPanel");
                break;
            case ACTIVITY_TYPE.ACTIVITY_WEEKEND:
                // FestivalActivityPanel.Type = ACTIVITY_TYPE.ACTIVITY_WEEKEND;
                // ModelManager.getInstance().onModelReset(1);
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), modelGroup ? modelGroup.panel : "FestivalActivityPanel");
                break;
            case ACTIVITY_TYPE.ACTIVITY_SHARE:
                this.onTouchBtnShare(actType);
                break;
            case ACTIVITY_TYPE.ACTIVITY_FOCUS:
                this.onTouchBtnFocus(actType);
                break;
            case ACTIVITY_TYPE.WANBA_XQBL:
                SDKWanBaJS.openUrl("https://buluo.qq.com/mobile/barindex.html?bid=403919&from=");
                break;
            default:
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), modelGroup.panel);
                break;
        }
        // if (!this.delAnimRecord[actType]) {
        //     this.delAnimRecord[actType] = actType;
        this.delButtonAnimation(actBtn);
        // }
    }

    private onTouchBtnShare(actType): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ShareInfoPanel");
    }
    /**
     * 更新分享信息
     */
    public updateShareInfo(info: ISDKShareInfo): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SDK_SHARE_INFO_UPDATE), info);
    }

    private onTouchBtnFocus(actType): void {
        //SDKManager.subscribe();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FocusPanel");
    }

    private onlineGiftRedPoint(): boolean {
        // var modelOnlineGift: ModelOnlineGift = ModelManager.getInstance().modelOnlineGift[DataManager.getInstance().playerManager.player.onlineGift];
        // if (modelOnlineGift) {
        //     if (DataManager.getInstance().playerManager.player.getOnlineGiftCountDown() > modelOnlineGift.time) {
        //         return true;
        //     }
        // }
        return false;
    }

    private onTimer() {
    }

    private onWanbaInfo(): void {
        var point: redPoint = this.points[ACTIVITY_TYPE.ACTIVITY_WANBA_DESK];
        if (point) {
            point.checkPoint();
        }
    }
}