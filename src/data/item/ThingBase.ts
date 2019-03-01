// TypeScript file
class ThingBase {
    public modelId: number;
    public type: number;
    public quality: number;
    public num: number = 0;

    public constructor(type, modelId = 0, num = 0) {
        this.type = type;
        this.modelId = modelId;
        this.num = num;
    }
    //自定义属性
    public onupdate(modelId, quality: number = -1, num: number = 0) {
        this.modelId = modelId;
        if (quality < 0)
            this.quality = this.model.quality;
        else
            this.quality = quality;
        this.num = num;
    }
    //返回model
    public get model(): ModelThing {
        var _model: ModelThing = GameCommon.getInstance().getThingModel(this.type, this.modelId, this.quality);
        return _model;
    }

    public get idKey(): string {
        return this.type + "_" + this.modelId;
    }

    public get asAward(): AwardItem {
        return new AwardItem(this.type, this.modelId, this.num);
    }
    //The end

}
enum GoodsQuality {
    /** 物品品质 */
    White = 0,
    Green = 1,
    Blue = 2,
    Purple = 3,
    Orange = 4,
    Red = 5,
    Gold = 6,//暗金
}