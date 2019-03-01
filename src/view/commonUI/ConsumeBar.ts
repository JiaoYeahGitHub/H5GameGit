// TypeScript file
class ConsumeBar extends eui.Component {
    private isLoaded: boolean;
    private _model: ModelThing;
    private consume_num_label: eui.Label;
    public consume_name_label: eui.Label;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.ConsumeBarSkin;
    }
    private onLoadComplete(): void {
        this.isLoaded = true;
        if (this._model)
            this.setConsumeModel(this._model);
    }
    public set nameColor(color: number) {
        this.consume_name_label.textColor = color;
    }
    public setCostByAwardItem(cost: AwardItem, limitGoodsId: number = -1): void {
        this.setConsume(cost.type, cost.id, cost.num, limitGoodsId);
    }
    public setConsume(type: GOODS_TYPE, id: number, consumenum: number = 1, limitGoodsId: number = -1): void {
        switch (type) {
            case GOODS_TYPE.MASTER_EQUIP:
            case GOODS_TYPE.SERVANT_EQUIP:
            case GOODS_TYPE.ITEM:
            case GOODS_TYPE.BOX:
                this.setConsumeModel(GameCommon.getInstance().getThingModel(type, id), consumenum, limitGoodsId);
                break;
            default:
                this.setConsumeByCurrency(GameCommon.getInstance().getThingModel(type, id), consumenum);
                break;
        }
    }
    private setConsumeModel(model: ModelThing, consumenum: number = 1, limitGoodsId: number = -1) {
        this._model = model;
        if (this.isLoaded) {
            // var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.id);
            // var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
            var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.id, model.type);
            if (limitGoodsId != -1) {
                var limitThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(limitGoodsId);
                if (limitThing) {
                    _hasitemNum += limitThing.num;
                }
            }
            // this.consume_icon.source = model.icon;
            // var itemnameHtmlstr: string = "<font color='#" + GameCommon.Quality_Color_String[model.quality] + "'>" + model.name + "</font>";
            this.consume_name_label.text = model.name + ':'//textFlow = (new egret.HtmlTextParser()).parse(itemnameHtmlstr);
            if (_hasitemNum >= consumenum)
                this.consume_num_label.textColor = 0x00dd26;
            else
                this.consume_num_label.textColor = 0xf31313;
            this.consume_num_label.textFlow = (new egret.HtmlTextParser).parser(_hasitemNum + "/" + consumenum);
        }
    }
    private setConsumeByCurrency(model: ModelThing, consumenum: number = 1) {
        this._model = model;
        if (this.isLoaded) {
            var _hasitemNum: number;
            var itemnameHtmlstr: string = "";
            this.consume_name_label.text = model.name + ':';
            // this.consume_icon.source = model.icon;
            _hasitemNum = DataManager.getInstance().playerManager.player.getICurrency(model.type);
            // itemnameHtmlstr = "<font color='#" + GameCommon.Quality_Color_String[model.quality] + "'>" + model.name + "</font>";
            if (_hasitemNum >= consumenum)
                this.consume_num_label.textColor = 0x00dd26;
            else
                this.consume_num_label.textColor = 0xf31313;

            this.consume_num_label.textFlow = (new egret.HtmlTextParser).parser(_hasitemNum + "/" + consumenum);
        }
    }
    public get model(): ModelThing {
        return this._model;
    }
    //The end
}