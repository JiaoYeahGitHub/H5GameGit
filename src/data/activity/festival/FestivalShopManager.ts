class FestivalShopManager {
	public shoptypes: number[];//节日商店的类型
	public refreshTimes: number[];//商店刷新时间
	public shopListInfo;//已购买的商品
	public payCount: number;//充值数

	public constructor() {
		this.shoptypes = [];
		this.refreshTimes = [];
		this.shopListInfo = {};
	}
	//----------------------------下行消息---------------------------------
	//解析活动下发的消息
	public parseActMessage(msg: Message): void {
		this.shoptypes = [];
		this.shopListInfo = {};
		this.refreshTimes = [];
		let typesize: number = msg.getByte();
		for (let i: number = 0; i < typesize; i++) {
			let shoptype: number = msg.getByte();
			this.shoptypes.push(shoptype);
			this.shopListInfo[shoptype] = [];
		}
		this.payCount = msg.getInt();
	}
	//解析商品列表详情消息
	public parseShopInfoMsg(msg: Message): void {
		let shoptype: number = msg.getByte();
		if (this.shoptypes.indexOf(shoptype) < 0) return;
		let limitTime: number = msg.getInt();
		this.refreshTimes[shoptype] = limitTime > 0 ? limitTime * 1000 + egret.getTimer() : 0;
		this.shopListInfo[shoptype] = [];
		let size: number = msg.getByte();
		for (let i: number = 0; i < size; i++) {
			let data: FestiavlShopData = new FestiavlShopData();
			data.parseMsg(msg);
			data.index = i;
			this.shopListInfo[shoptype].push(data);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//解析购买商品消息
	public parseShopBuyMsg(msg: Message): void {
		let shoptype: number = msg.getByte();
		let size: number = msg.getByte();
		for (let i: number = 0; i < size; i++) {
			let index: number = msg.getByte();
			let limitNum: number = msg.getInt();
			let dataAry: FestiavlShopData[] = this.shopListInfo[shoptype];
			if (dataAry[index]) {
				dataAry[index].limitNum = limitNum;
			}
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//----------------------------上行消息---------------------------------
	//请求商店列表消息
	public onRequestShopInfoMsg(type: number): void {
		if (this.shoptypes.indexOf(type) >= 0) {
			let shopinfoMsg: Message = new Message(MESSAGE_ID.FESTIVAL_SHOP_INFO_MESSAGE);
			shopinfoMsg.setByte(type);
			GameCommon.getInstance().sendMsgToServer(shopinfoMsg);
		}
	}
	//请求刷新商店列表
	public onReqestRefreshShopMsg(type: number): void {
		let refreshMsg: Message = new Message(MESSAGE_ID.FESTIVAL_SHOP_REFRESH_MESSAGE);
		refreshMsg.setByte(type);
		GameCommon.getInstance().sendMsgToServer(refreshMsg);
	}
	//购买商品消息
	public onSendBuyItemMsg(shopType: number, index: number): void {
		let butMessage: Message = new Message(MESSAGE_ID.FESTIVAL_SHOP_BUY_MESSAGE);
		butMessage.setByte(shopType);
		butMessage.setByte(index);
		GameCommon.getInstance().sendMsgToServer(butMessage);
	}
	//The end
}
//商品的数据结构
class FestiavlShopData {
	public id: number;//商品ID
	public limitNum: number;//限购次数
	public index: number;

	public parseMsg(msg: Message): void {
		this.id = msg.getShort();
		this.limitNum = msg.getInt();
	}
}