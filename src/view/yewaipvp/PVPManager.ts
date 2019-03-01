class PVPManager {
	private list: FUN_TYPE[] = [FUN_TYPE.FUN_ARENA,FUN_TYPE.FUN_YEWAIPVP, FUN_TYPE.FUN_LADDER, 
	FUN_TYPE.FUN_DUJIE, FUN_TYPE.FUN_SERVERFIGHT_ARENA, FUN_TYPE.FUN_WUTAN];
	public pvpExp: number;
	public PVPDataMap;
	public currModel: ModelPVPLV;
	public nextModel: ModelPVPLV;
	public constructor() {
		this.pvpExp = 0;
		this.PVPDataMap = {};
		for (let i = 0; i < this.funcList.length; ++i) {
			let pvpdata = new PVPData(this.funcList[i]);
			this.PVPDataMap[pvpdata.type] = pvpdata;
		}
	}
	public sendPVPInfo() {
		let req: Message = new Message(MESSAGE_ID.ZHANGONG_INFO_GET_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(req);
	}
	public parseInit(message: Message) {
		this.pvpExp = message.getInt();
		this.checkModels();
	}
	public parseMsg(message: Message) {
		this.pvpExp = message.getInt();
		let size = message.getShort();
		for (let i = 0; i < size; ++i) {
			let idx = message.getByte();
			let type = this.getFuncId(idx);
			this.PVPDataMap[type].parseMsg(message);
		}
		this.checkModels();
		GameCommon.getInstance().receiveMsgToClient(message);
	}
	public updatePvpExp(newZhanGong){
		this.pvpExp += newZhanGong;
		this.checkModels();
	}
	private checkModels() {
		this.currModel = this.nextModel = null;
		let modelList = JsonModelManager.instance.getModelPVPLV();
		for (let i in modelList) {
			let model: ModelPVPLV = modelList[i];
			if (this.pvpExp >= model.zhangong) {
				this.currModel = model;
			} else {
				this.nextModel = model;
				break;
			}
		}
	}
	public getCurrLevel() {
		if (this.currModel) {
			return this.currModel.lv;
		}
		return 0;
	}
	public getModelCurr(): ModelPVPLV {
		return this.currModel;
	}
	public getModelNext(): ModelPVPLV {
		return this.nextModel;
	}
	public getCostZhanGongByStr(costStr: string) {
		if (costStr) {
			let awards = GameCommon.getInstance().onParseAwardItemstr(costStr);
			if (awards) {
				return this.getCostZhanGong(awards);
			}
		}
		return 0;
	}
	public getCostZhanGong(costList: AwardItem[]) {
		if (costList && (costList instanceof Array) && costList.length > 0) {
			for (let i = 0; i < costList.length; ++i) {
				if (costList[i].type == GOODS_TYPE.ZHANGONG) {
					return costList[i].num;
				}
			}
		}
		return 0;
	}
	public getFuncId(idx: number): FUN_TYPE {
		return this.list[idx];
	}
	public get funcList(): FUN_TYPE[] {
		return this.list;
	}
}
class PVPData {
	public type: FUN_TYPE;
	public zhangong: number = 0;// 当前获得的战功
	public value: string = "-1";// 当前排名/坛位
	public constructor(type: FUN_TYPE) {
		this.type = type;
	}
	public parseMsg(message: Message) {
		this.zhangong = message.getInt();
		this.value = message.getString();
	}
	public isHasRank() {
		if (this.value && this.value != "-1") {
			return true;
		}
		return false;
	}
	public getRank(): number {
		if (this.isHasRank()) {
			return parseInt(this.value);
		}
		return -1;
	}
}