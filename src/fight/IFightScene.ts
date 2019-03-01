interface IFightScene {
	//当前场景类型
	sceneTpye: FIGHT_SCENE;
	//战斗状态
	fightStatus: FIGHT_STATUS;
	//心跳间隔
	TickInterval: number;
	//获取当前的关卡信息
	rushData: RushEnemyData;
	//获取当前地图信息
	mapInfo: MapInfo;
	//初始化场景
	onInitScene(scenetype: FIGHT_SCENE): void;
	//切换地图
	onSwitchMap(mapid): void;
	//解析服务器返回场景相关数据
	onParseFightMsg(msg: Message): void;
	//开始进入场景loading
	onLoadingSceneRes(mapid: number): void;
	//进入场景成功
	onEnterSuccessScene(): void;
	//战斗结束
	onFinishFight(result: number): void;
	//攻击处理逻辑
	onBodyHurtHanlder(attacker: ActionBody, hurtBody: ActionBody, damage: DamageData): void;
	//刷怪逻辑处理
	onRushMonster(): void;
	//主角杀死目标
	onKillTargetHandle(): void;
	//主角阵亡
	onDeath(): void;
	//战斗成功
	onFightWin(): void
	//战斗失败
	onFightLose(): void;
	//销毁场景
	onDestroyScene(): void;
	//退出场景
	onQuitScene(): void;
}
enum FIGHT_STATUS {
	Loading = 0,//正在加载场景
	Enter = 1,//进入成功
	Requset = 2,//战斗请求中
	Fighting = 3,//战斗中进行中
	Result = 4,//战斗完成结算
	Leave = 5,//已退出此场景
}