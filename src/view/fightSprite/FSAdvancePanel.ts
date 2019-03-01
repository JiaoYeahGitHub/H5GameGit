class FSAdvancePanel extends BaseTabView {
	private progress: eui.ProgressBar;
	private currency: ConsumeBar;
	private btn_advance: eui.Button;
	private btn_autoAdvance: eui.Button;
	private auto: boolean = false;
	private animLayer: eui.Group;
	private magicAnim: Animation;
	private aniName: string = "";
	private currTier: number = 0;
	private currTierStar: number = 0;
	private currTierStarExp: number = 0;
	private maxExp: number;
	private addExp: number;
	private animPos: egret.Point = new egret.Point(344, 440);
	private magicPos: egret.Point = new egret.Point(344, 494);
	private starAnimLayer: eui.Group;
	private progressAnim: Animation;
	private powerBar: PowerBar;
	private label_name: eui.Label;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private img_magic: eui.Image;
	private avatar_grp: eui.Group;
	private img_star0: eui.Image;
	private img_star1: eui.Image;
	private img_star2: eui.Image;
	private img_star3: eui.Image;
	private img_star4: eui.Image;
	private img_star5: eui.Image;
	private img_star6: eui.Image;
	private img_star7: eui.Image;
	private img_star8: eui.Image;
	private img_star9: eui.Image;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FSAdvancePanelSkin;
	}
	protected onInit(): void {
		// this.progressAnim = new Animation("jindutiao");
		// this.progress["animLayer"].addChild(this.progressAnim);
		// this.progress.labelFunction = this.labelFunction;
		this.points[0].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().magicManager, "checkMagicAdvancePoint");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
		this.btn_autoAdvance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAutoAdvance, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_ADVANCE_MESSAGE.toString(), this.onAdvanceBack, this);
		this.auto = false;
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
		this.btn_autoAdvance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAutoAdvance, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_ADVANCE_MESSAGE.toString(), this.onAdvanceBack, this);
	}
	protected onRefresh(): void {
		// this.onShowMagicAnim();
		this.onShowInfo();
		this.onUpdatePower();
		this.updateAvatarAnim();
	}
	//更新外形展示
	private updateAvatarAnim(): void {
		let resurl: string = "";
		// let manager: BlessManager = DataManager.getInstance().blessManager;
		//  let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		//    let model: Modelmount = manager.getBlessModelByData(blessData);
		var model: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		//  model = curr.waixing1;
		// this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		resurl = `${model.waixing1}`;
		let _mountBody: Animation = new Animation(resurl);
		this.avatar_grp.addChild(_mountBody);
		this.avatar_grp.y = 350;
	}

	public labelFunction(value: number, maximum: number): string {
		var num: number = value / maximum * this["thumb"].width;
		egret.Tween.get(this["animLayer"].getChildAt(0)).to({ x: num }, 12);
		return `${value}/${maximum}`;
	}
	private onAdvanceBack(): void {
		var upExp: number;
		var upTier: number = this.getPlayer().magicTier - this.currTier;
		var multiple: number;
		if (upTier != 0) {
			upExp = DataManager.getInstance().magicManager.currTierExp + (this.maxExp - this.currTierStarExp);
			GameCommon.getInstance().addAnimation("jinjiechenggong", this.animPos, this.animLayer);
		} else {
			upExp = DataManager.getInstance().magicManager.currTierExp - this.currTierStarExp;
		}
		var upStar: number = Math.abs(this.getPlayer().magicTierStar - this.currTierStar);
		if (upStar != 0) {
			var animPos: egret.Point = new egret.Point(330, 330);
			GameCommon.getInstance().addAnimation("xianyujinjie", animPos, this.animLayer);
		}
		multiple = upExp / this.addExp;
		if (this.maxExp > 0) {
			if (multiple == 2) {
				GameCommon.getInstance().addAnimation(`baoji1`, this.animPos, this.animLayer);
			} else if (multiple == 5) {
				GameCommon.getInstance().addAnimation(`baoji2`, this.animPos, this.animLayer);
			}
		}
		this.onRefresh();
		if (this.auto && upTier == 0) {
			this.onTouchBtnAdvance();
		} else {
			this._auto = false;
			var textAttrName = this.auto ? 'quxiaojinjie' : "zidongjinjie";
			this.btn_autoAdvance.label = Language.instance.getText(textAttrName);
		}
	}
	//更新人物战斗力
	private onUpdatePower(): void {
		this.powerBar.power = DataManager.getInstance().magicManager.magicAdvancePower + "";
	}
	private onShowStarAnim(): void {
		if (this.getPlayer().magicTierStar != 0) {
			var x: number = this.starAnimLayer.width / 17 * (this.getPlayer().magicTierStar - 1) + this.starAnimLayer.width / 20;
			var pos = new egret.Point(x, 0);
			GameCommon.getInstance().addAnimation("zuoqishengxing", pos, this.starAnimLayer);
		}
	}

	private onShowMagicAnim(): void {
		var model: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		// this.img_magic.source = model.waixing2;
	}
	private onShowInfo(): void {
		this.currTier = this.getPlayer().magicTier;
		this.currTierStar = this.getPlayer().magicTierStar;
		this.currTierStarExp = DataManager.getInstance().magicManager.currTierExp;
		var curr: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		var next: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicNextTierKey][this.getPlayer().MagicNextStar];
		var model: Modelfabaojinjie = curr || next;
		if (curr && next) {
			model = next;
		}
		if (next) {
			if (this.getPlayer().magicTierStar == 10) {
				this.currentState = "maxStar";
			} else {
				this.currentState = "advance";
			}
			this.maxExp = next.exp;
			this.addExp = next.itemExp;
		} else if (curr && !next) {
			this.currentState = "max";
		}

		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		var add: number = 0;
		for (var key in model.attrAry) {
			if (model.attrAry[key] > 0) {
				add = curr ? curr.attrAry[key] : 0;
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, add);
				this.curPro.addChild(attributeItem);

				add = next ? next.attrAry[key] : 0;
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, add);
				this.nextPro.addChild(attributeItem);
			}
		}
		var modelAdvance: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		this.label_name.text = this.getPlayer().MagicStarLv + '\n阶';//+this.getPlayer().MagicStar+'星';
		this.progress.minimum = 0;
		this.progress.maximum = model.exp;
		// this.progress.labelDisplay.text = `${DataManager.getInstance().magicManager.currTierExp}/${model.exp}`;
		this.progress.value = DataManager.getInstance().magicManager.currTierExp;
		// var progressAnimX = (600 - 18 * 2) * DataManager.getInstance().magicManager.currTierExp / model.exp;
		if (next) {
			let costModel: ModelThing = GameCommon.getInstance().getThingModel(next.cost.type, next.cost.id);
			this.currency.visible = true;
			this.currency.setCostByAwardItem(next.cost);
		}
		this.onShowStar();
	}
	private onShowStar(): void {
		var img: eui.Image;
		for (var i: number = 0; i < 10; i++) {
			img = this[`img_star${i}`];
			if ((i + 1) <= DataManager.getInstance().playerManager.player.magicTierStar) {
				img.source = `star_png`;
			} else {
				img.source = `starGrey_png`;
			}
		}
	}
	private onTouchBtnAdvance(): void {
		var next: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.getPlayer().MagicStarLv][this.getPlayer().MagicStar];
		if (next && GameCommon.getInstance().onCheckItemConsume(next.cost.id, 1, next.cost.type)) {
			DataManager.getInstance().magicManager.onSendAdvanceMessage();
		} else {
			this._auto = false;
		}
	}
	private onTouchBtnAutoAdvance(): void {
		this._auto = !this.auto;
		if (this.auto) {
			this.onTouchBtnAdvance();
		}
	}
	private set _auto(value: boolean) {
		this.auto = value;
		var textAttrName = this.auto ? 'quxiaojinjie' : "zidongjinjie";
		this.btn_autoAdvance.label = Language.instance.getText(textAttrName);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}