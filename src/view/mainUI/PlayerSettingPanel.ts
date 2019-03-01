class PlayerSettingPanel extends BaseWindowPanel {
	protected points: redPoint[] = RedPointManager.createPoint(2);
	private changeNameBtn: eui.Button;
	private changeIconBtn: eui.Button;
	private changeFrameBtn: eui.Button;
	// private changeSound: eui.Button;
	private userName: eui.Label;
	private userId: eui.Label;
	private unionName: eui.Label;
	private unionLv:eui.Label;
	private leagueBossName:eui.Label;
	// private hero_headIcon: eui.Image;
	private playerHead: PlayerHeadPanel;
	private consumItem: ConsumeBar;
	private label_get: eui.Label;
	private userLv: eui.Label;
	private userLvFZ: eui.Label;// 纷争等级
	private cb_sound: eui.CheckBox;
	private powerbar:PowerBar;
	private self_rank_num_label:eui.Label;
	private yewaiNum:eui.Label;
	private readonly COST_ITEM_ID: number = 359;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PlayerSettingSkin;
	}
	protected onInit(): void {
		// this.label_get.text = Language.instance.getText("huoqutujing");
		// GameCommon.getInstance().addUnderline(this.label_get);
		// this.label_get.touchEnabled = true;
		// this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

		this.onRefresh();
		this.points[0].register(this.changeIconBtn, new egret.Point(165, 5), DataManager.getInstance().playerManager, "checkRedPointHead");
		this.points[1].register(this.changeFrameBtn, new egret.Point(165, 5), DataManager.getInstance().playerManager, "checkRedPointHeadFrame");
	}
	private onGetBtn(event: TouchEvent): void {
		GameCommon.getInstance().onShowFastBuy(this.COST_ITEM_ID);
	}
	private isUpdate: boolean = false;
	protected onRefresh(): void {
		this.consumItem.setConsume(GOODS_TYPE.ITEM, this.COST_ITEM_ID);
		this.userName.text = DataManager.getInstance().playerManager.player.name;
		this.userId.text = 'ID:' + DataManager.getInstance().playerManager.player.id;
		this.powerbar.power = DataManager.getInstance().playerManager.player.playerTotalPower;
		this.unionName.text = DataManager.getInstance().unionManager.unionInfo ? '仙盟:'+DataManager.getInstance().unionManager.unionInfo.info.name : "仙盟:暂无";
		this.unionLv.text = DataManager.getInstance().unionManager.unionInfo ? '仙盟等级:Lv.'+DataManager.getInstance().unionManager.unionInfo.info.level : "仙盟等级:Lv.0";
		this.leagueBossName.text = DataManager.getInstance().unionManager.unionInfo ? '盟主:'+DataManager.getInstance().unionManager.unionInfo.info.wangName : "盟主:暂无";
		this.userLv.text = Language.instance.getText("dengji") + "：" + DataManager.getInstance().playerManager.player.coatardLv + '转' + DataManager.getInstance().playerManager.player.level + '级';
		this.userLvFZ.text = Language.instance.getText("zhangonglv") + "：" + DataManager.getInstance().pvpManager.getModelCurr().lv + '级';
		
		var arenaRankData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;
        if (arenaRankData.rank > 0) {
            this.self_rank_num_label.text = '竞技排名:'+arenaRankData.rank;
        } else {
            this.self_rank_num_label.text = '竞技排名:未上榜';
        }
		this.yewaiNum.text = '野外关卡:第'+GameFight.getInstance().yewai_waveIndex + '关';
		// this.hero_headIcon.source = GameCommon.getInstance().getBigHeadByOccpation(DataManager.getInstance().playerManager.player.headIndex);
		this.playerHead.setHead();
	}
	protected onRegist(): void {
		super.onRegist();
		this.setTitle("设 置");
		this.changeNameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowNameChange, this);
		this.changeIconBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowIconChange, this);
		this.changeFrameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFrameChange, this);
		this.cb_sound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSoundCkBtn, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_FRAME_CHANGE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE.toString(), this.onRefresh, this);
		this.updateSound();
	}
	protected onRemove(): void {
		super.onRemove();
		this.changeNameBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowNameChange, this);
		this.changeIconBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowIconChange, this);
		this.changeFrameBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFrameChange, this);
		this.cb_sound.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSoundCkBtn, this);

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_FRAME_CHANGE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE.toString(), this.onRefresh, this);
	}
	private updateSound() {
		this.updateUI(GameSetting.getLocalSetting(GameSetting.SOUND_MUTE));
	}
	private onTouchSoundCkBtn(): void {
		var ismute: boolean = SoundFactory.soundOpen;
		this.updateUI(ismute);
		GameSetting.setLocalSave(GameSetting.SOUND_MUTE, ismute);
		SoundFactory.playMusic(SoundDefine.SOUND_BGM);
	}
	private updateUI(ismute: boolean) {
		// this.changeSound.skinName = ismute ? skins.Common_ButtonGraySkin : skins.Common_ButtonSkin;
		// this.changeSound.labelDisplay.text = ismute ? "音乐：关" : "音乐：开";
		this.cb_sound.selected = ismute;
	}
	private onShowNameChange(e: egret.Event): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ChangeNamePanel");
	}
	private onShowIconChange(e: egret.Event): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SystemOptPanel");
	}
	private onShowFrameChange(){
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PlayerHeadFramePanel");
	}
	//The end
}