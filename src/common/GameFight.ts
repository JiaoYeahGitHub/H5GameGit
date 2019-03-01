// TypeScript file
class GameFight {
    public yewaiMapId: number;
    public yewai_waveIndex: number;//野外当前关卡编号
    public yewai_batch: number;//野外战斗第几波
    public isteamdupReady: boolean = false;
    // public isGuideTask: boolean = true;

    private static instance = null;
    public static getInstance(): GameFight {
        if (this.instance == null) {
            this.instance = new GameFight();
        }
        return this.instance;
    }

    private mainscene: MainScene;
    public setMainscene(mainscene: MainScene): void {
        this.mainscene = mainscene;
    }
    //设置当前的场景
    private gameFightScenes;
    private getFightSceneByName(scenename: string): IFightScene {
        if (!this.gameFightScenes) {
            this.gameFightScenes = {};
        }
        if (!this.gameFightScenes[scenename]) {
            this.gameFightScenes[scenename] = new window[scenename](this.mainscene);
        }
        return this.gameFightScenes[scenename];
    }
    public onRegistScene(sceneTpye: FIGHT_SCENE): void {
        let sceneclass: string = '';
        switch (sceneTpye) {
            case FIGHT_SCENE.YEWAI_XG:
                sceneclass = 'YewaiPVEFight';
                break;
            case FIGHT_SCENE.YEWAI_BOSS:
                sceneclass = 'YewaiBossFight';
                break;
            case FIGHT_SCENE.DUP:
                sceneclass = 'DupFight';
                break;
            case FIGHT_SCENE.ALLPEOPLE_BOSS:
            case FIGHT_SCENE.XUEZHAN_BOSS:
            case FIGHT_SCENE.VIP_BOSS:
            case FIGHT_SCENE.XIANSHAN_BOSS:
                sceneclass = 'AllPeopleBossFight';
                break;
            case FIGHT_SCENE.SAMSARA_BOSS:
                sceneclass = 'SamsaraBossFight';
                break;
            case FIGHT_SCENE.YEWAIPVP:
                sceneclass = 'YewaiPVPFight';
                break;
            case FIGHT_SCENE.LODDER_ARENA:
                sceneclass = 'LadderFight';
                break
            case FIGHT_SCENE.ESCORT:
                sceneclass = 'EscortFight';
                break
            case FIGHT_SCENE.REVENGE:
                sceneclass = 'RevengeFight';
                break
            case FIGHT_SCENE.UNION_BOSS:
                sceneclass = 'UnionBossFight';
                break
            case FIGHT_SCENE.UNION_BATTLE:
                sceneclass = 'UnionBattleFight';
                break;
            case FIGHT_SCENE.SERVER_ARENA:
                sceneclass = 'ServerCrossAraneFight';
                break;
            case FIGHT_SCENE.LOCAL_ARENA:
                sceneclass = 'LocalArenaFight';
                break;
            case FIGHT_SCENE.MYSTERIOUS_BOSS:
                sceneclass = 'MysBossFight';
                break;
            case FIGHT_SCENE.DIFU_DUP:
                sceneclass = 'DiFuDupFight';
                break;
            case FIGHT_SCENE.CROSS_PVE_BOSS:
                sceneclass = 'CrossPVEBossFight';
                break;
            case FIGHT_SCENE.THRONE:
                sceneclass = 'WuTanFight';
                break;
        }
        if (sceneclass) {
            this.currFightScene = this.getFightSceneByName(sceneclass);
            this.currFightScene.onInitScene(sceneTpye);
        }
    }
    //根据点判断是不是可行走点
    public onCheckCanWalk(x: number, y: number): boolean {
        return this.mainscene.mapInfo.getNodeModelByXY(x, y) ? this.mainscene.mapInfo.getNodeModelByXY(x, y).isCanWalk : false;
    }
    //添加到地图层上
    public addBodyToMapLayer(body: egret.DisplayObject, insertChild: number): void {
        this.mainscene.addBodyToMapLayer(body, insertChild);
    }
    //添加飘字层
    public addDropBodyToLayer(body): void {
        this.mainscene.getMapLayer().addToDamageFntLayer(body);
    }
    //获取人物在屏幕的位置
    public getHeroPosByModule(): number[] {
        return this.mainscene.getMapLayer().heroPosByModule;
    }
    //获取当前场景
    private currFightScene: IFightScene;
    public get fightScene(): IFightScene {
        return this.currFightScene;
    }
    //获取当前场景类型
    public get fightsceneTpye(): FIGHT_SCENE {
        return this.currFightScene ? this.currFightScene.sceneTpye : FIGHT_SCENE.YEWAI_XG;
    }
    //判断目标点是不是在屏幕内
    public onCheckPosInMapView(x: number, y: number): boolean {
        return this.mainscene.getMapLayer().onCheckPosInMapView(x, y);
    }
    /**野外小怪经验**/
    public getYewaiExp(stageIdx: number = this.yewai_waveIndex): number {
        return Tool.toInt(stageIdx * 0.95 + 34);
    }
    /**野外小怪阅历**/
    public getYewaiGold(stageIdx: number = this.yewai_waveIndex): number {
        return Tool.toInt(stageIdx * 0.1 + 100);
    }
    /**野外BOSS经验**/
    public getYewaibossExp(stageIdx: number = this.yewai_waveIndex): number {
        return Tool.toInt(420 + stageIdx * 10.8);
    }
    /**野外BOSS阅历**/
    public getYewaibossYueli(stageIdx: number = this.yewai_waveIndex): number {
        return Math.min(500 + stageIdx * 10, 1000);
    }
    /**战斗随机数**/
    public fight_randomIndex: number = 0;//随机种子数组索引
    public hero_randomIndex: number = 0;
    public enemy_randomIndex: number = 0;
    public parseFightRandom(msg: Message): void {
        this.fight_randomIndex = Math.floor(Math.random() * RandomDefine.FIGHT_RANDOM.length);
        var randomAry: number[] = RandomDefine.FIGHT_RANDOM[this.fight_randomIndex];
        this.hero_randomIndex = Math.floor(Math.random() * randomAry.length);
        this.enemy_randomIndex = Math.floor(Math.random() * randomAry.length);

        if (msg) {
            msg.setInt(this.fight_randomIndex);
            msg.setByte(this.hero_randomIndex);
            msg.setByte(this.enemy_randomIndex);
        }
    }
    /**解析对战玩家消息体**/
    private parseOtherPlayerDataMsg(msg: Message): PlayerData[] {
        var playerdatas: PlayerData[] = [];
        var simplePlayerdata: BaseSimPlayerData = new BaseSimPlayerData();
        simplePlayerdata.parseMsg(msg);
        var appearPlayerdata: PlayerAppears = new PlayerAppears();
        appearPlayerdata.parseMsg(msg);

        var herosize: number = msg.getByte();
        for (var i: number = 0; i < herosize; i++) {
            var appearData: AppearPlayerData = appearPlayerdata.appears[i];
            var playerOccp: number = appearData.occupation > 0 && appearData.occupation < GameDefine.Max_Role_Num ? appearData.occupation + 1 : i + 1;
            var playerData: PlayerData = new PlayerData(playerOccp, BODY_TYPE.PLAYER);
            playerData.playerId = simplePlayerdata.playerId;
            playerData.name = simplePlayerdata.name;
            playerData.index = i;
            playerData.sex = appearData.sex;
            playerData.coatardLv = simplePlayerdata.coatardlv;
            playerData.headiconIdx = simplePlayerdata.headindex;
            playerData.headFrame = simplePlayerdata.headFrame;
            playerData.setAppear(appearData);
            playerData.figthPower = msg.getLong();
            for (var aindex: number = 0; aindex < ATTR_TYPE.SIZE; aindex++) {
                playerData.attributes[aindex] = msg.getInt();
            }
            //技能等级算法 等级=战力/6000
            var skillLv: number = simplePlayerdata.level;
            for (var kIndex: number = 0; kIndex < playerData.skills.length; kIndex++) {
                var _skillInfo: SkillInfo = playerData.skills[kIndex];
                var _skillGrade: number = msg.getShort();
                _skillInfo.styleNum = msg.getShort();
                if (_skillInfo.model.lv <= simplePlayerdata.level) {
                    playerData.updateSkillLevel(kIndex, skillLv);
                    playerData.updateSkillGrade(kIndex, _skillGrade);
                }
            }
            for (let fidx: number = 0; fidx < BLESS_TYPE.SIZE; fidx++) {
                let fashionId: number = msg.getShort();
                if (fashionId > 0) {
                    let curFsData: FashionData = new FashionData();
                    curFsData.id = fashionId;
                    if (curFsData.model.type == fidx)
                        playerData.fashionSkils[fidx] = curFsData;
                }
            }

            for (let aIdx: number = 1; aIdx <= LegendDefine.Legend_Num; aIdx++) {
                playerData.legendInfo[aIdx] = msg.getByte();
            }

            playerdatas[i] = playerData;
        }
        if (playerdatas[0]) {
            playerdatas[0].petGrade = appearPlayerdata.petGrade;
        }

        return playerdatas;
    }
    /**解析机器人结构体**/
    private parseRobotDataMsg(msg: Message): RobotData[] {
        let heroPlayer: Player = DataManager.getInstance().playerManager.player;
        let playerid = msg.getInt();
        let name = msg.getString();
        let figthPower = msg.getLong();
        let sex: SEX_TYPE = figthPower % 2;
        let robotDatas: RobotData[] = [];
        let herosize: number = heroPlayer.playerDatas.length;
        for (let i: number = 0; i < herosize; i++) {
            let robotData: RobotData = new RobotData(i + 1, BODY_TYPE.ROBOT);
            robotData.playerId = playerid;
            robotData.index = i;
            robotData.name = name;
            robotData.sex = sex;
            robotData.coatardLv = heroPlayer.coatardLv;
            robotData.headiconIdx = sex == SEX_TYPE.MALE ? 2 : 5;
            robotData.headFrame = 1;
            robotData.figthPower = Math.floor(figthPower / herosize);
            let attributes: number[] = GameCommon.powerChangeAttribute(robotData.figthPower)
            robotData.onUpdateRobotInfo(attributes);
            robotDatas[i] = robotData;
            let playerdata: PlayerData = DataManager.getInstance().playerManager.player.getPlayerData();
            for (let skidx: number = 0; skidx < robotData.skills.length; skidx++) {
                let _heroSkillInfo: SkillInfo = playerdata.skills[skidx];
                robotData.updateSkillLevel(skidx, _heroSkillInfo.level > 0 ? 1 : 0);
                robotData.updateSkillGrade(skidx, 0);
                robotData.skills[skidx].reset();
            }
            // let curFsData: FashionData = new FashionData();
            // curFsData.id = 1;
            // robotData.fashionSkils[1] = curFsData;
        }

        return robotDatas;
    }
    /**随机生成机器人 战斗力上限 和 下限的比率值（与自身比较）**/
    public onRandomCrateRobotData(minRate: number, maxRate: number, name: string = null): RobotData {
        let robotModelid: number = Math.floor(Math.random() * GameDefine.Max_Role_Num) + 1;
        let robotData: RobotData = new RobotData(robotModelid, BODY_TYPE.ROBOT);
        let sex: SEX_TYPE = Math.round(Math.random() * 1);
        robotData.playerId = -1;
        robotData.name == null ? name : NameDefine.getRandomPlayerName(true, sex);
        robotData.sex = sex;
        let powerRDRate: number = (Math.random() * (maxRate - minRate) + minRate) / 10;
        let attributes: number[] = GameCommon.powerChangeAttribute(Math.floor(DataManager.getInstance().playerManager.player.playerTotalPower * powerRDRate));
        robotData.onUpdateRobotInfo(attributes);
        robotData.onRebirth();
        return robotData;
    }
    /**PVP 对手属性生成**/
    public onParsePVPEnemyMsg(msg: Message, needRobot: boolean = true): PlayerData[] {
        var enemyDatas: PlayerData[] = [];
        var isRobot: boolean = needRobot ? msg.getBoolean() : false;
        if (isRobot) {
            enemyDatas = GameFight.getInstance().parseRobotDataMsg(msg);
        } else {
            enemyDatas = GameFight.getInstance().parseOtherPlayerDataMsg(msg);
        }
        for (let i: number = 0; i < enemyDatas.length; i++) {
            enemyDatas[i].onRebirth();
        }

        return enemyDatas;
    }
    /**解析掉落数据**/
    public onParseDropItems(msg: Message): AwardItem[] {
        var dropitems: AwardItem[] = [];
        var dropAward: AwardItem;
        var dropSize: number = msg.getByte();
        for (var i: number = 0; i < dropSize; i++) {
            dropAward = new AwardItem();
            dropAward.type = msg.getByte();
            dropAward.id = msg.getShort();
            dropAward.quality = msg.getByte();
            dropAward.num = msg.getInt();
            dropAward.quality = (dropAward.type == GOODS_TYPE.MASTER_EQUIP || dropAward.type == GOODS_TYPE.SERVANT_EQUIP) ? dropAward.quality : -1;
            dropitems.push(dropAward);
        }
        return dropitems;
    }
    /**检测新手剧情**/
    private JackarooRushDatas: RushEnemyData[];
    public onInitJackaroo(): void {
        this.JackarooRushDatas = [];
        let player: Player = DataManager.getInstance().playerManager.player;
        // if (this.yewaiMapId == 1 && player.level == 1 && player.exp == 0) {
        //     let jackaroo1: RushEnemyData = new RushEnemyData();
        //     jackaroo1.monsterId = 189;
        //     jackaroo1.refreshGrid = 511;
        //     jackaroo1.refreshNum = NPC_BODY_TYPE.JACKAROO1;

        //     let jackaroo2: RushEnemyData = new RushEnemyData();
        //     jackaroo2.monsterId = 190;
        //     jackaroo2.refreshGrid = 290;
        //     jackaroo2.refreshNum = NPC_BODY_TYPE.JACKAROO2;
        //     this.JackarooRushDatas = [jackaroo1, jackaroo2];
        // }
    }
    public get isJackaroo(): boolean {
        return this.JackarooRushDatas && this.JackarooRushDatas.length > 0;
    }
    //新手引导场景剧情
    public onJackarooHandler(): void {
        let jackTask: RushEnemyData = this.JackarooRushDatas[0];
        this.mainscene.getBodyManager().onRushNpcToScene(jackTask, jackTask.refreshNum, 0.7);
    }
    /**检测剧情**/
    private storysDict;
    public isFightEndStory: boolean;
    public onCheckStoyTalk(): boolean {
        if (this.fightsceneTpye != FIGHT_SCENE.YEWAI_XG && this.fightsceneTpye != FIGHT_SCENE.YEWAI_BOSS) return false;//不是野外不显示剧情
        let targetBody: ActionBody = this.mainscene.heroBody.data.targets[0];
        if (!targetBody) return false;
        let stageIdx: number = this.yewai_waveIndex;
        let modelDict = JsonModelManager.instance.getModelstory()[stageIdx];
        if (!modelDict) return false;//本关没有剧情
        if (!this.storysDict) {
            this.storysDict = {};
        }
        let storys: Modelstory[];
        if (!this.storysDict[stageIdx]) {
            this.storysDict[stageIdx] = {};
            for (let idx in modelDict) {
                let model: Modelstory = modelDict[idx];
                if (!this.storysDict[stageIdx][model.talktype]) {
                    this.storysDict[stageIdx][model.talktype] = [];
                }
                this.storysDict[stageIdx][model.talktype].push(model);
            }
        }

        let type: STORY_TYPE;
        if (!targetBody) {
            type = STORY_TYPE.FINISH;
        } else {
            switch (targetBody.data.bodyType) {
                case BODY_TYPE.MONSTER:
                    type = STORY_TYPE.MONSTER;
                    break;
                case BODY_TYPE.BOSS:
                    type = STORY_TYPE.BOSS;
                    break;
                default:
                    type = targetBody.data.modelid;
                    break;
            }
        }
        storys = this.storysDict[stageIdx][type];
        if (!storys || storys.length == 0) return false;//本场景剧情已经做完了

        let showStorys: Modelstory[] = [];
        for (let i: number = storys.length - 1; i >= 0; i--) {
            let model: Modelstory = storys[i];
            if (model.talktype == type) {
                showStorys.unshift(model);
                storys.splice(i, 1);
            }
        }
        if (showStorys.length > 0) {
            this.mainscene.getBodyManager().fightPause = true;
            //面对面
            if (targetBody) {
                this.mainscene.heroBody.direction = this.mainscene.heroBody.checkFace(targetBody.x, targetBody.y);
                this.mainscene.getModuleLayer().onShowStoryView(showStorys, targetBody.data);
            } else {
                this.mainscene.getModuleLayer().onShowStoryView(showStorys);
            }
            return true;
        }
        return false;
    }
    /**剧情结束**/
    public onRemoveStory(): void {
        this.mainscene.getBodyManager().fightPause = false;
        this.mainscene.getModuleLayer().onHideStroyView();
        if (this.isJackaroo) {
            this.JackarooRushDatas.shift();
            this.mainscene.getBodyManager().onDestroyAllHeroTarget();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_JACKAROO_COMPLETE));
            if (!this.isJackaroo) {
                this.mainscene.heroBody.onshoworhideShodow(true);
                LoadManager.getInstance().onClearAllBodyAnimCache();
            }
        } else if (this.isFightEndStory) {
            this.isFightEndStory = false;
            if (this.fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
                this.fightScene.onFightWin();
            }
        }
    }
    /**判断是不是玩家的一方 主要判断伤害是否归属于玩家
     * 1.我自己
     * 2.我的随从
     * 3.我的友军(暂无)
     * **/
    public onCheckBodyIsHero(bodydata: BodyData): boolean {
        if (bodydata.bodyType == BODY_TYPE.SELF) return true;

        if (bodydata.bodyType == BODY_TYPE.RETINUE) {
            let retinueData: RetinueBodyData = bodydata as RetinueBodyData;
            if (!retinueData || !retinueData.playerData) return false;
            if (retinueData.playerData.playerId == DataManager.getInstance().playerManager.player.id) {
                return true;
            }
        }

        return false;
    }
    /**普通场景战斗**/
    public onSendCommonFightMsg(isBoss: boolean): void {
        var startFightMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_START_MSG);
        startFightMsg.setByte(isBoss ? 1 : 0);
        if (isBoss) {
            this.parseFightRandom(startFightMsg);
        } else {
            this.parseFightRandom(null);
        }
        GameCommon.getInstance().sendMsgToServer(startFightMsg);
    }
    /**请求野外PVP战斗 index:列表的索引值**/
    public zaoyuRebornNodeid: number;
    public onSendYewaiPVPPKMsg(index: number): void {
        if (!DataManager.getInstance().yewaipvpManager.pvpfightterInfos || index >= DataManager.getInstance().yewaipvpManager.pvpfightterInfos.length) {
            return;
        }

        if (this.checkBagIsFull()) {
            return;
        }

        if (!this.isCanEnterScene()) {
            return;
        }

        this.parseFightRandom(null);
        var yewaiPKMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIGHT_PK_MSG);
        yewaiPKMsg.setByte(index);
        GameCommon.getInstance().sendMsgToServer(yewaiPKMsg);
    }
    /**请求野外PVP附近玩家列表**/
    public onRequstYewaiFightterInfoMsg(): void {
        var yewaifightterMsg: Message = new Message(MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG);
        GameCommon.getInstance().sendMsgToServer(yewaifightterMsg);
    }
    /**进入副本**/
    public dup_entertime: number;
    public dupfight_waveIndex: number;//副本的关卡编号
    public onSendEnterDupMsg(dupId: number): void {
        var model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
        var _figthDupInfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(model.type, model.subType);
        if (!_figthDupInfo) {
            GameCommon.getInstance().addAlert("副本数据为空!");
            return;
        }
        if (_figthDupInfo.onCheckLimit()) {
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        var lefttimes: number = _figthDupInfo.lefttimes;
        if (model.type == DUP_TYPE.DUP_VIP_TEAM) {
            lefttimes += DataManager.getInstance().dupManager.vipteamLeftjoinTimes;
        }
        if (lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        var enterdupMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_DUP_ENTER);
        this.parseFightRandom(enterdupMsg);
        enterdupMsg.setByte(dupId);
        GameCommon.getInstance().sendMsgToServer(enterdupMsg);
    }
    /**发送祝福值副本进度信息 0代表开始刷怪 1代表击杀怪物**/
    public onSendBlessDupProgressMsg(type: number, count: number = 0): void {
        var msg: Message = new Message(MESSAGE_ID.GAME_BLESSDUP_PROGRESS_MSG);
        msg.setByte(type != 0 ? 1 : 0);
        msg.setShort(count);
        GameCommon.getInstance().sendMsgToServer(msg);
    }
    /**发送四象副本进度信息 0代表开始刷挂 1代表战斗结束**/
    public onSendSixiangDupResultMsg(type: number = 1): void {
        var msg: Message = new Message(MESSAGE_ID.GAME_SIXIANG_PROGRESS_MSG);
        msg.setByte(type != 0 ? 1 : 0);
        if (type != 0) {
            this.parseFightRandom(msg);
        }
        GameCommon.getInstance().sendMsgToServer(msg);
    }
    /**进入个人BOSS副本**/
    public onSendEnterPersonallyBossMsg(waveId): void {
        var _figthDupInfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_PERSONALLY, waveId);
        if (!_figthDupInfo) {
            GameCommon.getInstance().addAlert("副本数据为空!");
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene())
            return;
        if (_figthDupInfo.lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        var enterdupMsg: Message = new Message(MESSAGE_ID.GAME_FIGHT_DUP_ENTER);
        this.parseFightRandom(enterdupMsg);
        enterdupMsg.setByte(DUP_TYPE.DUP_PERSONALLY);
        enterdupMsg.setByte(waveId);
        GameCommon.getInstance().sendMsgToServer(enterdupMsg);
    }

    /**扫荡个人副本 */
    public onSendSaoDangPersonallyBossMsg(waveId): void {
        var _figthDupInfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_PERSONALLY, waveId);
        if (!_figthDupInfo) {
            GameCommon.getInstance().addAlert("副本数据为空!");
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene())
            return;
        if (_figthDupInfo.lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        var enterdupMsg: Message = new Message(MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE);
        enterdupMsg.setByte(DUP_TYPE.DUP_PERSONALLY);
        enterdupMsg.setByte(waveId);
        GameCommon.getInstance().sendMsgToServer(enterdupMsg);
    }

    private _fightDupId: number = 0;//判断是否在副本里 副本id是多少 如果是0代表不在副本中
    public onEnterDupSuccess(dupid: number): void {
        this._fightDupId = dupid;
    }

    public get fightDupId(): number {
        return this.fightsceneTpye == FIGHT_SCENE.DUP ? this._fightDupId : 0;
    }

    private _unionCheerNum: number = 0;
    public set unionCheerNum(value: number) {
        this._unionCheerNum = value;
    }

    public get unionCheerNum(): number {
        var model: Modelcopy = JsonModelManager.instance.getModelcopy()[this.fightDupId];
        return model && model.type == DUP_TYPE.DUP_UNION ? this._unionCheerNum : 0;
    }
    /**创建组队副本房间**/
    public teamdupRoomDupId: number;
    public onSendCreateTeamDupRoomMsg(dupId: number): void {
        var dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
        var teamdupInfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(dupmodel.type, dupmodel.subType);
        if (teamdupInfo.lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        if (teamdupInfo.onCheckLimit()) {
            return;
        }
        this.teamdupRoomDupId = dupId;
        var createroomMsg: Message = new Message(MESSAGE_ID.TEAMDUP_CREATETEAM_MESSAGE);
        createroomMsg.setByte(dupId);
        GameCommon.getInstance().sendMsgToServer(createroomMsg);
    }
    /**加入组队副本房间**/
    public onSendJoinTeamDupRoomMsg(roomID: number, dupId: number): void {
        let dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
        let teamdupInfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(dupmodel.type, dupmodel.subType);
        let lefttimes: number = teamdupInfo.lefttimes;
        if (dupmodel.type == DUP_TYPE.DUP_VIP_TEAM) {
            lefttimes += DataManager.getInstance().dupManager.vipteamLeftjoinTimes;
        }
        if (lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        if (teamdupInfo.onCheckLimit()) {
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        this.teamdupRoomDupId = dupId;
        var joinMessage: Message = new Message(MESSAGE_ID.TEAMDUP_JOINTEAM_MESSAGE);
        joinMessage.setByte(dupId);
        joinMessage.setInt(roomID);
        GameCommon.getInstance().sendMsgToServer(joinMessage);
    }
    /**退出组队副本**/
    public onSendQuitTeamDupMsg(): void {
        var quitMsg: Message = new Message(MESSAGE_ID.TEAMDUP_QUITSCENE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(quitMsg);
    }
    /**进入劫杀PK**/
    public escortId: number;
    public robID: number;
    public onSendEscortFightMsg(RobID: number): void {
        if (!this.isCanEnterScene())
            return;
        if (DataManager.getInstance().escortManager.escort.rob == EscortData.MAX_ROB_COUNT) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        this.robID = RobID;
        var seachScortFightMsg: Message = new Message(MESSAGE_ID.ESCORT_ROB_MESSAGE);
        seachScortFightMsg.setInt(RobID);
        GameCommon.getInstance().sendMsgToServer(seachScortFightMsg);
        DataManager.getInstance().escortManager.OnRobSomeOne(RobID);
    }
    /**进入武坛PK**/
    // public onRequsetThroneFigth: boolean;
    // public thronePkID: number;
    // public onSendThroneFightMsg(pkType: number, pkID: number): void {
    //     if (GameFight.getInstance().onRequsetThroneFigth)
    //         return;
    //     if (!this.isCanEnterScene())
    //         return;
    //     this.thronePkID = pkID;
    //     this.onRequsetThroneFigth = true;
    //     var seachThroneFightMsg: Message = new Message(MESSAGE_ID.THRONE_OCCUPY_PK_MESSAGE);
    //     seachThroneFightMsg.setByte(pkType);
    //     seachThroneFightMsg.setInt(pkID);
    //     GameCommon.getInstance().sendMsgToServer(seachThroneFightMsg);
    // }
    /**进入单服竞技场**/
    public onReqLocalArenaFightTime: number;
    public onSendLocalArenaFightMsg(fightRankNum: number): void {
        var arenaData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData
        if (!arenaData) {
            return;
        }
        if (this.onReqLocalArenaFightTime > egret.getTimer()) {
            GameCommon.getInstance().addAlert("挑战太频繁，请稍后再试");
            return;
        }
        if (!this.isCanEnterScene())
            return;
        if (arenaData.fightCount <= 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        this.onReqLocalArenaFightTime = egret.getTimer() + 2000;
        var arenaFightMsg: Message = new Message(MESSAGE_ID.ARENE_FIGHT_ENTER_MESSAGE);
        arenaFightMsg.setInt(fightRankNum);
        this.parseFightRandom(arenaFightMsg);
        GameCommon.getInstance().sendMsgToServer(arenaFightMsg);
    }
    /**进入竞技场**/
    public onReqArenaFightTime: number;
    public onSendArenaFightMsg(fightRankNum: number): void {
        var arenaData: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        if (!arenaData || !arenaData.isOpen) {
            return;
        }
        if (this.onReqArenaFightTime > egret.getTimer()) {
            GameCommon.getInstance().addAlert("挑战太频繁，请稍后再试");
            return;
        }
        if (!this.isCanEnterScene())
            return;
        if (arenaData.fightCount <= 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        this.onReqArenaFightTime = egret.getTimer() + 2000;
        var arenaFightMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_FIGHT_ENTER_MESSAGE);
        arenaFightMsg.setByte(fightRankNum);
        arenaFightMsg.setByte(arenaData.rank);
        GameCommon.getInstance().sendMsgToServer(arenaFightMsg);
    }
    /**进入天梯竞技场**/
    public onSendLadderArenaFightMsg(): void {
        if (!this.isCanEnterScene())
            return;
        let arenaData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        if (arenaData.ladderStatus > 0) {
            GameCommon.getInstance().addAlert('error_tips_21');
            return;
        }
        let rebronCD: number = Math.max(0, Math.floor((arenaData.leftRelive - egret.getTimer()) / 1000));
        if (rebronCD > 0) {
            return;
        }

        var seachLodderFightMsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_FIGHT_MESSAGE);
        this.parseFightRandom(seachLodderFightMsg);
        GameCommon.getInstance().sendMsgToServer(seachLodderFightMsg);
    }
    /**进入血战副本**/
    public xuezhanDifficulty: number = 1;//1简单 2普通 3困难
    public onSendXuezhanFightMsg(index: number): void {
        if (!this.isCanEnterScene())
            return;
        if (DataManager.getInstance().dupManager.xuezhanInfo.reviveNum == 0) {
            GameCommon.getInstance().addAlert("挑战次数不足");
            return;
        }
        var xuezhanFightMsg: Message = new Message(MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE);
        xuezhanFightMsg.setByte(index);
        this.parseFightRandom(xuezhanFightMsg);
        GameCommon.getInstance().sendMsgToServer(xuezhanFightMsg);
    }
    /**进入探索BOSS场景**/
    // public fightExploreBossId: number = 0;
    // public figth_exoloreTaskId: number = 0;//当前正在探索的任务0代表结束
    // public onSendExploreBossEnterMsg(exploreId: number): void {
    //     if (!this.isCanEnterScene())
    //         return;
    //     if (DataManager.getInstance().dupManager.explorebossInfo.lifeNum == 0) {
    //         GameCommon.getInstance().addAlert("体力不足");
    //         return;
    //     }
    //     var enterExploreMsg: Message = new Message(MESSAGE_ID.EXPLOREBOSS_ENTER_MSG);
    //     enterExploreMsg.setByte(exploreId);
    //     GameCommon.getInstance().sendMsgToServer(enterExploreMsg);
    // }
    //探索一次事件
    // public onRequestExploreTaskTime: number;
    // public onSendExploreEvnetMsg(): void {
    //     if (this.fightsceneTpye != FIGHT_SCENE.EXPLORE_BOSS)
    //         return;
    //     if (this.onRequestExploreTaskTime - egret.getTimer() > 0)
    //         return;
    //     if (this.figth_exoloreTaskId > 0) {
    //         GameCommon.getInstance().addAlert("正在探索中...");
    //         return;
    //     }
    //     if (DataManager.getInstance().dupManager.explorebossInfo.lifeNum == 0) {
    //         GameCommon.getInstance().addAlert("体力不足");
    //         return;
    //     }
    //     var exploreMsg: Message = new Message(MESSAGE_ID.EXPLOREBOSS_EXPLORETASK_MSG);
    //     exploreMsg.setByte(this.fightExploreBossId);
    //     GameCommon.getInstance().sendMsgToServer(exploreMsg);
    //     this.onRequestExploreTaskTime = egret.getTimer() + 2000;
    // }
    //参与世界BOSS战斗
    // public fight_worldBossInfo: WorldBossInfo;
    // public fight_worldBoss: boolean;
    // public worldbossRankParam: WorldBossRankParam;
    // public onEnjoyWorldBossFigthMsg(bossInfo: WorldBossInfo, useGold: number = 0): void {
    //     if (!this.isCanEnterScene())
    //         return;
    //     if (DataManager.getInstance().dupManager.worldbossEnjoyNum <= 0) {
    //         GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(47));//当日世界boss参与次数不足
    //         return;
    //     }
    //     this.fight_worldBossInfo = bossInfo;
    //     var enjoybossMsg: Message = new Message(MESSAGE_ID.EXPLOREBOSS_BOSS_FIGHTENTER);
    //     enjoybossMsg.setInt(bossInfo.bossId);
    //     enjoybossMsg.setByte(useGold);
    //     GameCommon.getInstance().sendMsgToServer(enjoybossMsg);
    // }
    // public onFinishWorldBossFight(): void {
    //     this.fight_worldBossInfo = null;
    //     this.fight_worldBoss = false;
    // }
    /**
     * 请求进入全民BOSS
     * */
    public allpeopleOtherMsg: Message;
    public allpeopleBossId: number;
    public onEnterAllPeopleBossScene(bossId: number): void {
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene())
            return;
        if (DataManager.getInstance().dupManager.allpeoplebossData.lefttimes == 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        var enterMsg: Message = new Message(MESSAGE_ID.ALLPEOPLE_BOSS_ENTER_MSG);
        enterMsg.setShort(bossId);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**
     * 请求进入血战BOSS
     **/
    public onEnterXuezhanBossScene(bossId: number): void {
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        var enterMsg: Message = new Message(MESSAGE_ID.XUEZHANBOSS_ENTER_MSG);
        enterMsg.setShort(bossId);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**
     * 请求进仙山BOSS
     **/
    public onEnterXianShanBossScene(bossId: number): void {
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        var enterMsg: Message = new Message(MESSAGE_ID.BOSS_PILL_START_MESSAGE);
        enterMsg.setInt(bossId);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**
     * 请求进入VIPBOSS
     **/
    public onEnterVipBossScene(bossId: number): void {
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }
        var enterMsg: Message = new Message(MESSAGE_ID.VIPBOSS_ENTER_MSG);
        enterMsg.setShort(bossId);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**
     * 血战 VIP BOSS PK请求
     * */
    public sendBossFightPkRequset(fightid: number): void {
        if (fightid == DataManager.getInstance().playerManager.player.id) {
            return;
        }
        if (this.mainscene.onCheckPlayerFail()) {
            GameCommon.getInstance().addAlert("error_tips_10002");
            return;
        }
        let messageID: number;
        if (this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS) {
            messageID = MESSAGE_ID.XUEZHANBOSS_OTHERPK_MSG;
        } else if (this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS) {
            messageID = MESSAGE_ID.VIPBOSS_OTHERPK_MSG;
        } else if (this.fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) {
            messageID = MESSAGE_ID.ALLPEOPLE_PK_MESSAGE;
        }
        if (Tool.isNumber(messageID)) {
            let pkMessage: Message = new Message(messageID);
            this.parseFightRandom(pkMessage);
            pkMessage.setShort(this.allpeopleBossId);
            pkMessage.setInt(fightid);
            GameCommon.getInstance().sendMsgToServer(pkMessage);
        }
    }
    /**
     * 请求进入转生BOSS
     * */
    public samsaraTargetMsg: Message;
    public samsarabossId: number;
    public onEnterSamsaraBossScene(): void {
        if (DataManager.getInstance().dupManager.samsarebossData.openLefttime > 0) {
            GameCommon.getInstance().addAlert(Language.instance.getText("samsara_unopen"));
            return;
        }
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene())
            return;
        var enterMsg: Message = new Message(MESSAGE_ID.SAMSARA_BOSS_ENTER_MSG);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**转生BOSS请求复活**/
    public onBossFightReborn(isClear: boolean = true, isAuto: boolean = false): void {
        if (isClear) {
            if (isAuto) {
                this.onSendRebornMsg();
            } else {
                var rebornNotice = [{ text: `是否花费100钻石复活？`, style: { textColor: 0xe63232 } }];
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("AlertFrameUI", new AlertFrameParam(rebornNotice, function () {
                        this.onSendRebornMsg();
                    }, this))
                );
            }
        } else {
            this.onSendRebornMsg(0);
        }
    }

    /**神秘BOSS请求复活**/
    public onMyBossFightReborn(isClear: boolean = true, isAuto: boolean = false): void {
        if (isClear) {
            if (isAuto) {
                this.onSendRebornMsgMysterious();
            } else {
                var rebornNotice = [{ text: `是否花费100钻石复活？`, style: { textColor: 0xe63232 } }];
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("AlertFrameUI", new AlertFrameParam(rebornNotice, function () {
                        this.onSendRebornMsgMysterious();
                    }, this))
                );
            }
        } else {
            this.onSendRebornMsgMysterious(0);
        }
    }

    private onSendRebornMsgMysterious(useGold: number = 1) {
        if (useGold == 1 && DataManager.getInstance().playerManager.player.gold < 20) {
            GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
            return;
        }
        let rebornMsg: Message = new Message(MESSAGE_ID.BOSS_MYSTERIOUS_REVIVE_MESSAGE);
        rebornMsg.setByte(useGold);
        GameCommon.getInstance().sendMsgToServer(rebornMsg);
        this.onEnterMysteriousBossScene();
    }

    private onSendRebornMsg(useGold: number = 1): void {
        if (useGold == 1 && DataManager.getInstance().playerManager.player.gold < 20) {
            GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
            return;
        }
        let messageID: number;
        let targetId: number;
        if (this.fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS) {
            messageID = MESSAGE_ID.SAMSARA_BOSS_REBORN_MSG;
        } else if (this.fightsceneTpye == FIGHT_SCENE.MYSTERIOUS_BOSS) {
            messageID = MESSAGE_ID.BOSS_MYSTERIOUS_REVIVE_MESSAGE;
        } else if (this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS) {
            messageID = MESSAGE_ID.XUEZHANBOSS_REBORN_MSG;
            targetId = this.allpeopleBossId;
        } else if (this.fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) {
            messageID = MESSAGE_ID.ALLPEOPLE_PVP_REVIVE;
            targetId = this.allpeopleBossId;
        } else if (this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS) {
            messageID = MESSAGE_ID.VIPBOSS_REBORN_MSG;
            targetId = this.allpeopleBossId;
        } else {
            messageID = MESSAGE_ID.SAMSARA_BOSS_REBORN_MSG;
        }
        let rebornMsg: Message = new Message(messageID);
        if (Tool.isNumber(targetId)) {
            rebornMsg.setShort(targetId);
        }
        rebornMsg.setByte(useGold);
        GameCommon.getInstance().sendMsgToServer(rebornMsg);

        if (this.fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            this.onEnterSamsaraBossScene();
        }
    }
    /**
     * 帮会神秘boss挑战
     **/
    public mysteriousTargetMsg: Message;
    public mysteriousbossId: number;
    public onEnterMysteriousBossScene(): void {
        if (this.checkBagIsFull()) {
            return;
        }
        if (!this.isCanEnterScene())
            return;
        var enterMsg: Message = new Message(MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }

    /**帮会BOSS相关**/
    public onEnterUnionBossScene(bossId: number): void {
        if (DataManager.getInstance().unionManager.unionbossCount == 0) {
            GameCommon.getInstance().addAlert("剩余挑战次数不足");
            return;
        }
        if (!this.isCanEnterScene())
            return;
        var enterMsg: Message = new Message(MESSAGE_ID.UNION_BOSS_FIGHT_MESSAGE);
        enterMsg.setByte(bossId);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    /**帮会战相关**/
    public unionbattlePkMsg: Message;
    public onSendUnionBattleFightMsg(unionId: number): void {
        if (!this.isCanEnterScene())
            return;
        var battlefightMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_ENJOIN_MESSAGE);
        battlefightMsg.setInt(unionId);
        GameCommon.getInstance().sendMsgToServer(battlefightMsg);
    }
    private _beforeRound: number = 0;
    private _beforeState: UNIONBATTLE_RESULT;
    public onCheckUnionBattleResult(unionNames: string[]): void {
        var battleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
        var isInit: boolean = this._beforeRound == 0;
        if (battleInfo && battleInfo.state != UNIONBATTLE_STATE.NOT && battleInfo.myUnionFightInfo) {
            var result: UNIONBATTLE_RESULT = UNIONBATTLE_RESULT.UNRESULT;
            if (this._beforeRound < battleInfo.myUnionFightInfo.roundCount) {
                if (this._beforeRound > 0) {
                    result = UNIONBATTLE_RESULT.WIN;
                }
            }
            this._beforeRound = battleInfo.myUnionFightInfo.roundCount;
            if (this._beforeState != battleInfo.myUnionFightInfo.state) {
                if (!isInit)
                    result = battleInfo.myUnionFightInfo.state;
                this._beforeState = battleInfo.myUnionFightInfo.state;
            }
            var resultDesc: string = "";
            var resultGradeStr: string = "";
            var enemyUnionName: string = "";
            if (result != UNIONBATTLE_RESULT.UNRESULT) {
                var nameIndex: number = result == UNIONBATTLE_RESULT.WIN ? this._beforeRound - 2 : this._beforeRound - 1;
                var enemyUnionName: string = unionNames[nameIndex];
            }
            if (!enemyUnionName) {
                result = UNIONBATTLE_RESULT.UNRESULT;
            }
            if (result == UNIONBATTLE_RESULT.WIN) {
                resultGradeStr = this._beforeRound == 4 ? "获得本次帮会战[#FFFF00冠军]！" : "[#FFFF00晋级！]";
                resultDesc = `恭喜您击败${enemyUnionName}帮会` + resultGradeStr;
            } else if (result == UNIONBATTLE_RESULT.LOSE) {
                resultGradeStr = this._beforeRound == 3 ? "获得本次帮会战[#FFFF00亚军]！" : "[#FF0000淘汰！]";
                resultDesc = `很遗憾您被${enemyUnionName}帮会击败` + resultGradeStr;
            }

            if (resultDesc) {
                GameDispatcher.getInstance().dispatchEvent(
                    new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("AlertDescUI", GameCommon.getInstance().readStringToHtml(resultDesc))
                );
            }
        }
    }
    /**
    * 请求进入跨服PVE BOSS
    * */
    public onEnterCrossPVEBossScene(): void {
        let data: CrossPVEBossData = DataManager.getInstance().dupManager.crossPVEBoss;
        if (!data.isOpen) {
            GameCommon.getInstance().addAlert(Language.instance.getText("error_tips_172"));
            return;
        }
        if (data.fightcount <= 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        if (!this.isCanEnterScene()) {
            return;
        }

        var enterMsg: Message = new Message(MESSAGE_ID.CROSS_PVEBOSS_FIGHT_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(enterMsg);
    }
    public onEnterWuTanScene(type: number, idx: number, enemyId: number) {
        if (!this.isCanEnterScene()) {
            return;
        }
        let req: Message = new Message(MESSAGE_ID.WUTAN_FIGHT_MESSAGE);
        req.setShort(type);
        req.setShort(idx);
        req.setInt(enemyId);
        GameCommon.getInstance().sendMsgToServer(req);
    }
    //进入副本基础判断
    private isCanEnterScene(): boolean {
        if (this.fightsceneTpye == FIGHT_SCENE.YEWAIPVP) {
            GameCommon.getInstance().addAlert("error_tips_10001");
            return false;
        }

        if ((this.fightsceneTpye == FIGHT_SCENE.DUP && !this.canContiuneDup(this._fightDupId)) || this.fightsceneTpye == FIGHT_SCENE.UNION_BOSS) {
            GameCommon.getInstance().addAlert("正在挑战副本中");
            return false;
        }

        if (this.fightsceneTpye == FIGHT_SCENE.LODDER_ARENA
            || this.fightsceneTpye == FIGHT_SCENE.SERVER_ARENA
            || this.fightsceneTpye == FIGHT_SCENE.THRONE
            || this.fightsceneTpye == FIGHT_SCENE.ESCORT
            || this.fightsceneTpye == FIGHT_SCENE.REVENGE
            || this.fightsceneTpye == FIGHT_SCENE.LOCAL_ARENA) {
            GameCommon.getInstance().addAlert("error_tips_10001");

            return false;
        }

        if (this.fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS
            || this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS
            || this.fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS
            || this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS
            || this.fightsceneTpye == FIGHT_SCENE.MYSTERIOUS_BOSS) {
            GameCommon.getInstance().addAlert("正在挑战BOSS中");

            return false;
        }

        // if (this.fightsceneTpye == FIGHT_SCENE.YEWAI && (this.fightScene as YewaiPVEFight).isFightBoss) {
        //     GameCommon.getInstance().addAlert("正在挑战野外BOSS中");
        //     return false;
        // }

        return true;
    }
    //背包已满判断
    public checkBagIsFull(): boolean {
        if (DataManager.getInstance().bagManager.cheakEquipbagIsFull(11)) {
            var bagfullNotice = [{ text: `背包容量不足，请先进行回收，否则将无法获得奖励。`, style: { textColor: 0xFF5656 } }];
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("AlertFrameUI", new AlertFrameParam(bagfullNotice, this.openSmeltView, this))
            );
            return true;
        }
        return false;
    }
    private openSmeltView(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SmeltPanel");
    }
    //能够不退出副本继续挑战的类型
    public canContiuneDup(dupid: number): boolean {
        let model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupid];
        if (!model)
            return false;
        if (model.type == DUP_TYPE.DUP_CHALLENGE) {
            return true;
        }
        let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(model.type, model.subType);
        if (dupinfo && model.type == DUP_TYPE.DUP_UNION && dupinfo.pass <= JsonModelManager.instance.getModelguildfuben().length) {
            return true;
        }
        return false;
    }
    //能使用推人技能的场景
    public get canHitBack(): boolean {
        if (!this.fightScene) return false;
        if (this.fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            return true;
        }
        return false;
    }
    //可以让BOSS行走的场景
    public get canBossMove(): boolean {
        if (this.fightDupId > 0) {
            let model: Modelcopy = JsonModelManager.instance.getModelcopy()[this.fightDupId];
            if (model.type == DUP_TYPE.DUP_SIXIANG) {
                return true;
            }
        }
        return false;
    }
    //不让小怪巡逻的场景
    public get canPatrol(): boolean {
        if (this.fightDupId > 0) {
            let model: Modelcopy = JsonModelManager.instance.getModelcopy()[this.fightDupId];
            if (model.type == DUP_TYPE.DUP_ZHUFU || model.type == DUP_TYPE.DUP_SIXIANG) {
                return false;
            }
        }
        return true;
    }
    //不需要显示护盾的场景
    public get showShieldScene(): boolean {
        if (!this.fightScene) return false;
        if (this.fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            return false;
        }
        return true;
    }
    //麻痹 沉默效果缩短的场景
    public get artifactFackerScene(): boolean {
        if (this.fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS) return true;

        return false;
    }
    //BOSS不能被特殊效果击中的场景
    public get unableArtifactBoss(): boolean {
        if (this.fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.MYSTERIOUS_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.ALLPEOPLE_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.CROSS_PVE_BOSS) return true;

        return false;
    }
    //PVP的场景
    public get isPVPFightScene(): boolean {
        if (this.fightsceneTpye == FIGHT_SCENE.YEWAIPVP) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.ESCORT) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.LOCAL_ARENA) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.LODDER_ARENA) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.REVENGE) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.VIP_BOSS) return true;
        return false;
    }
    //有特殊效果的战斗场景
    public get isPKEffectScene(): boolean {
        if (this.fightsceneTpye == FIGHT_SCENE.LOCAL_ARENA) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.LODDER_ARENA) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.ESCORT) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.REVENGE) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.YEWAIPVP) return true;
        if (this.fightsceneTpye == FIGHT_SCENE.SERVER_ARENA) return true;
        return false;
    }
    //The end
}