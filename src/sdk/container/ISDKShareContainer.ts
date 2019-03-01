/** 分享容器标识 */
interface ISDKShareContainer {
    shareType?: number;
    /**
     * 分享信息提示
     */ 
    showShareInfo:(info:ISDKShareInfo) =>void;
    /**
     * 分享信息更新
     */ 
    updateShareInfo:(info:ISDKShareInfo) =>void;

    /**
     * 分享完成
     */ 
    shareComplete:() =>void;
}
enum WX_SHARE_TYPE {
    INVITE_FRIEND = 1,//邀请好友
    OFFLINE_EXP = 2,//离线经验分享
    EVERYDAY_SHARE = 3,//每日分享
    WEEKEND_SHARE = 4,//周末分享
    FIRST_SHARE = 5,//首次分享
    LEVEL_SHARE = 6,//等级分享
}