class TeamDupReadyPanel extends BaseWindowPanel {
	private quit_btn: eui.Button;
	private ready_time_lab: eui.Label;

	private readytime: number = 0;
	private canEnter: boolean = false;
	private TEAM_MAX: number = 3;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TeamDupReadySkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		super.onRefresh();
		if(GameFight.getInstance().teamdupRoomDupId==48 || GameFight.getInstance().teamdupRoomDupId==49){
			this.TEAM_MAX = 2;
			this.currentState = 'marry';
		} else {
			this.TEAM_MAX = 3;
			this.currentState = 'normal';
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.canEnter = false;
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TEAMDUP_READYINFO_MESSAGE.toString(), this.onReciveTeaminfoMsg, this);
		this.quit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitTeam, this);
		Tool.addTimer(this.onTimeDown, this, 1000);
		GameFight.getInstance().isteamdupReady = true;
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TEAMDUP_READYINFO_MESSAGE.toString(), this.onReciveTeaminfoMsg, this);
		this.quit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitTeam, this);
		Tool.removeTimer(this.onTimeDown, this, 1000);
		GameFight.getInstance().isteamdupReady = false;
	}
	private onTimeDown(): void {
		if (this.canEnter) {
			this.onEnterDup();
		} else {
			this.onsynchroteaminfo();
		}
		var lefttime: number = Math.max(0, Math.round(this.readytime - egret.getTimer() / 1000));
		this.ready_time_lab.text = Language.instance.parseInsertText('zuduifuben_txt_1', this.readytime);
	}
	private onsynchroteaminfo(): void {
		var teaminfoMsg: Message = new Message(MESSAGE_ID.TEAMDUP_READYINFO_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(teaminfoMsg);
	}
	private onReciveTeaminfoMsg(msgEvenet: GameMessageEvent): void {
		var msg: Message = msgEvenet.message;
		var lefttime: number = msg.getByte();
		if (lefttime < 0) {
			this.onTouchCloseBtn();
			return;
		}
		this.readytime = Math.max(0, lefttime);
		var teamsize: number = msg.getByte();
		for (var i: number = 0; i < this.TEAM_MAX; i++) {
			if (teamsize > i) {
				var team_playerdata: SimplePlayerData = new SimplePlayerData();
				team_playerdata.parseMsg(msg);
				(this[`playerHead${i}`] as PlayerHeadPanel).setHead(team_playerdata.headindex, team_playerdata.headFrame);
				(this[`team_name_lab${i}`] as eui.Label).text = GameCommon.getInstance().getNickname(team_playerdata.name);
				(this[`team_power_lab${i}`] as eui.Label).text = Language.instance.getText('power') + ":" + team_playerdata.fightvalue;
			} else {
				(this[`playerHead${i}`] as PlayerHeadPanel).onClear();
				(this[`team_name_lab${i}`] as eui.Label).text = "";
				(this[`team_power_lab${i}`] as eui.Label).text = "";
			}
		}
		this.canEnter = this.readytime == 0 || teamsize >= this.TEAM_MAX;

		if (this.canEnter) {
			this.ready_time_lab.text = Language.instance.getText('zuduifuben_txt_2');
		} else {
			this.ready_time_lab.text = Language.instance.parseInsertText('zuduifuben_txt_1', this.readytime);
		}
	}
	private onEnterDup(): void {
		// var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_TEAM)[0];
		GameFight.getInstance().onSendEnterDupMsg(GameFight.getInstance().teamdupRoomDupId);
		GameFight.getInstance().teamdupRoomDupId = 0;
		this.onHide();
	}
	private onQuitTeam(): void {
		var quitMsg: Message = new Message(MESSAGE_ID.TEAMDUP_LEAVETEAM_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(quitMsg);
		this.onHide();
	}
	//The end
}