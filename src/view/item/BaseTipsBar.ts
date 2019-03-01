abstract class BaseTipsBar extends eui.Component {
    protected param: IntroduceBarParam;
    protected owner: ItemIntroducebar;
    // protected item_frame: eui.Image;
    // protected item_icon: eui.Image;
    private goods_item: GoodsInstance;
    protected name_label: eui.Label;
    protected level_label: eui.Label;
    protected desc_label: eui.Label;
    protected limitTimeLabel: eui.Label;

    protected timeGoods: TimeGoods = null;
    protected onloadComp: boolean;
    protected onsetParam: boolean;
    constructor(owner) {
        super();
        this.owner = owner;
        this.onloadComp = false;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.initSkinName();
    }
    private onLoadComplete(): void {
        this.onloadComp = true;
        if(this.onsetParam){
            this.onUpdate(this.param);
        }
        this.onRegist();
    }
    public isOnloadComp(): boolean{
        return this.onloadComp;
    }
    //皮肤
    protected initSkinName(): void {
    }
    //注册
    public onRegist(): void {
    }
    //移除
    public onRemove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    public setParam(param: IntroduceBarParam): void {
        this.param = param;
        this.onsetParam = true;
        if(this.onloadComp){
            this.onUpdate(this.param);
            this.onRegist();
        }
    }
    //更新
    public onUpdate(param: IntroduceBarParam): void {
        this.param = param;
    }
    //更新通用属性
    protected onRefreshCommonUI(model: ModelThing, quality: number = -1): void {
        // this.item_icon.source = model.icon;
        this.goods_item.onUpdate(model.type, model.id, 0, model.quality);
        quality = quality != -1 ? quality : model.quality
        // this.item_frame.source = GameCommon.getInstance().getIconFrame(quality);
        this.name_label.textFlow = new Array<egret.ITextElement>(
            { text: model.name, style: { textColor: GameCommon.getInstance().CreateNameColer[quality] } },
        );
        // var lvLimitObj = GameCommon.getInstance().getLimitLevelObj(model.level);
        // var levelDesc: string = lvLimitObj.zsLevel > 0 ? `${lvLimitObj.zsLevel}转` : `Lv.${lvLimitObj.level}`;

        if (this.desc_label)
            this.desc_label.text = model.des;

        // if (this.item_bg) {
        //     this.item_bg.source = GameCommon.getInstance().getIconBack(quality);
        // }

        if (this.timeGoods && model.limitTime > 0) {
            Tool.addTimer(this.updateLimitTime, this);
        }
    }
    //更新限时内容
    private updateLimitTime(): void {
        if (this.limitTimeLabel)
            this.limitTimeLabel.text = this.timeGoods.timeStr;
    }
    //关闭面板
    public onHide(): void {
        this.owner.onHide();
    }
}