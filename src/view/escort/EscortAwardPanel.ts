class EscortAwardPanel extends BaseWindowPanel {
	private btn_receive: eui.Button;
	private fairyLayer: eui.Group;
	private anim: Animation;
	private label_name: eui.Label;
	private rewarditem0: GoodsInstance;
	private rewarditem1: GoodsInstance;
	private rewarditem2: GoodsInstance;
	private label_money: eui.Label;
	private label_rongyu: eui.Label;
	private label_jlzh: eui.Label;
	private label_log: eui.Label;
	private REWARD_MAX_NUM: number = 3;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.EscortAwardPanelSkin;
	}
	protected onInit(): void {
		this.setTitle('husong_title_png');
		if (this.basic["closeBtn1"])
			this.basic["closeBtn1"].visible = false;
		if (this.basic["closeBtn2"])
			this.basic["closeBtn2"].visible = false;
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReceive, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE.toString(), this.onRefreshBack, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReceive, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE.toString(), this.onRefreshBack, this);
	}
	protected onRefresh(): void {
		let data = DataManager.getInstance().escortManager.award;
		if (!this.anim) {
			this.anim = new Animation("yunbiao_0" + data.quality, -1);
			this.fairyLayer.addChild(this.anim);
		} else {
			this.anim.onUpdateRes("yunbiao_0" + data.quality, -1);
		}
		let model: Modeldujie = JsonModelManager.instance.getModeldujie()[data.quality];
		let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
		this.label_name.textFlow = (new egret.HtmlTextParser).parser(`<font color=${GameCommon.getInstance().CreateNameColer(data.quality)}>${GameDefine.EQUIP_QUALITE_NAME1[data.quality]}衣仙女</font>`)
		for (let i: number = 0; i < this.REWARD_MAX_NUM; i++) {
			if (rewards.length <= i) break;
			this['rewarditem' + i].updateByAward(rewards[i]);
		}
		this.label_money.text = `${data.log.length > 0 ? "-" + rewards[0].num * 0.1 * data.log.length : "无丢失"}`;
		this.label_rongyu.text = `${data.log.length > 0 ? "-" + rewards[1].num * 0.1 * data.log.length : "无丢失"}`;
		this.label_jlzh.text = `${data.log.length > 0 ? "-" + rewards[2].num * 0.1 * data.log.length : "无丢失"}`;
		let arr: Array<egret.ITextElement> = new Array<egret.ITextElement>();
		if (data.log.length == 0) {
			arr.push({ text: "本次护送没有被抢夺", style: { "textColor": 0xE9DEB3 } });
		} else {
			for (let i: number = 0; i < data.log.length; i++) {
				arr.push({ text: "抢劫情况：", style: { "textColor": 0xE9DEB3 } });
				arr.push({ text: data.log[i].name, style: { "textColor": 0x289aea } });
				arr.push({ text: "抢夺我的", style: { "textColor": 0xE9DEB3 } });
				arr.push({ text: `${GameDefine.EQUIP_QUALITE_NAME1[data.log[i].quality]}衣仙女`, style: { "textColor": GameCommon.getInstance().CreateNameColer(data.log[i].quality) } });
				arr.push({ text: " ", style: {} });
				arr.push({ text: "成功", style: { "textColor": 0x28e828 } });
				arr.push({ text: "\n", style: {} });
			}
			arr.pop();
		}
		this.label_log.textFlow = arr;
	}
	private onRefreshBack(): void {
		this.onHide();
	}
	private onTouchReceive(): void {
		DataManager.getInstance().escortManager.onSendEscortAwardReceive();
	}
	//The end
}