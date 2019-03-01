class ZhanWenViewPanel extends BaseTabView {
	private boss_name_lab: eui.Label;
	private btn_xiangqian: eui.Button;
	private btn_levelUp: eui.Button;
	private selectIndex: number;
	private runesData: ZhanWenItem[];
	private index: number = 1;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	private powerBar: PowerBar;
	private selectedAnim: Animation;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ZhanWenViewSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RUNE_WEAR.toString(), this.showPower, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RUNE_COMPOSE_QUICK.toString(), this.showPower, this);

		this.btn_xiangqian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipSend, this);
		this.btn_levelUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeCheng, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RUNE_WEAR.toString(), this.showPower, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RUNE_COMPOSE_QUICK.toString(), this.showPower, this);
		this.btn_xiangqian.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipSend, this);
		this.btn_levelUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeCheng, this);
	}
	protected points: redPoint[] = RedPointManager.createPoint(12);
	protected onInit(): void {
		this.runesData = [];
		this.points[0].register(this.btn_levelUp, new egret.Point(135, -5), DataManager.getInstance().bagManager, "onGetEquipLvUpPoint", 1);
		for (let i: number = 1; i <= 10; i++) {
			(this['tab' + i] as ZhanWenItem).icon.source = 'zhanwenSlot' + Math.ceil(i / 2) + '_png';
			(this['tab' + i] as ZhanWenItem).onUpdate(Language.instance.getText('zhanwen_' + i));
			(this['tab' + i] as ZhanWenItem).name = i + '';
			(this['tab' + i] as ZhanWenItem).selected = false;
			// (this['tab' + i] as ZhanWenItem).isSelect(false);
			(this['tab' + i] as ZhanWenItem).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
			this.points[i].register((this['tab' + i] as ZhanWenTabBtnItem), new egret.Point(10, 10), DataManager.getInstance().bagManager, "checkAllEquipPointPoint", i);
		}
		this.points[11].register(this.btn_xiangqian, new egret.Point(135, -5), DataManager.getInstance().bagManager, "getEquipRnuesPoint", 1);
		// (this['tab' + 1] as ZhanWenItem).isSelect(true);
		// this.selectedAnim = new Animation("gonghuijineng_1", -1);
		// this.selectedAnim.scaleX = 0.75;
		// this.selectedAnim.scaleY = 0.75;
		// this.selectedAnim.onPlay();
		// this.selectImg.addChild(this.selectedAnim)
		// this.selectedAnim.x = (this['tab' + 1] as ZhanWenItem).x+50;
		// this.selectedAnim.y = (this['tab' + 1] as ZhanWenItem).y+41;
		this['tab' + 1].selected = true;
		super.onInit();
		this.showPower();
	}
	private onTab(event: egret.Event): void {
		var name: number = Number(event.currentTarget.name);
		if (this.index == name)
			return;
		// (this['tab' + this.index] as ZhanWenItem).isSelect(false);
		// (this['tab' + name] as ZhanWenItem).isSelect(true);
		(this['tab' + this.index] as ZhanWenItem).selected = false;
		this.index = name;
		this.points[11].register(this.btn_xiangqian, new egret.Point(135, -5), DataManager.getInstance().bagManager, "getEquipRnuesPoint", name);
		this.points[0].register(this.btn_levelUp, new egret.Point(135, -5), DataManager.getInstance().bagManager, "onGetEquipLvUpPoint", name);
		// this.selectedAnim.x = (this['tab' + this.index] as ZhanWenItem).localToGlobal().x;
		// this.selectedAnim.y = (this['tab' + this.index] as ZhanWenItem).y+100;
		(this['tab' + this.index] as ZhanWenItem).selected = true;
		this.showInfo();

	}

	// private onEquipPoint(idx:number):boolean{
	//      for (var i: number = 1; i <= 10; i++) {
	//          if(DataManager.getInstance().bagManager.getEquipRnuesPoint(i)) return true;
	//      }
	//     return false;
	// }
	protected onRefresh(): void {
		// this.onShowMagicAnim();
		this.showInfo();
	}
	private showPower(): void {
		var str: string = '';
		var nextStr: string = '';
		var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
		var idx: number = 0;
		for (var i: number = 0; i < 50; i++) {
			var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
			if (modelId > 0) {
				var zhanwenCfg: Modelzhanwen = JsonModelManager.instance.getModelzhanwen()[modelId];
				for (var k: number = 0; k < tempAttribute.length; k++) {
					// if(zhanwenCfg.attrAry[k]>0)
					// {
					tempAttribute[k] += zhanwenCfg.attrAry[k];
					// }
				}
			}
		}
		var idx: number = 0;
		for (var i: number = 0; i < tempAttribute.length; i++) {
			// if (tempAttribute[i]>0) {
			idx = idx + 1;
			if (idx % 2 == 0) {
				str = str + GameDefine.Attr_FontName[i] + "：" + tempAttribute[i] + "\n";
			}
			else {
				nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + tempAttribute[i] + "\n"
			}
			//天师加成
			let tianshi_zhanwen_plus: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.RUNE);
			tempAttribute[k] += Tool.toInt(zhanwenCfg.attrAry[k] * tianshi_zhanwen_plus / GameDefine.GAME_ADD_RATIO);
			// }
		}
		this.powerBar.power = GameCommon.calculationFighting(tempAttribute);
		this.curPro.text = str;
		this.nextPro.text = nextStr;
		this.showInfo();
	}
	private showInfo(): void {
		var idx: number = 0;
		for (var i: number = this.index * 5 - 5; i < this.index * 5; i++) {
			idx = idx + 1;
			(this['item' + idx] as GoodsInstance).name_label.text = '';
			(this['item' + idx] as GoodsInstance).item_icon.source = 'zw_icondi_' + idx + '_png';
			(this['item' + idx] as GoodsInstance).item_frame.source = 'bag_whiteframe_png';
			(this['item' + idx] as GoodsInstance).currentState = 'notName';
			(this['item' + idx] as GoodsInstance).remAnimation();
			//  (this['item' + idx] as GoodsInstance).name_label.visible = false;
			var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
			if (modelId > 0) {
				(this['item' + idx] as GoodsInstance).onUpdate(26, modelId);
				(this['item' + idx] as GoodsInstance).currentState = 'normal';
			}
		}
	}
	private onResBossListInfoMsg(): void {
		let data: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
		for (let i: number = 1; i < 10; i++) {
			let info: XuezhanBossInfo = data.xuezhanInfos[i];
			if (!info) break;
			let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(info.bossID);
			let tabbtn: eui.RadioButton = this['tab' + i];
			tabbtn.label = modelfighter.name;
			tabbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}

		if (Tool.isNumber(this.selectIndex)) {
			let selectIndex: number = this.selectIndex;
			this.selectIndex = null;
			this.onchangeTab(selectIndex);
		} else {
			this.onchangeTab(0);
		}
	}
	private onTouchTab(event: egret.Event): void {
		let radioBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		this.onchangeTab(radioBtn.value);
	}
	private onchangeTab(index: number): void {
		if (this.selectIndex != index) {
			this.selectIndex = index;
		}
	}
	private onEquipSend(): void {
		var message = new Message(MESSAGE_ID.RUNE_WEAR);
		message.setByte(0);
		message.setByte(this.index);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onHeCheng(): void {
		var message = new Message(MESSAGE_ID.RUNE_COMPOSE_QUICK);
		message.setByte(0);
		message.setByte(this.index);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//The end
}
class ZhanWenItem extends eui.Component {
	public labName: eui.Label;
	public icon: eui.Image;
	private selectImg: eui.Group;
	private selectedAnim: Animation;
	// public curFtData :FateBase;
	constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
		this.skinName = skins.ZhanWenItemSkin;
	}
	private onLoadComplete(): void {
		this.labName.visible = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	private onAddStage(): void {
		this.touchEnabled = false;
	}
	public set selected(bl: boolean) {
		this.selectImg.visible = bl;
		// this.icon.source= bl?'public_slotBg1_png':'public_slotBg2_png';
		if (bl) {
			if (!this.selectedAnim) {
				this.selectedAnim = new Animation("gonghuijineng_1", -1);
				this.selectedAnim.scaleX = 0.75;
				this.selectedAnim.scaleY = 0.75;
				this.selectedAnim.y = 41;
				this.selectedAnim.x = 50;
				this.selectImg.addChild(this.selectedAnim);
			}
			this.selectedAnim.onPlay();
		} else {
			if (this.selectedAnim) {
				this.selectedAnim.onStop();
			}
		}
	}
	public onUpdate(nm: string): void {
		this.labName.text = nm;
	}
	public onTouch(event: egret.TouchEvent): void {
		Tool.log('wodetian')
	}

}