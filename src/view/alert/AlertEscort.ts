class AlertEscort extends BaseWindowPanel {
    public btnOk: eui.Button;
    public btnBack: eui.Button;
    public param: AlertEscortParam;
    private my_name_label: eui.Label;
    private my_fight_label: eui.BitmapLabel;
    private enemy_name_label: eui.Label;
    private enemy_fight_label: eui.BitmapLabel;
    private label_hint: eui.Label;
    private my_head_img: PlayerHeadUI;
    private enemy_head_img: PlayerHeadUI;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.AlertEscortSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("VS");
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.my_name_label.text = DataManager.getInstance().playerManager.player.name;
        this.my_fight_label.text = DataManager.getInstance().playerManager.player.playerTotalPower.toString();
        var enemyHeadIndex: number = 1;
        var enemyHeadFrame: number = 1;
        if (egret.is(this.param.param, "EscortRobData")) {
            this.enemy_name_label.text = this.param.param.name;
            this.enemy_fight_label.text = this.param.param.fightvalue;
            this.btnOk.label = "劫 杀";
        } else if (egret.is(this.param.param, "ArenaEnemy")) {
            var arenaEnemy: ArenaEnemy = this.param.param as ArenaEnemy;
            this.enemy_name_label.text = arenaEnemy.playerData.name;
            this.enemy_fight_label.text = arenaEnemy.playerData.fightvalue;
            this.label_hint.textFlow = this.param.texts;
            this.btnOk.label = "挑 战";
            enemyHeadIndex = arenaEnemy.playerData.headindex;
            enemyHeadFrame = arenaEnemy.playerData.headFrame;
        }

        this.my_head_img.setHead();
        this.enemy_head_img.setHead(enemyHeadIndex, enemyHeadFrame);
    }
    public onEventOk() {
        this.onEventBack();
        egret.callLater(this.param.callback, this.param.target, this.param.param);
    }

    public onShowWithParam(param: AlertEscortParam): void {
        this.param = param;
        this.onShow();
    }
    public onShow() {
        super.onShow();
    }

    public onEventBack() {
        this.onHide();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
    }
}
class AlertEscortParam {
    public callback;
    public target;
    public param;
    public texts;
    public constructor(texts, callback, target, param = null) {
        this.callback = callback;
        this.target = target;
        this.param = param;
        this.texts = texts;
    }
}