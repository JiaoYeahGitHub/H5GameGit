class YewaiPVPLosePanel extends BaseWindowPanel {
	private btn_sure: eui.Button;
	// private closeBtn: eui.Button;
	private banImg: eui.Image;
	private imgDi:eui.Image;
    private banGo:eui.Button;
	// private bianqiang_groud: eui.Group;
	private award_Scroller: eui.Scroller;
	private award_groud: eui.Group;
	private biangqiangAllGotype: number[] = [2, 4, 17, 18, 19, 20, 5, 57];
	private itemAwards: AwardItem[];
	private allbianqiangBtns: StrongerButton[];
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
		this.allbianqiangBtns = [];
	}
	protected onSkinName(): void {
		this.skinName = skins.YewaiPVPLosePanelSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		 this.banGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goRecharge, this);
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		for (var i: number = 0; i < this.allbianqiangBtns.length; i++) {
			var bianqiangBtn: StrongerButton = this.allbianqiangBtns[i];
			bianqiangBtn.addGotypeEventListener();
		}
	}
	public onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		 this.banGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goRecharge, this);
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		for (var i: number = 0; i < this.allbianqiangBtns.length; i++) {
			var bianqiangBtn: StrongerButton = this.allbianqiangBtns[i];
			bianqiangBtn.removeGotypeEventListener();
		}
	}
	public onHide(): void {
		super.onHide();
		Tool.removeTimer(this.onCloseTimedown, this, 1000);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
	}
	private goRecharge():void{
        if (DataManager.getInstance().rechargeManager.firstCharge == 0) {
                 GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FirstChargePanel");
        }
        else if(DataManager.getInstance().newactivitysManager.chargeMoneyNum < 188&&DataManager.getInstance().newactivitysManager.chargeMoneyNum>=0)
        {
             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_CHONGBANG);
        }
        else
        {
             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
        }
    }
	protected onInit(): void {
		super.onInit();
		// for (var i: number = 0; i < this.biangqiangAllGotype.length; i++) {
		// 	var gotype: number = this.biangqiangAllGotype[i];
		// 	var bianqiangBtn: StrongerButton = new StrongerButton();
		// 	bianqiangBtn.registGotype(gotype);
		// 	this.allbianqiangBtns.push(bianqiangBtn);
		// 	this.bianqiang_groud.addChild(bianqiangBtn);
		// }
		this.onRefresh();
	}
	protected onRefresh(): void {
		super.onRefresh();
		if (DataManager.getInstance().rechargeManager.firstCharge == 0) {
            this.banImg.source = 'result_desc1_png';
            this.imgDi.source = 'result_Img1_png';
        }
        else if(DataManager.getInstance().newactivitysManager.chargeMoneyNum < 188&&DataManager.getInstance().newactivitysManager.chargeMoneyNum>=0)
        {
            this.banImg.source = 'result_desc2_png';
            this.imgDi.source = 'result_Img2_png';
        }
        else
        {   
            this.banImg.source = 'result_vipDesc'+this.getPlayerData().viplevel+'_png';
            this.imgDi.source = 'result_Img3_png';
        }

		this.onPlayAwardAnim();
		this._showleftTime = 6;
		Tool.addTimer(this.onCloseTimedown, this, 1000);
	}
	private getPlayerData() {
		return DataManager.getInstance().playerManager.player;
	}
	public onShowWithParam(param): void {
		this.itemAwards = param as AwardItem[];
		if (this.itemAwards)
			super.onShowWithParam(param);
	}
	private onPlayAwardAnim(): void {
		this.ondestory();
		for (var i: number = 0; i < this.itemAwards.length; i++) {
			var awarditem: AwardItem = this.itemAwards[i];
			var goodsInstance: GoodsInstance = new GoodsInstance();
			this.award_groud.addChild(goodsInstance);
			goodsInstance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
		}
	}
	private ondestory(): void {
		for (var i: number = this.award_groud.numChildren - 1; i >= 0; i--) {
			var goodsInstance: GoodsInstance = this.award_groud.getChildAt(i) as GoodsInstance;
			egret.Tween.removeTweens(goodsInstance);
			this.award_groud.removeChild(goodsInstance);
			goodsInstance = null;
		}
		this.award_groud.removeChildren();
	}
	private _showleftTime: number;
	private onCloseTimedown(): void {
		this._showleftTime--;
		if (this._showleftTime < 0) {
			Tool.removeTimer(this.onCloseTimedown, this, 1000);
			this.onHide();
			return;
		}
		this.btn_sure.label = `离开(${this._showleftTime})`;
	}
	//The end
}