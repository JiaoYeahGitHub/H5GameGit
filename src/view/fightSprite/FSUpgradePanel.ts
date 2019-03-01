class FSUpgradePanel extends BaseTabView {
	private powerBar: PowerBar;
	private label_info: eui.Label;
	private label_name: eui.Label;
	private ExpBar: eui.ProgressBar;
	private currency: CurrencyBar;
	private label_cd: eui.Label;
	private btn_update: eui.Button;
	private progessNum: number[] = [0, 9, 20, 31.5, 43.3, 55, 66, 78, 90, 100, 100];
	private animLayer: eui.Group;
	private aniName: string = "";
	private currLv: number = 0;
	private currTier: number = 0;
	private animPos: egret.Point = new egret.Point(344, 440);
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private img_magic: eui.Image;
	private avatar_grp: eui.Group;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FSUpgradePanelSkin;
	}
	protected onInit(): void {
		DataManager.getInstance().magicManager.CDOwner = this;
		this.points[0].register(this.btn_update, GameDefine.RED_BTN_POS, DataManager.getInstance().magicManager, "checkMagicUpgradePoint");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_update.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_UPGRADE_MESSAGE.toString(), this.onUpgradeback, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_update.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpdate, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_UPGRADE_MESSAGE.toString(), this.onUpgradeback, this);
	}
	protected onRefresh(): void {
		this.onShowMagicAnim();
		this.onShowInfo();
		this.onUpdatePower();
		this.updateAvatarAnim();
	}
	//更新外形展示
	private updateAvatarAnim(): void {
		let resurl: string = "";
		// let manager: BlessManager = DataManager.getInstance().blessManager;
		//  let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		//   let model: Modelmount = manager.getBlessModelByData(blessData);
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
	private onUpgradeback(): void {
		var upLv: number = this.getPlayer().magicLv - this.currLv;
		if (upLv != 0) {
			GameCommon.getInstance().addAnimation("shengjichenggong", this.animPos, this.animLayer);
		} else {
			var upTier: number = Math.abs(this.getPlayer().magicLvExp - this.currTier);
			if (upTier == 2) {
				GameCommon.getInstance().addAnimation(`baoji1`, this.animPos, this.animLayer);
			} else if (upTier == 5) {
				GameCommon.getInstance().addAnimation(`baoji2`, this.animPos, this.animLayer);
			}
		}
		// Tool.callbackTime(this.onShowUpdateAnim, this, 100);
		this.onRefresh();
	}
	private onShowUpdateAnim(): void {
		var x = (this.ExpBar.width - 18 * 2) * this.progessNum[this.getPlayer().magicLvExp] / 100;
		var pos = new egret.Point(x, 0);
		GameCommon.getInstance().addAnimation("fabaoshengji", pos, this.ExpBar["animLayer"]);
	}
	private onShowMagicAnim(): void {

	}
	//更新人物战斗力
	private onUpdatePower(): void {
		this.powerBar.power = DataManager.getInstance().magicManager.magicUpgradePower + "";
	}
	private onShowInfo(): void {
		this.currLv = this.getPlayer().magicLv;
		this.currTier = this.getPlayer().magicLvExp;
		var curr: Modelfabaoshengji = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][this.getPlayer().magicLvExp];
		var next: Modelfabaoshengji = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().MagicNextlv][Number(this.getPlayer().magicLvExp) + 1];
		var isOneLv = false;
		if (this.getPlayer().Magiclv == "1" && this.getPlayer().magicLvExp == 0) {
			isOneLv = true;
			curr = null
		}
		if (this.getPlayer().Magiclv == "1") {
			curr = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][Number(this.getPlayer().magicLvExp) - 1];
			if (this.getPlayer().Magiclv == "1" && this.getPlayer().magicLvExp == 9) {
				next = JsonModelManager.instance.getModelfabaoshengji()[Number(this.getPlayer().Magiclv) + 1][0];
			}
			else {
				next = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][this.getPlayer().magicLvExp];

			}
		}
		var model: Modelfabaoshengji = curr || next;
		if (curr && next) {
			model = next;
		}
		if (next) {
			this.currentState = "advance";
		} else if (curr && !next) {
			if(JsonModelManager.instance.getModelfabaoshengji()[Number(this.getPlayer().Magiclv) + 1])
			next = JsonModelManager.instance.getModelfabaoshengji()[Number(this.getPlayer().Magiclv) + 1][0];
			if (!next)
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
		// this.label_info.text = `Lv.${this.getPlayer().magicLv}`;
		this.label_name.text = this.getPlayer().magicLv + '\n级';
		this.ExpBar.maximum = 100;
		this.ExpBar.minimum = 0;
		this.ExpBar.value = this.progessNum[this.getPlayer().magicLvExp];

		if (next) {
			this.currency.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.GOLD, 0, next.gold), false);
		}
		this.onCountDown();
	}
	private onCountDown(): void {
		var magic = DataManager.getInstance().magicManager;
		var time = Math.max((magic.totalTime - magic.lastTime) / 1000, 0);
		this.label_cd.textFlow = new Array<egret.ITextElement>(
			{ text: `剩余次数:`, style: {} },
			{ text: magic.currCanUpNum + '/' + magic.maxTime + ' ', style: { "textColor": 0x52E212 } },
			{ text: GameCommon.getInstance().getTimeStrForSec2(time), style: {} },
		);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
	private onTouchBtnUpdate(): void {
		var next: Modelfabaoshengji = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][this.getPlayer().magicLvExp];
		if (this.getPlayer().Magiclv == "1" && this.getPlayer().magicLvExp > 0) {
			next = JsonModelManager.instance.getModelfabaoshengji()[this.getPlayer().Magiclv][Number(this.getPlayer().magicLvExp) - 1];
		}
		if (next || GameCommon.getInstance().onCheckItemConsume(0, next.gold, GOODS_TYPE.GOLD)) {
			DataManager.getInstance().magicManager.onSendUpdateMessage();
		}
	}
}