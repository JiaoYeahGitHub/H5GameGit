class ActivityCDKPanel extends BaseTabView{
	private label_input:eui.TextInput;
    private btn_send: eui.Button;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityJihuomaSkin;
	}
    protected oninit(){
        // this.label_hint.text = SDKManager.getCDKeyDesc();
    }
	protected onRegist(): void {
		super.onRegist();//添加事件
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
        this.btn_send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
	}
	private onTouchBtnSend() {
        var url = SDKManager.loginInfo.url + "/cdkey/invoke?account=" + SDKManager.loginInfo.account 
        + "&server=" + SDKManager.loginInfo.serverId 
        + "&channelType=" + SDKManager.loginInfo.channel 
        + "&subChannel=" + SDKManager.loginInfo.subChannel 
        + "&platform=" + SDKManager.loginInfo.platform 
        + "&playerId=" + SDKManager.loginInfo.playerId
        + "&cdKey=" + this.label_input.text 
        + ".do";
        HttpUtil.sendGetRequest(url, this.onCDkeyComplete, this);
    }

    private onCDkeyComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        // egret.log("SDKCrazy.onShareComplete() result=" + result.ret);
        switch (parseInt(result)) {
            case 0:
                // this.onHide();
                GameCommon.getInstance().addAlert("兑换成功，奖励以通过邮件下发");
                break;
            case -2:/** 错误码: 未知用户 **/
                GameCommon.getInstance().addAlert("未知用户");
                break;
            case -3:/** 错误码: 未知服务器 **/
                GameCommon.getInstance().addAlert("未知服务器");
                break;
            case -4:/** 错误码: 未知兑换码 **/
                GameCommon.getInstance().addAlert("兑换码错误");
                break;
            case -5:/** 错误码: 渠道不符 **/
                GameCommon.getInstance().addAlert("渠道不符");
                break;
            case -6:/** 错误码: 过期 **/
                GameCommon.getInstance().addAlert("过期");
                break;
            case -7:/** 错误码: 操作失败 **/
                GameCommon.getInstance().addAlert("操作失败");
                break;
            case -8:/** 错误码: 操作失败 **/
                GameCommon.getInstance().addAlert("兑换码已使用");
                break;
            case -9:/** 错误码: 操作失败 **/
                GameCommon.getInstance().addAlert("已使用同类激活码");
                break;
            case -10:/** 错误码: 操作失败 **/
                GameCommon.getInstance().addAlert("已领取过该礼包");
                break;
            case -11:/** 错误码: 操作失败 **/
                GameCommon.getInstance().addAlert("无法在本服使用");
                break;

        }
        this.label_input.text = "";
    }
}