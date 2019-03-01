class UnionBossFight extends BaseFightScene implements IFightScene {
	private currPointIndex: number;//野外关卡内刷哪一个怪的编号 
	private currBossId: number;
	private fightDrops: AwardItem[];
	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BOSS_RESUTL_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BOSS_FIGHT_MESSAGE.toString(), this.onResFightUpdateMsg, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BOSS_FIGHT_MESSAGE.toString(), this.onResFightUpdateMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BOSS_RESUTL_MESSAGE.toString(), this.onResFightResult, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(enterdupMsg: Message): void {
		super.onParseFightMsg(enterdupMsg);
		this.currBossId = enterdupMsg.getByte();
		this.onSwitchMap(this.unionbossModel.mapid);
	}
	public get unionbossModel(): ModelguildBoss {
		return JsonModelManager.instance.getModelguildBoss()[this.currBossId];
	}
	//开始战斗
	private currBossHp: number = 0;
	private beforeBossHp: number = 0;
	private monsterBody: MonsterBody;
	protected onStartFight(): void {
		this.mainscene.heroBody.isDamageFalse = false;
		let bossmodelId: number = 0;
		let showawarditem: AwardItem;
		// this.fight_info_bar.currentState = 'rank';
		bossmodelId = this.unionbossModel.bossId;
		showawarditem = this.unionbossModel.rewards[0];
		// (this.fight_info_bar['show_award_icon'] as GoodsInstance).onUpdate(showawarditem.type, showawarditem.id, 0, showawarditem.quality, showawarditem.num);
		this.fight_info_bar.currentState = "gerenboss";
		let gerenAwardGrp: eui.Group = this.fight_info_bar['geren_reward_grp'];
		gerenAwardGrp.removeChildren();
		let rewards: AwardItem[] = this.unionbossModel.rewards
		for (let i: number = 0; i < rewards.length; i++) {
			var instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(rewards[i]);
			gerenAwardGrp.addChild(instance);
		}

		super.onStartFight();
		this.onUpdateDupWave();
		if (this.rushData) {
			this.mainscene.getBodyManager().onRushMonster(this.rushData);
		}
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.DupInfoBarSkin;
			this.fight_info_bar.x = Globar_Pos.x;
			this.fight_info_bar.y = size.height - this.fight_info_bar.height;
		}
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	//请求结果
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.UNION_BOSS_RESUTL_MESSAGE);
		resultFightMsg.setByte(this.currBossId);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
	}
	//战斗结果返回
	private onResFightResult(event: GameMessageEvent): void {
		var msg: Message = event.message;
		var result: number = msg.getByte();
		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler(msg);
		} else if (result == FightDefine.FIGHT_RESULT_FAIL) {
			this.onResultLoseHandler();
		}
	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		//掉落
		var winparam: DupWinParam = new DupWinParam();
		winparam.dropList = this.unionbossModel.rewards;
		var firstName: number = msg.getByte();
		winparam.resultParam = '';
		winparam.specialDesc = '';
		Tool.callbackTime(function (): void {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", winparam));
		}, this, 1000);
	}
	//失败处理
	private onResultLoseHandler(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupLosePanel", null));
	}
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		this.currPointIndex = 0;
		var bornPoint: egret.Point;
		bornPoint = this.mainscene.mapInfo.getXYByGridIndex(this.mainscene.mapInfo.bronNodeId);
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		this.currPointIndex++;

		if (this.isLast) {
			this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
		} else {
			this.onStartFight();
		}
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	protected onTouchLeaveBtn(): void {
		var quitNotice = [{ text: `是否确认退出副本？` }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onQuitScene, this))
		);
	}
	public onQuitScene(): void {
		this.onFightLose();
		this.mainscene.onReturnYewaiScene();
	}
	/***属性接口***/
	//关卡数据刷新
	private isLast: boolean;//是否到最后
	private onUpdateDupWave(): void {
		if (this.unionbossModel && this.unionbossModel.point.length > this.currPointIndex) {
			let _rebornPoints: string[] = this.unionbossModel.point.split(",");
			this.isLast = _rebornPoints.length - 1 == this.currPointIndex;
			this._rushData.isBoss = this.isLast && this.unionbossModel.bossId > 0;
			this._rushData.monsterId = this._rushData.isBoss ? this.unionbossModel.bossId : this.unionbossModel.monsterId;//[this.currPointIndex % this.unionbossModel.monsterId.length];

			this._rushData.refreshGrid = Number(_rebornPoints[this.currPointIndex])
			if (this._rushData.refreshGrid == 0) {
				this._rushData = null; return;
			}
			this._rushData.refreshNum = this._rushData.isBoss ? 1 : this.unionbossModel.num;
		} else {
			this._rushData = null;
		}
	}
	//The end
}