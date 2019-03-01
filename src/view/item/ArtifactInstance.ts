/**
 * 灵器
 */
class ArtifactInstance extends GoodsInstance {

    public thingdata: ServantEquipThing;

    constructor() {
        super();
    }

    public onThing(thing: ServantEquipThing, isShowName: boolean = true): void {
        this.thingdata = thing;
        this.type = thing.type;
        this.id = thing.modelId;
        this.quality = thing.quality;
        this.num = thing.num;
        this.model = thing.model;
        this.name_label.visible = isShowName;
        this.refresh();
    }

    public refresh() {
        super.refresh();
        // this.num_label.text = "+" + this.thingdata.star;
        this.num_label.bottom = 100;
    }

    public setDefault(text: string = "", icon: string = "") {
        this.onReset();
        this.name_label.text = text;
        this.item_icon.source = icon;
    }

    public onReset() {
        this.thingdata = null;
        super.onReset();
    }

    public onTouch(event: egret.TouchEvent): void {

    }
}