class ActivitysLeijiPanel extends BaseTabView {
	private leijidate: Modelleijichongzhi[];

	private chongzhibox: eui.Group;
	private leijilab: eui.Label;
	private timeLab: eui.Label;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LeijichongzhiSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.leijidate = JsonModelManager.instance.getModelleijichongzhi();
		var leijisever = DataManager.getInstance().newactivitysManager.leiji;
		if (this.chongzhibox.numChildren > 0) {
			this.chongzhibox.removeChildren();
		}
		var activityitem: ActivitysChongzhiitem;
		var model: Modelleijichongzhi;
		for (var key in this.leijidate) {
			model = this.leijidate[key];
			if (model.round == leijisever["lunci"]) {
				activityitem = new ActivitysChongzhiitem(model);
				this.chongzhibox.addChild(activityitem);
			}
		}
		this.leijilab.text = "已累计充值" + leijisever["atyuanbao"] + "元";
	}
	protected onRegist(): void {
		super.onRegist();
		this.examineCD(true);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LEIJICHONGZHI);
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
}
class ActivitysChongzhiitem extends eui.Component {
	private label_money1: eui.Label;
	private goods: GoodsInstance;
	private itemarr: AwardItem[];
	private box: eui.Group;
	private model: Modelleijichongzhi;
	private diVisi: boolean;
	public di: eui.Image;
	public constructor(model: Modelleijichongzhi, diVisi: boolean = true) {
		super();
		this.model = model;
		this.diVisi = diVisi;
		this.once(egret.Event.COMPLETE, this.onInit, this);
		this.skinName = skins.ActivityschongzhiPanel;
	}
	private onInit(): void {
		this.di.visible = this.diVisi;
		this.label_money1.text = this.model.costNum + "";
		this.itemarr = this.model.rewards;

		for (var i = 0; i < this.itemarr.length; i++) {
			this.goods = new GoodsInstance();
			this.goods.onUpdate(this.itemarr[i].type, this.itemarr[i].id, 0, this.itemarr[i].quality, this.itemarr[i].num, this.itemarr[i].lv);
			this.box.addChild(this.goods);
		}
	}
	// public set date(model: Modelleijichongzhi) {
	// 	this.label_money1.text = model.costNum + "";
	// 	this.itemarr = model.rewards;

	// 	for (var i = 0; i < this.itemarr.length; i++) {
	// 		this.goods = new GoodsInstance();
	// 		this.goods.onUpdate(this.itemarr[i].type, this.itemarr[i].id, 0, this.itemarr[i].quality, this.itemarr[i].num, this.itemarr[i].lv);
	// 		this.box.addChild(this.goods);
	// 	}
	// }
}