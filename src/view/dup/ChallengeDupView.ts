// TypeScript file
class ChallengeDupView extends BaseTabView {
    private btn_enter: eui.Button;
    private monster_group: eui.Group;
    private award_group: eui.Group;
    private dup_desc_lab: eui.Label;
    private strengthenMasterBtn: eui.Button;

    private challengeInfo: DupInfo;
    private zhuxianModels;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ChallengeDupViewSkin;
    }
    protected onInit(): void {
        this.dup_desc_lab.text = Language.instance.getText('tiaozhanfuben');
        this.zhuxianModels = JsonModelManager.instance.getModelzhuxiantai();
        //this.onRefresh();
    }
    protected onRefresh(): void {

    }
    //服务器返回副本信息
    private onResDupInfoMsg(): void {
        let modelzhuxian: Modelzhuxiantai;
        this.challengeInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_CHALLENGE)[0];
        let startLayerNum: number = this.challengeInfo.pass < 1 ? 1 : this.challengeInfo.pass;
        modelzhuxian = this.zhuxianModels[startLayerNum];
        (this["name_label"] as eui.BitmapLabel).text = modelzhuxian.id + "";
        this.monster_group.removeChildren();
        let monsterBody: BodyAnimation = GameCommon.getInstance().getMonsterBody(null, modelzhuxian.fightId, Direction.DOWN, "stand");
        this.monster_group.addChild(monsterBody);
        this.award_group.removeChildren();
        let _length: number = modelzhuxian.rewards.length > 2 ? 2 : modelzhuxian.rewards.length;
        for (let aIndex: number = 0; aIndex < _length; aIndex++) {
            let awarditem: AwardItem = modelzhuxian.rewards[aIndex];
            let _instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
            _instance.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
            this.award_group.addChild(_instance);
        }
        /**每三关的特殊奖励 规则就是读橙装碎片**/
        let pass_awrard_item: AwardItem;
        _length = startLayerNum;
        while (modelzhuxian) {
            modelzhuxian = this.zhuxianModels[_length];
            if (modelzhuxian) {
                for (let idx in modelzhuxian.rewards) {
                    pass_awrard_item = modelzhuxian.rewards[idx];
                    if (pass_awrard_item.id == GoodsDefine.ITEM_ID_CZSP) {
                        break;
                    }
                }
                _length++;
            } else {
                _length = -1;
                break;
            }
        }
    }
    protected onRegist(): void {
        this.btn_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterDup, this);
        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenClick, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
        (this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_CHALLENGE);
    }
    protected onRemove(): void {
        this.btn_enter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterDup, this);
        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenClick, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
    }
    //进入诛仙台副本
    private onEnterDup(): void {
        if (this.challengeInfo) {
            GameFight.getInstance().onSendEnterDupMsg(this.challengeInfo.id);
        }
    }
    private onSendTopMsg(): void {
        var msg: Message = new Message(MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE);
        msg.setByte(TopRankManager.RANK_SIMPLE_TYPE_DEKARON);
        msg.setBoolean(true);
        GameCommon.getInstance().sendMsgToServer(msg);
    }

    private strengthenClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_CHALLENGE_PASS))
    }
    //The end
}