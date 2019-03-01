class ActivityZQManager {
	public conType: number;
	public payMoney: number = 0;
	public surplusMoney: number = 0;// 剩余钱数
	public currModels: Modelfeastzhuanpan[];
	public itemInfos1: number[][];
	public itemInfos10: number[][];
	public costMoney: number;
	public rewardItems: AwardItem[];
	public itemList: ItemBody[];// 抽取获得列表
	public constructor() {
		this.currModels = [];
		this.itemInfos1 = [];
		this.itemInfos10 = [];
		let list = JsonModelManager.instance.getModelfeastzhuanpan();
		for(let key in list){
			this.currModels[list[key].type] = list[key];
			let costs: AwardItem = list[key].cost;
			this.itemInfos1[list[key].type] = [costs.type, costs.id, costs.num];
			let cose10 = list[key]["costTen"].split(",");
			this.itemInfos10[list[key].type] = [parseInt(cose10[0]), parseInt(cose10[1]), parseInt(cose10[2])];
		}
		this.costMoney = parseInt(Constant.get('ZHONGQIU_CHONGZHI'));
		this.rewardItems = GameCommon.getInstance().onParseAwardItemstr(Constant.get('ZHONGQIU_CHONGZHIREWARDS'));
	}

	public parseInit(msg: Message){
		this.surplusMoney = msg.getInt();
	}
	public parseGet(msg: Message): void {
		this.surplusMoney = msg.getInt();
		this.payMoney = msg.getInt();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public parseRun(msg: Message): void {
		this.itemList = null;
		this.conType = msg.getByte();
		if(this.conType > 0){
			this.itemList = [];
			for(let i = 0; i < this.conType; ++i){
				this.itemList[i] = new ItemBody();
				this.itemList[i].parseMsg(msg);
			}
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	public getZhongQiuData(){
		var message = new Message(MESSAGE_ID.ACT_FEAST_GET_MESSAGE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
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
	private getItemInfos(count: number = 1){
		if(count <= 1){
			return this.itemInfos1;
		}
		return this.itemInfos10;
	}
	public getGoodsName(type: ZHUANPAN_TYPE, count: number = 1): string{
		let itemData = this.getItemInfos(count)[type];
		if(!itemData) return '';
		return GameCommon.getInstance().getThingModel(itemData[0], itemData[1]).name;
	}
	public getGoodsNum(type: ZHUANPAN_TYPE, count: number = 1):number{
		let itemData = this.getItemInfos(count)[type];
		if(!itemData) return 0
		return DataManager.getInstance().bagManager.getGoodsThingNumById(itemData[1], itemData[0]);
	}
	public getGoodsCost(type: ZHUANPAN_TYPE, count: number = 1):number{
		if(!this.getItemInfos(count)[type]) return 0;
		return this.getItemInfos(count)[type][2];
	}
	public isCanReceive(){
		return this.surplusMoney >= this.costMoney;
	}
	public getActivityPointAll(): boolean{
		if(this.isCanReceive()){
			return true;
		}
		let list = JsonModelManager.instance.getModelfeastzhuanpan();
		for(let key in list){
			if(this.getActivityPoint(list[key].type)){
				return true;
			}
		}
		return false;
	}
	public getActivityPointPanel(type: ZHUANPAN_TYPE): boolean{
		if(this.isCanReceive()){
			return true;
		}
		if(this.getActivityPoint(type)){
			return true;
		}
		return false;
	}
	public getActivityPoint(type: ZHUANPAN_TYPE = ZHUANPAN_TYPE.draw, count: number = 1): boolean{
		return this.getGoodsNum(type, count) >= this.getGoodsCost(type, count);
	}
	public getCurrModel(type: ZHUANPAN_TYPE):Modelfeastzhuanpan{
		return this.currModels[type];
	}
	public getActionPanel(type: ZHUANPAN_TYPE){
		switch(type){
			case ZHUANPAN_TYPE.draw:
				return "ActivityZhongqiuDraw";
			case ZHUANPAN_TYPE.poker:
				return "ActivityZhongqiuPoker";
			case ZHUANPAN_TYPE.turntable:
				return "ActivityZhongqiuTurntable";
			case ZHUANPAN_TYPE.dan:
				return "ActivityZhongqiuDan";
		}
	}
	public getActionTitle(type: ZHUANPAN_TYPE){
		switch(type){
			case ZHUANPAN_TYPE.draw:
				return "抽签";
			case ZHUANPAN_TYPE.poker:
				return "翻牌";
			case ZHUANPAN_TYPE.turntable:
				return "转盘";
			case ZHUANPAN_TYPE.dan:
				return "砸蛋";
		}
	}
	public getActionIcon(type: ZHUANPAN_TYPE){
		switch(type){
			case ZHUANPAN_TYPE.draw:
				return "shanggushenqian_png";
			case ZHUANPAN_TYPE.poker:
				return "xinyunxianpai_png";
			case ZHUANPAN_TYPE.turntable:
				return "sanjiezhuanpa_png";
			case ZHUANPAN_TYPE.dan:
				return "xingyunzadan_icon_png";
		}
	}
}
enum ZHUANPAN_TYPE{
	default,
	draw,//抽签
	poker,//翻拍
	turntable,// 转盘
	dan,// 砸蛋
	end
}