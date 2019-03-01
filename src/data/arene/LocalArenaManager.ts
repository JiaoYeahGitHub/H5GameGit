// TypeScript file
class LocalArenaManager {
    public localArenaData: LocalArenaData;
    public constructor() {
        this.localArenaData = new LocalArenaData();
    }

    /**竞技场初始化**/
    public parseArenaMsg(msg: Message): void {
        this.localArenaData.parseMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**竞技场位置刷新**/
    public parseArenaEnemyMsg(msg: Message): void {
        this.localArenaData.parseEnmeyMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //竞技场购买
    public parseArenaBuyMsg(msg: Message): void {
        this.localArenaData.fightCount = msg.getInt();
        this.localArenaData.buyCount = msg.getInt();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //竞技场扫荡剩余挑战次数
    public parseArenaFightMsg(msg: Message): void {
        this.localArenaData.fightCount = msg.getInt();
        // var itemType = msg.getByte();
        // var itemId = msg.getShort();
        // var itemQuality = msg.getByte();
        // var itemNum = msg.getInt();
        // var ModelThing = GameCommon.getInstance().getThingModel(itemType, itemId, itemQuality);
        // GameCommon.getInstance().onGetThingAlert(ModelThing, itemNum,GOODS_CHANGE_TYPE.LADDER_FIGHT_REWARD);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //更新首次排名奖励
    public parseFirstAwardMsg(msg: Message): void {
        this.localArenaData.rankReward = msg.getInt();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public getRedPointShow(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_ARENA)) return false;
        if (this.localArenaData.fightCount > 0) return true;
        return false;
    }
    private getRedArenaFirstAwd(): boolean {
        if (this.localArenaData) {
            let modelDict = JsonModelManager.instance.getModelarenaReward();
            for (let idx in modelDict) {
                let model: ModelarenaReward = modelDict[idx];
                if (this.localArenaData.rank < model.rank && (this.localArenaData.rankReward <= 0 || this.localArenaData.rankReward > model.rank)) {
                    return true;
                }
            }
        }
        return false;
    }

    public getRankAwards(rank: number): AwardItem[] {
        var models = JsonModelManager.instance.getModelarenaRankReward();
        var model: ModelarenaRankReward;
        for (var key in models) {
            model = models[key];
            if (model.highRank >= rank && model.lowRank <= rank) {
                break;
            }
        }
        if (model) {
            return GameCommon.getInstance().onParseAwardItemstr(model.rate);
        } else {
            return null;
        }
    }
    //The end
}