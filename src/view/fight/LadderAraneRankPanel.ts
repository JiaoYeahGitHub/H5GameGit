// TypeScript file
class LadderAraneRankPanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private self_rank_num: eui.BitmapLabel;
    private not_rank_lab: eui.Label;
    private ladder_rankList: eui.List;
    private rank_scroll: eui.Scroller;
    private rank_num_grp: eui.Group;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LadderAraneRankPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.rank_scroll.verticalScrollBar.autoVisibility = false;
        this.rank_scroll.verticalScrollBar.visible = false;
        this.ladder_rankList.itemRenderer = LadderAraneRankItem;
        this.ladder_rankList.itemRendererSkinName = skins.LadderAraneRankItemSkin;
        this.ladder_rankList.useVirtualLayout = true;
        this.rank_scroll.viewport = this.ladder_rankList;
        this.setTitle("排行榜");
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.ladder_rankList.dataProvider = new eui.ArrayCollection(DataManager.getInstance().arenaManager.ladderRanks);
        if (DataManager.getInstance().arenaManager.selfladderRankData.rank > 0) {
            this.self_rank_num.text = DataManager.getInstance().arenaManager.selfladderRankData.rank + "";
            this.not_rank_lab.visible = false;
            this.rank_num_grp.visible = true;
        } else {
            this.rank_num_grp.visible = false;
            this.not_rank_lab.visible = true;
        }
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    //The end
}
class LadderAraneRankItem extends eui.ItemRenderer {
    private bg_img: eui.Image;
    // private rank_icon: eui.Image;
    private rank_name_label: eui.Label;
    private rank_num: eui.BitmapLabel;
    private rank_rongyu_num: eui.Label;
    private duanwei_icon: eui.Image;

    constructor() {
        super();
    }
    protected dataChanged(): void {
        var ladderRankData: LadderRankData = this.data;
        // if (ladderRankData.rank <= 3) {
        // this.rank_icon.visible = true;
        // this.rank_icon.source = `rank_itemtitle${ladderRankData.rank}_png`;
        // this.rank_num.text = "";
        // } else {
        // this.rank_icon.visible = false;
        // }
        this.rank_num.text = ladderRankData.rank + "";
        this.bg_img.source = ladderRankData.rank % 2 == 0 ? "public_di1_png" : "public_di5_png";
        this.rank_name_label.text = ladderRankData.name;
        this.rank_rongyu_num.text = ladderRankData.score;
        this.onUpdate(ladderRankData.duanwei);
    }
    public onUpdate(grade: number): void {
        this.duanwei_icon.source = "arena_ladder_grade" + grade + "_png";
    }
    //The end
}