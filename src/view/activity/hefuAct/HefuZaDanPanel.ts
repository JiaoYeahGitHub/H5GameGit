class HefuZaDanPanel extends HefuTreasurePanel {
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private showAwardPanel:eui.Group;
	private showawd_grp:eui.Group;
	private danIcon:eui.Image;
	private podan:eui.Image;
	private zadanEffect:eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuZaDanPanelSkin;
	}
	protected onInit(): void {
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.showAwardPanel.visible = false;
		this.podan.visible = false;
		this.danIcon.visible = true;
	}
	//覆盖方法  更新奖励预览
	protected onShowTurnplate(): void {
		let goods: GoodsInstance;
        let awarditems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
        for (let i: number = 0; i < awarditems.length; i++) {
            let awarditem: AwardItem = awarditems[i];
            goods = this[`item${i}`];
            if (goods) {
                goods.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num, awarditem.lv);
            } 
        }
	}
	protected onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			while (this.zadanEffect.numChildren > 0) {
					let display = this.zadanEffect.getChildAt(0);
					if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
						(display as Animation).onDestroy();
					} else {
						this.zadanEffect.removeChild(display);
					}
				}
					DataManager.getInstance().xiandanManager.stats = 0;
					var _mountBody: Animation = new Animation('zadan_01');
						_mountBody.autoRemove = false;
						_mountBody.playNum = 1;
						_mountBody.playFinishCallBack(this.onAnimFinish, this)
						this.zadanEffect.addChild(_mountBody);
						_mountBody.y = 50;
		}
	}
	private onAnimFinish(): void {
		this.showAwardPanel.visible = true;
			var i: number = 0;
			var param;
			var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show)
		for (i = 0; i < _rewards.length; i++) {
				if (DataManager.getInstance().festivalWuYiManager.zhuanpanId == _rewards[i].id && DataManager.getInstance().festivalWuYiManager.zhuanpanType == _rewards[i].type && DataManager.getInstance().festivalWuYiManager.zhuanpanAwardNum == _rewards[i].num) {
					var  goods:GoodsInstance = this['itemNb'];
					if (goods) {
						goods.onUpdate(_rewards[i].type, _rewards[i].id, 0, _rewards[i].quality, _rewards[i].num, _rewards[i].lv);
						this.podan.visible = true;
						this.danIcon.visible = false;
						super.onRefresh();
						super.onShowAward();
						this.isRun = false;
						return;
					}
				}
			}
			this.podan.visible = true;
			this.danIcon.visible = false;
			this.isRun = false;
			super.onRefresh();
			super.onShowAward();
	}

}