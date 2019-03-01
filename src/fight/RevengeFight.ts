class RevengeFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private Escort_MapId: number = 10019;
	private Self_rebronNode: number = 64;
	private Enemy_rebronNode: number = 11;
	private quality: number;
	private _rerult: number = 0;
	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_REVENGE_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_REVENGE_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);
		this._rerult = msg.getByte();
		this.quality = msg.getByte();
		this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);
		this.onSwitchMap(this.Escort_MapId);
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		if (this.enemyDatas) {
			this.mainscene.getBodyManager().onInitAreraScene(this.enemyDatas, this.Self_rebronNode, this.Enemy_rebronNode)
		}
	}
	//请求结果
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.ESCORT_REVENGE_RESULT_MESSAGE);
		resultFightMsg.setInt(DataManager.getInstance().escortManager.revengeID);
		resultFightMsg.setInt(Math.floor(DataManager.getInstance().escortManager.revengeTime / 1000));
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
	}
	//战斗结果返回
	// 下行：byte   结果
	// short   今日抢劫次数
	// byte   抢劫的品质   
	private onResFightResult(event: GameMessageEvent): void {
		var resultParam = null;
		var msg: Message = event.message;
		var fightResult: number = msg.getByte();
		if (fightResult == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler(msg);
		} else {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		let quality: number = msg.getByte();
		let model: Modeldujie = JsonModelManager.instance.getModeldujie()[quality];
		let item: AwardItem;
		//掉落
		let winparam: DupWinParam = new DupWinParam();
		let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
		for (let i: number = 0; i < rewards.length; i++) {
			let awarditem: AwardItem = rewards[i];
			item = new AwardItem(awarditem.type, awarditem.id, awarditem.num * 0.1, awarditem.quality);
			winparam.dropList.push(item);
		}
		winparam.resultParam = GameCommon.getInstance().readStringToHtml(Language.instance.parseInsertText('chenggongqiangduo', this.enemyDatas[0].name, `[#${GameCommon.Quality_Color_String[quality]}${model.name}]`));
		winparam.specialDesc = Language.instance.getText('qiangduoxiannv_teshu');
		Tool.callbackTime(this.onOpenResultPanel, this, 1000, winparam);
	}
	//打开结算面板
	private onOpenResultPanel(winparam: DupWinParam): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", winparam));
	}
	//失败处理
	private onResultLoseHandler(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DupLosePanel");
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_DUJIE);
	}
	/***-------------战斗逻辑结束---------------***/
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	public onDestroyScene(): void {
		// for (var i: number = this.enemyDatas.length - 1; i >= 0; i--) {
		// 	this.enemyDatas[i] = null;
		// 	this.enemyDatas.splice(i, 1);
		// }
		this.enemyDatas = null;
		super.onDestroyScene();
	}
	/***属性接口***/
	//The end
}