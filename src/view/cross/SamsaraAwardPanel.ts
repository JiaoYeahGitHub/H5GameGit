class SamsaraAwardPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private reward_keys: string[] = ["firstReward", "secondReward", "Reward345", "canyuReward", "killReward"];
	private currIndex: number;
	private bossReawards: Modelbossrewards[];
	private tabBtns: eui.RadioButton[];
	private award_groups: eui.Group[];
	private items: eui.Group[];
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SamsaraAwdViewSkin;
	}
	protected onInit(): void {
		// this.setTitle("cross_boss_award_title_png");
		// this['basic']['label_title'].text = '奖励'
		this.setTitle("奖励");
		this.bossReawards = JsonModelManager.instance.getModelbossrewards();
		this.award_groups = [];
		this.items = [];
		for (let i = 0; i < 5; ++i) {
			this.award_groups[i] = this["award_group" + i];
			this.items[i] = this["item_" + i];
		}
		this.tabBtns = [];
		let level: number[] = [4, 8, 11, 15];
		for (let i = 0; i < level.length; ++i) {
			this.tabBtns[i] = this["tab" + i];
			(this.tabBtns[i]["tab_name"] as eui.Label).text = level[i] + "转";
		}

		this.currIndex = 0;
		this.updateUI();
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i: number = 0; i < this.tabBtns.length; i++) {
			this.tabBtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i: number = 0; i < this.tabBtns.length; i++) {
			this.tabBtns[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
	}
	private onTouchTabBtn(event: egret.TouchEvent): void {
		let tabBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		if (tabBtn.value != this.currIndex) {
			this.currIndex = tabBtn.value;
			this.updateUI();
		}
	}
	private updateTabs() {
		for (let i: number = 0; i < this.tabBtns.length; i++) {
			this.tabBtns[i].selected = i == this.currIndex;
		}
	}
	private updateUI() {
		this.updateTabs();
		var bossReaward: Modelbossrewards = this.bossReawards[this.currIndex];
		for (var i: number = 0; i < this.reward_keys.length; i++) {
			var rewardKeys: string = this.reward_keys[i];
			var rewardItems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(bossReaward[rewardKeys]);
			if(rewardItems){
				let length = Math.max(this.award_groups[i].numChildren, rewardItems.length);
				for (var n: number = 0; n < length; n++) {
					if (this.award_groups[i].numChildren <= n) {
						this.award_groups[i].addChild(new GoodsInstance());
					}
					var goodsInstace: GoodsInstance = this.award_groups[i].getChildAt(n) as GoodsInstance;
					if(rewardItems.length > n){
						var waveAward: AwardItem = rewardItems[n];
						goodsInstace.onUpdate(waveAward.type, waveAward.id, 0, waveAward.quality, waveAward.num);
						goodsInstace.visible = true;
					} else {
						goodsInstace.visible = false;
					}
				}
				this.items[i].visible = true;
			} else {
				this.items[i].visible = false;
			}
		}
	}
	//The end
}