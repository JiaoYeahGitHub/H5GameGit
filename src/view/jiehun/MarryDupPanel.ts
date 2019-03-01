// TypeScript file
class MarryDupPanel extends BaseTabView {
    private reward_grp: eui.Group;
    private challenge_btn: eui.Button;
    private boss_avatar_grp: eui.Group;
    private lefttimes_bar: TimesBar;
    private bossAnim: BodyAnimation;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.MarryDupSkin;
    }
    protected onInit(): void {

        this.onRefresh();
    }
    protected onRefresh(): void {
        this.onRequestDupInfo();
    }
    //副本信息返回
    private onReciveMsg(): void {
        let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_MARRY, 1);
        let model: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[dupinfo.id];
        let nextmodel: Modelcopy = dupinfo.nextModel;
        // this.diffcult_img.source = `dup_difficult${dupinfo.diffcult}_png`;
        // this.curr_drop_lab.text = Language.instance.getText(`zuduifuben_drop_diff${dupinfo.diffcult}`);
        this.challenge_btn.label = '挑 战';
        if (nextmodel) {
            let coatardlvDesc: string = Language.instance.getText(`coatard_level${nextmodel.lvlimit}`, 'jingjie');
            let nextlevelDes: string = `[#FFFF00${coatardlvDesc}]` + Language.instance.getText('kaiqixiayinandu');
            // this.next_open_lab.textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(nextlevelDes));
            // this.next_drop_lab.text = Language.instance.getText('chanchu', `zuduifuben_drop_diff${dupinfo.diffcult + 1}`);
        }
        if (model) {
            this.reward_grp.removeChildren();
            for (let aIndex: number = 0; aIndex < model.rewards.length; aIndex++) {
                let goodsInstance: GoodsInstance = new GoodsInstance();
                let awarditem: AwardItem = model.rewards[aIndex];
                goodsInstance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
                this.reward_grp.addChild(goodsInstance);
            }
             this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, Number(model.bossId));
			if (!this.bossAnim.parent) {
				this.boss_avatar_grp.addChild(this.bossAnim);
			}
        }
       
        let mpvaward: AwardItem = GameCommon.parseAwardItem(model.viprewards);
        // this.mvp_award_item.onUpdate(mpvaward.type, mpvaward.id, 0, mpvaward.quality, mpvaward.num);
        this.challenge_btn.enabled = dupinfo.lefttimes>0;
        this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];
    }
    private onRefreshSweep():void{
        let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_MARRY, 1);
        this.challenge_btn.enabled = dupinfo.lefttimes>0;
        this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];
    }
    //去请求副本信息
    private onRequestDupInfo(): void {
        DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_MARRY);
    }
    //发送进入副本协议
    private onChallengeDup(event: egret.Event): void {
        var dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_MARRY)[0];
        if(dupinfo.teamPassRecord>0&&dupinfo.lefttimes !=5)
        {
            if (dupinfo.lefttimes <= 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
            }
        }
        GameFight.getInstance().onSendCreateTeamDupRoomMsg(dupinfo.dupModel.id);
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onReciveMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefreshSweep, this);
        this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onReciveMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefreshSweep, this);
        this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
    }
    private get dupManager(): DupManager {
        return DataManager.getInstance().dupManager;
    }
    //The end
}