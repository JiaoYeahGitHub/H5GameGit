// TypeScript file
class DupManager {
    private dupinfo_map;
    private dupinfo_typeMap;

    public xuezhanInfo: XuezhanInfo;
    public explorebossInfo;
    public worldbossEnjoyNum: number = 0;//参与世界BOSS次数
    public worldbossEnjoyRecoverTime: number = 0;//世界BOSS参与次数回复时间
    public worldbossFightTime;
    public vipTeamTimes: number;//vip组队副本 进入其他人副本的 剩余次数

    public crossPVEBoss: CrossPVEBossData;//跨服BOSS数据

    public constructor() {
        this.dupinfo_map = {};
        this.dupinfo_typeMap = {};
        this.worldbossFightTime = {};
        this.xuezhanInfo = new XuezhanInfo();
        this.explorebossInfo = {};
        var dupmodels = JsonModelManager.instance.getModelcopy();
        for (var dupId in dupmodels) {
            var model: Modelcopy = dupmodels[dupId];
            var dupKey: string;
            if (!this.dupinfo_typeMap[model.type]) {
                this.dupinfo_typeMap[model.type] = new Array<DupInfo>();
            }
            if (DUP_TYPE.DUP_PERSONALLY == model.type) {
                for (var gerenId in JsonModelManager.instance.getModelgerenboss()) {
                    var gerenmodel: Modelgerenboss = JsonModelManager.instance.getModelgerenboss()[gerenId];
                    dupKey = `${model.type}_${gerenmodel.id}`;
                    this.dupinfo_map[dupKey] = new DupInfo(model.type, gerenmodel.id);
                    this.dupinfo_typeMap[model.type].push(this.dupinfo_map[dupKey]);
                    this.dupinfo_map[dupKey].dupid = model.id;
                }
            }
            else {
                dupKey = `${model.type}_${model.subType}`;
                if (!this.dupinfo_map[dupKey]) {
                    this.dupinfo_map[dupKey] = new DupInfo(model.type, model.subType);
                    this.dupinfo_typeMap[model.type].push(this.dupinfo_map[dupKey]);
                }
            }
        }
        this.crossPVEBoss = new CrossPVEBossData();
    }

    public parseDupinfo(msg: Message): void {
        var duptype: number = msg.getByte();
        switch (duptype) {
            case DUP_TYPE.DUP_PERSONALLY:
                for (let gerenId in JsonModelManager.instance.getModelgerenboss()) {
                    let gerenmodel: Modelgerenboss = JsonModelManager.instance.getModelgerenboss()[gerenId];
                    let dupinfo: DupInfo = this.dupinfo_map[`${duptype}_${gerenmodel.id}`];
                    dupinfo.attacknum = 0;
                }
                break;
        }
        var dupPassnum: number = msg.getShort();
        var dupsize: number = msg.getByte();
        for (var i: number = 0; i < dupsize; i++) {
            var subID: number = msg.getByte();
            var dupKey: string = `${duptype}_${subID}`;
            var dupinfo: DupInfo = this.dupinfo_map[dupKey];
            dupinfo.pass = dupPassnum;
            dupinfo.parseDupinfoMsg(msg);
            dupinfo.parseAwardIndex(msg);
        }
        // 个人副本通关记录
        switch (duptype) {
            case DUP_TYPE.DUP_PERSONALLY:
                var passreSize: number = msg.getByte();
                for (var i: number = 1; i <= passreSize; i++) {
                    var dupKey: string = `${duptype}_${i}`;
                    var dupinfo: DupInfo = this.dupinfo_map[dupKey];
                    var passre: number = msg.getByte();
                    if (dupinfo) {
                        dupinfo.updatePersonRe(passre);
                    }
                }
                break;
            case DUP_TYPE.DUP_VIP_TEAM:
                this.vipTeamTimes = msg.getByte();
                break;
            case DUP_TYPE.DUP_CAILIAO:
                var passreSize: number = msg.getByte();
                for (var i: number = 1; i <= passreSize; i++) {
                    var dupKey: string;
                    if (i == 4) {
                        dupKey = `${duptype}_${i + 1}`;
                    }
                    else {
                        dupKey = `${duptype}_${i}`;
                    }
                    var dupinfo: DupInfo = this.dupinfo_map[dupKey];
                    if (!dupinfo)
                        continue;
                    var passre: number = msg.getByte();
                    dupinfo.upDateCaiLiaoRe(passre);
                }
                break;
            case DUP_TYPE.DUP_TEAM:
                var passreSize: number = msg.getByte();
                for (var i: number = 1; i <= passreSize; i++) {
                    var dupKey: string = `${duptype}_${1}`;
                    var passre: number = msg.getByte();
                    if (dupinfo.diffcult == i) {
                        var dupinfo: DupInfo = this.dupinfo_map[dupKey];
                        if (!dupinfo)
                            continue;
                        dupinfo.upDateTeamRe(passre);
                        break;
                    }
                }
                break;
            case DUP_TYPE.DUP_LINGXING:
                DataManager.getInstance().fuLingManager.myDamageNum = msg.getLong();
                break;
        }
        for (let dupkey in this.dupinfo_typeMap) {
            let dupinfoAry: Array<DupInfo> = this.dupinfo_typeMap[dupkey];
            for (let i: number = 0; i < dupinfoAry.length; i++) {
                let dupinfo: DupInfo = dupinfoAry[i];
                dupinfo.onUpdate();
            }
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }

    public parseDupSweepNum(msg: Message): void {
        let dupId: number = msg.getByte();
        let sweepnum: number = msg.getByte();//扫荡过多少次
        let model: Modelcopy = JsonModelManager.instance.getModelcopy()[dupId];
        if (model) {
            let dupinfo: DupInfo = this.getDupInfo(model.type, model.subType);
            if (model.type == DUP_TYPE.DUP_CAILIAO || model.type == DUP_TYPE.DUP_TEAM) {
                dupinfo.attacknum = dupinfo.attacknum + 1;
            }
            dupinfo.sweepNum = sweepnum;
        }

        GameCommon.getInstance().receiveMsgToClient(msg);
    }

    public parseXuezhanInitMsg(msg: Message): void {
        this.xuezhanInfo.onParseXuezhanInitMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }

    public parseXuezhanBuffMsg(msg: Message): void {
        var buffId: number = msg.getByte();
        var waveNum: number = msg.getShort();
        if (this.xuezhanInfo.selectbuffList.indexOf(buffId) >= 0) {
            this.xuezhanInfo.addXuezhanBuff(buffId);
            this.xuezhanInfo.xuezhanWaveNum = waveNum;
        }
        this.xuezhanInfo.selectbuffList = [0, 0, 0];
        this.xuezhanInfo.isSelectBuff = false;
        this.xuezhanInfo.xuezhanStar = msg.getShort();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public parseXueZhanCueGetStar(): void {

    }
    public parseXuezhanRewardMsg(msg: Message): void {
        this.xuezhanInfo.isRewardBox = false;
        GameCommon.getInstance().receiveMsgToClient(msg);
    }

    public parseXuezhanSaodangMsg(msg: Message): void {
        var xuezhanWaveNum = msg.getShort();
        var xuezhanstarnum: number = msg.getShort();
        this.xuezhanInfo.reviveNum = msg.getByte();
        this.xuezhanInfo.xuezhanWaveNum = xuezhanWaveNum;
        DataManager.getInstance().dupManager.xuezhanInfo.onXuezhanSuccess(xuezhanWaveNum, xuezhanstarnum);
        this.xuezhanInfo.isRewardBox = msg.getBoolean();
        this.xuezhanInfo.isSelectBuff = msg.getBoolean();
        if (this.xuezhanInfo.isSelectBuff) {
            for (var i: number = 0; i < this.xuezhanInfo.selectbuffList.length; i++) {
                this.xuezhanInfo.selectbuffList[i] = msg.getByte();
            }
        }
        this.xuezhanInfo.cleanBUff();
        var buffSize = msg.getByte();
        for (var i: number = 0; i < buffSize; i++) {
            this.xuezhanInfo.addXuezhanBuff(msg.getByte());
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public difuDupredPoint(): boolean {
        return this.xuezhanInfo.reviveNum > 0
    }

    public getDupInfo(dupType: DUP_TYPE, dupid: number): DupInfo {
        return this.dupinfo_map[`${dupType}_${dupid}`];
    }

    public getDupInfoByID(id: number): DupInfo {
        let dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[id];
        return this.getDupInfo(dupmodel.type, dupmodel.subType);
    }

    public getDupInfolistByType(dupType: number): DupInfo[] {
        return this.dupinfo_typeMap[dupType];
    }
    //获取血战副本的当前层数 0等于没开启
    public get xuezhanLayerNum(): number {
        var layerNum: number = 0;
        if (this.xuezhanInfo) {
            layerNum = Math.ceil(this.xuezhanInfo.xuezhanWaveNum / GameDefine.Xuezhan_LayerWaveNum);
        }
        return layerNum;
    }
    public get getXueZhanHistoryNum(): number {
        var layerNum: number = 0;
        if (this.xuezhanInfo && this.xuezhanInfo.layerStars) {
            return Math.ceil(this.xuezhanInfo.layerStars.length / 3);
        }
        return layerNum;
    }
    //更新探索BOSS体力值和恢复时间
    public parseExploreInfo(msg: Message): void {
        var oldexploreLife: number = this.explorebossInfo.lifeNum;
        this.explorebossInfo.lifeNum = msg.getShort();
        this.explorebossInfo.leftRecover = msg.getInt();
        this.explorebossInfo.lifeMaxNum = msg.getShort();
        this.explorebossInfo.leftRecover = egret.getTimer() + this.explorebossInfo.leftRecover * 1000;
        GameCommon.getInstance().receiveMsgToClient(msg);
        if (oldexploreLife > this.explorebossInfo.lifeNum) {
            oldexploreLife = oldexploreLife - this.explorebossInfo.lifeNum;
            var consumelifeTxt: egret.ITextElement[] = [];
            consumelifeTxt.push({ text: `消耗${oldexploreLife}体力值`, style: { textColor: 0xe63232 } });
            PromptPanel.getInstance().addPromptGain(consumelifeTxt);
            consumelifeTxt = null;
        }
    }
    //更新世界BOSS列表
    public parseWorldBossInfo(msg: Message): void {
        // if (this.worldbossInfoList.length > 0) {
        //     for (var i: number = this.worldbossInfoList.length - 1; i >= 0; i--) {
        //         delete this.worldbossInfoList[i];
        //         this.worldbossInfoList.splice(i, 1);
        //     }
        // }
        // this.worldbossEnjoyNum = msg.getShort();
        // this.worldbossEnjoyRecoverTime = msg.getInt() * 1000 + egret.getTimer();
        // var bossSize: number = msg.getShort();
        // for (var i: number = 0; i < bossSize; i++) {
        //     var worldbossInfo: WorldBossInfo = new WorldBossInfo();
        //     worldbossInfo.parseBossMsg(msg);
        //     this.worldbossInfoList.push(worldbossInfo);
        //     if (GameFight.getInstance().fight_worldBossInfo && GameFight.getInstance().fight_worldBossInfo.bossId == worldbossInfo.bossId) {
        //         GameFight.getInstance().fight_worldBossInfo = worldbossInfo;
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.WORLDBOSS_ENTERSCENE_INIT));
        //     }
        // }
        // this.worldbossInfoList.sort(function (a, b): number {
        //     var ASortNum: number = a.caller && a.caller.id == DataManager.getInstance().playerManager.player.id ? a.bossId : 100 + a.bossId;
        //     ASortNum = (a.lefttime - egret.getTimer()) <= 0 ? ASortNum + 1000 : ASortNum;
        //     var BSortNum: number = b.caller && b.caller.id == DataManager.getInstance().playerManager.player.id ? b.bossId : 100 + b.bossId;
        //     BSortNum = (b.lefttime - egret.getTimer()) <= 0 ? BSortNum + 1000 : BSortNum;
        //     return ASortNum - BSortNum;
        // })
        // GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //全民BOSS数据结构相关
    private _allpeopleData: AllPeopleBossData;
    public get allpeoplebossData(): AllPeopleBossData {
        if (!this._allpeopleData) {
            this._allpeopleData = new AllPeopleBossData();
        }
        return this._allpeopleData;
    }
    //更新全民BOSS列表
    public parseAllPeopleBossMsg(msg: Message): void {
        this.allpeoplebossData.lefttimes = msg.getShort();
        this.allpeoplebossData.leftRecover = msg.getInt();
        var bosssize: number = msg.getShort();
        var bossID: number = -1;
        for (var i: number = 0; i < bosssize; i++) {
            if (!this.allpeoplebossData.infos[i]) {
                this.allpeoplebossData.infos[i] = new AllPeopleBossInfo();
            }
            var bossInfo: AllPeopleBossInfo = this.allpeoplebossData.infos[i];
            bossInfo.parseMessage(msg);
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //更新血战BOSS列表
    public parseXuezhanBossInfoMsg(msg: Message): void {
        let size: number = msg.getShort();
        for (let i: number = 0; i < size; i++) {
            if (!this.allpeoplebossData.xuezhanInfos[i]) {
                this.allpeoplebossData.xuezhanInfos[i] = new XuezhanBossInfo();
            }
            let bossInfo: XuezhanBossInfo = this.allpeoplebossData.xuezhanInfos[i];
            bossInfo.parseMessage(msg);
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //更新仙山BOSS列表
    public parseXianShanBossInfoMsg(msg: Message): void {
        let size: number = msg.getShort();
        this.allpeoplebossData.xianshanInfos = [];
        for (let i: number = 0; i < size; i++) {
            let bossInfo: XianShanBossInfo = new XianShanBossInfo();
            bossInfo.parseMessage(msg);
            if (bossInfo.rebirthTime > 0) {
                this.allpeoplebossData.xianshanInfos[i] = bossInfo;
            }
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public onChangeXianShanBossList(): void {

        if (DataManager.getInstance().xiandanManager.bossState == 0) {
            this.allpeoplebossData.xianshanInfos.pop();
            DataManager.getInstance().xiandanManager.bossSize = this.allpeoplebossData.xianshanInfos.length;
        }
    }
    //更新VIPBOSS列表
    public parseVipBossInfoMsg(msg: Message): void {
        let size: number = msg.getShort();
        for (let i: number = 0; i < size; i++) {
            let vipbossInfo: VipBossInfo = new VipBossInfo();
            vipbossInfo.parseMessage(msg);
            this.allpeoplebossData.vipbossInfos[vipbossInfo.id] = vipbossInfo;
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**全民BOSS刷新提示**/
    public onRemindAllPeopleBoss(message: Message): void {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_GEREN_BOSS)) return;
        let bosssize: number = message.getByte();
        let model: Modelquanminboss;
        for (let i: number = 0; i < bosssize; i++) {
            let rebornBossId: number = message.getShort();
            let allpeoplemodel: Modelquanminboss = JsonModelManager.instance.getModelquanminboss()[rebornBossId];
            let isOpen: boolean = allpeoplemodel.limitLevel <= DataManager.getInstance().playerManager.player.coatardLv;
            if (isOpen && this._allpeopleData.remindBossIds.indexOf(rebornBossId) >= 0) {
                model = allpeoplemodel;
            }
            var info = this.allpeoplebossData.infos[rebornBossId];
            if (info) {
                info.isOpen = true;
            }
        }
        if (model && GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            let bossfightter: Modelfighter = ModelManager.getInstance().getModelFigher(model.modelId);
            GameCommon.getInstance().onShowFuncTipsBar(FUNCTIP_TYPE.BOSS_REMIND, `${bossfightter.name}刷新了`);
        }
    }
    public onAllPeopleBossDead(message: Message): void {
        let bossId: number = message.getShort();
        var info = this.allpeoplebossData.infos[bossId];
        if (info) {
            info.isOpen = false;
        }
    }
    public onAllPeopleBossFT(message: Message): void {
        DataManager.getInstance().dupManager.allpeoplebossData.lefttimes = message.getShort();
    }

    /**全民BOSS刷新提示**/
    public onRemindXuezhanBoss(message: Message): void {
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            let bosssize: number = message.getByte();
            for (let i: number = 0; i < bosssize; i++) {
                let rebornBossId: number = message.getShort();
                let funtype: number;
                switch (funtype) {
                    case BLESS_TYPE.RETINUE_CLOTHES:
                        funtype = FUN_TYPE.FUN_HUANZHUANG;
                        break;
                    case BLESS_TYPE.RETINUE_HORSE:
                        funtype = FUN_TYPE.FUN_FAZUO;
                        break;
                    case BLESS_TYPE.RETINUE_WEAPON:
                        funtype = FUN_TYPE.FUN_LINGZHANG;
                        break;
                    case BLESS_TYPE.RETINUE_WING:
                        funtype = FUN_TYPE.FUN_YUYI;
                        break;
                    case BLESS_TYPE.MAGIC:
                        funtype = FUN_TYPE.FUN_BAOQI;
                        break;
                }
                if (FunDefine.isFunOpen(funtype)) {
                    GameCommon.getInstance().onShowFuncTipsBar(FUNCTIP_TYPE.BOSS_REMIND, `血战BOSS刷新了`);
                    break;
                }
            }
        }
    }
    /**VIPBOSS刷新提示**/
    public onRemindVIPBoss(message: Message): void {
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            let bosssize: number = message.getByte();
            for (let i: number = 0; i < bosssize; i++) {
                let rebornBossId: number = message.getShort();
                let vipboosmodel: Modelvipboss = JsonModelManager.instance.getModelvipboss()[rebornBossId];
                if (vipboosmodel.vip <= DataManager.getInstance().playerManager.player.viplevel) {
                    GameCommon.getInstance().onShowFuncTipsBar(FUNCTIP_TYPE.BOSS_REMIND, `仙尊BOSS刷新了`);
                    break;
                }
            }
        }
    }
    /**转生BOSS提示**/
    public onRemindSamsaraBoss(): void {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_ZHUANSHENG_BOSS)) return;
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            GameCommon.getInstance().onShowFuncTipsBar(FUNCTIP_TYPE.BOSS_REMIND, `境界BOSS已开启`);
        }
    }
    //全民BOSS其他玩家进入场景协议
    public parseAllPeopleOtherFightMsg(msg: Message): void {
        let scenes: FIGHT_SCENE[] = [FIGHT_SCENE.ALLPEOPLE_BOSS, FIGHT_SCENE.XUEZHAN_BOSS, FIGHT_SCENE.VIP_BOSS, FIGHT_SCENE.XIANSHAN_BOSS];
        if (scenes.indexOf(GameFight.getInstance().fightsceneTpye) >= 0) {
            var bodysize: number = msg.getByte();
            for (var i: number = 0; i < bodysize; i++) {
                var otherData: OtherFightData = this.allpeoplebossData.addOtherFightData(msg);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.OTHERBODY_ENTER_SCENE), otherData);
        } else {
            GameFight.getInstance().allpeopleOtherMsg = msg;
        }
    }
    //全民BOSS提醒设置
    public parseAllPeopleRemindMsg(msg: Message): void {
        var remindsize: number = msg.getShort();
        this.allpeoplebossData.remindBossIds = [];
        for (var i: number = 0; i < remindsize; i++) {
            this.allpeoplebossData.remindBossIds[i] = msg.getShort();
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //获取转生BOSS数据结构
    private _samsarabossData: SamsaraBossData;
    public get samsarebossData(): SamsaraBossData {
        if (!this._samsarabossData)
            this._samsarabossData = new SamsaraBossData();
        return this._samsarabossData;
    }

    //获取神秘BOSS数据结构
    private _mysteriousbossData: SamsaraBossData;
    public get mysteriousData(): SamsaraBossData {
        if (!this._mysteriousbossData)
            this._mysteriousbossData = new SamsaraBossData();
        return this._mysteriousbossData;
    }
    //请求转生BOSS的信息
    public requstSamsareBossInfoMsg(): void {
        var infoMsg: Message = new Message(MESSAGE_ID.SAMSARA_BOSS_LISTINFO_MSG);
        GameCommon.getInstance().sendMsgToServer(infoMsg);
    }
    //转生BOSS信息列表
    public parseSamsareBossInfoMsg(msg: Message): void {
        this.samsarebossData.rebornLefttime = msg.getInt();
        this.samsarebossData.openLefttime = msg.getInt();
        var bosssize: number = msg.getShort();
        for (var i: number = 0; i < bosssize; i++) {
            var bossId: number = msg.getShort();
            this.samsarebossData.bossLifes[bossId] = [];
            this.samsarebossData.bossLifes[bossId][0] = msg.getLong();//上限
            this.samsarebossData.bossLifes[bossId][1] = msg.getLong();//当前血量
        }
        this.samsarebossData.hasbackaward = msg.getBoolean();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //转生BOSS其他玩家进入场景协议
    public parseSamsaraBossOhterFightMsg(msg: Message): void {
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS) {
            var bodysize: number = msg.getByte();
            for (var i: number = 0; i < bodysize; i++) {
                var otherData: OtherFightData = this.samsarebossData.parseOtherFightData(msg);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(MESSAGE_ID.SAMSARA_BOSS_OTHERBODY_MSG.toString()), otherData);
        }
    }
    //神秘BOSS其他玩家进入场景协议
    public parseMyBossOhterFightMsg(msg: Message): void {
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.SAMSARA_BOSS) {
            var bodysize: number = msg.getByte();
            for (var i: number = 0; i < bodysize; i++) {
                var otherData: OtherFightData = this.samsarebossData.parseOtherFightData(msg);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(MESSAGE_ID.MYSTERIOUS_BOSS_OTHERBODY_MSG.toString()), otherData);
        }
    }
    //四象副本领奖返回
    public parseFourinageAwardMsg(msg: Message): void {
        let info: DupInfo = this.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
        info.parseAwardIndex(msg)
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //祝福本领奖放回
    public parseBlessDupAwardMsg(msg: Message): void {
        let info: DupInfo = this.getDupInfolistByType(DUP_TYPE.DUP_ZHUFU)[0];
        info.parseAwardIndex(msg)
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    //组队副本返回
    public onJoinRoomSeccuss(): void {
        if (GameFight.getInstance().teamdupRoomDupId > 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TeamDupReadyPanel");
        }
    }
    /**********通用**********/
    //请求副本的信息
    public onRequestDupInofMsg(duptype: DUP_TYPE): void {
        var dupinfoReqMsg: Message = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
        dupinfoReqMsg.setByte(duptype);
        GameCommon.getInstance().sendMsgToServer(dupinfoReqMsg);
    }
    //返回当前副本的描述
    public getDupAwardDesc(dupid: number): string {
        var awardDesc: string = "";
        // var dupinfo: DupInfo = this.getDupInfoById(dupid);
        // switch (dupinfo.dupModel.type) {
        //     case DUP_TYPE.DUP_CAILIAO:
        //         var rewardObj: AwardItem = dupinfo.dupModel.reward[0];
        //         var awardmodel: ModelThing = GameCommon.getInstance().getThingModel(rewardObj.type, rewardObj.id);
        //         awardDesc = awardmodel.name;
        //         break;
        //     case DUP_TYPE.DUP_CHALLENGE:
        //         awardDesc = "银币、经验、橙装碎片";
        //         break;
        //     case DUP_TYPE.DUP_PERSONALLY:
        //         awardDesc = `装备、材料`;
        //         break;
        //     case DUP_TYPE.DUP_UNION:
        //         awardDesc = `坐骑装备、银币`;
        //         break;
        // }
        return awardDesc;
    }
    public getCurrChallengeID(): number {
        var dupinfo: DupInfo = this.getDupInfolistByType(DUP_TYPE.DUP_CHALLENGE)[0];
        if (!dupinfo) {
            return 0;
        }
        return dupinfo.pass - 1;
    }
    //获取副本的最大次数
    public getDupMaxTimesById(id: number): number {
        let model: Modelcopy = JsonModelManager.instance.getModelcopy()[28];
        let dupTimesParams: string[] = model.nums.split(";");
        let maxtimes: number = parseInt(dupTimesParams[DataManager.getInstance().playerManager.player.viplevel].split(",")[0]);
        maxtimes = !maxtimes ? 0 : (maxtimes < 0 ? 99999 : maxtimes);
        return maxtimes;
    }
    //vip组队副本的剩余蹭别人的次数
    public get vipteamLeftjoinTimes(): number {
        let maxtimes: number = this.getDupMaxTimesById(28);
        return Math.max(0, maxtimes - DataManager.getInstance().dupManager.vipTeamTimes);
    }
    /**------跨服PVE BOSS 相关------**/
    //向服务器请求BOSS基本信息
    public sendPVEBossInfoRequst(): void {
        let message: Message = new Message(MESSAGE_ID.CROSS_PVEBOSS_INFO_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    //向服务器请求伤害排行榜
    public sendPVEBossDmgRankRequst(id: number): void {
        let message: Message = new Message(MESSAGE_ID.CROSS_PVEBOSS_RANK_MESSAGE);
        message.setShort(id);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    //跨服BOSS信息
    public parseCrossPVEBossInfo(message: Message): void {
        this.crossPVEBoss.parseMsg(message);
        GameCommon.getInstance().receiveMsgToClient(message);
    }
    //跨服BOSS排行榜
    public parseCrossPVEBossRank(message: Message): void {
        this.crossPVEBoss.parseRankMsg(message);
        GameCommon.getInstance().receiveMsgToClient(message);
    }
    //跨服BOSS购买
    public parseCrossPVEBossBuy(message: Message): void {
        this.crossPVEBoss.parseBuyMsg(message);
        GameCommon.getInstance().receiveMsgToClient(message);
    }
    //The end
}