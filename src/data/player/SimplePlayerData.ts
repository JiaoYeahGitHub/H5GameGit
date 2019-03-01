class SimplePlayerData {
    public id;//玩家id
    public name;//玩家名字
    public headindex;//玩家头像
    public headFrame;//玩家头像框
    public level;//玩家等级
    public viplevel;//玩家vip等级
    public _vipExp;//玩家VIP经验
    public fightvalue;//玩家战斗力
    public rebirthLv: number = 0;//转生等级
    public constructor() {
    }
    public parseMsg(msg: Message): void {
        this.id = msg.getInt();
        this.name = msg.getString();
        this.headindex = msg.getByte();
        this.headFrame = msg.getByte();
        let zhuanId = msg.getShort();
        var zsCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[zhuanId];
        this.rebirthLv = zsCfg ? zsCfg.zhuansheng : 0;
        this.level = msg.getShort();
        this.vipExp = msg.getInt();
        this.fightvalue = msg.getLong();
    }
    public set vipExp(param: number) {
        this._vipExp = param;
        this.viplevel = GameCommon.getInstance().getVipLevel(param);
    }
    public get vipExp() {
        return this._vipExp;
    }
    /**获取等级描述**/
    public get playerLevelDesc(): string {
        return (this.rebirthLv > 0 ? Language.instance.getText(`coatard_level${this.rebirthLv}`) : "") + this.level + Language.instance.getText("level");
    }
}
class BaseSimPlayerData {
    public playerId: number;
    public name: string;
    public headindex: number;
    public headFrame;//玩家头像框
    public coatardlv: number;
    public level: number;

    public parseMsg(msg: Message): void {
        this.playerId = msg.getInt();
        this.name = msg.getString();
        this.headindex = msg.getByte();
        this.headFrame = msg.getByte();
        let zhuanId = msg.getShort();
        var zsCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[zhuanId];
        this.coatardlv = zsCfg ? zsCfg.zhuansheng : 0;;
        this.level = msg.getShort();
    }
}

//外形结构体
class PlayerAppears {
    public appears: AppearPlayerData[];//外形结构
    public petGrade: number = 0;//宠物阶数
    public constructor() {
    }
    public parseMsg(msg: Message): void {
        this.petGrade = msg.getByte();
        this.appears = [];
        var heroSize: number = msg.getByte();
        for (var i: number = 0; i < heroSize; i++) {
            var appearData: AppearPlayerData = new AppearPlayerData();
            appearData.parseMsg(msg);
            this.appears.push(appearData);
        }
    }
}
class AppearPlayerData {
    public occupation: number;//职业
    public sex: SEX_TYPE;//性别
    public titleId: number = 0;//称号
    public appears: number[];//外形列表

    public constructor() {
        this.appears = [];
    }

    public parseMsg(msg: Message): void {
        this.occupation = msg.getByte();
        this.sex = msg.getByte();
        this.titleId = msg.getByte();
        let blessdatas: number[] = [];
        for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
            let blessgrade: number = msg.getByte();
            blessdatas[i] = blessdatas[blessgrade];
        }
        for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
            let fashionId: number = msg.getByte();
            if (blessdatas[i] > 0) {
                if (fashionId > 0) {
                    let modelfashion: Modelfashion = JsonModelManager.instance.getModelfashion()[fashionId];
                    if (modelfashion) {
                        this.appears[i] = modelfashion.waixing1;
                    }
                } else {
                    this.appears[i] = 0;
                }
            } else {
                this.appears[i] = GameDefine.PLAYER_DEFUALT_AVATAR[i];
            }
        }
    }
    //The end
}
//其他玩家的战斗数据
class OtherFightData {
    public playerId: number;
    public level: number;
    public reinLv: number;//转生等级
    public duanLv: number;//段
    public playerName: string;
    public headIndex: number;
    public headFrame;//玩家头像框
    private _ohterAppears: PlayerAppears;
    public constructor() {
        this._ohterAppears = new PlayerAppears();
    }
    public parseYewaiPVPMsg(msg: Message): void {
        this.playerId = msg.getInt();
        this.playerName = msg.getString();
        this.headIndex = msg.getByte();
        this.headFrame = msg.getByte();
        let zhuanId = msg.getShort();
        var zsCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[zhuanId];
        this.reinLv = zsCfg ? zsCfg.zhuansheng : 0;
        this.duanLv = zsCfg ? zsCfg.duanwei : 0;
        this.level = msg.getShort();
        this.parseAppears(msg);
    }
    public get appears(): AppearPlayerData[] {
        return this._ohterAppears.appears;
    }
    public parseAppears(msg: Message): void {
        if (this.playerId != -1)
            this._ohterAppears.parseMsg(msg);
    }
    //The end
}
//战斗排行数据结构
class SimpleFightRankData {
    public playerId: number;
    public rank: number;
    public playerName: string;
    public vipLevel: number;
    public damageValue: number;
    public onParseMsg(msg: Message, rankNum: number): void {
        this.rank = rankNum;
        this.playerId = msg.getInt();
        this.playerName = msg.getString();
        this.damageValue = msg.getLong();
        this.vipLevel = msg.getByte();
    }
}
//玩家心法数据结构
class PlayerXinfaData {
    public id: number;
    public level: number;
    public constructor(id: number) {
        this.id = id;
    }
    public get model(): Modeltujian2 {
        return JsonModelManager.instance.getModeltujian2()[this.id];
    }
    //The end
}