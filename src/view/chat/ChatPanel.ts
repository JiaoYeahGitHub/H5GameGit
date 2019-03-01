class ChatPanel extends BaseTabView {
    private btn_send: eui.Button;
    // private btn_icon: eui.Button;
    private bubbleLayer: eui.List;
    private bar: eui.Scroller;
    private label_input: eui.TextInput;
    private panel_title: eui.Image;
    private closeBtn1: eui.Button;
    private closeBtn2: eui.Button;
    private btn_union: eui.RadioButton;
    private btn_system: eui.RadioButton;
    private btn_world: eui.RadioButton;
    private chatwicket: eui.Group;
    // private label_whisper: eui.Label;
    private whisper: SimplePlayerData;
    // private richTxt: RichTextField;
    public isInCD: boolean = false;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ChatPanelSkin;
    }
    protected onInit(): void {
        this.bubbleLayer.itemRenderer = ChatBubble;
        this.bubbleLayer.itemRendererSkinName = skins.ChatBubbleSkin;
        // this.bubbleLayer.useVirtualLayout = true;
        this.bar.viewport = this.bubbleLayer;

        super.onInit();
        this.onRefresh();
    }

    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private refreshChatList() {
        let info = DataManager.getInstance().chatManager.chat[ChatMainPanel.openQueue[this.owner.tab]];
        this.bubbleLayer.dataProvider = new eui.ArrayCollection(info);
    }
    protected onRefresh(): void {
        let owner: ChatMainPanel = this.owner as ChatMainPanel;
        this.chatwicket.visible = true;
        // this.label_whisper.visible = false;
        switch (ChatMainPanel.openQueue[this.owner.tab]) {
            case CHANNEL.SYS:
                this.chatwicket.visible = false;
                break;
            case CHANNEL.WHISPER:
                if (owner.currParam && owner.currParam.player) {
                    this.whisper = owner.currParam.player;
                }
                // if (this.whisper) {
                //      this.label_whisper.visible = true;
                //      this.label_whisper.textFlow = new Array<egret.ITextElement>(
                //        { text: "对", style: { textColor: 0xffffff } },
                //        { text: GameCommon.getInstance().getNickname(this.owner.currParam.player.name), style: { textColor: 0x289aea } },
                //          { text: "说:", style: { textColor: 0xffffff } }
                //      );
                // }
                break;
        }
        this.refreshChatList();
        setTimeout(this.adjustBar.bind(this), 50);
        //默认的输入一句聊天话语
        if (owner.currParam && owner.currParam.content) {
            this.label_input.text = owner.currParam.content;
            owner.currParam.content = '';
        }
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
        if (DataManager.getInstance().chatManager.currType != ChatMainPanel.openQueue[this.owner.tab]) return;
        if (!DataManager.getInstance().chatManager.isSucceed) return;
        switch (ChatMainPanel.openQueue[this.owner.tab]) {
            case CHANNEL.GUILD:
                DataManager.getInstance().chatManager.hasNewGuidTalk = false;
                break;
            case CHANNEL.WHISPER:
                DataManager.getInstance().chatManager.hasNewWhisperTalk = false;
                break;
        }
        this.refreshChatList();
        if (!this.checkNotBottom())
            setTimeout(this.adjustBar.bind(this), 50);
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.updateInfo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SYSTEM_CHAT_BROADCAST, this.onChatBroadcastBack, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.updateInfo, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.SYSTEM_CHAT_BROADCAST, this.onChatBroadcastBack, this);
    }
    private onChatBroadcastBack() {
        if (ChatMainPanel.openQueue[this.owner.tab] == CHANNEL.SYS) {
            this.updateInfo();
        }
    }
    private onTouchBtnSend() {
        var sendStr: string = this.label_input.text;
        this.label_input.text = "";
        if (sendStr != "") {
            if (this.getPlayerData().level < 100) {
                GameCommon.getInstance().addAlert("100级才可发言");
                return;
            }
            if (!DataManager.getInstance().chatManager.cds[ChatMainPanel.openQueue[this.owner.tab]].getCanDo()) {
                GameCommon.getInstance().addAlert("不能频繁发言");
                return;
            }
            var acceptID: number = -1;
            if (ChatMainPanel.openQueue[this.owner.tab] == CHANNEL.WHISPER) {
                if (!this.whisper) {
                    GameCommon.getInstance().addAlert("清选择私聊对象");
                    return;
                }
                acceptID = this.whisper.id;
            }
            this.sendInfo(sendStr, acceptID);
        }
    }
    private sendInfo(sendStr, acceptID: number = -1) {
        var message = new Message(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE);
        message.setByte(ChatMainPanel.openQueue[this.owner.tab]);//注：后期增加频道需要改动对应类型
        message.setString(sendStr);
        message.setInt(acceptID);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}
class ChatBubble extends BaseListItem {
    // private _data: ChatBase;
    private vip_group: eui.Group;
    private label_info: eui.Label;
    private label_lv: eui.Label;
    private img_bg: eui.Image;
    // private hero_head_l: eui.Image;
    private playerHead: PlayerHeadPanel;
    // private titleLayer: eui.Group;
    private headLayer: eui.Group;
    private richTxt: RichTextField;
    public constructor() {
        super();
    }
    protected onInit(): void {
        this.headLayer.touchEnabled = true;
        this.headLayer.touchChildren = true;
        this.headLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHead, this);
        this.richTxt.label_content.addEventListener(egret.TextEvent.LINK, this.onTouchRichTextLink, this);
    }
    protected onUpdate(): void {
        if (!this.data || !this.data.player) return;
        if (this.data.type == CHANNEL.WHISPER && this.data.sendID == DataManager.getInstance().playerManager.player.id) {
            this.currentState = 'self';
        } else if (this.data.player.id == DataManager.getInstance().playerManager.player.id) {
            this.currentState = 'self';
        } else {
            this.currentState = 'normal';
        }
        var channel = this.data.player.id;
        switch (channel) {
            case -2:
                this.vip_group.visible = false;
                this.label_info.textFlow = new Array<egret.ITextElement>(
                    { text: "[系统]", style: { textColor: 0xffae21 } }
                );
                this.richTxt.textFlow = (new egret.HtmlTextParser).parser(this.data.content);
                this.playerHead.setHeadSystem();
                break;
            case -1:
                this.vip_group.visible = false;
                this.label_info.textFlow = new Array<egret.ITextElement>(
                    { text: "[公告]", style: { textColor: 0xff0000 } }
                );
                this.richTxt.textFlow = (new egret.HtmlTextParser).parser(this.data.content);
                this.playerHead.setHeadSystem();
                break;
            default:
                var index: number = this.data.player.headindex;
                var frame: number = this.data.player.headFrameIndex || this.data.player.headFrame;
                if (this.data.type == CHANNEL.WHISPER && this.data.sendID == DataManager.getInstance().playerManager.player.id) {
                    index = DataManager.getInstance().playerManager.player.headIndex;
                    frame = DataManager.getInstance().playerManager.player.headFrameIndex;
                }
                this.playerHead.setHead(index, frame);
                let vipL = 0;
                if (this.data.type == CHANNEL.WHISPER && this.data.sendID == DataManager.getInstance().playerManager.player.id) {
                    vipL = DataManager.getInstance().playerManager.player.viplevel;
                } else {
                    vipL = this.data.player.viplevel;
                }
                this.vip_group.visible = vipL > 0;
                if (this.data.param) {
                    this.label_info.text = "";
                    let richTxtary: Array<egret.ITextElement>;
                    if (this.data.time > egret.getTimer()) {
                        richTxtary = DataManager.getInstance().chatManager.parseHtmlToTextElement(this.data);
                    } else {
                        richTxtary = DataManager.getInstance().chatManager.parseHtmlToTextElement(this.data, true);
                    }
                    this.richTxt.textFlow = richTxtary;
                } else {
                    this.richTxt.appendEmojiText(this.data.content, false);
                    switch (this.data.type) {
                        default:
                            this.label_info.textFlow = new Array<egret.ITextElement>(
                                { text: GameCommon.getInstance().getNickname(this.data.player.name) }
                            );
                            break;
                        case CHANNEL.GUILD:
                            this.label_info.textFlow = new Array<egret.ITextElement>(
                                { text: "[" + UnionDefine.Union_Postions[this.data.job] + "]", style: { textColor: 0xce2af1 } },
                                { text: GameCommon.getInstance().getNickname(this.data.player.name), style: { textColor: 0x289aea } }
                            );
                            break;
                        case CHANNEL.WHISPER:
                            this.vip_group.visible = false;
                            if (this.data.sendID == DataManager.getInstance().playerManager.player.id) {
                                // this.label_info.textFlow = new Array<egret.ITextElement>(
                                //     { text: "我对", style: { textColor: 0xffffff } },
                                //     { text: GameCommon.getInstance().getNickname(this._data.player.name), style: { textColor: 0x289aea } },
                                //     { text: "说:", style: { textColor: 0xffffff } }
                                // );
                                this.label_info.text = DataManager.getInstance().playerManager.player.name;
                            } else {
                                // this.label_info.textFlow = new Array<egret.ITextElement>(
                                //     { text: GameCommon.getInstance().getNickname(this._data.player.name), style: { textColor: 0x289aea } },
                                //     { text: "对我说:", style: { textColor: 0xffffff } }
                                // );
                                this.label_info.text = this.data.player.name;
                            }
                            break;
                    }
                }
                break;
        }
    }
    //点击头像
    private onTouchHead(): void {
        if (this.data.player.id == DataManager.getInstance().playerManager.player.id) return;
        if (this.data.type == CHANNEL.SYS) return;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("FriendFuncPanel", new FriendFuncParam(FRIENDFUNC_FROM.CHAT, this.data.player)));
    }
    //点击富文本
    private onTouchRichTextLink(evt: egret.TextEvent): void {
        var _hrefParam: string = evt.text;
        if (_hrefParam) {
            ChatDefine.onChatHrefEvent(_hrefParam);
        }
    }
    //The end
}