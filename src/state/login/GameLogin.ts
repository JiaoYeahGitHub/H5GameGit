/**
 * 
 *  @author 
 */
class GameLogin extends eui.Component {
	private gameWorld: GameWorld;
	private txInput: eui.TextInput;
	private startBtn: eui.Button;

	public constructor(world: GameWorld) {
		super();
		this.gameWorld = world;
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoveToStage, this);
	}

	private onAddToStage(event: egret.Event): void {
		this.gameWorld.addEventListener(MESSAGE_ID.GAME_LOGON_MESSAGE.toString(), this.receiveMessage, this);
		this.gameWorld.addEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveServerMessage, this);
		this.gameWorld.addEventListener(GameEvent.NET_EVENT_ERROR, this.onNetError, this);

		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}
		this.height = size.height;

		if (SDKManager.sdkLogin) {
			var account = SDKManager.loginInfo.account;
			if (account) {
				var bg: eui.Image = new eui.Image();
				bg.source = "login_bg_jpg";
				if (!DataManager.IS_PC_Game) {
					bg.width = size.width;
				}
				bg.height = size.height + 100;
				this.addChild(bg);

				this.sendLogin();
			} else {
				this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
				this.skinName = skins.GameLoginViewSkin;
			}
		} else {
			if (platform.isLocalTest() || !SDKManager.isSDKLogin) {
				this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
				this.skinName = skins.GameLoginViewSkin;
			} else {
				var bg: eui.Image = new eui.Image();
				bg.source = "login_bg_jpg";
				if (!DataManager.IS_PC_Game) {
					bg.width = size.width;
				}
				this.addChild(bg);
			}
		}
	}

	private onComplete(): void {
		this.txInput.text = GameSetting.getLocalSetting(GameSetting.LOGIN_ACCOUNTS);
		this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
	}

	private btnClick(event: egret.TouchEvent): void {
		var info = SDKManager.loginInfo;
		info.account = this.txInput.text;
		this.sendLogin();
		GameSetting.setLocalSave(GameSetting.LOGIN_ACCOUNTS, this.txInput.text);
	}

	private sendLogin(): void {
		this.gameWorld.sendLogin();
	}

	private onRemoveToStage(event: egret.Event): void {
		this.gameWorld.removeEventListener(MESSAGE_ID.GAME_LOGON_MESSAGE.toString(), this.receiveMessage, this);
		this.gameWorld.removeEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveServerMessage, this);
		this.gameWorld.removeEventListener(GameEvent.NET_EVENT_ERROR, this.onNetError, this);
		if (this.startBtn) {
			this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
		}
	}

	private onNetError(event: egret.Event): void {
		// if (confirm('网络异常，请检查网络重试')) {
		// 	location.reload();
		// }
	}

	private receiveMessage(event: GameMessageEvent): void {
		var message: Message = event.message;
		DataManager.getInstance().serverManager.parseServerList(message);
		this.gameWorld.loginServer();
		Tool.log("登录成功");
	}

	private receiveServerMessage(event: GameMessageEvent): void {
		var message: Message = event.message;
		var host: string = message.getString();
		var port: number = message.getShort();
		var serverId: number = message.getShort();
		this.gameWorld.setUrl(host, port);

		var info = SDKManager.loginInfo;
		info.serverId = serverId;
		this.gameWorld.sendLoginServerMsg();
	}
}