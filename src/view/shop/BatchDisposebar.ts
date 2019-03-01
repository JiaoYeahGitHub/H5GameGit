/**
 * 
 * 批量处理工具
 * @author  lzn 
 * 
 * 
 */
class BatchDisposebar extends eui.Component {
    private label_num: eui.TextInput;
    private btnAdd: eui.Button;
    private btnReduce: eui.Button;
    private btn_min: eui.Button;
    private btn_max: eui.Button;
    private img_payIcon: eui.Image;
    private img_payIcon0: eui.Image;
    private _model;
    private label_money: eui.Label;
    public label_money_owner: eui.Label;
    private label_min: eui.Label;
    private label_max: eui.Label;
    private _owner;
    public btn_buy: eui.Button;
    public btn_group:eui.Group;
    public btn_vip_open: eui.Button;
    public btn_real_buy: eui.Button;
    public label_dsc:eui.Label;
    public num: number;
    public sum: number;
    public radio_type: number = -1;
    public radio0: eui.RadioButton;
    public radio1: eui.RadioButton;
    public radio2: eui.RadioButton;
    public radio3: eui.RadioButton;
    public radio4: eui.RadioButton;
    public static BATCH_TYPE_USE: string = "use";
    public static BATCH_TYPE_BUY: string = "buy";
    public static BATCH_TYPE_CONNT: string = "count";
    public static BATCH_TYPE_USE2: string = "use2";
    public static BATCH_TYPE_VIP: string = "vip";
    public static BATH_TYPE_RNUES:string = 'rnues';
    public static BATH_TYPE_ZHANWEN:string = 'zhanwen';

    private modelprice: AwardItem[];

    public constructor() {
        super();
        this.skinName = skins.BatchDisposebarSkin;
    }
    public set owner(param) {
        this._owner = param;
    }
    public get owner() {
        return this._owner;
    }
    public get model() {
        return this._model;
    }
    private onTouchAdd() {
        this.num += 1;
        if (this.num > this.max()) {
            this.num = this.max();
        }
        this.setNum(this.num);
    }
    private onTouchReduce() {
        this.num -= 1;
        if (this.num <= 0) {
            if(this.max()==0)
            {
                this.num = 0;
                this.setNum(this.num);
                return
            }
            this.num = 1;
        }
        this.setNum(this.num);
    }
    private onTouchMin() {
        this.setNum(this.min());
    }
    private onTouchMax() {
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
                this.setNum(this.max());
                break;
            case BatchDisposebar.BATCH_TYPE_BUY://商城
            case BatchDisposebar.BATCH_TYPE_CONNT:
                this.setNum(this.addTEN());
                break;
            case BatchDisposebar.BATH_TYPE_RNUES:
             case BatchDisposebar.BATH_TYPE_ZHANWEN:
                this.setNum(this.addTEN());
                break;
        }

    }
    private onTouchBuy() {
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
                var message = new Message(MESSAGE_ID.GOODS_LIST_USE_MESSAGE);
                message.setByte(this._model.type);
                message.setShort(this._model.modelId);
                message.setInt(this.num);
                if (this.radio_type >= 0) {
                    message.setByte(this.radio_type);
                }
                GameCommon.getInstance().sendMsgToServer(message);
                break;
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                if (this.sum > this.ownCurrency()) {
                    GameCommon.getInstance().addAlert("当前货币不足");
                    return;
                }
                var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
                message.setByte(this._model.shopType);
                message.setInt(this._model.id);
                message.setInt(this.num);
                GameCommon.getInstance().sendMsgToServer(message);
                break;
        }
        if (this.owner && this.owner["onHide"]) {
            this.owner["onHide"]();
        }
    }
    private setNum(num: number) {
        if (num == undefined) return;
        this.num = num;
        this.label_num.text = num.toString();
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
            case BatchDisposebar.BATH_TYPE_ZHANWEN:
                this.label_min.text = "最小";
                this.label_max.text = "最大";
                break;
            case BatchDisposebar.BATCH_TYPE_VIP:
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                //显示总价
                // if (this._model.price[1]) {
                //     this.sum = this.num * this._model.price[1].num;
                //     var color = this.sum > this.ownCurrency() ? 0xff0000 : 0xffffff;
                //     this.label_money.textFlow = new Array<egret.ITextElement>(
                //         { text: this.sum.toString(), style: { textColor: color } }
                //     );
                //     this.label_min.text = "-10";
                //     this.label_max.text = "+10";
                // } else {
                this.sum = this.num * this.price;
                var color = this.sum > this.ownCurrency() ? 0xff0000 : 0xffffff;
                this.label_money.textFlow = new Array<egret.ITextElement>(
                    { text: this.sum.toString(), style: { textColor: color } }
                );
                this.label_min.text = "-10";
                this.label_max.text = "+10";
                // }
                break;
            case BatchDisposebar.BATCH_TYPE_CONNT:
                if (this.updateCallFunc) {
                    Tool.callback(this.updateCallFunc, this.updateCallObj);
                }
                this.label_min.text = "-10";
                this.label_max.text = "+10";
                break;
        }
    }
    public onUpdate(model = null) {
        this._model = model;
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
                this.setNum(this.max());
                this.modelprice = null;
                break;
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                // var item: ShopType = new ShopType();
                // item.type = model.shopType;
                this.img_payIcon.source = ShopPanel.getPayIcon(model.shopType);//item.img_payIcon;
                this.img_payIcon0.source = ShopPanel.getPayIcon(model.shopType);//item.img_payIcon;
                this.modelprice = GameCommon.getInstance().onParseAwardItemstr(this._model.price);
                this.setNum(1);
                break;
            case BatchDisposebar.BATCH_TYPE_CONNT:
                this.setNum(1);
                this.modelprice = null;
                break;
            case BatchDisposebar.BATCH_TYPE_VIP:
                this.modelprice =[];
                this.modelprice.push(this._model.model.cost); 
                this.setNum(1);
                break;
            case BatchDisposebar.BATH_TYPE_RNUES:
            case BatchDisposebar.BATH_TYPE_ZHANWEN:
                this.setNum((this.model as BatchParam).maxNum);
                break;
        }
    }
    /**获取当前商品价格**/
    private get price(): number {
        var price: number = 0;
        if (this._model && (this.currentState == BatchDisposebar.BATCH_TYPE_BUY||this.currentState == BatchDisposebar.BATCH_TYPE_VIP)) {
            var saleRate: number = 100;
            if (DataManager.getInstance().shopManager.discountMap[this._model.shopType]) {
                saleRate = DataManager.getInstance().shopManager.discountMap[this._model.shopType];
            }
            if (this.modelprice) {
                price = Tool.toInt(this.modelprice[0].num * saleRate / 100);
            } else {
                price = Tool.toInt(this._model.price[0].num * saleRate / 100);
            }
        }
        return price;
    }
    public ownCurrency() {
        if (this.modelprice) {
            return ShopPanel.getCurrency(this.modelprice[0].type);
        } else {
            return ShopPanel.getCurrency(this._model.price[0].type);
        }
    }
    public min() {
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
                return 1;
            case BatchDisposebar.BATH_TYPE_ZHANWEN:
                return 0;
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                var canBuy: number;
                if ((this.num - 10) >= 0) {
                    canBuy = this.num - 10;
                } else {
                    canBuy = 1;
                }
                return Math.max(canBuy, 1);
            case BatchDisposebar.BATCH_TYPE_CONNT:
                return Math.max(this.num - 10, 1);
            case BatchDisposebar.BATH_TYPE_RNUES:
                var canBuy: number;
                if ((this.num - 10) >= 0) {
                    canBuy = this.num - 10;
                } else {
                    canBuy = 0;
                }
                return canBuy;
        }
    }
    public addTEN() {
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
            
                var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this._model.modelId, GOODS_TYPE.BOX);
                var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
                return Math.max(0, _hasitemNum);
            case BatchDisposebar.BATH_TYPE_ZHANWEN:
                if(this.max()==0)
                {
                    return 0;
                }
                return Math.min(this.max() > 0 ? this.max() : 9999999);
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                var canBuy: number;
                if (this.num <= 1) {
                    canBuy = Math.min(10, Math.floor(this.ownCurrency() / this.price));
                } else {
                    canBuy = Math.min((this.num + 10), Math.floor(this.ownCurrency() / this.price));
                }
                return Math.max(canBuy, 1);
            case BatchDisposebar.BATCH_TYPE_CONNT:
                return Math.min(this.num + 10, this.max() > 0 ? this.max() : 9999999);
            case BatchDisposebar.BATH_TYPE_RNUES:
             case BatchDisposebar.BATH_TYPE_ZHANWEN:
                if(this.max()==0)
                {
                    return 0;
                }
                return Math.min(this.num + 10, this.max() > 0 ? this.max() : 9999999);
        }
    }
    public max() {
        switch (this.currentState) {
            case BatchDisposebar.BATCH_TYPE_USE://背包
            case BatchDisposebar.BATCH_TYPE_USE2:
                var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this._model.modelId, GOODS_TYPE.BOX);
                var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
                return Math.max(0, _hasitemNum);
            case BatchDisposebar.BATCH_TYPE_BUY://商城
                return Math.max(1, Math.floor(this.ownCurrency() / this.price));
            case BatchDisposebar.BATCH_TYPE_CONNT:
                return (this.model as BatchParam).maxNum;
            case BatchDisposebar.BATH_TYPE_RNUES:
            case BatchDisposebar.BATH_TYPE_ZHANWEN:
                return (this.model as BatchParam).maxNum;
        }
    }
    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onInputChage(e: egret.Event) {
        if (!this.visible) return;
        var txt: eui.TextInput = e.target;
        var curr: number = Tool.isNumber(parseInt(txt.text)) ? parseInt(txt.text) : 1;
        if (curr > this.max()) {
            this.num = this.max();
            this.setNum(this.num);
        } else {
            this.setNum(curr);
        }
    }

    private onTouchRadioButton(e: egret.Event) {
        this.radio_type = parseInt((<eui.RadioButton>e.target).value);
    }

    public onRegist(): void {
        this.label_num.addEventListener(egret.Event.CHANGE, this.onInputChage, this);
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdd, this);
        this.btnReduce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReduce, this);
        this.btn_min.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMin, this);
        this.btn_max.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMax, this);
        this.radio0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        // this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuy, this);
    }
    public onRemove(): void {
        this.label_num.removeEventListener(egret.Event.CHANGE, this.onInputChage, this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdd, this);
        this.btnReduce.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReduce, this);
        this.btn_min.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMin, this);
        this.btn_max.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMax, this);
        this.radio1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        this.radio0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadioButton, this)
        // this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuy, this);
    }
    public get count(): number {
        return this.num;
    }
    //设置更新回调
    private updateCallFunc;
    private updateCallObj;
    public onSetUpdateCall(callfunc, obj): void {
        this.updateCallFunc = callfunc;
        this.updateCallObj = obj;
    }
}
class BatchParam {
    public maxNum: number = 0;
}