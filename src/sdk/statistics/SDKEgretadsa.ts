/**
 * 白鹭统计
 */
// class SDKEgretadsa implements ISDKStatistics {
//     private static _instance: SDKEgretadsa;
//     constructor() { }

//     // 没有强制限制，仿一个Singleton
//     public static getInstance(): SDKEgretadsa {
//         if (this._instance == null) {
//             this._instance = new SDKEgretadsa();
//         }
//         return this._instance;
//     }
//     private APPID = 91284;
//     private ad: IADInfo;
//     private changeTypeMapping = {
//         "0": "GM添加",
//         "10001": "脱装备获得",
//         "10002": "经脉升级奖励",
//         "10003": "竞技场场次奖励",
//         "10004": "挂机小怪获得",
//         "10005": "挂机Boss获得",
//         "10006": "副本获得",
//         "10007": "商城购买获得",
//         "10009": "剑池获得",
//         "10010": "使用物品获得",
//         "10011": "元魂求签获得",
//         "10012": "血战获得",
//         "10013": "熔炼获得",
//         "10014": "橙装合成增加",
//         "10015": "橙装升级增加",
//         "10016": "橙装分解增加",
//         "10017": "充值获得",
//         "10018": "BOSS探索获得",
//         "10019": "天梯赛季奖励",
//         "10020": "渡魂劫镖获得",
//         "10021": "渡魂完成获得",
//         "10022": "BOSS攻击获得",
//         "10023": "离线经验获得",
//         "10024": "通关奖励获得",
//         "10025": "七日登录获得",
//         "10026": "七日狂欢获得",
//         "10027": "关注奖励",
//         "10028": "分享奖励",
//         "10029": "在线礼包奖励",
//         "10030": "月卡奖励奖励",
//         "10031": "竞技场奖励",
//         "10032": "激活码兑换",
//         "10033": "百倍返利增加",
//         "10034": "投资计划增加",
//         "10035": "转盘增加",
//         "10036": "限时商城购买",
//         "10037": "限时有礼获得",
//         "10038": "帮派捐献获得",
//         "10039": "帮盘转盘获得",
//         "10040": "BOSS击杀获得",
//         "10041": "BOSS召唤获得",
//         "10042": "BOSS排名获得",
//         "10043": "每日福利获得",
//         "10044": "累计充值获得",
//         "10045": "每日排行榜获得",
//         "10046": "VIP礼包获得",
//         "10047": "武坛获得",
//         "10048": "VIP商城获得",
//         "10049": "摇钱树获得",
//         "10050": "春节集字获得",
//         "10051": "限时坐骑获得",
//         "10052": "神通抽取获得",
//         "10053": "神通领悟获得",
//         "10054": "春节签到获得",
//         "10055": "春节限时商城购买",
//         "10056": "累计消费获得",
//         "10057": "投资转盘获得",
//         "10058": "宝石镶嵌获得",
//         "10059": "宝石合成获得",
//         "10060": "宝石升级获得",
//         "10061": "宝石抽奖获得",
//         "10062": "一元抢购获得",
//         "10063": "一折神通购买获得",
//         "10064": "一折神通领奖获得",
//         "10065": "转生兑换获得",
//         "10066": "主宰装备分解获得",
//         "10067": "全民BOSS获得",
//         "10068": "法宝转盘获得",
//         "10069": "红装合成增加",
//         "10070": "红装升级增加",
//         "10071": "红装分解增加",
//         "10072": "寻宝增加",
//         "10073": "遭遇战获得",
//         "10074": "仓库提取获得",
//         "10075": "装备元神获得",
//         "10076": "限制礼包增加",
//         "10077": "元神分解增加",
//         "10078": "达标活动获得",
//         "10079": "副本扫荡获得",
//         "10080": "登录活动获得",
//         "10081": "消费红包活动获得",
//         "10082": "转生BOSS排行获得",
//         "10083": "转生BOSS击杀获得",
//         "10084": "遭遇战排行榜获得",
//         "10085": "充值盛宴获得",
//         "10086": "摇钱树领奖获得",
//         "10087": "摇钱树摇钱获得",
//         "10088": "帮会任务获得",
//         "10089": "渡劫复仇获得",
//         "10090": "帮派BOSS获得",
//         "10091": "脱下坐骑装备获得",
//         "10092": "帮会副本每日通关获得",
//         "10093": "寻宝排行榜获得",
//         "10094": "封测AVU登录奖励",
//         "10095": "封测AVU战力奖励",
//         "10096": "封测AVU等级奖励",
//         "10097": "封测白鹭登录奖励",
//         "10098": "封测白鹭战力奖励",
//         "10099": "封测白鹭等级奖励",
//         "10100": "封测白鹭充值奖励",
//         "10101": "许愿池奖励",
//         "10102": "礼包领取获得",
//         "10103": "红装碎片兑换获得",
//         "10104": "累充豪礼获得",
//         "10105": "连续充值获得",
//         "10106": "帮战分配获得",
//         "10107": "帮战获胜获得",
//         "10108": "节日消费获得",
//         "10109": "跨服竞技场获得",
//         "10110": "跨服竞技场全服奖励",
//         "10111": "跨服竞技场个人奖励",
//         "10112": "周末充值获得",
//         "10113": "福袋获得",
//         "10114": "宠物合成获得",
//         "10115": "宠物分解获得",
//         "10116": "宠物抽奖获得",
//         "20001": "强化消耗",
//         "20002": "被动技升级消耗",
//         "20003": "技能升级消耗",
//         "20004": "注灵消耗",
//         "20005": "熔炼消耗",
//         "20006": "坐骑升阶消耗",
//         "20007": "武器升阶消耗",
//         "20008": "翅膀升阶消耗",
//         "20009": "神装升阶消耗",
//         "20010": "法宝升阶消耗",
//         "20012": "脱装备消耗",
//         "20013": "神器升级消耗",
//         "20014": "经脉升级消耗",
//         "20015": "商城购买消耗",
//         "20016": "副本扫荡消耗",
//         "20017": "天梯购买次数消耗",
//         "20018": "元魂升级消耗",
//         "20019": "使用物品消耗",
//         "20020": "元魂求签消耗",
//         "20021": "镖车刷新消耗",
//         "20022": "橙装合成消耗",
//         "20023": "橙装升级消耗",
//         "20024": "渡魂一键完成消耗",
//         "20025": "离线经验双倍消耗",
//         "20026": "BOSS战购买复活消耗",
//         "20027": "竞技场消耗",
//         "20028": "竞技场购买次数消耗",
//         "20029": "百倍返利消耗",
//         "20030": "投资计划消耗",
//         "20031": "转盘消耗",
//         "20032": "限时商城消耗",
//         "20033": "创建公会消耗",
//         "20034": "帮派捐献消耗",
//         "20035": "帮盘转盘消耗",
//         "20036": "公会技能消耗",
//         "20037": "VIP商城消耗",
//         "20038": "修真消耗",
//         "20039": "幻化消耗",
//         "20040": "摇钱树消耗",
//         "20041": "春节集字消耗",
//         "20042": "限时坐骑消耗",
//         "20043": "神通抽取消耗",
//         "20044": "神通领悟消耗",
//         "20045": "春节限时商城消耗",
//         "20046": "投资转盘消耗",
//         "20047": "宝石镶嵌消耗",
//         "20048": "宝石合成消耗",
//         "20049": "宝石升级消耗",
//         "20050": "宝石抽奖消耗",
//         "20051": "一元抢购消耗",
//         "20052": "一折神通购买消耗",
//         "20053": "铸魂消耗",
//         "20054": "转生消耗",
//         "20055": "转生兑换消耗",
//         "20056": "主宰装备升级消耗",
//         "20057": "主宰装备升阶消耗",
//         "20058": "主宰装备分解消耗",
//         "20059": "铜镜玉笛消耗",
//         "20060": "左右眼消耗",
//         "20061": "坐骑升级消耗",
//         "20062": "法宝升级消耗",
//         "20063": "法宝升阶消耗",
//         "20064": "法宝转盘消耗",
//         "20065": "转生BOSS复活消耗",
//         "20066": "野外PVP消耗",
//         "20067": "红装升级消耗",
//         "20068": "寻宝消耗",
//         "20069": "装备元神消耗",
//         "20070": "限制礼包消耗",
//         "20071": "元神分解消耗",
//         "20072": "商城刷新消耗",
//         "20073": "坐骑直升丹升阶消耗",
//         "20074": "激活翅膀消耗",
//         "20075": "摇钱树摇钱消耗",
//         "20076": "功法升级消耗",
//         "20077": "穿坐骑装备消耗",
//         "20078": "许愿池消耗",
//         "20079": "红装碎片兑换消耗",
//         "20080": "淬炼消耗",
//         "20081": "激活武器消耗",
//         "20082": "购买竞技场消耗",
//         "20083": "宠物升级消耗",
//         "20084": "弹劾帮主消耗",
//         "20085": "福袋消耗",
//         "20086": "激活装备消耗",
//         "20087": "激活坐骑消耗",
//         "20088": "宠物升阶消耗",
//         "20089": "宠物合成消耗",
//         "20090": "宠物分解消耗",
//         "20091": "宠物抽奖消耗",
//     };

//     public init(info: ILoginInfo) {
//         try {
//             var ad = info.adFrom;
//             this.ad = ad;
//             if (!ad) {
//                 return;
//             }
//             ead.EgretAD.init({
//                 netType: ad.netType,
//                 brand: ad.brand,
//                 model: ad.model,
//                 gameId: this.APPID,
//                 chanId: ad.spid,
//                 adId: ad.adFrom,
//                 deviceId: ad.deviceId,
//                 imei: ad.imei,
//                 mac: ad.mac
//             });
//             egret.log("SDKEgretadsa.init() .");
//         } catch (e) {
//             egret.error("SDKEgretadsa.init() failed." + e.message);
//         }
//     }

//     /** 注册统计 */
//     public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
//         try {
//             if (!this.ad) {
//                 return;
//             }
//             ead.EgretAD.createRole(playerInfo.id as any);
//             egret.log("SDKEgretadsa.onCreateRole().");
//         } catch (e) {
//             egret.error("SDKEgretadsa.onCreateRole() failed." + e.message);
//         }
//     }
//     /** 登录统计 */
//     public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo) {
//         try {
//             if (!this.ad) {
//                 return;
//             }
//             ead.EgretAD.player.init({
//                 egretId: loginInfo.account, // 白鹭用户id
//                 level: playerInfo.level,
//                 serverId: loginInfo.serverId,
//                 playerName: playerInfo.name,
//                 diamond: playerInfo.gold,
//                 gold: playerInfo.money,
//                 //roleId: playerInfo.occName, // 角色id
//                 wd: this.ad.wd // 是否是微端用户 1是 0 否
//             });
//             egret.log("SDKEgretadsa.onEnterGame()." + playerInfo.level);
//         } catch (e) {
//             egret.error("SDKEgretadsa.onEnterGame() failed." + e.message);
//         }
//     }
//     /**加载统计**/
//     public loadingSetAccount(countType: GAMECOUNT_TYPE, desc: string, ): void {
//         if (!this.ad) {
//             return;
//         }
//         try {
//             ead.EgretAD.loadingSet(countType, desc);
//             egret.log("广告统计类型：" + countType + "~ 描述：" + desc);
//         } catch (e) {
//             egret.error("广告统计出错!类型：" + countType + "~ 描述：" + desc);
//         }
//     }

//     /** 
//      * 钻石统计 
//      * item:某个消费点编号或名称
//      * num:消费数量
//      * price:消费点单价
//      * itemId:子类id 可为空 如购买道具 可以填写道具id
//      * */
//     public onDiamondUpdate(item, num: number, price: number, currency: number) {
//         try {
//             if (!this.ad) {
//                 return;
//             }
//             if (price == 0) {
//                 return;
//             }
//             ead.EgretAD.player.setDiamond(currency);
//             // ead.EgretAD.onDiamondUse(item, num, price, itemId);
//             if (price > 0) {
//                 ead.EgretAD.onDiamondReward(this.changeTypeMapping[item], num, price);
//             } else {
//                 ead.EgretAD.onDiamondUse(this.changeTypeMapping[item], num, -price);
//             }
//             egret.log("SDKEgretadsa.onDiamondUpdate().　" + this.changeTypeMapping[item]);
//         } catch (e) {
//             egret.error("SDKEgretadsa.onDiamondUpdate() failed." + e.message);
//         }
//     }

//     /** 
//      * 金币统计 
//      * item:某个消费点编号或名称
//      * num:消费数量
//      * price:消费点单价
//      * itemId:子类id 可为空 如购买道具 可以填写道具id
//      * */
//     public onMoneyUpdate(item, num: number, price: number, currency: number) {
//         try {
//             if (!this.ad) {
//                 return;
//             }
//             ead.EgretAD.player.setGold(currency);
//             if (price >= 0) {
//                 return;
//             }
//             ead.EgretAD.onGoldUse(this.changeTypeMapping[item], num, -price);
//             egret.log("SDKEgretadsa.onDiamondUpdate()." + this.changeTypeMapping[item]);
//         } catch (e) {
//             egret.error("SDKEgretadsa.onDiamondUpdate() failed." + e.message);
//         }
//     }

//     public onLevelup(playerInfo: IPlayerInfo) {
//         try {
//             if (!this.ad) {
//                 return;
//             }
//             ead.EgretAD.player.setLevel(playerInfo.level);
//             egret.log("SDKEgretadsa.onLevelup().");
//         } catch (e) {
//             egret.error("SDKEgretadsa.onLevelup() failed." + e.message);
//         }
//     }
// }