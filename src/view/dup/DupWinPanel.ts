// TypeScript file
class DupWinPanel extends BaseWindowPanel {
    private result_des_lab: eui.Label;
    private special_des_lab: eui.Label;
    private btn_sure: eui.Button;
    private btn_back: eui.Button;
    private award_Scroller: eui.Scroller;
    private award_groud: eui.Group;
    private btnbar_grp: eui.Group;
    private anim_grp1: eui.Group;
    private anim_grp2: eui.Group;
    private anim_grp3: eui.Group;
    private dupParam: DupWinParam;
    private resule_title1: eui.Image;
    private resule_title3: eui.Image;

    private win_title: eui.Image;

    private btnLabel: string = '';
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.DupWinPanelSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSure, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCancel, this);
    }
    public onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSure, this);
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCancel, this);
    }
    protected onInit(): void {
        super.onInit();
        this.award_Scroller.verticalScrollBar.autoVisibility = false;
        this.award_Scroller.verticalScrollBar.visible = false;
        this.onRefresh();
    }
    private onShowAnimFinish(param): void {
        super.onShowWithParam(param);
    }
    public onShowWithParam(param): void {
        /**清空信息**/
        if (this.isloadComp) {
            this.result_des_lab.text = "";
            this.special_des_lab.text = "";
            for (let i: number = this.award_groud.numChildren - 1; i >= 0; i--) {
                let instance = this.award_groud.getChildAt(i);
                egret.Tween.removeTweens(instance);
                this.award_groud.removeChild(instance);
                instance = null;
            }
        }

        this.dupParam = param;
        super.onShowWithParam(param);
        // TweenLiteUtil.openWindowEffect(this);
        // Tool.callbackTime(this.onShowAnimFinish, this, 2000, param);
    }
    protected onRefresh(): void {
        super.onRefresh();
        this._showleftTime = this.dupParam.autoCloseTime;
        if (this.dupParam.dupinfo && GameFight.getInstance().canContiuneDup(this.dupParam.dupinfo.id)) {
            this.btnLabel = Language.instance.getText("continue");
            this.btnbar_grp.addChild(this.btn_back);
        } else {
            this.btnLabel = Language.instance.getText('sure');
            if (this.btn_back.parent) {
                this.btn_back.parent.removeChild(this.btn_back);
            }
        }
        if (this.dupParam.dupinfo) {
            this.win_title.source = "fight_win_title1_png";
        } else {
            this.win_title.source = "fight_win_title2_png";
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.ESCORT) {
            this.resule_title1.source = `text_bencizhanbao_png`;
            this.resule_title3.source = 'text_teshushuoming_png';
        } if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) {
            this.resule_title1.source = `text_shanghaidiyi_png`;
            this.resule_title3.source = 'text_teshushuoming_png';
        } if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS || GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.VIP_BOSS) {
            this.resule_title1.source = `text_benciguishu_png`;
            this.resule_title3.source = 'text_teshushuoming_png';
        } else {
            this.resule_title1.source = `text_bencizhanbao_png`;
            this.resule_title3.source = 'text_teshujiangli_png';
        }

        if (this._showleftTime > 0) {
            Tool.addTimer(this.onCloseTimedown, this, 1000);
        } else {
            this.btn_sure.label = `${this.btnLabel}`;
        }

        /**第一步：战斗结果**/
        this.anim_grp1.x = 550;
        this.anim_grp1.alpha = 0;
        this.result_des_lab.textFlow = (new egret.HtmlTextParser).parser(this.dupParam.resultParam);
        egret.Tween.get(this.anim_grp1).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn);

        /**第二步：获得物品**/
        this.anim_grp2.x = 550;
        this.anim_grp2.alpha = 0;
        egret.Tween.get(this.anim_grp2).to({ x: 550 }, 500).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn)
            .call(function () {
                if (this.dupParam.dropList.length > 0) {
                    this.onPlayAwardAnim();
                }
            }, this);

        /**第三步：特殊奖励**/
        this.anim_grp3.x = 550;
        this.anim_grp3.alpha = 0;
        this.award_Scroller.height = 213;
        if (this.dupParam.specialDesc) {
            this.special_des_lab.textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(this.dupParam.specialDesc));
            egret.Tween.get(this.anim_grp3).to({ x: 550 }, 1000).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn);
        }
        else
        {
            this.award_Scroller.height = 310;
        }
    }
    private _showleftTime: number;
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            this.onTouchSure();
            return;
        }
        this.btn_sure.label = `${this.btnLabel}(${this._showleftTime})`;
    }
    private onPlayAwardAnim(): void {
        for (let i: number = 0; i < this.dupParam.dropList.length; i++) {
            let awarditem: AwardItem = this.dupParam.dropList[i];
            let goodsInstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
            let goodsGrp: eui.Group = new eui.Group();
            goodsGrp.width = 90;
            goodsGrp.height = 110;
            goodsGrp.scaleX=0.8;
            goodsGrp.scaleY=0.8;
            goodsGrp.addChild(goodsInstance);
            goodsInstance.y = 200;
            goodsInstance.alpha = 0;
            this.award_groud.addChild(goodsGrp);
            egret.Tween.get(goodsInstance).to({ y: 200 }, i * 100).to({ alpha: 1, y: 0 }, 300, egret.Ease.sineInOut);
        }
    }
    private onTouchSure(): void {
        this.onHide();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
    }
    public onHide(): void {
        super.onHide();
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
    }
    private onTouchCancel(): void {
        this.onHide();
        GameFight.getInstance().fightScene.onQuitScene();
    }
    //The end
}
// 四象副本结算面板
class SixiangDupResultPanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private award_grp: eui.Group;
    private dupParam: DupWinParam;

    private isopen: boolean = false;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SixiangDupResultSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }
    public onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }
    public onShowWithParam(param): void {
        this.dupParam = param;
        super.onShowWithParam(param);
    }
    public onHide(): void {
        super.onHide();
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", this.dupParam));
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("结算");
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.isopen = false;
        this.currentState = "unopen";
        this.award_grp.removeChildren();
        this._showleftTime = this.dupParam.autoCloseTime;
        if (this._showleftTime > 0) {
            Tool.addTimer(this.onCloseTimedown, this, 1000);
        } else {
            this.btn_sure.label = Language.instance.getText('sure');
        }
    }
    private _showleftTime: number;
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            this.onTouchBtn();
            return;
        }
        this.btn_sure.label = Language.instance.getText(this.isopen ? 'sure' : 'open') + `${this._showleftTime}S`;
    }
    private onTouchBtn(): void {
        if (!this.isopen) {
            this.isopen = true;
            this.currentState = "open";
            this.onPlayAwardAnim();
            this._showleftTime = this.dupParam.autoCloseTime;
            this.onCloseTimedown();
        } else {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            this.onTouchCloseBtn();
        }
    }
    private onPlayAwardAnim(): void {
        this.award_grp.alpha = 0;
        this.award_grp.y = 500;
        let awarditem: AwardItem = this.dupParam.dropList[this.dupParam.dropList.length - 1];
        if (awarditem.num > 0) {
            let goodsInstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
            this.award_grp.addChild(goodsInstance);
        }
        // for (let i: number = 0; i < this.dupParam.dropList.length; i++) {

        // }
        egret.Tween.get(this.award_grp).to({ alpha: 1, y: 290 }, 300, egret.Ease.sineInOut);
    }
    //The end
}
class DupWinParam {
    public dupinfo: DupInfo;
    public dropList: AwardItem[] = [];
    public autoCloseTime: number = 11;
    public resultParam: string;//结果
    public specialDesc: string;//特殊
}