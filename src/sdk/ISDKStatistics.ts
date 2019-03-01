/** SDK统计接口 */
interface ISDKStatistics {
    /** 初始化 */
    init: (loginInfo: ILoginInfo) => void;
    /** SDK进入统计 **/
    onCompleteSDK?: (loginInfo: ILoginInfo) => void;
    /** 注册统计 */
    onCreateRole: (loginInfo: ILoginInfo, playerInfo: IPlayerInfo) => void;
    /** 登录统计 */
    onEnterGame: (loginInfo: ILoginInfo, playerInfo: IPlayerInfo) => void;
    /** 充值统计 **/
    onPay?: (loginInfo: ILoginInfo, payInfo: IPayInfo, bill_no: string) => void;
}