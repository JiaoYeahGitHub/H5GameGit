class HallActivityManager {
    public constructor() {
    }
}

class VipBuyItem {
    public lv: number;
    public max: number;
    public parseMessage(msg: Message) {
        this.lv = msg.getByte();
        this.max = msg.getShort();
    }
}