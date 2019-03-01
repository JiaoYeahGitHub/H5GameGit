/**
 *动画对象类 
 **/
class Animation extends egret.DisplayObjectContainer {
    protected _mcFactory: egret.MovieClipDataFactory;
    protected _resName: string;//当前的资源名
    protected _movieClip: egret.MovieClip;
    protected _playNum: number = -1;
    protected _autoRemove: boolean;
    protected _actionName: string;
    protected _frame;
    protected _loadingUrl: string;//正在加载的URL
    /**
     * resName 资源名称 （前缀）
     * playNum 播放次数
     * autoRemove 播放完成后是否自动移除
     * frame 帧标签
     ***/
    public constructor(resName: string, playNum: number = -1, autoRemove: boolean = false, frame = null, actionName: string = "action") {
        super();
        this._movieClip = new egret.MovieClip();
        this._mcFactory = new egret.MovieClipDataFactory();
        this._movieClip.touchEnabled = false;
        this._actionName = actionName;
        this._playNum = playNum;
        this._frame = frame == null ? 1 : frame;
        this.autoRemove = autoRemove;

        this.onLoadHandler(resName);
    }
    // 设置特效是否可以被点击
    public setTouch(isCanTouch: boolean) {
        this._movieClip.touchEnabled = isCanTouch;
    }
    //加载动画资源
    public onUpdateRes(resName: string, playNum: number, frame = null, actionName: string = "action") {
        this._actionName = actionName;
        this._playNum = playNum;
        this._frame = frame == null ? 1 : frame;
        this.onLoadHandler(resName);
    }
    protected onLoadHandler(resName: string): void {
        if (!resName) return;
        this.onRemoveCallBack();
        if (this._resName != resName) {
            this.onDisposeTextrue();
            this._loadingUrl = resName;
            this._resName = resName;
            this.removeChildren();
            LoadManager.getInstance().loadRes(this);
        } else {
            if (!this._loadingUrl) {
                this.playNum = this._playNum;
            }
        }
    }
    /**重新载入**/
    public onReLoad(): void {
        if (this._playNum == -1) {
            let loadUrl: string = this._resName;
            this._resName = null;
            this.onLoadHandler(loadUrl);
        }
    }
    //获取当前的资源名
    public get resName(): string {
        return this._resName;
    }
    //控制播放帧标签
    public onFrame(resName: string, frame: any): void {
        if (frame && this._frame != frame) {
            this._frame = frame;
            this.onLoadHandler(resName);
        }
    }
    // public onFrame1(frame: any): void {
    //     if (frame && this._frame != frame) {
    //         this._frame = frame;
    //     }
    //     if (!this._onLoading) {
    //         this.onPlay();
    //     }
    // }
    //播放完回调
    protected callback;
    protected callObj;
    protected callparam;
    public playFinishCallBack(callback, callobj, callparam = null): void {
        if (!callback || !callobj) return;
        if (this._playNum <= 0) return;
        this.callback = callback;
        this.callObj = callobj;
        this.callparam = callparam;
        if (this._autoRemove) {
            return;
        }
        if (this._loadingUrl) {
            return;
        }
        if (this._movieClip) {
            this._movieClip.addEventListener(egret.Event.COMPLETE, this.onFinishCallBack, this);
        }
    }
    private onFinishCallBack(): void {
        if (this.callback) {
            Tool.callback(this.callback, this.callObj, this.callparam);
        }
        this.onRemoveCallBack();
    }
    public onRemoveCallBack(): void {
        this.callback = null;
        this.callObj = null
        this.callparam = null;
        if (this._movieClip) {
            this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onFinishCallBack, this);
        }
    }
    //控制播放次数
    public set playNum(playNum) {
        this._playNum = playNum;
        if (playNum == 0) {
            this.onStop();
        } else {
            this.onPlay();
        }
    }
    //是否自动移除
    public set autoRemove(autoRemove: boolean) {
        this._autoRemove = autoRemove;
        if (this._autoRemove) {
            if (this._playNum < 0) {
            } else if (this._playNum == 0) {
                this.onDestroy();
            } else if (this._playNum > 0) {
                this._movieClip.addEventListener(egret.Event.COMPLETE, this.onDestroy, this);
            }
        } else {
            this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onDestroy, this);
        }
    }
    //修改帧速率
    public set frameRate(value: number) {
        if (!this._movieClip) return;
        if (value > 0) {
            this._movieClip.frameRate = value;
        } else {
            if (this._movieClip.movieClipData) {
                this._movieClip.frameRate = this._movieClip.movieClipData.frameRate;
            }
        }
    }
    //加载完成处理
    private onLoadComplete(resName): void {
        if (resName != this._resName || !this._movieClip)
            return;
        this._loadingUrl = null;
        var resJson: string = resName + "_json";
        var resPng: string = resName + "_png";
        var _animJson = RES.getRes(resJson);
        if (!_animJson) {
            this.onFinishCallBack();
            return;
        }

        var _animTexture: egret.Texture = RES.getRes(resPng);
        if (this._mcFactory) {
            this._mcFactory.clearCache();
        }
        this._mcFactory.mcDataSet = _animJson;
        this._mcFactory.texture = _animTexture;
        this._movieClip.movieClipData = this._mcFactory.generateMovieClipData(this._actionName);
        if (!this._movieClip.parent) {
            this.addChildAt(this._movieClip, 0);
        }
        this.playFinishCallBack(this.callback, this.callObj, this.callparam);
        this.playNum = this._playNum;

        this.dispatchEvent(new egret.Event(GameEvent.ANIMATION_LOAD_COMPLETE));
    }
    //播放动画
    public onPlay(): void {
        if (!this._movieClip || !this._movieClip.parent) {
            return;
        }
        try {
            // this._movieClip.gotoAndPlay(this._frame, this._playNum);
            this._movieClip.gotoAndPlay(1, this._playNum);
        } catch (e) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                Tool.throwException("模型动画资源出错：res：" + this._resName);
            } else {
                this._movieClip.stop();
            }
        }
    }
    //暂停
    public onStop(): void {
        if (!this._movieClip || !this._movieClip.parent) {
            return;
        }

        try {
            this._movieClip.gotoAndStop(1);
        } catch (e) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                Tool.throwException("模型动画资源出错：res：" + this._resName);
            } else {
                this._movieClip.stop();
            }
        }
    }
    //跳到某一帧停止
    public gotoAndStop(frame): void {
        if (this._movieClip && !this._loadingUrl) {
            this._movieClip.gotoAndStop(frame);
        }
    }
    //跳到某一帧播放
    public gotoAndPlay(frame): void {
        if (this._movieClip && !this._loadingUrl) {
            this._movieClip.gotoAndPlay(frame);
        }
    }
    //销毁动画
    public onDestroy(): void {
        this._frame = null;
        if (this.parent) {
            this.parent.removeChild(this);
        }
        try {
            if (this._movieClip) {
                this.onFinishCallBack();
                this._movieClip.removeEventListener(egret.Event.LOOP_COMPLETE, this.onDestroy, this);
                this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onDestroy, this);
                if (this._movieClip.parent) {
                    this._movieClip.parent.removeChild(this._movieClip);
                }
                this._movieClip.stop();
                this._movieClip = null;
            }
        } catch (e) {
            Tool.log("error - sprite movieFinish");
        }
        this.onDisposeTextrue();
    }

    public onDisposeTextrue(): void {
        this._loadingUrl = null;
    }

    public get currFrameTexture(): egret.Texture {
        if (this._movieClip && this.currFrameData) {
            // var animTexture: egret.Texture = this._movieClip.movieClipData.getTextureByFrame(this._movieClip.currentFrame);
            return this._movieClip.movieClipData.spriteSheet.getTexture(this.currFrameData.res);
        }
        return null;
    }
    public get currFrameData(): any {
        if (this._movieClip.movieClipData && this._movieClip.currentFrame) {
            return this._movieClip.movieClipData.getKeyFrameData(this._movieClip.currentFrame);
        }
        return null;
    }
}