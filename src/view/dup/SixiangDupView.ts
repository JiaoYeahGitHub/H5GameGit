class SixiangDupView extends BaseTabView {
	private desc_lab: eui.Label;
	private awd_stage_lab: eui.Label;
	private reward_grp: eui.Group;
	private fristaward_grp: eui.Group;
	private award_item: GoodsInstance;
	private lefttimes_bar: TimesBar;
	private challenge_btn: eui.Button;
	private reward_btn: eui.Button;
	private history_max_lab: eui.Label;
	private goto_vip: eui.Label;

	private currmodel: Modelsixiangfuben;
	protected points: redPoint[] = RedPointManager.createPoint(1);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SixiangDupViewSkin;
	}
	protected onInit(): void {
		for (let i: number = 0; i < DupDefine.SixiangDup_Drops_Id.length; i++) {
			let instance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(new AwardItem(GOODS_TYPE.ITEM, DupDefine.SixiangDup_Drops_Id[i]));
			this.reward_grp.addChild(instance);
		}
		JsonModelManager.instance.getModelsixiangfuben();
		this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(Language.instance.getText('sixiangwanfa')));
		GameCommon.getInstance().addUnderlineStr(this.goto_vip);
		this.points[0].register(this.reward_btn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, 'checkPassAwardPoint');

		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onRequestDupInfo();
		this.showVipLabel();
	}
	private onReciveMsg(): void {
		this.onUpdateAwards();
		this.onUpdateInfo();
	}
	//去请求副本信息
	private onRequestDupInfo(): void {
		(this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_SIXIANG);
	}
	//副本信息返回
	private onUpdateInfo(): void {
		let dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
		this.lefttimes_bar.data = ['', dupinfo.lefttimes, dupinfo.totalTimes];
		this.challenge_btn.enabled = dupinfo.lefttimes > 0;
		this.reward_btn.enabled = this.currmodel.id <= dupinfo.pass;
		this.history_max_lab.text = Language.instance.parseInsertText('sixiang_lishizuigao', dupinfo.pass - 1);
	}
	//更新领奖的进度
	private onUpdateAwards(): void {
		let dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
		// if (this.currmodel && this.currmodel.id == dupinfo.awardIndex)
		// 	return;
		let _length: number = ModelManager.getInstance().getModelLength('sixiangfuben');
		for (let i: number = dupinfo.awardIndex + 1; i <= _length; i++) {
			let model: Modelsixiangfuben = JsonModelManager.instance.getModelsixiangfuben()[i];
			if (model.firstRewards) {
				this.currmodel = model;
				break;
			}
		}
		if (this.currmodel) {
			let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.currmodel.firstRewards);
			let awardItem: AwardItem = rewards[0];
			this.award_item.visible = true;
			// this.fristaward_grp.visible = true;
			this.award_item.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
			// this.awd_stage_lab.text = '' + this.currmodel.id;
		} else {
			this.award_item.visible = false;
			// this.fristaward_grp.visible = false;
		}
	}
	//发送进入副本协议
	private onChallengeDup(event: egret.Event): void {
		let dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
		GameFight.getInstance().onSendEnterDupMsg(dupinfo.id);
	}
	//领奖协议
	private onReward(): void {
		var rewardMsg: Message = new Message(MESSAGE_ID.GAME_SIXIANG_REWARD_MSG);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onReciveMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_SIXIANG_REWARD_MSG.toString(), this.onReciveMsg, this);
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		this.goto_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoVip, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onUpdateInfo, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_SIXIANG_REWARD_MSG.toString(), this.onUpdateAwards, this);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
		this.reward_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		this.goto_vip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoVip, this);
	}
	private get dupManager(): DupManager {
		return DataManager.getInstance().dupManager;
	}

	private showVipLabel(): void {
		if (DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG].param == 0 && !SDKManager.isHidePay) {
			this.goto_vip.visible = true;
		} else {
			this.goto_vip.visible = false;
		}
	}

	private gotoVip() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_MONTHCARD);
	}

	private checkPassAwardPoint(): boolean {
		let dupinfo: DupInfo = this.dupManager.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
		if (this.currmodel && dupinfo && this.currmodel.id <= dupinfo.pass) {
			return true;
		}
		return false;
	}
	//The end
}