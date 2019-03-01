class FriendApplyPanel extends BaseTabView {
	private bar: eui.Scroller;
	private itemGroup: eui.List;
	private btn_agree: eui.Button;
	private btn_refuse: eui.Button;
	private label_limit: eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendApplyPanelSkin;
	}
	protected onInit(): void {
		this.itemGroup.itemRenderer = FriendApplyItemRenderer;
		this.itemGroup.itemRendererSkinName = skins.FriendListItemRendererSkin;
		this.itemGroup.useVirtualLayout = true;
		this.bar.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAgree, this);
		this.btn_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRefuse, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().friendManager.onSendGetFriendMessage(FRIEND_LIST_TYPE.APPLY);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_agree.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAgree, this);
		this.btn_refuse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRefuse, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRefresh(): void {
		var datas = DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.APPLY);
		this.itemGroup.dataProvider = new eui.ArrayCollection(datas);

		var datas1 = DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.FRIEND);
		this.label_limit.text = `好友数量：${datas1.length}/${FriendManager.FRIEND_MAX}`;

	}
	private onTouchBtnAgree(): void {
		if (DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.APPLY).length == 0) return;
		DataManager.getInstance().friendManager.onSendApplyFriendMessage(FRIEND_APPLY_TYPE.AGREE);
	}
	private onTouchBtnRefuse(): void {
		if (DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.APPLY).length == 0) return;
		DataManager.getInstance().friendManager.onSendApplyFriendMessage(FRIEND_APPLY_TYPE.REFUSE);
	}
}
class FriendApplyItemRenderer extends FriendItemRenderer {
	private headLayer: eui.Group;
	private btn_agree: eui.Button;
	private btn_refuse: eui.Button;
	constructor() {
		super();
	}
	protected onInit(): void {
		this.currentState = "apply";
		this.headLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHead, this);
		this.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAgree, this);
		this.btn_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRefuse, this);
	}
	private onTouchBtnAgree(): void {
		DataManager.getInstance().friendManager.onSendApplyFriendMessage(FRIEND_APPLY_TYPE.AGREE, this.data.player.id);
	}
	private onTouchBtnRefuse(): void {
		DataManager.getInstance().friendManager.onSendApplyFriendMessage(FRIEND_APPLY_TYPE.REFUSE, this.data.player.id);
	}
	private onTouchHead(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("FriendFuncPanel", new FriendFuncParam(FRIENDFUNC_FROM.FRIEND, this.data.player)));
	}
}