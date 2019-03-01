enum EPlatform {
    PLATFORM_NONE = 0, // 不分平台（默认）
    PLATFORM_ANDROID = 1,   // 安卓
    PLATFORM_IOS = 2,   // IOS
};


/** 登录信息标识 */
interface ILoginInfo extends IDefaultInfo {
    /**游戏名**/
    gamename: string;
    /**服务器名**/
    serverName: string;
    /** 渠道 */
    channel: number;
    /** 子渠道 */
    subChannel?: number;
    /** 地址 */
    url: string;
    /** 账号 */
    account: string;
    /** 平台 **/
    platform?: number;
    /** 服务器id */
    serverId: number;
    /** 角色id */
    playerId: number;
    /** 
     * 昵称
     * 赋值将使用该字段作为角色名称 
     */
    nickName?: string;
    /** 
     * 头像地址
     * 赋值将使用该字段作为角色头像 
     */
    avatarUrl?: string;
    /** 是否关注 */
    focus?: boolean;
    /** 是否隐藏关注按钮 */
    disableFocus?: boolean;
    /** 分享码 */
    shareCode?: string;
    /** 用户分享码 */
    friendCode?: string;
    /** 性别 1:男;2:女;0:未知*/
    sex?: number;
    /** 广告信息 */
    adFrom?: IADInfo;
    /** 登录签名 **/
    sign: string;
}