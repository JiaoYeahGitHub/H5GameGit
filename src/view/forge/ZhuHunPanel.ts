/**
 * 
 */
class ZhuHunPanel extends BaseTabView {
	private animRecords: ForgePosInfo[];
	private modeled: Modellianhua;
	private power: PowerBar;
	private labelBg: eui.Image;
	private label_get: eui.Label;
	private consumItem: ConsumeBar;
	private animLayer: eui.Group;
	private strengthenMasterBtn: eui.Button;
	private btn_upgrade: eui.Button;
	private attribute: eui.Label[] = [];
	private currLayer: eui.Group;
	private nextLayer: eui.Group;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	private maxLv: eui.Label;
	private posIndex: number = 0;//选中的槽位
	private getGrp: eui.Group;
	private currEquip: ForgeSlot;
	private qianghuaPro: eui.ProgressBar;
	private animPos: egret.Point = new egret.Point(185, 561);
	protected points: redPoint[] = RedPointManager.createPoint(2);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ZhuHunPanelSkin;
	}
	private slotRotation: number[] = [100, 130, 165, 185, 230, -65, -5, 0, 35, 65]
	protected onInit(): void {
		this.animRecords = [];
		let _recordPos: ForgePosInfo;
		let infySlot: ForgeSlot;
		let zhulv: number;
		this['equip_bar_0']['slotDI'].rotation = 100;
		this['equip_bar_1']['slotDI'].rotation = 130;
		this['equip_bar_2']['slotDI'].rotation = 165;
		this['equip_bar_3']['slotDI'].rotation = 185;
		this['equip_bar_4']['slotDI'].rotation = 230;

		this['equip_bar_5']['slotDI'].rotation = -65;
		this['equip_bar_6']['slotDI'].rotation = -5;
		this['equip_bar_7']['slotDI'].rotation = 0;
		this['equip_bar_8']['slotDI'].rotation = 35;
		this['equip_bar_9']['slotDI'].rotation = 65;
		for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
			let slotData: EquipSlotThing = this.getPlayerData().getEquipSlotThings(i);
			if (!Tool.isNumber(zhulv) || zhulv > slotData.zhLv) {
				zhulv = slotData.zhLv;
				this.posIndex = i;
			}
			infySlot = (this[`equip_bar_${i}`] as ForgeSlot);
			infySlot.slotType = i;
			_recordPos = new ForgePosInfo(infySlot.x, infySlot.y, infySlot.scaleX, 0, this.slotRotation[i]);
			infySlot.name = i + "";
			this.animRecords.push(_recordPos);
			// this.points[i].register(infySlot, GameDefine.RED_EQUIP_SLOT, DataManager.getInstance().forgeManager, "checkLianhuaPointBySlot", i);
		}


		this.points[0].register(this.btn_upgrade, GameDefine.RED_BTN_POS, DataManager.getInstance().forgeManager, "checkLianhuaPoint");
		this.points[1].register(this.strengthenMasterBtn, new egret.Point(65, 5), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA);
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.consumItem['consume_name_label'].textColor = 0xf3f3f3;
		this.resetPos();
		this.onRefresh();
		this.updateSlotInfo();
		this.onUpdatePlayerPower();
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	private resetPos() {
		var recordPos: ForgePosInfo;
		var infySlot: ForgeSlot;
		var param = GameDefine.Equip_Slot_Num + this.posIndex;
		for (var i = this.posIndex; i < param; i++) {
			infySlot = (this[`equip_bar_${i >= GameDefine.Equip_Slot_Num ? i - GameDefine.Equip_Slot_Num : i}`] as ForgeSlot);
			recordPos = this.animRecords[i - this.posIndex];
			infySlot.x = recordPos.posX;
			infySlot.y = recordPos.posY;
			infySlot['slotDI'].rotation = recordPos.rotationNum;
			infySlot.scaleX = recordPos.scale;
			infySlot.scaleY = recordPos.scale;
			if (i == this.posIndex) {
				this.currEquip = infySlot;
				// infySlot.selected = true;
				infySlot['slotDI'].source = 'zhancao_xuanzhong_png';
			} else {
				infySlot['slotDI'].source = 'zhancao-weixuanzhong_png';
				// infySlot.selected = false;
			}
		}
	}
	protected onRefresh(): void {
		this.showIntensify();

	}
	private strongerBtnClick() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA))
	}
	//炼化成功
	private onLianhuaUpgrade(): void {
		this.updateSlotInfo();
		this.onUpdatePlayerPower();

		let anim: Animation = GameCommon.getInstance().addAnimation("new_lianhua", this.animPos, this.animLayer);
		anim.playFinishCallBack(this.onAnimFinish, this)
	}
	private onAnimFinish(): void {
		this._playNum = 1;
		this.posIndex = (this.posIndex + 1) % GameDefine.Equip_Slot_Num;
		this.btn_upgrade.enabled = true;
		this.currEquip['slotDI'].source = 'zhancao-weixuanzhong_png';
		// this.currEquip.selected = false;
		this.currEquip = (this[`equip_bar_${this.posIndex}`] as ForgeSlot)
		this.currEquip['slotDI'].source = 'zhancao_xuanzhong_png';
		// this.currEquip.selected = true;
		this.onRefresh();
		this.play();
	}
	/** 更新槽位 **/
	private updateSlotInfo(): void {
		this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA);
		this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA);
		var equip: ForgeSlot;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			equip = (this[`equip_bar_${i}`] as ForgeSlot);
			equip.setinfo(this.getPlayerData().getEquipSlotThings(i).zhLv);
		}
	}
	//更新消耗
	private updateGoodsADD() {
		this.consumItem.visible = this.modeled == null ? false : true;
		this.maxLv.visible = !this.consumItem.visible;
		if (this.modeled) {
			this.consumItem.setCostByAwardItem(this.modeled.cost);
		}
	}
	//更新人物战斗力
	private onUpdatePlayerPower(): void {
		let attr_ary: number[] = GameCommon.getInstance().getAttributeAry();
		for (let i = 0; i < GameDefine.Equip_Slot_Num; i++) {
			let slotData: EquipSlotThing = this.getPlayerData().getEquipSlotThings(i);
			let model: Modellianhua = JsonModelManager.instance.getModellianhua()[i][slotData.zhLv - 1];
			if (!model) continue;
			var tianshi_puls_val: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.FORGE);
			for (let n: number = 0; n < ATTR_TYPE.SIZE; n++) {
				attr_ary[n] += model.attrAry[n] + Tool.toInt(model.attrAry[n] * tianshi_puls_val / GameDefine.GAME_ADD_RATIO);
			}
		}
		this.power.power = GameCommon.calculationFighting(attr_ary); + "";
	}
	/**转动逻辑**/
	protected onRegist(): void {
		super.onRegist();
		this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandler, this);
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgradeBtn, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_ZHUHUN_MESSAGE.toString(), this.onLianhuaUpgrade, this);
		// for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
		// 	var infySlot: ForgeSlot = (this[`equip_bar_${i}`] as ForgeSlot);
		// 	infySlot.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSlot, this);
		// }
	}
	protected onRemove(): void {
		super.onRemove();
		this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgradeBtn, this);
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandler, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_ZHUHUN_MESSAGE.toString(), this.onLianhuaUpgrade, this);
		// for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
		// 	var infySlot: ForgeSlot = (this[`equip_bar_${i}`] as ForgeSlot);
		// 	infySlot.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSlot, this);
		// }
	}
	private showIntensify() {
		var add = 0;
		var addEd = 0;
		var slotData: EquipSlotThing = this.getPlayerData().getEquipSlotThings(this.posIndex);
		var equipType: number = GoodsDefine.EQUIP_SLOT_TYPE[slotData.slot];
		var lianhuaModelDict = JsonModelManager.instance.getModellianhua();
		if (!lianhuaModelDict[equipType])
			return;
		var model: Modellianhua;
		var currModel: Modellianhua;

		model = lianhuaModelDict[equipType][slotData.zhLv - 1];
		this.modeled = lianhuaModelDict[equipType][slotData.zhLv];
		currModel = model || this.modeled;
		var str: string = '';
		var nextStr: string = '';
		for (var key in currModel.attrAry) {
			if (currModel.attrAry[key] > 0) {
				add = model ? model.attrAry[key] : 0;
				str = str + GameDefine.Attr_FontName[key] + ":" + add + '\n';

				add = this.modeled ? this.modeled.attrAry[key] : 0;
				nextStr = nextStr + GameDefine.Attr_FontName[key] + ":" + add + '\n';
			}
		}
		if (!this.modeled) {
			this.currentState = 'max';
		}
		else {
			this.currentState = 'normal';
			this.nextPro.text = nextStr;
		}
		this.curPro.text = str;


		this.updateGoodsADD();
	}
	private onUpgradeBtn(): void {
		if (this.modeled) {
			if (!GameCommon.getInstance().onCheckItemConsume(this.modeled.cost.id, this.modeled.cost.num)) {
				return;
			}
			this.btn_upgrade.enabled = false;
			this.onSendLianhuaMsg();
		} else {
			GameCommon.getInstance().addAlert(Language.instance.getText("error_tips_1001"));
		}
	}
	private onSendLianhuaMsg(): void {
		var message: Message = new Message(MESSAGE_ID.PLAYER_ZHUHUN_MESSAGE);
		message.setByte(0);
		message.setByte(this.posIndex);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public trigger(): void {
		// for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
		// 	this.points[i].checkPoint();
		// }
		this.points[0].checkPoint();
		this.points[1].checkPoint();
	}
	/**切换槽位**/
	private _isplay: boolean;
	private _playNum: number;
	private play(): void {
		if (this._playNum == 0) {
			this._isplay = false;
			return;
		}
		var curr: number = this.posIndex - this._playNum;
		curr = curr < 0 ? curr + GameDefine.Equip_Slot_Num : curr;
		this._playNum--;
		this._isplay = true;
		var recordPos: ForgePosInfo;
		var param = GameDefine.Equip_Slot_Num + curr;
		var infySlot: ForgeSlot;
		for (var j = curr; j < param; j++) {
			infySlot = (this[`equip_bar_${j >= GameDefine.Equip_Slot_Num ? j - GameDefine.Equip_Slot_Num : j}`] as ForgeSlot);
			var currSlotIndex = j - curr - 1 >= 0 ? j - curr - 1 : GameDefine.Equip_Slot_Num - 1 - (j - curr);
			recordPos = this.animRecords[currSlotIndex];
			egret.Tween.removeTweens(infySlot);
			infySlot['slotDI'].rotation = recordPos.rotationNum
			egret.Tween.get(infySlot).to({ x: recordPos.posX, y: recordPos.posY, scaleX: recordPos.scale, scaleY: recordPos.scale }, 200).call(function (finish: boolean) {
				if (finish) {
					this.play();
				}
			}, this, [j == param - 1]);
		}
	}
	private onTouchSlot(e: egret.TouchEvent): void {
		if (this._isplay)
			return;
		let equipSlot: ForgeSlot = e.currentTarget;
		let touchIdx: number = parseInt(equipSlot.name);
		if (this.posIndex != touchIdx) {
			this._playNum = touchIdx - this.posIndex;
			this._playNum = this._playNum < 0 ? this._playNum + GameDefine.Equip_Slot_Num : this._playNum;
			this.posIndex = touchIdx;

			this.currEquip['slotDI'].source = 'zhancao-weixuanzhong_png';
			equipSlot['slotDI'].source = 'zhancao_xuanzhong_png';
			// this.currEquip.selected = false;
			// equipSlot.selected = true;
			this.currEquip = equipSlot;
			this.play();
			this.onRefresh();
		}
	}
	private onGetHandler(): void {
		GameCommon.getInstance().onShowFastBuy(GoodsDefine.ITEM_ID_LIANHUAZHIHUN);
	}
	//The end
}