/**
 * 五行面板
 */
class WuxingPanel extends BaseTabView {
	public static index: number = 0;

	//public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	private nextPro: eui.Group;
	private curPro: eui.Group;
	private btn_zx: eui.Button;
	private isUp:boolean = true;
	private powerBar: PowerBar;
	private consume: CurrencyBar;
	private dragon_group: eui.Group[] = [];
	// private qianLab: eui.Label;
	private expAnim: Animation;
	private igRecordPos: ForgePosInfo[];//五行图标位置记录
	private dragonIdx: number;
	private max: boolean;
	private zhulingchi_grp: eui.Group;
	private exp_scroll: eui.Scroller;
	private expanim_grp: eui.Group;
	private START_POSX: number = 0;
	private END_POSX: number = 222;
	private selectedAnim: Animation;
	private effectGroup: eui.Group;
	private label_get: eui.Label;
	// private strengthenMasterBtn: eui.Button
	private getGrp:eui.Group;
	private qianghuaPro:eui.ProgressBar;
	private maxLevel: number;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuxingPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.initMaxLevel();
		this.selectedAnim = new Animation("gonghuijineng_1", -1);
		this.selectedAnim.x = 47;
		this.selectedAnim.y = 40;
		this.selectedAnim.scaleX = 0.78;
		this.selectedAnim.scaleY = 0.78;
		this.selectedAnim.onPlay();
		this.effectGroup.addChild(this.selectedAnim);
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.resetPos();
		this.onRefresh();
	}
	private initMaxLevel(){
		this.maxLevel = 0;
		var models = JsonModelManager.instance.getModelwuxing();
		for(let i in models){
			if(models[i].id > this.maxLevel){
				this.maxLevel = models[i].id;
			}
		}
	}
	protected onRegist(): void {
		// this.points[0].register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_WU_XING);
		this.btn_zx.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUXING_UP.toString(), this.onUpBack, this);
		super.onRegist();

		// this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
	}
	protected onRemove(): void {
		this.btn_zx.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUXING_UP.toString(), this.onUpBack, this);
		super.onRemove();
		// this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
	}
	public trigger(): void {
		this.points[0].checkPoint();
	}
	private resetPos(): void {
		var level = DataManager.getInstance().playerManager.player.getPlayerData(WuxingPanel.index).wuxingLevel;
		var tmp = level % 25;
		this.dragonIdx = Tool.toInt(tmp / 5)
		//最大则为最后一个
		var key: number = (level + 1);
		if (!JsonModelManager.instance.getModelwuxing()[key] && tmp == 0) {
			this.dragonIdx = 4;
		}
		// this.expAnim = new Animation('zhuling_bowen', -1, false);
		// this.expAnim.x = 130;
		// this.expAnim.y = 220 - this.exp_scroll.height;
		// this.expAnim.scaleX = 1;
		// this.expAnim.scaleY = 1;
		// this.zhulingchi_grp.addChildAt(this.expAnim, 2);

		// let exp_back_anim = new Animation('zhuling_qiu', -1, false);
		// exp_back_anim.x = 137;
		// exp_back_anim.y = 188;
		// exp_back_anim.scaleX = 1;
		// exp_back_anim.scaleY = 1;
		// this.expanim_grp.addChildAt(exp_back_anim, 0);

		// let recordInfo: ForgePosInfo;
		// let param = GameDefine.WUXIN_NUM + this.dragonIdx;
		// var wuxingSlot: eui.Group;
		// //龙初始化
		// var effIdx = Tool.toInt(tmp % 5);
		// for (var i = 0; i < this.dragon_group.length; i++) {
		// 	if (i == this.dragonIdx) {
		// 		this.dragon_group[i].visible = true;
		// 		for (var j = 1; j <= GameDefine.WUXIN_NUM; j++) {
		// 			let dragonGrp: eui.Group = this["dragon" + (i + 1) + "_e" + j];
		// 			if (j < (effIdx + 1)) {
		// 				dragonGrp.visible = true;
		// 				GameCommon.getInstance().addAnimation('wuxing_2', new egret.Point(35, 38), dragonGrp, -1);
		// 			} else {
		// 				dragonGrp.visible = false;
		// 			}
		// 		}
		// 	} else {
		// 		this.dragon_group[i].visible = false;
		// 	}
		// }
	}

	protected onRefresh(): void {
		// this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_WU_XING);
		// this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_WU_XING);
		var level = DataManager.getInstance().playerManager.player.getPlayerData(WuxingPanel.index).wuxingLevel;
		var tmp = level % 25;
		let oldIdx: number = this.dragonIdx;
		this.dragonIdx = Tool.toInt(tmp / 5);
		let isUpgrede: boolean = oldIdx != this.dragonIdx;
		var effIdx = Tool.toInt(tmp % 5);
		//最大则为最后一个
		var key: number = (level + 1);
		if (!JsonModelManager.instance.getModelwuxing()[key] && tmp == 0) {
			this.dragonIdx = 4;
			effIdx = 4;
		}
		//上方的icon
		var n = Tool.toInt(level / 5);
		var left = level - n * 5;
		var lvIdx = Tool.toInt(left / 5) + 1;
		for (var i = 1; i <= GameDefine.WUXIN_NUM; i++) {
			if (left >= i) {
				this[`level_${i}`].text = (n + 1) + '级';
			}
			else {
				this[`level_${i}`].text = n + '级';
			}
		}
		//属性
		let scroll_height: number = this.END_POSX;
		scroll_height = this.START_POSX + Math.round((this.END_POSX - this.START_POSX) * (effIdx / 5));
		this.selectedAnim.x = this['icon_' + (effIdx + 1)].x + 44;
		this.selectedAnim.y = this['icon_' + (effIdx + 1)].y + 46;
		// let expAnim_Y: number = 275 - scroll_height;
		if (scroll_height > this.exp_scroll.height) {
			egret.Tween.removeTweens(this.exp_scroll);
			egret.Tween.get(this.exp_scroll).to({ height: scroll_height }, 300, egret.Ease.circOut);
		} else {
			this.exp_scroll.height = scroll_height;
		}
		// if (this.expAnim.y > expAnim_Y) {
		//     egret.Tween.removeTweens(this.expAnim);
		//     egret.Tween.get(this.expAnim).to({ y: expAnim_Y }, 300, egret.Ease.circOut);
		// } else {
		//     this.expAnim.y = expAnim_Y;
		// }
		this.showInfo(level);
		// this.qianLab.text = GameCommon.getInstance().getFormatNumberShow(DataManager.getInstance().playerManager.player.money);
	}
	private onResetDRPoint(): void {
		// for (var i = 0; i < this.dragon_group.length; i++) {
		// 	for (var j = 1; j <= GameDefine.WUXIN_NUM; j++) {
		// 		let dgrp: eui.Group = this["dragon" + (i + 1) + "_e" + j];
		// 		dgrp.visible = false;
		// 	}
		// 	if (i == this.dragonIdx) {
		// 		this.dragon_group[i].visible = true;
		// 	} else {
		// 		this.dragon_group[i].visible = false;
		// 	}
		// }
	}
	private showInfo(id: number) {
		var models = JsonModelManager.instance.getModelwuxing();
		var currModel: Modelwuxing = models[id];
		var nextModel: Modelwuxing = models[id + 1];
		var model: Modelwuxing = currModel || nextModel;
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		var add: number = 0;
		for (var i = 0; i < model.attrAry.length; i++) {
			if (model.attrAry[i] > 0) {
				add = currModel ? currModel.attrAry[i] : 0;
				attributeItem = new AttributesText();
				attributeItem.updateAttr(i, add);
				this.curPro.addChild(attributeItem);
				if(nextModel)
				{
					add = nextModel ? nextModel.attrAry[i] : currModel.attrAry[i];
					attributeItem = new AttributesText();
					attributeItem.updateAttr(i, add);
					this.nextPro.addChild(attributeItem);
				}
			}
		}
		if (currModel) {
			this.powerBar.power = GameCommon.calculationFighting(currModel.attrAry);
		} else {
			this.powerBar.power = 0;
		}

		if (nextModel) {
			this.consume.visible = true;
			this.cost = nextModel.cost;
			this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(nextModel.cost.type, nextModel.cost.id, nextModel.cost.num));
			this.isUp = true;
			this.currentState =  'normal';
		} else {
			this.max = true;
			this.consume.visible = false;
			this.isUp = false;
			this.currentState = 'max';
		}
	}
	private cost: AwardItem;
	private onGetBtn(event: TouchEvent): void {
		if (!this.cost) return;
		GameCommon.getInstance().onShowFastBuy(this.cost.id, GOODS_TYPE.GOLD);
	}
	private onTouchBtn(): void {
		if(this.isUp)
		{
			var message = new Message(MESSAGE_ID.WUXING_UP);
			message.setByte(WuxingPanel.index);
			GameCommon.getInstance().sendMsgToServer(message);
		}
		
		this.isUp= false;
	}

	private onUpBack(): void {
		this.onRefresh();
		DataManager.getInstance().playerManager.player.updataAttribute();
	}

	private strengthenMasterOnClick() {
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_WU_XING))
	}
}
