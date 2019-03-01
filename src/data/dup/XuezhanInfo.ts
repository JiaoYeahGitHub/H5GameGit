// TypeScript file
class XuezhanInfo {
    public reviveNum: number;//可进入次数
    public xuezhanWaveNum: number;//当前关卡数
    public layerStars: number[];//每一小关的过关星数 一层3关
    public hasBuffIDs: number[];//拥有的BUFF列表
    public attrAddRates: number[];
    public selectbuffList: number[];
    public isRewardBox: boolean;
    public isSelectBuff: boolean;
    public xuezhanStar: number;//当前拥有星星数
    public addStar: number;//本次增加星星
    private isInit: boolean;

    public constructor() {
    }

    public onParseXuezhanInitMsg(msg: Message): void {
        this.addStar = 0;
        this.isInit = true;
        this.layerStars = [];
        this.hasBuffIDs = [];
        this.selectbuffList = [0, 0, 0];
        this.attrAddRates = GameCommon.getInstance().getAttributeAry();
        this.xuezhanWaveNum = msg.getShort();
        this.xuezhanStar = msg.getShort();
        this.reviveNum = msg.getByte();
        this.isRewardBox = msg.getBoolean();
        this.isSelectBuff = msg.getBoolean();
        if (this.isSelectBuff) {
            for (var i: number = 0; i < this.selectbuffList.length; i++) {
                this.selectbuffList[i] = msg.getByte();
            }
        }
        var buffSize: number = msg.getShort();
        for (var i: number = 0; i < buffSize; i++) {
            var buffId: number = msg.getByte();
            this.addXuezhanBuff(buffId);
        }
        var recordSize: number = msg.getShort();
        for (var i: number = 0; i < recordSize; i++) {
            var currWaveStarnum: number = msg.getByte();
            this.layerStars[i] = currWaveStarnum;
        }
    }
    //增加BUFFid
    public addXuezhanBuff(buffId: number): void {
        this.hasBuffIDs.push(buffId);
        var buffModel: Modeldifubuff = JsonModelManager.instance.getModeldifubuff()[buffId];
        if (buffModel) {
            var attrobj: string[] = String(buffModel.effect).split(",");
            var attrType: number = parseInt(attrobj[0]);
            var attrValue: number = parseInt(attrobj[1]);
            this.attrAddRates[attrType] += attrValue;
        }
    }
    public cleanBUff():void{
        this.attrAddRates = GameCommon.getInstance().getAttributeAry();
    }
    //血战战斗成功 参数新的总星数
    public onXuezhanSuccess(wavenum: number, starnum: number): void {
        if (!this.isInit)
            return;
        var getstarNum: number = starnum - this.xuezhanStar;
        if (getstarNum > 0) {
            var layerOldStar: number = this.layerStars.length >= this.xuezhanWaveNum ? this.layerStars[this.xuezhanWaveNum - 1] : 0;
            if (layerOldStar < getstarNum)
                this.layerStars[this.xuezhanWaveNum - 1] = getstarNum;
        }
        this.addStar = starnum - this.xuezhanStar;
        this.xuezhanStar = starnum;
        this.xuezhanWaveNum = wavenum;
    }
    //血战战斗成功 参数新的总星数
    public onChallengeNum(wavenum: number, starnum: number, challengeNum, isRewardBox: boolean, isSelectBuff: boolean): void {
        if (!this.isInit)
            return;
        var getstarNum: number = starnum - this.xuezhanStar;
        if (getstarNum > 0) {
            var layerOldStar: number = this.layerStars.length >= this.xuezhanWaveNum ? this.layerStars[this.xuezhanWaveNum - 1] : 0;
            if (layerOldStar < getstarNum)
                this.layerStars[this.xuezhanWaveNum - 1] = getstarNum;
        }
        this.isRewardBox = isRewardBox;
        this.isSelectBuff = isSelectBuff;
        this.addStar = starnum - this.xuezhanStar;
        this.xuezhanStar = starnum;
        this.xuezhanWaveNum = wavenum;
        this.reviveNum = challengeNum;
    }
    //血战战斗成功 参数新的总星数
    public onChangeInfo(msg: Message): void {
        let wavenum: number = msg.getShort();
        var starnum: number = msg.getShort();
        var getstarNum: number = starnum - this.xuezhanStar;
        if (getstarNum > 0) {
            var layerOldStar: number = this.layerStars.length >= this.xuezhanWaveNum ? this.layerStars[this.xuezhanWaveNum - 1] : 0;
            if (layerOldStar < getstarNum)
                this.layerStars[this.xuezhanWaveNum - 1] = getstarNum;
        }
        this.xuezhanWaveNum = wavenum;

        this.addStar = getstarNum;
        this.xuezhanStar = starnum;
        this.reviveNum = msg.getByte();
        this.isRewardBox = msg.getBoolean();
        this.isSelectBuff = msg.getBoolean();
        if (this.isSelectBuff) {
            for (var i: number = 0; i < this.selectbuffList.length; i++) {
                this.selectbuffList[i] = msg.getByte();
            }
        }
    }
    //The end
}