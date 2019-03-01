class ServerPVEBossAwardPanel extends BaseWindowPanel {
	private models;
	private currIndex: number = 0;
	private TAB_MAX: number = 4;
	private sure_btn: eui.Button;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}

	protected onInit(): void {
		this.setTitle("排行奖励");

		this.models = [];
		let sysQueue = [];
		for (let id in JsonModelManager.instance.getModelkuafubossrewards()) {
			let model: Modelkuafubossrewards = JsonModelManager.instance.getModelkuafubossrewards()[id];
			if (model.ranking > 0) {
				if (!this.models[model.bossId - 1]) {
					this.models[model.bossId - 1] = [];
				}
				this.models[model.bossId - 1].push(model);
			}
		}
		for (let i: number = 0; i < this.models.length; i++) {
			this.models[i].sort(function onSort(a, b): number {
				return a.ranking - b.ranking;
			});
			let awradmodel: Modelkuafubossrewards = this.models[i][0];
			let bossmodel: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[awradmodel.bossId];
			(this['tab' + i]["tab_name"] as eui.Label).text = bossmodel.limitLevel + "转";
		}
		(this['tab' + this.currIndex] as eui.RadioButton).selected = true;

		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.ServerPVEBossAwdView;
	}
	protected onRefresh(): void {
		let awdmodels: Modelkuafubossrewards[] = this.models[this.currIndex];
		for (let i: number = 0; i < awdmodels.length; i++) {
			if (!this["award_group" + i]) break;
			(this["award_group" + i] as eui.Group).removeChildren();
			for (let n: number = 0; n < awdmodels[i].rewards.length; n++) {
				let awarditem: AwardItem = awdmodels[i].rewards[n];
				let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
				(this["award_group" + i] as eui.Group).addChild(goodsInstace);
			}
		}
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i: number = 0; i < this.TAB_MAX; i++) {
			(this['tab' + i] as eui.RadioButton).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i: number = 0; i < this.TAB_MAX; i++) {
			(this['tab' + i] as eui.RadioButton).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	private onTouchTabBtn(event: egret.TouchEvent): void {
		let tabBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		if (tabBtn.value != this.currIndex) {
			this.currIndex = tabBtn.value;
			this.onRefresh();
		}
	}
	//The end
}