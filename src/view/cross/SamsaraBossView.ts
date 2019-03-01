class SamsaraBossView extends BaseTabView {
	private challenge_btn: eui.Button;
	private loop_award_btn: eui.Button;
	private zhaohui_btn: eui.Button;
	// private loop_award_label: eui.Label;
	private itemGroup: eui.Group;
	private boss_scroll: eui.Scroller;
	private label_coatard_name: eui.Label;
	private curr_coatard_lv: eui.BitmapLabel;
	private curr_coatard_name: eui.Image;
	private gotocoatard_lab: eui.Label;
	private desc_lab: eui.Label;
	private open_time_lab: eui.Label;

	private samsaraItems: SamsaraBossItem[];
	protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SamsaraBossViewSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SAMSARA_BOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.loop_award_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openAwardsPanel, this);
		this.gotocoatard_lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoCoatardPanel, this);
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
		this.zhaohui_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onshowZhaohuiPanel, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SAMSARA_BOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
		this.loop_award_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openAwardsPanel, this);
		this.gotocoatard_lab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoCoatardPanel, this);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
		this.zhaohui_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onshowZhaohuiPanel, this);
		for (var i: number = 0; i < this.samsaraItems.length; i++) {
			var item: SamsaraBossItem = this.samsaraItems[i];
			item.onDestory();
		}
		Tool.removeTimer(this.rebornTimeDown, this, 1000);
	}
	protected onInit(): void {
		// this.loop_award_label.text = Language.instance.getText("chakanjiangli");
		// GameCommon.getInstance().addUnderline(this.loop_award_label);
		this.gotocoatard_lab.text = Language.instance.getText("goto", 'jingjie');
		GameCommon.getInstance().addUnderlineStr(this.gotocoatard_lab);
		this.desc_lab.text = Language.instance.getText('jingjiebossguize');
		this.open_time_lab.text = Language.instance.getText('jingjiebosstimedesc');
		this.samsaraItems = [];
		var bossmodellist = JsonModelManager.instance.getModelboss();
		for (var id in bossmodellist) {
			var modelSamsaraBoss: Modelboss = bossmodellist[id];
			var item: SamsaraBossItem = new SamsaraBossItem(modelSamsaraBoss);
			this.samsaraItems.push(item);
		}

		this.points[0].register(this.zhaohui_btn, GameDefine.RED_BTN_POS, FunDefine, "getSamsaraBossBackAwdRPoint");

		super.onInit();
		this.onRefresh();
	}
	public onRefresh(): void {
		var coatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
		// this.curr_coatard_lv.text = Tool.toChineseNum(coatardLv);
		// this.curr_coatard_name.source = `coatard_tier_${coatardLv}_png`;
		// let model: Modellevel2coatardLv = JsonModelManager.instance.getModellevel2coatardLv()[coatardLv - 1];
		// this.label_coatard_name.text = coatardLv + "阶·" + model.name;
		// DataManager.getInstance().dupManager.requstSamsareBossInfoMsg();
		for (var i: number = 0; i < this.samsaraItems.length; i++) {
			var item: SamsaraBossItem = this.samsaraItems[i];
			item.onShow(this.itemGroup);
			item.onUpdate();
		}
	}
	private onResBossListInfoMsg(): void {
		if (DataManager.getInstance().dupManager.samsarebossData.openLefttime > 0) {
			FunDefine.isSamsaraOpen = false;
			this.challenge_btn.enabled = false;
		} else {
			FunDefine.isSamsaraOpen = true;
			this.challenge_btn.enabled = true;
			if (DataManager.getInstance().dupManager.samsarebossData.rebornLefttime > 0) {
				this.rebornlefttime = DataManager.getInstance().dupManager.samsarebossData.rebornLefttime;
				Tool.addTimer(this.rebornTimeDown, this, 1000);
			}
		}
		this.zhaohui_btn.enabled = FunDefine.getSamsaraBossBackAwdRPoint();
	}
	//复活倒计时
	private rebornlefttime: number;
	private rebornTimeDown(): void {
		if (this.rebornlefttime == 0) {
			this.challenge_btn.label = Language.instance.getText("challenge");
			Tool.removeTimer(this.rebornTimeDown, this, 1000);
		} else {
			this.challenge_btn.label = `${Language.instance.getText("reborn")}(${this.rebornlefttime}s)`;
			this.rebornlefttime--;
		}
	}
	//查看奖励
	private openAwardsPanel(evnet: egret.TouchEvent): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SamsaraAwardPanel");
	}
	//前往境界面板
	private gotoCoatardPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TaskBasePanel", TASKPANEL_TAB.COATARDTASK));
	}
	//打开找回面板
	private onshowZhaohuiPanel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SamsaraBossBackAwdPanel");
	}
	//进入转生BOSS战斗
	private touchTime: number;
	public onTouchChallengeBtn(e: egret.Event): void {
		if (this.rebornlefttime > 0) {
			GameFight.getInstance().onBossFightReborn();
			return;
		}
		if (this.touchTime > egret.getTimer()) {
			GameCommon.getInstance().addAlert('error_tips_78');
			return;
		}
		this.touchTime = egret.getTimer() + 2000;
		GameFight.getInstance().onEnterSamsaraBossScene();
	}
	//The end
}
class SamsaraBossItem extends BaseComp {
	public model: Modelboss;
	private name_img: eui.Image;
	private boss_itemcell_img: eui.Image;
	private state_lab: eui.Label;
	private locked_bg: eui.Image;
	private limit_lv_lab: eui.Label;
	private label_name: eui.Label;
	private state_tips_grp: eui.Group;
	private looprank_label: eui.Label;
	private awardicon: GoodsInstance;

	private imgFrame: eui.Image;
	private imgTitleBG: eui.Image;
	private imgStateBG: eui.Image;

	constructor(model: Modelboss) {
		super();
		this.model = model;
	}
	protected onInit(): void {
		if (this.model) {
			this.onUpdate();
		}
		this.looprank_label.text = Language.instance.getText(`shangcipaihang`);
		GameCommon.getInstance().addUnderlineStr(this.looprank_label);
	}
	protected setSkinName(): void {
		this.skinName = skins.SamsaraBossItemSkin;
	}
	protected onRegist(): void {
		this.looprank_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBeforeKillLog, this);
	}
	protected onRemove(): void {
		this.looprank_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBeforeKillLog, this);
	}
	public onUpdate(): void {
		if (!this.isLoaded) return;

		//this.limit_lv_lab.text = "" + this.model.limitLevel;
		let monsterFigtter: Modelfighter = ModelManager.getInstance().getModelFigher(this.model.modelId);
		//this.name_img.source = `cross_samsara_title${this.model.id}_png`;
		this.boss_itemcell_img.source = `samsara_item${this.model.id}_open_png`;
		this.label_name.text = this.model.limitLevel + "阶·" + monsterFigtter.name;
		let waveAward: AwardItem = GameCommon.parseAwardItem(this.model.yulan);
		this.awardicon.onUpdate(waveAward.type, waveAward.id);
		let coatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
		let curr_boss_id: number = 0;
		for (var id in JsonModelManager.instance.getModelboss()) {
			var modelSamsaraBoss: Modelboss = JsonModelManager.instance.getModelboss()[id];
			if (modelSamsaraBoss.limitLevel > coatardLv) {
				break;
			} else {
				curr_boss_id = modelSamsaraBoss.id;
			}
		}
		let samsarebossData: SamsaraBossData = DataManager.getInstance().dupManager.samsarebossData;
		if (curr_boss_id == this.model.id) {
			let bossstate: SAMSARABOSS_STATE = SAMSARABOSS_STATE.UNOPEN;
			let bossinfos: number[] = samsarebossData.bossLifes[curr_boss_id];
			if (bossinfos && bossinfos.length > 0 && samsarebossData.openLefttime <= 0) {
				let bossLeftHp: number = bossinfos[1];
				bossstate = bossLeftHp > 0 ? SAMSARABOSS_STATE.FIGHTTING : SAMSARABOSS_STATE.KILLED;
			}
			switch (bossstate) {
				case SAMSARABOSS_STATE.UNOPEN:
					//this.state_lab.textColor = 0x870F10;
					this.state_lab.text = Language.instance.getText('unopen');
					break;
				case SAMSARABOSS_STATE.FIGHTTING:
					//this.state_lab.textColor = 0x870F10;
					this.state_lab.text = Language.instance.getText('tiaozhanzhong');
					break;
				case SAMSARABOSS_STATE.KILLED:
					//this.state_lab.textColor = 0x870F10;
					this.state_lab.text = Language.instance.getText('yijisha');
					break;
			}
			//this.locked_bg.visible = false;
			this.setLock(false);
			this.state_tips_grp.visible = true;
		} else {
			//this.locked_bg.visible = true;
			this.setLock(true);

			if (this.model.limitLevel > coatardLv) {
				this.state_lab.text = Language.instance.getText(`coatard_level${this.model.limitLevel}`, 'open');
				this.state_tips_grp.visible = true;
			} else {
				this.state_tips_grp.visible = false;
			}
		}
	}

	private setLock(isLock: boolean) {
		this.locked_bg.visible = isLock;
		this.imgFrame.source = isLock ? "samsara_item_frame_gray_png" : "samsara_item_frame_png";
		this.imgTitleBG.source = isLock ? "samsara_item_title_bg_gray_png" : "samsara_item_title_bg_png";
		this.imgStateBG.source = isLock ? "samsara_item_wkq_gray_png" : "samsara_item_wkq_png";
	}

	public onShowBeforeKillLog(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("SamsaraBossKillLogPanel", new SamsaraBossKillLogParam(this.model.id)));
	}
	//The end
}
//转生BOSS找回奖励面板
class SamsaraBossBackAwdPanel extends BaseWindowPanel {
	private mini_explain_label: eui.Label;
	private zhaohui_awd_grp: eui.Group;
	private zhaohui_sure_btn: eui.Button;
	private label_r: eui.Label;

	private BACK_AWD_GOLD: number = 50;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SamsaraBossZhaohuiViewSkin;
	}
	protected onInit(): void {
		this.setTitle("找回奖励");
		this.mini_explain_label.text = Language.instance.getText('zhaohui_text');
		this.label_r.text = Constant.get(Constant.REIN_CALL_BACK);
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let curr_boss_id: number = 0;
		for (let id in JsonModelManager.instance.getModelboss()) {
			let modelSamsaraBoss: Modelboss = JsonModelManager.instance.getModelboss()[id];
			if (modelSamsaraBoss.limitLevel > DataManager.getInstance().playerManager.player.coatardLv) {
				break;
			} else {
				curr_boss_id = modelSamsaraBoss.id;
			}
		}
		let bossReaward: Modelbossrewards = JsonModelManager.instance.getModelbossrewards()[curr_boss_id];
		let rewardItems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(bossReaward["canyuReward"]);
		this.zhaohui_awd_grp.removeChildren();
		for (let n: number = 0; n < rewardItems.length; n++) {
			let awarditem: AwardItem = rewardItems[n];
			let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.zhaohui_awd_grp.addChild(goodsInstace);
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.zhaohui_sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackAward, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.zhaohui_sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackAward, this);
	}
	private onBackAward(): void {
		if (DataManager.getInstance().playerManager.player.gold < this.BACK_AWD_GOLD) {
			GameCommon.getInstance().addAlert('error_tips_2');
			return;
		}

		let backawdMsg: Message = new Message(MESSAGE_ID.SAMSARA_BOSS_BACKAWD_MSG);
		GameCommon.getInstance().sendMsgToServer(backawdMsg);

		this.onTouchCloseBtn();
	}
}