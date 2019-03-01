class WanbaVIPGiftPanel extends BaseWindowPanel {

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    private isButtonDisplay: boolean = false;
    private vipLevel: number;
    private awardList: eui.List;
    private super_awd_grp: eui.Group;
    private scroll: eui.Scroller;
    private wanbaParam: WanbaVIPGiftParam;
    private vipLv: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.WanbaVIPGiftSkin;
    }
    protected onInit(): void {
        // this.awardList.itemRenderer = WanbaVIPGiftItem;
        // this.awardList.itemRendererSkinName = skins.WanbaVIPGiftItemSkin;
        // this.awardList.useVirtualLayout = true;
        // this.scroll.viewport = this.awardList;
        this.wanbaParam = new WanbaVIPGiftParam();
        this.vipLevel = 0;
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onHide, this);
        super.onRegist();

    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onHide, this);
        delete this.rewardArr;
        super.onRemove();
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }
    protected onRefresh(): void {
        this.getVipInfo();
        // this.onUpData();
        // this.awardList.dataProvider = new eui.ArrayCollection(this.models);
    }
    private getVipInfo() {
        if (SDKManager.loginInfo.channel != EChannel.CHANNEL_WANBA)
            return;
        var url = SDKWanBa.getInstance().getVipInfo();
        HttpUtil.sendGetRequest(url, this.updateVipInfo, this);
    }

    private updateVipInfo(event: egret.Event) {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(JSON.parse(request.response).ret);
        if (result) {
            egret.log(result);
            this.isButtonDisplay = !result.isGetGift;
            DataManager.getInstance().playerManager.player.wanbaVip = this.isButtonDisplay;
            this.vipLevel = result.level;
            if (this.vipLevel >= 6 && !this.isButtonDisplay) {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.WANBAVIP_MAX))
            }
            this.vipLv.text = 'LV' + result.level;
            this.onUpData();
        }
    }
    public showTips(gift): void {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("WanbaGiftPanel", gift)
        );
    }
    private onUpData(): void {
        this.rewardArr = this.models;
        this.onClearDepotList();
        for (var i: number = 0; i < this.rewardArr.length; i++) {
            var goodsItem: WanbaVIPGiftItem = new WanbaVIPGiftItem();
            goodsItem.getAwardBtn.name = this.rewardArr[i].cfg.id;
            goodsItem.onUpdate(this.rewardArr[i].cfg, this.vipLevel, this.isButtonDisplay, this.rewardArr[i].idx);
            goodsItem.getAwardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendVipGetAward, this);
            goodsItem.y = (goodsItem.height + 15) * i;
            this.awardList.addChild(goodsItem);

        }
    }
    private onClearDepotList(): void {
        if (this.awardList.numChildren > 0) {
            for (var i: number = this.awardList.numChildren - 1; i >= 0; i--) {
                var depotitem: WanbaVIPGiftItem = this.awardList.getChildAt(i) as WanbaVIPGiftItem;
                if (depotitem) {
                    depotitem.getAwardBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendVipGetAward, this);
                    this.awardList.removeChild(depotitem);
                }
            }
        }
    }
    private sendVipGetAward(event: egret.Event): void {
        var index: number = parseInt(event.currentTarget.name);
        // if(this.vipLevel>=index)
        // {
        var url = SDKWanBa.getInstance().sendVipGetAward(index);
        HttpUtil.sendGetRequest(
            url, this.sendAwardCallback, this);
        // }
    }
    private sendAwardCallback(event: egret.Event) {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(JSON.parse(request.response).ret);
        if (result) {
            if (result.ret > 0) {
                this.isButtonDisplay = false;
            }
            this.onRefresh();
        }
    }
    private rewardArr: Array<WanbaVIPGiftParam>
    private get models(): WanbaVIPGiftParam[] {
        var models: Modelbox[];
        models = JsonModelManager.instance.getModelbox();
        this.rewardArr = new Array<WanbaVIPGiftParam>();
        var i: number = 0;
        for (let k in models) {
            if (Number(k) >= 1007 && Number(k) < 1013) {
                i = i + 1;
                if (this.vipLevel == i || this.vipLevel + 1 == i) {
                    var param: WanbaVIPGiftParam = new WanbaVIPGiftParam();
                    param.cfg = models[k];
                    param.idx = i;
                    this.rewardArr.push(param);
                }
            }
        }
        return this.rewardArr;
    }

}
class WanbaVIPGiftItem extends BaseComp {
    private award_grp: eui.Group;
    private descName: eui.Label;
    public getAwardBtn: eui.Button;
    private _vipLevel: number;
    private _idx: number;
    private boxCfg: Modelbox;
    private isButtonDisplay: boolean;

    constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.WanbaVIPGiftItemSkin;
    }
    protected onInit(): void {
        if (this.boxCfg) {
            this.onUpdate(this.boxCfg, this._vipLevel, this.isButtonDisplay, this._idx);
        }
    }
    public onUpdate(awardCfg: Modelbox, vipLevel: number, isButtonDisplay: boolean, idx: number): void {
        this._vipLevel = vipLevel;
        this.boxCfg = awardCfg;
        this._idx = idx;
        this.isButtonDisplay = isButtonDisplay;
        if (!this.isLoaded) return;
        this.getAwardBtn.visible = false;
        this.descName.text = awardCfg.name;
        if (idx == vipLevel) {
            this.getAwardBtn.visible = true;
            if (isButtonDisplay) {
                this.getAwardBtn.enabled = true;
                this.getAwardBtn.label = '领取';

            }
            else {
                this.getAwardBtn.enabled = false;
                this.getAwardBtn.label = '已领取';
            }

        }
        else {
            this.descName.text = '下一级可领取';
        }
        this.award_grp.removeChildren();
        var rewards: AwardItem[] = awardCfg.rewards;

        for (var i: number = 0; i < rewards.length; i++) {
            var goodsItem: GoodsInstance = new GoodsInstance();
            var awardItem: AwardItem = rewards[i];
            goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
            this.award_grp.addChild(goodsItem);
        }
    }
    private onTouch(): void {
        if (this._vipLevel >= this._idx) {
            var url = SDKWanBa.getInstance().sendVipGetAward(this.boxCfg.id);
            HttpUtil.sendGetRequest(
                url, function (event: egret.Event) {
                    var request = <egret.HttpRequest>event.currentTarget;
                    var result = JSON.parse(JSON.parse(request.response).ret);
                    if (result) {
                        if (this.boxCfg.id == result.boxid) {
                            this.getAwardBtn.visible = false;
                        }
                    }
                }, this);
        }
    }
}
class WanbaVIPGiftParam {
    public cfg: Modelbox;
    public idx: number;
    public constructor() {
    }
}