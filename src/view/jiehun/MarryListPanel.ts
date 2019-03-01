/**
 * 结婚界面
 */
class MarryListPanel extends BaseTabView {
	private itemScroller: eui.Scroller;
	private list: eui.List;
	private proposeGroup: eui.Group;
	// private myName: eui.Label;//自己名字
	// private otherName: eui.Label;//对方名字
	// private countDownLabel: eui.Label;//倒计时
	// private lvUpBtn:eui.Button;
	// private playerHead1: PlayerHeadPanel;
	// private playerHead2: PlayerHeadPanel;
	// private currentItem: TitleItem;
	// private titleTab1: eui.Image;
	// private titleTab2: eui.Image;
	private consumItem: eui.Group;
	private item1: GoodsInstance;
	private item2: GoodsInstance;
	private item3: GoodsInstance;
	public static readonly roleIndex: number = 0;
	private nextPage: eui.Label;
	private prePage: eui.Label;
	private fabu: eui.Button;
	private label_input: eui.TextInput;
	private fabuBtn1: eui.Button;
	private fabuBtn2: eui.Button;
	private fabuBtn3: eui.Button;
	private fabuGroup: eui.Group;
	private cancelBtn: eui.Button;
	// private divorce:eui.Label;
	// private checkbox1:eui.CheckBox;
	// private checkbox2:eui.CheckBox;
	// private checkbox3:eui.CheckBox;
	// private fabuItem1:GoodsInstance;
	// private fabuItem2:GoodsInstance;
	// private fabuItem3:GoodsInstance;
	private money1: eui.Label;
	private money2: eui.Label;
	private money3: eui.Label;
	private bgBtn: eui.Image;
	protected onSkinName(): void {
		this.skinName = skins.MarryListSkin;
	}
	private curPage: number = 0;
	protected onInit(): void {
		super.onInit();

		// GameCommon.getInstance().addUnderline(this.divorce);
		// this.divorce.touchEnabled = true;
		// this.divorce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDivorce, this);

		GameCommon.getInstance().addUnderlineStr(this.prePage);
		this.prePage.touchEnabled = true;
		this.prePage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrePage, this);
		GameCommon.getInstance().addUnderlineStr(this.nextPage);
		this.nextPage.touchEnabled = true;
		this.nextPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextPage, this);
		// GameCommon.getInstance().addUnderline(this.fabu);
		// this.fabu.touchEnabled = true;
		this.list.itemRenderer = MarryItem;
		this.list.useVirtualLayout = false;
		// this.proposeGroup.visible = false;
		this.onRefresh();
	}

	protected onRefresh(): void {
		if (DataManager.getInstance().playerManager.player.marriId == 0) {
			// this.divorce.visible = false;
			this.fabu.visible = true;
		} else {
			// this.divorce.visible = true;
			this.fabu.visible = false;
		}
		this.curPage = 0;
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE);
		message.setInt(0)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private rewardArr: Array<Modelzhenghun> = new Array<Modelzhenghun>();
	private get models(): Modelzhenghun[] {
		this.rewardArr = [];
		var models: Modelzhenghun[];
		models = JsonModelManager.instance.getModelzhenghun()
		var i = 0;
		for (let k in models) {
			this.rewardArr.push(models[k]);

		}
		return this.rewardArr;
	}
	protected onRegist(): void {
		super.onRegist();
		this.list.addEventListener(egret.TouchEvent.TOUCH_END, this.onItemBtn, this);
		// this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onSureBtn, this);
		this.fabuBtn1.name = '1';
		this.fabuBtn2.name = '2';
		this.fabuBtn3.name = '3';
		this.fabuBtn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.fabuBtn2.addEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.fabuBtn3.addEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onCencel, this);
		// this.checkbox1.name = '1';
		// this.checkbox2.name = '2';
		// this.checkbox3.name = '3';
		// this.checkbox1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		// this.checkbox2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		// this.checkbox3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		this.fabu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFaBu, this);
		this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onCencel, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE.toString(), this.onShowList, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_AD_MESSAGE.toString(), this.onCloseFaBu, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onCloseJieHun, this); 
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onDivorceMsg, this); 
	}
	protected onRemove(): void {
		super.onRemove();
		this.list.removeEventListener(egret.TouchEvent.TOUCH_END, this.onItemBtn, this);
		// this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSureBtn, this);
		this.fabuBtn1.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.fabuBtn2.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.fabuBtn3.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSendFaBu, this);
		this.cancelBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onCencel, this);
		this.fabu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFaBu, this);
		// this.checkbox1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		// this.checkbox2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		// this.checkbox3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckbox1, this)
		this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onCencel, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE.toString(), this.onShowList, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_AD_MESSAGE.toString(), this.onCloseFaBu, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onCloseJieHun, this); 
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onDivorceMsg, this); 

	}
	private onDivorceMsg(): void {
		if (DataManager.getInstance().marryManager.marryId == 0) {
			GameCommon.getInstance().addAlert('离婚成功');
		}
		else {
			GameCommon.getInstance().addAlert('请求离婚成功');
		}
	}
	private onShowList(): void {
		this.list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().marryManager.marryDatas);
	}
	private onCloseFaBu(): void {
		GameCommon.getInstance().addAlert('发布成功');
		this.fabuGroup.visible = false;
		this.bgBtn.visible = false;
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE);
		message.setInt(0)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onSendFaBu(event): void {

		this.selectBoxId = Number(event.target.name)
		this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_AD_MESSAGE);
		if (this.selectBoxId <= 0) {
			GameCommon.getInstance().addAlert('请先选择彩礼');
			return;
		}
		message.setByte(this.selectBoxId);
		message.setString(this.label_input.text);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onCencel(): void {
		this.bgBtn.visible = false;
		this.fabuGroup.visible = false;
	}
	private onFaBu(): void {
		this.fabuGroup.visible = true;
		this.bgBtn.visible = true;
		var models: Modelzhenghun[] = JsonModelManager.instance.getModelzhenghun();
		var i: number = 1;
		for (let k in models) {
			let awarditem: AwardItem = models[k].costList[0];
			this['fabuItem' + i].onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
			//   this['fabuItem'+i].currentState = 'notName'
			this['fabuItem' + i].name = awarditem.num;
			i++;
		}

	}
	private onDivorce(): void {


		if (DataManager.getInstance().playerManager.player.marry_divorce == 1) {
			var message: Message = new Message(MESSAGE_ID.MARRIAGE_DIVORCE_APPLY_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(message);
			return;
		}

		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN),
			'MarryDivorcePanel'
		);
	}
	private onSendDivorce(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE);
		message.setByte(1);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onPrePage(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE);
		if (this.curPage <= 0) {
			GameCommon.getInstance().addAlert('已是最前页');
			return
		}
		this.curPage = this.curPage - 1;
		message.setInt(this.curPage)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onNextPage(): void {
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_AD_LIST_MESSAGE);
		if (!DataManager.getInstance().marryManager.marryDatas || DataManager.getInstance().marryManager.marryDatas.length < 6) {
			GameCommon.getInstance().addAlert('没有更多了');
			return
		}
		this.curPage = this.curPage + 1;
		message.setInt(this.curPage)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onItemBtn(event): void {
		console.log(event.itemIndex);
		if (event.target.label == '求 婚') {

			// this.proposeGroup.visible = true;
			// this.myName.text = this.getPlayerData().name;
			var marData: MarryData = DataManager.getInstance().marryManager.marryDatas[Number(event.target.name)];
			// this.otherName.text =  marData.userdata.name;
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("MarryQiuHunPanel", marData)
			);
			// var index: number = DataManager.getInstance().playerManager.player.headIndex;;
			// var frame: number = this.getPlayerData().headFrame;

			// var modelCfg :Modelzhenghun = JsonModelManager.instance.getModelzhenghun()[marData.cailiId];
			// var awarditem: AwardItem = modelCfg.rewards[0];
			// var awarditem1: AwardItem = modelCfg.costList[0];
			// this.item1.onUpdate(modelCfg.costList[1].type, modelCfg.costList[1].id, 0, modelCfg.costList[1].quality, modelCfg.costList[1].num);
			// this.item2.onUpdate(awarditem1.type, awarditem1.id, 0, awarditem1.quality, awarditem1.num);
			// this.item3.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num);
			// this.playerHead1.setHead(index, frame);
			// this.playerHead2.setHead(marData.userdata.headindex, marData.userdata.headFrame);
			// this.otherId = marData.userdata.id;
		}
		// this.onItemBtnMethod(item);
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	private selectBoxId: number = 0;
	// private onTouchCheckbox1(event) {
	// 	switch(event.target.name)
	// 	{
	// 		case '1':
	// 			this.checkbox2.selected = false;
	// 			this.checkbox3.selected = false;
	// 			this.selectBoxId = 1;
	// 			break;
	// 		case '2':
	// 			this.checkbox1.selected = false;
	// 	  this.checkbox3.selected = false;
	// 	   this.selectBoxId = 2;
	// 			break;
	// 		case '3':
	// 			this.checkbox1.selected = false;
	// 	   this.checkbox2.selected = false;
	// 	    this.selectBoxId = 3;
	// 			break;
	// 	}
	// }
	private otherId: number = 0;
	private onSureBtn(): void {
		this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
		var message: Message = new Message(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE);
		message.setInt(this.otherId);
		GameCommon.getInstance().sendMsgToServer(message);
	}
}
class MarryItem extends eui.ItemRenderer {
	private btn_QiuHun: eui.Button;
	private userName: eui.Label;
	private caili: eui.Label;
	private desc: eui.Label;
	private playerHead: PlayerHeadPanel;
	public constructor() {
		super();
		this.skinName = skins.MarryItemSkin;
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
	}
	protected dataChanged(): void {
		if (this.data) {
			if (this.data.userdata.id == DataManager.getInstance().playerManager.player.id)
				this.btn_QiuHun.visible = false;

			this.btn_QiuHun.name = this.data.idx + '';
			var modelCfg: Modelzhenghun = JsonModelManager.instance.getModelzhenghun()[this.data.cailiId];
			if (!modelCfg)
				return;
			this.caili.text = '彩礼:' + modelCfg.costList[0].num;
			this.desc.text = this.data.desc;
			this.userName.text = this.data.userdata.name;
			this.playerHead.setHead(this.data.userdata.headindex, this.data.userdata.headFrame);
		}
	}

	public update(id: number): void {

	}
}
