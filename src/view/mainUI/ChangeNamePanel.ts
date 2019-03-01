class ChangeNamePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private btn_send:eui.Button;
    private label_input:eui.TextInput;
    private btn_cancel:eui.Button;
    private consume:CurrencyBar;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
    protected onSkinName(): void {
		this.skinName = skins.ChangeNameSkin;
	}
	protected onInit(): void {
		this.onRefresh();
	}
    private isUpdate:boolean = false;
    protected onRefresh(): void {
        this.setTitle('角色名更改');
        var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.RENAME_COST));
        if (awards) {
                this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(awards[0].type, awards[0].id, awards[0].num));
        }
        
	}
    protected onRegist(): void {
		super.onRegist();
		this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE.toString(), this.onComplete, this); 
	}
	protected onRemove(): void {
		super.onRemove();
        this.btn_send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        this.btn_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE.toString(), this.onComplete, this); 
	}
    private onComplete():void{
    GameCommon.getInstance().addAlert('修改成功');
    super.onHide();
    }
    private onTouchBtnSend() {
        var sendStr: string = this.label_input.text;
        this.label_input.text = "";
        if (sendStr.length>6) {
                GameCommon.getInstance().addAlert("名称不能大于6个字");
                this.label_input.text = "";
                return;
        }
        
        var message: Message = new Message(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE);
		message.setString(sendStr);
		GameCommon.getInstance().sendMsgToServer(message);
    }
	//The end
}