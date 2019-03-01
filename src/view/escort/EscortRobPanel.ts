class EscortRobPanel extends BaseWindowPanel {
    private infoLayer: eui.Group;
    private index: number = 0;
    private arane_ranknum_label: eui.Label;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.EscortRobPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("护送记录");
        // this.onRefresh();
    }
    protected onRefresh(): void {
        this.infoLayer.removeChildren();
        var item: EscortRobitem;
        var data = DataManager.getInstance().escortManager.log;
        for (var i = data.length - 1; i >= 0; i--) {
            item = new EscortRobitem();
            item.data = data[i];
            this.infoLayer.addChild(item);
        }
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ESCORT_RECORD.toString(), this.onRefresh, this);
        this.onSendGetRecord();
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.YUANSHEN, "psych"));
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ESCORT_RECORD.toString(), this.onRefresh, this);
    }
    private onSendGetRecord() {
        var message = new Message(MESSAGE_ID.ESCORT_ESCORT_RECORD);
        GameCommon.getInstance().sendMsgToServer(message);
        DataManager.getInstance().escortManager.hasNewInfo = false;
    }
}
class EscortRobitem extends eui.Component {
    private _data: EscortRecordbase;
    private time_ymd_lab: eui.Label;
    private time_hms_lab: eui.Label;
    private label_content: eui.Label;
    private result_icon: eui.Image;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.EscortRobItemSkin;
    }
    public onLoadComplete(): void {
        this.label_content.touchEnabled = true;
        this.label_content.addEventListener(egret.TextEvent.LINK, function (evt: egret.TextEvent) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("EscortRevengePanel", this._data));
        }, this);
    }
    public set data(da: EscortRecordbase) {
        this._data = da;
        this.onUpdate();
    }
    public get data() {
        return this._data;
    }
    public onUpdate() {
        if (this.data.recordType > 1) {
            this.result_icon.source = this.data.succeed > 0 ? "fight_win_icon_png" : "fight_lose_icon_png";
        } else {
            this.result_icon.source = "fight_start_icon_png";
        }

        let total: number;
        let model: Modeldujie = JsonModelManager.instance.getModeldujie()[this.data.quality];
        let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
        let awarditem: AwardItem = rewards[0];
        total = awarditem.num;
        let thing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id);
        let date: Date = new Date(this.data.time);
        let arr: Array<egret.ITextElement> = new Array<egret.ITextElement>();
        this.time_ymd_lab.text = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        this.time_hms_lab.text = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        this.label_content.textFlow = DataManager.getInstance().escortManager.getTextFlow(this.data);
    }
}