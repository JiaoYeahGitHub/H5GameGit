// TypeScript file
class ArenaManager {
    public arenaData: ArenaData;
    public ladderArenaData: LadderAreneData;
    public ladderRanks: LadderRankData[];
    public selfladderRankData: LadderRankData;
    public isWorship: boolean;

    public constructor() {
        this.ladderArenaData = new LadderAreneData();
        this.arenaData = new ArenaData();
        this.ladderRanks = [];
    }
    //解析天梯竞技场的消息
    public parseLadderAreneMsg(msg: Message): void {
        this.ladderArenaData.parseInitMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**购买鼓舞返回**/
    public parseInspire(msg: Message): void {
        this.ladderArenaData.inspireCount = msg.getByte();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**天梯购买更新**/
    public parseLadderBuyMsg(msg: Message): void {
        this.ladderArenaData.fightCount = msg.getInt();
        this.ladderArenaData.leftRelive = msg.getInt();
        this.ladderArenaData.buyCount = msg.getInt();
        GameCommon.getInstance().receiveMsgToClient(new Message(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE));
    }
    /**天梯排行榜更新**/
    public parseLadderRankUpdate(msg: Message): void {
        if (this.ladderRanks.length > 0) {
            for (var i: number = this.ladderRanks.length - 1; i >= 0; i--) {
                this.ladderRanks[i] = null;
                this.ladderRanks.splice(i, 1);
            }
        }
        var rankSize: number = msg.getByte();
        for (var i: number = 0; i < rankSize; i++) {
            var ladderRankData: LadderRankData = new LadderRankData();
            ladderRankData.parseRankMsg(msg);
            this.ladderRanks.push(ladderRankData);
        }
        if (this.ladderRanks.length > 0) {
            this.selfladderRankData = this.ladderRanks.shift();
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**竞技场初始化**/
    public parseArenaMsg(msg: Message): void {
        this.arenaData.parseMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**竞技场位置刷新**/
    public parseArenaEnemyMsg(msg: Message): void {
        this.arenaData.parseEnmeyMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //竞技场购买
    public parseArenaBuyMsg(msg: Message): void {
        this.arenaData.fightCount = msg.getInt();
        this.arenaData.buyCount = msg.getInt();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**竞技场通过排名获得当前排名奖励**/
    // public getRankAwards(rankNum: number): AwardItem[] {
    //     for (var i: number = 0; i < ModelManager.getInstance().modelArenaAward.length; i++) {
    //         var arenaReward: ModelArenaAward = ModelManager.getInstance().modelArenaAward[i];
    //         if (arenaReward.highRank >= rankNum) {
    //             return arenaReward.reward;
    //         }
    //     }
    //     return [];
    // }
    public onSendLadderInfoMsg(): void {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_ARENA)) {
            return;
        }
        var arenaInitMsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaInitMsg);
    }

    public onSendLocalArenaInfoMsg(): void {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_ARENA)) return;
        var arenaInfoUpdateMsg: Message = new Message(MESSAGE_ID.ARENE_INFO_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaInfoUpdateMsg);
    }

    public onSendServerArenaInfoMsg(): void {
        var arenaInfoUpdateMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_INFO_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaInfoUpdateMsg);
    }

    public getLadderPointShow(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_LADDER)) return;
        if (DataManager.getInstance().arenaManager.ladderArenaData.ladderStatus != 0) return false;
        if (FunDefine.isFunOpen(FUN_TYPE.FUN_LADDER) && this.ladderArenaData.fightCount > 0) return true;
        return false;
    }
    //The end
}