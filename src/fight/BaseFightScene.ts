abstract class BaseFightScene implements IFightScene {
	protected mainscene: MainScene;
	protected _status: FIGHT_STATUS;
	protected _rushData: RushEnemyData;
	protected _scenetype: FIGHT_SCENE;
	protected fight_info_bar: eui.Component;//战斗信息界面

	public constructor(mainscene: MainScene) {
		this.mainscene = mainscene;
	}
	public onInitScene(scenetype: FIGHT_SCENE): void {
		if (!this._rushData) {
			this._rushData = new RushEnemyData();
		}
		this._scenetype = scenetype;
		this.mainscene.onResetAllHeroBody();
		this.mainscene.getModuleLayer().onRefreshScene();
	}
	//注册场景战斗协议兼听
	protected registFightMessage(): void {
		// GameDispatcher.getInstance().addEventListener(GameEvent.GAME_UPDATE_ROLELIST, this.onUpdateHeroInfo, this);
		if (this.fight_info_bar) {
			this.fight_info_bar['leave_btn'].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLeaveBtn, this);
		}
	}
	//移除场景战斗协议兼听
	protected removeFightMessage(): void {
		// GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_UPDATE_ROLELIST, this.onUpdateHeroInfo, this);
		if (this.fight_info_bar) {
			this.fight_info_bar['leave_btn'].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLeaveBtn, this);
		}
	}
	//接收到服务器的关于场景的战斗协议处理
	public onParseFightMsg(msg: Message): void {
	}
	//加载场景的必要资源
	protected lodingResList: string[];
	public onLoadingSceneRes(mapid: number): void {
		this.lodingResList = [];
		this.onCraeteLoadRes(mapid);
		this.mainscene.getModuleLayer().onshowGameloadingUI(this.onLoadComplete, this, this.lodingResList);
	}
	//初始化战斗信息界面
	protected onInitFightInfoBar(): void {
		if (this.fight_info_bar) {
			if (DataManager.IS_PC_Game) {
				this.fight_info_bar.width = GameDefine.GAME_STAGE_WIDTH;
			} else {
				this.fight_info_bar.width = size.width;
			}
		}
	}
	//切换地图
	private _isChangeMap: boolean;
	public onSwitchMap(mapid: number): void {
		this._isChangeMap = true;
		this.onInitFightInfoBar();
		this.mainscene.getModuleLayer().onHideBossHpBar();
		if (this.mainscene.mapInfo.mapId == mapid) {
			this._isChangeMap = false;
			this.onLoadComplete();
			return;
		}
		this.removeFightMessage();
		// LoadManager.getInstance().onClearUIAnimCache();
		SkillEffectManager.getInstance().onDestroyAllSkillEffect();
		this.mainscene.getBodyManager().onRefreshSence();
		this.mainscene.getMapLayer().removeBodyLayerAll();
		this.mainscene.pauseFightRun();
		this.mainscene.getBodyManager().fightPause = true;
		this.mainscene.getModuleLayer().onPlayPassSceneAnim();

		this._status = FIGHT_STATUS.Loading;
		this.mainscene.mapInfo.onRefreshMapInfo(mapid);
	}
	//加载成功
	private onLoadComplete(): void {
		// this.mainscene.getModuleLayer().onHideGameloadingUI();

		this.setStagePointType();
		if (this._isChangeMap) {
			this.mainscene.getMapLayer().onRefreshMap();
		}
		this._status = FIGHT_STATUS.Enter;
		this.onEnterSuccessScene();
		this.onStartFight();
		this.mainscene.onupdateHero();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SCENE_ENTER_SUCCESS));
	}
	//设置镜头的位置
	protected setStagePointType(): void {
		this.mainscene.mapInfo.heroPointType = CameraType.CENTER;
	}
	protected onStartFight(): void {
		this._status = FIGHT_STATUS.Fighting;
		this.mainscene.getBodyManager().fightPause = false;
	}
	//进入场景前需要加载的资源列表
	protected onCraeteLoadRes(mapid): void {
		//地图 马赛克地图
		var mapModel: Modelmap = JsonModelManager.instance.getModelmap()[mapid];
		// var mapType: string = mapModel.isPng ? "_png" : "_jpg";
		this.lodingResList.push("map" + mapModel.resources + "_small_jpg");
		if (this.mainscene.mapInfo.fightId > 0) {
			var waveXmlRes: string = this.mainscene.mapInfo.fightId + "_fight_xml";
			this.lodingResList.push(waveXmlRes);
		}
	}
	public onEnterSuccessScene(): void {
		this.registFightMessage();
		this.mainscene.startFightRun();
	}
	public onDeath(): void {
	}
	public onFightWin(): void {
	}
	public onFightLose(): void {
	}
	//刷怪逻辑
	public onRushMonster(): void {

	}
	//生物被打处理
	public onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void {
		let isHeroAtk: boolean = GameFight.getInstance().onCheckBodyIsHero(attacker.data);
		if (isHeroAtk) {
			var hurdEnemys: ActionBody[] = this.mainscene.heroBody.data.targets;
			if (hurdEnemys.indexOf(hurtBody) < 0) {
				return;
			}
			//被打才还手的逻辑 同时叫上当前这一波兄弟一起还手
			for (var i: number = 0; i < hurdEnemys.length; i++) {
				var hurtBody: ActionBody = hurdEnemys[i];
				if (egret.is(hurtBody, "BossBody")) {
					var monsterData: MonsterData = hurtBody.data as MonsterData;
					if (hurtBody.data.targets.length == 0) {
						this.mainscene.getModuleLayer().onShowBossHpBar(monsterData);
					}
					this.mainscene.getModuleLayer().onUpdateBossHpBar(monsterData.currentHp, monsterData.maxHp);
				}

				if (hurtBody.data.targets.length == 0) {
					hurtBody.onAddEnemyBodyList(this.mainscene.heroBodys);
				}
			}
		}
	}
	//主角击杀目标
	public onKillTargetHandle(): void {
		if (this._status == FIGHT_STATUS.Fighting) {
			if (this.mainscene.heroBody.data.targets.length == 0) {
				this.onFightWin();
			}
		}
	}
	public onFinishFight(result: number): void {
		this.mainscene.getBodyManager().fightPause = true;
		this._status = FIGHT_STATUS.Result;
	}
	public onDestroyScene(): void {
		this.removeFightMessage();
		this.mainscene.getModuleLayer().overBossIncomeingAnim();
		if (this.fight_info_bar && this.fight_info_bar.parent) {
			this.fight_info_bar.parent.removeChild(this.fight_info_bar);
		}
		this._status = FIGHT_STATUS.Leave;
		// GameFight.getInstance().serverFightResult = FightDefine.FIGHT_NOT_SERVERREUSLT;
	}
	protected onTouchLeaveBtn(): void {
		var quitNotice = [{ text: Language.instance.getText("zhongtutuichushuoming") }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onQuitScene, this))
		);
	}
	public onQuitScene(): void {
		if (GameFight.getInstance().fightsceneTpye != this.sceneTpye) {
			return;
		}
		this.mainscene.onReturnYewaiScene();
	}
	//新增英雄上场
	private onUpdateHeroInfo(): void {
		// this.mainscene.onupdateHero(false);
		// //出生
		// for (var i: number = 0; i < this.mainscene.heroBodys.length; i++) {
		// 	var heroBody: PlayerBody = this.mainscene.heroBodys[i];
		// 	if (!heroBody.parent) {
		// 		this.mainscene.setHeroMapPostion(new egret.Point(this.mainscene.heroBody.x, this.mainscene.heroBody.y));
		// 		heroBody.onAddEnemyBodyList(this.mainscene.heroBody.data.targets);
		// 	}
		// }
	}
	//BOSS入场的动画
	protected playBossIncomeAnim(): void {
		this.mainscene.getModuleLayer().playBossIncomingAnim();
		this.mainscene.getBodyManager().fightPause = true;
		Tool.callbackTime(function (sceneTpye: FIGHT_SCENE) {
			if (GameFight.getInstance().fightsceneTpye == sceneTpye) {
				this.mainscene.getBodyManager().fightPause = false;
			}
		}, this, 1000, this.sceneTpye);
	}
	/***属性接口***/
	public get sceneTpye(): FIGHT_SCENE {
		return this._scenetype;
	}
	public get fightStatus(): FIGHT_STATUS {
		return this._status;
	}
	public get TickInterval(): number {
		return 5000;
	}
	public get rushData(): RushEnemyData {
		return this._rushData;
	}
	public get mapInfo(): MapInfo {
		return this.mainscene.mapInfo;
	}
}
/**关卡的数据结构**/
class RushEnemyData {
	public monsterId;
	public refreshGrid: number;
	public refreshNum: number;
	public isBoss: boolean;//是不是BOSS关卡
	public progress: number;//几波怪见BOSS
	public limittime: number;
	public back_goType: number = 0;//退出返回面板
}