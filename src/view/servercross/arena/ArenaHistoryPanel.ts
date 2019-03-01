class ArenaHistoryPanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private histroy_List: eui.List;
    private histroy_scroll: eui.Scroller;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LocalArenaHistroySkin;
    }
    protected onInit(): void {
        super.onInit();
        this.histroy_scroll.verticalScrollBar.autoVisibility = false;
        this.histroy_scroll.verticalScrollBar.visible = false;
        this.histroy_List.percentWidth = 554;
        this.histroy_List.percentHeight = 65;
        this.histroy_List.itemRenderer = ArenaHistroyItem;
        this.histroy_List.itemRendererSkinName = skins.AraneHistroyItemSkin;
        this.histroy_List.useVirtualLayout = true;
        this.histroy_scroll.viewport = this.histroy_List;
        this.setTitle("arena_history_title_png");
        this.onRefresh();
    }
    protected onRefresh(): void {
        var onReqArenaRankMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_RANK_HISTROY_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(onReqArenaRankMsg);
    }
    private onResArenaRankMsg(event: GameMessageEvent): void {
        var arenaHistroyList: ArenaHistoryData[] = [];
        var histroyMsg: Message = event.message;
        var histroySize: number = histroyMsg.getByte();
        for (var i: number = 0; i < histroySize; i++) {
            var arenaHistroykData: ArenaHistoryData = new ArenaHistoryData();
            arenaHistroykData.index = i;
            arenaHistroykData.parseMsg(histroyMsg);
            arenaHistroyList.push(arenaHistroykData);
        }
        this.histroy_List.dataProvider = new eui.ArrayCollection(arenaHistroyList);
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_RANK_HISTROY_MESSAGE.toString(), this.onResArenaRankMsg, this);

    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_RANK_HISTROY_MESSAGE.toString(), this.onResArenaRankMsg, this);
    }
    //The end
}
class ArenaHistroyItem extends eui.ItemRenderer {
    private histroyLabel: eui.Label;
    private result_icon: eui.Image;
    private time_label: eui.Label;

    constructor() {
        super();
    }
    protected dataChanged(): void {
        var histroyData: ArenaHistoryData = this.data;
        this.result_icon.source = histroyData.result == FightDefine.FIGHT_RESULT_SUCCESS ? "fight_win_icon_png" : "fight_lose_icon_png";
        this.time_label.text = histroyData.timestr;
        var historyDesc: string = "";
        var fightterName: string = Tool.getHtmlColorStr(histroyData.targetName, "28e828");
        if (histroyData.type == 1) {
            historyDesc += `您对${fightterName}发起了挑战，`;
            if (histroyData.result == FightDefine.FIGHT_RESULT_SUCCESS) {
                var changeRankDesc: string = histroyData.changeRank > 0 ? "您的排名上升至" + Tool.getHtmlColorStr(histroyData.changeRank + "", "28e828") + "名" : "但您的排名没有发生变化";
                historyDesc += `挑战成功${changeRankDesc}`;
            } else {
                historyDesc += `挑战失败您的排名没有发生变化`;
            }
        } else {
            historyDesc += `${fightterName}对您发起了挑战`;
            if (histroyData.result == FightDefine.FIGHT_RESULT_SUCCESS) {
                historyDesc += `但没有成功击败您，您的排名没有发生变化`;
            } else {
                var changeRankDesc: string = histroyData.changeRank > 0 ? "您的排名下降至" + Tool.getHtmlColorStr(histroyData.changeRank + "", "28e828") + "名" : "但您的排名没有发生变化";
                historyDesc += "并且击败了您，" + changeRankDesc;
            }
        }
        this.histroyLabel.textFlow = (new egret.HtmlTextParser).parser(historyDesc);
    }
    //The end
}