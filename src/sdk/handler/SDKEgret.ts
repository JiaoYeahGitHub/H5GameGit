class SDKEgret implements ISDKHandler {
    public info: ILoginInfo;
    public loginCallback: () => void;
    public loginFailed: () => void;
    private static _instance: SDKEgret;
    constructor() { }

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKEgret {
        if (this._instance == null) {
            this._instance = new SDKEgret();
        }
        return this._instance;
    }

    private APPID = 91284;

    // 请求路径
    private loginPath: string = "login";
    // 关注奖励检查
    private focusPath: string = "focus";

    // 关注
    private attention: number;
    // 分享
    private _isSupportShare;
    // spid 
    private _spid: number;
    // 平台
    private _platform: string;

    public get spid(): number {
        return this._spid;
    }

    public get isSupportShare() {
        return this._isSupportShare;
    }

    public init() {

    };

    public login(): void {
        this._spid = <number><any>SDKUtil.getQueryString("egret.runtime.spid");
        this._platform = SDKUtil.getQueryString("egretPlat");

        var adFrom = SDKUtil.getQueryString("adId");
        if (adFrom) {
            var ad: IADInfo = {
                adFrom: adFrom,
                deviceId: SDKUtil.getQueryString("deviceId"),
                mac: SDKUtil.getQueryString("mac"),
                imei: SDKUtil.getQueryString("imei"),
                wd: SDKUtil.getQueryString("wd"),
                netType: SDKUtil.getQueryString("netType"),
                brand: SDKUtil.getQueryString("brand"),
                model: SDKUtil.getQueryString("model"),
                spid: this._spid
            }
            this.info.adFrom = ad;
        }

        var info: any = {};
        //设置游戏id。如果是通过开放平台接入，请在开放平台游戏信息-》基本信息-》游戏ID 找到。
        info.egretAppId = this.APPID;
        //设置使用 Nest 版本。请传递2
        info.version = 2;
        //在debug模式下，请求nest接口会有日志输出。建议调试时开启
        info.debug = false;

        var self = this;
        nest.easyuser.startup(info, function (data) {
            if (data.result == 0) {
                self.loginType();
            }
            else {
                //初始化失败，可能是url地址有问题，请联系官方解决
                self.loginFailed()
            }
        })
    }

    private loginType(): void {
        var loginTypes: Array<nest.easyuser.ILoginType> = nest.easyuser.getLoginTypes();

        if (loginTypes.length) {//需要显示对应的登录按钮

        } else {//不需要登录按钮，直接调用登录进游戏
            // nest.easyuser.login({}, function (data:nest.user.LoginCallbackInfo) {
            //     if (data.result == 0) {
            //         egret.log("log Success");
            //         //new Login().login(data);
            //          this.getUserInfo(data, this.onGetUserInfoCallback);
            //     }
            //     else {
            //         egret.log("log Fail");
            //     }
            // });
            nest.easyuser.login({}, this.onLoginCallback.bind(this));
        }
    }

    private onLoginCallback(data: nest.user.LoginCallbackInfo): void {
        if (data.result == 0) {
            var url = ChannelDefine.createURL(
                this.info,
                this.loginPath,
                { "token": data.token });
            HttpUtil.sendGetRequest(url, this.onGetUserInfoCallback, this);
        }
        else {
            //登录失败
            alert("登录失败");
            location.reload();
        }
    }

    private onGetUserInfoCallback(event: egret.Event) {
        var self = this;
        nest.app.isSupport({}, function (data) {
            //获取是否支持 nest.app.attention 接口，有该字段并且该字段值为1表示支持，0表示不支持，2表示已关注
            //已关注的信息在某些平台可能获取不到，请不要过渡依赖该信息，如果游戏有首次关注奖励可以自行在后台存储
            self.info.focus = data.attention == 1 ? false : true;
            self.attention = data.attention;
        })
        nest.share.isSupport({}, function (data) {
            //获取是否支持nest.share.share接口，有该字段并且该字段值为1表示支持
            self._isSupportShare = data.share;
        })

        var request = <egret.HttpRequest>event.currentTarget;
        var data = JSON.parse(request.response);
        this.info.account = data.data.id;
        this.info.nickName = data.data.name;
        this.info.avatarUrl = data.data.pic;
        this.loginCallback();
    }

    private static GOODS_DEFINE = {
        10: 2,
        20: 3,
        50: 4,
        100: 5,
        200: 6,
        500: 7,
        1000: 8,
        2000: 9,
        28: 10,
        88: 11,
        6: 12,
        18: 13,
        98: 14,
        198: 15,
        488: 16,
        998: 17,
        1998: 18,
        30: 19
    }

    public pay(payInfo: IPayInfo, owner: ISDKPayContainer): void {
        //透传参数
        var ext;
        if (this.info.adFrom) {
            ext = {
                playerId: this.info.playerId,
                chanId: this.info.adFrom.spid,
                adId: this.info.adFrom.adFrom,
                level: payInfo.playerInfo.level,
                goodsName: payInfo.goodsName
            }
        } else {
            ext = {
                playerId: this.info.playerId,
            }
        }
        var info: any = {};
        //购买物品id，在开放平台配置的物品id
        info.goodsId = SDKEgret.GOODS_DEFINE[payInfo.amount];

        //IOS22698渠道特殊处理
        if (this.isIOS22698()) {
            var money: number = this.getIOS22698(parseInt(payInfo.amount.toString()));
            info.goodsId = SDKEgret.GOODS_DEFINE[money];
        }

        //购买数量，当前默认传1，暂不支持其他值
        info.goodsNumber = "1";
        //所在服
        info.serverId = this.info.serverId;

        info.ext = JSON.stringify(ext);
        //egret.log(info.ext);
        nest.iap.pay(info, function (data) {
            if (data.result == 0) {
                //支付成功
                console.log("pay success");
            }
            else if (data.result == -1) {
                //支付取消
                console.log("pay cancel");
            }
            else if (data.result == -3) {//平台登陆账号被踢掉，需要重新登陆
                console.log("pay exit");
            }
            else {
                //支付失败
                console.log("pay fail");
            }
        })
    }

    public subscribe(): void {
        var self = this;
        nest.app.attention({}, function (data) {
            if (data.result == 0) {
                //关注成功
                self.sendFocus();
            }
            else if (data.result == -1) {
                //关注取消
            }
            else if (data.result == -3) {
                //平台登陆账号被踢掉，需要重新登陆
            }
            else {
                //关注失败
            }
        })
    }

    public sendFocus(): void {
        var url = ChannelDefine.createURL(
            this.info,
            this.focusPath,
            {
                "uid": this.info.account,
                "server_id": this.info.serverId,
                "player_id": this.info.playerId
            });
        HttpUtil.sendGetRequest(url, null, this);
    }

    public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        try {
            nest.role.isSupport({}, function (data) {
                //获取是否支持
                var create = data.create == 1; //创建角色接口              该字段值为1表示支持
                var report = data.report == 1; //进入游戏上报角色信息接口  该字段值为1表示支持
                var update = data.update == 1; //角色升级角色接口          该字段值为1表示支持

                //如果支持创角接口
                if (report) {
                    //参数需要替换为游戏真实数据
                    var info: any = {};
                    //服务器ID  int，非必要
                    info.serverId = loginInfo.serverId;
                    //服务器名称，string，非必要
                    info.serverName = "";
                    //昵称，string 非必要
                    info.nickName = loginInfo.nickName ? loginInfo.nickName : "";
                    //角色ID，int/string，非必要
                    info.roleId = playerInfo.id;
                    //角色名称，string，非必要
                    info.roleName = playerInfo.name;
                    //角色等级，int/string，非必要
                    info.level = playerInfo.level;

                    nest.role.report(info, function (data) {
                        if (data.result == 0) {
                            //调用成功
                            Tool.log("nest.role.report().");
                        } else if (data.result == -3) {
                            //平台登陆账号被踢掉，需要重新登陆
                            Tool.log("nest.role.report() failed. result=-3");
                        } else {
                            //调用失败
                            Tool.log("nest.role.report() failed. result=" + data.result);
                        }
                    });
                }
            });
        } catch (e) {
            egret.log(e.message);
        }
        if (this.attention == 2) {
            this.sendFocus();
        }
    }


    public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        try {
            nest.role.isSupport({}, function (data) {
                //获取是否支持
                var create = data.create == 1; //创建角色接口              该字段值为1表示支持
                var report = data.report == 1; //进入游戏上报角色信息接口  该字段值为1表示支持
                var update = data.update == 1; //角色升级角色接口          该字段值为1表示支持
                //如果支持创角接口
                if (create) {
                    //参数需要替换为游戏真实数据
                    //角色包含的信息
                    var info: any = {};

                    //服务器ID  int，非必要
                    info.serverId = loginInfo.serverId;
                    //服务器名称，string，非必要
                    info.serverName = "";
                    //昵称，string 非必要
                    info.nickName = loginInfo.nickName ? loginInfo.nickName : "";
                    //角色ID，int/string，非必要
                    info.roleId = playerInfo.id;
                    //角色名称，string，非必要
                    info.roleName = playerInfo.name;
                    //角色等级，int/string，非必要
                    info.level = playerInfo.level;

                    nest.role.create(info, function (data) {
                        if (data.result == 0) {
                            //调用成功
                            Tool.log("nest.createRole.createRole().");
                        } else if (data.result == -3) {
                            //平台登陆账号被踢掉，需要重新登陆
                            Tool.log("nest.createRole.createRole() failed. result=-3");
                        } else {
                            //调用失败
                            Tool.log("nest.createRole.createRole() failed. result=" + data.result);
                        }
                    });
                }
            });
        } catch (e) {
            egret.log(e.message);
        }
    }


    public onLevelup(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
        try {
            nest.role.isSupport({}, function (data) {
                //获取是否支持
                var create = data.create == 1; //创建角色接口              该字段值为1表示支持
                var report = data.report == 1; //进入游戏上报角色信息接口  该字段值为1表示支持
                var update = data.update == 1; //角色升级角色接口          该字段值为1表示支持
                //如果支持创角接口
                if (update) {
                    //参数需要替换为游戏真实数据
                    //角色包含的信息
                    var info: any = {};

                    //服务器ID  int，非必要
                    info.serverId = loginInfo.serverId;
                    //服务器名称，string，非必要
                    info.serverName = "";
                    //昵称，string 非必要
                    info.nickName = loginInfo.nickName ? loginInfo.nickName : "";
                    //角色ID，int/string，非必要
                    info.roleId = playerInfo.id;
                    //角色名称，string，非必要
                    info.roleName = playerInfo.name;
                    //角色等级，int/string，非必要
                    info.level = playerInfo.level;

                    nest.role.update(info, function (data) {
                        if (data.result == 0) {
                            //调用成功
                            Tool.log("nest.role.update().");
                        } else if (data.result == -3) {
                            //平台登陆账号被踢掉，需要重新登陆
                            Tool.log("nest.role.update() failed. result=-3");
                        } else {
                            //调用失败
                            Tool.log("nest.role.update() failed. result=" + data.result);
                        }
                    });
                }
            });
        } catch (e) {
            egret.log(e.message);
        }
    }



    public share(owner: ISDKShareContainer): void {
        var info: any = {};
        //分享标题
        info.title = "神游记修仙巨作";
        //分享文字内容
        info.description = "飞升境界，组队开黑，一起来神游修仙！";
        //分享链接
        info.url = "";
        //分享图片URL
        info.imageUrl = "";

        var self = this;

        if (self._spid == 22373) {
            try {
                (<any>window).DakaShareSuccess = (owner.shareComplete);
                return;
            } catch (e) {
                egret.error(e.message);
            }
        }

        nest.share.share(info, function (data) {
            if (data.result == 0) {
                //分享成功
                //10016-1758渠道特殊处理
                if (self.spid != 10016) {
                    owner.shareComplete();
                }
            }
            else if (data.result == -1) {
                //分享取消
            }
            else if (data.result == -3) {
                //平台登陆账号被踢掉，需要重新登陆
            }
            else {
                //分享失败
            }
        })
    }

    public isIOS22698(): boolean {
        if (this._spid == 22698 && this._platform == "ios_micro") {
            return true;
        }
        return false;
    }

    /**
     * 得到IOS spid:22698 充值项
     */
    public getIOS22698(money: number): number {
        switch (money) {
            case 10:
                money = 6;
                break;
            case 20:
                money = 18;
                break;
            case 100:
                money = 98;
                break;
            case 200:
                money = 198;
                break;
            case 500:
                money = 488;
                break;
            case 1000:
                money = 998;
                break;
            case 2000:
                money = 1998;
                break;
            case 28:
                money = 30;
                break;
        }
        return money;
    }
}