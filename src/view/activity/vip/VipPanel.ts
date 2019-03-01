class VipPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private tab: number = 0;
	private font_vip: eui.BitmapLabel;
	private font_vip1: eui.BitmapLabel;
	private label_rechargeAgain: eui.Label;
	private bar_recharge: eui.ProgressBar;
	private btn_pageUp: eui.Button;
	private btn_pageDown: eui.Button;
	private font_common: eui.BitmapLabel;
	private img_prerogative: eui.Image;
	private awardLayer: eui.Group;
	private btn_recharge: eui.Button;
	private label1: eui.Label;
	private label2: eui.Label;
	private viplvGroup:eui.Group;
	private desc_scroller: eui.Scroller;
	private rightGroup:eui.Group;
	private leftGroup:eui.Group;
	private tequan:eui.Group;
	private loolLabel: eui.Label;
	private tips_mask: eui.Group;
	private closeBtn1:eui.Button;
	private viewmask:egret.Shape;
	private powerUp:eui.BitmapLabel;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.VipPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.desc_scroller.verticalScrollBar.autoVisibility = false;
		this.desc_scroller.verticalScrollBar.visible = false;
		GameCommon.getInstance().addUnderlineStr(this.loolLabel);
		this.loolLabel.touchEnabled = true;
		this.loolLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowTeQuan, this);
		this.viewmask = new egret.Shape();
        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.5);

        this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.viewmask.graphics.endFill();
		this.tips_mask.addChild(this.viewmask);

		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseTeQuan, this);
		this.btn_pageUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPageUp, this);
		this.btn_pageDown.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPageDown, this);
		this.btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onShowVIPInfo, this);
	}
	protected onRemove(): void {
		super.onRemove();
		 this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseTeQuan, this);
		this.btn_pageUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPageUp, this);
		this.btn_pageDown.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPageDown, this);
		this.btn_recharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onShowVIPInfo, this);
	}
	private onShowTeQuan(event: TouchEvent): void {
		this.tequan.visible = true;
		this.tips_mask.visible = true;
	}
	private onCloseTeQuan():void{
		this.tequan.visible = false;
		this.tips_mask.visible = false;
	}
	private onUpdateCurrency() {
		this.onShowVIPInfo();
		this.onShowPrerogative();
	}
	private onTouchBtnRecharge() {
		this.onHide();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
	private onShowPrerogative() {
		let vip: number = this.tab + 1;
		if (vip >= VipDefine.MAX_VIPLEVEL) {
			vip = VipDefine.MAX_VIPLEVEL;
		}

		var vipPowers =  Constant.get(Constant.VIP_POWER).split(",");
		if(vipPowers[vip-1])
		this.powerUp.text = vipPowers[vip-1];
		
		var vipName:number = GameCommon.getInstance().getVipName(vip);
		this.font_common.text = GameCommon.getInstance().getVipName(vip).toString();
		this.img_prerogative.source = "vip_desc_zi" +  GameCommon.getInstance().getVipName(vip)  + "_png";
		let item: GoodsInstance;
		let award: AwardItem;
		this.awardLayer.removeChildren();
		let model: Modelvip = JsonModelManager.instance.getModelvip()[vip - 1];
		let items: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.gainId);
		for (let i: number = 0; i < items.length; i++) {
			award = items[i];
			item = GameCommon.getInstance().createGoodsIntance(award);
			this.awardLayer.addChild(item);
		}
		this.label1.text = "充值" + (model.costNum) + "元成为VIP" + GameCommon.getInstance().getVipName(model.level);
		let str: string = model.miaoshu;
		let arr: string[] = str.split("#");
		let showStr: string = "";
		for (let i = 0; i < arr.length; ++i) {
			let s: string[] = arr[i].split(",");
			let wId: string = s[0];
			let param: string = s[1];
			let index: number = i + 1;
			if(wId=='12')
			{
			showStr += (i > 0 ? '\n' : '') + index + '.' + Language.instance.getText(`vip_miaoshu_${vipName}`);
			continue;
			}
			showStr += (i > 0 ? '\n' : '') + index + '.' + Language.instance.parseInsertText(`vipweals_${wId}`, param);
		}

		this.rightGroup.removeChildren();
		this.leftGroup.removeChildren();
		let resurl: string = "";
		resurl = model.donghua1;
		var _mountBody: Animation = new Animation(resurl);
		this.rightGroup.addChild(_mountBody);
		let s: string[] = model.donghua2.split(",");
		switch (Number(s[0])) {
			case BLESS_TYPE.HORSE:
				resurl = 'zuoqi_'+s[1];
				let _mountBody: Animation = new Animation(resurl);
				_mountBody.y = 0;
				this.leftGroup.addChild(_mountBody);
				break;
			case BLESS_TYPE.WEAPON:
				resurl = 'jian' + +s[1];
				var anim = new Animation(resurl, -1);
				this.leftGroup.addChild(anim);
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = this.getPlayerData().sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = 'shenzhuang_'+sex+'_'+s[1];
				var anim = new Animation(resurl, -1);
				anim.y = 140;
				this.leftGroup.addChild(anim);
				break;
			case BLESS_TYPE.MAGIC:
				var anim = new Animation('sc_magic' + +s[1], -1);
				this.leftGroup.addChild(anim);
				anim.y = 20;
				anim.scaleX = anim.scaleY = 1.5;
				break;
			case BLESS_TYPE.WING:
				var anim = new Animation('wing' + +s[1] + "_ui", -1);
				anim.y = 110;
				this.leftGroup.addChild(anim);
				break;
		}
		this.label2.textFlow = (new egret.HtmlTextParser).parser(GameCommon.getInstance().readStringToHtml(showStr));
	}
	private onTouchBtnPageUp() {
		this.tab -= 1;
		if (this.tab < 0) {
			this.tab = 0;
		}
		this.onShowPrerogative();
	}
	private onTouchBtnPageDown() {
		this.tab += 1;
		if (this.tab >= VipDefine.MAX_VIPLEVEL) {
			this.tab = VipDefine.MAX_VIPLEVEL - 1;
		}
		this.onShowPrerogative();
	}
	private getPlayerData() {
		return DataManager.getInstance().playerManager.player;
	}
	protected onRefresh(): void {
		this.tab = this.getPlayerData().viplevel;
		this.onShowVIPInfo();
		this.onShowPrerogative();
	}
	private onShowVIPInfo() {
		var playerData = this.getPlayerData();
		this.font_vip.text = GameCommon.getInstance().getVipName(playerData.viplevel).toString();
		this.font_vip1.text = (GameCommon.getInstance().getVipName(playerData.viplevel + 1)).toString();
		var model: Modelvip = JsonModelManager.instance.getModelvip()[playerData.viplevel - 1];
		var modelEd: Modelvip = JsonModelManager.instance.getModelvip()[playerData.viplevel];
		if (modelEd) {
			var currMaxExp: number = 0;
			if (model) {
				currMaxExp = model.costNum;
			}
			var currExp: number = playerData.vipExp;
			var sumExp: number = modelEd.costNum;
			var remainExp: number = modelEd.costNum - playerData.vipExp;
			var nextV:number = GameCommon.getInstance().getVipName(playerData.viplevel + 1)
			this.label_rechargeAgain.textFlow = new Array<egret.ITextElement>(
				{ text: `再充值`, style: {} },
				{ text: (remainExp)+'', style: { "textColor": 0x52E212 } },
				{ text: `元即可成为`, style: {} },
				{ text: `VIP${nextV}`, style: { "textColor": 0x52E212 } }
			);
			this.viplvGroup.visible = true;
			this.bar_recharge.visible = true;
			this.bar_recharge.maximum = sumExp;
			this.bar_recharge.value = currExp;
		} else {
			this.viplvGroup.visible = false;
			this.bar_recharge.visible = false;
			this.bar_recharge.maximum = 0;
			this.bar_recharge.value = 0;
			this.label_rechargeAgain.textFlow = new Array<egret.ITextElement>(
				{ text: `已达目前VIP最高等级`, style: {} }
			);
		}

	}
	private onTouchBtnbuy() {

	}
}