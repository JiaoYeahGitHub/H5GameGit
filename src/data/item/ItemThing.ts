// TypeScript file
class ItemThing extends ThingBase {

    public constructor(type: GOODS_TYPE = GOODS_TYPE.ITEM) {
        super(type);
    }
    //背包解析
    public parseItem1(msg: Message): void {
        var modelId: number = msg.getShort();
        var num: number = msg.getInt();
        this.onupdate(modelId, -1, num);
    }
    //The end
}