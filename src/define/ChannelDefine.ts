enum EChannel {
    CHANNEL_AWY = 1001, //爱微游
    CHANNEL_CRAZY = 1002,   // 疯狂游乐场
    CHANNEL_YYB = 1003,     // 应用宝
    CHANNEL_EGRET = 1004,   // 白鹭
    CHANNEL_WANBA = 1005,   // 玩吧
    CHANNEL_AQY = 1006,     //爱奇艺
    CHANNEL_JINBANG = 1007, // 金榜
    CHANNEL_360 = 1008,       //360
    CHANNEL_QUICK = 1010,     //quick
    CHANNEL_SHENQI = 1013,     //神奇
    CHANNEL_YYBQUICK = 1014,     //应用宝微端
    CHANNEL_KAOPUGP = 1015,     //靠谱助手
    CHANNEL_VIVO = 1016,       //VIVO
    CHANNEL_HUAWEI = 1017,     //华为
    CHANNEL_SOEZ = 1018,     //速易soeasy
    CHANNEL_QUNHEI = 1019,     //群黑
    CHANNEL_YIYOU = 1020,     //益游
    CHANNEL_HUIYOU = 1021,     //惠游（ios越狱）
    CHANNEL_WXGAMEBOX = 1022,   //微信盒子
    CHANNEL_NEZHA = 1023,   //nezhaios
    CHANNEL_LOCAL = 10000,   // 本地
};


class ChannelDefine {
    public static RET = "ret";
    public static SUCCESS = "0";
    public static ERROR = "-1";
    public static checkResult(result): boolean {
        if (!result[ChannelDefine.RET]) {
            return false;
        }
        if (result[ChannelDefine.RET] != ChannelDefine.SUCCESS) {
            return false;
        }
        return true;
    }

    /**
     * js库
     */
    private static CHANNEL_LIBS = {
        CHANNEL_AWY: ["libs/SDK/SDKAWYJS.js", "https://cdn.11h5.com/static/js/sdk.min.js"],
        CHANNEL_CRAZY: ["libs/SDK/SDKCrazyJS.js", "http://h5.hortorgames.com/sdk/sdk_agent.min.js"],
        CHANNEL_YYB: ["libs/SDK/SDKYYBJS.js", "http://qzonestyle.gtimg.cn/open/mobile/h5gamesdk/build/sdk.js"],
        CHANNEL_EGRET: [],
        CHANNEL_WANBA: ["libs/SDK/SDKWanBa.js"],
        CHANNEL_JINBANG: ["libs/SDK/SDKJinBang.js", "https://cdn.99kgames.com/js/tpgame_sdk.min.js"],
        CHANNEL_360: ["libs/SDK/SDK360JS.js", "http://h5.wan.360.cn/h5-cp-sdk-loader.js"],
        CHANNEL_QUICK: ["libs/SDK/SDKQuickJS.js", "https://sdkapi02.quicksdk.net/static/lib/libQuickSDKH5_To_Client.js"],
        CHANNEL_SHENQI: ["libs/SDK/SDKQuickJS.js", "https://sdkapi02.quicksdk.net/static/lib/libQuickSDKH5_To_Client.js"],
        CHANNEL_YYBQUICK: ["libs/SDK/SDKQuickJS.js", "https://sdkapi02.quicksdk.net/static/lib/libQuickSDKH5_To_Client.js"],
        CHANNEL_KAOPUGP: ["libs/SDK/SDKKAOPUJS.js", "http://down.kaopu001.com/H5SDK/SuperSDK/JS/supersdk.min.js"],
        CHANNEL_VIVO: ["libs/SDK/SDKVIVOJS.js", "libs/SDK/h5game.min.js"],
        CHANNEL_HUAWEI: ["libs/SDK/SDKHWJS.js", ""],
        CHANNEL_SOEZ: ["libs/SDK/SDKEZ.js", "https://cn.soeasysdk.com/soeasysr/zm_engine_v2.js"],
        CHANNEL_QUNHEI: ["libs/SDK/SDKEZ.js", "https://cn.soeasysdk.com/soeasysr/zm_engine_v2.js"],
        CHANNEL_YIYOU: ["libs/SDK/SDKYUJS.js", "//h5.h5youyou.com/assets/v0.1.0/sdk.js"],
        CHANNEL_HUIYOU: ["libs/SDK/SDKHUIYOUJS.js"],
        CHANNEL_NEZHA: ["libs/SDK/SDKNeZha.js", "//h5-img.binglue.com/js/sdk_game2.js?v=1.0"],
        CHANNEL_LOCAL: [],
    };
    /**
     *白鹭统计chanId 
     */
    public static STATISTICS_CHANID = {
        CHANNEL_WANBA: 10080,
        // CHANNEL_AWY: 18255
    }

    /**
     * 获取当前渠道须要的js库
     */
    public static getLibs(channel: EChannel): Array<string> {
        var name: string = EChannel[channel];
        return ChannelDefine.CHANNEL_LIBS[name];
    }

    /**
     * 登录地址
     */
    private static LOGON_URL = {
        CHANNEL_AWY: "https://azxlogin.ih5games.com:20000",
        CHANNEL_CRAZY: "https://csylogin.ih5games.com:20000",
        CHANNEL_360: "http://360syjlogin.ih5games.com:20000",
        CHANNEL_QUICK: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_SHENQI: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_YYBQUICK: "https://kpsyjlogin.ih5games.com:20000",
        CHANNEL_YYB: "http://211.159.156.144:10000",
        CHANNEL_EGRET: "http://120.92.90.21:10000",
        CHANNEL_WANBA: "https://wzxlogin.ih5games.com:20000",
        CHANNEL_JINBANG: "http://ssss.milgame.cn:10000",
        CHANNEL_KAOPUGP: "https://kpsyjlogin.ih5games.com:20000",
        CHANNEL_VIVO: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_HUAWEI: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_SOEZ: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_QUNHEI: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_YIYOU: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_HUIYOU: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_WXGAMEBOX: "https://jpsx-login.szfyhd.com/loginServer",
        CHANNEL_NEZHA: "https://qsyjlogin.ih5games.com:20000",
        CHANNEL_LOCAL: "http://192.168.1.100:21000"
    }
    /**
     * CDN地址
     */
    private static CDN_URL = {
        CHANNEL_WXGAMEBOX: `https://jpsx-login.szfyhd.com/FENGYUN_${DataManager.res_ver}/`,
        CHANNEL_LOCAL: ""
    }
    private static _cdnUrl: string;
    public static get cdnUrl(): string {
        if (platform.isLocalTest()) {
            return ChannelDefine.CDN_URL[EChannel.CHANNEL_LOCAL];
        } else {
            var name: string = EChannel[SDKManager.loginInfo.channel];
            return ChannelDefine.CDN_URL[name];
        }
    }
    /**
     * 获取当前渠道须要的logon地址
     */
    public static getUrl(channel: EChannel): string {
        if (platform.isLocalTest()) {
            return ChannelDefine.LOGON_URL[EChannel.CHANNEL_LOCAL];
        } else {
            var name: string = EChannel[channel];
            return ChannelDefine.LOGON_URL[name];
        }
    }

    public static createURL(loginInfo: ILoginInfo, path: string, params: any): string {
        var url = loginInfo.url + "/sdk/" + loginInfo.channel + "/" + path;
        if (params) {
            url += "?";
        }
        for (var v in params) {
            url += v + "=" + params[v] + "&";
        }
        return url;
    }
}