/**
 * VIP 神器 面板
 * 
 * -------------- LYJ  2018.06.18-------------
 * **/
class VipGodArtifactPanel extends BaseTabView {
	private btn_upgrade: eui.Button;
	private left_arrow_btn: eui.Button;
	private right_arrow_btn: eui.Button;
	private btnbar_grp: eui.Group;
	private scroll: eui.Scroller;
	private artifact_anim_grp: eui.Group;
	private powerbar: PowerBar;
	private actifact_name_lab: eui.Label;
	private curr_attr_lab: eui.Label;
	private next_attr_lab: eui.Label;
	private consumItem: ConsumeBar;

	private tabBtns: eui.RadioButton[];
	private currSeletedId: number;//当前选中的标签
	private shenqiAnim: Animation;//神器特效

	protected points: redPoint[];
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.VipGodArtifactPanelSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPGOD_ARTIFACT_ACTIVATE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPGOD_ARTIFACT_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
		this.left_arrow_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLeft, this);
		this.right_arrow_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRight, this);
		for (let index in this.tabBtns) {
			this.tabBtns[index].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
	}
	public onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPGOD_ARTIFACT_ACTIVATE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPGOD_ARTIFACT_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
		this.left_arrow_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLeft, this);
		this.right_arrow_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRight, this);
		for (let index in this.tabBtns) {
			this.tabBtns[index].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
	}
	private get player(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	protected onInit(): void {
		this.scroll.horizontalScrollBar.visible = false;
		this.scroll.horizontalScrollBar.autoVisibility = false;

		this.tabBtns = [];
		this.points = [];
		let idx: number = 0;
		let modelDict = JsonModelManager.instance.getModelvipshenqi();
		for (let actifactID in modelDict) {
			let model: Modelvipshenqi = modelDict[actifactID];
			let tabbtn: eui.RadioButton = new eui.RadioButton();
			tabbtn.skinName = skins.Radio_Button4_Skin;
			// tabbtn.scaleX = tabbtn.scaleY = 0.9;
			// (tabbtn['labelDisplay'] as eui.Label).y = 120;
			// (tabbtn['labelDisplay'] as eui.Label).size = 20;
			tabbtn.label = model.name;
			tabbtn.icon = `vip_shenqi_${model.id}_png`;
			tabbtn.value = model.id;
			this.btnbar_grp.addChild(tabbtn);
			this.tabBtns.push(tabbtn);
			this.points[idx] = new redPoint();
			this.points[idx].register(tabbtn, GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().legendManager, "oncheckVipActifactRedP", model.id);
			idx++;
		}

		this.currSeletedId = this.tabBtns[0].value;
		this.tabBtns[0].selected = true;

		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onTabHanlder();
		this.updatePower();
	}
	/**更新总战斗力**/
	private updatePower(): void {
		let powerNum: number = GameCommon.calculationFighting(DataManager.getInstance().legendManager.getVipActifactAttrAry());
		this.powerbar.power = powerNum;
	}
	/**切换页签**/
	private onTouchTab(event: egret.TouchEvent): void {
		let button: eui.RadioButton = event.currentTarget;
		if (this.currSeletedId != button.value) {
			this.currSeletedId = button.value;
			this.onTabHanlder();
		}
	}
	/**切换标签对应的逻辑处理**/
	private onTabHanlder(): void {
		let data: LegendData = this.player.vipgodArtifactDict[this.currSeletedId];
		let currLv: number = data ? data.lv : 0;
		let model: Modelshenqi = JsonModelManager.instance.getModelvipshenqi()[this.currSeletedId];
		this.actifact_name_lab.text = model.name;
		//更新神器特效
		let animRes: string = 'xuanqi_' + this.currSeletedId;
		if (!this.shenqiAnim) {
			this.shenqiAnim = GameCommon.getInstance().addAnimation(animRes, null, this.artifact_anim_grp, -1);
		} else {
			this.shenqiAnim.onUpdateRes(animRes, -1);
		}
		//更新神器属性
		let currAttrDesc: string = '';
		let nextAttrDesc: string = '';
		for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			let attrValue: number = model.attrAry[i];
			if (attrValue > 0) {
				currAttrDesc += Language.instance.getAttrName(i) + '+' + attrValue * currLv;
				nextAttrDesc += Language.instance.getAttrName(i) + '+' + attrValue * (currLv + 1);
			}
			if (i < ATTR_TYPE.SIZE - 1) {
				currAttrDesc += '\n';
				nextAttrDesc += '\n';
			}
		}
		this.curr_attr_lab.text = currAttrDesc;
		this.next_attr_lab.text = nextAttrDesc;
		//更新神器消耗
		if (currLv > 0) {
			this.consumItem.visible = true;
			let costNum: number = DataManager.getInstance().legendManager.getCostNumByID(model.id);
			this.consumItem.setCostByAwardItem(model.cost);
			this.btn_upgrade.label = Language.instance.getText('uplevel');
		} else {
			let viplimit: number = model.id;//VIP限制暂时跟ID相同
			this.consumItem.visible = false;
			this.btn_upgrade.label = Language.instance.getText('VIP'+GameCommon.getInstance().getVipName(viplimit), 'kejihuo');
		}
	}
	//点击升级或激活按钮
	private onSendUpgradeMsg(): void {
		let model: Modelshenqi = JsonModelManager.instance.getModelvipshenqi()[this.currSeletedId];
		let data: LegendData = this.player.vipgodArtifactDict[model.id];
		let currLv: number = data ? data.lv : 0;
		let viplimit: number = model.id;//VIP限制暂时跟ID相同
		if (currLv > 0) {
			let costNum: number = DataManager.getInstance().legendManager.getCostNumByID(model.id);
			if (GameCommon.getInstance().onCheckItemConsume(model.cost.id, costNum)) {
				let upgradeMsg: Message = new Message(MESSAGE_ID.VIPGOD_ARTIFACT_UPGRADE_MESSAGE);
				upgradeMsg.setByte(model.id);
				GameCommon.getInstance().sendMsgToServer(upgradeMsg);
			}
		} else {
			if (this.player.viplevel < viplimit) {
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("VipPanel", viplimit));
			} else {
				let activateMsg: Message = new Message(MESSAGE_ID.VIPGOD_ARTIFACT_ACTIVATE_MESSAGE);
				activateMsg.setByte(model.id);
				GameCommon.getInstance().sendMsgToServer(activateMsg);
			}
		}
	}
	//点击左右箭头
	private onTouchLeft() {
		let moveLeft: number = this.scroll.viewport.scrollH - 120;
		this.scroll.viewport.scrollH = moveLeft < 0 ? 0 : moveLeft;
	}
	private onTouchRight() {
		let moveRight: number = this.scroll.viewport.scrollH + 120;
		this.scroll.viewport.scrollH = moveRight > 1100 ? 1100 : moveRight;
	}
	//The end
}