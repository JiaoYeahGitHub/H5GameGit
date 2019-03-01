// TypeScript file
class BaseWindowPanel extends eui.Component {
    protected funcID: number = -1;
    protected _isShow: boolean;
    protected basic: eui.Component;
    protected owner: ModuleLayer;
    protected points: redPoint[] = RedPointManager.createPoint(0);
    protected isloadComp: boolean;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.I;

    constructor(owner: ModuleLayer) {
        super();
        this.owner = owner;
        this.basic = new eui.Component();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    //添加到舞台
    private onAddToStage(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LOADING_OPEN));
        this.onSkinName();
    }
    //皮肤加载完成
    private onLoadComplete(): void {
        this.isloadComp = true;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LOADING_CLOSE));
        this.onInit();
        if (this._isShow) {
            this.showHandler();
            this.onRegist();
        }
        if (SDKManager.isIphone && SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
            this.onHideIOSBanWord(this);
        }
    }
    //供子类覆盖
    protected onInit(): void {
    }
    //添加到舞台触发
    // protected onAddedHandler(event: egret.Event): void {
    // }
    protected onRefresh(): void {
    }
    protected onSkinName(): void {
    }
    public onShow(): void {
        if (this.funcID != -1 && FunDefine.onIsLockandErrorHint(this.funcID)) return;
        if (this.parentLayer) {
            if (!this._isShow) {
                this._isShow = true;
                this.onAddToWindowLayer();
                if (this.isloadComp) {
                    this.onRegist();
                    this.onRefresh();
                }
            }
        }
    }
    private onAddToWindowLayer(): void {
        this.parentLayer.addChild(this);
        if (this.isloadComp) {
            this.showHandler();
        }
    }
    private showHandler(): void {
        if (this.priority == PANEL_HIERARCHY_TYPE.II) {
            this.owner.onShowOrHideMaskView();
            this.height = GameDefine.GAME_STAGE_HEIGHT;
            this.y = size.height - GameDefine.GAME_STAGE_HEIGHT;
        } else {
            if (this.basic) {
                this.basic.height = size.height;
                if (!DataManager.IS_PC_Game) {
                    if (size.height <= GameDefine.GAME_STAGE_HEIGHT) {
                        this.scaleY = (size.height - 50) / size.height;
                        this.y = 50;
                    } else {
                        this.basic.height = GameDefine.GAME_STAGE_HEIGHT;
                        this.y = size.height - GameDefine.GAME_STAGE_HEIGHT;
                    }
                }

                if (!DataManager.IS_PC_Game) {
                    this.basic.width = size.width;
                    this.width = size.width;
                    this.x = (GameDefine.GAME_STAGE_WIDTH - size.width) / 2;
                }
            }
        }

        if (this.basic && this.basic['mainbtnbarLayer']) {
            this.owner.mainbtnbarUI.addToLayer(this.basic['mainbtnbarLayer']);
        }
        this.updateCurreny();
        // TweenLiteUtil.openWindowEffect(this);
    }
    public onShowWithParam(param): void {
        this.onShow();
    }
    protected onRegist(): void {
        if (this.basic["money_bind"] || this.basic["money_gold"])
            GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateCurreny, this);
        if (this.basic["closeBtn1"])
            this.basic["closeBtn1"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
        if (this.basic["closeBtn2"])
            this.basic["closeBtn2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
        if (this.basic["btnTopMoney"])
            this.basic["btnTopMoney"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTopMoney, this);
        if (this.basic["btnTopDiamond"])
            this.basic["btnTopDiamond"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTopDiamond, this);
        // this.addEventListener(egret.Event.ADDED, this.onAddedHandler, this);
        this.onReloadUIResource();
    }
    protected onRemove(): void {
        if (this.basic["closeBtn1"])
            this.basic["closeBtn1"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
        if (this.basic["closeBtn2"])
            this.basic["closeBtn2"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
        if (this.basic["btnTopMoney"])
            this.basic["btnTopMoney"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTopMoney, this);
        if (this.basic["btnTopDiamond"])
            this.basic["btnTopDiamond"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTopDiamond, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateCurreny, this);
        // this.removeEventListener(egret.Event.ADDED, this.onAddedHandler, this);
        this.onDisposeUIAnim();
    }
    protected onTouchCloseBtn(): void {
        this.onHide();
    }
    protected onTouchTopMoney() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "HallWelfarePanel");
    }
    protected onTouchTopDiamond() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }

    public onHide(): void {
        this._isShow = false;
        if (this.isloadComp) {
            this.onRemove();
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var isLastView: boolean = true;
        for (var i: number = this.parentLayer.numChildren - 1; i >= 0; i--) {
            var windowPanel: BaseWindowPanel = this.parentLayer.getChildAt(i) as BaseWindowPanel;
            if (windowPanel && windowPanel.priority == PANEL_HIERARCHY_TYPE.I) {
                isLastView = false;
                break;
            }
            if (windowPanel['basic'] && windowPanel['basic']['mainbtnbarLayer']) {
                this.owner.mainbtnbarUI.addToLayer(windowPanel['basic']['mainbtnbarLayer']);
            }
        }
        if (isLastView) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_ALLREMOVED));
            this.owner.mainviewPointRefresh();
        }
        this.owner.onShowOrHideMaskView();
        if (this.owner) {
            this.owner.onQuitGuide(this);
        }
    }
    protected onHideIOSBanWord(component): void {
        for (let i: number = 0; i < component.numChildren; i++) {
            let childDisplayObj = component.getChildAt(i);
            if (egret.is(childDisplayObj, "eui.Label")) {
                let componentLabel: eui.Label = childDisplayObj as eui.Label;
                let labelTxt: string = componentLabel.text;
                labelTxt = labelTxt.replace(/购买|购 买|充值|充 值/g, "兑 换");
                componentLabel.text = labelTxt;
            } else if (childDisplayObj['numChildren']) {
                this.onHideIOSBanWord(childDisplayObj);
            }
        }
    }
    /**-----------资源释放相关-------------**/
    protected _ResIsDispose: boolean;
    protected onDisposeUIAnim(): void {
        this._ResIsDispose = true;
        this.removeEventListener(egret.Event.ADDED, this.onChildAdded, this);
    }
    protected onReloadUIResource(): void {
        if (this._ResIsDispose) {
            this._ResIsDispose = false;
            for (let i: number = 0; i < this.numChildren; i++) {
                let reloadObj = this.getChildAt(i);
                LoadManager.getInstance().reloadUIImageAndAnim(reloadObj);
            }

            this.addEventListener(egret.Event.ADDED, this.onChildAdded, this);
        }
    }
    private onChildAdded(event: egret.Event): void {
        if (egret.is(event.currentTarget, "egret.DisplayObjectContainer")) {
            LoadManager.getInstance().reloadUIImageAndAnim(event.currentTarget);
        }
    }
    protected get parentLayer(): egret.DisplayObjectContainer {
        return this.owner.PupoBar;
    }
    public setTitle(title: string): void {
        if (!title) return;
        let imgTitle: eui.Image = this.basic["panel_title"];
        let labelTitle: eui.Label = this.basic["label_title"];
        if (title.indexOf("png") > 0) {
            if (imgTitle) {
                imgTitle.source = title;
            }
            if (labelTitle) {
                labelTitle.text = "";
            }
        } else if (this.basic["label_title"]) {
            if (labelTitle) {
                labelTitle.text = title;
            }
            if (imgTitle) {
                imgTitle.source = "";
            }
        }
    }

    public setTitlePercent(per: number): void {
        this.basic["panel_title"].scaleX = per;
        this.basic["panel_title"].scaleY = per;
    }

    public setTiltleOffY(offY: number): void {
        this.basic["panel_title"].y += offY;
    }

    public setBg(bg: string): void {
        this.basic["basic_tip_bg"].source = bg;
    }

    protected updateCurreny(): void {
        let player: Player = DataManager.getInstance().playerManager.player;
        if (this.basic["money_bind"]) {
            this.basic["money_bind"].text = GameCommon.getInstance().getFormatNumberShow(player.money);
        }
        if (this.basic["money_gold"]) {
            this.basic["money_gold"].text = GameCommon.getInstance().getFormatNumberShow(player.gold);
        }
    }

    public get isShow(): boolean {
        return this._isShow;
    }
    public createRedPoint() {
        var point: redPoint = new redPoint();
        this.points.push(point);
        return point;
    }
    public trigger(): void {
        if (this.isloadComp) {
            for (var i: number = 0; i < this.points.length; i++) {
                this.points[i].checkPointAll();
            }
            if (this.basic && this.basic['mainbtnbarLayer'] && (this.basic['mainbtnbarLayer'] as eui.Group).getChildIndex(this.owner.mainbtnbarUI) >= 0) {
                this.owner.mainbtnbarUI.trigger();
            }
        }
    }
    //The end
}
//带参数的面板
class WindowParam {
    public windowName;
    public param;
    public constructor(windowName, param) {
        this.windowName = windowName;
        this.param = param;
    }
}
//层级类型
enum PANEL_HIERARCHY_TYPE {
    I = 0,
    II = 1,
}