class CrossPVEBossFight extends BaseFightScene implements IFightScene {
	private totalTime: number;//活动总时间
	private upDamage: number;//伤害增长
	private startDamage: number;//当前伤害
	private totalDamage: number;//总伤害值
	private oneDamage: number;//每次攻击伤害
	private model: Modelkuafuboss;
	private monsterBody: MonsterBody;
	private LiveRound: number = 0;//存活回合
	private currRound: number = 0;//当前回合
	private robots: ActionBody[];
	/**常量**/
	private timerRunTime: number = 500;

	public constructor(mainscene: MainScene) {
		super(mainscene);
		let bosstimeParam: string[] = Constant.get(Constant.KUAFU_BOSS_TIME).split(',');
		this.totalTime = (parseInt(bosstimeParam[1]) - parseInt(bosstimeParam[0])) * 3600;
	}
	protected registFightMessage(): void {
		super.registFightMessage();
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
	}
	protected removeFightMessage(): void {
		super.removeFightMessage();
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CLOSE_RESULT_VIEW, this.onCloseResultView, this);
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
	}
	public get PVEBossData(): CrossPVEBossData {
		return DataManager.getInstance().dupManager.crossPVEBoss;
	}
	/***-------------战斗逻辑处理---------------***/
	public onParseFightMsg(msg: Message): void {
		super.onParseFightMsg(msg);
		let modelid: number = msg.getShort();
		this.model = JsonModelManager.instance.getModelkuafuboss()[modelid];
		if (!this.model) {
			GameCommon.getInstance().addAlert('error_tips_10006');
			return;
		}
		this.upDamage = msg.getLong();
		this.totalDamage = msg.getLong();
		this.startDamage = Math.max(0, this.totalDamage - this.upDamage);
		this.onSwitchMap(this.model.map);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (!this.fight_info_bar) {
			this.fight_info_bar = new eui.Component();
			this.fight_info_bar.skinName = skins.CrossPVEBossFightBar;
			this.fight_info_bar.x = Globar_Pos.x;
			this.fight_info_bar.y = size.height - 198;
		}
		let yulanAward: AwardItem = this.model.rewards[0];
		(this.fight_info_bar['yulan_goods'] as GoodsInstance).onUpdate(yulanAward.type, yulanAward.id, null, yulanAward.quality);
		this.mainscene.getModuleLayer().addToMainview(this.fight_info_bar);
		super.onInitFightInfoBar();
	}
	//开始战斗
	protected onStartFight(): void {
		super.onStartFight();
		this.mainscene.heroBody.isDamageFalse = true;
		let fightBossID: number = this.model.modelId;
		let mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		this.monsterBody = this.mainscene.getBodyManager().onCreateMapBody(fightBossID, [mapNode], BODY_TYPE.BOSS) as MonsterBody;
		this.monsterBody.isDamageFalse = true;
		this.monsterBody.ignoreDist = true;
		this.monsterBody.onClearTargets();
		this.mainscene.getModuleLayer().onShowBossHpBar(this.monsterBody.data);
		//创建场景假人
		let rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 1);
		this.robots = [];
		let robotSize: number = Math.round(Math.random() * 2) + 2;
		for (let i: number = 0; i < robotSize; i++) {
			let robotBody: ActionBody = this.mainscene.getBodyManager().onCreateFakerPlayerToSnece(0.8, 1.2, rebornNodes, '');
			robotBody.isDamageFalse = true;
			robotBody.onAddEnemyBodyList([this.monsterBody]);
			this.robots.push(robotBody);
		}
		//各种属性初始化
		this.LiveRound = parseInt(Constant.get(Constant.KUAFU_BOSS_HUIHE));
		let liveRound: number = this.LiveRound;
		if (this.mainscene.heroBody.data.reborncount > 0) {
			liveRound += 2;
		}
		this.oneDamage = Tool.toInt(this.upDamage / liveRound);
		this.currRound = 0;
		//本场战斗总伤害
		this.fight_info_bar['curr_damage_lab'].text = '0';
		//总共对BOSS造成
		this.fight_info_bar['total_damage_lab'].text = (this.totalDamage - this.upDamage).toString();
		//BOSS触发技能剩余
		this.fight_info_bar['live_left_lab'].text = 'BOSS响指倒计时：10';

		Tool.addTimer(this.onTimerDown, this, this.timerRunTime);
		Tool.callbackTime(this.onShowBossSpeak, this, 1000, '当我打起这个响指时,你们这帮蝼蚁将灰飞烟灭...');
	}
	//显示BOSS的说话
	private onShowBossSpeak(speak: string): void {
		this.monsterBody.bodySpeak(speak);
	}
	//场景倒计时
	private onTimerDown(): void {
		//通用逻辑显示时间
		this.fight_info_bar['lefttime_lab'].text = Language.instance.getText('shengyushijian') + "：" + GameCommon.getInstance().getTimeStrForSec2(this.PVEBossData.lefttime, false);
		//如果时间到了BOSS死亡
		if (this.PVEBossData.lefttime <= 0) {
			if (this.monsterBody) {
				this.monsterBody.data.onRestHpInfo(0, this.totalTime);
				this.monsterBody.onDeath();
			}
		}
		//更新BOSS血条
		this.onUpdateBossHP();
	}
	//更新BOSS血条
	private onUpdateBossHP(): void {
		this.mainscene.getModuleLayer().onUpdateBossHpBar(this.PVEBossData.lefttime, this.totalTime);
	}
	//生物被打处理
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		if (attacker.data.bodyType == BODY_TYPE.SELF) {
			this.currRound++;
			//伤害累计
			let addDamage: number = this.currRound * this.oneDamage;
			//本场战斗总伤害
			this.fight_info_bar['curr_damage_lab'].text = Math.min(this.upDamage, addDamage).toString();
			//总共对BOSS造成
			this.fight_info_bar['total_damage_lab'].text = Math.min(this.totalDamage, this.startDamage + addDamage).toString();
			//BOSS触发技能剩余

			if (this.LiveRound > this.currRound) {
				let lefttime: number = Math.ceil((this.LiveRound - this.currRound) * 10 / this.LiveRound);
				this.fight_info_bar['live_left_lab'].text = 'BOSS响指倒计时：' + lefttime;
			} else {
				this.fight_info_bar['live_left_lab'].text = 'BOSS响指来袭';
				//BOSS进行一次秒杀式攻击
				if (!this.monsterBody.currTarget) {
					this.monsterBody.onAddEnemyBodyList([this.mainscene.heroBody]);
					this.monsterBody.currTarget = this.mainscene.heroBody;
				}
				if (this.LiveRound == this.currRound || this.currRound == this.LiveRound + 2) {
					this.monsterBody.data.getCanUseSkill();
					this.monsterBody.onAttack();
					//特效来袭
					this.onShowBossAtkEffect();
					if (this.robots) {
						this.onShowBossSpeak('再见了，蝼蚁们！');
						this.onKillAllRobots();
					}
					//BOSS对角色进行一次伤害
					let damageData: DamageData = new DamageData();
					damageData.attacker = hurtBody;
					damageData.scenetype = FIGHT_SCENE.CROSS_PVE_BOSS;
					damageData.value = this.mainscene.heroBody.data.maxHp + this.mainscene.heroBody.data.shieldValue;
					damageData.fromDire = attacker.checkFace(attacker.x, attacker.y);
					attacker.onHurt(damageData);
				}
			}
		}
	}
	//场景显示BOSS的技能特效
	private onShowBossAtkEffect(): void {
		let effectPos: egret.Point = new egret.Point(this.monsterBody.x, this.monsterBody.y - (this.monsterBody.data.model.high / 2));
		let rotations: number[] = [0, 90, 180, 270];
		for (let i: number = 0; i < rotations.length; i++) {
			let anim = GameCommon.getInstance().addAnimation('kf_pveboss_skill', effectPos, this.mainscene.heroBody.parent, 1);
			anim.rotation = rotations[i];
		}
		effectPos = null;
	}
	//请求结果
	public onFinishFight(result: number): void {
		super.onFinishFight(result);
		//本场战斗总伤害
		this.fight_info_bar['curr_damage_lab'].text = this.upDamage.toString();
		//总共对BOSS造成
		this.fight_info_bar['total_damage_lab'].text = this.totalDamage.toString();
		Tool.removeTimer(this.onTimerDown, this, this.timerRunTime);
		this.mainscene.getModuleLayer().onHideBossHpBar();
		Tool.callbackTime(this.onResultWinHandler, this, 1000);
	}
	//胜利处理
	private onResultWinHandler(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ServerPVEBossDmgView", new ServerPVEBossDmgParam(this.model.id, this.upDamage, 11)));
	}
	//杀死所有机器人
	private onKillAllRobots(): void {
		if (this.robots) {
			for (let i: number = this.robots.length - 1; i >= 0; i--) {
				this.mainscene.getBodyManager().onDestroyOhterOne(this.robots[i] as PlayerBody, false);
				this.robots[i] = null;
			}
			this.robots = null;
		}
	}
	/***-------------战斗逻辑结束---------------***/
	public onEnterSuccessScene(): void {
		//根据地图出生点随机出角色出生点
		var mapNode: ModelMapNode = this.mainscene.mapInfo.getNodeModelByIndex(this.mainscene.mapInfo.bronNodeId);
		var rebornNodes: ModelMapNode[] = this.mainscene.mapInfo.getGridListByDistance(mapNode, 2);
		var ramdomNode: ModelMapNode = rebornNodes[Math.floor(Math.random() * rebornNodes.length)];
		ramdomNode = ramdomNode ? ramdomNode : mapNode;
		//设置人物出生点
		var bornPoint: egret.Point = this.mainscene.mapInfo.getXYByGridIndex(ramdomNode.nodeId);
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
	private onCloseResultView(): void {
		this.mainscene.onReturnYewaiScene();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_SERVERPVEBOSS);
	}
	public onDestroyScene(): void {
		this.monsterBody = null;
		this.onKillAllRobots();
		super.onDestroyScene();
	}
	/***属性接口***/
	//The end
}