class TianshuLevelUpPanel extends BaseTabView {
	//UI
	private powerBar: PowerBar;
	private scroller: eui.Scroller;
	private itemlist_grp: eui.Group;
	private label_name: eui.Label;
	private exp_probar: eui.ProgressBar;
	private consumItem: ConsumeBar;
	private label_get: eui.Label;
	private levelup_btn: eui.Button;
	private effect_grp: eui.Group;
	private currLayer: eui.Group;
	private nextLayer: eui.Group;
	private open_desc_lab: eui.Label;
	private one_levelup_btn: eui.Button;
	private activate_btn: eui.Button;
	private tianshuAnim: Animation;
	private strengthenMasterBtn: eui.Button;
	private curPro:eui.Group;
    private nextPro:eui.Group
	private getGrp:eui.Group;
	private jiantou:eui.Image
	private qianghuaPro:eui.ProgressBar;
	//变量
	private btnAry: eui.RadioButton[];
	private curTianshuId: number;//当前选中的天书ID
	protected points: redPoint[];

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TianshuUpLevelSkin;
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
				redpoint.register(radioBtn, GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().playerManager, 'oncheckRPTianshuLevelById', model.id)
				this.points[this.points.length] = redpoint;
			}
			this.itemlist_grp.addChild(radioBtn);
		}
		let redPointP: redPoint = new redPoint();
		this.points[this.points.length] = redPointP;
		redPointP.register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL);
		this.curTianshuId = this.btnAry[0].value;
		this.btnAry[0].selected = true;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onChangeTianshuHandle();
		this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL);
		this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL);
	}
	protected onRegist(): void {
		super.onRegist();
		this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandle, this);
		for (let i: number = 0; i < this.btnAry.length; i++) {
			let radioBtn: eui.RadioButton = this.btnAry[i];
			radioBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabHandle, this);
		}
		this.activate_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpLevel, this);
		this.levelup_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpLevel, this);
		this.one_levelup_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onekeyUpLevel, this);
		this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetHandle, this);
		for (let i: number = 0; i < this.btnAry.length; i++) {
			let radioBtn: eui.RadioButton = this.btnAry[i];
			radioBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabHandle, this);
		}
		this.activate_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpLevel, this);
		this.levelup_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpLevel, this);
		this.one_levelup_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onekeyUpLevel, this);
		this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openStrongerMonsterPanel, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
	}
	public trigger(): void {
		for(var i:number=0;i<this.points.length;i++)
		{
			this.points[i].checkPoint();
		}
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
		let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId];
		if (!model) return;

		//基础信息
		// this.name_lab.text = model.name;
		if (!this.tianshuAnim) {
			this.tianshuAnim = GameCommon.getInstance().addAnimation(model.Appearance, null, this.effect_grp, -1);
		} else {
			this.tianshuAnim.onUpdateRes(model.Appearance, -1);
		}

		//服务器信息
		let tianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId];
		if (tianshuData) {
			if (this.activate_btn.visible) {
				this.activate_btn.visible = false;
			}
			if (!this.consumItem.visible) {
				this.levelup_btn.visible = true;
				this.one_levelup_btn.visible = true;
				this.consumItem.visible = true;
				this.getGrp.visible = true;
				this.jiantou.visible = true;
				this.curPro.visible = true;
				this.nextPro.visible = true;
				this.open_desc_lab.text = '';
			}
			this.label_name.text = tianshuData.level+'\n级';
			//天书升级经验=初始经验+int(等级/10)*5
			this.exp_probar.maximum = model.exp + Math.floor(tianshuData.level / 10) * 5;
			this.exp_probar.value = tianshuData.lvExp;
		} else {
			this.label_name.text = '0\n级';
			//天书升级经验=初始经验+int(等级/10)*5
			this.exp_probar.maximum = model.exp;
			this.exp_probar.value = 0;
			let canActivate: boolean = true;
			let open_desc_str: string = '';
			if (model.tiaojian > 0) {
				let opentianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId - 1];
				let opentianshuModel: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId - 1];
				if (opentianshuModel && (!opentianshuData || opentianshuData.level < model.tiaojian)) {
					canActivate = false;
					open_desc_str = `需${opentianshuModel.name}升到${model.tiaojian}级方可激活`;
				}
			}
			this.activate_btn.visible = true;
			this.activate_btn.enabled = canActivate;
			this.levelup_btn.visible = false;
			this.one_levelup_btn.visible = false;
			this.consumItem.visible = false;
			this.getGrp.visible = false;
			this.jiantou.visible = false;
			this.curPro.visible = false;
			this.nextPro.visible = false;
			this.open_desc_lab.text = open_desc_str;
		}
		//属性展示
		let curAttrAry: number[] = [];
		let level: number = tianshuData ? tianshuData.level : 0;
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		var add: number = 0;
		for (let key in model.attrAry) {
			if (model.attrAry[key] > 0) {
				//当前属性
				let attrValue: number = model.attrAry[key] * level;
				 attributeItem = new AttributesText();
				attributeItem.updateAttr(key, attrValue);
				this.curPro.addChild(attributeItem);
				//下级属性
				attrValue = model.attrAry[key] * (level + 1);
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, attrValue);
				this.nextPro.addChild(attributeItem);
			}

			curAttrAry[key] = model.attrAry[key] * level;
		}
		//战斗力展示
		this.powerBar.power = GameCommon.calculationFighting(curAttrAry);
		//消耗道具展示
		if (this.consumItem.visible) {
			this.consumItem.setCostByAwardItem(model.cost);
		}
	}
	//获取途径
	private onGetHandle(): void {
		let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId];
		if (!model) return;
		GameCommon.getInstance().onShowFastBuy(model.cost.id, model.cost.type);
	}
	//打开强化大师界面
	private openStrongerMonsterPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL));
	}
	//升级按钮事件
	private onUpLevel(): void {
		let tianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId];
		if (tianshuData) {
			let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId];
			if (!model) return;
			if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num, model.cost.type)) {
				return;
			}
		}
		let levelupMsg: Message = new Message(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE);
		levelupMsg.setByte(0);
		levelupMsg.setShort(this.curTianshuId);
		levelupMsg.setByte(0);
		GameCommon.getInstance().sendMsgToServer(levelupMsg);
	}
	private onekeyUpLevel(): void {
		let tianshuData: TianshuData = this.playerData.tianshuDict[this.curTianshuId];
		if (tianshuData) {
			let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[this.curTianshuId];
			if (!model) return;
			if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num, model.cost.type)) {
				return;
			}
		}
		let levelupMsg: Message = new Message(MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE);
		levelupMsg.setByte(0);
		levelupMsg.setShort(this.curTianshuId);
		levelupMsg.setByte(99);
		GameCommon.getInstance().sendMsgToServer(levelupMsg);
	}
	private get playerData() {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	//The end
}