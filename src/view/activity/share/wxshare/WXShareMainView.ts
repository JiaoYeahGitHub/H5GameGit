class WXShareMainView extends BaseWindowPanel implements ISDKShareContainer {
	private scroller: eui.Scroller;
	private item_grp: eui.Group;
	private special_des_lab: eui.Label;
	private btn_share: eui.Button;
	// private closeBtn1: eui.Button;
	private probar_invite: eui.ProgressBar;
	private baochi_grp: eui.Group;
	private zhuhun_exp_lab: eui.Label;
	private exp_scroll: eui.Scroller;
	private expanim_grp: eui.Group;
	private lbMyMoney: eui.Label;
	private progressBar: eui.ProgressBar;

	private currTabIdx: number = 0;//当前页签
	private START_POSX: number = 40;
	private END_POSX: number = 210;

	protected points: redPoint[] = RedPointManager.createPoint(4);
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WXShareMainViewSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("晋升豪礼");
		let redP = new egret.Point(145, -5);
		this.points[0].register(this['tabbtn0'], redP, DataManager.getInstance().wxgameManager, "getWxShareAwdRpoint");
		// this.points[1].register(this['tabbtn1'], redP, DataManager.getInstance().wxgameManager, "getWxLevelShareRpoint");
		this.points[1].register(this['tabbtn1'], redP, DataManager.getInstance().wxgameManager, "getWxFriendShareRpoint");
		this.points[2].register(this['tabbtn2'], redP, DataManager.getInstance().wxgameManager, "getWxOffLineShareRpoint");
		this.points[3].register(this['tabbtn3'], redP, DataManager.getInstance().wxgameManager, "wxShareAllRedPoint");
		(this['tabbtn0'] as eui.RadioButton).selected = true;
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onChangeTabHanler();
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i: number = 0; i < WX_SHARE_TABTYPE.SIZE; i++) {
			(this['tabbtn' + i] as eui.RadioButton).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
		// this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateShopChange, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SHARE_INFO_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WXGAME_INVITE_FRIEND_MSG.toString(), this.onYaoqinghaoyou, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE.toString(), this.onReciveOffLineAwdMsg, this);
		DataManager.getInstance().wxgameManager.onRequestOffLineExpAwdMsg();
	}
	protected onRemove(): void {
		super.onRemove();
		for (let i: number = 0; i < WX_SHARE_TABTYPE.SIZE; i++) {
			(this['tabbtn' + i] as eui.RadioButton).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
		}
		this.btn_share.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
		// this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateShopChange, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SHARE_INFO_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WXGAME_INVITE_FRIEND_MSG.toString(), this.onYaoqinghaoyou, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE.toString(), this.onReciveOffLineAwdMsg, this);

		this.examineCD(false);
	}
	//点击Tab按钮
	private onTouchTabBtn(event: egret.Event): void {
		let tabbtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		let index: number = parseInt(tabbtn.value);
		if (index != this.currTabIdx) {
			this.currTabIdx = index;
			this.onChangeTabHanler();
		}
	}
	//切换页签的逻辑相关
	private onChangeTabHanler(): void {
		this.item_grp.removeChildren();
		this.btn_share.enabled = true;
		this.scroller.stopAnimation();
		this.scroller.viewport.scrollV = 0;
		this.scroller.viewport.scrollH = 0;
		this.examineCD(false);

		switch (this.currTabIdx) {
			case WX_SHARE_TABTYPE.TAB1_SHARECOUNT:
				this.onLeijifenxiang();
				break;
			// case WX_SHARE_TABTYPE.TAB2_SHARELV:
			// 	this.onJinshenghaoli();
			// 	break;
			case WX_SHARE_TABTYPE.TAB3_INVITEFIREND:
				DataManager.getInstance().wxgameManager.onRequestInviteAwdMsg();
				break;
			case WX_SHARE_TABTYPE.TAB4_LIXIANJINGYAN:
				this.onLixianjingyan();
				break;
			// case WX_SHARE_TABTYPE.TAB5_LEIJIZHANSHI:
			// 	this.onLeijifenxiang2();
			// 	break;
			// case WX_SHARE_TABTYPE.TAB6_SHOP:
			// 	this.onShopUI();
			// 	break;
		}
	}
	// private updateShopChange(){
	// 	if(this.currTabIdx == WX_SHARE_TABTYPE.TAB6_SHOP){
	// 		this.onChangeTabHanler();
	// 	}
	// }

	//切换到标签1：今日累计分享
	private _wxAwardItems: WXShareAwardItem[];
	private onLeijifenxiang(): void {
		this.currentState = 'leijifenxiang';
		this.item_grp.removeChildren();
		if (!this._wxAwardItems) {
			this._wxAwardItems = [];
			let models = JsonModelManager.instance.getModelfenxiang();
			for (let id in models) {
				let model: Modelfenxiang = models[id];
				let item: WXShareAwardItem = new WXShareAwardItem(model);
				this._wxAwardItems.push(item);
			}
		}

		for (let i: number = 0; i < this._wxAwardItems.length; i++) {
			let item: WXShareAwardItem = this._wxAwardItems[i];
			this.item_grp.addChild(item);
			// item.y = i * 122;
			item.onUpdate();
		}

		this.btn_share.enabled = Math.ceil((DataManager.getInstance().functionManager.cd - egret.getTimer()) / 1000) <= 0;
		this.examineCD(true);
	}
	// private _wxShopItems: WXShareShopItem[];
	// private onShopUI(): void {
	// 	this.currentState = 'shop';

	// 	this.item_grp.removeChildren();
	// 	if (!this._wxShopItems) {
	// 		this._wxShopItems = [];
	// 		let type = 5;
	// 		let models = JsonModelManager.instance.getModelshop();
	// 		for (let id in models) {
	// 			let model: Modelshop = models[id];
	// 			if(model.shopType == type){
	// 				let item: WXShareShopItem = new WXShareShopItem(model);
	// 				this._wxShopItems.push(item);
	// 			}
	// 		}
	// 	}
	// 	for (let i: number = 0; i < this._wxShopItems.length; i++) {
	// 		let item: WXShareShopItem = this._wxShopItems[i];
	// 		this.item_grp.addChild(item);
	// 		item.onUpdate();
	// 	}
		
	// 	this.lbMyMoney.text = "当前拥有助力币：" + DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.ZHULIBI);
	// }
	// //切换到标签4：累计展示分享
	// private _wxAwardItems2: WXShareAwardItem2[];
	// private onLeijifenxiang2(): void {
	// 	this.currentState = 'leijizhanshi';

	// 	this.item_grp.removeChildren();
	// 	if (!this._wxAwardItems2) {
	// 		this._wxAwardItems2 = [];
	// 		let models = JsonModelManager.instance.getModelleijifenxiang();
	// 		for (let id in models) {
	// 			let model: Modelleijifenxiang = models[id];
	// 			let item: WXShareAwardItem2 = new WXShareAwardItem2(model);
	// 			this._wxAwardItems2.push(item);
	// 		}
	// 	}

	// 	for (let i: number = 0; i < this._wxAwardItems2.length; i++) {
	// 		let item: WXShareAwardItem2 = this._wxAwardItems2[i];
	// 		this.item_grp.addChild(item);
	// 		item.onUpdate();
	// 	}
	// 	this.progressBar.maximum = 3;
	// 	this.progressBar.value = Math.min(DataManager.getInstance().functionManager.shareNum, 3);

	// 	this.btn_share.enabled = Math.ceil((DataManager.getInstance().functionManager.cd - egret.getTimer()) / 1000) <= 0;
	// 	this.examineCD(true);
	// }
	//切换到标签2：晋升好礼
	// private _wxlevelawdItems: WXLevelShareAwardItem[];
	// private onJinshenghaoli(): void {
	// 	this.currentState = 'jishenhaoli';

	// 	if (!this._wxlevelawdItems) {
	// 		this._wxlevelawdItems = [];
	// 		let models = JsonModelManager.instance.getModellvyaoqing();
	// 		for (let lv in models) {
	// 			let model: Modellvyaoqing = models[lv];
	// 			let item: WXLevelShareAwardItem = new WXLevelShareAwardItem(model, this._wxlevelawdItems.length);
	// 			this._wxlevelawdItems.push(item);
	// 		}
	// 	}
	// 	let shareCount: number = 0;
	// 	for (let i: number = 0; i < this._wxlevelawdItems.length; i++) {
	// 		let item: WXLevelShareAwardItem = this._wxlevelawdItems[i];
	// 		this.item_grp.addChild(item);
	// 		item.onUpdate();
	// 		if (item.model.lv == DataManager.getInstance().wxgameManager.shareAwdLv) {
	// 			shareCount = i + 1;
	// 		}
	// 	}
	// 	this.special_des_lab.text = `当前成功分享${shareCount}次，分享成功后奖励将已邮件形式发送`;
	// }
	//切换到标签3：邀请好友
	private _wxinviteItems: WXFriendInviteAwardItem[];
	private onYaoqinghaoyou(): void {
		if (this.currTabIdx != WX_SHARE_TABTYPE.TAB3_INVITEFIREND) return;

		this.currentState = 'yaoqinghaoyou';

		let manager: WXGameManager = DataManager.getInstance().wxgameManager;

		if (!this._wxinviteItems) {
			let maxfirendsNum: number = 0;
			this._wxinviteItems = [];
			let yaoqing_params: string[] = Constant.get(Constant.WXGAME_INVITE_FIREND).split('#');
			// let yaoqing_params2: string[] = Constant.get(Constant.WXGAME_INVITE_FIREND2).split('#');
			for (let i: number = 0; i < yaoqing_params.length; i++) {
				let param: string[] = yaoqing_params[i].split(',');
				// let param2: string[] = yaoqing_params2[i].split(',');
				// let item: WXFriendInviteAwardItem = new WXFriendInviteAwardItem(parseInt(param[0]), parseInt(param[1]), parseInt(param2[1]));
				let item: WXFriendInviteAwardItem = new WXFriendInviteAwardItem(parseInt(param[0]), parseInt(param[1]), 0);
				this._wxinviteItems.push(item);
				let firendNum: number = parseInt(param[0]);
				if (maxfirendsNum < firendNum) {
					maxfirendsNum = firendNum;
				}
			}
			this.probar_invite.maximum = maxfirendsNum;
		}
		for (let i: number = 0; i < this._wxinviteItems.length; i++) {
			let item: WXFriendInviteAwardItem = this._wxinviteItems[i];
			this.item_grp.addChild(item);
			item.onUpdate();
		}

		this.probar_invite.value = manager.inviteReachNum;//判断领奖的进度
		// this.special_des_lab.text = `已邀请好友数：${manager.inviteCount}`;
		this.btn_share.enabled = manager.inviteawdNum <= manager.inviteReachNum
			|| manager.inviteawdZhulibiNum <= manager.inviteReachNum;
	}
	//切换到标签4：离线经验
	private expAnim: Animation;
	private onLixianjingyan(): void {
		this.currentState = 'baochi';

		if (!this.expAnim) {
			this.expAnim = new Animation('zhuling_bowen', -1, false);
			this.expAnim.x = 131;
			this.expAnim.y = 275 - this.exp_scroll.height;
			this.baochi_grp.addChildAt(this.expAnim, 2);

			let exp_back_anim = new Animation('zhuling_qiu', -1, false);
			exp_back_anim.x = 145;
			exp_back_anim.y = 180;
			this.expanim_grp.addChildAt(exp_back_anim, 0);
		}
		this.onReciveOffLineAwdMsg();
	}
	private onReciveOffLineAwdMsg(): void {
		if (this.currTabIdx != WX_SHARE_TABTYPE.TAB4_LIXIANJINGYAN) return;
		let data: OffLineExpShareAwd = DataManager.getInstance().playerManager.offlineAwdData;
		this.zhuhun_exp_lab.text = `${data.exp}/${data.offexpMix}`;
		let scroll_height: number = this.END_POSX;
		scroll_height = this.START_POSX + Math.round((this.END_POSX - this.START_POSX) * (data.exp / data.offexpMix));
		this.expAnim.y = 275 - scroll_height;
		this.special_des_lab.text = '';
	}

	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = Math.ceil((DataManager.getInstance().functionManager.cd - egret.getTimer()) / 1000);
		if (time > 0) {
			this.special_des_lab.text = `${Tool.getTimeStr(time)}后可再次展示`;
		} else {
			time = 0;
			this.examineCD(false);
			this.btn_share.enabled = true;
			this.special_des_lab.text = '';
		}
	}
	/**点击分享按钮**/
	private onShare(): void {
		switch (this.currTabIdx) {
			case WX_SHARE_TABTYPE.TAB1_SHARECOUNT:
			// case WX_SHARE_TABTYPE.TAB5_LEIJIZHANSHI:
				SDKManager.share(this, WX_SHARE_TYPE.EVERYDAY_SHARE);
				break;
			case WX_SHARE_TABTYPE.TAB3_INVITEFIREND:
				let rewardMsg: Message = new Message(MESSAGE_ID.WXGAME_INVITE_FRIEND_MSG);
				rewardMsg.setBoolean(true);
				GameCommon.getInstance().sendMsgToServer(rewardMsg);
				break;
			// case WX_SHARE_TABTYPE.TAB2_SHARELV:
			case WX_SHARE_TABTYPE.TAB4_LIXIANJINGYAN:
				SDKManager.share(this, WX_SHARE_TYPE.OFFLINE_EXP);
				break;
		}
	}
	/**
     * 分享信息提示
     */
	public showShareInfo: (info: ISDKShareInfo) => void;
    /**
     * 分享信息更新
     */
	public updateShareInfo: (info: ISDKShareInfo) => void;

	public shareComplete(): void {
		switch (this.currTabIdx) {
			case WX_SHARE_TABTYPE.TAB1_SHARECOUNT:
				var message: Message = new Message(MESSAGE_ID.SHARE_COMPLETE_MESSAGE);
				GameCommon.getInstance().sendMsgToServer(message);
				break;
			// case WX_SHARE_TABTYPE.TAB2_SHARELV:
			// 	let model: Modellvyaoqing = DataManager.getInstance().wxgameManager.getfenxiangModel();
			// 	if (!model) return;
			// 	if (DataManager.getInstance().playerManager.player.level >= model.lv) {
			// 		var message: Message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
			// 		message.setBoolean(true);
			// 		message.setShort(model.lv);
			// 		GameCommon.getInstance().sendMsgToServer(message);
			// 	} else {
			// 		GameCommon.getInstance().addAlert(`等级达到${model.lv}级分享才可获得奖励哦！`);
			// 	}
			// 	break;
			case WX_SHARE_TABTYPE.TAB3_INVITEFIREND:
				break;
			case WX_SHARE_TABTYPE.TAB4_LIXIANJINGYAN:
				if (DataManager.getInstance().playerManager.offlineAwdData.exp > 0) {
					let offlineExpMsg: Message = new Message(MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE);
					offlineExpMsg.setBoolean(true);
					GameCommon.getInstance().sendMsgToServer(offlineExpMsg);
				}
				break;
		}
	}
	private getPlayerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}
}
// //累计分享2ITEM
// class WXShareShopItem extends eui.Component {
// 	private items_grp: eui.Group;
// 	private currency: ConsumeBar;
// 	private reward_btn: eui.Button;
// 	private scroller: eui.Scroller;

// 	public model: Modelshop;

// 	public constructor(model: Modelshop) {
// 		super();
// 		this.model = model;
// 		this.once(egret.Event.COMPLETE, this.onInit, this);
// 		this.skinName = skins.WXShareShopItem;
// 	}

// 	private onInit(): void {
// 		let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(GameCommon.parseAwardItem(this.model.item));
// 		this.items_grp.addChild(g_instance);
// 		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
// 	}

// 	public onUpdate(): void {
// 		let rew: AwardItem = GameCommon.parseAwardItem(this.model.price);
// 		this.currency.setConsume(rew.type, rew.id, rew.num);
// 	}

// 	private onReward(): void {
// 		var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
// 		message.setByte(this.model.shopType);
// 		message.setInt(this.model.id);
// 		message.setInt(1);
// 		GameCommon.getInstance().sendMsgToServer(message);
// 	}
// 	//The end
// }
// //累计分享2ITEM
// class WXShareAwardItem2 extends eui.Component {
// 	private items_grp: eui.Group;
// 	private desc_lab: eui.Label;
// 	private reward_btn: eui.Button;
// 	private scroller: eui.Scroller;

// 	public model: Modelleijifenxiang;

// 	public constructor(model: Modelleijifenxiang) {
// 		super();
// 		this.model = model;
// 		this.once(egret.Event.COMPLETE, this.onInit, this);
// 		this.skinName = skins.WXShareAwardItem;
// 	}

// 	private onInit(): void {
// 		for (let i: number = 0; i < this.model.rewards.length; i++) {
// 			let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.model.rewards[i]);
// 			this.items_grp.addChild(g_instance);
// 		}
// 		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
// 	}

// 	public onUpdate(): void {
// 		let manager: FunctionManager = DataManager.getInstance().functionManager;
// 		this.desc_lab.text = `累积展示${this.model.times}次(${Math.min(this.model.times, manager.shareAllNum)}/${this.model.times})`;
// 		if (manager.receives2.indexOf(this.model.id) >= 0) {
// 			this.reward_btn.enabled = false;
// 			this.reward_btn.label = '已领取';
// 		} else {
// 			if (this.model.times > manager.shareAllNum) {
// 				this.reward_btn.enabled = false;
// 				this.reward_btn.label = '未达成';
// 			} else {
// 				this.reward_btn.enabled = true;
// 				this.reward_btn.label = '领取';
// 			}
// 		}
// 	}

// 	private onReward(): void {
// 		let rewardMsg: Message = new Message(MESSAGE_ID.SHARE_REWARD2_MESSAGE);
// 		rewardMsg.setByte(this.model.id);
// 		GameCommon.getInstance().sendMsgToServer(rewardMsg);
// 	}
// 	//The end
// }
//累计分享ITEM
class WXShareAwardItem extends eui.Component {
	private items_grp: eui.Group;
	private invite_count_lab: eui.Label;
	private reward_btn: eui.Button;
	private scroller: eui.Scroller;

	public model: Modelfenxiang;

	public constructor(model: Modelfenxiang) {
		super();
		this.model = model;
		this.once(egret.Event.COMPLETE, this.onInit, this);
		this.skinName = skins.WXShareAwardItem;
	}

	private onInit(): void {
		for (let i: number = 0; i < this.model.rewards.length; i++) {
			let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.model.rewards[i]);
			this.items_grp.addChild(g_instance);
		}
		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
	}

	public onUpdate(): void {
		let manager: FunctionManager = DataManager.getInstance().functionManager;
		this.invite_count_lab.text = `今日展示${this.model.times}次(${Math.min(this.model.times, manager.shareNum)}/${this.model.times})`;
		if (manager.receives.indexOf(this.model.id) >= 0) {
			this.reward_btn.enabled = false;
			this.reward_btn.label = '已领取';
		} else {
			if (this.model.times > manager.shareNum) {
				this.reward_btn.enabled = false;
				this.reward_btn.label = '未达成';
			} else {
				this.reward_btn.enabled = true;
				this.reward_btn.label = '领取';
			}
		}
	}

	private onReward(): void {
		let rewardMsg: Message = new Message(MESSAGE_ID.SHARE_REWARD_MESSAGE);
		rewardMsg.setByte(this.model.id);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}
	//The end
}

// //晋升好礼ITEM
// class WXLevelShareAwardItem extends eui.Component {
// 	private desc_lab: eui.Label;
// 	private progress_lab: eui.Label;
// 	private scroller: eui.Scroller;
// 	private items_grp: eui.Group;

// 	public model: Modellvyaoqing;
// 	public index: number;

// 	public constructor(model: Modellvyaoqing, index: number) {
// 		super();
// 		this.model = model;
// 		this.index = index;
// 		this.once(egret.Event.COMPLETE, this.onInit, this);
// 		this.skinName = skins.WXShareLevelAwardItem;
// 	}

// 	private onInit(): void {
// 		this.desc_lab.text = `达到${this.model.lv}级且分享${(this.index + 1)}次`;
// 		for (let i: number = 0; i < this.model.rewards.length; i++) {
// 			let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.model.rewards[i]);
// 			this.items_grp.addChild(g_instance);
// 		}
// 	}

// 	public onUpdate(): void {
// 		let manager: WXGameManager = DataManager.getInstance().wxgameManager;
// 		let level: number = DataManager.getInstance().playerManager.player.level;
// 		if (this.model.lv > level) {
// 			this.progress_lab.textColor = 0xfff000;
// 			this.progress_lab.text = `(${level}/${this.model.lv})`;
// 		} else {
// 			if (manager.shareAwdLv >= this.model.lv) {
// 				this.progress_lab.textColor = 0xfff000;
// 				this.progress_lab.text = `(已领取)`;
// 			} else {
// 				this.progress_lab.textColor = 0x5aff91;
// 				this.progress_lab.text = `(${this.model.lv}/${this.model.lv})分享领取`;
// 			}
// 		}
// 	}
// 	//The end
// }

//邀请好友ITEM
class WXFriendInviteAwardItem extends eui.Component {
	private invite_count_lab: eui.Label;
	// private award_item: GoodsInstance;
	private scroller: eui.Scroller;
	private items_grp: eui.Group;
	private reward_btn: eui.Button;

	private inviteCount: number;
	private diamond: number;
	private zhulibi: number;
	// private inviteReward: string[];
	private goods: GoodsInstance[];
	public constructor(inviteCount: number, diamond: number, zhulibi: number) {
		super();
		this.inviteCount = inviteCount;
		this.diamond = diamond;
		this.zhulibi = zhulibi;
		this.once(egret.Event.COMPLETE, this.onInit, this);
		this.skinName = skins.WXShareAwardItem;
	}

	private onInit(): void {
		this.invite_count_lab.text = `${this.inviteCount}名好友`;
		this.goods = [];
		let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(new AwardItem(GOODS_TYPE.DIAMOND, 0, this.diamond));
		this.items_grp.addChild(g_instance);
		// let g_instance1: GoodsInstance = GameCommon.getInstance().createGoodsIntance(new AwardItem(GOODS_TYPE.ZHULIBI, 0, this.zhulibi));
		// this.items_grp.addChild(g_instance1);
		this.goods = [g_instance];
		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
	}

	public onUpdate(): void {
		let manager: WXGameManager = DataManager.getInstance().wxgameManager;
		let rewardCount: number = this.inviteCount;
		if (rewardCount <= manager.inviteawdNum && rewardCount <= manager.inviteawdZhulibiNum) {
			this.reward_btn.enabled = false;
			this.reward_btn.label = '已领取';
		} else {
			this.reward_btn.enabled = true;
			this.reward_btn.label = `去展示`;
		}
		// if(rewardCount <= manager.inviteawdNum){
		// 	Tool.setDisplayGray(this.goods[0]);
		// }
		// if(rewardCount <= manager.inviteawdZhulibiNum){
		// 	Tool.setDisplayGray(this.goods[1]);
		// }
	}

	private onReward(): void {
		SDKManager.share(null, WX_SHARE_TYPE.INVITE_FRIEND);
	}
	//The end
}

//邀请页签类型
enum WX_SHARE_TABTYPE {
	TAB1_SHARECOUNT = 0,
	// TAB2_SHARELV = 1,
	TAB3_INVITEFIREND = 1,
	TAB4_LIXIANJINGYAN = 2,
	// TAB5_LEIJIZHANSHI = 3,
	// TAB6_SHOP = 4,
	SIZE = 3,
}