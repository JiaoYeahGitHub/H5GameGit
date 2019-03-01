/**
 * 
 * @author 
 * 
 */
class Player implements IPlayerInfo {

	public sex: number;
	//已作废
	public anima: number; //灵气
	public rongyu: number;//功勋
	//已作废
	public points: number;//积分
	public donate: number = 0;//帮会贡献
	//已作废
	public savvy: number = 0;//悟性
	/**修为**/
	public vigour: number = 0;//修为
	//已作废
	public rebirthLv: number = 0;//转生等级
	/**限时积分**/
	public tlIntegral: number = 0;
	/**当前野外关卡奖励领取到第几关**/
	public yewaiAwardWave: number;
	/**商城积分 */
	public shoppoint: number = 0;
	public createTime: number;	//建角时间(毫秒)
	public currentTime: number;	//当前时间(毫秒)
	private _serverDay: number;	//开服时间（天）
	public signTime: number;
	public noviceGuide: number[];
	public onlineGift: number;
	public onlineGiftTime: number;
	public onlineGiftTimeStamp: number;
	private _level: number;
	public id: number = -1;
	public name: string = "";
	public headIndex: number;//头像编号
	public headFrameIndex: number = 1;//头像框编号
	public headMap: any;// 头像数据
	public headFrameMap: any;// 头像框数据
	public loginCode: number = 0;
	public exp: number;
	public zhuanshengID: number = 0;//转生ID
	public gold: number;//钻石
	public money: number;//元宝
	public arena: number;//竞技点
	public smelt: number;//幻气值
	public zhangong: number;// 战功
	public shengwang: number;//声望
	// public zhulibi: number;// 助力币
	public jianchiExp: number = 0;//剑池经验
	public jianchiLevel: number = 0;//剑池宝箱领取
	public magicLv: number;//法宝等级
	public magicLvExp: number;//法宝等级经验
	public magicTier: number;//法宝阶数
	public magicTierStar: number;//法宝阶数星级
	public _vipExp: number = 0;
	public viplevel: number = 0;
	// public superInvincibleCard: number = 0;//超级无敌月卡
	public remainExchageVigourTime: number = 0;
	public zhuxianIndex: number = 0;//诛仙台打到了第几关
	public treasureFirst: number = 0;//寻宝十连抽 0--第一次 1--已经抽过
	public outBoundPetID: number = 0;
	public vipgodArtifactDict;//VIP神器
	private _fateIndex: number = 0;
	public fates: FateBase[];
	public petData: PetData;
	public sendDesk: number = 0;
	public giftState: number = 0;
	public giftReward: AwardItem[] = [];
	public xianDans: XianDanInfo[];
	public xianDanRolls: XianDanRollData[];
	public xinfaDataAry;
	public yueli: number;//阅历
	public shareExp: number;//分享经验
	public shareMasterId: number;//分享大师ID
	public wxcolletion: boolean;//微信收藏
	// public fahunPoints: number = 0;//技能法魂积分
	public chengjiuExp: number = 0;
	public chengjiuLvDict = {};
	private _playerdatas: PlayerData[];
	private legendQueue: LegendData[];
	public wanbaVip: boolean;

	public ringLvs: number[] = [];
	public treeLv: number = 0;
	public treeExp: number = 0;
	public treeId: number = 0;
	public marriId: number = 0;
	public marriedTreeExp: number = 0;
	public marry_divorce: number = 0;

	public marryEquipSuitLvs: number[] = [];
	public strongerDict: StrongerData[] = [];
	public constructor() {
		this._playerdatas = [];
	}

	public parsePlayerMessage(message: Message): void {
		this.id = message.getInt();
		this.loginCode = message.getShort();
		this.name = message.getString();
		this.headIndex = message.getByte();
		this.headFrameIndex = message.getByte();
		this.zhuanshengID = message.getShort();
		this.exp = message.getLong();
		this.level = message.getShort();
		this.money = message.getLong();
		this.gold = message.getInt();
		GameFight.getInstance().yewaiMapId = message.getShort();
		GameFight.getInstance().yewai_waveIndex = message.getShort();
		GameFight.getInstance().yewai_batch = message.getByte();

		this.smelt = message.getInt();//幻气值
		/**神器解析**/
		this.legendQueue = [];
		for (var j: number = 1; j <= LegendDefine.Legend_Num; j++) {
			this.legendQueue[j] = new LegendData();
			this.legendQueue[j].index = j;
		}
		this.parseLegend(message);

		this.parseJianchiUpdate(message);
		this.rongyu = message.getInt();
		this.arena = message.getInt();
		this.vipExp = message.getInt();
		// this.superInvincibleCard = message.getByte();
		this.createTime = message.getLong();
		this.currentTime = message.getLong();
		this._serverDay = message.getShort();
		this.signTime = egret.getTimer();
		this.points = message.getInt();

		DataManager.getInstance().psychManager.parsePsych(message);
		//通关奖励
		this.yewaiAwardWave = message.getShort();
		// var passRewardeds: number[] = [];
		// for (var i: number = 0; i < passSize; i++) {
		// 	var rewardedIndex: number = message.getShort();
		// 	passRewardeds.push(rewardedIndex);
		// }
		// for (var i: number = 0; i < ModelManager.getInstance().modelPassreward.length; i++) {
		// 	var model: ModelPassAward = ModelManager.getInstance().modelPassreward[i];
		// 	if (passRewardeds.indexOf(model.id) < 0) {
		// 		if (model.id < GameFight.getInstance().yewaiMapId)
		// 			model.status = 1;
		// 		else
		// 			model.status = 0;
		// 	} else {
		// 		model.status = 2;
		// 	}
		// }
		this.noviceGuide = [];
		var guideSize = message.getByte();
		for (var i = 0; i < guideSize; ++i) {
			this.noviceGuide.push(message.getByte());
		}
		this.donate = message.getInt();
		this.vigour = message.getInt();
		this.shengwang = message.getInt();
		//开启外形ID
		// this.data.huanhuaInfo = [];
		// var openhuanhuaSize: number = message.getByte();
		// for (var i: number = 0; i < openhuanhuaSize; i++) {
		// 	this.data.huanhuaInfo.push(message.getByte());
		// }
		// this.initHuanhuaAvata(message);
		this.tlIntegral = message.getInt();

		this.shoppoint = message.getInt();
		this.initMagicMessage(message);
		this.zhuxianIndex = message.getShort();
		this.treasureFirst = message.getByte();

		//解析宠物数据
		this.petData = new PetData();
		let petbo: boolean = message.getBoolean()
		if (petbo) {
			this.petData.onParseMessage(message);
			for (var i: number = 0; i < 4; i++) {
				var num: number = message.getLong();
				this.petData.proArr[i] = num;
			}
			this.petData.danDic[1] = message.getShort();
			this.petData.danDic[2] = message.getShort();
		}
		// this.outBoundPetID = message.getByte();
		// if (this.pets[this.outBoundPetID]) {
		// 	this.pets[this.outBoundPetID].isOutBound = true;
		// }
		this.fateIndex = message.getByte();
		this.fates = [];
		var fateSize = message.getByte();
		for (var i = 0; i < fateSize; i++) {
			var id = message.getInt();
			this.fates[id] = new FateBase()
			this.fates[id].parseInit(id, message);
			this.fates[id].slot = 0;
		}
		DataManager.getInstance().vipManager.onParseInit(message);
		var pill: number = message.getShort();
		var pillRollSize = message.getByte();
		this.xianDanRolls = [];
		for (var i = 0; i < pillRollSize; i++) {
			var id = message.getShort();
			this.xianDanRolls[id] = new XianDanRollData()
			this.xianDanRolls[id].onParseXianDanInitMsg(id, message);
		}
		var pillSize = message.getByte();
		this.xianDans = [];
		for (var i = 0; i < pillSize; i++) {
			var id = message.getShort();
			this.xianDans[id] = new XianDanInfo()
			this.xianDans[id].onParseXianDanInitMsg(id, message);
		}
		DataManager.getInstance().xiandanManager.energy = message.getInt();
		DataManager.getInstance().xiandanManager.yilingEnergy = message.getShort();
		DataManager.getInstance().xiandanManager.curLayer = pill;
		DataManager.getInstance().arenaManager.isWorship = message.getBoolean();

		//解析vip神器
		this.vipgodArtifactDict = {};
		let vipgodsize: number = message.getByte();
		for (var i = 0; i < vipgodsize; i++) {
			let aritfactID: number = message.getByte();
			this.vipgodArtifactDict[aritfactID] = new LegendData();
			this.vipgodArtifactDict[aritfactID].index = aritfactID;
			this.vipgodArtifactDict[aritfactID].lv = message.getShort();
		}

		//技能心法积分
		this.yueli = message.getInt();
		// 头像、头像框数据
		this.parseHead(message);
		// pvp经验
		DataManager.getInstance().pvpManager.parseInit(message);
		this.zhangong = message.getInt();

		this.chengjiuExp = message.getInt();
		let chengjiuLen = message.getShort()
		for (var i = 0; i < chengjiuLen; i++) {
			this.chengjiuLvDict[message.getShort()] = 1;
		}
		// 结婚系统
		this.marriId = message.getInt();
		this.marry_divorce = message.getByte();
		this.marriedTreeExp = message.getInt();
		//相思树
		this.parseMarrayTree(message)
		let tresize = message.getByte();
		for (var i = 0; i < tresize; i++) {
			this.ringLvs[i] = message.getInt();
		}
		// 结婚套装
		let tzSize = message.getByte();
		for (let i = 0; i < tzSize; ++i) {
			this.marryEquipSuitLvs[i] = message.getInt();
		}
		// 强化大师
		let strongerSize = message.getByte();
		for (let i = 0; i < strongerSize; ++i) {
			var stData: StrongerData = new StrongerData();
			stData.type = message.getByte();
			stData.onParseLvMsg(message);
			this.strongerDict[stData.type] = stData;
		}
		// 分享货币
		this.shareExp = message.getInt();
		// 分享大师ID
		this.shareMasterId = message.getShort();
		// 风云微信游戏收藏
		this.wxcolletion = message.getBoolean();
		//助力币
		// this.zhulibi = message.getInt();

		this.xinfaDataAry = [];
		var size: number = message.getByte(); //角色数量
		for (var i = 0; i < size; i++) {
			this.addPlayerData(message, i);
		}
		if (this._playerdatas[0] && this.petData.lv > 0) {
			this._playerdatas[0].petGrade = this.petData.grade;
		}
		this._isInitRefreshAttr = false;
		this.updataAttribute();
	}
	private parseHead(message: Message) {
		this.headMap = {};
		let size = message.getByte();
		for (let i = 0; i < size; ++i) {
			let id = message.getByte();
			this.headMap[id] = message.getShort();
		}
		this.headFrameMap = {};
		size = message.getByte();
		for (let i = 0; i < size; ++i) {
			let id = message.getByte();
			this.headFrameMap[id] = message.getShort();
		}
	}
	public parseHeadUp(message: Message) {
		let id = message.getByte();
		this.headMap[id] = message.getShort();
		this.updataAttribute();
	}
	public parseHeadFrameUp(message: Message) {
		let id = message.getByte();
		this.headFrameMap[id] = message.getShort();
		this.updataAttribute();
	}
	public getHeadLevel(id): number {
		if (this.headMap[id]) {
			return this.headMap[id];
		}
		return 0;
	}
	public getHeadFrameLevel(id): number {
		if (this.headFrameMap[id]) {
			return this.headFrameMap[id];
		}
		return 0;
	}
	//增加一个新角色
	private addPlayerData(message: Message, playerIndex: number): void {
		var occupation: number = message.getByte();
		this.sex = message.getByte();
		// if (!this._playerdatas[playerIndex]) {
		this._playerdatas[playerIndex] = new PlayerData(occupation + 1, BODY_TYPE.SELF);
		this._playerdatas[playerIndex].index = playerIndex;
		this._playerdatas[playerIndex].name = this.name;
		this._playerdatas[playerIndex].sex = this.sex;
		this._playerdatas[playerIndex].headiconIdx = this.headIndex;
		this._playerdatas[playerIndex].headFrame = this.headFrameIndex;
		this._playerdatas[playerIndex].playerId = this.id;
		let zhuanshengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.zhuanshengID];
		this._zhuanshengLv = zhuanshengCfg.zhuansheng;
		this._duanweiLv = zhuanshengCfg.duanwei;
		this._playerdatas[playerIndex].coatardLv = this._zhuanshengLv;
		// }
		this.parsePlayerMsg(this.playerDatas[playerIndex], message);
	}

	//解析单个的角色数据
	public parsePlayerMsg(playerdata: PlayerData, message: Message): void {
		//装备列表
		for (var i: number = 0; i < MASTER_EQUIP_TYPE.SIZE; i++) {
			var hasEquip: boolean = message.getBoolean();
			if (hasEquip)
				playerdata.onInitEquip(message, i);
		}
		//红装装备列表
		for (var i: number = 0; i < MASTER_EQUIP_TYPE.SIZE; i++) {
			var hasEquip: boolean = message.getBoolean();
			if (hasEquip)
				playerdata.onInitSeniorEquip(message, i);
		}
		//金装装备列表
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			var hasEquip: boolean = message.getBoolean();
			if (hasEquip)
				playerdata.onInitGoldEquip(message, i);
		}
		//技能列表
		var skillSize = message.getByte();//技能数量
		for (var i: number = 0; i < skillSize; i++) {
			this.updateOneISkill(playerdata, i, message.getShort());
			playerdata.updateSkillGrade(i, message.getShort());
			playerdata.updateSkillSkin(i, message.getShort());
		}

		var dominateLen = message.getByte();//主宰装备信息长度
		for (var i: number = 0; i < dominateLen; i++) {
			playerdata.onInitDominate(message, i);
		}
		//装备
		var equipSlotNum: number = GameDefine.Equip_Slot_Num;
		//装备槽信息
		for (var i: number = 0; i < equipSlotNum; i++) {
			playerdata.onInitEquipSlot(message, i);
		}
		//经脉
		playerdata.pulseLv = message.getShort();
		//特殊装备
		for (var i: number = 0; i < Fourinages_Type.SIZE; i++) {
			var fourinage: FourinageData = new FourinageData(i);
			fourinage.parseMsg(message);
			playerdata.fourinages[i] = fourinage;
		}
		//祝福值
		for (var i: number = 0; i < BLESS_TYPE.SIZE; i++) {
			var blessdata: BlessData = new BlessData(i);
			blessdata.parseMsg(message);
			playerdata.blessinfos[i] = blessdata;
			playerdata.parseBlessEquip(i, message);
			playerdata.parseBlessEquipSlot(i, message);
			var b_skill_size: number = message.getByte();
			for (let n: number = 0; n < b_skill_size; n++) {
				var blessSkillData: BlessSkillData = new BlessSkillData(i);
				blessSkillData.parseMsg(message);
				playerdata.blessSkillsDict[blessSkillData.id] = blessSkillData;
			}
			var dansize: number = message.getByte();
			for (let n: number = 0; n < dansize; n++) {
				blessdata.danDic[n] = message.getShort();
			}
			playerdata.blessWakeLevel[i] = message.getShort();
		}
		//元神
		var psychSlotNum: number = message.getByte();
		for (var i: number = 0; i < psychSlotNum; i++) {
			playerdata.onParsePsychEquip(message);
		}
		//时装
		var len = message.getByte();
		for (var i: number = 0; i < len; i++) {
			var _fashionData: FashionData = new FashionData();
			_fashionData.parseMsg(message);
			playerdata.fashionDatas[_fashionData.id] = _fashionData;
			if (_fashionData.isWear) {
				playerdata.fashionWearIds[_fashionData.type] = _fashionData.id;
			}
			playerdata.onUpdateFashionSkill(_fashionData);
		}
		//称号
		playerdata.titleId = message.getShort();
		//帮会技能
		var unionSkillSize: number = message.getByte();
		// playerdata.unionSkillArray = [];
		// for (var i: number = 0; i < unionSkillSize; i++) {
		// 	var unionSkill: UnionSkill = new UnionSkill();
		// 	unionSkill.parseMessage(message);
		// 	playerdata.unionSkillArray.push(unionSkill);
		// }
		// unionSkillSize = message.getByte();
		playerdata.unionSkill2Array = [];
		for (var i: number = 0; i < unionSkillSize; i++) {
			var unionSkill2: UnionSkill2 = new UnionSkill2();
			unionSkill2.parseMessage(message);
			playerdata.unionSkill2Array.push(unionSkill2);
		}
		//老功法 已弃用
		var gongfalen: number = message.getByte();
		for (var i = 0; i < gongfalen; i++) {
			// playerdata.onInitGongfa(message, i);
			message.getShort();//lv
		}

		for (var i: number = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
			playerdata.longhunAttribute[i] = message.getLong();
		}
		//五行
		playerdata.wuxingLevel = message.getShort();
		//器魂
		playerdata.qihun = message.getShort();
		//图鉴
		for (let tujianID in JsonModelManager.instance.getModeltujian()) {
			let tjmodel: Modeltujian = JsonModelManager.instance.getModeltujian()[tujianID];
			let tuJianData = new TuJianData(tjmodel);
			tuJianData.level = message.getShort();
			playerdata.tujianDataDict[tuJianData.id] = tuJianData;
		}
		//命格
		var fateSlotNum: number = message.getByte();
		for (var i: number = 0; i < fateSlotNum; i++) {
			playerdata.onParseFateEquip(message);
		}
		//神器
		for (var index in this.legendQueue) {
			var legendLv: number = this.legendQueue[index].lv;
			if (legendLv > 0) {
				this.getPlayerData().legendInfo[index] = legendLv;
			}
		}
		playerdata.fulingParse(message);
		//心法
		if (!this.xinfaDataAry[playerdata.index]) {
			this.xinfaDataAry[playerdata.index] = {};
		}
		let xinfaDict = this.xinfaDataAry[playerdata.index];
		for (let xinfaID in JsonModelManager.instance.getModeltujian2()) {
			let xinfamodel: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[xinfaID];
			let xinfaData: PlayerXinfaData = new PlayerXinfaData(xinfamodel.id);
			xinfaData.level = message.getShort();
			xinfaDict[xinfaData.id] = xinfaData;
		}

		//战纹
		for (var i: number = 0; i < 50; i++) {
			this.getPlayerData().rnuesList[i] = message.getShort();
		}

		// //祝福值双丹
		// for (var i: number = 1; i <= BLESS_TYPE.SIZE * 2; i++) {
		// 	var num: number = message.getShort();
		// 	this.getPlayerData().blessDanDict[i] = num;
		// }
		//天书
		let tianshu_size: number = message.getByte();
		for (var i: number = 0; i < tianshu_size; i++) {
			let tianshuId: number = message.getShort(); //ID
			if (!this.getPlayerData().tianshuDict[tianshuId]) {
				this.getPlayerData().tianshuDict[tianshuId] = new TianshuData();
			}
			let tianshuData: TianshuData = this.getPlayerData().tianshuDict[tianshuId];
			tianshuData.level = message.getInt(); //lv
			tianshuData.lvExp = message.getInt(); //lvExp
			tianshuData.grade = message.getInt(); //stage
		}
		// 元戒
		playerdata.yuanJieParse(message);
		//技能附魔
		let skillEnhantSize: number = message.getByte();
		for (let i: number = 0; i < skillEnhantSize; i++) {
			let skillEnhantData: SkillEnchantData = new SkillEnchantData();
			skillEnhantData.paraseMsg(message);
			playerdata.skillEnhantDict[skillEnhantData.id] = skillEnhantData;
		}
		let taozhuangSize: number = message.getByte();
		for (var i: number = 1; i <= taozhuangSize; i++) {
			let taozhuangLv: number = message.getInt(); //ID
			playerdata.taozhuangDict[i] = taozhuangLv;
		}

		/**更新角色外形**/
		playerdata.updateAppear();
	}
	public onParseRunesMsg(msg: Message): void {
		for (var i: number = 0; i < 50; i++) {
			this.getPlayerData().rnuesList[i] = msg.getShort();
		}
		this.updataAttribute();
	}
	/**开启角色 外部用**/
	public onParseOpenRoleMsg(msg: Message): void {
		var roleIndex: number = msg.getByte();
		var isNew: boolean = this.playerDatas.length <= roleIndex;
		this._isInitRefreshAttr = true;
		this.addPlayerData(msg, roleIndex);
		this._isInitRefreshAttr = false;
		this.updataAttribute();
		if (isNew) {
			// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_UPDATE_ROLELIST));
		}
	}

	public set level(value: number) {
		this._level = value;
	}

	public get level(): number {
		return this._level;
	}

	public get occupation(): number {
		return this._playerdatas[0].occupation;
	}

	//根据职业返回对应的人物数据
	public getPlayerDataByOccp(occupation: number = 0): PlayerData {
		var data: PlayerData;
		if (occupation == -1) {
			data = this._playerdatas[0];
		} else {
			for (var i: number = 0; i < this._playerdatas.length; i++) {
				if (occupation == this._playerdatas[i].occupation) {
					data = this._playerdatas[i];
					break;
				}
			}
		}
		return data;
	}
	//根据人物索引获取对应的角色数据
	public getPlayerData(index: number = 0): PlayerData {
		return this._playerdatas[index];
	}
	//获取所有觉得数据列表
	public get playerDatas(): PlayerData[] {
		return this._playerdatas;
	}
	//获取我当前等级的经验上限
	public get expMax(): number {
		return JsonModelManager.instance.getModellevelup()[this.level - 1].exp;
	}
	/*解析技能*/
	public parseSkillUp(message: Message): void {
		var idx: number = message.getByte();
		var skillIdx: number = message.getByte();
		var level: number = message.getShort();
		var data: number[] = [];
		data[0] = idx;
		for (var i: number = this._playerdatas[idx].skills.length; i > 0; --i) {
			data[i] = this._playerdatas[idx].skills[i - 1].level;
		}
		this.updateSkillUp(idx, skillIdx, level);
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message, data);
	}
	/*解析一键技能*/
	public parseSkillUpAuto(message: Message): void {
		var idx: number = message.getByte();
		for (var i: number = 0; i < this._playerdatas[idx].skills.length; i++) {
			var level: number = message.getShort();
			this.updateSkillUp(idx, i, level);
		}
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	private updateSkillUp(idx: number, skillIndex: number, level: number): void {
		this._playerdatas[idx].updateSkillLevel(skillIndex, level);
	}
	/**解析技能升段**/
	public updateGradeSkill(message: Message): void {
		var idx: number = message.getByte();
		var skillIdx: number = message.getByte();
		var grade: number = message.getShort();
		this._playerdatas[idx].updateSkillGrade(skillIdx, grade);
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public parseBlessInfo(message: Message): void {
		var idx: number = message.getByte();
		var blesstype: number = message.getByte();
		var isBaoji: boolean = message.getBoolean();

		var blessData: BlessData = this.getPlayerData().blessinfos[blesstype];
		blessData.isBaoji = isBaoji;
		var beforeData: BlessData = new BlessData(blesstype);
		beforeData.level = blessData.level;
		beforeData.grade = blessData.grade;
		beforeData.exp = blessData.exp;
		beforeData.isBaoji = blessData.isBaoji;
		blessData.parseMsg(message);
		GameCommon.getInstance().receiveMsgToClient(message, beforeData);

		this.updataAttribute();
		this.getPlayerData().updateAppear();
		if (beforeData.grade < blessData.grade) {
			if (blesstype == BLESS_TYPE.RETINUE_CLOTHES) {
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PET_ENJOIN_MAP));
			}
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_AVATAR_UPDATE), { idx: idx, blesstype: blesstype });
		}
	}
	public parseBlessEquip(message: Message): void {
		var idx: number = message.getByte();
		var blesstype: number = message.getByte();
		this._playerdatas[idx].parseBlessEquip(blesstype, message);
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public parseBlessSkill(message: Message): void {
		let idx: number = message.getByte();
		var blessSkillData: BlessSkillData = new BlessSkillData(message.getByte());
		blessSkillData.parseMsg(message);
		this._playerdatas[idx].blessSkillsDict[blessSkillData.id] = blessSkillData;
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public parseBlessDan(message: Message): void {
		let idx: number = message.getByte();
		let blessType = message.getByte();
		let subtp = message.getByte();
		var blessData: BlessData = this.getPlayerData().blessinfos[blessType];
		var num: number = message.getShort();
		blessData.danDic[subtp] = num;

		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public parseBlessJuexing(message: Message): void {
		let idx: number = message.getByte();
		let blesstype: number = message.getByte();
		let level: number = message.getShort();
		this._playerdatas[idx].blessWakeLevel[blesstype] = level;
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public parseBlessEquipSlot(message: Message): void {
		let idx: number = message.getByte();
		let blesstype: number = message.getByte();
		let blessSlot: number = message.getByte();
		var blessslotAry: Array<ServantEquipSlot> = this.getPlayerData().blessEquipSlotDict[blesstype];
		if (blessslotAry[blessSlot]) {
			blessslotAry[blessSlot].parseMessage(message);
		}
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(message, message.getBoolean());
	}
	public parsInitiativeOneKeySkill(message: Message): void {
		var len = message.getShort();
		for (var i = 0; i < len; i++) {
			message.getShort();
			message.getShort();
		}
		this.updataAttribute();
	}
	public parsePassivityOneKeySkill(message: Message): void {
		// var len = message.getShort();
		// for (var i = 0; i < len; i++) {
		// 	this.updateOnePSkill(message.getByte(), message.getShort());
		// }
		// this.updataAttribute();
	}
	/*解析龙魂*/
	public parseLonghunChange(message: Message): void {
		var idx: number = message.getByte();
		for (var i: number = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
			this._playerdatas[idx].longhunAttribute[i] = message.getLong();
		}

		this.updataAttribute(true);
	}
	/**解析五行 */
	public parseWuxing(message: Message): void {
		var idx: number = message.getByte();
		this._playerdatas[idx].wuxingLevel = message.getShort();
	}
	/**解析器魂 */
	public parseQihun(message: Message): void {
		var idx: number = message.getByte();
		this._playerdatas[idx].qihun = message.getShort();
	}
	/**解析图鉴*/
	public parsrTujian(message: Message): void {
		let playerIdx: number = message.getByte();//第几个角色
		let id: number = message.getShort();
		let level: number = message.getShort();
		let tuJianData = this._playerdatas[playerIdx].tujianDataDict[id];
		if (tuJianData) {
			tuJianData.level = level;
			this.updataAttribute();
		}
	}
	/**心法相关内容**/
	//更新心法数据
	public updateXinfa(message: Message): void {
		let playerIdx: number = message.getByte();
		let xinfaDict = this.xinfaDataAry[playerIdx];
		let xinfaid: number = message.getShort();
		let xinfaData: PlayerXinfaData = xinfaDict[xinfaid];
		xinfaData.level = message.getShort();
		this.updataAttribute();
	}
	//获取对应角色上的心法 字典
	public getXinfaDataDict(playerIdx: number = 0): any {
		return this.xinfaDataAry[playerIdx];
	}
	/*更新单个主动技能*/
	private updateOneISkill(playerData: PlayerData, skillIndex: number, skillLv: number) {
		playerData.updateSkillLevel(skillIndex, skillLv);
	}
	/*更新单个被动技能*/
	// private updateOnePSkill(index, skillLv) {
	// 	this.data.onUpdateSkillsPassivity(index, skillLv);
	// }
	/*更新注灵信息*/
	// public updateInfuseSoulInfo(slot, lv) {
	// 	this._data.parseInfuseSoul(slot, lv);
	// }
	/*更新铸魂信息*/
	public updateZhuHunInfo(idx, slot, lv) {
		this.playerDatas[idx].parseZhuHun(slot, lv);
	}
	/**更新开启的幻化数据**/
	public updateHuanhuaInfo(huanhuaID: number): void {
		// if (this.data.huanhuaInfo.indexOf(huanhuaID) < 0) {
		// 	this.data.huanhuaInfo.push(huanhuaID);
		// 	this.updataAttribute();
		// }
	}
	/**更新四象升级属性**/
	public updateFourinageLevel(msg: Message): void {
		var playerIndex: number = msg.getByte();
		var type: Fourinages_Type = msg.getByte();
		var playerData: PlayerData = this.getPlayerData(playerIndex);
		playerData.fourinages[type].level = msg.getShort();
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**更新四象进阶属性**/
	public updateFourinageGrade(msg: Message): void {
		var playerIndex: number = msg.getByte();
		var type: Fourinages_Type = msg.getByte();
		var playerData: PlayerData = this.getPlayerData(playerIndex);
		playerData.fourinages[type].grade = msg.getShort();
		this.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**初始化幻化外形**/
	public initHuanhuaAvata(message: Message): void {
		//已幻化外形
		var huanhuas: number[] = [];
		var huanhuaSize: number = message.getByte();
		for (var i: number = 0; i < huanhuaSize; i++) {
			var huanhuaType: number = message.getByte();
			var huahuaId: number = message.getByte();
			huanhuas[huanhuaType] = huahuaId;
		}
		// this._data.setHuanhuaAppear(huanhuas);
	}
	public parseIntensify(message: Message) {
		var data = this.getPlayerData(message.getByte());
		var size = message.getByte();
		for (var i = 0; i < size; i++) {
			data.parseIntensify(message.getByte(), message.getInt());
		}
		//data.parseIntensify(message.getByte(), message.getInt());
		this.updataAttribute();
	}
	public parseInfuseSoul(message: Message) {
		var data = this.getPlayerData(message.getByte());
		var size = message.getByte();
		for (var i = 0; i < size; i++) {
			data.parseInfuseSoul(i, message.getInt(), message.getInt());
		}
		this.updataAttribute();
	}
	public parseZhunHun(message: Message) {
		this.updateZhuHunInfo(message.getByte(), message.getByte(), message.getByte());
		this.updataAttribute();
	}
	public parseGemInlay(message: Message) {
		// var data = this.getPlayerData(message.getByte());
		// data.parseGemInlay(message.getByte(), message.getInt());

		var data = this.getPlayerData(message.getByte());
		var size = message.getByte();
		for (var i = 0; i < size; i++) {
			data.parseGemInlay(message.getByte(), message.getInt());
		}

		this.updataAttribute();
	}
	public parseQuenching(message: Message) {
		var data = this.getPlayerData(message.getByte());
		data.parseQuenching(message.getByte(), message.getByte(), message.getInt());
		this.updataAttribute();
	}
	public parseFuling(message: Message) {
		this.getPlayerData(0).fulingParse(message);
		this.updataAttribute();
	}
	public parseYuanjie(message: Message) {
		this.getPlayerData(0).yuanJieParse(message);
		this.updataAttribute();
	}
	/*神器信息解析*/
	public parseLegend(msg: Message) {
		let len: number = msg.getByte();
		for (let i: number = 1; i <= len; i++) {
			let index: number = msg.getByte();
			let lv: number = msg.getShort();
			if (lv >= 1) {
				this.legendQueue[index].activate = 1;
			}
			this.legendQueue[index].lv = lv;
		}
	}
	private updateLegendInfo(index, lv): void {
		if (lv >= 1) {
			this.legendQueue[index].activate = 1;
		}
		this.legendQueue[index].lv = lv;
		this.getPlayerData().legendInfo[index] = lv;
	}
	/*神器激活*/
	public parseLegendActivate(msg: Message) {
		this.updateLegendInfo(msg.getByte(), 1);
		this.updataAttribute();
	}
	/*神器升级*/
	public parseLegendUpdate(msg: Message) {
		this.updateLegendInfo(msg.getByte(), msg.getShort());
		this.updataAttribute();
	}
	/**根据神器索引获取神器**/
	public getLegendBase(index) {
		return this.legendQueue[index];
	}
	/** 神器是否激活 */
	public isLegendActive(index: number): boolean {
		var legend: LegendData = this.getLegendBase(index);
		if (legend != null && legend.lv > 0) {
			return true;
		}
		return false;
	}
	/*经脉升级*/
	public parsePulseUpdate(message: Message) {
		var data = this.getPlayerData(message.getByte());
		data.parsePulseUpdate(message);
		this.updataAttribute();
	}

	/**剑池**/
	public parseJianchiUpdate(msg: Message): void {
		this.jianchiLevel = msg.getShort();
		this.jianchiExp = msg.getInt();
		this.updataAttribute();
	}

	public parseCoatard(msg: Message): void {
		this.zhuanshengID = msg.getShort();
		let zhuanshengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.zhuanshengID];
		this._zhuanshengLv = zhuanshengCfg.zhuansheng;
		this._duanweiLv = zhuanshengCfg.duanwei;
		for (var i: number = 0; i < this._playerdatas.length; i++) {
			this._playerdatas[i].coatardLv = this._zhuanshengLv;
		}
		DataManager.getInstance().bagManager.onupdateBestEquips();
		this.updataAttribute();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_LEVEL_UPDATE), true);
	}
	/**转生等级**/
	private _zhuanshengLv: number;
	public get coatardLv(): number {
		return this._zhuanshengLv;
	}
	/**段位等级**/
	private _duanweiLv: number;
	public get duanweiLv(): number {
		return this._duanweiLv;
	}

	/**帮会技能**/
	private isUnionSkillInit: boolean = false;
	public updateUnionSkill(): void {
		// this.data.unionSkills = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		// var hasSkill: boolean = false;
		// for (var key in ModelManager.getInstance().modelUnionSkill) {
		// 	var unionskillModel: ModelUnionSkill = ModelManager.getInstance().modelUnionSkill[key];
		// 	this.data.unionSkills[unionskillModel.attrType] = unionskillModel.level * unionskillModel.addAttr;
		// 	if (!hasSkill)
		// 		hasSkill = true;
		// }
		// if (hasSkill)
		// 	this.updataAttribute();
		this.isUnionSkillInit = true;
		this.updataAttribute();
	}
	/**诛仙台进度更新**/
	public updateZhuxianTai(passNum: number): void {
		if (this.zhuxianIndex != passNum) {
			this.zhuxianIndex = passNum;
			this.updataAttribute();
		}
	}
	/**获取玩家货币**/
	public getICurrency(type: number) {
		var param: number = 0;
		switch (type) {
			case GOODS_TYPE.SHENGWANG:
				param = this.shengwang;
				break;
			case GOODS_TYPE.ANIMA:
				param = this.anima;
				break;
			case GOODS_TYPE.GOLD:
				param = this.money;
				break;
			case GOODS_TYPE.DIAMOND:
				param = this.gold;
				break;
			case GOODS_TYPE.SHOJIFEN:
				param = this.shoppoint;
				break;
			case GOODS_TYPE.RONGYU:
				param = this.rongyu;
				break;
			case GOODS_TYPE.ARENA:
				param = this.arena;
				break;
			case GOODS_TYPE.HUANQI:
				param = this.smelt;
				break;
			case GOODS_TYPE.ZHANGONG:
				param = this.zhangong;
				break;
			case GOODS_TYPE.YUELI:
				param = this.yueli;
				break;
			// case GOODS_TYPE.ZHULIBI:
			// 	param = this.zhulibi;
			// 	break;
			case GOODS_TYPE.SHAREEXP:
				param = this.shareExp;
				break;
		}
		return param;
	}
	/**获取玩家总血量上限**/
	public getPlayerMaxHp(): number {
		var _maxHpValue: number = 0;
		for (var i: number = 0; i < this._playerdatas.length; i++) {
			_maxHpValue += this._playerdatas[i].maxHp;
		}
		return _maxHpValue;
	}
	/**获取玩家总战斗力**/
	public get playerTotalPower(): number {
		return this.figthPowerOld;
	}
	public riviseXianDan(message: Message): void {
		var bt = message.getInt();
		var id = message.getShort();


		if (bt == 10010) {
			var addNum: number = 0;
			if (this.xianDans[id] && this.xianDans[id].havepill > 0) {
				this.xianDans[id].shiyongNum = message.getInt();
				var num: number = 0;
				num = message.getInt();
				addNum = num - this.xianDans[id].havepill;
				this.xianDans[id].havepill = num;
			}
			else {
				this.xianDans[id] = new XianDanInfo()
				this.xianDans[id].onParseXianDanInitMsg(id, message);
				addNum = this.xianDans[id].havepill;
			}
			var danCfg: Modelxiandan = JsonModelManager.instance.getModelxiandan()[id];
			var mo: ModelThing = new ModelThing(danCfg, 24);
			GameCommon.getInstance().onGetThingAlert(mo, addNum, bt);
		}
		else {
			this.xianDans[id] = new XianDanInfo()
			this.xianDans[id].onParseXianDanInitMsg(id, message);
		}
		DataManager.getInstance().xiandanManager.curDanId = id;
		DataManager.getInstance().xiandanManager.danBtnStatus = true;
		this.updataAttribute();
	}
	public set fateIndex(idx: number) {
		this._fateIndex = idx;
	}
	public get fateIndex(): number {
		return this._fateIndex;
	}
	public getOnlineGiftCountDown(): number {
		return this.onlineGiftTime + (egret.getTimer() - this.onlineGiftTimeStamp) / 1000;
	}
	public onParseRebirthLv(msg: Message): void {
		this.rebirthLv = msg.getShort();
		this.updataAttribute();
		DataManager.getInstance().bagManager.onupdateBestEquips();
	}
	// 下行：  byte   哪个角色
	// byte   位置
	// short  阶
	// byte   1--成功  0--失败
	public onParseDominateUpgrade(msg: Message): void {
		var data = this.getPlayerData(msg.getByte());
		data.onParseDominateUpgrade(msg);
		this.updataAttribute();
	}

	public onParseDominateAdvance(msg: Message): void {
		var data = this.getPlayerData(msg.getByte());
		data.onParseDominateAdvance(msg);
		this.updataAttribute();
	}
	public parseSmelt(message: Message) {
		this.smelt = message.getInt();
	}
	//法宝信息
	public initMagicMessage(msg: Message): void {
		this.magicLv = msg.getShort();
		this.magicLvExp = msg.getByte();
		this.magicTier = msg.getShort();
		this.magicTierStar = msg.getByte();
	}
	public onParseMagicUpdate(msg: Message): void {
		this.magicLv = msg.getShort();
		this.magicLvExp = msg.getByte();
		this.updataAttribute();
	}
	public onParseMagicAdvance(msg: Message): void {
		this.magicTier = msg.getShort();
		this.magicTierStar = msg.getByte();
		this.updataAttribute();
		// if (FunDefine.isFunOpen(FUN_TYPE.FUN_MAGIC)) {
		// 	this._playerdatas[0].magicId = this.magicTier;
		// }
	}
	public get MagicLvKey(): string {
		return `${this.magicLv}_${this.magicLvExp}`;
	}
	public get MagicLvExp(): string {
		return `${this.magicLvExp}`;
	}
	public get MagicNextLvKey(): string {
		var lv: number = this.magicLv;
		if (lv == 0) {
			return `1_1`;
		}
		var exp: number = this.magicLvExp + 1;
		if (exp > 9) {
			exp = 0;
			lv += 1;
		}
		return `${lv}_${exp}`;
	}
	public get MagicTierKey(): string {
		return `${this.magicTier <= 0 ? 1 : this.magicTier}_${this.magicTierStar}`;
	}
	public get Magiclv(): string {
		return `${this.magicLv <= 0 ? 1 : this.magicLv}`;
	}
	public get MagicStar(): string {
		return `${this.magicTierStar}`;
	}
	public get MagicStarLv(): string {
		return `${this.magicTier}`;
	}
	public get MagicNextlv(): string {
		var lv: number = this.magicLv <= 0 ? 1 : this.magicLv;
		var exp: number = this.magicLvExp + 1;
		if (exp > 10) {
			exp = 0;
			lv += 1;
		}
		return `${lv}`;
	}
	public get MagicNextStar(): string {
		var exp: number = this.magicTierStar + 1;
		if (exp > 10) {
			exp = 0;
		}
		return `${exp}`;
	}
	public get MagicNextTierKey(): string {
		var lv: number = this.magicTier <= 0 ? 1 : this.magicTier;
		var exp: number = this.magicTierStar + 1;
		if (exp > 10) {
			exp = 0;
			lv += 1;
		}
		return `${lv}`;
	}
	/**获取等级描述**/
	public get playerLevelDesc(): string {
		return (this.rebirthLv > 0 ? `${this.rebirthLv}转` : "") + this.level + "级";
	}
	/**检查角色开启条件**/
	public onCheckRoleCanOpen(index: number): boolean {
		var canOpen: boolean = false;
		switch (index) {
			case 0:
				canOpen = true;
				break;
			case 1:
				canOpen = this.level >= 80 || this.viplevel >= 2;
				break;
			case 2:
				canOpen = this.rebirthLv >= 4 || this.viplevel >= 4;
				break;
		}
		return canOpen;
	}
	/**是否解锁**/
	public getPsychIsUnlockBySlot(slot: number): boolean {
		var condition = PsychDefine.UNLOCK_CONDITION[slot];
		for (var key in condition) {
			switch (key) {
				case "rebirth":
					if (this.coatardLv >= condition[key]) return true;
					break;
				case "vip":
					if (this.viplevel >= condition[key]) return true;
					break;
			}
		}
		return false;
		// return true;
	}
	public set vipExp(param: number) {
		this._vipExp = param;
		this.viplevel = GameCommon.getInstance().getVipLevel(param);
	}
	public get vipExp() {
		return this._vipExp;
	}
	public onParsePsychEquip(message: Message): void {
		var data = this.getPlayerData(message.getByte());
		data.onParsePsychEquip(message);
		this.updataAttribute();
	}
	public onParsePsychUpgrade(message: Message) {
		var data = this.getPlayerData(message.getByte());
		data.onParsePsychEquip(message);
		this.updataAttribute();
	}
	public onParseFateEquip(message: Message): void {
		var data = this.getPlayerData(message.getByte());
		data.onParseFateEquip(message);
		this.updataAttribute();
	}

	public onParseFateEquipRefresh(message: Message): void {
		var data = this.getPlayerData(message.getByte());
		data.onParseFateEquip(message);
		this.updataAttribute();
	}
	public onParseFateUpgrade(message: Message) {
		var lv = message.getShort()
		var id = message.getInt();
		let fateData: FateBase = new FateBase();
		fateData.parseInit1(id, message);
		//if (this.fates[id] && this.fates[id].UID == fateData.UID && fateData.slot == this.fates[id].slot && this.fates[id].modelID == fateData.modelID) {
		if (!DataManager.getInstance().fateManager.idEquip) {
			// this.fates[id]
			fateData.slot = 0;
			this.fates[id] = fateData;
		}
		else {
			var data = this.getPlayerData();
			data.onPreseFateLvUp(fateData);
		}
		this.updataAttribute();
	}
	public onGetFatelvUp(data: FateBase, pinzhi: number): number[] {
		var fateIds: number[] = [];
		for (let k in this.fates) {
			if (pinzhi == JsonModelManager.instance.getModelmingge()[this.fates[k].modelID].pinzhi) {
				if (k != data.UID.toString()) {
					fateIds.push(Number(k));
				}
				else if (data.exp != this.fates[k].exp || data.lv != this.fates[k].lv || this.fates[k].modelID != data.modelID || data.slot != this.fates[k].slot) {
					fateIds.push(Number(k));
				}
			}

		}
		return fateIds;
	}
	public onCleanFate(id: number): void {
		delete this.fates[id];
	}
	public parseFashionctive(message: Message): void {
		let idx: number = message.getByte();//第几角色
		let blesstype: number = message.getByte();
		let fashionId: number = message.getByte();
		let lefttime: number = message.getInt();
		let fashionData: FashionData = new FashionData();
		fashionData.id = fashionId;
		fashionData.limitTime = lefttime;
		fashionData.level = 1;
		let playerdata: PlayerData = this.playerDatas[idx];
		playerdata.fashionDatas[fashionId] = fashionData;
		playerdata.onUpdateFashionSkill(fashionData);

		this.updataAttribute();
	}
	public parseFasionShow(message: Message): void {
		let idx: number = message.getByte();
		let blesstype: number = message.getByte();
		let clothId: number = message.getByte();
		let playerdata: PlayerData = this.playerDatas[idx];
		if (playerdata.fashionWearIds[blesstype]) {
			let wearId: number = playerdata.fashionWearIds[blesstype];
			let oldwearFashion: FashionData = playerdata.fashionDatas[wearId];
			if (oldwearFashion) {
				oldwearFashion.isWear = false;
			}
		}
		if (clothId > 0) {
			let fashionData: FashionData = playerdata.fashionDatas[clothId];
			if (fashionData) {
				playerdata.fashionWearIds[fashionData.type] = clothId;
				fashionData.isWear = true;
				playerdata.fashionWearIds[blesstype] = clothId;
			} else {
				delete playerdata.fashionWearIds[blesstype];
			}
		} else {
			delete playerdata.fashionWearIds[blesstype];
		}

		this.getPlayerData().updateAppear();
	}
	//时装升级
	public parseFashionLvUp(message: Message): void {
		let idx: number = message.getByte();
		let blesstype: number = message.getByte();
		let clothId: number = message.getByte();
		let level: number = message.getShort();
		let playerdata: PlayerData = this.playerDatas[idx];
		let fashionData: FashionData = playerdata.fashionDatas[clothId];
		if (fashionData) {
			fashionData.level = level;
		}

		this.updataAttribute();
	}
	//解析相思树数据
	public parseMarrayTree(message) {
		this.treeId = message.getByte();
		if (this.treeId != 0) {
			this.treeLv = message.getShort();
			this.treeExp = message.getInt();
		}
		this.updataAttribute();
	}
	public getMarryRingAttributeAll(): number[] {
		let tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
		let models = JsonModelManager.instance.getModelhunjie();
		for (let k in models) {
			let model: Modelhunjie = models[k];
			let level = this.ringLvs[model.id - 1];
			if (level > 0) {
				let arrt: number[] = model.attrAry;
				for (var i = 0; i < arrt.length; ++i) {
					tempAttribute[i] += arrt[i] * level;
				}
			}
		}
		return tempAttribute;
	}
	public getMarryRingAttribute(id: number, level: number = -1): number[] {
		let model: Modelhunjie = JsonModelManager.instance.getModelhunjie()[id];
		if (model) {
			if (level == -1) {
				level = this.ringLvs[id - 1];
			}
			var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
			let arrt: number[] = model.attrAry;
			for (var i = 0; i < arrt.length; ++i) {
				tempAttribute[i] = arrt[i] * level;
			}
			return tempAttribute;
		}
		return null;
	}
	public getMarryEquipSuitAttrAll() {
		let tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for (let k in models) {
			let model: Modeljiehuntaozhuang = models[k];
			let level = this.marryEquipSuitLvs[model.id - 1];
			if (level > 0) {
				let arrt: number[] = model.attrAry;
				for (var i = 0; i < arrt.length; ++i) {
					tempAttribute[i] += arrt[i] * level;
				}
			}
		}
		return tempAttribute;
	}
	public getMarryEquipSuitAttr(id: number, level: number = -1): number[] {
		let model: Modeljiehuntaozhuang = JsonModelManager.instance.getModeljiehuntaozhuang()[id];
		if (model) {
			if (level = -1) {
				level = this.marryEquipSuitLvs[id - 1];
			}
			var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
			let arrt: number[] = model.attrAry;
			for (var i = 0; i < arrt.length; ++i) {
				tempAttribute[i] = arrt[i] * level;
			}
			return tempAttribute;
		}
		return null;
	}
	public getMarryEquipSuitAttrTZDSewzl() {// 套装大师额外战力
		let ringManager = DataManager.getInstance().ringManager;
		let types = ringManager.STRONGER_TYPES;
		let power = 0;
		for (let i = 0; i < types.length; ++i) {
			let id = i + 1;
			let modelTZDS: Modelqianghuadashi = ringManager.getQHDSModels(id)[0];
			if (modelTZDS) {
				let modelTsxg: Modelteshuxiaoguo = JsonModelManager.instance.getModelteshuxiaoguo()[modelTZDS.teshuxiaoguoId];
				if (modelTsxg) {
					power += modelTsxg.ewaizhanli;
				}
			}
		}
		return power;
	}
	public parseRingLevelup(msg: Message): void {
		this.ringLvs[msg.getShort() - 1] = msg.getInt();
		this.updataAttribute();
	}
	public parseMarryEquipSuitLevelup(msg: Message): void {
		this.marryEquipSuitLvs[msg.getShort() - 1] = msg.getInt();
		this.updataAttribute();
	}
	//升级称号
	public onParseTitle(msg: Message): void {
		DataManager.getInstance().titleManager.parseWear1(msg);
		this.updataAttribute();
	}
	//宠物升级信息
	public onParsePetUpdate(msg: Message) {
		this.petData.onParseLvMsg(msg);
		if (this._playerdatas[0] && this.petData.lv > 0) {
			this._playerdatas[0].petGrade = this.petData.grade;
		}
		this.updataAttribute();
	}
	//宠物升阶信息
	public onParsePetUpgrade(msg: Message): void {
		this.petData.onParseGradeMsg(msg);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PET_ENJOIN_MAP));//宠物出战
		this.updataAttribute();
	}
	/**---------天书----------**/
	//天书升级
	public parseTianshuLevelUpMsg(msg: Message): void {
		let playerIdx: number = msg.getByte();
		let tianshuID: number = msg.getShort();
		if (!this.getPlayerData().tianshuDict[tianshuID]) {
			this.getPlayerData().tianshuDict[tianshuID] = new TianshuData();
		}
		let tianshuData: TianshuData = this.getPlayerData().tianshuDict[tianshuID];
		let oldLevel: number = tianshuData.level;
		tianshuData.level = msg.getInt();
		tianshuData.lvExp = msg.getInt();
		if (oldLevel < tianshuData.level) {
			this.updataAttribute();
		}
	}
	//天书升阶
	public parseTianshuGradeMsg(msg: Message): void {
		let playerIdx: number = msg.getByte();
		let tianshuID: number = msg.getShort();
		let tianshuData: TianshuData = this.getPlayerData().tianshuDict[tianshuID];
		if (tianshuData) {
			tianshuData.grade = msg.getInt();
			this.updataAttribute();
		}
	}
	/**更新属性的方法**/
	private _isInitRefreshAttr: boolean = true;
	private figthPowerOld: number = 0;
	public updataAttribute(less: boolean = false): void {
		if (this._isInitRefreshAttr) {
			return;
		}
		var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
		var tempFighting: number = 0;

		//神器属性
		var addlegend = DataManager.getInstance().legendManager.getLegendPower();
		for (var i: number = 0; i < 9; ++i) {
			tempAttribute[i] += addlegend[i];
		}
		//神器战斗力加成
		for (var i = 1; i < 6; ++i) {
			if (this.getLegendBase(i) && this.getLegendBase(i).lv > 0) {
				let model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[i][this.getLegendBase(i).lv - 1];
				tempFighting += model.ewaizhanli;
			}
		}

		//剑池属性
		// if (this.jianchiLevel > 0) {
		// 	var jianchimodel: Modeljianchi = JsonModelManager.instance.getModeljianchi()[this.jianchiLevel - 1];
		// 	for (var key in jianchimodel.base_effect) {
		// 		if (jianchimodel.base_effect[key] > 0) {
		// 			tempAttribute[key] += jianchimodel.base_effect[key];
		// 		}
		// 	}
		// }

		//法宝属性
		if (this.magicLv > 0 && this.magicLvExp >= 0) {
			var modelMagicUpdate: Modelfabaoshengji = JsonModelManager.instance.getModelfabaoshengji()[this.Magiclv][this.magicLvExp];
			if (this.Magiclv == "1") {
				modelMagicUpdate = JsonModelManager.instance.getModelfabaoshengji()[this.Magiclv][Number(this.magicLvExp) - 1];

			}
			if (modelMagicUpdate) {
				for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
					tempAttribute[i] += modelMagicUpdate.attrAry[i];
				}
			}
		}
		if (this.magicTier > 0 && this.magicTierStar >= 0) {
			var modelMagicAdvance: Modelfabaojinjie = JsonModelManager.instance.getModelfabaojinjie()[this.MagicStarLv][this.MagicStar];
			if (modelMagicAdvance) {
				for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
					tempAttribute[i] += modelMagicAdvance.attrAry[i];
				}
			}
		}

		//称号
		for (var key in DataManager.getInstance().titleManager.titleMap) {
			var modelTitle: Modelchenghao = JsonModelManager.instance.getModelchenghao()[DataManager.getInstance().titleManager.titleMap[key].id];
			var titleAttrAry: number[] = GameCommon.getInstance().getAttributeAry(modelTitle);
			var titleData: TitleData = DataManager.getInstance().titleManager.getTitleData(DataManager.getInstance().titleManager.titleMap[key].id);
			for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
				tempAttribute[j] += titleAttrAry[j] * titleData.lv;
			}
		}
		//宠物战力加成
		var petData: PetData = this.petData;

		//宠物战力加成
		var petArrs: number[] = this.petData.petAtt;
		for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
			tempAttribute[j] += petArrs[j];
		}
		//转生属性
		var curZhuanShengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.zhuanshengID];
		if (curZhuanShengCfg) {
			var duanweiProStrs: string[] = [];
			if (curZhuanShengCfg.duanweiShuxing.indexOf("#") >= 0) {
				duanweiProStrs = curZhuanShengCfg.duanweiShuxing.split("#");
			}
			for (var j = 0; j < duanweiProStrs.length; ++j) {
				var proArr = duanweiProStrs[j].split(",");
				tempAttribute[proArr[0]] += Number(proArr[1]);
			}
		}
		// 头像属性
		let headAtttrs: number[] = this.getHeadAttribute();
		if (headAtttrs) {
			for (var i = 0; i < headAtttrs.length; ++i) {
				tempAttribute[i] += headAtttrs[i];
			}
		}
		// 头像框属性
		let headFrameAtttrs: number[] = this.getHeadFrameAttribute();
		if (headFrameAtttrs) {
			for (var i = 0; i < headFrameAtttrs.length; ++i) {
				tempAttribute[i] += headFrameAtttrs[i];
			}
		}
		//vip神器
		let vipactifactAttr: number[] = DataManager.getInstance().legendManager.getVipActifactAttrAry();
		for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
			var attrValue: number = vipactifactAttr[j];
			if (attrValue > 0) {
				tempAttribute[j] += attrValue;
			}
		}

		//挑战副本属性
		let modelzhuxian: Modelzhuxiantai = JsonModelManager.instance.getModelzhuxiantai()[this.zhuxianIndex - 1];
		if (modelzhuxian) {
			for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
				var attrValue: number = modelzhuxian.shuxing[j];
				if (attrValue > 0) {
					tempAttribute[j] += attrValue;
				}
			}
		}

		// 婚戒属性
		let marryRingAttrs: number[] = this.getMarryRingAttributeAll();
		for (var i = 0; i < marryRingAttrs.length; ++i) {
			tempAttribute[i] += marryRingAttrs[i];
		}
		//相思树属性
		let marryTreeModel: Modelxiangsishu = JsonModelManager.instance.getModelxiangsishu()[this.treeLv - 1]
		if (marryTreeModel) {
			for (var i = 0; i < marryTreeModel.attrAry.length; ++i) {
				tempAttribute[i] += marryTreeModel.attrAry[i];
			}
		}
		// 结婚套装属性
		let marryEquipSuitAttrs = this.getMarryEquipSuitAttrAll();
		for (var i = 0; i < marryEquipSuitAttrs.length; ++i) {
			tempAttribute[i] += marryEquipSuitAttrs[i];
		}
		// // 结婚套装大师
		// let marryEquipSuitAttrsTZDS = this.getMarryEquipSuitAttrTZDS();
		// for (var i = 0; i < marryEquipSuitAttrsTZDS.length; ++i) {
		// 	tempAttribute[i] += marryEquipSuitAttrsTZDS[i];
		// }
		// 结婚套装额外战力
		let marryEquipSuitPower = this.getMarryEquipSuitAttrTZDSewzl();

		//强化大师
		// let strongerAttrAry: number[] = DataManager.getInstance().strongerManager.attributeAry;
		// for (let attrIdx = 0; attrIdx < ATTR_TYPE.SIZE; ++attrIdx) {
		// 	let attrValue: number = strongerAttrAry[attrIdx];
		// 	if (attrValue > 0) {
		// 		tempAttribute[attrIdx] += attrValue;
		// 	}
		// }

		var totalFighting: number = 0;
		for (var i = 0; i < this.playerDatas.length; ++i) {
			totalFighting += this.playerDatas[i].updataAttributeFighting(tempAttribute, tempFighting);
		}

		totalFighting += marryEquipSuitPower;// 加上套装大师额外战力

		if (this.figthPowerOld != 0 && this.figthPowerOld != totalFighting) {
			if (less || (!less && this.figthPowerOld < totalFighting)) {
				PromptPanel.getInstance().fightingAnimShow(this.figthPowerOld, totalFighting);
			}
		}
		this.figthPowerOld = totalFighting;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_POWER_UPDATE));
	}
	public getHeadAttribute(modelNext: Modeltouxiangshengji = null): number[] {
		if (this.headMap) {
			var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
			let model: Modeltouxiangshengji = modelNext;
			if (!model) {
				let level = this.getHeadLevel(0);
				if (level > 0) {
					model = JsonModelManager.instance.getModeltouxiangshengji()[level - 1];
				}
			}
			if (model) {
				let arrt: number[] = model.attrAry;
				for (var i = 0; i < arrt.length; ++i) {
					tempAttribute[i] += arrt[i];
				}
			}
			for (let id in this.headMap) {
				if (parseInt(id) > 0) {
					let level = this.headMap[id];
					let arrt: number[] = JsonModelManager.instance.getModeltouxiang()[id].attrAry;
					for (var i = 0; i < arrt.length; ++i) {
						tempAttribute[i] += arrt[i] * level;
					}
				}
			}
			return tempAttribute;
		}
		return null;
	}
	public getHeadFrameAttribute(modelNext: Modeltouxiangkuangshengji = null): number[] {
		if (this.headFrameMap) {
			var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
			let model: Modeltouxiangkuangshengji = modelNext;
			if (!model) {
				let level = this.getHeadFrameLevel(0);
				if (level > 0) {
					model = JsonModelManager.instance.getModeltouxiangkuangshengji()[level - 1];
				}
			}
			if (model) {
				let arrt: number[] = model.attrAry;
				for (var i = 0; i < arrt.length; ++i) {
					tempAttribute[i] += arrt[i];
				}
			}
			for (let id in this.headFrameMap) {
				if (parseInt(id) > 0) {
					let level = this.headFrameMap[id];
					let arrt: number[] = JsonModelManager.instance.getModeltouxiangkuang()[id].attrAry;
					for (var i = 0; i < arrt.length; ++i) {
						tempAttribute[i] += arrt[i] * level;
					}
				}
			}
			return tempAttribute;
		}
		return null;
	}
	//解析强化大师
	public parseStronger(message) {
		var tp = message.getByte();
		if (this.strongerDict[tp]) {
			this.strongerDict[tp].onParseLvMsg(message);
		} else {
			var stData: StrongerData = new StrongerData();
			stData.type = tp;
			stData.onParseLvMsg(message);
			this.strongerDict[tp] = stData;
		}
		this.updataAttribute();
	}
	public getCreateDisCurDay(): number {
		var time: number = this.currentTime - this.createTime;
		return parseInt((time / 86400000).toString());
	}

	public get curServerTime(): number {
		return this.currentTime + egret.getTimer() - this.signTime;
	}
	/**获取开服时间**/
	public get serverDay(): number {
		let runday: number = Tool.toInt((egret.getTimer() - this.signTime) / 86400000);
		return this._serverDay + runday;
	}
	/*解析龙魂*/
	public parsePetChange(message: Message): void {
		for (var i: number = 0; i < 4; i++) {
			this.petData.proArr[i] = message.getLong();
		}

		this.updataAttribute(true);
	}
	/*解析宠物丹*/
	public parsePetDanChange(msg: Message): void {
		var data: PetData = DataManager.getInstance().playerManager.player.petData;
		let dan = msg.getByte();
		let lv = msg.getShort();
		data.danDic[dan] = lv;

		this.updataAttribute(true);
	}
	public parsePetRandomValue(msg: Message) {
		for (var i = 0; i < 4; i++) {
			this.petData.proArr[i] = msg.getInt();
		}
	}
	public parseFashionEtl(msg: Message) {
		let idx: number = msg.getByte();
		let id: number = msg.getShort()
		this.getPlayerData(idx).taozhuangDict[id] = msg.getInt();
		this.updataAttribute(true);
	}
	//The end
}
class LevelData {
	public zsLevel = 0;
	public level = 0;
}
