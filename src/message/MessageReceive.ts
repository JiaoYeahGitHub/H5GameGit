/**
 *
 * @author 
 *
 */
class MessageReceive {

    private gameWorld: GameWorld;

    public constructor(world: GameWorld) {
        this.gameWorld = world;
    }

    public receiveMessage(message: Message): void {
        var cmdID = message.getCmdId();
        switch (cmdID) {
            case MESSAGE_ID.GAME_TICK_MESSAGE:
                var success: boolean = message.getBoolean();
                if (!success) {
                    this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_4);
                }
                //  else {
                //     this.gameWorld.getGameScene().onInitNetTimeout();
                // }
                break;
            case MESSAGE_ID.GAME_LOGON_MESSAGE:
                this.gameWorld.dispatchEvent(new GameMessageEvent(MESSAGE_ID.GAME_LOGON_MESSAGE.toString(), message));
                break;
            case MESSAGE_ID.SELECT_SERVER_MESSAGE:
                this.gameWorld.dispatchEvent(new GameMessageEvent(MESSAGE_ID.SELECT_SERVER_MESSAGE.toString(), message));
                break;
            case MESSAGE_ID.LOGIN_SERVER_MESSAGE:
                let hasRole: boolean = message.getBoolean();
                if (hasRole) {
                    this.gameWorld.enterGame();
                } else {
                    this.gameWorld.createRole();
                    DataManager.getInstance().serverManager.isCreateRole = true;
                }
                break;
            case MESSAGE_ID.CREATE_ROLE_MESSAGE:
                this.gameWorld.enterGame();
                break;
            case MESSAGE_ID.ENTER_GAME_MESSAGE:
                this.gameWorld.loginRecord(DataManager.getInstance().playerManager.player);
                this.gameWorld.reciveEnterGameMsg();
                DataManager.getInstance().serverManager.onLoginSDKStatistics();
                break;
            case MESSAGE_ID.PLAYER_MESSAGE:
                DataManager.getInstance().playerManager.player.parsePlayerMessage(message);
                break;
            case MESSAGE_ID.PAIHANGBANG_ZAOYUBANG_MESSAGE://2803返回遭遇榜的信息
                DataManager.getInstance().topRankManager.topzaoyulistdate(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OFFLINE_EXP_REWARD:
                DataManager.getInstance().playerManager.parseOffLineExp(message);
                break;
            case MESSAGE_ID.PASS_SCENE_REWARD:
                DataManager.getInstance().playerManager.parsePassSceneUpdate(message);
                break;
            case MESSAGE_ID.RECEIVE_ONLINE_GIFT:
                DataManager.getInstance().playerManager.player.onlineGift = message.getByte();
                DataManager.getInstance().playerManager.player.onlineGiftTime = message.getInt();
                DataManager.getInstance().playerManager.player.onlineGiftTimeStamp = egret.getTimer();
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
                break;
            case MESSAGE_ID.GAME_FIGHT_START_MSG:
                this.gameWorld.dispatchEvent(new GameMessageEvent(message.getCmdId().toString(), message));
                break;
            case MESSAGE_ID.GAME_FIGHT_RESULT_MSG:
                this.gameWorld.dispatchEvent(new GameMessageEvent(message.getCmdId().toString(), message));
                break;
            case MESSAGE_ID.OPEN_PLAYER_MESSAGE:
                DataManager.getInstance().playerManager.parseOpenRole(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE:
                DataManager.getInstance().playerManager.parsePlayerHead(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseHeadUp(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE:
                DataManager.getInstance().playerManager.player.name = message.getString();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OPT_PLAYER_HEAD_FRAME_CHANGE_MESSAGE:
                DataManager.getInstance().playerManager.parsePlayerHeadFrame(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OPT_PLAYER_HEAD_FRAME_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseHeadFrameUp(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_CURRENCY_UPDATE:
                DataManager.getInstance().playerManager.parseCurrencyMsg(message);
                break;
            case MESSAGE_ID.PLAYER_EXP_UPDATE:
                DataManager.getInstance().playerManager.parseExp(message);
                break;
            case MESSAGE_ID.OFFLINE_EXP_SHARE_COMPLETE:
                DataManager.getInstance().playerManager.parseOffLineAwardMsg(message);
                break;
            case MESSAGE_ID.REPEAT_LOGIN_MESSAGE:
                this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_2);
                break;
            case MESSAGE_ID.LOGIN_BAN_MESSAGE:
                this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_6);
                break;
            case MESSAGE_ID.GOODS_LIST_MESSAGE:
                DataManager.getInstance().bagManager.parseInitBag(message);
                break;
            case MESSAGE_ID.GOODS_LIST_ADD_MESSAGE:
                DataManager.getInstance().bagManager.parseAddBag(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GOODS_LIST_USE_MESSAGE:
                DataManager.getInstance().bagManager.praseRemoveBag(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE:
                DataManager.getInstance().playerManager.parseClothEquip(message);
                break;
            case MESSAGE_ID.GOODS_ARTIFACT_EQUIP_MESSAGE:
                DataManager.getInstance().playerManager.parseArtifactEquip(message);
                DataManager.getInstance().playerManager.player.updataAttribute();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FUNCTION_REWARD_MESSAGE:
                DataManager.getInstance().playerManager.parseFuncAwardedMsg(message);
                break;
            case MESSAGE_ID.WXGAME_INVITE_FRIEND_MSG:
                DataManager.getInstance().wxgameManager.parseInviteFriendMsg(message);
                break;
            case MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE:
                DataManager.getInstance().wxgameManager.parseShareAwdLevelMsg(message);
                break;
            // case MESSAGE_ID.WXGAME_SHARE_WEEKEND_MESSAGE:
            //     DataManager.getInstance().wxgameManager.onParseWeekendShareMsg(message);
            //     break;
            case MESSAGE_ID.XYX_IOS_CHARGE_MESSAGE:
                GameCommon.getInstance().addAlert('支付成功');
                let amount: number = message.getShort();
                let bill_no: string = message.getString();
                let payInfo: IPayInfo = {
                    goodsName: `IOS充值${amount}`,
                    amount: amount,
                    playerInfo: DataManager.getInstance().playerManager.player
                }
                SDKManager.onPaySuccess(payInfo, bill_no);
                break;
            case MESSAGE_ID.XYX_COLLECTION_MESSAGE:
                DataManager.getInstance().wxgameManager.parseCollectionAwardMsg(message);
                break;
            // case MESSAGE_ID.USE_HORSE_ORDER_MESSAGE: //306使用坐骑副本令
            //     var addNum: number = message.getByte();
            //     var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoById(1);
            //     if (dupinfo) {
            //         dupinfo.sweepNum += addNum;
            //     }
            //     PromptPanel.getInstance().addPromptError("您已增加挑战坐骑副本" + addNum + "次");
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.DUP_REDPOINT_TRIGGER));
            //     break;
            // case MESSAGE_ID.USE_WEAPON_ORDER_MESSAGE: //307使用神兵副本令
            //     var addNum: number = message.getByte();
            //     var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoById(2);
            //     if (dupinfo) {
            //         dupinfo.sweepNum += addNum;
            //     }
            //     PromptPanel.getInstance().addPromptError("您已增加挑战神兵副本" + addNum + "次");
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.DUP_REDPOINT_TRIGGER));
            //     break;
            // case MESSAGE_ID.USE_CLOTHES_ORDER_MESSAGE: //308使用神装副本令
            //     var addNum: number = message.getByte();
            //     var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoById(3);
            //     if (dupinfo) {
            //         dupinfo.sweepNum += addNum;
            //     }
            //     PromptPanel.getInstance().addPromptError("您已增加挑战神装副本" + addNum + "次");
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.DUP_REDPOINT_TRIGGER));
            //     break;
            // case MESSAGE_ID.USE_WING_ORDER_MESSAGE: //309使用仙羽副本令
            //     var addNum: number = message.getByte();
            //     var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoById(4);
            //     if (dupinfo) {
            //         dupinfo.sweepNum += addNum;
            //     }
            //     PromptPanel.getInstance().addPromptError("您已增加挑战仙羽副本" + addNum + "次");
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.DUP_REDPOINT_TRIGGER));
            //     break;
            // case MESSAGE_ID.USE_MAGIC_ORDER_MESSAGE: //310使用法宝副本令
            //     var addNum: number = message.getByte();
            //     var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoById(5);
            //     if (dupinfo) {
            //         dupinfo.sweepNum += addNum;
            //     }
            //     PromptPanel.getInstance().addPromptError("您已增加挑战法宝副本" + addNum + "次");
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.DUP_REDPOINT_TRIGGER));
            //     break;
            case MESSAGE_ID.USE_LADDER_ORDER_MESSAGE: //311使用天梯挑战令
                var addNum: number = message.getByte();
                DataManager.getInstance().arenaManager.ladderArenaData.fightCount += addNum;
                PromptPanel.getInstance().addPromptError("您已增加挑战天梯" + addNum + "次");
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.LADDER, "ladder"));
                break;
            case MESSAGE_ID.USE_EXPLORE_ORDER_MESSAGE: //312使用探索令
                var addNum: number = message.getByte();
                DataManager.getInstance().dupManager.explorebossInfo.lifeNum += addNum;
                PromptPanel.getInstance().addPromptError("您已增加探索" + addNum + "次");
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.EXPLORE, "explore"));
                break;
            case MESSAGE_ID.USE_ESCORT_PASS_ORDER_MESSAGE: //313使用渡魂通行令
                var addNum: number = message.getByte();
                DataManager.getInstance().escortManager.escort.count -= addNum;
                PromptPanel.getInstance().addPromptError("您已增加渡魂" + addNum + "次");
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.YUANSHEN, "psych"));
                break;
            case MESSAGE_ID.USE_ESCORT_ROB_ORDER_MESSAGE: //314使用渡魂抢夺令
                var addNum: number = message.getByte();
                DataManager.getInstance().escortManager.escort.rob -= addNum;
                PromptPanel.getInstance().addPromptError("您已增加渡魂劫杀" + addNum + "次");
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.YUANSHEN, "psych"));
                break;
            case MESSAGE_ID.USE_BOSS_DEKARON_ORDER_MESSAGE: //315使用Boss挑战令
                var addNum: number = message.getByte();
                DataManager.getInstance().dupManager.worldbossEnjoyNum += addNum;
                PromptPanel.getInstance().addPromptError("您已增加Boss挑战" + addNum + "次");
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.EXPLORE, "explore"));
                break;
            case MESSAGE_ID.GOODS_LIMIT_LIST_MESSAGE: //316限时物品列表
                DataManager.getInstance().timeGoodsManager.parseTimeGoodsList(message);
                break;
            case MESSAGE_ID.GOODS_LIMIT_ADD_MESSAGE: //317添加限时物品
                DataManager.getInstance().timeGoodsManager.parseTimeGoods(message);
                break;
            case MESSAGE_ID.USE_ARENA_ORDER_MESSAGE: //318使用竞技令
                var addNum: number = message.getByte();
                DataManager.getInstance().arenaManager.arenaData.fightCount -= addNum;
                PromptPanel.getInstance().addPromptError("您已增加竞技场挑战" + addNum + "次");
                GameCommon.getInstance().receiveMsgToClient(new Message(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE));
                break;
            case MESSAGE_ID.FOURINAGE_UPLEVEL_MESSAGE:
                DataManager.getInstance().playerManager.player.updateFourinageLevel(message);
                break;
            case MESSAGE_ID.FOURINAGE_UPUPGRADE_MESSAGE:
                DataManager.getInstance().playerManager.player.updateFourinageGrade(message);
                break;
            case MESSAGE_ID.TITLE_LIST_MESSAGE:
                DataManager.getInstance().titleManager.parseList(message);
                break;
            case MESSAGE_ID.TITLE_WEAR_MESSAGE:
                DataManager.getInstance().titleManager.parseWear(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TITLE_JIHUO_MESSAGE:
                DataManager.getInstance().playerManager.player.onParseTitle(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TUJIAN_MESSAGE:
                DataManager.getInstance().playerManager.player.parsrTujian(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.XINFA_TUJIAN_MESSAGE:
                DataManager.getInstance().playerManager.player.updateXinfa(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GAME_FIGHT_DUP_ENTER:
                this.gameWorld.dispatchEvent(new GameMessageEvent(message.getCmdId().toString(), message));
                break;
            case MESSAGE_ID.GAME_FIGHT_DUP_RESULT:
                this.gameWorld.dispatchEvent(new GameMessageEvent(message.getCmdId().toString(), message));
                break;
            case MESSAGE_ID.GAME_DUP_INFO_MESSAGE:
                DataManager.getInstance().dupManager.parseDupinfo(message);
                break;
            case MESSAGE_ID.GAME_DUP_BUYNUM_MESSAGE:
            case MESSAGE_ID.GAME_DUP_SWEEP_MESSAGE:
                DataManager.getInstance().dupManager.parseDupSweepNum(message);
                break;
            case MESSAGE_ID.GAME_SIXIANG_PROGRESS_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GAME_SIXIANG_REWARD_MSG:
                DataManager.getInstance().dupManager.parseFourinageAwardMsg(message);
                break;
            case MESSAGE_ID.GAME_BLESSDUP_REWARD_MSG:
                DataManager.getInstance().dupManager.parseBlessDupAwardMsg(message);
                break;
            case MESSAGE_ID.ERROR_TIP_MESSAGE:
                // this.gameWorld.onHideFakerLoadBar();
                GameCommon.getInstance().addHintBar(message);
                break;
            case MESSAGE_ID.SKILL_UP_MESSAGE:       //技能升级
                DataManager.getInstance().playerManager.player.parseSkillUp(message);
                break;
            case MESSAGE_ID.SKILLENCHANT_CLOTH_MESSAGE:
                DataManager.getInstance().skillEnhantM.parseSkinMsg(message);
                break;
            case MESSAGE_ID.SKILLENCHANT_UPGRADE_MESSAGE:
                DataManager.getInstance().skillEnhantM.parseGradeMsg(message);
                break;
            case MESSAGE_ID.SKILLENCHANT_LEVELUP_MESSAGE:
                DataManager.getInstance().skillEnhantM.parseLevelMsg(message);
                break;
            case MESSAGE_ID.GONGFA_DATE_MESSAGE:       //功法信息  暂时弃用
                // DataManager.getInstance().playerManager.player.onParseGongfaUpdate(message);
                // GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SKILL_UP_AUTO_MESSAGE:  //一键技能升级
                DataManager.getInstance().playerManager.player.parseSkillUpAuto(message);
                break;
            case MESSAGE_ID.SKILL_UPGRADE_MESSAGE:
                DataManager.getInstance().playerManager.player.updateGradeSkill(message);
                break;
            case MESSAGE_ID.BLESS_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessInfo(message);
                break;
            case MESSAGE_ID.BLESS_EQUIP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessEquip(message);
                break;
            case MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessEquipSlot(message);
                break;
            case MESSAGE_ID.BLESS_UP_SKILL_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessSkill(message);
                break;
            case MESSAGE_ID.BLESS_UP_DAN_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessDan(message);
                break;
            case MESSAGE_ID.BLESS_WAKE_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseBlessJuexing(message);
                break;
            // case MESSAGE_ID.BLESS_HORSE_UP_MESSAGE://战骑升阶
            //     var level: number = DataManager.getInstance().playerManager.player.horseLevel;
            //     DataManager.getInstance().playerManager.player.praseHorse(message);
            //     var blessValue: number = message.getShort();
            //     DataManager.getInstance().blessManager.horseBlessTime = message.getInt();
            //     DataManager.getInstance().blessManager.horseTimeStamp = egret.getTimer();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     if (blessValue > 0) {
            //         PromptPanel.getInstance().addPromptFun(TextDefine.BLESS_VALUE + TextDefine.ADD + blessValue);
            //     } else if (DataManager.getInstance().playerManager.player.horseLevel > level) {
            //         PromptPanel.getInstance().addPromptFun("坐骑升阶");
            //     }
            //     break;
            // case MESSAGE_ID.BLESS_WEAPON_UP_MESSAGE://神兵升阶
            //     var level: number = DataManager.getInstance().playerManager.player.weaponLevel;
            //     DataManager.getInstance().playerManager.player.praseWeapon(message);
            //     var blessValue: number = message.getShort();
            //     DataManager.getInstance().blessManager.weaponBlessTime = message.getInt();
            //     DataManager.getInstance().blessManager.weaponTimeStamp = egret.getTimer();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     if (blessValue > 0) {
            //         PromptPanel.getInstance().addPromptFun(TextDefine.BLESS_VALUE + TextDefine.ADD + blessValue);
            //     } else if (DataManager.getInstance().playerManager.player.weaponLevel > level) {
            //         PromptPanel.getInstance().addPromptFun("神兵升阶");
            //     }
            //     break;
            // case MESSAGE_ID.BLESS_WING_UP_MESSAGE://仙羽升阶
            //     var level: number = DataManager.getInstance().playerManager.player.wingLevel;
            //     DataManager.getInstance().playerManager.player.praseWing(message);
            //     var blessValue: number = message.getShort();
            //     DataManager.getInstance().blessManager.wingBlessTime = message.getInt();
            //     DataManager.getInstance().blessManager.wingTimeStamp = egret.getTimer();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     if (blessValue > 0) {
            //         PromptPanel.getInstance().addPromptFun(TextDefine.BLESS_VALUE + TextDefine.ADD + blessValue);
            //     } else if (DataManager.getInstance().playerManager.player.wingLevel > level) {
            //         PromptPanel.getInstance().addPromptFun("仙羽升阶");
            //     }
            //     break;
            // case MESSAGE_ID.BLESS_CLOTHES_UP_MESSAGE://神装升阶
            //     var level: number = DataManager.getInstance().playerManager.player.clothesLevel;
            //     DataManager.getInstance().playerManager.player.praseClothes(message);
            //     var blessValue: number = message.getShort();
            //     DataManager.getInstance().blessManager.clothesBlessTime = message.getInt();
            //     DataManager.getInstance().blessManager.clothesTimeStamp = egret.getTimer();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     if (blessValue > 0) {
            //         PromptPanel.getInstance().addPromptFun(TextDefine.BLESS_VALUE + TextDefine.ADD + blessValue);
            //     } else if (DataManager.getInstance().playerManager.player.clothesLevel > level) {
            //         PromptPanel.getInstance().addPromptFun("神装升阶");
            //     }
            //     break;
            // case MESSAGE_ID.BLESS_MAGIC_UP_MESSAGE://法宝升阶
            //     var level: number = DataManager.getInstance().playerManager.player.magicLevel;
            //     DataManager.getInstance().playerManager.player.praseMagic(message);
            //     var blessValue: number = message.getShort();
            //     DataManager.getInstance().blessManager.magicBlessTime = message.getInt();
            //     DataManager.getInstance().blessManager.magicTimeStamp = egret.getTimer();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     if (blessValue > 0) {
            //         PromptPanel.getInstance().addPromptFun(TextDefine.BLESS_VALUE + TextDefine.ADD + blessValue);
            //     } else if (DataManager.getInstance().playerManager.player.magicLevel > level) {
            //         PromptPanel.getInstance().addPromptFun("法宝升阶");
            //     }
            //     break;
            // case MESSAGE_ID.BLESS_HORSE_GROW_MESSAGE://坐骑成长丹
            //     DataManager.getInstance().playerManager.player.data.horseGrow = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_HORSE_APTITUDE_MESSAGE://坐骑资质丹
            //     DataManager.getInstance().playerManager.player.data.horseAptitude = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_WEAPON_GROW_MESSAGE://神兵成长丹
            //     DataManager.getInstance().playerManager.player.data.weaponGrow = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_WEAPON_APTITUDE_MESSAGE://神兵资质丹
            //     DataManager.getInstance().playerManager.player.data.weaponAptitude = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_CLOTHES_GROW_MESSAGE://神装成长丹
            //     DataManager.getInstance().playerManager.player.data.clothesGrow = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_CLOTHES_APTITUDE_MESSAGE://神装资质丹
            //     DataManager.getInstance().playerManager.player.data.clothesAptitude = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_WING_GROW_MESSAGE://仙羽成长丹
            //     DataManager.getInstance().playerManager.player.data.wingGrow = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_WING_APTITUDE_MESSAGE://仙羽资质丹
            //     DataManager.getInstance().playerManager.player.data.wingAptitude = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_MAGIC_GROW_MESSAGE://法宝成长丹
            //     DataManager.getInstance().playerManager.player.data.magicGrow = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_MAGIC_APTITUDE_MESSAGE://法宝资质丹
            //     DataManager.getInstance().playerManager.player.data.magicAptitude = message.getShort();
            //     GameCommon.getInstance().receiveMsgToClient(message, level);
            //     DataManager.getInstance().playerManager.player.data.onUpdateAttributes();
            //     break;
            // case MESSAGE_ID.BLESS_COUNT_DOWN_MESSAGE://祝福值倒计时
            //     DataManager.getInstance().blessManager.parseCountDownMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            case MESSAGE_ID.HUANHUA_ACTIVATE_MESSMAGE:
                var huanhuaID: number = message.getByte();
                DataManager.getInstance().playerManager.player.updateHuanhuaInfo(huanhuaID);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.HUANHUA_CHANGE_MESSAGE:
                // DataManager.getInstance().playerManager.player.updateHuanhuaAvata(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SHENTONG_INIT_BAG_MESSAGE:
                DataManager.getInstance().shentongManager.onParseInitBagMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_LOTTERY_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SHENTONG_ADD_MESSAGE:
                DataManager.getInstance().shentongManager.onParseAddBagMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_REMOVE_MESSAGE:
                DataManager.getInstance().shentongManager.onParseRemoveBagMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_INIT_SLOT_MESSAGE:
                DataManager.getInstance().shentongManager.onParseInitSlotMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_LEARN_MESSAGE:
                DataManager.getInstance().shentongManager.onParseUpdateSlotMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_UPLEVEL_MESSAGE:
                DataManager.getInstance().shentongManager.parseLevelUpMsg(message);
                break;
            case MESSAGE_ID.SHENTONG_UPGRADE_MESSAGE:
                DataManager.getInstance().shentongManager.parseUpgradeMsg(message);
                break;
            case MESSAGE_ID.PLAYER_INFUSE_SOUL_MESSAGE://注灵
                DataManager.getInstance().playerManager.player.parseInfuseSoul(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_ZHUHUN_MESSAGE://铸魂
                DataManager.getInstance().playerManager.player.parseZhunHun(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_INTENSIFY_MESSAGE://强化
                DataManager.getInstance().playerManager.player.parseIntensify(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_SMELT_SPECIAL_MESSAGE://熔炼
                // DataManager.getInstance().playerManager.player.parseSmelt(message);
                DataManager.getInstance().bagManager.parseUpdateBag(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_SMELT_COMMON_MESSAGE://普通装备熔炼
                DataManager.getInstance().bagManager.parseUpdateBag(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;

            case MESSAGE_ID.PLAYER_LEGEND_ACTIVATE_MESSAGE://神器激活
                DataManager.getInstance().playerManager.player.parseLegendActivate(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_LEGEND_UPGRADE_MESSAGE://神器升级
                DataManager.getInstance().playerManager.player.parseLegendUpdate(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE://经脉升级
                DataManager.getInstance().playerManager.player.parsePulseUpdate(message);
                GameCommon.getInstance().receiveMsgToClient(message, param);

                break;
            case MESSAGE_ID.PLAYER_QIHUN_UPGRADE_MESSAGE://器魂升级
                DataManager.getInstance().playerManager.player.parseQihun(message);
                GameCommon.getInstance().receiveMsgToClient(message, param);
                break;
            case MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE://更新天梯竞技场数据
                DataManager.getInstance().arenaManager.parseLadderAreneMsg(message);
                break;
            case MESSAGE_ID.ARENE_LADDERARENE_FIGHT_MESSAGE://返回请求天梯竞技场
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_LADDERARENE_RESULT_MESSAGE://返回天梯竞技场结果
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_LADDERARENE_RANK_MESSAGE:
                DataManager.getInstance().arenaManager.parseLadderRankUpdate(message);
                break;
            case MESSAGE_ID.ARENE_LADDERARENE_INSPIRE_MESSAGE:
                DataManager.getInstance().arenaManager.parseInspire(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_INFO_UPDATE_MESSAGE:
                DataManager.getInstance().arenaManager.parseArenaMsg(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_REFRESH_ENEMYLIST_MESSAGE:
                DataManager.getInstance().arenaManager.parseArenaEnemyMsg(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_FIGHT_ENTER_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_WORSHIP_MESSAGE:
                DataManager.getInstance().arenaManager.isWorship = message.getBoolean();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_RANK_UPDATE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_RANK_HISTROY_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_CROSS_BUY_FIGHTCOUNT_MESSAGE:
                DataManager.getInstance().arenaManager.parseArenaBuyMsg(message);
                break;
            case MESSAGE_ID.ARENE_INFO_UPDATE_MESSAGE:
                DataManager.getInstance().localArenaManager.parseArenaMsg(message);
                break;
            case MESSAGE_ID.ARENE_REFRESH_ENEMYLIST_MESSAGE:
                DataManager.getInstance().localArenaManager.parseArenaEnemyMsg(message);
                break;
            case MESSAGE_ID.ARENE_FIGHT_ENTER_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_RANK_UPDATE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_RANK_HISTROY_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_FIGHT_RESULT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARENE_BUY_FIGHTCOUNT_MESSAGE:
                DataManager.getInstance().localArenaManager.parseArenaBuyMsg(message);
                break;
            case MESSAGE_ID.ARENA_BATTLE_SWEEP:
                DataManager.getInstance().localArenaManager.parseArenaFightMsg(message);
                break;
            case MESSAGE_ID.ARENE_FIRST_AWARD_MESSAGE:
                DataManager.getInstance().localArenaManager.parseFirstAwardMsg(message);
                break;
            case MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE://购买商品
                var param = message.getByte();
                GameCommon.getInstance().receiveMsgToClient(message, param);
                break;
            case MESSAGE_ID.TASK_CHAIN_UPDATE_MESSAGE:
                DataManager.getInstance().taskManager.parseTaskChainMsg(message);
                break;
            case MESSAGE_ID.TASK_DAILY_INIT_MESSAGE:
                DataManager.getInstance().taskManager.parseTaskDailyInitMsg(message);
                break;
            case MESSAGE_ID.TASK_DAILY_UPDATE_MESSAGE:
                DataManager.getInstance().taskManager.parseTaskDailyUpdateMsg(message);
                break;
            case MESSAGE_ID.JIANCHI_INFO_UPDATE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseJianchiUpdate(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.XYX_SHARE_EXP_MESSAGE:
                DataManager.getInstance().playerManager.parseTianshiAwardMsg(message);
                break;
            case MESSAGE_ID.XYX_SHARE_MASTER_MESSAGE:
                DataManager.getInstance().playerManager.parseTianshiActivateMsg(message);
                break;
            case MESSAGE_ID.SHARE_INFO_MESSAGE:
                DataManager.getInstance().functionManager.parseShareInfo(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FOCUS_REWARD_MESSAGE:
                DataManager.getInstance().functionManager.parseFocusInfo(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAIL_MESSAGE://获取邮件
                DataManager.getInstance().mailManager.parseMail(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAIL_READ_MESSAGE://读取邮件
                DataManager.getInstance().mailManager.parseMailRead(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_MESSAGE://获取单个附件
                DataManager.getInstance().mailManager.parseMailAccessory(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAIL_GET_ACCESSORY_ALL_MESSAGE://获取全部附件
                DataManager.getInstance().mailManager.parseMailAccessoryAll(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAIL_NEW_MESSAGE://新邮件
                DataManager.getInstance().mailManager.parseMailNew(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_CHAT_RECEIVE_MESSAGE://接受聊天信息
                DataManager.getInstance().chatManager.parseChatRecord(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE://发送聊天信息
                DataManager.getInstance().chatManager.parseChatNew(message);
                break;
            case MESSAGE_ID.PLAYER_BROADCAST_MESSAGE://广播信息
                var channel = message.getByte();  //广播频道
                DataManager.getInstance().broadcastManager.parseBroadcast(message, channel);
                GameCommon.getInstance().receiveMsgToClient(message, channel);
                break;
            case MESSAGE_ID.XUEZHAN_INIT_MESSAGE:
                DataManager.getInstance().dupManager.parseXuezhanInitMsg(message);
                break;
            case MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.XUEZHAN_RESULT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.XUEZHAN_BUFF_MESSAGE:
                DataManager.getInstance().dupManager.parseXuezhanBuffMsg(message);
                break;
            case MESSAGE_ID.XUEZHAN_REWARD_MESSAGE:
                DataManager.getInstance().dupManager.parseXuezhanRewardMsg(message);
                break;
            case MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE:
                DataManager.getInstance().dupManager.parseXuezhanSaodangMsg(message);
                break;
            case MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG:
                DataManager.getInstance().dupManager.parseXuezhanBossInfoMsg(message);
                break;
            case MESSAGE_ID.VIPBOSS_LISTINFO_MSG:
                DataManager.getInstance().dupManager.parseVipBossInfoMsg(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_BOSS_LISTINFO_MSG:
                DataManager.getInstance().dupManager.parseAllPeopleBossMsg(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_REBORN_NOTICE_MSG:
                DataManager.getInstance().dupManager.onRemindAllPeopleBoss(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_DEAD_MSG:
                DataManager.getInstance().dupManager.onAllPeopleBossDead(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_FT_MSG:
                DataManager.getInstance().dupManager.onAllPeopleBossFT(message);
                break;
            case MESSAGE_ID.XUEZHANBOSS_REBORN_NOTICE_MSG:
                DataManager.getInstance().dupManager.onRemindXuezhanBoss(message);
                break;
            case MESSAGE_ID.VIPBOSS_REBORN_NOTICE_MSG:
                DataManager.getInstance().dupManager.onRemindVIPBoss(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_OTHERBODY_MSG:
            case MESSAGE_ID.XUEZHANBOSS_OTHERBODY_MSG:
            case MESSAGE_ID.VIPBOSS_OTHERBODY_MSG:
            case MESSAGE_ID.BOSS_PILL_APPEAR_MESSAGE:
                DataManager.getInstance().dupManager.parseAllPeopleOtherFightMsg(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_BOSS_ENTER_MSG:
            case MESSAGE_ID.ALLPEOPLE_FIGHT_UPDATE_MSG:
            case MESSAGE_ID.ALLPEOPLE_RANK_INFO_MSG:
            case MESSAGE_ID.ALLPEOPLE_BOSS_RESULT_MSG:
            case MESSAGE_ID.XUEZHANBOSS_ENTER_MSG:
            case MESSAGE_ID.XUEZHANBOSS_FIGHT_UPDATE_MSG:
            case MESSAGE_ID.XUEZHANBOSS_RANK_INFO_MSG:
            case MESSAGE_ID.XUEZHANBOSS_RESULT_MSG:
            case MESSAGE_ID.ALLPEOPLE_PK_MESSAGE:
            case MESSAGE_ID.ALLPEOPLE_PVP_REVIVE:
            case MESSAGE_ID.XUEZHANBOSS_OTHERPK_MSG:
            case MESSAGE_ID.XUEZHANBOSS_REBORN_MSG:
            case MESSAGE_ID.VIPBOSS_ENTER_MSG:
            case MESSAGE_ID.VIPBOSS_FIGHT_UPDATE_MSG:
            case MESSAGE_ID.VIPBOSS_RANK_INFO_MSG:
            case MESSAGE_ID.VIPBOSS_RESULT_MSG:
            case MESSAGE_ID.VIPBOSS_OTHERPK_MSG:
            case MESSAGE_ID.VIPBOSS_REBORN_MSG:
            case MESSAGE_ID.BOSS_PILL_START_MESSAGE:
            case MESSAGE_ID.BOSS_PILL_REWARD_MESSAGE:
            case MESSAGE_ID.BOSS_PILL_FIGHT_MESSAGE:
            case MESSAGE_ID.BOSS_PILL_TOP_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ALLPEOPLE_SET_REMIND_MSG:
                DataManager.getInstance().dupManager.parseAllPeopleRemindMsg(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_LISTINFO_MSG:
                DataManager.getInstance().dupManager.parseSamsareBossInfoMsg(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_FIGHT_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_ENTER_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_TARGET_MSG:
                GameFight.getInstance().samsaraTargetMsg = message;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_RANK_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_OTHERBODY_MSG:
                DataManager.getInstance().dupManager.parseSamsaraBossOhterFightMsg(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_KILLLOG_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TEAMDUP_CREATETEAM_MESSAGE:
                DataManager.getInstance().dupManager.onJoinRoomSeccuss();
                break;
            case MESSAGE_ID.TEAMDUP_JOINTEAM_MESSAGE:
                DataManager.getInstance().dupManager.onJoinRoomSeccuss();
                break;
            case MESSAGE_ID.TEAMDUP_LEAVETEAM_MESSAGE:
                GameFight.getInstance().isteamdupReady = false;
                break;
            case MESSAGE_ID.TEAMDUP_READYINFO_MESSAGE:
            case MESSAGE_ID.TEAMDUP_TEAMDAMAGE_MESSAGE:
            case MESSAGE_ID.TEAMDUP_DROPGOODS_MESSAGE:
            case MESSAGE_ID.TEAMDUP_QUITSCENE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YEWAIPVP_FIGHTTER_INFO_MSG:
                DataManager.getInstance().yewaipvpManager.onParsePVPOhterInfoMsg(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_REBORN_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_OTHERLEAVE_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SAMSARA_BOSS_REMIND_MSG:
                DataManager.getInstance().dupManager.onRemindSamsaraBoss();
                break;
            case MESSAGE_ID.YEWAIPVP_FIGHT_LOG_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YEWAIPVP_FIGHT_PK_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YEWAIPVP_FIHGT_RESULT_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_BOSS_INIT:
                DataManager.getInstance().dupManager.parseWorldBossInfo(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_BOSS_FIGHTENTER:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_BOSS_FIGHTRESULT:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_BOSS_RANK:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_LIFE_MSG:
                DataManager.getInstance().dupManager.parseExploreInfo(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_ENTER_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_EXPLORETASK_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_FINISH_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EXPLOREBOSS_LEAVE_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_PSYCH_UPGRADE_MESSAGE://元神升级
                DataManager.getInstance().playerManager.player.onParsePsychEquip(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_PSYCH_EQUIP_MESSAGE://元神装备
                DataManager.getInstance().playerManager.player.onParsePsychEquip(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_PSYCH_GAIN_MESSAGE://元神获得
                DataManager.getInstance().psychManager.parsePsychGain(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_PSYCH_DECOMPOSE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_DETAIL_MESSAGE://押镖数据详情
                DataManager.getInstance().escortManager.parseEscort(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_DISPATCH_MESSAGE://镖车押运
                DataManager.getInstance().escortManager.parseDispatchMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_ROB_MESSAGE://镖车劫杀
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_REVENGE_MESSAGE://复仇
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_REVENGE_RESULT_MESSAGE://复仇返回
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_REFRESH_QUALITY_MESSAGE://镖车刷星
                DataManager.getInstance().escortManager.parseRefreshQualityMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_ROBLIST_MESSAGE://劫镖车队列表
                DataManager.getInstance().escortManager.parseRobListMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE://镖车劫杀返回
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_ESCORT_DONE://运镖结束
                DataManager.getInstance().escortManager.parseAward(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_ESCORT_RECORD://渡魂日志
                DataManager.getInstance().escortManager.parseRecord(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_REDPOINT_MESSAGE://渡魂日志红点
                DataManager.getInstance().escortManager.parseRedPoint(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE://渡劫奖励领取
                DataManager.getInstance().escortManager.parseReceiveAward(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;

            case MESSAGE_ID.ORANGE_RES_MESSAGE://橙装分解
            case MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE: //金装分解
                DataManager.getInstance().bagManager.parseUpdateMasterBag(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GEM_LOTTERY_MESSAGE:
                DataManager.getInstance().forgeManager.onParseGemLottery(message);
                break;
            case MESSAGE_ID.GEM_LOTTERY_LOGS_MESSAGE:
                DataManager.getInstance().forgeManager.onParseLotteryLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            /**********************公会相关****************************/
            case MESSAGE_ID.UNION_INFO_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionInfoMsg(message);
                break;
            case MESSAGE_ID.UNION_LIST_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionListMsg(message);
                break;
            case MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionMemberMsg(message);
                break;
            case MESSAGE_ID.UNION_CHANGE_XUYAN_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionXuanyanMsg(message);
                break;
            case MESSAGE_ID.UNION_CHANGE_NOTICE_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionNoticeMsg(message);
                break;
            case MESSAGE_ID.UNION_CHANGE_LVLIMIT_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionLevelLimitMsg(message);
                break;
            case MESSAGE_ID.UNION_CHANGE_AUTOADOPT_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionAutoAdoptMsg(message);
                break;
            case MESSAGE_ID.UNION_QUIT_MESSAGE:
                DataManager.getInstance().unionManager.onDestroyUnionInfo();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_REVIEW_OPERATION_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_REVIEW_AGREE_ALL:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MYSTERIOUS_BOSS_INFO:
                DataManager.getInstance().unionManager.parseSummonMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MYSTERIOUS_BOSS_FIGHT_INFO:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_MYSTERIOUS_TARGET_MESSAGE:
                GameFight.getInstance().mysteriousTargetMsg = message;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_MYSTERIOUS_TOP_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_MYSTERIOUS_REVIVE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_MYSTERIOUS_QUIT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_MYSTERIOUS_HISTORY_TOP_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MYSTERIOUS_BOSS_OTHERBODY_MSG:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_TRIBUTE_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionTribute(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_POSTION_MESSAGE:
                DataManager.getInstance().unionManager.parsePostionUpdateMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE:
                DataManager.getInstance().unionManager.parseDeleteMember(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_REVIEW_LIST_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_TURNPLATE_FILT_MESSAGE://1119转盘抽奖
                DataManager.getInstance().unionManager.parseRunALotteryMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            /** 一剑江湖武坛  已弃用 **/
            // case MESSAGE_ID.THRONE_INFO_MESSAGE://武坛信息返回
            //     DataManager.getInstance().throneManager.parseMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.THRONE_OCCUPY_INFO_MESSAGE://武坛争霸信息
            //     DataManager.getInstance().throneManager.parseOccupyMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.THRONE_OCCUPY_PK_MESSAGE://武坛PK请求信息
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.THRONE_OCCUPY_PK_RESULT_MESSAGE://武坛PK结果信息
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.THRONE_OCCUPY_LEAVE_MESSAGE://武坛离开
            //     DataManager.getInstance().throneManager.parseMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.THRONE_OCCUPY_OBTAIN_MESSAGE://武坛领取
            //     DataManager.getInstance().throneManager.parseObtainMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.UNION_SKILL_UPGRADE_MESSAGE:
            //     DataManager.getInstance().unionManager.parseUpdateUnionSkill(message);
            //     break;
            case MESSAGE_ID.UNION_SKILL2_UPGRADE_MESSAGE:
                DataManager.getInstance().unionManager.parseUpdateUnionSkill2(message);
                break;
            // case MESSAGE_ID.UNION_SKILL_UPDATE_MESSAGE:
            //     DataManager.getInstance().unionManager.parseInitUnionSkill(message);
            //     break;
            case MESSAGE_ID.UNION_LOG_MESSAGE:
                DataManager.getInstance().unionManager.parseUnionLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionPrizeRecord(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_TASK_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionTaskMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_TASK_UPDATE_MESSAGE:
                DataManager.getInstance().unionManager.onParseTaskUpdateMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BOSS_INFO_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionBossInfo(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_DUP_REWARD_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_DUP_RANK_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_DUP_ZHUWEI_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BOSS_LIST_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionBossList(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BOSS_FIGHT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BOSS_RESUTL_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionGroupInfoMsg(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_ENJOIN_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_FIGHT_MESSAGE:
                GameFight.getInstance().unionbattlePkMsg = message;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_FIGHTRESULT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_ALLOT_MESSAGE:
                var state: number = message.getByte();
                if (state == 1) {
                    GameCommon.getInstance().addAlert("分配成功");
                }
                // DataManager.getInstance().unionManager.unionMemberWarehouse(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionDepotMsg(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_RANK_MESSAGE:
                DataManager.getInstance().unionManager.onParseUnionBattleRankMsg(message);
                break;
            case MESSAGE_ID.UNION_BATTLE_BUYBUFF_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.UPDATE_BAG_UPPERLIMIT:
                DataManager.getInstance().bagManager.parseUpperlimit(message);
                // DataManager.getInstance().psychManager.parseUpperlimit(message);
                break;
            case MESSAGE_ID.UPDATA_BAG_USELIMIT:
                DataManager.getInstance().playerManager.player.remainExchageVigourTime = message.getByte();
                DataManager.getInstance().bagManager.parseUselimit(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GEM_INLAY_MESSAGE:
                // DataManager.getInstance().playerManager.player.parseGemInlay(message);
                // GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GEM_SYNTHETIC_MESSAGE:
                DataManager.getInstance().gemManager.parseSynthetic(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GEM_UPGRADE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseGemInlay(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SPATBLOOD_BUY_MESSAGE:
                DataManager.getInstance().spatBloodsManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ONEREBATEST_BUY_MESSAGE:
                DataManager.getInstance().oneRebateSTManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ONEREBATEST_RECEIVE_MESSAGE:
                DataManager.getInstance().oneRebateSTManager.parseReceiveMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseCoatard(message);
                // DataManager.getInstance().taskManager.parseInitCoatardTaskMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIGOUR_EXCHANGE_MESSAGE:
                DataManager.getInstance().rebirthManager.onParseVigourExchange(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DOMINATE_UPGRADE_MESSAGE:
                DataManager.getInstance().dominateManager.onParseDominateUpgrade(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DOMINATE_ADVANCE_MESSAGE:
                DataManager.getInstance().dominateManager.onParseDominateAdvance(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DOMINATE_DECOMPOSE_MESSAGE:
                DataManager.getInstance().dominateManager.onParseDecompose(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FASHION_ACTIVE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseFashionctive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FASHION_SHOW_MESSAGE:
                DataManager.getInstance().playerManager.player.parseFasionShow(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FASHION_UPLEVEL_MESSAGE:
                DataManager.getInstance().playerManager.player.parseFashionLvUp(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAGIC_MESSAGE:
                DataManager.getInstance().magicManager.onParseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAGIC_UPGRADE_MESSAGE:
                DataManager.getInstance().magicManager.onParseUpdateMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAGIC_ADVANCE_MESSAGE:
                DataManager.getInstance().magicManager.onParseAdvanceMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_MAGIC_TURNPLATE_MESSAGE:
                DataManager.getInstance().magicManager.onParseTurnplateMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.CELESTIAL_COMPOUND_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.CELESTIAL_UPGRADE_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            // case MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE:
            //     DataManager.getInstance().celestialManager.onParseDecomposeMessage(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            case MESSAGE_ID.ACTIVITY_CONSUMEITEM_MESSAGE:
                DataManager.getInstance().totalConsumeManager.parseMessage(message);
                break;
            case MESSAGE_ID.WAREHOUSE_TAKEOUT_MESSAGE:
                DataManager.getInstance().celestialManager.onParseTakeOutMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TREASURE_CELESTIAL_MEESAGE:
                DataManager.getInstance().celestialManager.onParseCelestiaTreasure(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TREASURE_WEEK_AWARD_MESSAGE:
                DataManager.getInstance().celestialManager.onParseTreasureWeekAwardMsg(message);
                break;
            case MESSAGE_ID.TREASURE_CELESTIAL_LOG_MEESAGE:
                DataManager.getInstance().celestialManager.onParseCelestiaTreasureLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WAREHOUSE_MESSAGE:
                DataManager.getInstance().celestialManager.onParseWarehouseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_FRIEND_LIST_MESSAGE:
                DataManager.getInstance().friendManager.onParseFriendList(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_FRIEND_APPLYNEW_MESSAGE:
                DataManager.getInstance().friendManager.onParseNewApply(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_FRIEND_SEARCH_MESSAGE:
                DataManager.getInstance().friendManager.onParseSearch(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.EQUIPSLOT_QUENCHING_MESSAGE:
                DataManager.getInstance().playerManager.player.parseQuenching(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_UPDATE_MESSAGE:
                DataManager.getInstance().playerManager.player.onParsePetUpdate(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_UPGRADE_MESSAGE:
                DataManager.getInstance().playerManager.player.onParsePetUpgrade(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_LOTTERY_LOG_MESSAGE:
                DataManager.getInstance().petManager.onParsePetLogMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_TRAIN_RANDOM_MESSAGE:
                DataManager.getInstance().petManager.parseRandomValue(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_DAN_MESSAGE:
                DataManager.getInstance().playerManager.player.parsePetDanChange(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PET_TRAIN_CHANGE_MESSAGE:
                DataManager.getInstance().playerManager.player.parsePetChange(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            // case MESSAGE_ID.PET_EXCHANGE_MESSAGE:
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            // case MESSAGE_ID.PET_LOTTERY_MESSAGE:
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            case MESSAGE_ID.TEST_FIGHTING_MESSAGE://测试用战斗力校验
                // if (SDKManager.isLocal) {
                //     let errorStr: string = message.getString();
                //     GameDispatcher.getInstance().dispatchEvent(
                //         new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                //         new WindowParam("AlertDescUI", errorStr));
                // }
                break;
            case MESSAGE_ID.TIMEOUT_MESSAGE://110 连接超时
                this.gameWorld.setAlertDisconnect(Language.ALERT_DISCONNECT_3);
                break;
            /*****************************活动相关******************************* */
            case MESSAGE_ID.ACTIVITY_MESSAGE://1000活动大厅里相关活动
                DataManager.getInstance().activityManager.parseMessage(message);
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_SEVDAY_MESSAGE://1003活动信息返回
                DataManager.getInstance().sevenDayCarnivalManager.parseSevDayInfo(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_SEVDAYLOGIN_AWARD_RECEIVE://1001七日登录奖励
                DataManager.getInstance().sevenDayCarnivalManager.parseSevDayLoginReceive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_SEVDAYOBJECTIVE_AWARD_RECEIVE://1002七日目标奖励
                DataManager.getInstance().sevenDayCarnivalManager.parseSevDayObjectiveReceive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_COATARD_REWARD:
                DataManager.getInstance().playerManager.parseCoatardRewardMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_MONTHCARD_MESSAGE://135月卡信息
                DataManager.getInstance().monthCardManager.parseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GAME_TOPRANK_INFO_MESSAGE://130返回排行榜信息
                DataManager.getInstance().topRankManager.parseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.OTHER_MESSAGE://131返回排行榜别人的信息
                DataManager.getInstance().topRankManager.otherMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE://132简易排行榜信息
                DataManager.getInstance().topRankManager.parseSimpleMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.RECHAREG_RECORD_MESSAGE://140充值档位记录返回
                DataManager.getInstance().rechargeManager.parseMessage(message);
                DataManager.getInstance().newactivitysManager.payToday = true;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DAILY_WELFARE_MESSAGE://141每日福利信息
                DataManager.getInstance().welfareManager.parseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.REBATE_TO_BUY_MESSAGE://142百倍返利购买返回
                // DataManager.getInstance().rebateManager.parseBuyMessage(message);
                // GameCommon.getInstance().receiveMsgToClient(message);
                var type: number = message.getInt();
                switch (type) {
                    case ACTIVITY_BRANCH_TYPE.TEHUILIBAO:
                        DataManager.getInstance().newactivitysManager.parseBuyMessage(message);
                        break;
                    case ACTIVITY_BRANCH_TYPE.WUYITEHUILIBAO:
                        DataManager.getInstance().festivalWuYiManager.onParseLiBao(message)
                        break;
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_FAVORABLE:
                    case ACTIVITY_BRANCH_TYPE.WEEKEND_FAVORABLE:
                    case ACTIVITY_BRANCH_TYPE.FESTIVAL_FAVORABLE2:
                        DataManager.getInstance().festivalFavorableManager.onPraseBuyMessage(message, type);
                        break;
                }

                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.XIANGOULIBAO_BUY_MESSAGE://163限购礼包买买买
                DataManager.getInstance().newactivitysManager.parseBuyxiangouMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.CHONGJILIBAO_BUY_MESSAGE://164冲级礼包买买买
                DataManager.getInstance().newactivitysManager.parseBuychongjiMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DABIAOJIANGLI_BUY_MESSAGE://165达标礼包买买买
                DataManager.getInstance().newactivitysManager.parseBuydabiaoMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.DABIAOPAIHANG_DATE_MESSAGE://166达标排行
                DataManager.getInstance().newactivitysManager.parsedabiaopaihangMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YAOQIANSHU_YAOQIAN://170摇钱树摇钱
                DataManager.getInstance().newactivitysManager.yaoqianshuyaoqian(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YAOQIANSHU_LINGJIANG://171摇钱树领奖
                DataManager.getInstance().newactivitysManager.parseyaoqianshulingjiang(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TREASURE_RANK_LIST_MESSAGE://172
                DataManager.getInstance().treasureRankManager.parseTreasureRankMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SIGN_REWARD_MESSAGE://168签到
                DataManager.getInstance().newactivitysManager.parseSignEveryDay(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIP_XIANGOULIBAO_BUY_MESSAGE://187限购礼包买买买
                DataManager.getInstance().newactivitysManager.parseBuyVipxiangouMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ZHIZUN_XIANGOULIBAO_BUY_MESSAGE://188限购礼包买买买
                DataManager.getInstance().newactivitysManager.parseBuyzhizunxiangouMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.INVEST_TO_BUY_MESSAGE://143购买投资计划
                DataManager.getInstance().investManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.INVEST_TO_OBTAIN_MESSAGE://144领取基金
                DataManager.getInstance().investManager.parseObtainMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TURNPLATE_FILT_MESSAGE://145转盘抽奖
                DataManager.getInstance().turnplateManager.parseRunALotteryMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TLSHOP_TO_BUY_MESSAGE://146购买显示商店商品
                DataManager.getInstance().tLShopManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_SHENMISHOP_GOODS_MESSAGE://神秘商店
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_SHENMISHOP_BUY_MESSAGE://神秘商店购买
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SHOP_DISCOUNT_INFO_MESSAGE:
                DataManager.getInstance().shopManager.onParseDiscountMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.LOGON_REWARD_MESSAGE://登录领取
                DataManager.getInstance().newactivitysManager.parseLogonAdd(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.LIMIT_SIGN_REWARD_MESSAGE://限时登录
                DataManager.getInstance().newactivitysManager.parseLogonLimit(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TLGIFT_TO_OBTAIN_MESSAGE://147购买显示商店商品
                DataManager.getInstance().tLGiftManager.parseObtainMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TOPRANK_GIFT_MESSAGE://148冲榜有礼信息
                DataManager.getInstance().tOPRankGiftManager.parseMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIPTLGIFT_TO_BUY_MESSAGE://149购买显示商店商品
                DataManager.getInstance().vipTLGiftManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIPTLSHOP_TO_BUY_MESSAGE://150购买显示商店商品
                DataManager.getInstance().vipTLShopManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.CASHCOW_LOTTERY_MESSAGE://151摇钱树抽奖
                DataManager.getInstance().springActivityManager.onParseCrashcowLottery(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break
            case MESSAGE_ID.TLDOGZ_EXCHANGE_MESSAGE://151神兽兑换
                DataManager.getInstance().tLDogzManager.parseExchangeMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.COLLECTWORD_EXCHANGE_MESSAGE://152集字兑换
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.SPRINGTLSHOP_TO_BUY_MESSAGE://155购买显示商店商品
                DataManager.getInstance().springTLShopManager.parseBuyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYER_INVESTTURNPLATE_MESSAGE://投资转盘广播信息
                DataManager.getInstance().festivalWuYiManager.onParseCelestiaTreasureLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE:
                DataManager.getInstance().festivalWuYiManager.onParseZhuanPanMessage(message);
                //旧的转盘消息
                // DataManager.getInstance().luckTurnplateManager.parsePlayMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WISHINGWELL_ADVANCE_MESSAGE://173许愿
                DataManager.getInstance().wishingWellManager.onParseAdvanceMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE://174节日登录奖励
            case MESSAGE_ID.WEEKEND_LOGIN_AWARD_RECEIVE:
                DataManager.getInstance().festivalLoginManager.onParseLoginAwardReceive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_LIMIT_PURCHASE_BUY://175节日限购购买
            case MESSAGE_ID.WEEKEND_LIMIT_PURCHASE_BUY://181节日限购购买
                // DataManager.getInstance().festivalLimtPurchaseManager.onParseLimitPurchaseBuy(message);
                // GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_WISHING_WELL_MESSAGE://176节日许愿池
                DataManager.getInstance().festivalWishingwellManager.onParseAdvanceMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_TARGET_AWARD_RECEIVE://177节日达标
            case MESSAGE_ID.PAY_TARGET_AWARD_RECEIVE:
                DataManager.getInstance().festivalTargetManager.onParseTargetAwardReceive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_TARGET_RANKLIST_MESSAGE://178节日达标排行榜
            case MESSAGE_ID.PAY_TARGET_RANKLIST_MESSAGE:
                DataManager.getInstance().festivalTargetManager.onParseTargetRankList(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PLAYCAFE_EXCLUSIVE_AWARD_RECEIVE:
                DataManager.getInstance().playCafeManager.onParseLoginAwardReceive(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACTIVITY_FUDAI_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_TURNPLATE_LOTTERY_MESSAGE:
                // DataManager.getInstance().festivalTurnplateManager.onParseAdvanceMessage(message);
                // GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FESTIVAL_TURNPLATE_LOTTERY_RANK:
                DataManager.getInstance().festivalWuYiManager.parseZhuanpanRankMsg(message);
                break;
            case MESSAGE_ID.FESTIVAL_MISSION_ACT_UPDATE:
                DataManager.getInstance().festivalWuYiManager.parseLiuyiMissonUpdate(message);
                break;
            case MESSAGE_ID.FESTIVAL_MISSION_ACT_REWARD:
                DataManager.getInstance().festivalWuYiManager.parseLiuyiMissonUpdate(message, 1);
                break;
            case MESSAGE_ID.ACTIVITY_XIANFENG:
                DataManager.getInstance().newactivitysManager.parseXianFeng(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.HEFU_ACT_MISSION_UPDATE:
                DataManager.getInstance().hefuActManager.parseHefuiMissonUpdate(message);
                break;
            case MESSAGE_ID.HEFU_ACT_MISSION_REWARD:
                DataManager.getInstance().hefuActManager.parseHefuiMissonUpdate(message, 1);
                break;
            case MESSAGE_ID.ARTIFACT_ROLL_PLATE:
                DataManager.getInstance().shenqiZhuanPanManager.onParseZhuanPanMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE:
                DataManager.getInstance().shenqiZhuanPanManager.parseZhuanpanRankMsg(message);
                break;
            case MESSAGE_ID.BROADCAST_ARTIFACT_ROLL_MESSAGE://神器转盘广播信息
                // DataManager.getInstance().shenqiZhuanPanManager.onParseCelestiaTreasureLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.HEFU_ACT_TURNPLATE_LOTTERY_MESSAGE:
                DataManager.getInstance().hefuActManager.onParseZhuanPanMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.HEFU_ACT_TURNPLATE_LOTTERY_RANK_MSG:
                DataManager.getInstance().hefuActManager.parseZhuanpanRankMsg(message);
                break;
            case MESSAGE_ID.HEFU_ACT_INVESTTURNPLATE_MESSAGE://和服转盘广播信息
                DataManager.getInstance().hefuActManager.onParseCelestiaTreasureLog(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WANBA_DESK_INFO_MESSAGE:
                DataManager.getInstance().playerManager.player.sendDesk = message.getByte();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WANBA_GIFT_MESSAGE:
                DataManager.getInstance().playerManager.player.giftState = message.getByte();
                var dropitems: AwardItem[] = [];
                var dropSize: number = message.getByte();
                for (var i: number = 0; i < dropSize; ++i) {
                    var dropawardItem: AwardItem = new AwardItem();
                    dropawardItem.type = message.getByte();
                    dropawardItem.id = message.getShort();
                    dropawardItem.quality = message.getByte();
                    dropawardItem.num = message.getInt();
                    dropawardItem.quality = (dropawardItem.type == GOODS_TYPE.MASTER_EQUIP || dropawardItem.type == GOODS_TYPE.SERVANT_EQUIP) ? dropawardItem.quality : -1;
                    dropitems.push(dropawardItem);
                }
                DataManager.getInstance().playerManager.player.giftReward = dropitems;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "WanbaGiftPanel");
                break;
            case MESSAGE_ID.REBIRTH_TASK_INIT_MSG:
                DataManager.getInstance().taskManager.parseInitCoatardTaskMsg(message);
                break;
            case MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG:
                DataManager.getInstance().taskManager.parseUpdateCoatardTaskMsg(message);
                break;
            case MESSAGE_ID.REBIRTH_TASK_LV_MSG:
                // DataManager.getInstance().taskManager.parseUpdateCoatardTaskMsg(message);
                DataManager.getInstance().playerManager.player.chengjiuLvDict[message.getShort()] = 1;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.LONGHUN_RANDOM:
                DataManager.getInstance().dragonSoulManager.parseRandomValue(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.LONGHUN_CHANGE:
                DataManager.getInstance().playerManager.player.parseLonghunChange(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WUXING_UP:
                DataManager.getInstance().playerManager.player.parseWuxing(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FATE_LOTTERY_MESSAGE:
                DataManager.getInstance().playerManager.player.fateIndex = message.getByte();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FATE_UPGRADE_MESSAGE://命格升级
                DataManager.getInstance().playerManager.player.onParseFateUpgrade(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FATE_ACTIVE_MESSAGE://命格装备
                DataManager.getInstance().playerManager.player.onParseFateEquipRefresh(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FATE_REWARD_MESSAGE://命格获得
                DataManager.getInstance().fateManager.parseFateGain(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ROLL_PLATE_REWARD:
                DataManager.getInstance().vipManager.onParseZhuanPanGetAwardNum(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIP_ROLL_PLATE:
                DataManager.getInstance().vipManager.onParseZhuanPanMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VERIFY_GIFT:
                DataManager.getInstance().playerManager.parseVerifyMessage(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.TIANSHU_LEVELUP_MESSAGE:
                DataManager.getInstance().playerManager.parseTianshuLevelUpMsg(message);
                break;
            case MESSAGE_ID.TIANSHU_UPGRADE_MESSAGE:
                DataManager.getInstance().playerManager.parseTianshuUpgradeMsg(message);
                break;
            case MESSAGE_ID.PILL_ROLL_MESSAGE://抽取仙丹
                DataManager.getInstance().xiandanManager.parseXianDanGain(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PILL_USE_MESSAGE://使用仙丹
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PILL_MESSAGE://丹药
                DataManager.getInstance().playerManager.player.riviseXianDan(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.PILL_HIDE_BOSS_MESSAGE://隐藏boss
                DataManager.getInstance().xiandanManager.parseBossState(message);
                DataManager.getInstance().dupManager.onChangeXianShanBossList();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ONLINE_BOSS_MESSAGE://上线仙山BOSSsize
                DataManager.getInstance().xiandanManager.parseBossSize(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ENERGY_MESSAGE://仙山
                DataManager.getInstance().xiandanManager.energy = message.getInt();
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.BOSS_PILL_INFO_MESSAGE:
                DataManager.getInstance().dupManager.parseXianShanBossInfoMsg(message);
                break;
            // case MESSAGE_ID.BOSS_PILL_APPEAR_MESSAGE:
            //     // DataManager.getInstance().dupManager.onRemindXianShanBoss(message);
            //     GameCommon.getInstance().receiveMsgToClient(message);
            //     break;
            case MESSAGE_ID.BOSS_PILL_QUIT_MESSAGE:
                DataManager.getInstance().dupManager.onRemindXuezhanBoss(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ENERGY_GIFT:
                DataManager.getInstance().friendManager.onParseCaoYaoSend(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ENERGY_GIFT_RECEIVE:
                DataManager.getInstance().friendManager.onParseCaoYaoGet(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ENERGY_GIFT_NOTIFY://赠送体力通知
                DataManager.getInstance().friendManager.onParseCaoYaoRefresh(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            /**跨服PVE BOSS 相关**/
            case MESSAGE_ID.CROSS_PVEBOSS_INFO_MESSAGE:
                DataManager.getInstance().dupManager.parseCrossPVEBossInfo(message);
                break;
            case MESSAGE_ID.CROSS_PVEBOSS_COUNTBUY_MESSAGE:
                DataManager.getInstance().dupManager.parseCrossPVEBossBuy(message);
                break;
            case MESSAGE_ID.CROSS_PVEBOSS_FIGHT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.CROSS_PVEBOSS_RANK_MESSAGE:
                DataManager.getInstance().dupManager.parseCrossPVEBossRank(message);
                break;
            case MESSAGE_ID.VIPGOD_ARTIFACT_ACTIVATE_MESSAGE:
                DataManager.getInstance().legendManager.updateVipGodArtifact(message.getByte(), 1);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.VIPGOD_ARTIFACT_UPGRADE_MESSAGE:
                DataManager.getInstance().legendManager.updateVipGodArtifact(message.getByte(), message.getShort());
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FULING_MESSAGE:
                DataManager.getInstance().playerManager.player.parseFuling(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.YUANJIE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseYuanjie(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.RUNE_WEAR:
            case MESSAGE_ID.RUNE_COMPOSE_QUICK://一键合成
                DataManager.getInstance().playerManager.player.onParseRunesMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.RUNE_COMPOS:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WUTAN_INFO_GET_MESSAGE:
                DataManager.getInstance().wuTanManager.parseInfo(message);
                break;
            case MESSAGE_ID.WUTAN_LIST_GET_MESSAGE:
                DataManager.getInstance().wuTanManager.parseList(message);
                break;
            case MESSAGE_ID.WUTAN_FIGHT_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.WUTAN_BUY_MESSAGE:
                DataManager.getInstance().wuTanManager.parseBuy(message);
                break;
            case MESSAGE_ID.WUTAN_HEART_MESSAGE:
                DataManager.getInstance().wuTanManager.parseRefresh(message);
                break;
            case MESSAGE_ID.ACT_TUANGOU_MESSAGE:
                DataManager.getInstance().tuangouActManager.parseTuangouMsg(message);
                break;
            case MESSAGE_ID.ACT_LABA_MESSAGE:
                DataManager.getInstance().labaManager.parseLaba(message);
                break;
            case MESSAGE_ID.ACT_FEAST_GET_MESSAGE:
                DataManager.getInstance().zqManager.parseGet(message);
                break;
            case MESSAGE_ID.ACT_FEAST_RUN_MESSAGE:
                DataManager.getInstance().zqManager.parseRun(message);
                break;
            case MESSAGE_ID.ACT_666_LABA_MESSAGE:
                DataManager.getInstance().a666Manager.parseLaba(message);
                break;
            case MESSAGE_ID.ACT_666_RANK_MESSAGE:
                DataManager.getInstance().a666Manager.parseLabaRank(message);
                break;
            case MESSAGE_ID.ZHANGONG_INFO_GET_MESSAGE:
                DataManager.getInstance().pvpManager.parseMsg(message);
                break;
            case MESSAGE_ID.FASHIONSETL_ACT_MESSAGE:
                let idx: number = message.getByte();
                DataManager.getInstance().playerManager.player.getPlayerData(idx).taozhuangDict[message.getShort()] = 1;
                DataManager.getInstance().playerManager.player.updataAttribute(true);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.FASHIONSETL_UPLV_MESSAGE:
                DataManager.getInstance().playerManager.player.parseFashionEtl(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_AD_MESSAGE:
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE:
                DataManager.getInstance().marryManager.parseMsg(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_APPLY_MESSAGE:
                DataManager.getInstance().playerManager.player.marriId = message.getInt();
                DataManager.getInstance().marryManager.marryId = DataManager.getInstance().playerManager.player.marriId;
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_RING_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseRingLevelup(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE:
                DataManager.getInstance().marryManager.parseMsgDivorce(message)
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_DIVORCE_APPLY_MESSAGE:
                DataManager.getInstance().marryManager.parseMsgAgreeDivorce(message)
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_TREE_UP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseMarrayTree(message)
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_TREE_EXP_RECEIVE_MESSAGE:
                DataManager.getInstance().playerManager.player.parseMarrayTree(message)
                DataManager.getInstance().playerManager.player.marriedTreeExp = message.getInt()
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_TREE_EXP_MESSAGE:
                DataManager.getInstance().playerManager.player.marriedTreeExp = message.getInt()
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_PARTNER_INFO_MESSAGE:
                DataManager.getInstance().marryManager.partnerId = message.getInt()
                DataManager.getInstance().marryManager.partnerName = message.getString()
                DataManager.getInstance().marryManager.partnerHead = message.getByte()
                DataManager.getInstance().marryManager.partnerHeadIndex = message.getByte()
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE:
                DataManager.getInstance().playerManager.player.parseMarryEquipSuitLevelup(message);
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.STRONGER_ACT:
                DataManager.getInstance().playerManager.player.parseStronger(message)
                GameCommon.getInstance().receiveMsgToClient(message);
                break;
            case MESSAGE_ID.ACT_RONGLIAN_DUIHUAN:
                DataManager.getInstance().activitySmeltManager.parseUpdateMsg(message);
                break;
        }
        //红点触发相关
        DataManager.getInstance().redPointManager.onCheck(cmdID);
        //重置消息请求失败次数
        if (MessageErrorManager.getInstance().requsetFailTimes != 0) {
            MessageErrorManager.getInstance().requsetFailTimes = 0;
        }
    }
    //The end
}