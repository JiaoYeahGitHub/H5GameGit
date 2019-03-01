class FriendMainPanel extends BaseSystemPanel {

	protected points: redPoint[] = RedPointManager.createPoint(2);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];

		var param = new RegisterSystemParam();
		param.sysName = "FriendListPanel";
		param.btnRes = "列表";
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "FriendApplyPanel";
		param.btnRes = "筛选";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().friendManager, "checkFriendRedPoint");
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "FriendBlackList";
		param.btnRes = "屏蔽";
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "FriendListChatPanel";
		param.btnRes = "最近";
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().chatManager, "onCheckPrivateChatRedPoint");
		sysQueue.push(param);

		this.registerPage(sysQueue, "FriendGrp", GameDefine.RED_TAB_POS);

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
		this.setTitle("friend_title_png");
		super.onRefresh();
	}
	public onShowAlertByName(panelName: string): void {
		switch (panelName) {
			case "FriendApplyPanel":
				this.setTitle("friend_apply_png");
				break;
			case "FriendBlackList":
				this.setTitle("friend_blacklist_png");
				break;
		}
		super.onShowAlertByName(panelName);
	}
	protected onTouchCloseBtn(): void {
		this.setTitle("friend_title_png");
		super.onTouchCloseBtn();
	}
}
class FriendItemRenderer extends BaseListItem {
	public data: FriendInfoBase;
	private playerHead: PlayerHeadPanel;
	private vip_group: eui.Group;
	private label_info: eui.Label;
	private vip_label: eui.BitmapLabel;
	private powerbar: PowerBar;

	constructor() {
		super();
	}
	protected onInit(): void {
	}
	protected onUpdate(): void {
		this.playerHead.setHead(this.data.player.headindex, this.data.player.headFrame);
		this.vip_label.text =   GameCommon.getInstance().getVipName(this.data.player.viplevel)+'';
		this.label_info.text = this.data.player.name + " " + this.data.player.rebirthLv + "转 " + this.data.player.level + Language.instance.getText('level');
		this.powerbar.power = this.data.player.fightvalue;
	}
}