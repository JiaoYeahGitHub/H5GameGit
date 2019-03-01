class GameLoadingLayer extends eui.Component {
    private _owner: ModuleLayer;
    // private loading_bar: eui.Group;
    // private poetry_scroll: eui.Scroller;
    // private backImg: eui.Image;
    // private poetryImg: eui.Image;

    private isloading: boolean;
    private callback;
    private thisObject;
    private imgs: string[];
    private imgIdx;
    public constructor(owner: ModuleLayer) {
        super();
        this._owner = owner;
        // this.skinName = GameSkin.getLoadingMapView();
    }

    public startLoading(callback, thisObject, imgs: string[]): void {
        this.isloading = true;
        this.callback = callback;
        this.thisObject = thisObject;
        this.imgs = imgs;
        // this.loading_bar.visible = true;
        // this.poetry_scroll.visible = false;

        if (this.imgs) {
            this.imgIdx = 0;
            this.loadImgs();
        } else {
            this.loadFinish();
        }
    }

    private loadImgs() {
        if (this.imgIdx < this.imgs.length) {
            var resKey: string = this.imgs[this.imgIdx++];
            if (RES.hasRes(resKey)) {
                if (RES.getRes(resKey)) {
                    this.loadImgs();
                } else {
                    RES.getResAsync(resKey, this.loadImgs, this);
                }
            } else {
                this.loadImgs();
            }
        } else {
            this.loadFinish();
        }
    }

    private loadFinish() {
        if (this.isloading) {
            this.isloading = false;
            Tool.callback(this.callback, this.thisObject);
            this.callback = null;
            this.thisObject = null;
        }
    }

    public close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    //The end
}