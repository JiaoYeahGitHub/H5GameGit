// TypeScript file
class TeamDupView extends BaseTabView {
    private dup_desc_lab: eui.Label;
    private reward_grp: eui.Group;
    private challenge_btn: eui.Button;
    private mvp_award_item: GoodsInstance;
    private lefttimes_bar: TimesBar;
    private groupItems: eui.Group;
    private items: TeamDupInfoItem[];
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TeamDupViewSkin;
    }
    protected onInit(): void {
        this.dup_desc_lab.text = Language.instance.getText("zuduifuben_wanfa");
        this.items = [];
        this.updateItemList();
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.onRequestDupInfo();
    }
    //副本信息返回
    private onReciveMsg(): void {
        let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_TEAM, 1);
        let model: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[dupinfo.id];
        let nextmodel: Modelcopy = dupinfo.nextModel;

        if (dupinfo.teamPassRecord > 0 && dupinfo.lefttimes != 5) {
            this.challenge_btn.label = '扫 荡';
        } else {
            this.challenge_btn.label = '开启组队';
        }
        if (nextmodel) {
            let coatardlvDesc: string = Language.instance.getText(`coatard_level${nextmodel.lvlimit}`, 'jingjie');
            let nextlevelDes: string = `[#FFFF00${coatardlvDesc}]` + Language.instance.getText('kaiqixiayinandu');
        }
        if (model) {
            this.reward_grp.removeChildren();
            for (let aIndex: number = 0; aIndex < model.rewards.length; aIndex++) {
                let goodsInstance: GoodsInstance = new GoodsInstance();
                let awarditem: AwardItem = model.rewards[aIndex];
                goodsInstance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
                this.reward_grp.addChild(goodsInstance);
            }
        }
        let mpvaward: AwardItem = GameCommon.parseAwardItem(model.viprewards);
        this.mvp_award_item.onUpdate(mpvaward.type, mpvaward.id, 0, mpvaward.quality, mpvaward.num);
        this.challenge_btn.enabled = dupinfo.lefttimes > 0;
        this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];

        this.updateItemList(dupinfo.diffcult - 1);
    }

    private updateItemList(diffcult: number = -1) {
        let modelIDS = ["21", "22", "23", "24"];
        let models = JsonModelManager.instance.getModelzuduifuben();
        for (let i = 0; i < 4; ++i) {
            if (!this.items[i]) {
                this.items[i] = new TeamDupInfoItem(models[modelIDS[i]], i);
                this.groupItems.addChild(this.items[i]);
            }
            this.items[i].data = diffcult;
        }
    }
    private onRefreshSweep(): void {
        let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_TEAM, 1);
        this.challenge_btn.enabled = dupinfo.lefttimes > 0;
        this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];
    }
    //去请求副本信息
    private onRequestDupInfo(): void {
        (this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_TEAM);
    }
    //发送进入副本协议
    private onChallengeDup(event: egret.Event): void {
        var dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_TEAM)[0];
        if (dupinfo.teamPassRecord > 0 && dupinfo.lefttimes != 5) {
            if (dupinfo.lefttimes <= 0) {
                GameCommon.getInstance().addAlert("error_tips_6");
                return;
            }
            if (!GameFight.getInstance().checkBagIsFull()) {
                var saodangMsg: Message = new Message(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE);
                saodangMsg.setByte(dupinfo.dupModel.id);
                GameCommon.getInstance().sendMsgToServer(saodangMsg);
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

class TeamDupInfoItem extends BaseComp {
    private name_img: eui.Image;
    private boss_itemcell_img: eui.Image;
    private state_lab: eui.Label;
    private locked_bg: eui.Image;
    private limit_lv_lab: eui.Label;
    private label_name: eui.Label;
    private state_tips_grp: eui.Group;
    public looprank_label: eui.Label;
    private awardicon: GoodsInstance;

    private imgFrame: eui.Image;
    private imgTitleBG: eui.Image;
    private imgStateBG: eui.Image;
    private model: Modelzuduifuben;
    private idx: number;

    constructor(model: Modelzuduifuben, idx: number) {
        super();
        this.model = model;
        this.idx = idx;
    }

    protected setSkinName(): void {
        this.skinName = skins.SamsaraBossItemSkin;
    }

    protected dataChanged(): void {
        let diffcult: number = this._data;
        this.looprank_label.visible = false;
        this.boss_itemcell_img.source = `samsara_item${this.idx}_open_png`;
        this.label_name.text = this.model.name;
        // let waveAward: AwardItem = this.model.cost;
        this.awardicon.visible = false;

        let isOpen = this.idx == diffcult;
        this.setLock(!isOpen);
        if (isOpen) {
            this.state_lab.text = Language.instance.getText('tiaozhanzhong');
        } else {
            if (this.idx < diffcult) {
                this.state_lab.text = "已完成";
            } else {
                let modelCopy: Modelcopy = JsonModelManager.instance.getModelcopy()[this.model.id];
                this.state_lab.text = Language.instance.getText(`coatard_level${modelCopy.lvlimit}`, 'open');
            }
        }
    }

    private setLock(isLock: boolean) {
        this.locked_bg.visible = isLock;
        this.imgFrame.source = isLock ? "samsara_item_frame_gray_png" : "samsara_item_frame_png";
        this.imgTitleBG.source = isLock ? "samsara_item_title_bg_gray_png" : "samsara_item_title_bg_png";
        this.imgStateBG.source = isLock ? "samsara_item_wkq_gray_png" : "samsara_item_wkq_png";
    }
}