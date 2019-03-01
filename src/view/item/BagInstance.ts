// TypeScript file
class BagInstance extends GoodsInstance {
    public thingdata: ThingBase;

    constructor() {
        super();
    }
    public onThing(thing: ThingBase): void {
        this.thingdata = thing;
        this.type = thing.type;
        this.id = thing.modelId;
        this.quality = thing.quality;
        this.num = thing.num;
        this.model = thing.model;
        if (this.type == GOODS_TYPE.GEM) {
            this.lv = thing.model.level;
        }
        if (!this.model) return;
        this.refresh();
    }
    public onReset() {
        this.thingdata = null;
        super.onReset();
    }
    public onTouch(event: egret.TouchEvent): void {
        if (this._bl) return;
        if (!this.thingdata)
            return;
        var uid: number = 0;
        var tipsType: number = INTRODUCE_TYPE.IMG;
        if (this.type == GOODS_TYPE.MASTER_EQUIP) {
            uid = (this.thingdata as EquipThing).equipId;
            tipsType = INTRODUCE_TYPE.EQUIP;
        } else if (this.type == GOODS_TYPE.SERVANT_EQUIP) {
            uid = (this.thingdata as ServantEquipThing).equipId;
            tipsType = INTRODUCE_TYPE.EQUIP;
        } else if (this.type == GOODS_TYPE.BOX) {
            tipsType = INTRODUCE_TYPE.BOX;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar",
                new IntroduceBarParam(tipsType, this.type, this.thingdata, uid)
            )
        );
    }
    //The end
}