/**
 * 
 * @author 
 * 
 */
class PlayerManager {
	public player: Player;
	public offlineData: OffLineExpData;
	public offlineAwdData: OffLineExpShareAwd;
	private _funcRewardeds: number[];//开启功能已领奖的ID
	private coatardRewards: number[]; //境界对应已领取奖励的状态
	// public rechargeRMB: number = 0;//充值金额
	public balance: number = 0;//账户内余额

	public constructor() {
		this.player = new Player();
		this.offlineData = new OffLineExpData();
		this.offlineAwdData = new OffLineExpShareAwd();
		this._funcRewardeds = [];
		this.coatardRewards = [];
	}
	/**开启角色**/
	public parseOpenRole(msg: Message): void {
		this.player.onParseOpenRoleMsg(msg);
	}
	/**更换头像**/
	public parsePlayerHead(msg: Message): void {
		this.player.headIndex = msg.getByte();
		GameCommon.getInstance().addAlert("头像替换成功！");
	}
	/**更换头像框**/
	public parsePlayerHeadFrame(msg: Message): void {
		this.player.headFrameIndex = msg.getByte();
		GameCommon.getInstance().addAlert("头像框替换成功！");
	}
	/** 头像红点 **/
	public checkRedPointHead(): boolean {// 头像界面红点
		if (this.checkRedPointHeadUp()) {
			return true;
		}
		let list = JsonModelManager.instance.getModeltouxiang();
		let player = this.player;
		for (let k in list) {
			let model: Modeltouxiang = list[k];
			if (model.sex == player.sex || model.sex == 2) {
				if (this.checkRedPointHeadModel(model)) {
					return true;
				}
			}
		}
		return false;
	}
	// 头像框红点
	public checkRedPointHeadFrame(): boolean {// 头像框界面红点
		if (this.checkRedPointHeadFrameUp()) {
			return true;
		}
		let list = JsonModelManager.instance.getModeltouxiang();
		let player = this.player;
		for (let k in list) {
			if (this.checkRedPointHeadModel(list[k])) {
				return true;
			}
		}
		return false;
	}
	// 头像升级
	public checkRedPointHeadUp(): boolean {
		let level = this.player.getHeadLevel(0);
		let modelNext: Modeltouxiangshengji = JsonModelManager.instance.getModeltouxiangshengji()[level];
		return this.checkRedPointHeadModel(modelNext);
	}
	// 头像框升级
	public checkRedPointHeadFrameUp(): boolean {
		let level = this.player.getHeadFrameLevel(0);
		let modelNext: Modeltouxiangkuangshengji = JsonModelManager.instance.getModeltouxiangkuangshengji()[level];
		return this.checkRedPointHeadModel(modelNext);
	}
	public checkRedPointHeadModel(model: Modeltouxiang | Modeltouxiangkuang | Modeltouxiangshengji | Modeltouxiangkuangshengji): boolean {
		if (model && model.cost) {
			return DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type) >= model.cost.num;
		}
		return false;
	}
	public parseClothEquip(msg: Message): void {
		var playerIndex: number = msg.getByte();
		var playerdata: PlayerData = this.player.getPlayerData(playerIndex);
		var slotNum: number = playerdata.onupdateEquip(msg);
		this.player.updataAttribute();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(msg.getCmdId().toString()), slotNum);
	}
	/**更新离线经验分享奖励**/
	public parseOffLineAwardMsg(msg: Message): void {
		let oldExpValue: number = this.offlineAwdData.exp;
		this.offlineAwdData.parseMsg(msg);
		if (oldExpValue > 0 && this.offlineAwdData.exp == 0) {
			var param: TurnplateAwardParam = new TurnplateAwardParam();
			param.desc = "恭喜获得";
			param.titleSource = "";
			param.itemAwards = [new AwardItem(GOODS_TYPE.EXP, 0, oldExpValue)];
			param.autocloseTime = 11;
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**更新货币**/
	public parseCurrencyMsg(message: Message): void {
		var type = message.getByte();
		switch (type) {
			case GOODS_TYPE.GOLD:
				this.parseBindMoney(message);
				break;
			case GOODS_TYPE.DIAMOND:
				this.parseGold(message);
				break;
			case GOODS_TYPE.SHENGWANG:
				this.parseShengwang(message);
				break;
			case GOODS_TYPE.ANIMA:
				this.parseAnima(message);
				break;
			case GOODS_TYPE.RONGYU:
				this.parseRongyu(message);
				break;
			case GOODS_TYPE.YUELI:
				this.parseYueli(message);
				break;
			case GOODS_TYPE.VIPEXP:
				this.parseVipExp(message);
				DataManager.getInstance().welfareManager.onSendMessage();
				break;
			case GOODS_TYPE.ARENA:
				this.parseArena(message);
				break;
			case GOODS_TYPE.POINTS:
				this.parsePoints(message);
				break;
			case GOODS_TYPE.DONATE:
				this.parseDonate(message);
				break;
			case GOODS_TYPE.SAVVY:
				this.parseSavvy(message);
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.INSPECT_REDPOINT));
				break;
			case GOODS_TYPE.VIGOUR:
				this.parseVigour(message);
				// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.MASTER_EQUIP));
				break;
			case GOODS_TYPE.TLINTEGRAL:
				this.parsetlIntegral(message);
				break;
			case GOODS_TYPE.SHOJIFEN:
				this.parsetshopjifen(message);
				break;
			case GOODS_TYPE.HUANQI:
				this.parseHaunqi(message);
				break;
			// case GOODS_TYPE.FAHUN:
			// 	this.parseXfPoints(message);
			// 	break;
			case GOODS_TYPE.SHAREEXP:
				this.parseShareExp(message);
				break;
			case GOODS_TYPE.ZHANGONG:
				this.parseZhanGong(message);
				break;
			// case GOODS_TYPE.ZHULIBI:
			// 	this.parseZhulibi(message);
			// 	break;
		}
	}

	public parseBindMoney(msg: Message): void {
		var _bindmoney: number = msg.getLong();
		var formType = msg.getShort();
		var getMoneyNum: number = _bindmoney - this.player.money;
		this.player.money = _bindmoney;
		if (!GameDefine.SHIELD_TXT_HINT) {
			GameCommon.getInstance().receiveMsgToClient(msg);
			if (getMoneyNum > 0) {
				var bindMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.GOLD, 0);
				GameCommon.getInstance().onGetThingAlert(bindMoneyModel, getMoneyNum, formType);
			}
		}
		SDKManager.onMoneyUpdate(formType, getMoneyNum, _bindmoney);
	}

	public parseGold(msg: Message): void {
		var _gold: number = msg.getLong();
		var formType = msg.getShort();
		var getMoneyNum: number = _gold - this.player.gold;
		this.player.gold = _gold;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getMoneyNum > 0) {
			var goldMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.DIAMOND, 0);
			GameCommon.getInstance().onGetThingAlert(goldMoneyModel, getMoneyNum, formType);
		}
		SDKManager.onDiamondUpdate(formType, getMoneyNum, _gold);
	}
	public parseShengwang(msg: Message): void {
		var _shengwang: number = msg.getLong();
		var formType = msg.getShort();
		var getshengwangNum: number = _shengwang - this.player.shengwang;
		this.player.shengwang = _shengwang;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getshengwangNum > 0) {
			var shengwangModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.SHENGWANG, 0);
			GameCommon.getInstance().onGetThingAlert(shengwangModel, getshengwangNum, formType);
		}
	}
	// public parseZhulibi(msg: Message): void {
	// 	var _zhulibi: number = msg.getLong();
	// 	var formType = msg.getShort();
	// 	var getMoneyNum: number = _zhulibi - this.player.zhulibi;
	// 	this.player.zhulibi = _zhulibi;
	// 	GameCommon.getInstance().receiveMsgToClient(msg);
	// 	if (getMoneyNum > 0) {
	// 		var goldMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ZHULIBI, 0);
	// 		GameCommon.getInstance().onGetThingAlert(goldMoneyModel, getMoneyNum, formType);
	// 	}
	// }
	public parseAnima(msg: Message): void {
		var _anima: number = msg.getLong();
		var getAnimaaNum: number = _anima - this.player.anima;
		this.player.anima = _anima;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getAnimaaNum > 0) {
			var animaModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ANIMA, 0);
			GameCommon.getInstance().onGetThingAlert(animaModel, getAnimaaNum, 0);
		}
	}

	public parseRongyu(msg: Message): void {
		var _rongyuValue: number = msg.getLong();
		var getRongyuNum: number = _rongyuValue - this.player.rongyu;
		this.player.rongyu = _rongyuValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getRongyuNum > 0) {
			var rongyuModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.RONGYU, 0);
			GameCommon.getInstance().onGetThingAlert(rongyuModel, getRongyuNum, 0);
		}
	}

	public parseYueli(msg: Message): void {
		var _yueliValue: number = msg.getLong();
		var getYueliNum: number = _yueliValue - this.player.yueli;
		this.player.yueli = _yueliValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getYueliNum > 0) {
			var yueliModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.YUELI, 0);
			GameCommon.getInstance().onGetThingAlert(yueliModel, getYueliNum, 0);
		}
	}

	public parseVipExp(msg: Message): void {
		var _vipExpValue: number = msg.getLong();
		var getVipExpNum: number = _vipExpValue - this.player.vipExp;
		this.player.vipExp = _vipExpValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getVipExpNum > 0) {
			var yueliModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.VIPEXP, 0);
			GameCommon.getInstance().onGetThingAlert(yueliModel, getVipExpNum, 0);
		}
	}

	public parseArena(msg: Message): void {
		var _arenaValue: number = msg.getLong();
		var formType = msg.getShort();
		var getArenaNum: number = _arenaValue - this.player.arena;
		this.player.arena = _arenaValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getArenaNum > 0) {
			var arenaMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ARENA, 0);
			GameCommon.getInstance().onGetThingAlert(arenaMoneyModel, getArenaNum, formType);
		}
	}

	public parsePoints(msg: Message): void {
		var _pointsValue: number = msg.getLong();
		var getPointsNum: number = _pointsValue - this.player.points;
		this.player.points = _pointsValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getPointsNum > 0) {
			var pointsMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.POINTS, 0);
			GameCommon.getInstance().onGetThingAlert(pointsMoneyModel, getPointsNum, 0);
		}
	}

	public parseDonate(msg: Message): void {
		var _donateValue: number = msg.getLong();
		var getDonateNum: number = _donateValue - this.player.donate;
		this.player.donate = _donateValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getDonateNum > 0) {
			var donateMoneyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.DONATE, 0);
			GameCommon.getInstance().onGetThingAlert(donateMoneyModel, getDonateNum, 0);
		}
	}
	public parseSavvy(msg: Message): void {
		var _savvyValue: number = msg.getLong();
		var getSavvyNum: number = _savvyValue - this.player.savvy;
		this.player.savvy = _savvyValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getSavvyNum > 0) {
			var savvyModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.SAVVY, 0);
			GameCommon.getInstance().onGetThingAlert(savvyModel, getSavvyNum, 0);
		}
	}
	public parseVigour(msg: Message): void {
		var _vigourValue: number = msg.getLong();
		var getVigourNum: number = _vigourValue - this.player.vigour;
		this.player.vigour = _vigourValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (getVigourNum > 0) {
			var vigourModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.VIGOUR, 0);
			GameCommon.getInstance().onGetThingAlert(vigourModel, getVigourNum, 0);
		}
	}
	public parsetlIntegral(msg: Message): void {
		var _tlIntegralValue: number = msg.getLong();
		var gettlIntegralNum: number = _tlIntegralValue - this.player.tlIntegral;
		this.player.tlIntegral = _tlIntegralValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (gettlIntegralNum > 0) {
			var tlIntegralModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.TLINTEGRAL, 0);
			GameCommon.getInstance().onGetThingAlert(tlIntegralModel, gettlIntegralNum, 0);
		}
	}
	public parsetshopjifen(msg: Message): void {
		var _tlIntegralValue: number = msg.getLong();
		var gettlIntegralNum: number = _tlIntegralValue - this.player.shoppoint;
		this.player.shoppoint = _tlIntegralValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (gettlIntegralNum > 0) {
			var tlIntegralModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.SHOJIFEN, 0);
			GameCommon.getInstance().onGetThingAlert(tlIntegralModel, gettlIntegralNum, 0);
		}
	}
	public parseHaunqi(msg: Message): void {
		var _huanqiValue: number = msg.getLong();
		var newHuanqi: number = _huanqiValue - this.player.smelt;
		this.player.smelt = _huanqiValue;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (newHuanqi > 0) {
			var model: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.HUANQI, 0);
			GameCommon.getInstance().onGetThingAlert(model, newHuanqi, 0);
		}
	}
	// public parseXfPoints(msg: Message): void {
	// 	var _xinfaValue: number = msg.getLong();
	// 	var newXfPoints: number = _xinfaValue - this.player.fahunPoints;
	// 	this.player.fahunPoints = _xinfaValue;
	// 	GameCommon.getInstance().receiveMsgToClient(msg);
	// 	if (newXfPoints > 0) {
	// 		var model: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.FAHUN, 0);
	// 		GameCommon.getInstance().onGetThingAlert(model, newXfPoints, 0);
	// 	}
	// }
	public parseShareExp(msg: Message): void {
		let _shareExp: number = msg.getLong();
		let newShareExp: number = _shareExp - this.player.shareExp;
		this.player.shareExp = _shareExp;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (_shareExp > 0) {
			let model: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.SHAREEXP, 0);
			GameCommon.getInstance().onGetThingAlert(model, newShareExp, 0);
		}
	}
	public parseZhanGong(msg: Message): void {
		let _zhangong: number = msg.getLong();
		let newZhanGong: number = _zhangong - this.player.zhangong;
		this.player.zhangong = _zhangong;
		GameCommon.getInstance().receiveMsgToClient(msg);
		if (newZhanGong > 0) {
			DataManager.getInstance().pvpManager.updatePvpExp(newZhanGong);
			var model: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ZHANGONG, 0);
			GameCommon.getInstance().onGetThingAlert(model, newZhanGong, 0);
		}
	}
	public parseExp(msg: Message): void {
		var _exp: number = msg.getLong();
		this.player.exp = _exp;
		var _islevelup: boolean = msg.getBoolean();
		if (_islevelup) {
			var _level: number = msg.getShort();
			this.player.level = _level;
			SDKManager.onLevelUp(this.player);
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_LEVEL_UPDATE), _islevelup);
	}

	public parseArtifactEquip(msg: Message): void {
		var artifact: ServantEquipThing = new ServantEquipThing();
		artifact.parseMessage(msg);
	}
	//离线经验
	public parseOffLineExp(msg: Message): void {
		this.offlineData.offTime = msg.getLong();
		this.offlineData.moneynum = msg.getInt();
		this.offlineData.exp = msg.getInt();
		this.offlineData.equinum = msg.getShort();
		this.offlineData.equinumdele = msg.getInt();
		this.offlineData.moneyRongLian = msg.getInt();
		this.offlineData.oldLevel = msg.getShort();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	// 觉醒丹红点检测
	public checkJueXingPoint(tp: number) {
		if (DataManager.getInstance().playerManager.player.getPlayerData().blessWakeLevel[tp] > 0) {
			return false;
		}
		let id = DataManager.getInstance().blessManager.getBlessJueXingItemId(tp);
		return DataManager.getInstance().bagManager.getGoodsThingNumById(id) > 0;
	}
	//灵丹
	public checkLingDanPoint(tp: number, subTp: number): boolean {
		let cfg = DataManager.getInstance().blessManager.getblessDanModel(tp, subTp);
		if (cfg) {
			var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(JsonModelManager.instance.getModelitem()[cfg.cost.id].id);
			if (_itemThing && _itemThing.num >= cfg.cost.num) return true;
		}
		return false;
	}
	//更新通关奖励领奖状态
	public parsePassSceneUpdate(msg: Message): void {
		DataManager.getInstance().playerManager.player.yewaiAwardWave = msg.getShort();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//技能
	public checkMountSkill(type: BLESS_TYPE): boolean {
		let cfgs = DataManager.getInstance().blessManager.skillModels(type);
		for (let i: number = 0; i < cfgs.length; i++) {
			if (DataManager.getInstance().bagManager.getGoodsThingNumById(cfgs[i].cost.id, cfgs[i].cost.type) >= cfgs[i].cost.num) {
				return true;
			}
			// var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(JsonModelManager.instance.getModelitem()[cfgs[i].cost.id].id);
			// if (_itemThing && _itemThing.num >= cfgs[i].cost.num) return true;
		}
		return false;
	}
	//坐骑装备强化
	public checkMountQianghua(type: BLESS_TYPE, slotidx: number): boolean {
		let slotData: ServantEquipSlot = this.player.getPlayerData().getBlessEquipSlot(type, slotidx);
		let model: ModelmountEqianghua = JsonModelManager.instance.getModelmountEqianghua()[slotidx][slotData.intensifyLv];
		if (!model) {
			return false;
		}
		let currency: number = DataManager.getInstance().playerManager.player.getICurrency(model.cost.type);
		if (currency >= model.cost.num) {
			return true;
		}
		return false;
	}

	public checkBlessUPCostMoney(type: BLESS_TYPE, idx: number = -1): boolean {
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(type);
		let model: Modelmount = manager.getBlessModelByData(blessData);

		if (!model || !manager.getNextBlessModel(type, blessData.grade, blessData.level)) return false;
		if (idx == -1) {
			for (let i: number = 0; i < model.costList.length; i++) {
				let cost: AwardItem = model.costList[i];
				let itemThing = DataManager.getInstance().bagManager.getGoodsThingById(cost.id, cost.type);
				if (itemThing && itemThing.num >= cost.num) {
					return true;
				}
			}
		} else {
			let cost: AwardItem = model.costList[idx];
			if (cost) {
				let itemThing = DataManager.getInstance().bagManager.getGoodsThingById(cost.id, cost.type);
				if (itemThing && itemThing.num >= cost.num) {
					return true;
				}
			}
		}

		return false;
	}
	/**祝福值全部红点**/
	public checkBlessUPMain(type: BLESS_TYPE): boolean {
		let funType: FUN_TYPE = this.getBlessFunType(type);
		//1.功能是否开启
		if (!FunDefine.isFunOpen(funType)) return false;
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(type);
		//2.是否能激活
		if (blessData.grade == 0 && blessData.level == 0) {
			return true;
		}
		//3.是否可以升阶
		if (this.checkBlessUPCostMoney(type)) {
			return true;
		}
		if (this.chechFashionTaoZhuang(type)) return true;
		// 4.装备红点
		// 5.装备强化
		for (let i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
			if (this.checkMountEquipRedPoint(type, i)) return true;
			// if (this.checkMountQianghua(type, i)) return true;
		}
		// 技能
		if (this.checkMountSkill(type)) return true;
		// 3丹
		for (let i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
			if (this.checkJueXingPoint(type)) return true;
			if (this.checkLingDanPoint(type, 0)) return true;
			if (this.checkLingDanPoint(type, 1)) return true;
		}
		return false;
	}
	public checkMagicEquipPoint(type): boolean {
		for (let i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
			if (this.checkMountEquipRedPoint(type, i)) return true;
		}
		return false;
	}
	public chechFashionTaoZhuang(type: BLESS_TYPE): boolean {
		var cfg: Modelmounttaozhuang[] = JsonModelManager.instance.getModelmounttaozhuang()[type]
		for (let i in cfg) {
			if (this.chechFashionTaoZhuangOne(cfg[i])) {
				return true;
			}
		}
		return false;
	}
	public chechFashionTaoZhuangOne(cfg: Modelmounttaozhuang) {
		if (this.player.getPlayerData().taozhuangDict[cfg.id] < Constant.get(Constant.TAOZHUANG_MAX)) {
			if (this.player.getPlayerData().taozhuangDict[cfg.id] > 0) {
				if (DataManager.getInstance().bagManager.getGoodsThingNumById(cfg.cost.id, cfg.cost.type) >= cfg.cost.num) {
					return true;
				}
			} else {
				var awardStrAry: string[];
				if (cfg.fashionId.indexOf(",") >= 0) {
					awardStrAry = cfg.fashionId.split(",");
				}
				for (let i: number = 0; i < awardStrAry.length; i++) {
					let model: Modelfashion = JsonModelManager.instance.getModelfashion()[awardStrAry[i]];
					let data: FashionData = this.player.getPlayerData().fashionDatas[model.id];
					if (!data || data.level == 0) {
						return false;
					}
				}
				if (this.player.getPlayerData().taozhuangDict[cfg.id] == 0) {
					return true;
				}
			}
		}
		return false;
	}
	public getBlessFunType(type: BLESS_TYPE): FUN_TYPE {
		switch (type) {
			case BLESS_TYPE.HORSE:
				return FUN_TYPE.FUN_MOUNT;
			case BLESS_TYPE.CLOTHES:
				return FUN_TYPE.FUN_SHENZHUANG;
			case BLESS_TYPE.WEAPON:
				return FUN_TYPE.FUN_SHENBING;
			case BLESS_TYPE.WING:
				return FUN_TYPE.FUN_XIANYU;
			// case BLESS_TYPE.RING:
			// 	return FUN_TYPE.FUN_FABAO;
			// case BLESS_TYPE.RETINUE_CLOTHES:
			// 	return FUN_TYPE.FUN_HUANZHUANG;
			// case BLESS_TYPE.RETINUE_WEAPON:
			// 	return FUN_TYPE.FUN_LINGZHANG;
			// case BLESS_TYPE.RETINUE_HORSE:
			// 	return FUN_TYPE.FUN_FAZUO;
			// case BLESS_TYPE.RETINUE_WING:
			// 	return FUN_TYPE.FUN_YUYI;
			case BLESS_TYPE.MAGIC:
				return FUN_TYPE.FUN_FABAO;
		}
		return 0;
	}

	public checkHasBossAward(): boolean {
		var index = GameFight.getInstance().yewai_waveIndex > this.player.yewaiAwardWave + GameDefine.Pass_Wave_Num ? this.player.yewaiAwardWave + GameDefine.Pass_Wave_Num : 0;
		return index > 0;
	}
	/**时装红点相关**/
	public checkFashionRedPoint(): boolean {
		for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
			if (this.checkFashionPointByType(i)) return true;
		}
		return false;
	}
	public checkFashionRedPointByTab(tab: number): boolean {
		switch (tab) {
			case 0:
				for (let i: number = 0; i < BLESS_TYPE.RETINUE_HORSE; i++) {
					if (this.checkFashionPointByType(i)) return true;
				}
				break;
			case 1:
				for (let i: number = BLESS_TYPE.RETINUE_HORSE; i < BLESS_TYPE.SIZE; i++) {
					if (this.checkFashionPointByType(i)) return true;
				}
				break;
		}
		return false;
	}
	public checkFashionPointByType(blessType: number): boolean {
		let models = JsonModelManager.instance.getModelfashion();
		for (let idx in models) {
			let model: Modelfashion = JsonModelManager.instance.getModelfashion()[idx];
			if (model.type != blessType) continue;
			if (this.checkFashionPointByID(model.id)) {
				return true;
			}
		}
		return false;
	}
	public checkFashionPointByID(id: number): boolean {
		let model: Modelfashion = JsonModelManager.instance.getModelfashion()[id];
		let data: FashionData = this.player.getPlayerData().fashionDatas[id];
		if (data) {
			// let fashionTime: number = data.limitTime;
			// if (fashionTime > 0) return false;//已经激活且限时的不管
			let thing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.cost.id, model.cost.type);
			if (thing && thing.num >= model.cost.num) {
				return true;
			}
		}
		return false;
	}

	public checkMountEquipRedPoint(type: BLESS_TYPE, idx: number = 0): boolean {
		let player: Player = DataManager.getInstance().playerManager.player;
		let playerdata: PlayerData = player.getPlayerData();
		let mountEquipArray = DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.SERVANT_EQUIP);
		if (mountEquipArray) {
			for (let i = 0; i < mountEquipArray.length; ++i) {
				let mountEquip = mountEquipArray[i];
				if (mountEquip.model.blesstype != type) continue;
				if (player.coatardLv < mountEquip.model.coatardLv) continue;
				if (mountEquip.model.part != idx) continue;
				let clothEquip: ServantEquipThing = playerdata.getBlessEquip(type, idx);
				if (!clothEquip) {
					return true;
				}
				if (mountEquip.model.pingfenValue > clothEquip.model.pingfenValue) {
					return true;
				}
			}
		}
		return false;
	}
	/**获取时装ID 排序数组 用于虚构外形**/
	private fashionIdsByType;
	public getFashionIDsByType(type: BLESS_TYPE): number[] {
		if (!this.fashionIdsByType) {
			this.fashionIdsByType = {};
			for (let fashionId in JsonModelManager.instance.getModelfashion()) {
				let model: Modelfashion = JsonModelManager.instance.getModelfashion()[fashionId];
				if (!this.fashionIdsByType[model.type]) this.fashionIdsByType[model.type] = [];
				let idsArry: number[] = this.fashionIdsByType[model.type];
				if (idsArry.length == 0) {
					idsArry.push(model.id);
				} else {
					let idFind: boolean = false;
					for (let i: number = 0; i < idsArry.length; i++) {
						let cur_fs_model: Modelfashion = JsonModelManager.instance.getModelfashion()[idsArry[i]];
						if (cur_fs_model.order > model.order) {
							idsArry.splice(i, 0, model.id);
							idFind = true;
							break;
						}
					}
					if (!idFind) {
						idsArry.push(model.id);
					}
				}
			}
		}
		return this.fashionIdsByType[type];
	}

	public checkDeskPoint(): boolean {
		if (this.player.sendDesk == 0) {
			return true;
		}
		return false;
	}
	public checkZhuanShengPoint(): boolean {
		var curZhuanShengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[this.player.zhuanshengID + 1];
		if (curZhuanShengCfg) {
			if (this.player.level >= curZhuanShengCfg.tiaojianLv && GameFight.getInstance().yewai_waveIndex >= curZhuanShengCfg.tiaojianGuanqia) {
				return true;
			}
		}
		return false;
	}
	public checkWanBaVipPoint(): boolean {
		if (this.player.wanbaVip) {
			return true;
		}
		return false;
	}
	/**--天师（分享大师）功能--**/
	public tianshiInviteNum: number;
	public tianshiAwdNum: number;
	public onSendTianshiAwardMsg(isAward: boolean = true): void {
		let tianshiInfoMsg: Message = new Message(MESSAGE_ID.XYX_SHARE_EXP_MESSAGE);
		tianshiInfoMsg.setBoolean(isAward);
		GameCommon.getInstance().sendMsgToServer(tianshiInfoMsg);
	}
	public parseTianshiAwardMsg(msg: Message): void {
		let inviteSize: number = msg.getByte();//暂时不用 总邀请成功人数
		this.tianshiInviteNum = msg.getByte();//邀请成功人数
		this.tianshiAwdNum = msg.getByte();//领取人数奖励
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public parseTianshiActivateMsg(msg: Message): void {
		DataManager.getInstance().playerManager.player.shareMasterId = msg.getByte();
		GameCommon.getInstance().receiveMsgToClient(msg);
		this.player.updataAttribute();
	}
	public getTianshiAttrPlusByBlessType(type: BLESS_TYPE): number {
		return this.getTianshiAttrPlusByType(type);//设计巧合 先这么用吧
	}
	public getTianshiAttrPlusByType(type: number): number {//返回万分比加成数值
		let plus_value: number = 0;
		for (let id in JsonModelManager.instance.getModelshareMaster()) {
			let model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[id];
			if (model.id > this.player.shareMasterId) break;
			if (model.type == type) {
				plus_value = model.allplus;
			}
		}
		return plus_value;
	}
	public oncheckTianshiRPoint(): boolean {
		let model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[this.player.shareMasterId + 1];
		if (!model) return;
		if (model.exp <= this.player.shareExp) {//是否可激活
			return true;
		}
		if (model.friendNumMax > this.tianshiAwdNum && this.tianshiInviteNum - this.tianshiAwdNum > 0) {
			return true;
		}
		//是否能领取邀请奖励
		return false;
	}

	/**解析开启功能奖励**/
	public parseFuncAwardedMsg(msg: Message): void {
		var size: number = msg.getByte();
		for (var i: number = 0; i < size; i++) {
			var funcId: number = msg.getShort();
			if (this._funcRewardeds.indexOf(funcId) < 0) {
				this._funcRewardeds.push(funcId);
			}
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**判断开启功能是不是已领奖**/
	public getFunIsAwarded(funcId: FUN_TYPE): boolean {
		return this._funcRewardeds.indexOf(funcId) >= 0;
	}

	public parseCoatardRewardMessage(msg: Message): void {
		var size = msg.getByte();
		for (var i = 0; i < size; i++) {
			this.coatardRewards[i] = msg.getByte();
		}
	}

	public getCoatardRewardStatus(lv: number): boolean {
		if (lv < this.coatardRewards.length) {
			return this.coatardRewards[lv] == 1;
		}
		return false;
	}

	public receiveAllCoatard(): boolean {
		for (var i = 0; i < this.coatardRewards.length; i++) {
			if (this.coatardRewards[i] == 0) {
				return false;
			}
		}
		return true;
	}

	public verify = 0;
	public parseVerifyMessage(msg: Message) {
		this.verify = msg.getByte();
	}

	//神器活动红点
	public shenqiPoint(): boolean {
		if (DataManager.getInstance().activityManager.activity[ACTIVITY_BRANCH_TYPE.MONEYTAKEGODGIFT]) {
			var shenqiData: ShenQiData = DataManager.getInstance().newactivitysManager.shenqiData;
			if (shenqiData.isgoal && !this.player.isLegendActive(shenqiData.round + 1)) {
				return DataManager.getInstance().legendManager.getCanLegendAdvance(shenqiData.round + 1)
			}
		}
		return false;
	}

	/**-----------------心法----------------**/
	//获取对应心法的数据
	public getXinfaDataByID(id: number): PlayerXinfaData {
		let xinfaDict = this.player.getXinfaDataDict();
		return xinfaDict[id];
	}
	//通过ID获取对应心法当前的属性
	public getXinfaOneAttrByID(id: number): number[] {
		let attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		let xinfaData: PlayerXinfaData = this.getXinfaDataByID(id);
		if (xinfaData.level > 0) {
			let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[id];
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				let attrValue: number = model.attrAry[i];
				if (attrValue > 0) {
					attrAry[i] = attrValue * xinfaData.level;
				}
			}
		}
		return attrAry;
	}
	//获取心法总属性
	public getAllXinfaAttrAry(): number[] {
		let attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		for (let xinfaID in this.player.getXinfaDataDict()) {
			let oneAttrAry: number[] = this.getXinfaOneAttrByID(parseInt(xinfaID));
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				let attrValue: number = oneAttrAry[i];
				if (attrValue > 0) {
					attrAry[i] += attrValue;
				}
			}
		}
		return attrAry;
	}
	//获取某一心法的升级的消耗
	public getoneXinfaUpCostByID(id: number): number {
		let xinfaData: PlayerXinfaData = this.getXinfaDataByID(id);
		let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[id];
		return model.cost.num + Tool.toInt(xinfaData.level / 4);
	}
	//获取心法加成总经验值
	public get xinfaAddTotalExp(): number {
		let expnum: number = 0;
		for (let xinfaID in this.player.getXinfaDataDict()) {
			let xinfaData: PlayerXinfaData = this.getXinfaDataByID(parseInt(xinfaID));
			if (xinfaData.level > 0) {
				let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[xinfaData.id];
				expnum += model.exp * xinfaData.level;
			}
		}
		return expnum;
	}
	//获取心法加成的当前等级
	public get xinfaAddLevel(): number {
		let currXinfaAddExp: number = this.xinfaAddTotalExp;
		let currLevel: number = 0;
		let xinfaAddParam: string[] = Constant.get(Constant.XINFA_MAX_NUM).split('#');
		for (let i: number = 0; i < xinfaAddParam.length; i++) {
			let params: string[] = xinfaAddParam[i].split(',');
			let upExp: number = parseInt(params[0]);
			if (currXinfaAddExp < upExp) {
				break;
			}
			currLevel++;
		}
		return currLevel;
	}
	//获取当前心法加成值 (作用于 攻 防 血) 万分比
	public get xinfaAddRatio(): number {
		let ratioValue: number = 0;
		let currLevel: number = this.xinfaAddLevel;
		if (currLevel > 0) {
			let xinfaAddParam: string[] = Constant.get(Constant.XINFA_MAX_NUM).split('#');
			let params: string[] = xinfaAddParam[currLevel - 1].split(',');
			ratioValue = parseInt(params[1]);
		}
		return ratioValue;
	}
	//获取当前心法升级经验 0代表已满级
	public get xinfaUpExp(): number {
		let currLevel: number = this.xinfaAddLevel;
		let xinfaAddParam: string[] = Constant.get(Constant.XINFA_MAX_NUM).split('#');
		let params: string[] = xinfaAddParam[currLevel].split(',');
		return params[0] ? parseInt(params[0]) : 0;
	}
	//某一个心法是否可以升级
	public onCheckOneXinfaRedPoint(xinfaID: number): boolean {
		let xinfaData: PlayerXinfaData = this.getXinfaDataByID(xinfaID);
		let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[xinfaID];
		let costNum: number = DataManager.getInstance().playerManager.getoneXinfaUpCostByID(xinfaID);
		let hascostNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id);
		if (hascostNum >= costNum) {
			return true;
		}
		return false;
	}
	//检查所有心法的红点
	public onCheckXinfaRedPoint(): boolean {
		for (let xinfaID in this.player.getXinfaDataDict()) {
			if (this.onCheckOneXinfaRedPoint(parseInt(xinfaID))) return true;
		}
		return false;
	}
	/**------天书------**/
	//天书升级
	public parseTianshuLevelUpMsg(msg: Message): void {
		this.player.parseTianshuLevelUpMsg(msg);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//天书红点
	public oncheckTianshuRP(): boolean {
		if (this.oncheckRPTianshuLevel()) return true;
		if (this.oncheckRPTianshuGrade()) return true;
		return false;
	}
	//天书升级红点
	public oncheckRPTianshuLevel(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_TIANSHU)) {
			return false;
		}
		let tianshuModels = JsonModelManager.instance.getModeltianshushengji();
		for (let id in tianshuModels) {
			let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[id];
			if (this.oncheckRPTianshuLevelById(model.id)) return true;
		}
		return false;
	}
	public oncheckRPTianshuLevelById(id: number): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_TIANSHU)) {
			return false;
		}
		let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[id];
		if (model.tiaojian > 0) {
			let tiaojianData: TianshuData = this.player.getPlayerData().tianshuDict[id - 1];
			if (!tiaojianData || tiaojianData.level < model.tiaojian) {
				return false;
			}
		}
		var hasItenNum: number = 0;
		var itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.cost.id) as ItemThing;
		if (itemThing) {
			hasItenNum = itemThing.num;
		}
		return hasItenNum > 0;
	}
	//天书进阶
	public parseTianshuUpgradeMsg(msg: Message): void {
		this.player.parseTianshuGradeMsg(msg);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//天书进阶红点
	public oncheckRPTianshuGrade(): boolean {
		let tianshuModels = JsonModelManager.instance.getModeltianshushengji();
		for (let id in tianshuModels) {
			let model: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[id];
			if (this.oncheckRPTianshuGradeById(model.id)) return true;
		}
		return false;
	}
	public oncheckRPTianshuGradeById(id: number): boolean {
		let levelModel: Modeltianshushengji = JsonModelManager.instance.getModeltianshushengji()[id];
		if (levelModel.tiaojian > 0) {
			let tiaojianData: TianshuData = this.player.getPlayerData().tianshuDict[id - 1];
			if (!tiaojianData || tiaojianData.level < levelModel.tiaojian) {
				return false;
			}
		}
		let gradeModel: Modeltianshutupo = JsonModelManager.instance.getModeltianshutupo()[id];
		let hasItenNum: number = 0;
		let itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(gradeModel.cost.id) as ItemThing;
		if (itemThing) {
			hasItenNum = itemThing.num;
		}
		return hasItenNum > 0;
	}
	//The end
}