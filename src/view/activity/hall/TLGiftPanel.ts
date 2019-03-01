class TLGiftPanel extends BaseWindowPanel {
    private img_bannel: eui.Image;
    private label_tab: eui.Label;
    private awardLayer: eui.Group;
    private label_endTime: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TLGiftPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TLGIFT_TO_OBTAIN_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(true);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TLGIFT_TO_OBTAIN_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(false);
    }
    public examineCD(open: boolean) {
        if (open) {
            Tool.addTimer(this.onCountDown, this, 1000);
        } else {
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
    }
    public onCountDown() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TLGIFT);
        // if (time > 0) {
        // } else {
        //     time = 0;
        //     this.examineCD(false);
        // }
        // this.onShowCD(time);
    }
    public onShowCD(time: number) {
        this.label_endTime.text = "活动结束剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }
    protected onRefresh(): void {
        var data = DataManager.getInstance().tLGiftManager;
        this.label_tab.text = TLGiftDefine.title[data.type];
        this.img_bannel.source = "tLGift_banner" + data.type + "_jpg";
        this.awardLayer.removeChildren();
        var item: TLGiftItem;
        // for (var i: number = 0; i < data.objectives.length; i++) {
        //     item = new TLGiftItem();
        //     item.onUpdate(data.objectives[i]);
        //     this.awardLayer.addChild(item);
        // }
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.HALLACTIVITY, "Gift"));
    }
}
class TLGiftItem extends eui.Component {
    private awardLayer: eui.Group;
    private btn_receive: eui.Button;
    private label_progress: eui.Label;
    private model;
    public constructor() {
        super();
        // this.skinName = skins.SevDayObjectiveItemSkin;
        this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnReceive, this);
        this.width = 590;
    }
    public onUpdate(model): void {
        this.model = model;
        this.awardLayer.removeChildren();
        var award: AwardItem;
        var goods: GoodsInstance;
        for (var i: number = 0; i < model.reward.length; i++) {
            award = model.reward[i];
            var goods = new GoodsInstance();
            goods.scaleX = goods.scaleY = 0.8;
            goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
            this.awardLayer.addChild(goods);
        }
        var data = DataManager.getInstance().tLGiftManager;
        this.btn_receive.skinName = skins.Common_ButtonSkin;
        if (data.record[model.key]) {//已领取
            this.btn_receive.label = "已领取";
            GameCommon.getInstance().onButtonEnable(this.btn_receive, false);
        } else {
            if (data.value >= model.mubiao) {
                this.btn_receive.label = "领取";
                GameCommon.getInstance().onButtonEnable(this.btn_receive, true);
            } else {
                this.btn_receive.skinName = skins.Common_ButtonSkin;
                this.btn_receive.label = "前往";
                GameCommon.getInstance().onButtonEnable(this.btn_receive, true);
                // if (this._data.goType == 0) {
                //     this.btn_receive.visible = false;
                // }
            }
        }

        this.label_progress.text = TLGiftDefine.system[model.type] + "达到" + model.mubiao + "阶(" + data.value + "/" + model.mubiao + ")";
    }
    private onTouchBtnReceive(e: egret.TouchEvent) {
        var btn: eui.Button = e.target;
        if (btn.label == "前往") {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.model.goType);
        } else if (btn.label == "领取") {
            var message = new Message(MESSAGE_ID.TLGIFT_TO_OBTAIN_MESSAGE);
            message.setByte(this.model.key);
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }
}