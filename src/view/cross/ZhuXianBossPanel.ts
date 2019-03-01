class ZhuXianBossPanel extends BaseTabView {
	private boss_name_lab: eui.Label;
	private reborn_time_lab: eui.Label;
	private belongers_lab: eui.Label;
	private boss_hp_probar: eui.ProgressBar;
	private challenge_btn: eui.Button;
	private reward_grp: eui.Group;
	private unopne_desc_lab: eui.Label;
	private fight_info_grp: eui.Group;
	private boss_avatar_grp: eui.Group;
	private bossAnim: BodyAnimation;
	private challengeNum:eui.Label;
	private desc:eui.Label;
	private desc1:eui.Label;
	private desc2:eui.Label;
	
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ZhuXianBossPanelSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupinfoMsg, this);
		// if (this.bossAnim) {
		// 	this.bossAnim.onReLoad();
		// }
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupinfoMsg, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		Tool.removeTimer(this.runTimerDown, this, 1000);
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onReqDupInfoMsg();
	}
	private onResDupinfoMsg(): void {
        this.onShowInfo();
    }
	private onReqDupInfoMsg(): void {
        var dupinfoReqMsg = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
        dupinfoReqMsg.setByte(DUP_TYPE.DUP_BLESS);
        GameCommon.getInstance().sendMsgToServer(dupinfoReqMsg);
    }
	// private onResBossListInfoMsg(): void {
	// 	Tool.addTimer(this.runTimerDown, this, 1000);
	// }
    private peishiCfg:Modelpeishiboss 
	private onShowInfo(): void {
		var model: Modeldabiaorewards = DataManager.getInstance().newactivitysManager.dabiao_model;
        var tpId = model.type;
            this.peishiCfg= JsonModelManager.instance.getModelpeishiboss()[DataManager.getInstance().newactivitysManager.blessTp];
			if(!this.peishiCfg) 
			{
				this.boss_name_lab.text = '暂未开启';
				return;
			}
			var copyCfg:Modelcopy = JsonModelManager.instance.getModelcopy()[this.peishiCfg.copyId]
			var awardStrAry: string[];
			if (copyCfg.nums.indexOf(";") >= 0) {
            awardStrAry = copyCfg.nums.split(";");
        	}
            var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_BLESS, this.peishiCfg.id);
			var awardstrItem1: string[] = awardStrAry[DataManager.getInstance().playerManager.player.viplevel].split(",");
			var curNum:number =Number(awardstrItem1[0]);
			for (var i: number = 0; i < awardStrAry.length; i++) {
			var awardstrItem: string[] = awardStrAry[i].split(",");
				if(Number(awardstrItem[0])>curNum)
				{
					this.desc.text = '达到vip'+i+GameCommon.getInstance().getVipName(i)+'可增加1次挑战次数';
					break;
				}
				else{
					this.desc.text = '';
				}
			}
			
			var str:string = '';
			let blessData: BlessData = DataManager.getInstance().blessManager.getPlayerBlessData(tpId);
			str = Language.instance.parseInsertText('mountequiploot_2', BlessDefine.BLESS_NAME[tpId])
			this.desc1.textFlow = (new egret.HtmlTextParser).parser(GameCommon.getInstance().readStringToHtml(str));
			if(blessData.grade==0)
			{
				this.desc2.text = Language.instance.getText('mountequiploot_3')
			}
			else
			{
				if(blessData.grade>=BlessDefine.BLESS_DESC_MIN.length)
				{
					str = Language.instance.parseInsertText('mountequiploot_1', BlessDefine.BLESS_NAME[tpId],blessData.grade,BlessDefine.BLESS_DESC_MIN[BlessDefine.BLESS_DESC_MIN.length-1],BlessDefine.BLESS_DESC_MAX[BlessDefine.BLESS_DESC_MIN.length-1])
				}
				else
				{
					if(blessData.grade==1)
					{
					str = '当前[#FFFF00'+BlessDefine.BLESS_NAME[tpId]+']为[#FFFF00]'+blessData.grade+'阶，掉落[#FFFF00'+BlessDefine.BLESS_DESC_MIN[blessData.grade-1]+'星]的装备';
					}
					else
					{
					str = Language.instance.parseInsertText('mountequiploot_1', BlessDefine.BLESS_NAME[tpId],blessData.grade,BlessDefine.BLESS_DESC_MIN[blessData.grade-1],BlessDefine.BLESS_DESC_MAX[blessData.grade-1])
					}
				}
				
				this.desc2.textFlow = (new egret.HtmlTextParser).parser(GameCommon.getInstance().readStringToHtml(str)); 
			}

			let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(this.peishiCfg.bossId);
			this.boss_name_lab.text = modelfighter.name;
			while (this.boss_avatar_grp.numChildren > 0) {
				let display = this.boss_avatar_grp.getChildAt(0);
				if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
					(display as Animation).onDestroy();
				} else {
					this.boss_avatar_grp.removeChild(display);
				}
			}
			var _monsterFightter: Modelfighter = ModelManager.getInstance().getModelFigher(this.peishiCfg.bossId);
			var monsterBodyResUrl: string = LoadManager.getInstance().getMonsterResUrl(_monsterFightter.avata, 'stand', Direction.DOWN + "");
				this.bossAnim = new BodyAnimation(monsterBodyResUrl, -1, Direction.DOWN);
				this.bossAnim.scaleX = 2;
				this.bossAnim.scaleY = 2;
				this.boss_avatar_grp.addChild(this.bossAnim);
			this.reward_grp.removeChildren();
            var awards: AwardItem[];
			awards = GameCommon.getInstance().onParseAwardItemstr(this.peishiCfg.show) 
			for (var i: number = 0; i < awards.length; i++) {
				let awarditem: AwardItem = awards[i];
				let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
				this.reward_grp.addChild(goodsinstance);
			}
			this.onUpdateStatus();
			// this.boss_hp_probar.maximum = modelfighter.hp;
			// this.boss_hp_probar.value = info.leftHp;
	}
	//更新BOSS开启状态
	private _isDeath: boolean;
	private onUpdateStatus(): void {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_BLESS, this.peishiCfg.id);
        var num = dupinfo ? dupinfo.lefttimes : 0;
		this.challengeNum.text  = '剩余次数:'+num;
		let isOpen: boolean = false;
		if (isOpen) {
			this.fight_info_grp.visible = false;
			this.challenge_btn.visible = true;
			this.unopne_desc_lab.text = '';
			this.challenge_btn.enabled = false;
			this.challenge_btn.label = Language.instance.getText('unopen');
		}
	}
	//计时器
	private runTimerDown(): void {
		// let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		// if (info && info.rebirthTime > 0) {
		// 	this.reborn_time_lab.text = Language.instance.getText('fuhuoshijian') + "：" + Tool.getTimeStr(info.rebirthTime);
		// } else if (this.reborn_time_lab.text != '') {
		// 	this.reborn_time_lab.text = '';
		// 	this.onUpdateStatus();
		// }
		// if (this._isDeath) {
		// 	this._isDeath = info.deathLeftTime > 0;
		// 	if (this._isDeath) {
		// 		this.challenge_btn.label = `${Language.instance.getText("reborn")}(${info.deathLeftTime}s)`;
		// 	} else {
		// 		this.onUpdateStatus();
		// 	}
		// }
	}
	//进入血战BOSS副本
	private onChallenge(): void {
		if(!this.peishiCfg)
		return;
        GameFight.getInstance().onSendEnterDupMsg(this.peishiCfg.copyId);
		// let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		// GameFight.getInstance().onEnterXuezhanBossScene(info.id);
	}
	//The end
}