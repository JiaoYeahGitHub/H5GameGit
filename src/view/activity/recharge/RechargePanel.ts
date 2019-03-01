class RechargePanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    private itemGroup: eui.Scroller;
    private closeBtn1: eui.Button;
    private font_vip: eui.BitmapLabel;
    private xxxyuan: eui.Label;
    private xxxvip: eui.Label;
    private bar_recharge: eui.ProgressBar;

    private itemLayer: eui.Group;
    private queue: RechargeItem[];
    private vipMax: eui.Group;
    private label_rechargeAgain: eui.Label;
    private loolLabel: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.RechargePanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.queue = [];
        var data = JsonModelManager.instance.getModelpay();
        var n = 0;
        for (var key in data) {
            if (RechargeDefine.recharge_gear.indexOf(parseInt(key)) >= 0) {
                var pay = new RechargeItem(data[key], n);
                this.queue.push(pay);
                this.itemLayer.addChild(pay);
                n++;
            }
        }
        GameCommon.getInstance().addUnderlineStr(this.loolLabel);
        this.loolLabel.touchEnabled = true;
        this.loolLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onUpdate, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onUpdate, this);
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }
    protected onRefresh(): void {
        //首冲判定
        // var flag:boolean=false;
        // for(var key in JsonModelManager.instance.getModelpay()){
        //    var payModel:Modelpay= JsonModelManager.instance.getModelpay()[key];
        //    if(payModel.type==5){
        //        var count:number=DataManager.getInstance().rechargeManager.record[payModel.rmb];
        //        if(count&&count>0){
        //          flag=false;
        //          break;
        //        }
        //    }
        // }
        if (DataManager.getInstance().rechargeManager.firstCharge == 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FirstChargePanel");
            this.onHide();
        }
        this.onUpdate();
    }
    private onUpdate() {
        var playerData = this.getPlayerData();

        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].onUpdate();
        }
        this.onShowVIPInfo();
    }

    private onShowVIPInfo() {
        var playerData = this.getPlayerData();
        this.font_vip.text = playerData.viplevel.toString();
        var model: Modelvip = JsonModelManager.instance.getModelvip()[playerData.viplevel - 1];
        var modelEd: Modelvip = JsonModelManager.instance.getModelvip()[playerData.viplevel];
        if (modelEd) {
            var currMaxExp: number = 0;
            if (model) {
                currMaxExp = model.costNum;
            }
            var currExp: number = playerData.vipExp;
            var sumExp: number = modelEd.costNum;
            var remainExp: number = modelEd.costNum - playerData.vipExp;
            this.xxxyuan.text = (remainExp) + "";
            this.xxxvip.text = GameCommon.getInstance().getVipName(playerData.viplevel) + 1 + "";
            this.label_rechargeAgain.text = '';
            // this.label_rechargeAgain.textFlow = new Array<egret.ITextElement>(
            // 	{ text: `充值`, style: {} },
            // 	{ text: `${remainExp}`, style: { "textColor": 0xede122 } },
            // 	{ text: `元宝\r即可成为`, style: {} },
            // 	{ text: `VIP${playerData.viplevel + 1}`, style: { "textColor": 0xede122 } }
            // );
            this.bar_recharge.maximum = sumExp;
            this.bar_recharge.value = currExp;
        } else {
            this.bar_recharge.maximum = 0;
            this.bar_recharge.value = 0;
            this.xxxvip.text = '';
            this.vipMax.visible = false;
            this.label_rechargeAgain.textFlow = new Array<egret.ITextElement>(
                { text: `已达目前VIP最高等级`, style: {} }
            );
        }
    }

    private onTouchBtnRecharge() {
        this.onHide();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "VipPanel");
    }
}
class RechargeItem extends eui.Component {
    // private img_price: eui.Image;
    // private label_price: eui.Label;
    private firstLayer: eui.Group;
    private btn_recharge: eui.Button;
    private img_icon: eui.Image;
    // private dazheimg0: eui.Image;
    // private label_rebate0: eui.Label;
    // private shouchongLab: eui.Label;
    private power_num: eui.BitmapLabel;
    private xxyuanbao: eui.Label;
    private doubleImg: eui.Image;

    private data: Modelpay;
    private itemIndex: number;
    private isloaded: boolean;

    public constructor(data: Modelpay, itemIndex: number) {
        super();
        this.data = data;
        this.itemIndex = itemIndex;
        this.once(egret.Event.COMPLETE, this.onComplete, this);
        this.skinName = skins.RechargeItemSkin;
    }
    private onComplete(): void {
        this.isloaded = true;
        this.btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        this.onUpdate();
    }
    public onUpdate(): void {
        if (!this.isloaded) return;
        var money: number = parseInt(this.data.id);
        var diamond: number = money;
        if (SDKManager.getChannel() == EChannel.CHANNEL_EGRET) {
            //IOS微端特殊充值项
            if (SDKEgret.getInstance().isIOS22698()) {
                money = SDKEgret.getInstance().getIOS22698(money);
                if (money == 6) {
                    diamond = 6;
                }
            }
        }

        // this.img_price.source = "recharge_pay_" + model.id + "0_png";
        switch (this.itemIndex) {
            case 0:
            case 1:
            case 2:
                this.img_icon.source = "recharge_icon_0_png";
                this.img_icon.y = 14;
                break;
            case 3:
            case 4:
            case 5:
                this.img_icon.source = "recharge_icon_1_png";
                this.img_icon.y = 14;
                break;
            case 6:
            case 7:
            case 8:
                this.img_icon.source = "recharge_icon_2_png";
                this.img_icon.y = -24;
                break;

        }


        // this.label_price.text = money + "0";
        //this.giftLayer.visible = true;
        this.btn_recharge.label = "￥" + money;
        if (DataManager.getInstance().rechargeManager.checkFirstRecharge(diamond)) {
            this.firstLayer.visible = DataManager.getInstance().rechargeManager.checkVipDayRecharge(diamond);
            this.doubleImg.source = 'doubleV' + GameCommon.getInstance().getVipName(DataManager.getInstance().playerManager.player.viplevel) + '_png'
            if (this.firstLayer.visible) {
                let zuan: number = diamond * 200;
                if (zuan >= 100000)
                    this.xxyuanbao.text = (zuan / 10000) + "万钻石"
                else {
                    this.xxyuanbao.text = zuan + "钻石"
                }
                return;
            }
            let zuan: number = diamond * 100;
            if (zuan >= 100000)
                this.xxyuanbao.text = (zuan / 10000) + "万钻石"
            else {
                this.xxyuanbao.text = zuan + "钻石"
            }
        } else {
            this.firstLayer.visible = true;
            this.doubleImg.source = 'recharge_double_png'
            let zuan: number = diamond * 200;
            if (zuan >= 100000)
                this.xxyuanbao.text = (zuan / 10000) + "万钻石"
            else {
                this.xxyuanbao.text = zuan + "钻石"
            }

        }
    }
    private onTouchBtnRecharge(): void {
        var amount = this.data.id;//0.01;
        var goodsName = this.data.goodsName;
        SDKManager.pay(
            {
                goodsName: goodsName,
                amount: amount,
                playerInfo: DataManager.getInstance().playerManager.player
            },
            new BasePayContainer(this));
    }
} 