class LegendMainView extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private btnTabs: eui.RadioButton[];
	private currType: number;

    private aniLayer: eui.Group;
    private ani: Animation;
	private aniName: string;
    private consuItem: ConsumeBar;
    private btnAdvance: eui.Button;
    private powerBar: PowerBar;
    private animLayer: eui.Group;
    private grade_lab: eui.Label;
    private label_get: eui.Label;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    private animPos: egret.Point = new egret.Point(300, 540);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LegendEquipBasicSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("神器培养");
		var models = JsonModelManager.instance.getModelshenqi();
		this.btnTabs = [];
		for(let i = 0; i < 5; ++i){
			this.btnTabs[i] = this["btnTab" + i];
			let type = i + 1;
			this.btnTabs[i].value = type;
			this.btnTabs[i]["tab_name"].text = models[type][0].name;
			this.btnTabs[i]["tab_name"].size = 18;
			this.btnTabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
			let redP = this.createRedPoint();
			redP.register(this.btnTabs[i], GameDefine.RED_FASHION_ITEM_POS, DataManager.getInstance().legendManager, "getCanLegendAdvance", type);
		}
		let redPo = this.createRedPoint();
		redPo.register(this.btnAdvance, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, "onCheckRedPointBtn");
		this.aniName = "shenqi_1";
		if (!this.ani) {
            this.ani = new Animation(this.aniName, -1, false);
            this.ani.x = this.aniLayer.width / 2;
            this.ani.y = this.aniLayer.height / 2 + this.aniLayer.height / 4;
            this.ani.scaleX = 0.95;
            this.ani.scaleY = 0.95;
            this.aniLayer.addChild(this.ani);
        } else {
            this.ani.onPlay();
        }
		this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.label_get.touchEnabled = true;
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		this.setCurrType(1);
	}
	private onCheckRedPointBtn(): boolean{
		return DataManager.getInstance().legendManager.getCanLegendAdvance(this.currType);
	}
	private onTouchbtnAdvance() {
        if (this.data.activate == 0) {
            var message = new Message(MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE);
            message.setByte(this.data.index);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            var modeled: Modelshenqi = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv - 1];
            var next: Modelshenqi = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv]
            //激活或进阶
            if (modeled && next) {
                if (!GameCommon.getInstance().onCheckItemConsume(modeled.cost.id, modeled.cost.num, modeled.cost.type)) {
                    return;
                }
                var message = new Message(MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE);
                message.setByte(this.data.index);
                GameCommon.getInstance().sendMsgToServer(message);
            }
        }
    }
	private onGetBtn(event: TouchEvent): void {
        var model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[this.currType][0];
        GameCommon.getInstance().onShowFastBuy(model.cost.id, model.cost.type);
    }
	private onEventBtn(event: egret.TouchEvent) {
        let type = event.target.value;
		if(this.currType != type){
			this.setCurrType(type);
		}
    }
	private setCurrType(type: number){
		this.currType = type;
		for(let i = 0; i < this.btnTabs.length; ++i){
			this.btnTabs[i].selected = (this.btnTabs[i].value == type);
		}
		this.updateUI();
	}
	private updateAni(aniName: string = "shenqi_1"){
		if(aniName != this.aniName){
			this.aniName = aniName;
			this.ani.onUpdateRes(aniName, -1);
		}
	}
	private updateUI(){
		this.updateAni("shenqi_" + this.currType);
		this.updatePro();
		this.updateGoodsADD();
        this.onUpdatePower();
		this.trigger();
	}
	private updatePro(){
		var curr: Modelshenqi;
        let nextP;
        let curP;
        curP = LegendDefine.getLegendDesc(this.currType, this.data.lv - 1, false);
        this.grade_lab.text = this.data.lv + "阶";
        if (this.data.lv == 0) {
            curr = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv];
        } else {
            curr = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv - 1];
        }
        nextP = LegendDefine.getLegendDesc(this.currType, this.data.lv, true);
        var next: Modelshenqi = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv]
        var model: Modelshenqi = curr || next;
        if (!next) {
            this.btnAdvance.label = Language.instance.getText('shenqiyimanji');
            this.currentState = "max";
        } else {
            this.currentState = 'advance';
        }
		var add: number = 0;
        for (var key in model.attrAry) {
            if (model.attrAry[key] > 0) {
                if (this.data.lv == 0)
                    add = 0;
                else
                    add = curr ? curr.attrAry[key] : 0;
                curP.push({ text: '\n  ' + GameDefine.Attr_FontName[key] + '+' + add });
                add = next ? next.attrAry[key] : 0;
                nextP.push({ text: '\n  ' + GameDefine.Attr_FontName[key] + "+" + add });
                // nextP.push({ text: add.toString(), style: { textColor: 0x00FF00 } })
            }
        }
        this.curPro.textFlow = curP;
        this.nextPro.textFlow = nextP;
	}
	private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
	private get data(): LegendData{
		return this.getPlayerData().getLegendBase(this.currType);
	}
	private updateGoodsADD() {
        var next: Modelshenqi = JsonModelManager.instance.getModelshenqi()[this.currType][this.data.lv]
        //激活或进阶
        if (next) {
			this.consuItem.setCostByAwardItem(next.cost);
        }
    }
    //更新战斗力
    private onUpdatePower(): void {
        this.powerBar.power = DataManager.getInstance().legendManager.legendOnePower(this.getPlayerData().getLegendBase(this.currType));
    }
	private update(e: GameMessageEvent) {
        if (e.type == MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE.toString()) {
            this.playAnim("jihuochenggong", this.animPos, this.animLayer);
        } else if (e.type == MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE.toString()) {
            this.playAnim("jinjiechenggong", this.animPos, this.animLayer);
        }
        this.updateUI();
    }
	private playAnim(Key: string, point: egret.Point, parent, call = null) {
        this.animLayer.removeChildren();
        var movie: Animation = new Animation(Key, 1, true);
        movie.x = point.x;
        movie.y = point.y;
        movie.playFinishCallBack(call, this);
        this.animLayer.addChild(movie);
    }
	protected onRegist(): void {
		super.onRegist();
		this.btnAdvance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchbtnAdvance, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE.toString(), this.update, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE.toString(), this.update, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.update, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btnAdvance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchbtnAdvance, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE.toString(), this.update, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE.toString(), this.update, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.update, this);
        
	}
}