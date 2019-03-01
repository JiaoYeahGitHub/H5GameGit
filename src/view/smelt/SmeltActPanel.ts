class SmeltActPanel extends BaseTabView {
    private items: SmeltInstance[];
    private imgFrameName: string = "iconFrame";
    private imgIconName: string = "iconDisplay";
    // private itemLayer: eui.Group;
    private btn_smelt: eui.Button;
    private btn_smelt_all: eui.Button;
    private smeltQueue;
    private currEquip: EquipThing[];
    private btnGroup;
    private bar: eui.Scroller;
    private actItemGroup: eui.List;
    private buttonIndex: number = 0;
    private title_img: eui.Image;
    private timeLab: eui.Label;
    protected points: redPoint[] = RedPointManager.createPoint(4);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SmeltActPanelSkin;
    }
    private btnTp: number[] = [1, 1, 41, 41];
    private btnsubTp: number[] = [0, 1, 0, 1];
    private btnNameStr: string[] = ['关卡第1', '关卡2-5', '全民首胜', '全民2-5'];
    protected onInit(): void {
        this.actItemGroup.itemRenderer = SmeltActItem;
        this.actItemGroup.itemRendererSkinName = skins.SmeltActItemSkin;
        this.actItemGroup.useVirtualLayout = true;
        this.bar.viewport = this.actItemGroup;
        super.onInit();
        let button: eui.Button = new eui.Button();
        button.skinName = skins.ScrollerTabBtnSkin;
        for (var i = 0; i < 4; i++) {
            var btn: eui.RadioButton;
            btn = new BaseTabButton('', this.btnNameStr[i]);
            if (i == 0) {
                btn.selected = true;
            }
            btn.width = 103;
            btn.name = i + '';
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
            this.btnGroup.addChild(btn);
        }

        for (var i = 0; i < 4; i++) {
            this.points[0].register(btn, new egret.Point(95, -7), DataManager.getInstance().activitySmeltManager, "getSmeltPoint", this.btnTp[i], this.btnsubTp[i]);
            this.points[1].register(btn, new egret.Point(95, -7), DataManager.getInstance().activitySmeltManager, "getSmeltPoint", this.btnTp[i], this.btnsubTp[i]);
            this.points[2].register(btn, new egret.Point(95, -7), DataManager.getInstance().activitySmeltManager, "getSmeltPoint", this.btnTp[i], this.btnsubTp[i]);
            this.points[3].register(btn, new egret.Point(95, -7), DataManager.getInstance().activitySmeltManager, "getSmeltPoint", this.btnTp[i], this.btnsubTp[i]);
        }

        this.title_img.source = 'ronglian_zi1_png';
        this.actItemGroup.dataProvider = new eui.ArrayCollection(this.getModel(1, 0));
        this.onRefresh();
    }

    private actModel: ActSmeltData[];
    private getModel(tp, idx): ActSmeltData[] {
        this.actModel = [];
        var models = JsonModelManager.instance.getModelkaifuduihuan()

        for (let k in models) {
            if (tp == models[k].type) {
                var actData: ActSmeltData = new ActSmeltData();
                actData.tp = idx;
                actData.model = models[k];
                this.actModel.push(actData);
            }
        }
        return this.actModel;
    }

    private onEventBtn(event: egret.TouchEvent) {
        let idx = parseInt(event.target.name);
        this.title_img.source = 'ronglian_zi' + (idx + 1) + '_png';
        this.idx = idx;
        this.actItemGroup.dataProvider = new eui.ArrayCollection(this.getModel(this.btnTp[idx], this.btnsubTp[idx]));
    }
    private idx: number = 0;
    protected onRegist(): void {
        super.onRegist();

        this.examineCD(true);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_RONGLIAN_DUIHUAN.toString(), this.updateAwardList, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.examineCD(false);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_RONGLIAN_DUIHUAN.toString(), this.updateAwardList, this);
    }
    public examineCD(open: boolean) {
        if (open) {
            Tool.addTimer(this.onCountDown, this, 1000);
        } else {
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
    }
    public onCountDown() {
        var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ACT_RONGLIAN);
        if (time > 0) {
        } else {
            time = 0;
            this.examineCD(false);
            // this.owner.onTimeOut();
        }
        this.onShowCD(time);
    }
    public onShowCD(time: number) {
        this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }
    protected onRefresh(): void {
        this.onRequestAwdStatusMsg();
    }
    private onRequestAwdStatusMsg(): void {
        let updatelistMsg: Message = new Message(MESSAGE_ID.ACT_RONGLIAN_DUIHUAN);
        updatelistMsg.setShort(0);
        updatelistMsg.setByte(99);
        GameCommon.getInstance().sendMsgToServer(updatelistMsg);
    }
    private updateAwardList(): void {
        this.actItemGroup.dataProvider = new eui.ArrayCollection(this.getModel(this.btnTp[this.idx], this.btnsubTp[this.idx]));
    }
}
class SmeltActItem extends eui.ItemRenderer {
    private item0: GoodsInstance;
    private btn_go: eui.Button;
    private m_id: number;
    private m_tp: number;
    private imgNum: eui.BitmapLabel;
    private lastNum: eui.Label;
    private imgNum1: eui.BitmapLabel;
    private zhuan: eui.Image;
    private guan: eui.Image;
    private consume: CurrencyBar;
    private cost_consume: ConsumeBar;
    private desc_lab: eui.Label;
    private hasCost: number;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onComplete, this);
    }
    protected onComplete(): void {
        this.consume.nameColor = 0xf3f3f3;
        this.btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }
    private onTouchItem(e: egret.Event): void {
    }
    protected dataChanged(): void {
        super.dataChanged();
        this.hasCost = 0;
        if (this.data) {
            if (this.data.model.type <= 1) {
                this.imgNum.text = this.data.model.mubiao;
                this.imgNum1.text = '';
                this.zhuan.visible = false;
                this.guan.visible = true;
            }
            else {
                this.zhuan.visible = true;
                this.guan.visible = false;
                this.imgNum.text = '';
                this.imgNum1.text = this.data.model.mubiao;
            }

            this.m_id = this.data.model.id;
            this.m_tp = this.data.tp;
            let smelt_awd_Key: string = `${this.data.model.type}_${this.data.model.mubiao}`;

            this.desc_lab.text = Language.instance.parseInsertText(`kaifuhuishou${this.data.model.type}_${this.data.tp}`, this.data.model.mubiao);
            if (this.data.tp == 0) {
                var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.data.model.firstRewards);
                if (awards) {
                    let awarditem: AwardItem = awards[0];
                    this.item0.onUpdate(awarditem.type, awarditem.id);
                    this.cost_consume.setConsume(awarditem.type, awarditem.id, awarditem.num);
                    this.cost_consume.nameColor = GameCommon.getInstance().CreateNameColer(this.cost_consume.model.quality);
                    this.hasCost = DataManager.getInstance().bagManager.getGoodsThingNumById(awarditem.id);
                }

                if (DataManager.getInstance().activitySmeltManager.smeltIds[smelt_awd_Key]) {
                    let awdRoleName: string = DataManager.getInstance().activitySmeltManager.smeltIds[smelt_awd_Key];
                    this.lastNum.text = "归属者：" + awdRoleName;
                    if (awdRoleName == DataManager.getInstance().playerManager.player.name && this.hasCost > 0) {
                        this.btn_go.visible = true;
                        this.cost_consume.visible = true;
                    } else {
                        this.btn_go.visible = false;
                        this.cost_consume.visible = false;
                    }
                }
                else {
                    this.lastNum.text = '挑战剩余名额：1';
                    this.btn_go.visible = true;
                    this.cost_consume.visible = true;
                }

                var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.data.model.firstDuihuan);
                if (awards) {
                    this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(awards[0].type, awards[0].id, awards[0].num));
                }
            }
            else {
                var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.data.model.otherRewards);
                if (awards) {
                    let awarditem: AwardItem = awards[0];
                    this.item0.onUpdate(awarditem.type, awarditem.id);
                    this.cost_consume.setConsume(awarditem.type, awarditem.id, awarditem.num);
                    this.cost_consume.nameColor = GameCommon.getInstance().CreateNameColer(this.cost_consume.model.quality);
                    this.hasCost = DataManager.getInstance().bagManager.getGoodsThingNumById(awarditem.id);
                }
                var num = DataManager.getInstance().activitySmeltManager.smeltNums[smelt_awd_Key];
                if (!num) {
                    this.lastNum.text = '挑战剩余名额：4';
                    this.btn_go.visible = true;
                    this.cost_consume.visible = true;
                }
                else {
                    if (num > 5) {
                        this.lastNum.text = '挑战剩余名额：0';
                        if (this.hasCost > 0) {
                            this.btn_go.visible = true;
                            this.cost_consume.visible = true;
                        } else {
                            this.btn_go.visible = false;
                            this.cost_consume.visible = false;
                        }
                    }
                    else {
                        this.lastNum.text = '挑战剩余名额：' + Math.max(0, 4 - num);
                        this.btn_go.visible = true;
                        this.cost_consume.visible = true;
                    }
                }

                var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.data.model.otherDuihuan);
                if (awards) {
                    this.consume.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(awards[0].type, awards[0].id, awards[0].num));
                }
            }
        }
    }
    public onTouchButton(): void {
        if (this.hasCost == 0) {
            GameCommon.getInstance().addAlert('兑换道具不足！');
            return;
        }
        let msg: Message = new Message(MESSAGE_ID.ACT_RONGLIAN_DUIHUAN);
        msg.setShort(this.m_id);
        msg.setByte(this.m_tp);
        GameCommon.getInstance().sendMsgToServer(msg);
    }
}