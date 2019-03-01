/**
 * 独角兽统计
 */
class SDKUnicorn implements ISDKStatistics{
    private static _instance: SDKUnicorn;
    constructor(){}

    // 没有强制限制，仿一个Singleton
    public static getInstance(): SDKUnicorn {
        if (this._instance == null) {
            this._instance = new SDKUnicorn();
        }
        return this._instance;
    }

    private static STATISTICS_APPID = "cj8xZkC8XS87b";
    private static DEFAULT_VALUE = "unknown";
    /** 统计服务器地址 */
    private static STATISTICS_BASE_URL:string = "http://log.gank-studio.com";
    /** 注册统计地址 */
    private static STATISTICS_REGISTER_URL:string = SDKUnicorn.STATISTICS_BASE_URL + "/receive/register";
    /** 登陆统计地址 */
    private static STATISTICS_LOGIN_URL:string = SDKUnicorn.STATISTICS_BASE_URL + "/receive/login";


    public onCreateRole(loginInfo:ILoginInfo, playerInfo: IPlayerInfo) :void{
        /**
         * 参数名	是否必填	参数类型	参数长度	说明
         * appid	是	字符串	最长64	应用appid
           who	是	字符串	最长64	账户ID
           deviceid	是	字符串	128	设备ID
           serverid	否	字符串	最长16        默认：unknown	服务器ID
           channelid	否	字符串	最长16    默认：unknown	渠道ID
           idfa	否	字符串	默认：unknown	广告标识符
           idfv	否	字符串	默认：unknown	Vindor标示符
           accounttype	否	字符串	最长16    默认：unknown	账户类型
           gender	否	字符串	男：1 女：0 其他：2        默认：unknown	账户性别
           age	否	字符串	年龄范围：0-120  默认：-1	账户年龄
         */
        var info = loginInfo;
        var DEFINE = SDKUnicorn;
        var params = {
            appid : DEFINE.STATISTICS_APPID,
            who : info.account,
            deviceid : DEFINE.DEFAULT_VALUE,
            serverid :  <string><any> info.serverId,
            channelid : info.channel,
            idfa : DEFINE.DEFAULT_VALUE,
            idfv : DEFINE.DEFAULT_VALUE,
            accounttype : DEFINE.DEFAULT_VALUE,
            gender : DEFINE.DEFAULT_VALUE,
            age : DEFINE.DEFAULT_VALUE
        };
        var str:string  = JSON.stringify(params);
        // test code 
        //egret.log("onRegister" + str);
        HttpUtil.sendPostStringRequest(SDKUnicorn.STATISTICS_REGISTER_URL, this.onRegisterCompleted, this, str);
    }  

    private onRegisterCompleted(event: egret.Event):void{
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        if (result.status != 0) {
            //this.onCreateRole();    
            egret.error("SDKUnicorn.onRegisterCompleted() failed. result="+ result.status);        
        }else{
            //egret.log("SDKUnicorn.onRegisterCompleted() success.");
        }
    }

    public onEnterGame(loginInfo:ILoginInfo, playerInfo: IPlayerInfo): void {
        /**
         *  参数名	是否必填	参数类型	参数长度	说明
            appid	是	字符串	最长64	应用appid
            who	是	字符串	最长64	账户ID
            deviceid	是	字符串	128	设备ID
            idfa	否	字符串	默认：unknown	广告标识符
            idfv	否	字符串	默认：unknown	Vindor标示符
            serverid	否	字符串	最长16    默认：unknown	服务器ID
            channelid	否	字符串	最长16    默认：unknown	渠道ID
            level	否	字符串	等级范围：0-1000     默认：-1	账户等级
         */
        var info = loginInfo;
        var DEFINE = SDKUnicorn;
        var params = {
            appid : DEFINE.STATISTICS_APPID,
            who : info.account,
            deviceid : DEFINE.DEFAULT_VALUE,
            idfa : DEFINE.DEFAULT_VALUE,
            idfv : DEFINE.DEFAULT_VALUE,
            serverid : <string><any> info.serverId,
            channelid : info.channel,
            level : playerInfo.level
        };
        var str:string  = JSON.stringify(params);
        // test code 
        //egret.log("onLogin:" + str);
        HttpUtil.sendPostStringRequest(SDKUnicorn.STATISTICS_LOGIN_URL, this.onLoginCompleted, this, str);
    }

    private onLoginCompleted(event: egret.Event):void{
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        if (result.status != 0) {
            egret.log("SDKUnicorn.onLoginCompleted() failed. result="+ result.status);     
        }else{
            egret.log("SDKUnicorn.onLoginCompleted() success.");
        }
    }

    public init(info: ILoginInfo){
    }
}
