class XianDanTabView extends BaseTabView {
	private awardList: eui.List;
	private scroll: eui.Scroller;
	private cost: AwardItem;
	private _showEquipview: boolean;
	protected points: redPoint[] = RedPointManager.createPoint(7);
	private xianDan_buff_attr1: eui.Label;
	private powerBar: PowerBar;
	private xianDan_buff_attr2: eui.Label;
	private rewardArr: Modelxiandan[];
	private bo: boolean = false;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XianDanViewSkin;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = true;
		this.awardList.itemRenderer = XianDanItem;
		this.awardList.itemRendererSkinName = skins.XianDanItemSkin;
		this.awardList.useVirtualLayout = true;
		this.scroll.viewport = this.awardList;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.index = this.getRegisterSystemParam().index - 1;
		this.onTab(this.index)
	}
	protected onRegist(): void {
		super.onRegist();
		GameDispatcher.getInstance().addEventListener(GameEvent.XIANDAN_TAB_REFRESH, this.onTab, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefreshXianDan, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE.toString(), this.onReciveSlotMsg, this);
	}
	protected onRemove(): void {
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE.toString(), this.onReciveSlotMsg, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.XIANDAN_TAB_REFRESH, this.onTab, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefreshXianDan, this);

	}
	private index: number;
	private onTab(idx: number): void {
		this.scroll.stopAnimation();
		this.scroll.viewport.scrollV = 0;
		// this.index = idx;
		this.awardList.dataProvider = new eui.ArrayCollection(this.models);
		this.onRefreshXianDan();
	}
	private onRefreshXianDan(): void {
		this.onUpData();
		if (this.awardList.numChildren > 0) {
			for (var i: number = this.awardList.numChildren - 1; i >= 0; i--) {
				var depotitem: XianDanItem = this.awardList.getChildAt(i) as XianDanItem;
				if (depotitem) {
					if (DataManager.getInstance().playerManager.player.xianDans[DataManager.getInstance().xiandanManager.curDanId]) {
						if (depotitem.xianDanId == DataManager.getInstance().xiandanManager.curDanId) {
							depotitem.onUpdate(JsonModelManager.instance.getModelxiandan()[depotitem.xianDanId]);
							break;
						}
					}
				}
			}
		}
	}
	private onUpData(): void {
		this.rewardArr = this.models;
		var allCfg = JsonModelManager.instance.getModelxiandan();
		var allPro: number[] = [];
		var allProTimes: number[] = [];
		for (var j: number = 0; j < 10; j++) {
			allPro[j] = 0;
			allProTimes[j] = 0;
		}
		for (let i in allCfg) {
			for (var k: number = 0; k < allCfg[i].attrAry.length; k++) {
				var addRateVaule: number = allCfg[i].attrAry[k];
				if (DataManager.getInstance().playerManager.player.xianDans[allCfg[i].id]) {
					if (DataManager.getInstance().playerManager.player.xianDans[allCfg[i].id].shiyongNum > 0) {
						if (addRateVaule > 0) {
							var awardStrAry: string[];
							awardStrAry = allCfg[i].effect.split("#");
							allProTimes[k] = allProTimes[k] + DataManager.getInstance().xiandanManager.getXianDanAllProTimes(allCfg[i]);
							allPro[k] = allPro[k] + (addRateVaule * DataManager.getInstance().playerManager.player.xianDans[allCfg[i].id].shiyongNum);
							continue;
						}
					}
				}
			}
		}

		this.xianDan_buff_attr1.text = "";
		this.xianDan_buff_attr2.text = '';
		for (var i: number = 0; i < 4; i++) {//只有攻防血
			var addRateVaule: number = allPro[i];
			// if (addRateVaule > 0) {
			this.xianDan_buff_attr1.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "\n";
			// }
			let tianshi_xd_puls: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.PILL);
			allPro[i] += Tool.toInt(addRateVaule * tianshi_xd_puls / GameDefine.GAME_ADD_RATIO);
		}
		if (this.xianDan_buff_attr1.text == "") {
		}
		for (var i: number = 0; i < 4; i++) {//只有攻防血
			var addRateVaule: number = allProTimes[i];
			// if (addRateVaule > 0) {
			// this.xianDan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + (addRateVaule/100) + "%";
			this.xianDan_buff_attr2.text += GameDefine.Attr_FontName[i] + "+" + (addRateVaule / 100) + "%\n";
			// }
		}
		var power: number = GameCommon.calculationFighting(allPro);
		this.powerBar.power = power.toString();
	}
	private onClearDepotList(): void {
		if (this.awardList.numChildren > 0) {
			for (var i: number = this.awardList.numChildren - 1; i >= 0; i--) {
				var depotitem: XianDanItem = this.awardList.getChildAt(i) as XianDanItem;
				if (depotitem) {
					this.awardList.removeChild(depotitem);
				}
			}
		}
	}
	private get models(): Modelxiandan[] {
		let arr: Modelxiandan[] = [];
		var models: Modelxiandan[] = JsonModelManager.instance.getModelxiandan();
		for (let k in models) {
			if (models[k].type == this.index) {
				arr.push(models[k]);
			}
		}
		return arr;
	}
	private onClose(): void {
		this.onHide();
	}
	//The end
}
// class XianDanItem extends eui.Component  {
//     private name_label:eui.Label;
//     private item_icon:eui.Image;
//     private item_frame:eui.Image;
// 	private progress:eui.ProgressBar;
// 	private btnRefine:eui.Button;
// 	private xianDanId:number;
// 	private pro1:eui.Label;
// 	private lableDesc:eui.Label;
// 	public _shiyongNUm:number;
// 	constructor() {
//         super();
// 		this.skinName = skins.XianDanItemSkin;
//         this.once(egret.Event.COMPLETE, this.onComplete, this);
//     }

//     private onComplete(): void {
//         this.btnRefine.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
//     }
// public onUpdate(xiandanCfg:Modelxiandan): void {
// 	this.xianDanId = xiandanCfg.id;
// 	this.item_icon.source = xiandanCfg.icon;
// 	this.name_label.text = xiandanCfg.name;
// 	this.progress.minimum = 0;
// 	let shiyongNum :number = 0;
// 	if(DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id])
// 	{
// 		shiyongNum = DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].shiyongNum;
// 		this._shiyongNUm = DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].shiyongNum;
// 	}

// 	var nextPro: string[] = DataManager.getInstance().xiandanManager.getXianDanPro(xiandanCfg.id,shiyongNum,true);
// 	this.progress.maximum =Number(nextPro[0]);


// 	if(DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id])
// 		{
// 			var curProValue:number = 0;
// 			var awardStrAry: string[];
// 			awardStrAry = xiandanCfg.effect.split("#");
// 			for (var i: number = 0; i < awardStrAry.length; i++) {
// 				var awardstrItem: string[] = awardStrAry[i].split(",");
// 				curProValue =curProValue+Number(awardstrItem[0]);
// 				if(shiyongNum<curProValue)
// 				{
// 					if(i==0)
// 					{
// 						this.progress.value = shiyongNum;
// 					}
// 					else
// 					{
// 						this.progress.value = shiyongNum - (curProValue-Number(awardstrItem[0]));
// 						break;
// 					}
// 				}	
// 			}

// 		}
// 		else{
// 		this.progress.value = 0;
// 		}
// 	this.pro1.text = "";
//     let buffNum:number = 0;
// 	var curPro: string[] = DataManager.getInstance().xiandanManager.getXianDanPro(xiandanCfg.id,shiyongNum,false);
//     for (var i: number = 0; i < xiandanCfg.attrAry.length; i++) {
//         var addRateVaule: number = xiandanCfg.attrAry[i];
//         if (addRateVaule > 0) {
//                     buffNum =buffNum+1; 
//                     this.pro1.text += GameDefine.Attr_FontName[i] + "+" + (addRateVaule+(Tool.toInt(addRateVaule*(Number(curPro[1])/100)))) + "   \n";
//             this.lableDesc.text = '注入'+nextPro[0]+'颗'+xiandanCfg.name+'可提高'+GameDefine.Attr_FontName[i]+nextPro[1];
//         }
//     }
// }
// 	protected dataChanged(): void {

// 	}
// 	private onTouch():void
//     {
//         //  if (this.data) {

// 			var message = new Message(MESSAGE_ID.PILL_USE_MESSAGE);
// 			message.setShort(this.xianDanId)
// 			GameCommon.getInstance().sendMsgToServer(message);
//         // } 
//     }
// }
class XianDanItem extends eui.ItemRenderer {
	private name_label: eui.Label;
	private item_icon: eui.Image;
	private item_frame: eui.Image;
	private progress: eui.ProgressBar;
	private btnRefine: eui.Button;
	private haveNum: eui.Label;
	public xianDanId: number;
	private pro1: eui.Label;
	private lableDesc: eui.Label;
	public _shiyongNUm: number
	private curXianDan: number;
	private pro1Desc: eui.Label;
	private roValue: eui.Label;
	constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.progress.slideDuration = 0;
		this.btnRefine.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected dataChanged(): void {
		this.progress.slideDuration = 0;
		var xiandanCfg: Modelxiandan = this.data as Modelxiandan;
		this.progress.value = 0;
		this.curXianDan = 0;
		this.onUpdate(xiandanCfg);
	}
	private onTouch(): void {
		if (this.data) {
			if (DataManager.getInstance().xiandanManager.danBtnStatus) {
				if (this.curXianDan > 0) {
					DataManager.getInstance().xiandanManager.danBtnStatus = false;
					var message = new Message(MESSAGE_ID.PILL_USE_MESSAGE);
					message.setShort(this.xianDanId)
					GameCommon.getInstance().sendMsgToServer(message);
				}
				else {
					GameCommon.getInstance().addAlert('仙丹不足,请前往炼丹炉炼制');
				}
			}

		}
	}
	public onUpdate(xiandanCfg: Modelxiandan): void {
		this.xianDanId = xiandanCfg.id;
		this.item_icon.source = xiandanCfg.icon;
		var addThingText: egret.ITextElement[] = []
		addThingText.push({ text: xiandanCfg.name, style: { textColor: GameCommon.getInstance().CreateNameColer(xiandanCfg.quality) } })
		this.name_label.textFlow = addThingText;
		this.progress.minimum = 0;

		let shiyongNum: number = 0;
		this.haveNum.text = '剩余:0'

		this.item_frame.source = GameCommon.getInstance().getIconFrame(xiandanCfg.quality);
		if (DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id]) {
			this.curXianDan = DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].havepill;
			this.haveNum.text = '剩余:' + DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].havepill;
			shiyongNum = DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].shiyongNum;
			this._shiyongNUm = DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id].shiyongNum;
		}

		var nextPro: string[] = DataManager.getInstance().xiandanManager.getXianDanPro(xiandanCfg.id, shiyongNum, true);
		this.progress.maximum = Number(nextPro[0]);


		if (DataManager.getInstance().playerManager.player.xianDans[xiandanCfg.id]) {
			var curProValue: number = 0;
			var awardStrAry: string[];
			awardStrAry = xiandanCfg.effect.split("#");
			for (var i: number = 0; i < awardStrAry.length; i++) {
				var awardstrItem: string[] = awardStrAry[i].split(",");
				curProValue = curProValue + Number(awardstrItem[0]);
				if (shiyongNum > 0) {
					if (i == 0 && shiyongNum < Number(awardstrItem[0])) {
						this.progress.value = shiyongNum;
						this.roValue.text = shiyongNum + '/' + nextPro[0];
						break;
					}
					else {
						this.progress.value = shiyongNum - (curProValue - Number(awardstrItem[0]));
						this.roValue.text = (shiyongNum - (curProValue - Number(awardstrItem[0]))) + '/' + nextPro[0];
						break;
					}
				}
			}

		}
		else {
			this.roValue.text = '0/' + nextPro[0];
		}
		this.pro1.text = "";
		let buffNum: number = 0;
		var curPro: string[] = DataManager.getInstance().xiandanManager.getXianDanPro(xiandanCfg.id, shiyongNum, false);
		for (var i: number = 0; i < xiandanCfg.attrAry.length; i++) {
			var addRateVaule: number = xiandanCfg.attrAry[i];
			if (addRateVaule > 0) {
				// buffNum =buffNum+1; 
				// if(shiyongNum>0)
				// {
				// this.pro1.text += GameDefine.Attr_FontName[i] + "+" + (addRateVaule+(Tool.toInt(addRateVaule*(Number(curPro[1])/100)))) + "   \n";
				// }
				// else
				// {
				// this.pro1.text += GameDefine.Attr_FontName[i] + "+0";
				// }
				var addThingTex1: egret.ITextElement[] = []
				addThingTex1.push({ text: '每注入一颗丹药可提高' + GameDefine.Attr_FontName[i], style: { textColor: 0xFFE8B7 } })
				addThingTex1.push({ text: '+' + addRateVaule, style: { textColor: 0x00FF00 } })
				this.pro1Desc.textFlow = addThingTex1;

				// this.pro1Desc.text = '每注入一颗丹药可提高'+GameDefine.Attr_FontName[i]+addRateVaule;
				var addThingText2: egret.ITextElement[] = []
				var str = '注入' + nextPro[0] + '颗可提高角色总' + GameDefine.Attr_FontName[i];
				addThingText2.push({ text: str, style: { textColor: 0xFFFFFF } })
				addThingText2.push({ text: '+' + Number(nextPro[1]) / 100 + '%', style: { textColor: 0x00FF00 } })
				this.lableDesc.textFlow = addThingText2;
				return;
			}
		}
	}
}