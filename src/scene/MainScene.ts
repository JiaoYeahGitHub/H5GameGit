// TypeScript file
class MainScene extends egret.DisplayObjectContainer {
    public gameworld: GameWorld;

    private allFightScenes;
    private gameheroBodys: PlayerBody[];
    private _mapLayer: MapLayer;
    private _moduleLayer: ModuleLayer;
    private _bodyManager: BodyManager;
    private targetPoint: egret.Point;
    private playerData: PlayerData;
    private Tick_Interval: number = 5000;

    public constructor(gameworld: GameWorld) {
        super();
        this.gameworld = gameworld;
        GameFight.getInstance().setMainscene(this);
    }
    public onStarGame(): void {
        this.gameheroBodys = [];

        this._mapLayer = new MapLayer(this);//地图层
        this.addChild(this._mapLayer);
        this._moduleLayer = new ModuleLayer(this);//界面层
        this.addChild(this._moduleLayer);
        this._bodyManager = new BodyManager(this);//生物逻辑管理
        this.onRegistAllScene();

        GameFight.getInstance().onInitJackaroo();
        this.onupdateHero();//创建人物
        this.onRegistGameEvent();
        this.onReturnYewaiScene();
    }
    //初始化通信内容
    private _initMsgCount: number = 0;
    public onInitRequestMsg(): void {
        this._initMsgCount = 0;
        this.onCallBackRequestMsg(DataManager.getInstance().arenaManager, 'onSendServerArenaInfoMsg');
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_PERSONALLY);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_CAILIAO);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_CHALLENGE);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_SIXIANG);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_ZHUFU);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_DIFU);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_TEAM);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_BLESS);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'onRequestDupInofMsg', DUP_TYPE.DUP_LINGXING);
        // this.onCallBackRequestMsg(DataManager.getInstance().friendManager, 'onSendGetFriendMessage', FRIEND_LIST_TYPE.APPLY);
        // this.onCallBackRequestMsg(DataManager.getInstance().tOPRankGiftManager, 'onSendMessage');
        this.onCallBackRequestMsg(DataManager.getInstance().arenaManager, 'onSendLocalArenaInfoMsg');
        this.onCallBackRequestMsg(DataManager.getInstance().arenaManager, 'onSendLadderInfoMsg');
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'requstSamsareBossInfoMsg');
        this.onCallBackRequestMsg(DataManager.getInstance().chatManager, 'onSendChatRecord', CHANNEL.WHISPER);
        this.onCallBackRequestMsg(DataManager.getInstance().dupManager, 'sendPVEBossInfoRequst');
    }
    private onCallBackRequestMsg(target, func, ...param): void {
        let delayTime: number = this._initMsgCount * 1000;
        Tool.callbackTime(target[func], target, delayTime, ...param);
        this._initMsgCount++;
    }
    //初始化注册所有战斗场景
    private onRegistAllScene(): void {
        this.allFightScenes = {};
        this.allFightScenes[MESSAGE_ID.GAME_FIGHT_DUP_ENTER] = FIGHT_SCENE.DUP;
        this.allFightScenes[MESSAGE_ID.ALLPEOPLE_BOSS_ENTER_MSG] = FIGHT_SCENE.ALLPEOPLE_BOSS;
        this.allFightScenes[MESSAGE_ID.XUEZHANBOSS_ENTER_MSG] = FIGHT_SCENE.XUEZHAN_BOSS;
        this.allFightScenes[MESSAGE_ID.VIPBOSS_ENTER_MSG] = FIGHT_SCENE.VIP_BOSS;
        this.allFightScenes[MESSAGE_ID.SAMSARA_BOSS_ENTER_MSG] = FIGHT_SCENE.SAMSARA_BOSS;
        this.allFightScenes[MESSAGE_ID.YEWAIPVP_FIGHT_PK_MSG] = FIGHT_SCENE.YEWAIPVP;
        this.allFightScenes[MESSAGE_ID.ARENE_LADDERARENE_FIGHT_MESSAGE] = FIGHT_SCENE.LODDER_ARENA;
        this.allFightScenes[MESSAGE_ID.ESCORT_ROB_MESSAGE] = FIGHT_SCENE.ESCORT;
        this.allFightScenes[MESSAGE_ID.ESCORT_REVENGE_MESSAGE] = FIGHT_SCENE.REVENGE;
        this.allFightScenes[MESSAGE_ID.UNION_BOSS_FIGHT_MESSAGE] = FIGHT_SCENE.UNION_BOSS;
        this.allFightScenes[MESSAGE_ID.UNION_BATTLE_ENJOIN_MESSAGE] = FIGHT_SCENE.UNION_BATTLE;
        this.allFightScenes[MESSAGE_ID.ARENE_CROSS_FIGHT_ENTER_MESSAGE] = FIGHT_SCENE.SERVER_ARENA;
        this.allFightScenes[MESSAGE_ID.ARENE_FIGHT_ENTER_MESSAGE] = FIGHT_SCENE.LOCAL_ARENA;
        this.allFightScenes[MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT] = FIGHT_SCENE.MYSTERIOUS_BOSS;
        this.allFightScenes[MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE] = FIGHT_SCENE.DIFU_DUP;
        this.allFightScenes[MESSAGE_ID.BOSS_PILL_START_MESSAGE] = FIGHT_SCENE.XIANSHAN_BOSS;
        this.allFightScenes[MESSAGE_ID.CROSS_PVEBOSS_FIGHT_MESSAGE] = FIGHT_SCENE.CROSS_PVE_BOSS;
        this.allFightScenes[MESSAGE_ID.WUTAN_FIGHT_MESSAGE] = FIGHT_SCENE.THRONE;
    }
    //返回野外地图
    public onReturnYewaiScene(): void {
        this.onChangeFightScene(FIGHT_SCENE.YEWAI_XG);
    }
    //进入野外BOSS
    public onEnterYewaiBoss(): void {
        this.onChangeFightScene(FIGHT_SCENE.YEWAI_BOSS);
    }
    //注册事件
    private onRegistGameEvent(): void {
        platform.onListenerShow(this.onListenerGameShow);
        platform.onListenerHide(this.onListenerGameHide);

        for (var messageID in this.allFightScenes) {
            this.gameworld.addEventListener(messageID.toString(), this.onChangeFightScene, this);
        }
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_RELOGIN_EVENT, this.onReLoginServer, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SHIELD_OTHERBODY_EVENT, this.onShieldHandler, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_EARTHQUAKE_STRAT, this.onEarthquake, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onHeroLevelUp, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PET_ENJOIN_MAP, this.onPetJoinMap, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_AVATAR_UPDATE, this.onRefreshHeroAvatar, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_GOTO_BOSS_WAVE, this.onEnterYewaiBoss, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.WXGAME_ONSHOW_EVENT, this.gameonshowHandler, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.WXGAME_ONHIDE_EVENT, this.gameonHideHanlder, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TITLE_WEAR_MESSAGE.toString(), this.onWearTitle, this);
        this.gameworld.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchStage, this);
    }
    /** 游戏onshow事件 **/
    public onListenerGameShow(result): void {
        console.log("监听到游戏回到前台的事件~");
        console.log(result);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.WXGAME_ONSHOW_EVENT), result);
    }
    private gameonshowHandler(event: egret.Event): void {
        let result = event.data;
        SoundFactory.playMusic(SoundDefine.SOUND_BGM);
        DataManager.getInstance().wxgameManager.onupdateColletionStatus(result);
        if (SDKManager.isIphone) {
            this._moduleLayer.onResetUIResource(result);
        }
    }
    /** 游戏onHide事件 **/
    public onListenerGameHide(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.WXGAME_ONHIDE_EVENT));
    }
    private gameonHideHanlder(): void {
        SoundFactory.stopMusic(SoundDefine.SOUND_BGM);
    }
    /**游戏心跳**/
    private checkTickTime: number = 0;
    private logicTimeStamp: number = 0;
    private gameLogic(dt): boolean {
        if (SDKManager.islowphone) {
            if (dt - this.logicTimeStamp < 50) {
                return;
            }
        } else {
            if (dt - this.logicTimeStamp < 20) {
                return;
            }
        }
        this.logicTimeStamp = dt;
        if (this.checkTickTime - egret.getTimer() <= 0) {
            if (this.checkTickTime > 0) {
                this.onSendTickMessage();
                //判断整点续期openkey
                if (egret.getTimer() > 3600000 && (egret.getTimer() % 3600000) <= 15000) {
                    if (SDKManager.getChannel() == EChannel.CHANNEL_WANBA) {
                        SDKWanBa.getInstance().isLoginIn();
                    }
                }
            } else {
                this.checkTickTime = egret.getTimer() + this.Tick_Interval;
            }
        }

        if (this._sceneRun) {
            this._bodyManager.logicHandler(dt);
            this.mapMove();
            if (this.isearthquake) {
                this.earthquakeHandler();
            }
        }

        return false;
    }
    /**发送游戏心跳**/
    public onSendTickMessage(): void {
        var gameTickMsg: Message = new Message(MESSAGE_ID.GAME_TICK_MESSAGE);
        var fightterValue: number = 0;
        for (var i: number = 0; i < this.heroBodys.length; i++) {
            var herodata: PlayerData = this.heroBodys[i].data;
            fightterValue += GameCommon.calculationFighting(herodata.attributes);
            //技能战力
            var skillPower: number = 0;
            for (var n = 0; n < SkillDefine.SKILL_NUM; n++) {
                skillPower += SkillDefine.getSkillFighting(herodata.skills[n].level, herodata.skills[n].grade);
            }
            fightterValue += skillPower;
        }
        gameTickMsg.setString(fightterValue + "");
        GameCommon.getInstance().sendMsgToServer(gameTickMsg);
        // Tool.log(this.checkTickTime + " ~The Tick Power Value is :" + fightterValue);
        this.checkTickTime = egret.getTimer() + this.Tick_Interval;
    }
    /**点击舞台事件**/
    private onTouchStage(e: egret.Event): void {
        // if (egret.is(e.target, 'eui.Button') || egret.is(e.target, "eui.RadioButton")) {
        //     SoundFactory.playSound(SoundDefine.SOUND_BUTTON_TOUCH);
        // }
    }
    /**
     * 切换战斗场景
     **/
    private onChangeFightScene(param): void {
        var needCheckTick: boolean = GameFight.getInstance().fightScene ? true : false;
        var fightSceneType: FIGHT_SCENE;
        if (param) {
            if (egret.is(param, "GameMessageEvent")) {
                fightSceneType = param ? this.allFightScenes[(param as GameMessageEvent).message.getCmdId()] : FIGHT_SCENE.YEWAI_XG;
            } else if (Tool.isNumber(param)) {
                fightSceneType = param;
            } else {
                fightSceneType = FIGHT_SCENE.YEWAI_XG;
            }
        } else {
            fightSceneType = FIGHT_SCENE.YEWAI_XG;
        }
        //清除掉上一个场景
        if (GameFight.getInstance().fightScene && fightSceneType != GameFight.getInstance().fightsceneTpye) {
            GameFight.getInstance().fightScene.onDestroyScene();
        }

        switch (fightSceneType) {
            case FIGHT_SCENE.YEWAI_XG:
                GameFight.getInstance().onRegistScene(FIGHT_SCENE.YEWAI_XG);
                GameFight.getInstance().fightScene.onSwitchMap(GameFight.getInstance().yewaiMapId);
                break;
            case FIGHT_SCENE.YEWAI_BOSS:
                GameCommon.getInstance().onHideFuncTipsBar(null);
                GameFight.getInstance().onRegistScene(fightSceneType);
                GameFight.getInstance().fightScene.onParseFightMsg(null);
                break;
            default:
                let enterSceneMsg: Message = (param as GameMessageEvent).message;
                if (!enterSceneMsg) {
                    Tool.throwException("注册场景未注册！");
                }
                this._moduleLayer.removeAllWindows();
                GameCommon.getInstance().onHideFuncTipsBar(null);
                GameFight.getInstance().onRegistScene(fightSceneType);
                GameFight.getInstance().fightScene.onParseFightMsg(enterSceneMsg);
                break;
        }

        if (needCheckTick) {
            this.onSendTickMessage();
        }
        this.Tick_Interval = GameFight.getInstance().fightScene.TickInterval;
        this._bodyManager.onShieldOhterBody(false);
    }
    //设置主角在地图的坐标
    public setHeroMapPostion(bornPoint: egret.Point): void {
        var rebornNode: ModelMapNode = this.mapInfo.getNodeModelByXY(bornPoint.x, bornPoint.y);
        if (!this.heroBody.parent) {
            this.addBodyToMapLayer(this.heroBody);
        }
        this.heroBody.x = bornPoint.x;
        this.heroBody.y = bornPoint.y;

        this._bodyManager.addPlayerRetinueToMap(this.heroBody);
        this.mapMove();
    }
    //启动地图
    private isInitTick: boolean;
    private _sceneRun: boolean;
    public startFightRun(): void {
        if (!this.isInitTick) {
            this.isInitTick = true;
            egret.startTick(this.gameLogic, this);
            // this.addEventListener(egret.Event.ENTER_FRAME, this.gameLogic, this);
        }
        if (!this._sceneRun) {
            this._sceneRun = true;
        }
    }
    //暂停当前地图
    public pauseFightRun(): void {
        if (this._sceneRun) {
            this._sceneRun = false;
        }
    }
    //关闭心跳
    public stopFightRun(): void {
        this.isInitTick = false;
        this._sceneRun = false;
        egret.stopTick(this.gameLogic, this);
    }
    //地图移动
    private mapMove(): void {
        this._mapLayer.logicMove();
    }
    //添加物体到地图
    public addBodyToMapLayer(body: egret.DisplayObject, insertChild: number = -1): void {
        this._mapLayer.addBodyToMaplayer(body, insertChild);
    }
    //停止行动或恢复行动
    public onPauseBodys(bodys: ActionBody[], isStop: boolean): void {
        for (var i: number = 0; i < bodys.length; i++) {
            var heroBody: ActionBody = bodys[i];
            heroBody.data.isStop = isStop;
        }
    }
    //添加掉落物品到掉落层上去
    public addDropBodyToLayer(body): void {
        this._moduleLayer.addToDropLayer(body);
    }
    //地图属性
    private _mapinfo: MapInfo;
    public get mapInfo(): MapInfo {
        if (!this._mapinfo) {
            this._mapinfo = new MapInfo();
        }
        return this._mapinfo;
    }
    //地图层
    public getMapLayer(): MapLayer {
        return this._mapLayer;
    }
    //重置或创建主角
    public onupdateHero(): void {
        for (let i: number = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; i++) {
            let heroBody: PlayerBody;
            if (this.gameheroBodys.length <= i) {
                let playerData: PlayerData = DataManager.getInstance().playerManager.player.playerDatas[i];
                playerData.onRebirth();
                heroBody = new PlayerBody();
                heroBody.data = playerData;
                heroBody.addEventListener(Action_Event.BODY_DEATH_FINISH, this.heroDeathHandler, this);
                this.gameheroBodys.push(heroBody);
            } else {
                heroBody = this.gameheroBodys[i];
                heroBody.data.onRebirth();
                heroBody.onRefreshData();
            }
        }
    }
    //初始化所有角色方向 如果传空等于随机方向
    public onResetAllHeroDir(dire: Direction): void {
        for (var i: number = 0; i < this.gameheroBodys.length; i++) {
            var heroBody: PlayerBody = this.gameheroBodys[i];
            heroBody.direction = dire;
        }
    }
    //重置所有角色外形
    public onResetAllHeroBody(): void {
        for (var i: number = 0; i < this.gameheroBodys.length; i++) {
            var heroBody: PlayerBody = this.gameheroBodys[i];
            heroBody.onReset();//清除上一个场景的寻路路径
            if (heroBody.retinuebody) {
                heroBody.retinuebody.onReset();
            }
        }
    }
    //屏蔽其他玩家
    private onShieldHandler(event: egret.Event): void {
        this._bodyManager.onShieldOhterBody(event.data);
    }
    //隐藏显示地图层
    public onShowOrHideMapLayer(isHide: boolean): void {
        this._mapLayer.visible = !isHide;
    }
    //人物升级
    public onHeroLevelUp(event: egret.Event): void {
        if (event.data == true) {
            var heroLevelUpEff: Animation = new Animation("renwushengji", 1, true);
            this.heroBody.addEffectToSelf("TOP", heroLevelUpEff);
            this.heroBody.onRefreshLevelShow();
        }
    }
    //更新祝福值外形
    private onRefreshHeroAvatar(event: egret.Event): void {
        let avatarData = event.data;
        let herobody: PlayerBody = this.heroBodys[avatarData.idx];
        herobody.onUpdateAvatar();
        if (herobody.retinuebody) {
            herobody.retinuebody.onUpdateAvatar();
        }
        if (herobody.magicbody) {
            herobody.magicbody.data = herobody.data;
        }
        LoadManager.getInstance().onClearAllBodyAnimCache(false);
    }
    //更新随从宠物出战
    private onPetJoinMap(): void {
        this.heroBody.onCheckRetinue();
        this._bodyManager.addPlayerRetinueToMap(this.heroBody);
    }
    //更新称号外形
    private onWearTitle(msgEvent: GameMessageEvent): void {
        for (var i: number = 0; i < this.gameheroBodys.length; i++) {
            var heroBody: PlayerBody = this.gameheroBodys[i];
            heroBody.onChangeTitleBody();
        }
    }
    //获取角色body的列表
    private _currHeroBodys: PlayerBody[]
    public get heroBodys(): PlayerBody[] {
        if (!this._currHeroBodys) {
            this._currHeroBodys = [];
        }
        if (this._currHeroBodys.length != this.gameheroBodys.length) {
            for (var i: number = 0; i < this.gameheroBodys.length; i++) {
                this._currHeroBodys[i] = this.gameheroBodys[i];
            }
        }
        return this._currHeroBodys;
    }
    //按顺序获取一个没有死亡的角色 如果都阵亡了就返回第一个
    public get heroBody(): PlayerBody {
        for (var i: number = 0; i < this.gameheroBodys.length; i++) {
            var heroBody: PlayerBody = this.gameheroBodys[i];
            if (!heroBody.data.isDie) {
                return heroBody;
            }
        }
        return this.gameheroBodys[0];
    }
    //震屏
    private isearthquake: boolean;
    private earthquakeOffValue: number;
    private earthupdown: number;//0上1下
    private earthleftright: number;//0左1右
    private earthTime: number;
    public onEarthquake(): void {
        if (!this.isearthquake) {
            this.isearthquake = true;
            this.earthquakeOffValue = 4;
            this.earthupdown = Math.floor(Math.random() * 2);
            this.earthleftright = Math.floor(Math.random() * 2);
        }
    }
    private earthquakeHandler(): void {
        if (egret.getTimer() - this.earthTime < 100)
            return;
        this.earthTime = egret.getTimer();
        if (this.earthupdown == 0) {
            this._mapLayer.y = -this.earthquakeOffValue;
            this.earthupdown = 1;
        } else {
            this._mapLayer.y = this.earthquakeOffValue;
            this.earthupdown = 0;
        }

        if (this.earthleftright == 0) {
            this._mapLayer.x = -this.earthquakeOffValue;
            this.earthleftright = 1;
        } else {
            this._mapLayer.x = this.earthquakeOffValue;
            this.earthleftright = 0;
        }

        if (this.earthquakeOffValue <= 0) {
            this.isearthquake = false;
            this.earthquakeOffValue = 0;
        }
        else {
            this.earthquakeOffValue -= 1;
        }
    }
    //判断角色是否战败
    public onCheckPlayerFail(): boolean {
        for (var i: number = 0; i < this.gameheroBodys.length; i++) {
            var heroBody: PlayerBody = this.gameheroBodys[i];
            if (!heroBody.data.isDie)
                return false;
        }
        return true;
    }
    //主角阵亡
    private heroDeathHandler(event: egret.Event): void {
        let heroBody: PlayerBody = event.currentTarget;
        this.onRemoveHero(heroBody);

        if (this.onCheckPlayerFail()) {
            GameFight.getInstance().fightScene.onDeath();
        }
    }
    //将主角从地图上移除
    public onRemoveHero(heroBody: PlayerBody): void {
        if (heroBody.parent) {
            heroBody.parent.removeChild(heroBody);
        }

        heroBody.overChagre();
        //移除宠物
        if (heroBody.petBody && heroBody.petBody.parent) {
            heroBody.petBody.parent.removeChild(heroBody.petBody);
        }
        //移除随从
        let retinuebody: RetinueBody = heroBody.retinuebody;
        if (retinuebody && retinuebody.parent) {
            retinuebody.parent.removeChild(retinuebody);
        }
        //移除法宝
        let magicbody: MagicBody = heroBody.magicbody;
        if (magicbody && magicbody.parent) {
            magicbody.parent.removeChild(magicbody);
        }
    }
    //地图昏暗效果
    public onSwithMapGary(isshow: boolean): void {
        this._mapLayer.onGary(isshow);
    }
    public getModuleLayer(): ModuleLayer {
        return this._moduleLayer;
    }
    public getBodyManager(): BodyManager {
        return this._bodyManager;
    }
    /**
     *断线重连功能 
     **/
    //重新连接服务器
    private onReLoginServer(): void {
        this.gameworld.addEventListener(MESSAGE_ID.GAME_LOGON_MESSAGE.toString(), this.receiveLoginMsg, this);
        this.gameworld.addEventListener(GameEvent.NET_EVENT_ERROR, this.onLoginNetError, this);

        this.gameworld.httpManager.reLogin();
    }
    //移除login消息监听
    private onRemoveLoginListener(): void {
        this.gameworld.removeEventListener(MESSAGE_ID.GAME_LOGON_MESSAGE.toString(), this.receiveLoginMsg, this);
        this.gameworld.removeEventListener(GameEvent.NET_EVENT_ERROR, this.onLoginNetError, this);
    }
    //接收到login成功进入服务器
    private receiveLoginMsg(event: GameMessageEvent): void {
        this.onRemoveLoginListener();
        this.gameworld.addEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveSelectServerMsg, this);
        this.gameworld.addEventListener(GameEvent.NET_EVENT_ERROR, this.onLoginNetError, this);
        var info = SDKManager.loginInfo;
        this.gameworld.sendSelectServer(info.serverId);
    }
    //进入服务器成功
    private receiveSelectServerMsg(event: GameMessageEvent): void {
        this.onRemoveSelectServerListener();
        var message: Message = event.message;
        var host: string = message.getString();
        var port: number = message.getShort();
        var state: number = message.getByte();
        if (state == 2) {
            this.gameworld.setAlertDisconnect(Language.ALERT_DISCONNECT_5);
        } else {
            this.gameworld.setUrl(host, port);
            this.sendLoginGame();
        }

        Tool.log("登录游戏成功");
    }
    private sendLoginGame(): void {
        this.gameworld.sendLoginServerMsg();
    }
    //移除登录服务器的兼听
    private onRemoveSelectServerListener(): void {
        this.gameworld.removeEventListener(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), this.receiveSelectServerMsg, this);
        this.gameworld.removeEventListener(GameEvent.NET_EVENT_ERROR, this.onLoginNetError, this);
    }
    //登陆异常
    private onLoginNetError(event: egret.Event): void {
        // this.gameworld.setAlertDisconnect(TextDefine.ALERT_DISCONNECT_3);
        this.onRemoveLoginListener();
        this.onRemoveSelectServerListener();
    }
    //重新登录刷新当前游戏场景
    public onReloadMainScene(): void {
        this.gameworld.reloadingClose();
        this._bodyManager.onDestroyAllHeroTarget();
        this.onReturnYewaiScene();
        this._moduleLayer.onReLoginSereverHandler();
        DataManager.getInstance().newactivitysManager.chongxinlianjie();
    }
    //The end
}