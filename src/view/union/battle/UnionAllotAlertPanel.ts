class UnionAllotAlertPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private allotParam: UnionAllotParam;

	// private head_icon: eui.Image;
	private playerHead: PlayerHeadPanel;
	private vip_label: eui.BitmapLabel;
	private name_label: eui.Label;
	private level_label: eui.Label;
	private btn_min: eui.Button;
	private btnReduce: eui.Button;
	private btnAdd: eui.Button;
	private btn_max: eui.Button;
	private btn_sure: eui.Button;
	private btn_cancel: eui.Button;
	private label_num: eui.Label;
	private havItemNum:eui.Label;
	private itemName:eui.Label;
	private depot_goods: GoodsInstance;
	private closeBtn1:eui.Button;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionAllotAlertViewSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		var awdItem: AwardItem = this.allotParam.awardItem;
		this.depot_goods.currentState = "notName"
		this.depot_goods.onUpdate(awdItem.type, awdItem.id, 0, awdItem.quality, awdItem.num, awdItem.lv);
		 
		this.havItemNum.text = '当前拥有: '+awdItem.num ;
		var model = GameCommon.getInstance().getThingModel(awdItem.type, awdItem.id, awdItem.quality);
		if(model)
		this.itemName.text = model.name;
		// this.head_icon.source = GameCommon.getInstance().getHeadIconByIndex(this.allotParam.playerdata.headindex);
		this.playerHead.setHead(this.allotParam.playerdata.headindex, this.allotParam.playerdata.headFrame);
		this.vip_label.text = "" + GameCommon.getInstance().getVipName(this.allotParam.playerdata.viplevel); 
		this.name_label.text = this.allotParam.playerdata.name;
		this.level_label.text = (this.allotParam.playerdata.rebirthLv > 0 ? this.allotParam.playerdata.rebirthLv + "转" : "") + this.allotParam.playerdata.level + "级";
	}
	public onShowWithParam(param): void {
		this.allotParam = param as UnionAllotParam;
		this.onShow();
	}
	public onShow(): void {
		if (this.allotParam) {
			super.onShow();
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_min.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btnReduce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btn_max.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendAllotAwdMsg, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.onReset();
	}
	protected onRemove(): void { 
		super.onRemove();
		this.btn_min.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btnReduce.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btn_max.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeAllotNum, this);
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendAllotAwdMsg, this);
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.allotParam = null;
	}
	//重置
	private onReset(): void {
		if (this.allotParam.num>0) 
		this.label_num.text = "1";
		else
		this.label_num.text = "0";
		
	}
	//设置当前数量
	private set allotNum(value: number) {
		if (value != this.allotNum) {
			value = Math.max(value, 0);
			value = Math.min(value, this.allotParam.awardItem.num);
			this.label_num.text = "" + value;
		}
	}
	//获取当前数量
	private get allotNum(): number {
		return parseInt(this.label_num.text);
	}
	//修改分配数量
	private onChangeAllotNum(event: egret.Event): void {
		var optName: string = event.currentTarget.name;
		var currAllotNum: number = this.allotNum;
		if (this.label_num.text == '0')
		{
			// GameCommon.getInstance().addAlert("该成员分配数量已达到上限!");
			return;
		}
		if (optName == "Min") {
			currAllotNum = currAllotNum-10
			if(currAllotNum<=1)
			currAllotNum = 1;
		} else if (optName == "Reduce") {
			if (currAllotNum > 1)
				currAllotNum = currAllotNum - 1;
		} else if (optName == "Add") {
			if (currAllotNum < this.allotParam.awardItem.num)
				currAllotNum = currAllotNum + 1;
			if ( currAllotNum>this.allotParam.num)
			{
				// GameCommon.getInstance().addAlert("该成员分配数量已达到上限!");
				currAllotNum = this.allotParam.num;
			}
		} else if (optName == "Max") {
			currAllotNum = currAllotNum+10
			
			if(currAllotNum>this.allotParam.awardItem.num )
			{
				currAllotNum = this.allotParam.awardItem.num;
				
			}
			if ( currAllotNum>this.allotParam.num)
			{
				currAllotNum = this.allotParam.num;
				//  GameCommon.getInstance().addAlert("该成员分配数量已达到上限!");
			}
			
		}
		this.allotNum = currAllotNum;
	}
	//发送分配协议
	private onSendAllotAwdMsg(): void {
		var allotMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_ALLOT_MESSAGE);
		if(this.allotNum == 0)
		{
			GameCommon.getInstance().addAlert("物品不足或该员分配数量已达到上限!");
			return;
		}
		allotMsg.setInt(this.allotParam.playerdata.id);
		allotMsg.setShort(this.allotParam.awardItem.id);
		allotMsg.setShort(this.allotNum);
		GameCommon.getInstance().sendMsgToServer(allotMsg);
		this.onHide();
	}
	//The end
}
class UnionAllotParam {
	public awardItem: AwardItem;
	public playerdata: SimplePlayerData;
	public num :number;
	public constructor(awardItem: AwardItem, playerdata: SimplePlayerData,num:number) {
		this.awardItem = awardItem;
		this.playerdata = playerdata;
		this.num = num;
	}
}