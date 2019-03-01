// TypeScript file
class ModuleLayer extends egret.DisplayObjectContainer {
    private mainScene: MainScene;
    private allwindows = {};
    //游戏层级
    private mainviewBar: egret.DisplayObjectContainer;//主界面
    private dropLayer: egret.DisplayObjectContainer;//主界面移动层
    public dramaBar: egret.DisplayObjectContainer;//剧情层
    public PupoBar: egret.DisplayObjectContainer;//弹出面板层
    //通用UI
    private gameloadingUI: GameLoadingLayer;
    private playerMessagePanel: egret.DisplayObjectContainer;
    private systemMessagePanel: egret.DisplayObjectContainer;
    private _mainView: MainView;
    private _main_btnpro: MainVIew_btnBar;
    private messageBg: eui.Image;
    private viewmask: egret.Shape;
    private loadingBar: egret.DisplayObjectContainer;//loading板层
    private loadingPanel: WaitLoadingPanel;
    private panelBackImg: eui.Image;

    public constructor(mainScene: MainScene) {
        super();
        this.mainScene = mainScene;
        this.mainviewBar = new egret.DisplayObjectContainer();
        this.addChild(this.mainviewBar);
        this.dropLayer = new egret.DisplayObjectContainer();
        this.addChild(this.dropLayer);
        this.dramaBar = new egret.DisplayObjectContainer();
        this.addChild(this.dramaBar);
        this.PupoBar = new egret.DisplayObjectContainer();
        this.addChild(this.PupoBar);
        this.playerMessagePanel = new egret.DisplayObjectContainer();
        this.addChild(this.playerMessagePanel);

        this.gameloadingUI = new GameLoadingLayer(this);

        this._mainView = new MainView(this);
        this.mainviewBar.addChild(this._mainView);

        this._main_btnpro = new MainVIew_btnBar();

        this.systemMessagePanel = new egret.DisplayObjectContainer();
        this.systemMessagePanel.touchEnabled = false;
        this.addChild(this.systemMessagePanel);

        this.loadingBar = new egret.DisplayObjectContainer();
        this.addChild(this.loadingBar);

        this.viewmask = new egret.Shape();
        this.viewmask.touchEnabled = true;

        this.onRegist();
        this.onStageResize();
        Tool.addTimer(this.onTimerDown, this, 1000);
    }

    private onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.MODULE_WINDOW_OPEN, this.onOpenWindow, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MODULE_WINDOW_CLOSE, this.onCloseWindow, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM, this.onOpenWindowWithParam, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MODULE_GOTYPE_OPEN_WINDOW, this.gotypeHandler, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_REDPOINT_TRIGGER.toString(), this.trigger, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MODULE_WINDOW_ALLREMOVED.toString(), this.onEventRemoveWindow, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_OBTAINHINT_SHOW.toString(), this.onShowObtHintBar, this);

        GameDispatcher.getInstance().addEventListener(GameEvent.LOADING_OPEN.toString(), this.loadingOpen, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.LOADING_CLOSE.toString(), this.loadingClose, this);

        this._mainView.addEventListener(egret.Event.ADDED, this.mainviewAdded, this);
    }
    private _isLoadingUI: boolean;
    public loadingOpen() {
        if (!this.loadingPanel) {
            this.loadingPanel = new WaitLoadingPanel();
            this.loadingBar.addChild(this.loadingPanel);
        }
        this.loadingPanel.resetPanel(size.width, size.height);
        this.loadingPanel.loadStart();
        this._isLoadingUI = true;
    }
    public loadingClose() {
        this._isLoadingUI = false;
        if (this.loadingPanel) {
            this.loadingPanel.loadClose();
        }
        if (this.guideParam) {
            Tool.callbackTime(this.onCheckGuideHanlde, this, 500);
        }
    }
    /**重置所有的图片状态 解决IOS后台切换到前台丢失UI的问题
     * 1.关闭所有的面板
     * 2.GC掉所有的图片
     * 3.重新刷新主界面的资源
     * **/
    public onResetUIResource(param): void {
        this.removeAllWindows();
        LoadManager.getInstance().resetAllUIResources();
    }
    /**添加到舞台的事件**/
    private mainviewAdded(event: egret.Event): void {
        LoadManager.getInstance().addMainvewImageAry(event.currentTarget);
    }
    /**舞台发生变化**/
    public onStageResize(): void {
        this._mainView.resize();
        if (DataManager.IS_PC_Game) {
            this.PupoBar.x = Globar_Pos.x;
            this.playerMessagePanel.x = Globar_Pos.x;
            this.systemMessagePanel.x = Globar_Pos.x;
        } else {
            this.PupoBar.x = (size.width - GameDefine.GAME_STAGE_WIDTH) / 2;
        }

        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.6);
        this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, size.width, size.height);
        this.viewmask.graphics.endFill();

        this.gameloadingUI.width = size.width;
        this.gameloadingUI.height = size.height;

        this._main_btnpro.resize();
    }
    //正在重新连接服务器 参数bool开始连接或结束连接
    public onReLoginSereverHandler(): void {
        this._mainView.onInit();
        this.removeAllWindows();
    }
    private onTouchMessageBg(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "NoticePanel");
    }
    //不带参数的打开某面板
    private onOpenWindow(event: egret.Event): void {
        var windowName: string = event.data;
        this.onOpenWindowHandler(windowName);
    }
    //带参数的打开某面板
    private onOpenWindowWithParam(event: egret.Event): void {
        var windowParam: WindowParam = event.data;
        if (!windowParam)
            return;
        this.onOpenWindowHandler(windowParam.windowName, windowParam.param);
    }
    private onOpenWindowHandler(windowName: string, param: WindowParam = null): void {
        if (!window[windowName] || this._isLoadingUI)
            return;
        if (SDKManager.isHidePay) {
            let hide_panels: string = Constant.get(Constant.FANGKUAIWAN_IOS_HIDE_PANEL);
            if (hide_panels.indexOf(windowName) >= 0) {
                return;
            }
        }

        var _windowPanel: BaseWindowPanel;
        if (this.allwindows[windowName]) {
            _windowPanel = this.allwindows[windowName];
        } else if (window[windowName]) {
            _windowPanel = new window[windowName](this);
            this.allwindows[windowName] = _windowPanel;
        }
        if (!_windowPanel) return;
        if (_windowPanel.priority == PANEL_HIERARCHY_TYPE.I) {
            this.removeAllWindows();
        }
        if (param != null)
            _windowPanel.onShowWithParam(param);
        else
            _windowPanel.onShow();

        this.onControlBasePopWindow(windowName);
        this.onCheckShowMapLayer();
        this._mainView.onHideBtnGroup();
    }
    private onControlBasePopWindow(windowName: string) {
        switch (windowName) {
            // case "BagPanel":
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_CLOSE), "ObtainHintUseGoods");
            //     break;
            case "RolePanel":
                if (this._obtainHintBars && this._obtainHintBars[HINT_TIPS_TYPE.EQUIP]) {
                    let obtainhintBar: ObtainHintEquip = this._obtainHintBars[HINT_TIPS_TYPE.EQUIP];
                    obtainhintBar.onDestory();
                }
                break;
        }
    }
    //关闭面板处理
    private onCloseWindow(event: egret.Event): void {
        var windowName: string = event.data;
        if (!windowName)
            return;
        if (this.allwindows[windowName]) {
            var _windowPanel: BaseWindowPanel = this.allwindows[windowName];
            if (_windowPanel.isShow) {
                _windowPanel.onHide();
            }
        }
    }
    //检查是否应该出现遮挡层 蒙到II级面板下面
    public onShowOrHideMaskView(): void {
        var layerNum: number = -1;
        if (this.viewmask.parent) {
            this.viewmask.parent.removeChild(this.viewmask);
        }
        for (var i: number = this.PupoBar.numChildren - 1; i >= 0; i--) {
            var windowPanel = this.PupoBar.getChildAt(i) as BaseWindowPanel;
            if (windowPanel && windowPanel.priority == PANEL_HIERARCHY_TYPE.II) {
                layerNum = i;
                break;
            }
        }
        if (layerNum >= 0) {
            this.PupoBar.addChildAt(this.viewmask, layerNum);
        }
    }
    //所有面板处于关闭状态
    private onEventRemoveWindow(event: egret.Event): void {
        this.onCheckShowMapLayer();
        this._mainView.addMainBtnBar();
    }
    //检测是否显示地图层
    private onCheckShowMapLayer(): void {
        var isShowMap: boolean = true;
        for (var i: number = this.PupoBar.numChildren - 1; i >= 0; i--) {
            var windowPanel: BaseWindowPanel = this.PupoBar.getChildAt(i) as BaseWindowPanel;
            if (windowPanel.priority == PANEL_HIERARCHY_TYPE.I) {
                isShowMap = false;
                break;
            }
        }
        this.showorhideMainviewBar(isShowMap);
        this.mainScene.onShowOrHideMapLayer(!isShowMap);
        if (!DataManager.IS_PC_Game) {
            if (isShowMap) {
                if (this.panelBackImg && this.panelBackImg.parent) {
                    this.panelBackImg.parent.removeChild(this.panelBackImg);
                }
            } else {
                if (!this.panelBackImg) {
                    this.panelBackImg = new eui.Image();
                }
                if (!this.panelBackImg.parent) {
                    if (this.panelBackImg.source) {
                        this.panelBackImg.source = null;
                    }
                    this.panelBackImg.source = "public_panel_back_png";
                    this.PupoBar.addChildAt(this.panelBackImg, 0);
                }
            }
        }
    }
    //添加飞行icon
    public addToDropLayer(body): void {
        this.dropLayer.addChild(body);
    }
    //飞入背包的特效
    public iconToBagEffect(icon: eui.Image): void {
        if (!icon) return;
        try {
            let startPos: egret.Point = icon.localToGlobal();
            let flyimg: eui.Image = new eui.Image(icon.source);
            flyimg.width = icon.width;
            flyimg.height = icon.height;
            let targetPos = this._mainView.getTargetPointByFuncId(FUN_TYPE.FUN_ITEMBAG);
            let flybody: CurvilinearBody = new CurvilinearBody(flyimg, startPos, targetPos, 30, 50);
            this.dropLayer.addChild(flybody);
            egret.Tween.get(flybody).to({ factor: 1 }, 500).call(this.onDestroyFuncbody, this, [flybody]);
        } catch (e) { }
    }
    //添加飞行特效
    // public addKillAnimToView(): void {
    //     if (this.PupoBar.numChildren == 0) {
    //         let progressAnim: Animation = new Animation('jingjiewancheng');
    //         progressAnim.scaleX = progressAnim.scaleY = 0.8;
    //         progressAnim.x = this.mainScene.getMapLayer().heroPosByModule[0];
    //         progressAnim.y = this.mainScene.getMapLayer().heroPosByModule[1];
    //         var targetPoint = this._mainView['yewai_wave_bar'].localToGlobal();
    //         targetPoint.x = targetPoint.x + 60;
    //         targetPoint.y = targetPoint.y + 80;
    //         this.mainviewBar.addChild(progressAnim);
    //         TweenLiteUtil.beelineTween(progressAnim, this.onDestroyFuncbody, this, targetPoint, 1000);
    //     }
    // }
    //添加飞行funcionIcon
    public addFuncToDropLayer(body: FuncBody): void {
        if (this.visible) {
            var targetPoint = this._mainView.getTargetPointByFuncId(body.id);
            if (!targetPoint) {
                this.onDestroyFuncbody(body);
                return;
            }
            targetPoint.x = targetPoint.x - 10;
            targetPoint.y = targetPoint.y - 10;
            if (targetPoint != null) {
                this.mainviewBar.addChild(body);
                TweenLiteUtil.beelineTween(body, this.onDestroyFuncbody, this, targetPoint, 1000);
            }
        }
    }
    private onDestroyFuncbody(body): void {
        egret.Tween.removeTweens(body);
        body.onDestroy();
        body = null;
    }
    //场景切换更新
    public onRefreshScene(): void {
        this.dropLayer.removeChildren();
        if (this.stroyIsShow()) {
            this.storyPanel.onHide();
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            if (this.guideParam) {
                this.onStartOneGuide();
            }
        } else {
            if (this._guideBar && this._guideBar.parent) {
                this._guideBar.onHide();
            }
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.UNION_BATTLE) {
            this._mainView.visible = false;
        } else {
            this._mainView.visible = true;
        }

        if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
            this._mainView.refreshIosPayHide();
        }
    }
    //关闭所有面板
    public removeAllWindows(): void {
        while (this.PupoBar.numChildren > 0) {
            var windowPanel = this.PupoBar.getChildAt(0);
            if (egret.is(windowPanel, "BaseWindowPanel")) {
                (windowPanel as BaseWindowPanel).onHide();
            } else {
                this.PupoBar.removeChildAt(0);
            }
        }
    }
    //添加功能Tips提示
    // private onShowOrHideFunctipsBar(): void {
    //     if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI && !PromptPanel.getInstance().guideIsShow) {
    //         this.functipsBar.visible = true;
    //     } else {
    //         this.functipsBar.visible = false;
    //     }
    // }
    // private onHideFuncTipsBar(): void {
    //     this.functipsBar.onHide();
    // }
    //剧情展示相关
    private storyPanel: StoryPanel;
    public onShowStoryView(talks: Modelstory[], bodydata: BodyData = null): void {
        if (this.storyPanel && this.storyPanel.parent) return;
        if (!this.storyPanel) {
            this.storyPanel = new StoryPanel();
            this.storyPanel.x = Globar_Pos.x;
        }
        this.storyPanel.onshowStroy(talks, bodydata);
        this.showorhideMainviewBar(false);

        this.dramaBar.addChild(this.storyPanel);
    }
    public onHideStroyView(): void {
        this.storyPanel.onHide();
        this.showorhideMainviewBar(true);
    }
    public stroyIsShow(): boolean {
        return !this.storyPanel ? false : this.storyPanel.parent != null;
    }
    //显示游戏的全局加载界面
    public onshowGameloadingUI(callback, thisObject, imgs: string[]): void {
        this.gameloadingUI.startLoading(callback, thisObject, imgs);
    }
    /**过场动画**/
    private _loadingMask: eui.Image;
    private _isplayLoading: boolean;
    public onPlayPassSceneAnim(): void {
        if (!this._loadingMask) {
            this._loadingMask = new eui.Image;
            this._loadingMask.source = 'prompt_mask_lingxing_png';
            this._loadingMask.anchorOffsetX = 110;
            this._loadingMask.anchorOffsetY = 170;
        } else {
            this._isplayLoading = true;
            this.mainviewBar.addChild(this._loadingMask);
            this._loadingMask.x = size.width / 2;
            this._loadingMask.y = size.height / 2;
            this._loadingMask.scaleX = this._loadingMask.scaleY = 0;
            let scaleXValue: number = Math.ceil(size.width / 60);
            let scaleYValue: number = Math.ceil(size.height / 120);
            egret.Tween.get(this._loadingMask).to({ scaleX: scaleXValue, scaleY: scaleYValue }, 300).call(this.onHidePassSceneAnim, this);
        }
    }
    public onHidePassSceneAnim(): void {
        if (!this._isplayLoading) return;
        this._isplayLoading = false;
        egret.Tween.removeTweens(this._loadingMask);
        egret.Tween.get(this._loadingMask).to({ scaleX: 0, scaleY: 0 }, 300, egret.Ease.circOut).call(function (_loadingMask: eui.Image) {
            if (_loadingMask.parent) {
                _loadingMask.parent.removeChild(_loadingMask);
            }
            egret.Tween.removeTweens(_loadingMask);
        }, this, [this._loadingMask]);
    }
    /**主界面按钮气泡提醒**/
    private funcTipsBarMap;
    public onShowFuncTipsBar(functipType: FUNCTIP_TYPE, desc: string): void {
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) {
            return;
        }
        if (!this.funcTipsBarMap) {
            this.funcTipsBarMap = {};
        }

        var targetBtn: egret.DisplayObjectContainer;
        switch (functipType) {
            case FUNCTIP_TYPE.BOSS_REMIND:
                targetBtn = this._mainView["bottom_btnbar_grp"];
                break;
            case FUNCTIP_TYPE.BAGFULL:
                targetBtn = this._main_btnpro["btn_bag"];
                break;
        }
        if (!targetBtn) return;
        if (!this.funcTipsBarMap[functipType]) {
            this.funcTipsBarMap[functipType] = new FuncTipsBar();
        }
        var functipsbar: FuncTipsBar = this.funcTipsBarMap[functipType];
        if (functipsbar.param) {//代表已经在显示中 
            if (functipsbar.param.desc != desc) {//替换规则 类型大于等于现有类型的直接替换
                functipsbar.param.desc = desc;
                functipsbar.onShow(functipsbar.param);
            }
        } else {
            var functipObj: FuncTipsObj = new FuncTipsObj(functipType, desc);
            functipObj.parentTarget = targetBtn;
            switch (functipObj.type) {
                case FUNCTIP_TYPE.BOSS_REMIND:
                    functipObj.offX = -120;
                    functipObj.offY = -60;
                    functipObj.autoClose = 30;
                    break;
                case FUNCTIP_TYPE.BAGFULL:
                    functipObj.offX = -140;
                    functipObj.offY = -70;
                    break;
            }
            this.addToMainview(functipsbar);
            functipsbar.onShow(functipObj);
        }
    }
    /**移除气泡**/
    public onHideFuncTipsBar(functipType: FUNCTIP_TYPE = null): void {
        if (!this.funcTipsBarMap) return;
        let functipsbar: FuncTipsBar;
        if (functipType) {
            functipsbar = this.funcTipsBarMap[functipType];
            if (functipsbar) {
                functipsbar.onHide();
            }
        } else {
            for (let idx in this.funcTipsBarMap) {
                functipsbar = this.funcTipsBarMap[idx];
                if (functipsbar.parent) {
                    functipsbar.onHide();
                }
            }
        }
    }
    /**BOSS血条处理**/
    private bossTargetBar: BossTargetBar;
    public onShowBossHpBar(data: BodyData): void {
        if (!this.bossTargetBar) {
            this.bossTargetBar = new BossTargetBar();
            this.bossTargetBar.top = 180;
            this.bossTargetBar.horizontalCenter = 0;
        }
        if (!this.bossTargetBar.parent) {
            this.bossTargetBar.onTarget(data);
            this._mainView.addChild(this.bossTargetBar);
        }
    }
    public onUpdateBossHpBar(hpValue: number, hpMax: number = 0): void {
        if (this.bossTargetBar) {
            this.bossTargetBar.onUpdateProgress(hpValue, hpMax);
            // if (hpValue <= 0) {
            //     this.onHideBossHpBar();
            // }
        }
    }
    public onHideBossHpBar(): void {
        if (this.bossTargetBar) {
            this.bossTargetBar.onRemove();
        }
    }
    /**显示关闭伤害排行榜**/
    private _damagerankBar: DamageRankBar;
    public onDamageRankBar(bool: boolean): void {
        if (!this._damagerankBar) {
            this._damagerankBar = new DamageRankBar();
        }
        if (bool && !this._damagerankBar.parent) {
            this.addToMainview(this._damagerankBar);
            this._damagerankBar.x = size.width - 290;
            this._damagerankBar.y = size.height - 660;
            this._damagerankBar.onRegist();
        } else if (!bool && this._damagerankBar.parent) {
            this._damagerankBar.onRemove();
        }
    }
    /**更新伤害排行榜**/
    public onUpdateDamageRank(selfDamage: number, damageList: BossDamageParam[]): void {
        if (!this._damagerankBar || !this._damagerankBar.parent) {
            this.onDamageRankBar(true);
        }
        this._damagerankBar.onUpdate(selfDamage, damageList);
    }
    /**其他玩家血条处理**/
    private otherTargetBar: OtherTargetBar;
    public onShowOhterHpBar(data: PlayerData, headIndex: number, headFrame: number): void {
        if (!this.otherTargetBar) {
            this.otherTargetBar = new OtherTargetBar();
            this.otherTargetBar.top = 270;
            this.otherTargetBar.horizontalCenter = 20;
        }
        if (!this.otherTargetBar.parent) {
            this._mainView.addChild(this.otherTargetBar);
        }
        this.otherTargetBar.onTarget(data, headIndex, headFrame);
    }
    public onUpdateOtherHpBar(hpValue: number, hpMax: number = 0): void {
        if (this.otherTargetBar) {
            this.otherTargetBar.onUpdateProgress(hpValue, hpMax);
        }
    }
    public onHideOhterHpBar(): void {
        if (this.otherTargetBar) {
            this.otherTargetBar.onRemove();
        }
    }
    /**添加到Mainview层**/
    public addToMainview(display: egret.DisplayObject): void {
        this.mainviewBar.addChild(display);
    }
    /**隐藏或显示Mainview层**/
    public showorhideMainviewBar(isShow: boolean): void {
        if (isShow) {
            if (this.storyPanel && this.storyPanel.parent) return;

            if (!this.mainviewBar.visible) {
                LoadManager.getInstance().onClearAllBodyAnimCache(false);
                LoadManager.getInstance().removeloadAllUIImage();
                this.mainviewBar.visible = true;
            }
        } else {
            this.mainviewBar.visible = false;
        }
    }
    /**显示获得物品提示**/
    private _obtainHintBars;
    public onShowObtHintBar(event: egret.Event): void {
        let param: ObtainHintParam = event.data;
        if (!this._obtainHintBars) {
            this._obtainHintBars = {};
        }
        let obtainhintBar: BaseComp = this._obtainHintBars[param.type];
        if (!obtainhintBar) {
            switch (param.type) {
                case HINT_TIPS_TYPE.EQUIP:
                    obtainhintBar = new ObtainHintEquip();
                    break;
            }
            this._obtainHintBars[param.type] = obtainhintBar;
        }
        if (obtainhintBar && !obtainhintBar.parent) {
            obtainhintBar.x = size.width - 255;
            obtainhintBar.onShow(this.mainviewBar);
            obtainhintBar.data = param;
        }
    }
    /**显示关卡效率**/
    private _xiaolvView;
    public onShowPassProceedsView(): void {
        if (!this._xiaolvView) {
            this._xiaolvView = new DupguankaxiaolvPanel(this);
        }
        this._xiaolvView.x = Globar_Pos.x;
        this._xiaolvView.onRefresh();
        this.addToMainview(this._xiaolvView);
    }
    /**显示或隐藏转生BOSS副本复活栏**/
    private samsarabar: SamsaraFuncBar;
    public showorhideDupRebornBar(bool: boolean): void {
        if (!this.samsarabar) {
            this.samsarabar = new SamsaraFuncBar();
        }
        if (bool) {
            if (!this.samsarabar.parent) {
                this.addToMainview(this.samsarabar);
                this.samsarabar.x = size.width / 2 - 50;
                this.samsarabar.y = size.height - 280;
                this.samsarabar.onRegistSamsaraBar();
            }
        } else {
            if (this.samsarabar.parent) {
                this.samsarabar.parent.removeChild(this.samsarabar);
                this.samsarabar.onRemoveSamsaraBar();
            }
        }
    }
    /**转生BOSS启用复活倒计时**/
    public onShowSamsaraReborn(rebornTime: number): void {
        if (this.samsarabar) {
            this.samsarabar.onStartSamsaraRebornTime(rebornTime);
        }
    }
    /**转生BOSS停止复活倒计时**/
    public onHideSamsaraReborn(): void {
        if (this.samsarabar) {
            this.samsarabar.onStopSamsaraRebornTime();
        }
    }
    /**BOSS来袭动画**/
    private _incomingBar: eui.Component;
    private _playIncomingBl: boolean;
    public playBossIncomingAnim(): void {
        if (this._playIncomingBl) {
            return;
        }
        this._playIncomingBl = true;
        if (!this._incomingBar) {
            this._incomingBar = new eui.Component();
            this._incomingBar.skinName = skins.BossIncomingBarSkin;
            this._incomingBar.x = 10;
            this._incomingBar.y = size.height - 430;
            this._incomingBar.scaleX = 0.8;
            this._incomingBar.scaleY = 0.8;
        }
        let back_grp: eui.Group = this._incomingBar['back_grp'];
        back_grp.x = -500;
        let font_grp: eui.Group = this._incomingBar['font_grp'];
        font_grp.x = 800;
        egret.Tween.get(back_grp).to({ x: 0 }, 600);//egret.Ease.backInOut
        egret.Tween.get(font_grp).to({ x: 140 }, 600, egret.Ease.circIn);
        this.addToMainview(this._incomingBar);
        // this._mainView.onshowBlackMask(true);
        Tool.callbackTime(this.overBossIncomeingAnim, this, 3000);
    }
    public overBossIncomeingAnim(): void {
        if (this._incomingBar && this._incomingBar.parent) {
            if (this._incomingBar.parent) {
                this._incomingBar.parent.removeChild(this._incomingBar);
            }
            let back_grp: eui.Group = this._incomingBar['back_grp'];
            if (back_grp) {
                egret.Tween.removeTweens(back_grp);
            }
            let font_grp: eui.Group = this._incomingBar['font_grp'];
            if (font_grp) {
                egret.Tween.removeTweens(font_grp);
            }
        }

        this._playIncomingBl = false;
        // this._mainView.onshowBlackMask(false);
    }
    /**前往类型处理**/
    public gotypeHandler(event: egret.Event): void {
        var gotype: FUN_TYPE = event.data as FUN_TYPE;
        var windowParam: WindowParam;
        switch (gotype) {//客户端自用类型
            case FUN_TYPE.FUN_OPENFUNC:
                this.onOpenWindowHandler('OpenFuncView');
                return;
        }
        if (FunDefine.onIsLockandErrorHint(gotype)) {
            return;
        }
        if (gotype > 0) {
            if (gotype == 99999) {
                GameCommon.getInstance().addAlert("qianwang1");
                return;
            }
            var model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[gotype];
            if (!model) return;
            windowParam = new WindowParam(model.param, model.id);
            if (gotype == FUN_TYPE.FUN_SHOP_JIFEN || gotype == FUN_TYPE.FUN_SHOP_PUTONG || gotype == FUN_TYPE.FUN_SHOP_SHENMI || gotype == FUN_TYPE.FUN_SHOP_RONGYU) {
                ShopDefine.openDefaultShopView();//model.tab
            } else if (gotype == FUN_TYPE.FUN_PVE) {
                this.removeAllWindows();
                this.onOpenWindowHandler(model.param);
            } else {
                event.data = windowParam;
                this.onOpenWindowWithParam(event);
            }
        }
    }
    /**新手引导相关**/
    private guideParam: GuideParam;
    //注册一个新手引导
    public onStartOneGuide(): void {
        let guidetaskData: GuideTaskData = DataManager.getInstance().taskManager.guideTaskData;
        if (guidetaskData && guidetaskData.model && guidetaskData.model.jackaroo > 0 && !guidetaskData.isFinish) {
            let jackarooId: number = guidetaskData.model.jackaroo;
            let param: GuideParam = new GuideParam(jackarooId);
            if (param.models.length > 0) {
                this.guideParam = param;
                this.onCheckGuideHanlde();
            }
        } else {
            this.onCompleteGuide();
        }
    }
    //检查新手引导的进度
    private onCheckGuideHanlde(): void {
        if (!this.guideParam) return;
        if (this._isLoadingUI) return;

        this.guidecheckTime = 0;
        if (!this.guideParam.isEnd) {
            let model: Modelxinshou = this.guideParam.model;
            let guideTask: GuideTaskData = DataManager.getInstance().taskManager.guideTaskData;
            if (!guideTask || !guideTask.model) {
                this.onCompleteGuide();
                return;
            }

            let parentCont: eui.Component;
            //寻找父类容器
            if (model.panel == '$Mainview') {
                parentCont = this._mainView;
            } else if (model.panel == '$MainviewBtnsBar') {
                parentCont = this._main_btnpro;
            } else {
                if (this.PupoBar.numChildren > 0) {
                    let windowPanel = this.PupoBar.getChildAt(this.PupoBar.numChildren - 1);
                    if (egret.is(windowPanel, 'BaseWindowPanel')) {
                        parentCont = windowPanel as BaseWindowPanel;
                    }
                }
            }

            if (!parentCont) {
                return;
            }
            this.guideParam.parentContainer = parentCont;
            this.guideParam.isComplete = false;

            this.onShowGuideBar();
        } else {
            this.onCompleteGuide();
        }
    }
    //完成一步引导
    public onContiuneGuide(): void {
        if (!this.guideParam) return;
        this.guideParam.onContiune();
        Tool.callbackTime(this.onCheckGuideHanlde, this, 300);
    }
    //新手引导完成
    public onCompleteGuide(): void {
        if (!this.guideParam) return;
        if (this._guideBar) {
            this._guideBar.onDestroy();
        }
        this.guideParam = null;
    }
    //显示新手引导
    private _guideBar: GameGuideBar;
    public onShowGuideBar(): void {
        if (!this.guideParam) return;
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) {
            return;
        }
        if (this.guideParam.parentContainer === this._mainView && this.PupoBar.numChildren > 0) {
            return;
        }

        if (!this._guideBar) {
            this._guideBar = new GameGuideBar(this);
        }

        this._guideBar.onShow(this.guideParam);
    }
    //退出新手引导
    public onQuitGuide(panel): void {
        if (!this.guideParam) return;

        if (this.PupoBar.numChildren == 0) {
            if (this.guideParam.model.target == '$close' && this.guideParam.isLastOne) {
                this.onCompleteGuide();
            } else {
                this.onStartOneGuide();
            }
        }
    }

    public getPanel(name: string): any {
        return this.allwindows[name];
    }

    private guidecheckTime: number = 0;
    private onTimerDown(): void {
        if (this.PupoBar.numChildren == 0 && this.pointCheckTime < egret.getTimer()) {
            this.mainviewPointRefresh();
            this.mainbtnbarUI.trigger();
            this.pointCheckTime = 5000 + egret.getTimer();
        }

        this._mainView.onTimeDown();

        if (this.guideParam && this.guideParam.againCount > 0) {
            if (this.guidecheckTime == 0) {
                this.guidecheckTime = egret.getTimer() + 500;
            }
            if (egret.getTimer() > this.guidecheckTime) {
                this.guideParam.againCount = Math.max(this.guideParam.againCount - 1, 0);
                this.guidecheckTime = egret.getTimer() + 500;
                this.onCheckGuideHanlde();
            }
        }
    }

    private pointCheckTime: number = 0;
    public mainviewPointRefresh(isOptimize: boolean = false): void {
        this._mainView.trigger(isOptimize);
    }

    private trigger(e: egret.Event) {
        var trig: redPointTrigger = e.data;
        if (trig.systemID) {
            var _windowPanel: BaseWindowPanel = this.allwindows[trig.systemID];
            if (_windowPanel && _windowPanel.isShow) {
                _windowPanel.trigger();
            }
        }

        if (this.PupoBar.numChildren > 0) {
            for (var key in this.allwindows) {
                if (this.allwindows[key].isShow) {
                    if (this.allwindows[key].trigger) {
                        this.allwindows[key].trigger();
                    }
                }
            }
        }
    }
    //获取底部的按钮组件
    public get mainbtnbarUI(): MainVIew_btnBar {
        return this._main_btnpro;
    }
    //The end
}