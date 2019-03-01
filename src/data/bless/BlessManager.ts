/**
 * 祝福系统
 */
class BlessManager {
	public constructor() {
		// this._blessMaps = {};
	}
	public btnType: number = 0;
	/**祝福系统升级协议 blesstype祝福值类型  costtype消耗类型0金币1道具2激活**/
	public onSendBlessUpMsg(blesstype: BLESS_TYPE, bo: boolean, itemTP: number = 0, costtype: number = 1): void {
		let warnDesc: string = '';
		if (this.onCheckUpDanWarn(blesstype, BlessDefine.BLESS_UPDAN_NORMALTYPE, bo)) {
			warnDesc = 'bless_updan_warn1';
		} else if (this.onCheckUpDanWarn(blesstype, BlessDefine.BLESS_UPDAN_SUPERTYPE, bo)) {
			warnDesc = 'bless_updan_warn2';
		}
		if (warnDesc) {
			let warntextFlow = [{ text: Language.instance.getText(warnDesc), style: {} }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(warntextFlow, this.sendBlessUpMsgOK, this, [blesstype, bo, costtype])));
		} else {
			this.sendBlessUpMsgOK([blesstype, bo, costtype, itemTP]);
		}
	}
	//使用祝福值丹之前，判断下是否有直升丹，如果有在3升4，6升7的时候提示玩家，先使用直升丹
	// 1是普通直升丹3升4   2是超级直升丹6升7
	private onCheckUpDanWarn(blesstype: BLESS_TYPE, updanType: number, bo: boolean): boolean {
		let blessData: BlessData = this.getPlayerBlessData(blesstype);
		let itemId: number;
		let _itemThing: ItemThing;
		let _hasitemNum: number = 0;
		let maxGradeLimit: number = BlessDefine.BLESS_UPDAN_MAXGRADE[updanType];
		switch (updanType) {
			case BlessDefine.BLESS_UPDAN_NORMALTYPE:
				itemId = GoodsDefine.ITEM_BLESS_UPDAN[blesstype];
				break;
			case BlessDefine.BLESS_UPDAN_SUPERTYPE:
				itemId = GoodsDefine.ITEM_BLESS_SUPERUPDAN[blesstype];
				break;
		}
		//先判断普通直升丹
		_itemThing = DataManager.getInstance().bagManager.getGoodsThingById(itemId);
		if (_itemThing) {
			_hasitemNum = _itemThing.num;
		}
		if (_hasitemNum > 0 && blessData.grade == maxGradeLimit - 1 && blessData.level == 9) {
			let blessmodel: Modelmount = this.getBlessModelByData(blessData);
			let addexp: number = 0;
			// let cost: AwardItem = GameCommon.parseAwardItem(blessmodel.chaojiCost);
			// _itemThing = DataManager.getInstance().bagManager.getGoodsThingById(cost.id);
			// if (_itemThing && _itemThing.num > 0 && blessData.grade >= BlessDefine.BLESS_BIGITEM_LIMIT) {//大升级丹需要4阶段
			// 	addexp = blessmodel.chaojiExp;
			// } else {
			_itemThing = DataManager.getInstance().bagManager.getGoodsThingById(blessmodel.cost.id);
			if (_itemThing && _itemThing.num > 0) {
				addexp = blessmodel.itemExp;
			}
			// }
			if (_itemThing && bo) {
				addexp = addexp * _itemThing.num;
			}
			if (blessmodel.exp <= blessData.exp + addexp) {
				return true;
			}
		}
		return false;
	}
	//确认进行升级祝福值 发送消息给服务器
	private sendBlessUpMsgOK(param): void {
		let blesstype: BLESS_TYPE = param[0];
		let bo: boolean = param[1];
		let costtype: number = param[2];
		let itemTP: number = param[3];
		let message: Message = new Message(MESSAGE_ID.BLESS_UP_MESSAGE);
		message.setByte(0);//角色索引
		message.setByte(costtype);//升级类型0金币1物品2激活
		message.setByte(blesstype);
		message.setBoolean(bo);
		message.setByte(itemTP);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	/**根据祝福值类型获取人物身上对应的祝福值信息**/
	public getPlayerBlessData(type: BLESS_TYPE): BlessData {
		var blessData: BlessData = DataManager.getInstance().playerManager.player.getPlayerData().blessinfos[type];
		return blessData;
	}
	public getPlayerBlessModel(type: BLESS_TYPE): Modelmount {
		return this.getBlessModelByData(this.getPlayerBlessData(type));
	}
	/**根据祝福值类型 阶段 等级获取对应的MODEL**/
	// private _blessMaps;
	public getBlessModel(type, grade, lv): Modelmount {
		return ModelManager.getInstance().getModelMount(type, grade, lv);
	}
	public getBlessModelByData(data: BlessData): Modelmount {
		return this.getBlessModel(data.type, data.grade, data.level);
	}
	public getNextBlessModel(type: BLESS_TYPE, grade, lv): Modelmount {
		let model: Modelmount = this.getBlessModel(type, grade, lv + 1);
		model = model ? model : this.getBlessModel(type, grade + 1, 0);
		return model;
	}
	public getblessDanModel(tp: number, subTp: number): ModelmountDan {
		var models: ModelmountDan[];
		models = JsonModelManager.instance.getModelmountDan();
		for (let k in models) {
			if (models[k].type == tp && subTp == models[k].subtype) {
				return models[k]
			}
		}
	}
	//根据祝福值类型获取技能组
	public skillModels(tp: number): ModelmountSkill[] {
		let _blessSkillAry: Array<ModelmountSkill> = [];
		var models: ModelmountSkill[];
		models = JsonModelManager.instance.getModelmountSkill();
		for (let k in models) {
			if (models[k].type == tp) {
				_blessSkillAry.push(models[k])
			}
		}

		return _blessSkillAry;
	}
	//获取某个技能的对应等级的属性
	public getSkillAttrByID(id: number, isNext: boolean = false): number[] {
		let attrAry: number[] = [];
		let model: ModelmountSkill = JsonModelManager.instance.getModelmountSkill()[id];
		let data: BlessSkillData = DataManager.getInstance().playerManager.player.getPlayerData().getBlessSkill(id);
		let level: number = data ? data.level : 0;
		if (isNext) level++;
		if (level >= BlessDefine.BLESS_SKILL_MAX) return attrAry;
		let i: number = 0;
		for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
			var keystr: string = GameDefine.ATTR_OBJ_KEYS[i];
			if (model && model[keystr]) {
				attrAry[i] = Tool.toInt(model[keystr] * Math.pow(level, 1.1));
			} else {
				attrAry[i] = 0;
			}
		}
		for (; i < GameDefine.ATTR_OBJ_KEYS.length * 2; i++) {
			var keystr: string = GameDefine.getAttrPlusKey(i);
			if (model && model[keystr]) {
				attrAry[i] = model[keystr] * level;//万分级
			} else {
				attrAry[i] = 0;
			}
		}
		return attrAry;
	}
	//获取某个技能对应等级升级经验
	public getSkillExpMaxByID(id: number): number {
		let data: BlessSkillData = DataManager.getInstance().playerManager.player.getPlayerData().getBlessSkill(id);
		let level: number = data ? data.level : 0;
		if (level >= BlessDefine.BLESS_SKILL_MAX) return 0;
		return Tool.toInt(BlessDefine.BLESS_SKILL_BASIC * (Math.pow(level + 1, 1.3) - Math.pow(level, 1.3)));
	}
	public getBlessJueXingItemId(tp: number){
		return parseInt((Constant.get(Constant.BLESS_WAKE_UP_ITEM).split(','))[tp]);
	}
	private juexingLevens: number[];
	public getBlessJueXingValue(): number[]{
		if(!this.juexingLevens){
			this.juexingLevens = [];
			let strList: string[] = (Constant.get(Constant.BLESS_WAKE_UP_PERCENT)).split(',');
			for(let i = 0; i < strList.length; ++i){
				this.juexingLevens[i] = parseInt(strList[i]);
			}
		}
		return this.juexingLevens;
	}
	//The end
}
class BlessData {
	public type: BLESS_TYPE;
	public grade: number;
	public level: number;
	public exp: number;
	public danDic: number[] = [];
	public isBaoji: boolean = false;
	public constructor(type: BLESS_TYPE) {
		this.type = type;
		this.danDic[0] = 0;
		this.danDic[1] = 0;
	}

	public parseMsg(message: Message): void {
		this.level = message.getShort();
		this.grade = message.getShort();
		this.exp = message.getInt();
	}
}
class BlessSkillData {
	public type: BLESS_TYPE;
	public id: number;
	public level: number;
	public exp: number;

	public constructor(type: BLESS_TYPE) {
		this.type = type;
	}

	public parseMsg(message: Message): void {
		this.id = message.getByte();
		this.level = message.getShort();
		this.exp = message.getInt();
	}
}