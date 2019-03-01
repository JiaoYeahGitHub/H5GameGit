class PersonallyBossView extends BaseTabView {
    private itemGroup: eui.List;
    private boss_scroll: eui.Scroller;
    private itemDatas: PersonallyItemData[];

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PersonallyBossViewSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupinfoMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupinfoMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE.toString(), this.onRefresh, this);
        this.itemGroup.dataProvider = null;
    }
    protected onInit(): void {
        this.boss_scroll.verticalScrollBar.autoVisibility = false;
        this.boss_scroll.verticalScrollBar.visible = false;
        this.itemGroup.itemRenderer = PersonallyBossItem;
        this.itemGroup.itemRendererSkinName = skins.PersonallyBossItemSkin;
        this.itemGroup.useVirtualLayout = true;
        this.boss_scroll.viewport = this.itemGroup;

        this.itemDatas = [];
        var gerendupDict = JsonModelManager.instance.getModelgerenboss();
        for (var gerenId in gerendupDict) {
            var itemdata: PersonallyItemData = new PersonallyItemData();
            var personallyModel: Modelgerenboss = gerendupDict[gerenId];
            itemdata.model = personallyModel;
            this.itemDatas.push(itemdata);
        }
        super.onInit();
        this.onRefresh();
    }
    private onReqDupInfoMsg(): void {
        var dupinfoReqMsg = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
        dupinfoReqMsg.setByte(DUP_TYPE.DUP_PERSONALLY);
        GameCommon.getInstance().sendMsgToServer(dupinfoReqMsg);
    }
    private onResDupinfoMsg(): void {
        for (var i: number = 0; i < this.itemDatas.length; i++) {
            var itemdata: PersonallyItemData = this.itemDatas[i];
            var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_PERSONALLY, itemdata.model.id);
            itemdata.lefttimes = dupinfo ? dupinfo.lefttimes : 0;
            itemdata.sort = itemdata.lefttimes == 0 ? itemdata.model.id + 1000 : itemdata.model.id;
            itemdata.pass = dupinfo.personDupPassRecord;
        }
        this.onupdateItemData();
    }
    public onRefresh(): void {
        this.onReqDupInfoMsg();
    }
    private onupdateItemData(): void {
        this.itemDatas.sort(function (a, b): number {
            return a.sort - b.sort;
        });
        let itemdatas: PersonallyItemData[] = [];
        let count: number = 0;
        let data: PersonallyItemData;
        do {
            data = this.itemDatas[count];
            count++;
            if (!data) {
                break;
            }
            itemdatas.push(data);
        } while (data.model.jingjie <= DataManager.getInstance().playerManager.player.coatardLv)
        this.itemGroup.dataProvider = new eui.ArrayCollection(itemdatas);
        this.boss_scroll.viewport.scrollV = 0;
    }
    //The end
}
class PersonallyBossItem extends BaseListItem {
    private monster_name_label: eui.Label;
    private lefttimes_label: eui.Label;
    private btn_challenge: eui.Button;
    private award_group: eui.Group;
    private monsterIcon_img: eui.Image;
    private unopen_des_lab: eui.Label;
    private get_label: eui.Label;
    private unopen_des_grp: eui.Group;
    private points: redPoint[] = RedPointManager.createPoint(1);

    constructor() {
        super();
        this.width = 590;
        this.height = 147;
    }
    protected onInit(): void {
        GameCommon.getInstance().addUnderlineGet(this.get_label);
        this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
        this.get_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetZhuansheng, this);
        this.points[0].register(this.btn_challenge, GameDefine.RED_BTN_POS_YELLOW_LITTLE, FunDefine, "getPersonallyBossHasTimes");
    }
    protected onUpdate(): void {
        var itemdata: PersonallyItemData = this.data as PersonallyItemData;
        var monsterFigtter: Modelfighter = ModelManager.getInstance().getModelFigher(itemdata.model.bossId);
        if (monsterFigtter) {
            this.monster_name_label.text = monsterFigtter.name;
            this.monsterIcon_img.source = GameCommon.getInstance().getHeadIconByModelid(itemdata.model.bossId);
        }
        this.lefttimes_label.text = Language.instance.getText('shengyucishu', '：', itemdata.lefttimes, 'times');
        if (itemdata.model.jingjie > DataManager.getInstance().playerManager.player.coatardLv) {
            this.unopen_des_lab.text = Language.instance.getText(`coatard_level${itemdata.model.jingjie}`, 'open');
            this.btn_challenge.visible = false;
            this.unopen_des_grp.visible = true;
        } else {
            this.btn_challenge.visible = true;
            this.btn_challenge.enabled = itemdata.lefttimes > 0;
            if (this.btn_challenge.enabled) {
                this.btn_challenge.label = "挑 战";
            } else {
                this.btn_challenge.label = "已挑战";
            }
            var base: cardData = DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG];
            if (base && base.param > 0 || DataManager.getInstance().playerManager.player.level >= 200) {
                if (itemdata.pass == 1)
                    this.btn_challenge.label = "扫 荡";
            }
            this.unopen_des_grp.visible = false;
        }
        this.award_group.removeChildren();
        var rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(itemdata.model.show);
        for (var i: number = 0; i < rewards.length; i++) {
            var waveAward: AwardItem = rewards[i];
            var goodsInstace: GoodsInstance = new GoodsInstance();
            goodsInstace.scaleX = 0.8;
            goodsInstace.scaleY = 0.8;
            goodsInstace.onUpdate(waveAward.type, waveAward.id, 0, waveAward.quality, waveAward.num);
            this.award_group.addChild(goodsInstace);
        }
        this.points[0].checkPoint(true, itemdata.model.id);
    }
    private onChallenge(event: egret.Event): void {
        var itemdata: PersonallyItemData = this.data as PersonallyItemData;
        if (this.btn_challenge.label == "扫 荡") {
            GameFight.getInstance().onSendSaoDangPersonallyBossMsg(itemdata.model.id);
        } else {
            GameFight.getInstance().onSendEnterPersonallyBossMsg(itemdata.model.id);
        }
    }
    private onGetZhuansheng(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_JINGJIE);
    }
    //The end
}
class PersonallyItemData {
    public sort: number;
    public model: Modelgerenboss;
    public lefttimes: number;
    public pass: number;
}