class Magic3DanPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private lbName: eui.Label;
	private lbLevel: eui.Label;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	private consumItem: ConsumeBar;
	private upBtn: eui.Button;
	private avatar_grp: eui.Group;
	private blessType: number = 0;
	private danType: number = 0;// 觉醒，资质，成长
	private btnTabs: eui.RadioButton[];

	private modelZiZhi: ModelmountDan;
	private modelChengZhang: ModelmountDan;
	private modelJueXing: ModelThing;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.Magic3DanSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("丹 药");
		this.btnTabs = [];
		let resList = ["pet_juexingIcon_png", "pet_zizhiIcon_png", "icon_macig_chengzhangdan_png"];
		for (let i = 0; i < 3; ++i) {
			this.btnTabs[i] = this["btnTab" + i];
			this.btnTabs[i].value = i;
			this.btnTabs[i].iconDisplay.source = resList[i];
		}
		this.initModels();
		this.onRefresh();
	}
	private initModels() {
		let _id = DataManager.getInstance().blessManager.getBlessJueXingItemId(this.blessType);
		this.modelJueXing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, _id);
		var models: ModelmountDan[] = JsonModelManager.instance.getModelmountDan();
		for (let k in models) {
			if (models[k].type == this.blessType) {
				if (models[k].subtype == 0) {
					this.modelZiZhi = models[k];
				} else if (models[k].subtype == 1) {
					this.modelChengZhang = models[k];
				}
			}
		}
	}
	public onShowWithParam(param): void {
		this.blessType = param;
		this.danType = 0;
		this.onShow();
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i = 0; i < 3; ++i) {
			this.btnTabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUp, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_DAN_MESSAGE.toString(), this.updateUI, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE.toString(), this.updateUI, this);
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i = 0; i < 3; ++i) {
			this.btnTabs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUp, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_DAN_MESSAGE.toString(), this.updateUI, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE.toString(), this.updateUI, this);
	}
	protected onRefresh(): void {
		this.updateUI();
		this.updateAvatarAnim();
	}
	private onTouchBtnUp() {
		switch (this.danType) {
			case 0:
				if (!GameCommon.getInstance().onCheckItemConsume(this.modelJueXing.id, 1, GOODS_TYPE.ITEM)) return;
				var message = new Message(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE);
				message.setByte(0);
				message.setByte(this.blessType);
				GameCommon.getInstance().sendMsgToServer(message);
				break;
			case 1:
				if (!GameCommon.getInstance().onCheckItemConsume(this.modelZiZhi.cost.id, this.modelZiZhi.cost.num, this.modelZiZhi.cost.type)) return;
				var message = new Message(MESSAGE_ID.BLESS_UP_DAN_MESSAGE);
				message.setByte(0);
				message.setByte(this.blessType);
				message.setByte(this.modelZiZhi.subtype)
				GameCommon.getInstance().sendMsgToServer(message);
				break;
			case 2:
				if (!GameCommon.getInstance().onCheckItemConsume(this.modelChengZhang.cost.id, this.modelChengZhang.cost.num, this.modelChengZhang.cost.type)) return;
				var message = new Message(MESSAGE_ID.BLESS_UP_DAN_MESSAGE);
				message.setByte(0);
				message.setByte(this.blessType);
				message.setByte(this.modelChengZhang.subtype)
				GameCommon.getInstance().sendMsgToServer(message);
				break;
		}
	}
	private onTouchTab(event: egret.TouchEvent): void {
		let button: eui.RadioButton = event.currentTarget;
		if (this.danType != button.value) {
			this.danType = button.value;
			this.updateUI();
		}
	}
	private updateUI() {
		if (this.danType == 0) {
			this.updateJueXing();
		} else 
		{
			this.updateDan();
		}
	}
	private updateJueXing() {
		this.lbName.text = this.modelJueXing.name;
		let level = this.getPlayer().getPlayerData().blessWakeLevel[this.blessType];
		this.lbLevel.text = "等级:" + level;
		let levelList: number[] = DataManager.getInstance().blessManager.getBlessJueXingValue();
		if (level > 0) {
			let currBei = levelList[level - 1] / 10000 + 1;
			this.curPro.text = "全属性加成" + currBei + "倍";
		} else {
			this.curPro.text = "无属性加成";
		}
		if (level < levelList.length) {
			let nextBei = levelList[level] / 10000 + 1;
			this.nextPro.text = "全属性加成" + nextBei + "倍";
			this.consumItem.setConsume(this.modelJueXing.type, this.modelJueXing.id);
			this.consumItem.visible = this.upBtn.visible = true;
		} else {
			this.nextPro.text = "已升至满级";
			this.consumItem.visible = this.upBtn.visible = false;
		}
	}
	private updateDan() {
		let model: ModelmountDan = this.danType == 1 ? this.modelZiZhi : this.modelChengZhang;
		this.lbName.text = model.name;
		let blessData: BlessData = DataManager.getInstance().blessManager.getPlayerBlessData(this.blessType);
		var lvNum = this.danType == 1 ? blessData.danDic[0] : blessData.danDic[1];
		this.lbLevel.text = '等级:' + lvNum;
		//属性显示
		var str: string = '';
		var nextStr: string = '';
		if (model.harm > 0) {
			str = GameDefine.BlessName[this.blessType] + "全属性:" + ((model.harm * lvNum)/100)+'%';
			nextStr = GameDefine.BlessName[this.blessType] + '全属性:' + (model.harm * (lvNum + 1)/100)+'%';
		} else {
			var attrAry: number[] = model.attrAry;
			for (let i = 0; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
				if (attrAry[i] > 0) {
					if (str.length > 0) {
						str += '\n';
					}
						str = str + GameDefine.Attr_FontName[i] + "：" + (attrAry[i] * lvNum);
						if (nextStr.length > 0) {
							nextStr += '\n';
						}
						nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + (attrAry[i] * (lvNum + 1));
				}
			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextStr;
		this.consumItem.setCostByAwardItem(model.cost);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
	private moveUp: boolean;
	private start_posY: number;
	private onStartFloatAnim(): void {
		this.moveUp = true;
		this.start_posY = this.avatar_grp.y;
		this.avatar_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}
	private onFrame(): void {
		if (this.moveUp) {
			this.avatar_grp.y--;
			if (this.avatar_grp.y < this.start_posY - 50) {
				this.moveUp = false;
			}
		} else {
			this.avatar_grp.y++;
			if (this.avatar_grp.y > this.start_posY) {
				this.moveUp = true;
			}
		}
	}
	private updateAvatarAnim(): void {
		let resurl: string = "";
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		model = model ? model : manager.getBlessModel(this.blessType, 1, 1);
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		var waixing: number = 0;
		let wearfashionId: number = DataManager.getInstance().playerManager.player.getPlayerData().fashionWearIds[this.blessType];
		let fashionmodel: Modelfashion = JsonModelManager.instance.getModelfashion()[wearfashionId];
		if (fashionmodel) {
			waixing = fashionmodel.waixing1;
		}
		let scalep = 1;
		switch (this.blessType) {
			case BLESS_TYPE.HORSE:
				resurl = `zuoqi_${waixing}`;
				let _mountBody: Animation = new Animation(resurl);
				_mountBody.y = 0;
				this.avatar_grp.addChild(_mountBody);
				// this.avatar_grp.y = 420;
				// this.currentState = 'normal';
				break;
			case BLESS_TYPE.WEAPON:
				// resurl = `jian${waixing}_png`;
				// let weaponimg: eui.Image = new eui.Image();
				// weaponimg.source = resurl;
				// this.avatar_grp.addChild(weaponimg);
				// weaponimg.y = -285;
				// weaponimg.x = -165;
				resurl = 'jian' + waixing;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				scalep = 0.7;
				// anim.y = 60;
				// this.avatar_grp.y = 100;
				// this.onStartFloatAnim();
				// this.currentState = 'baoqi';
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = DataManager.getInstance().playerManager.player.getPlayerData().sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = `shenzhuang_${sex}_${waixing}`;
				var anim = new Animation(resurl, -1);
				anim.y = 140;
				this.avatar_grp.addChild(anim);
				scalep = 0.7;
				// this.avatar_grp.y = 420;
				// this.currentState = 'shenzhuang';
				break;
			case BLESS_TYPE.MAGIC:
				// this.currentState = 'baoqi';
				// resurl = `sc_magic${waixing}`;
				var anim = new Animation('sc_magic' + waixing, -1);
				this.avatar_grp.addChild(anim);
				// anim.y = 55;
				// anim.x = 18;
				// this.avatar_grp.y = 320;
				// this.currentState = 'zhuanpan';
				break;
			case BLESS_TYPE.WING:
				// resurl = LoadManager.getInstance().getWingResUrl("wing" + waixing, "ride_stand", Direction.DOWN + "");
				// let _wingBody: BodyAnimation = new BodyAnimation(resurl, -1, Direction.DOWN);
				// _wingBody.y = 100;
				// _wingBody.x = 20;
				// this.avatar_grp.addChild(_wingBody);
				var anim = new Animation('wing' + waixing + "_ui", -1);
				anim.y = 120;
				// anim.x = 20;
				this.avatar_grp.addChild(anim);
				break;
		}
		this.avatar_grp.scaleX = this.avatar_grp.scaleY = scalep;
	}
}