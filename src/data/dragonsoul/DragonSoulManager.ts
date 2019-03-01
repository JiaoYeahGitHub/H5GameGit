/**
 * 
 * 龙魂管理器
 * 
 * 
 * 
 */
class DragonSoulManager {
	public curRandomValue = [];
	public constructor() {
	}
	public parseRandomValue(msg: Message) {	
		msg.getByte();
		for (var i = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
			this.curRandomValue[i] = msg.getInt();
		}
	}

	public clear(){
		this.curRandomValue = []
	}

	public sendRandomMessage(idx:number,ten:boolean, costType:number){
		
		var message = new Message(MESSAGE_ID.LONGHUN_RANDOM);
		message.setByte(idx);
		message.setByte(ten?1:0);
        message.setByte(costType);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public checkRedPoint():boolean {
		if(FunDefine.isFunOpen(FUN_TYPE.FUN_DRAGONSOUL)){
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GameDefine.LONGHUN_GOODS_ID);
			if (has >= GameDefine.LONGHUN_GOODS_NUM) {
					return true;
				}
		}
		return false;
	}	

	public getLonghunPower():number{
		var attributes: number[]= GameCommon.getInstance().getAttributeAry();
		for (var i = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
			attributes[i] =  this.getPlayerData().longhunAttribute[i];
		}
		return GameCommon.calculationFighting(attributes);
	}
	private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData(0);
    }
}