class FriendListChatPanel extends BaseTabView {
	public static ChatRedPoint: egret.Point = new egret.Point(95, -5)
	private bar: eui.Scroller;
	private itemGroup: eui.List;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendListChatPanelSkin;
	}
	protected onInit(): void {
		this.itemGroup.itemRenderer = FriendChatItemRenderer;
		this.itemGroup.itemRendererSkinName = skins.FriendListItemRendererSkin;
		this.itemGroup.useVirtualLayout = true;
		this.bar.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		var datas = DataManager.getInstance().friendManager.getRecentContacts();
		var comparefn = function (x: FriendInfoBase, y: FriendInfoBase) {
			return y.order - x.order;
		};
		datas.sort(comparefn);
		this.itemGroup.dataProvider = new eui.ArrayCollection(datas);
		this.trigger();
		// DataManager.getInstance().chatManager.hasNewWhisperTalk = false;
	}
}

class FriendChatItemRenderer extends FriendItemRenderer {
	private headLayer: eui.Group;
	private btn_chat: eui.Button;
	private point: redPoint = new redPoint();
	constructor() {
		super();
	}
	protected onInit(): void {
		this.currentState = "chat";
		this.point.register(this.btn_chat, FriendListChatPanel.ChatRedPoint, this, "checkRedPoint");
		this.btn_chat.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnChat, this);
	}
	protected onUpdate(): void {
		super.onUpdate();
		this.trigger();
	}
	private onTouchBtnChat(): void {
		this.data.order = 0;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatPrivatePanel", new ChatPanelParam(CHANNEL.WHISPER, this.data.player)));
	}

	private trigger(): void {
		this.point.checkPoint();
	}

	private checkRedPoint() {
		if (this.data) {
			return this.data.order > 0;
		} else {
			return false;
		}
	}
}