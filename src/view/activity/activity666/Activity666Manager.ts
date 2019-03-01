class Activity666Manager {
	public lunshu: number;
	public receiveBoxIdx: number;
	public usedCount: number;
	public money: number;
	public type: number;
	public rewardItem: ItemBody;
	public rewardIdx: number;
	public currModel: Modelactivityxianlvlaba;
	public constructor() {
		this.rewardItem = new ItemBody();
		this.lunshu = 0;
		this.usedCount = 0;
		this.money = 0;
		this.currModel = this.getCurrModel();
	}
	public parseInit(msg: Message){
		this.lunshu = msg.getByte();
		this.receiveBoxIdx = msg.getByte();
		this.usedCount = msg.getShort();
		this.money = msg.getInt();
		// for(let i = 0; i < 4; ++i){
		// 	this.boxReceives[i] = msg.getByte() == 1;
		// }
		this.currModel = this.getCurrModel();
	}
	public sendLabaMessage(byte: number = 0){
		var message = new Message(MESSAGE_ID.ACT_666_LABA_MESSAGE);
		message.setByte(byte);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseLaba(msg: Message): void {
		this.receiveBoxIdx = msg.getByte();
		this.usedCount = msg.getShort();
		this.type = msg.getByte();
		this.money = msg.getInt();
		switch(this.type){
			case 0:
				break;
			case 1:
				this.rewardItem.parseMsg(msg);
				this.rewardIdx = 3 - msg.getByte();
				break;
			// case 2:

			// 	break;
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public consumeitem_ranks: CrossServerConsumeRank[];
	public consume_meRank: number = -1;
	public parseLabaRank(msg: Message): void {
		this.consumeitem_ranks = [];
		this.consume_meRank = -1;
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			this.consumeitem_ranks[i] = new CrossServerConsumeRank();
			this.consumeitem_ranks[i].parseMsg(msg);
			if (this.consumeitem_ranks[i].playerId == DataManager.getInstance().playerManager.player.id) {
				this.consume_meRank = this.consumeitem_ranks[i].rank;
			}
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public getRewardItem(): AwardItem{
		if(!this.rewardItem){
			return null;
		}
		return new AwardItem(this.rewardItem.itemType, this.rewardItem.itemId, this.rewardItem.itemCount);
	}
	public checkRedPointFunc():boolean{
		return this.checkRedPoint() || this.checkRedDHPointAll();
	}
	public checkRedPoint(): boolean{
		if(this.checkRedPointBox()){
			return true;
		}
		if(this.currModel){
			return this.getHaveMoney() >= this.currModel.costNum;
		}
		return false;
	}
	public checkRedDHPointAll():boolean{
		let map = JsonModelManager.instance.getModelactivityxianlvshenqi();
		for(let key in map){
			let award: AwardItem = map[key].cost;
			if(DataManager.getInstance().bagManager.getGoodsThingNumById(award.id) >= award.num){
				return true;
			}
		}
		return false;
	}
	public checkRedDHPoint(id: string):boolean{
		let award: AwardItem = JsonModelManager.instance.getModelactivityxianlvshenqi()[id];
		return DataManager.getInstance().bagManager.getGoodsThingNumById(award.id) >= award.num;
	}
	public checkRedPointBox():boolean{
		if(this.receiveBoxIdx < Activity666Panel.BOX_MAX){
			let weekAwdParam: string = this.currModel.box.split("#")[this.receiveBoxIdx];
			if(weekAwdParam){
				let count: number = parseInt(weekAwdParam.split(",")[0]);
				return this.usedCount >= count;
			}
		}
		return false;
	}
	private getCurrModel():Modelactivityxianlvlaba{
		let list = JsonModelManager.instance.getModelactivityxianlvlaba();
		for(let key in list){
			if(this.lunshu == list[key].round){
				return list[key];
			}
		}
		return null;
	}
	private getHaveMoney(){
		return this.money - this.usedCount * this.currModel.costNum;
	}
	public getHaveCount(){
		return Math.floor(this.getHaveMoney() / this.currModel.costNum);
	}
	public getMoneyStr(){
		return this.getHaveMoney() % this.currModel.costNum;
	}
}