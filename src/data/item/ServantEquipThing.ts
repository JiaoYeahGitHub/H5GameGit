// TypeScript file
class ServantEquipThing extends EquipThing {

    public constructor(type: GOODS_TYPE = GOODS_TYPE.SERVANT_EQUIP) {
        super(type);
    }

    public parseMessage(msg: Message): void {
        this.equipId = msg.getShort();
        this.modelId = msg.getShort();
        this.quality = this.model.quality;
    }

    public get addAttributes(): number[] {
        return this._addAttributes;
    }
    //返回model
    public get model(): ModelThing {
        var _model: ModelThing = GameCommon.getInstance().getThingModel(this.type, this.modelId);
        return _model;
    }
}
class ServantEquipSlot {
    public type: BLESS_TYPE;
    public slot;//槽位索引
    public intensifyLv = 0;//强化等级

    public constructor(type: BLESS_TYPE, slot: number) {
        this.type = type;
        this.slot = slot;
    }

    public parseMessage(msg: Message): void {
        this.intensifyLv = msg.getShort();
    }
    //The end
}