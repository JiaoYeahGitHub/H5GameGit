class ChengJiuAwardPanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private items: SmeltInstance[];
    private imgFrameName: string = "iconFrame";
    private imgIconName: string = "iconDisplay";
    // private itemLayer: eui.Group;
    private btn_smelt: eui.Button;
    private btn_smelt_all: eui.Button;
    private smeltQueue;
    private currEquip: EquipThing[];
    private btnGroup;
    private bar: eui.Scroller;
    private actItemGroup: eui.List;
    private buttonIndex: number = 0;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ChengJiuAwardPanel;
    }
    protected onInit(): void {
        this['basic']['label_title'].text = '成就奖励';
        this.actItemGroup.itemRenderer = ChengJiuAwardItem;
        this.actItemGroup.itemRendererSkinName = skins.ChengjiuAwardItem;
        this.actItemGroup.useVirtualLayout = true;
        this.bar.viewport = this.actItemGroup;
        super.onInit();
        this.onRefresh();
    }
    private cjModels: ModelchengjiuLv[];
    private get getModel(): ModelchengjiuLv[] {
        this.cjModels = [];
        var models = JsonModelManager.instance.getModelchengjiuLv()
        for (let k in models) {
            this.cjModels.push(models[k])
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
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_TASK_LV_MSG.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_TASK_LV_MSG.toString(), this.onRefresh, this);
    }
    protected onRefresh(): void {
        var arr = this.getModel;
        arr.sort(function (arg1: any, arg2: any) {
            var arg1Stage:number = 2;
            var arg2Stage:number = 2;
            if (arg2.exp <= DataManager.getInstance().playerManager.player.chengjiuExp) {
                arg2Stage = -1;
                 if (DataManager.getInstance().playerManager.player.chengjiuLvDict[arg2.lv]) {
                    arg2Stage = 2;
                }
            }
            else
            {
                arg2Stage = 1;
            }

            if (arg1.exp <= DataManager.getInstance().playerManager.player.chengjiuExp) {
                arg1Stage = -1;

                if (DataManager.getInstance().playerManager.player.chengjiuLvDict[arg1.lv]) {
                    arg1Stage = 2;
                }

            }
            else
            {
                arg1Stage = 1;
            }
            return arg1Stage-arg2Stage;
        });
        this.actItemGroup.dataProvider = new eui.ArrayCollection(arr);
    }
}
class ChengJiuAwardItem extends BaseListItem {
    private goodData: GoodsInstance;
    private desc: eui.Label;
    private desc1: eui.Label;
    private btn_go: eui.Button;
    private progress_cur_value: eui.ProgressBar;
    private progress_cur_value1: eui.ProgressBar;
    protected points: redPoint[] = RedPointManager.createPoint(1);
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onComplete, this);
    }
    protected onComplete(): void {
        this.btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }
    protected onUpdate(): void {
        if (this.data) {
            // var modelCfg:ModelThing = GameCommon.getInstance().getThingModel(this.data.rewards[0].type, awards[0].id, 0);
            this.desc.text = this.data.lv + '级';
            // this.desc1.text = ;
            this.goodData.onUpdate(this.data.rewards[0].type, this.data.rewards[0].id);
            this.progress_cur_value.labelDisplay.visible = false;
            this.progress_cur_value1.labelDisplay.visible = false;
            this.progress_cur_value1.slideDuration = 0;
            this.progress_cur_value1.maximum = this.data.exp;
            this.progress_cur_value1.value = DataManager.getInstance().playerManager.player.chengjiuExp;
            this.desc1.text = DataManager.getInstance().playerManager.player.chengjiuExp + '/' + this.data.exp;
            this.goodData.currentState = 'notName';
            if (this.data.exp <= DataManager.getInstance().playerManager.player.chengjiuExp) {
                if (DataManager.getInstance().playerManager.player.chengjiuLvDict[this.data.lv]) {
                    this.btn_go.label = '已领取';
                    this.btn_go.enabled = false;
                }
                else {
                    this.btn_go.label = '已完成';
                    this.btn_go.enabled = true;
                    this.btn_go.skinName = skins.Common_ButtonSkin;
                }
            }
            else {
                this.btn_go.label = '前往';
                this.btn_go.enabled = true;
                this.btn_go.skinName = skins.Common_ButtonBlueSkin;
            }
        }
    }
    private onTouchButton(): void {
        if (this.btn_go.label == '已完成') {
            let rewardMsg: Message = new Message(MESSAGE_ID.REBIRTH_TASK_LV_MSG);
            rewardMsg.setShort(this.data.lv);
            GameCommon.getInstance().sendMsgToServer(rewardMsg);
        } else if (this.btn_go.label == '前往') {
            let item = GameCommon.getInstance().getThingModel(this.data.rewards[0].type, this.data.rewards[0].id);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), item.gotype);
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