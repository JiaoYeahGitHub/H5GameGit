class WXFirstSharePanel extends BaseWindowPanel implements ISDKShareContainer {
	private btn_share: eui.Button;
	private closeBtn1: eui.Group;
	private reward_grp: eui.Group;
	private desc_style1: eui.Image;
	private desc_style2: eui.Image;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}

	protected onInit(): void {
		let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.WXGAME_FIRSTAWD));
		for (let i: number = 0; i < rewards.length; i++) {
			let goods_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(rewards[i]);
			this.reward_grp.addChild(goods_instance);
		}
		this.btn_share.label = !FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE) ? "领取奖励" : "展示游戏";
		this.desc_style1.visible = FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE);
		this.desc_style2.visible = !FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE);

		super.onInit();
		this.onRefresh();
	}

	protected onSkinName(): void {
		this.skinName = skins.WXFirstSharePanelSkin;
	}

	protected onRefresh(): void {
	}

	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.touchEnabled = true;
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchShareBtn, this);
	}

	protected onRemove(): void {
		super.onRemove();

		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_share.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchShareBtn, this);
	}
	private onTouchShareBtn(): void {
		if (!FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE)) {
			this.shareComplete();
		} else {
			SDKManager.share(this, WX_SHARE_TYPE.FIRST_SHARE);
		}
		this.onTouchCloseBtn();
	}
    /**
     * 分享信息提示
     */
	public showShareInfo(info: ISDKShareInfo): void {
	}
    /**
     * 更新分享信息
     */
	public updateShareInfo(info: ISDKShareInfo): void {
	}

	public shareComplete(): void {
		let reward_Msg: Message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
		reward_Msg.setBoolean(true);
		reward_Msg.setShort(GameDefine.FANGKUAI_FIRST_SHARE_LV);
		GameCommon.getInstance().sendMsgToServer(reward_Msg);
	}
}
