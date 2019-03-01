// TypeScript file
class LadderAwardPanel extends BaseWindowPanel {
    private scroll: eui.Scroller;
    private zuanshi_rank_grp: eui.Group;
    private duanwei_rank_grp: eui.Group;
    private duanwei_tab: eui.Button;
    private zuanshi_tab: eui.Button;

    private ladder_award_ary: number[] = [1, 2, 3, 4];
    private zs_award_ary: number[] = [9, 8, 7, 6, 5];
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LadderAraneAwardPanelSkin;
    }
    protected onInit(): void {
        this.setTitle("txt_jiangliyulan_png");

        this.duanwei_tab.name = "duanwei_tab";
        this.zuanshi_tab.name = "zuanshi_tab";

        this.currentState = "duanwei_rank";
        this.onRefresh();
    }
    private onTabChange(event: egret.TouchEvent): void {
        switch (event.currentTarget.name) {
            case 'duanwei_tab':
                this.currentState = "duanwei_rank";
                break;
            case 'zuanshi_tab':
                this.currentState = "zuanshi_rank";
                break;
        }
        this.onRefresh();
    }
    protected onRefresh(): void {
        switch (this.currentState) {
            case 'zuanshi_rank':
                for (let i: number = 0; i < this.zs_award_ary.length; i++) {
                    let awardId: number = this.zs_award_ary[i];
                    let ladderawardModel: Modelttjjc = JsonModelManager.instance.getModelttjjc()[awardId - 1];
                    (this["ladder_title_img" + i] as eui.Image).source = `arena_laddertxt_lv${awardId}_png`;
                    let awrGrp: eui.Group = this["award_group" + i] as eui.Group;
                    awrGrp.removeChildren();
                    for (let n: number = 0; n < ladderawardModel.rewards.length; n++) {
                        let awardItem: AwardItem = ladderawardModel.rewards[n];
                        let goodsInstace: GoodsInstance = new GoodsInstance();
                        goodsInstace.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
                        awrGrp.addChild(goodsInstace);
                    }
                }
                break;
            case 'duanwei_rank':
                for (let i: number = 0; i < this.ladder_award_ary.length; i++) {
                    let awardId: number = this.ladder_award_ary[i];
                    let ladderawardModel: Modelttjjc = JsonModelManager.instance.getModelttjjc()[awardId - 1];
                    let awardItem: AwardItem[] = ladderawardModel.rewards;
                    (this["ladder_title_img" + i] as eui.Image).source = `arena_laddertxt_lv${awardId}_png`;
                    let awrGrp: eui.Group = this["award_group" + i] as eui.Group;
                    awrGrp.removeChildren();
                    for (let n: number = 0; n < ladderawardModel.rewards.length; n++) {
                        let awardItem: AwardItem = ladderawardModel.rewards[n];
                        let goodsInstace: GoodsInstance = new GoodsInstance();
                        goodsInstace.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
                        awrGrp.addChild(goodsInstace);
                    }
                }
                break;
        }
        this.scroll.viewport.scrollV = 0;
    }
    protected onRegist(): void {
        super.onRegist();
        this.duanwei_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabChange, this);
        this.zuanshi_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabChange, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.duanwei_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabChange, this);
        this.zuanshi_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabChange, this);
    }
    //The end
}