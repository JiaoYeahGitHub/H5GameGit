class BodyData {
    public modelid;//模版id
    public name: string;
    public bodyType: BODY_TYPE;
    public model: Modelfighter;
    public skills: Array<SkillInfo>;
    public attributes: number[];//属性列表 顺序在FightDefine中
    public skillStampTime: number;//上次技能使用时间戳
    public targets: Array<ActionBody>;//攻击列表 第一个是当前攻击目标
    public figthPower: number = 0;
    protected _level: number;
    //特殊属性
    public isStop: boolean;//停止行动
    protected use_mabi: number;//使用麻痹(时间)
    protected hit_mabi: number;//中麻痹的(时间)
    protected use_chenmo: number;//使用沉默(时间)
    protected hit_chenmo: number;//中沉默的(时间)
    public reborncount: number = 0;//复活次数
    public shieldValue: number = 0;//护盾数值
    public hasArtifactEft: boolean;//自定义的神器效果

    public constructor(id, type) {
        this.attributes = GameCommon.getInstance().getAttributeAry();
        this.targets = [];
        this.bufferInfoDict = {};
        this.updateData(id, type);
    }
    public updateData(id, type) {
        if (this.modelid != id) {
            this.modelid = id;
            this.bodyType = type;
            this.model = ModelManager.getInstance().getModelFigher(this.modelid);
            if (!this.model) {
                Tool.throwException("缺少fightter数据！::::" + this.modelid);
            }
            if (this.skills) {
                for (var i: number = this.skills.length - 1; i >= 0; i--) {
                    var _skillInfo: SkillInfo = this.skills[i];
                    _skillInfo = null;
                    this.skills.splice(i, 1);
                }
            } else {
                this.skills = [];
            }
            var _skillParams: string[] = this.model.skill.split(",");
            for (var i: number = 0; i < _skillParams.length; i++) {
                var skillId: number = parseInt(_skillParams[i]);
                if (skillId) {
                    var _skillInfo: SkillInfo = new SkillInfo(skillId, i);
                    this.skills.push(_skillInfo);
                }
            }
        }

        this.onRefreshProp();
        this.onRebirth();
    }
    //更新属性
    protected onRefreshProp(): void {
        this.figthPower = GameCommon.calculationFighting(this.attributes);
    }
    private _maxHp: number;//最大血量值
    public get maxHp(): number {
        return this._maxHp;
    }
    private _currentHp: number;//当前血量
    public get currentHp(): number {
        return this._currentHp;
    }
    //是否已死亡
    public get isDie(): boolean {
        return this._currentHp <= 0;
    }
    //重生
    public onRebirth(): void {
        if (this._useSkill) {
            this._useSkill = null;
        }
        this.onRestHpInfo(this.attributes[ATTR_TYPE.HP], this.attributes[ATTR_TYPE.HP]);

        this._deathCount = -1;
        this.hit_mabi = 0;
        this.hit_chenmo = 0;
        if (!this.hasArtifactEft) {
            this.refreshRebornEft();
            this.refreshShieldEft();
        }
    }
    //设置成几刀砍死模式
    private _deathCount: number = -1;//几刀死 大于0生效;
    public get deathCount(): number {
        return this._deathCount;
    }
    public set deathCount(value) {
        this._deathCount = value;
    }
    //动态的赋值生物血量信息
    public onRestHpInfo(hp, maxhp = 0): void {
        if (maxhp > 0) {
            this._maxHp = maxhp;
        }
        if (!Tool.isNumber(hp)) {
            hp = 0;
        }
        this._currentHp = Math.min(this._maxHp, Math.max(hp, 0));
    }
    /**技能相关**/
    //选出一个技能
    protected _useSkill: SkillInfo;
    public getCanUseSkill(): SkillInfo {
        if (this.isUseingSkill) {//计算上一个特效有没有播放完
            return null;
        }
        if (this.isHitChenMo) {
            this._useSkill = this.getSkillInfoById(SkillDefine.COMMON_SKILL_ID);
        }
        if (this._useSkill) {
            return this._useSkill;
        }
        for (var i: number = 0; i < this.skills.length; i++) {
            var _skillInfo: SkillInfo = this.skills[i];
            if (_skillInfo.level > 0 && !_skillInfo.isSkillCD) {
                this._useSkill = _skillInfo;
                return this._useSkill;
            }
        }
    }
    //重置技能状态
    public onReleaseSkill(): void {
        if (this._useSkill) {
            this.skillStampTime = egret.getTimer() + this._useSkill.model.castTime;
            this._useSkill.usestart();
            this._useSkill = null;
            this._attackCount++;
        }
    }
    //正在使用的技能
    public get useSkill(): SkillInfo {
        return this._useSkill;
    }
    //指定释放一个技能
    public set useSkill(skill: SkillInfo) {
        this._useSkill = skill;
    }
    //判断技能是否施法中
    public get isUseingSkill(): boolean {
        var intervalTime: number = this.skillStampTime - egret.getTimer();
        return (intervalTime > 0 && intervalTime < 5000);
    }
    //根据技能ID找到info
    public getSkillInfoById(id: number): SkillInfo {
        for (var i: number = 0; i < this.skills.length; i++) {
            if (id == this.skills[i].id) {
                return this.skills[i];
            }
        }
        return null;
    }
    //人物的技能顺序标识
    protected _startRandomIdx: number;//攻击随机值起始序列
    protected _relseSkillCount: number;//使用技能次数
    protected _attackCount: number;//攻击了几次
    protected _skillStartIdx: number;//技能起始节点
    //恢复所有技能cd 
    protected resetAllSkillCD(randomIdx: number): void {//isClear: boolean = true
        for (var i: number = 0; i < this.skills.length; i++) {
            var _skillInfo: SkillInfo = this.skills[i];
            _skillInfo.reset();
            //是清除CD 还是 全部CD中
            // if (isClear) {
            //     _skillInfo.reset();
            // }
            // else {
            //     _skillInfo.usestart();
            // }
        }
        this.skillStampTime = 0;
        this._useSkill = null;
        this.use_mabi = 0;
        this.use_chenmo = 0;
        this._attackCount = 0;
        this._relseSkillCount = 0;
        this._startRandomIdx = Math.max(0, randomIdx);
        this.onResetSkillStartIdx();
    }
    protected onResetSkillStartIdx() {
    }
    //返回随机数
    public get randomValue(): number {
        if (!Tool.isNumber(this._startRandomIdx)) {
            return -1;
        }
        let randomArray: number[] = RandomDefine.FIGHT_RANDOM[GameFight.getInstance().fight_randomIndex];
        return randomArray[this.radomIndex % randomArray.length];
    }
    public get radomIndex(): number {
        return this._startRandomIdx + this._attackCount - 1;
    }
    //判断是否中了麻痹
    public get isHitMaBi(): boolean {
        return this.hit_mabi >= egret.getTimer();
    }
    //判断是否中了沉默
    public get isHitChenMo(): boolean {
        return this.hit_chenmo >= egret.getTimer();
    }
    //麻痹生成
    public get mabiEffect(): number {
        return 0;
    }
    //麻痹概率
    public get mabiRatio(): number {
        return 0;
    }
    //中了麻痹
    public onHitMaBi(efttime: number): void {
        this.hit_mabi = egret.getTimer() + efttime;
    }
    //沉默生成
    public get chenmoEffect(): number {
        return 0;
    }
    //沉默概率
    public get chenmoRatio(): number {
        return 0;
    }
    //中了沉默
    public onHitChenMo(efttime: number): void {
        this.hit_chenmo = egret.getTimer() + efttime;
        this._useSkill = this.getSkillInfoById(SkillDefine.COMMON_SKILL_ID);
    }
    //刷新复活次数
    public refreshRebornEft(): void {
        this.reborncount = 0;
    }
    //使用复活效果
    public onRebornEffect(): void {
        if (this.reborncount > 0) {
            this.reborncount--;
            this.hit_mabi = 0;
            this.hit_chenmo = 0;
            let rebornHp: number = Tool.toInt(this.maxHp * this.rebornEffect / GameDefine.GAME_ADD_RATIO);
            this.onRestHpInfo(rebornHp);
        }
    }
    //复活效果
    public get rebornEffect(): number {
        return 0;
    }
    //刷新护盾效果
    public refreshShieldEft(): void {
        this.shieldValue = 0;
    }
    //护盾效果
    public get shieldEffect(): number {
        return 0;
    }
    //破甲效果
    public get pojiaEffect(): number {
        return 0;
    }
    /** BUFF相关 **/
    public bufferInfoDict;
    //添加一个BUFF
    public addBuffer(buffid: number, level: number): void {
        if (buffid > 0) {
            this.removeBuffer(buffid);
            this.bufferInfoDict[buffid] = new BuffInfo(buffid, level);
        }
    }
    //移除一个BUFF
    public removeBuffer(buffid): void {
        if (this.bufferInfoDict[buffid]) {
            this.bufferInfoDict[buffid] = null;
            delete this.bufferInfoDict[buffid];
        }
    }
    //当前BUFF带来的总属性收益 isAll是不是要取BUFF+自身属性总和
    public get currentAttributes(): number[] {
        let currAttrAry: number[] = GameCommon.getInstance().getAttributeAry();
        //基础属性
        for (let n: number = 0; n < this.attributes.length; n++) {
            let attrValue: number = this.attributes[n];
            if (attrValue > 0) {
                currAttrAry[n] += attrValue;
            }
        }
        //特殊场景的BUFF
        if (GameFight.getInstance().onCheckBodyIsHero(this)) {
            //帮会属性加成
            let unionCheerNum: number = GameFight.getInstance().unionCheerNum;
            if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.LODDER_ARENA) {//天梯竞技场加成
                let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
                if (ladderData.inspireCount > 0) {
                    let ladderEffect: number = FightDefine.ladderBuffEffect[ladderData.inspireCount - 1];
                    currAttrAry[ATTR_TYPE.ATTACK] = Math.floor(currAttrAry[ATTR_TYPE.ATTACK] * (100 + ladderEffect) / 100);
                }
            } else if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.DIFU_DUP) {//地府加成
                let xuezhaninfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
                for (let i: number = 0; i < xuezhaninfo.attrAddRates.length; i++) {
                    let addRateVaule: number = xuezhaninfo.attrAddRates[i];
                    if (addRateVaule <= 0) continue;
                    if (i > ATTR_TYPE.MAGICDEF) {
                        currAttrAry[i] += addRateVaule;
                    } else {
                        currAttrAry[i] = Tool.toInt(currAttrAry[i] * (100 + addRateVaule) / 100);
                    }
                }
            } else if (unionCheerNum > 0) {
                let addRate: number = DataManager.getInstance().unionManager.getCheerAttrAddRate(unionCheerNum);
                currAttrAry[ATTR_TYPE.ATTACK] = Math.floor(currAttrAry[ATTR_TYPE.ATTACK] * (100 + addRate) / 100)
            }
        }
        //BUFF相关
        for (let buffId in this.bufferInfoDict) {
            let buffInfo: BuffInfo = this.bufferInfoDict[buffId];
            for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
                let buff_add_value: number = buffInfo.attributes[i];
                if (buff_add_value) {
                    currAttrAry[i] += buff_add_value;
                }
            }
            for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
                let buff_add_rate: number = buffInfo.attributes[ATTR_TYPE.SIZE + i];
                if (buff_add_rate) {
                    currAttrAry[i] = Tool.toInt(currAttrAry[i] * (buff_add_rate + GameDefine.GAME_ADD_RATIO) / GameDefine.GAME_ADD_RATIO);
                }
            }
        }

        return currAttrAry;
    }
    /**---------BUFF结束---------**/
    public set level(level: number) {
        this._level = level;
    }
    public get level(): number {
        return this._level;
    }
    //The end
}
