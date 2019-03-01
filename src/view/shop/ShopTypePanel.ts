/**
 * 
 * 商店界面
 * @author	lzn	
 * 
 * 
 */
class ShopTypePanel extends BaseTabView {
    private goodsLayer: eui.Group;
    //商城类型按钮
    // private btnGroup: eui.Group;
    // private img_payIcon: eui.Image;
    // private get_yuanbao_txt: eui.Label;
    // private label_money: eui.Label;
    private updateBtn: eui.Button;
    private onebuyBtn: eui.Button;
    // private shopTypes: ShopType[];
    // private _currType: ShopType;
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
    private yuanbaoNum:eui.Label;
    // public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ShopPanelSkin;
    }
    protected onInit(): void {
        // this.updateBtn.label = `刷新${Constant.get(Constant.SHOP_PLAYER_REFRESH)}  `;
        this.yuanbaoNum.text =  '刷新'+Constant.get(Constant.SHOP_PLAYER_REFRESH);
        super.onInit();
        this.onRefresh();
        this.currType = (this.owner as ShopPanel).currentShopType();
    }
    protected onRefresh(): void {
        // for (var i = 0; i < this.shopTypes.length; i++) {
        //     var item: ShopType = this.shopTypes[i];
        //     item.x = 5 + i * 110;
        //     item.y = 15;
        //     item.btn.selected = false;
        //     this.btnGroup.addChild(item);
        // }
        this.yuanbaoimg.touchEnabled = false;
        var type = (this.owner as ShopPanel).currentShopType();
        this.currType = type;

        // if (!this._currType) {
        //     this.currType = this.shopTypes[0];
        //     this.shopTypes[0].btn.selected = true;
        // } else {
        //     this.currType = this._currType;
        //     this._currType.btn.selected = true;
        // }
        this.invalidateState();
    }
    //传入商城类型打开商城界面
    // public onShowWithParam(param): void {
    //     if (this.isShow)
    //         this.onDestory();
    //     this._currType = null;
    //     var types: number[] = param.types;
    //     var defaultType: number = param.type;
    //     this.shopTypes = [];
    //     for (var i = 0; i < types.length; i++) {
    //         var item: ShopType = new ShopType();
    //         item.type = types[i];
    //         this.shopTypes[i] = item;
    //         if (defaultType == item.type) {
    //             this._currType = item;
    //         }
    //     }
    //     super.onShowWithParam(param);
    // }
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
            // message.setByte(data.shopType);
            // message.setInt(data.id);
            // message.setInt(1);
            GameCommon.getInstance().sendMsgToServer(message);
        }

        //文字提示
        // if (this._currType == SHOP_TYPE.DAOJU) {
        //     this.holdmoney.y = 40;
        // } else {
        //     this.holdmoney.y = 75;
        // }

        if (this._currType == SHOP_TYPE.JIFEN || this._currType == SHOP_TYPE.RONGYU || this._currType == SHOP_TYPE.ARENA) {
            this.note.source = "shop_text_" + this._currType + "_png";
            if (this._currType == SHOP_TYPE.JIFEN) {
                if (this.goto.parent) {
                    this.goto.parent.removeChild(this.goto);
                }
            } else {
                if (!this.goto.parent) {
                    this.textGrp.addChild(this.goto);
                }
                this.goto.visible = true;
                this.goto.textColor = 0x00ff00;
                GameCommon.getInstance().addUnderlineStr(this.goto, "前往");
                if (this.goto.hasEventListener) {
                    this.goto.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoHandler, this);
                }
                this.goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoHandler, this);
            }
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
        len = data.length;
        for (var i = 0; i < len; i++) {
            item = new ShopItem();
            item.data = data[i];
            if (this._currType == SHOP_TYPE.JIFEN) {
                item.currentState = "jifen";
            }

            item.img_payIcon.source = ShopPanel.getPayIcon(this._currType);//this._currType.img_payIcon;
            this.goodsLayer.addChild(item);
        }
        this.scroll.viewport.scrollV = 0;
    }
    protected onRegist(): void {
        super.onRegist();
        this.updateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.update, this);
        this.onebuyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbuyfunc, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE.toString(), this.updateInfo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE.toString(), this.updategoods, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE.toString(), this.upbuy, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE.toString(), this.showGoods, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SHOP_BUYGOODS, this.onItemBack, this);
    }

    protected onRemove(): void {
        super.onRemove();
        // for (var i = 0; i < this.shopTypes.length; i++) {
        //     //移除监听
        //     this.shopTypes[i].btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
        // }
        this.updateBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.update, this);
        this.onebuyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onbuyfunc, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE.toString(), this.updateInfo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE.toString(), this.updategoods, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE.toString(), this.upbuy, this);
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
    private onbuyfunc(e: egret.TouchEvent) {
        //一键购买
        var message = new Message(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE);
        message.setByte(-1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private update(e: egret.TouchEvent) {
        var message = new Message(MESSAGE_ID.PLAYER_SHENMISHOP_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private updateInfo(e) {
        var param = parseInt(e);
        if (param == 0) {//失败
            GameCommon.getInstance().addAlert("购买失败");
        } else {//成功
            GameCommon.getInstance().addAlert("购买成功");
        }
    }
    /**长度
第几个商品
剩余可购买数量
 */
    private upbuy(ms: GameMessageEvent) {
        //购买返回
        var date: Message = ms.message;
        var len: Number = date.getByte();
        for (var j = 0; j < len; j++) {
            var num: number = date.getByte();
            this.itemdata[num].buyNum = date.getInt();
        }
        this.shenmishopdate();
    }
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
        this.shenmishopdate();
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
    private shenmishopdate() {
        var item: ShopItem;
        var len: number = 0;
        this.goodsLayer.removeChildren();
        var data: shopdate[] = this.itemdata;
        if (!data) return;
        len = this.itemdata.length;
        for (var i = 0; i < len; i++) {
            item = new ShopItem();
            item.shenmmidata = data[i];
            item.onindex(i);

            if (data[i]._$type == SHOP_TYPE.TURNPLATE) {
                item.img_payIcon.source = ShopPanel.getPayIcon(this._currType);
            } else {
                item.img_payIcon.source = "yuanbao_png";
            }
            this.goodsLayer.addChild(item);
        }
        this.scroll.viewport.scrollV = 0;
    }
    private onUpdateCurrency() {
        // this.label_money.text = ShopType.getCurrency(GOODS_TYPE.SHOJIFEN) + "";
        if (this._currType == SHOP_TYPE.RONGYU || this._currType == SHOP_TYPE.ARENA) {
            this.money.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.RONGYU, 0, -1));
            // } else if (this._currType == SHOP_TYPE.ARENA) {
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

    // private onTouchBtn(e: egret.TouchEvent) {
    //     var btn = <eui.RadioButton>e.target;
    //     var value: ShopType = btn.value;
    //     if (value.type == this._currType.type)
    //         return;
    //     //this.invalidateSkinState();想切换ui状态
    //     this.invalidateState();
    //     this.currType = value;
    // }
    protected getCurrentState(): string {
        if (this._currType == SHOP_TYPE.DAOJU) {
            return "normal";
        }
        if (this._currType == SHOP_TYPE.JIFEN || this._currType == SHOP_TYPE.RONGYU || this._currType == SHOP_TYPE.ARENA) {
            //this.img_payIcon.visible = false;
            return "integral";
        }

        if (this._currType == SHOP_TYPE.TURNPLATE) { //表示还未开始，则显示为神秘商店
            return "refresh";
        }

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

    private onGotoHandler(event: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.getGoType());
    }

    private getGoType(): number {
        if (this._currType == SHOP_TYPE.RONGYU) {
            return FUN_TYPE.FUN_LADDER;
        } else if (this._currType == SHOP_TYPE.ARENA) {
            return FUN_TYPE.FUN_ARENA;
        } else {
            return 0;
        }
    }
}

// class ShopType extends eui.Component {
//     //商城类型
//     private _type: number;
//     //按钮
//     public btn: eui.RadioButton;
//     //商城类型页签图片
//     private img: eui.Image;
//     //商城显示代币类型
//     public img_payIcon: string;
//     public defaut_Index: number = 0;
//     public constructor() {
//         super();
//         this.skinName = skins.ShopTypeSkin;
//     }
//     public get type(): number {
//         return this._type;
//     }
//     public set type(type: number) {
//         this._type = type;
//         switch (this._type) {
//             //积分
//             case 0:
//                 this.img.source = "shop_daojvshop2_png";
//                 this.img_payIcon = "mainview_gold_png";
//                 break;
//             //元宝
//             case 1:
//                 this.img.source = "shop_jifenshop2_png";
//                 this.img_payIcon = "djifen_png";//绑元mainview_goldbind_png
//                 break;
//             //荣誉
//             case 2:
//                 this.img.source = "shop_gongxun_png";
//                 this.img_payIcon = "dgongxun_png";
//                 break;
//             //竞技商城
//             case 3:
//                 this.img.source = "arena_shop_icon_png";
//                 this.img_payIcon = "djingjidian_png";
//                 break;
//             case 4:
//                 this.img.source = "shop_rongyu_png";
//                 this.img_payIcon = "drongyu_png";
//                 break;
//             case 5:
//                 this.img.source = "shop_shenmishop2_png";
//                 this.img_payIcon = "mainview_gold_png";
//                 break;
//             case 6:
//             case 7:
//                 this.img.source = "turnplate_btn_integral_png";
//                 this.img_payIcon = "turnplate_integral_icon_png";
//                 break;

//         }
//         this.btn.value = this;
//     }
//     public static getCurrency(goodsType: number, modelID: number = 0): number {
//         var _hasitemNum: number = 0;
//         switch (goodsType) {
//             case GOODS_TYPE.ITEM:
//                 var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(modelID);
//                 _hasitemNum = _itemThing ? _itemThing.num : 0;
//                 break;
//             default:
//                 _hasitemNum = DataManager.getInstance().playerManager.player.getICurrency(goodsType);
//                 break;
//         }
//         return _hasitemNum;
//     }
// }
/**int	距离下次刷新剩余多少秒
byte	长度


byte	物品类型
short	物品ID
byte	品质
int	物品数量
int	剩余可购买数量
byte	折扣
byte	价格类型
int	价格数量
*/
class shopdate {
    public type: number;
    public id: number;
    public quality: number;
    public num: number;
    public buyNum: number;
    public _discount: number;
    public _$type: number;
    public _$mach: number;
}
class ShopItem extends eui.Component {
    private goods: GoodsInstance;
    public group_price: eui.Group;
    public img_payIcon: eui.Image;
    private label_price: eui.Label;
    private group_price0: eui.Group;
    public img_payIcon0: eui.Image;
    private label_price0: eui.Label;
    private btn_buy: eui.Button;
    private _data: Modelshop;
    private _shenmidate: shopdate;
    private pingfenLab: eui.Label;
    private pingfen_grp: eui.Group;
    private index: number;
    private dazheimg: eui.Image;
    private label_rebate: eui.Label;
    private rebateLayer: eui.Group;
    public itemStgate: number;
    public cfgId: number;
    private openDesc: eui.Label;

    public constructor() {
        super();
        this.skinName = skins.ShopItemSkin;
        this.touchEnabled = false;
    }
    public set data(info: Modelshop) {
        this._data = info;
        this.dazheimg.visible = false;
        this.label_rebate.visible = false;
        this.rebateLayer.visible = false;
        this.pingfen_grp.visible = false;
        this.btn_buy.enabled = true;
        this.btn_buy.label = '购买';
        this.btn_buy.visible = true;
        this.openDesc.visible = false;
        if (info.xiangoucishu > 0) {
            if (DataManager.getInstance().shopManager.restrictionBuy[info.id] && DataManager.getInstance().shopManager.restrictionBuy[info.id] >= info.xiangoucishu) {
                this.btn_buy.enabled = false;
                this.btn_buy.label = '已购买';
            }
        }
        var pvpCfg: ModelPVPLV = DataManager.getInstance().pvpManager.getModelCurr();
        if (info.pvpLevel > pvpCfg.lv) {
            this.openDesc.visible = true;
            this.btn_buy.visible = false;
            this.openDesc.text = '战功' + info.pvpLevel + '级开启'
        }

        let itemarr: AwardItem = GameCommon.parseAwardItem(this._data.item);
        this.goods.onUpdate(itemarr.type, itemarr.id, 0, itemarr.quality, itemarr.num, itemarr.lv);
        var pricearr: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(info.price);
        /**折扣信息**/
        var saleRate: number = 100;
        if (DataManager.getInstance().shopManager.discountMap[info.shopType]) {
            saleRate = DataManager.getInstance().shopManager.discountMap[info.shopType];
        }
        this.onDiscountHandler(saleRate);
        if (pricearr[1]) {
            this.label_price.text = GameCommon.getInstance().getFormatNumberShow(Tool.toInt(pricearr[1].num * saleRate / 100));
            this.label_price0.text = GameCommon.getInstance().getFormatNumberShow(Tool.toInt(pricearr[0].num * saleRate / 100));
            this.img_payIcon0.source = "zuanshi_png";
        } else {
            this.label_price.text = GameCommon.getInstance().getFormatNumberShow(Tool.toInt(pricearr[0].num * saleRate / 100));
        }
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }
    private onTouchBtn() {//更改的地方
        var pricearr: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this._data.price);
        if (this._data.shopType == SHOP_TYPE.JIFEN) {//直接购买不弹复选框的
            if (pricearr[0].num > DataManager.getInstance().playerManager.player.getICurrency(pricearr[0].type)) {
                GameCommon.getInstance().addAlert("当前货币不足");
                return;
            }
            var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
            message.setByte(this._data.shopType);
            message.setInt(this._data.id);
            message.setInt(1);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            if (pricearr[1]) {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("ItemIntroducebar",
                        new IntroduceBarParam(INTRODUCE_TYPE.SHOP, pricearr[1].type, this._data)
                    )
                );
            } else {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("ItemIntroducebar",
                        new IntroduceBarParam(INTRODUCE_TYPE.SHOP, pricearr[0].type, this._data)
                    )
                );
            }
        }
    }
    /**设置是否有折扣**/
    private onDiscountHandler(saleRate: number): void {
        this.dazheimg.visible = saleRate < 100;
        this.label_rebate.visible = saleRate < 100;
        this.rebateLayer.visible = saleRate < 100;
        var discount_desc: string = saleRate.toString();
        var discount_chinese_desc: string = "";
        var saleBgImg: string = "";
        for (var i = 0; i < discount_desc.length; i++) {
            var char_to_num: number = parseInt(discount_desc.charAt(i));
            if (char_to_num > 0) {
                var num_to_chinese: string = GameDefine.Chinese_Number_Ary[char_to_num];
                discount_chinese_desc += num_to_chinese;
            }
            if (i == 0) {
                if (char_to_num < 3) {
                    saleBgImg = "shop_rebate_bg1_png";
                } else if (char_to_num < 6) {
                    saleBgImg = "shop_rebate_bg2_png";
                } else {
                    saleBgImg = "shop_rebate_bg3_png";
                }
            }
        }
        this.label_rebate.text = discount_chinese_desc + "折";
        this.dazheimg.source = saleBgImg;
    }

    public set shenmmidata(info: shopdate) {
        this._shenmidate = info;
        this.dazheimg.visible = true;
        this.label_rebate.visible = true;
        this.rebateLayer.visible = true;
        this.openDesc.visible = false;
        this.goods.onUpdate(this._shenmidate.type, this._shenmidate.id, 0, this._shenmidate.quality, this._shenmidate.num);
        if (this._shenmidate.buyNum == 0) {
            this.btn_buy.enabled = false;
        } else {
            this.btn_buy.enabled = true;
        }

        this.label_price.text = GameCommon.getInstance().getFormatNumberShow(this._shenmidate._$mach);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn2, this);
        this.onDiscountHandler(this._shenmidate._discount);
        if (this._shenmidate.type == GOODS_TYPE.MASTER_EQUIP) {
            var equipmodel = this.goods.model;
            equipmodel.quality = this._shenmidate.quality;
            var equipPower: number = equipmodel.pingfenValue;
            var playerdata: PlayerData = DataManager.getInstance().playerManager.player.getPlayerDataByOccp(equipmodel.occupation);
            var pingfenValue: number = 0;
            if (playerdata) {
                var slots: number[] = [];
                var equips: EquipThing[] = playerdata.getEquipByOccp(equipmodel.part);
                for (var i: number = 0; i < equips.length; i++) {
                    pingfenValue = pingfenValue == 0 ? equips[i].pingfenValue : (Math.min(pingfenValue, equips[i].pingfenValue))
                }
                pingfenValue = equipPower - pingfenValue;
            } else {
                pingfenValue = equipPower;
            }

            if (pingfenValue > 0) {
                // this.group_price.y = 10;
                this.pingfenLab.text = "" + pingfenValue;
            } else {
                this.pingfen_grp.visible = false;
                // this.group_price.y = 0;
            }
        }

    }
    private onTouchBtn2() {
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
        //     new WindowParam("ItemIntroducebar",
        //         new IntroduceBarParam(INTRODUCE_TYPE.SHENMISHOP, this._shenmidate._type, this._shenmidate,this.index)
        //     )
        // );

        var message = new Message(MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE);
        message.setByte(this.index);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    public onindex(_index: number) {
        this.index = _index;
    }
}