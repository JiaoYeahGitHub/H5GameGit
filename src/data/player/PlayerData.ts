// TypeScript file
class PlayerData extends BodyData {
    public playerId: number = 0;//服务器ID
    public coatardLv: number = 0;//境界等级
    public rebirth: number = 0;//转生等级
    public sex: SEX_TYPE;//职业性别
    public index: number;//序号
    public headiconIdx: number;//头像
    public headFrame: number = 1;// 头像框
    private equipthings: EquipThing[];//对应位置见MASTER_EQUIP_TYPE
    private seniorEquips: EquipThing[];//高级装备位
    private goldEquips: EquipThing[]; //金装
    private equipSlotThings: EquipSlotThing[];//对应位置见MASTER_EQUIP_TYPE
    private dominateTings: DominateThing[];
    public fourinages: FourinageData[];//四象属性
    public psychThings: PsychBase[];//元神信息
    public fateThings: FateBase[];//命格信息
    public pulseLv: number;//经脉等级

    public skillEnhantDict;//技能附魔数据

    /**宠物阶段**/
    public petGrade: number = -1;
    /** 翅膀激活列表 */
    public fashionDatas;//激活时装数据
    public fashionWearIds;//穿戴时装的ID
    public fashionSkils;//时装技能

    /** 帮会技能列表 */
    // public unionSkillArray: Array<UnionSkill> = [];
    /** 帮会技能2列表 */
    public unionSkill2Array: Array<UnionSkill2> = [];
    /** 功法 */
    // public gongfas: GongfaBase[];
    /** 佩戴称号id */
    public titleId: number;
    /**祝福值信息**/
    public blessinfos: BlessData[];
    /** 祝福值装备 */
    public blessEquipDict;
    public blessEquipSlotDict;//祝福值装备槽位
    public blessSkillsDict;//祝福值的技能
    public blessWakeLevel: number[];// 祝福值觉醒等级
    /**初始化完成**/
    private _compInit: boolean = false;
    //外形数据 见 BLESS_TYPE 顺序
    protected _appears: number[];
    //龙魂
    public longhunAttribute: number[];
    //五行
    public wuxingLevel: number;
    //器魂
    public qihun: number;
    //图鉴
    public tujianDataDict;
    //神器
    public legendInfo;
    public fuling: number[];
    public yuanjie: number[];// 元戒
    public rnuesList: number[];
    public blessDanDict;//祝福值丹药
    //天书
    public tianshuDict;
    //法宝套装等级
    public taozhuangDict;
    public constructor(id, type) {
        super(id, type);
        this.equipthings = [];
        this.equipSlotThings = [];
        this.dominateTings = [];
        this.fourinages = [];
        this.psychThings = [];
        this.fateThings = [];
        // this.gongfas = [];
        this.blessinfos = [];
        this.seniorEquips = [];
        this.goldEquips = [];
        this.blessEquipDict = {};
        this.blessEquipSlotDict = {};
        this.blessSkillsDict = {};
        this.blessWakeLevel = [];
        this.fashionDatas = {};
        this.fashionWearIds = {};
        this.fashionSkils = {};
        this.tujianDataDict = {};
        this._appears = [];
        this.legendInfo = {};
        this.fuling = [];
        this.yuanjie = [];
        this.rnuesList = [];
        this.blessDanDict = {};
        this.tianshuDict = {};
        this.taozhuangDict = {};
        this.skillEnhantDict = {};
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this.equipthings[i] = new EquipThing();
            this.equipthings[i].position = i;
            this.equipSlotThings[i] = new EquipSlotThing();
            this.equipSlotThings[i].slot = i;
        }
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this.seniorEquips[i] = new EquipThing();
            this.seniorEquips[i].position = i + GameDefine.Equip_Slot_Num;
        }
        for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
            this.goldEquips[i] = new EquipThing();
            this.goldEquips[i].position = GameDefine.CELESTIAL_EQUIP_SLOTS[i];
        }
        for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
            this.dominateTings[i] = new DominateThing();
            this.dominateTings[i].slot = i;
            this.dominateTings[i].onupdate(GameDefine.Domiante_IDs[i], -1, 0);
        }

        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            this.psychThings[i] = new PsychBase();
            this.psychThings[i].slot = i;
        }
        for (var i: number = 0; i < GameDefine.Fate_Slot_Num; i++) {
            this.fateThings[i] = new FateBase();
            this.fateThings[i].slot = i + 1;
        }

        this.longhunAttribute = [];

        this._compInit = true;
    }
    //获取当前人物职业
    public get occupation(): number {
        return 0;//this.modelid - 1;
    }
    //更新身上装备msg是装备的消息体
    public onInitEquip(msg: Message, slotIndex: number): void {
        var equipThing: EquipThing = this.equipthings[slotIndex];
        if (equipThing) {
            equipThing.parseEquipMessage(msg);
            equipThing.equipId = 0;
            this.equipthings[slotIndex] = equipThing;
            equipThing.playerIndex = this.index;
        }
    }
    //更新身上高级装备
    public onInitSeniorEquip(msg: Message, slotIndex: number): void {
        var equipThing: EquipThing = this.seniorEquips[slotIndex];
        if (equipThing) {
            equipThing.parseEquipMessage(msg);
            equipThing.equipId = 0;
            this.seniorEquips[slotIndex] = equipThing;
            equipThing.playerIndex = this.index;
        }
    }
    //更新身上金装装备
    public onInitGoldEquip(msg: Message, slotIndex: number): void {
        var equipThing: EquipThing = this.goldEquips[slotIndex];
        if (equipThing) {
            equipThing.parseEquipMessage(msg);
            equipThing.equipId = 0;
            this.goldEquips[slotIndex] = equipThing;
            equipThing.playerIndex = this.index;
        }
    }
    //更新身上装备槽消息体
    public onInitEquipSlot(msg: Message, slotIndex: number): void {
        var equipSlotThing: EquipSlotThing = this.equipSlotThings[slotIndex];
        if (equipSlotThing) {
            equipSlotThing.parseEquipMessage(msg);
            this.equipSlotThings[slotIndex] = equipSlotThing;
        }
    }
    /** 更新装备槽位 **/
    public onupdateEquip(msg: Message): number {
        let postion: number = msg.getByte();
        let equips: EquipThing[];

        if (postion >= MASTER_EQUIP_TYPE.SIZE * 2) {
            equips = this.goldEquips;
        } else if (postion >= MASTER_EQUIP_TYPE.SIZE) {
            equips = this.seniorEquips;
        } else {
            equips = this.equipthings;
        }
        for (var i: number = 0; i < equips.length; i++) {
            var equipThing: EquipThing = equips[i];
            if (equipThing.position == postion) {
                equipThing.equipId = 0;
                equipThing.parseEquipMessage(msg);
                equipThing.playerIndex = this.index;
                break;
            }
        }
        return postion;
    }
    public getBlessSkill(id: number): BlessSkillData {
        return this.blessSkillsDict[id];
    }
    //获取对应槽位上的装备
    public getEquipBySlot(slotIndex: number): EquipThing {
        if (slotIndex >= MASTER_EQUIP_TYPE.SIZE * 2) {
            return this.goldEquips[slotIndex - MASTER_EQUIP_TYPE.SIZE * 2];
        } else if (slotIndex >= MASTER_EQUIP_TYPE.SIZE) {
            return this.seniorEquips[slotIndex - MASTER_EQUIP_TYPE.SIZE];
        } else {
            return this.equipthings[slotIndex];
        }
    }
    //根据装备类型获取对应装备
    public getEquipByOccp(type: number): EquipThing[] {
        var equips: EquipThing[] = [];
        for (var i: number = 0; i < this.equipthings.length; i++) {
            var clothEquip: EquipThing = this.equipthings[i];
            if (clothEquip && clothEquip.model && clothEquip.model.part == type) {
                equips.push(clothEquip);
            }
        }
        return equips;
    }
    //获取对应槽位上的装备
    public getPsychBySlot(slotIndex: number): PsychBase {
        return this.psychThings[slotIndex];
    }
    //获取对应槽位上的装备
    public getFateSlot(slotIndex: number): FateBase {
        return this.fateThings[slotIndex];
    }
    public getFateSlotIdx(slot: number): FateBase {
        // for (var i = 0; i < this.fateThings.length; ++i) {
        //     if (this.fateThings[i].UID == id) {
        //         return this.fateThings[slot].slot-1;
        //     }
        // }
        return this.fateThings[slot];
    }
    //获取对应祝福值上的装备
    public getBlessEquip(type: BLESS_TYPE, pos: number): ServantEquipThing {
        var equip: ServantEquipThing;
        var equipAry: ServantEquipThing[] = this.blessEquipDict[type];
        if (!equipAry)
            return null;
        equip = equipAry[pos];
        return equip;
    }
    //获取对应祝福值装备上的槽位
    public getBlessEquipSlot(type: BLESS_TYPE, pos: number): ServantEquipSlot {
        var slot: ServantEquipSlot;
        var slotAry: ServantEquipSlot[] = this.blessEquipSlotDict[type];
        slot = slotAry[pos];
        return slot;
    }
    public parseBlessDan(id: number): number {
        return this.blessDanDict[id];
    }
    public onParsePsychEquip(msg: Message): void {
        var base: PsychBase = new PsychBase();
        base.parseInit(msg);
        if (this.psychThings[base.slot]) {
            this.psychThings[base.slot].onUpdate(base);
        } else {
            this.psychThings[base.slot] = base;
        }
    }
    public onParseFateEquip(msg: Message): void {
        var base: FateBase = new FateBase();
        var id = msg.getInt();
        base.parseInit(id, msg);
        this.fateThings[base.slot - 1] = base;
    }
    public onParseFateEquipRefresh(msg: Message): void {
        var base: FateBase = new FateBase();
        base.parseFate(msg);
        if (this.fateThings[base.slot - 1]) {
            this.fateThings[base.slot - 1].onUpdate(base);
        } else {
            this.fateThings[base.slot - 1] = base;
        }

    }
    public onPreseFateLvUp(data: FateBase): void {
        // var base: FateBase = new FateBase();
        // base.parseInit(id, msg);
        // // if (this.fateThings[base.slot]) {
        // // this.fateThings[base.slot].onUpdate(base);
        // // } else {
        this.fateThings[data.slot - 1] = data;
        // }
    }
    public onGetFate(id): FateBase {

        for (var i = 0; i < this.fateThings.length; ++i) {
            if (this.fateThings[i].UID == id) {
                return this.fateThings[i];
            }
        }
        return null;
    }
    public onCleanFate(id) {
        for (var i = 0; i < this.fateThings.length; ++i) {
            if (this.fateThings[i].UID == id) {
                this.fateThings[i].UID = 0;
                this.fateThings[i].lv = 0;
                this.fateThings[i].exp = 0;
            }
        }
    }

    public onRebirth(): void {
        if (this.bodyType == BODY_TYPE.SELF) {
            this.resetAllSkillCD(GameFight.getInstance().hero_randomIndex);
            if (this._compInit) {
                this.onCheckFashion();
                DataManager.getInstance().titleManager.onCheckTitleTimeOut();
            }
        } else {
            this.resetAllSkillCD(GameFight.getInstance().enemy_randomIndex);
        }
        //重置时装技能
        for (let tp in this.fashionSkils) {
            let fashionData: FashionData = this.fashionSkils[tp];
            if (fashionData) { fashionData.onResetSkill(); }
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            this._fashionSkillCD = 0;
        } else {
            this._fashionSkillCD = SkillDefine.FASHION_SKILL_CD;
        }
        super.onRebirth();
    }
    //释放技能
    private _fashionSkillCD: number = 0;
    public getCanUseSkill(): SkillInfo {
        if (this.isUseingSkill) {//计算上一个特效有没有播放完
            return null;
        }
        if (this.isHitChenMo) {
            this._useSkill = this.getSkillInfoById(SkillDefine.COMMON_SKILL_ID);
            if (this._fashionSkillCD > 0) {
                this._fashionSkillCD--;
            }
            if (this._fashionSkillCD == 0) {
                this._fashionSkillCD = SkillDefine.FASHION_SKILL_CD;
            }
        }
        if (this._useSkill) {
            return this._useSkill;
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {//野外释放技能规则
            //最后一刀之前是普攻
            if ((this._relseSkillCount + 1) % FightDefine.getXgDeathCount() != 0) {
                this._useSkill = this.getSkillInfoById(SkillDefine.COMMON_SKILL_ID);
            } else {//最后一刀先找出时装技能 如果
                for (let i: number = 0; i < SkillDefine.FASION_SKILL_ORDER.length; i++) {
                    let tp: number = SkillDefine.FASION_SKILL_ORDER[i];
                    let fashionData: FashionData = this.fashionSkils[tp];
                    if (!fashionData || !this.blessinfos[fashionData.type] || this.blessinfos[fashionData.type].grade == 0) {
                        continue;
                    }
                    if (fashionData.skillInfo && !fashionData.skillInfo.isSkillCD) {
                        this._useSkill = fashionData.skillInfo;
                        break;
                    }
                }
                if (!this._useSkill) {
                    let skillIDs: SkillInfo[] = [];
                    for (let i: number = 0; i < this.skills.length; i++) {
                        if (this.skills[i].level > 0) {
                            skillIDs.push(this.skills[i]);
                        }
                    }
                    this._useSkill = this.getSkillInfoById(Tool.randomInt(0, skillIDs.length) + 1);
                }
            }
            this._relseSkillCount++;
        } else {
            //寻出一个时装技能
            if (this._fashionSkillCD == 0) {
                for (let i: number = 0; i < SkillDefine.FASION_SKILL_ORDER.length; i++) {
                    let tp: number = SkillDefine.FASION_SKILL_ORDER[i];
                    let fashionData: FashionData = this.fashionSkils[tp];
                    if (!fashionData || !this.blessinfos[fashionData.type] || this.blessinfos[fashionData.type].grade == 0) {
                        continue;
                    }
                    let fashion_skill: SkillInfo = fashionData.getSkill();
                    if (fashion_skill) {
                        this._useSkill = fashion_skill;
                        this._fashionSkillCD = SkillDefine.FASHION_SKILL_CD;
                        break;
                    }
                }
                if (!this._useSkill) {
                    this._fashionSkillCD = -1;
                }
            }
            //如果没有时装技能寻一个普通技能
            if (!this._useSkill) {
                let releaseIdx: number = this._skillStartIdx * SkillDefine.SKILL_RELEASE_SIZE;
                let releaseLen: number = SkillDefine.SKILL_RELEASE_ARY.length;
                let skillInfo: SkillInfo;
                while (!skillInfo || (skillInfo.level == 0 && skillInfo.id != SkillDefine.COMMON_SKILL_ID)) {
                    let skillID: number = SkillDefine.SKILL_RELEASE_ARY[(releaseIdx + this._relseSkillCount) % releaseLen];
                    skillInfo = this.getSkillInfoById(skillID);
                    this._relseSkillCount++;
                }
                this._useSkill = skillInfo;
                if (this._fashionSkillCD > 0) {
                    this._fashionSkillCD--;
                }
            }
        }

        return this._useSkill;
    }
    //本轮攻击第几次
    public get attackcount(): number {
        return this._relseSkillCount;
    }
    protected onResetSkillStartIdx() {
        this._skillStartIdx = this._startRandomIdx % SkillDefine.SKILL_RELEASE_SIZE;
    }
    //更新属性 战斗力
    public updataAttributeFighting(playerAttr: number[], playerFighting: number): number {
        let playerM: PlayerManager = DataManager.getInstance().playerManager;
        let player: Player = playerM.player;
        //基础属性
        this.attributes[ATTR_TYPE.ATTACK] = this.model.attack;
        this.attributes[ATTR_TYPE.PHYDEF] = this.model.phyDef;
        this.attributes[ATTR_TYPE.MAGICDEF] = this.model.magicDef;
        this.attributes[ATTR_TYPE.HP] = this.model.hp;
        this.attributes[ATTR_TYPE.HIT] = this.model.hit;
        this.attributes[ATTR_TYPE.DODGE] = this.model.dodge;
        this.attributes[ATTR_TYPE.BLOCK] = this.model.block;
        this.attributes[ATTR_TYPE.BREAK] = this.model.counter;
        this.attributes[ATTR_TYPE.CRIT] = this.model.crit;
        this.attributes[ATTR_TYPE.DUCT] = this.model.duct;

        //玩家属性
        for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
            this.attributes[i] += playerAttr[i];
        }
        var cuilianAtt = GameCommon.getInstance().getAttributeAry();
        //装备属性
        if (this.equipthings) {
            let add: number;
            let slotThing: EquipSlotThing;
            for (let i: number = 0; i < this.equipthings.length; i++) {
                let equipThing: EquipThing = this.equipthings[i];
                if (!equipThing || !equipThing.model)
                    continue;
                for (let n: number = 0; n < equipThing.attributes.length; n++) {
                    slotThing = this.getEquipSlotThings(equipThing.position);
                    add = equipThing.attributes[n] + equipThing.addAttributes[n];
                    if (slotThing.quenchingLv > 0) {
                        let modelQue: Modelcuilian = JsonModelManager.instance.getModelcuilian()[slotThing.quenchingLv];
                        add = Math.floor(add + (modelQue.effect / GameDefine.GAME_ADD_RATIO * add));
                    }
                    cuilianAtt[n] += add;
                }
            }
        }

        //淬炼强化大师绝对值
        var cuilianAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            cuilianAtt[j] += cuilianAtt1[j];
        }
        //淬炼强化大师百分比
        var cuilianPlusAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            cuilianAtt[j] += Tool.toInt(cuilianAtt[j] * cuilianPlusAtt[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += cuilianAtt[j]
        }

        var tianshi_redequip_puls: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.RED_EQUIP);
        if (this.seniorEquips) {
            let add: number;
            for (let i: number = 0; i < this.seniorEquips.length; i++) {
                let equipThing: EquipThing = this.seniorEquips[i];
                if (!equipThing || !equipThing.model)
                    continue;
                for (var n: number = 0; n < equipThing.attributes.length; n++) {
                    add = equipThing.attributes[n] + equipThing.addAttributes[n];
                    this.attributes[n] += add + Tool.toInt(add * tianshi_redequip_puls / GameDefine.GAME_ADD_RATIO);
                }
            }
        }
        if (this.goldEquips) {
            let add: number;
            for (let i: number = 0; i < this.goldEquips.length; i++) {
                let equipThing: EquipThing = this.goldEquips[i];
                if (!equipThing || !equipThing.model)
                    continue;
                for (var n: number = 0; n < equipThing.attributes.length; n++) {
                    add = equipThing.attributes[n] + equipThing.addAttributes[n];
                    this.attributes[n] += add;
                }
            }
        }
        //主宰属性
        for (var i = 0; i < this.dominateTings.length; ++i) {
            var modelDomUpgrade: Modelshanggutaozhuang = JsonModelManager.instance.getModelshanggutaozhuang()[this.dominateTings[i].slot][this.dominateTings[i].lv - 1];
            if (modelDomUpgrade) {
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    if (this.dominateTings[i].tier > 0) {
                        this.attributes[n] += Math.floor(modelDomUpgrade.base_effect[n] * 1.25);
                    } else {
                        this.attributes[n] += modelDomUpgrade.base_effect[n];
                    }
                }
            }
        }
        var sixiangAtt = GameCommon.getInstance().getAttributeAry();
        /**四象**/
        for (let i: number = 0; i < Fourinages_Type.SIZE; i++) {
            var fourinageData: FourinageData = this.fourinages[i];
            if (fourinageData.level > 0) {
                var _Ratio: number = 1;
                if (fourinageData.grade > 0) {
                    var grademodel: Modelsixiangjinjie = JsonModelManager.instance.getModelsixiangjinjie()[i][fourinageData.grade - 1];
                    _Ratio += grademodel.effect / GameDefine.GAME_ADD_RATIO;
                }
                var levelmodel: Modelsixiang = JsonModelManager.instance.getModelsixiang()[i][fourinageData.level - 1];
                for (let n: number = 0; n < ATTR_TYPE.SIZE; ++n) {
                    if (levelmodel.attrAry[n] > 0) {
                        sixiangAtt[n] += Math.floor(levelmodel.attrAry[n] * _Ratio);
                    }
                }
            }
        }
        //四象强化大师绝对值
        var sixiangAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            sixiangAtt[j] += sixiangAtt1[j];
        }
        //四象强化大师百分比
        var sixiangAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            sixiangAtt[j] += Tool.toInt(sixiangAtt[j] * sixiangAttPlus[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += sixiangAtt[j]
        }
        var zhulingAtt = GameCommon.getInstance().getAttributeAry();
        var qianghuaAtt = GameCommon.getInstance().getAttributeAry();
        var baoshiAtt = GameCommon.getInstance().getAttributeAry();
        var lianhuaAtt = GameCommon.getInstance().getAttributeAry();
        var tianshi_puls_val: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.FORGE);
        //装备槽属性
        for (var i = 0; i < this.equipSlotThings.length; ++i) {
            var equipSlotThing: EquipSlotThing = this.equipSlotThings[i];
            //强化属性
            if (equipSlotThing.intensifyLv > 0) {
                var slottype: MASTER_EQUIP_TYPE = GoodsDefine.EQUIP_SLOT_TYPE[equipSlotThing.slot];
                var intensifyAttr: number[] = DataManager.getInstance().forgeManager.getIntensifyAttr(slottype);
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    if (intensifyAttr[n] > 0) {
                        qianghuaAtt[n] += intensifyAttr[n];
                    }
                }
            }
            //注灵属性
            if (equipSlotThing.infuseLv > 0) {
                var modelInfuseSoul: Modelronghun = JsonModelManager.instance.getModelronghun()[GoodsDefine.EQUIP_SLOT_TYPE[equipSlotThing.slot]][equipSlotThing.infuseLv - 1];
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    zhulingAtt[n] += modelInfuseSoul.attrAry[n];
                }
            }
            //宝石属性
            if (equipSlotThing.gemLv > 0) {
                var equip_gemtypes: number[] = GoodsDefine.SLOT_GEMTYPE[equipSlotThing.slot];
                for (var gIdx: number = 0; gIdx < equip_gemtypes.length; gIdx++) {
                    var gem_type: ATTR_TYPE = equip_gemtypes[gIdx];
                    var gem_level: number = equipSlotThing.getGemLvByGemSlot(gIdx);
                    var modelgem: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[gem_level - 1];
                    if (modelgem) {
                        let gam_attr_val: number = modelgem.attrAry[gem_type];
                        baoshiAtt[gem_type] += gam_attr_val + Tool.toInt(gam_attr_val * tianshi_puls_val / GameDefine.GAME_ADD_RATIO);
                    }
                }
            }
            //炼化属性
            if (equipSlotThing.zhLv > 0) {
                let _lianhuaDict = JsonModelManager.instance.getModellianhua();
                let modelZhuHun: Modellianhua = _lianhuaDict[GoodsDefine.EQUIP_SLOT_TYPE[equipSlotThing.slot]][equipSlotThing.zhLv - 1];
                for (let n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    let lianhua_val: number = modelZhuHun.attrAry[n];
                    if (lianhua_val > 0) {
                        lianhuaAtt[n] += lianhua_val + Tool.toInt(lianhua_val * tianshi_puls_val / GameDefine.GAME_ADD_RATIO);;
                    }
                }
            }
        }
        //强化强化大师绝对值
        var qianghuaAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            qianghuaAtt[j] += qianghuaAtt1[j];
        }
        //强化强化大师百分比
        var qianghuaPlusAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            qianghuaAtt[j] += Tool.toInt(qianghuaAtt[j] * qianghuaPlusAtt[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += qianghuaAtt[j]
        }

        //炼化强化大师绝对值
        var lianhuaAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            lianhuaAtt[j] += lianhuaAtt1[j];
        }
        //炼化强化大师百分比
        var lianhuaPlusAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            lianhuaAtt[j] += Tool.toInt(lianhuaAtt[j] * lianhuaPlusAtt[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += lianhuaAtt[j]
        }

        //注灵强化大师绝对值
        var zhulingAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            zhulingAtt[j] += zhulingAtt1[j];
        }
        //注灵强化大师百分比
        var zhulingPlusAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            zhulingAtt[j] += Tool.toInt(zhulingAtt[j] * zhulingPlusAtt[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += zhulingAtt[j]
        }

        //宝石强化大师绝对值
        var baoshiAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            baoshiAtt[j] = baoshiAtt[j] + baoshiAtt1[j];
        }
        var baoshiPlusAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            baoshiAtt[j] += Tool.toInt(baoshiAtt[j] * baoshiPlusAtt[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += baoshiAtt[j]
        }

        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //祝福值属性
        for (var i: number = 0; i < BLESS_TYPE.SIZE; i++) {
            var curr_bless_attr: number[] = this.getBlessAttrByType(i);
            for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                this.attributes[n] += curr_bless_attr[n];
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        // var yuanshenAtt = GameCommon.getInstance().getAttributeAry();
        //元神属性
        for (var i = 0; i < this.psychThings.length; ++i) {
            var modelPsych: Modelyuanshen = JsonModelManager.instance.getModelyuanshen()[this.psychThings[i].modelID];
            if (modelPsych) {
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    this.attributes[n] += modelPsych.attrAry[n];
                }
            }
        }
        //元神强化大师绝对值
        // var yuanshenAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_PSYCH_LEVEL);
        // for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
        //     yuanshenAtt[j] += yuanshenAtt1[j];
        // }
        // //元神强化大师百分比
        // var yuanshenAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_PSYCH_LEVEL);
        // for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
        //     yuanshenAtt[j] += Tool.toInt(yuanshenAtt[j] * yuanshenAttPlus[j] / GameDefine.GAME_ADD_RATIO);
        //     this.attributes[j] += yuanshenAtt[j]
        // }


        // Tool.log(GameCommon.calculationFighting(this.attributes))
        var pulseAtt = GameCommon.getInstance().getAttributeAry();
        //经脉属性
        var pulsemodel: Modeljingmai = JsonModelManager.instance.getModeljingmai()[this.pulseLv];
        if (pulsemodel) {
            for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
                this.attributes[i] += pulsemodel.attrAry[i];
            }
        }
        //经脉强化大师绝对值
        // var pulseAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_JING_MAI);
        // for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //     pulseAtt[j] += pulseAtt1[j];
        // }
        // //经脉强化大师百分比
        // var pulseAttAtt: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_JING_MAI);
        // for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //     pulseAtt[j] += Tool.toInt(pulseAtt[j] * pulseAttAtt[j] / GameDefine.GAME_ADD_RATIO);
        //     this.attributes[j] += pulseAtt[j]
        // }

        // Tool.log(GameCommon.calculationFighting(this.attributes))

        //帮会技能属性
        // for (var i = 0; i < this.unionSkillArray.length; ++i) {
        //     var unionSkill: UnionSkill = this.unionSkillArray[i];
        //     var unionSkillModel = ModelManager.getInstance().modelUnionSkill[unionSkill.id + "_" + unionSkill.level];
        //     if (unionSkillModel) {
        //         for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //             this.attributes[j] += unionSkillModel.attributes[j];
        //         }
        //     }
        // }
        for (var i = 0; i < this.unionSkill2Array.length; ++i) {
            var unionSkill2: UnionSkill2 = this.unionSkill2Array[i];
            var unionSkillModel: ModelguildSkill = JsonModelManager.instance.getModelguildSkill()[unionSkill2.id][unionSkill2.level - 1];
            if (unionSkillModel) {
                for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
                    this.attributes[j] += unionSkillModel.attrAry[j];
                }
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))

        //功法
        // for (var i = 0; i < this.gongfas.length; i++) {
        //     if (this.gongfas[i].lv > 0) {
        //         var gongfaModel: ModelGongFa = JsonModelManager.instance.getModelgongfa()[this.gongfas[i].id];
        //         if (gongfaModel) {
        //             for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //                 this.attributes[j] += gongfaModel.attr[j];
        //             }
        //         }
        //     }
        // }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //龙魂
        for (var i = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
            this.attributes[GameDefine.LONGHUAN_ATTR[i]] += this.longhunAttribute[i];
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        var wuxingAtt = GameCommon.getInstance().getAttributeAry();
        //五行
        if (this.wuxingLevel > 0) {
            var list = JsonModelManager.instance.getModelwuxing();
            var wuxingModel: Modelwuxing = list[this.wuxingLevel];
            if (!wuxingModel) {
                for (var i = this.wuxingLevel - 1; i > 0; --i) {
                    if (list[i]) {
                        wuxingModel = list[i];
                        this.wuxingLevel = wuxingModel.id;
                        break;
                    }
                }
            }
            for (var i = 0; i < wuxingModel.attrAry.length; i++) {
                this.attributes[i] += wuxingModel.attrAry[i];
            }
        }

        //五行强化大师绝对值
        // var wuxingAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_WU_XING);
        // for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //     this.attributes[j] += wuxingAtt1[j];
        // }
        // //五行强化大师百分比
        // var wuxingAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_WU_XING);
        // for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //     wuxingAtt[j] += Tool.toInt(wuxingAtt[j] * wuxingAttPlus[j] / GameDefine.GAME_ADD_RATIO);
        //     this.attributes[j] += wuxingAtt[j]
        // }

        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //器魂
        if (this.qihun > 0) {
            var qihunModel: Modelqihun = JsonModelManager.instance.getModelqihun()[this.qihun];
            for (var i = 0; i < qihunModel.attrAry.length; i++) {
                this.attributes[i] += qihunModel.attrAry[i] + Tool.toInt(qihunModel.attrAry[i] * tianshi_redequip_puls / GameDefine.GAME_ADD_RATIO);
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        /***全局属性加成***/
        //神器加成
        // if (player.isLegendActive(7)) {
        //     this.attributes[ATTR_TYPE.HP] *= 1.05;
        //     this.attributes[ATTR_TYPE.HP] = Math.floor(this.attributes[ATTR_TYPE.HP]);
        // }
        // if (player.isLegendActive(8)) {
        //     this.attributes[ATTR_TYPE.ATTACK] *= 1.05;
        //     this.attributes[ATTR_TYPE.ATTACK] = Math.floor(this.attributes[ATTR_TYPE.ATTACK]);
        // }
        // if (player.isLegendActive(9)) {
        //     this.attributes[ATTR_TYPE.PHYDEF] *= 1.05;
        //     this.attributes[ATTR_TYPE.PHYDEF] = Math.floor(this.attributes[ATTR_TYPE.PHYDEF]);
        //     this.attributes[ATTR_TYPE.MAGICDEF] *= 1.05;
        //     this.attributes[ATTR_TYPE.MAGICDEF] = Math.floor(this.attributes[ATTR_TYPE.MAGICDEF]);
        // }
        // Tool.log(GameCommon.calculationFighting(this.attributes))

        //图鉴加成
        let tujianCountDict = {};//统计图鉴 类型KEY —— 数量connt
        let tianshi_tujian_puls: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.TUJIAN);
        for (let tujianId in this.tujianDataDict) {
            let tujianData: TuJianData = this.tujianDataDict[tujianId];
            if (tujianData.level == 0) continue;
            let tujianAttr: number[] = tujianData.attrAry;
            for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
                if (tujianAttr[i] > 0) {
                    this.attributes[i] += tujianAttr[i] + Tool.toInt(tujianAttr[i] * tianshi_tujian_puls / GameDefine.GAME_ADD_RATIO);
                }
            }
            if (!tujianCountDict[tujianData.model.type]) {
                tujianCountDict[tujianData.model.type] = 0;
            }
            tujianCountDict[tujianData.model.type]++;
        }
        //图鉴套装属性
        // for (let tujianType in tujianCountDict) {
        //     let num = tujianCountDict[tujianType];
        //     let models = JsonModelManager.instance.getModeltujiantaozhuang()[tujianType];
        //     let model: Modeltujiantaozhuang;
        //     let currModel: Modeltujiantaozhuang;
        //     for (let key in models) {
        //         model = models[key]
        //         if (num >= model.num) {
        //             currModel = model;
        //         }
        //     }
        //     if (currModel) {
        //         for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
        //             var attrValue: number = currModel.attrAry[j];
        //             if (attrValue > 0) {
        //                 this.attributes[j] += attrValue;
        //             }
        //         }
        //     }
        // }

        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //时装属性 先检查到期了没有
        for (let fIdx in this.fashionDatas) {
            let fashionData: FashionData = this.fashionDatas[fIdx];
            let modelFashion: Modelfashion = JsonModelManager.instance.getModelfashion()[fashionData.id];
            if (modelFashion) {
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    this.attributes[n] += modelFashion.attrAry[n] * fashionData.level;
                }
            }
        }

        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //命格属性
        for (var i = 0; i < this.fateThings.length; ++i) {
            var modelFate: Modelmingge = JsonModelManager.instance.getModelmingge()[this.fateThings[i].modelID];
            var lvCfg = JsonModelManager.instance.getModelminggelv()[this.fateThings[i].lv - 1];
            if (modelFate) {
                for (var n = 0; n < ATTR_TYPE.SIZE; ++n) {
                    if (modelFate.attrAry[n] > 0) {
                        switch (modelFate.pinzhi) {
                            case 1:
                                this.attributes[n] += Tool.toInt(lvCfg.attrAry[n] * lvCfg.lv / 100)
                                break;
                            case 2:
                                this.attributes[n] += Tool.toInt(lvCfg.attrAry[n] * lvCfg.lan / 100)
                                break;
                            case 3:
                                this.attributes[n] += Tool.toInt(lvCfg.attrAry[n] * lvCfg.zi / 100)
                                break;
                            case 4:
                                this.attributes[n] += Tool.toInt(lvCfg.attrAry[n] * lvCfg.cheng / 100)
                                break;
                            case 5:
                                this.attributes[n] += Tool.toInt(lvCfg.attrAry[n] * lvCfg.hong / 100)
                                break;
                        }
                    }
                }
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //附灵属性加成
        for (var i: number = 0; i < GameDefine.FULING_ATTR.length; i++) {
            this.attributes[GameDefine.FULING_ATTR[i]] += this.fuling[i];
        }
        //元戒属性加成
        for (var i: number = 0; i < GameDefine.YUANJIE_ATTR.length; i++) {
            this.attributes[GameDefine.YUANJIE_ATTR[i]] += this.yuanjie[i];
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //心法属性
        let xinfaAttrAry: number[] = playerM.getAllXinfaAttrAry();
        let tianshi_xinfa_plus: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.XINFA);
        for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
            if (xinfaAttrAry[i] > 0) {
                this.attributes[i] += xinfaAttrAry[i] + Tool.toInt(xinfaAttrAry[i] * tianshi_xinfa_plus / GameDefine.GAME_ADD_RATIO);
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        //战纹加成
        let tianshi_zhanwen_plus: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.RUNE);
        for (var i: number = 0; i < 50; i++) {
            var modelId: number = player.getPlayerData().rnuesList[i];
            if (modelId > 0) {
                var zhanwenCfg: Modelzhanwen = JsonModelManager.instance.getModelzhanwen()[modelId];
                if (!zhanwenCfg) continue;
                for (var k: number = 0; k < zhanwenCfg.attrAry.length; k++) {
                    if (zhanwenCfg.attrAry[k] > 0) {
                        this.attributes[k] += zhanwenCfg.attrAry[k] + Tool.toInt(zhanwenCfg.attrAry[k] * tianshi_zhanwen_plus / GameDefine.GAME_ADD_RATIO);
                    }
                }
            }
        }
        // Tool.log(GameCommon.calculationFighting(this.attributes))
        var tianshuAtt = GameCommon.getInstance().getAttributeAry();
        //天书战斗力
        let tianshuAttrAddAry: number[] = GameCommon.getInstance().getAttributeAry();//加成值数组
        let tianshuLevels = JsonModelManager.instance.getModeltianshushengji();
        let tianshi_ts_puls: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.BOOK);
        for (let id in tianshuLevels) {
            let tianshulvModel: Modeltianshushengji = tianshuLevels[id];
            let tianshuGradeModel: Modeltianshutupo = JsonModelManager.instance.getModeltianshutupo()[id];
            let tianshuData: TianshuData = this.tianshuDict[tianshulvModel.id];
            if (!tianshuData) continue;
            if (tianshuData.level > 0) {
                for (let i: number = 0; i < tianshulvModel.attrAry.length; i++) {
                    if (tianshulvModel.attrAry[i] > 0) {
                        tianshuAtt[i] += tianshulvModel.attrAry[i] * tianshuData.level;
                    }
                }
            }

            if (tianshuData.grade > 0) {
                for (let i: number = 0; i < tianshuGradeModel.attrAry.length; i++) {
                    if (tianshuGradeModel.attrAry[i] > 0) {
                        tianshuAtt[i] += tianshuGradeModel.attrAry[i] * tianshuData.grade;
                    }
                    let addattrkey: string = GameDefine.getAttrPlusKey(i + GameDefine.ATTR_OBJ_KEYS.length);
                    if (tianshuGradeModel[addattrkey] && tianshuGradeModel[addattrkey] > 0) {
                        tianshuAttrAddAry[i] += tianshuGradeModel[addattrkey] * tianshuData.grade;
                    }
                }
            }

            if (tianshi_ts_puls > 0) {
                tianshuAttrAddAry[i] += Tool.toInt(tianshuAttrAddAry[i] * tianshi_ts_puls / GameDefine.GAME_ADD_RATIO);
            }
        }

        //天书强化大师绝对值
        var tianshuAtt1: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            tianshuAtt[j] += tianshuAtt1[j];
        }
        //天书强化大师百分比
        var tianshuAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL);
        for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            tianshuAtt[j] += Tool.toInt(tianshuAtt[j] * tianshuAttPlus[j] / GameDefine.GAME_ADD_RATIO);
            this.attributes[j] += tianshuAtt[j]
        }

        var allProTimes: number[] = GameCommon.getInstance().getAttributeAry();
        //仙丹战力加成
        var xiandanData: XianDanInfo;
        let tianshi_xd_puls: number = playerM.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.PILL);
        for (var key in player.xianDans) {
            xiandanData = player.xianDans[key];
            var xianDanCfg: Modelxiandan = JsonModelManager.instance.getModelxiandan()[xiandanData.UID];
            if (xianDanCfg) {
                for (var k: number = 0; k < xianDanCfg.attrAry.length; k++) {
                    var addRateVaule: number = xianDanCfg.attrAry[k];
                    if (addRateVaule > 0) {
                        if (player.xianDans[xiandanData.UID].shiyongNum > 0) {
                            let xiandan_val: number = addRateVaule * player.xianDans[xiandanData.UID].shiyongNum;
                            this.attributes[k] += xiandan_val + Tool.toInt(xiandan_val * tianshi_xd_puls / GameDefine.GAME_ADD_RATIO);
                            allProTimes[k] = allProTimes[k] + DataManager.getInstance().xiandanManager.getXianDanAllProTimes(xianDanCfg);
                        }
                    }
                }
            }
        }

        //技能附魔加成
        for (let xfId in JsonModelManager.instance.getModelxinfaLv()) {
            let lv_model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[xfId];
            let grade_model: Modelxinfajinjie = JsonModelManager.instance.getModelxinfajinjie()[xfId];
            let xfdata: SkillEnchantData = this.skillEnhantDict[xfId];
            if (xfdata) {
                for (var k: number = 0; k < lv_model.attrAry.length; k++) {
                    if (lv_model.attrAry[k] > 0) {
                        this.attributes[k] += lv_model.attrAry[k] * xfdata.level;
                    }
                }
                if (xfdata.grade > 0) {
                    for (var k: number = 0; k < grade_model.attrAry.length; k++) {
                        if (grade_model.attrAry[k] > 0) {
                            this.attributes[k] += grade_model.attrAry[k] * xfdata.grade;
                        }
                    }
                }
            }
        }
        var taozhuangPlus: number[] = GameCommon.getInstance().getAttributeAry();
        var taozhuangCfgs: Modelmounttaozhuang[] = JsonModelManager.instance.getModelmounttaozhuang();
        for (let idx in taozhuangCfgs) {
            for (var key in taozhuangCfgs[idx]) {
                if (taozhuangCfgs[idx][key]) {
                    var taozhuangLv: number = this.taozhuangDict[taozhuangCfgs[idx][key].id];
                    if (taozhuangLv > 0) {
                        for (var i = 0; i < taozhuangCfgs[idx][key].attrAry.length; i++) {
                            if (taozhuangCfgs[idx][key].attrAry[i] > 0) {
                                this.attributes[i] += (taozhuangCfgs[idx][key].attrAry[i] * taozhuangLv);
                            }
                        }
                        for (var i: number = 10; i < taozhuangCfgs[idx][key].attrAry.length * 2; i++) {
                            if (taozhuangCfgs[idx][key][GameDefine.getAttrPlusKey(i)] > 0) {
                                taozhuangPlus[i % ATTR_TYPE.SIZE] += taozhuangCfgs[idx][key][GameDefine.getAttrPlusKey(i)] * taozhuangLv;
                            }
                        }
                    }
                }
            }
        }

        /**--------------------------百分比加成(将所有系统的属性进行万分比的加成)------------------------------**/
        //帮会技能加成
        for (var i = 0; i < this.unionSkill2Array.length; ++i) {
            var unionSkill2: UnionSkill2 = this.unionSkill2Array[i];
            var modelUnionSkill2: ModelguildSkill = JsonModelManager.instance.getModelguildSkill()[unionSkill2.id][unionSkill2.level - 1];
            if (modelUnionSkill2) {
                this.attributes[ATTR_TYPE.ATTACK] *= 1 + modelUnionSkill2.attPlus / GameDefine.GAME_ADD_RATIO;
                this.attributes[ATTR_TYPE.ATTACK] = Math.floor(this.attributes[ATTR_TYPE.ATTACK]);
                this.attributes[ATTR_TYPE.HP] *= 1 + modelUnionSkill2.hpPlus / GameDefine.GAME_ADD_RATIO;
                this.attributes[ATTR_TYPE.HP] = Math.floor(this.attributes[ATTR_TYPE.HP]);
            }
        }
        //仙丹属性加成
        for (var i = 0; i < allProTimes.length; ++i) {
            this.attributes[i] = Tool.toInt(this.attributes[i] * (1 + allProTimes[i] / GameDefine.GAME_ADD_RATIO));
        }
        var fulingProPlus: number[] = GameCommon.getInstance().getAttributeAry();
        var cfgs = JsonModelManager.instance.getModellingxing();
        for (let ken in cfgs) {
            if (this.fuling[6] >= cfgs[ken].max) {
                for (var i: number = 10; i < cfgs[ken].attrAry.length * 2; i++) {
                    if (cfgs[ken][GameDefine.getAttrPlusKey(i)] > 0) {
                        fulingProPlus[i % ATTR_TYPE.SIZE] = cfgs[ken][GameDefine.getAttrPlusKey(i)];
                    }
                }
            }
        }
        for (var i = 0; i < fulingProPlus.length; ++i) {
            this.attributes[i] = Tool.toInt(this.attributes[i] * (1 + fulingProPlus[i] / GameDefine.GAME_ADD_RATIO));
        }
        //心法属性加成 攻防血
        let xinfaAddRatio: number = playerM.xinfaAddRatio;
        if (xinfaAddRatio > 0) {
            for (var i = 0; i <= ATTR_TYPE.MAGICDEF; ++i) {
                this.attributes[i] += Tool.toInt(this.attributes[i] * xinfaAddRatio / GameDefine.GAME_ADD_RATIO);
            }
        }

        //天书属性加成
        for (var i = 0; i <= tianshuAttrAddAry.length; ++i) {
            if (tianshuAttrAddAry[i] > 0) {
                this.attributes[i] += Tool.toInt(this.attributes[i] * tianshuAttrAddAry[i] / GameDefine.GAME_ADD_RATIO);
            }
        }
        //元戒属性加成
        var yuanjieProPlus: number[] = DataManager.getInstance().yuanjieManager.getAttributePlus(DataManager.getInstance().yuanjieManager.getYuanJieModelCurr());
        for (var i = 0; i < yuanjieProPlus.length; ++i) {
            this.attributes[i] = Tool.toInt(this.attributes[i] * (1 + yuanjieProPlus[i] / GameDefine.GAME_ADD_RATIO));
        }
        // //套装属性加成
        for (var i = 0; i < taozhuangPlus.length; ++i) {
            this.attributes[i] = Tool.toInt(this.attributes[i] * (1 + taozhuangPlus[i] / GameDefine.GAME_ADD_RATIO));
        }
        //强化大师
        // let strongerAttrAry: number[] = DataManager.getInstance().strongerManager.allPlusAtt;
        // for (let attrIdx = 0; attrIdx < ATTR_TYPE.SIZE; ++attrIdx) {
        //     let attrValue: number = strongerAttrAry[attrIdx];
        //     if (attrValue > 0) {
        //         this.attributes[i] = Tool.toInt(this.attributes[i] * (1 + attrValue / GameDefine.GAME_ADD_RATIO));
        //     }
        // }

        // for (let attrIdx = 0; attrIdx < ATTR_TYPE.SIZE; ++attrIdx) {
        //     // let attrValue: number = this.attributes[attrIdx];
        //     // if (attrValue > 0) {
        // this.attributes[attrIdx] = Tool.toInt(this.attributes[attrIdx] * (1 + GameDefine.ZHUANSHENG_PLUS[this.coatardLv] / GameDefine.GAME_ADD_RATIO));
        //     // }
        // }



        var tempFighting: number = 0;
        //技能战力
        for (var i = 0; i < SkillDefine.SKILL_NUM; ++i) {
            tempFighting += SkillDefine.getSkillFighting(this.skills[i].level, this.skills[i].grade);
        }


        tempFighting += GameCommon.calculationFighting(this.attributes);
        //玩家战力
        tempFighting += playerFighting;

        this.figthPower = tempFighting;
        return this.figthPower;
    }
    /**获取祝福值属性**/
    public getBlessAttrByType(blesstype: BLESS_TYPE): number[] {
        let attrs: number[] = GameCommon.getInstance().getAttributeAry();
        let addAttrs: number[] = GameCommon.getInstance().getAttributeAry();//加成
        let blessData: BlessData = this.blessinfos[blesstype];
        //祝福值属性
        let blessmodel: Modelmount = DataManager.getInstance().blessManager.getBlessModelByData(blessData);
        if (blessmodel) {
            //祝福值基础属性
            for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
                let bless_val: number = blessmodel.attrAry[i];
                if (bless_val > 0) {
                    attrs[i] += bless_val;
                    //分享大师加成
                    let share_plus_val: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByBlessType(blesstype);
                    if (share_plus_val > 0) {
                        attrs[i] += Tool.toInt(bless_val * share_plus_val / GameDefine.GAME_ADD_RATIO);
                    }
                }
            }
            //祝福值技能属性
            var skills: ModelmountSkill[] = DataManager.getInstance().blessManager.skillModels(blessData.type);
            for (let i = 0; i < skills.length; ++i) {
                let skillModel: ModelmountSkill = skills[i];
                let blessSkillData: BlessSkillData = this.getBlessSkill(skillModel.id);
                if (blessSkillData) {
                    let skillAttrAry: number[] = DataManager.getInstance().blessManager.getSkillAttrByID(skillModel.id);
                    //技能基础属性
                    for (let j: number = 0; j < ATTR_TYPE.SIZE; ++j) {
                        if (skillAttrAry[j] > 0) {
                            attrs[j] += skillAttrAry[j];
                        }
                    }
                    //加成值
                    for (let j: number = 10; j < ATTR_TYPE.SIZE * 2; ++j) {
                        if (skillAttrAry[j] > 0) {
                            addAttrs[j % ATTR_TYPE.SIZE] += skillAttrAry[j];
                        }
                    }
                }
            }
            //祝福值丹药
            var mountDanCfg: ModelmountDan = DataManager.getInstance().blessManager.getblessDanModel(blessData.type, 0);
            for (let i = 0; i < mountDanCfg.attrAry.length; ++i) {
                if (mountDanCfg.attrAry[i] > 0) {
                    attrs[i] += mountDanCfg.attrAry[i] * blessData.danDic[0];
                    addAttrs[i] += mountDanCfg.harm * blessData.danDic[0];
                }
            }
            var mountDanCfg: ModelmountDan = DataManager.getInstance().blessManager.getblessDanModel(blessData.type, 1);
            for (let i = 0; i < mountDanCfg.attrAry.length; ++i) {
                // if (mountDanCfg.attrAry[i] > 0) {
                // attrs[i] += mountDanCfg.attrAry[i]**blessData.danDic[1];
                addAttrs[i] += mountDanCfg.harm * blessData.danDic[1];
                // }
            }
            //技能基础属性
            // var modelCfg = DataManager.getInstance().blessManager.getblessDanModel(blessData.type, 0);
            // var plusModelCfg = DataManager.getInstance().blessManager.getblessDanModel(blessData.type, 1);
            // var lvNum = this.parseBlessDan(blessData.type + 1);
            // for (let j:number = 0; j < ATTR_TYPE.SIZE; ++j) {
            //     if (modelCfg.attrAry[j] > 0&&lvNum>0) {
            //         attrs[j] += modelCfg.attrAry[j] * lvNum;
            //     }
            // }
            // lvNum = this.parseBlessDan(blessData.type + 11);
            // //加成值
            // for (let j:number = 10; j < ATTR_TYPE.SIZE * 2; ++j) {
            //     if (lvNum>0) {
            //         addAttrs[j % ATTR_TYPE.SIZE] += plusModelCfg.plus * lvNum;
            //     }
            // }
            //祝福值装备属性
            let equipAry: ServantEquipThing[] = this.blessEquipDict[blesstype];
            for (let i = 0; i < equipAry.length; ++i) {
                let servantEquip: ServantEquipThing = equipAry[i];
                if (servantEquip) {
                    let model: ModelmountEquipment = JsonModelManager.instance.getModelmountEquipment()[servantEquip.modelId];
                    for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
                        if (model.attrAry[j] > 0) {
                            attrs[j] += model.attrAry[j];
                        }
                    }
                }
            }


            //祝福值强化属性
            // let blessslotAry: Array<ServantEquipSlot> = this.blessEquipSlotDict[blesstype];
            // for (let i = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; ++i) {
            //     let servantEquipSlot: ServantEquipSlot = blessslotAry[i];
            //     if (servantEquipSlot) {
            //         let qianghua: ModelmountEqianghua = JsonModelManager.instance.getModelmountEqianghua()[i][servantEquipSlot.intensifyLv - 1];
            //         if (!qianghua) continue;
            //         for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
            //             if (qianghua.attrAry[j] > 0) {
            //                 attrs[j] += qianghua.attrAry[j];
            //             }
            //         }
            //     }
            // }
            //强化大师绝对值
            let dashiModel: Modelqianghuadashi = DataManager.getInstance().strongerManager.getJiHuoModelByType(Number(blesstype));
            if (dashiModel) {
                for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
                    if (dashiModel.attrAry[j] > 0) {
                        attrs[j] += dashiModel.attrAry[j];
                    }
                }
                if (dashiModel.plusType == 0) {
                    for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
                        var keystr: string = GameDefine.getAttrPlusKey(j + ATTR_TYPE.SIZE);
                        if (dashiModel && dashiModel[keystr]) {
                            addAttrs[j] = addAttrs[j] + dashiModel[keystr];//万分级
                        }
                    }
                }
            }
            // 觉醒加成
            if (this.blessWakeLevel[blesstype] > 0) {
                let bfb: number = DataManager.getInstance().blessManager.getBlessJueXingValue()[this.blessWakeLevel[blesstype] - 1];
                for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
                    addAttrs[i] += bfb;
                }
            }
            //加成值计算 万分级
            for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
                if (attrs[i] > 0 && addAttrs[i]) {
                    attrs[i] += Tool.toInt(addAttrs[i] * attrs[i] / GameDefine.GAME_ADD_RATIO);
                }
            }
        }
        return attrs;
    }
    public updateSkillLevel(skillIndex: number, level: number): void {
        var skillInfo: SkillInfo = this.skills[skillIndex];
        skillInfo.level = level;
        this.updateSkillDamage(skillIndex);
    }

    public updateSkillGrade(skillIndex: number, grade: number): void {
        var skillInfo: SkillInfo = this.skills[skillIndex];
        skillInfo.grade = grade;
        this.updateSkillDamage(skillIndex);
    }

    public updateSkillSkin(skillIndex: number, skinIdx: number): void {
        var skillInfo: SkillInfo = this.skills[skillIndex];
        skillInfo.styleNum = skinIdx;
    }

    private updateSkillDamage(skillIndex: number): void {
        var add_damage: number = 0;
        var skillInfo: SkillInfo = this.skills[skillIndex];
        var skilldmg: Modelskilldmg = JsonModelManager.instance.getModelskilldmg()[skillInfo.level - 1];
        if (skilldmg) {
            add_damage += skilldmg ? skilldmg["skill" + skillInfo.id] : 0;
        }
        var tuposkillDmgs = JsonModelManager.instance.getModelskilltupo()[skillInfo.id];
        for (var idx in tuposkillDmgs) {
            var tupomodel: Modelskilltupo = tuposkillDmgs[idx];
            if (tupomodel.tupoLv == skillInfo.grade) {
                add_damage += tupomodel.effect;
            }
        }
        skillInfo.addDamage = add_damage;
    }
    /*当前注灵槽位置获取      nts  infuseSoul     */
    public get currInfuseSoul() {
        var curr;
        var before;
        var param;
        for (var i = 0; i < this.equipSlotThings.length; i++) {
            before = this.equipSlotThings[i - 1 >= 0 ? i - 1 : this.equipSlotThings.length - 1].infuseLv;
            curr = this.equipSlotThings[i].infuseLv;
            if ((before > curr) || (before == curr && i == 0)) {
                return this.equipSlotThings[i];
            }
        }
    }
    /*当前强化槽位置获取      nts  infuseSoul     */
    public get currIntensify() {
        var curr;
        var before;
        var param;
        for (var i = 0; i < this.equipSlotThings.length; i++) {
            before = this.equipSlotThings[i - 1 >= 0 ? i - 1 : this.equipSlotThings.length - 1].intensifyLv;
            curr = this.equipSlotThings[i].intensifyLv;
            if ((before > curr) || (before == curr && i == 0)) {
                return this.equipSlotThings[i];
            }
        }
    }
    /*当前强化槽位置获取      nts  infuseSoul     */
    public get currGemInlay(): EquipSlotThing {
        var equipslot: EquipSlotThing = this.equipSlotThings[0];
        var compare = Tool.toInt(equipslot.gemLv / GameDefine.GEM_SLOT_NUM);
        for (var i = 0; i < this.equipSlotThings.length; i++) {
            var curr: number = Tool.toInt(this.equipSlotThings[i].gemLv / GameDefine.GEM_SLOT_NUM);
            if (curr < compare) {
                equipslot = this.equipSlotThings[i];
                break;
            }
        }
        return equipslot;
    }

    public parseInfuseSoul(slot, lv, exp) {
        this.equipSlotThings[slot].infuseLv = lv;
        this.equipSlotThings[slot].infuseExp = exp;
    }
    public parseZhuHun(slot, lv) {
        this.equipSlotThings[slot].zhLv = lv;
    }
    public parseIntensify(slot, lv) {
        this.equipSlotThings[slot].intensifyLv = lv;
    }
    public parseGemInlay(slot, lv) {
        this.equipSlotThings[slot].gemLv = lv;
    }
    public parseQuenching(slot, lv, exp) {
        this.equipSlotThings[slot].quenchingLv = lv;
        this.equipSlotThings[slot].quenchingExp = exp;
    }

    //获取对应槽位信息
    public getEquipSlotThings(slotIndex: number): EquipSlotThing {
        return this.equipSlotThings[slotIndex];
    }
    /**获得淬炼等级排序**/
    public getSortQuenching() {
        var arr: EquipSlotThing[] = this.equipSlotThings.concat();
        arr = arr.sort((n1, n2) => {
            if (n1.quenchingLv > n2.quenchingLv) {
                return 1;
            }
            if (n1.quenchingLv < n2.quenchingLv) {
                return -1;
            }
            return 0;
        });
        return arr;
    }
    /*获得注灵套装等级*/
    public getSuitInfuseSoulLv(): number {
        var lv = 0;
        lv = Math.max(this.equipSlotThings[0].infuseLv, lv);
        if (lv == 0) {
            return 0;
        }
        for (var i = 1; i < this.equipSlotThings.length; i++) {
            lv = Math.min(lv, this.equipSlotThings[i].infuseLv);
            if (lv == 0) {
                return 0;
            }
        }
        return lv;
    }
    /*获得强化套装等级*/
    public getSuitIntensifyLv(): number {
        var lv = 0;
        lv = Math.max(this.equipSlotThings[0].intensifyLv, lv);
        if (lv == 0) {
            return 0;
        }
        for (var i = 1; i < this.equipSlotThings.length; i++) {
            lv = Math.min(lv, this.equipSlotThings[i].intensifyLv);
            if (lv == 0) {
                return 0;
            }
        }
        return lv;
    }
    /**获得强化等级排序**/
    public getSortIntensify() {
        var arr: EquipSlotThing[] = this.equipSlotThings.concat();
        arr = arr.sort((n1, n2) => {
            if (n1.intensifyLv > n2.intensifyLv) {
                return 1;
            }
            if (n1.intensifyLv < n2.intensifyLv) {
                return -1;
            }
            return 0;
        });
        return arr;
    }
    /**获得宝石总等级**/
    public getGemTotalLv(): number {
        var total: number = 0;
        for (var i = 0; i < this.equipSlotThings.length; i++) {
            var slot: EquipSlotThing = this.equipSlotThings[i];
            total += slot.gemLv;
        }
        return total;
    }
    /**获得祝福值的战斗力**/
    public getBlessFightingByType(type: BLESS_TYPE): number {
        var blessAttrs: number[] = this.getBlessAttrByType(type);
        return GameCommon.calculationFighting(blessAttrs);
    }
    /*经脉升级*/
    public parsePulseUpdate(message: Message) {
        this.pulseLv = message.getShort();
    }
    /**时装技能更新**/
    public onUpdateFashionSkill(data: FashionData): void {
        if (!data || data.level == 0) return;
        let curFsData: FashionData = this.fashionSkils[data.type];
        let limitTime: number = -1;
        if (data.limitTime >= 0) {
            limitTime = Math.max(0, Math.ceil((data.limitTime - egret.getTimer()) / 1000));
            if (limitTime == 0) {
                if (curFsData && curFsData.id == data.id) {
                    delete this.fashionSkils[data.type];
                }
                return;
            }
        }
        if (curFsData) {
            if (curFsData.limitTime >= 0) {
                limitTime = Math.max(0, Math.ceil((curFsData.limitTime - egret.getTimer()) / 1000));
            }
            if (limitTime == 0 || curFsData.model.order < data.model.order) {
                this.fashionSkils[data.type] = data;
            }
        } else {
            this.fashionSkils[data.type] = data;
        }
    }
    /**自己的外形更新**/
    public updateAppear(): void {
        for (let i: number = 0; i < this.blessinfos.length; i++) {
            let blessdata: BlessData = this.blessinfos[i];
            if (this.fashionWearIds[blessdata.type]) {
                let wearfashionId: number = this.fashionWearIds[blessdata.type];
                let fashionmodel: Modelfashion = JsonModelManager.instance.getModelfashion()[wearfashionId];
                this._appears[i] = fashionmodel ? fashionmodel.waixing1 : -1;
            } else {
                if (blessdata.level == 0 && blessdata.grade == 0) {
                    this._appears[i] = GameDefine.PLAYER_DEFUALT_AVATAR[blessdata.type];
                } else {
                    this._appears[i] = 0;
                }
            }
        }
    }
    /**获取对应的祝福值外形**/
    public getAppearID(type: BLESS_TYPE): number {
        if (this.bodyType == BODY_TYPE.SELF && GameFight.getInstance().isJackaroo) {
            return GameDefine.JACKAROO_AVATAR[type] ? GameDefine.JACKAROO_AVATAR[type] : this._appears[type];
        }
        return this._appears[type];
    }
    /**设置外形**/
    public setAppear(playerAppear: AppearPlayerData): void {
        for (var i: number = 0; i < BLESS_TYPE.SIZE; i++) {
            this._appears[i] = playerAppear.appears[i];
        }
        this.titleId = playerAppear.titleId;
    }

    // public set vipExp(param: number) {
    //     this._vipExp = param;
    //     this.viplevel = GameCommon.getInstance().getVipLevel(param);
    // }
    // public get vipExp() {
    //     return this._vipExp;
    // }

    public onInitDominate(msg: Message, slot: number): void {
        var dominateThing: DominateThing = this.dominateTings[slot];
        if (dominateThing) {
            dominateThing.parseEquipMessage(msg);
            this.dominateTings[slot] = dominateThing;
        }
    }
    // 下行：  byte   哪个角色
    // byte   位置
    // short  阶
    public onParseDominateUpgrade(msg: Message): void {
        var slot: number = msg.getByte();
        this.dominateTings[slot].lv = msg.getShort();
    }

    public onParseDominateAdvance(msg: Message): void {
        var slot: number = msg.getByte();
        this.dominateTings[slot].tier = msg.getByte();
    }
    public getDominateThingBySlot(slot: number): DominateThing {
        return this.dominateTings[slot];
    }
    public onCheckFashion(): void {
        for (let fashionId in this.fashionDatas) {
            this.onCheckFashionByID(parseInt(fashionId));
            this.onUpdateFashionSkill(this.fashionDatas[fashionId]);
        }
    }
    /**检测时装剩余时间**/
    public onCheckFashionByID(id: number): void {
        if (this.bodyType != BODY_TYPE.SELF)
            return;

        let fashionData: FashionData = this.fashionDatas[id];
        if (fashionData && Tool.isNumber(fashionData.limitTime) && fashionData.limitTime > 0) {
            let limittime: number = fashionData.limitTime;
            limittime = Math.max(0, Math.ceil((limittime - egret.getTimer()) / 1000));
            if (limittime == 0) {
                delete this.fashionDatas[id];
                DataManager.getInstance().playerManager.player.updataAttribute();
            }
        }
    }
    public getUnionSkill2(skillId: number): UnionSkill2 {
        for (var i: number = 0; i < this.unionSkill2Array.length; ++i) {
            if (this.unionSkill2Array[i].id == skillId) {
                return this.unionSkill2Array[i];
            }
        }
        return null;
    }
    public parseBlessEquip(blesstype: BLESS_TYPE, message: Message): void {
        if (!this.blessEquipDict[blesstype]) {
            this.blessEquipDict[blesstype] = new Array<ServantEquipThing>();
        }
        var blessEquipAry: Array<ServantEquipThing> = this.blessEquipDict[blesstype];
        var mountEquipSize: number = message.getByte();
        for (var i = 0; i < mountEquipSize; ++i) {
            if (message.getBoolean()) {
                var servantEquipThing: ServantEquipThing;
                if (!blessEquipAry[i]) {
                    blessEquipAry[i] = new ServantEquipThing();
                }
                servantEquipThing = blessEquipAry[i];
                servantEquipThing.parseMessage(message);
            } else {
                blessEquipAry[i] = null;
            }
        }
    }
    public parseBlessEquipSlot(blesstype: BLESS_TYPE, message: Message): void {
        if (!this.blessEquipSlotDict[blesstype]) {
            this.blessEquipSlotDict[blesstype] = [];
        }
        var blessslotAry: Array<ServantEquipSlot> = this.blessEquipSlotDict[blesstype];
        for (var i = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; ++i) {
            var servantEquipSlot: ServantEquipSlot;
            if (!blessslotAry[i]) {
                blessslotAry[i] = new ServantEquipSlot(blesstype, i);
            }
            servantEquipSlot = blessslotAry[i];
            servantEquipSlot.parseMessage(message);
        }
    }
    /**--------------------外形相关-------------------------**/
    /**获取装备外形**/
    public get cloth_res(): string {
        return `r${this.sex}_cloth` + (this.getAppearID(BLESS_TYPE.CLOTHES) ? this.getAppearID(BLESS_TYPE.CLOTHES) : 0);
    }
    /**获取武器外形**/
    public get weapon_res(): string {
        return "weapon" + (this.getAppearID(BLESS_TYPE.WEAPON) ? this.getAppearID(BLESS_TYPE.WEAPON) : 0);
    }
    /**获取飞剑外形**/
    public get feijian_Res(): string {
        var feijianid: number = this._appears[BLESS_TYPE.HORSE];
        return feijianid < 0 || !Tool.isNumber(feijianid) ? "" : "jian" + this._appears[BLESS_TYPE.HORSE];
    }
    /**获取翅膀外形**/
    public get wing_res(): string {
        var wingresid: number = this.getAppearID(BLESS_TYPE.WING);
        return wingresid < 0 || !Tool.isNumber(wingresid) ? "" : "wing" + wingresid;
    }
    /**获取光环外形**/
    public get ring_res(): string {
        // var ringId: number = this.getAppearID(BLESS_TYPE.RING);
        // return ringId < 0 ? "" : "guanghuan_qicheng_" + ringId;
        return '';
    }
    /**获取法宝外形**/
    public get magic_res(): string {
        var magicID: number = this.getAppearID(BLESS_TYPE.MAGIC);
        return magicID < 0 || !Tool.isNumber(magicID) ? "" : "magic_" + magicID;
    }

    public get seniorEquipsPower(): number {
        let power = 0;
        var attr: number[] = GameCommon.getInstance().getAttributeAry();
        var equipAttr;
        let add: number;
        for (let i: number = 0; i < this.seniorEquips.length; i++) {
            let equipThing: EquipThing = this.seniorEquips[i];
            if (!equipThing || !equipThing.model)
                continue;
            equipAttr = equipThing.attributes;
            for (var n: number = 0; n < equipThing.attributes.length; n++) {
                add = equipAttr[n] + equipThing.addAttributes[n];
                attr[n] += add;
            }
        }
        return GameCommon.calculationFighting(attr);
    }

    public get qihunPower(): number {
        let power = 0;
        if (this.qihun > 0) {
            var attr: number[] = GameCommon.getInstance().getAttributeAry();
            var qihunModel: Modelqihun = JsonModelManager.instance.getModelqihun()[this.qihun];
            for (var i = 0; i < qihunModel.attrAry.length; i++) {
                attr[i] += qihunModel.attrAry[i];
            }
            return GameCommon.calculationFighting(attr);
        }
        return 0;
    }

    public get fourinagesPower(): number {
        let power = 0;
        for (var i: number = 0; i < Fourinages_Type.SIZE; i++) {
            power += this.fourinages[i].power;
        }
        return power;
    }
    /** 特殊效果 **/
    //麻痹生成 返回麻痹的时间
    public get mabiEffect(): number {
        this.use_mabi = egret.getTimer() + FightDefine.MABI_EFFECT_CD;
        let mabi_effect: number = 0;
        if (this.legendInfo[ARTIFACT_TYPE.ARTIFACT_MB]) {
            let mabi_lv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_MB];
            mabi_effect = LegendDefine.getLegendEffect(ARTIFACT_TYPE.ARTIFACT_MB, mabi_lv);
        }
        if (mabi_effect > 0 && GameFight.getInstance().artifactFackerScene) {
            return 100;
        }
        return mabi_effect;
    }
    //获取麻痹概率
    public get mabiRatio(): number {
        let mabi_ratio: number = 0;
        if (this.use_mabi >= egret.getTimer()) return mabi_ratio;
        if (this.legendInfo[ARTIFACT_TYPE.ARTIFACT_MB]) {
            let mabi_lv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_MB];
            mabi_ratio = LegendDefine.getLegendRatio(ARTIFACT_TYPE.ARTIFACT_MB, mabi_lv);
        }
        return mabi_ratio;
    }
    //沉默生成
    public get chenmoEffect(): number {
        this.use_chenmo = egret.getTimer() + FightDefine.CHENMO_EFFECT_CD;
        let chenmo_effect: number = 0;
        if (this.legendInfo[ARTIFACT_TYPE.ARTIFACT_CM]) {
            let chenmo_lv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_CM];
            chenmo_effect = LegendDefine.getLegendEffect(ARTIFACT_TYPE.ARTIFACT_CM, chenmo_lv);
        }
        if (chenmo_effect > 0 && GameFight.getInstance().artifactFackerScene) {
            return 100;
        }
        return chenmo_effect;
    }
    //获取沉默概率
    public get chenmoRatio(): number {
        let chenmo_ratio: number = 0;
        if (this.use_chenmo >= egret.getTimer()) return chenmo_ratio;
        if (this.legendInfo[ARTIFACT_TYPE.ARTIFACT_CM]) {
            let chenmo_lv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_CM];
            chenmo_ratio = LegendDefine.getLegendRatio(ARTIFACT_TYPE.ARTIFACT_CM, chenmo_lv);
        }
        return chenmo_ratio;
    }
    //刷新复活次数
    public refreshRebornEft(): void {
        if (this.legendInfo && this.legendInfo[ARTIFACT_TYPE.ARTIFACT_FH]) {
            this.reborncount = 1;
        }
    }
    //复活效果
    public get rebornEffect(): number {
        if (this.legendInfo && this.legendInfo[ARTIFACT_TYPE.ARTIFACT_FH]) {
            let fuhuo_lv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_FH];
            return LegendDefine.getLegendEffect(ARTIFACT_TYPE.ARTIFACT_FH, fuhuo_lv);
        }
        return 0;
    }
    //刷新护盾效果
    public refreshShieldEft(): void {
        if (GameFight.getInstance().showShieldScene) {
            this.shieldValue = Tool.toInt(this.maxHp * this.shieldEffect / GameDefine.GAME_ADD_RATIO);
        } else {
            this.shieldValue = 0;
        }
    }
    //护盾效果
    public get shieldEffect(): number {
        if (this.legendInfo && this.legendInfo[ARTIFACT_TYPE.ARTIFACT_HD]) {
            let artifactLv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_HD];
            return LegendDefine.getLegendEffect(ARTIFACT_TYPE.ARTIFACT_HD, artifactLv);
        }
        return 0;
    }
    //破甲效果
    public get pojiaEffect(): number {
        let pojiaValue: number = 0;
        if (this.legendInfo[ARTIFACT_TYPE.ARTIFACT_PJ]) {
            let artifactLv: number = this.legendInfo[ARTIFACT_TYPE.ARTIFACT_PJ];
            pojiaValue = LegendDefine.getLegendEffect(ARTIFACT_TYPE.ARTIFACT_PJ, artifactLv);
        }
        return pojiaValue;
    }
    public fulingParse(msg: Message): void {
        for (var i = 0; i < 7; i++) {
            this.fuling[i] = msg.getLong();
            Tool.log(this.fuling[i])
        }
    }
    public yuanJieParse(msg: Message): void {
        for (var i = 0; i < GameDefine.YUANJIE_ATTR.length; i++) {
            this.yuanjie[i] = msg.getLong();
        }
        DataManager.getInstance().yuanjieManager.yjExp = msg.getLong();
    }
    //The end
}