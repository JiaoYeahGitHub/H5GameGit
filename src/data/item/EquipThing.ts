// TypeScript file
class EquipThing extends ThingBase {
    public equipId;
    public playerIndex: number;//穿在了哪个人身上 序号
    public position;//穿在身上的位置
    public selected: boolean = false;
    public smeltSot: number;
    public issmelt: boolean;//是否已熔炼
    public constructor(type: GOODS_TYPE = GOODS_TYPE.MASTER_EQUIP) {
        super(type);
        this._addAttributes = GameCommon.getInstance().getAttributeAry();
    }

    public parseEquipMessage(msg: Message): void {
        this.equipId = msg.getShort();
        this.modelId = msg.getShort();
        this.quality = msg.getByte();
        var attrsize: number = msg.getByte();
        for (var i: number = 0; i < attrsize; i++) {
            var attrIndex: number = msg.getByte();
            var attrValue: number = msg.getInt();
            this._addAttributes[attrIndex] = attrValue;
        }
    }
    //浮动属性
    protected _addAttributes;//浮动属性
    public get addAttributes(): number[] {
        if (this.quality == GoodsQuality.Red || this.quality == GoodsQuality.Gold) {
            this._addAttributes = GameCommon.getInstance().getRedEquipAddAttr(this.modelId);
        // } else if (this.quality == GoodsQuality.Gold) {
        //     this._addAttributes = this.model.addEffect;
        }
        return this._addAttributes;
    }
    //装备基础属性
    public get attributes(): number[] {
        return this.model.equipAttr;
    }
    public get idKey(): string {
        return this.type + "_" + this.equipId;
    }
    //装备评分 = 装备基础属性的战斗力 + 浮动值的战斗力
    public get pingfenValue(): number {
        if (this.type == GOODS_TYPE.MASTER_EQUIP) {
            if(this.model){
                var basicPingfen: number = this.model.pingfenValue;
                return this.quality <= GoodsQuality.Red ? basicPingfen + GameCommon.calculationFighting(this.addAttributes) : basicPingfen;
            }else{
                return 0;
            }
        } else {
            return GameCommon.calculationFighting(this.model.equipAttr);
        }
    }
    //The end
}