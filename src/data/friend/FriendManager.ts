class FriendManager {
	public static FRIEND_MAX: number = 100;
	public static BLACKLIST_MAX: number = 100;
	private currType: number;//0：无 1：好友 2：黑名单
	public list;
	private isfirst: boolean = true;
	private hasNewApply: boolean = false;
	private recentContacts: FriendInfoBase[];
	public ids: number[] = [];
	public constructor() {
		this.list = {};
		this.list[FRIEND_LIST_TYPE.FRIEND] = {};
		this.list[FRIEND_LIST_TYPE.BLACKLIST] = {};
		this.list[FRIEND_LIST_TYPE.APPLY] = {};
		this.recentContacts = [];
	}
	// 1301 玩家列表
	// byte size
	// for(size) {
	// 	simplePlayer结构: id~fighting
	// 	passTime: int 上次离线到现在的时间(秒) 0是在线
	// }
	public onParseCaoYaoSend(msg: Message): void {
		let len: number = msg.getByte();
		var bo:boolean = false;
		for (var i: number = 0; i < len; i++) {
			var frId: number = msg.getInt();
			if (this.list[FRIEND_LIST_TYPE.FRIEND][frId]) {
				if(this.list[FRIEND_LIST_TYPE.FRIEND][frId].isSendCaoYao== false)
				{
					bo = true;
				}
				this.list[FRIEND_LIST_TYPE.FRIEND][frId].isSendCaoYao = true;
			}
		}
		if(bo)
		{
			GameCommon.getInstance().addAlert('赠送成功');
		}
	}
	public onParseCaoYaoRefresh(msg: Message): void {
		let len: number = msg.getInt();
	}
	public onParseCaoYaoGet(msg: Message): void {
		let len: number = msg.getShort();
		for (var i: number = 0; i < len; i++) {
			var frId: number = msg.getInt();
			if (this.list[FRIEND_LIST_TYPE.FRIEND][frId]) {
				this.list[FRIEND_LIST_TYPE.FRIEND][frId].isGetCaoYao = false;
			}
		}
		GameCommon.getInstance().addAlert('领取成功');
		DataManager.getInstance().xiandanManager.yilingEnergy = msg.getShort();
	}
	public onParseFriendList(msg: Message): void {
		var base: FriendInfoBase;
		this.currType = msg.getByte();
		var list = this.list[this.currType] = {};
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			base = new FriendInfoBase();
			base.onParseMessage(msg);
			list[base.player.id] = base;
			if (this.currType == FRIEND_LIST_TYPE.FRIEND) {
				list[base.player.id].isGetCaoYao = msg.getBoolean();
				list[base.player.id].isSendCaoYao = msg.getBoolean();
			}
		}
		if (this.currType == FRIEND_LIST_TYPE.APPLY) {
			if (this.getList(FRIEND_LIST_TYPE.APPLY).length > 0 && this.isfirst) {
				this.isfirst = false;
				this.hasNewApply = true;
			}
			if (this.getList(FRIEND_LIST_TYPE.APPLY).length == 0) {
				this.hasNewApply = false;
			}
		}

	}
	public onParseNewApply(msg: Message) {
		this.hasNewApply = true;
	}
	public getList(type: number): FriendInfoBase[] {
		return GameCommon.getInstance().objToArray(this.list[type]);
	}
	public getObjListByType(type: number) {
		return this.list[type];
	}

	public onSendGetFriendMessage(type: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE);
		message.setByte(type);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onSendAddFriendMessage(playerID: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_ADD_MESSAGE);
		message.setInt(playerID);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendDelFriendMessage(type: number, playerID: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_DEL_MESSAGE);
		message.setByte(type);
		message.setInt(playerID);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendShieldSomeBody(playerID: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_SHIELD_MESSAGE);
		message.setInt(playerID);
		GameCommon.getInstance().sendMsgToServer(message);
	}


	// 1303 好友申请处理
	// 请求
	// byte 1:接收 2:拒绝
	// int playerId - 1:一键

	// 返回1301
	public onSendApplyFriendMessage(type: number, playerID: number = -1): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_APPLY_MESSAGE);
		message.setByte(type);
		message.setInt(playerID);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendSeachAddFriend(name: string): void {
		var message = new Message(MESSAGE_ID.PLAYER_FRIEND_SEARCH_MESSAGE);
		message.setString(name);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onParseSearch(msg: Message): void {
		var len: number = msg.getByte();
		if (len > 0) {
			var base: FriendInfoBase = new FriendInfoBase();
			base.onParseMessage(msg);
			this.onSendAddFriendMessage(base.player.id);
		}
		// for (var i: number = 0; i < len; i++) {

		// }
	}

	public getOnlineTime(sec): string {
		if (sec <= 0)
			return `|online`;
		var _dayNum = Math.floor(sec / 86400);
		if (_dayNum > 30)
			_dayNum = 30;
		if (_dayNum > 0)
			return `${_dayNum}|day`;
		var _hoursNum = Math.floor(sec / 3600);
		if (_hoursNum > 0)
			return `${_hoursNum}|hour`;
		var _minutesNum = Math.floor(sec / 60);
		if (_minutesNum == 0)
			_minutesNum++;
		if (_minutesNum > 0)
			return `${_minutesNum}|min`;
	}
	public getOnlineStr(str: string){
		if(str == "day"){
			return "天前";
		} else if(str == "hour"){
			return "小时前";
		} else if(str == "min"){
			return "分钟前";
		}
		return "在线";
	}
	public onShowRedPoint(bl: boolean): void {
		this.hasNewApply = bl;
	}

	public checkFriendRedPoint(): boolean {
		return this.hasNewApply;
	}

	public getIsInBlackList(playerID: number): boolean {
		var base: FriendInfoBase;
		var obj = this.getObjListByType(FRIEND_LIST_TYPE.BLACKLIST);
		for (var key in obj) {
			base = obj[key];
			if (base.player.id == playerID) return true;
		}
		return false;
	}

	public clearRecentContacts(): void {
		this.recentContacts = [];
	}

	public addRecentContacts(data: FriendInfoBase, init: boolean): void {
		var base: FriendInfoBase;
		var n = 0;
		for (var key in this.recentContacts) {
			base = this.recentContacts[key];
			if (base.player.id == data.player.id) {
				if (init) {
					return;
				} else {
					base.order = GameCommon.addAndGetChatOrder();
					return;
				}
			}
		}
		if (!init) {
			data.order = GameCommon.addAndGetChatOrder();
		}
		this.recentContacts.push(data);
	}

	public getRecentContacts(): FriendInfoBase[] {
		return this.recentContacts;
	}
}
class FriendInfoBase {
	public player: SimplePlayerData;
	public passTime: number = 0;
	public order: number = 0;
	public isSendCaoYao: boolean = false;
	public isGetCaoYao:boolean = false;
	public constructor(player?) {
		this.player = player;
	}
	public onParseMessage(msg: Message): void {
		this.player = new SimplePlayerData();
		this.player.parseMsg(msg);
		this.passTime = msg.getInt();
	}
}
enum FRIEND_LIST_TYPE {
	FRIEND = 1,//好友
	BLACKLIST = 2,//黑名单
	APPLY = 3//申请
}
enum FRIEND_APPLY_TYPE {
	AGREE = 1,//同意
	REFUSE = 2,//拒绝
}