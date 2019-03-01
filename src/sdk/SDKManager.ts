/**
 * 不要在SDK模块中引用任何游戏逻辑
 * 方便下一步分离
 */
class SDKManager {
    public static loginInfo: ILoginInfo = {
        gamename: '极品散仙',
        serverName: '',
        channel: EChannel.CHANNEL_WXGAMEBOX,
        subChannel: EChannel.CHANNEL_WXGAMEBOX,
        serverId: null,
        url: ChannelDefine.getUrl(EChannel.CHANNEL_WXGAMEBOX),
        account: null,
        playerId: null,
        sign: null,
        platform: EPlatform.PLATFORM_NONE,
    };

    /**
     * SDK功能处理器mapping
     */
    private static _handlers = {
        CHANNEL_AWY: SDKAWY.getInstance(),
        CHANNEL_CRAZY: SDKCrazy.getInstance(),
        CHANNEL_YYB: SDKYYB.getInstance(),
        CHANNEL_EGRET: SDKEgret.getInstance(),
        CHANNEL_WANBA: SDKWanBa.getInstance(),
        CHANNEL_JINBANG: SDKJinBang.getInstance(),
        CHANNEL_360: SDK360.getInstance(),
        CHANNEL_QUICK: SDKQuick.getInstance(),
        CHANNEL_SHENQI: SDKShenQi.getInstance(),
        CHANNEL_YYBQUICK: SDKYYBQuick.getInstance(),
        CHANNEL_KAOPUGP: SDKKAOPU.getInstance(),
        CHANNEL_VIVO: SDKVIVO.getInstance(),
        CHANNEL_HUAWEI: SDKHW.getInstance(),
        CHANNEL_SOEZ: SDKEZ.getInstance(),
        CHANNEL_QUNHEI: SDKQH.getInstance(),
        CHANNEL_YIYOU: SDKYiYou.getInstance(),
        CHANNEL_HUIYOU: SDKHUIYOU.getInstance(),
        CHANNEL_NEZHA: SDKNeZha.getInstance(),
        CHANNEL_WXGAMEBOX: SDKWXGAMEBOX.getInstance()
    };
    /**
     * SDK统计mapping
     */
    private static _statistics = {
        CHANNEL_WXGAMEBOX: SDKWXGameBoxSA.getInstance(),
        //CHANNEL_AWY : SDKEgretOthersa.getInstance(), 
        //CHANNEL_CRAZY : SDKEgretOthersa.getInstance(),
        // CHANNEL_YYB : SDKEgretsa.getInstance(),
        // CHANNEL_EGRET: SDKEgretsa.getInstance(),
        // CHANNEL_WANBA: SDKEgretsa.getInstance()
    };

    public static getHandler(channel?: EChannel): ISDKHandler {
        var targetChannel = channel;
        if (!targetChannel) {
            targetChannel = SDKManager.loginInfo.channel;
        }
        var key = EChannel[targetChannel];
        return SDKManager._handlers[key];
    }

    public static getHandlerAny(): any {
        var targetChannel = SDKManager.loginInfo.channel;
        var key = EChannel[targetChannel];
        return SDKManager._handlers[key];
    }

    public static getStatistics(channel?: EChannel): ISDKStatistics {
        var targetChannel = channel;
        if (!targetChannel) {
            targetChannel = SDKManager.loginInfo.channel;
        }
        var key = EChannel[targetChannel];
        return SDKManager._statistics[key];
    }

    public constructor() {

    }
    /**
     * SDK数据初始化
     */
    public static isSDKLogin: boolean = false;//是否走SDK登录
    public static init(): void {
        try {
            if (window['gamesdk'] && this.isSDKLogin) {
                this.loginInfo = window['gamesdk'];
                this.loginInfo.url = ChannelDefine.getUrl(this.loginInfo.channel);
            }
            let handler: ISDKHandler = SDKManager.getHandler();
            if (handler) {
                if (!platform.isLocalTest() && this.isSDKLogin) {
                    handler.info = this.loginInfo;
                    handler.init();
                    handler.login();
                } else {
                    handler.info = this.loginInfo;
                    this._loginFlag = true;
                }
            } else {
                this._loginFlag = true;
            }
        } catch (e) {
            Tool.throwException('缺少渠道信息！！！');
        }
    }
    /**
     * 登录成功回调
     */
    public static loginSuccessCallBack(): void {
        this._loginFlag = true;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SDK_LOGIN_OK));
    }
    /**
     * 登录失败回调
     */
    public static loginFailCallBack(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SDK_LOGIN_FAIL));
    }
    /**
     * 登录重试
     */
    public static retry() {
        // FIXME 刷新不能解决所有问题 可能需要logout->login
        //location.reload();
    }

    /**
     * 获取当前渠道号
     */
    public static getChannel(): number {
        return SDKManager.loginInfo.channel;
    }

    /**
     * 检查SDK是否完成
     */
    private static _loginFlag: boolean;
    public static get sdkLogin(): boolean {
        return this._loginFlag;
    }

    /**
     * 发起支付
     */
    public static pay(payInfo: IPayInfo, owner: ISDKPayContainer) {
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler) {
            handler.pay(payInfo, owner);
        }
    }
    /**
     * SDK接入成功统计
     */
    public static onCompleteSDK() {
        var statistics: ISDKStatistics = SDKManager.getStatistics();
        if (statistics) {
            statistics.onCompleteSDK(SDKManager.loginInfo);
        }
    }
    /**
     * 登录游戏服回调
     */
    public static onEnterGame(playerInfo: IPlayerInfo) {
        this.loginInfo.playerId = playerInfo.id;
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler && handler.onEnterGame) {
            handler.onEnterGame(this.loginInfo, playerInfo);
        }
        var statistics: ISDKStatistics = SDKManager.getStatistics();
        if (statistics) {
            statistics.onEnterGame(SDKManager.loginInfo, playerInfo);
        }
    }
    /**
     * 建角回调
     */
    public static onCreateRole(playerInfo: IPlayerInfo) {
        egret.log("进入游戏建角成功 onCreateRole（）")
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler && handler.onCreateRole) {
            handler.onCreateRole(this.loginInfo, playerInfo);
        }

        var statistics: ISDKStatistics = SDKManager.getStatistics();
        if (statistics) {
            statistics.onCreateRole(SDKManager.loginInfo, playerInfo);
        }
    }
    /**
     * 支付统计
     */
    public static onPaySuccess(payinfo: IPayInfo, bill_no: string) {
        var statistics: ISDKStatistics = SDKManager.getStatistics();
        if (statistics) {
            statistics.onPay(SDKManager.loginInfo, payinfo, bill_no);
        }
    }
    /**
     * 获取关注图标
     */
    public static getFocusSkin(): string {
        return null;
    }

    /**
     * 发起关注
     */
    public static subscribe() {
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler && handler.subscribe) {
            handler.subscribe();
        }
    }

    /**
     * 获取分享图标
     */
    public static getShareSkin(): string {
        return null;
    }

    /**
     * 发起分享
     */
    public static share(owner: ISDKShareContainer, shareType) {
        // egret.log("-----------------share: " + shareType);
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler && handler.share) {
            handler.share(owner, shareType);
        }
    }

    /**
     * 获取分享信息skin
     */
    public static getShareInfoSkin(): string {
        return null;
    }

    /**
     * 钻石变更
     */
    public static onDiamondUpdate(changeType, changeValue: number, currency: number): void {
        // SDKEgretadsa.getInstance().onDiamondUpdate(changeType, 1, changeValue, currency);
    }

    /**
    * 金币变更
    */
    public static onMoneyUpdate(changeType, changeValue: number, currency: number): void {
        // SDKEgretadsa.getInstance().onMoneyUpdate(changeType, 1, changeValue, currency);
    }

    public static onLevelUp(playerInfo: IPlayerInfo): void {
        var handler: ISDKHandler = SDKManager.getHandler();
        if (handler && handler.onLevelup) {
            handler.onLevelup(SDKManager.loginInfo, playerInfo);
        }
        // SDKEgretadsa.getInstance().onLevelup(playerInfo);
    }
    /**获取游戏名称**/
    public static get gamename(): string {
        return this.loginInfo.gamename;
    }
    /**判断是否需要屏蔽充值内容  TRUE屏蔽**/
    private static _iosPayOpen: boolean;
    private static _currDate: Date;
    public static get isHidePay(): boolean {
        try {
            //渠道接口判断
            if (!DataManager.IOS_PAY_ISOPEN) return true;
            //时间判断
            if (DataManager.IOS_PAY_ZONETIME || DataManager.IOS_PAY_OPENDATE) {
                if (this._currDate) {
                    this._currDate.setTime(DataManager.getInstance().playerManager.player.curServerTime);
                } else {
                    this._currDate = new Date(DataManager.getInstance().playerManager.player.curServerTime);
                }
                //日期判断
                if (DataManager.IOS_PAY_OPENDATE && DataManager.IOS_PAY_OPENDATE.length > 0) {
                    let year_val: number = this._currDate.getFullYear();
                    let month_val: number = this._currDate.getMonth();
                    let day_val: number = this._currDate.getDay();
                    let openDate_str: string = year_val + "-" + (month_val < 10 ? "0" + month_val : month_val) + "-" + (day_val < 10 ? "0" + day_val : day_val);
                    if (DataManager.IOS_PAY_OPENDATE.indexOf(openDate_str) == -1) {
                        return true;
                    }
                }
                //时间区间判断
                if (DataManager.IOS_PAY_ZONETIME) {
                    for (let i: number = 0; i < DataManager.IOS_PAY_ZONETIME.length; i++) {
                        let zonetime_param: string[] = DataManager.IOS_PAY_ZONETIME[i].split("-");
                        let start_param: string[] = zonetime_param[0].split(":");
                        let start_Time: number = parseInt(start_param[0]) * 60 + parseInt(start_param[1]);
                        let end_param: string[] = zonetime_param[1].split(":");
                        let end_Time: number = parseInt(end_param[0]) * 60 + parseInt(end_param[1]);
                        let cur_Time: number = this._currDate.getHours() * 60 + this._currDate.getMinutes();
                        if (start_Time > end_Time) {
                            if (cur_Time > end_Time && end_Time < start_Time) {
                                return true;
                            }
                        } else {
                            if (cur_Time < start_Time || cur_Time > end_Time) {
                                return true;
                            }
                        }
                    }
                }
            }
            //达成条件后开放开关
            if (this._iosPayOpen) return false;
            //根据条件
            let player: Player = DataManager.getInstance().playerManager.player;
            if (DataManager.IOS_PAY_OPENMISSION <= GameFight.getInstance().yewai_waveIndex || DataManager.IOS_PAY_LEVEL <= player.level) {
                this._iosPayOpen = true;
                return false;
            }
        } catch (e) {
            egret.log("~~~ERROR!!! FOR IOS PAY SERVER PARAM!!");
        }

        return true;
    }
    /**判断是否为IOS**/
    public static get isIphone(): boolean {
        let phone_sysinfo = this.loginInfo['wx_phone_sysinfo'];
        if (phone_sysinfo && phone_sysinfo.model.indexOf('iPhone') >= 0) {
            return true;
        }
        return false;
    }
    /**获取刘海屏判断**/
    public static get isBangsscreen(): boolean {
        if (this.loginInfo['wx_phone_sysinfo']) {
            let phone_sysinfo = this.loginInfo['wx_phone_sysinfo'];
            let liuhai_mode_names: string[] = ['iPhone X', 'zenfone5', 'novs3e', 'OPPO R15', 'OPPO A3', 'BKL-AL20', "LYA-AL00", 'CLT-AL0', 'VIVO X21', 'VIVO Y85', 'OnePlus 6'];
            for (let i: number = 0; i < liuhai_mode_names.length; i++) {
                if (phone_sysinfo.model.indexOf(liuhai_mode_names[i]) >= 0) {
                    return true;
                }
            }
        }

        return false;
    }
    /**获取低端机型**/
    private static _islowphone: boolean = null;
    public static get islowphone(): boolean {
        if (this._islowphone == null) {
            this._islowphone = false;
            if (this.loginInfo['wx_phone_sysinfo']) {
                let phone_sysinfo = this.loginInfo['wx_phone_sysinfo'];
                let systemInfo: string = phone_sysinfo.system;
                if (systemInfo && systemInfo.indexOf("Android") > -1) {
                    let num = systemInfo.substr(systemInfo.indexOf("android") + 8, 3);
                    if ((/4.|5./i).test(num)) {
                        this._islowphone = true;
                    }
                }
            }
        }
        return this._islowphone;
    }
    public static getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2].toString();
        return null;
    }
    //THE END
}