class UnionInspirePanel extends BaseWindowPanel {
	private add_desc_lab: eui.Label;
	private times_lab: eui.Label;
	private buy_button: eui.Button;
	private closeBtn1: eui.Button;

	private inspireCount: number = 0;
	private costGold: number;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LadderInspireSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let attack_add_str: string = GameCommon.getInstance().readStringToHtml(`[#5aff91${this.inspireCount * 20}%]`);
		this.add_desc_lab.textFlow = (new egret.HtmlTextParser).parse(Language.instance.parseInsertText('unionbattle_insprite', attack_add_str));
		this.times_lab.text = Language.instance.getText('current', 'yiguwu') + ":" + this.inspireCount + "/" + UnionDefine.UNIONBATTLE_BUFF_MAX;
		if (this.inspireCount < UnionDefine.UNIONBATTLE_BUFF_MAX) {
			let buff_Price: string = Constant.get(Constant.GANG_WAR_BUFF_DIAMOND_COST);
			this.costGold = parseInt(buff_Price);
			this.buy_button.label = Language.instance.getText('inspire', ' ', this.costGold, 'currency5');
			this.buy_button.enabled = true;
		} else {
			this.buy_button.label = Language.instance.getText('error_tips_7');
			this.buy_button.enabled = false;
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.buy_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.buy_button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
	}
	private onInspire(): void {
		let inspiremsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_BUYBUFF_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(inspiremsg);
		this.onTouchCloseBtn();
	}
	public onShowWithParam(param): void {
		this.inspireCount = param;
		this.onShow();
	}
	//The end
}