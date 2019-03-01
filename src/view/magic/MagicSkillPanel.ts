class MagicSkillPanel extends eui.Component {
	private currLayer: eui.Group;
	private nextLayer: eui.Group;
	private progress: eui.ProgressBar;
	private currency: ConsumeBar;
	private powerBar: PowerBar;
	private skillLv: eui.Label;
	private imgSkillName: eui.Image;
	private upBtn: eui.Button;
	private blessTp: number = 0;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	// private closeBtn1: eui.Button;
	private label_points: eui.Label;
	private exp_probar: eui.ProgressBar;
	private consumItem: ConsumeBar;
	private selectedAnim: Animation;
	private selectedAnim2: Animation;
	private btn0: eui.Group;
	private btn1: eui.Group;
	private btn2: eui.Group;
	private btn3: eui.Group;
	private btn4: eui.Group;
	protected points: redPoint[] = RedPointManager.createPoint(6);
	// public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public isLoaded = false;
	public constructor(blessType: BLESS_TYPE) {
		super();
		this.blessTp = blessType;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
	}
	protected onAddStage(): void {
		this.skinName = skins.MagicSkillSkin;
	}
	private onLoadComplete(): void {
		this.isLoaded = true;
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}
		if (this.isLoaded) {
			this.onInit();
			this.onRegist();
			this.onRefresh();
		}
	}
	protected onInit(): void {
		this.indexId = 0;
		this.selectedAnim = new Animation("gonghuijineng_1", -1);
		this.selectedAnim.x = 58;
		this.selectedAnim.y = 58;
		this.selectedAnim.onPlay();
		this.btn0.addChildAt(this.selectedAnim, 2);
		this.selectedAnim2 = new Animation("gonghuijineng_1", -1);
		this.selectedAnim2.x = 60;
		this.selectedAnim2.y = 60;
		this.selectedAnim2.onPlay();
		for (let i: number = 0; i < 5; i++) {
			(this[`skillIcon${i}`] as eui.Image).source = this.models[i].icon;
		}
	}
	protected onRegist(): void {
		let cfgs: ModelmountSkill[] = DataManager.getInstance().blessManager.skillModels(this.blessTp);
		for (let i: number = 0; i < 5; i++) {
			this[`btn${i}`].name = i + '';
			(this[`btn${i}`] as eui.Group).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkill, this);
			let model = cfgs[i];
			this.points[i].register(this[`btn${i}`], new egret.Point(95, 0), this, "checkRedPoint", model);
		}
		this.points[5].register(this.upBtn, new egret.Point(150, -5), this, "checkRedPointBtn");
		this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_SKILL_MESSAGE.toString(), this.onRefresh, this);
	}
	private checkRedPointBtn() {
		let cfgs: ModelmountSkill[] = DataManager.getInstance().blessManager.skillModels(this.blessTp);
		return this.checkRedPoint(cfgs[this.indexId]);
	}
	private checkRedPoint(model: ModelmountSkill) {
		let cost: AwardItem = model.cost;
		return DataManager.getInstance().bagManager.getGoodsThingNumById(cost.id, cost.type) >= cost.num;
	}
	private trigger() {
		for (var i: number = 0; i < this.points.length; i++) {
			this.points[i].checkPointAll();
		}
	}
	// protected onRemove(): void {
	// 	for (let i: number = 0; i < 5; i++) {
	// 		(this[`btn${i}`] as eui.Group).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSkill, this);
	// 	}
	// 	this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
	// 	GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_SKILL_MESSAGE.toString(), this.onRefresh, this);
	// }
	// public onHide(): void{
	// 	this.clearAnim();
	// 	this.selectedAnim2.onDestroy();
	// 	this.selectedAnim.onDestroy();
	// }
	//获取对应标签的数据结构
	private rewardArr: Array<ModelmountSkill> = new Array<ModelmountSkill>();
	private get models(): ModelmountSkill[] {
		this.rewardArr = [];
		var models: ModelmountSkill[];
		models = JsonModelManager.instance.getModelmountSkill();
		for (let k in models) {
			if (models[k].type == this.blessTp) {
				this.rewardArr.push(models[k])
			}
		}
		return this.rewardArr;
	}
	private onTouchSkill(event: egret.Event): void {
		var group: eui.Group = event.currentTarget;
		var idx: number = Number(event.target.name);
		this.clearAnim();
		this.onShowInfo(idx);
		if (idx <= 2) {
			group.addChildAt(this.selectedAnim, 2);
		} else {
			group.addChildAt(this.selectedAnim2, 3);
		}
		this.onRefresh();
	}
	private clearAnim() {
		if (this.indexId == 0) {
			this.btn0.removeChildAt(2);
		}
		if (this.indexId == 1) {
			this.btn1.removeChildAt(2);
		}
		if (this.indexId == 2) {
			this.btn2.removeChildAt(2);
		}
		if (this.indexId == 3) {
			this.btn3.removeChildAt(3);
		}
		if (this.indexId == 4) {
			this.btn4.removeChildAt(3);
		}
	}
	private indexId: number = 0;
	public onRefresh(): void {
		if (this.isLoaded) {
			this.onShowInfo(this.indexId);
		}
		// this.onShowMagicAnim();
		// this.onUpdatePower();
		// this.updateAvatarAnim();
	}
	private onShowInfo(idx: number): void {
		// if(this.indexId==idx) return;
		this.indexId = idx;
		var curr: ModelmountSkill = this.models[this.indexId];

		this.imgSkillName.source = curr.zi;
		var skillData = this.getPlayer().getPlayerData(0).getBlessSkill(curr.id);
		if (skillData) {
			this.skillLv.text = '等级：' + skillData.level;
		} else {
			this.skillLv.text = '等级：0';
		}
		//属性显示
		var attrAry: number[] = DataManager.getInstance().blessManager.getSkillAttrByID(curr.id);
		var nextAry: number[] = DataManager.getInstance().blessManager.getSkillAttrByID(curr.id, true);
		var str: string = '';
		var nextStr: string = '';
		let i: number = 0;
		if (nextAry.length == 0) {
			nextStr = Language.instance.getText('error_tips_7');
		}
		for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
			if (attrAry[i] > 0 || nextAry[i]) {
				if (str.length > 0) {
					str += '\n';
				}
				str += GameDefine.Attr_FontName[i] + "：" + attrAry[i];
				if (i < nextAry.length) {
					if (nextStr.length > 0) {
						nextStr += '\n';
					}
					nextStr += GameDefine.Attr_FontName[i] + "：" + nextAry[i];
				}
			}
		}

		for (; i < GameDefine.ATTR_OBJ_KEYS.length * 2; i++) {
			if (attrAry[i] > 0 || nextAry[i]) {
				if (str.length > 0) {
					str += '\n';
				}
				if (attrAry[i] / GameDefine.GAME_ADD_RATIO > 0) {
					str = str + GameDefine.Attr_FontName[i % ATTR_TYPE.SIZE] + "加成：" + (attrAry[i] / GameDefine.GAME_ADD_RATIO * 100).toFixed(2) + '%';
				}
				else {
					str = str + GameDefine.Attr_FontName[i % ATTR_TYPE.SIZE] + "加成：" + '0%';
				}
				if (i < nextAry.length) {
					if (nextStr.length > 0) {
						nextStr += '\n';
					}
					nextStr = nextStr + GameDefine.Attr_FontName[i % ATTR_TYPE.SIZE] + "加成：" + (nextAry[i] / GameDefine.GAME_ADD_RATIO * 100).toFixed(2) + '%';
				}
			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextStr;

		//升级进度显示
		this.exp_probar.maximum = DataManager.getInstance().blessManager.getSkillExpMaxByID(curr.id);
		if (this.exp_probar.maximum > 0) {
			this.exp_probar.value = skillData ? skillData.exp : 0;
		} else {
			this.exp_probar.maximum = 1;
			this.exp_probar.value = 1;
			this.exp_probar['labelDisplay'].text = 'MAX';
		}
		// this.powerBar.power = GameCommon.calculationFighting(attrAry);
		this.powerBar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessTp);
		// this.powerBar.visible = false;
		this.consumItem.setCostByAwardItem(curr.cost);
		this.trigger();
	}
	private onTouchBtnUpSkill(): void {
		if (!GameCommon.getInstance().onCheckItemConsume(this.models[this.indexId].cost.id, this.models[this.indexId].cost.num, this.models[this.indexId].cost.type)) return;
		var message = new Message(MESSAGE_ID.BLESS_UP_SKILL_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessTp);
		message.setByte(this.models[this.indexId].id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}