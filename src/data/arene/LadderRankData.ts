// TypeScript file
class LadderRankData extends SimplePlayerData {
    public rank;//玩家排名
    public score;//排位星级

    public constructor() {
        super();
    }

    public parseRankMsg(msg: Message): void {
        super.parseMsg(msg);
        this.rank = msg.getInt();
        this.score = msg.getInt();
    }

    public get duanwei() {
        let laddermodels = JsonModelManager.instance.getModelttre();
        let model: Modelttre;
        let i = 0;
        for (var key in laddermodels) {
            i++;
            model = laddermodels[key];
            if (this.score < model.maxjifen) {
                return i;
            }
        }

        if (model) {
            return i;
        } else {
            return 1;
        }
    }
    //The end
}