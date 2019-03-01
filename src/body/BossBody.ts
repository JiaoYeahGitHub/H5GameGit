class BossBody extends MonsterBody {

    public constructor() {
        super();
    }
    public onRefreshData(): void {
        super.onRefreshData();
        this._moveTarget = null;
    }
    protected onResetHeadInfo(): void {
        this.onShowOrHideHpBar(false);
    }
    public setMove(pointPaths: Array<egret.Point>) {
        if (GameFight.getInstance().canBossMove) {
            super.setMove(pointPaths);
        } else {
            this._moveTarget = null;
            this._movePaths = null;
        }
    }
    //缩放修改
    protected onScaleHandler(): void {
        if (this._body) {
            this._body.scaleX = 1.3;
            this._body.scaleY = 1.3;
        }
    }
    //击退效果
    protected onRepelEffect(damage: DamageData): void {
    }
    //死亡效果
    protected onDeathEffect(damage: DamageData): void {
        TweenLiteUtil.onHideTween(this);
    }
    //The end
} 