/**
 * 押镖管理类
 */
class EscortManager {

    public panel: EscortPanel;
    //押镖数据
    public escort: EscortData;

    //用来记录所有的外形信息
    public record;

    //劫镖车队数据
    public robList: EscortRobData[] = [];
    public filter: EscortRobData[];

    public log: EscortRecordbase[] = [];

    public hasNewInfo: boolean = false;
    //收到数据的时间--超过一定时间才向服务器请求714
    public robListTime: number;
    public startTime;

    public robID: number;

    public revengeID: number;
    public revengeTime: number;

    public constructor() {
        this.escort = new EscortData();
        this.record = {};
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_ESCORT_DONE, this.onEscortDone, this);
    }
    public onEscortDone(e: egret.Event) {
        var base: EscortRobData = e.data;
        var index: number = this.getIndexByRobID(base.id);
        if (index != -1) {
            this.robList.splice(index, 1);
        }
    }
    public award: EscortAward;
    public parseAward(msg: Message) {
        this.award = new EscortAward();
        this.award.onParseMessage(msg);
    }
    public parseRecord(msg: Message) {
        this.log = [];
        var base: EscortRecordbase;
        var len: number = msg.getShort();
        for (var i: number = 0; i < len; i++) {
            base = new EscortRecordbase();
            base.parseInfo(msg);
            this.log.push(base);
        }
    }
    public parseRedPoint(msg: Message) {
        this.hasNewInfo = (0 == msg.getByte());
    }
    public parseReceiveAward(msg: Message) {
        this.award = null;
    }

    public getCountDown(): number {
        return this.escort.leftTime - Tool.toInt((egret.getTimer() - this.startTime) / 1000);
    }
    public setPanel(panel) {
        this.panel = panel;
    }
    public onCountDown() {
        var time: number = this.getCountDown();
        if (time > 0) {
            if (this.panel) {
                this.panel.onCountDown(time);
            }
        } else {
            Tool.removeTimer(this.onCountDown, this);
            this.onSendEscortDone();
        }
    }
    public onSendEscortDone(): void {
        var message = new Message(MESSAGE_ID.ESCORT_ESCORT_DONE);
        message.setByte(0);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    public onSendEscortAwardReceive(): void {
        var message = new Message(MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE);
        message.setByte(0);
        GameCommon.getInstance().sendMsgToServer(message);
    }


    public getRandomCar(): EscortRobData[] {
        var findNum: number = EscortData.MAX_SHOW_COUNT;
        this.filter = [];
        var data: EscortRobData[] = this.robList.concat();
        var len: number;
        var random: number;
        while (findNum > 0 && data.length != 0) {
            len = data.length;
            random = Math.floor(Math.random() * len);
            this.filter.push(data[random]);
            data.splice(random, 1);
            findNum--;
        }
        return this.filter;
    }
    //710--押镖详情
    public parseEscort(msg: Message) {
        this.escort.quality = msg.getByte();
        this.escort.count = msg.getShort();
        this.escort.leftTime = msg.getInt();
        this.escort.cargo = msg.getByte();
        this.escort.hurted = msg.getByte();
        // this.escort.hurtedList = msg.getString();
        this.escort.rob = msg.getShort();
        this.escort.refresh = msg.getShort();
        if (this.escort.cargo == 1) {
            this.startTime = egret.getTimer();
            Tool.addTimer(this.onCountDown, this);
        }
    }

    //711--镖车押运
    public parseDispatchMsg(msg: Message) {
        this.escort.quality = msg.getByte();
        this.escort.count = msg.getShort();
        this.escort.leftTime = msg.getInt();
        this.escort.cargo = msg.getByte();
        this.escort.hurted = msg.getByte();
        // this.escort.hurtedList = msg.getString();
        if (this.escort.leftTime > 0 && this.escort.cargo == 1) {
            this.startTime = egret.getTimer();
            Tool.addTimer(this.onCountDown, this);
        }
    }

    //713--镖车刷品质
    public parseRefreshQualityMsg(msg: Message) {
        this.escort.quality = msg.getByte();
        this.escort.refresh = msg.getShort();
    }

    //714--劫镖车队列表
    public parseRobListMsg(msg: Message) {
        var i: number;
        this.robList = [];
        var data: EscortRobData;
        var len: number;
        var len: number = msg.getShort();
        for (i = 0; i < len; i++) {
            data = new EscortRobData();
            data.parseMsg(msg);
            this.robList.push(data);
            this.record[data.id] = data;
        }
    }
    public getIndexByRobID(RobID: number) {
        var index: number = -1;
        var base: EscortRobData;
        for (var i: number = 0; i < this.robList.length; i++) {
            base = this.robList[i];
            if (base.id == RobID) {
                index = i;
            }
        }
        return index;
    }
    public OnRobSomeOne(RobID: number) {
        // if (!base) return false;
        var index: number = -1;
        index = this.getIndexByRobID(RobID);
        if (index == -1) {
            return false;
        } else {
            if (this.robList[index].isbeRob) {
                return false;
            }
        }
        this.robList[index].isbeRob = true;
        this.robList.splice(index, 1);
        this.escort.rob += 1;
        return true;
    }
    //715--押镖一键完成
    public oneKeyDone() {
        Tool.removeTimer(this.onCountDown, this);
    }

    public onSendRobSomeBody(id: number): void {
        this.robID = id;
        var message = new Message(MESSAGE_ID.ESCORT_ROB_MESSAGE);
        message.setInt(id);
        GameCommon.getInstance().sendMsgToServer(message);
    }

    public onSendRevengeSomeBody(id: number, time: number): void {
        this.revengeID = id;
        this.revengeTime = time;
        var message = new Message(MESSAGE_ID.ESCORT_REVENGE_MESSAGE);
        message.setInt(id);
        message.setInt(Math.floor(time / 1000));
        GameCommon.getInstance().sendMsgToServer(message);
    }

    public getTextFlow(base: EscortRecordbase) {
        var arr: Array<egret.ITextElement> = new Array<egret.ITextElement>();
        switch (base.recordType) {
            case 1:
                arr.push({ text: "开始护送", style: { "textColor": 0xE9DEB3 } });
                arr.push({ text: `${GameDefine.EQUIP_QUALITE_NAME1[base.quality]}衣仙女`, style: { "textColor": GameCommon.getInstance().CreateNameColer(base.quality) } });
                break;
            case 2:
                arr.push({ text: base.name, style: { "textColor": 0xF7AE0E } });
                arr.push({ text: "抢夺我的", style: { "textColor": 0xE9DEB3 } });
                arr.push({ text: `${GameDefine.EQUIP_QUALITE_NAME1[base.quality]}衣仙女`, style: { "textColor": GameCommon.getInstance().CreateNameColer(base.quality) } });
                if (base.succeed == 1) {
                    arr.push({ text: " ", style: {} });
                    if (base.isDoneRevenge == 1) {
                        arr.push({ text: "已复仇", style: { "textColor": 0xe63232 } });
                    } else {
                        arr.push({ text: "复仇", style: { underline: true, href: "event:text event triggered", "textColor": 0x28e828 } });
                    }
                } else {
                    arr.push({ text: " ", style: {} });
                    arr.push({ text: "失败", style: { "textColor": 0xe63232 } });
                }
                break;
            case 3:
                arr.push({ text: "我抢夺了", style: { "textColor": 0xE9DEB3 } });
                arr.push({ text: base.name, style: { "textColor": 0xF7AE0E } });
                arr.push({ text: "仙女", style: { "textColor": 0xE9DEB3 } });
                if (base.succeed == 1) {
                    arr.push({ text: " ", style: {} });
                    arr.push({ text: "成功", style: { "textColor": 0x28e828 } });
                } else {
                    arr.push({ text: " ", style: {} });
                    arr.push({ text: "失败", style: { "textColor": 0xffffff } });
                }
                break;
        }
        return arr;
    }

    public getShowSysRedpoint() {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DUJIE)) return false;
        if (DataManager.getInstance().escortManager.getHasUnOpenLog()) return true;
        if (DataManager.getInstance().escortManager.getCanEscort()) return true;
        if (DataManager.getInstance().escortManager.getCanRobSomeBody()) return true;
        return false;
    }
    public getHasUnOpenLog() {
        return DataManager.getInstance().escortManager.hasNewInfo;
    }
    public getCanEscort() {
        if (DataManager.getInstance().escortManager.escort.count < EscortData.MAX_ESCORT_COUNT && DataManager.getInstance().escortManager.escort.cargo != 1) {
            return true;
        }
        return false;
    }
    public getCanRobSomeBody(): boolean {
        if (DataManager.getInstance().escortManager.escort.rob < EscortData.MAX_ROB_COUNT) return true;
        return false;
    }
    public getHasAwardReceive(): boolean {
        return DataManager.getInstance().escortManager.award != null;
    }

}
class EscortRecordbase {
    // byte   1--运镖开始 2--被劫 3--劫杀
    // byte    1--成功 0--失败
    // string   玩家名字
    // byte   镖车品质
    // long   时间
    // 最上面有个short  size
    public recordType;
    public succeed;
    public revengeID;
    public name;
    public quality;
    public time;
    public isRead = true;
    public headId;
    public headFrameId;
    public power;
    public isDoneRevenge;

    public parseInfo(msg: Message) {
        this.recordType = msg.getByte();
        this.succeed = msg.getByte();
        this.revengeID = msg.getInt();
        this.name = msg.getString();
        this.quality = msg.getByte();
        this.time = msg.getLong();
        this.headId = msg.getByte();
        this.headFrameId = msg.getByte();
        this.power = msg.getLong();
        this.isDoneRevenge = msg.getByte();
        // this.isRead = (msg.getByte() == 1);
    }
    public read() {
        this.isRead = true;
    }
}
class EscortAward {
    // 716   运镖完成   
    // byte   品质
    // int    金币
    // int    功勋
    // int    金莲之魂
    // byte  被劫日志长度
    // 循环读取：int    id
    // string   名字
    public quality: number;
    public money: number;
    public rongyu: number;
    public soulNum: number;
    public log: EscortRecordbase[];
    public onParseMessage(msg: Message): void {
        this.quality = msg.getByte();
        this.money = msg.getInt();
        this.rongyu = msg.getInt();
        this.soulNum = msg.getInt();
        var len: number = msg.getByte();
        this.log = [];
        var base: EscortRecordbase;
        for (var i: number = 0; i < len; i++) {
            base = new EscortRecordbase();
            base.parseInfo(msg);
            this.log.push(base);
        }
    }
}