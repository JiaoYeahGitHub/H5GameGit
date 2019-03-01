class LiuYiActivityPanel extends BaseSystemPanel {
	protected points: redPoint[] ;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.setTitle("wuyiTitle1_png");
		var cfgs:ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[21];
		var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
		var sysQueue = [];
		var param = new RegisterSystemParam();
		var bo:boolean = false;
		if (this.isShow)
		var strAry:string[] = cfgs.activityId.split(',');
		var awardStrAry: string[];
		this.points = RedPointManager.createPoint(strAry.length);
		var ind:number = 0;
        for (var i: number = 0; i < strAry.length; i++) {
			if(DataManager.getInstance().activityManager.getActivityCD(Number(strAry[i]))>0)
			{
				
				switch(Number(strAry[i]))
				{	
					case 15:
					bo = true;
					param.sysName = "LiuYiTreasurePanel";
					param.btnRes = "liuyiBtn1";
					param.redP = this.points[ind];
					param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "checkZhuanPanPoint");
					sysQueue.push(param);
					break;
					case 18:
					param = new RegisterSystemParam();
					param.sysName = "LiuYiLoginActivityPanel";
					param.btnRes = "liuyiBtn2";
					param.redP = this.points[ind];
					param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "loginPoint");
					sysQueue.push(param);
					break;
					case 20:
					param = new RegisterSystemParam();
					param.sysName = "LiuYiDanChongPanel";
					param.btnRes = "liuyiBtn4";
					sysQueue.push(param);
					break;
					case 21:
					param = new RegisterSystemParam();
					param.sysName = "LiuyiMissionPanel";
					param.btnRes = "liuyiBtn5";
					param.redP = this.points[ind];
					param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "checkLiyiMissionRedPoint");
					sysQueue.push(param);
					break;
				}
				
			}
			

		}
		if(bo)
		{
			param = new RegisterSystemParam();
			param.sysName = "LiuyiTreasureRankPanel";
			param.btnRes = "icon_xiaribang";
			sysQueue.push(param);
		}
		this.registerPage(sysQueue, "LiuYiActivityGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				this.setTitle("wuyiTitle1_png");
				break;
			case 1:
				this.setTitle("wuyiTitle2_png");
				break;
			case 2:
				this.setTitle("liuyi_chitang_png");
				break;
			case 5:
				this.setTitle("z_xiaribang_png");
				break;
			case 5:
				this.setTitle("liuyi_huoyuerenwu_png");
				break;
		}
		super.onRefresh();
	}
}