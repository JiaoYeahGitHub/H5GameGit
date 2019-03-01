/**
 * 白鹭统计
 */
// class SDKEgretsa implements ISDKStatistics {
//     private static _instance: SDKEgretsa;
//     constructor() { }

//     // 没有强制限制，仿一个Singleton
//     public static getInstance(): SDKEgretsa {
//         if (this._instance == null) {
//             this._instance = new SDKEgretsa();
//         }
//         return this._instance;
//     }
//     private static STATISTICS_APPID = "536E30455557303D";

//     public init(info: ILoginInfo) {
//         var spid = SDKUtil.getQueryString("egret.runtime.spid");
//         if (!spid && info && ChannelDefine.STATISTICS_CHANID[info.channel]) {
//             spid = ChannelDefine.STATISTICS_CHANID[info.channel];
//         }
//         esa.EgretSA.init({ "gameId": SDKEgretsa.STATISTICS_APPID, "chanId": spid, "debug": false });
//     }
//     /** 注册统计 */
//     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
//         this.setAccount(loginInfo, playerInfo);
//     }
//     /** 登录统计 */
//     public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
//         this.setAccount(loginInfo, playerInfo);
//     }
//     /**加载统计**/
//     public loadingSetAccount(countType: GAMECOUNT_TYPE, desc: string, ): void {
//         try {
//             if (!SDKManager.getStatistics())
//                 return;

//             esa.EgretSA.loadingSet(countType, desc);
//         } catch (e) {
//             egret.log("统计出错!类型：" + countType + "~ 描述：" + desc);
//         }
//     }
//     /**新手统计**/
//     private _guideIndex: number = 0;
//     public openGuideAccount(): void {//开启新手引导统计
//         if (!SDKManager.getStatistics())
//             return;

//         this._guideIndex = 1;
//     }
//     public newUsersGuideAccount(desc: string): void {//需要先开启新手统计开关
//         try {
//             if (this._guideIndex > 0) {
//                 esa.EgretSA.newUsersGuideSet(this._guideIndex, desc);
//                 this._guideIndex++;
//             }
//         } catch (e) {
//             egret.log("统计出错!" + "~ 描述：" + desc);
//         }
//     }

//     public setAccount(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
//         try {
//             esa.EgretSA.player.init({
//                 egretId: loginInfo.account,
//                 level: playerInfo.level,
//                 serverId: loginInfo.serverId,
//                 playerName: playerInfo.name,
//                 diamond: playerInfo.gold,
//                 gold: playerInfo.money,
//                 gender: playerInfo.sex == SEX_TYPE.FEMALE ? 2 : 1
//             });
//             //egret.log("SDKEgretsa.setAccount() success. ");
//         } catch (e) {
//             egret.error("SDKEgretsa.setAccount() failed. " + e.message);
//         }
//     }

//     // public useDiamond(item:string, itemNumber:number, priceInDiamond:number){
//     //     try{
//     //         esa.EgretSA.player.init({ 
//     //             item: item,
//     //             itemNumber: itemNumber,
//     //         priceInDiamond: priceInDiamond});
//     //     }catch(e){
//     //         egret.error("SDKEgretsa.useDiamond() failed. " + e.message);
//     //     }

//     // }
// }