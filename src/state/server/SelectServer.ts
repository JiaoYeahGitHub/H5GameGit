/**
 *
 * @author 
 *
 */
class SelectServer extends eui.Component {
	private gameWorld: GameWorld;

	private stateImg: eui.Image;
	private serverNameLabel: eui.Label;
	private startBtn: eui.Button;
	private group1: eui.Group;
	private group2: eui.Group;
	private closeBtn: eui.Button;
	private loginedBtn: eui.Button;
	private serverScroller: eui.Scroller;
	private itemScroller: eui.Scroller;
	private serverList: eui.List;
	private serverGroup: eui.Group;
	private versionLabel: eui.Label;
	private btn_notice: eui.Button;
	private notice_close_btn: eui.Button;
	private noticeLayer: eui.Group;
	private loginLayer: eui.Group;
	private company_lab: eui.Label;
	private label_content: eui.Label;

	private animLayer: eui.Group;
	private animPos: egret.Point = new egret.Point(0, 0);

	private server: Server;

	public constructor(world: GameWorld) {
		super();
		this.gameWorld = world;
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.skinName = skins.ServerSelectSkin;
	}

	private onAddToStage(event: egret.Event): void {
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}
		this.height = size.height;
	}

	/**发行商号描述**/
	private appinfoDesc(): string {
		let thannel = SDKManager.loginInfo.channel;

		let companystr: string = '';//公司
		let warnstr: string = '抵制不良游戏 拒绝盗版游戏 注意自我保护 谨防上当受骗\n适度游戏益脑 沉迷游戏伤身 合理安排时间 享受健康生活';
		let copyrightstr: string = '';//版号
		switch (thannel) {
			case EChannel.CHANNEL_WANBA:
				companystr = '本应用由 “联众游戏” 提供';
				break;
			default:
				companystr = '本应用由 “北京呈天网络科技股份有限公司” 提供';
				break;
		}
		copyrightstr = '文网游备字[2018]M-RPG1133号\n版号：ISBN 978-7-89989-734-8 审批文号：新出审字[2013]936号\n著作权人：北京呈天网络科技股份有限公司，北京灵动力启点网络科技有限公司\n出版单位：北京呈天网络科技股份有限公司\n该游戏适合16岁以上用户';
		return companystr + '\n' + warnstr + '\n' + copyrightstr;
	}

	private onComplete() {
		this.company_lab.text = this.appinfoDesc();

		this.versionLabel.text = DataManager.version;
		let anim: Animation = GameCommon.getInstance().addAnimation("kaishianniu", this.animPos, this.startBtn["animLayer"], -1);
		this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
		this.group1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClick, this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
		this.loginedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginedList, this);
		this.btn_notice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnNotice, this);
		this.notice_close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseNotice, this);

		let listSize = parseInt(((DataManager.getInstance().serverManager.serverArray.length / 100) + 1).toString());
		if (DataManager.getInstance().serverManager.serverArray.length % 100 == 0) {
			listSize = parseInt((DataManager.getInstance().serverManager.serverArray.length / 100).toString());
		}
		for (let i = 0; i < listSize; ++i) {
			let serverBtn: eui.Button = new eui.Button();
			// serverBtn.skinName = GameSkin.getServerButtonSkin1();
			serverBtn.skinName = skins.ServerBtnSkin;
			let servername = (i * 100 + 1) + "-" + ((i + 1) * 100) + "服";
			serverBtn.label = servername;
			serverBtn.name = i.toString();
			serverBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServerList, this);
			this.serverGroup.addChild(serverBtn);
		}

		let array;
		if (DataManager.getInstance().serverManager.serverLoginedArray.length > 0) {
			this.server = DataManager.getInstance().serverManager.serverLoginedArray[0];
			array = DataManager.getInstance().serverManager.serverLoginedArray;
			this.loginedBtn.currentState = "down";
		} else {
			this.server = DataManager.getInstance().serverManager.serverArray[DataManager.getInstance().serverManager.serverArray.length - 1];
			array = this.getServerList(listSize - 1);
			(this.serverGroup.getChildAt(listSize - 1) as eui.Button).currentState = "down";
		}
		this.setServer(this.server);
		this.closeClick(null);

		this.itemScroller.viewport = this.serverList;
		this.serverList.itemRenderer = ServerItemRenderer;
		this.serverList.addEventListener(ServerItemRenderer.ITME_CLICK, this.onItemClick, this);
		this.serverList.dataProvider = new eui.ArrayCollection(array);
	}
	/**-----------公告相关内容-----------**/
	//开启公告
	private noticeloaded: boolean;
	private onTouchBtnNotice(event: egret.Event): void {
		if (!this.noticeloaded) {
			this.noticeloaded = true;
			this.onLoadingNotice();
		}
		this.noticeLayer.visible = true;
		this.loginLayer.visible = false;
	}
	//关闭公告
	private onCloseNotice(): void {
		this.noticeLayer.visible = false;
		this.loginLayer.visible = true;
	}
	//加载公告
	private onLoadingNotice() {
		//创建 URLLoader 对象
		var loader: egret.URLLoader = new egret.URLLoader();
		loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
		//添加加载完成侦听
		loader.addEventListener(egret.Event.COMPLETE, this.onLoadNoticeComplete, this);
		//添加加载失败侦听
		loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
		var loginInfo = SDKManager.loginInfo;
		var url: string = "";
		var noticeVersion: number = Math.random();
		if (loginInfo.channel == EChannel.CHANNEL_WXGAMEBOX) {
			url = ChannelDefine.cdnUrl + "resource/assets/notice/fangkuaiwan.txt?v=" + noticeVersion;
		}
		// if (loginInfo.channel == EChannel.CHANNEL_CRAZY) {
		// 	url = "resource/assets/notice/fengkuangyoulechang.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_AWY) {
		// 	url = "resource/assets/notice/aiweiyou.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_YYBQUICK) {
		// 	url = "resource/assets/notice/yingyongbao.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_LOCAL) {
		// 	url = "resource/assets/notice/localnotice.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_WANBA) {
		// 	url = "resource/assets/notice/wanba.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_EGRET) {
		// 	url = "resource/assets/notice/bailu.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_QUICK) {
		// 	url = "resource/assets/notice/hunfu.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_QUNHEI) {
		// 	url = "resource/assets/notice/hunfu.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_SOEZ) {
		// 	url = "resource/assets/notice/hunfu.txt?v=" + noticeVersion;
		// } else if (loginInfo.channel == EChannel.CHANNEL_360) {
		// 	url = "resource/assets/notice/360.txt?v=" + noticeVersion;
		// }
		if (url != "") {
			this.setGameNotice("<font color='#FFFF00' size='26'>公告正在加载中...</font>");
			var request: egret.URLRequest = new egret.URLRequest(url);
			//开始加载
			loader.load(request);
		} else {
			this.onLoadError();
		}
	}
	//公告加载成功
	private onLoadNoticeComplete(event: egret.Event): void {
		var loader: egret.URLLoader = <egret.URLLoader>event.target;
		var noticeTips: string = <string>loader.data;
		this.setGameNotice(noticeTips);
	}
	//公告加载失败
	private onLoadError(): void {
		this.setGameNotice("公告内容暂无！");
	}
	//设置公告文字内容
	private setGameNotice(str: string): void {
		this.label_content.textFlow = new egret.HtmlTextParser().parser(GameCommon.getInstance().readStringToHtml(str));
	}

	private onLoginedList(event: egret.Event): void {
		this.serverList.dataProvider = new eui.ArrayCollection(DataManager.getInstance().serverManager.serverLoginedArray);
		this.resetServerBtn();
		this.loginedBtn.currentState = "down";
	}

	private onServerList(event: egret.Event): void {
		var btn: eui.Button = event.currentTarget;
		var array: Array<Server> = this.getServerList(Number(btn.name));
		this.serverList.dataProvider = new eui.ArrayCollection(array);

		this.resetServerBtn();
		this.loginedBtn.currentState = "up";
		btn.currentState = "down";
	}

	private resetServerBtn(): void {
		for (var i = 0; i < this.serverGroup.numChildren; ++i) {
			(this.serverGroup.getChildAt(i) as eui.Button).currentState = "up";
		}
	}

	private getServerList(index: number): Array<Server> {
		var array: Array<Server> = new Array();
		var start: number = index * 100;
		for (var i = start; i < start + 100; ++i) {
			if (DataManager.getInstance().serverManager.serverArray.length > i) {
				array.push(DataManager.getInstance().serverManager.serverArray[i]);
			}
		}
		array.reverse();
		return array;
	}

	private onItemClick(event: egret.Event) {
		var server: Server = event.data;
		this.setServer(server);
		this.closeClick(null);
	}

	private setServer(server: Server): void {
		this.server = server;
		this.serverNameLabel.text = server.name;
		if (server.state == SERVER_STATE.NEW) {
			this.stateImg.source = "login_xinqu_png";
		} else if (server.state == SERVER_STATE.HOT) {
			this.stateImg.source = "login_huobao_png";
		} else {
			this.stateImg.source = "login_weihu_png";
		}
	}

	private btnClick(event: egret.TouchEvent): void {
		this.sendLogin(this.server.id);
	}

	private selectClick(event: egret.TouchEvent): void {
		// this.group1.visible = false;
		this.group2.visible = true;
	}

	private closeClick(event: egret.TouchEvent): void {
		// this.group1.visible = true;
		this.group2.visible = false;
	}

	private sendLogin(serverId: number): void {
		this.startBtn.touchEnabled = false;
		this.gameWorld.addEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveMessage, this);
		this.gameWorld.addEventListener(GameEvent.NET_EVENT_ERROR, this.onNetError, this);
		this.gameWorld.sendSelectServer(serverId);
	}

	private receiveMessage(event: GameMessageEvent): void {
		this.onRemoveToStage();
		var message: Message = event.message;
		var host: string = message.getString();
		var port: number = message.getShort();
		var state: number = message.getByte();
		var userStatus: number = message.getByte();
		if (userStatus != 1) {
			this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_6);
			return;
		}
		if (state == 2) {
			this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_5);
		} else {
			this.gameWorld.setUrl(host, port);
			this.sendLoginGame();
			Tool.log("登录游戏成功");
		}
	}

	private sendLoginGame(): void {
		this.gameWorld.sendLoginServerMsg();
	}

	private onRemoveToStage(): void {
		this.gameWorld.removeEventListener(GameEvent.NET_EVENT_ERROR, this.onNetError, this);
		this.gameWorld.removeEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveMessage, this);
	}

	private onNetError(event: egret.Event): void {
		// this.gameWorld.setUrl(SDKManager.loginInfo.url);
		this.startBtn.touchEnabled = true;
	}
}

class ServerItemRenderer extends eui.ItemRenderer {
	private serverNameLabel: eui.Label;
	private stateImg: eui.Image;

	public static ITME_CLICK: string = "item_click";
	public constructor() {
		super();
		this.touchEnabled = true;
		this.touchChildren = true;
		var itemSkin = skins.ServerItemSkin;
		this.skinName = itemSkin;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	protected dataChanged(): void {
		if (this.data) {
			this.serverNameLabel.text = this.data.name;
			if (this.data.state == SERVER_STATE.NEW) {
				this.stateImg.source = "login_xinqu_png";
			} else if (this.data.state == SERVER_STATE.HOT) {
				this.stateImg.source = "login_huobao_png";
			} else {
				this.stateImg.source = "login_weihu_png";
			}
		}
	}

	private onClick(event: egret.Event): void {
		this.dispatchEvent(new egret.Event(ServerItemRenderer.ITME_CLICK, true, true, this.data));
	}
}