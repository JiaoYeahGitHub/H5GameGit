class XuezhanBossView extends BaseTabView {
	private boss_name_lab: eui.Label;
	private reborn_time_lab: eui.Label;
	private belongers_lab: eui.Label;
	private boss_hp_probar: eui.ProgressBar;
	private challenge_btn: eui.Button;
	private reward_grp: eui.Group;
	private unopne_desc_lab: eui.Label;
	private fight_info_grp: eui.Group;
	private boss_avatar_grp: eui.Group;
	private reborn_time_bg:eui.Image;
	private bossAnim: BodyAnimation;
	private selectIndex: number;
	private MAX_ITEM_NUM: number = 5;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XuezhanBossViewSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		this.onRequsetBossListInfoMsg();
		if (this.bossAnim) {
			this.bossAnim.onReLoad();
		}
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		Tool.removeTimer(this.runTimerDown, this, 1000);
	}
	protected onInit(): void {
		(this['tab' + 0] as eui.RadioButton).selected = true;
		super.onInit();
	}
	private onRequsetBossListInfoMsg(): void {
		let infoRequestMsg: Message = new Message(MESSAGE_ID.XUEZHANBOSS_LISTINFO_MSG);
		GameCommon.getInstance().sendMsgToServer(infoRequestMsg);
	}
	private onResBossListInfoMsg(): void {
		let data: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
		for (let i: number = 0; i < this.MAX_ITEM_NUM; i++) {
			let info: XuezhanBossInfo = data.xuezhanInfos[i];
			if (!info) break;
			let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(info.bossID);
			let tabbtn: eui.RadioButton = this['tab' + i];
			tabbtn.label = modelfighter.name;
			tabbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}

		if (Tool.isNumber(this.selectIndex)) {
			let selectIndex: number = this.selectIndex;
			this.selectIndex = null;
			this.onchangeTab(selectIndex);
		} else {
			this.onchangeTab(0);
		}

		Tool.addTimer(this.runTimerDown, this, 1000);
	}
	private onTouchTab(event: egret.Event): void {
		let radioBtn: eui.RadioButton = event.currentTarget as eui.RadioButton;
		this.onchangeTab(radioBtn.value);
		this.runTimerDown();
	}
	private onchangeTab(index: number): void {
		if (this.selectIndex != index) {
			this.selectIndex = index;
			let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[index];
			let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(info.bossID);
			this.boss_name_lab.text = modelfighter.name;
			this.belongers_lab.text =  info.guishuName ? info.guishuName : '暂无';
			this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, info.bossID);
			if (!this.bossAnim.parent) {
				this.boss_avatar_grp.addChild(this.bossAnim);
			}
			
			this.reward_grp.removeChildren();
			for (let i: number = 0; i < info.model.rewards.length; i++) {
				let awarditem: AwardItem = info.model.rewards[i];
				let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
				this.reward_grp.addChild(goodsinstance);
			}
			this.boss_hp_probar.maximum = modelfighter.hp;
			this.boss_hp_probar.value = info.leftHp;
			this.onUpdateStatus();
		}
	}
	//更新BOSS开启状态
	private _isDeath: boolean;
	private onUpdateStatus(): void {
		let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		let isOpen: boolean = info.rebirthTime == 0;
		if (isOpen) {
			this.challenge_btn.enabled = true;
			let funcid: number = parseInt(this['layer_tab' + this.selectIndex].name);
			if (!FunDefine.isFunOpen(funcid)) {
				this.challenge_btn.visible = false;
				this.unopne_desc_lab.text = Language.instance.getText('xianlv', `bless${info.model.type}_name`, 'open', 'fangketiaozhan');
			} else {
				this.unopne_desc_lab.text = '';
				this._isDeath = info.deathLeftTime > 0;
				this.challenge_btn.visible = true;
				this.fight_info_grp.visible = true;
				if (!this._isDeath) {
					this.challenge_btn.enabled = true;
					this.challenge_btn.label = Language.instance.getText('challenge');
				} else {
					this.challenge_btn.enabled = false;
					this.challenge_btn.label = `${Language.instance.getText("reborn")}(${info.deathLeftTime}s)`;
				}
			}
		} else {
			this.fight_info_grp.visible = false;
			this.challenge_btn.visible = true;
			this.unopne_desc_lab.text = '';
			this.challenge_btn.enabled = false;
			this.challenge_btn.label = Language.instance.getText('unopen');
		}
	}
	//计时器
	private runTimerDown(): void {
		let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		if (info && info.rebirthTime > 0) {
			this.reborn_time_lab.text = Language.instance.getText('fuhuoshijian') + "：" + Tool.getTimeStr(info.rebirthTime);
			this.reborn_time_bg.visible = true;
		} else if (this.reborn_time_lab.text != '') {
			this.reborn_time_lab.text = '';
			this.reborn_time_bg.visible = false;
			this.onUpdateStatus();
		}
		if (this._isDeath) {
			this._isDeath = info.deathLeftTime > 0;
			if (this._isDeath) {
				this.challenge_btn.label = `${Language.instance.getText("reborn")}(${info.deathLeftTime}s)`;
			} else {
				this.onUpdateStatus();
			}
		}
	}
	//进入血战BOSS副本
	private onChallenge(): void {
		let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		GameFight.getInstance().onEnterXuezhanBossScene(info.id);
	}
	//The end
}