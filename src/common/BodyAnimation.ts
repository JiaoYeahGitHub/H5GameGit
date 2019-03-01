/**
 *动画对象类 
 **/
class BodyAnimation extends Animation {
    private targetLoadUrl: string;//目标URL
    /**
     * resName 资源名称 （前缀）
     * playNum 播放次数
     * autoRemove 播放完成后是否自动移除
     * frame 帧标签
     ***/
    public constructor(resName: string, playNum: number, frame, actionName: string = "action") {
        super(resName, playNum, false, frame, actionName);
    }
    //加载动画资源
    public onUpdateRes(resName: string, playNum, frame, actionName: string = "action") {
        super.onUpdateRes(resName, playNum, frame, actionName);
    }
    protected onLoadHandler(resName: string): void {
        if (!resName) return;
        //1.如果正在加载 只要保持跟当前正在加载URL不一致即可
        if (this.targetLoadUrl && this.targetLoadUrl == resName) return;
        //2.如果没有正在加载资源 那只要不跟当前的资源一致即可
        else if (!this.targetLoadUrl && this._resName == resName) {
            this.playNum = this._playNum;
            return;
        }

        // this.onRemoveCallBack();
        this.targetLoadUrl = resName;
        if (this._movieClip) {
            this._movieClip.stop();
        }
        if (!this._loadingUrl) {
            this._loadingUrl = resName;
            LoadManager.getInstance().loadThingModel(this, this._loadingUrl);
        }
    }
    //播放动画
    public onPlay(): void {
        if (this._loadingUrl) {
            if (this._movieClip) {
                this._movieClip.stop();
            }
        } else {
            super.onPlay();
        }
    }
    //加载完成处理
    private onLoadBodyComplete(resName, animJson, animTexture): void {
        if (!this._loadingUrl) return;
        // LoadManager.getInstance().onDestoryByBodyAnim(this._resName);
        this._resName = resName;
        if (resName != this.targetLoadUrl) {
            this._loadingUrl = this.targetLoadUrl;
            LoadManager.getInstance().loadThingModel(this, this._loadingUrl);
        } else {
            this._loadingUrl = null;
            this.targetLoadUrl = null;
        }
        if (this._movieClip && animJson && animTexture) {
            if (this._mcFactory) {
                this._mcFactory.clearCache();
                // this._mcFactory = null;
            }
            // this._mcFactory = new egret.MovieClipDataFactory();
            this._mcFactory.mcDataSet = animJson;
            this._mcFactory.texture = animTexture;
            this._movieClip.movieClipData = this._mcFactory.generateMovieClipData(this._actionName);
            if (!this._movieClip.parent) {
                this.addChildAt(this._movieClip, 0);
            }
            this.addChildAt(this._movieClip, 0);
            this.playFinishCallBack(this.callback, this.callObj, this.callparam);
            this.playNum = this._playNum;
        }
    }
    public onDisposeTextrue(): void {
        this.targetLoadUrl = null;
        this._loadingUrl = null;
    }
    //The end
}