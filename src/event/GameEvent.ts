class GameEvent {
  /**查询余额成功**/
  public static QUERY_BALANCE_SUCCESS: string = 'game.query.balance.success';
  /**SDK登录成功**/
  public static GAME_SDK_LOGIN_OK: string = 'game.sdk.login.success';
  public static GAME_SDK_LOGIN_FAIL: string = "game.sdk.login.fail";
  /**JSON解析完成**/
  public static GAME_JSON_PARSE_OK: string = 'game.json.parse.complete';
  /**断线重连**/
  public static GAME_RELOGIN_EVENT: string = "game.player.relogin.event";
  /**新手任务完成**/
  public static GAME_JACKAROO_COMPLETE: string = "game.jackaroo.complete.event";
  /**游戏从新回到前台**/
  public static WXGAME_ONSHOW_EVENT: string = "wxgame.onshow.event";
  /**游戏隐藏到后台**/
  public static WXGAME_ONHIDE_EVENT: string = "wxgame.onhide.event";
  /**战斗**/
  public static SCENE_ENTER_SUCCESS: string = "game_scene_load_success";//场景载入成功
  public static ANIMATION_LOAD_COMPLETE: string = "game_animation_load_complete";
  public static ANIMATION_FRAMEGROUP_COMPLETE: string = "game_animation_framegroup_complete";
  public static GAME_EARTHQUAKE_STRAT: string = "game_earthquake";
  public static GAME_GOTO_BOSS_WAVE: string = "game_goto_boss_wave";
  public static GAME_YEWAI_FIGHT_UPDATE: string = "game_yewaifight_update";//野外战斗关卡更新
  public static GAME_SET_AUTO_FIGHT: string = "game_set_auto_fight";//设置自动战斗
  // public static GAME_UPDATE_ROLELIST: string = "game_update_role_list";//增加英雄上场
  public static GAME_CLOSE_RESULT_VIEW: string = "game_close_result_view";//副本退出
  public static NPCTALK_SELECTED_ANSWER: string = "game_npc_selected_answer";//与NPC交谈选择选项事件
  public static SHIELD_OTHERBODY_EVENT: string = "game_otherbody_shield_event";//屏蔽其他玩家
  public static LADDER_FIGHT_START_EVENT: string = "ladder_arena_figth_start_event";//开始天梯竞技场
  public static OTHERBODY_ENTER_SCENE: string = "game_ohterbody_enter_scene_event";//其他玩家进入场景内
  public static PET_ENJOIN_MAP: string = 'game_pet_enjoin_map_event';//宠物随从参战
  public static PLAYER_AVATAR_UPDATE: string = 'game_player_avatar_update';//更新玩家外形

  /**window**/
  public static MODULE_WINDOW_OPEN: string = "game_module_window_open";
  public static MODULE_WINDOW_CLOSE: string = "game_module_window_close";
  public static MODULE_WINDOW_OPEN_WITH_PARAM: string = "game_module_window_open_with_param";
  public static MODULE_GOTYPE_OPEN_WINDOW: string = "game_module_gotype_open_window";
  public static MODULE_WINDOW_ALLREMOVED: string = "game_module_window_allremoved";//所有面板都处于关闭状态
  /**loading**/
  public static LOADING_OPEN: string = "game_loading_open";
  public static LOADING_CLOSE: string = "game_loading_close";
  /**PLAYER**/
  public static PLAYER_LEVEL_UPDATE: string = "player_level_update";//人物等级
  public static PLAYER_POWER_UPDATE: string = "player_powervalue_update";//人物战斗力更新
  public static PLAYER_SHENTONG_ADD: string = "player_shentong_add";//神通背包增加
  public static PLAYER_SHENTONG_REMOVE: string = "player_shentong_remove";//神通背包删除
  public static PLAYER_SHENTONG_SLOT_UPDATE: string = "player_shentong_slot_update";//神通槽位更新
  /**背包**/
  public static GAME_BAG_UPDATE: string = "game_bag_update";//背包更新
  /**道具装备获取提示**/
  public static GAME_OBTAINHINT_SHOW: string = "game_obtainhint_show_event";
  /** 网络错误事件 */
  public static NET_EVENT_ERROR: string = "netEventError";

  /**经脉激活**/
  public static GAME_PULSE_ACTIVATED: string = "activatedback";
  /**商店点击购买**/
  public static GAME_SHOP_BUYGOODS: string = "game_shop_buy_goods";

  /**元神点击**/
  public static GAME_PSYCH_SELECTED: string = "game_psych_selected";

  /**红点触发事件**/
  public static GAME_REDPOINT_TRIGGER: string = "game_redpoint_trigger";

  /**元魂一点噬魂点击**/
  public static GAME_PSYCH_ONEKEYDEVOUR: string = "game_psych_onekeydevour";

  /**升级元魂**/
  public static GAME_PSYCH_UPDATE: string = "game_psych_update";
  /**元魂锁定和解锁**/
  public static GAME_PSYCH_LOCK: string = "game_psych_lock";
  /**元魂装备**/
  public static GAME_PSYCH_EQUIP: string = "game_psych_equip";
  /**元魂替换**/
  public static GAME_PSYCH_REPLACE: string = "game_psych_replace";

  /**打劫镖车**/
  public static GAME_ROB_ESCORT: string = "game_rob_escort";
  /**镖车押运完毕**/
  public static GAME_ESCORT_DONE: string = "game_escort_done";
  /**镖车押运完毕发放奖励**/
  public static GAME_ESCORT_AWARD: string = "game_escort_award";

  /**点击任务完成事件**/
  public static GAME_TOUCH_TASK_BACK: string = "game_touch_task_back";

  /**经脉升级失败**/
  public static PULSE_UP_FAIL_EVENET: string = "game_pulse_up_fail_evenet";

  /**PVP双方对战信息*/
  public static GAME_PVP_BOTHFIGHTER_INFO = "game_pvp_bothfighter_info";

  /**祝福值灵器打开更换面板事件 */
  public static BLESS_OPEN_CHANGE_ARTIFACT = "bless_open_change_artifact";

  /**新手引导事件 */
  public static NOVICE_GUIDE_EVENT = "novice_guide_event";

  /**七日活动关闭**/
  public static GAME_SEVDAY_CLOSE = "game_sevday_close";

  /**红点方法计算完成*/
  public static GAME_REDPOINT_TRIGGER_DONE = "game_redpoint_trigger_done";

  /**开启主面板事件**/
  public static GAME_OPEN_PANEL_EVENT = "game_open_panel_event";

  /**检测活动按钮**/
  public static GAME_CHECKACTIVITY_BTN = "game_checkactivity_btn";

  /**分享信息更新**/
  public static SDK_SHARE_INFO_UPDATE = "sdk_share_info_update";

  /**更新宝石抽奖的免费次数**/
  public static GEM_LOTTERY_FREE = "gem_lottery_free_times"

  /**系统提示**/
  public static SYSTEM_CHAT_BROADCAST = "system_chat_broadcast";

  /**系统提示更新主界面聊天**/
  public static SYSTEM_CHAT_BROADCAST_UPDATEMAINVIEW = "system_chat_broadcast_updatemainview";

  public static MAIN_GIFT_COOLDOWN = "main_gift_cooldown";

  /**检查红点**/
  public static INSPECT_REDPOINT = "inspect_redPoint";
  /**猎命点击装备**/
  public static LIEMING_DOWN = 'lieming.down';
  /**猎命穿戴装备**/
  public static LIEMING_EQUIP = 'lieming.equip';
  /**猎命点击装备升级**/
  public static LIEMING_LVUP = 'lieming.lvup';
  /**神器切页更新**/
  public static SQ_TAB_REFRESH = 'sq.tab.refresh';
  /**仙丹切页更新**/
  public static XIANDAN_TAB_REFRESH = 'xiandan.tab.refresh';
  /**玩吧特权VIP**/
  public static WANBAVIP_MAX = 'wanbavip.max';
  /**仙山界面刷新**/
  public static XIANSHAN_REFRESH = 'xianshan.refresh';
  /**法宝幻化**/
  public static MAGIC_HUANHUA = 'magic.huanhua';
}