class AraneRankPanel extends BaseWindowPanel {
    private arena_rankList: eui.List;
    private rank_scroll: eui.Scroller;
    private label_myrank: eui.Label;
    private not_rank_lab: eui.Label;
    private rank_num_grp: eui.Group;
    private btn_sure: eui.Button;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LocalArenaRankPanelSkin;
    }
    protected onInit(): void {
        this.setTitle("榜单");

        this.rank_scroll.verticalScrollBar.autoVisibility = true;
        this.rank_scroll.verticalScrollBar.visible = true;
        this.arena_rankList.itemRenderer = AraneRankItem;
        this.arena_rankList.itemRendererSkinName = skins.AraneRankItemSkin;
        this.arena_rankList.useVirtualLayout = true;
        this.rank_scroll.viewport = this.arena_rankList;
        (this['title3_lab'] as eui.Label).text = Language.instance.getText('power');

        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        var onReqArenaRankMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_RANK_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(onReqArenaRankMsg);
    }
    private onResArenaRankMsg(event: GameMessageEvent): void {
        var arenaRankList: ArenaRankData[] = [];
        var rankMsg: Message = event.message;
        var rankSize: number = rankMsg.getByte();
        for (var i: number = 0; i < rankSize; i++) {
            var arenarankData: ArenaRankData = new ArenaRankData();
            arenarankData.rank = i + 1;
            arenarankData.parseMsg(rankMsg);
            arenaRankList.push(arenarankData);
        }
        this.arena_rankList.dataProvider = new eui.ArrayCollection(arenaRankList);
        var arenaRankData: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        if (arenaRankData.rank > 0) {
            this.label_myrank.text = arenaRankData.rank + "";
            this.not_rank_lab.visible = false;
            this.rank_num_grp.visible = true;
        } else {
            this.label_myrank.text = "";
            this.not_rank_lab.visible = true;
            this.rank_num_grp.visible = false;
        }
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_CROSS_RANK_UPDATE_MESSAGE.toString(), this.onResArenaRankMsg, this);
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_CROSS_RANK_UPDATE_MESSAGE.toString(), this.onResArenaRankMsg, this);
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    //The end
}
class AraneRankItem extends eui.ItemRenderer {
    private rank_icon: eui.Image;
    private bg_img: eui.Image;
    private rank_name_label: eui.Label;
    private rank_num_label: eui.Label;
    private reward_label: eui.Label;
    private rank_num_group: eui.Group;
    // private imgdi:eui.Image;
    constructor() {
        super();
    }
    protected dataChanged(): void {
        var arenaRankData: ArenaRankData = this.data;
        this.bg_img.source = arenaRankData.rank % 2 == 0 ? "public_di1_png" : "public_di5_png";
        // if(arenaRankData.rank>9)
        // this.imgdi.visible = false;
        this.rank_num_label.text = arenaRankData.rank + "";
        this.rank_name_label.text = arenaRankData.playerData.name;
        this.reward_label.text = GameCommon.getInstance().getFormatNumberShow(arenaRankData.playerData.fightvalue);
    }
    //The end
}