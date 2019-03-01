class UnionCreatePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private uinon_badges: eui.Component;
	private union_name_label: eui.Label;
	private union_name_input: eui.TextInput;
	private create_btn: eui.Button;
	private consume_label: eui.Label;

	private Union_Create_Consume: number;
	private curSelectedIcon_ck: eui.CheckBox;
	private curSelectedColor_ck: eui.CheckBox;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionCreatePanelSkin;
	}
	protected onInit(): void {
		this.Union_Create_Consume = parseInt(Constant.get(Constant.CREATE_GANG_DIAMOND));
		this.consume_label.text = this.Union_Create_Consume + '';
		for (var i: number = 1; i <= 4; i++) {
			this["badges_icon_ck" + i].name = i + "";
		}
		for (var i: number = 1; i <= UnionDefine.Union_Badges_ColorNum; i++) {
			this["badges_color_ck" + i].name = i + "";
		}
		// this.setTitle("union_create_title_png");
		this.setTitle("创建仙盟");
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.union_name_label.text = "";
		this.union_name_input.text = "";
		if (this.curSelectedIcon_ck) {
			this.curSelectedIcon_ck.selected = false;
		}
		this.curSelectedIcon_ck = this["badges_icon_ck1"];
		this.curSelectedIcon_ck.selected = true;
		if (this.curSelectedColor_ck) {
			this.curSelectedColor_ck.selected = false;
		}
		this.curSelectedColor_ck = this["badges_color_ck1"];
		this.curSelectedColor_ck.selected = true;
		this.onUpdateBadgesStyle();
		// this.has_label.text = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.DIAMOND).toString();
	}
	protected onRegist(): void {
		super.onRegist();
		this.create_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreate, this);
		this.union_name_input.addEventListener(egret.TextEvent.CHANGE, this.onInputUnionName, this);
		for (var i: number = 1; i <= UnionDefine.Union_Badges_IconNum; i++) {
			(this["badges_icon_Layer" + i] as eui.Group).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBadgesIcon, this);
		}
		for (var i: number = 1; i <= UnionDefine.Union_Badges_ColorNum; i++) {
			(this["badges_color_Layer" + i] as eui.Group).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBadgesColor, this);
		}
	}
	protected onRemove(): void {
		super.onRemove();
		this.create_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreate, this);
		this.union_name_input.removeEventListener(egret.TextEvent.CHANGE, this.onInputUnionName, this);
		for (var i: number = 1; i <= UnionDefine.Union_Badges_IconNum; i++) {
			(this["badges_icon_Layer" + i] as eui.Group).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBadgesIcon, this);
		}
		for (var i: number = 1; i <= UnionDefine.Union_Badges_ColorNum; i++) {
			(this["badges_color_Layer" + i] as eui.Group).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBadgesColor, this);
		}
	}
	//选择帮会徽章图标
	private onSeletedBadgesIcon(event: egret.Event): void {
		var targetCheckBox: eui.CheckBox = (this[event.currentTarget.name] as eui.CheckBox)
		if (this.curSelectedIcon_ck) {
			this.curSelectedIcon_ck.selected = false;
		}
		this.curSelectedIcon_ck = targetCheckBox;
		this.curSelectedIcon_ck.selected = true;
		this.onUpdateBadgesStyle();
	}
	//选择帮会徽章颜色
	private onSeletedBadgesColor(event: egret.Event): void {
		var targetCheckBox: eui.CheckBox = (this[event.currentTarget.name] as eui.CheckBox)
		if (this.curSelectedColor_ck) {
			this.curSelectedColor_ck.selected = false;
		}
		this.curSelectedColor_ck = targetCheckBox;
		this.curSelectedColor_ck.selected = true;
		this.onUpdateBadgesStyle();
	}
	//更换公会徽章样式
	private badgeIndex: number = 0;
	private onUpdateBadgesStyle(): void {
		var colorIndex: number = parseInt(this.curSelectedColor_ck.name);
		(this.uinon_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		var iconIndex: number = parseInt(this.curSelectedIcon_ck.name);
		(this.uinon_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.badgeIndex = (colorIndex - 1) * UnionDefine.Union_Badges_ColorNum + iconIndex - 1;
	}
	//帮会名称修改
	private onInputUnionName(event: egret.TextEvent): void {
		this.union_name_label.text = (event.currentTarget as eui.TextInput).text;
	}
	//进行创建帮会操作
	private onCreate(): void {
		if (this.union_name_label.text == "") {
			GameCommon.getInstance().addAlert("帮会名称不能为空");
			return;
		}
		if (DataManager.getInstance().playerManager.player.money < this.Union_Create_Consume && DataManager.getInstance().playerManager.player.gold < this.Union_Create_Consume) {
			GameCommon.getInstance().addAlert("error_tips_2");
			return;
		}
		var createUionMsg: Message = new Message(MESSAGE_ID.UNION_CREATE_MESSAGE);
		createUionMsg.setString(this.union_name_label.text);
		createUionMsg.setByte(this.badgeIndex);
		GameCommon.getInstance().sendMsgToServer(createUionMsg);
		this.onHide();
	}
	//The end
}