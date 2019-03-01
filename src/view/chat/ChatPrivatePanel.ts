class ChatPrivatePanel extends BaseWindowPanel {
    private currParam: ChatPanelParam;

    private chat_name_label: eui.Label;
    private btn_send: eui.Button;
    private btn_icon: eui.Button;
    private bubbleLayer: eui.List;
    private bar: eui.Scroller;
    private label_input: eui.Label;
    // private panel_title: eui.Image;
    private closeBtn1: eui.Button;
    private chatwicket: eui.Group;
    private whisper: SimplePlayerData;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    // public isInCD: boolean = false;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ChatPrivatePanelSkin;
    }
    protected onInit(): void {
        this.bubbleLayer.itemRenderer = ChatBubble;
        this.bubbleLayer.itemRendererSkinName = skins.ChatBubbleSkin;
        this.bubbleLayer.useVirtualLayout = true;
        this.bar.viewport = this.bubbleLayer;
        this.setTitle("私聊");
        super.onInit();
        this.onRefresh();
    }

    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private refreshChatList() {
        var info = DataManager.getInstance().chatManager.chat[CHANNEL.WHISPER];
        let list = [];
        let myId = this.getPlayerData().id;
        for(let i = 0; i < info.length; ++i){
            if(info[i].sendID == this.whisper.id || info[i].sendID == myId){
                list.push(info[i]);
            }
        }
        this.bubbleLayer.dataProvider = new eui.ArrayCollection(list);
    }
    protected onRefresh(): void {
        this.chatwicket.visible = true;
        if (this.currParam && this.currParam.player) {
            this.whisper = this.currParam.player;
            // this.chat_name_label.text = this.whisper.name;
        }
        this.refreshChatList();
        setTimeout(this.adjustBar.bind(this), 50);
    }
    private adjustBar() {
        this.bar.stopAnimation();
        this.bar.viewport.scrollV = Math.max(this.bar.viewport.contentHeight - this.bar.viewport.height, 0);
    }
    private checkNotBottom(): boolean {
        if (this.bar.viewport.contentHeight > this.bar.viewport.height && this.bar.viewport.scrollV < this.bar.viewport.contentHeight - this.bar.viewport.height - 50)
            return true;
        else
            return false;
    }
    private updateInfo() {
        if (!DataManager.getInstance().chatManager.isSucceed) return;
        this.refreshChatList();
        if (!this.checkNotBottom()) {
            setTimeout(this.adjustBar.bind(this), 50);
        }
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.updateInfo, this);

    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.updateInfo, this);

    }

    public onShowWithParam(param): void {
        this.currParam = param;
        this.onShow();
    }

    private onTouchBtnSend() {
        var sendStr: string = this.label_input.text;
        this.label_input.text = "";
        if (sendStr != "") {
            if (DataManager.getInstance().playerManager.player.level < 30) {
                GameCommon.getInstance().addAlert("30级才可发言");
                return;
            }
            if (!DataManager.getInstance().chatManager.cds[CHANNEL.WHISPER].getCanDo()) {
                GameCommon.getInstance().addAlert("不能频繁发言");
                return;
            }
            var acceptID: number = -1;
            // if (this.owner.tab == CHANNEL.WHISPER) {
            if (!this.whisper) {
                GameCommon.getInstance().addAlert("清选择私聊对象");
                return;

            }
            acceptID = this.whisper.id;
            // }
            this.sendInfo(sendStr, acceptID);
        }
    }
    private sendInfo(sendStr, acceptID: number = -1) {
        var message = new Message(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE);
        message.setByte(CHANNEL.WHISPER);//注：后期增加频道需要改动对应类型
        message.setString(sendStr);
        message.setInt(acceptID);
        GameCommon.getInstance().sendMsgToServer(message);
    }

}