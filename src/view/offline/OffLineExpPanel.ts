// TypeScript file
class OffLineExpPanel extends BaseWindowPanel {
    // private NormalType: number = 0;
    // private DoubleType: number = 1;

    // private attr_item0: BarText;

    private offline_time_desc: eui.Label;
    // private equip_ronglian_des: eui.Label;
    private label_r0: eui.Label;
    private label_r1: eui.Label;
    private label_r2: eui.Label;
    private yueka0: eui.Label;
    private yueka1: eui.Label;
    private yuekazz0: eui.Label;
    private yuekazz1: eui.Label;
    private chushou: eui.Label;
    // private shenqi0: eui.Label;
    // private shenqi1: eui.Label;
    private btn_buy_yueka: eui.Button;
    private btn_sure: eui.Button;
    // private img_icon0:eui.Image;
    // private img_icon1:eui.Image;
    // private img_icon2:eui.Image;
    // private hasExchangeItemNum: number = 0;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.OffLineExpPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("离线收益");

        this.btn_buy_yueka.visible = !SDKManager.isHidePay;

        this.onRefresh();
    }
    protected onRefresh(): void {

        var offlineData: OffLineExpData = DataManager.getInstance().playerManager.offlineData;
        var offlineTimeSec: number = offlineData.offTime / 1000;
        var lineoffHours: number = Math.floor(offlineTimeSec / 60 / 60);
        offlineTimeSec = offlineTimeSec - lineoffHours * 3600;
        var lineoffMin: number = Math.floor(offlineTimeSec / 60);
        this.offline_time_desc.text = lineoffHours + "小时" + lineoffMin + "分钟(最多累计24小时收益)"

        let cardYK1: Modelyueka = JsonModelManager.instance.getModelyueka()[1];
        let cardAddYue = 0.1;// 小月卡金币经验加成
        var data: cardData = DataManager.getInstance().monthCardManager.card[CARD_TYPE.MONTH];
        if (data && data.param > 0) {
            this.yueka0.text = cardYK1.name + "+" + GameCommon.getInstance().getFormatNumberShow(Math.floor(offlineData.moneynum * cardAddYue));
            this.yueka1.text = cardYK1.name + "+" + GameCommon.getInstance().getFormatNumberShow(Math.floor(offlineData.exp * cardAddYue));
            this.yueka0.textColor = this.yueka1.textColor = 0xE7CF7A;
        } else {
            this.yueka0.text = this.yueka1.text = cardYK1.name + "+" + (cardAddYue * 100) + "%";
            this.yueka0.textColor = this.yueka1.textColor = 0xCCCCCC;
        }

        let cardYK2: Modelyueka = JsonModelManager.instance.getModelyueka()[2];
        let cardAddZZ = 0.1;// 大月卡金币经验加成
        data = DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG];
        if (data && data.param > 0) {
            this.yuekazz0.text = cardYK2.name + "+" + GameCommon.getInstance().getFormatNumberShow(Math.floor(offlineData.moneynum * cardAddZZ));
            this.yuekazz1.text = cardYK2.name + "+" + GameCommon.getInstance().getFormatNumberShow(Math.floor(offlineData.exp * cardAddZZ));
            this.yuekazz0.textColor = this.yuekazz1.textColor = 0xE7CF7A;
        } else {
            this.yuekazz0.text = this.yuekazz1.text = cardYK2.name + "+" + (cardAddZZ * 100) + "%";
            this.yuekazz0.textColor = this.yuekazz1.textColor = 0xCCCCCC;
        }

        var legendAddGold: number = 0;
        if (DataManager.getInstance().playerManager.player.isLegendActive(4)) {
            legendAddGold += 0.05;
        }
        if (DataManager.getInstance().playerManager.player.isLegendActive(6)) {
            legendAddGold += 0.05;
        }
        var legendAddExp: number = 0;
        if (DataManager.getInstance().playerManager.player.isLegendActive(5)) {
            legendAddExp += 0.05;
        }
        // this.shenqi0.text = legendAddGold > 0 ? "" + Math.floor(offlineData.moneynum * legendAddGold) : "(未激活)";
        // this.shenqi1.text = legendAddExp > 0 ? "" + Math.floor(offlineData.exp * legendAddExp) : "(未激活)";

        this.label_r0.text = "" + offlineData.moneynum;
        this.label_r1.text = "" + offlineData.exp;
        this.label_r2.text = String(offlineData.equinum + offlineData.equinumdele);//lbw装备

        this.chushou.text = "自动回收:" + offlineData.equinumdele + "件，总计:" + offlineData.moneyRongLian + Language.instance.getText("currency4");

        var offAnimaStr: string = "";
        var offExpStr: string = Tool.getHtmlColorStr(offlineData.exp.toString(), "28e828");
        offExpStr = Tool.getHtmlColorStr((offlineData.exp * 2).toString(), "28e828");
        if (data && data.param > 0) {
            offAnimaStr = Tool.getHtmlColorStr((offlineData.anima * 2).toString(), "28e828");
            offAnimaStr = `,灵气${offAnimaStr}点`;
        }
        // if (offlineData.equinumdele > 0) {
        //     this.equip_ronglian_des.visible = true;
        //     var desc2_str: string = "背包已满，自动售出" + offlineData.equinumdele + "件装备";
        //     this.equip_ronglian_des.textFlow = (new egret.HtmlTextParser).parser(desc2_str);
        // } else {
        //     this.equip_ronglian_des.visible = false;
        // }
    }
    private onBuyMonthCard(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("HallWelfarePanel", 2));
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OFFLINE_EXP_REWARD.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MONTHCARD_MESSAGE.toString(), this.onRefresh, this);
        this.btn_buy_yueka.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyMonthCard, this);
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OFFLINE_EXP_REWARD.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MONTHCARD_MESSAGE.toString(), this.onRefresh, this);
        this.btn_buy_yueka.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyMonthCard, this);
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    //The end
}
class BarText extends eui.Component {
    private attr_name: eui.Label;
    private attr_value_label: eui.Label;

    public constructor() {
        super();
        this.skinName = skins.Attr_Item_Skin3;
    }
    public updateAttr(attrtype, value: number, color?: number) {
        this.attr_name.text = GameDefine.Attr_FontName[attrtype];
        this.attr_value_label.text = "+" + value;
        if (color) {
            this.attr_value_label.textColor = color;
        }
    }

    //The end
}