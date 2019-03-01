/**
 * 
 */
class FunctionManager {

	public shareDayNum: number;
	public shareNum: number;
	// public shareAllNum: number;// 分享总数
	public receive1: number;
	public receive2: number;
	public receives: number[];
	public cd: number;
	/**玩吧关注 临时**/
	public wanbaFoucs: boolean = true;

	//关注
	public isFocusReward: boolean = false;
	public constructor() {
		this.receives = [];
	}

	public parseShareInfo(message: Message): void {
		this.shareDayNum = message.getByte();
		this.shareNum = message.getByte();
		// this.shareAllNum = message.getShort();
		let size: number = message.getByte();
		for (let i: number = 0; i < size; i++) {
			let receiveID: number = message.getByte();
			if (this.receives.indexOf(receiveID) < 0) {
				this.receives.push(receiveID);
			}
		}
		// let size2: number = message.getByte();
		// for (let i: number = 0; i < size2; i++) {
		// 	let receiveID: number = message.getByte();
		// 	if (this.receives2.indexOf(receiveID) < 0){
		// 		this.receives2.push(receiveID);
		// 	}
		// }
		this.cd = message.getInt();
		this.cd = this.cd > 0 ? this.cd * 1000 + egret.getTimer() : 0;
	}

	public parseFocusInfo(message: Message): void {
		this.isFocusReward = message.getBoolean();
	}

	public sharePoint(): boolean {
		if (this.shareDayNum < 3 && this.cd == 0) {
			return true;
		}
		// var fenXiangModelMap=JsonModelManager.instance.getModelfenxiang();
		// for (var key in fenXiangModelMap) {
		//     var fenXiangModel:Modelfenxiang=fenXiangModelMap[key];
		// 	if(this.rewardPoint(fenXiangModel.id,fenXiangModel.times))
		// 		return true;
		// }
		return false;
	}

	public rewardPoint(id: number, shareNum: number): boolean {
		// if(this.getReceive(id)==0&&this.shareNum>=shareNum)
		// 	return true;
		return false;
	}

	public getReceive(i: number) {
		if (i == 1)
			return this.receive1;
		if (i == 2)
			return this.receive2;
	}
}