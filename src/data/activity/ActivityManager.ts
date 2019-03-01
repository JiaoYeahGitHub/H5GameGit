class ActivityManager {
    // public static openQueue;
    public activity = {};
    public constructor() {
        Tool.addTimer(this.onGiftCDShow, this, 1000);
    }
    public parseMessage(msg: Message) {
        var len: number = msg.getByte();
        var data: ActivityData;
        for (var i: number = 0; i < len; i++) {
            data = this.getActivityData(msg);
            if (data.isOpen) {
                this.activity[data.id] = data;
                switch (data.id) {
                    case ACTIVITY_BRANCH_TYPE.DABIAOJIANGLI:
                        DataManager.getInstance().newactivitysManager.parsedabiaoRank(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.SIGN_EVERYDAY:
                        DataManager.getInstance().newactivitysManager.parseSignEveryDay(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LOGON_ADD:
                        DataManager.getInstance().newactivitysManager.parseLogonAdd(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LOGON_LIMIT:
                        DataManager.getInstance().newactivitysManager.parseLogonLimit(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.CHONGBANG_LIBAO:
                        DataManager.getInstance().newactivitysManager.parseChongBang(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.YAOQIANSHU:
                        DataManager.getInstance().newactivitysManager.parseyaoqianshu(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.XIANGOULIBAO:
                        DataManager.getInstance().newactivitysManager.parsexiangou(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.GUANQIAXIANFENG:
                        DataManager.getInstance().newactivitysManager.parseXianFeng(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.VIP_XIANGOU2:
                        DataManager.getInstance().newactivitysManager.parsevipxiangou(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.PERSONAL_GOAL:
                        DataManager.getInstance().newactivitysManager.parsedabiao(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.INVEST:
                        DataManager.getInstance().newactivitysManager.parseinvest(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.MONEYTAKEGODGIFT:
                        DataManager.getInstance().newactivitysManager.parseShenqi(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.NEWGODGIFT:
                        DataManager.getInstance().newactivitysManager.parseShenqi1(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_SHOP:
                        DataManager.getInstance().festivalShopManager.parseActMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_WORDCOLLECTION:
                        DataManager.getInstance().collectWordManager.parseActMessage(msg);
                        break;
                    //以下都还没确认
                    case ACTIVITY_BRANCH_TYPE.TEHUILIBAO:
                        DataManager.getInstance().newactivitysManager.parseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.HONGBAOFANLI:
                        DataManager.getInstance().newactivitysManager.parsehongbao(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.DENGLUJIANGLI:
                        DataManager.getInstance().newactivitysManager.parsedenglu(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LEIJICHONGZHI:
                        DataManager.getInstance().newactivitysManager.parseleiji(msg);
                        break
                    case ACTIVITY_BRANCH_TYPE.CHONGZHISHENGYAN:
                        DataManager.getInstance().newactivitysManager.parsechongzhi(msg);
                        break
                    case ACTIVITY_BRANCH_TYPE.TREASURE_RANK:
                    case ACTIVITY_BRANCH_TYPE.TREASURE_RANK2:
                        DataManager.getInstance().treasureRankManager.activityId = data.id;
                        DataManager.getInstance().treasureRankManager.parseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WISHINGWELL:
                        DataManager.getInstance().wishingWellManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.VIPTLSHOP:
                        DataManager.getInstance().vipTLShopManager.parseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.GIFTFORPAY:
                        DataManager.getInstance().newactivitysManager.parsePayGift(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.SEVENDAYPAY:
                        DataManager.getInstance().newactivitysManager.sevenpayId = data.id;
                        DataManager.getInstance().newactivitysManager.parseSevenDayPay(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN:
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN2:
                        DataManager.getInstance().festivalLoginManager.activityID = data.id;
                        DataManager.getInstance().festivalLoginManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_FAVORABLE:
                    case ACTIVITY_BRANCH_TYPE.WEEKEND_FAVORABLE:
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_FAVORABLE2:
                        DataManager.getInstance().festivalFavorableManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_WISHING_WELL:
                    case ACTIVITY_BRANCH_TYPE.WEEKEND_WISHING_WELL:
                        DataManager.getInstance().festivalWishingwellManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_TARGET_PAY:
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_TARGET:
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_TARGET2:
                        DataManager.getInstance().festivalTargetManager.activityId = data.id;
                        DataManager.getInstance().festivalTargetManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WANBA_PRIVILEGE_GIFT:
                        DataManager.getInstance().playCafeManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WUYIACTIVITY:
                        DataManager.getInstance().festivalLoginManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.OPENSERVER_LEICHONG:
                        DataManager.getInstance().openServerLeiChongManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WUYITEHUILIBAO:
                        DataManager.getInstance().festivalWuYiManager.onParseAdvanceMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.ZHUANPANACTIVITY:
                        DataManager.getInstance().festivalWuYiManager.parseZhuanpanRoundMsg(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LIUYI_MISSION:
                        DataManager.getInstance().festivalWuYiManager.parseLiuyiMissionList(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LIUYIACTIVITDANCHONG:
                        DataManager.getInstance().festivalDanChongManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WX_PAYGIFT:
                        DataManager.getInstance().wxDanChongManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.HEFU_MISSION:
                        DataManager.getInstance().hefuActManager.parseHefuMissionList(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.HEFU_PAYGIFT:
                        DataManager.getInstance().hefuActManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.HEFU_TREASURE:
                        DataManager.getInstance().hefuActManager.parseZhuanpanRoundMsg(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.ACT_SHENQICHOUQIAN:
                        DataManager.getInstance().shenqiZhuanPanManager.parseZhuanpanRoundMsg(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.HEFU_LEGEND:
                        DataManager.getInstance().hefuActManager.parseChongBang(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.ZHIZUN_XIANGOU:
                        DataManager.getInstance().newactivitysManager.parseZhiZunxiangou(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LIANXU_LEICHONG:
                        DataManager.getInstance().lianxuChongManager.onParseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.CONSUME_ITEM:
                        DataManager.getInstance().totalConsumeManager.parseMessage(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU:
                        DataManager.getInstance().tuangouActManager.parseTuangouMsg(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.CONSUME_RANK:
                        // DataManager.getInstance().crossConsumeRankManager.parseRankMsg(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.LEICHONGLABA:
                        DataManager.getInstance().labaManager.parseLunshu(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.ZHONGQIULEICHONG:
                        DataManager.getInstance().zqManager.parseInit(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.JUEXINGDAN:
                        DataManager.getInstance().jxdManager.parseInit(msg);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WEEKENDSHAREGIFT:
                        let weekend_shareNum = msg.getByte();
                        let _weekendShareCD = msg.getInt();
                        let _sharecdClientTime = egret.getTimer();
                        let rewardsize: number = msg.getByte();
                        for (let i: number = 0; i < rewardsize; i++) {
                            let rewardedIdx: number = msg.getByte();
                        }
                        break;
                    case ACTIVITY_BRANCH_TYPE.ACT_666SHENQI2:
                        DataManager.getInstance().a666Manager.parseInit(msg);
                        break;
                    // case ACTIVITY_BRANCH_TYPE.FESTIVAL_LUCKY_BAG:
                    //     DataManager.getInstance().festivalLuckyBagManager.onParseMessage(msg);
                    //     break;
                    case ACTIVITY_BRANCH_TYPE.ACT_RONGLIAN:
                        DataManager.getInstance().activitySmeltManager.parseInit(msg);
                        break;
                }
            } else {
                this.delActivity(data.id);
            }
        }
    }
    private delActivity(id) {
        delete this.activity[id];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event("delActivity"));
    }
    private getActivityData(msg: Message): ActivityData {
        var data: ActivityData;
        var id: number = msg.getInt();
        var isOpen = msg.getByte() == 1;
        if (isOpen) {
            var order = msg.getByte();
            var cd = msg.getInt();
            data = this.activity[id];
            if (!data) {
                data = new ActivityData(id, isOpen, cd, 0);
            } else {
                data.cd = cd;
                data.reSetTime();
            }
        } else {
            data = new ActivityData(id, isOpen, 0);
        }
        return data;
    }
    public getSortActivity(type): ActivityData[] {
        var data: ActivityData;
        // var filter = ActivityManager.openQueue[type];
        var model: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[type];
        var filter = GameCommon.parseIntArray(model.activityId);
        var ret: ActivityData[] = [];
        var isFind: boolean = false;
        for (var key in filter) {
            data = this.activity[filter[key]];
            if (data && data.isOpen) {
                ret.push(data);
            }
            if (filter[key] == ACTIVITY_BRANCH_TYPE.YAOQIANSHU) {
                isFind = true;
            }
        }
        switch (type) {
            case ACTIVITY_TYPE.ACTIVITY_FULIDATING:
                if (!isFind) {
                    this.activity[ACTIVITY_BRANCH_TYPE.YAOQIANSHU] = new ActivityData(ACTIVITY_BRANCH_TYPE.YAOQIANSHU, true, 0, 1)
                    ret.push(this.activity[ACTIVITY_BRANCH_TYPE.YAOQIANSHU]);
                }
                break;
        }
        // ret = ret.sort((n1: ActivityData, n2: ActivityData) => {
        //     if (n1.order < n2.order) {
        //         return -1;
        //     } else if (n1.order > n2.order) {
        //         return 1;
        //     } else {
        //         return 0;
        //     }
        // });

        return ret;
    }
    public getActivityCD(activityId: number) {
        if (activityId >= ActivityDefine.CLIENT_ORIGIN_ACTID) {
            if (activityId == ACTIVITY_BRANCH_TYPE.COATARD) {
                if (DataManager.getInstance().playerManager.receiveAllCoatard()) {
                    return 0;
                }
            } else if (activityId == ACTIVITY_BRANCH_TYPE.FUND) {
                if (DataManager.getInstance().investManager.isFundOver()) {
                    return 0;
                }
            } else if (activityId == ACTIVITY_BRANCH_TYPE.YIYUANLIBAO) {
                if (!DataManager.getInstance().rechargeManager.oneRecharge()) {
                    return 0;
                }
            } else if (activityId == ACTIVITY_BRANCH_TYPE.CROSS_PAYRANK) {
                if (this.getActivityCD(ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU) <= 0) {
                    return 0;
                }
            } else if (activityId == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_RANK || activityId == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_TURNPLATE) {
                if (this.getActivityCD(ACTIVITY_BRANCH_TYPE.CONSUME_ITEM) <= 0) {
                    return 0;
                }
            }
            return 1;
        } else {
            var data: ActivityData = this.activity[activityId];
            if (data) {
                return data.cd - Tool.toInt((egret.getTimer() - data.currTime) / 1000);
            }
            return 0;
        }
    }
    private onGiftCDShow() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAIN_GIFT_COOLDOWN));

        let refreshActGroupIdAry: number[] = [];
        var allGroup: ModelactivityGroup[] = JsonModelManager.instance.getModelactivityGroup();
        for (var key in allGroup) {
            let actGropId: number = this.onCheckActivity(allGroup[key]);
            if (actGropId > 0 && refreshActGroupIdAry.indexOf(actGropId) < 0) {
                refreshActGroupIdAry.push(actGropId);
            }
        }
        if (refreshActGroupIdAry.length > 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN), refreshActGroupIdAry);
        }
    }
    private onCheckActivity(modelGroup: ModelactivityGroup): number {
        var player: Player = DataManager.getInstance().playerManager.player;
        // var data: number[] = ActivityManager.openQueue[id];
        if (modelGroup.id >= ActivityDefine.CLIENT_ORIGIN_ACTID || modelGroup.activityId == null || modelGroup.activityId.length == 0) {
            return 0;
        }

        var data: number[] = GameCommon.parseIntArray(modelGroup.activityId);
        var cd: number = 0;
        var isDone: boolean = true;
        for (var i = 0; i < data.length; i++) {
            var activityId: number = data[i];
            var model: Modelactivity = JsonModelManager.instance.getModelactivity()[activityId];
            if (model && model.openLv > player.level) continue;

            var activityData: ActivityData = this.activity[activityId];
            if (!activityData || !activityData.isOpen) continue;
            if (SDKManager.isHidePay) {
                if (model && model.isIos > 0) {
                    activityData.isOpen = false;
                } else {
                    var actfuncModel: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[activityId];
                    if (actfuncModel && actfuncModel.isIos) {
                        activityData.isOpen = false;
                    }
                }
            }
            cd = this.getActivityCD(activityId);
            if (cd <= 0) {
                activityData.isOpen = false;
            }
            //状态改变 需要将该活动组 加入刷新队列
            if (!activityData.isOpen && isDone) {
                isDone = false;
            }
        }
        return isDone ? 0 : modelGroup.id;
    }
    public getActIsOpen(activityId: number): boolean {
        if (activityId < ActivityDefine.CLIENT_ORIGIN_ACTID) {
            var activityData: ActivityData = this.activity[activityId];
            return activityData && activityData.isOpen;
        } else {
            return this.getActivityCD(activityId) > 0;
        }
    }
    public getIsOpenByGroupID(groupId: number): boolean {
        let isOpen: boolean = false;
        var modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[groupId];
        if (!modelGroup.activityId || modelGroup.activityId.length == 0) return true;
        var data: number[] = data = GameCommon.parseIntArray(modelGroup.activityId);
        for (var i = 0; i < data.length; i++) {
            var activityId: number = data[i];
            if (activityId < ActivityDefine.CLIENT_ORIGIN_ACTID) {
                var activityData: ActivityData = this.activity[activityId];
                if (activityData && activityData.isOpen) {
                    isOpen = true;
                    break;
                }
            } else {
                if (this.getActivityCD(activityId) > 0) {
                    isOpen = true;
                    break;
                }
            }
        }
        return isOpen;
    }
    public checkActivityPoint(type: number): boolean {
        // var types: number[] = ActivityManager.openQueue[type];
        var modelGroup = JsonModelManager.instance.getModelactivityGroup()[type];

        var types: number[] = GameCommon.parseIntArray(modelGroup.activityId);
        if (!types) return false;
        for (var i: number = 0; i < types.length; i++) {
            if (this.checkActivityPointByID(types[i])) return true;
        }
        return false;
    }
    public checkActivityPointByID(id: number): boolean {
        var cd = this.getActivityCD(id);
        if (id < 1000 && cd <= 0) return false;
        switch (id) {
            case ACTIVITY_BRANCH_TYPE.DABIAOJIANGLI:
                DataManager.getInstance().newactivitysManager.refreshDabiaoData();
                return false;
            case ACTIVITY_BRANCH_TYPE.PERSONAL_GOAL:
                DataManager.getInstance().newactivitysManager.refreshDabiaoData();
                return DataManager.getInstance().newactivitysManager.checkRedPointForTarget();
            case ACTIVITY_BRANCH_TYPE.COATARD:
                return DataManager.getInstance().newactivitysManager.checkRedPointForCoatard();
            case ACTIVITY_BRANCH_TYPE.SIGN_EVERYDAY:
                return DataManager.getInstance().newactivitysManager.checkRedPointForSign();
            case ACTIVITY_BRANCH_TYPE.YAOQIANSHU:
                return DataManager.getInstance().newactivitysManager.checkRedPointForYao1000();
            case ACTIVITY_BRANCH_TYPE.XIANGOULIBAO:
                return DataManager.getInstance().newactivitysManager.checkRedPointForXiangou();
            case ACTIVITY_BRANCH_TYPE.GUANQIAXIANFENG:
                return DataManager.getInstance().newactivitysManager.checkRedPointForXianfeng();
            case ACTIVITY_BRANCH_TYPE.LOGON_LIMIT:
                return DataManager.getInstance().newactivitysManager.checkRedPointForSign8();
            case ACTIVITY_BRANCH_TYPE.FUND:
                return DataManager.getInstance().newactivitysManager.checkRedPointForFund();
            case ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU:
                return DataManager.getInstance().tuangouActManager.oncheckTuangouRpoint();
            case ACTIVITY_BRANCH_TYPE.CONSUME_ITEM:
                return DataManager.getInstance().totalConsumeManager.onCheckRedPoint();
            case ACTIVITY_BRANCH_TYPE.LEICHONGLABA:
                return DataManager.getInstance().labaManager.getActivityPoint();
            case ACTIVITY_BRANCH_TYPE.ZHONGQIULEICHONG:
                return DataManager.getInstance().zqManager.getActivityPointAll();
            case ACTIVITY_BRANCH_TYPE.FESTIVAL_WORDCOLLECTION:
                return DataManager.getInstance().collectWordManager.getCanShowRedPoint();
            // case ACTIVITY_BRANCH_TYPE.CHONGJILIBAO:
            //     var player = DataManager.getInstance().playerManager.player;
            //     var modelrushLv: NewactivityschongjiModel;
            //     var models = ModelManager.getInstance().modelNewactivityschongji;
            //     for (var key in models) {
            //         modelrushLv = models[key];
            //         if (modelrushLv.level > LevelDefine.ZS_ORIGIN_LEVEL) {
            //             if (GameCommon.getInstance().getLimitLevelObj(modelrushLv.level).zsLevel > player.rebirthLv) return false;
            //         } else {
            //             if (modelrushLv.level > player.level) return false;
            //         }
            //         var isNotGet: boolean = true;
            //         for (var key in DataManager.getInstance().newactivitysManager.chongji) {
            //             if (modelrushLv.id == parseInt(key)) {
            //                 isNotGet = false;
            //             }
            //         }
            //         if (isNotGet) return true;
            //     }
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.DENGLUJIANGLI:
            //     var arr: number[] = DataManager.getInstance().newactivitysManager.denglu;
            //     var modelLogins = ModelManager.getInstance().modeldengluNewactivitys;
            //     if (!arr) return false;
            //     var param;
            //     for (var i: number = arr[0]; i >= 1; i--) {
            //         if (modelLogins[i]) {
            //             param = arr[1];
            //             if (param.indexOf(i) == -1) return true;
            //         }
            //     }
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.WISHINGWELL:
            //     if (DataManager.getInstance().wishingWellManager.time == 0) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_WISHING_WELL:
            // case ACTIVITY_BRANCH_TYPE.WEEKEND_WISHING_WELL:
            //     if (DataManager.getInstance().festivalWishingwellManager.time == 0) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_TARGET:
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_TARGET2:
            //     if (DataManager.getInstance().festivalTargetManager.checkTargetAwardCanReceive()) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN:
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN2:
            //     if (DataManager.getInstance().festivalLoginManager.checkLoginAwardCanReceive()) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.WANBA_PRIVILEGE_GIFT:
            //     if (DataManager.getInstance().playCafeManager.checkLoginAwardCanReceive()) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_TURNPLATE:
            //     if (DataManager.getInstance().festivalTurnplateManager.remainTime > 0) return true;
            //     return false;
            // case ACTIVITY_BRANCH_TYPE.FESTIVAL_FUDAI:
            //     return this.checkHasFudaiItem();
        }
        return false;
    }
    public checkLoginPointByDay(day: number): boolean {
        var arr: number[] = DataManager.getInstance().newactivitysManager.denglu;
        var modelLogins = JsonModelManager.instance.getModeldenglu();
        if (!arr) return false;
        var param;
        if (modelLogins[day]) {
            param = arr[1];
            if (param.indexOf(day) == -1 && arr[0] >= day) return true;
        }
        return false;
    }
    /**判断是否有小福袋**/
    public checkHasFudaiItem(): boolean {
        return DataManager.getInstance().bagManager.getGoodsThingNumById(GoodsDefine.ITEM_FUDAI) > 0;
    }

    public getRegisterTabBtnParam(id: number): RegisterTabBtnParam {
        if (id >= ActivityDefine.CLIENT_ORIGIN_ACTID) {
            if (this.getActivityCD(id) <= 0) {
                return null;
            }
            if (id == ACTIVITY_BRANCH_TYPE.CROSS_PAYRANK && this.getActivityCD(ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU) <= 0) {
                return null;
            }
            if ((id == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_RANK || id == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_TURNPLATE) && this.getActivityCD(ACTIVITY_BRANCH_TYPE.CONSUME_ITEM) <= 0) {
                return null;
            }
            var func: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[id];
            if (func) {
                if (SDKManager.isHidePay && func.isIos > 0) return null;

                var r: RegisterTabBtnParam = new RegisterTabBtnParam(func.panel, func.icon);
                r.title = func.title;
                return r;
            }
        } else {
            if (!this.activity[id])
                return null;
            var activity: Modelactivity = JsonModelManager.instance.getModelactivity()[id];
            if (activity) {
                if (SDKManager.isHidePay && activity.isIos > 0) return null;

                var r: RegisterTabBtnParam = new RegisterTabBtnParam(activity.panel, activity.icon);
                r.title = activity.title;
                return r;
            }
        }
        return null;
    }
    public getRegisterSystemParam(id: number): RegisterSystemParam {
        if (id >= ActivityDefine.CLIENT_ORIGIN_ACTID) {
            if (this.getActivityCD(id) <= 0) {
                return null;
            }
            if (id == ACTIVITY_BRANCH_TYPE.CROSS_PAYRANK && this.getActivityCD(ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU) <= 0) {
                return null;
            }
            if ((id == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_RANK || id == ACTIVITY_BRANCH_TYPE.CONSUMEITEM_TURNPLATE) && this.getActivityCD(ACTIVITY_BRANCH_TYPE.CONSUME_ITEM) <= 0) {
                return null;
            }
            var func: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[id];
            if (func) {
                if (SDKManager.isHidePay && func.isIos > 0) return null;

                var r: RegisterSystemParam = new RegisterSystemParam(func.panel, func.icon);
                r.title = func.title;
                return r;
            }
        } else {
            if (!this.activity[id])
                return null;
            var activity: Modelactivity = JsonModelManager.instance.getModelactivity()[id];
            if (activity) {
                if (SDKManager.isHidePay && activity.isIos > 0) return null;

                var r: RegisterSystemParam = new RegisterSystemParam(activity.panel, activity.icon);
                r.title = activity.title;
                return r;
            }
        }
        return null;
    }
    /**判断下是否有功能预告的活动**/
    private _yugaoOpenCondition: string = 'server,0#server,1';
    public getActYugaoIdx(): number {
        let idx: number = 0;
        let openparam: string[] = this._yugaoOpenCondition.split('#');
        for (let i: number = 0; i < openparam.length; i++) {
            let param: string[] = openparam[i].split(",");
            let opentype: string = param[0];
            let openday: number = parseInt(param[1]);
            switch (opentype) {
                case 'server':
                    if (openday == DataManager.getInstance().playerManager.player.serverDay) {
                        idx = i + 1;
                    }
                    break;
            }
            if (idx > 0) {
                break;
            }
        }
        return idx;
    }
}
class ActivityData {
    public id;
    public isOpen;
    public cd;
    public currTime;
    public order;
    public constructor(id, isOpen, cd, order = 1) {
        this.id = id;
        this.isOpen = isOpen;
        this.cd = cd;
        this.order = order;
        this.reSetTime();
    }
    public reSetTime() {
        this.currTime = egret.getTimer();
    }
}