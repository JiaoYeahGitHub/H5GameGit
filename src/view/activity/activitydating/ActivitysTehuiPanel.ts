// class ActivitysTehuiPanel extends BaseTabView {
// 	private types: number[] = [];
// 	private lockGroup: eui.Group;
// 	private itemBox: eui.Group;
// 	private buyBtn: eui.Button;
// 	private tabs: eui.Group[];
// 	private xinxiLab: eui.Label;
// 	private timeLab: eui.Label;
// 	public value: number = 1;
// 	private datemodel: NewactivitysTehuiModel[];
// 	// private xiangoumodel: NewactivitysxiangouModel[];
// 	private chongjimedel: NewactivityschongjiModel[];
// 	private lingqvBtn: eui.Button;
// 	private box1: eui.Group;
// 	private box2: eui.Group;
// 	private box3: eui.Group;
// 	private box4: eui.Group;
// 	private box5: eui.Group;
// 	private money1: CurrencyBar;
// 	private gold1: CurrencyBar;
// 	private nameLab1: eui.Label;
// 	private lvLab1: eui.Label;
// 	private nameLab2: eui.Label;
// 	private lvLab2: eui.Label;
// 	private nameLab3: eui.Label;
// 	private lvLab3: eui.Label;
// 	private lvLab4: eui.Label;
// 	private nameLab5: eui.Label;
// 	private lvLab5: eui.Label;
// 	private tiaojianLab: eui.Label;
// 	private mask0: eui.Image;
// 	private mask1: eui.Image;
// 	private mask2: eui.Image;
// 	private mask3: eui.Image;
// 	private kuang0: eui.Image;
// 	private kuang1: eui.Image;
// 	private kuang2: eui.Image;
// 	private kuang3: eui.Image;
// 	private jian0: eui.Image;
// 	private jian1: eui.Image;
// 	private jian2: eui.Image;
// 	private jian3: eui.Image;
// 	private tiaojianimg: eui.Image;
// 	private lingredBtn: eui.Button;
// 	private yuanbaoLab0: eui.Label;
// 	private yuanbaoLab1: eui.Label;
// 	private yuanbaoLab2: eui.Label;
// 	private yuanbaoLab3: eui.Label;
// 	private yuanbaoLab4: eui.Label;
// 	private yuanbaoLab5: eui.Label;
// 	private yuanbaoLab6: eui.Label;
// 	private hongbaodate;
// 	private leijidate;
// 	private dangqianLab: eui.Label;
// 	private jvliLab: eui.Label;
// 	private scroll: eui.Scroller;
// 	private label_money0: eui.Label;
// 	private chongzhibox: eui.Group;
// 	private leijilab: eui.Label;
// 	private leijiBtn: eui.Button;
// 	private img1: eui.Image;
// 	private img2: eui.Image;
// 	private imgzi: eui.Image;
// 	private dachenglab: eui.Label;
// 	private renwulan: eui.Group;
// 	private label_before: eui.Label;
// 	public constructor(owner) {
// 		super(owner);
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.TehuiPanelSkin;
// 	}
// 	protected onInit(): void {
// 		super.onInit();
// 		this.tabs = [];
// 		this.tabs.push(this["layer_tab0"]);
// 		this.tabs.push(this["layer_tab1"]);
// 		this.tabs.push(this["layer_tab2"]);
// 		this.tabs.push(this["layer_tab3"]);
// 		this.mask0.touchEnabled = false;
// 		this.mask1.touchEnabled = false;
// 		this.mask2.touchEnabled = false;
// 		this.mask3.touchEnabled = false;
// 		super.onInit();
// 		this.onRefresh();
// 	}
// 	protected onRefresh(): void {
// 		this.onUpdate();
// 		if (this.itemBox.numChildren > 0) {
// 			this.itemBox.removeChildren();
// 		}
// 		this.datemodel = [];
// 		this.datemodel = DataManager.getInstance().newactivitysManager.classify[this.value];//keyzhi  1，2，3，4
// 		var itemstr: string = this.datemodel[0].rewards;
// 		var itemarr = [];
// 		if (DataManager.getInstance().newactivitysManager.record[this.value] == this.value) {
// 			this.buyBtn.enabled = false;
// 		} else {
// 			this.buyBtn.enabled = true;
// 		}
// 		switch (this.value) {
// 			case 1:
// 				this.imgzi.source = "activity_tehui388_png";
// 				break;
// 			case 2:
// 				this.imgzi.source = "activity_tehui1888_png";
// 				break;
// 			case 3:
// 				this.imgzi.source = "activity_tehui3888_png";
// 				break;
// 			case 4:
// 				this.imgzi.source = "activity_tehui18888_png";
// 				break;

// 		}
// 		itemarr = GameCommon.getInstance().onParseAwardItemstr(itemstr);
// 		// var obj:NewactivitysTehuiModel=info[1];
// 		//var itemdate:

// 		for (var i = 0; i < itemarr.length; i++) {
// 			var goods: GoodsInstance = new GoodsInstance();
// 			goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num, itemarr[i].lv);
// 			var arr = [];
// 			arr.push({ text: goods.model.name + "", style: { "textColor": 0x0000ff } });
// 			goods.name_label.textFlow = arr;
// 			this.itemBox.addChild(goods);
// 		}
// 	}
// 	protected onRegist(): void {
// 		super.onRegist();
// 		for (var i: number = 0; i < this.tabs.length; i++) {
// 			this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.updatetype, this);
// 		}
// 		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyfunc, this);
// 		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onBuyover, this);
// 		this.examineCD(true);
// 	}
// 	protected onRemove(): void {
// 		super.onRemove();
// 		for (var i: number = 0; i < this.tabs.length; i++) {
// 			this.tabs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.updatetype, this);
// 		}
// 		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onBuyover, this);
// 		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyfunc, this);
// 		this.examineCD(false);
// 	}
// 	public examineCD(open: boolean) {
// 		if (open) {
// 			Tool.addTimer(this.onCountDown, this, 1000);
// 		} else {
// 			Tool.removeTimer(this.onCountDown, this, 1000);
// 		}
// 	}
// 	public onCountDown() {
// 		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TEHUILIBAO);
// 		if (time > 0) {
// 		} else {
// 			time = 0;
// 			this.examineCD(false);
// 			// this.owner.onTimeOut();
// 		}
// 		this.onShowCD(time);
// 	}
// 	public onShowCD(time: number) {
// 		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
// 	}
// 	private updatetype(e: egret.TouchEvent): void {
// 		var name: string = (<eui.Group>e.currentTarget).name;
// 		this.value = parseInt(name.charAt(name.length - 1));
// 		this.onRefresh();
// 	}
// 	private onUpdate(): void {
// 		this.mask0.visible = true;
// 		this.mask1.visible = true;
// 		this.mask2.visible = true;
// 		this.mask3.visible = true;
// 		this["mask" + (this.value - 1)].visible = false;

// 		this.kuang0.source = "";
// 		this.kuang1.source = "";
// 		this.kuang2.source = "";
// 		this.kuang3.source = "";
// 		this["kuang" + (this.value - 1)].source = "activity_tehuikuang_png";

// 		this.jian0.visible = false;
// 		this.jian1.visible = false;
// 		this.jian2.visible = false;
// 		this.jian3.visible = false;
// 		this["jian" + (this.value - 1)].visible = true;
// 		switch (this.value) {
// 			case 1:
// 				this.label_before.text = "原价：998钻石";
// 				break;
// 			case 2:
// 				this.label_before.text = "原价：4888钻石";
// 				break;
// 			case 3:
// 				this.label_before.text = "原价：9888钻石";
// 				break;
// 			case 4:
// 				this.label_before.text = "原价：48888钻石";
// 				break;
// 		}
// 	}

// 	private buyfunc(e: egret.TouchEvent): void {
// 		/**购买时发142消息
// 		上行：byte   购买的id
// 		int     哪个活动
// 		下行：byte   购买的id
// 		int     哪个活动 */
// 		//message.setByte(this.tab);


// 		var message: Message = new Message(MESSAGE_ID.REBATE_TO_BUY_MESSAGE);
// 		message.setByte(this.value);
// 		message.setInt(ACTIVITY_BRANCH_TYPE.TEHUILIBAO);
// 		GameCommon.getInstance().sendMsgToServer(message);

// 	}
// 	private onBuyover(ms: GameMessageEvent): void {
// 		var date: Message = ms.message;
// 		var id: number = DataManager.getInstance().newactivitysManager.itemid;
// 		//var activityType: number = date.getInt();
// 		if (DataManager.getInstance().newactivitysManager.record[id]) {
// 			DataManager.getInstance().newactivitysManager.record[id] = id;
// 		}
// 		if (DataManager.getInstance().newactivitysManager.record[this.value] == this.value) {
// 			this.buyBtn.enabled = false;
// 		}


// 	}
// }