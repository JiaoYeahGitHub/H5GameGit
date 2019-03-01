class DiFuDupFight extends BaseFightScene implements IFightScene {
	private currPointIndex: number;//野外关卡内刷哪一个怪的编号
	private fightDrops: AwardItem[];

	private _dupinfo: DupInfo;
	private dupStar: number;
	public constructor(mainscene: MainScene) {
		super(mainscene);
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_RESULT_MESSAGE.toString(), this.onFightResult, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_RESULT_MESSAGE.toString(), this.onFightResult, this);
	}
	private _rerult: number = 0;
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(message: Message): void {
		super.onParseFightMsg(message);
		var enterSuccess: boolean = message.getBoolean();
		var dupStar: number = message.getByte();
		this._rerult = message.getByte();

		this.dupStar = dupStar;
		if (!enterSuccess) {
			this.onQuitScene();
			return;
		}
		GameFight.getInstance().onEnterDupSuccess(26);
		var model: Modelcopy = JsonModelManager.instance.getModelcopy()[26];
		var dupSubType: number = model.subType;

		this._dupinfo = DataManager.getInstance().dupManager.getDupInfo(model.type, dupSubType);
		GameFight.getInstance().dupfight_waveIndex = dupSubType;
		this.onSwitchMap(this._dupinfo.dupModel.mapid);
	}

	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.DupInfoBarSkin;
			this.fight_info_bar.x = Globar_Pos.x;
			this.fight_info_bar.y = size.height - 198;
		}
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	private difuCfg: Modeldifu;
	private rewards: AwardItem[];
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		this.fightDrops = [];
		this.currPointIndex = 0;
		let dup_time_out: number = 0;
		/**副本初始化**/
		this.fight_info_bar.currentState = "gerenboss";
		let gerenAwardGrp: eui.Group = this.fight_info_bar['geren_reward_grp'];
		gerenAwardGrp.removeChildren();
		this.difuCfg = JsonModelManager.instance.getModeldifu()[DataManager.getInstance().dupManager.xuezhanInfo.xuezhanWaveNum]
		this.rewards = GameCommon.getInstance().onParseAwardItemstr(this.difuCfg['reward' + this.dupStar]);
		for (let i: number = 0; i < this.rewards.length; i++) {
			var instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(this.rewards[i]);
			gerenAwardGrp.addChild(instance);
		}

		this.onFightHandler();

		if (dup_time_out > 0) {
			this.onStartDupTimer(dup_time_out);
		} else {
			this._leftDupTime = egret.getTimer();
		}
	}
	//战斗处理
	private onFightHandler(): void {
		this.onUpdateDupWave();
		if (this._rushData.refreshNum == 0) {
			return;
		}
		this.mainscene.getBodyManager().onRushMonster(this._rushData);
		let addAttrNum: number = this.difuCfg['nandu' + this.dupStar] * 100;
		let bossBody: BossBody = this.mainscene.heroBody.data.targets[0] as BossBody;
		for (let i: number = 0; i <= ATTR_TYPE.MAGICDEF; i++) {
			if (bossBody.data.attributes[i]) {
				bossBody.data.attributes[i] += Math.floor(bossBody.data.attributes[i] * (addAttrNum - GameDefine.GAME_ADD_RATIO) / GameDefine.GAME_ADD_RATIO);
			}
		}
	}
	//启动副本倒计时 totalTime倒计时总时间(单位秒)
	private _leftDupTime: number = 0;
	private onStartDupTimer(totalTime: number): void {
		this._leftDupTime = totalTime * 1000 + egret.getTimer();
		if (totalTime > 0) {
			Tool.addTimer(this.onTimerHandler, this, 1000);
		}
	}
	//关闭副本倒计时
	private onStopDupTimer(): void {
		Tool.removeTimer(this.onTimerHandler, this, 1000);
	}
	//副本倒计时处理
	private onTimerHandler(): void {
		//通用逻辑显示时间
		this.fight_info_bar['lefttime_lab'].text = Language.instance.getText('shengyushijian') + "：" + GameCommon.getInstance().getTimeStrForSec2(this.lefttime, false);
		//副本时间到了失败
		if (this.lefttime <= 0) {
			this.onFightLose();
		}
	}
	//副本剩余时间
	private get lefttime(): number {
		return Math.max(0, Math.ceil((this._leftDupTime - egret.getTimer()) / 1000));
	}
	private get useTime(): number {
		return Math.ceil((egret.getTimer() - this._leftDupTime) / 1000);
	}
	//请求结果
	public onFinishFight(result: number): void {
		if (this._status == FIGHT_STATUS.Result)
			return;
		super.onFinishFight(result);
		var resultFightMsg: Message = new Message(MESSAGE_ID.XUEZHAN_RESULT_MESSAGE);
		resultFightMsg.setByte(result);
		GameCommon.getInstance().sendMsgToServer(resultFightMsg);
		this.onStopDupTimer();
	}
	//战斗结果返回
	private onFightResult(event: GameMessageEvent): void {
		var msg: Message = event.message;
		var result: number = msg.getByte();
		if (result == FightDefine.FIGHT_RESULT_SUCCESS) {
			this.onResultWinHandler(msg);
		} else if (result == FightDefine.FIGHT_RESULT_FAIL) {
			DataManager.getInstance().dupManager.xuezhanInfo.onChangeInfo(msg)
			this.onResultLoseHandler();
		}

	}
	//胜利处理
	private onResultWinHandler(msg: Message): void {
		let dupId: number = GameFight.getInstance().fightDupId;
		let model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
		// let dupSubType: number;
		// let dupPassnum: number;
		// let num :number;
		// let bo1:boolean;
		// let isSelectBuff:boolean;
		// 	dupSubType = msg.getShort();
		// 	dupPassnum = msg.getShort();
		// 	num = msg.getByte();
		// 	bo1 = msg.getBoolean();
		// 	isSelectBuff = msg.getBoolean();
		// if(isSelectBuff)
		// {
		// 	var bufId =msg.getByte();
		// }
		DataManager.getInstance().dupManager.xuezhanInfo.onChangeInfo(msg)
		// DataManager.getInstance().dupManager.xuezhanInfo.onChallengeNum(dupSubType,dupPassnum,num,bo1,isSelectBuff);
		// dupSubType = model.subType;
		// let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(model.type, dupSubType);
		// dupinfo.pass = dupPassnum;
		//掉落
		let winparam: DupWinParam = new DupWinParam();
		winparam.dupinfo = null;
		winparam.dropList = this.rewards;
		for (let i: number = this.fightDrops.length - 1; i >= 0; i--) {
			winparam.dropList.unshift(this.fightDrops.shift());
		}

		Tool.callbackTime(this.onOpenResultPanel, this, 1000, winparam);
	}
	//生物被打处理
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk) {
			var hurdEnemys: ActionBody[] = attacker.data.targets;
			if (hurdEnemys.indexOf(hurtBody) < 0) {
				return;
			}
			let isPlayerWin: boolean = this._rerult == 1;
			if (attacker.hp <= 10) {
				if (isPlayerWin) {
					hurtBody.hp = 0;
					attacker.hp = 10;
					hurtBody.onDeath();
				}
			}
		} else if (hurtBody.data.bodyType == BODY_TYPE.SELF) {
			let isPlayerWin: boolean = this._rerult == 1;
			if (hurtBody.hp <= 10) {
				if (!isPlayerWin) {
					hurtBody.hp = 0;
					attacker.hp = 10;
					attacker.onDeath();
				}
			}
		}
		super.onBodyHurtHanlder(attacker, hurtBody, damage);
	}
	//打开结算面板
	private onOpenResultPanel(param: DupWinParam): void {
		let result_desc: string = "";
		let special_desc: string = "";
		let length: number = 0;
		param.resultParam = result_desc;
		param.specialDesc = special_desc;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupWinPanel", param));
	}
	//失败处理
	private onResultLoseHandler(): void {
		if (!this.isQuit) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DupLosePanel", null));
		}
	}
	protected onTouchLeaveBtn(): void {
		var quitNotice = [{ text: '中途退出则为失败，消耗一次复活次数，是否退出？' }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onQuitScene, this))
		);
	}
	//关闭面板反馈
	private onCloseResultView(event: egret.Event): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingMainPanel", 0));
	}
	//主角击杀目标
	public onKillTargetHandle(): void {
		super.onKillTargetHandle();
		// switch (this._dupinfo.dupModel.type) {
		// 	case DUP_TYPE.DUP_ZHUFU:
		// 		this.blessLeftCount = Math.max(this.blessLeftCount - 1, 0);
		// 		this.onupdateBlessProInfo();
		// 		if (this.blessLeftCount == 0) {
		// 			this.onFightWin();
		// 		}
		// 		break;
		// }
		this.onFightWin();
	}

	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		var bornPoint: egret.Point;
		var currLayerNum = DataManager.getInstance().dupManager.xuezhanLayerNum;
		var currstartWavenum: number = Math.max(1, (currLayerNum - 1) * GameDefine.Xuezhan_LayerWaveNum + 1);
		bornPoint = this.mainscene.mapInfo.getXYByGridIndex(this.mainscene.mapInfo.bronNodeId);
		this.mainscene.setHeroMapPostion(bornPoint);
		super.onEnterSuccessScene();
	}
	public onDeath(): void {
		this.onFightLose();
	}
	public onFightWin(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_SUCCESS);
	}
	public onFightLose(): void {
		this.onFinishFight(FightDefine.FIGHT_RESULT_FAIL);
	}
	private isQuit: boolean;
	public onQuitScene(): void {
		this.isQuit = true;
		this.onFightLose();
		this.mainscene.onReturnYewaiScene();
	}
	public onDestroyScene(): void {
		super.onDestroyScene();
		this.isQuit = null;
		this.onStopDupTimer();
	}
	/***属性接口***/
	//根据地图出生点随机出角色出生点
	private getRandomRebornNode(): ModelMapNode {
		let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		let rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 2);
		let ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
		ramdomNode = ramdomNode ? ramdomNode : mapNode;
		return ramdomNode;
	}
	private onUpdateDupWave(): void {
		this._rushData.monsterId = this.difuCfg.fightId;
		this._rushData.refreshGrid = this.difuCfg.point;
		this._rushData.refreshNum = 1;
		this._rushData.back_goType = FUN_TYPE.FUN_DUP_XUEZHAN;
	}
	//The end
}