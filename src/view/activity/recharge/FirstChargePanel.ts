class FirstChargePanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public best_anim_grp: eui.Group;
    public best_zuoqi_item: GoodsInstance;
    public best_xuanqi_item: GoodsInstance;
    public ani: eui.Group;
    public awards: eui.Group;

    private btn_rechargeArray: Array<eui.Button> = [];
    private charge_labelArray: Array<eui.Label> = [];

    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.FirstChargePanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("首充");
        this.best_zuoqi_item.onUpdate(GOODS_TYPE.ITEM, GoodsDefine.ITEM_FIRSTPAY_FASHION);
        this.best_xuanqi_item.onUpdate(GOODS_TYPE.ITEM, GoodsDefine.ITEM_FIRSTPAY_XUANQI);

        let firstPayAry: Modelpay[] = [];
        for (var key in JsonModelManager.instance.getModelpay()) {
            var payModel: Modelpay = JsonModelManager.instance.getModelpay()[key];
            if (payModel.type == 5) {
                firstPayAry.push(payModel);
            }
        }
        firstPayAry.sort(function (a, b): number {
            return a.rmb - b.rmb;
        });
        for (let i: number = 0; i < firstPayAry.length; i++) {
            let model: Modelpay = firstPayAry[i];
            let btn_recharge: eui.Button = this['charge_btn' + i] as eui.Button;
            if (!btn_recharge) break;
            btn_recharge.label = `${model.rmb}元`;
            btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
            let lab_recharge: eui.Label = this['charge_rmb_lab' + i] as eui.Label;
            lab_recharge.text = (model.diamond + model.gold) + '';
        }

        GameCommon.getInstance().addAnimation('jian3', null, this.best_anim_grp, -1);
        this.best_anim_grp.scaleX=0.8;
        this.best_anim_grp.scaleY=0.8;
        this.onStartFloatAnim();
        var anim: Animation = new Animation("chongzhianniudonghua");
        this.ani.addChild(anim);
        this.ani.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        this.awards.removeChildren();
        for (var key in JsonModelManager.instance.getModelfirstPay()) {
            var rewards: AwardItem[];
            var firstModel: ModelfirstPay = JsonModelManager.instance.getModelfirstPay()[key];
            rewards = firstModel.rewards;
            for (var i = 0; i < rewards.length; i++) {
                if (i >= 5) break;//最多显示6个道具
                var award: AwardItem = rewards[i];
                var goodsInstace: GoodsInstance = new GoodsInstance();
                goodsInstace.scaleX = 0.8;
                goodsInstace.scaleY = 0.8;
                goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
                this.awards.addChild(goodsInstace);
            }
        }

        this.onRefresh();
    }
    private moveUp: boolean;
	private start_posY: number;
	private onStartFloatAnim(): void {
		this.moveUp = true;
		this.start_posY = this.best_anim_grp.y;
		this.best_anim_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}
	private onFrame(): void {
		if (this.moveUp) {
			this.best_anim_grp.y--;
			if (this.best_anim_grp.y < this.start_posY - 50) {
				this.moveUp = false;
			}
		} else {
			this.best_anim_grp.y++;
			if (this.best_anim_grp.y > this.start_posY) {
				this.moveUp = true;
			}
		}
	}
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onHide, this);
        super.onRegist();

    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onHide, this);
        super.onRemove();
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }
    protected onRefresh(): void {
        //首冲判定
        this.onUpdate();
    }
    private onUpdate() {
        this.onShowVIPInfo();
    }

    private onShowVIPInfo() {
    }

    private onTouchBtnRecharge(e: egret.Event): void {
        //var bt:eui.Button=e.currentTarget as eui.Button;
        var amount = parseInt(e.currentTarget.name);
        var goodsName = amount + "元超级首充";
        SDKManager.pay(
            {
                goodsName: goodsName,
                amount: amount,
                playerInfo: DataManager.getInstance().playerManager.player
            },
            new BasePayContainer(this));
    }

}