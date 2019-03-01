class TianshuUpgradePanel extends BaseTabView {
	//UI
	private powerBar: PowerBar;
	private scroller: eui.Scroller;
	private itemlist_grp: eui.Group;
	private label_name: eui.Label;
	private consumItem: ConsumeBar;
	private label_get: eui.Label;
	private effect_grp: eui.Group;
	private open_desc_lab: eui.Label;
	private upgrade_btn: eui.Button;
	private tianshuAnim: Animation;
	private curPro:eui.Group;
    private nextPro:eui.Group
	private jiantou:eui.Image
	//变量
	private btnAry: eui.RadioButton[];
	private curTianshuId: number;//当前选中的天书ID
	protected points: redPoint[];
	private getGrp:eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TianshuUpgradeSkin;
	}
	protected onInit(): void {
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.btnAry = [];
		this.points = [];
		let tianshuModels = JsonModelManager.instance.getModeltianshushengji();
		for (let id in tianshuModels) {
			let model: Modeltianshushengji = tianshuModels[id];
			let radioBtn: eui.RadioButton = new eui.RadioButton();
			radioBtn.skinName = skins.TianshuRadioButtonSkin;
			radioBtn.label = model.name;
			radioBtn.icon = model.icon;
			radioBtn.groupName = 'tianshuTabGrp';
			radioBtn.value = model.id;
			this.btnAry.push(radioBtn);
			if (!this.points[this.points.length]) {
				let redpoint: redPoint = new redPoint();
				redpoint.register(radioBtn, GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().playerManager, 'oncheckRPTianshuGradeById', model.id)
				this.points[this.points.length] = redpoint;
			}
			this.itemlist_grp.addChild(radioBtn);
		}
		this.curTianshuId = this.btnAry[0].value;
		this.btnAry[0].selected = true;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onChangeTianshuHandle();
	}
	protected onRegist(): void {
		super.onRegist();
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandle, this);
		for (let i: number = 0; i < this.btnAry.length; i++) {
			let radioBtn: eui.RadioButton = this.btnAry[i];
			radioBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabHandle, this);
		}
		this.upgrade_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TIANSHU_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandle, this);
		for (let i: number = 0; i < this.btnAry.length; i++) {
			let radioBtn: eui.RadioButton = this.btnAry[i];
			radioBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabHandle, this);
		}
		this.upgrade_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TIANSHU_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
	}
	//选中Tab按钮处理
	private onTouchTabHandle(event: egret.TouchEvent): void {
		let targetBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		if (this.curTianshuId != targetBtn.value) {
			this.curTianshuId = targetBtn.value;
			this.onChangeTianshuHandle();
		}
	}
	//切换Tab处理
	private onChangeTianshuHandle(): void {
		let levelModel: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId];
		if (!levelModel) return;
		let gradeModel: Modeltianshutupo = JsonModelManager.instance.getModeltianshutupo()[this.curTianshuId];
		if (!gradeModel) return;

		//基础信息
		// this.name_lab.text = levelModel.name;
		if (!this.tianshuAnim) {
			this.tianshuAnim = GameCommon.getInstance().addAnimation(levelModel.Appearance, null, this.effect_grp, -1);
		} else {
			this.tianshuAnim.onUpdateRes(levelModel.Appearance, -1);
		}

		//服务器信息
		let tianshuGrade: number = 0;
		let tianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId];
		if (tianshuData) {
			if (!this.upgrade_btn.enabled) {
				this.upgrade_btn.enabled = true;
			}
			this.upgrade_btn.label = Language.instance.getText('shenqishengjie');
			if (!this.consumItem.visible) {
				this.consumItem.visible = true;
				this.getGrp.visible = true;
				this.open_desc_lab.text = '';
				this.nextPro.visible = true;
				this.curPro.visible = true;
				this.jiantou.visible = true;
			}
			this.label_name.text = tianshuData.grade + '\n阶';;
			tianshuGrade = tianshuData.grade;
		} else {
			this.label_name.text = '0' + '\n阶';
			let canActivate: boolean = true;
			let open_desc_str: string = '';
			if (levelModel.tiaojian > 0) {
				let opentianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId - 1];
				let opentianshuModel: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId - 1];
				if (opentianshuModel && (!opentianshuData || opentianshuData.level < levelModel.tiaojian)) {
					canActivate = false;
					open_desc_str = `需${opentianshuModel.name}升到${levelModel.tiaojian}级方可激活`;
				}
			}
			this.upgrade_btn.enabled = canActivate;
			this.upgrade_btn.label = Language.instance.getText('shenqijihuo');
			this.consumItem.visible = false;
			this.getGrp.visible = false;
			this.nextPro.visible = false;
			this.curPro.visible = false;
			this.jiantou.visible = false;
			this.open_desc_lab.text = open_desc_str;
		}

		//属性展示
		let curAttrAry: number[] = [];
		let grade: number = tianshuData ? tianshuData.grade : 0;
		let item: eui.Label;
		//属性值
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		var add: number = 0;
		for (let key in gradeModel.attrAry) {
			if (gradeModel.attrAry[key] > 0) {
				//当前属性
				let attrValue: number = gradeModel.attrAry[key] * grade;
				attributeItem = new AttributesText();
				attributeItem.scaleX = 0.8;
				attributeItem.scaleY = 0.8;
				attributeItem.updateAttr(key, attrValue);
				this.curPro.addChild(attributeItem);

				//下级属性
				attrValue = gradeModel.attrAry[key] * (grade + 1);
				attributeItem = new AttributesText();
				attributeItem.scaleX = 0.8;
				attributeItem.scaleY = 0.8;
				attributeItem.updateAttr(key, attrValue);
				this.nextPro.addChild(attributeItem);
			}
			curAttrAry[key] = gradeModel.attrAry[key] * grade;
		}
		//属性加成
		for (let key in gradeModel.attrAry) {
			let addattrkey: string = GameDefine.getAttrPlusKey(parseInt(key) + GameDefine.ATTR_OBJ_KEYS.length);
			if (gradeModel[addattrkey] && gradeModel[addattrkey] > 0) {
				//当前属性
				let attrValue: number = gradeModel[addattrkey] * grade / GameDefine.GAME_ADD_RATIO * 100;
				attributeItem = new AttributesText();
				attributeItem.scaleX = 0.8;
				attributeItem.scaleY = 0.8;
				attributeItem.updateAttr(key, attrValue.toFixed(2) + "%" );
				this.curPro.addChild(attributeItem);

				//下级属性
				attrValue = gradeModel[addattrkey] * (grade + 1) / GameDefine.GAME_ADD_RATIO * 100;
				//下级属性
				attributeItem = new AttributesText();
				attributeItem.scaleX = 0.8;
				attributeItem.scaleY = 0.8;
				attributeItem.updateAttr(key, attrValue.toFixed(2) + "%");
				this.nextPro.addChild(attributeItem);

			}
		}
		//战斗力展示
		this.powerBar.power = GameCommon.calculationFighting(curAttrAry);
		//消耗道具展示
		if (this.consumItem.visible) {
			this.consumItem.setCostByAwardItem(gradeModel.cost);
		}
	}
	//获取途径
	private onGetHandle(): void {
		let gradeModel: Modeltianshutupo = JsonModelManager.instance.getModeltianshutupo()[this.curTianshuId];
		if (!gradeModel) return;
		GameCommon.getInstance().onShowFastBuy(gradeModel.cost.id, gradeModel.cost.type);
	}
	//升级按钮事件
	private onUpgrade(): void {
		let tianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId];
		if (!tianshuData) {//激活
			let activateMsg: Message = new Message(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE);
			activateMsg.setByte(0);
			activateMsg.setShort(this.curTianshuId);
			activateMsg.setByte(0);
			GameCommon.getInstance().sendMsgToServer(activateMsg);
		} else {//升阶
			let gradeModel: Modeltianshutupo = JsonModelManager.instance.getModeltianshutupo()[this.curTianshuId];
			if (!gradeModel) return;
			let upgradeMsg: Message = new Message(MESSAGE_ID.TIANSHU_UPGRADE_MESSAGE);
			upgradeMsg.setByte(0);
			upgradeMsg.setShort(this.curTianshuId);
			GameCommon.getInstance().sendMsgToServer(upgradeMsg);
		}
	}
	private get playerData() {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	//The end
}