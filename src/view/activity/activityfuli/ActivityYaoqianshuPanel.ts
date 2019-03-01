class ActivityYaoqianshuPanel extends BaseTabView {
	private yaoqianshusever: Yaoqianshuinit;
	private yaoqianshudate;
	private jindu: eui.Label;
	private qiuMask: eui.Scroller;
	private jiachengLab: eui.Label;
	private indexLab: eui.Label;
	private numLab: eui.Label;
	private btnLab: eui.Label;
	private yaoOneyao: eui.Button;
	private xiaohaoLab: eui.Label;
	private qianLab: eui.Label;
	private yuanbao: eui.Label;
	// private vipdate;
	private maxLab: eui.Label;
	private progress1: eui.ProgressBar;
	private choujiangbox: eui.Group;
	private maxnum: number = 5;
	private yuanbaoLab: eui.Label;
	private lingjiang: number;
	private animPos2: egret.Point = new egret.Point(344, 650)
	private animPos: egret.Point = new egret.Point(0, 0);
	private awards;
	private erjiarr = [[4, 0, 10000000], [4, 0, 10000000], [4, 0, 10000000]];
	private erjiPanel: eui.Group;
	private lingqvBtn: eui.Button;
	private closeerji1: eui.Button;
	private penzi: eui.Image;
	private itembox: eui.Group;
	private baoji: number;
	public best_anim_grp: eui.Group;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityyaoqianshuPanel;
	}
	protected onInit(): void {
		super.onInit();
		this.points[0].register(this.lingqvBtn, new egret.Point(155, -10), DataManager.getInstance().newactivitysManager, "checkRedPointForYao1000");
		if (SDKManager.isHidePay) {
			this.btnLab.visible = false;
		} else {
			GameCommon.getInstance().addUnderlineStr(this.btnLab);
		}

		this.awards = [];
		var awardStrAry: string[];
		var itemdropstr: string = Constant.get('GOLD_TREE_REWARD')
		if (itemdropstr.indexOf("#") >= 0) {
			awardStrAry = itemdropstr.split("#");
		}
		for (var i: number = 0; i < awardStrAry.length; i++) {
			var awardstrItem: string[] = awardStrAry[i].split(",");
			this.awards.push(awardstrItem)
		}
		this.onRefresh();
	}
	private getPlayerData() {
		return DataManager.getInstance().playerManager.player;
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.isAction = false;
		var playerData = this.getPlayerData();
		var model: Modelvip = JsonModelManager.instance.getModelvip()[playerData.viplevel - 1];
		if (model) {
			var awardStrAry: string[];
			var itemdropstr: string = model.weals;
			if (itemdropstr.indexOf("#") >= 0) {
				awardStrAry = itemdropstr.split("#");
			}
			for (var i: number = 0; i < awardStrAry.length; i++) {
				var awardstrItem: string[] = awardStrAry[i].split(",");
				if (awardstrItem[0] == '5') {
					this.maxnum = Number(awardstrItem[1]);
					break;
				}
			}
		}
		else {
			this.maxnum = Number(Constant.get('GOLD_TREE_NUM'));
		}
		this.showpanel();
	}
	private showpanel() {
		var viplv: number = DataManager.getInstance().playerManager.player.viplevel;
		this.yaoqianshusever = DataManager.getInstance().newactivitysManager.yaoqian1000;
		this.yaoqianshudate = DataManager.getInstance().newactivitysManager.yaoqianshuXmldate;
		this.baoji = DataManager.getInstance().newactivitysManager.yaoqianshuBoom;
		if (this.baoji == 1) {
			GameCommon.getInstance().addAnimation("baoji1", this.animPos2, this);
			this.baoji = 0;
		}
		if (this.yaoqianshusever.yaoqianshuindex < 55) {
			var qian: number = Number(this.yaoqianshudate[this.yaoqianshusever.yaoqianshuindex + 1][0].gold);
			this.numLab.text = qian + '';//做个抽满的效果

			this.xiaohaoLab.text = "" + Number(this.yaoqianshudate[this.yaoqianshusever.yaoqianshuindex + 1][0].cost.num);
		} else {
			var qian: number = Number(this.yaoqianshudate[this.yaoqianshusever.yaoqianshuindex][0].gold);
			this.numLab.text = qian + '';//做个抽满的效果
			this.xiaohaoLab.text = "" + Number(this.yaoqianshudate[this.yaoqianshusever.yaoqianshuindex][0].cost[0].num);
		}
		this.maxLab.text = "今日使用：" + this.yaoqianshusever.yaoqianshuindex + "/" + this.maxnum;
		this.jindudata();
		// this.qianLab.text = GameCommon.getInstance().getFormatNumberShow(DataManager.getInstance().playerManager.player.money);
		// this.yuanbaoLab.text = GameCommon.getInstance().getFormatNumberShow(DataManager.getInstance().playerManager.player.gold);
		// this.qiuMask.height = Math.ceil(78 * (this.yaoqianshusever.yaoqianshuindex % 5) / 5);
		this.trigger();
	}
	protected onRegist(): void {
		super.onRegist();//添加事件
		this.yaoOneyao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onyaoOneyao, this);
		this.btnLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onchongzhi, this);
		this.lingqvBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lingqv, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YAOQIANSHU_YAOQIAN.toString(), this.onyaoqianover, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YAOQIANSHU_LINGJIANG.toString(), this.lingjiangover, this);
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
		this.yaoOneyao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onyaoOneyao, this);
		this.btnLab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onchongzhi, this);
		this.lingqvBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.lingqv, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YAOQIANSHU_YAOQIAN.toString(), this.onyaoqianover, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.YAOQIANSHU_LINGJIANG.toString(), this.lingjiangover, this);
	}
	private lingjiangover() {
		this.showpanel();
	}
	private lingqv() {
		var message: Message = new Message(MESSAGE_ID.YAOQIANSHU_LINGJIANG);
		message.setByte(this.lingjiang);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private jinboxdate() {
		if (this.yaoqianshusever.yaoqianshuindex >= 50) {
			this.lingqvBtn.enabled = true;
		} else {
			this.lingqvBtn.enabled = false;
		}
		if (this.itembox.numChildren > 0) {
			this.itembox.removeChildren();
		}
		if (this.yaoqianshusever.lingjiangarr.indexOf(2) != -1) {
			this.lingqvBtn.enabled = false;
			this.lingqvBtn.label = "已领取";
		}
		else {
			this.lingqvBtn.enabled = true;
			this.lingqvBtn.label = "领取";
		}
		for (var i = 0; i < 3; i++) {
			var goods: GoodsInstance = new GoodsInstance;

			goods.onUpdate(Number(this.awards[2][1]), Number(this.awards[2][2]), 0, -1, Number(this.awards[2][3]) / 3);
			goods.scaleX = 0.9;
			goods.scaleY = 0.9;
			this.itembox.addChild(goods);
		}
		this.progress1.maximum = this.awards[2][0];
		this.progress1.value = this.yaoqianshusever.yaoqianshuindex;
		this.lingjiang = 2;

	}
	private yinboxdate() {
		if (this.yaoqianshusever.yaoqianshuindex >= 20) {
			this.lingqvBtn.enabled = true;
		} else {
			this.lingqvBtn.enabled = false;
		}
		if (this.itembox.numChildren > 0) {
			this.itembox.removeChildren();
		}
		if (this.yaoqianshusever.lingjiangarr.indexOf(1) != -1) {
			this.lingqvBtn.enabled = false;
			this.lingqvBtn.label = "已领取";
		} else {
			this.lingqvBtn.enabled = true;
			this.lingqvBtn.label = "领取";
		}
		for (var i = 0; i < 3; i++) {
			var goods: GoodsInstance = new GoodsInstance;
			goods.onUpdate(Number(this.awards[1][1]), Number(this.awards[1][2]), 0, -1, Number(this.awards[1][3]) / 3);
			goods.scaleX = 0.9;
			goods.scaleY = 0.9;
			this.itembox.addChild(goods);
		}
		this.progress1.maximum = this.awards[1][0];
		this.progress1.value = this.yaoqianshusever.yaoqianshuindex;
		this.lingjiang = 1;

	}
	private muboxdate() {
		if (this.yaoqianshusever.yaoqianshuindex >= 5) {
			this.lingqvBtn.enabled = true;
		} else {
			this.lingqvBtn.enabled = false;
		}
		if (this.itembox.numChildren > 0) {
			this.itembox.removeChildren();
		}
		if (this.yaoqianshusever.lingjiangarr.indexOf(0) != -1) {
			this.lingqvBtn.enabled = false;
			this.lingqvBtn.label = "已领取";
		}
		else {
			this.lingqvBtn.enabled = true;
			this.lingqvBtn.label = "领取";
		}
		for (var i = 0; i < 3; i++) {
			var goods: GoodsInstance = new GoodsInstance;
			goods.onUpdate(Number(this.awards[0][1]), Number(this.awards[0][2]), 0, -1, Number(this.awards[0][3]) / 3);
			goods.scaleX = 0.9;
			goods.scaleY = 0.9;
			this.itembox.addChild(goods);
		}
		this.progress1.maximum = this.awards[0][0];
		this.progress1.value = this.yaoqianshusever.yaoqianshuindex;
		this.lingjiang = 0;
	}

	private jindudata() {
		if (this.yaoqianshusever.lingjiangarr) {
			if (this.yaoqianshusever.lingjiangarr.indexOf(2) != -1) {
				this.jinboxdate();
			} else if (this.yaoqianshusever.lingjiangarr.indexOf(1) != -1) {
				this.jinboxdate();
			} else if (this.yaoqianshusever.lingjiangarr.indexOf(0) != -1) {
				this.yinboxdate();
			} else {
				this.muboxdate();
			}
		} else {
			this.muboxdate();
		}
	}

	private onyaoqianover() {
		this.actionInit();
		this.showpanel();
	}
	private actionInit() {
		this.isAction = true;
		let time = 100;
		var tw = egret.Tween.get(this.penzi);
		let instance = this;
		this.penzi.rotation = -4;
		tw.to({ rotation: 5 }, time);
		tw.to({ rotation: -7 }, time);
		tw.to({ rotation: 3 }, time);
		tw.to({ rotation: -9 }, time);
		tw.to({ rotation: 5 }, time);
		tw.to({ rotation: -5 }, time);
		tw.call(() => {
			egret.Tween.removeTweens(instance.penzi);
			instance.actionDown();
		}, this);
	}
	private isAction: boolean;
	private actionDown() {
		let instance = this;
		var tw = egret.Tween.get(this.penzi);

		tw.to({ rotation: 0 }, 100);
		tw.call(() => {
			egret.Tween.removeTweens(instance.penzi);
			instance.resetUI();
		}, this);
	}
	private resetUI() {
		GameCommon.getInstance().addAnimation('jubaopen', null, this.best_anim_grp);
		this.isAction = false;
	}
	private onyaoOneyao() {
		if (this.isAction) return;
		var message: Message = new Message(MESSAGE_ID.YAOQIANSHU_YAOQIAN);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onchongzhi() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
	//The end
}