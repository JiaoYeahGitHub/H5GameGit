class PlayerMessageBar extends egret.DisplayObjectContainer {
    private messageGroup: eui.Group;
    private messageScroller: eui.Scroller;
    private _targetPosX: number;
    private channel: EBroadcastChannel;
    public constructor(channel: EBroadcastChannel) {
        super();
        this.channel = channel;
        this.onInit();
    }

    private onInit(): void {
        this.touchEnabled = false;
        this.touchChildren = false;
        var ui: eui.UILayer = new eui.UILayer();
        ui.touchEnabled = false;
        this.addChild(ui);

        let viewmask: egret.Shape = new egret.Shape();
        viewmask.graphics.clear();
        viewmask.graphics.beginFill(0, 0.5);
        viewmask.graphics.drawRect(0, 0, 630, 35);
        viewmask.graphics.endFill();

        this.messageGroup = new eui.Group();
        this.messageScroller = new eui.Scroller();
        this.messageScroller.width = 630;
        this.messageScroller.height = 35;
        this.messageScroller.x = 0;
        this.messageScroller.y = 0;
        this.messageScroller.touchEnabled = false;
        this.messageScroller.viewport = this.messageGroup;

        ui.addChild(viewmask);
        ui.addChild(this.messageScroller);
    }

    public onshowMessage(): void {
        if (this.isPlaying) return;
        var broadcastArray: Array<BroadcastBase> = DataManager.getInstance().broadcastManager.getMessageArray(this.channel);
        if (broadcastArray.length > 0) {
            this.messageGroup.removeChildren();
            var _messageData: BroadcastBase = broadcastArray.shift();
            if (_messageData.str != "") {
                var _messageLabel: eui.Label = this.onCreateLabel(_messageData.str);
                _messageLabel.y = 5;
                this.messageGroup.addChild(_messageLabel);
                this.messageScroller.viewport.scrollH = -this.messageScroller.width - 50;
                this._targetPosX = _messageLabel.textWidth;
            } else {
                this.onshowMessage();
            }
        } else {
            this.onDestroy();
        }
    }

    public onMessageMove() {
        if (this.isPlaying) {
            this.messageScroller.viewport.scrollH += 2;
            if (this.messageScroller.viewport.scrollH >= this._targetPosX) {
                this._targetPosX = null;
                this.onshowMessage();
            }
        } else {
            this.onshowMessage();
        }
    }
    public get isPlaying(): boolean {
        return Tool.isNumber(this._targetPosX);
    }
    private onDestroy() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this._targetPosX = null;
    }
    /*
     * 添加跑马灯广播调用这个函数即可
     */
    private onCreateLabel(str: string): eui.Label {
        var _label: eui.Label = new eui.Label();
        _label.size = 24;
        _label.fontFamily = GameCommon.getFontFamily();
        _label.textFlow = (new egret.HtmlTextParser).parser(str);
        _label.stroke = 0;
        return _label;
    }
}