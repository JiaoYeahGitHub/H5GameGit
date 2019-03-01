/**
 * 
 */
class FocusPanel extends BaseWindowPanel{

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private label1:eui.Label;
	private label2:eui.Label;
	private receiveBtn:eui.Button;

	private goods1:GoodsInstance;
    private goods2:GoodsInstance;

	public constructor(owner: ModuleLayer) {
        super(owner);
    }

	protected onInit(): void {
        super.onInit();
		this.setTitle("guanzhu_title_png");
        this.goods1.onUpdate(5,0,0,4,100);
        this.goods2.onUpdate(3,34,0,4,1);
        this.onRefresh();
    }

	protected onSkinName(): void {
        this.skinName = skins.focusSkin;
    }

    protected onRegist(): void {
		super.onRegist();
		this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FOCUS_REWARD_MESSAGE.toString(), this.onHide, this);
    }

    protected onRemove(): void {
		super.onRemove();
		this.receiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FOCUS_REWARD_MESSAGE.toString(), this.onHide, this);
	}

	private onReceiveClick(event:egret.TouchEvent):void{
		var isSupportSearchFocus=false;
		//这个立即检测关注不太通用，就不放在sdkmanager里了
		if(SDKManager.loginInfo.channel==EChannel.CHANNEL_SOEZ){
			isSupportSearchFocus=SDKEZJS.isFocus(this.nineGFocus);
		}
		if(SDKManager.loginInfo.channel==EChannel.CHANNEL_QUNHEI){
			isSupportSearchFocus=true;
			SDKQHJS.isFocus(this.nineGFocus);
		}
		//如果存在及时查询就不用原来的逻辑
		if(isSupportSearchFocus){
			this.onHide;
			return;
		}
		if(!SDKManager.loginInfo.focus){
			SDKManager.subscribe();
		}else{
		}
	}

	private nineGFocus(data){
		var isFocus=data;
		if(data){
			//已关注就发奖
			var info=SDKEZ.getInstance().info;
			var url = ChannelDefine.createURL(
			info,
            "focus",
            {
                "uid": info.account,
                "server_id": info.serverId,
                "player_id": info.playerId,
                "subChannel":info.subChannel
            });
        	HttpUtil.sendGetRequest(url, null, this);
			// this.receiveBtn.label='已关注';
			// this.receiveBtn.enabled=false;
			// this.onHide;
			var rebornNotice = [{ text: `您已关注，请查看邮件奖励`, style: { textColor: 0xe63232 } }];
        	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(rebornNotice, function () {

            }, this))
        );
		}else{
			//不然就继续关注
			if(!SDKManager.loginInfo.focus){
				SDKManager.subscribe();
			}
		}
	}

	private focusCallback(){
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
		this.onHide;
	}
}