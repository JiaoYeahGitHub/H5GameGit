// TypeScript file
class CailiaoDupView extends BaseTabView {
    private cailiaoItems: CailiaoDupItem[];
    private cailiaodupList: eui.Scroller;
    private cailiaodupGroup: eui.Group;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.CailiaoDupViewSkin;
    }
    protected onInit(): void {
        this.cailiaoItems = [];
        var dupModels: DupInfo[] = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_CAILIAO);
        for (var i: number = 0; i < dupModels.length; i++) {
            var cailiaoDupinfo: DupInfo = dupModels[i];
            var cailiaodupItem: CailiaoDupItem = new CailiaoDupItem(cailiaoDupinfo.subtype);
            // this.cailiaodupGroup.addChild(cailiaodupItem);
            this.cailiaoItems.push(cailiaodupItem);
        }
        this.onRefresh();
    }
    protected onRefresh(): void {
        (this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_CAILIAO);
    }
    private onResDupInfoMsg(): void {
        for (var i: number = 0; i < this.cailiaoItems.length; i++) {
            var cailiaodupItem: CailiaoDupItem = this.cailiaoItems[i];
            cailiaodupItem.onUpdate();
        }
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
        for (var i: number = 0; i < this.cailiaoItems.length; i++) {
            var cailiaodupItem: CailiaoDupItem = this.cailiaoItems[i];
            cailiaodupItem.onShow(this.cailiaodupGroup);
        }
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onResDupInfoMsg, this);
    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
        for (var i: number = 0; i < this.cailiaoItems.length; i++) {
            var cailiaodupItem: CailiaoDupItem = this.cailiaoItems[i];
            cailiaodupItem.onDestory();
        }
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onResDupInfoMsg, this);
    }
    //The end
}
class CailiaoDupItem extends BaseComp {
    private subId: number;
    private _dupinfo: DupInfo;
    private dup_backimg: eui.Image;
    private diffcult_img: eui.Image;
    private diffcult_back: eui.Image;
    private img_dupName: eui.Image;
    private btn_challenge: eui.Button;
    private btn_saodang: eui.Button;
    private dup_num: eui.Label;
    private dup_numdesc: eui.Label;
    private times_grp: eui.Group;
    private tisheng_desc_lab: eui.Label;
    // private baozeng_lab: eui.Label;
    private dup_limit: eui.Label;
    private consume_price_label: eui.Label;
    private unopen_des_lab: eui.Label;
    private unopen_grp: eui.Group;
    private saodang_probar: eui.ProgressBar;
    private saodang_consume: eui.Group;
    private drop_goods: GoodsInstance;
    private nameDiff: eui.Label;
    // protected points: redPoint[] = RedPointManager.createPoint(1);
    constructor(subType: number) {
        super();
        this.subId = subType;
        this.skinName = skins.CailiaoDupItem;
    }
    protected setSkinName(): void {
    }
    protected onInit(): void {
        this.dup_backimg.source = "cailiao_itemback" + this.subId + "_jpg";
        this.saodang_probar.maximum = 100;
        this.onUpdate();
    }
    protected onRegist(): void {
        this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
        this.btn_saodang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDupSweep, this);
    }
    protected onRemove(): void {
        this.btn_challenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
        this.btn_saodang.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDupSweep, this);
    }
    public onUpdate(): void {
        if (!this.isLoaded) return;
        this._dupinfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_CAILIAO, this.subId);
        let model: Modelcopy = this._dupinfo.dupModel;
        let nextmodel: Modelcopy = this._dupinfo.nextModel;
        this.consume_price_label.text = "" + this._dupinfo.dupModel.price;
        this.nameDiff.text = this._dupinfo.dupModel.name;
        this.drop_goods.visible = true;
        let awarditem: AwardItem = this._dupinfo.dupModel.rewards[0];
        if (awarditem)
            this.drop_goods.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
        else
            this.drop_goods.visible = false;
        this.drop_goods.currentState = 'normal'
        if (nextmodel && this._dupinfo.diffcult > 0) {
            let coatardlvDesc: string = Language.instance.getText(`coatard_level${nextmodel.lvlimit}`, 'jingjie');
            let nextlevelDes: string = `[#FFFF00${coatardlvDesc}]` + Language.instance.getText('kaiqixiayinandu');
            this.dup_limit.textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(nextlevelDes));
            this.tisheng_desc_lab.text = Language.instance.getText(`chanchutisheng`);
        } else {
            this.dup_limit.text = "";
            this.tisheng_desc_lab.text = "";
        }
        let bl: boolean = false;
        if (this._dupinfo.cailiaoPassRecord <= 0 && this._dupinfo.lefttimes > 0) {
            this.btn_saodang.visible = false;
            this.btn_challenge.visible = this._dupinfo.diffcult > 0;
            let openCondition: string = this._dupinfo.getOpenCondition();
            if (this._dupinfo.diffcult == 0 || openCondition) {
                this.unopen_grp.visible = true;
                this.times_grp.visible = false;
                this.unopen_des_lab.text = openCondition;
            } else {
                this.unopen_grp.visible = false;
                this.times_grp.visible = true;
            }

            this.saodang_consume.visible = false;
            this.dup_num.text = this._dupinfo.lefttimes + "";
            this.dup_numdesc.text = Language.instance.getText('shengyucishu', "：");
            bl = true;
        } else {
            this.times_grp.visible = true;
            this.btn_challenge.visible = false;
            this.unopen_grp.visible = false;
            this.saodang_consume.visible = this._dupinfo.leftSweepNum > 0;
            this.saodang_probar.visible = this.saodang_consume.visible && this._isSweep;
            this.btn_saodang.visible = !this.saodang_probar.visible;
            this.btn_saodang.enabled = this._dupinfo.leftSweepNum > 0;
            this.btn_saodang.label = '扫  荡';
            if (this._dupinfo.lefttimes > 0) {
                this.saodang_probar.visible = this._isSweep;
                this.btn_saodang.label = '快速挑战';
                this.saodang_consume.visible = false;
                this.dup_numdesc.text = Language.instance.getText('mianfeisaodang', '：');
                this.dup_num.text = this._dupinfo.lefttimes + "";
            } else if (this._dupinfo.leftSweepNum > 0) {
                this.dup_numdesc.text = Language.instance.getText('jinrishengyusaodang', "：");
                this.dup_num.text = this._dupinfo.leftSweepNum + "";
            } else {
                this.dup_numdesc.text = Language.instance.getText('jinrisaodangyiyongwan');
                this.dup_num.text = "";
            }
        }
        // this.points[0].checkPoint(true, bl);
    }
    private _isSweep: boolean;
    private onDupSweep(): void {
        if (DataManager.getInstance().playerManager.player.gold < this._dupinfo.dupModel.price && this._dupinfo.lefttimes <= 0) {
            GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2))
            return;
        }
        // if (this._dupinfo.leftSweepNum > 0) {
        this._isSweep = true;
        this.saodang_probar.visible = true;
        this.btn_saodang.visible = false;
        this.saodang_probar.slideDuration = 0;
        this.saodang_probar.value = 0;
        this.saodang_probar.slideDuration = 2000;
        this.saodang_probar.value = 100;
        this.saodang_probar.labelFunction = function (value: number, maximum: number): string {
            return Language.instance.getText('saodangzhong');
        };
        Tool.callbackTime(this.onCompleteSweep, this, 2000);
        // }
    }
    //发送进入副本协议
    private onChallengeDup(event: egret.Event): void {
        GameFight.getInstance().onSendEnterDupMsg(this.dupinfo.id);
    }
    private onCompleteSweep(): void {
        this._isSweep = false;
        var saodangMsg: Message = new Message(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE);
        saodangMsg.setByte(this.dupinfo.id);
        GameCommon.getInstance().sendMsgToServer(saodangMsg);
    }
    public get dupinfo(): DupInfo {
        return this._dupinfo;
    }
    //The end
}