class HefuChouqianPanel extends HefuTreasurePanel {
	private showawd_grp: eui.Group;
	private qianRecords: ForgePosInfo[];
	private lottery_result_grp: eui.Group;
	private lottery_awd_grp: eui.Group;
	private one_lottery_goods: GoodsInstance;
	private LOTTRY_QIAN_MAX: number = 5;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuChouQianPanelSkin;
	}
	protected onInit(): void {
		this.qianRecords = [];
		for (let i: number = 0; i < this.LOTTRY_QIAN_MAX; i++) {
			let imgQian: eui.Image = this['img_qian' + i];
			this.qianRecords[i] = new ForgePosInfo(imgQian.x, imgQian.y, imgQian.rotation, imgQian.parent.getChildIndex(imgQian));
		}
		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();
		this.lottery_result_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeLotteryGrp, this);
		this.lottery_result_grp.visible = false;
	}
	protected onRemove(): void {
		super.onRemove();
		this.lottery_result_grp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeLotteryGrp, this);
		this.onResetQianPos();
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

		// this.showawd_grp.removeChildren();
		// let _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.manager.zhuanpanModel.show);
		// let iconModel: ModelThing;
		// let _len: number = Math.min(_rewards.length, 4);
		// for (let i: number = 0; i < _len; i++) {
		// 	let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(_rewards[i]);
		// 	this.showawd_grp.addChild(goodsinstance);
		// }
	}
	/**方法覆盖 抽奖的动画**/
	protected onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			let randomIdx: number = Tool.toInt(Math.random() * this.LOTTRY_QIAN_MAX);
			let imgQian: eui.Image = this['img_qian' + randomIdx];
			egret.Tween.get(imgQian).to({ y: -150, rotation: 0 }, 60).to({ x: -100, y: 100 }, 300).call(function onQianTop(imgqian: eui.Image, Image): void {
				imgqian.parent.setChildIndex(imgqian, imgqian.parent.numChildren - 1);
			}, this, [imgQian]).wait(100).to({ rotation: -360, x: 90, y: 0, scaleX: 1.3, scaleY: 1.3 }, 400).call(this.onPlayDone, this);
		}
	}
	protected onPlayDone(): void {
		if (this.manager.tp == 1) {
			this.one_lottery_goods.onUpdate(this.manager.zhuanpanType, this.manager.zhuanpanId, 0, null, this.manager.zhuanpanAwardNum);
			this.lottery_result_grp.visible = true;
			this.lottery_awd_grp.alpha = 0;
			this.lottery_awd_grp.y = 700;
			egret.Tween.get(this.lottery_awd_grp).to({ y: 300, alpha: 1 }, 500, egret.Ease.circIn);
		}
		else {
			super.onShowTenAward();
			egret.Tween.get(this.lottery_awd_grp).wait(200).call(this.onResetQianPos, this);
		}
	}
	protected onShowTenAward(): void {
		this.onRotateback();
	}
	//竹签归位
	private onResetQianPos(): void {
		for (let i: number = 0; i < this.LOTTRY_QIAN_MAX; i++) {
			let imgQian: eui.Image = this['img_qian' + i];
			egret.Tween.removeTweens(imgQian);
			let posinfo: ForgePosInfo = this.qianRecords[i];
			imgQian.x = posinfo.posX;
			imgQian.y = posinfo.posY;
			imgQian.rotation = posinfo.scale;
			imgQian.scaleX = imgQian.scaleY = 1;
			imgQian.parent.setChildIndex(imgQian, posinfo.childNum);
		}
		this.isRun = false;
	}
	private closeLotteryGrp(): void {
		this.onResetQianPos();
		this.lottery_result_grp.visible = false;
	}
	//The end
}