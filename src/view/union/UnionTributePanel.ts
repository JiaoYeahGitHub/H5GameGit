class UnionTributePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private tribute_group: eui.Group;
	private gold_num_label: eui.Label;
	private bandgold_num_label: eui.Label;
	private close_btn: eui.Button;

	private tributeItems: UnionTributeItem[];

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionTributeSkin;
	}
	protected onInit(): void {
		// this.setTitle("tribute_title_png");
		this.setTitle("仙盟上香");
		this.tributeItems = [];
		for (let i in JsonModelManager.instance.getModelguildShangxiang()) {
			var trbuteModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[i];
			var tributeItem: UnionTributeItem = new UnionTributeItem(trbuteModel);
			tributeItem.tribute_btn.name = i + "";
			this.tribute_group.addChild(tributeItem);
			this.tributeItems.push(tributeItem);
		}
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		for (var i: number = 0; i < this.tributeItems.length; i++) {
			var tributeItem: UnionTributeItem = this.tributeItems[i];
			tributeItem.onUpdateNums();
		}
		this.updateMoney();
	}
	private updateMoney(): void {
		var player: Player = DataManager.getInstance().playerManager.player;
		this.gold_num_label.text = GameCommon.getInstance().getFormatNumberShow(player.gold);
		this.bandgold_num_label.text = GameCommon.getInstance().getFormatNumberShow(player.money);
	}
	protected onRegist(): void {
		super.onRegist();
		GameDispatcher.getInstance().addEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateMoney, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateMoney, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onRefresh, this);
	}
	public trigger(): void {
		super.trigger();
		for (var i: number = 0; i < this.tributeItems.length; i++) {
			var tributeItem: UnionTributeItem = this.tributeItems[i];
			tributeItem.onUpdateNums();
			tributeItem.points[0].checkPoint();
		}
	}
	//The end
}
class UnionTributeItem extends eui.Component {
	private tributeModel: ModelguildShangxiang;
	private tribute_icon: eui.Image;
	private tribute_text: eui.Image;
	private tribute_desc: eui.Label;
	private tribute_cost: CurrencyBar;
	public tribute_btn: eui.Button;
	// private label_num: eui.Label;
	private remain: number;
	private useTime: number;
	private max: number;
	public points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(tributeModel: ModelguildShangxiang) {
		super();
		this.tributeModel = tributeModel
		this.once(egret.Event.COMPLETE, this.onComplete, this);
		this.skinName = skins.TributeItemSkin;
	}
	private onComplete(): void {
		this.tribute_icon.source = `tribute_icon${this.tributeModel.id}_png`;
		this.tribute_text.source = `tribute_text${this.tributeModel.id}_png`;
		// var consumeMoney: ModelThing = GameCommon.getInstance().getThingModel(this.tributeModel.cost.type, this.tributeModel.cost.id);
		// var consumedesc: string = `<font color='#${GameCommon.Quality_Color_String[consumeMoney.quality > 0 ? consumeMoney.quality - 1 : 0]}'>` + this.tributeModel.cost.num + consumeMoney.name + "</font>";
		// var lefttimes: number = this.tributeModel.times;
		this.tribute_desc.textFlow = (new egret.HtmlTextParser).parser(`可获得\r盟贡 ${this.tributeModel.banggong}\r仙盟经验 ${this.tributeModel.guildExp}`);
		// this.tribute_cost.textFlow = (new egret.HtmlTextParser).parser(`消耗\r${consumedesc}`);
		this.tribute_cost.nameColor = 0xf3f3f3;
		this.tribute_cost.data = new CurrencyParam("消耗", new ThingBase(this.tributeModel.cost.type, 0, this.tributeModel.cost.num));
		// this.onUpdateNums();

		this.tribute_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TributeHandler, this);
		this.points[0].register(this.tribute_btn, new egret.Point(150, -10), this, "checkRedPoint");
	}
	public onUpdateNums(): void {
		// this.tribute_btn.label = "上香";
		if (this.tributeModel.id == 1) {
			this.max = 10;
			this.useTime = DataManager.getInstance().unionManager.unionInfo.tributeNum;
			this.remain = this.max - this.useTime;
		} else {
			var vipLv: number = DataManager.getInstance().playerManager.player.viplevel;
			this.max = 0;
			var modelVip: Modelvip = JsonModelManager.instance.getModelvip()[vipLv - 1];
			if (modelVip) {
				var param: string[];
				var arr = modelVip.weals.split("#");
				for (var i: number = 0; i < arr.length; i++) {
					param = arr[i].split(",");
					if (parseInt(param[0]) == 6) {
						this.max = parseInt(param[1]);
						break;
					}
				}
			}
			this.useTime = DataManager.getInstance().unionManager.unionInfo.tributeVipNum;
			this.remain = this.max - this.useTime;
		}
		this.tribute_btn.label = "上香(" + `${this.useTime + this.tributeNum}/${this.max}` + ")";
		// this.label_num.text = `${this.useTime}/${this.max}`;
		if (this.remain != 0) {
			this.tribute_btn.enabled = true;
		} else {
			this.tribute_btn.enabled = false;
		}
	}
	//上香操作
	private TributeHandler(event: egret.Event): void {
		var index: number = parseInt(event.currentTarget.name);
		if (index > 1) {
			if (this.remain <= 0) {
				GameCommon.getInstance().addAlert("您当前已达上限，提高VIP等级可扩展次数");
				return;
			}
			var tributeModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[index];
			var consumeMoney: ModelThing = GameCommon.getInstance().getThingModel(tributeModel.cost.type, tributeModel.cost.id);
			var consumedesc: string = tributeModel.cost.num + consumeMoney.name;
			var tributeNotice = [{ text: `是否消耗${consumedesc}进行一次仙盟上香？`, style: { textColor: 0xe63232 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(tributeNotice, function (index: number) {
					this.onTribute(index);
				}, this, index))
			);
		} else {
			if (this.tributeNum > 0) {
				if (this.max - (this.useTime + this.tributeNum) <= 0) {
					this.tribute_btn.enabled = false;
					this.onSendTribute();
					return;
				}
			}
			if (this.remain <= 0) {
				GameCommon.getInstance().addAlert("您今日上香已达上限");
				return;
			}
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(4);
			if (_has < this.tributeModel.cost.num * (this.tributeNum + 1)) {
				GameCommon.getInstance().addAlert('货币不足');
				return;
			}

			this.onSendTributeCount();
			// this.onTribute(index);
		}
	}
	private onSendTribute(): void {
		if (this.max - (this.useTime + this.tributeNum) < 0 || this.tributeNum == 0) {
			return;
		}
		this.isUpTribute = false;
		var tributeModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[1];
		var tributeMsg: Message = new Message(MESSAGE_ID.UNION_TRIBUTE_MESSAGE);
		tributeMsg.setByte(tributeModel.id);
		tributeMsg.setByte(this.tributeNum);
		GameCommon.getInstance().sendMsgToServer(tributeMsg);
		this.tributeNum = 0;
	}
	private isUpTribute = false;
	private tributeNum: number = 0;
	private onSendTributeCount(): void {
		GameCommon.getInstance().addAlert("上香成功");
		if (!this.isUpTribute) {
			this.isUpTribute = true;
			Tool.callbackTime(this.onSendTribute, this, 2000);
		}
		this.tributeNum = this.tributeNum + 1;
		this.remain = this.max - (this.useTime + this.tributeNum);
		this.tribute_btn.label = "上香(" + `${this.useTime + this.tributeNum}/${this.max}` + ")";
	}
	public onHide(): void {
		if (this.tributeNum > 0) {
			this.onSendTribute();
		}
	}
	private onTribute(index: number): void {
		var tributeModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[index];
		switch (index) {
			case 2:
				if (!GameCommon.getInstance().onCheckItemConsume(tributeModel.cost.id, tributeModel.cost.num, tributeModel.cost.type)) return;
				break;
		}
		var tributeMsg: Message = new Message(MESSAGE_ID.UNION_TRIBUTE_MESSAGE);
		tributeMsg.setByte(tributeModel.id);
		tributeMsg.setByte(1);
		GameCommon.getInstance().sendMsgToServer(tributeMsg);
	}
	private checkRedPoint(): boolean {
		if (this.tributeModel.id == 1 && DataManager.getInstance().unionManager.checkTributeRedPoint()) {
			return true;
		}
		return false;
	}
	//The end
}