class NpcBody extends ActionBody {
    protected _body: BodyAnimation;

    public constructor() {
        super();
    }
    protected onInitBodyHead(): void {
        super.onInitBodyHead();
        this.bodyHead.hpProBarSkinName(skins.Npc_HpProBar_Skin);
    }
    //NPC数据
    public set data(data: NpcData) {
        egret.superSetter(NpcBody, this, "data", data);
    }
    public get data(): NpcData {
        return this._data;
    }
    public onRefreshData(): void {
        super.onRefreshData();
    }
    //更换动作
    protected updateAction(): void {
        this.onChangeBody();
    }
    //更换方向
    protected updateDirection(): void {
    }
    //更新模型
    public onChangeBody(): void {
        if (this._data && this._data.modelId) {
            var resName = LoadManager.getInstance().getNpcResUrl(this._data.modelId, this.actionName);
            if (!this._body) {
                this._body = new BodyAnimation(resName, this._actionPlayNum, null);
                this.bodyLayer.addChildAt(this._body, PLAYER_LAYER.BODY);
            } else {
                this._body.onUpdateRes(resName, this._actionPlayNum, null);
            }
        }
    }
    //缩放修改
    public onScaleHandler(value: number): void {
        if (this._body) {
            this._body.scaleX = Tool.isNumber(value) ? value : 1;
            this._body.scaleY = Tool.isNumber(value) ? value : 1;
        }
    }
    //读条事件
    private waitBar: eui.Component;
    private waitIntervalId: number = -1;
    public onBodyWaiting(waitTime: number, compFunc, funcObj, waitDesc: string = "", probarSkin: any = skins.HpProgressBar1): void {
        if (!this.waitBar) {
            this.waitBar = new eui.Component();
            this.waitBar.skinName = skins.BodyHead;
            this.topLayer.addChild(this.waitBar);
            this.waitBar.x = this.bodyHead.x;
            this.waitBar.y = this.bodyHead.y;
            (this.waitBar["hpBar"] as eui.ProgressBar).maximum = 100;
            this.bodyHead.visible = false;
        }
        if (this.waitIntervalId >= 0) {
            egret.clearTimeout(this.waitIntervalId);
            this.waitIntervalId = -1;
        }
        (this.waitBar["nameLabel"] as eui.Label).text = waitDesc;
        (this.waitBar["hpBar"] as eui.ProgressBar).skinName = probarSkin;
        (this.waitBar["hpBar"] as eui.ProgressBar).slideDuration = 0;
        (this.waitBar["hpBar"] as eui.ProgressBar).value = 0;
        (this.waitBar["hpBar"] as eui.ProgressBar).slideDuration = waitTime;
        (this.waitBar["hpBar"] as eui.ProgressBar).value = 100;
        this.waitIntervalId = Tool.callbackTime(this.onWaitComplete, this, waitTime, compFunc, funcObj);
    }
    private onWaitComplete(compFunc, funcObj): void {
        if (this.waitBar) {
            this.waitBar.removeChildren();
            if (this.waitBar.parent)
                this.waitBar.parent.removeChild(this.waitBar);
            this.waitBar = null;
        }
        this.bodyHead.visible = true;
        egret.clearTimeout(this.waitIntervalId);
        this.waitIntervalId = -1;
        Tool.callback(compFunc, funcObj);
    }
    public onReset(): void {
        super.onReset();
        this.scaleX = 1;
        this.scaleY = 1;
    }
    //The end
}
enum NPC_BODY_TYPE {
    NONE = 0,
    JACKAROO1 = 1,//新手NPC1
    JACKAROO2 = 2,//新手NPC2
    JACKAROO3 = 3,//新手NPC3
    SIXIANG = 3,//四象的守护NPC
}