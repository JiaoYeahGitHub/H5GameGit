class ActivityXLDHPanel extends BaseTabView{
	private manager: Activity666Manager;
	private lbTime: eui.Label;
	private goodsList: GoodsInstance[];
	private lbNames: eui.Label[];
	private lbCounts: eui.Label[];
	private btnDHs: eui.Button[]
	public constructor(owner) {
        super(owner);
    }
	protected onSkinName(): void {
        this.skinName = skins.ActivityXLDHPanelSkin;
    }
    protected onInit(): void {
		this.manager = DataManager.getInstance().a666Manager;
		super.onInit();

		this.goodsList = [];
		this.lbNames = [];
		this.lbCounts = [];
		this.btnDHs = [];
		for(let i = 0; i < 5; ++i){
			this.goodsList[i] = this['goods' + i];
			this.lbNames[i] = this['lbName' + i];
			this.lbCounts[i] = this['lbCount' + i];
			this.btnDHs[i] = this['btnDH' + i];
			this.btnDHs[i].name = i.toString();

			let model: Modelactivityxianlvshenqi = this.getModel(i);
			this.lbNames[i].text = model.rewards[0].thingbase.model.name;
			this.goodsList[i].onUpdate(model.rewards[0].type, model.rewards[0].id, 0, model.rewards[0].quality, model.rewards[0].num);
			this.goodsList[i].name_label.text = model.cost.thingbase.model.name;
			this.goodsList[i].name_label.textColor = GameCommon.getInstance().CreateNameColer(model.rewards[0].thingbase.model.quality);
			this.initRed(this.btnDHs[i], GameDefine.RED_BTN_POS, (i + 1).toString());
		}
	}
	protected initRed(button, pos: egret.Point, count:string){
		var _redPoint = new redPoint();
		_redPoint.register(button, pos, this.manager, 'checkRedDHPoint', count);
		this.points.push(_redPoint);
	}
	protected onRegist(){
		super.onRegist();
		this.examineCD();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TLDOGZ_EXCHANGE_MESSAGE.toString(), this.onCallbackDH, this);
		for(let i = 0; i < 5; ++i){
			this.btnDHs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventDH, this);
		}
		this.updateUI();
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TLDOGZ_EXCHANGE_MESSAGE.toString(), this.onCallbackDH, this);
		for(let i = 0; i < 5; ++i){
			this.btnDHs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventDH, this);
		}
	}
	protected examineCD(open: boolean = true) {
		if (open) {
			Tool.addTimer(this.updateTime, this, 1000);
		} else {
			Tool.removeTimer(this.updateTime, this, 1000);
		}
	}
	protected updateTime(){
		let time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ACT_666SHENQI2_DUIHUAN);
		if(time <= 0){
			time = 0;
			this.examineCD(false);
		}
		this.lbTime.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private getModel(idx: number){
		return JsonModelManager.instance.getModelactivityxianlvshenqi()[(idx + 1).toString()];
	}
	private updateUI(){
		for(let i = 0; i < 5; ++i){
			let model: Modelactivityxianlvshenqi = this.getModel(i);
			let currNum = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
			this.lbCounts[i].text = currNum + "/" + model.cost.num;
			this.lbCounts[i].textColor = currNum >= model.cost.num ? 0xFFDA58 : 0xFF0000;
		}
	}
	private onEventDH(event: egret.TouchEvent){
		let idx = parseInt(event.target.name);
		let model: Modelactivityxianlvshenqi = this.getModel(idx);
		if(GameCommon.getInstance().onCheckItemConsume(model.cost.id, model.cost.num, model.cost.type)){
			this.onSendExchangeMessage(idx + 1);
		}
	}
	private onSendExchangeMessage(id: number): void {
		var message = new Message(MESSAGE_ID.TLDOGZ_EXCHANGE_MESSAGE);
		message.setByte(id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onCallbackDH(){
		this.updateUI();
	}
}