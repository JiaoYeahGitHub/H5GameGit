class TurnplateBase extends BaseTabView {
    private gainId: number;
    public constructor(owner) {
        super(owner);
    }
    public onInitData(num: number, turnplate_id: number) {
        this.gainId = turnplate_id;
        var goods: GoodsInstance;
        var goodsArr = [];
        var mdoelGain: Modelgain = JsonModelManager.instance.getModelgain()[this.gainId];
        var items: AwardItem[] = GameCommon.getInstance().onParseGainItemstr(mdoelGain.item,GOODS_TYPE.ITEM);
        var boxs: AwardItem[] = GameCommon.getInstance().onParseGainItemstr(mdoelGain.item,GOODS_TYPE.ITEM);
        var data = GameCommon.getInstance().concatAwardAry([items, boxs]).concat();
        var award: AwardItem;
        var n: number = 0;
        for (var i: number = 0; i < num; i++) {
            goods = this["goods" + i];
            award = data[n];
            goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
            goodsArr.push(goods);
            n++;
            if (n == data.length) {
                n = 0;
            }
        }
    }
    protected onInit(): void {
        super.onInit();
    }
    protected onGetBtn(event: TouchEvent): void {
        throw "需重写方法: protected onGetBtn(event: TouchEvent): void";
    }
}