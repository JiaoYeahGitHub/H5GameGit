class WuTanManager {
	public static wutanCount: number = 5;
	public static fontExp: string = '经验';
	public static fontGas: string = '战功';
	public numberList: number[];
	private type: number;
	private isWuTan: boolean;
	public myType: number;
	public myIdx: number;
	public fightType: number;
	public fightIdx: number;
	public constructor() {
		this.isWuTan = true;
		this.myType = 0;
		this.myIdx = 0;
	}
	public sendInfoMessage() {
		let req: Message = new Message(MESSAGE_ID.WUTAN_INFO_GET_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(req);
	}
	public parseInfo(msg: Message): void {
		let num = msg.getByte();
		this.numberList = [];
		for (let i = 0; i < num; ++i) {
			this.numberList[i] = msg.getInt();
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public sendListRefresh() {
		this.sendListMessage(this.type, 0, 3);
	}
	public sendListMessage(type: number, startIdx: number, length: number) {
		this.type = type;
		let req: Message = new Message(MESSAGE_ID.WUTAN_LIST_GET_MESSAGE);
		req.setShort(type);
		req.setInt(startIdx);
		req.setInt(length);
		GameCommon.getInstance().sendMsgToServer(req);
	}
	public parseList(msg: Message): void {
		let wuTanInfo: WuTanResponseInfo = new WuTanResponseInfo();
		wuTanInfo.parseMsg(msg);
		GameCommon.getInstance().receiveMsgToClient(msg, wuTanInfo);
	}
	public sendBuyMessage(type: number, idx: number) {
		this.type = type;
		let req: Message = new Message(MESSAGE_ID.WUTAN_BUY_MESSAGE);
		req.setShort(type);
		req.setShort(idx);
		GameCommon.getInstance().sendMsgToServer(req);
	}
	public parseBuy(msg: Message): void {
		let result = msg.getByte();
		if (result) {
			this.setWuTanUp();
			this.sendListRefresh();
			this.sendInfoMessage();
		}
	}
	public setWuTanUp() {
		this.isWuTan = true;
	}
	public parseRefresh(msg: Message): void {
		this.setMyType(msg.getShort(), msg.getShort());
	}
	public setMyType(type: number, idx: number) {
		this.isWuTan = type != 0;
		if (this.myType != type) {
			this.myType = type;
			this.myIdx = idx;
			GameCommon.getInstance().onDispatchEvent(MESSAGE_ID.WUTAN_HEART_MESSAGE);
		}
	}
	public setFightData(type: number, idx: number) {
		this.fightType = type;
		this.fightIdx = idx;
	}
	public clearFightData() {
		this.fightType = this.fightIdx = -1;
	}
	public checkRedPoint(): boolean {// 没在上面
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_WUTAN)) return false;
		return !this.isWuTan;
	}
	public checkRedPointItem(idx: number): boolean {
		if (!this.isWuTan && this.numberList) {
			return this.numberList[idx] < this.getModel(idx + 1, 4).num + 3;
		}
		return false;
	}
	public static isCost(costList: AwardItem[]) {
		if (costList) {
			for (let i = 0; i < costList.length; ++i) {
				if (!GameCommon.getInstance().onCheckItemConsume(costList[i].id, costList[i].num, costList[i].type)) {
					return false;
				}
			}
		}
		return true;
	}
	public getModel(type: number, weizhi: number): Modelwutan {
		let list = JsonModelManager.instance.getModelwutan();
		for (let key in list) {
			let item: Modelwutan = list[key];
			if (item.type == type && item.weizhi == weizhi) {
				return item;
			}
		}
		return null;
	}
	public static getValueExp(model: Modelwutan) {
		return model.exp;
	}
	public static getValueGas(model: Modelwutan) {
		return DataManager.getInstance().pvpManager.getCostZhanGong(model.rewards);
	}
	private static getValue(str: string): number {
		let list = str.split(',');
		return parseInt(list[2]);
	}
}
