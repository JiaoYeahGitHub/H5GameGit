class MagicSkillFashionPanel extends BaseWindowPanel {
	private blessType: number = 0;
	private skillTitle: eui.Label;
	private skillDesc: eui.Label;
	private avatar_grp: eui.Group;
	private fashion: FashionData;
	private roleAvatar: PlayerBody;
	private emenyAvatar: ActionBody;
	private isAction: boolean;
	private roleAppears: AppearPlayerData;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicSkillFashionSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("皮肤技能");
		this.initAvata();
	}
	private initAvata() {
		this.roleAvatar = new PlayerBody();
		this.roleAvatar.isDamageFalse = true;
		this.roleAvatar.inMap = false;
		let playerData: PlayerData = GameFight.getInstance().onRandomCrateRobotData(1, 2);
		this.roleAppears = new AppearPlayerData();
		playerData.sex = this.playerData.sex;
		playerData.setAppear(this.roleAppears);
		this.roleAvatar.data = playerData;
		this.roleAvatar.onHideHeadBar(false);

		this.emenyAvatar = new MonsterBody();
		this.emenyAvatar.data = new MonsterData(FightDefine.PVE_MONSTER_COMID, BODY_TYPE.MONSTER);
		this.emenyAvatar.visible = false;
		this.emenyAvatar.inMap = false;

		this.roleAvatar.onAddEnemyBodyList([this.emenyAvatar]);
		this.roleAvatar.currTarget = this.emenyAvatar;
	}
	public onShowWithParam(param): void {
		this.blessType = param;
		this.fashion = this.playerData.fashionSkils[this.blessType];
		this.onShow();
	}
	protected initAction(): void {
		this.onShowInfo();
		this.updateAvatarAnim();
	}
	private onShowInfo(): void {
		this.skillDesc.text = this.fashion.skillInfo.model.disc;
	}
	protected onRegist(): void {
		super.onRegist();
		this.isAction = true;
		this.initAction();
	}
	protected onRemove(): void {
		super.onRemove();
		this.isAction = false;
	}
	//更新外形展示
	private updateAvatarAnim(): void {
		for (var i: number = 0; i < BLESS_TYPE.SIZE; i++) {
			this.roleAppears.appears[i] = this.playerData.getAppearID(i);
		}
		this.roleAvatar.data.setAppear(this.roleAppears);
		this.roleAvatar.onUpdateAvatar();

		this.avatar_grp.removeChildren();
		this.avatar_grp.addChild(this.roleAvatar);
		this.avatar_grp.addChild(this.emenyAvatar);

		this.roleAvatar.data.onRebirth();
		this.roleAvatar.onResetSkillEffect();

		this.roleAvatar.x = 0;
		this.roleAvatar.y = 0;
		this.emenyAvatar.x = this.roleAvatar.x + 10;
		this.emenyAvatar.y = this.roleAvatar.y;

		this.updateSkill();
	}
	private updateSkill() {
		if (this.isAction) {
			this.onUseSkill();
			Tool.callbackTime(this.updateSkill, this, 8000);
		}
	}
	private onUseSkill(): void {
		this.roleAvatar.data.useSkill = this.fashion.skillInfo;
		this.roleAvatar.onAttack();
	}
	protected get playerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
}