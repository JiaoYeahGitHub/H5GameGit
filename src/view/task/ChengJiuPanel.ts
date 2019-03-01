class ChengJiuPanel extends BaseTabView {
    private items: SmeltInstance[];
    private imgFrameName: string = "iconFrame";
    private imgIconName: string = "iconDisplay";
    // private itemLayer: eui.Group;
    private btnChengJiu: eui.Button;
    private btn_smelt_all: eui.Button;
    private smeltQueue;
    private currEquip: EquipThing[];
    private btnGroup;
    private bar: eui.Scroller;
    private actItemGroup: eui.List;
    private buttonIndex: number = 0;
    private imgZhuan: eui.Label;
    private curLv: eui.Label;
    private bar_exp: eui.ProgressBar;
    private chengjiuPro: eui.Label;
    protected points: redPoint[] = RedPointManager.createPoint(1);
    private goodData: GoodsInstance;
    private powerBar: PowerBar
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ChengJiuPanelSkin;
    }
    protected onInit(): void {
        this.actItemGroup.itemRenderer = ChengJiuItem;
        this.actItemGroup.itemRendererSkinName = skins.ChengJiuItem;
        this.actItemGroup.useVirtualLayout = true;
        this.bar.viewport = this.actItemGroup;
        this.points[0].register(this.btnChengJiu, GameDefine.RED_MAIN_POS, DataManager.getInstance().taskManager, "getChengJiuLvPoint");
        super.onInit();
        this.onRefresh();
    }
    private cjModels: TaskChainData[];
    private get getModel(): TaskChainData[] {
        this.cjModels = [];
        var models = JsonModelManager.instance.getModelchengjiu()
        for (let k in models) {
            let taskData: TaskChainData = DataManager.getInstance().taskManager.coatardTasks[models[k].id];
            var mubiaoCfg: ModelchengjiuMubiao = DataManager.getInstance().taskManager.getCurTask(taskData.model.id, taskData.count);
            if (mubiaoCfg) {
                taskData.maxnum = mubiaoCfg.mubiao;
                if (taskData.progress >= mubiaoCfg.mubiao) {
                    taskData.isAct = 0;
                }
                else {
                    taskData.isAct = 1;
                }
                if (taskData.model.id == 13)
                    taskData.isAct = -1;
                this.cjModels.push(taskData)
            }
        }

        return this.cjModels;
    }
    private onEventBtn(event: egret.TouchEvent) {
        let idx = parseInt(event.target.name);
        // if(this.buttonIndex != idx){
        // 	if(this.func && this.thisObj){
        // 		Tool.callback(this.func, this.thisObj, this.tabBtnList[idx]);
        // 	}
        // }
    }
    protected onRegist(): void {
        super.onRegist();
        this.btnChengJiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAward, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnChengJiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAward, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onRefresh, this);
    }
    private onShowAward(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ChengJiuAwardPanel");
    }
    protected onRefresh(): void {
        var arr = this.getModel;
        arr.sort(function (arg1: any, arg2: any) {
            return arg1.isAct - arg2.isAct;
        });
        this.actItemGroup.dataProvider = new eui.ArrayCollection(arr);
        var exp: number = DataManager.getInstance().playerManager.player.chengjiuExp;
        var lv: number = DataManager.getInstance().taskManager.getchengjiuLevel(exp)
        this.imgZhuan.text = lv + '';
        if (JsonModelManager.instance.getModelchengjiuLv()[lv]) {
            // this.curLv.text = exp+'/'+ JsonModelManager.instance.getModelchengjiuLv()[lv].exp;
            this.bar_exp.maximum = JsonModelManager.instance.getModelchengjiuLv()[lv].exp;
            this.bar_exp.value = exp;
            this.chengjiuPro.text = exp + '/' + JsonModelManager.instance.getModelchengjiuLv()[lv].exp;
            var rewards = JsonModelManager.instance.getModelchengjiuLv()[lv].rewards[0];
            this.goodData.onUpdate(rewards.type, rewards.id)
            var models = JsonModelManager.instance.getModelfashion()
            for (let k in models) {
                if (models[k].cost.id == rewards.id) {
                    this.powerBar.power = GameCommon.calculationFighting(models[k].attrAry);
                    break;
                }
            }
        }
        else {
            // this.curLv.text = '已满级'
            this.bar_exp.maximum = 1;
            this.bar_exp.value = 1;
            this.chengjiuPro.text = '全部达成';
        }

        this.bar_exp.labelDisplay.visible = false;
    }
    public trigger(): void {
        this.points[0].checkPoint();
    }
}
class ChengJiuItem extends eui.ItemRenderer {

    private goodData: GoodsInstance;
    private desc: eui.Label;
    private btn_go: eui.Button;
    private progress_cur_value1: eui.ProgressBar;
    protected points: redPoint[] = RedPointManager.createPoint(1);
    private _taskdata: TaskChainData;
    private item_Di: eui.Image;
    // private money: eui.Label;
    private pointNum: eui.BitmapLabel;
    private consume: CurrencyBar;
    private proNum: eui.Label;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onComplete, this);
    }
    protected onComplete(): void {
        this.btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }
    private onTouchItem(e: egret.Event): void {
    }
    protected dataChanged(): void {
        super.dataChanged();
        // this.progress_cur_value['labelDisplay']['textColor'] = '0X00ff00';
        this.progress_cur_value1.value = 0;
        this.progress_cur_value1.slideDuration = 0;
        this.consume.nameColor = 0xf3f3f3;
        if (this.data) {
            let taskData: TaskChainData = this.data;//DataManager.getInstance().taskManager.coatardTasks[this.data.id];
            var mubiaoCfg: ModelchengjiuMubiao = DataManager.getInstance().taskManager.getCurTask(taskData.model.id, taskData.count);
            if (taskData.model.id == 13) {

                this.item_Di.source = 'public_jindi_png';
            }
            else {
                this.item_Di.source = 'public_landi_png';
            }
            if (mubiaoCfg) {
                let _oldText: string = taskData.model.name;
                let text: string = _oldText;
                let mubiaoValue: number = mubiaoCfg.mubiao;
                let progressValue: number = taskData.progress;
                if (mubiaoCfg.type == 7) {//7是代表等级达到某转
                    let mubiao_zs_model: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[mubiaoValue];
                    if (mubiao_zs_model) {
                        mubiaoValue = mubiao_zs_model.zhuansheng;
                    }
                    let pro_zs_model: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[progressValue];
                    if (pro_zs_model) {
                        progressValue = pro_zs_model.zhuansheng;
                    }
                }

                if (taskData.model.id == 13)
                 {
                     mubiaoValue = GameCommon.getInstance().getVipName(mubiaoCfg.mubiao)
                     progressValue = GameCommon.getInstance().getVipName(taskData.progress)
                 } 
                this.pointNum.text = mubiaoCfg.points + '';
                _oldText = _oldText.replace(`{${0}}`, mubiaoValue + '');
                this.progress_cur_value1.maximum = mubiaoValue;
                this.progress_cur_value1.value = progressValue;
                this.desc.text = _oldText;
                this.proNum.text = progressValue + '/' + mubiaoValue;
                if (mubiaoCfg.rewards) {
                    this.consume.visible = true;
                    this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(mubiaoCfg.rewards[0].type, mubiaoCfg.rewards[0].id, mubiaoCfg.rewards[0].num));
                    // let costModel: ModelThing = GameCommon.getInstance().getThingModel(mubiaoCfg.rewards[0].type, mubiaoCfg.rewards[0].id);
                    // this.money.text = costModel.name + '*' + mubiaoCfg.rewards[0].num + '';
                }
                else {
                    this.consume.visible = false;
                    // this.money.text = '';
                }
            }
            this._taskdata = taskData;
            if (taskData.maxnum <= taskData.progress) {
                this.btn_go.label = '领取';
                this.btn_go.skinName = skins.Common_ButtonBlueSkin;
            }
            else {
                this.btn_go.label = '前往';
                this.btn_go.skinName = skins.Common_ButtonSkin;
            }
        }
    }
    private _touchStamp: number = 0;
    private onTouchButton(): void {
        if (!this._taskdata)
            return;
        if (this._taskdata.maxnum <= this._taskdata.progress) {
            if (this._touchStamp > egret.getTimer()) {
                return;
            }
            this._touchStamp = egret.getTimer() + 1000;
            let rewardMsg: Message = new Message(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG);
            rewardMsg.setShort(this._taskdata.model.id);
            GameCommon.getInstance().sendMsgToServer(rewardMsg);
        } else {
            if (this._taskdata.model.eventType == 36) {
                let param: ChatPanelParam = new ChatPanelParam(CHANNEL.CURRENT, null);
                let shortword: string = ChatDefine.DEFAULT_SHORT_CHAT[Math.floor(Math.random() * ChatDefine.DEFAULT_SHORT_CHAT.length)];
                param.content = Language.instance.getText(shortword);
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatMainPanel", param));
            } else {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this._taskdata.model.goType);
            }
        }
    }
    public set selecet(bl: boolean) {
        // this.btn.selected = bl;
    }

    public unSelect(): void {
    }
    public onTouch(): void {
    }
}