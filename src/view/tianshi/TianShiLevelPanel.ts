class TianShiLevelPanel extends BaseTabView implements ISDKShareContainer {
	public histroy_btn: eui.Button;
	public progress: eui.ProgressBar;
	public cur_level_lab: eui.Label;
	public add_desc_lab: eui.Label;
	public activate_btn: eui.Button;
	public effcet_grp: eui.Group;
	private add_condition_grp: eui.Group;

	private anim: Animation;

	private ADD_EXP_PARAM;
	private readonly INVITE_TEXT: string = "好友助力";

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TianshiPanelSkin;
	}
	protected onInit(): void {
		this.ADD_EXP_PARAM = [
			{ type: 0, param: [Constant.get("DENGLU_EXP")], func: null },
			{ type: 1, param: [Constant.get("HAOYOU_LEVEL"), Constant.get("HAOYOU_EXP")], func: "onCheckCondition1" }
		];
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();

		this.histroy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAtlasPanel, this);
		this.add_condition_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		this.activate_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActivate, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XYX_SHARE_EXP_MESSAGE.toString(), this.onUpdateInfo, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XYX_SHARE_MASTER_MESSAGE.toString(), this.onUpdateInfo, this);
	}
	protected onRemove(): void {
		super.onRemove();

		this.histroy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAtlasPanel, this);
		this.add_condition_grp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		this.activate_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActivate, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XYX_SHARE_EXP_MESSAGE.toString(), this.onUpdateInfo, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XYX_SHARE_MASTER_MESSAGE.toString(), this.onUpdateInfo, this);
	}
	private get playerM(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	protected onRefresh(): void {
		this.playerM.onSendTianshiAwardMsg(false);
	}
	private onUpdateInfo(): void {
		this.add_condition_grp.removeChildren();

		let awardinviteExp: number = this.playerM.tianshiAwdNum * parseInt(Constant.get("HAOYOU_EXP"));
		let next_model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[this.playerM.player.shareMasterId + 1];
		this.cur_level_lab.text = Language.instance.parseInsertText("tianshi_level", this.playerM.player.shareMasterId);
		this.add_desc_lab.text = Language.instance.parseInsertText("tianshi_plus_type" + next_model.type, (next_model.allplus / GameDefine.GAME_ADD_RATIO * 100) + "%");
		if (next_model) {
			this.progress.maximum = next_model.exp;
			this.progress.value = this.playerM.player.shareExp;
			this.progress.labelFunction = function (value: number, maximum: number): string {
				return `${DataManager.getInstance().playerManager.player.shareExp}/${maximum}`;
			};
			this.activate_btn.enabled = true;
			if (this.playerM.player.shareExp < next_model.exp) {
				this.activate_btn.label = this.INVITE_TEXT;
			} else {
				this.activate_btn.label = Language.instance.getText("shenqijihuo");
			}

			if (!this.anim) {
				this.anim = new Animation(next_model.donghua);
				this.effcet_grp.addChild(this.anim);
			} else {
				this.anim.onUpdateRes(next_model.donghua, -1);
			}

			for (let idx in this.ADD_EXP_PARAM) {
				let paramobj = this.ADD_EXP_PARAM[idx];
				let iscomplete: number = paramobj.func ? (this[paramobj.func]()) : 2;
				let textcolor: number = 0xFCE89C;

				let condition_str: string = Language.instance.parseInsertText("tianshi_condition_type" + paramobj.type, ...paramobj.param);
				if (condition_str.indexOf("[$tianshiInviteNum]") != -1) {
					condition_str = condition_str.replace("[$tianshiInviteNum]", this.playerM.tianshiInviteNum + "");
				}
				if (condition_str.indexOf("[$friendNumMax]") != -1) {
					condition_str = condition_str.replace("[$friendNumMax]", next_model.friendNumMax + "");
				}
				if (condition_str.indexOf("[$tianshiAwdNum]") != -1) {
					condition_str = condition_str.replace("[$tianshiAwdNum]", awardinviteExp + "");
				}
				switch (iscomplete) {
					case 1:
						textcolor = 0x22FC00;
						condition_str += "(点击可领取)";
						break;
					case 2:
						textcolor = 0xFFF000;
						condition_str += "(已完成)";
						break;
					default:
						condition_str += "(进行中)";
						break;
				}
				let condition_lab: eui.Label = GameCommon.getInstance().createNormalLabel(18, textcolor, 2, 0x260000, egret.HorizontalAlign.CENTER);
				condition_lab.width = 520;
				condition_lab.lineSpacing = 5;
				condition_lab.text = condition_str;
				if (iscomplete == 1) GameCommon.getInstance().addUnderlineStr(condition_lab);
				this.add_condition_grp.addChild(condition_lab);
			}
		} else {
			this.progress.maximum = 1;
			this.progress.value = 1;
			this.progress.labelFunction = function (value: number, maximum: number): string {
				return `MAX`;
			};
			this.activate_btn.enabled = false;
			this.activate_btn.label = Language.instance.getText("full_level");

			if (this.anim) {
				this.anim.onDestroy();
				this.anim = null;
			}
		}
	}
	private onOpenAtlasPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TianshiAtlasPanel");
	}
	private onReward(): void {
		let model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[this.playerM.player.shareMasterId + 1];
		if (model && model.friendNumMax > this.playerM.tianshiAwdNum && this.playerM.tianshiInviteNum - this.playerM.tianshiAwdNum > 0) {
			this.playerM.onSendTianshiAwardMsg();
		}
	}
	private onActivate(): void {
		if (this.activate_btn.label == this.INVITE_TEXT) {
			SDKManager.share(this, WX_SHARE_TYPE.INVITE_FRIEND);
		} else {
			let activateMsg: Message = new Message(MESSAGE_ID.XYX_SHARE_MASTER_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(activateMsg);
		}
	}
	private onCheckCondition1(): number {
		let model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[this.playerM.player.shareMasterId + 1];
		if (model) {
			if (model.friendNumMax <= this.playerM.tianshiAwdNum) {
				return 2;
			}
			if (this.playerM.tianshiInviteNum - this.playerM.tianshiAwdNum > 0) {
				return 1;
			}
		}
		return 0;
	}
	/**
     * 分享信息提示
     */
	showShareInfo: (info: ISDKShareInfo) => void;
    /**
     * 分享信息更新
     */
	updateShareInfo: (info: ISDKShareInfo) => void;
    /**
     * 分享完成
     */
	shareComplete: () => void;
	//The end
}