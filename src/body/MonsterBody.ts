class MonsterBody extends ActionBody {
    protected _body: BodyAnimation;
    protected isFace5: boolean = false;

    public constructor() {
        super();
    }
    protected onInitBodyHead(): void {
        super.onInitBodyHead();
        this.bodyHead.hpProBarSkinName(skins.HpProgressBar2);
    }
    protected onResetHeadInfo(): void {
        super.onResetHeadInfo();
        this.onShowOrHideHpBar(true);
    }
    //怪物数据
    public set data(data: MonsterData) {
        egret.superSetter(MonsterBody, this, "data", data);
    }
    public get data(): MonsterData {
        return this._data;
    }
    public onRefreshData(): void {
        this.moveSpeed = GameDefine.XG_Move_Speed;
        this.bodyHead.bodyName = "";
        super.onRefreshData();
    }
    //更换动作
    protected updateAction(): void {
        this.onChangeBody();
    }
    //更换方向
    protected updateDirection(): void {
        var direFrame: string = this.getDirectionFrame();
        if (this._body) {
            var resName = LoadManager.getInstance().getMonsterResUrl(this.data.avatar, this.actionName, direFrame);
            this._body.onFrame(resName, direFrame);
        }
    }
    //更新模型
    public onChangeBody(): void {
        if (this.data && this.data.avatar) {
            var resName = LoadManager.getInstance().getMonsterResUrl(this.data.avatar, this.actionName, this.getDirectionFrame());
            if (!this._body) {
                this._body = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
                this.onScaleHandler();
                this.bodyLayer.addChildAt(this._body, PLAYER_LAYER.BODY);
            } else {
                this._body.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
            }
        }
    }
    //移动
    public onMove(): void {
        super.onMove();
    }
    //缩放修改
    protected onScaleHandler(): void {
        if (this._body) {
            this._body.scaleX = 1;
            this._body.scaleY = 1;
        }
    }
    //被击处理
    private _hurtflashBmp: egret.Bitmap;
    // private _hurtDir: Direction;
    public onHurt(damage: DamageData): void {
        // this._hurtDir = damage.fromDire;
        if (damage.scenetype != GameFight.getInstance().fightsceneTpye) return;
        super.onHurt(damage);
        // this.onFlashAnimation();
        if (damage.judge != FightDefine.JUDGE_DUODUAN) {
            if (this.data.isDie) {
                this.onDeathEffect(damage);
            } else {
                this.onRepelEffect(damage);
            }
        }
    }
    //击退效果
    protected onRepelEffect(damage: DamageData): void {
        if (GameFight.getInstance().canHitBack && damage.skill.id == SkillDefine.COMMON_SKILL_ID && !this.walkOn) {
            let angle = (-(Math.atan2((this.y - damage.attacker.y), (this.x - damage.attacker.x))) * (180 / Math.PI));
            angle = angle < 0 ? 360 + angle : angle;
            let backPoint: egret.Point = Tool.getPosByRadiiAndAngle(this.x, this.y, angle, SkillDefine.DRAWBACK_DISTANCE);
            this.x = backPoint.x;
            this.y = backPoint.y;
        }
    }
    //死亡效果
    protected onDeathEffect(damage: DamageData): void {
        if (!this.parent) return;
        let hitbackPos: egret.Point;
        if (damage.skill.id == SkillDefine.COMMON_SKILL_ID) {
            this.onShowOrHideHpBar(false);
            hitbackPos = Tool.beelinePoint(this.x, this.y, damage.fromDire, Tool.toInt(Math.random() * 50) + 300);
            TweenLiteUtil.onDeathFly(this, null, null, hitbackPos);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_EARTHQUAKE_STRAT));
        } if (damage.skill.effectClass == 'FabaoSkillEffect') {
            TweenLiteUtil.onHideTween(this);
        } else {
            hitbackPos = Tool.beelinePoint(this.x, this.y, damage.fromDire, Tool.toInt(Math.random() * 150) + 100);
            TweenLiteUtil.onBelineTween(this, hitbackPos, 600);
            TweenLiteUtil.onHideTween(this);
        }
    }
    //闪烁
    // private onFlashAnimation(): void {
    // if (!this._hurtflashBmp && this._body) {
    //     var bodyTexture: egret.Texture = this._body.currFrameTexture;
    //     if (bodyTexture) {
    //         this._hurtflashBmp = new egret.Bitmap(bodyTexture);
    //         this._hurtflashBmp.x = this._body.x - this._hurtflashBmp.width / 2;
    //         this._hurtflashBmp.y = this._body.y - this._hurtflashBmp.height;
    //         this._hurtflashBmp.filters = [GameDefine.WirteColorFlilter];
    //         this.addChild(this._hurtflashBmp);
    //         Tool.callbackTime(this.onFinishFlashAnim, this, 150);
    //     }
    // }
    // }
    // private onFinishFlashAnim(): void {
    //     if (this._hurtflashBmp) {
    //         this.removeChild(this._hurtflashBmp);
    //         this._hurtflashBmp = null;
    //     }
    // }
    //检查死亡
    // protected onCheckDeath(): boolean {
    //     if (!this.data.isDie) return false;
    //     this.onShowOrHideHpBar(false);
    //     if (this._hurtDir) {
    //         let hitbackPos: egret.Point = Tool.beelinePoint(this.x, this.y, this._hurtDir, Tool.toInt(Math.random() * 100) + 100);
    //         TweenLiteUtil.onBelineTween(this, hitbackPos, 300);
    //     }
    //     TweenLiteUtil.onHideTween(this, this.overDeathAnim, this, 320);
    //     return true;
    // }
    // protected overDeathAnim(): void {
    //     super.onCheckDeath();
    // }
    //重置状态
    public onReset(): void {
        this.childOffY = 0;
        egret.Tween.removeTweens(this);
        // this.onFinishFlashAnim();
        super.onReset();
    }
    //The end
} 