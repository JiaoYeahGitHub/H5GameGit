class ActivityDefine {
    public static CLIENT_ORIGIN_ACTID: number = 10000;//客户端活动ID的起始值

    public static DayIcons: string[] = ["newactivity_diyitian_png", "newactivity_diertian_png", "newactivity_disantian_png", "newactivity_disitian_png", "newactivity_diwutian_png", "newactivity_diliutian_png", "newactivity_diqitian_png"];

    //转盘活动排行榜 排名奖励 字段
    public static LIUYI_ZHUANPAN_AWARD: string[] = ['firstReward', 'secondReward', 'thirdReward', 'forthReward'];

    public constructor() {
    }

    public static GIFTTOP: string = "5,0,150000#0,401,1,6#3,74,3#2,5,1#3,69,3#3,73,3#3,72,1#3,19,1";
}
enum ACTIVITY_BRANCH_TYPE {
    DABIAOJIANGLI = 1, //达标奖励
    SIGN_EVERYDAY = 2, //签到活动
    LOGON_ADD = 3, //累计登录
    LOGON_LIMIT = 4, //登录8天
    CHONGBANG_LIBAO = 5, //冲榜礼包
    YAOQIANSHU = 6,//摇钱树
    XIANGOULIBAO = 7,//VIP限购礼包
    GUANQIAXIANFENG = 8, //关卡先锋
    VIP_XIANGOU2 = 9,  //VIP一次性限购
    LEIJICHONGZHI = 10, //累计充值
    PERSONAL_GOAL = 11,//个人目标
    INVEST = 12, //限时投资
    GIFTFORPAY = 13,//累充返利
    MONEYTAKEGODGIFT = 14, //神器累充
    ZHUANPANACTIVITY = 15,//转盘活动
    WUYITEHUILIBAO = 17,
    WUYIACTIVITY = 18,
    OPENSERVER_LEICHONG = 19,//开服累充
    LIUYIACTIVITDANCHONG = 20,//六一单冲
    LIUYI_MISSION = 21,//六一活跃任务
    HEFU_MISSION = 22,//合服任务
    HEFU_PAYGIFT = 23,//合服单笔充值
    HEFU_TREASURE = 24,//合服转盘
    HEFU_LEGEND = 25,//合服神器活动
    ZHIZUN_XIANGOU = 26,//至尊限购
    LIANXU_LEICHONG = 27,//连续累充
    WX_PAYGIFT = 28,//微信单充
    NEWGODGIFT = 29,//神器
    CONSUME_ITEM = 30,//累计消费
    CONSUME_RANK = 31,//消费排行
    TIANZUNZHONGCHOU = 32,//天尊众筹
    LEICHONGLABA = 33,//累充拉霸
    WEEKENDSHAREGIFT = 34,//周末分享活动
    ZHONGQIULEICHONG = 35,//中秋累充活动
    FESTIVAL_WORDCOLLECTION = 36,//节日集字活动
    FESTIVAL_SHOP = 37,//节日商店
    JUEXINGDAN = 38,//觉醒丹累充活动
    ACT_666SHENQI2 = 39,//仙侣神器拉霸活动
    ACT_666SHENQI2_DUIHUAN = 40,//仙侣神器合成活动
    ACT_RONGLIAN = 41,//熔炼
    ACT_SHENQICHOUQIAN = 42,//神器转盘
    YUEKA = 10000,//月卡
    CDKEY = 10001,//CDKEY    
    NOTICE = 10002, //公告
    COATARD = 10003, //境界奖励
    FUND = 10004, //基金投资
    VIPZHUANPAN = 10005, //vip转盘
    YIYUANLIBAO = 10006, //一元礼包 ..暂时废弃
    CROSS_PAYRANK = 10007,//跨服充值排行
    CONSUMEITEM_RANK = 10008,//消耗道具排行榜
    CONSUMEITEM_TURNPLATE = 10009,//消耗道具转盘

    //以下未整理
    TEHUILIBAO = 1001,//特惠礼包    
    HONGBAOFANLI = 6000,//红包返利
    DENGLUJIANGLI = 5000,//登录奖励
    CHONGZHISHENGYAN = 8000,//充值盛宴
    TREASURE_RANK = 10000,//寻宝排行榜
    WISHINGWELL = 11000,//许愿池
    VIPTLSHOP = 12000,//vip限时商店
    TREASURE_RANK2 = 14000,//寻宝榜2
    SEVENDAYPAY = 15000,//七日充值活动
    FESTIVAL_LOGIN = 16000,//节日登录
    FESTIVAL_FAVORABLE = 17000,//节日特惠包
    FESTIVAL_TARGET = 20000,//节日达标
    FESTIVAL_WISHING_WELL = 19000,//节日许愿池
    WEEKEND_FAVORABLE = 21000,//周末特惠包
    WEEKEND_WISHING_WELL = 22000,//周末许愿池
    FESTIVAL_TARGET_PAY = 23000,///节日充值达标
    FESTIVAL_LOGIN2 = 24000,//端午登陆
    FESTIVAL_FAVORABLE2 = 25000,//端午特惠
    FESTIVAL_TARGET2 = 28000,//端午达标
    WANBA_PRIVILEGE_GIFT = 30000,//玩吧专属礼包
    FESTIVAL_FUDAI = 31000,//福袋
}
//活动类型集合
enum ACTIVITY_TYPE {//对应关系件activity.xml        
    ACTIVITY_HALL = 1,//活动大厅
    ACTIVITY_DENGLUJIANGLI = 2,//登录奖励
    ACTIVITY_CHONGZHISHENGYAN = 3,//充值盛宴
    ACTIVITY_FULIDATING = 4,//福利大厅
    ACTIVITY_CHONGZHI = 5,//充值
    ACTIVITY_TREASURE_RANK = 6,//寻宝排行榜
    ACTIVITY_VIPTLSHOP = 7,//vip限时商店
    ACTIVITY_SEVENPAY = 8,//七日充值活动
    ACTIVITY_FESTIVAL = 9,//节日活动
    ACTIVITY_WEEKEND = 10,//周末活动
    ACTIVITY_PLAY_CAFE = 11,//玩吧专属
    ACTIVITY_TARGET_MAIN = 12, //达标活动
    ACTIVITY_VIP_XIANGOU = 13, //达标活动
    ACTIVITY_WANBA_FOCUS = 14, //玩吧关注
    ACTIVITY_WANBA_DESK = 15,  //玩吧发送桌面
    ACTIVITY_YIYUANLIBAO = 16, //一元礼包 //暂时废弃
    ACTIVITY_SHARE = 17,           //分享
    ACTIVITY_FOCUS = 18,        //关注
    ACTIVITY_SHENQI = 19, //神器累充
    ACTIVITY_WANBA_VIPTEQUAN = 20,  //玩吧vip特权
    ACTIVITY_WUYi = 21,//五一活动
    ACTIVITY_VIP_ZHUANPAN = 22,//VIP换盘
    VERIFY_GIFT = 23,
    OPENSERVER_LEICHONG = 24,
    ACTIVITY_YUGAO = 25,     //功能预告
    ACTIVITY_SHOP = 26, //商店
    ACTIVITY_TREASURE = 27,//寻宝
    ACTIVITY_HEFU = 28,//合服活动
    WANBA_XQBL = 29, //兴趣部落
    LIANXU_LEICHONG = 30,//连续累充
    ACTIVITY_GODWEAPON = 31,//神器类重1000元
    ACTIVITY_CONSUME = 32,//消费活动
    ACTIVITY_TUANGOU = 33,//团购活动
    ACTIVITY_ZHUANPAN = 34,// 转盘-幸运拉霸
    ACTIVITY_FESTIVALFULLMOON = 35,//中秋活动
    ACTIVITY_JUEXINGDAN = 36,//觉醒丹累充活动
    ACTIVITY_666 = 37,//仙侣神器抽碎片活动
    ACTIVITY_SMELT = 38,//熔炼回收活动
    ACTIVITY_SHENQICHOUQIAN = 39,//神器抽签
    //客户端约定的活动
    // ACTIVITY_CDKEY = 10013,//CDKEY
    // ACTIVITY_FIRST_PAY = 10014,//首冲
    // ACTIVITY_MONTHCARD = 10015,//月卡
    //ACTIVITY_FOCUS = 10016,             //关注
    //ACTIVITY_SHARE = 10017,             //分享
    // ACTIVITY_WANBA_FOCUS = 10018,       //玩吧关注
    // ACTIVITY_CLIENT_DOWM = 10019,       //下载微端
    // ACTIVITY_CLIENT_FOCUS = 10020,      //微端关注
    // ACTIVITY_WANBA_DESK = 10021,       //玩吧发送桌面
    FANGKUAI_GENGDUOYOUXI = 3001,       //方块玩更多游戏
    VIP_SERVICE = 3004,//vip客服
    WXGAME_FIRST_SHARE = 3002,//微信首次分享
    WXGAME_INVITE = 3003,//微信邀请好友
    WXGAME_SHARE = 3005,//微信分享
    WXGAME_COLLECTION = 3006,//收藏游戏
}