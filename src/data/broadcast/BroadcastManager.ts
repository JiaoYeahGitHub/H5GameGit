// TypeScript file
class BroadcastManager {
    private static TIPS_START: string = "[GameTips#";
    private static TIPS_END: string = "]";
    private static ARRAY_CAPACITY = 200;

    private _messageArray;
    public constructor() {
        this._messageArray = {};
    }
    public parseBroadcast(message: Message, channel: number): void {
        var broadcast: BroadcastBase = new BroadcastBase();
        broadcast.id = message.getByte();
        broadcast.channel = channel;
        switch (broadcast.channel) {
            case EBroadcastChannel.Player:
                broadcast.playerId = message.getInt();
                broadcast.name = message.getString();
                broadcast.vipExp = message.getInt();
                broadcast.occpcution = message.getByte();
                break;
            case EBroadcastChannel.System:
                break;
            default:
                break;
        }
        var param_size: number = message.getByte();
        for (var i = 0; i < param_size; i++) {
            var _paramItem: string = message.getString();
            //替换字符串
            if (_paramItem.slice(0, BroadcastManager.TIPS_START.length) == BroadcastManager.TIPS_START) {
                var endIndex = _paramItem.indexOf(BroadcastManager.TIPS_END);
                var id: string = _paramItem.substr(BroadcastManager.TIPS_START.length, endIndex - BroadcastManager.TIPS_START.length);
                var model: Modeltips = JsonModelManager.instance.getModeltips()[id]; 
                _paramItem = model.desc;
            }
            broadcast.messageParams.push(_paramItem);
        }
        broadcast.str = BroadcastModel.getBroadcastStr(broadcast);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SYSTEM_CHAT_BROADCAST), broadcast);
        this.pushMessages(broadcast);
    }

    public pushMessages(broadcast: BroadcastBase) {
        var messageQueue = this._messageArray[broadcast.channel];
        if (!messageQueue) {
            messageQueue = [];
            this._messageArray[broadcast.channel] = messageQueue;
        }
        switch (broadcast.channel) {
            case EBroadcastChannel.System:
                messageQueue.unshift(broadcast);
                break;
            case EBroadcastChannel.Player:
                if (messageQueue.length <= BroadcastManager.ARRAY_CAPACITY) {
                    if (broadcast.id != EBroadcastId.Message_BossCall && broadcast.id != EBroadcastId.Message_BossKill)
                        messageQueue.push(broadcast);
                }
                break;
            default:
                egret.error("BroadcastManager.parseBroadcastList() failed. Unexpected msgType=" + broadcast.channel);
                break;
        }
        if (broadcast.id == EBroadcastId.Message_BossCall || broadcast.id == EBroadcastId.Message_BossKill) {//出现BOSS请求一下列表
            var worldbossInitMsg: Message = new Message(MESSAGE_ID.EXPLOREBOSS_BOSS_INIT);
            GameCommon.getInstance().sendMsgToServer(worldbossInitMsg);
        }
    }

    public getMessageArray(type: EBroadcastChannel): Array<BroadcastBase> {
        return this._messageArray[type];
    }
}



