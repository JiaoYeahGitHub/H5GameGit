// TypeScript file
class ArenaWinPanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private result_des_lab: eui.Label;
    private currhp_rate_lab: eui.Label;
    // private award_Scroller: eui.Scroller;
    private herohp_anim_grp: eui.Group;
    // private award_groud: eui.Group;
    private btnbar_grp: eui.Group;
    private anim_grp1: eui.Group;
    private anim_grp2: eui.Group;
    // private anim_grp3: eui.Group;
    private grade_icon_img: eui.Image;
    private score_result_lab: eui.Label;
    private score_probar: eui.ProgressBar;

    private param: LadderArenaParam;
    private awardscore: number;
    private START_HPANIM_Y: number = 30;
    private END_HPANIM_Y: number = 170;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ArenaWinPanelSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    public onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    public onShowWithParam(param): void {
        if (this.isloadComp) {//清空信息
            this.result_des_lab.text = "";
            this.currhp_rate_lab.text = "";
            // for (let i: number = this.award_groud.numChildren - 1; i >= 0; i--) {
            //     let instance = this.award_groud.getChildAt(i);
            //     egret.Tween.removeTweens(instance);
            //     this.award_groud.removeChild(instance);
            //     instance = null;
            // }
            this.herohp_anim_grp.removeChildren();
        }

        this.param = param;
        if (this.param) {
            super.onShowWithParam(param);
        }
    }
    protected onInit(): void {
        super.onInit();
        // this.award_Scroller.verticalScrollBar.autoVisibility = false;
        // this.award_Scroller.verticalScrollBar.visible = false;
        this.onRefresh();
    }
    protected onRefresh(): void {
        super.onRefresh();
        this._showleftTime = 11;
        Tool.addTimer(this.onCloseTimedown, this, 1000);

        let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        let liansheng_score: number = 0;
        if (this.param.result == FightDefine.FIGHT_RESULT_SUCCESS) {
            this.currentState = 'win';
            liansheng_score = Math.min(50, (ladderData.wincount - 1) * 10);
            this.awardscore = ladderData.model.winjifen + liansheng_score;
            this.result_des_lab.text = Language.instance.parseInsertText('lianshengchangci', ladderData.wincount);
        } else {
            this.currentState = 'lost';
            this.awardscore = ladderData.model.lostjifen;
            this.result_des_lab.text = "";
        }

        ladderData.scoreCount = ladderData.scoreCount - this.awardscore;
        ladderData.onUpdateScore();
        /**第一步：战斗结果**/

        this.grade_icon_img.source = `arena_ladder_grade${ladderData.model.type}_png`;
        this.score_result_lab.text = Language.instance.getText('huodejifen') + "：" + this.awardscore + (liansheng_score > 0 ? `(${Language.instance.getText('liansheng')}+${liansheng_score})` : '');
        let model: Modelttre = JsonModelManager.instance.getModelttre()[ladderData.model.type - 1];
        this.score_probar.maximum = model.maxjifen;
        this.score_probar.value = ladderData.score;
        this.anim_grp1.x = 550;
        this.anim_grp1.alpha = 0;
        egret.Tween.get(this.anim_grp1).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn);
        Tool.callbackTime(this.onStartProgressAnim, this, 2000);

        /**第二步：更新当前血量**/
        let maxHp: number = DataManager.getInstance().playerManager.player.getPlayerData().maxHp;
        let currHp: number = this.param.hpValue;
        let hprate: number = Math.min(100, Math.ceil(currHp / maxHp * 100));
        this.currhp_rate_lab.text = `${hprate}%`;
        this.currhp_rate_lab.textColor = hprate < 10 ? 0xff4633 : 0xFFEC66;
        let xueqiuAnim: Animation = GameCommon.getInstance().addAnimation('tiantixueqiu', new egret.Point(60, this.END_HPANIM_Y), this.herohp_anim_grp, -1);
        xueqiuAnim.y = this.START_HPANIM_Y + Math.ceil((this.END_HPANIM_Y - this.START_HPANIM_Y) * (100 - hprate) / 100);
        this.anim_grp2.x = 550;
        this.anim_grp2.alpha = 0;
        egret.Tween.get(this.anim_grp2).to({ x: 550 }, 500).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn);

        /**第三步：获得物品**/
        // this.anim_grp3.x = 550;
        // this.anim_grp3.alpha = 0;
        // egret.Tween.get(this.anim_grp3).to({ x: 550 }, 1000).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn).call(this.onPlayAwardAnim, this);
    }
    private _showleftTime: number;
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            this.onHide();
            return;
        }
        this.btn_sure.label = `${Language.instance.getText('sure')}(${this._showleftTime})`;
    }
    //播放获得物品动画
    private onPlayAwardAnim(): void {
        // for (let i: number = 0; i < this.param.dropList.length; i++) {
        //     let awarditem: AwardItem = this.param.dropList[i];
        //     let goodsInstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
        //     let goodsGrp: eui.Group = new eui.Group();
        //     goodsGrp.width = 90;
        //     goodsGrp.height = 110;
        //     goodsGrp.addChild(goodsInstance);
        //     goodsInstance.y = 200;
        //     goodsInstance.alpha = 0;
        //     this.award_groud.addChild(goodsGrp);
        //     egret.Tween.get(goodsInstance).to({ y: 200 }, i * 100).to({ alpha: 1, y: 0 }, 300, egret.Ease.sineInOut);
        // }
    }
    //播放进度条的动画
    private _proCount: number;
    private onStartProgressAnim(): void {
        this._proCount = 0;
        Tool.addTimer(this.onPlayProgressAnim, this, 20);
    }
    private onPlayProgressAnim(): void {
        if (this._proCount >= this.awardscore) {
            Tool.removeTimer(this.onPlayProgressAnim, this, 20);
            return;
        }
        this._proCount++;
        let maxnum: number = this.score_probar.maximum;
        let currvalue: number = this.score_probar.value + 1;
        this.score_probar.value = currvalue;
        if (currvalue >= maxnum) {
            let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
            let model: Modelttre = JsonModelManager.instance.getModelttre()[ladderData.model.type];
            if (model) {
                this.score_probar.maximum = model.maxjifen;
                this.score_probar.value = 0;
                //段位变化动画
                egret.Tween.get(this.grade_icon_img).to({ x: -150, alpha: 0 }, 600, egret.Ease.circIn).call(function (grade: number) {
                    this.grade_icon_img.source = `arena_ladder_grade${grade}_png`;
                }, this, [model.type]).to({ x: 100 }, 20).to({ x: 0, alpha: 1 }, 600);
            }
        }
    }
    public onHide(): void {
        super.onHide();
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
    }
    //The end
}
class LadderArenaParam {
    public dropList: AwardItem[] = [];
    public hpValue: number;
    public result: number;
}