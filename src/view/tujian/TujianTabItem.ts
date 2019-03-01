class TujianTabItem extends BaseComp {
    private tab_back: eui.Image;
    private tab_face: eui.Image;

    public type: number;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.TujianTabItemSkin;
    }
    protected onInit(): void {
        if (this._tabBack) {
            this.tabBack = this._tabBack;
        }
        if (this._tabFace) {
            this.tabFace = this._tabFace;
        }
    }
    private _tabBack: string;
    public set tabBack(path: string) {
        this._tabBack = path;
        if (this.tab_back) {
            this.tab_back.source = path;
        }
    }
    private _tabFace: string;
    public set tabFace(path: string) {
        this._tabFace = path;
        if (this.tab_face) {
            this.tab_face.source = path;
        }
    }
}