/**
 * 聊天管理类
 * @author	lzn
 * 
 * 
 */
class ChatManager {
    //聊天信息
    public chat;
    public cds;
    public hasNewGuidTalk: boolean = false;
    public hasNewWhisperTalk: boolean = false;
    public isSucceed: boolean = false;
    private record;
    private test: eui.Label;
    public currType: number;

    public constructor() {
        this.chat = [[], [], [], [], [],[]];
        this.record = {};
        this.test = new eui.Label();
        this.cds = {};
        this.cds[CHANNEL.CURRENT] = new ChatChannelCD(CHANNEL.CURRENT, 10000);
        this.cds[CHANNEL.GUILD] = new ChatChannelCD(CHANNEL.GUILD, 10000);
        this.cds[CHANNEL.WHISPER] = new ChatChannelCD(CHANNEL.WHISPER, 10000);
        this.cds[CHANNEL.SYS] = new ChatChannelCD(CHANNEL.SYS, 10000);
        this.cds[CHANNEL.ALLSERVER] = new ChatChannelCD(CHANNEL.SYS, 10000);
        GameDispatcher.getInstance().addEventListener(GameEvent.SYSTEM_CHAT_BROADCAST, this.onBroadcast, this);
    }
    public onSendChatRecord(type: number): void {
        var message = new Message(MESSAGE_ID.PLAYER_CHAT_RECEIVE_MESSAGE);
        message.setByte(type);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    public parseChatRecord(msg: Message) {
        var type = msg.getByte();
        this.chat[type] = [];
        DataManager.getInstance().friendManager.clearRecentContacts();
        var len = msg.getByte();
        var base: ChatBase;
        for (var i = 0; i < len; i++) {
            base = new ChatBase(type);
            base.onParseMsg(msg);
            this.pushByType(type, base);
            if (type == CHANNEL.WHISPER) {
                DataManager.getInstance().friendManager.addRecentContacts(new FriendInfoBase(base.player), true);
            }
        }
    }
    public parseChatNew(msg: Message) {
        this.currType = msg.getByte();
        var base: ChatBase = new ChatBase(this.currType);
        base.onParseMsg(msg);
        switch (this.currType) {
            case CHANNEL.GUILD:
                if (base.player.id != DataManager.getInstance().playerManager.player.id) {
                    this.hasNewGuidTalk = true;
                }
                break;
            case CHANNEL.WHISPER:
                if (base.sendID != DataManager.getInstance().playerManager.player.id) {
                    this.hasNewWhisperTalk = true;
                    DataManager.getInstance().friendManager.addRecentContacts(new FriendInfoBase(base.player), false);
                }
                break;
        }
        this.pushByType(this.currType, base);
        //计算消息的有效时间
        if (base.param) {
            base.time = ChatDefine.getChatValidTime(base.param);
        }
        GameCommon.getInstance().receiveMsgToClient(msg, base);
    }

    public pushByType(type: number, base: ChatBase) {
        this.isSucceed = false;
        if (!DataManager.getInstance().friendManager.getIsInBlackList(base.player.id)) {
            this.isSucceed = true;
            let chats: ChatBase[] = this.chat[type];
            if (!chats) return;
            chats.push(base);
            if (type != CHANNEL.WHISPER) {
                this.chat[CHANNEL.ALL].push(base);
            }
            let deleteChat: ChatBase;
            switch (type) {
                case CHANNEL.SYS:
                    if (this.chat[type].length >= 30) {
                        deleteChat = this.chat[type].shift();
                    }
                    break;
                default:
                    if (this.chat[type].length >= ChatDefine.MAX_RECORD_INFO) {
                        deleteChat = this.chat[type].shift();
                    }
                    break;
            }
            if (deleteChat) {
                if (this.chat[CHANNEL.ALL].length >= ChatDefine.MAX_RECORD_INFO) {
                    let isAllCHIdx: number = (this.chat[CHANNEL.ALL] as ChatBase[]).indexOf(deleteChat);
                    if (isAllCHIdx >= 0) {
                        (this.chat[CHANNEL.ALL] as ChatBase[]).splice(isAllCHIdx, 1);
                    }
                }
                deleteChat.player = null;
                deleteChat = null;
            }
        }
    }

    public onBroadcast(e: egret.Event): void {
        var type = 0;
        var base: ChatBase = new ChatBase(type);
        var data: BroadcastBase = e.data;
        base.player.id = data.channel - 2;
        base.player.name = "";
        base.player.viplevel = data.vip;
        base.player.headindex = data.occpcution;
        base.content = data.str;
        this.pushByType(type, base);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SYSTEM_CHAT_BROADCAST_UPDATEMAINVIEW));
    }

    public getChatTextFlow(type: number, info: ChatBase[]) {//, outlen: number = 10
        var j: number = 0;
        var base: ChatBase;
        var ret: egret.ITextElement[] = [];
        var curr: egret.ITextElement[] = [];
        var len: number = info.length;
        var channel: number;
        if (len == 0) return ret;
        for (var i = 0; i < len; i++) {
            base = info[i];
            // let content: string = base.content.length > outlen ? base.content.slice(0, outlen) + "..." : base.content;
            channel = base.player.id;
            switch (channel) {
                case -2:
                    ret.push({ text: "[系统]", style: { textColor: 0xffae21 } });
                    curr = (new egret.HtmlTextParser).parser(base.content);
                    for (j = 0; j < curr.length; j++) {
                        ret.push(curr[j]);
                    }
                    ret.push({ text: "\n", style: {} });
                    break;
                case -1:
                    ret.push({ text: "[公告]", style: { textColor: 0xff0000 } });
                    curr = (new egret.HtmlTextParser).parser(base.content);
                    for (j = 0; j < curr.length; j++) {
                        ret.push(curr[j]);
                    }
                    ret.push({ text: "\n", style: {} });
                    break;
                default:
                    switch (base.type) {
                        case 2:
                            ret.push({ text: "[仙盟]", style: { textColor: 0xce2af1 } });
                            ret.push({ text: "[" + UnionDefine.Union_Postions[base.job] + "]", style: { textColor: 0xce2af1 } });
                            ret.push({ text: GameCommon.getInstance().getNickname(base.player.name) + ":", style: { textColor: 0xc9ba81 } });
                            if (base.param) {
                                if (base.time > egret.getTimer()) {
                                    ret.push({ text: base.content, style: { textColor: 0x00FF00, "href": `event:${base.param}`, underline: true } });
                                    ret.push({ text: "\n", style: {} });
                                } else {
                                    ret.push({ text: base.content, style: { textColor: 0x898989 } });
                                    ret.push({ text: "\n", style: {} });
                                }
                            } else {
                                ret.push({ text: base.content, style: { textColor: 0xcacaca } });
                                ret.push({ text: "\n", style: {} });
                            }
                            break;
                        case 4:
                            // ret.push({ text: "[私聊]", style: { textColor: 0xffffff } });
                            // if (base.sendID == DataManager.getInstance().playerManager.player.id) {
                            //     ret.push({ text: "我对", style: { textColor: 0xffffff } });
                            //     ret.push({ text: GameCommon.getInstance().getNickname(base.player.name), style: { textColor: 0x289aea } });
                            //     ret.push({ text: "说:", style: { textColor: 0xffffff } });
                            // } else {
                            //     ret.push({ text: GameCommon.getInstance().getNickname(base.player.name), style: { textColor: 0x289aea } });
                            //     ret.push({ text: "对我说:", style: { textColor: 0xffffff } });
                            // }
                            // ret.push({ text: base.content, style: { textColor: 0XFFFFFF } });
                            // ret.push({ text: "\n", style: {} });
                            break;
                        default:
                            ret.push({ text: "[世界]", style: { textColor: 0xffffff } });
                            if (base.param) {
                                if (base.time > egret.getTimer()) {
                                    curr = this.parseHtmlToTextElement(base);
                                    for (j = 0; j < curr.length; j++) {
                                        ret.push(curr[j]);
                                    }
                                    ret.push({ text: "\n", style: { "href": `event:${base.param}` } });
                                } else {
                                    curr = this.parseHtmlToTextElement(base, true);
                                    for (j = 0; j < curr.length; j++) {
                                        ret.push(curr[j]);
                                    }
                                    ret.push({ text: "\n", style: {} });
                                }
                            } else {
                                ret.push({ text: GameCommon.getInstance().getNickname(base.player.name) + ":", style: { textColor: 0xc9ba81 } });
                                ret.push({ text: base.content, style: { textColor: 0xcacaca } });
                                ret.push({ text: "\n", style: {} });
                            }
                            break;
                    }
                    break;
            }
        }
        ret.pop();
        return ret;
    }
    //将格式：[#00ff00XXXXXXXX] 解析成 egret.ITextElement对象 isdelete=true代表将格式删除
    public parseHtmlToTextElement(base: ChatBase, isdelete: boolean = false): egret.ITextElement[] {
        let str: string = base.content;
        let curr: egret.ITextElement[] = [];
        let matchary: RegExpMatchArray = str.match(/\[#[0-9a-fA-F]{6}.*?]/g);
        if (matchary) {
            let matchidx: number = 0;
            for (let i: number = 0; i <= matchary.length; i++) {
                let startidx: number = matchidx;
                let endidx: number;
                let _colordesc: string = '';
                let _color: number;
                if (matchary.length > i) {
                    let matchStr: string = matchary[i];
                    endidx = str.indexOf(matchStr);
                    _colordesc = matchStr.slice(8, matchStr.length - 1);
                    _color = parseInt('0x' + matchStr.slice(2, 8));
                    matchidx = endidx + matchStr.length;
                } else {
                    endidx = str.length;
                    matchidx = str.length;
                }
                let _desc: string = str.slice(startidx, endidx);

                if (!isdelete) {
                    curr.push({ text: _desc, style: { textColor: 0x00FF00, "href": `event:${base.param}`, underline: true } });
                    if (_colordesc) {
                        curr.push({ text: _colordesc, style: { textColor: _color, "href": `event:${base.param}`, underline: true } });
                    }
                } else {
                    curr.push({ text: _desc + _colordesc, style: { textColor: 0xffffff } });
                }
            }
        } else {
            if (!isdelete) {
                curr.push({ text: str, style: { textColor: 0x00FF00, "href": `event:${base.param}`, underline: true } });
            } else {
                curr.push({ text: str, style: { textColor: 0xffffff } });
            }
        }
        return curr;
    }

    public onCheckChatRedPoint(): boolean {
        if (this.onCheckChatRedPointByType(CHANNEL.GUILD)) return true;
        if (this.onCheckChatRedPointByType(CHANNEL.WHISPER)) return true;
        return false;
    }

    public onCheckPrivateChatRedPoint(): boolean {
        // if (this.onCheckChatRedPointByType(CHANNEL.WHISPER)) return true;
        var datas = DataManager.getInstance().friendManager.getRecentContacts();
        for (var key in datas) {
            if (datas[key].order > 0) {
                return true;
            }
        }
        return false;
    }

    public onCheckChatRedPointByType(type: number): boolean {
        var ret: boolean = false;
        switch (type) {
            case CHANNEL.GUILD:
                ret = this.hasNewGuidTalk;
                break;
            case CHANNEL.WHISPER:
                ret = this.hasNewWhisperTalk;
                break;
        }
        return ret;
    }
    public getChatWH(chat: string, size: number): number[] {
        var ret: number[] = this.record[`${size}_${chat}`];
        if (!ret) {
            this.test.size = size;
            this.test.fontFamily = "SimHei";
            this.test.text = chat;
            ret = [this.test.textWidth, this.test.textHeight];
        }
        return ret;
    }
    //The end
}