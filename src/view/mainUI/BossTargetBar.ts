/**
 *
 * @author 
 *
 */
class BossTargetBar extends eui.Component {
    // private _data: BodyData;
    private boosHP: number;
    private bossname_label: eui.Label;
    private boss_head_icon: eui.Image;
    private progressBar: eui.ProgressBar;
    private thumb: eui.Image;
    private thumb_next: eui.Image;
    private pro_lab: eui.Label;

    private hpLevelNum: number = 1;//多少管血
    private maxinum: number = 0;//每一管血最值
    private currhplevel: number = 0;//当前第几管血
    private MAX_SOURCE: number = 4;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onInit, this);
        this.skinName = skins.WorldBoss_ProBarSkin;
    }
    private onInit(): void {
        this.thumb = this.progressBar['thumb'] as eui.Image;
        this.thumb_next = this.progressBar['thumb_next'] as eui.Image;
        this.pro_lab = this.progressBar['pro_lab'] as eui.Label;
        this.progressBar.slideDuration = 0;
    }
    public onTarget(data: BodyData): void {
        this.boosHP = null;
        // this._data = data;
        if (!data) return;
        this.boss_head_icon.source = GameCommon.getInstance().getHeadIconByModelid(data.modelid);
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            this.bossname_label.text = data.model.name + ' ' + Language.instance.parseInsertText('dijiguan', GameFight.getInstance().yewai_waveIndex);
        } else {
            this.bossname_label.text = data.model.name;
        }
        this.currhplevel = 0;
    }
    public onUpdateProgress(hp, maxhp = 0): void {
        if (maxhp > 0) {
            this.initHPLevelNum();
            this.maxinum = Math.ceil(maxhp / this.hpLevelNum);
            this.progressBar.maximum = this.maxinum;
            if (!Tool.isNumber(this.boosHP)) {
                this.boosHP = maxhp;
            }
        }
        this.boosHP = Math.max(0, Math.min(hp, this.boosHP));
        let oldlevel: number = this.currhplevel;
        this.currhplevel = Math.max(0, Math.ceil(this.boosHP / this.maxinum));
        if (oldlevel > 0 && this.currhplevel > 0 && this.currhplevel != oldlevel) {
            this.progressBar.value = this.maxinum;
        }
        this.pro_lab.text = "×" + this.currhplevel;
        let currHp: number = Tool.toInt(this.boosHP % this.maxinum);
        this.progressBar.value = currHp;
        let sourceIdx: number = ((this.currhplevel - 1) % this.MAX_SOURCE) + 1;
        this.thumb.source = this.currhplevel <= 1 ? "boss_thumb_b_0_png" : `boss_thumb_b_${sourceIdx}_png`;
        sourceIdx = ((this.currhplevel - 2) % this.MAX_SOURCE) + 1;
        switch (this.currhplevel) {
            case 1:
                this.thumb_next.source = '';
                break;
            case 2:
                this.thumb_next.source = 'boss_thumb_b_0_png';
                break;
            default:
                if (this.currhplevel > 0) {
                    if (this.thumb_next.source != `boss_thumb_b_${sourceIdx}_png`) {
                        this.thumb_next.source = `boss_thumb_b_${sourceIdx}_png`;
                    }
                } else {
                    this.thumb_next.source = '';
                }
                break;
        }
    }
    public onRemove(): void {
        // this._data = null;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    // public get data(): BodyData {
    //     return this._data;
    // }
    private initHPLevelNum(): void {
        let scenetype: FIGHT_SCENE = GameFight.getInstance().fightsceneTpye;
        switch (scenetype) {
            case FIGHT_SCENE.ALLPEOPLE_BOSS:
            case FIGHT_SCENE.XUEZHAN_BOSS:
            case FIGHT_SCENE.VIP_BOSS:
            case FIGHT_SCENE.XIANSHAN_BOSS:
                this.hpLevelNum = 10;
                break;
            case FIGHT_SCENE.SAMSARA_BOSS:
                this.hpLevelNum = 20;
                break;
            case FIGHT_SCENE.CROSS_PVE_BOSS:
                this.hpLevelNum = 50;
                break;
            default:
                this.hpLevelNum = 1;
                break;
        }
    }
    //The end
}
