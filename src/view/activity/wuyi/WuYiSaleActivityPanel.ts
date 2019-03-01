class WuYiSaleActivityPanel extends BaseTabView {
	private disc_outside: eui.Group;
	private curSelectBox: eui.Image;
	private btn_Buy: eui.Button;
	private award_grp:eui.Group;
    private descLable:eui.Label;
	private loginActCfg:Modeltehuilibaohuodong;
	private effect:eui.Group;
	private _mountBody:Animation;
	private label_points1:eui.Label;
	private timeLab:eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuyiSaleActivitySkin;
	}
	protected onInit(): void {
		super.onInit();
                this._mountBody= new Animation('tehuilibao');
				this._mountBody.y = 95;
				this.effect.addChild(this._mountBody);
				this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_Buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		 for (var i: number = 1; i < 5; i++) {
            this['icon'+i].name = i;
            this['icon'+i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        }
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		for (var i: number = 1; i < 5; i++) {
            this['icon'+i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        }
		this.btn_Buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
		this.examineCD(false);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.WUYIACTIVITY);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
			// this.owner.onTimeOut();
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private tabIdx:number = 1;
	protected onRefresh(): void {
		this.onShowAward(this.tabIdx);
	}
	private onShowAward(idx:number):void{
		this._mountBody.x = (idx-1)*152+74;
		this.loginActCfg = JsonModelManager.instance.getModeltehuilibaohuodong()[idx];
		var rewards: AwardItem[] = this.loginActCfg.rewards;
		while (this.award_grp.numChildren > 0) {
			let display = this.award_grp.getChildAt(0);
				this.award_grp.removeChild(display);
		}
		for (var i: number = 0; i < rewards.length; i++) {
			var goodsItem: GoodsInstance = new GoodsInstance();
			var awardItem: AwardItem = rewards[i];
			goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
			this.award_grp.addChild(goodsItem);
		}
		// let desc :Array<egret.ITextElement> = new Array<egret.ITextElement>();
        //             desc.push({text :'每一次攻击有'})
        //             desc.push({text: Tool.toInt(model.gailv/100).toString(),style:{textColor:0x00FF00}})
        //             desc.push({text :'%的概率造成对方眩晕，持续'})
        //             desc.push({text: (model.xiaoguo/1000).toString(),style:{textColor:0x00FF00}})
        //             desc.push({text :'秒'})

		this.descLable.text = this.loginActCfg.des+'    原价'+this.loginActCfg.yuanjia;
		this.tabIdx = idx;
		this.btnStatus(idx)
	}
	private btnStatus(idx:number):void{
		
		var awardArrs = DataManager.getInstance().festivalWuYiManager.record;
		this.label_points1.text = this.loginActCfg.price.toString();
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has < this.loginActCfg.price) {
				this.label_points1.textColor = 0xFF0000;
			} else {
				this.label_points1.textColor = 0xe9deb3;
			}
		for(let k in awardArrs){  
			if(awardArrs[k] == idx)
			{
				this.btn_Buy.label = '已购买';
				this.btn_Buy.enabled = false;
				return;
			}
        } 
		
		this.btn_Buy.enabled = true;
		this.btn_Buy.label = '购 买';  
	}
	private onTab(event:egret.Event): void {
        var name: number =Number(event.target.name);
        if(this.tabIdx == name)
        return;
		this.tabIdx = name;
		this.onShowAward(this.tabIdx);
    }
	private onTouchBtnAward(): void {
		if(!GameFight.getInstance().checkBagIsFull())
        {
            let message: Message = new Message(MESSAGE_ID.REBATE_TO_BUY_MESSAGE);
			message.setByte(this.tabIdx);
			message.setInt(17)
			GameCommon.getInstance().sendMsgToServer(message);
        }
    }
	private onGetAward():void{
		let weekawardMsg: Message = new Message(MESSAGE_ID.TREASURE_WEEK_AWARD_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(weekawardMsg);
	}	
	
}