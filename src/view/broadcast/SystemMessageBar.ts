class SystemMessageBar extends egret.DisplayObjectContainer {
    private messageGroup: eui.Group;
    private messageScroller: eui.Scroller;
    private _isPlaying: boolean;
    private channel: EBroadcastChannel;
    private isInit: boolean;
    public constructor(channel: EBroadcastChannel) {
        super();
        this.y = 0;
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.channel = channel;
    }
    private onAddToStage(event: egret.Event): void {
        this.isInit = true;
        this.touchEnabled = false;
        this.touchChildren = false;
        var ui: eui.UILayer = new eui.UILayer();
        ui.touchEnabled = false;
        this.addChild(ui);
        this.messageGroup = new eui.Group();
        this.messageScroller = new eui.Scroller();
        this.messageScroller.width = 560;
        this.messageScroller.height = 30;
        this.messageScroller.x = 70;
        this.messageScroller.y = 6;
        this.messageScroller.touchEnabled = false;
        this.messageScroller.viewport = this.messageGroup;
        ui.addChild(this.messageScroller);
        if (DataManager.getInstance().broadcastManager.getMessageArray.length > 0)
            this.onMessageMove();
    }

    //this.onCreateLabel("严禁使用外挂，加速器软件等作弊手段，一经发现即作封号处罚",0xdfef2c,25); 

    /**
     * name
     */
    public onMessageMove() {
        if (!this.isInit)
            return;

        if (this._isPlaying)
            return;
        this._isPlaying = true;
        var broadcastArray: Array<BroadcastBase> = DataManager.getInstance().broadcastManager.getMessageArray(this.channel);
        if (broadcastArray.length > 0) {
            this.messageGroup.removeChildren();
            var _messageData: BroadcastBase = broadcastArray.shift();
            if (_messageData.str != "") {
                var _messageLabel: eui.Label = this.onCreateLabel(_messageData.str);
                this.messageGroup.addChild(_messageLabel);
                this.messageScroller.viewport.scrollH = -this.messageScroller.width - 50;
                var _moveTween = egret.Tween.get(this.messageScroller.viewport);
                _moveTween.to({ scrollH: _messageLabel.textWidth }, 20000);
                _moveTween.call(function (): void {
                    this._isPlaying = false;
                    egret.Tween.removeTweens(this.messageScroller.viewport);
                    _moveTween = null;
                    this.onMessageMove();
                }, this);
            } else {
                this.onMessageMove();
            }
        } else {
            this.onDestroy();
        }
    }

    private onDestroy() {
        if (this.parent) {
            this.removeChildren();
            this.parent.removeChild(this);
            egret.Tween.removeTweens(this.messageScroller.viewport);
        }
    }

    /*
     * 添加跑马灯广播调用这个函数即可
     */
    private onCreateLabel(str: string): eui.Label {
        var _label: eui.Label = new eui.Label();
        _label.size = 22;
        _label.bold = true;
        _label.fontFamily = GameCommon.getFontFamily();
        _label.textFlow = (new egret.HtmlTextParser).parser(str);
        //       _label.textColor = 0xffff00;
        // _label.strokeColor = 0x000000;
        // _label.stroke = 1;
        return _label;
    }
}