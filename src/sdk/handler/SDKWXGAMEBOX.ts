class SDKWXGAMEBOX implements ISDKHandler {
    public info: ILoginInfo;
    public payContainer: ISDKPayContainer;
    /** 登录成功回调 */
    loginCallback: () => void;
    /** 登录失败回调 */
    loginFailed: () => void;

    /**常量**/
    //小程序的APPID
    private readonly appid: string = "wx60bab776ca043f7c";
    //游戏标识
    private readonly identify: string = "jpsx";
    //小程序密钥
    private readonly appSecret: string = '701806b73d35b511d06bf1188ecd843d';
    //登录时的登录码
    private loginCode: string = '';
    private grant_type: string = 'authorization_code';
    //充值换算比
    private rmb_to_zuanshi_rate: number = 100;
    //充值程序APPID
    private pay_program_appid: string;
    //商户号
    // private mch_id: string = "1504364151";
    //米大师offer_id
    // private offer_id: string = '1450015780';
    // 登录请求路径
    private loginPath: string = "login";
    // 获取余额请求路径
    private balancePath: string = "create_order";
    // 扣费发货请求路径
    private payPath: string = "pay";
    // //分享场景列表
    // private share_scenes: number[] = [1007, 1008, 1044, 1096];
    //客服号
    // private ALL_SERVICES_CODES: string[] = ["bailu122333", "xiaoman20180724", "hanlu20180724", "mitu18187272", "mitu20180704",
    //     "xiaohan18180606", "guyu20180704", "xiaogui16161818", "pipi20180807"];
    // public serviceCode: string = 'xiaoman20180724';

    private static _instance: SDKWXGAMEBOX;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKWXGAMEBOX {
        if (this._instance == null) {
            this._instance = new SDKWXGAMEBOX();
        }
        return this._instance;
    }

    public async init() {
        //随机客服号
        // this.serviceCode = this.ALL_SERVICES_CODES[Tool.randomInt(0, this.ALL_SERVICES_CODES.length)];

        this.info['wx_phone_sysinfo'] = platform.getSystemInfoSync();
        let launchOption = await platform.getOption();
        let queryObj = launchOption && launchOption.query ? launchOption.query : null;
        //渠道ID：首先获取form做为channel_id,如果form为空则获取platform.getOption中的场景值scene，判断场景值是否为分享场景
        let channel_id: string = "test_channel_id";
        let subch_id: string = "test_sub_channel_id2";
        if (queryObj && queryObj.chid && queryObj.subchid) {
            channel_id = queryObj.chid;
            subch_id = queryObj.subchid;
        }

        let from: IADInfo = {
            adFrom: channel_id,
            subchid: subch_id
        }
        this.info.adFrom = from;

        /**微信用户信息**/
        // const userInfo = await platform.getUserInfo();
        // this.info.nickName = userInfo.nickName;
        // this.info.avatarUrl = userInfo.avatarUrl;
        // this.info.sex = userInfo.gender;

        /**兼听onshow事件**/
        // platform.onListenerShow(this.addListenerOnShow);
    }

    public async login() {
        let self = this;
        let launchOption = await platform.getOption();

        let fyhd_info_param = {
            client_id: self.appid,
            identify: self.identify,
            source_appid: launchOption ? launchOption.referrerInfo.appId : "",
            channel_id: self.info.adFrom.adFrom,
            sub_channel_id: self.info.adFrom.subchid
        }

        window.fySDK.getFyhd().getFyhdUserInfo(fyhd_info_param, false, function (request) {
            // console.log('getFyhdUserInfo:::' + JSON.stringify(request));

            if (request.err_code == 1) {
                let user = request.result.user;
                self.info.account = user.openid;
                self.info.sign = user.sign;//encodeURIComponent(info.session_key);
                //提审版本判断
                let game_ver: string = platform.getEnvVersio();
                if (game_ver == "undefined" || game_ver == "develop" || game_ver == "trial") {
                    DataManager.isRelease = false;
                } else {
                    DataManager.isRelease = true;
                }
                SDKManager.loginSuccessCallBack();

                // self.onGetAllServerRecharge();
                self.onCheckIosPayLimit();
            } else {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_SDK_LOGIN_FAIL), `登录失败！errMsg::` + request.err_msg);
            }
        });
    }
    /**点击上报**/
    // private async sendReportClick() {
    //     //点击上报
    //     let launchOption = await platform.getOption();
    //     let queryObj = launchOption && launchOption.query ? launchOption.query : null;
    //     if (queryObj && queryObj.materialID && Tool.isNumber(parseInt(queryObj.materialID))) {
    //         SDKWXGameBoxSA.getInstance().onReportClick(this.appid, queryObj.materialID, this.info.account);
    //     }
    // }
    /**请求城市信息**/
    // private onRequestCitySignInfo(): void {
    //     var url = ChannelDefine.createURL(this.info, "request_city", null);
    //     HttpUtil.sendGetRequest(url, this.onGetCitySignObj, this);
    // }
    // private onGetCitySignObj(event: egret.Event): void {
    //     var request = <egret.HttpRequest>event.currentTarget;
    //     var info = JSON.parse(request.response);
    //     var url: string = `https://cpgc.phonecoolgame.com/address/getClientAddress`;
    //     var httpRqt = new egret.HttpRequest();
    //     httpRqt.responseType = egret.HttpResponseType.TEXT;
    //     httpRqt.open(url, egret.HttpMethod.POST);
    //     httpRqt.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //     httpRqt.send(info);
    //     httpRqt.addEventListener(egret.Event.COMPLETE, this.onGetCityInfo, this);
    // }
    // private onGetCityInfo(event: egret.Event): void {
    //     var request = <egret.HttpRequest>event.currentTarget;
    //     var info = JSON.parse(request.response);
    //     if (info.ecode == 0) {
    //         // console.log('拉取城市信息成功！');
    //         DataManager.CITY_INFO = info;
    //     } else {
    //         console.log(`拉取城市信息失败${info.ecode}：` + info.msg);
    //     }
    // }
    /**获取全服充值总金额**/
    // public onGetAllServerRecharge(): void {
    //     let url = ChannelDefine.createURL(this.info, "get_total_pay", { account: this.info.account });
    //     HttpUtil.sendGetRequest(url, this.onReciveAllServerRecharge, this);
    // }
    // private onReciveAllServerRecharge(event: egret.Event): void {
    //     var request = <egret.HttpRequest>event.currentTarget;
    //     DataManager.getInstance().playerManager.rechargeRMB = parseInt(request.response);
    //     // console.log(`Total Recharge R::::` + DataManager.getInstance().playerManager.rechargeRMB);
    // }
    /**获取IOS充值屏蔽信息**/
    public onCheckIosPayLimit(): void {
        let envVersion: string = platform.getEnvVersio();
        switch (envVersion) {
            case "undefined":
            case "develop":
                envVersion = "develop";
                break;
            case "trial":
                envVersion = "trial";
                break;
            default:
                envVersion = "release";
                break;
        }
        let param = {
            client_id: this.appid,
            channel_id: this.info.adFrom.adFrom,
            openid: this.info.account,
            envVersion: envVersion  //枚举develop: 开发版, trial: 体验版, release: 正式版
        }

        egret.log("print ios pay limit ::::" + JSON.stringify(param));
        window.fySDK.getFyhd().paylimit(param, function (result) {
            DataManager.IOS_PAY_ISOPEN = result.is_open;
            DataManager.IOS_PAY_OPENMISSION = result.mission;
            DataManager.IOS_PAY_LEVEL = result.level;
            if (result.open_date) {
                DataManager.IOS_PAY_OPENDATE = result.open_date;
            }
            if (result.time_zones) {
                DataManager.IOS_PAY_ZONETIME = result.time_zones;
            }
            egret.log("ios pay limit return::::" + JSON.stringify(result));
        });
    }
    /**支付**/
    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        try {
            var self = this;

            if (SDKManager.isHidePay) {
                return;
            }

            let sysinfo = SDKManager.loginInfo['wx_phone_sysinfo'];
            if (sysinfo && Tool.compareVersion(sysinfo.SDKVersion, '2.2.0') >= 0) {
                let curDate: Date = new Date(DataManager.getInstance().playerManager.player.currentTime + (egret.getTimer() - DataManager.getInstance().playerManager.player.signTime));
                let cporderid: string = `${self.info.playerId}${curDate.getFullYear()}${curDate.getMonth()}${curDate.getDay()}${curDate.getHours()}${curDate.getMinutes()}${curDate.getSeconds()}`;
                let payParam = {
                    identify: this.identify,//游戏标识 由渠道方提供
                    client_id: this.appid,//游戏appid
                    openid: this.info.account,//微信用户openid
                    goods_count: payInfo.amount * this.rmb_to_zuanshi_rate,//商品数量
                    goods_name: payInfo.goodsName,//商品名称
                    goods_des: payInfo.goodsName,//商品描述
                    goods_identifier: "diamond",//商品标识
                    pay_amount: payInfo.amount,//支付金额(元)
                    role_id: payInfo.playerInfo.id,//玩家ID
                    role_name: payInfo.playerInfo.name,//玩家名字
                    server_id: this.info.serverId,//服务器ID
                    server_name: `${this.info.gamename}${this.info.serverId}服`,//服务器名称
                    extra_info: `${this.info.serverId}_${payInfo.playerInfo.id}`,//服务器所需参数
                    redirect_uri: "https://jpsx-login.szfyhd.com/loginServer/SDK/SWF_EXCHANGE?",//充值回调地址
                    order_sn: cporderid//订单
                }

                window.fySDK.getFyhd().shanwan_pay(payParam, function (result) {
                    //暂不做处理
                    // console.log('shanwan_pay_param:::::::' + JSON.stringify(result)); 
                });
            } else {
                platform.openCustomerServiceConversation({});
            }
        } catch (e) {
            self.payFailHandler("支付失败！" + "\n" + "请联系客服人员。");
        }
    }
    private payFailHandler(payfailTxt: string): void {
        var payfailNotice = [{ text: payfailTxt, style: { textColor: 0xe63232 } }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(payfailNotice, function (): void {
                platform.openCustomerServiceConversation({});
            }, this)));
    }
    // /**
    //  * 请求余额
    //  */
    // private requestBalance(onPaySuccess: (event: egret.Event) => void) {
    //     var url = ChannelDefine.createURL(
    //         this.info,
    //         this.balancePath,
    //         {
    //             session_key: this.info.sign,
    //             openid: this.info.account,
    //             zone_id: 1,//this.info.serverId,
    //             pf: 'android',
    //             sand_box: DataManager.isRelease ? 'false' : 'true'
    //         });
    //     HttpUtil.sendGetRequest(url, onPaySuccess, this);
    // }
    // public onQueryBalance(onSuccess: () => void = null): void {
    //     var onGetBalance = function (event: egret.Event) {
    //         var request = <egret.HttpRequest>event.currentTarget;
    //         var result = JSON.parse(request.response);
    //         if (result.errcode != 0) {
    //             GameCommon.getInstance().addAlert('查询余额失败，请稍后再试。');
    //         } else {
    //             DataManager.getInstance().playerManager.balance = result.balance;
    //             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.QUERY_BALANCE_SUCCESS));
    //             onSuccess();
    //         }
    //     };
    //     this.requestBalance(onGetBalance);
    // }
    // /**
    //  * 请求支付
    //  **/
    // private requestPay(payInfo: IPayInfo): void {
    //     try {
    //         var self = this;
    //         var onSuccess = function (event: egret.Event) {
    //             var request = <egret.HttpRequest>event.currentTarget;
    //             var result = JSON.parse(request.response);
    //             if (result.errcode == 0) {
    //                 self.onPayCallBack(payInfo, result.bill_no);
    //             } else {
    //                 egret.log("支付失败:" + result.errcode + "," + result.errmsg);
    //                 self.onShowPayFailNotice();
    //             }
    //         };
    //         var amt: number = payInfo.amount * 10;
    //         var bill_no: string = `${this.info.serverId}_${payInfo.playerInfo.id}_${payInfo.amount}`;
    //         var goodsName = encodeURI(payInfo.goodsName + "x" + amt);
    //         var url = ChannelDefine.createURL(
    //             this.info,
    //             this.payPath,
    //             {
    //                 amt: amt,
    //                 bill_no: bill_no,
    //                 pay_item: goodsName,
    //                 session_key: this.info.sign,
    //                 openid: this.info.account,
    //                 zone_id: 1,//this.info.serverId,
    //                 pf: 'android',
    //                 sand_box: DataManager.isRelease ? 'false' : 'true',
    //             });
    //         HttpUtil.sendGetRequest(url, onSuccess, this);
    //     } catch (e) {
    //         this.onShowPayFailNotice();
    //     }
    // }
    // private onShowPayFailNotice(): void {
    //     this.onQueryBalance();

    //     var payfailTxt: string = "购买元宝失败！请您重新购买此额度元宝（重新购买此额度元宝将不再重新支付）";
    //     var payfailNotice = [{ text: payfailTxt, style: { textColor: 0xe63232 } }];
    //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
    //         new WindowParam("AlertFrameUI", new AlertFrameParam(payfailNotice, null, null)));
    // }
    // /**
    // * 调起微信米大师支付接口
    // **/
    // private async onWXPay(payInfo: IPayInfo) {
    //     var self = this;
    //     var amt: number = payInfo.amount * 10;
    //     var onSuccess = function () {
    //         self.requestPay(payInfo);
    //     };
    //     var onFail = function (result) {
    //         // egret.log("支付失败:" + result.errCode + "," + result.errMsg);
    //         var payfailTxt: string = "支付失败！错误码：" + result.errCode + "\n" + result.errMsg;
    //         var payfailNotice = [{ text: payfailTxt, style: { textColor: 0xe63232 } }];
    //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
    //             new WindowParam("AlertFrameUI", new AlertFrameParam(payfailNotice, null, null)));
    //     };
    //     let payParam = {
    //         mode: 'game',//购买类型
    //         env: DataManager.isRelease ? 0 : 1,//环境配置 0正式环境 1是沙箱环境
    //         offerId: this.offer_id,
    //         currencyType: 'CNY',
    //         platform: 'android',
    //         zoneId: 1,//this.info.serverId,
    //         buyQuantity: amt,
    //         success: onSuccess,
    //         fail: onFail
    //     }
    //     const payback = await platform.pay(payParam);
    // }
    // /**
    //  * 支付回调
    //  * 
    //  * */
    // private onPayCallBack(payInfo: IPayInfo, bill_no: string): void {
    //     GameCommon.getInstance().addAlert('支付成功');
    //     SDKManager.onPaySuccess(payInfo, bill_no);
    // }
    /**
     * 分享
     * 
     **/
    //分享参数
    // private shareMaterials;
    private SHARE_PIC: string = "https://jpsx-login.szfyhd.com/share_pic1.jpg";
    private SHARE_DESC: string = '跨服争武坛，三界争夺唯有你来战';
    private SHARE_QUERY: string = "";
    private refreshShareInfo(): void {
        let share_title: string[] = Constant.get(Constant.FANGKUAIWAN_SHARE_TITLE).split("#");
        if (share_title.length > 0) {
            this.SHARE_DESC = share_title[Tool.randomInt(0, share_title.length)];
        }
        let share_pics: string[] = Constant.get(Constant.FANGKUAIWAN_SHARE_PIC).split("#");
        if (share_pics.length > 0) {
            this.SHARE_PIC = share_pics[Tool.randomInt(0, share_pics.length)];
        }
        if (!this.SHARE_QUERY) {
            let query: string[] = Constant.get(Constant.FANGKUAIWAN_SHARE_QUERY).split("#");
            if (query.length > 0) {
                for (let i: number = 0; i < query.length; i++) {
                    this.SHARE_QUERY += query[i] + "&";
                }
                this.SHARE_QUERY += `inviteSrever=${this.info.serverId}&invitePlayerID=${this.info.playerId}`;
            }
        }
    }
    //拉取分享文案
    // public onQueryMaterials(): void {
    //     var url: string = `https://cpgc.phonecoolgame.com/material/getMaterials?appid=${this.appid}`;
    //     HttpUtil.sendGetRequest(url, this.onReciveMaterials, this);
    // }
    // private onReciveMaterials(event: egret.Event) {
    //     var request = <egret.HttpRequest>event.currentTarget;
    //     var result = JSON.parse(request.response);
    //     if (result.ecode == 0) {
    //         this.shareMaterials = result.data;
    //         // egret.log('分享文案拉取成功：\n');
    //         // console.log(this.shareMaterials);
    //         //设置右上角的分享
    //         if (this.shareMaterials) {
    //             let shareList = this.shareMaterials[1];
    //             if (shareList && shareList.length > 0) {
    //                 let shareInfo = shareList[Math.floor(Math.random() * shareList.length)];
    //                 let materialID: number = shareInfo['materialID'];
    //                 let share_title: string = shareInfo['content'];
    //                 let share_imgUrl: string = shareInfo['cdnurl'];
    //                 var onSuccess = function (m_id) {
    //                     if (m_id && Tool.isNumber(m_id)) {
    //                         SDKWXGameBoxSA.getInstance().onReportShare("wx2bf9ce61bb54a0fd", m_id);
    //                     }
    //                 };
    //                 platform.onShareAppMessage({
    //                     title: share_title,
    //                     imageUrl: share_imgUrl,
    //                     query: `inviteSrever=${this.info.serverId}&invitePlayerID=${this.info.playerId}&materialID=${materialID}`,
    //                     m_id: materialID,
    //                     success: onSuccess
    //                 });
    //             }
    //         }
    //     } else {
    //         egret.log('分享文案拉取失败!ecode========' + result.ecode);
    //     }
    // }
    //分享
    public share(owner: ISDKShareContainer, sharetype: WX_SHARE_TYPE): void {
        this.refreshShareInfo();
        //分享测试
        platform.onShare({
            title: this.SHARE_DESC,
            imageUrl: this.SHARE_PIC,
            query: this.SHARE_QUERY,
        });
        owner.shareComplete();
        // if (platform.isLocalTest() || DataManager.iscloseShare) {
        //     if (owner) {
        //         owner.shareComplete();
        //     }
        // } else {
        //     let random_str: string = "";
        //     let randomCharAry: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        //     for (let i: number = 0; i < 8; i++) {
        //         random_str += randomCharAry[Tool.randomInt(0, randomCharAry.length)];
        //     }
        //     GameSetting.setLocalSave(GameSetting.WX_SHARE_RANDOMSTR, random_str);
        //     let share_title: string;
        //     let share_imgUrl: string;
        //     let share_query: string = `inviteSrever=${this.info.serverId}&invitePlayerID=${this.info.playerId}&share_rdstr=${random_str}&share_tag=${sharetype}`;
        //     let materialID: number;

        //     if (this.shareMaterials && sharetype) {
        //         let shareList;//分享文案列表
        //         switch (sharetype) {
        //             case WX_SHARE_TYPE.INVITE_FRIEND:
        //                 shareList = this.shareMaterials[3];
        //                 break;
        //             default:
        //                 shareList = this.shareMaterials[1];
        //                 break;
        //         }
        //         if (shareList && shareList.length > 0) {
        //             let shareInfo = shareList[Math.floor(Math.random() * shareList.length)];
        //             materialID = shareInfo['materialID'];
        //             share_title = shareInfo['content'];
        //             share_imgUrl = shareInfo['cdnurl'];
        //         }
        //     }
        //     if (!share_title) {
        //         share_title = this.GAME_DESC;
        //         share_imgUrl = this.logoUrl;
        //     }
        //     if (materialID && Tool.isNumber(materialID)) {
        //         share_query = share_query + `&materialID=${materialID}`;
        //     }

        //     //调用分享SDK
        //     platform.onShare({
        //         title: share_title,
        //         imageUrl: share_imgUrl,
        //         query: share_query,
        //     });

        //     GameDispatcher.getInstance().dispatchEvent(
        //         new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
        //         new WindowParam("AlertDescUI", Language.instance.getText('error_tips_20001'))
        //     );
        // }
    }
    //获取微信群标识
    // public onGetWxGroupID(param): void {
    //     if (!param) return;
    //     let random_str: string = GameSetting.getLocalSetting(GameSetting.WX_SHARE_RANDOMSTR);
    //     //判断分享群功能
    //     if (random_str && param.shareTicket && param.query && param.query.share_rdstr && random_str == param.query.share_rdstr && param.query.share_tag) {
    //         let onSuccess = function (groupDecode: string): void {
    //             if (!groupDecode) {
    //                 GameCommon.getInstance().addAlert(Language.instance.getText('error_tips_20002'));
    //                 return;
    //             } else {
    //                 let curServerTime: number = DataManager.getInstance().playerManager.player.curServerTime;
    //                 let share_time: number = GameSetting.getLocalSetting(groupDecode) ? GameSetting.getLocalSetting(groupDecode) : null;
    //                 if (Tool.isNumber(share_time) && share_time + 3600 * 1000 > curServerTime) {
    //                     GameCommon.getInstance().addAlert(Language.instance.getText('error_tips_20003'));
    //                     return;
    //                 }
    //                 GameSetting.setLocalSave(groupDecode, curServerTime);
    //             }
    //             let share_type: WX_SHARE_TYPE = parseInt(param.query.share_tag);
    //             let share_message: Message;
    //             switch (share_type) {
    //                 case WX_SHARE_TYPE.INVITE_FRIEND://邀请好友
    //                     break;
    //                 case WX_SHARE_TYPE.OFFLINE_EXP://离线分享
    //                     if (DataManager.getInstance().playerManager.offlineAwdData.exp > 0) {
    //                         share_message = new Message(MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE);
    //                         share_message.setBoolean(true);
    //                         GameCommon.getInstance().sendMsgToServer(share_message);
    //                     }
    //                     break;
    //                 case WX_SHARE_TYPE.EVERYDAY_SHARE://每日分享
    //                     share_message = new Message(MESSAGE_ID.SHARE_COMPLETE_MESSAGE);
    //                     GameCommon.getInstance().sendMsgToServer(share_message);
    //                     break;
    //                 case WX_SHARE_TYPE.WEEKEND_SHARE://周末分享
    //                     // if (DataManager.getInstance().wxgameManager.weekend_shareNum >= this.MAX_GIFT_NUM) {
    //                     //     GameCommon.getInstance().addAlert('您已领取完当日全部奖励！');
    //                     //     return;
    //                     // }
    //                     // share_message = new Message(MESSAGE_ID.WXGAME_SHARE_WEEKEND_MESSAGE);
    //                     // share_message.setByte(DataManager.getInstance().wxgameManager.weekend_shareNum + 1);
    //                     // GameCommon.getInstance().sendMsgToServer(share_message);
    //                     break;
    //                 case WX_SHARE_TYPE.FIRST_SHARE://首次分享
    //                     share_message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
    //                     share_message.setBoolean(true);
    //                     share_message.setShort(GameDefine.FANGKUAI_FIRST_SHARE_LV);
    //                     GameCommon.getInstance().sendMsgToServer(share_message);
    //                     break;
    //                 case WX_SHARE_TYPE.LEVEL_SHARE://等级分享
    //                     let models = JsonModelManager.instance.getModellvyaoqing();
    //                     for (let lv in models) {
    //                         let model: Modellvyaoqing = models[lv];
    //                         if (DataManager.getInstance().wxgameManager.shareAwdLv < model.lv && DataManager.getInstance().playerManager.player.level >= model.lv) {
    //                             share_message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
    //                             share_message.setBoolean(true);
    //                             share_message.setShort(model.lv);
    //                             GameCommon.getInstance().sendMsgToServer(share_message);
    //                         }
    //                     }
    //                     break;
    //             }

    //             // if (param.query.materialID && Tool.isNumber(param.query.materialID)) {
    //             //     SDKWXGameBoxSA.getInstance().onReportShare("wx2bf9ce61bb54a0fd", param.query.materialID);
    //             // }
    //         }

    //         platform.getShareGroupID({
    //             appid: this.appid,
    //             session_key: this.info.sign,
    //             shareTicket: param.shareTicket,
    //             success: onSuccess
    //         });

    //         GameSetting.setLocalSave(GameSetting.WX_SHARE_RANDOMSTR, null);
    //     }
    // }
    /**登录检测 分享成功**/
    // public async onCheckShareSuccess() {
    //     let launchOption = await platform.getOption();
    //     if (launchOption && launchOption.query) {
    //         this.onGetWxGroupID(launchOption);
    //     }
    // }
    //The end
}