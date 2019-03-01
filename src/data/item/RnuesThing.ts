// TypeScript file
class RnuesThing extends ThingBase {

    public constructor(type: GOODS_TYPE = GOODS_TYPE.RNUES) {
        super(type);
    }
    //背包解析
    public parseItem1(msg: Message): void {
        var modelId: number = msg.getShort();
        var num: number = msg.getInt();
        this.onupdate(modelId,-1,num);
    }
    //The end
}