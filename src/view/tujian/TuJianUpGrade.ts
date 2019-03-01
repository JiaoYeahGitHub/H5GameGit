class TuJianUpGrade extends BaseWindowPanel {
	private tips_mask: eui.Group;
	private jihuoBtn: eui.Button;
	private label_get: eui.Label;
	private curPro: eui.Group;
	private consumItem: ConsumeBar;
	private nextPro: eui.Group;
	private tujianData: TuJianData;

	private img_head: eui.Image;
	private jihuo: eui.Image;
	private tujiam_cover: eui.Image;
	private btn: eui.RadioButton;
	private point: eui.Image;
	private tujian_name: eui.Label;
	private powerbar: PowerBar;
	private animation: eui.Image;
	private attr: number[];

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	public onShowWithParam(param: TuJianData): void {
		this.tujianData = param;
		this.onShow();
	}
	public onShow(): void {
		if (this.tujianData) {
			this.width = size.width;
			this.height = size.height;
			super.onShow();
		}
	}
	protected onSkinName(): void {
		this.skinName = skins.TuJianUpGradeSkin;
	}
	protected onInit(): void {
		this.setTitle("图鉴升级");
		GameCommon.getInstance().addUnderlineGet(this.label_get);

		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.updateTJNPanel();
		this.updateNextAttr();
	}
	protected onRegist(): void {
		// this.buyBar.onRegist();
		super.onRegist();
		this.jihuoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jihuoMethod, this);
		this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.omTouchHQTJ, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TUJIAN_MESSAGE.toString(), this.msgCallBack, this);
		// this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected onRemove(): void {
		// this.buyBar.onRemove();
		super.onRemove();
		this.jihuoBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jihuoMethod, this);
		this.tips_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.omTouchHQTJ, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TUJIAN_MESSAGE.toString(), this.msgCallBack, this);
		// this.btn_equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	private jihuoMethod(): void {
		if (this.jihuoBtn.label == "已满级") {
			GameCommon.getInstance().addAlert("图鉴已满级了");
			return;
		}
		let model: Modeltujian = this.tujianData.model;
		if (!GameCommon.getInstance().onCheckItemConsume(model.cost.id, this.tujianData.costNum, model.cost.type)) {
			return;
		}
		var message = new Message(MESSAGE_ID.TUJIAN_MESSAGE);
		message.setByte(0);
		message.setShort(this.tujianData.id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private msgCallBack(e: egret.Event) {
		this.updateTJNPanel();
		this.updateNextAttr();
		GameCommon.getInstance().addAnimation('tujianshengji', new egret.Point(320, 390), this.tips_mask, 1);
	}
	//更新二级显示的图鉴
	private updateTJNPanel(): void {
		//判断满级
		if (this.tujianData.level < GameDefine.Tujian_MAX_Lv) {
			//判断是否激活
			if (this.tujianData.level > 0) {
				this.jihuoBtn.label = "升 级";
			} else {
				this.jihuoBtn.label = "激 活";
			}
			this.currentState = 'normal'
			this.consumItem.visible = true;
			this.consumItem.nameColor = 0xf3f3f3;
			this.consumItem.setCostByAwardItem(this.tujianData.model.cost);
		} else {
			this.currentState = 'max';
			this.jihuoBtn.label = "已满级";
			this.consumItem.visible = false;
		}
	}
	private onUpdataInfo(): void {
		let data: TuJianData = this.tujianData;
		if (data) {
			this.attr = data.attrAry;
			//具体属性使用数据库数据
			if (data.level > 0) {
				this.jihuo.visible = false;
				this.tujian_name.text = data.model.name + data.level + "级";
				this.tujiam_cover.source = `tujian_kuang_di${data.model.pinzhi}_png`;
			} else {
				this.jihuo.visible = true;
				this.tujian_name.text = data.model.name;
				this.tujiam_cover.source = `tujian_weijihuo_png`;
			}
			//加载动画,获取外形、战斗力，使用模型数据
			this.powerbar.power = (GameCommon.calculationFighting(this.attr)).toString();
			this.animation.source = data.model.waixing1 + "_png";
		}
	}
	private updateNextAttr(): void {
		this.onUpdataInfo();
		let model: Modeltujian = this.tujianData.model;
		var add: number = 0;
		var attributeItem: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		let curAttrAry: number[] = this.tujianData.attrAry;
		let nextAttrAry: number[] = this.tujianData.nextAttrAty;
		for (var key in curAttrAry) {
			if (model.attrAry[key] > 0) {
				add = curAttrAry[key];
				attributeItem = new AttributesText();
				attributeItem.updateAttr(key, add);
				this.curPro.addChild(attributeItem);
				if (this.tujianData.level < GameDefine.Tujian_MAX_Lv) {
					add = nextAttrAry[key];
					attributeItem = new AttributesText();
					attributeItem.updateAttr(key, add);
					this.nextPro.addChild(attributeItem);
				}
			}
		}
	}
	//点击获取途径
	private omTouchHQTJ(): void {
		GameCommon.getInstance().onShowFastBuy(this.tujianData.model.cost.id);
	}
}