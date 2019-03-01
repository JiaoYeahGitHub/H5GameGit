class SaveBuyActivityPanel extends BaseTabView {
	private vip_reward_grp: eui.Group;
	private vip_scroller: eui.Scroller;	
	private vip_group: eui.Group;
	private vip_nv: eui.Image;
	private btn_buy: eui.Button;
	private item:GoodsInstance;
	private itemQueue: VipLimitItem[];
	private index = 1;
    private labName:eui.Label;
    private labDesc1:eui.Label;
    private labDesc2:eui.Label;
	private timeLab:eui.Label;
	private label_points: eui.Label;
	private img_cons: eui.Image;
	private label_points1: eui.Label;
	private img_cons1: eui.Image;
	private bar_recharge: eui.ProgressBar;
	private lineLable:eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SaveBuyActivitySkin;
	}
	protected onInit(): void {
		super.onInit();
        var strs  =  Constant.get('XIANGOU_ZHEKOU');
        var awardStrAry: string[];
        awardStrAry = strs.split("#");
		this.bar_recharge.minimum = 0;
		var num:number = 0;
        for (var i: number = 0; i < awardStrAry.length; i++) {
            var awardstrItem: string[] = awardStrAry[i].split(",");
			num = Number(awardstrItem[0])
			if(Number(awardstrItem[1])/1000-Tool.toInt(Number(awardstrItem[1])/1000)!=0)
			{
			this['imgzhekou'+(i+1)].source = 'save'+Tool.toInt((Number(awardstrItem[1])/1000))+'_png';
			this['imgzhekou'+5].source = 'save5_png';
			}
			else
			{
			this['imgzhekou'+(i+1)].source = 'save'+(Number(awardstrItem[1])/1000)+'_png';
			}
			if(i==0)
			continue;
			this['zhekou'+(i+1)].text = (Number(awardstrItem[0]))+'次后享受';
        }
		this.bar_recharge.labelDisplay.visible = false;
		this.bar_recharge.maximum = num;
		

		this.onRefresh();
	}
	protected onRefresh(): void {
		 this.updateInfo();
        // this.updateSelected();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ZHIZUN_XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ZHIZUN_XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(false);
	}
    private modelCfg:Modelxiangoulibao3;
	private updateInfo() {
     		
		// var item: ActivityitemFace;
		var allItem = [];
		var xiangoumodel = JsonModelManager.instance.getModelxiangoulibao3();
		for (var key in xiangoumodel) {
			var model: Modelxiangoulibao3 = xiangoumodel[key];
			if (model.round == DataManager.getInstance().newactivitysManager.zhizunDay) {//天数
                this.modelCfg = model;
            var awardItem: AwardItem = model.rewards[0];
            this.labName.text = model.name;
           
            var strs  =  Constant.get('XIANGOU_VIP_TIMES');
            var awardStrAry: string[];
            awardStrAry = strs.split(",");
            var obj = DataManager.getInstance().newactivitysManager.zhizunxiangoudate;
            var num = awardStrAry[DataManager.getInstance().playerManager.player.viplevel]
            if(awardStrAry[DataManager.getInstance().playerManager.player.viplevel+1])
            {
				var vipLv:number = DataManager.getInstance().playerManager.player.viplevel+1;
                this.labDesc2.text = '升到VIP'+GameCommon.getInstance().getVipName(vipLv)+'可购买'+awardStrAry[GameCommon.getInstance().getVipName(vipLv)]+'次';
            }
			else
			{
				 this.labDesc2.text = '已达到满级VIP购买次数';
			}
                var buyNum: number= 0;
                this.btn_buy.visible = true;
                if (obj[model.id]&&obj[model.id][1]>0) {
                    this.labDesc1.text = '已购买'+obj[model.id][1]+'/'+num+'次';	

					var zhekouStr  =  Constant.get('XIANGOU_ZHEKOU');
					var zhekouStrAry: string[];
					zhekouStrAry = zhekouStr.split("#");
					var zhekouNum:number = 0;
					for (var i: number = 0; i < zhekouStrAry.length; i++) {
						var awardstrItem: string[] = zhekouStrAry[i].split(",");

						if(obj[model.id][1]>=awardstrItem[0])
						{
							zhekouNum = Number(awardstrItem[1]);
						}
					}
					this.bar_recharge.value = obj[model.id][1];
					var iconModel = GameCommon.getInstance().getThingModel(GameCommon.parseAwardItem(model.price).type, GameCommon.parseAwardItem(model.price).id);
					this.img_cons.source = iconModel.dropicon;
					this.img_cons1.source = iconModel.dropicon;
					this.label_points.text = GameCommon.parseAwardItem(model.price).num.toString();
					if(zhekouNum!=0)
					{
						
						this.label_points1.text = Tool.toInt(GameCommon.parseAwardItem(model.price).num*(zhekouNum/10000))+'';
						this.lineLable.width = this.label_points.width+60;
					}
					else
					this.label_points1.text = GameCommon.parseAwardItem(model.price).num.toString();
					var _has: number = DataManager.getInstance().playerManager.player.getICurrency(GameCommon.parseAwardItem(model.price).type);
					if (_has < GameCommon.parseAwardItem(model.price).num) {
						this.label_points.textColor = 0xFF0000;
					} else {
						this.label_points.textColor = 0xe9deb3;
					}
					 this.item.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
                }	
                else
                {
					this.bar_recharge.value = 0;
					var iconModel = GameCommon.getInstance().getThingModel(GameCommon.parseAwardItem(model.gold).type, GameCommon.parseAwardItem(model.gold).id);
					this.img_cons.source = iconModel.dropicon;
					this.img_cons1.source = iconModel.dropicon;
					this.label_points.text = GameCommon.parseAwardItem(model.gold).num.toString();
					this.label_points1.text = GameCommon.parseAwardItem(model.gold).num.toString();
					var _has: number = DataManager.getInstance().playerManager.player.getICurrency(GameCommon.parseAwardItem(model.gold).type);
					if (_has < GameCommon.parseAwardItem(model.gold).num) {
						this.label_points.textColor = 0xFF0000;
					} else {
						this.label_points.textColor = 0xe9deb3;
					}
                    this.labDesc1.text = '已购买0/'+num+'次';
					this.lineLable.width = this.label_points.width+60;
					
					 this.item.onUpdate(GameCommon.parseAwardItem(model.goldRewards).type, GameCommon.parseAwardItem(model.goldRewards).id, 0, GameCommon.parseAwardItem(model.goldRewards).quality, GameCommon.parseAwardItem(model.goldRewards).num, GameCommon.parseAwardItem(model.goldRewards).lv);
                }	
                return;
			}
		}
	}

	private onTouchBtn() {
		var message: Message = new Message(MESSAGE_ID.ZHIZUN_XIANGOULIBAO_BUY_MESSAGE);
		message.setShort(this.modelCfg.id);
		message.setShort(1);//short   购买个数
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.DABIAOJIANGLI);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	
	private onxiangouBuyover() {
		this.onRefresh();
	}

	    /*更新选中框*/
    private updateSelected() {
        // var len: number = this.itemQueue.length;
        // for (var i: number = 0; i < len; i++) {
        //     this.itemQueue[i].selecet = i == (this.index - 1);
        // }
    }

	private onTouchItem(e: egret.TouchEvent) {
        var target = <VipLimitItem>e.currentTarget;
        this.index = target.data.id;
        this.onRefresh();
    }

	 private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
}