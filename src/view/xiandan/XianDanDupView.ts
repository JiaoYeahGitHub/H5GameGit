class XianDanDupView extends BaseWindowPanel {
	private monsterbody_group: eui.Group;
	private bossPanel: eui.Group;
	private danluPanel: eui.Group;
	private btnLianDan: eui.Button;
	private btnChallenge: eui.Button;
	private danlu_group: eui.Group;
	private progress: eui.ProgressBar;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private param: number;
	private dupId: number;
	private consume_num_label: eui.Label;
	public consume_name_label: eui.Label;
	private cost: AwardItem;
	private curDanNum: eui.Label;
	private curDanNum1: eui.Label;
	private curLv: eui.Label;
	private xiaohao: number;
	private danlu_groupEffect: eui.Group;
	private bossName: eui.Label;
	private danluDesc: eui.Label;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		// this.setTitle("function_open_title_png");
		super.onInit();
		this.progress.slideDuration = 500;
		this.onRefresh()
	}
	protected onSkinName(): void {
		this.skinName = skins.XianDanChallengeSkin;
	}
	
	public onShowWithParam(param): void {
		this.param = param;
		super.onShowWithParam(param);
	}
	private initUI(): void {
		let param = this.param;
		while (this.monsterbody_group.numChildren > 0) {
			let display = this.monsterbody_group.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.monsterbody_group.removeChild(display);
			}
		}
		while (this.danlu_group.numChildren > 0) {
			let display = this.danlu_group.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.danlu_group.removeChild(display);
			}
		}
		var xianshanCfg: Modelxianshan = JsonModelManager.instance.getModelxianshan()[param];
		this.xiaohao = xianshanCfg.caoyao;
		if (DataManager.getInstance().xiandanManager.curLayer - 1 < param) {
			this.bossPanel.visible = true;
			this.danluPanel.visible = false;

			var monsterbody: BodyAnimation;
			if (xianshanCfg.fightId > 0) {
				monsterbody = GameCommon.getInstance().getMonsterBody(monsterbody, xianshanCfg.fightId);
				if (!monsterbody.parent) {
					monsterbody.scaleX = 1.5;
					monsterbody.scaleY = 1.5;
					monsterbody.y = 50;
					this.monsterbody_group.addChild(monsterbody);
				}
			}
			var _monsterFightter: Modelfighter = ModelManager.getInstance().getModelFigher(xianshanCfg.fightId);
			this.bossName.text = _monsterFightter.name;
		} else {
			this.bossPanel.visible = false;
			this.danluPanel.visible = true;
			this.progress.minimum = 0;
			this.progress.maximum = xianshanCfg.times;
			if (this.getPlayer().xianDanRolls[param]) {
				if (Math.floor(this.getPlayer().xianDanRolls[param].chouquNum / xianshanCfg.times) > xianshanCfg.max) {
					this.curLv.text = '悟性 '+xianshanCfg.max + '/' + xianshanCfg.max;
				}
				else {
					this.curLv.text = '悟性 '+Math.floor(this.getPlayer().xianDanRolls[param].chouquNum / xianshanCfg.times) + '/' + xianshanCfg.max;
				}
				this.progress.value = this.getPlayer().xianDanRolls[param].chouquNum % xianshanCfg.times;
			}
			else {
				this.curLv.text = '悟性 '+'0/' + xianshanCfg.max;
				this.progress.value = 0;
			}

			this.curDanNum.text = ' 悟性达到' + xianshanCfg.max + '级可前往下一座仙山';
			this.curDanNum1.text = '悟性每提升一级必定会有丹药奖励';
			let resurl: string = "";
			let _mountBody: Animation = new Animation('xianlu_' + (param + 1));
			switch (xianshanCfg.id) {
				case 0:
					_mountBody.x = 18;
					_mountBody.y = -30;
					break;
				case 1:
					_mountBody.x = 4;
					_mountBody.y = -25;
					break;
				case 2:
					_mountBody.y = -15;
					break;
				case 3:
					_mountBody.y = -30;
					_mountBody.x = 15;
					break;
				case 4:
					_mountBody.y = -30;
					_mountBody.x = 10;
					break;
			}
			this.danlu_group.addChild(_mountBody);
			this.danluDesc.text = Language.instance.getText('danlu_' + (param + 1));
		}
		this.setTitle(xianshanCfg.name);
		this.dupId = xianshanCfg.fightId;
		this.updateGoodsADD();
	}

	protected onRefresh(): void {
		super.onRefresh();
		this.onUpdate();
	}
	private effectStats = 0;
	private onUpdate(): void {
		if (DataManager.getInstance().xiandanManager.stats == 1 || DataManager.getInstance().xiandanManager.stats == 2) {
			this.isFlg = false;
			while (this.danlu_groupEffect.numChildren > 0) {
				let display = this.danlu_groupEffect.getChildAt(0);
				if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
					(display as Animation).onDestroy();
				} else {
					this.danlu_groupEffect.removeChild(display);
				}
			}
			var _mountBody: Animation = new Animation('liandan_1');
			_mountBody.autoRemove = false;
			_mountBody.playNum = 0.5;
			this.effectStats = DataManager.getInstance().xiandanManager.stats;
			this.danlu_groupEffect.addChild(_mountBody);
			_mountBody.y = 0;

			if (this.effectStats == 2) {
				this.effectStats = 0;
				DataManager.getInstance().xiandanManager.stats = 0;
				var _mountBody: Animation = new Animation('liandan_2');
				_mountBody.autoRemove = false;
				_mountBody.playNum = 1;
				_mountBody.playFinishCallBack(this.onAnimFinish1, this)
				this.danlu_groupEffect.addChild(_mountBody);
				_mountBody.y = 50;
			}
			else {
				_mountBody.playFinishCallBack(this.onAnimFinish, this)
			}
		}
		else {
			this.isFlg = true;
		}
		if (this.getPlayer().xianDanRolls[this.param]) {
			var xianshanCfg: Modelxianshan = JsonModelManager.instance.getModelxianshan()[this.param];
			if (Math.floor(this.getPlayer().xianDanRolls[this.param].chouquNum / xianshanCfg.times) > xianshanCfg.max) {
				this.curLv.text = '悟性 '+xianshanCfg.max + '/' + xianshanCfg.max;
			}
			else {
				this.curLv.text = '悟性 '+Math.floor(this.getPlayer().xianDanRolls[this.param].chouquNum / xianshanCfg.times) + '/' + xianshanCfg.max;
			}
			this.progress.maximum = xianshanCfg.times;
			this.progress.value = this.getPlayer().xianDanRolls[this.param].chouquNum % xianshanCfg.times;
		}

		this.updateGoodsADD();
	}
	private onAnimFinish(): void {
		while (this.danlu_groupEffect.numChildren > 0) {
			let display = this.danlu_groupEffect.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.danlu_groupEffect.removeChild(display);
			}
		}
		this.effectStats = 0;
		DataManager.getInstance().xiandanManager.stats = 0;
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "恭喜炼丹时意外获得";
		param.titleSource = "";
		param.itemAwards = DataManager.getInstance().xiandanManager.awards;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardSmallPanel", param));
		this.isFlg = true;
		this.onRefresh();
	}
	private isFlg: boolean = true;
	private onAnimFinish1(): void {
		while (this.danlu_groupEffect.numChildren > 0) {
			let display = this.danlu_groupEffect.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.danlu_groupEffect.removeChild(display);
			}
		}
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "恭喜炼丹成功";
		param.titleSource = "";
		param.itemAwards = DataManager.getInstance().xiandanManager.awards;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardSmallPanel", param));
		this.isFlg = true;
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.initUI();
		this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendChallenge, this);
		this.btnLianDan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendLianDan, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_ROLL_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.XIANSHAN_REFRESH));
		this.btnChallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendChallenge, this);
		this.btnLianDan.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendLianDan, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_ROLL_MESSAGE.toString(), this.onRefresh, this);
	}
	// public onHide(): void {
	// 	super.onHide();
	// 	this.onRemove();
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.XIANSHAN_REFRESH));
	// }
	private updateGoodsADD() {
		this.consume_name_label.text = '草药';

		if (DataManager.getInstance().xiandanManager.energy >= this.xiaohao)
			this.consume_num_label.textColor = 0x00ff00;
		else
			this.consume_num_label.textColor = 0xff0000;
		this.consume_num_label.textFlow = (new egret.HtmlTextParser).parser(DataManager.getInstance().xiandanManager.energy + "/" + this.xiaohao);
	}
	private onSendChallenge(): void {
		GameFight.getInstance().onSendEnterDupMsg(27);
	}
	private onSendLianDan(): void {
		if (this.isFlg) {
			var message = new Message(MESSAGE_ID.PILL_ROLL_MESSAGE);
			message.setShort(this.param)
			GameCommon.getInstance().sendMsgToServer(message);
			this.isFlg = false;
		}

	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
	//The end
}