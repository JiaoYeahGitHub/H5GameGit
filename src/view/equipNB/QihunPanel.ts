/**
 * 器魂面板
 */
class QihunPanel extends BaseWindowPanel {
	public static index: number = 0;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private curPro: eui.Label;
	private nextPro: eui.Label;
	private btn_up: eui.Button;
	private powerBar: PowerBar;
	private consume: ConsumeBar;

	private label_lv: eui.Label;
	private desc: eui.Label;

	private max: boolean;

	private aniLayer: eui.Group;
	private ani: Animation;
	private aniIdx = 1;

	private costModel: Modelqihun
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.QihunPanelSkin;
	}
	protected onInit(): void {
		this.setTitle("器魂");

		if (!this.ani) {
			this.ani = new Animation("qihun_" + this.aniIdx, -1, false);
			this.ani.x = this.aniLayer.width / 2;
			this.ani.y = this.aniLayer.height / 2 + this.aniLayer.height / 4;
			this.aniLayer.addChild(this.ani);
		} else {
			this.ani.onPlay();
		}

		super.onInit();
		this.onRefresh();
	}

	protected onRegist(): void {
		this.btn_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_QIHUN_UPGRADE_MESSAGE.toString(), this.onUpBack, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onupdatePiecesNum, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onupdatePiecesNum, this);

		super.onRegist();
	}
	protected onRemove(): void {
		this.btn_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_QIHUN_UPGRADE_MESSAGE.toString(), this.onUpBack, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onupdatePiecesNum, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onupdatePiecesNum, this);

		super.onRemove();
	}

	protected onRefresh(): void {
		var level = DataManager.getInstance().playerManager.player.getPlayerData(QihunPanel.index).qihun;
		//属性
		this.showInfo(level);
		this.showLv(level);
	}

	private showInfo(id: number) {
		var models = JsonModelManager.instance.getModelqihun();
		var currModel: Modelqihun = models[id];
		var nextModel: Modelqihun = models[id + 1];
		var tianshi_redequip_puls: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.RED_EQUIP);
		var attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
		var model: Modelqihun = currModel || nextModel;
		var item: AttributesText;
		var add: number = 0;
		let strCurr = "";
		let strNext = "";
		for (var i = 0; i < model.attrAry.length; i++) {
			if (model.attrAry[i] > 0) {
				add = currModel ? currModel.attrAry[i] : 0;
				if (strCurr.length > 0) {
					strCurr += "\n";
				}
				strCurr += GameDefine.Attr_FontName[i] + " +" + add;

				add = nextModel ? nextModel.attrAry[i] : currModel.attrAry[i];
				if (strNext.length > 0) {
					strNext += "\n";
				}
				strNext += GameDefine.Attr_FontName[i] + " +" + add;
			}
			attr_ary[i] = model.attrAry[i] + Tool.toInt(model.attrAry[i] * tianshi_redequip_puls / GameDefine.GAME_ADD_RATIO);
		}
		if (nextModel) {
			this.nextPro.text = strNext;
			this.currentState = 'normal';
		}
		else {
			this.currentState = 'max';
		}
		this.curPro.text = strCurr;

		if (currModel) {
			this.powerBar.power = GameCommon.calculationFighting(attr_ary);
			let name = Language.instance.parseInsertText("qihun_jingjie_title", currModel.jieduan);
			this.setTitle(name);
		} else {
			this.powerBar.power = 0;
			this.setTitle("");
		}

		this.costModel = null;

		if (nextModel) {
			if (nextModel.cost.num > 0) {
				this.costModel = nextModel;
				this.consume.visible = true;
				this.consume.setCostByAwardItem(nextModel.cost);
			} else {
				this.consume.visible = false;
			}
			this.btn_up.enabled = true;
			if (!currModel || currModel.coatardLimit != nextModel.coatardLimit) {
				this.desc.text = Language.instance.parseInsertText("qihun_jingjie", nextModel.coatardLimit);
			} else {
				var rateValue: number = nextModel.gailv / 100;
				this.desc.text = Language.instance.getText("chenggonglv", "：", rateValue, "%");
			}
		} else {
			this.max = true;
			this.consume.visible = false;
			this.btn_up.enabled = false;
		}

		if (currModel && this.aniIdx != currModel.coatardLimit) {
			this.aniIdx = currModel.coatardLimit;
			this.ani.onUpdateRes("qihun_" + this.aniIdx, -1);
		}

	}

	private onupdatePiecesNum() {
		if (this.costModel) {
			this.consume.setCostByAwardItem(this.costModel.cost);
		}
	}

	private showLv(level) {
		var models = JsonModelManager.instance.getModelqihun();

		var currModel: Modelqihun = models[level];
		var currCoatardLv = 1;
		var currLevel = 0;
		//当前进度
		if (currModel) {
			currCoatardLv = currModel.coatardLimit;
			currLevel = currModel.level;
		}

		var lv = level;
		var nextModel: Modelqihun;
		var finished = false;
		while (!finished) {
			lv++;
			nextModel = models[lv];
			if (!nextModel || nextModel.coatardLimit != currCoatardLv) {
				finished = true;
			}
		}

		nextModel = models[lv - 1];
		this.label_lv.text = currLevel + "/" + nextModel.level;
	}

	private onTouchBtn(): void {
		var message = new Message(MESSAGE_ID.PLAYER_QIHUN_UPGRADE_MESSAGE);
		message.setByte(QihunPanel.index);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	private onUpBack(): void {
		this.onRefresh();
		DataManager.getInstance().playerManager.player.updataAttribute();
		var animPos: egret.Point = new egret.Point(0, 0);
		GameCommon.getInstance().addAnimation("qihunshengji", animPos, this.aniLayer);
	}
}
