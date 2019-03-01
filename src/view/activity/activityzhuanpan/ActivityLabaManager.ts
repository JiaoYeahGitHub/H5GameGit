class ActivityLabaManager {
	public lunshu: number;
	public type: number;
	public usedCount: number;
	public money: number;
	public itemList: ItemBody[];
	public currModel: Modellabahuodong;
	
	public constructor() {
	}
	public getRewardItem(): AwardItem{
		if(!this.itemList){
			return null;
		}
		return new AwardItem(this.itemList[0].itemType, this.itemList[0].itemId, this.itemList[0].itemCount);
	}
	public getRewardItemList(): AwardItem[]{
		if(!this.itemList){
			return null;
		}
		var result:AwardItem[] = [];
		for(let i = 0; i < this.itemList.length; ++i){
			result.push(new AwardItem(this.itemList[i].itemType, this.itemList[i].itemId, this.itemList[i].itemCount));
		}
		return result;
	}
	private getCurrModel():Modellabahuodong{
		let list = JsonModelManager.instance.getModellabahuodong();
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
	public parseLunshu(msg: Message){
		this.lunshu = msg.getByte();
		this.usedCount = msg.getShort();
		this.money = msg.getInt();
		this.currModel = this.getCurrModel();
	}
	public parseLaba(msg: Message): void {
		this.type = msg.getByte();
		this.usedCount = msg.getShort();
		this.money = msg.getInt();
		this.itemList = null;
		switch(this.type){
			case 0:
				break;
			default:
				let length = msg.getByte();
				if(length > 0){
					this.itemList = [];
					for(let i = 0; i < length; ++i){
						this.itemList[i] = new ItemBody();
						this.itemList[i].parseMsg(msg);
					}
				}
				break;
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
	public updateData(){
		var message = new Message(MESSAGE_ID.ACT_LABA_MESSAGE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public getActivityPoint(count: number = 1): boolean{
		if(this.currModel){
			return this.getHaveMoney() >= this.currModel.costNum * count;
		}
		return false;
	}
}