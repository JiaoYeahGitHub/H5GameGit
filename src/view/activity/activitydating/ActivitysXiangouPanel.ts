class ActivitysXiangouPanel extends BaseTabView {

	private itemBox: eui.Group;
	private timeLab: eui.Label;
	private money: CurrencyBar;
	private gold: CurrencyBar;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XiangouPanelSkin;
	}
	protected onInit(): void {
		super.onInit();

		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		if (this.itemBox.numChildren > 0) {
			this.itemBox.removeChildren();
		}
		var item: ActivityitemFace;
		var allItem = [];
		var xiangoumodel = JsonModelManager.instance.getModelxiangoulibao();
		for (var key in xiangoumodel) {
			var model: Modelxiangoulibao = xiangoumodel[key];
			if (model.round == DataManager.getInstance().newactivitysManager.activitysday) {//天数
				item = new ActivityitemFace(model);
				allItem.push(item);
			}

		}

		allItem.sort(function (a, b): number {
			return a.sort - b.sort;
		});

		for (var i = 0; i < allItem.length; i++) {
			this.itemBox.addChild(allItem[i]);
		}

		this.onUpdateCurrency();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(false);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.XIANGOULIBAO);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
			// this.owner.onTimeOut();
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private onUpdateCurrency() {
		this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.GOLD, 0, -1));
		this.gold.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.DIAMOND, 0, -1));
	}
	private onxiangouBuyover() {
		this.onRefresh();
	}
}
class ActivityitemFace extends eui.Component {
	private buyBtn: eui.Button;
	private itembox: eui.Group;
	private nameLab: eui.Label;
	private consume: CurrencyBar;
	private itemarrdate = [];
	private _data: Modelxiangoulibao;
	private isOver: boolean = false;
	private point: redPoint = new redPoint();
	private zhekou: eui.Image;
	public constructor(info: Modelxiangoulibao) {
		super();
		this._data = info;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.SpecialgiftbagPanel;
	}

	private onLoadComplete(): void {
		this.update(this._data);
	}
	private update(info: Modelxiangoulibao) {
		this._data = info;
		var itemarr = [];
		var moneynum = [];
		this.zhekou.source = 'save' + info.zhekou + '_png';
		itemarr = this._data.rewards;
		moneynum = GameCommon.getInstance().onParseAwardItemstr(this._data.price);
		this.itemarrdate = itemarr;
		var obj = {};
		obj = DataManager.getInstance().newactivitysManager.xiangoudate;
		var index: number = 0;
		if (obj[this._data.id]) {
			index = obj[this._data.id][1];
			if (index >= this._data.max) {
				this.buyBtn.enabled = false;
				this.buyBtn.label = "已购买";
				this.isOver = true;
			} else {
				this.buyBtn.enabled = true;
			}
		} else {
			if (DataManager.getInstance().playerManager.player.viplevel >= this._data.vip) {
					this.buyBtn.enabled = true;
			} else {
				this.buyBtn.enabled = false;
			}
		}

		for (var i = 0; i < itemarr.length; i++) {
			var goods: GoodsInstance = new GoodsInstance();
			goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num, itemarr[i].lv);
			goods.scaleX = 0.7;
			goods.scaleY = 0.7;
			this.itembox.addChild(goods);
		}
		this.nameLab.text = this._data.name + "(" + index + "/" + this._data.max + ")";
		this.consume.data = new CurrencyParam("", new ThingBase(moneynum[0].type, 0, moneynum[0].num));
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.point.register(this.buyBtn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, "checkRedPoint");
	}
	private onTouchBtn() {
		var message: Message = new Message(MESSAGE_ID.XIANGOULIBAO_BUY_MESSAGE);
		message.setShort(this._data.id);
		message.setShort(1);//short   购买个数
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public get sort(): number {
		var sortNum: number = Tool.toInt(this._data.vip);
		if (this.isOver) {
			sortNum += 100;
		}
		return sortNum;
	}

	public checkRedPoint(): boolean {
		if (this.buyBtn.enabled) {
			var moneynum = GameCommon.getInstance().onParseAwardItemstr(this._data.price);
			return DataManager.getInstance().playerManager.player.getICurrency(moneynum[0].type) >= moneynum[0].num;
		}
		return false;
	}
}