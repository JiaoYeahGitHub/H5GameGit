class SkillUpgradeView extends BaseWindowPanel {
	public basic: eui.Component;
	public add_damage_lab: eui.Label;
	public icon_left_img: eui.Image;
	public name_left_lab: eui.Label;
	public grade_left_lab: eui.Label;
	public icon_right_img: eui.Image;
	public name_right_lab: eui.Label;
	public grade_right_lab: eui.Label;
	public upgrade_btn: eui.Button;
	public consume: ConsumeBar;

	private _skillInfo: SkillInfo;
	private _cost: AwardItem;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SkillTuPoViewSkin;
	}
	public onShowWithParam(param): void {
		this._skillInfo = param;
		this.onShow();
	}
	public onShow(): void {
		if (!this._skillInfo) {
			return;
		}
		if (this._skillInfo.grade == SkillDefine.SKILL_GRADE_MAX) {
			GameCommon.getInstance().addAlert("jinengfumozuigao");
			return;
		}
		super.onShow();
	}
	protected onInit(): void {
		this.setTitle("技能附魔");
		super.onInit();
		this.onRefresh();
	}
	public onRefresh(): void {
		this._cost = null;
		var skillID: number = this._skillInfo.id;
		var curr_grade: number = this._skillInfo.grade;
		var model: Modelskilltupo = JsonModelManager.instance.getModelskilltupo()[skillID][curr_grade - 1];
		var nextmodel: Modelskilltupo = JsonModelManager.instance.getModelskilltupo()[skillID][curr_grade];
		if (nextmodel) {
			this.currentState = "upgrade";
			this.add_damage_lab.text = nextmodel.effect + "点";
			this._cost = nextmodel.cost;
			if (this._cost && this._cost.type) {
				this.consume.setCostByAwardItem(this._cost);
			}
		} else {
			this.currentState = "full";
			// this.upgrade_des_lab.visible = false;
		}

		nextmodel = nextmodel || model;
		this.name_left_lab.text = this._skillInfo.getName();
		this.name_right_lab.text = Language.instance.getText(`skillname_${nextmodel.skillId}_${curr_grade + 1}`);
		this.icon_left_img.source = this._skillInfo.getIcon();
		this.icon_right_img.source = this._skillInfo.getIcon(nextmodel.tupoLv);
		// this.frame_left_img.source = `skill_icon_frame${model.tupoLv}_png`;
		// this.frame_right_img.source = `skill_icon_frame${nextmodel.tupoLv}_png`;
		this.grade_left_lab.text = model.tupoLv + "阶附魔";
		this.grade_right_lab.text = nextmodel.tupoLv + "阶附魔";
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		// GameDispatcher.getInstance().addEventListener(GameEvent.GAME_YEWAI_FIGHT_UPDATE, this.onRefreshWave, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		// GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_YEWAI_FIGHT_UPDATE, this.onRefreshWave, this);
	}
	private getPlayer(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	private onUpgrade(): void {
		if (this._cost && !GameCommon.getInstance().onCheckItemConsume(this._cost.id, this._cost.num, this._cost.type)) {
			return;
		}
		if (this._skillInfo) {
			var message: Message = new Message(MESSAGE_ID.SKILL_UPGRADE_MESSAGE);
			message.setByte(0);
			message.setByte(this._skillInfo.index);
			GameCommon.getInstance().sendMsgToServer(message);
			this.onTouchCloseBtn();
		}
	}
	//The end
}