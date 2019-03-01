/**
 * 管理生物行为 行为规则方法
 * */
class BodyManager {
    private _mainScene: MainScene;
    private _mapInfo: MapInfo;
    private _heroBodys: PlayerBody[];//默认的摄像机镜头就在第一个角色身上
    private _otherPlayerBodys: Array<PlayerBody>;//其他玩家
    // private _cameraman: BaseBody;//摄像师 镜头跟着摄像师走

    public constructor(scene: MainScene) {
        this._mainScene = scene;
        this._otherPlayerBodys = [];
    }
    //重置刷新
    public onRefreshSence(): void {
        this._heroBodys = this._mainScene.heroBodys;
        this._mapInfo = this._mainScene.mapInfo;
        this.onDestroyAllHeroTarget();//重置人物身上的攻击对象
        this.onDestroyOtherBodys();//清除场景内其他生物
        if (this.herowalkingEff && this.herowalkingEff.parent) {
            this.herowalkingEff.parent.removeChild(this.herowalkingEff);
            this.herowalkingEff.onStop();
        }
        // if (this._cameraman) {
        //     this._cameraman.onDestroy();
        //     this._cameraman = null;
        // }
        this.pvp_showtime_stamp = 0;
        this.play_ultimate_skill = false;
    }
    /**是否暂停 TRUE-暂停 FLASE-开始**/
    private _fightPause: boolean = true;
    public set fightPause(bool: boolean) {
        if (this._fightPause != bool) {
            this._fightPause = bool;
            if (bool) {
                this.playStandForPlayer(this._mainScene.heroBody);
                for (var i: number = 0; i < this._otherPlayerBodys.length; i++) {
                    let otherBody: PlayerBody = this._otherPlayerBodys[i];
                    this.playStandForPlayer(otherBody);
                }
            }
        }
    }
    public playStandForPlayer(player: PlayerBody): void {
        if (!player) return;
        player.setMove(null);
        player.onStand();
        for (var i: number = 0; i < player.data.targets.length; i++) {
            var curattackTarget: ActionBody = player.data.targets[i];
            curattackTarget.setMove(null);
            curattackTarget.onStand();
        }
        if (player.petBody) {
            player.petBody.setMove(null);
            player.petBody.onStand();
        }
        if (player.retinuebody) {
            player.retinuebody.setMove(null);
            player.retinuebody.onStand();
        }
        if (player.magicbody) {
            player.magicbody.onStop();
        }
    }
    //获取其他玩家列表
    public get otherPlayerBodys(): Array<PlayerBody> {
        return this._otherPlayerBodys;
    }
    //屏蔽其他玩家
    private isShieldOhter: boolean = false;
    public onShieldOhterBody(bool: boolean): void {
        if (this.isShieldOhter != bool) {
            this.isShieldOhter = bool;
            this.refreshShieldOtherBody();
        }
    }
    public refreshShieldOtherBody(): void {
        for (var dIndex: number = 0; dIndex < this._otherPlayerBodys.length; dIndex++) {
            let otherBody: PlayerBody = this._otherPlayerBodys[dIndex];
            if (this._mainScene.heroBody.data.targets.indexOf(otherBody) < 0) {
                this._otherPlayerBodys[dIndex].bodyVisible = !this.isShieldOhter;
            }
        }
    }
    //战斗轮询
    public logicHandler(dt): boolean {
        //生物行为轮询
        if (!this._fightPause) {
            this.onHeroLogic(dt);
            this.onOhterBodyLogic(dt);
            this.onMonsterLogic(dt);
            // if (this._cameraman) {
            //     this.cameramanLogic(dt);
            // }
        }

        return false;
    }
    //野外PVP刷出
    //刷出怪物事件
    private onSceneEvnetMonster(monsterId): void {
        var monsterArea: RushEnemyData = new RushEnemyData();
        monsterArea.monsterId = monsterId;
        var neargridList: ModelMapNode[] = this._mapInfo.getGridListByDistance(this._mapInfo.getNodeModelByXY(this._mainScene.heroBody.x, this._mainScene.heroBody.y), 5);
        monsterArea.refreshGrid = neargridList[Math.floor(Math.random() * neargridList.length)].nodeId;
        monsterArea.refreshNum = Math.random() * 3 + 6;
        // monsterArea.isBoss = false;
        this.onRushMonster(monsterArea, 0, 4, 5);
        monsterArea = null;
    }
    //刷出NPC
    public onRushNpcToScene(rushdata: RushEnemyData, type: NPC_BODY_TYPE, scale: number = 1): NpcBody {
        let npcRebornPoint: egret.Point = this._mapInfo.getXYByGridIndex(rushdata.refreshGrid);
        let npcBody: NpcBody = BodyFactory.instance.createMonsterBody(rushdata.monsterId, BODY_TYPE.NPC) as NpcBody;
        npcBody.data.eventType = type;
        switch (type) {
            case NPC_BODY_TYPE.JACKAROO1:
            case NPC_BODY_TYPE.JACKAROO2:
            case NPC_BODY_TYPE.JACKAROO3:
                npcBody.onScaleHandler(scale);
                npcBody.onShowOrHideHpBar(false);
                this._mainScene.heroBody.setMove([npcRebornPoint]);
                this._mainScene.heroBody.moveSpeed = GameDefine.Jackaroo_Move_Speed;
                break;
            case NPC_BODY_TYPE.SIXIANG:
                break;
        }
        this.addEmenyBodyToAry(npcBody, npcRebornPoint);
        return npcBody;
    }
    //刷出采集物品
    private onSceneEvnetCollection(bodyId): void {
        var currHeroNode: ModelMapNode = this._mapInfo.getNodeModelByIndex(this._mapInfo.getGridIndexByXY(this._mainScene.heroBody.x, this._mainScene.heroBody.y));
        var heroNearPoints: ModelMapNode[] = this._mapInfo.getGridNearByNode(currHeroNode, 4, 4);
        var npcRebornPoint: egret.Point;
        if (heroNearPoints.length > 0) {
            npcRebornPoint = this._mapInfo.getXYByGridIndex(heroNearPoints[Math.floor(Math.random() * heroNearPoints.length)].nodeId);
        } else {
            npcRebornPoint = new egret.Point(this._mainScene.heroBody.x, this._mainScene.heroBody.y);
        }
        var treasureBody = BodyFactory.instance.createMonsterBody(bodyId, BODY_TYPE.COLLECTION) as NpcBody;
        treasureBody.data.eventParam = COLLECTION.Treasure;
        this.addEmenyBodyToAry(treasureBody, npcRebornPoint);
    }
    //刷出PVP战斗
    private onSceneEvnetPVP(): void {
        var robotData: RobotData = GameFight.getInstance().onRandomCrateRobotData(5, 8, "神秘玩家");
        var robotBody: PlayerBody = BodyFactory.instance.createPlayerBody(BODY_TYPE.ROBOT, robotData);
        var neargridList: ModelMapNode[] = this._mapInfo.getGridListByDistance(this._mapInfo.getNodeModelByXY(this._mainScene.heroBody.x, this._mainScene.heroBody.y), 12);
        var robotRebornPoint: egret.Point = this._mapInfo.getXYByGridIndex(neargridList[Math.floor(Math.random() * neargridList.length)].nodeId);
        // robotBody.onRide(true);
        robotBody.onAddEnemyBodyList(this._heroBodys);
        this.addEmenyBodyToAry(robotBody, robotRebornPoint);
    }
    //给其他玩家刷个怪
    public onCreateOhterEnemyList(otherBody: PlayerBody, monsterId: number, monsterNum: number, refreshNode: ModelMapNode): void {
        var refreshArea: ModelMapNode[] = this._mapInfo.getGridNearByNode(refreshNode, 2, 2);
        for (var i: number = 0; i < monsterNum; i++) {
            var monsterBody = BodyFactory.instance.createMonsterBody(monsterId, BODY_TYPE.MONSTER);
            monsterBody.isDamageFalse = true;
            var _radomDir: Direction = GameDefine.Dir_All_Ary[Math.floor(GameDefine.Dir_All_Ary.length * Math.random())];
            monsterBody.direction = _radomDir;
            var refreshPoint: egret.Point;
            if (refreshArea.length > 0) {
                refreshPoint = this._mapInfo.getXYByGridIndex(refreshArea[Math.floor(Math.random() * refreshArea.length)].nodeId);
            } else {
                refreshPoint = new egret.Point(otherBody.x, otherBody.y);
            }
            monsterBody.x = refreshPoint.x;
            monsterBody.y = refreshPoint.y;
            let xg_deathcount: number = FightDefine.getXgDeathCount();
            monsterBody.setDeathCount(xg_deathcount, xg_deathcount);
            // monsterBody.onHideHeadBar(false);
            this._mainScene.addBodyToMapLayer(monsterBody);
            otherBody.onAddEnemyBodyList([monsterBody]);
            monsterBody.onAddEnemyBodyList([otherBody]);
        }
    }
    //NPC选项处理
    private currNpcEvnetData: TaskEvnetData;
    public onTalkNpcResultHandler(taskEvent: TaskEvnetData): void {
        // if (this.currTaskNpc) {
        //     var exploreEvent: ModelTansuoTask = ModelManager.getInstance().modelTansuotask[GameFight.getInstance().figth_exoloreTaskId];
        //     var npcspeakword: string = exploreEvent.npcTalks[taskEvent.option - 1];
        //     var talkDir: string = this.currTaskNpc.x > this._mainScene.heroBody.x ? "left" : "right";
        //     if (npcspeakword)
        //         this.currTaskNpc.bodySpeak(npcspeakword, talkDir);
        // }
        // this.removeEmenyBodyToAry(this.currTaskNpc);
        // // this.onDestroyOtherBodys();
        // Tool.callbackTime(this.onTalkNpcTaskStart, this, 1000, taskEvent);
    }
    private onTalkNpcTaskStart(taskEvent: TaskEvnetData): void {
        switch (taskEvent.eventId) {
            case TASK_EVENT.Monster_Fight:
                this.onSceneEvnetMonster(taskEvent.param);
                break;
            case TASK_EVENT.Treasure:
                this.onSceneEvnetCollection(taskEvent.param);
                break;
            case TASK_EVENT.PVP_Fight:
                this.onSceneEvnetPVP();
                break;
            case TASK_EVENT.Treasure_PVP:
                this.onSceneEvnetCollection(taskEvent.param);
                break;
            case TASK_EVENT.Talk:
                this.onCompleteNpcTask();
                break;
            default:
                this.onCompleteNpcTask();
                break;
        }
        this.currNpcEvnetData = taskEvent;
    }
    // //完成NPC任务
    public onCompleteNpcTask(): void {
        if (!this.currNpcEvnetData)
            return;
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.EXPLORE_BOSS) {
            this.onDestroyAllHeroTarget();
            if (TASK_EVENT.Treasure_PVP == this.currNpcEvnetData.eventId) {
                this.currNpcEvnetData.eventId = TASK_EVENT.PVP_Fight;
                this.onTalkNpcResultHandler(this.currNpcEvnetData);
                return;
            }
            // this._mainScene.onSendExploreBossTaskResultMsg(this.currNpcEvnetData.option, FightDefine.FIGHT_RESULT_SUCCESS);
        }
        this.currNpcEvnetData = null;
    }
    //任务失败
    public onFailNpcTask(): void {
        if (!this.currNpcEvnetData)
            return;
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.EXPLORE_BOSS) {
            this.onDestroyAllHeroTarget();
            // this._mainScene.onSendExploreBossTaskResultMsg(this.currNpcEvnetData.option, FightDefine.FIGHT_RESULT_FAIL);
        }
        this.currNpcEvnetData = null;
    }
    //探索地图里其他玩家的行为
    private onExploreBossOtherHandler(playerBody: PlayerBody): void {
        var otherTaskRD: number = Math.random() * 10;
        var neargridList: ModelMapNode[] = this._mapInfo.getGridListByDistance(this._mapInfo.getNodeModelByXY(playerBody.x, playerBody.y), 15);
        var otherRDNode: ModelMapNode;
        otherRDNode = neargridList[Math.floor(Math.random() * neargridList.length)];
        var otherRDPoint: egret.Point;

        if (otherTaskRD < 2) {//站那发呆
            otherRDPoint = new egret.Point(playerBody.x, playerBody.y);
            Tool.removeArrayObj(this._otherPlayerBodys, playerBody);
            Tool.callbackTime(function (playerBody: PlayerBody, playerPoint: egret.Point) {
                this.addOtherBodyToScene(playerBody, playerPoint);
            }, this, Math.random() * 10 + 10, playerBody, otherRDPoint);
        } else if (otherTaskRD < 6) {//随便溜达
            otherRDPoint = this._mapInfo.getXYByGridIndex(otherRDNode.nodeId);
            playerBody.setMove(this._mapInfo.findPointPath(playerBody.x, playerBody.y, otherRDPoint.x, otherRDPoint.y));
        } else if (otherTaskRD < 10) {//打怪
            var monsterId: number = GameDefine.Explore_Monsters[Math.floor(Math.random() * GameDefine.Explore_Monsters.length)];
            this.onCreateOhterEnemyList(playerBody, monsterId, 2, otherRDNode);
        } else if (otherTaskRD < 11) {//PVP 先别给自己找事了
        }
    }
    /**
     * 创建假人的处理
     * bodyNum数量，
     * minAttr maxAttr最小属性比例，最大属性比例，
     * rebronNearNodeList 供假人刷出的随机点
     * */
    public onCreateFakerPlayerToSnece(minAttr: number, maxAttr: number, rebronNearNodeList: ModelMapNode[], name?: string): PlayerBody {
        if (rebronNearNodeList.length > 0) {
            var nodeIndex: number = Math.floor(Math.random() * rebronNearNodeList.length);
            var otherRebronPoint: egret.Point = this._mapInfo.getGridRdXYByIndex(rebronNearNodeList[nodeIndex].nodeId);
            var robotData: RobotData = GameFight.getInstance().onRandomCrateRobotData(minAttr, maxAttr, name);
            var otherBody: PlayerBody = BodyFactory.instance.createPlayerBody(BODY_TYPE.ROBOT, robotData);
            otherBody.direction = GameDefine.Dir_All_Ary[Math.floor(GameDefine.Dir_All_Ary.length * Math.random())];
            otherBody.x = otherRebronPoint.x;
            otherBody.y = otherRebronPoint.y;
            this.addOtherBodyToScene(otherBody, otherRebronPoint);
            rebronNearNodeList.splice(nodeIndex, 1);
            return otherBody;
        }
        return null;
    }
    /**
     * 创建其他玩家
     * */
    public onCreateOtherPlayer(playerdata: PlayerData, rebronNearNodeList?: ModelMapNode[]): PlayerBody {
        let otherBody: PlayerBody = BodyFactory.instance.createPlayerBody(BODY_TYPE.PLAYER, playerdata);
        otherBody.direction = GameDefine.Dir_All_Ary[Math.floor(GameDefine.Dir_All_Ary.length * Math.random())];

        this.setOtherPlayerPos(otherBody, rebronNearNodeList);
        return otherBody;
    }
    public setOtherPlayerPos(otherBody: PlayerBody, rebronNearNodeList: ModelMapNode[]): void {
        if (!rebronNearNodeList || rebronNearNodeList.length == 0) return;

        let nodeIndex: number = Math.floor(Math.random() * rebronNearNodeList.length);
        let otherRebronPoint: egret.Point = this._mapInfo.getGridRdXYByIndex(rebronNearNodeList[nodeIndex].nodeId);
        otherBody.x = otherRebronPoint.x;
        otherBody.y = otherRebronPoint.y;
        this.addOtherBodyToScene(otherBody, otherRebronPoint);
        this.addPlayerRetinueToMap(otherBody);
    }
    /**
     * 按照指定的怪物ID输出一只敌对怪物
     * monsterId怪物的表ID
     * monsterType 怪物类型 BODY_TYPE.MONSTER小怪  BODY_TYPE.MONSTER和BOSS
     * 刷出的随机点 rebronNearNodeList 只传一个就是固定点刷
     * */
    public onCreateMapBody(monsterId, rebronNearNodeList: ModelMapNode[], monsterType: BODY_TYPE = BODY_TYPE.MONSTER, isEmeny: boolean = true): ActionBody {
        var nodeIndex: number = Math.floor(Math.random() * rebronNearNodeList.length);
        var rebornPoint: egret.Point = this._mapInfo.getGridRdXYByIndex(rebronNearNodeList[nodeIndex].nodeId);
        var mapBody: ActionBody = BodyFactory.instance.createMonsterBody(monsterId, monsterType);
        if (isEmeny) {
            this.addEmenyBodyToAry(mapBody, rebornPoint);
        } else {
            mapBody.x = rebornPoint.x;
            mapBody.y = rebornPoint.y;
            this._mainScene.addBodyToMapLayer(mapBody);
        }
        return mapBody;
    }
    /**
     * 刷怪方法
     * RushEnemyData是刷怪数据
     * deathNum 是设置怪物几刀死亡
     * colRadius rowRadius 横纵随机区域
     * **/
    public onRushMonster(rushmodel: RushEnemyData, deathNum: number = 0, colRadius: number = 2, rowRadius: number = 2): void {
        this.resetShowAnimCheckIndex();

        var monsterBody: ActionBody;
        var refreshPoint: egret.Point = this._mapInfo.getXYByGridIndex(rushmodel.refreshGrid);
        var _currMapNode: ModelMapNode = this._mapInfo.getNodeModelByXY(refreshPoint.x, refreshPoint.y);
        var allbodyPoints: ModelMapNode[] = this._mapInfo.getGridNearByNode(_currMapNode, colRadius, rowRadius);

        for (var i: number = 0; i < rushmodel.refreshNum; i++) {
            var radomPonit: egret.Point;
            if (rushmodel.isBoss) {
                radomPonit = refreshPoint;
                monsterBody = BodyFactory.instance.createMonsterBody(rushmodel.monsterId, BODY_TYPE.BOSS);
                monsterBody.direction = Direction.DOWN;
            } else {
                monsterBody = BodyFactory.instance.createMonsterBody(rushmodel.monsterId, BODY_TYPE.MONSTER);
                var _radomDir: Direction = GameDefine.Dir_All_Ary[Math.floor(GameDefine.Dir_All_Ary.length * Math.random())];
                monsterBody.direction = _radomDir;
                if (allbodyPoints.length > 0) {
                    var radomPointIndex: number = Math.floor(allbodyPoints.length * Math.random());
                    _currMapNode = allbodyPoints[radomPointIndex];
                    radomPonit = this._mapInfo.getGridRdXYByIndex(_currMapNode.nodeId);
                    allbodyPoints.splice(radomPointIndex, 1);
                } else if (this._mainScene.heroBody.data.targets.length > 0) {
                    var _radomBody = this._mainScene.heroBody.data.targets[Math.floor(this._mainScene.heroBody.data.targets.length * Math.random())];
                    var _gridIndex: number = this._mapInfo.getGridIndexByXY(_radomBody.x, _radomBody.y);
                    radomPonit = this._mapInfo.getGridRdXYByIndex(_gridIndex);
                } else {
                    radomPonit = refreshPoint;
                }
            }
            //设置怪物几下被打死
            if (deathNum > 0) {
                monsterBody.setDeathCount(deathNum, deathNum);
            }
            this.addEmenyBodyToAry(monsterBody, radomPonit);
            radomPonit = null;
        }
    }
    //1v1  PVP的战斗生成规则
    public onInitAreraScene(datas: PlayerData[], selfNode: number, enemyNode: number): void {
        //主角添加到地图
        let herobody: PlayerBody = this._mainScene.heroBody;
        let heroPoint: egret.Point = this._mapInfo.getGridRdXYByIndex(selfNode);
        this._mainScene.setHeroMapPostion(heroPoint);
        //对手添加到地图
        let rebornNode: ModelMapNode = this._mapInfo.getNodeModelByIndex(enemyNode);
        let otherBody: PlayerBody;
        for (let i: number = 0; i < datas.length; i++) {
            otherBody = this.onCreateOtherPlayer(datas[i], [rebornNode]);

            if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.LODDER_ARENA) {
                if (otherBody.data.bodyType == BODY_TYPE.ROBOT) {
                    otherBody.data.attributes[ATTR_TYPE.ATTACK] = 100;
                    otherBody.setDeathCount(3, 3);
                }
            } else if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAIPVP) {
                let guideTask: GuideTaskData = DataManager.getInstance().taskManager.guideTaskData;
                if (guideTask.model && !guideTask.isFinish && guideTask.model.eventType == 28) {//28赢一次野外PVP
                    otherBody.data.attributes[ATTR_TYPE.HP] = herobody.data.attributes[ATTR_TYPE.ATTACK] * 2;
                    otherBody.data.attributes[ATTR_TYPE.ATTACK] = 100;
                    otherBody.data.attributes[ATTR_TYPE.PHYDEF] = otherBody.data.attributes[ATTR_TYPE.MAGICDEF] = 0;
                    for (let n: number = 0; n < otherBody.data.skills.length; n++) {//技能都是1级
                        otherBody.data.updateSkillLevel(n, otherBody.data.skills[n].level > 0 ? 1 : 0);
                        otherBody.data.updateSkillGrade(n, 0);
                    }
                    otherBody.data.onRebirth();
                }
            }

            otherBody.direction = Direction.RIGHT;
            this.addEmenyBodyToAry(otherBody);
            otherBody.onAddEnemyBodyList(this._heroBodys);
        }
        //先给两个设置到中心位置上
        if (otherBody) {
            herobody.playChagre([new egret.Point(size.width / 2 + 50, size.height / 2 + 50)], true);
            otherBody.playChagre([new egret.Point(size.width / 2 - 100, size.height / 2 - 100)], true);
        }

        //增加摄像师到地图里
        // if (!this._cameraman) {
        //     this._cameraman = new BaseBody();
        //     this._mainScene.addBodyToMapLayer(this._cameraman);
        // }
        // this._cameraman.x = this._mainScene.heroBody.x;
        // this._cameraman.y = this._mainScene.heroBody.y;
    }
    //生物移动
    private onBodyMove(body: ActionBody): void {
        if (!body.isMoving) {
            return;
        }
        var _targetMapNode: ModelMapNode = this._mapInfo.getNodeModelByXY(body.x, body.y);
        if (_targetMapNode) {
            // if (_targetMapNode.isJump && body.movePaths && body.movePaths.length > 0) {//跳跃处理
            //     if (body.data.bodyType == BODY_TYPE.SELF) {
            //         body.onJump();
            //     } else {
            //         var neargridList: ModelMapNode[] = this._mapInfo.getGridNearByNode(_targetMapNode);
            //         if (neargridList.length > 0) {
            //             var randomGrid: ModelMapNode = neargridList[Math.floor(Math.random() * neargridList.length)];
            //             body.setMove([this._mapInfo.getXYByGridIndex(randomGrid.nodeId)]);
            //         } else {
            //             body.onActionReset();
            //         }
            //     }
            // }
            //是否走到遮挡区
            if (_targetMapNode.isCover) {
                body.onSetCover(true);
            } else {
                body.onSetCover(false);
            }
        }
        // else {
        //     var errorLogStr: string = "当前玩家处于错误坐标：X=" + body.x + "Y=" + body.y;
        //     if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
        //         Tool.throwException(errorLogStr);
        //     } else {
        //         egret.log(errorLogStr);
        //     }
        // }

        body.onMove();

        let isPlayer: boolean = egret.is(body, "PlayerBody");
        if (isPlayer) {
            let playerbody: PlayerBody = body as PlayerBody;
            if (playerbody.isChagre) {
                (body as PlayerBody).onCreateGhost();//幻影
            }
        }
    }
    //主角跟NPC对话
    private onHerobodyTalkNpc(npcbody: NpcBody): void {
        switch (npcbody.data.eventType) {
            case NPC_BODY_TYPE.JACKAROO1:
                GameFight.getInstance().onCheckStoyTalk();
                break;
            case NPC_BODY_TYPE.JACKAROO2:
                GameFight.getInstance().onCheckStoyTalk();
                let mountRush: RushEnemyData = new RushEnemyData();
                mountRush.monsterId = 191;
                mountRush.refreshGrid = 359;
                this.onRushNpcToScene(mountRush, NPC_BODY_TYPE.JACKAROO3);
                break;
        }
        // if (npcbody.data.eventParam) {
        //     if (egret.is(npcbody.data.eventParam, "ModelTansuoTask")) {
        //         var taskmodel: ModelTansuoTask = ModelManager.getInstance().modelTansuotask[npcbody.data.eventParam.id];
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ExploreTalkPanel", taskmodel));
        //     }
        // }
        npcbody.data.eventParam = null;
    }
    //主角采集
    private onHerobodyCollection(npcbody: NpcBody): void {
        if (npcbody.data.eventParam) {
            if (npcbody.data.eventParam == COLLECTION.Treasure) {
                npcbody.onBodyWaiting(5000, this.onCollectionComplete, this, "寻宝中.", skins.Collection_ProBarSkin);
            }
            for (var i: number = 0; i < this._heroBodys.length; i++) {
                this._heroBodys[i].onStand();
            }
            npcbody.data.eventParam = null;
        }
    }
    //采集行为结束
    private onCollectionComplete(): void {
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.EXPLORE_BOSS) {
            this.onCompleteNpcTask();
        }
    }
    //获取body的类名
    private getBodyActionType(bodyType: BODY_TYPE): string {
        var type: string = "";
        switch (bodyType) {
            case BODY_TYPE.PLAYER:
            case BODY_TYPE.ROBOT:
                type = "PlayerBody";
                break;
            case BODY_TYPE.MONSTER:
                type = "MonsterBody";
                break;
            case BODY_TYPE.BOSS:
                type = "BossBody"
                break;
            case BODY_TYPE.NPC:
            case BODY_TYPE.COLLECTION:
                type = "NpcBody";
                break;
            case BODY_TYPE.PET:
                type = "PetBody";
                break;
        }
        return type;
    }
    //添加敌对生物
    public addEmenyBodyToAry(enemyBody: ActionBody, point: egret.Point = null): void {
        if (this._mainScene.heroBody.data.targets.indexOf(enemyBody) >= 0) {
            return;
        }
        enemyBody.addEventListener(Action_Event.BODY_DEATH_FINISH, this.bodyDeathEventHanlder, this);
        for (var i: number = 0; i < this._heroBodys.length; i++) {
            this._heroBodys[i].onAddEnemyBodyList([enemyBody]);
        }
        enemyBody.bodyVisible = true;
        if (point) {
            enemyBody.x = point.x;
            enemyBody.y = point.y;
            this._mainScene.addBodyToMapLayer(enemyBody);
        }
    }
    //添加其他生物
    private addOtherBodyToScene(otherBody: PlayerBody, point: egret.Point): void {
        if (this._otherPlayerBodys.indexOf(otherBody) >= 0) {
            return;
        }
        otherBody.x = point.x;
        otherBody.y = point.y;
        otherBody.bodyVisible = !this.isShieldOhter;
        if (this._otherPlayerBodys.indexOf(otherBody) < 0) {
            this._otherPlayerBodys.push(otherBody);
        }
        this._mainScene.addBodyToMapLayer(otherBody);
    }
    //生物死亡处理
    private dropPoint: egret.Point;
    private bodyDeathEventHanlder(event: egret.Event): void {
        var targetBody: ActionBody = event.currentTarget as ActionBody;
        this.removeEmenyBodyToAry(targetBody);
        if (!this.dropPoint) {
            this.dropPoint = new egret.Point();
        }
        this.dropPoint.x = targetBody.x;
        this.dropPoint.y = targetBody.y;

        GameFight.getInstance().fightScene.onKillTargetHandle();

        if (targetBody.data.bodyType == BODY_TYPE.MONSTER) {
            // let hitbackPos: egret.Point = Tool.beelinePoint(targetBody.x, targetBody.y, this._mainScene.heroBody.direction, Tool.toInt(Math.random() * 100) + 100);
            // TweenLiteUtil.onBelineTween(targetBody, hitbackPos, 400);
            // TweenLiteUtil.onHideTween(targetBody);
            Tool.callbackTime(this.onOverDeathAnim, this, 600, targetBody);
        } else if (targetBody.data.bodyType == BODY_TYPE.BOSS) {
            // TweenLiteUtil.onHideTween(targetBody);
            Tool.callbackTime(this.onOverDeathAnim, this, 600, targetBody);
        } else if (targetBody.data.bodyType == BODY_TYPE.PLAYER || targetBody.data.bodyType == BODY_TYPE.ROBOT) {
            if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.XUEZHAN_BOSS || GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.VIP_BOSS) {
                DataManager.getInstance().dupManager.allpeoplebossData.removeOneOhterFightData((targetBody.data as PlayerData).playerId);
            }
            this.onDestroyOhterOne(targetBody as PlayerBody, false);
            BodyFactory.instance.onRecovery(targetBody);
        } else {
            BodyFactory.instance.onRecovery(targetBody);
        }
    }
    private onOverDeathAnim(deathbody: ActionBody): void {
        BodyFactory.instance.onRecovery(deathbody);
    }
    //移除主角攻击列表
    public onDestroyAllHeroTarget(): void {
        for (var i: number = 0; i < this._heroBodys.length; i++) {
            for (var n: number = this._mainScene.heroBody.data.targets.length - 1; n >= 0; n--) {
                var _destroyBody = this._heroBodys[i].data.targets[n];
                this.removeEmenyBodyToAry(_destroyBody);
                if (_destroyBody.data.bodyType == BODY_TYPE.PLAYER || _destroyBody.data.bodyType == BODY_TYPE.ROBOT) {
                    this.onDestroyOhterOne(_destroyBody as PlayerBody, false);
                }
                BodyFactory.instance.onRecovery(_destroyBody);
            }
        }
    }
    //移除场景内其他生物列表
    public onDestroyOtherBodys(): void {
        for (var i: number = this._otherPlayerBodys.length - 1; i >= 0; i--) {
            var otherBody: PlayerBody = this._otherPlayerBodys[i];
            this.onDestroyOhterOne(otherBody);
        }
    }
    //移除单个场景内的其他玩家
    public onDestroyOhterOne(otherBody: PlayerBody, clearTarget: boolean = true): void {
        if (clearTarget) {
            this.onRemoveAllOtherTarget(otherBody);
        }
        if (otherBody.petBody) {
            otherBody.removePetBody();
        }
        if (otherBody.retinuebody) {
            otherBody.removeRetinue();
        }
        otherBody.onClearTargets();
        Tool.removeArrayObj(this._otherPlayerBodys, otherBody);
        BodyFactory.instance.onRecovery(otherBody);
    }
    //移除其他玩家的所有攻击目标
    public onRemoveAllOtherTarget(otherBody: PlayerBody): void {
        for (let n: number = otherBody.data.targets.length - 1; n >= 0; n--) {
            let targetBody: ActionBody = otherBody.data.targets[n];
            otherBody.onRemoveTarget(targetBody);
            BodyFactory.instance.onRecovery(targetBody);
        }
    }
    //从主角的攻击列表里移除对象
    public removeEmenyBodyToAry(enemybody: ActionBody): void {
        if (!enemybody) {
            return;
        }
        for (var i: number = 0; i < this._heroBodys.length; i++) {
            this._heroBodys[i].onRemoveTarget(enemybody);
        }
        enemybody.removeEventListener(Action_Event.BODY_DEATH_FINISH, this.bodyDeathEventHanlder, this);
    }
    //添加宠物到场景
    public addPlayerRetinueToMap(playerBody: PlayerBody): void {
        if (playerBody.petBody) {
            playerBody.petBody.onRefreshData();
            this.addBodyToOwnerNear(playerBody.petBody, playerBody);
        }
        if (playerBody.retinuebody) {
            playerBody.retinuebody.onRefreshData();
            this.addBodyToOwnerNear(playerBody.retinuebody, playerBody);
        }
        if (playerBody.magicbody) {
            this.addBodyToOwnerNear(playerBody.magicbody, playerBody);
        }
    }
    public addBodyToOwnerNear(body: BaseBody, ownerbody: PlayerBody): void {
        var node: ModelMapNode = this._mapInfo.getNodeModelByXY(ownerbody.x, ownerbody.y);
        var randomNodes: ModelMapNode[] = this._mapInfo.getGridNearByNode(node, 2, 2);
        node = randomNodes[Math.floor(Math.random() * randomNodes.length)];
        var _point: egret.Point = this._mapInfo.getGridRdXYByIndex(node.nodeId);
        body.x = _point.x;
        body.y = _point.y;
        if (!body.parent && ownerbody.parent) {
            this._mainScene.addBodyToMapLayer(body);
        }
        body.onReset();
    }
    //摄像师轮询
    // private cameramanLogic(dt): void {
    //     if (!this._cameraman) return;
    //     this._cameraman.moveSpeed = this._mainScene.heroBody.moveSpeed;
    //     let hero: ActionBody = this._mainScene.heroBody;
    //     let enemy: ActionBody = this._mainScene.heroBody.currTarget;
    //     if (!hero || !enemy) return;
    //     let hero_target: egret.Point = hero.movePaths && hero.movePaths.length > 0 ? hero.movePaths[0] : hero.moveTarget;
    //     let enemy_target: egret.Point = enemy.movePaths && enemy.movePaths.length > 0 ? enemy.movePaths[0] : enemy.moveTarget;
    //     let moveTarget: egret.Point;
    //     if (enemy && hero_target && enemy_target) {
    //         moveTarget = new egret.Point(hero_target.x + (enemy_target.x - hero_target.x) / 2, hero_target.y + (enemy_target.y - hero_target.y) / 2);
    //     }
    //     let paths: Array<egret.Point>;
    //     if (moveTarget) {
    //         if (!this._cameraman.moveTarget || this._cameraman.moveTarget.x != moveTarget.x || this._cameraman.moveTarget.y != moveTarget.y) {
    //             paths = this._mapInfo.findPointPath(this._cameraman.x, this._cameraman.y, moveTarget.x, moveTarget.y);
    //         }
    //     }
    //     if (paths) {
    //         this._cameraman.setMovePoint(paths);
    //     }

    //     let interval: number = 40;
    //     this._cameraman.logicMove(interval);
    //     this._mainScene.getMapLayer().onCameraFollowForBody(this._cameraman);
    // }
    //人物攻击轮询
    private onHeroLogic(dt): void {
        for (var i: number = 0; i < this._heroBodys.length; i++) {
            var herobody: PlayerBody = this._heroBodys[i];
            herobody.checkBuffer();//检查更新BUFF状态

            if (herobody.data.isDie) continue;
            if (!herobody.data.isHitChenMo) {
                herobody.removeChenMoAnim();
            }
            if (!herobody.data.isHitMaBi) {
                if (herobody.data.targets.length > 0) {
                    this.useSkill(herobody);
                } else if (herobody.isMoving) {
                    this.onBodyMove(herobody);
                }
                herobody.removeMaBiAnim();
            }
            //宠物移动
            this.onPetLogic(herobody);
            //随从
            this.onRetinueLogic(herobody);
            //法宝
            this.onMagicLogic(herobody);
        }

        this.onShowOrHideWalkingEffect();
    }
    //法宝轮询
    private _magicMoveTime: number = 0;
    private onMagicLogic(player: PlayerBody): void {
        let magicbody: MagicBody = player.magicbody;
        if (magicbody && magicbody.parent) {
            if (!magicbody.isMoving && this._magicMoveTime < egret.getTimer()) {
                let targetPoint: egret.Point = Tool.randomPosByDistance(player.x, player.y, 60);
                magicbody.setRandomMove(targetPoint);
                this._magicMoveTime = 2000 + egret.getTimer();
            }
            //行走
            magicbody.onMove();
        }
    }
    //随从轮询
    private onRetinueLogic(player: PlayerBody): void {
        let retinuebody: RetinueBody = player.retinuebody;
        if (retinuebody && retinuebody.parent) {
            if (!retinuebody.isMoving && !retinuebody.isfollow) {
                let targetPoint: egret.Point = Tool.randomPosByDistance(player.x, player.y, 200);
                retinuebody.moveSpeed = GameDefine.Attack_Move_Speed;
                retinuebody.setMove([targetPoint]);
            }
            this.onBodyMove(retinuebody);
        }
    }
    //角色宠物的轮询
    private onPetLogic(playerbody: PlayerBody): void {
        if (!playerbody.petBody || !playerbody.petBody.parent) {
            return;
        }
        this.onBodyMove(playerbody.petBody);
    }
    //怪物攻击轮询
    private onMonsterLogic(dt): void {
        var allMonsterBody: MonsterBody[] = [];//场景内的所有怪物 主角的攻击目标 + 其他玩家的攻击目标
        //主角攻击对象
        for (var i: number = 0; i < this._mainScene.heroBody.data.targets.length; i++) {
            if (this._mainScene.heroBody.data.targets[i].data.bodyType == BODY_TYPE.MONSTER || this._mainScene.heroBody.data.targets[i].data.bodyType == BODY_TYPE.BOSS) {
                var _targetBody: MonsterBody = this._mainScene.heroBody.data.targets[i] as MonsterBody;
                allMonsterBody.push(_targetBody);
            }
        }
        //其他玩家的攻击对象
        for (var i: number = 0; i < this._otherPlayerBodys.length; i++) {
            var otherbody: PlayerBody = this._otherPlayerBodys[i];
            if (!otherbody) {
                if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                    Tool.throwException("其他玩家为空！但没有从列表中移除");
                }
                continue;
            }
            for (var n: number = 0; n < otherbody.data.targets.length; n++) {
                var _targetBody: MonsterBody = otherbody.data.targets[n] as MonsterBody;
                if (!_targetBody) {
                    if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                        Tool.throwException("当前玩家并无攻击对象！！");
                    }
                    continue;
                }
                if (_targetBody.data.bodyType == BODY_TYPE.MONSTER || _targetBody.data.bodyType == BODY_TYPE.BOSS) {
                    if (allMonsterBody.indexOf(_targetBody) < 0)
                        allMonsterBody.push(_targetBody);
                }
            }
        }
        //所有怪物的轮询
        for (var i: number = 0; i < allMonsterBody.length; i++) {
            var _targetBody: MonsterBody = allMonsterBody[i];
            if (_targetBody.data.isHitMaBi) continue;
            _targetBody.checkBuffer();//检查更新BUFF状态
            _targetBody.removeMaBiAnim();
            if (_targetBody.data.warnDist > 0 && _targetBody.distanceToSelf(this._mainScene.heroBody) <= _targetBody.data.warnDist) {
                _targetBody.onAddEnemyBodyList(this._mainScene.heroBodys);
            }
            if (_targetBody.data.targets.length > 0) {
                this.useSkill(_targetBody);
            }
            // else {
            //     this.onMonsterPatrol(_targetBody);//怪物巡逻逻辑
            // }
        }
    }
    //其他玩家的攻击轮询
    private onOhterBodyLogic(dt): void {
        for (var i: number = 0; i < this._otherPlayerBodys.length; i++) {
            var _otherBody: PlayerBody = this._otherPlayerBodys[i];
            if (this.isShieldOhter && this._mainScene.heroBody.data.targets.indexOf(_otherBody) < 0) continue;

            _otherBody.checkBuffer();//检查更新BUFF状态
            if (!_otherBody.data.isHitChenMo) {
                _otherBody.removeChenMoAnim();
            }
            if (!_otherBody.data.isHitMaBi) {
                if (_otherBody.data.targets.length > 0) {
                    this.useSkill(_otherBody);
                } else if (_otherBody.isMoving) {
                    this.onBodyMove(_otherBody);
                }
                _otherBody.removeMaBiAnim();
            }
            //宠物移动
            this.onPetLogic(_otherBody);
            //随从
            this.onRetinueLogic(_otherBody);
            //法宝
            this.onMagicLogic(_otherBody);
        }
    }
    //处理是否人物在寻路中 显示寻路状态特效
    private herowalkingEff: Animation;
    private onShowOrHideWalkingEffect(): void {
        let herobody: PlayerBody = this._mainScene.heroBody;
        if (!this.herowalkingEff) {
            this.herowalkingEff = new Animation("xunluzhong", -1, false);
        }
        if (!GameFight.getInstance().isJackaroo && herobody.getDistToTarget() > 100) {
            if (!this.herowalkingEff.parent) {
                this._mainScene.heroBody.addEffectToSelf("HEAD", this.herowalkingEff);
                this.herowalkingEff.onPlay();
            }
        } else {
            if (this.herowalkingEff.parent) {
                this.herowalkingEff.parent.removeChild(this.herowalkingEff);
                this.herowalkingEff.onStop();
            }
        }
    }
    //使用技能
    public useSkill(attacker: ActionBody): void {
        if (attacker.data.isDie)//死亡处理
            return;

        if (attacker.data.isStop) {//暂停的处理
            attacker.onActionReset();
            return;
        }

        if (this.play_ultimate_skill) {
            this.onBodyMove(attacker);
            return;
        }

        let curattackTarget: ActionBody = attacker.data.targets[0];
        if (!curattackTarget) {
            if (!attacker.data.isUseingSkill) {
                attacker.onActionReset();
            }
            return;
        }

        let isPlayer: boolean = egret.is(attacker, "PlayerBody");
        let _targetDistance: number = attacker.distanceToSelf(curattackTarget);
        if (curattackTarget.data.bodyType == BODY_TYPE.NPC && attacker.data.bodyType == BODY_TYPE.SELF) {//NPC事件
            let npcdata: NpcData = curattackTarget.data as NpcData;
            if (_targetDistance <= FightDefine.STORY_TALK_DISTANCE) {
                this.onHerobodyTalkNpc(curattackTarget as NpcBody);
                return;
            }
        } else if (curattackTarget.data.bodyType == BODY_TYPE.COLLECTION && attacker.data.bodyType == BODY_TYPE.SELF) {//采集事件
            if (_targetDistance <= FightDefine.TREASURE_TALK_DISTANCE) {
                this.onHerobodyCollection(curattackTarget as NpcBody);
                return;
            }
        } else {//攻击逻辑
            let _skillInfo: SkillInfo;
            if (!attacker.walkOn) {
                //准备技能
                _skillInfo = attacker.data.useSkill;
                if (!_skillInfo) {
                    _skillInfo = attacker.data.getCanUseSkill();
                    //PVP场景的特殊塑造
                    if (_skillInfo && GameFight.getInstance().isPKEffectScene && _skillInfo.model.fonteffect) {
                        this.onPlayPVPSceneEFT(attacker as PlayerBody);
                        return;//开始表演 双方暂停
                    }
                }
            }

            if (_skillInfo) {

                //给自己加BUFF
                if (_skillInfo.model.targetType != 0) {//如果是一个给自己的BUFF技能
                    if (!attacker.currTarget) {
                        attacker.currTarget = curattackTarget;
                    }
                    this.releaseBuffHandler(attacker, _skillInfo);
                    attacker.onAttack();
                    this.onBodyMove(attacker);
                    return;
                }

                //顺次从攻击列表里筛选出一个活着的目标
                curattackTarget = null;
                for (let i: number = 0; i < attacker.data.targets.length; i++) {
                    let _attackTarget: ActionBody = attacker.data.targets[i];
                    let _distance: number = attacker.distanceToSelf(_attackTarget);
                    if (!_attackTarget.data.isDie) {
                        if (attacker.currTarget === _attackTarget) {
                            curattackTarget = _attackTarget;
                            _targetDistance = _distance;
                            break;
                        } else {//按攻击距离选取目标
                            if (!curattackTarget) {
                                curattackTarget = _attackTarget;
                                _targetDistance = _distance;
                            } else if (_distance < _targetDistance) {
                                curattackTarget = _attackTarget;
                                _targetDistance = _distance;
                            }
                        }
                    }
                }
                //没有目标
                if (!curattackTarget) {
                    attacker.onActionReset();
                    return;
                }
                attacker.currTarget = curattackTarget;

                if (_skillInfo.isDist(_targetDistance) || attacker.ignoreDist || this.pvp_showtime_stamp > 0) {
                    if (attacker.data.bodyType == BODY_TYPE.SELF) {
                        if (GameFight.getInstance().onCheckStoyTalk()) {
                            return;
                        }
                    } else if (attacker.data.bodyType == BODY_TYPE.PLAYER || attacker.data.bodyType == BODY_TYPE.ROBOT) {
                        if (curattackTarget.data.bodyType == BODY_TYPE.SELF && (curattackTarget as PlayerBody).data.attackcount == 0) {
                            return;//保证主角先出手
                        }
                    }
                    attacker.onAttack();
                } else if (!attacker.isMoving) {
                    if (isPlayer) {
                        if (GameFight.getInstance().canHitBack && curattackTarget.data.bodyType == BODY_TYPE.MONSTER) {
                            attacker.playChagre([Tool.getPosByTwoPoint(curattackTarget.x, curattackTarget.y, attacker.x, attacker.y, 50)], true);
                        } else {
                            if (attacker.data.bodyType == BODY_TYPE.SELF) {
                                attacker.onJump(new egret.Point(curattackTarget.x, curattackTarget.y));
                            } else {
                                if (curattackTarget === this._mainScene.heroBody.currTarget) {
                                    attacker.onJump(Tool.randomPosByDistance(curattackTarget.x, curattackTarget.y, 150));
                                } else {
                                    attacker.onJump(new egret.Point(curattackTarget.x, curattackTarget.y));
                                }
                            }
                        }

                        //随从的路径
                        if ((attacker as PlayerBody).retinuebody) {
                            let moveTargetPos: egret.Point;
                            if (attacker.movePaths.length > 0) {
                                moveTargetPos = attacker.movePaths[attacker.movePaths.length - 1];
                            } else {
                                moveTargetPos = attacker.moveTarget;
                            }
                            if (moveTargetPos) {
                                moveTargetPos = Tool.randomPosByDistance(moveTargetPos.x, moveTargetPos.y, 200);
                                (attacker as PlayerBody).retinuebody.setFollowPaths([moveTargetPos]);
                            }
                        }
                    } else {
                        this.onFindPathHanlder(attacker, curattackTarget.x, curattackTarget.y);
                    }
                }
            }
        }
        //移动 攻击不打断移动
        this.onBodyMove(attacker);
    }
    //寻路处理
    private onFindPathHanlder(body: ActionBody, targetX: number, targetY: number): void {
        let _pathPoints: Array<egret.Point> = [new egret.Point(targetX, targetY)];//寻路路径
        // try {
        //     if (body.data.bodyType == BODY_TYPE.SELF) {
        //         _pathPoints = this._mapInfo.findPointPath(body.x, body.y, targetX, targetY);
        //     } else if (this._mainScene.heroBody.data.targets.indexOf(body) >= 0) {
        //         //当目标就是主角正在寻找的目标时 它的路径是主角路径的倒置
        //         if (this._mainScene.heroBody.movePaths && this._mainScene.heroBody.movePaths.length > 1) {
        //             var currTarget: ActionBody = this._mainScene.heroBody.currTarget;
        //             if (currTarget && currTarget !== body) {
        //                 _pathPoints.push(new egret.Point(currTarget.x, currTarget.y));
        //             }
        //             for (var i: number = this._mainScene.heroBody.movePaths.length - 1; i >= 1; i--) {
        //                 _pathPoints.push(this._mainScene.heroBody.movePaths[i]);
        //             }
        //         } else {
        //             _pathPoints = [new egret.Point(targetX, targetY)];
        //         }
        //     } else {
        //         _pathPoints = this._mapInfo.findPointPath(body.x, body.y, targetX, targetY);
        //     }
        // } catch (e) {
        //     if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
        //         var errLog: string = "寻路出错！\n";
        //         errLog += "-----attacker type:" + typeof (body) + "  attacker X=" + body.x + "  attacker Y=" + body.y + "\n";
        //         errLog += "-----target X=" + targetX + "  target Y=" + targetY;
        //         Tool.throwException(errLog);
        //         return;
        //     } else {//外网处理寻路卡死
        //         _pathPoints = [new egret.Point(targetX, targetY)];
        //     }
        // }

        body.setMove(_pathPoints);
    }
    //怪物巡逻
    private onMonsterPatrol(monster: MonsterBody): void {
        if (monster.isMoving) {
            this.onBodyMove(monster);
            return;
        }
        if (monster.data.canPatrol) {
            if (!monster.data.patrolPoint)
                monster.data.patrolPoint = new egret.Point(monster.x, monster.y);
            var monsterNode: ModelMapNode = this._mapInfo.getNodeModelByXY(monster.data.patrolPoint.x, monster.data.patrolPoint.y);
            var nearGridList: ModelMapNode[] = this._mapInfo.getGridNearByNode(monsterNode);
            var ramdonGrid: ModelMapNode = nearGridList[Math.floor(Math.random() * nearGridList.length)];
            if (ramdonGrid) {
                var patrolPoint: egret.Point = this._mapInfo.getGridRdXYByIndex(ramdonGrid.nodeId);
                monster.setMove([patrolPoint]);
            }
        } else {
            monster.onActionReset();
        }
    }
    //处理给自己加BUFF
    private releaseBuffHandler(attacker: ActionBody, skillInfo: SkillInfo): void {
        var buffId: number = skillInfo.model.buffId;
        if (skillInfo.model.rectType > 0) {
            var targetbodys: ActionBody[] = this.getTeamBodys(attacker);
            for (var i: number = 0; i < targetbodys.length; i++) {
                targetbodys[i].addBuffer(skillInfo);
            }
        }
    }
    //根据类型和ID找出场景里的同阵营的人
    public getTeamBodys(body: ActionBody, includeSelf: boolean = false): ActionBody[] {
        var targetbodys: ActionBody[] = [];
        var id: number;
        var bodyType: BODY_TYPE = body.data.bodyType;
        if (bodyType == BODY_TYPE.SELF) {
            for (var i: number = 0; i < this._heroBodys.length; i++) {
                var _heroBody: PlayerBody = this._heroBodys[i];
                if (!includeSelf) {
                    if (_heroBody !== body)
                        targetbodys.push(_heroBody);
                } else {
                    targetbodys.push(_heroBody);
                }
            }
        } else if (bodyType == BODY_TYPE.PLAYER) {
            id = (body.data as PlayerData).playerId;
            for (var i: number = 0; i < this.otherPlayerBodys.length; i++) {
                var _otherbody: PlayerBody = this.otherPlayerBodys[i];
                if (_otherbody.data.playerId == id) {
                    if (!includeSelf) {
                        if (_otherbody !== body)
                            targetbodys.push(_otherbody);
                    } else {
                        targetbodys.push(_otherbody);
                    }
                }
            }
        } else if ((bodyType == BODY_TYPE.MONSTER || bodyType == BODY_TYPE.BOSS) && body.data.targets[0]) {
            id = body.data.modelid;
            var targetBody: ActionBody = body.data.targets[0];
            for (var i: number = 0; i < targetBody.data.targets.length; i++) {
                var _monsterBody: ActionBody = targetBody.data.targets[i];
                if (_monsterBody.data.modelid == id) {
                    if (!includeSelf) {
                        if (_monsterBody !== body)
                            targetbodys.push(_monsterBody)
                    } else {
                        targetbodys.push(_monsterBody)
                    }
                }
            }
        }
        return targetbodys;
    }
    //PVP场景的特殊塑造 p_atk攻击方  p_hurt被击方 showtime时间
    //效果为二人震退对方，摄像机保持在二人中间位置  待大招播放完毕  恢复正常的视角
    private pvp_showtime_stamp: number = 0;
    private play_ultimate_skill: boolean;
    private onPlayPVPSceneEFT(attacker: PlayerBody): void {
        if (this.pvp_showtime_stamp > 0) return;//正在播放就不要重复的播放了
        this.pvp_showtime_stamp = 0;
        this.play_ultimate_skill = true;
        this.playStandForPlayer(this._mainScene.heroBody);
        for (var i: number = 0; i < this._otherPlayerBodys.length; i++) {
            let otherBody: PlayerBody = this._otherPlayerBodys[i];
            this.playStandForPlayer(otherBody);
        }
        this._mainScene.onSwithMapGary(true);

        let hurter: ActionBody = attacker.currTarget;
        if (!hurter || hurter.data.isDie || (attacker.data.bodyType != BODY_TYPE.SELF && hurter.data.bodyType != BODY_TYPE.SELF)) return;
        let atk_skill: SkillInfo = attacker.data.getCanUseSkill();
        let hurt_skill: SkillInfo = hurter.data.getCanUseSkill();
        this.pvp_showtime_stamp = Math.max(atk_skill ? atk_skill.model.castTime : 0, hurt_skill ? hurt_skill.model.castTime : 0) + 1500;
        if (this.pvp_showtime_stamp == 0) return;
        let cameraPos: egret.Point = new egret.Point(this._mainScene.heroBody.x, this._mainScene.heroBody.y);//摄像机的位置（屏幕位置）
        let atker_x: number = attacker.x;
        let atker_y: number = attacker.y;
        let hurter_x: number = hurter.x;
        let hurter_y: number = hurter.y;
        let atk_oldPos: egret.Point = new egret.Point(atker_x, atker_y);
        let hurt_oldPos: egret.Point = new egret.Point(hurter_x, hurter_y);
        let atk_backPos: egret.Point = Tool.getPosByTwoPoint(hurter_x, hurter_y, atker_x, atker_y, 300);//攻击方震退点
        let hurt_bakPos: egret.Point = Tool.getPosByTwoPoint(atker_x, atker_y, hurter_x, hurter_y, 300);//受创方震退点
        //为双方套上击退的BUFF
        attacker.setWalkWithSpeed([atk_backPos], 400);//, GameDefine.Define_Move_Speed
        hurter.setWalkWithSpeed([hurt_bakPos], 400);//, GameDefine.Define_Move_Speed
        Tool.callbackTime(this.showUltimateSkill, this, 300);
        Tool.callbackTime(this.onEndPVPSceneEFT, this, this.pvp_showtime_stamp, attacker, atk_oldPos, hurter, hurt_oldPos);
    }
    private showUltimateSkill(): void {
        if (!GameFight.getInstance().isPKEffectScene) return;
        if (this.pvp_showtime_stamp == 0) return;
        SkillEffectManager.getInstance().onDestroyAllSkillEffect();

        let herobody: PlayerBody = this._mainScene.heroBody;
        let slef_skill: SkillInfo = herobody.data.getCanUseSkill();
        let enmeyBody: PlayerBody = herobody.currTarget as PlayerBody;
        let enemy_skill: SkillInfo = enmeyBody ? enmeyBody.data.getCanUseSkill() : null;

        if (slef_skill.model.fonteffect) {
            let slef_anim: Animation = new Animation("skill_longjuanfeng", 1, true);
            herobody.addEffectToSprite(slef_anim, null, "TOP");
        }

        if (enemy_skill && enemy_skill.model.fonteffect) {
            let enemy_anim: Animation = new Animation("skill_longjuanfeng", 1, true);
            enmeyBody.addEffectToSprite(enemy_anim, null, "TOP");
        }

        Tool.callbackTime(function () { this.play_ultimate_skill = false }, this, 1000);
    }
    private onEndPVPSceneEFT(attacker: ActionBody, atk_Pos: egret.Point, hurter: ActionBody, hurt_Pos: egret.Point): void {
        if (this.pvp_showtime_stamp == 0) return;
        this.pvp_showtime_stamp = 0;
        this._mainScene.onSwithMapGary(false);
        if (!attacker || !hurter) return;
        if (!attacker || !hurter || attacker.data.isDie || !attacker.parent || hurter.data.isDie || !hurter.parent) return;
        attacker.playChagre([atk_Pos], true);
        hurter.playChagre([hurt_Pos], true);
    }
    //掉落物品
    private Drop_Fly_Max: number = 4;
    private _dropScene: FIGHT_SCENE;
    public onPlayDropEffect(dropitems: AwardItem[]): void {
        if (!this.dropPoint) {
            this.dropPoint = new egret.Point(this._mainScene.heroBody.x, this._mainScene.heroBody.y);
        }
        let itemGap: number = 80;
        let drop_Row: number = Math.ceil(Math.sqrt(dropitems.length));
        let startX: number = this.dropPoint.x - Math.floor(drop_Row / 2) * itemGap;
        let startY: number = this.dropPoint.y - Math.floor(drop_Row / 2) * itemGap;
        for (let i: number = 0; i < dropitems.length; i++) {
            let dropitem: AwardItem = dropitems[i];
            let dropbody: DropBody = BodyFactory.instance.onCreateDropBody(dropitem.type, dropitem.id, dropitem.quality);
            this._mainScene.addBodyToMapLayer(dropbody);
            dropbody.x = this.dropPoint.x;
            dropbody.y = this.dropPoint.y;
            let cusOffX: number = startX + (i % drop_Row) * itemGap;
            let cusOffY: number = startY + Math.floor(i / drop_Row) * itemGap;
            let delaytime: number = Math.floor(i / this.Drop_Fly_Max) * 200;
            TweenLiteUtil.dropbodyFly1(dropbody, new egret.Point(cusOffX, cusOffY));
            Tool.callbackTime(this.onDropFlyHanlder, this, 1500, dropbody);
        }
        this._dropScene = GameFight.getInstance().fightsceneTpye;
    }
    private onDropFlyHanlder(dropbody: DropBody): void {
        dropbody.onDestyEffect();
        if (dropbody.model.type == GOODS_TYPE.MASTER_EQUIP || dropbody.model.type == GOODS_TYPE.SERVANT_EQUIP) {
            if (DataManager.getInstance().bagManager.cheakEquipbagIsFull()) {
                GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(34));//背包已满
                this.onDestroyDropbody(dropbody);
                return;
            }
        }
        if (this._mainScene.getMapLayer().visible && this._dropScene == GameFight.getInstance().fightsceneTpye) {
            dropbody.x = this._mainScene.getMapLayer().heroPosByModule[0] - (this._heroBodys[0].x - dropbody.x);//this._mapLayer.heroPointX - (this.heroBody.x - body.x);
            dropbody.y = this._mainScene.getMapLayer().heroPosByModule[1] - (this._heroBodys[0].y - dropbody.y);
            this._mainScene.addDropBodyToLayer(dropbody);
            var targetPoint: egret.Point = new egret.Point(this._mainScene.getMapLayer().heroPosByModule[0], this._mainScene.getMapLayer().heroPosByModule[1] - (this._mainScene.heroBody.data.model.high / 2));
            TweenLiteUtil.beelineTween(dropbody, this.onDestroyDropbody, this, targetPoint);
        } else {
            this.onDestroyDropbody(dropbody);
        }
    }
    private onDestroyDropbody(body: DropBody): void {
        body.onDestroy();
        body = null;
    }
    /**出场动画逻辑**/
    //检查有没有怪物是需要播放出场动画的 触发条件就是人物移动了 也就是摄像机移动了 另外就是刷怪也需要强制检查一下
    private _isPlayShowAnim: boolean;
    private _heroCheckNodeIndex: number;
    private _showanimCheckTime: number = 0;
    private cheackNodeColRadius: number = 4;//检测的列数半径（根据人物为中心左右检测这么多格子）
    private cheackNodeRowRadius: number = 6;//检测的行数半径（根据人物为中心上下检测这么多格子）
    private showanimbody: ActionBody[];
    private resetShowAnimCheckIndex(): void {
        this._heroCheckNodeIndex = 0;
    }
    private checkShowAnimation() {
        this.showanimbody = [];
        if (egret.getTimer() - this._showanimCheckTime < 100)
            return;

        this._showanimCheckTime = egret.getTimer();
        var _curHeroGird: ModelMapNode = this._mapInfo.getNodeModelByXY(this._mainScene.heroBody.x, this._mainScene.heroBody.y);
        if (this._heroCheckNodeIndex != _curHeroGird.nodeId) {
            this._heroCheckNodeIndex = _curHeroGird.nodeId;
            //将人周围的点都列出来
            var heroNearPoints: ModelMapNode[] = this._mapInfo.getGridNearByNode(_curHeroGird, this.cheackNodeColRadius, this.cheackNodeRowRadius);
            for (var i: number = 0; i < this._mainScene.heroBody.data.targets.length; i++) {
                var _monsterBody: MonsterBody = this._mainScene.heroBody.data.targets[i] as MonsterBody;
                var _monsterGrid: ModelMapNode = this._mapInfo.getNodeModelByXY(_monsterBody.x, _monsterBody.y);
                if (heroNearPoints.indexOf(_monsterGrid) >= 0 && _monsterBody.data.showAnimation) {
                    this.showanimbody.push(_monsterBody);
                }
            }
        }
    }
    private onPlayShowAnimation(): void {
        if (this._isPlayShowAnim)
            return;
        this._isPlayShowAnim = true;
        var animFunc: Function = this.bodyShowAnimation1;
        var animEndFunc: Function = this.bodyShowAnimationEnd1;
        // for (var i: number = 0; i < this.showanimbody.length; i++) {
        // var _body: ActionBody = this.showanimbody[i];

        // var _effect: EffectBody = new EffectBody(_body.data.model.showAnimation);
        // if (i == this.showanimbody.length - 1) {
        //     _effect.addEventListener(Action_Event.BODY_EFFECT_DESTROY, animEndFunc, this);
        // } else {
        // _effect.addEventListener(Action_Event.BODY_EFFECT_DESTROY, function (e: egret.Event): void {
        //     var targetBody = e.currentTarget;
        //     targetBody = null;
        // }, this);
        // }
        // _body.addEffectToSelf("TOP", _effect);
        // animFunc.call(null, _body);
        // }
    }
    //出场动画 人物动画1
    private bodyShowAnimation1(body: ActionBody): void {
        body.alpha = 0;
        var _tween = egret.Tween.get(body);
        _tween.to({ alpha: 1 }, 1000);
    }
    private bodyShowAnimationEnd1(e: egret.Event): void {
        var targetBody = e.currentTarget;
        targetBody.currentTarget.removeEventListener(Action_Event.BODY_EFFECT_DESTROY, this.bodyShowAnimationEnd1, this);
        for (var i: number = this.showanimbody.length - 1; i >= 0; i--) {
            var _body: ActionBody = this.showanimbody[i];
            _body.alpha = 1;
            egret.Tween.removeTweens(_body);
            this.showanimbody.splice(i, 1);
        }
        this._isPlayShowAnim = false;
        targetBody = null;
    }
    //The end
}