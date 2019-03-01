class PsychInstance extends eui.Component {
    private item_back: eui.Image;
    private item_icon: eui.Image;
    private label_0: eui.Label;
    private label_1: eui.Label;
    private jobLayer: eui.Group;
    private label_race: eui.Label;
    private _thing: PsychBase;
    private _type: number = 0;
    private _own: number;
    private _pos: number;
    private btn: eui.CheckBox;
    private selectLayer: eui.Group;
    private selectedAnim: Animation;
    private label_lock: eui.Label;
    public constructor(pos: number) {
        super();
        this._pos = pos;
        this.skinName = skins.PsychInstanceSkin;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    public onUpdate(param: PsychBase, type: number, own: number) {
        this._thing = param;
        this._type = type;
        this._own = own;
        this.refresh();
    }
    public get pos() {
        return this._pos;
    }
    public set pos(param) {
        this._pos = param;
    }
    public onChangeCheckBox() {
        this.btn.selected = this._thing.seletced;
    }
    protected refresh() {
        switch (this._type) {
            case PSYCHSTATE_TYPE.LOCK:
                this.currentState = "lock";
                this.item_back.source="bag_whiteframe_png";
                this.item_icon.source = "";
                this.label_lock.text = PsychDefine.PSYCH_SLOT_LOCK[this.pos];
                this.label_0.textFlow = [];
                this.label_1.textFlow = [];
                return;
            case PSYCHSTATE_TYPE.NONE:
                this.currentState = "none";
                this.item_back.source="bag_whiteframe_png";
                this.item_icon.source = "";
                this.label_0.textFlow = [];
                this.label_1.textFlow = [];
                return;
            case PSYCHSTATE_TYPE.SHOWLV:
                this.item_back.source = GameCommon.getInstance().getIconFrame(this._thing.model.pinzhi);
                this.item_icon.source = this._thing.model.icon;
                this.label_0.textFlow = [];
                this.label_1.textFlow = [];
                break;
            case PSYCHSTATE_TYPE.SHOWNAME_AND_BG:
                this.currentState = "normal";
                this.label_0.textFlow = new Array<egret.ITextElement>({ text: this._thing.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._thing.model.pinzhi) } });
                this.label_1.textFlow = [];
                this.item_back.source = GameCommon.getInstance().getIconFrame(this._thing.model.pinzhi);
                this.item_icon.source = this._thing.model.icon;
                break;
            case PSYCHSTATE_TYPE.SHOWNAME:
                this.currentState = "normal";
                this.label_0.textFlow = new Array<egret.ITextElement>({ text: this._thing.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._thing.model.pinzhi) } });
                this.label_1.textFlow = [];
                this.item_back.source = GameCommon.getInstance().getIconFrame(this._thing.model.pinzhi);
                this.item_icon.source = this._thing.model.icon;
                
                break;
            case PSYCHSTATE_TYPE.SELECT:
                this.currentState = "select";
                this.label_0.textFlow = new Array<egret.ITextElement>({ text: this._thing.model.name, style: { "textColor": 0xE9DEB3 } });
                this.label_1.textFlow = new Array<egret.ITextElement>({ text: `战力:${this._thing.fightValue}`, style: { "textColor": 0xE9DEB3 } });
                this.item_back.source = GameCommon.getInstance().getIconFrame(this._thing.model.pinzhi);
                this.item_icon.source = this._thing.model.icon;
                this.onChangeCheckBox();
                break;
            case PSYCHSTATE_TYPE.NOLABEL:
                this.currentState = "noLabel";
                this.item_back.source = GameCommon.getInstance().getIconFrame(this._thing.model.pinzhi);
                this.item_icon.source = this._thing.model.icon;
                this.label_0.textFlow = [];
                this.label_1.textFlow = [];
                break;
        }
    }
    public get thing() {
        return this._thing;
    }
    public playSmelt() {
        if (!this._thing) return;
        var aniSmelt = new Animation("ronglianchenggong", 1, true);
        aniSmelt.x = this.width / 2;
        aniSmelt.y = this.height / 2 - 20;
        this.addChild(aniSmelt);
    }
    public set selected(bl: boolean) {
        this.selectLayer.visible = bl;
        if (bl) {
            if (!this.selectedAnim) {
                this.selectedAnim = new Animation("zhuangbeixuanzhong", -1);
                this.selectLayer.addChild(this.selectedAnim);
                this.selectedAnim.scaleX = this.selectedAnim.scaleY = 0.6;
            }
            this.selectedAnim.onPlay();
        } else {
            if (this.selectedAnim) {
                this.selectedAnim.onStop();
            }
        }
    }
    public onTouch(event: egret.TouchEvent): void {
        // if (!this._data) return;
        // switch (this.currentState) {
        //     case "normal":
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DominatePanel");
        //         break;
        //     case "select":

        //         break;
        // }
    }
    public get position() {
        if (this._thing) {
            return this._thing.slot;
        } else {
            return -1;
        }

    }
    //The end
}
enum PSYCHSTATE_TYPE {
    LOCK = -1,
    NONE = 0,
    SHOWLV = 1,
    SHOWNAME = 2,
    SHOWNAME_AND_BG = 3,
    SELECT = 4,
    NOLABEL = 5,
}
