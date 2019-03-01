// TypeScript file
class DupInfo {
    public type;//副本类型
    public subtype;//副本子ID
    public attacknum = 0;
    public sweepNum = 0;//已扫荡过多少次
    public awardIndex: number = 0;//领奖进度
    public pass: number = 0;//进度第几个关卡索引
    public diffcult: number = 0;//难度
    public personDupPassRecord: number;
    public cailiaoPassRecord: number;//材料本挑战记录
    public teamPassRecord: number = 0;//组队本挑战记录
    private _id: number;
    private _model: Modelcopy;
    private _models: Modelcopy[];
    public blessPassRecord: number = 0;//祝福值本挑战到多少关
    public constructor(duptype, subtype) {
        this._models = [];
        this.type = duptype;
        this.subtype = subtype;
        this.onUpdate();
    }
    /**更新当前副本类型对应的ID**/
    public onUpdate(): void {
        this._models = [];
        this.diffcult = 0;
        let copyDict = JsonModelManager.instance.getModelcopy();
        let player: Player = DataManager.getInstance().playerManager.player;
        if (this.type == DUP_TYPE.DUP_PERSONALLY) {
            if (!this._id) {
                this._id = DUP_TYPE.DUP_PERSONALLY;
                this._model = copyDict[this._id];
            }
        } else {
            for (let dupId in copyDict) {
                let model: Modelcopy = copyDict[dupId];
                if (this.type == model.type && this.subtype == model.subType) {
                    this._models.push(model);
                }
            }
            this._models.sort(function (n1, n2) {
                if (n1.lvlimit < n2.lvlimit) {
                    return -1;
                }
                return 1;
            });
            this._id = null;
            for (let dupId in this._models) {
                let model: Modelcopy = this._models[dupId];
                if (!Tool.isNumber(this._id)) {
                    this._id = model.id;
                    if (!this.getOpenCondition()) {
                        this.diffcult++;
                    }
                    continue;
                }
                if (player.coatardLv < model.lvlimit) {
                    break;
                }
                this._id = model.id;
                this.diffcult++;
            }
            this._model = copyDict[this._id];
        }
    }
    /**解析副本挑战次数 和 扫荡次数**/
    public parseDupinfoMsg(msg: Message): void {
        this.attacknum = msg.getByte();
        this.sweepNum = msg.getByte();
    }
    //更新副本领奖进度
    public parseAwardIndex(msg: Message): void {
        if (this.type == DUP_TYPE.DUP_SIXIANG) {
            this.awardIndex = msg.getShort();
        } else if (this.type == DUP_TYPE.DUP_ZHUFU) {
            this.blessPassRecord = msg.getShort();// 打过了多少关
            this.awardIndex = msg.getShort();// 领奖到多少关
        }
    }
    //更新个人通关记录
    public updatePersonRe(record: number): void {
        this.personDupPassRecord = record;
    }
    public upDateCaiLiaoRe(record: number): void {
        this.cailiaoPassRecord = record;
    }
    public upDateTeamRe(record: number): void {
        this.teamPassRecord = record;
    }
    //获取副本的剩余挑战次数
    public get lefttimes(): number {
        return Math.max(0, this.totalTimes - this.attacknum);
    }
    //获取副本总进入次数
    public get totalTimes(): number {
        var dupTimesParams: string[] = this._model.nums.split(";");
        var _entertimes: number = 1;
        switch (this.type) {
            case DUP_TYPE.DUP_CAILIAO:
                _entertimes = parseInt(dupTimesParams[DataManager.getInstance().playerManager.player.viplevel].split(",")[0]);
                _entertimes = !_entertimes ? 0 : (_entertimes < 0 ? 99999 : _entertimes);
                break;
            case DUP_TYPE.DUP_SIXIANG:
                var base: cardData = DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG];
                if (base && base.param > 0) {
                    _entertimes += MonthCardManager.getTeQuan(CARD_TYPE.LIFELONG, TEQUAN_TYPE.SIXIANG);
                }
                break;
            case DUP_TYPE.DUP_ZHUFU:
                var base: cardData = DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG];
                if (base && base.param > 0) {
                    _entertimes += MonthCardManager.getTeQuan(CARD_TYPE.LIFELONG, TEQUAN_TYPE.ZHUFU);
                }
                break;
            case DUP_TYPE.DUP_VIP_TEAM:
                break;
            default:
                _entertimes = parseInt(dupTimesParams[DataManager.getInstance().playerManager.player.viplevel].split(",")[0]);
                _entertimes = !_entertimes ? 0 : (_entertimes < 0 ? 99999 : _entertimes);
                break;

        }
        return _entertimes;
    }
    //获取副本的剩余扫荡次数
    public get leftSweepNum(): number {
        return Math.max(0, this.totalSweepNum - this.sweepNum);
    }
    //获取副本的扫荡次数
    public get totalSweepNum(): number {
        var duptimesAry: string[] = this._model.nums.split(";");
        var dupSweepTimes: number = parseInt(duptimesAry[DataManager.getInstance().playerManager.player.viplevel].split(",")[1]);
        return !dupSweepTimes ? 0 : (dupSweepTimes < 0 ? 99999 : dupSweepTimes);
    }
    //副本数据结构
    public get dupModel(): Modelcopy {
        return this._model;
    }
    //下一个副本数据
    public get nextModel(): Modelcopy {
        return this._models[this.diffcult];
    }
    //副本ID
    public get id(): number {
        return this._id;
    }
    //个人副本的数据
    public get gerenModel(): Modelgerenboss {
        if (this.type == DUP_TYPE.DUP_PERSONALLY) {
            return JsonModelManager.instance.getModelgerenboss()[this.subtype];
        }
        return null;
    }
    //检查副本等级 VIP等级限制
    public onCheckLimit(): boolean {
        let condition: string = this.getOpenCondition();
        if (condition) {
            GameCommon.getInstance().addAlert(condition);
            return true;
        }
        return false;
    }
    //开启等级
    public getOpenCondition(): string {
        let funId: number = 0;
        let key: string = this.type + "_" + this.subtype;
        switch (key) {
            case DUP_TYPE.DUP_CAILIAO + "_1":
                funId = FUN_TYPE.FUN_BAOSHIFUBEN;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_2":
                funId = FUN_TYPE.FUN_JINGMAIFUBEN;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_3":
                funId = FUN_TYPE.FUN_CHONGFUBEN;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_5":
                funId = FUN_TYPE.FUN_CUILIANFUBEN;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_6":
                funId = FUN_TYPE.FUN_RNUES_DUP;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_9":
                funId = FUN_TYPE.FUN_TIANSHU_LEVEL_DUP;
                break;
            case DUP_TYPE.DUP_CAILIAO + "_10":
                funId = FUN_TYPE.FUN_XIANLV_EQUIP_DUP;
                break;
            case DUP_TYPE.DUP_TEAM + "_1":
                funId = FUN_TYPE.FUN_DUP_ZUDUI;
                break;
        }
        let funlvmodel: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[funId];
        if (!FunDefine.isFunOpen(funId)) {
            return FunDefine.getFunOpenDesc(funId);
        }
        return "";
    }
    //End end
}
enum DUP_DIFFICULT {
    NORMAL = 1,
    HARD = 2,
    BEST = 3,
}