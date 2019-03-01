class FriendFuncPanel extends BaseWindowPanel {
	private param: FriendFuncParam;
	private btn_addOrDel: eui.Button;
	private btn_whisper: eui.Button;
	private btn_blackList: eui.Button;
	// private hero_head: eui.Image;
	private playerHead: PlayerHeadPanel;
	private vip_group: eui.Group;
	private label_info: eui.Label;
	private btnLayer: eui.Group;
	private power: PowerBar;
	private vip_label:eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendFuncPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("玩家信息");
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_addOrDel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAddOrDel, this);
		this.btn_whisper.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnWhisper, this);
		this.btn_blackList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBlackList, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().friendManager.onSendGetFriendMessage(FRIEND_LIST_TYPE.FRIEND);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_addOrDel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAddOrDel, this);
		this.btn_whisper.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnWhisper, this);
		this.btn_blackList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBlackList, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRefresh(): void {
		if (!this.param) return;
		if (this.btnLayer.numChildren != 3) {
			this.btnLayer.removeChildren();
			this.btnLayer.addChild(this.btn_addOrDel);
			this.btnLayer.addChild(this.btn_whisper);
			this.btnLayer.addChild(this.btn_blackList);
		}
		switch (this.param.from) {
			case FRIENDFUNC_FROM.CHAT:
				var obj = DataManager.getInstance().friendManager.getObjListByType(FRIEND_LIST_TYPE.FRIEND);
				var base: FriendInfoBase = obj[this.param.player.id];
				if (base) {
					// this.btn_addOrDel.skinName = skins.Common_ButtonRed2Skin;
					this.btn_addOrDel.label = "删  除";
				} else {
					this.btn_addOrDel.label = "添  加";
					// this.btn_addOrDel.skinName = skins.Common_ButtonYellow;
					if (this.btn_whisper.parent) {
						this.btn_whisper.parent.removeChild(this.btn_whisper);
					}
				}

				break;
			case FRIENDFUNC_FROM.FRIEND:
				// this.btn_addOrDel.skinName = skins.Common_ButtonRed2Skin;
				this.btn_addOrDel.label = "删  除";
				break;
		}
		this.playerHead.setHead(this.param.player.headindex, this.param.player.headFrame);
		// this.hero_head.source = GameCommon.getInstance().getHeadIconByIndex(this.param.player.headindex);
		if (this.param.player.viplevel > 0) {
			this.vip_group.visible = true;
		} else {
			this.vip_group.visible = false;
		}
		// this.label_info.textFlow = new Array<egret.ITextElement>(
		// 	{ text: `${this.param.player.name}`, style: { textColor: 0x289aea } },
		// 	{ text: `(${this.param.player.playerLevelDesc})`, style: { textColor: 0x28e828 } }
		// );
		this.vip_label.text =  GameCommon.getInstance().getVipName(this.param.player.viplevel)+'';
		this.label_info.text = this.param.player.name + " "
			+ Language.instance.getText(`coatard_level1`) + " "
			+ this.param.player.level + Language.instance.getText('level');
		this.power.power = this.param.player.fightvalue;
	}
	private onBtnAddOrDel(): void {
		switch (this.btn_addOrDel.label) {
			case "添  加":
				DataManager.getInstance().friendManager.onSendAddFriendMessage(this.param.player.id);
				break;
			case "删  除":
				DataManager.getInstance().friendManager.onSendDelFriendMessage(FRIEND_LIST_TYPE.FRIEND, this.param.player.id);
				break;
		}
		this.onHide();
	}
	private onBtnWhisper(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatPrivatePanel", new ChatPanelParam(CHANNEL.WHISPER, this.param.player)));
		// this.onHide();
	}
	private onBtnBlackList(): void {
		DataManager.getInstance().friendManager.onSendShieldSomeBody(this.param.player.id);
		switch (this.param.from) {
			case FRIENDFUNC_FROM.CHAT:
				break;
			case FRIENDFUNC_FROM.FRIEND:
				break;
		}
		this.onHide();
	}
	public onShowWithParam(param): void {
		this.param = param;
		this.onShow();
	}
}
class FriendFuncParam {
	public from: number;
	public player: SimplePlayerData;
	public constructor($from, $player) {
		this.from = $from;
		this.player = $player;
	}
}
enum FRIENDFUNC_FROM {
	CHAT = 1,//聊天
	FRIEND = 2//好友
}