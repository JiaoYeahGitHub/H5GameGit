/**
 * 邮件系统
 * @author	lzn
 * 
 * 
 * 
 */
class MailTypePanel extends BaseTabView {
    private mailLayer: eui.Group;
    private mail: Array<Mailbase>;
    private contentLayer: eui.Group;
    private com: eui.Component;
    private accessoryLayer: eui.Group;
    private data: Mailbase;
    private item: MailItem;
    private btn_receive: eui.Button;
    private btn_receive_oneKey: eui.Button;
    private label_title: eui.Label;
    // private qq_service_lab: eui.Label;
    // private label_name: eui.Label;
    private label_desc: eui.Label;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.MailPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.com["label_title"].text = '邮件详情';
        // if (SDKManager.getChannel() == EChannel.CHANNEL_WANBA) {
        //     this.qq_service_lab.visible = true;
        // } else {
        //     this.qq_service_lab.visible = false;
        // }
        this.accessoryLayer.touchChildren = false;
        this.onRefresh();
    }

    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    protected onRefresh(): void {
        var len: number;
        var item: MailItem;
        this.mail = DataManager.getInstance().mailManager.getMailList();
        this.mailLayer.removeChildren();
        len = this.mail.length;
        for (var i = 0; i < len; i++) {
            item = new MailItem();
            item.y = i * 130;
            item.data = this.mail[i];
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
            this.mailLayer.addChild(item);
        }
        this.ononeKeyfunction();
    }
    private onTouchItem(e: egret.Event) {
        this.item = <MailItem>e.currentTarget;
        this.data = this.item.data;
        if (!this.data.isOpen) {
            this.data.isOpen = true;
            this.item.onUpdate();
            var message = new Message(MESSAGE_ID.PLAYER_MAIL_READ_MESSAGE);
            message.setInt(this.item.data.id);
            GameCommon.getInstance().sendMsgToServer(message);
        }
        this.onmailfunction();
        this.contentLayer.visible = true;
        this.showContent();
    }
    private showContent() {
        this.accessoryLayer.removeChildren();
        // if (!this.data.isReceived) {
        var len = this.data.accessory.length;
        for (var i = 0; i < len; i++) {
            var info: accessorybase = this.data.accessory[i];
            var goods: GoodsInstance = new GoodsInstance();
            goods.x = Math.floor(i % 4) * 95;
            goods.y = Math.floor(i / 4) * 120;
            // goods.currentState = "normal";
            // goods.scaleX = goods.scaleY = 0.8;
            goods.onUpdate(info.type, info.id, 0, info.quality, info.count, info.lv);
            goods.scaleX = 0.8;
            goods.scaleY = 0.8;
            this.accessoryLayer.addChild(goods);
        }
        if (this.data.isReceived) {
            this.btn_receive.label = Language.instance.getText("mailReceived");
        } else {
            this.btn_receive.label = Language.instance.getText("lingqu");
        }
        // }
        this.label_title.text = this.data.title;
        this.label_desc.text = this.data.content;
        // this.label_name.text = this.data.sendTime;
    }
    private onTouchCloseBtn1() {
        this.contentLayer.visible = false;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnReceive, this);
        this.btn_receive_oneKey.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnrReceiveOneKey, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAIL_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_ALL_MESSAGE.toString(), this.onReceiveAll, this);
        this.com["closeBtn2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn1, this);
        // this.com["closeBtn2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn1, this);

        if (DataManager.getInstance().mailManager.mail.length == 0 || DataManager.getInstance().mailManager.mail.length == undefined) {
            var message = new Message(MESSAGE_ID.PLAYER_MAIL_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            this.onRefresh();
        }
        this.contentLayer.visible = false;
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_receive.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnReceive, this);
        this.btn_receive_oneKey.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnrReceiveOneKey, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAIL_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_ALL_MESSAGE.toString(), this.onReceiveAll, this);
        this.com["closeBtn2"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn1, this);
        // this.com["closeBtn2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn1, this);
    }
    private onReceiveAll() {
        var len = this.mailLayer.numChildren;
        for (var i = len - 1; i >= 0; i--) {
            var it: MailItem = this.mailLayer.getChildAt(i) as MailItem;
            it.onUpdate();
            this.ononeKeyfunction();
            //已经一键领取过了
        }
    }
    //判断当前邮件里面有没有物品
    private ononeKeyfunction() {
        var maillen = this.mail.length;
        for (var i = 0; i < maillen; i++) {
            // if(this.mail[i].isReceived){
            //     this.btn_receive_oneKey.enabled=true;
            //     break;
            // }else{
            //     this.btn_receive_oneKey.enabled=false;
            // }
            this.btn_receive_oneKey.enabled = this.mail[i].isReceived ? false : true;
            if (this.btn_receive_oneKey.enabled == true) {
                break;
            }
        }

    }
    //判断每条邮件有没有物品
    private onmailfunction() {
        // if(this.data.accessory!=[]){
        //     this.btn_receive.enabled=true;

        // }else{
        //     this.btn_receive.enabled=false;
        // }
        this.btn_receive.enabled = this.data.isReceived ? false : true;
    }
    private onTouchBtnReceive() {
        if (!this.data.isReceived) {
            var message = new Message(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_MESSAGE);
            message.setInt(this.item.data.id);
            GameCommon.getInstance().sendMsgToServer(message);

            // this.data.isReceived = true;
            // this.item.onUpdate();
            //this.btn_receive.enabled=false;
        }
        this.contentLayer.visible = false;
    }
    private onTouchBtnrReceiveOneKey() {
        var message = new Message(MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_ALL_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private updateInfo(info) {
    }
    private onTouchBtnAdvance() {
    }
    //    public_titlebar1

}
class MailItem extends eui.Component {
    private _data: Mailbase;
    private img_read: eui.Image;
    private label_title: eui.Label;
    private img_received: eui.Image;
    private img_unReceived: eui.Image;
    private label_time: eui.Label;
    private imgDi: eui.Image;
    private label_title1: eui.Label;
    // private label_time1: eui.Label;
    public constructor() {
        super();
        this.skinName = skins.MailItemSkin;
    }
    public set data(da: Mailbase) {
        this._data = da;
        this.onUpdate();
    }
    public get data() {
        return this._data;
    }
    public onUpdate() {
        this.img_read.source = this.data.isOpen ? "mail_read_png" : "mail_unread_png";
        this.imgDi.source = this.data.isOpen ? "mail_read_di_png" : "mail_unread_di_png";
        // if (this.img_open.text == "（已读）") {
        //     this.img_open.textColor = 0xc3c6c0;
        // } else {
        //     this.img_open.textColor = 0x5AEF09;
        // }
        // if (this.data.isReceived) {
        // this.label_title1.textFlow = (new egret.HtmlTextParser).parser(`<font color="#FFFFFF">${'(已读)'}</font>`);
        // this.label_title.text = this.data.title;
        // }
        // else {
        // this.label_title1.textFlow = (new egret.HtmlTextParser).parser(`<font color="#00ff00">${'(未读)'}</font>`);
        this.label_title.text = this.data.title;// (new egret.HtmlTextParser).parser(this.data.title+`<font color="#00ff00">${'(未读)'}</font>`);
        // }
        // .visible = this.data.isReceived ? false : true;
        if (this.data.isReceived) {
            this.img_received.source = 'mail_yilingqu_png';
        }
        else {
            this.img_received.source = 'mail_attach_png';
        }
        // if(this.data.accessory.length==0){
        //     this.img_received.visible=false;
        // }else{
        //     this.img_received.visible=true;
        // }
        // this.img_received.visible=this.data.isReceived;

        // this.img_open.x = this.label_title.x + this.label_title.width + 10;
        this.label_time.text = this.data.sendTime;
    }
}