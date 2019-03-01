// class ActivityschongzhishengyanPanel extends BaseWindowPanel {
// 	private box: eui.Group;
// 	private closeBtn1: eui.Button;
// 	private closeBtn2: eui.Button;
// 	private timeLab: eui.Label;
// 	private lingqvBtn: eui.Button;
// 	private goods: GoodsInstance;
// 	private timedate: number;
// 	private timerday: number;
// 	private huodongLab: eui.Label;
// 	private yichongLab: eui.Label;
// 	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
// 	public constructor(owner) {
// 		super(owner);
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.ActivitysChongzhishengyan;
// 	}
// 	protected onInit(): void {
// 		super.onInit();
// 		this.showdate();

// 	}
// 	protected onRefresh() {
// 		this.showdate();
// 	}
// 	private showdate() {
// 		if (this.box.numChildren > 0) {
// 			this.box.removeChildren();
// 		}
// 		var date = DataManager.getInstance().newactivitysManager.chongzhishengyandate;
// 		var sever = DataManager.getInstance().newactivitysManager.chongzhi;
// 		var arr = [];
// 		arr.push({ text: "活动期间累计充值", style: { "textColor": 0xffffff } });
// 		arr.push({ text: "88888钻石", style: { "textColor": 0xEF6A07 } });
// 		arr.push({ text: "可领取", style: { "textColor": 0xffffff } });
// 		this.huodongLab.textFlow = arr;//""+this.datemodel[0].des;
// 		this.yichongLab.text = "已充值" + sever["yuanbao"] + "钻石";
// 		var itemarr: AwardItem[] = date[88888][0].reward;
// 		for (var i = 0; i < itemarr.length; i++) {
// 			this.goods = new GoodsInstance();
// 			this.goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num);
// 			this.goods.item_frame.source = "welfare_frame_png";
// 			this.box.addChild(this.goods);
// 			switch (i) {
// 				case 0:
// 					this.goods.addAnimation("biankuangdonghua2");
// 					break;
// 				case 1:
// 				case 2:
// 					this.goods.addAnimation("biankuangdonghua3");
// 					break;
// 			}
// 		}
// 		this.timeLab.text = 0 + "天" + "" + 0 + "时" + 0 + "分" + 0 + "";
// 		this.lingqvBtn.enabled = sever["boo"];
// 		//for()
// 	}
// 	protected onRegist(): void {
// 		super.onRegist();
// 		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
// 		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
// 		this.lingqvBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyfunction, this);
// 		this.examineCD(true);
// 	}
// 	protected onRemove(): void {
// 		super.onRemove();
// 		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
// 		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
// 		this.lingqvBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyfunction, this);
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
// 		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.CHONGZHISHENGYAN);
// 		if (time > 0) {
// 		} else {
// 			time = 0;
// 			this.examineCD(false);
// 		}
// 		this.onShowCD(time);
// 	}
// 	public onShowCD(time: number) {
// 		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
// 	}
// 	private buyfunction() {
// 		var message = new Message(MESSAGE_ID.PLAYER_CHONGZHI_LINGQV_MESSAGE);
// 		GameCommon.getInstance().sendMsgToServer(message);
// 	}
// }