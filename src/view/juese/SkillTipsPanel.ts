class SkillTipsPanel extends BaseTipsBar {
    private desc:eui.Label;
	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	protected initSkinName(): void {
		this.skinName = skins.SkillTipsSkin;
	}
	public onUpdate(param: IntroduceBarParam): void {
			var skillCfg: Modelskill = param.model;
			(this['name_label'] as eui.Label).text = skillCfg.name;
			this.desc.text = skillCfg.disc;
			(this['icon'] as eui.Image).source = skillCfg.icon;
	
	}
}