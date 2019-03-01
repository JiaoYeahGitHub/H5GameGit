class ChatMainPanel extends BaseSystemPanel {
	protected index: number = 0;
	public currParam: ChatPanelParam;
	public static openQueue: number[] = [CHANNEL.CURRENT, CHANNEL.GUILD, CHANNEL.SYS, CHANNEL.ALLSERVER];
	protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];

		var param = new RegisterSystemParam();
		param.sysName = "ChatPanel";
		param.btnRes = "世界";
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "ChatPanel";
		param.btnRes = "仙盟";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().chatManager, "onCheckChatRedPointByType", CHANNEL.GUILD);
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "ChatPanel";
		param.btnRes = "系统";
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "ChatPanel";
		param.btnRes = "跨服";
		sysQueue.push(param);

		this.registerPage(sysQueue, "chatGrp", GameDefine.RED_TAB_POS);
		// this.setTitle("chat_title_png");
		this.setTitle("聊 天");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
		this.index = 0;
	}
	protected onRefresh(): void {
		super.onRefresh();
	}
	public onShowWithParam(param: ChatPanelParam): void {
		this.index = param.channel;
		this.currParam = param;
		this.onShow();
	}
	// protected getTabButtonSkin(btnRes: string): eui.RadioButton {
	// 	var btn: eui.RadioButton;
	// 	let btnLabel: string = btnRes;
	// 	if (this.sysInfos[this.sysInfos.length - 1].btnRes == btnRes) {
	// 		btn = new BaseTabButton2(btnRes, btnLabel);
	// 		if (this.sysInfos.length == 5) {
	// 			btn.width = 96;
	// 		}
	// 	} else {
	// 		btn = new BaseTabButton(btnRes, btnLabel);
	// 		if (this.sysInfos.length == 5) {
	// 			btn.width = 103;
	// 		}
	// 	}

	// 	return btn;
	// // }
	// protected registerPage(sysInfo: RegisterSystemParam[], btnGrp: string, pos: egret.Point = GameDefine.RED_TAB_POS, isResetIndex: boolean = false): void {
	// 	if (!sysInfo) return;
	// 	this.sysInfos = sysInfo;
	// 	// super.registerPage();
	// 	var btn: eui.RadioButton;
	// 	var grp: eui.Group;
	// 	var len: number = sysInfo.length;
	// 	var id: number;
	// 	for (var i: number = 0; i < sysInfo.length; i++) {
	// 		id = ChatMainPanel.openQueue[i];
	// 		this.windowNames[id] = sysInfo[i].sysName;
	// 		if (!this.tabFs[id]) {
	// 			grp = new eui.Group();
	// 			grp.touchEnabled = true;
	// 			grp.name = i.toString();
	// 			btn = this.getTabButtonSkin(sysInfo[i].btnRes);
	// 			btn.value = id.toString();
	// 			btn.groupName = btnGrp;
	// 			btn.touchEnabled = false;
	// 			if (sysInfo[i].redP) {
	// 				sysInfo[i].redP.addRedPointImg(btn, pos);
	// 			}
	// 			if (sysInfo[i].funcID != -1) {
	// 				this.lockIDs[id] = sysInfo[i].funcID;
	// 			}
	// 			grp.addChild(btn);
	// 			this.tabs[id] = btn;
	// 			this.tabFs[id] = grp;
	// 			this.tabFs[id].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
	// 			this.basic["btnTabLayer"].addChild(grp);
	// 		}
	// 	}
	// }
	// protected onTouchTab(e: egret.Event): void {
	// 	var index: number = parseInt(e.target.name);
	// 	if (this.lockIDs[index]) {
	// 		if (FunDefine.onIsLockandErrorHint(this.lockIDs[index])) return;
	// 	}
	// 	if (this.index != index) {
	// 		this.index = index;

	// 		switch (ChatMainPanel.openQueue[this.index]) {
	// 			case CHANNEL.GUILD:
	// 				DataManager.getInstance().chatManager.hasNewGuidTalk = false;
	// 				break;
	// 			case CHANNEL.WHISPER:
	// 				DataManager.getInstance().chatManager.hasNewWhisperTalk = false;
	// 				break;
	// 		}
	// 		this.onRefresh();
	// 	}
	// }
}
class ChatPanelParam {
	public channel: number;
	public player: SimplePlayerData;
	public content: string = '';
	public constructor($channel, $player) {
		this.channel = $channel;
		this.player = $player;
	}
}