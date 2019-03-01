/**
 * 
 * 商店界面
 * @author	lzn	
 * 
 * 
 */
class PvPShopPanel extends BaseWindowPanel {
    private goodsLayer: eui.Group;
    //商城类型按钮
    private _currType: number;
    private scroll: eui.Scroller;
    private money: CurrencyBar;
    private gold: CurrencyBar;
    private timedate: number;
    private itemdata: shopdate[];
    private timer: egret.Timer;
    private timelab: eui.Label;
    private yuanbaoimg: eui.Image;
    private holdmoney: eui.Group
    private note: eui.Image;
    private textGrp: eui.Group;
    private goto: eui.Label;
    private timeh: number;
    private timem: number;
    private times: number;
    private btnGroup;
    private index: number = 0;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner) {
        super(owner);
    }

    private shopTps: number[] = [SHOP_TYPE.RONGYU, SHOP_TYPE.ARENA, SHOP_TYPE.SHENGWANG];
    protected onSkinName(): void {
        this.skinName = skins.PvpShopSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle('商店');
        let button: eui.Button = new eui.Button();
        button.skinName = skins.ScrollerTabBtnSkin;
        for (var i = 0; i < 3; i++) {
            var btn: eui.RadioButton;
            btn = new BaseTabButton('', ShopDefine.SHOP_NAMEs[this.shopTps[i]]);
            if (i == 0) {
                btn.selected = true;
            }
            btn.width = 103;
            btn.name = i + '';
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
            this.btnGroup.addChild(btn);
        }
        this.currType = this.shopTps[0];
        this.onRefresh();
    }
    private onEventBtn(event: egret.TouchEvent) {
        let idx = parseInt(event.target.name);
        this.currType = this.shopTps[idx];
        this.index = idx;
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.currType = this.shopTps[this.index];
        this.invalidateState();
    }
    //销毁
    public onDestory(): void {
        this.goodsLayer.removeChildren();
    }
    public set currType(param) {
        this._currType = param;
        this.scroll.stopAnimation();
        // this.img_payIcon.source = this._currType.img_payIcon;
        this.onUpdateCurrency();
        if (this._currType != SHOP_TYPE.TURNPLATE) {
            this.onRequsetDiscount();
        } else {
            var message = new Message(MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }
    //请求折扣信息
    private _initDiscount: boolean;
    private onRequsetDiscount(): void {
        if (!this._initDiscount) {
            this._initDiscount = true;
            var message = new Message(MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            this.showGoods();
        }
    }
    private showGoods() {
        var item: ShopItem;
        var len: number = 0;
        this.goodsLayer.removeChildren();
        var data: Modelshop[] = DataManager.getInstance().shopManager.getGoodsByTye(this._currType);//拿数据
        if (!data) return;

        var pvpCfg: ModelPVPLV = DataManager.getInstance().pvpManager.getModelCurr();
        var items: ShopItem[] = [];
        len = data.length;
        for (var i = 0; i < len; i++) {
            item = new ShopItem();
            item.cfgId = data[i].id;
            item.data = data[i];
            if (DataManager.getInstance().shopManager.restrictionBuy[data[i].id] && DataManager.getInstance().shopManager.restrictionBuy[data[i].id] >= data[i].xiangoucishu) {
                item.itemStgate = 1;
            }
            else {
                if (data[i].pvpLevel <= pvpCfg.lv) {
                    item.itemStgate = 3;
                }
                else {
                    item.itemStgate = 2;
                }
            }
            item.img_payIcon.source = ShopPanel.getPayIcon(this._currType);//this._currType.img_payIcon;
            items.push(item);
        }
        items.sort(function (arg1: any, arg2: any) {
            if (arg2.itemStgate == arg1.itemStgate) {

                return arg1.cfgId - arg2.cfgId;
            }
            return arg2.itemStgate - arg1.itemStgate;
        });
        for (let k in items) {
            if (items[k]) {
                this.goodsLayer.addChild(items[k]);
            }
        }
        this.scroll.viewport.scrollV = 0;
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE.toString(), this.updateInfo, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE.toString(), this.updategoods, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE.toString(), this.upbuy, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE.toString(), this.showGoods, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SHOP_BUYGOODS, this.onItemBack, this);
    }

    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE.toString(), this.updateInfo, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE.toString(), this.updategoods, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE.toString(), this.upbuy, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE.toString(), this.showGoods, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SHOP_BUYGOODS, this.onItemBack, this);
        if (this.timer) {
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            this.timer = null;
        }
        this.onDestory();
        this._initDiscount = false;
    }
    private updateInfo(e) {
        var param = parseInt(e);
        if (param == 0) {//失败
            GameCommon.getInstance().addAlert("购买失败");
        } else {//成功
            var message = new Message(MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);
            GameCommon.getInstance().addAlert("购买成功");
            // this.showGoods();
        }
    }
    /**长度
第几个商品
剩余可购买数量
 */
    // private upbuy(ms: GameMessageEvent) {
    //     //购买返回
    //     var date: Message = ms.message;
    //     var len: Number = date.getByte();
    //     for (var j = 0; j < len; j++) {
    //         var num: number = date.getByte();
    //         this.itemdata[num].buyNum = date.getInt();
    //     }
    //     this.shenmishopdate();
    // }
    private updategoods(gameMsg: GameMessageEvent) {
        var e: Message = gameMsg.message;
        this.timedate = e.getInt();//int	距离下次刷新剩余多少秒
        var len: number = e.getByte();//byte	长度
        this.itemdata = [];
        for (var i = 0; i < len; i++) {
            var _date: shopdate = new shopdate();
            _date.type = e.getByte();//byte	物品类型
            _date.id = e.getShort();//short	物品ID
            _date.quality = e.getByte();//byte	品质
            _date.num = e.getInt();//int	物品数量
            _date.buyNum = e.getInt();//int	剩余可购买数量
            _date._discount = e.getByte();//byte	折扣
            _date._$type = e.getByte();//byte	价格类型
            _date._$mach = e.getInt();//int	价格数量
            this.itemdata.push(_date);
        }
        this.timeh = Math.floor(this.timedate / 3600);
        this.timem = Math.floor((this.timedate - this.timeh * 3600) / 60);
        this.times = this.timedate - this.timeh * 3600 - this.timem * 60;
        if (this.timeh < 10) {
            if (this.times < 10) {
                this.timelab.text = "距离下次刷新\r0" + this.timeh + ":" + this.timem + ":0" + this.times;
            } else {
                this.timelab.text = "距离下次刷新\r0" + this.timeh + ":" + this.timem + ":" + this.times;
            }
        } else {
            if (this.times < 10) {
                this.timelab.text = "距离下次刷新\r" + this.timeh + ":" + this.timem + ":0" + this.times;
            } else {
                this.timelab.text = "距离下次刷新\r" + this.timeh + ":" + this.timem + ":" + this.times;
            }
        }
        if (!this.timer) {
            this.timer = new egret.Timer(1000);
        }

        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer.start();
        // this.shenmishopdate();
    }
    private timerFunc() {
        this.timeh = Math.floor(this.timedate / 3600);
        this.timem = Math.floor((this.timedate - this.timeh * 3600) / 60);
        this.times = this.timedate - this.timeh * 3600 - this.timem * 60;
        if (this.timeh < 10) {
            if (this.times < 10) {
                this.timelab.text = "距离下次刷新\r0" + this.timeh + ":" + this.timem + ":0" + this.times;
            } else {
                this.timelab.text = "距离下次刷新\r0" + this.timeh + ":" + this.timem + ":" + this.times;
            }
        } else {
            if (this.times < 10) {
                this.timelab.text = "距离下次刷新\r" + this.timeh + ":" + this.timem + ":0" + this.times;
            } else {
                this.timelab.text = "距离下次刷新\r" + this.timeh + ":" + this.timem + ":" + this.times;
            }
        }
        this.timedate--;
    }
    private timerComFunc() {
        this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer = null;
    }
    // private shenmishopdate() {
    //     var item: ShopItem;
    //     var len: number = 0;
    //     this.goodsLayer.removeChildren();
    //     var data: shopdate[] = this.itemdata;
    //     if (!data) return;
    //     len = this.itemdata.length;
    //     for (var i = 0; i < len; i++) {
    //         item = new ShopItem();
    //         item.shenmmidata = data[i];
    //         item.onindex(i);

    //         if (data[i]._$type == SHOP_TYPE.TURNPLATE) {
    //             item.img_payIcon.source = ShopPanel.getPayIcon(this._currType);
    //         } else {
    //             item.img_payIcon.source = "yuanbao_png";
    //         }
    //         this.goodsLayer.addChild(item);
    //     }
    //     this.scroll.viewport.scrollV = 0;
    // }
    private onUpdateCurrency() {
        // this.label_money.text = ShopType.getCurrency(GOODS_TYPE.SHOJIFEN) + "";
        if (this._currType == SHOP_TYPE.RONGYU) {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.RONGYU, 0, -1));
            // } else if () {
            //     this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.ARENA, 0, -1));
        } else if (this._currType == SHOP_TYPE.ARENA) {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.RONGYU, 0, -1));
            // } else if () {
            //     this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.ARENA, 0, -1));
        } else if (this._currType == SHOP_TYPE.JIFEN) {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.SHOJIFEN, 0, -1));
        } else if (this._currType == SHOP_TYPE.SHENGWANG) {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.SHENGWANG, 0, -1));
        } else {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.GOLD, 0, -1));
        }

        this.gold.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.DIAMOND, 0, -1));
    }
    private onItemBack(e: egret.Event) {
        var data: Modelshop = e.data;
        if (this._currType == SHOP_TYPE.TURNPLATE) {
            var ownCurrency: number = ShopPanel.getCurrency(this._currType);
        } else {
            var ownCurrency: number = ShopPanel.getCurrency(this._currType);
        }

        // var pricestr=data.price;
        var pricearr = GameCommon.getInstance().onParseAwardItemstr(data.price);
        if (ownCurrency < pricearr[0].num) {
            GameCommon.getInstance().addAlert("货币不足，无法购买");
            return;
        }
        var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
        message.setByte(data.shopType);
        message.setInt(data.id);
        message.setInt(1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}