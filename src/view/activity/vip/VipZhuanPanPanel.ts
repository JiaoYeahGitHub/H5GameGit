class VipZhuanPanPanel extends BaseTabView {
	private disc_outside: eui.Image;
	private btn_turn: eui.Button;
	private label_points: eui.Label;
	private img_cons: eui.Image;
	private isRun: boolean = false;
	private playLayer: eui.Group;
	private currHasNum: number[];
	private model: Modelzhuanpanvip;
	private week_times_lab: eui.Label;
    private reward_week_btn: eui.Button;
	private WEEK_AWD_MAX: number = 5;
	private consumItem: ConsumeBar;
	private nbItem:eui.Group;
	private effectGroup:eui.Group;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.VipZhuanPanSkin;
		// this.setTitle("zizunZhuanPanTitle_png");
	}
	protected onInit(): void {
		var item: FSTreasureItem;
		this.model = JsonModelManager.instance.getModelzhuanpanvip()[1];
		super.onInit();
		this.currHasNum = [];
		this.points[0].register(this.reward_week_btn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().festivalWuYiManager, "checkTreasurePoint");
        let weekAwdParams: string[] = this.model.box.split("#");
		for (let i: number = 0; i < 5; i++) {
            let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
            if (!params) break;
            let count: number = parseInt(params[0]);
            (this[`award_times_lab${i}`] as eui.Label).text = Language.instance.getText(count, 'times');
            (this[`award_box_img${i}`] as eui.Image).name = params[1];
            (this[`award_box_img${i}`] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
        }
		let itemParams: string[] = this.model.show.split("#");
		for (let i: number = 0; i < 8; i++) {
            let params: string[] = itemParams[i] ? itemParams[i].split(",") : null;
            if (!params) break;
            let count: number = parseInt(params[0]);
            (this[`itemBtn${i}`] as eui.Image).name = params[1];
            (this[`itemBtn${i}`] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        }

		
		while (this.effectGroup.numChildren > 0) {
			let display = this.effectGroup.getChildAt(0);
                if (egret.is(display, "Animation")) {
                    (display as Animation).onDestroy();
                } 
				else
				{
					this.effectGroup.removeChild(display);
				}
		        }
                let _mountBody: Animation = new Animation('vipzhuanpan');
					_mountBody.x = 55;
					_mountBody.y = 75;
                    this.effectGroup.addChild(_mountBody);
	    this.effectGroup.visible = true;
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_turn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		this.reward_week_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);

		
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ROLL_PLATE_REWARD.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIP_ROLL_PLATE.toString(), this.onTreasureBackMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.reward_week_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		this.btn_turn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ROLL_PLATE_REWARD.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIP_ROLL_PLATE.toString(), this.onTreasureBackMsg, this);
	}
	private _vipNum:number = 0;
	protected onRefresh(): void {
		this.effectGroup.visible = false;
		this.onUpdateWeekAward();
		this.onShowTurnplate();
		var vipCfg :Modelvip 
		if(this.getPlayerData().viplevel==0)
		{
		this.week_times_lab.text = "0";
		this.label_points.text = '剩余次数:0';
		return;
		}
		else
		{
		vipCfg	= JsonModelManager.instance.getModelvip()[this.getPlayerData().viplevel-1]
		}
		var arr = vipCfg.weals.split("#");
		for (var i:number = 0; i < arr.length; i++) {
			var tps = arr[i].split(',');
			if(Number(tps[0]) == 11)
			{
			this._vipNum = Number(tps[1]);
			this.label_points.text = '剩余次数:'+(this._vipNum-DataManager.getInstance().vipManager.curDayzhuanpanNum);
			}
		}
		this.week_times_lab.text = "" + DataManager.getInstance().vipManager.zhuanpanNum;
	}
	private onTouchBtnAward(): void {
        let message: Message = new Message(MESSAGE_ID.ROLL_PLATE_REWARD);
        GameCommon.getInstance().sendMsgToServer(message);
    }
	private onPlayDone1() {
	}
	private onPlayDone() {
		this.onShowAward();
	}
	 //更新周奖励
    private onUpdateWeekAward(): void {
        this.reward_week_btn.enabled = false;
        let manager:VipManager = DataManager.getInstance().vipManager;
        let model: Modelzhuanpanvip = JsonModelManager.instance.getModelzhuanpanvip()[1];
        let weekAwdParams: string[] = model.box.split("#");
        for (let i: number = 0; i < this.WEEK_AWD_MAX; i++) {
            let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
            if (!params) break;
            let times: number = parseInt(params[0]);
            let boxImg: eui.Image = (this[`award_box_img${i}`] as eui.Image);
            let animgrp: eui.Group = (this[`reward_anim_grp${i}`] as eui.Group);
			let count: number = parseInt(params[0]);
			(this[`award_times_lab${i}`] as eui.Label).text = Language.instance.getText(count, 'times');
            animgrp.removeChildren();
            if (manager.treasureAwdIdx >= times) {
                boxImg.source = 'treasure_box_open_png';
            } else {
                boxImg.source = 'treasure_box_unopen_png';
                if (manager.zhuanpanNum >= times) {
                    if (!this.reward_week_btn.enabled) {
                        this.reward_week_btn.enabled = true;
                    }
                    GameCommon.getInstance().addAnimation('baoxiangtixing', null, animgrp, -1);
                }
            }
        }
    }
	private onTouchItem(event: egret.Event): void {
        var img: eui.Image = event.currentTarget as eui.Image;

		let itemParams: string[] = this.model.show.split("#");
		for (let i: number = 0; i < 8; i++) {
            let params: string[] = itemParams[i] ? itemParams[i].split(",") : null;
            if (!params) break;
            if(img.name ==params[1] ) 
			{
				var model = GameCommon.getInstance().getThingModel(params[0], params[1]);
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.ITEM, model, 0))
			);
			return;
			}
        }
		
		
        
    }
	private onTouchBox(event: egret.Event): void {
        var img: eui.Image = event.currentTarget as eui.Image;
        var box: Modelbox = JsonModelManager.instance.getModelbox()[img.name];
        var base = new ThingBase(GOODS_TYPE.BOX);
        base.onupdate(img.name, box.quality, 0);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
        );
    }
	//抽奖返回
    private onTreasureBackMsg(): void {
		this.onRotateback();
    }
	private onShowAward(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.model.show)
			for (var i:number = 0; i < _rewards.length; i++) {
				if(DataManager.getInstance().vipManager.zhuanpanId ==_rewards[i].id&& DataManager.getInstance().vipManager.zhuanpanType==_rewards[i].type && DataManager.getInstance().vipManager.zhuanpanAwardNum==_rewards[i].num)
				{
					var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type) - this.currHasNum[i];
					if (add > 0) {
					var model = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
					GameCommon.getInstance().onGetThingAlert(model, add, GOODS_CHANGE_TYPE.DELAY_ADD);
					}
				}
		}
	}
	private onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			this.effectGroup.visible = false;
			var arr = this.model.show.split("#");
			var i: number = 0;
			var param;
			var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.model.show)
			for (i = 0; i < _rewards.length; i++) {
				if(DataManager.getInstance().vipManager.zhuanpanId ==_rewards[i].id&& DataManager.getInstance().vipManager.zhuanpanType==_rewards[i].type && DataManager.getInstance().vipManager.zhuanpanAwardNum==_rewards[i].num)
				{
				var RotationLong;
				RotationLong = this.getRotationLong(8, 6, 5,i, 1);//获取总长度
				egret.Tween.get(this.effectGroup).to({ rotation: RotationLong }, 3500, egret.Ease.sineInOut).call(this.onPlayDone1, this).wait(1000).call(this.onReady1, this);
				egret.Tween.get(this.disc_outside).to({ rotation: RotationLong }, 3500, egret.Ease.sineInOut).call(this.onPlayDone, this).wait(3500).call(this.onReady, this);
				return;
				}
				
			}
			
			
		}
	}
	//获取总长度函数
	private getRotationLong(Scores, Qmin, Qmax, Location, direction: number = 1) {
		var _location = (360 / Scores) * Location * direction;//目标奖区的起始点
		var _q = 360 * (Math.floor(Math.random() * (Qmax - Qmin)) + Qmin) * direction;//整圈长度
		return _q + _location;
	}
	private onTouchBtnTurn(): void {
		if (this.isRun) return;
		// this.onRotateback();
		var message = new Message(MESSAGE_ID.VIP_ROLL_PLATE);
		// message.setByte(1);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onReady1(): void {
		this.effectGroup.visible = true;
	}
	private onReady(): void {
		this.effectGroup.visible = false;
		this.onRefresh();
	}
	private onShowTurnplate(): void {
		this.isRun = false;
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.model.show)
		var arr = this.model.show.split("#");
		var i: number = 0;
		var param;
		
		for (i = 0; i < _rewards.length; i++) {
			var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[i].id, _rewards[i].type);
			this.currHasNum[i] = add;

			var iconModel = GameCommon.getInstance().getThingModel(_rewards[i].type, _rewards[i].id);
			(this[`img_icon${i}`] as eui.Image).source = iconModel.icon;
			(this[`label_num${i}`] as eui.Label).text = 'X'+_rewards[i].num;
		}
		
	}
	private getPlayerData() {
		return DataManager.getInstance().playerManager.player;
	}
	
}