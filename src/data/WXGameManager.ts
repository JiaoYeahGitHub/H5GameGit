class WXGameManager {

	public constructor() {
	}

	//等级奖励分享
	private _shareAwdLv: number = 1000;
	private _isFirstShare: boolean = false;
	public get shareAwdLv(): number {
		return this._shareAwdLv;
	}
	public get isFirstShare(): boolean {
		return this._isFirstShare;
	}
	//解析等级奖励分享消息体
	public parseShareAwdLevelMsg(msg: Message): void {
		this._shareAwdLv = msg.getShort();
		this._isFirstShare = msg.getBoolean();
		GameCommon.getInstance().receiveMsgToClient(msg);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
	}
	//请求等级分享信息
	public onAwardShareLevel(): void {
		var message: Message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
		message.setBoolean(false);
		message.setShort(0);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//邀请好友
	public inviteCount: number;//成功邀请好友数
	public inviteReachNum: number;//达成目标的好友数
	public inviteawdNum: number;//领奖的次数
	public inviteawdZhulibiNum: number = 0;//领奖的助力币次数
	public parseInviteFriendMsg(msg: Message): void {
		this.inviteCount = msg.getByte();
		this.inviteReachNum = msg.getByte();
		this.inviteawdNum = msg.getByte();
		// this.inviteawdZhulibiNum = msg.getByte();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//请求邀请好友的信息
	public onRequestInviteAwdMsg(): void {
		let inviteMsg: Message = new Message(MESSAGE_ID.WXGAME_INVITE_FRIEND_MSG);
		inviteMsg.setBoolean(false);
		GameCommon.getInstance().sendMsgToServer(inviteMsg);
	}
	//分享的红点
	public wxshareRedPoint(): boolean {
		if (this.getWxShareAwdRpoint()) return true;
		else if (this.getWxFriendShareRpoint()) return true;
		else if (this.getWxOffLineShareRpoint()) return true;
		// else if (this.wxShareAllRedPoint()) return true;
		return false;
	}
	// public wxShareAllRedPoint(): boolean{
	// 	let manager: FunctionManager = DataManager.getInstance().functionManager;
	// 	let models = JsonModelManager.instance.getModelleijifenxiang();
	// 	let maxawdNum: number = 0;
	// 	for (let id in models) {
	// 		let model: Modelleijifenxiang = models[id];
	// 		if (manager.receives2.indexOf(model.id) < 0 && model.times <= manager.shareAllNum) {
	// 			return true;
	// 		}
	// 		maxawdNum = Math.max(model.times, maxawdNum);
	// 	}
	// 	if (DataManager.getInstance().functionManager.cd == 0 && manager.shareDayNum < 3 && manager.shareAllNum < maxawdNum) {
	// 		return true;
	// 	}
	// 	return false;
	// }
	public getWxShareAwdRpoint(): boolean {
		let manager: FunctionManager = DataManager.getInstance().functionManager;
		let models = JsonModelManager.instance.getModelfenxiang();
		let maxawdNum: number = 0;
		for (let id in models) {
			let model: Modelfenxiang = models[id];
			if (manager.receives.indexOf(model.id) < 0 && model.times <= manager.shareNum) {
				return true;
			}
			maxawdNum = Math.max(model.times, maxawdNum);
		}
		if (DataManager.getInstance().functionManager.cd == 0 && manager.shareNum < maxawdNum) {
			return true;
		}
		return false;
	}
	public getWxLevelShareRpoint(): boolean {
		let models = JsonModelManager.instance.getModellvyaoqing();
		for (let lv in models) {
			let model: Modellvyaoqing = models[lv];
			if (this.shareAwdLv < model.lv && DataManager.getInstance().playerManager.player.level >= model.lv) {
				return true;
			}
		}

		return false;
	}
	public getWxFriendShareRpoint(): boolean {
		let yaoqing_params: string[] = Constant.get(Constant.WXGAME_INVITE_FIREND).split('#');
		for (let i: number = 0; i < yaoqing_params.length; i++) {
			let param: string[] = yaoqing_params[i].split(',');
			let rewardCount: number = parseInt(param[0]);
			if (rewardCount <= this.inviteReachNum &&
				(rewardCount > this.inviteawdNum || rewardCount > this.inviteawdZhulibiNum)) {
				return true;
			}
		}
		return false;
	}
	public getWxOffLineShareRpoint(): boolean {
		return DataManager.getInstance().playerManager.offlineAwdData.exp > 0;
	}
	//检查是不是有没领取的等级分享奖励 没有的话就需要升级弹出
	public onCheckLvYaoqingAwd(): void {
		if (!FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE)) return;
		if (this.getWxLevelShareRpoint()) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "WXShareLevelAwardPanel");
		}
	}
	//请求离线经验奖励
	public onRequestOffLineExpAwdMsg(): void {
		let sendOffLineExpAwdMsg: Message = new Message(MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE);
		sendOffLineExpAwdMsg.setBoolean(false);
		GameCommon.getInstance().sendMsgToServer(sendOffLineExpAwdMsg);
	}
	/**---------周末分享活动相关内容----------**/
	public weekend_shareNum: number = 0;//周末分享次数
	public weekend_share_rewarded: number[] = [];//已领列表
	private _weekendShareCD: number = 0;//分享CD 秒
	private _sharecdClientTime: number = 0;//CD时间戳
	public parseActWeekendShareMsg(msg: Message): void {
		this.weekend_share_rewarded = [];
		this.weekend_shareNum = msg.getByte();
		this._weekendShareCD = msg.getInt();
		this._sharecdClientTime = egret.getTimer();
		let rewardsize: number = msg.getByte();
		for (let i: number = 0; i < rewardsize; i++) {
			let rewardedIdx: number = msg.getByte();
			if (this.weekend_share_rewarded.indexOf(rewardedIdx) < 0) {
				this.weekend_share_rewarded.push(rewardedIdx);
			}
		}
	}
	public onParseWeekendShareMsg(msg: Message): void {
		this.parseActWeekendShareMsg(msg);
		// let model: Modelzhoumofenxiang = JsonModelManager.instance.getModelzhoumofenxiang()[0];
		// let param: TurnplateAwardParam = new TurnplateAwardParam();
		// param.desc = "累计分享奖励通过邮件形式下发";
		// param.titleSource = "";
		// param.itemAwards = model.rewards;
		// param.autocloseTime = 11;
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
		// GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**获取周末分享CD时间秒数**/
	public get weekend_share_cd(): number {
		let runTime: number = egret.getTimer() - this._sharecdClientTime;
		return Math.max(0, Math.floor((this._weekendShareCD - runTime) / 1000));
	}
	/** IOS回归的奖励 **/
	private _IOSHuigui: boolean;
	public parseIosHuiguiMsg(msg: Message): void {
		this._IOSHuigui = msg.getBoolean();
	}
	public get ios_huigui(): boolean {
		return this._IOSHuigui;
	}
	/**收藏奖励**/
	private _isColletionScene: boolean;
	public parseCollectionAwardMsg(msg: Message): void {
		DataManager.getInstance().playerManager.player.wxcolletion = true;
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public async onupdateColletionStatus(result?) {
		let sceneValue: number = 0;
		if (result && result.scene) {
			sceneValue = result.scene;
		} else {
			let launchOption = await platform.getOption();
			if (launchOption && launchOption.scene) {
				sceneValue = launchOption.scene;
			}
		}
		if (sceneValue == 1001 || sceneValue == 1104) {
			this._isColletionScene = true;
		}
	}
	public get isColletionScene(): boolean {
		return this._isColletionScene;
	}
	//The end
}