// class ActivityshongbaoPanel extends BaseTabView {
// 	private types: number[] = [];
// 	private lockGroup: eui.Group;
// 	private itemBox: eui.Group;
// 	private itemBox2: eui.Group;
// 	private itemBox3: eui.Group;
// 	private buyBtn: eui.Button;
// 	private tabs: eui.Group[];
// 	private xinxiLab: eui.Label;
// 	private timeLab: eui.Label;
// 	public value: number = 1;
// 	private datemodel: NewactivitysTehuiModel[];
// 	// private xiangoumodel: NewactivitysxiangouModel[];
// 	private chongjimedel: NewactivityschongjiModel[];
// 	private timeh: number;
// 	private timem: number;
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
// 	private label_money: eui.Label;
// 	private chongzhibox: eui.Group;
// 	private leijilab: eui.Label;
// 	private leijiBtn: eui.Button;
// 	private img1: eui.Image;
// 	private img2: eui.Image;
// 	private imgzi: eui.Image;
// 	private timerday: number;
// 	private dachenglab: eui.Label;
// 	private renwulan: eui.Group;
// 	public constructor(owner) {
// 		super(owner);
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.HongbaoPanelSkin;
// 	}
// 	protected onInit(): void {
// 		super.onInit();

// 		super.onInit();
// 		this.onRefresh();
// 	}
// 	protected onRefresh(): void {
// 		this.hongbaodate = DataManager.getInstance().newactivitysManager.hongbaodate;
// 		for (var i = 0; i < 7; i++) {
// 			this["yuanbaoLab" + i].text = "0";
// 			this[`redPackage${i}`].visible = this.hongbaodate["atday"] < (i + 1);
// 		}
// 		if (this.hongbaodate["arr"]) {
// 			var num: number = this.hongbaodate["arr"].length;
// 			for (var n = 0; n < num; n++) {
// 				this["yuanbaoLab" + n].text = "" + this.hongbaodate["arr"][n]["yuanbao"];
// 			}
// 		}

// 		this.dangqianLab.text = "当前天数：" + this.hongbaodate["atday"] + "天";
// 		this.jvliLab.text = "距离领取还有：" + String(8 - this.hongbaodate["atday"]) + "天"
// 		this.label_money.text = String(this.hongbaodate["dangqian"]);

// 	}
// 	protected onRegist(): void {
// 		super.onRegist();
// 		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.HONGBAO_BUY_MESSAGE.toString(), this.lingqvover, this);
// 		this.examineCD(true);
// 	}
// 	protected onRemove(): void {
// 		super.onRemove();
// 		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.HONGBAO_BUY_MESSAGE.toString(), this.lingqvover, this);
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
// 		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.HONGBAOFANLI);
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
// 	private lingqvover() {
// 		this.onRefresh();
// 	}
// }