class XianShanBossView extends BaseWindowPanel {
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
	private selectIndex: number;
	private MAX_ITEM_NUM: number = 5;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private itemGroup: eui.Group;
	private allpeopleItems: XianShanBossItem[];
	private boss_scroll: eui.Scroller;
	// private closeBtn2: eui.Button;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XianShanBossViewSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BOSS_PILL_INFO_MESSAGE.toString(), this.onResBossListInfoMsg, this);
		// this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		// this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.onRequsetBossListInfoMsg();
		if (this.bossAnim) {
			this.bossAnim.onReLoad();
		}
	}
	protected onRemove(): void {
		super.onRemove();
		// this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BOSS_PILL_INFO_MESSAGE.toString(), this.onResBossListInfoMsg, this);
		// this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		// Tool.removeTimer(this.runTimerDown, this, 1000);
	}
	protected onInit(): void {
		// (this['tab' + 0] as eui.RadioButton).selected = true;
		this.boss_scroll.verticalScrollBar.autoVisibility = false;
		this.boss_scroll.verticalScrollBar.visible = false;
		// this.itemGroup.useVirtualLayout = true;
		// this.boss_scroll.viewport = this.itemGroup;
		this.allpeopleItems = [];
		super.onInit();
		this.onRefresh();
	}
	private onRequsetBossListInfoMsg(): void {
		let infoRequestMsg: Message = new Message(MESSAGE_ID.BOSS_PILL_INFO_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(infoRequestMsg);
	}
	protected onRefresh(): void {
		super.onRefresh();
	}
	private onResBossListInfoMsg(): void {
		let data: AllPeopleBossData = DataManager.getInstance().dupManager.allpeoplebossData;
		for (var i: number = 0; i < this.allpeopleItems.length; i++) {
			var item: XianShanBossItem = this.allpeopleItems[i];
			if (item) {
				item.btn_challenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, item.onTouchChallengeBtn, item);
				Tool.removeTimer(item.updateRebronTime, item, 1000);
			}
			this.allpeopleItems[i] = null;
			delete this.allpeopleItems[i];
		}
		while (this.itemGroup.numChildren > 0) {
			let display = this.itemGroup.getChildAt(0);
			this.itemGroup.removeChild(display);
		}
		for (let i: number = 0; i < data.xianshanInfos.length; i++) {
			let info: XianShanBossInfo = data.xianshanInfos[i];
			if (!info || info.rebirthTime <= 0) {
				continue;
			}
			let modelfighter: Modelxianshanzhaohuan = JsonModelManager.instance.getModelxianshanzhaohuan()[info.id];
			var item: XianShanBossItem = new XianShanBossItem(modelfighter, info);
			Tool.addTimer(item.updateRebronTime, item, 1000);
			item.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, item.onTouchChallengeBtn, item);
			this.allpeopleItems.push(item)
			this.itemGroup.addChild(item);
			item.y = this.allpeopleItems.length * 160 - 150;
		}
	}
	//The end
}
class XianShanBossItem extends eui.Component {
	public model: Modelxianshanzhaohuan;
	public info: XianShanBossInfo;
	private monster_name_label: eui.Label;
	private monsterIcon_img: eui.Image;
	private bosshp_probar: eui.Label;
	private time_label: eui.Label;
	// private levelLimit_label: eui.Label;
	private joinNum_label: eui.Label;
	public btn_challenge: eui.Button;
	// private unopen_group: eui.Group;
	private award_group: eui.Group;

	public constructor(model: Modelxianshanzhaohuan, bossInfo: XianShanBossInfo) {
		super();
		this.model = model;
		this.once(egret.Event.COMPLETE, this.onInit, this);
		this.skinName = skins.XianDanBossItemSkin;
		this.info = bossInfo;
		this.onUpdate();
	}
	//初始化
	private onInit(): void {
		this.monster_name_label.text = this.bossFightter.name;
		this.monsterIcon_img.source = this.bossFightter.avata + "_icon_png";
		for (var i: number = 0; i < this.model.rewards.length; i++) {
			var waveAward: AwardItem = this.model.rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.scaleX = 0.8;
			goodsInstace.scaleY = 0.8;
			goodsInstace.onUpdate(waveAward.type, waveAward.id, 0, waveAward.quality, waveAward.num);
			this.award_group.addChild(goodsInstace);
		}
	}
	private isOpen: boolean;
	public onUpdate(): void {
		this.bosshp_probar.text = `${Math.min(100, Math.ceil(this.info.leftHp / this.bossFightter.hp * 100))}%`;
		this.isOpen = this.info.rebirthTime > 0;
		this.joinNum_label.text = this.info.guishuName;
		// this.btn_challenge.enabled = this.isOpen;
		// if (!this.isOpen) {
		// 	this.updateRebronTime();
		//     // this.time_label.text = Language.instance.getText(`coatard_level${this.model.limitLevel}`, 'jingjie', 'open');
		// } else {
		// this.updateRebronTime();
		// this.time_label.text = "";
		// }

	}
	private get bossFightter(): Modelfighter {
		return ModelManager.getInstance().getModelFigher(this.model.modelId);
	}
	//倒计时处理
	public updateRebronTime(): void {
		if (this.info && this.isOpen) {
			if (this.info.rebirthTime > 0) {
				this.time_label.text = '剩余时间:' + Tool.getTimeStr(this.info.rebirthTime); //+ Language.instance.getText("houchongsheng");
			}
			else {
				this.time_label.text = Language.instance.getText("houchongsheng");
			}
		}
	}
	//前往挑战
	public onTouchChallengeBtn(event: egret.TouchEvent): void {
		// GameFight.getInstance().onEnterAllPeopleBossScene(this.model.id);
		// let info: XianShanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xianshanInfos[this.selectIndex];
		GameFight.getInstance().onEnterXianShanBossScene(this.info.bossID);
	}

}