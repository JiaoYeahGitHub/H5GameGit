class ActJueXingDanPanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private closeBtn1: eui.Button;
    private coatard_exp_pro: eui.ProgressBar;
    private btn_coatard: eui.Button;
	private groupAni: eui.Group;
    private anim_grp: eui.Group;
	private groupItem: eui.Group;
    private shenqi_name: eui.Label;
	private lbAlert: eui.Label;
	private lbTime: eui.Label;
	private goods: GoodsInstance;
	private jxdManager: ActJueXingDanManager;
	private blessType: number;
	private groupMoveTop: number;
	private isMove: boolean = false;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ActJueXingDanSkin;
    }
    protected onInit(): void {
		this.jxdManager = DataManager.getInstance().jxdManager;
        super.onInit();
		this.groupMoveTop = this.groupAni.y;
        //this.onRefresh();
    }
	protected onRegist(): void {
        super.onRegist();
		this.updateUI();
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_coatard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventPay, this);
		this.setAnimMove();
		this.startTime();
    }
	private setAnimMove(){
		this.groupAni.y = this.groupMoveTop;
		if(this.isMove){
			let tw = egret.Tween.get(this.groupAni, {loop: true});
			tw.to({y: this.groupMoveTop - 50}, 2000);
			tw.to({y: this.groupMoveTop}, 2000);
		}
	}
	private startTime(){
		Tool.addTimer(this.updateTime, this, 1000);
	}
	private closeTime(){
		Tool.removeTimer(this.updateTime, this, 1000);
	}
	private updateTime(){
		let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.JUEXINGDAN);
		this.lbTime.text = "活动剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
		if(time <= 0){
			this.closeTime();
		}
	}
    protected onRemove(): void {
        super.onRemove();
		egret.Tween.removeTweens(this.groupAni);
		this.closeTime();
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_coatard.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventPay, this);
    }
	private updateUI(){
		let modelJXD: Modelactivityjuexingdan = this.jxdManager.checkModel();
		if(this.blessType != modelJXD.type){
			this.blessType = modelJXD.type;
			this.initAni(this.blessType);
			let award: AwardItem = modelJXD.rewards[0];
			let _model: ModelThing = GameCommon.getInstance().getThingModel(award.type, award.id);
			this.shenqi_name.text = _model.name;
			this.goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.goods.name_label.visible = this.goods.num_label.visible = false;
		}
		this.coatard_exp_pro.maximum = this.jxdManager.payMax;
		this.coatard_exp_pro.value = this.jxdManager.payNum;
		if(this.jxdManager.isPayFull()){
			this.lbAlert.text = "您已累充达到" + this.jxdManager.payMax + "元，奖励已通过邮件发放";
		} else {
			this.lbAlert.text = "活动当天累充达到" + this.jxdManager.payMax + "元可免费获取";
		}
		
	}
	private initAni(type: number){
		while (this.anim_grp.numChildren > 0) {
			let display = this.anim_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.anim_grp.removeChild(display);
			}
		}
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(type);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		model = model ? model : manager.getBlessModel(type, 1, 1);
		let resurl: string = "";
		let ani: egret.DisplayObject = null;
		this.isMove = false;
		// switch (type) {
		// 	case BLESS_TYPE.HORSE://0
		// 		resurl = `zuoqi_${model.waixing1}`;
		// 		ani = new Animation(resurl);
		// 		ani.y = 50;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.CLOTHES://1
		// 		let sex: string = DataManager.getInstance().playerManager.player.getPlayerData().sex == SEX_TYPE.MALE ? "nan" : "nv";
		// 		resurl = `shenzhuang_${sex}_${model.waixing1}`;
		// 		ani = new Animation(resurl, -1);
		// 		ani.y = 50;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.WEAPON://2
		// 		resurl = `jian${model.waixing1}_png`;
		// 		ani = new eui.Image();
		// 		ani.y = -40;
		// 		(ani as eui.Image).source = resurl;
		// 		this.anim_grp.addChild(ani);
		// 		resurl = `shenbing_1`;
		// 		var anim2 = new Animation(resurl, -1);
		// 		anim2.y = 360 + ani.y;
		// 		anim2.x = 162;
		// 		this.anim_grp.addChild(anim2);
		// 		this.isMove = true;
		// 		break;
		// 	case BLESS_TYPE.WING://3
		// 		resurl = LoadManager.getInstance().getWingResUrl("wing" + model.waixing1, "ride_stand", Direction.DOWN + "");
		// 		ani = new BodyAnimation(resurl, -1, Direction.DOWN);
		// 		ani.y = 50;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.RING://4
		// 		resurl = `guanghuan_jiemian_${model.waixing1}`;
		// 		ani = new Animation(resurl, -1);
		// 		ani.y = -70;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.RETINUE_HORSE://5
		// 		resurl = "sc_mount" + model.waixing1;
		// 		ani = new Animation(resurl);
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.RETINUE_CLOTHES://6
		// 		resurl = "sc_role" + model.waixing1;
		// 		ani = new Animation(resurl);
		// 		ani.y = 50;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.RETINUE_WEAPON://7
		// 		resurl = `weapon${model.waixing1}_png`;
		// 		ani = new eui.Image();
		// 		ani.x = -50;
		// 		ani.y = 100;
		// 		(ani as eui.Image).source = resurl;
		// 		this.anim_grp.addChild(ani);
		// 		this.isMove = true;
		// 		break;
		// 	case BLESS_TYPE.RETINUE_WING://8
		// 		resurl = 'sc_wing' + model.waixing1;
		// 		ani = new Animation(resurl);
		// 		ani.x = 30;
		// 		ani.y = 30;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// 	case BLESS_TYPE.RETINUE_MAGIC://9
		// 		resurl = `sc_magic${model.waixing1}`;
		// 		ani = new Animation(resurl, -1);
		// 		ani.y = -50;
		// 		this.anim_grp.addChild(ani);
		// 		break;
		// }
	}
	
	private onEventPay(){
		this.onHide();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
}