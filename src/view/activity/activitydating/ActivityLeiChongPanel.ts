class ActivityLeiChongPanel extends BaseTabView {
	private box: eui.Group;
	private timeLab: eui.Label;
	private goods: GoodsInstance;
	private itemGroup: eui.List;
	private index: number;
	private toDayMoney: eui.Label;
	private leichongDesc: eui.Image;
	private btnGroup: eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityLeiChongSkin;
	}
	private btnNameStr: string[] = ['10元', '100元', '300元'];
	protected onInit(): void {
		super.onInit();
		this.itemGroup.itemRenderer = ActivityLeiChongItem;
		this.itemGroup.itemRendererSkinName = skins.ActivityLeiChongItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.index = 1;
		this['tab1'].source = 'leiChong_buttonon_png';
		this.timeLab.text = 0 + "天" + "" + 0 + "时" + 0 + "分" + 0 + "";

		let button: eui.Button = new eui.Button();
		button.skinName = skins.ScrollerTabBtnSkin;
		for (var i = 0; i < 3; i++) {
			var btn: eui.RadioButton;
			btn = new BaseTabButton('', this.btnNameStr[i]);
			if (i == 0) {
				btn.selected = true;
			}
			btn.width = 103;
			btn.name = (i + 1) + '';
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
			this.btnGroup.addChild(btn);
		}

		this.onRefresh();
	}
	protected onRefresh() {
		this.onShowAward();
	}
	protected onRegist(): void {
		super.onRegist();
		// for (var i = 1; i < 4; i++) {
		// 	this['tabBtn' + i].name = i;
		// 	this['tabBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		// }

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		// GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		// GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
		this.examineCD(false);
	}
	private btns = [10, 100, 300]
	private onShowAward(): void {
		this.leichongDesc.source = 'leichongDesc' + this.index + '_png';
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
		this.showdate();
	}
	private onTab(event: egret.Event): void {
		var name: number = Number(event.target.name);
		if (this.index == name)
			return;
		for (var i = 1; i < 4; i++) {
			this['tab' + i].source = 'leiChong_buttonoff_png';
		}
		this.index = name;
		this['tab' + this.index].source = 'leiChong_buttonon_png';
		this.onShowAward();
	}
	//获取对应标签的数据结构
	private rewardArr: Array<OpenServerLeiChongItemData> = new Array<OpenServerLeiChongItemData>();
	private get models(): OpenServerLeiChongItemData[] {
		this.rewardArr = [];
		var kaifuArrs = JsonModelManager.instance.getModelkaifuleichong()
		for (let k in kaifuArrs) {
			if (kaifuArrs[k].gold == this.btns[this.index - 1]) {
				var awards: AwardItem[];
				for (var i = 1; i < 6; i++) {
					awards = GameCommon.getInstance().onParseAwardItemstr(kaifuArrs[k]['reward' + i])
					var leiChongItem: OpenServerLeiChongItemData = new OpenServerLeiChongItemData(awards, kaifuArrs[k].gold , i, DataManager.getInstance().openServerLeiChongManager.getAllMoney(kaifuArrs[k].gold));
					this.rewardArr.push(leiChongItem);
				}
			}
		}
		return this.rewardArr;
	}
	private showdate() {
		this.toDayMoney.text = '今日已累计充值:' + DataManager.getInstance().openServerLeiChongManager.todayMoney;
		var itemarr: AwardItem[] = this.rewardArr[this.rewardArr.length - 1].awardItem;
		while (this.box.numChildren > 0) {
			let display = this.box.getChildAt(0);
			this.box.removeChild(display);
		}
		for (var i = 0; i < 1; i++) {
			this.goods = new GoodsInstance();
			this.goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num);
			this.goods.item_frame.source = "welfare_frame_png";
			this.box.addChild(this.goods);
		}
		//for()
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.OPENSERVER_LEICHONG);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
}
class OpenServerLeiChongItemData {
	public awardItem: AwardItem[];
	public moneyNum: number;
	public day: number;
	public curMoey: number;
	public constructor(cfg: AwardItem[], num: number, day: number, curMoney: number) {
		this.awardItem = cfg;
		this.moneyNum = num;
		this.day = day;
		this.curMoey = curMoney;
	}
}
class ActivityLeiChongItem extends BaseListItem {
	private name_label: eui.Label;
	private awards: eui.Group;
	private btn_reward: eui.Button;
	constructor() {
		super();
	}
	protected onInit(): void {
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected onUpdate(): void {
		if (this.data) {
			if (this.data) {
				while (this.awards.numChildren > 0) {
					let display = this.awards.getChildAt(0);
					this.awards.removeChild(display);
				}
				// var arr = [];
				// arr.push({ text: , style: { "textColor": 0xffffff } });
				this.name_label.text = '累计' + (this.data.day) + '天充值' + (this.data.moneyNum) + '元,可获得';
				if (this.data.curMoey >= this.data.day) {
					this.btn_reward.label = '已达标';
					this.btn_reward.enabled = false;
					// this.name_label.text = +'可获得';
					// arr.push({ text: "(1/1)", style: { "textColor": 0x00ff00 } });
					// this.name_label.textFlow = arr;//""+this.datemodel[0].des;
				} else {
					this.btn_reward.label = '去充值';
					this.btn_reward.enabled = true;
					// this.name_label.text = this.data.title+'可获得(0/1)';
					// arr.push({ text: "(0/1)", style: { "textColor": 0xff0000 } });
					//""+this.datemodel[0].des;
				}
				var rewards: AwardItem[] = this.data.awardItem;
				for (var i: number = 0; i < rewards.length; i++) {
					var goodsItem: GoodsInstance = new GoodsInstance();
					var awardItem: AwardItem = rewards[i];                                                  
					goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
					// goodsItem.currentState = 'notName';
					goodsItem.scaleX = 0.8;
					goodsItem.scaleY = 0.8;
					this.awards.addChild(goodsItem);
				}
			}
		}
	}
	private onTouch(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
}