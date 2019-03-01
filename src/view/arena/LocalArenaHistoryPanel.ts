class LocalArenaHistoryPanel extends BaseWindowPanel {
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
        this.setTitle("历史战绩");
        this.onRefresh();
    }
    protected onRefresh(): void {
        var onReqArenaRankMsg: Message = new Message(MESSAGE_ID.ARENE_RANK_HISTROY_MESSAGE);
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