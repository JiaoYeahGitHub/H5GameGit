class WuTanAlertFight extends BaseWindowPanel {
	public priority = PANEL_HIERARCHY_TYPE.II;
	public btnOk: eui.Button;
	public btnBack: eui.Button;
	public zhangong_lab: eui.Label;
	public exp_lab: eui.Label;
	public lbAlert: eui.Label;
	public my_head_img: PlayerHeadUI;
	public my_name_label: eui.Label;
	public my_fightvalue_label: eui.BitmapLabel;
	public target_head_img: PlayerHeadUI;
	public target_name_label: eui.Label;
	public target_fightvalue_label: eui.BitmapLabel;
	public good: GoodsInstance;

	public param: WuTanAlertParam;
	private costList: AwardItem[];
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuTanAlertFightSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let data: WuTanListbody = this.param.param as WuTanListbody;
		let model: Modelwutan = data.getModel();
		let colorDef = 0xFFFFFF;
		let colorFlash = 0xE9DEB3;
		//若挑战成功，即可登上此坛位，每分钟可产出XXXX点经验（340级后才可生效）和XXXXXX点法魂值，最多持续12小时
		this.exp_lab.text = WuTanManager.fontExp + "：" + WuTanManager.getValueExp(model) + "/分钟";
		this.zhangong_lab.text = WuTanManager.fontGas + "：" + WuTanManager.getValueGas(model) + "/分钟";
		this.my_head_img.setHead();
		this.my_name_label.text = DataManager.getInstance().playerManager.player.name;
		this.my_fightvalue_label.text = DataManager.getInstance().playerManager.player.playerTotalPower.toString();
		this.target_head_img.setHead(data.playerData.headindex, data.playerData.headFrame);
		this.target_name_label.text = data.playerData.name;
		this.target_fightvalue_label.text = data.playerData.fightvalue.toString();
		let awarditem: AwardItem = data.getRewardBox();
		if (awarditem) {
			this.good.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
		} else {
			this.good.visible = this.lbAlert.visible = false;
		}
		let awardList: AwardItem[] = data.getModel().costList;
		for (let i = 0; i < awardList.length; ++i) {
			if (this['cost_num_lab' + i]) {
				this['cost_num_lab' + i].text = '' + awardList[i].num;
			}
		}
		this.costList = awardList;
	}
	public onEventOk() {
		if (WuTanManager.isCost(this.costList)) {
			this.onEventBack();
			egret.callLater(this.param.callback, this.param.target, this.param.param);
		}
	}
	public onShowWithParam(param: WuTanAlertParam): void {
		this.param = param;
		this.onShow();
	}
	public onEventBack() {
		this.onHide();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
		this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
		this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
	}
}
class WuTanAlertParam {
	public callback;
	public target;
	public param;
	public constructor(callback, target, param = null) {
		this.callback = callback;
		this.target = target;
		this.param = param;
	}
}