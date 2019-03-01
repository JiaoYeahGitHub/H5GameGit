class TotalConsumeManager {
	//消耗进度
	public consumeitem_pro: number;
	public consumeitem_round: number;
	public consumeitemModel: Modelleijixiaohao;
	//消耗排行榜
	public consumeitem_ranks: CrossServerConsumeRank[];
	public consume_meRank: number = -1;
	//消耗转盘
	public consumeturnplate_num: number = 0;//消耗转盘抽奖次数
	public turnplateNum: number = 0;//转盘可用次数

	public constructor() {
		this.consumeitem_ranks = [];
	}
	public parseMessage(msg: Message) {
		this.consumeitem_round = msg.getByte();
		this.consumeitem_pro = msg.getInt();
		this._consumeitemScore = 0;
		if (!this.consumeitemModel || this.consumeitemModel.round != this.consumeitem_round) {
			for (let id in JsonModelManager.instance.getModelleijixiaohao()) {
				let model: Modelleijixiaohao = JsonModelManager.instance.getModelleijixiaohao()[id];
				if (model.round == this.consumeitem_round) {
					this.consumeitemModel = model;
					GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onListenerConsume, this);
					break;
				}
			}
			this.onRequestTurnplateInfoMsg();
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**由于服务器并不会实时下发消耗进度，客户端兼听道具消耗，如果上一次请求的积分数不足一次抽奖积分，届时兼听消耗达到积分重新去向服务器问一下消耗进度**/
	private _consumeitemScore: number = 0;
	private onListenerConsume(msgEvent: GameMessageEvent): void {
		if (!this.consumeitemModel) return;
		if (!DataManager.getInstance().activityManager.getActIsOpen(ACTIVITY_BRANCH_TYPE.CONSUME_ITEM)) {
			GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onListenerConsume, this);
			this.consumeitemModel = null;
		} else {
			let itemAwd: AwardItem = msgEvent.message as AwardItem;
			if (itemAwd && this.consumeitemModel.itemId == itemAwd.id && itemAwd.type == GOODS_TYPE.ITEM) {
				this._consumeitemScore += this.consumeitemModel.jifen;
				let consumescore: number = parseInt(Constant.get(Constant.LEIJIXIAOHAO_SCORE));
				let totalscore: number = this.consumeitemModel.jifen * this.consumeitem_pro - consumescore * this.consumeturnplate_num;
				if (totalscore < consumescore && totalscore + this._consumeitemScore >= consumescore) {
					this.requestConsumeItemMsg();
				}
			}
		}
	}
	//请求消耗道具的进度
	public requestConsumeItemMsg(): void {
		let msg: Message = new Message(MESSAGE_ID.ACTIVITY_CONSUMEITEM_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(msg);
	}
	//消耗排行榜解析
	public parseRankMsg(msg: Message): void {
		this.consumeitem_ranks = [];
		this.consume_meRank = -1;
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			if (!this.consumeitem_ranks[i]) {
				this.consumeitem_ranks[i] = new CrossServerConsumeRank();
			}
			let rankData: CrossServerConsumeRank = this.consumeitem_ranks[i];
			rankData.parseMsg(msg);
			if (rankData.playerId == DataManager.getInstance().playerManager.player.id) {
				this.consume_meRank = rankData.rank;
			}
		}
		this.consumeitem_pro = msg.getInt();
		this._consumeitemScore = 0;
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//请求查询转盘的次数
	public onRequestTurnplateInfoMsg(): void {
		let msg: Message = new Message(MESSAGE_ID.ACTIVITY_CONSUME_TURNPLATE_MSG);
		msg.setByte(0);
		GameCommon.getInstance().sendMsgToServer(msg);
	}
	//消耗转盘的解析
	public parseTurnplateMsg(msg: Message): void {
		this.consumeturnplate_num = msg.getShort();
		let type: number = msg.getByte();
		let awarditem: AwardItem;
		if (type == 1) {//1是抽奖结果 0是查询结果
			awarditem = new AwardItem(msg.getByte(), msg.getShort(), msg.getInt());
			this.updateTurnplateNum();
			GameCommon.getInstance().receiveMsgToClient(msg, awarditem);
		} else {
			this.updateTurnplateNum();
			GameCommon.getInstance().receiveMsgToClient(msg, null);
		}
	}
	//更新一下转盘的剩余转次
	private updateTurnplateNum(): void {
		if (this.consumeitemModel) {
			let consumescore: number = parseInt(Constant.get(Constant.LEIJIXIAOHAO_SCORE));
			this.turnplateNum = Math.floor(Math.max(0, this.consumeitemModel.jifen * this.consumeitem_pro - consumescore * this.consumeturnplate_num) / consumescore);
		} else {
			this.turnplateNum = 0;
		}
	}
	//转盘活动红点
	public oncheckTurnplateRedPoint(): boolean {
		return this.turnplateNum > 0;
	}
	//红点
	public onCheckRedPoint(): boolean {
		if (this.oncheckTurnplateRedPoint()) return true;
		return false;
	}
	//The end
}