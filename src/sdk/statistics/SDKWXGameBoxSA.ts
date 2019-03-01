class SDKWXGameBoxSA implements ISDKStatistics {
	private static _instance: SDKWXGameBoxSA;
	constructor() { }

	// 没有强制限制，仿一个Singleton
	public static getInstance(): SDKWXGameBoxSA {
		if (this._instance == null) {
			this._instance = new SDKWXGameBoxSA();
		}
		return this._instance;
	}

	/**常量**/
	private readonly appid: string = "wx60bab776ca043f7c";//小程序的APPID

	private readonly CREATE_ROLE_TYPE: number = 1;

	public onCreateRole(loginInfo: ILoginInfo, playerInfo: IPlayerInfo): void {

		this.onCompleteSDK(loginInfo); //微信用户上报 再创角后上报
		/**
		 * 角色创角信息上报
         * 参数名称	参数说明	备注	是否必填
         * 	role_id	角色ID	string	是
			grade	角色等级	number	否
			blance	拥有钻石数量	number	否
			vip_grade	VIP等级	number	否
			server_id	所在区服ID	number	否
			server_name	所在区服名称	string	否
			role_create_time	角色创建时间(时间戳)	number	是
			role_nickname	角色昵称	string	是
			type	角色变更事件 1:创建角色；2：角色升级；3：进入游戏；4：昵称变更	number	是
			client_id	微信小游戏appid	string	是
			openid	登录调用我方getFyhdUserInfo时返回的openid	string	是
         */
		let create_params = {
			report_Type: SDKWXGAME_SA_TYPE.ROLE_DATA,
			role_id: playerInfo.id,
			grade: 1,
			blance: 0,
			vip_grade: 0,
			server_id: loginInfo.serverId,
			server_name: `${loginInfo.gamename}${loginInfo.serverId}服`,
			role_create_time: new Date().getTime(),
			role_nickname: playerInfo.name,
			type: this.CREATE_ROLE_TYPE,
			client_id: this.appid,
			openid: loginInfo.account
		}

		this.addSaReportQueue(create_params);
	}

	public onEnterGame(loginInfo: ILoginInfo, playerInfo: IPlayerInfo): void {
		/**
		 * 登陆信息上报
         * 参数名称	  参数说明
         * 	openid	微信openid
			client_id	游戏appid
			role_id	角色ID
			role_nickname	角色名称
			server_id	区服ID
			server_name	区服名称
			login_time	登录时间，时间戳
         */
		let login_params = {
			report_Type: SDKWXGAME_SA_TYPE.LOGIN_GAME,
			openid: loginInfo.account,
			client_id: this.appid,
			role_id: loginInfo.playerId,
			role_nickname: playerInfo.name,
			server_id: loginInfo.serverId,
			server_name: `${loginInfo.gamename}${loginInfo.serverId}服`,
			login_time: DataManager.getInstance().playerManager.player.currentTime
		};
		this.addSaReportQueue(login_params);
	}

	public onPay(loginInfo: ILoginInfo, payInfo: IPayInfo, bill_no: string): void {
	}

	public onReportShare(appid, materialID): void {
		/**
		 * 分享统计
         * 参数名|是否必填|参数类型|参数长度|说明
         * appid		是	String		渠道编号
           materialID	是	String		类型
         */
	}
	/**微信用户信息上报 必须是最先上报的**/
	private wechatuserIsReport: boolean;
	public onCompleteSDK(loginInfo: ILoginInfo): void {
		if (this.wechatuserIsReport) return;
		this.wechatuserIsReport = true;
		/**
		 * 微信用户信息上报
         * 参数名|说明|参数类型|是否必填
         * 	openid	微信openid	string	是
           	nickname	微信昵称	string	否
           	avatarUrl	微信头像	string	否
		   	country	国家	string	否
		   	province	省份	string	否
		   	city	城市	string	否
			gender	性别	string	否
			client_id	游戏appid	string	是
			channel_id	渠道	string	是
			sub_channel_id	子渠道	string	是
         */
		var user_params = {
			report_Type: SDKWXGAME_SA_TYPE.WECHAT_INFO,
			openid: loginInfo.account,
			client_id: this.appid,
			channel_id: loginInfo.adFrom ? loginInfo.adFrom.adFrom : '',
			sub_channel_id: loginInfo.adFrom ? loginInfo.adFrom.subchid : '',
		}

		this.addSaReportQueue(user_params);
	}
	/**加入到上报信息队列中 上报信息每间隔3秒进行一次上报**/
	private sa_report_queue: Array<any> = [];
	private report_timer_on: boolean;
	private addSaReportQueue(reportParam): void {
		if (!window.fySDK || !reportParam) return;
		let startTimer: boolean = this.sa_report_queue.length == 0;
		this.sa_report_queue.push(reportParam);
		if (startTimer && !this.report_timer_on) {
			this.report_timer_on = true;
			Tool.addTimer(this.onReportStatisHandler, this, 3000);
		}
	}
	private onReportStatisHandler(): void {
		if (this.sa_report_queue.length == 0) {
			this.report_timer_on = false;
			Tool.removeTimer(this.onReportStatisHandler, this, 3000);
			return;
		}

		let cur_report_param = this.sa_report_queue.shift();
		switch (cur_report_param.report_Type) {
			case SDKWXGAME_SA_TYPE.WECHAT_INFO:
				window.fySDK.getFyhd().loginData(cur_report_param);
				break;
			case SDKWXGAME_SA_TYPE.ROLE_DATA:
				window.fySDK.getFyhd().roleData(cur_report_param);
				break;
			case SDKWXGAME_SA_TYPE.LOGIN_GAME:
				window.fySDK.getFyhd().uploginData(cur_report_param);
				break;
		}
	}

	public async init(info: ILoginInfo) {
	}
}
enum SDKWXGAME_SA_TYPE {
	WECHAT_INFO = 1,//用户信息上报
	ROLE_DATA = 2,//角色信息上报
	LOGIN_GAME = 3,//登陆信息上报
}