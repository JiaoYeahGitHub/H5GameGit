class WXShareLevelAwardPanel extends BaseWindowPanel implements ISDKShareContainer {
    private special_des_lab: eui.Label;
    private btn_share: eui.Button;
    private award_grp: eui.Group;
    private scroller: eui.Scroller;
    private itemlist_grp: eui.Group;

    private curYaoqingIdx: number;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner: ModuleLayer) {
        super(owner);
    }

    protected onInit(): void {
        this.setTitle("等级邀请");
        let models = JsonModelManager.instance.getModellvyaoqing();
        let index: number = 0;
        for (let lv in models) {
            let model: Modellvyaoqing = models[lv];
            let radioBtn: eui.RadioButton = new eui.RadioButton();
            radioBtn.skinName = skins.WXShareLevelAwardItem;
            radioBtn.label = `${model.lv}级礼包`;
            radioBtn.groupName = 'wxsharelvTabGrp';
            radioBtn.value = index;
            radioBtn.name = `sharelv_icon${index}`;
            this.itemlist_grp.addChild(radioBtn);
            index++;
        }

        super.onInit();
        this.onRefresh();
    }

    protected onSkinName(): void {
        this.skinName = skins.WXShareLevelAwdSkin;
    }

    private get manager(): WXGameManager {
        return DataManager.getInstance().wxgameManager;
    }

    private get player(): Player {
        return DataManager.getInstance().playerManager.player;
    }

    protected onRefresh(): void {
        let models = JsonModelManager.instance.getModellvyaoqing();
        this.curYaoqingIdx = -1;
        for (let lv in models) {
            let model: Modellvyaoqing = models[lv];
            if (this.manager.shareAwdLv >= model.lv) {
                this.curYaoqingIdx++;
            } else {
                this.curYaoqingIdx++;
                break;
            }
        }
        this.scroller.viewport.scrollH = this.curYaoqingIdx > 3 ? this.curYaoqingIdx * 130 - 3 * 130 : 0;
        let radioBtn: eui.RadioButton = this.itemlist_grp.getChildByName(`sharelv_icon${this.curYaoqingIdx}`) as eui.RadioButton;
        radioBtn.selected = true;
        this.onChangeTabHandle();
    }
    //点击分页按钮
    private onTouchTabBtn(event: egret.TouchEvent): void {
        let targetBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
        if (this.curYaoqingIdx != targetBtn.value) {
            this.curYaoqingIdx = targetBtn.value;
            this.onChangeTabHandle();
        }
    }
    //切换页签处理
    private onChangeTabHandle(): void {
        let model: Modellvyaoqing = JsonModelManager.instance.getModellvyaoqing()[this.curYaoqingIdx];
        if (!model) return;
        if (this.manager.shareAwdLv >= model.lv) {
            this.special_des_lab.text = `奖励已通过邮件下发，请注意查收！`;
            this.btn_share.label = '已领取';
            this.btn_share.enabled = false;
        } else if (model.lv > this.player.level) {
            this.special_des_lab.text = `达到${model.lv}级后展示游戏，可领取丰厚奖励！`;
            this.btn_share.label = '等级不足';
            this.btn_share.enabled = false;
        } else {
            this.special_des_lab.text = `恭喜您达到了${model.lv}级，展示游戏后可领取丰厚奖励！`;
            this.btn_share.label = '展示并领取';
            this.btn_share.enabled = true;
        }
        this.award_grp.removeChildren();
        for (let i: number = 0; i < model.rewards.length; i++) {
            let g_instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(model.rewards[i]);
            this.award_grp.addChild(g_instance);
        }
    }

    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE.toString(), this.onRefresh, this);
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showShareInfo, this);
        for (let i: number = 0; i < this.itemlist_grp.numChildren; i++) {
            let radioBtn: eui.RadioButton = this.itemlist_grp.getChildAt(i) as eui.RadioButton;
            radioBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
        }
    }

    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE.toString(), this.onRefresh, this);
        this.btn_share.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showShareInfo, this);
        for (let i: number = 0; i < this.itemlist_grp.numChildren; i++) {
            let radioBtn: eui.RadioButton = this.itemlist_grp.getChildAt(i) as eui.RadioButton;
            radioBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
        }
    }
	/**
     * 分享信息提示
     */
    public showShareInfo(info: ISDKShareInfo): void {
        SDKManager.share(this, WX_SHARE_TYPE.LEVEL_SHARE);
    }
    /**
     * 分享信息更新
     */
    updateShareInfo: (info: ISDKShareInfo) => void;

    public shareComplete(): void {
        let model: Modellvyaoqing = JsonModelManager.instance.getModellvyaoqing()[this.curYaoqingIdx];
        if (!model) return;
        if (DataManager.getInstance().playerManager.player.level >= model.lv) {
            var message: Message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
            message.setBoolean(true);
            message.setShort(model.lv);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            GameCommon.getInstance().addAlert(`等级达到${model.lv}级展示后可获得奖励哦！`);
        }
    }
    //The end
}