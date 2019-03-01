class EscortFight extends BaseFightScene implements IFightScene {
	private enemyDatas: PlayerData[];
	private Escort_MapId: number = 10017;
	private Self_rebronNode: number = 62;
	private Enemy_rebronNode: number = 17;
	private quality: number;
	private anim: Animation;
	private _rerult: number = 0;
	private gameNum: number = 1;
	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);
		this.quality = msg.getByte();
		this.gameNum = msg.getShort();
		this._rerult = msg.getByte();
		this.enemyDatas = GameFight.getInstance().onParsePVPEnemyMsg(msg);

		this.onSwitchMap(this.Escort_MapId);
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		if (this.enemyDatas) {
			this.mainscene.getBodyManager().onInitAreraScene(this.enemyDatas, this.Self_rebronNode, this.Enemy_rebronNode)
		}
		// var randomMapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.Enemy_rebronNode);
		// var pos: egret.Point = this.mainscene.mapInfo.getGridRdXYByIndex(135);
		// if (!this.anim) {
		// 	this.anim = new Animation("yunbiao_0" + this.quality, -1);
		// 	this.anim.x = pos.x;
		// 	this.anim.y = pos.y;
		// 	GameFight.getInstance().addBodyToMapLayer(this.anim);
		// }
	}
	//主角击杀目标
	public onKillTargetHandle(): void {
		this.onResFightResult();
	}
	//请求结果
	public onFinishFight(result: number): void {
		// super.onFinishFight(result);
		// var resultFightMsg: Message = new Message(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE);
		// resultFightMsg.setInt(DataManager.getInstance().escortManager.robID);
		// resultFightMsg.setByte(result);
		// // resultFightMsg.setInt(0);
		// GameCommon.getInstance().sendMsgToServer(resultFightMsg);
	}
	//战斗结果返回
	// 下行：byte   结果
	// short   今日抢劫次数
	// byte   抢劫的品质   
	private onResFightResult(): void {
		var resultParam = null;
		// var msg: Message = event.message;
		// var fightResult: number = msg.getByte();
		DataManager.getInstance().escortManager.escort.rob = this.gameNum;// msg.getShort();
		if (this._rerult == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler();
		} else {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(): void {
		let quality: number = this.quality;
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
		this.onResFightResult();
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
		if (this.anim) {
			this.anim.onDestroy();
			this.anim = null;
		}
		super.onDestroyScene();
	}
	/***属性接口***/
	//The end
}