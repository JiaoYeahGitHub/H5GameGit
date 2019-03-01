class FriendBlackList extends BaseTabView {
	private bar: eui.Scroller;
	private itemGroup: eui.List;
	private label_limit: eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendBlackListSkin;
	}
	protected onInit(): void {
		this.itemGroup.itemRenderer = FriendBlackListItemRenderer;
		this.itemGroup.itemRendererSkinName = skins.FriendListItemRendererSkin;
		this.itemGroup.useVirtualLayout = true;
		this.bar.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().friendManager.onSendGetFriendMessage(FRIEND_LIST_TYPE.BLACKLIST);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRefresh(): void {
		var datas = DataManager.getInstance().friendManager.getList(FRIEND_LIST_TYPE.BLACKLIST);
		this.itemGroup.dataProvider = new eui.ArrayCollection(datas);
		this.label_limit.text = `屏蔽数量：${datas.length}/${FriendManager.BLACKLIST_MAX}`;
	}
}
class FriendBlackListItemRenderer extends FriendItemRenderer {
	private btn_del: eui.Button;
	constructor() {
		super();
	}
	protected onInit(): void {
		this.currentState = "blackList";
		this.btn_del.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnDel, this);
	}
	private onTouchBtnDel(): void {
		DataManager.getInstance().friendManager.onSendDelFriendMessage(FRIEND_LIST_TYPE.BLACKLIST, this.data.player.id);
	}
}