class DamageRankBar extends eui.Component {
    private hidden_btn: eui.Group;
    private my_damage_lab: eui.Label;
    private desc_lab: eui.Label;

    private _isHide: boolean = false;
    private MAX_ITEM_NUM: number = 5;

    public constructor() {
        super();
        this.skinName = skins.DamageRankBarSkin;
    }
    public onRegist(): void {
        this.hidden_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHiddenBtn, this);
        this.onMinimize(false);
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) {
            this.desc_lab.text = Language.instance.getText('allpeople_alert_0');
            for (var i: number = 0; i < this.MAX_ITEM_NUM; i++) {
                (this[`item${i}`] as DamageRankItem).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItemHanlde, this);
            }
        }
    }
    public onRemove(): void {
        this.hidden_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHiddenBtn, this);
        for (var i: number = 0; i < this.MAX_ITEM_NUM; i++) {
            (this[`item${i}`] as DamageRankItem).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItemHanlde, this);
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    public onUpdate(selfDamage: number, datas: BossDamageParam[]): void {
        for (var i: number = 0; i < this.MAX_ITEM_NUM; i++) {
            var datageData: BossDamageParam = datas[i];
            (this[`item${i}`] as DamageRankItem).data = datageData;
        }
        this.my_damage_lab.text = Language.instance.getText('wodeshuchu', '：', selfDamage);
    }
    private onTouchHiddenBtn(): void {
        this.onMinimize(!this._isHide);
    }
    private onMinimize(bool: boolean): void {
        if (this._isHide != bool) {
            this._isHide = bool;
            if (this._isHide) {
                this.currentState = 'minisize';
            } else {
                this.currentState = 'maxsize';
            }
        }
    }
    private onTouchItemHanlde(event: egret.Event): void {
        var item: DamageRankItem = event.currentTarget as DamageRankItem;
        if (item.currentState == 'fight') {
            // if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) {
            //     GameFight.getInstance().sendAllPeoplePkRequset(item.data.playerId);
            // }
        }
    }
    //The end
}
class DamageRankItem extends eui.Component {
    private hp_probar: eui.ProgressBar;
    private player_name_lab: eui.Label;

    private damageData: BossDamageParam;
    constructor() {
        super();
    }
    public set data(data: BossDamageParam) {
        this.damageData = data;
        if (this.damageData) {
            this.player_name_lab.text = `${data.index}.${data.playerName}`;
            var myunionID: number = DataManager.getInstance().unionManager.unionInfo ? DataManager.getInstance().unionManager.unionInfo.info.id : -1;
            if (this.damageData.unionID == myunionID) {
                this.currentState = 'firend';
            } else {
                if (this.damageData.hpPercent == 0) {
                    this.currentState = 'dead';
                } else {
                    if (data.playerId == DataManager.getInstance().playerManager.player.id) {
                        this.currentState = 'self';
                    } else {
                        this.currentState = 'fight';
                    }
                    this.hp_probar.maximum = 100;
                    this.hp_probar.value = data.hpPercent;
                }
            }
        } else {
            this.currentState = 'defalut';
        }
    }
    public get data(): BossDamageParam {
        return this.damageData;
    }
}
class BossDamageParam {
    public index: number;
    public damageNum: number;
    public playerName: string;
    public headidx: number;
    public headFrame: number;
    public playerId: number;
    public isFight: boolean;
    public unionID: number;
    public hpPercent: number;
    public get isFirst(): boolean {
        return this.index == 1;
    }
}