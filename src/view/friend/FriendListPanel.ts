class FriendListPanel extends BaseTabView {
	private btn_search: eui.Button;
	// private btn_apply: eui.Button;
	// private btn_blackList: eui.Button;
	private bar: eui.Scroller;
	private itemGroup: eui.List;
	private label_limit: eui.Label;
	private allGetBtn: eui.Button;
	private allSendBtn: eui.Button;
	private caoyaoGet: eui.Label;
	// protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendListPanelSkin;
	}
	protected onInit(): void {
		this.itemGroup.itemRenderer = FriendListItemRenderer;
		this.itemGroup.itemRendererSkinName = skins.FriendListItemRendererSkin;
		this.itemGroup.useVirtualLayout = true;
		this.bar.viewport = this.itemGroup;
		// this.points[0].register(this.btn_apply, new egret.Point(130, -12), DataManager.getInstance().friendManager, "checkFriendRedPoint");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();

		this.allGetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetCaoYao, this);
		this.allSendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendCaoYao, this);
		this.btn_search.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAddFriend, this);
		// this.btn_apply.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnApply, this);
		// this.btn_blackList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBlackList, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().friendManager.onSendGetFriendMessage(FRIEND_LIST_TYPE.FRIEND);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ENERGY_GIFT_RECEIVE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.allGetBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetCaoYao, this);
		this.allSendBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendCaoYao, this);
		this.btn_search.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAddFriend, this);
		// this.btn_apply.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnApply, this);
		// this.btn_blackList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBlackList, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ENERGY_GIFT_RECEIVE.toString(), this.onRefresh, this);
	}
	protected onRefresh(): void {
		var datas = DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.FRIEND);
		this.itemGroup.dataProvider = new eui.ArrayCollection(datas);
		this.label_limit.text = `好友数量：${datas.length}/${FriendManager.FRIEND_MAX}`;
		this.caoyaoGet.text = '草药每日领取上限' + 24 + '今日已领取领取' + DataManager.getInstance().xiandanManager.yilingEnergy;
		this.trigger();
	}
	private onSendCaoYao(): void {
		var message = new Message(MESSAGE_ID.ENERGY_GIFT);
		message.setInt(-1)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onGetCaoYao(): void {
		var message = new Message(MESSAGE_ID.ENERGY_GIFT_RECEIVE);
		message.setInt(-1)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onBtnAddFriend(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FriendAddPanel");
	}
	// private onBtnApply(): void {
	// 	DataManager.getInstance().friendManager.onShowRedPoint(false);
	// 	this.owner.onShowAlertByName("FriendApplyPanel");
	// }
	// private onBtnBlackList(): void {
	// 	this.owner.onShowAlertByName("FriendBlackList");
	// }
}
class FriendListItemRenderer extends FriendItemRenderer {
	private label_online: eui.BitmapLabel;
	private label_online2: eui.Image;
	private headLayer: eui.Group;
	private sendCaoYao: eui.Button;
	private bgBtn: eui.Group;
	private sendCaoYaoLab: eui.Label;
	constructor() {
		super();
	}
	protected onInit(): void {
		this.currentState = "friend";
		this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHead, this);
		this.sendCaoYao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendCaoYao, this, false);
	}
	protected onUpdate(): void {
		super.onUpdate();
		var txtArray: string[] = DataManager.getInstance().friendManager.getOnlineTime(this.data.passTime).split("|");
		if (txtArray[1] == "online") {
			this.label_online.visible = false;
			this.label_online2.visible = true;
		} else {
			this.label_online.visible = true;
			this.label_online2.visible = false;
			this.label_online.text = txtArray[0];
		}
	}
	private onSendCaoYao(): void {
		var message = new Message(MESSAGE_ID.ENERGY_GIFT_RECEIVE);
		message.setInt(this.data.player.id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onTouchHead(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("FriendFuncPanel", new FriendFuncParam(FRIENDFUNC_FROM.FRIEND, this.data.player)));
	}
}