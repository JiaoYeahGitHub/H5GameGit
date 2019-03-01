class LadderInspirePanel extends BaseWindowPanel {
	private add_desc_lab: eui.Label;
	private times_lab: eui.Label;
	private buy_button: eui.Button;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LadderInspireSkin;
	}
	protected onInit(): void {
		this.setTitle('天梯鼓舞');
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
		let buff_PriceAry: string[] = Constant.get(Constant.LADDER_BUFF_PRICE).split(',');
		let max_inspire: number = buff_PriceAry.length;
		let inspirecount: number = ladderData.inspireCount;
		let attack_add_str: string = GameCommon.getInstance().readStringToHtml(`[#5aff91${FightDefine.ladderBuffEffect[inspirecount]}%]`);
		this.add_desc_lab.textFlow = (new egret.HtmlTextParser).parse(Language.instance.parseInsertText('ladder_insprite', attack_add_str));
		this.times_lab.text = Language.instance.getText('current', 'yiguwu') + ":" + ladderData.inspireCount + "/" + max_inspire;
		if (inspirecount < max_inspire) {
			this.buy_button.label = Language.instance.getText('inspire', ' ', buff_PriceAry[inspirecount], 'currency5');
			this.buy_button.enabled = true;
		} else {
			this.buy_button.label = Language.instance.getText('error_tips_7');
			this.buy_button.enabled = false;
		}
	}
	protected onRegist(): void {
		super.onRegist();
		// this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.buy_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.buy_button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
	}
	private onInspire(): void {
		let inspiremsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_INSPIRE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(inspiremsg);
		this.onTouchCloseBtn();
	}
	//The end
}