/**
 *
 * @author 
 *
 */
class MainView extends eui.Component implements ISDKGiftContainer {
    private owner: ModuleLayer;

    // private btn_role: eui.Button;
    private cb_autoFight: eui.CheckBox;
    // private cb_sound: eui.CheckBox;
    private group_topbar: eui.Group;
    private maininfo_grp: eui.Group;
    private power_info_grp: eui.Group;
    // private right_btns_bar: eui.Group;
    private heroLv: eui.Label;
    private money_gold: eui.Label;
    private money_bind: eui.Label;
    // private heroHp_probar: eui.ProgressBar;
    // private hero_headIcon: eui.Image;
    private playerHead: PlayerHeadPanel;
    private heroName: eui.Label;
    private gold_money: eui.Group;
    // private trunktask_dec_grp: eui.Group;
    private money_group: eui.Group;
    // private btn_forge: eui.Button;
    // private btn_bag: eui.Button;
    // private btn_fenZheng: eui.Button;
    private btn_mail: eui.Button;
    private btn_rank: eui.Button;
    // private btn_xianlv: eui.Button;
    // private btn_dshd: eui.Group;
    // private img_dshd: eui.Image;
    private have_gift_img: eui.Group;
    private img_exr: eui.Image;

    private btn_yueka: eui.Button;
    private btn_firstcharge: eui.Button;
    private btn_meiri: eui.Button;
    private btn_chongbang: eui.Button;
    // private bottom_btn_bar0: eui.Group;

    private fight_value_label: eui.BitmapLabel;
    private btn_boss: eui.Button;
    // private jingjie_task_probar: eui.ProgressBar;
    // private coatard_lv_img: eui.BitmapLabel;
    // private coatard_name_img: eui.Image;
    // private coatard_task_bar: eui.Group;
    // private coatard_task_probar: eui.Label;
    // private coatard_task_lab: eui.Label;

    /**主界面特效**/
    private jingjie_anim_grp: eui.Group;
    private activity: ActivityContainerBar;
    private vip_label: eui.BitmapLabel;
    private btn_gift: eui.Button;
    private label_giftCD: eui.Label;
    private guide_task_bar: eui.Group;
    private guide_task_dec: eui.Label;
    private guide_awdname_lab: eui.Label;
    private guide_awdicon_img: eui.Image;
    private guide_awdnum_lab: eui.Label;
    private yewai_pass_num: eui.Label;
    private yewai_wave_bar: eui.Group;
    private switch_btn: eui.Image;
    // private btn_dup_leave: eui.Button;
    // private vip3Btn: eui.Button;
    // private task: TaskItem;
    private money_add_img: eui.Button;
    private gold_add_img: eui.Button;
    private vipBtn: eui.Button;
    private funBtn: eui.Button;
    private funImage: eui.Image;
    private funGroup: eui.Group;
    private btn_jingjie: eui.Button;
    private dup_btn: eui.Button;
    private union_btn: eui.Button;
    private challenge_boss_btn: eui.Button;
    // private serverfight_btn: eui.Button;
    // private unionbattle_btn: eui.Button;
    // private btn_huanling: eui.Button;
    // private btn_leftarrow: eui.Button;
    private chatLayer: eui.Image;
    private bottom_btnbar_grp: eui.Group;
    private bottom_main_bar: eui.Group;
    private left_btns_bar: eui.Group;
    // private btn_showChat: eui.Group;
    // private img_chatShow: eui.Image;
    private top_back_img: eui.Image;
    private minichat_layer: eui.Image;
    private chat_sys: eui.Group;
    // private chat_mask: eui.Group;
    private minChat: eui.Label;
    // private chatBar: eui.Scroller;

    private recharge_group: eui.Group;
    // private tujianBtn: eui.Group;
    // private tujian_wave: eui.BitmapLabel;
    // private tujian_goods_icon: eui.Image;
    // private tujian_goods_name: eui.Label;
    // private tujian_thing: ThingBase;

    private yewaipro_width: number;
    private bossAutoBar: eui.ProgressBar;
    private yewai_stageidx_lab: eui.Label;
    private yewai_exp_award: eui.Label;
    private yewai_gold_award: eui.Label;
    private taskbarAnim1: Animation;
    private taskbarAnim2: Animation;
    // private jingjie_taskpro_bar: eui.Group;
    // private jingjie_taskpro_lab: eui.Label;
    // private jingjie_taskcon_lab: eui.Label;
    // private jingjie_pro_animgrp: eui.Group;
    // private jingjie_taskpro_scroll: eui.Scroller;
    // private black_mask_grp: eui.Group;
    // private blackmask_rect_top: eui.Image;
    // private blackmask_rect_bottom: eui.Image;
    // private blackmask_rect_left: eui.Image;
    // private blackmask_rect_right: eui.Image;
    // private blackmask_center_img: eui.Image;
    private btnsPanel: eui.Group;
    private btnsPanel1: eui.Group;
    private btnGrop: eui.Button;
    private btnMarry: eui.Button;
    private btnLieMing: eui.Button;
    private lilian_group: eui.Group;
    private maskimg: eui.Image;
    private taskEffect: eui.Group;
    // private zhuXianBossBtn:eui.Button;
    // private fuLingBtn:eui.Button;
    // private xianshanBtn: eui.Button;

    //测试用代码
    private bottom_boss: eui.Button

    constructor(owner: ModuleLayer) {
        super();
        this.owner = owner;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.GameMainView;
    }
    public resize(): void {
        if (DataManager.IS_PC_Game) {
            this.maininfo_grp.width = GameDefine.GAME_STAGE_WIDTH;
        } else {
            this.maininfo_grp.width = size.width;
        }
        this.width = size.width;
        this.height = size.height;

        // if (this.activity) {
        //     this.activity.onResizeBtn();
        // }
    }
    private get mainbarUI(): MainVIew_btnBar {
        return this.owner.mainbtnbarUI;
    }
    //显示或隐藏战争迷雾
    // public onshowBlackMask(isShow: boolean): void {
    //     this.black_mask_grp.visible = isShow;
    //     if (isShow) {
    //         let posAry: number[] = GameFight.getInstance().getHeroPosByModule();
    //         let maskPosX: number = posAry[0];
    //         let maskPosY: number = posAry[1];
    //         this.blackmask_center_img.x = maskPosX;
    //         this.blackmask_center_img.y = maskPosY;
    //         maskPosX = maskPosX - 280;
    //         maskPosY = maskPosY - 550;
    //         this.blackmask_rect_top.height = maskPosY;
    //         this.blackmask_rect_bottom.y = maskPosY + this.blackmask_center_img.height;
    //         this.blackmask_rect_bottom.height = Math.ceil(size.height - this.blackmask_rect_bottom.y);
    //         this.blackmask_rect_left.y = maskPosY;
    //         this.blackmask_rect_left.width = Math.ceil(maskPosX);
    //         this.blackmask_rect_left.height = this.blackmask_center_img.height;
    //         this.blackmask_rect_right.x = maskPosX + this.blackmask_center_img.width;
    //         this.blackmask_rect_right.y = maskPosY;
    //         this.blackmask_rect_right.width = Math.ceil(size.width - this.blackmask_rect_right.x);
    //         this.blackmask_rect_right.height = this.blackmask_center_img.height;
    //     }
    // }
    //皮肤加载完成
    private onLoadComplete(): void {
        this.onRegistGameEvent();
        // //声音初始化
        var ismute: boolean = GameSetting.getLocalSetting(GameSetting.SOUND_MUTE);
        // this.cb_sound.selected = ismute;
        SoundFactory.playMusic(SoundDefine.SOUND_BGM);
    }
    private isInit: boolean = false;
    private onChangeScene(): void {
        if (!this.isInit) {
            this.isInit = true;
            this.onInit();
        } else {
            this.updateFunOpenTip();
        }
        this.onRefreshStatus();
    }
    public addMainBtnBar(): void {
        this.mainbarUI.addToLayer(this.bottom_main_bar);
        this.mainbarUI.resetButtonsStatus();
    }
    private onRegistGameEvent(): void {
        var bossinfoMsg: Message = new Message(MESSAGE_ID.XUEZHAN_INIT_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(bossinfoMsg);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SCENE_ENTER_SUCCESS, this.onChangeScene, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FUNCTION_REWARD_MESSAGE.toString(), this.updateFunOpenTip, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TASK_CHAIN_UPDATE_MESSAGE.toString(), this.updateGuideTaskList, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_JACKAROO_COMPLETE, this.onCompleteJackroo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CHAT_SEND_MESSAGE.toString(), this.updateChatInfoBack, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CHAT_RECEIVE_MESSAGE.toString(), this.updateChatInfoBack, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE.toString(), this.onRefreshPlayerHead, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_FRAME_CHANGE_MESSAGE.toString(), this.onRefreshPlayerHead, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onupdateExp, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.updateCoatard, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SCENE_BOSS_UPDATE, this.swithShowBossTargetBar, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_YEWAI_FIGHT_UPDATE, this.onRefreshWave, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SET_AUTO_FIGHT, this.onSetAutoFight, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.DUP_INFOVIEW_SHOW_SWITCH, this.onShowDupinfoView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_POWER_UPDATE, this.onUpdatePlayerPower, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.EXPLOREBOSS_BAR_SHOWORHIDE, this.onUpdateExploreBossBar, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.WORLDBOSS_BAR_SHOWORHIDE, this.onUpdateWorldBossBar, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.updateCoatardTask, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_REDPOINT_TRIGGER_DONE, this.onHideRightPoint, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_MAIN_RIGHTBAR_SHOWORHIDE, this.onTouchBtnSwitchRightbar, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CHECKACTIVITY_BTN, this.onCheckActivityBtn, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SYSTEM_CHAT_BROADCAST_UPDATEMAINVIEW, this.updateChatInfoBack, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MAIN_GIFT_COOLDOWN, this.onGiftCDShow, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.hideBtnFC, this);
        this.maskimg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideBtnGroup, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_NAME_MESSAGE.toString(), this.onChangeName, this);
        this.cb_autoFight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAutoFight, this);
        // this.cb_sound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSoundCkBtn, this);
        this.btn_jingjie.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchJingjie, this);
        this.dup_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchDup, this);
        this.union_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUnion, this);
        this.challenge_boss_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBossBtn, this);
        this.guide_task_bar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGuideTaskBar, this);
        this.btn_mail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnMail, this);
        this.btn_boss.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBoss, this);
        this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRank, this);
        this.gold_money.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnGotoRecharge, this);
        this.money_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchfuli, this);

        this.btn_yueka.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchyueka, this);
        this.btn_firstcharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchfc, this);
        this.btn_meiri.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMeiRi, this);
        this.btn_chongbang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChongbang, this);
        // this.vip3Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnVip3, this);
        this.vipBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onVipBtn, this);
        this.funBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFunOpenBtn, this);
        this.funGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFunOpenBtn, this);
        // this.funOpenBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFunOpenBtn, this);
        // this.hero_headIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSysOpt, this);
        this.playerHead.addClickListener(this.onTouchBtnSysOpt, this);
        // this.btn_leftarrow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSwitchBottomBar, this);

        this.chatLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMinChatLayer, this);
        this.minChat.addEventListener(egret.TextEvent.LINK, this.onTouchMiniChat, this);
        this.minichat_layer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMinChatLayer, this);
        this.btnGrop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowGrop, this);
        this.btnMarry.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMarry, this);
        this.switch_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchAccount, this);
        // this.xianshanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowXianShan, this);


        //测试用代码
        this.bottom_boss.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBoss, this);
    }

    private updateChatInfoBack() {
        this.updateChatInfo(50);
    }
    private updateChatInfo(param: number): void {
        let info = DataManager.getInstance().chatManager.chat[CHANNEL.ALL].concat();
        while (info.length > 2) {
            info.shift();
        }
        let ret: egret.ITextElement[] = DataManager.getInstance().chatManager.getChatTextFlow(CHANNEL.ALL, info);
        if (!this.minChat) return;
        this.minChat.textFlow = ret;
        setTimeout(this.adjustChatBar.bind(this), param);
    }
    private adjustChatBar() {
        // this.chatBar.viewport.scrollV = Math.max(this.chatBar.viewport.contentHeight - this.chatBar.viewport.height, 0);
    }
    private getHeroData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    //更新主界面的显示状态
    private onRefreshStatus(): void {
        var isshow: boolean = this.isDupScene;
        this.onSwitchMainviewBtn(isshow);
        // var _mapName: string = ModelManager.getInstance().modelMap[GameFight.getInstance().fightScene.mapInfo.mapId].mapName;
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            this.onRefreshYewaiAwardDesc();
        }
        this.btnGrop.visible = false;
        var cfgs: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv();
        // for (let k in cfgs) {
        //     if (cfgs[k].isGroup == 1) {
        //         if (FunDefine.isFunOpen(cfgs[k].id)) {
        //             this.btnGrop.visible = true;
        //         }
        //     }
        // }

        this.updateChatInfoBack();
        // if (isshow) {
        //     this.chatLayer.bottom = 220;
        // } else {
        //     this.chatLayer.bottom = 110;
        // }
    }
    //隐藏显示主界面按钮
    private btnIsHide: boolean = null;
    private onSwitchMainviewBtn(isHide: boolean): void {
        if (this.btnIsHide != isHide) {
            this.group_topbar.visible = !isHide;
            this.bottom_main_bar.visible = !isHide;
            this.bottom_btnbar_grp.visible = !isHide;
            this.left_btns_bar.visible = !isHide;
            this.funGroup.visible = !isHide && !GameFight.getInstance().isJackaroo;
            this.btn_jingjie.visible = !isHide;
            // this.tujianBtn.visible = !isHide;
            this.btnIsHide = isHide;
            this['chatGroup'].visible = !isHide;
        }
        if (SDKManager.loginInfo.channel == EChannel.CHANNEL_YYBQUICK) {
            this.switch_btn.visible = true;
        }
        this.setYewaiBarVisible();
        this.setGuideTaskVisible();
        // this.onCheckCoatardShow();
    }
    //野外挑战BOSS隐藏按钮
    private onSwitchBtnForYewai(isHide: boolean): void {
        this.setYewaiBarVisible();
        this.setGuideTaskVisible();
    }
    //是否显示新手任务
    private setGuideTaskVisible(): void {
        if (!this.guide_task_bar.parent) return;
        let isvisible: boolean = true;
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) {
            isvisible = false;
        }

        this.guide_task_bar.visible = isvisible;
    }
    //更新是否显示挑战BOSS按钮
    private setYewaiBarVisible(): void {
        this.yewai_wave_bar.visible = this.yewaiBtnVisible;
    }
    public get yewaiBtnVisible(): boolean {
        let isvisible: boolean = true;

        if (GameFight.getInstance().isJackaroo || GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) {//|| GameFight.getInstance().isGuideTask
            isvisible = false;
        }

        return isvisible;
    }
    private get isDupScene(): boolean {
        return GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG;
    }
    private onShowLieMing(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LieMingMainPanel");
    }
    private onShowMarry() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MarryMainPanel");
    }
    private _swithBottomBar1: boolean = false;
    private onShowGrop(): void {
        this._swithBottomBar1 = !this._swithBottomBar1;
        this.btnsPanel.visible = this._swithBottomBar1;
        this.maskimg.visible = this._swithBottomBar1;
    }
    private onShowXianShan(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XianDanMainViewPanel");
    }

    private switchAccount(): void {
        var rebornNotice = [{ text: `是否确定切换账号？`, style: { textColor: 0xe63232 } }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(rebornNotice, function () {
                this.switchJS();
            }, this))
        );
    }
    private switchJS() {
        SDKQuickJS.logout();
    }
    //隐藏下排按钮
    // private _swithBottomBar: boolean = false;
    // private onSwitchBottomBar(): void {
    //     this._swithBottomBar = !this._swithBottomBar;
    //     this.bottom_btn_bar.visible = !this._swithBottomBar;
    //     this.btn_leftarrow.scaleX = this._swithBottomBar ? -1 : 1;
    // }
    //音乐按钮点击事件
    private onTouchSoundCkBtn(): void {
        // var ismute: boolean = this.cb_sound.selected;
        // GameSetting.setLocalSave(GameSetting.SOUND_MUTE, ismute);
        // SoundFactory.playMusic(SoundDefine.SOUND_BGM);
    }
    //主界面初始化 当重新登录时 外部调用
    public onInit(): void {
        if (this.getHeroData().level == 1 && this.getHeroData().exp == 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "Welcome");
        }
        //刘海屏适配
        this.top_back_img.height = 80;
        if (SDKManager.isBangsscreen) {
            this.maininfo_grp.top = 25;
            this.group_topbar.top = 165;
        } else {
            this.maininfo_grp.top = 45;
            this.group_topbar.top = 175;
        }

        this.addMainBtnBar();
        //战斗力动画
        let powerFireAnim = new Animation('UI_zhandouli', -1);
        powerFireAnim.x = 90 - 50;
        powerFireAnim.scaleX = 1.1;
        powerFireAnim.y = 32;
        this.power_info_grp.addChildAt(powerFireAnim, 0);
        //更新头像
        this.onRefreshPlayerHead();
        //更新名字
        this.heroName.text = this.getHeroData().name;
        //更新战斗力
        this.onUpdatePlayerPower();
        this.onupdateExp();
        this.updateCoatard();
        this.onupdateCurrency();
        this.cb_autoFight.selected = GameSetting.getLocalSetting(GameSetting.YEWAI_AUTO_FIGHT);
        this.updateGuideTaskList();
        this.onShowActivity();
        this.addRedPoint();
        Tool.callbackTime(this.onCheckOffLineExp, this, 1000);
        // this.onCheckExplorePoint();
        // Tool.callbackTime(this.onInitREQAllPeopleBoss, this, 1600);

        // if (DataManager.getInstance().welfareManager.isCanShowWelfare()) {
        //     DataManager.getInstance().welfareManager.isOpenWelfare = true;
        //     this.onOpenFirstPayWindow();
        // }

        // Tool.callbackTime(this.onReqShentongBagMsg, this, 2800);
        // this.tlVipShopLayer.visible = false;
        // this.rechargeAboutLayer.visible = false;

        this.trigger();

        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0xFFFFFF, 1);
        shape.graphics.drawRect(0, 0, 480, 136);
        shape.graphics.endFill();
        shape.touchEnabled = false;
        // this.chat_mask.addChild(shape);
        // this.chat_sys.mask = this.chat_mask;
        // this.img_chatShow.visible = false;

        this.updateChatInfoBack();
        this.saveMainviewImage();
        this.setYewaiBarVisible();
        this.registerChongBang();
        this.checkChongBang();

        //离线超过20级
        if (DataManager.getInstance().rechargeManager.firstCharge == 0 && this.getHeroData().level >= 20) {
            this.img_exr.visible = true;
        }
        if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
            //微信收藏游戏更新
            DataManager.getInstance().wxgameManager.onupdateColletionStatus();
            //微信游戏屏蔽IOS充值
            this.refreshIosPayHide();
        }
    }
    //更新主界面屏蔽
    public refreshIosPayHide(): void {
        //IOS屏蔽处理
        if (SDKManager.isHidePay) {
            if (this.left_btns_bar.parent) {
                this.left_btns_bar.parent.removeChild(this.left_btns_bar);
            }
            this.left_btns_bar.visible = false;
            this.vipBtn.visible = false;
            this.money_add_img.visible = false;
            this.gold_add_img.visible = false;
        } else {
            if (!this.left_btns_bar.parent) {
                this.addChild(this.left_btns_bar);
            }
            this.left_btns_bar.visible = true;
            this.vipBtn.visible = true;
            this.money_add_img.visible = true;
            this.gold_add_img.visible = true;
        }
    }
    //筛选出主界面的IMAGE
    private saveMainviewImage(): void {
        for (let i: number = 0; i < this.numChildren; i++) {
            let childObject = this.getChildAt(i);
            LoadManager.getInstance().addMainvewImageAry(childObject);
        }
    }
    //更新头像
    private onRefreshPlayerHead(): void {
        this.playerHead.setHead();
        // this.hero_headIcon.source = GameCommon.getInstance().getBigHeadByOccpation(DataManager.getInstance().playerManager.player.headIndex);
        // var headIcon = SDKManager.loginInfo.avatarUrl;
        // if (headIcon)
        //     this.hero_headIcon.source = headIcon;
        // else
        //     this.hero_headIcon.source = GameCommon.getInstance().getBigHeadByOccpation(DataManager.getInstance().playerManager.player.headIndex);
    }

    private onGiftCDShow() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TOTALRECHARGE);
        // if (this.label_giftCD) {
        //     this.label_giftCD.text = GameCommon.getInstance().getTimeStrForSecHS(time);
        // }
        // time = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.VIPTLSHOP);
        // if (this.label_tlvipShop) {
        //     this.label_tlvipShop.text = GameCommon.getInstance().getTimeStrForSecHS(time);
        // }
        // if (this.tlVipShopLayer) {
        //     var data: ActivityData = DataManager.getInstance().activityManager.activity[ACTIVITY_BRANCH_TYPE.VIPTLSHOP];
        //     if (data && time > 0) {
        //         this.tlVipShopLayer.visible = true;
        //     } else {
        //         this.tlVipShopLayer.visible = false;
        //     }
        // }
    }
    private hideBtnFC() {
        if (DataManager.getInstance().rechargeManager.firstCharge != 0 && this.btn_firstcharge) {
            this.btn_firstcharge.visible = false;
            this.btn_meiri.visible = true;
        }

    }
    private onChangeName() {
        this.heroName.text = this.getHeroData().name;
    }
    public onHideBtnGroup() {
        this._swithBottomBar1 = false;
        this.btnsPanel.visible = this._swithBottomBar1;
        this.maskimg.visible = this._swithBottomBar1;
    }
    private delButtonAnimation(btn: egret.DisplayObjectContainer) {
        var anim: Animation;
        if (btn && btn.getChildByName("Activity_Button_effect")) {
            anim = btn.getChildByName("Activity_Button_effect") as Animation;
            btn.removeChild(anim);
            anim = null;
        }
    }

    /**小聊天框开关**/
    private onTouchBtnShowChat(e: egret.Event): void {
        this.switchShowChatHandler(!this._swithShowChat);
    }
    private _swithShowChat: boolean = true;//false隐藏 true显示
    private _showChatPlaying: boolean = false;
    private switchShowChatHandler(bool: boolean): void {
        if (this._showChatPlaying)
            return;
        this._swithShowChat = bool;
        var leftValue: number = this._swithShowChat ? 41 : -439;
        if (leftValue != this.chat_sys.left) {
            this._showChatPlaying = true;
            var _tween = egret.Tween.get(this.chat_sys);
            _tween.to({ left: leftValue }, 200, egret.Ease.circOut)
                .call(function () {
                    egret.Tween.removeTweens(this.chat_sys);
                    _tween = null;
                    this._showChatPlaying = false;
                }, this);
        }
    }
    //检查离线经验
    private onCheckOffLineExp(): void {
        if (DataManager.getInstance().playerManager.offlineData.exp > 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OffLineExpPanel");
        }
    }

    public showTips(gift): void {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("WanbaGiftPanel", gift)
        );
    }

    /**活动条**/
    private onShowActivity() {
        if (!this.activity) {
            this.activity = new ActivityContainerBar(this.group_topbar);
        }
    }
    /**检测活动按钮**/
    private onCheckActivityBtn() {
        if (this.activity) {
            this.activity.checkActivityBtn();
        }

        this.btn_meiri.visible = false;
        /**判断首充按钮 */
        if (DataManager.getInstance().rechargeManager.firstCharge != 0) {
            if (this.btn_firstcharge) {
                this.btn_firstcharge.visible = false;
            }
            //判断活动是否开启
            var data: ActivityData = DataManager.getInstance().activityManager.activity[ACTIVITY_BRANCH_TYPE.LEIJICHONGZHI];
            if (data) {
                var leijisever = DataManager.getInstance().newactivitysManager.leiji;
                var leijiyuanbao: number = leijisever["atyuanbao"];
                var model: Modelleijichongzhi = JsonModelManager.instance.getModelleijichongzhi()[10];
                if (leijiyuanbao >= model.costNum) {
                    this.btn_meiri.visible = false;
                }
                else {
                    this.btn_meiri.visible = true;
                }
            }

        }
        //判断当前等级首冲group是否显示
        this.recharge_group.visible = false;
        if (this.getHeroData().level >= 50) {
            this.recharge_group.visible = true;
        }

        this.btn_chongbang.visible = false;
        this.btn_chongbang.height = 15;
        //冲榜活动开启&&未购买冲榜帮礼包&&等级超过10
        if (DataManager.getInstance().activityManager.activity[ACTIVITY_BRANCH_TYPE.CHONGBANG_LIBAO]
            && DataManager.getInstance().newactivitysManager.chargeMoneyNum < 300 && this.getHeroData().level >= 10) {
            this.btn_chongbang.visible = true;
            this.btn_chongbang.height = 90;
        }

        //判断月卡是否显示
        this.btn_yueka.visible = false;
        if (this.getHeroData().level >= 20) {
            this.btn_yueka.visible = true;
        }
        //活动冲榜的判定
        this.checkChongBang();
    }
    /**检测bottom_btn_bar按钮**/
    // private bottombar_btns: number[];
    // private onCheckBottomBarBtns(): void {
    //     if (!this.bottombar_btns) {
    //         this.bottombar_btns = [];
    //         var _len: number = this.bottom_btn_bar.numChildren;
    //         for (var i: number = _len - 1; i >= 0; i--) {
    //             var button: egret.DisplayObject = this.bottom_btn_bar.getChildAt(i);
    //             var gotype: number = parseInt(button.name.replace("bottom_", ""));
    //             this.bottombar_btns.push(gotype);
    //         }
    //     }
    //     for (var i: number = 0; i < this.bottombar_btns.length; i++) {
    //         var gotype: number = this.bottombar_btns[i];
    //         var model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[gotype];
    //         var button: egret.DisplayObject = this[`bottom_${gotype}`];
    //         if (!model || !FunDefine.isFunOpen(gotype)) {
    //             if (!button)
    //                 continue;
    //             if (button.parent) {
    //                 button.parent.removeChild(button);
    //             }
    //             button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBottomBtn, this);
    //         } else {
    //             if (!button.parent && model.isGroup != 1) {
    //                 this.bottom_btn_bar.addChild(button);
    //             }
    //             button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBottomBtn, this);
    //         }
    //     }
    // }

    /**检测bottom_btn_bar按钮**/
    // private bottombar_btns1: number[];
    // private onCheckBottomBarBtns1(): void {
    //     if (!this.bottombar_btns1) {
    //         this.bottombar_btns1 = [];
    //         var _len: number = this.bottom_btn_bar1.numChildren;
    //         for (var i: number = _len - 1; i >= 0; i--) {
    //             var button: egret.DisplayObject = this.bottom_btn_bar1.getChildAt(i);
    //             var gotype: number = parseInt(button.name.replace("bottom_", ""));
    //             this.bottombar_btns1.push(gotype);
    //         }
    //     }
    //     for (var i: number = 0; i < this.bottombar_btns1.length; i++) {
    //         var gotype: number = this.bottombar_btns1[i];
    //         var model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[gotype];
    //         var button: egret.DisplayObject = this[`bottom_${gotype}`];
    //         if (!button) continue;
    //         if (!model || !FunDefine.isFunOpen(gotype)) {
    //             if (button.parent) {
    //                 button.parent.removeChild(button);
    //             }
    //             button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBottomBtn, this);
    //         } else {
    //             if (!button.parent) {
    //                 this.bottom_btn_bar1.addChild(button);
    //             }
    //             button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBottomBtn, this);
    //         }
    //     }
    //     var num = this.bottombar_btns1.length / 4;
    //     this.lilian_group.height = 120 * Math.ceil(num);
    // }
    /**GOTYPE前往事件**/
    private onTouchBottomBtn(event: egret.Event): void {
        if (event.currentTarget.name == 'bottom_96') {
            if (DataManager.getInstance().newactivitysManager.blessTp > 10) {
                if (DataManager.getInstance().newactivitysManager.blessTp >= 15) {
                    GameCommon.getInstance().addAlert('明天开启');
                }
                else {
                    GameCommon.getInstance().addAlert((15 - DataManager.getInstance().newactivitysManager.blessTp) + '天后开启');
                }
                return;
            }
        }
        var gotype: number = parseInt(event.currentTarget.name.replace("bottom_", ""));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), gotype);
    }

    private onupdateCurrency(event: egret.Event = null): void {
        this.money_bind.text = GameCommon.getInstance().getFormatNumberShow(this.getHeroData().money);
        this.money_gold.text = GameCommon.getInstance().getFormatNumberShow(this.getHeroData().gold);
        this.vip_label.text = "" + GameCommon.getInstance().getVipName(this.getHeroData().viplevel);
        // var playerdate = this.getHeroData().viplevel;
        // if (playerdate > 2 && this.vip3Btn.parent) {
        //     this.vip3Btn.parent.removeChild(this.vip3Btn);
        // }
    }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.fight_value_label.text = this.getHeroData().playerTotalPower + "";
    }
    //更新经验 人物等级
    public onupdateExp(event: egret.Event = null): void {
        var _isLevelUp: boolean;
        if (event == null) {
            _isLevelUp = true;
        } else {
            _isLevelUp = event.data;
        }

        if (_isLevelUp) {
            this.heroLv.text = this.getHeroData().level + Language.instance.getText("level");
            if (DataManager.getInstance().welfareManager.isCanShowWelfare()) {
                DataManager.getInstance().welfareManager.isOpenWelfare = true;
                // this.onOpenFirstPayWindow();
                // SDKEgretsa.getInstance().newUsersGuideAccount(`达到20级`);
            }
            let channel: EChannel = SDKManager.getChannel();
            if (channel == EChannel.CHANNEL_WANBA && DataManager.getInstance().playerManager.checkDeskPoint() && DataManager.getInstance().playerManager.player.level == 10) {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DeskPanel");
            }
            //暂时先关了
            // this.onCheckBottomBarBtns();
            // this.onCheckBottomBarBtns1();
            this.updateFunOpenTip();
            this.onCheckActivityBtn();
            if (SDKManager.getHandlerAny() && SDKManager.getHandlerAny().uploadGameRoleInfo) {
                SDKManager.getHandlerAny().uploadGameRoleInfo(this.getHeroData(), false);
            }
        }

        // this.heroHp_probar.labelFunction = function (value: number, maximum: number): string {
        //     return Math.floor(value / maximum * 100) + "%";
        // };

        // if (DataManager.getInstance().playerManager.player.level == 1 && DataManager.getInstance().playerManager.player.exp == 0) {
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "WelcomePanel");
        // }
    }
    //更新境界
    private updateCoatard(): void {
    }
    private updateCoatardTask(): void {
    }
    //打开首充
    private onOpenFirstPayWindow(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("WelfarePanel", 1));
    }
    //更新当前关卡进度
    private yewaiBossAnim: Animation;
    private oldYewaiWaveIndex: number;
    private onRefreshWave(): void {
        if (GameFight.getInstance().isJackaroo) {
            this.guide_task_bar.visible = false;
            return;
        } else {
            if (!this.guide_task_bar.visible) {
                this.guide_task_bar.visible = true;
            }
        }
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return;

        let yewaiscene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
        let totalProgress: number = GameFight.getInstance().fightScene.rushData.progress;
        let currProgress: number = Math.min(totalProgress, GameFight.getInstance().yewai_batch);

        //更新进度条
        this.bossAutoBar.maximum = totalProgress;
        this.bossAutoBar.value = currProgress;
        this.bossAutoBar.labelDisplay.visible = false;
        this.yewai_pass_num.text = `第${GameFight.getInstance().yewai_waveIndex}关`;

        let canChallengeBoss: boolean = totalProgress == currProgress;
        if (canChallengeBoss) {
            if (!this.yewaiBossAnim) {
                this.yewaiBossAnim = new Animation("guanqiaboss", -1);
                this.yewaiBossAnim.x = 62;
                this.yewaiBossAnim.y = 50;
            }
            if (!this.yewaiBossAnim.parent) {
                this.yewai_wave_bar.addChildAt(this.yewaiBossAnim, 1);
            }
        } else {
            if (this.yewaiBossAnim && this.yewaiBossAnim.parent) {
                this.yewaiBossAnim.parent.removeChild(this.yewaiBossAnim);
            }
        }

        //判断是不是在打BOSS
        this.onSwitchBtnForYewai(true);
        if (this.oldYewaiWaveIndex != GameFight.getInstance().yewai_waveIndex) {
            this.cb_autoFight.visible = GameFight.getInstance().yewai_waveIndex >= GameDefine.OPEN_AutoFight_Wave;
            this.updateFunOpenTip();
            this.onRefreshYewaiAwardDesc();
            this.oldYewaiWaveIndex = GameFight.getInstance().yewai_waveIndex;
            //微信游戏屏蔽IOS充值
            this.refreshIosPayHide();
        }
    }

    private onRefreshYewaiAwardDesc(): void {
        var str = GameCommon.getInstance().readStringToHtml('第' + `[#32db52${GameFight.getInstance().yewai_waveIndex}]` + '关');
        this.yewai_stageidx_lab.textFlow = (new egret.HtmlTextParser).parser(str)

        str = GameCommon.getInstance().readStringToHtml('经验：' + `[#e7cf7b${GameCommon.getInstance().getFormatNumberShow(GameFight.getInstance().getYewaiExp() * 720)}]` + '/小时');
        this.yewai_exp_award.textFlow = (new egret.HtmlTextParser).parser(str)

        str = GameCommon.getInstance().readStringToHtml('阅历：' + `[#e7cf7b${GameCommon.getInstance().getFormatNumberShow(GameFight.getInstance().getYewaiGold() * 720)}]` + '/小时');
        this.yewai_gold_award.textFlow = (new egret.HtmlTextParser).parser(str)
    }

    //进行挑战野外BOSS
    private trunktaskPlay: boolean;
    private onTouchChallengeBossBtn(): void {
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG)
            return;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "YeWaiChallengePanel");
    }
    /**自动战斗处理**/
    private onTouchAutoFight(event: egret.Event): void {
        var event: egret.Event = new egret.Event(null);
        if (GameFight.getInstance().yewai_waveIndex <= GameDefine.OPEN_AutoFight_Wave) {
            this.cb_autoFight.selected = false;
            GameCommon.getInstance().addAlert(`通关第${GameDefine.OPEN_AutoFight_Wave}关开启自动战斗`);
        }
        event.data = this.cb_autoFight.selected;
        this.onSetAutoFight(event);
    }
    private onSetAutoFight(event: egret.Event): void {
        this.cb_autoFight.selected = event.data ? event.data : false;
        GameSetting.setLocalSave(GameSetting.YEWAI_AUTO_FIGHT, this.cb_autoFight.selected);
    }
    /**点击事件**/
    private onTouchBtnBattle(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "BattlePanel");
    }
    private onTouchJingjie(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TaskBasePanel", TASKPANEL_TAB.COATARDTASK));
    }
    private onTouchRetinue(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RetinueMainPanel");
    }
    private onTouchDSHD(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TimeLimitPlayPanel");
    }
    private onTouchSkill(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SkillPanel");
    }
    private onTouchBtnforge(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ForgePanel");
    }
    private openUnionBattle(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionMainPanel", UnionDefine.TAB_BATTLE));
    }
    private onTouchBtnLegend(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LegendEquipPanel");
    }
    private onTouchBtnChat(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ChatMainPanel");
    }
    private onTouchBtnMail(e: egret.Event): void {
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XianDanMainViewPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MailPanel");
    }
    private onTouchBtnCDK(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "CDKeyPanel");
    }
    private onTouchBtnSysOpt(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PlayerSettingPanel");
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SystemOptPanel");
    }
    private onTouchOffLineExp(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OffLineExpPanel");
    }
    private onTouchUnion(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
    }
    private onTouchDup(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DupPanel");
    }
    private onShowFulingBoss(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FuLingMainViewPanel");
    }
    private onShowZhuXianBoss(e: egret.Event): void {
        if (DataManager.getInstance().newactivitysManager.blessTp > 10) {
            if (DataManager.getInstance().newactivitysManager.blessTp >= 15) {
                GameCommon.getInstance().addAlert('明天开启');
            }
            else {
                GameCommon.getInstance().addAlert((15 - DataManager.getInstance().newactivitysManager.blessTp) + '天后开启');
            }
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ZhuXianBossPanel");
    }
    private onTouchBtnRank(e: egret.Event): void {
        // if (DataManager.getInstance().playerManager.player.level < 30) {
        //     GameCommon.getInstance().addAlert("30级开启");
        //     return;
        // }
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TargetMainPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TOPRankingList");
    }
    private onTouchMiniChat(e: egret.TextEvent): void {
        var _hrefParam: string = e.text;
        if (_hrefParam) {
            ChatDefine.onChatHrefEvent(_hrefParam);
        }
    }
    private onTouchMinChatLayer(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ChatMainPanel");
    }
    private onTouchBtnBoss(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "CrossBarriersPanel");
    }
    private onTouchBtnGotoRecharge(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }
    private onTouchfuli() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_JUBAOPEN);
    }
    private onTouchfc(e: egret.Event) {
        this.img_exr.visible = false;
        var btn = e.currentTarget as eui.Button;
        this.delButtonAnimation(btn);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FirstChargePanel");
    }
    private onTouchyueka(e: egret.Event) {
        var btn = e.currentTarget as eui.Button
        this.delButtonAnimation(btn);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_MONTHCARD);
    }
    private onTouchMeiRi(e: egret.Event) {
        var btn = e.currentTarget as eui.Button
        this.delButtonAnimation(btn);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TakeMoneyEveryDayPanel");
    }
    private onTouchChongbang(e: egret.Event) {
        var btn = e.currentTarget as eui.Button
        this.delButtonAnimation(btn);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_CHONGBANG);
    }
    private onTouchBtnTiangong(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TianGongPanel");
    }
    private onTouchBtnVip3(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ActivitysVip3Panel");
    }
    /**主界面倒计时（不要写太多逻辑）**/
    public onTimeDown(): void {
        // this.onCheckUnionBattleBtn();
        // this.onUpdateKuafuBtnStatus();
    }
    /**更新主界面帮会战按钮**/
    // private checkUnionBattleTime: number = 0;
    // private ubattleBtnIntanvel: number = 600000;//十分钟更新一次
    // private unionbattleState: UNIONBATTLE_STATE;
    // private onCheckUnionBattleBtn(): void {
    //     if (this.checkUnionBattleTime == 0) {
    //         this.checkUnionBattleTime = -1;
    //         Tool.callbackTime(this.onReqestUnionBattleGroupMsg, this, 5000);//5秒后更新
    //     } else if (this.checkUnionBattleTime > 0) {
    //         if (this.unionbattle_btn.parent) {
    //             var lefttime: number = Math.ceil((this.checkUnionBattleTime - egret.getTimer()) / 1000);
    //             lefttime = lefttime < 0 ? 0 : lefttime;
    //             if (this.unionbattleState == UNIONBATTLE_STATE.READY) {
    //                 this.unionbattle_btn.label = GameCommon.getInstance().getTimeStrForSec2(lefttime, false) + "后开启";
    //             } else {
    //                 this.unionbattle_btn.label = "正在进行";
    //             }
    //             if (lefttime == 0) {
    //                 this.onReqestUnionBattleGroupMsg();
    //             }
    //         } else {
    //             if (this.checkUnionBattleTime < egret.getTimer()) {
    //                 this.onReqestUnionBattleGroupMsg();
    //             }
    //         }
    //     }
    // }
    // private onReqestUnionBattleGroupMsg(): void {
    //     this.checkUnionBattleTime = -1;
    //     GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onListenUnionBattleInfoMsg, this);
    //     var unionbattleinfoMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE);
    //     GameCommon.getInstance().sendMsgToServer(unionbattleinfoMsg);
    // }
    // private onListenUnionBattleInfoMsg(): void {
    //     GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_GROUPINFO_MESSAGE.toString(), this.onListenUnionBattleInfoMsg, this);
    //     var unionbattleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
    //     var isShowBtn: boolean = unionbattleInfo && unionbattleInfo.state != UNIONBATTLE_STATE.NOT;
    //     if (isShowBtn) {
    //         if (!this.unionbattle_btn.parent)
    //             this.addChild(this.unionbattle_btn);
    //     } else {
    //         if (this.unionbattle_btn.parent)
    //             this.unionbattle_btn.parent.removeChild(this.unionbattle_btn);
    //     }
    //     if (isShowBtn) {
    //         this.checkUnionBattleTime = unionbattleInfo.timecount;
    //     } else {
    //         this.checkUnionBattleTime = egret.getTimer() + this.ubattleBtnIntanvel;
    //     }
    //     this.unionbattleState = unionbattleInfo ? unionbattleInfo.state : UNIONBATTLE_STATE.NOT;
    // }
    /**红点添加方法**/
    protected points: redPoint[] = RedPointManager.createPoint(21);
    private addRedPoint(): void {
        //角色红点
        // this.points[0].register(this.btn_role, GameDefine.RED_MAIN_POS, this, "checkBtnRolePoint");
        // this.points[1].register(this.btn_forge, GameDefine.RED_MAIN_POS, DataManager.getInstance().forgeManager, "getForgePointShow");
        // this.points[2].register(this.btn_huanling, GameDefine.RED_MAIN_POS, this, "checkBtnBlessPoint");
        // this.points[3].register(this.btn_xianlv, GameDefine.RED_MAIN_POS, this, "checkBtnRetinueBlessPoint");
        // this.points[4].register(this.btn_bag, GameDefine.RED_MAIN_POS, this, "checkBtnBagPoint");
        this.points[0].register(this.btn_jingjie, new egret.Point(110, 10), this, "checkZhuanShengPoint");
        this.points[1].register(this.dup_btn, GameDefine.RED_MAIN_II_POS, this, "checkBtnDupPoint");
        this.points[3].register(this['bottom_47'], GameDefine.RED_CRICLE_STAGE_PRO, this, "checkBtnPetPoint");
        // this.points[9].register(this['bottom_72'], GameDefine.RED_MAIN_II_POS, DataManager.getInstance().celestialManager, "checkEpicTierEquipPoint");
        this.points[4].register(this.btn_mail, new egret.Point(48, 2), this, "checkBtnMailPoint");
        // this.points[5].register(this.btn_friend, new egret.Point(48, 2), this, "checkBtnFriendPoint");
        // this.points[9].register(this.btn_fightSprite, GameDefine.RED_MAIN_II_POS, this, "checkBtnFightSpritePoint");
        this.points[6].register(this['bottom_52'], GameDefine.RED_MAIN_II_POS, DataManager.getInstance().unionManager, "checkUnionRedPoint");
        this.points[7].register(this.funBtn, new egret.Point(75, 10), FunDefine, "checkFunOpenRedPoint");
        // this.points[14].register(this['bottom_70'], GameDefine.RED_MAIN_II_POS, DataManager.getInstance().dragonSoulManager, "checkRedPoint");
        this.points[8].register(this.btn_boss, GameDefine.RED_MAIN_II_POS, this, "checkBossDupRedPoint");
        this.points[9].register(this.btnGrop, GameDefine.RED_MAIN_II_POS, this, "checkBtnsPoint");
        this.points[10].register(this['bottom_71'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().magicManager, "checkMainXyPoint");
        this.points[11].register(this['bottom_87'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().fateManager, "getFatePoint");
        this.points[12].register(this['bottom_89'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().xiandanManager, "getXianShanAllPoint");
        // this.points[13].register(this['serverfight_btn'], GameDefine.RED_TAB_POS, FunDefine, "getCrossServerPoint");
        this.points[14].register(this['bottom_94'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().fuLingManager, "getFulingpoint");
        this.points[15].register(this['bottom_96'], GameDefine.RED_CRICLE_STAGE_PRO, this, "checkBtnZhuXianBoss");
        this.points[16].register(this['bottom_97'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().bagManager, "getAllRnuesPoint");
        this.points[17].register(this['bottom_108'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().playerManager, "oncheckTianshuRP");
        this.points[18].register(this['bottom_110'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().yuanjieManager, "checkRedPoint");
        this.points[19].register(this['bottom_111'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().wuTanManager, "checkRedPoint");
        this.points[20].register(this['bottom_112'], GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().skillEnhantM, "checkSkillEnhantRedp");
    }
    public trigger(isOptimize: boolean = false): void {
        for (var i: number = 0; i < this.points.length; i++) {
            if (isOptimize) {
                if (this.points[i].point && !this.points[i].point.visible) {
                    this.points[i].checkPoint();
                }
            } else {
                this.points[i].checkPoint();
            }
        }
        if (this.activity) {
            this.activity.trigger();
        }
    }
    public checkBtnRolePoint(): boolean {
        if (FunDefine.getTabRolePoint()) return true;
        if (DataManager.getInstance().skillManager.checkMainSkillUp()) return true;
        if (DataManager.getInstance().pulseManager.getCanPulseUpgrade()) return true;
        if (FunDefine.checkSixiangPoint()) return true;
        if (FunDefine.getWuxingRedPoint()) return true;
        if (FunDefine.checkTujianRedPointAll()) return true;
        if (FunDefine.getPsychPoint()) return true;
        return false;
    }
    private checkBtnBlessPoint(): boolean {
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.HORSE)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.CLOTHES)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.WEAPON)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.WING)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.RING)) return true;
        return false;
    }
    public checkBtnBagPoint(): boolean {
        if (DataManager.getInstance().bagManager.getEquipSmeltPointShow()) return true;
        if (DataManager.getInstance().bagManager.getItemCanUsePointShow()) return true;
        return false;
    }
    public checkZhuanShengPoint(): boolean {
        if (DataManager.getInstance().playerManager.checkZhuanShengPoint()) return true;
        if (DataManager.getInstance().taskManager.getChengJiuPoint()) return true;
        return false;
    }
    public checkMarryPoint(): boolean {
        if (DataManager.getInstance().playerManager.player.marriId > 0) {
            if (DataManager.getInstance().ringManager.checkRedPointAll()) return true;
            if (FunDefine.getDupHasTimes(DUP_TYPE.DUP_MARRY)) return true;
            if (FunDefine.getDupHasTimes(DUP_TYPE.DUP_MARRY_EQUIP_SUIT_BOSS)) return true;
            if (DataManager.getInstance().marryManager.divorcePoint()) return true;
            if (DataManager.getInstance().marryManager.checkMarryTreePoint()) return true;
        }
        return false;
    }
    public checkBtnDupPoint(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DUP_CAILIAO)) return false;
        if (FunDefine.DupCailiaoHasTimes()) return true;
        if (FunDefine.DupChallengeHasTimes()) return true;
        if (FunDefine.getDupHasTimes(DUP_TYPE.DUP_ZHUFU)) return true;
        if (FunDefine.getDupHasTimes(DUP_TYPE.DUP_TEAM)) return true;
        if (FunDefine.SixiangDupRedPoint()) return true;
        return false;
    }
    public checkBtnZhuXianBoss(): boolean {
        if (FunDefine.DupZhuXianBossTimes()) return true;
        return false;
    }
    public checkBtnYewaipvpPoint(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_YEWAIPVP)) return false;
        if (DataManager.getInstance().yewaipvpManager.checkEncounterPoint()) return true;
        if (DataManager.getInstance().arenaManager.getLadderPointShow()) return true;
        if (DataManager.getInstance().localArenaManager.getRedPointShow()) return true;
        if (DataManager.getInstance().escortManager.getShowSysRedpoint()) return true;
        return false;
    }
    public checkBtnChallengeBossPoint(): boolean {
        if (DataManager.getInstance().playerManager.checkHasBossAward()) return true;
        return false;
    }
    public checkBtnFightSpritePoint(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FABAO)) return false;
        if (DataManager.getInstance().magicManager.checkMagicUpgradePoint()) return true;
        if (DataManager.getInstance().magicManager.checkMagicAdvancePoint()) return true;
        if (DataManager.getInstance().magicManager.checkMagicTurnplatePoint()) return true;
        return false;
    }
    public checkBtnMailPoint(): boolean {
        if (DataManager.getInstance().mailManager.getCanShowMail()) return true;
        if (this.checkBtnFriendPoint()) return true;
        return false;
    }
    public checkBtnFriendPoint(): boolean {
        if (DataManager.getInstance().friendManager.checkFriendRedPoint() || DataManager.getInstance().chatManager.onCheckPrivateChatRedPoint()) return true;
        return false;
    }
    public checkBtnChatPoint(): boolean {
        if (DataManager.getInstance().chatManager.onCheckChatRedPoint()) return true;
        return false;
    }
    public checkBtnPetPoint(): boolean {
        if (DataManager.getInstance().petManager.onCheckPetRedPoint()) return true;
        return false;
    }
    public checkBtnsPoint(): boolean {
        if (DataManager.getInstance().magicManager.checkMainXyPoint() && this.getHeroData().level >= JsonModelManager.instance.getModelfunctionLv()[71].level) return true;
        if (DataManager.getInstance().fateManager.getFatePoint() && this.getHeroData().level >= JsonModelManager.instance.getModelfunctionLv()[87].level) return true;
        if (this.checkBtnPetPoint()) return true;
        if (DataManager.getInstance().xiandanManager.getXianShanAllPoint() && this.getHeroData().level >= JsonModelManager.instance.getModelfunctionLv()[89].level) return true;
        if (this.checkBtnZhuXianBoss()) return true;
        if (DataManager.getInstance().fuLingManager.getFulingpoint()) return true;
        if (DataManager.getInstance().bagManager.getAllRnuesPoint()) return true;
        if (DataManager.getInstance().bagManager.getAllRnuesPoint()) return true;
        return false;
    }
    public checkBossDupRedPoint(): boolean {
        if (FunDefine.getGerenBossRedPoint()) return true;
        if (FunDefine.getAllPeopleBossRedPoint()) return true;
        if (FunDefine.getSamsaraBossBackAwdRPoint()) return true;
        return false;
    }
    public onVipBtn(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "VipPanel");
    }
    public onFunOpenBtn(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OpenFuncView");
    }
    public onActiveRoleBtn(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ActivateRolePanel");
    }
    private onCompleteJackroo(): void {
        if (!GameFight.getInstance().isJackaroo) {
            this.updateFunOpenTip();
            this.funGroup.visible = true;
            this.setYewaiBarVisible();
        }
    }
    /**新手任务相关**/
    //更新任务列表
    private _guideTaskId: number;
    private updateGuideTaskList(): void {
        let guidetaskData: GuideTaskData = DataManager.getInstance().taskManager.guideTaskData;
        if (!guidetaskData) return;
        if (!guidetaskData.model) {
            if (this.guide_task_bar.parent) {
                this.guide_task_bar.parent.removeChild(this.guide_task_bar);
            }
        } else {
            let model: Modelxinshourenwu = guidetaskData.model;
            if (this._guideTaskId != model.id) {//更新任务
                //更新任务动画
                if (this._guideTaskId > 0) {
                    let taskinfogrp: eui.Group = this['guide_taskinfo_grp'];
                    egret.Tween.removeTweens(taskinfogrp);
                    egret.Tween.get(taskinfogrp).to({ alpha: 0 }, 300, egret.Ease.sineIn).to({ alpha: 1 }, 200, egret.Ease.sineInOut).call(function (): void {
                        egret.Tween.removeTweens(this['guide_taskinfo_grp']);
                    }, this);

                    this.owner.iconToBagEffect(this.guide_awdicon_img);
                }
                if (model.eventType == 119 && !FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE)) {
                    if (DataManager.getInstance().wxgameManager.isFirstShare) {
                        let reward_Msg: Message = new Message(MESSAGE_ID.WXGAME_SHARE_LEVEL_MESSAGE);
                        reward_Msg.setBoolean(true);
                        reward_Msg.setShort(GameDefine.FANGKUAI_FIRST_SHARE_LV);
                        GameCommon.getInstance().sendMsgToServer(reward_Msg);
                    }

                    DataManager.getInstance().taskManager.sendTaskChainCompleteMsg();
                    return;
                }
                //更新奖励
                let awarditem: AwardItem = model.rewards[0];
                let modelthing: ModelThing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id);
                this.guide_awdicon_img.source = modelthing.dropicon;
                this.guide_awdname_lab.text = modelthing.name;
                this.guide_awdname_lab.textColor = GameCommon.getInstance().CreateNameColer(modelthing.quality);
                this.guide_awdnum_lab.text = '×' + awarditem.num;
                //触发任务新手引导
                if (model.jackaroo > 0 && !guidetaskData.isFinish) {
                    Tool.callbackTime(this.owner.onStartOneGuide, this.owner, 500);
                }
                this._guideTaskId = model.id;
            }
            //更新进度
            let totalProgress: number = guidetaskData.model.param;
            let currProgress: number = guidetaskData.progress;
            let tasktitle: string = Language.instance.parseInsertText(model.desc, model.param);
            if (guidetaskData.isFinish) {
                tasktitle = GameCommon.getInstance().readStringToHtml(tasktitle + `[#78FF28(${Language.instance.getText('wancheng2')})]`);

                if (!this.taskAnim) {
                    this.taskAnim = new Animation("renwukuang", -1);
                    this.taskAnim.x = 181;
                    this.taskAnim.y = 83;
                }
                if (!this.taskAnim.parent) {
                    this.taskEffect.addChildAt(this.taskAnim, 1);
                }
            } else {

                if (this.taskAnim && this.taskAnim.parent) {
                    this.taskAnim.parent.removeChild(this.taskAnim);
                }

                tasktitle = GameCommon.getInstance().readStringToHtml(tasktitle + `[#FF5B5B(${guidetaskData.progress}/${model.param})]`);
            }
            this.guide_task_dec.textFlow = Tool.getHtmlITextElement(tasktitle);
        }
    }
    private taskAnim: Animation;
    //点击新手任务栏
    private onTouchGuideTaskBar(): void {
        let guidetaskData: GuideTaskData = DataManager.getInstance().taskManager.guideTaskData;
        if (!guidetaskData || !guidetaskData.model) return;
        if (guidetaskData.isFinish) {
            DataManager.getInstance().taskManager.sendTaskChainCompleteMsg();
            var anim: Animation = new Animation("renwuwancheng", 1, true);
            anim.x = 180;
            anim.y = 85;
            this.taskEffect.addChild(anim);
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), guidetaskData.model.goType);
        }
    }
    /**更新功能开启**/
    private _unopenFuns: ModelfunctionLv[];
    public updateFunOpenTip(): void {
        if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return;
        if (GameFight.getInstance().isJackaroo) return;
        let hasAward: boolean;
        let openFuns: ModelfunctionLv[] = [];
        let isinit: boolean = !this._unopenFuns ? true : false;
        if (isinit) {
            this._unopenFuns = [];
        }
        let functionDict = JsonModelManager.instance.getModelfunctionLv();
        for (let funId in functionDict) {
            let model: ModelfunctionLv = functionDict[funId];
            if (!model) {//model.functionType > 0 暂时屏蔽 用的时候把注释打开就好了
                if (!hasAward && !DataManager.getInstance().playerManager.getFunIsAwarded(model.id)) {
                    hasAward = true;
                }
                if (!FunDefine.isFunOpen(model.id)) {
                    if (isinit) {
                        this._unopenFuns.push(model);
                    }
                } else {
                    if (isinit) continue;
                    // if (model.isGroup == 1) {
                    //this.btnGrop.visible = true;
                    // }
                    let aryIdx: number = this._unopenFuns.indexOf(model);
                    if (aryIdx >= 0) {
                        this._unopenFuns.splice(aryIdx, 1);
                        openFuns.push(model);
                    }
                }
            }
        }
        if (isinit) {
            this._unopenFuns.sort(function (m1, m2) {
                if (FunDefine.funOpenLevel(m1.id) - FunDefine.funOpenLevel(m2.id) < 0) {
                    return -1;
                }
                return 1;
            });
        }
        this.funImage.visible = false;
        if (this._unopenFuns.length == 0) {
            if (hasAward) {
                this.funImage.visible = true;
                this.funBtn.label = '有奖励未领取';
            } else {
                if (this.funGroup.parent) {
                    this.funGroup.parent.removeChild(this.funGroup);
                }
            }
        } else {
            if (openFuns.length > 0) {
                //显示功能开启
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("OpenFunTipsBar", openFuns));
            }
            this.funBtn.icon = this._unopenFuns[0].icon;
            this.funBtn.label = FunDefine.getFunOpenDesc(this._unopenFuns[0].id);
        }
        if (this.points[7]) {
            this.points[7].checkPoint();
        }
    }
    private openfunRequestMsg(funId: number): void {
        switch (funId) {
            case FUN_TYPE.FUN_DUP_CAILIAO:
                DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_CAILIAO);
                break;
            case FUN_TYPE.FUN_DUP_TIAOZHAN:
                DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_CHALLENGE);
                break;
            case FUN_TYPE.FUN_DUP_SIXIANG:
                DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_SIXIANG);
                break;
            case FUN_TYPE.FUN_DUP_ZUDUI:
                DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_TEAM);
                break;
            case FUN_TYPE.FUN_DUP_ZHUFU:
                DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_ZHUFU);
                break;
        }
    }

    public getTargetPointByFuncId(id): egret.Point {
        let point = null;
        let model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[id];
        if (!model) return point;
        switch (model.param) {
            case "RolePanel":
                //角色按钮
                point = this.mainbarUI.btn_role.localToGlobal();
                break;
            case "MagicMainViewPanel":
                //幻灵按钮
                point = this.mainbarUI.btn_huanling.localToGlobal();
                break;
            case "PetMainPanel":
                point = this.mainbarUI.btn_xianlv.localToGlobal();
                break;
            case "ForgePanel":
                //锻造按钮
                point = this.mainbarUI.btn_forge.localToGlobal();
                break;
            case "BagPanel":
                //背包按钮
                point = this.mainbarUI.btn_bag.localToGlobal();
                break;
            case "TaskBasePanel":
                //境界按钮
                point = this.btn_jingjie.localToGlobal();
                break;
            case "CrossBarriersPanel":
                //BOSS按钮
                point = this.btn_boss.localToGlobal();
                break;
            case "YewaiPVPPanel":
                //PVP按钮
                point = this.mainbarUI.btn_fenZheng.localToGlobal();
                break;
            case "DupPanel":
                //副本按钮
                point = this.dup_btn.localToGlobal();
                break;
            case "UnionMainCityPanel":
                //仙盟按钮
                point = this.union_btn.localToGlobal();
                break;
            // case 71:
            // case 47:
            // case 48:
            // case 87:
            // case 94:
            // case 96:
            // case 97:
            //     //历练
            //     point = this.btnGrop.localToGlobal();
            // default:
            //     point = this.btn_role.localToGlobal();
            //     break;
        }
        return point;
    }

    //针对冲榜活动的代码。未成体系化
    private checkChongBang() {
        this.showOrHiddenChongBang(this.mainbarUI.btn_role, false);
        this.showOrHiddenChongBang(this.mainbarUI.btn_huanling, false);
        this.showOrHiddenChongBang(this.mainbarUI.btn_xianlv, false);
        this.showOrHiddenChongBang(this.mainbarUI.btn_forge, false);
        this.showOrHiddenChongBang(this["bottom_72"], false);
        this.showOrHiddenChongBang(this["bottom_47"], false);
        var model: Modeldabiaorewards = DataManager.getInstance().newactivitysManager.dabiao_model;
        if (model) {
            if (model.type >= 0 && model.type <= 4) {
                if (FunDefine.isFunOpen(DataManager.getInstance().playerManager.getBlessFunType(model.type))) {
                    this.showOrHiddenChongBang(this.mainbarUI.btn_huanling, true);
                }
            } else if (model.type >= 5 && model.type <= 9) {
                if (FunDefine.isFunOpen(DataManager.getInstance().playerManager.getBlessFunType(model.type))) {
                    this.showOrHiddenChongBang(this.mainbarUI.btn_xianlv, true);
                }
            } else if (model.type == 10 && FunDefine.isFunOpen(FUN_TYPE.FUN_HONGZHUANG)) {
                this.showOrHiddenChongBang(this["bottom_72"], true);
            } else if (model.type == 11 && FunDefine.isFunOpen(FUN_TYPE.FUN_SIXIANG)) {
                this.showOrHiddenChongBang(this.mainbarUI.btn_role, true);
            } else if (model.type == 12 && FunDefine.isFunOpen(FUN_TYPE.FUN_PULSE)) {
                this.showOrHiddenChongBang(this.mainbarUI.btn_role, true);
            } else if (model.type == 13 && FunDefine.isFunOpen(FUN_TYPE.FUN_PET_LEVEL)) {
                this.showOrHiddenChongBang(this["bottom_47"], true);
            } else if (model.type == 14 && FunDefine.isFunOpen(FUN_TYPE.FUN_BAOSHI)) {
                this.showOrHiddenChongBang(this.mainbarUI.btn_forge, true);
            }
        }
    }

    private showOrHiddenChongBang(tagBtn, show: boolean) {
        if (tagBtn) {
            if (tagBtn.getChildByName("chongbangImg")) {
                tagBtn.getChildByName("chongbangImg").visible = show;
            }
        }
    }

    private registerChongBang() {
        this.addChongBang(this.mainbarUI.btn_role, new egret.Point(-5, -15));
        this.addChongBang(this.mainbarUI.btn_huanling, new egret.Point(-5, -15));
        this.addChongBang(this.mainbarUI.btn_xianlv, new egret.Point(-5, -15));
        this.addChongBang(this.mainbarUI.btn_forge, new egret.Point(-5, -15));
        this.addChongBang(this["bottom_72"], new egret.Point(-5, -5));
        this.addChongBang(this["bottom_47"], new egret.Point(-5, -5));
    }

    private addChongBang(tagBtn, pos: egret.Point) {
        if (tagBtn) {
            // if (!tagBtn.getChildByName("chongbangImg")) {
            //     var img: eui.Image = new eui.Image();
            //     img.source = "activity_chongbang_png";
            //     img.x = pos.x + 10;
            //     img.y = pos.y + 10;
            //     img.name = "chongbangImg";
            //     img.touchEnabled = false;
            //     img.visible = false;
            //     // img.anchorOffsetX = 58 / 2;
            //     // img.anchorOffsetY = 56 / 2;
            //     img.scaleX = img.scaleY = 0.6;
            //     tagBtn.addChild(img);
            // }
        }
    }
    //The end
}