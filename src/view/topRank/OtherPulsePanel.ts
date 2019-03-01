class OtherPulsePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PulsePanelSkin;
    }
	protected onInit(): void {
        super.onInit();
		this.onRefresh();
    }
	protected onRefresh(): void {
    }
	protected onRegist(): void {
        super.onRegist();
	}
    protected onRemove(): void {
        super.onRemove();
	}
}