class ChatDefine {
	public static DEFAULT_SHORT_CHAT: string[] = ['chat_shortword1', 'chat_shortword2', 'chat_shortword3', 'chat_shortword4', 'chat_shortword5', 'chat_shortword6', 'chat_shortword7'];
	public static ACT_DEFAULT_SHORTCHAT: string[] = ['activityChat_1', 'activityChat_2', 'activityChat_3', 'activityChat_4', 'activityChat_5', 'activityChat_6'];
	public static MAX_RECORD_INFO: number = 100;

	public static getChatParamText(data: ChatBase): string {
		var _txtContent: string = '';
		var chatParam: string[] = data.param.split("#");
		var keystr: string = chatParam[0];
		var params: string[] = chatParam[1].split(",");
		switch (keystr) {
			case "teamdup"://组队副本
				var dupid: number = parseInt(params[1]);
				var dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupid];
				if (dupmodel) {
					switch (dupmodel.type) {
						case DUP_TYPE.DUP_TEAM:
							_txtContent = Language.instance.parseInsertText(`chat_type_${keystr}`, data.player.name, dupmodel.name);
							break;
						case DUP_TYPE.DUP_VIP_TEAM:
							_txtContent = Language.instance.parseInsertText(`chat_type_vipteamdup`, data.player.name, dupmodel.name);
							break;
					}
				}
				break;
			case "soldier"://神秘boss
				_txtContent = Language.instance.getText("myboss_notice");
				break;
		}
		return _txtContent;
	}

	public static onChatHrefEvent(param: string): void {
		var chatParam: string[] = param.split("#");
		var keystr: string = chatParam[0];
		var params: string[] = chatParam[1].split(",");
		switch (keystr) {
			case "soldier"://神秘boss
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionBossFightPanel", 1));
				break;
			case "teamdup"://组队副本
				GameFight.getInstance().onSendJoinTeamDupRoomMsg(parseInt(params[0]), parseInt(params[1]));
				break;
		}
	}
	/**获取消息的有效时间**/
	public static getChatValidTime(param: string): number {
		var chatParam: string[] = param.split("#");
		var keystr: string = chatParam[0];
		var params: string[] = chatParam[1].split(",");
		switch (keystr) {
			case "soldier"://神秘boss
			case "teamdup"://组队副本
				return egret.getTimer() + 15 * 1000;
		}
		return 0;
	}
	//The end
}
/** 频道编号 */
enum CHANNEL {
	SYS = 0,//系统
	CURRENT = 1,//玩家
	GUILD = 2,//公会
	ALL = 3,//所有
	WHISPER = 4,//私聊
	ALLSERVER = 5,//跨服
}

/** 广播类型 */
enum BroadcastType {
	SERVER_CLOSE = -1,//服务器即将关闭
	SYSTEM = 0,//系统
}
