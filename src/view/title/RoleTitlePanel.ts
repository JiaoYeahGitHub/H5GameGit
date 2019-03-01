/**
 * 人物称号面板
 */
class RoleTitlePanel extends BaseTabView {
	public powerbar: PowerBar;
	public itemScroller: eui.Scroller;
	public list: eui.List;
	public basic: eui.Component;

	private currentItem: TitleItem;
	private titleIdNow: number = 1;
	private titleTab: number = 0;

	protected onSkinName(): void {
		this.skinName = skins.RoleTitlePanelSkin;
	}
	protected onInit(): void {
		super.onInit();

		this.list.itemRenderer = TitleItem;
		this.list.useVirtualLayout = false;
		this.onRefresh();
	}
	private titleList: Modelchenghao[];
	protected onRefresh(): void {
		var titleArray: Array<Modelchenghao> = DataManager.getInstance().titleManager.getTitleArray(this.titleTab);
		var attr: number[] = GameCommon.getInstance().getAttributeAry();
		// 获取当前tab全部已有称号
		var count: number = 0;
		for (var i = 0; i < titleArray.length; i++) {
			count++;
			var modelTitle: Modelchenghao = titleArray[i];
			if (DataManager.getInstance().titleManager.isTitleActive(modelTitle.id)) {
				var titleData: TitleData = DataManager.getInstance().titleManager.getTitleData(modelTitle.id); {
					for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
						attr[j] += GameCommon.getInstance().getAttributeAry(modelTitle)[j] * titleData.lv;
					}
				}
			}
		}
		var powerbar: PowerBar;
		powerbar = (this["powerbar"] as PowerBar);
		powerbar.power = (GameCommon.calculationFighting(attr) * DataManager.getInstance().playerManager.player.playerDatas.length).toString();

		this.titleList = [];
		for (let key in titleArray) {

			if (this.curType != titleArray[key].type) continue;
			this.titleList.push(titleArray[key]);
		}

		this.list.dataProvider = new eui.ArrayCollection(this.titleList);

	}
	public get curType(): number {
		return this.owner.subTab;
	}
	public onRefreshNow(): void {
		//光标位置不变
		//更新页面显示
		if (DataManager.getInstance().titleManager.curTitleId != 0) this.titleIdNow = DataManager.getInstance().titleManager.curTitleId;
		var titleArray: Array<Modelchenghao> = DataManager.getInstance().titleManager.getTitleArray(this.titleTab);

		// for (var i = 0; i < titleArray.length; i++) {
		// 	var titleItem: TitleItem = this.list.getChildAt(i) as TitleItem;
		// 	titleItem.updateWeared(0);
		// 	if (titleArray[i].id == this.titleIdNow) {
		// 		titleItem.update(this.titleIdNow);
		// 	}
		// }

		var attr: number[] = GameCommon.getInstance().getAttributeAry();
		var count: number = 0;
		for (var i = 0; i < titleArray.length; i++) {
			count++;
			var modelTitle: Modelchenghao = titleArray[i];
			if (DataManager.getInstance().titleManager.isTitleActive(modelTitle.id)) {
				var titleData: TitleData = DataManager.getInstance().titleManager.getTitleData(modelTitle.id);
				{
					for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
						attr[j] += GameCommon.getInstance().getAttributeAry(modelTitle)[j] * titleData.lv;
					}
				}
			}
		}
		var powerbar: PowerBar;
		powerbar = (this["powerbar"] as PowerBar);
		powerbar.power = (GameCommon.calculationFighting(attr) * DataManager.getInstance().playerManager.player.playerDatas.length).toString();
		this.titleList = [];
		for (let key in titleArray) {

			if (this.curType != titleArray[key].type) continue;
			this.titleList.push(titleArray[key]);
		}
		this.list.dataProvider = new eui.ArrayCollection(this.titleList);
	}

	protected onRegist(): void {
		super.onRegist();
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TITLE_WEAR_MESSAGE.toString(), this.onRefreshNow, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TITLE_JIHUO_MESSAGE.toString(), this.onRefreshNow, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TITLE_WEAR_MESSAGE.toString(), this.onRefreshNow, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TITLE_JIHUO_MESSAGE.toString(), this.onRefreshNow, this);
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	//list的点击事件
	private onItemBtn(event: eui.ItemTapEvent): void {
		console.log(event.itemIndex);
		var item: TitleItem = event.itemRenderer as TitleItem;
		this.onItemBtnMethod(item);
	}
	private onItemBtnMethod(item) {
		this.currentItem = item;
		// this.currentItem.update(this.titleIdNow);
		this.titleIdNow = DataManager.getInstance().titleManager.curTitleId;
	}
}

class TitleItem extends eui.ItemRenderer {
	public titleId: number;
	private titleBG: eui.Image;
	private titleSelected: eui.Image;
	private titleWeared: eui.Image;
	private chenghaoname: eui.Image;
	private anim: TitleBody;
	private desc: eui.Label;
	private unWearLabel: eui.Label;
	private ani: eui.Group;
	private timeLabel: eui.Label;
	private newPoint:eui.Image;
	public constructor() {
		super();
		this.skinName = skins.TitleItemSkin;
		this.once(egret.Event.COMPLETE, this.onComplete, this);
		// this.once(egret.Event.REMOVED, this.onRemove, this)
		this.once(egret.Event.ADDED, this.onRegist, this)
	}
	public onRegist(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleUpLv, this);
	}

	public onRemove(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleUpLv, this);
	}
	private onComplete(): void {
	}
	protected dataChanged(): void {
		this.titleId = this.data.id;
		this.name = "TitleItem_" + this.titleId;
		var modelTitle: Modelchenghao = JsonModelManager.instance.getModelchenghao()[this.titleId];
		this.desc.text = modelTitle.name;
		this.updateWeared(0);
		if (DataManager.getInstance().titleManager.isTitleActive(this.titleId)) {
			if (DataManager.getInstance().playerManager.player.getPlayerData().titleId == this.titleId) {
				this.updateWeared(1);
			}
			var titleData: TitleData = DataManager.getInstance().titleManager.getTitleData(modelTitle.id);
			if (titleData.time < 0 || modelTitle.time == -1) {
				this.currentState = 'lv';
			}
			else {
				this.currentState = 'normal';
			}
			if (titleData.time == -1) {
				this.timeLabel.text = 'Lv.' + titleData.lv;
			} else {
				this.timeLabel.visible = true;
				Tool.addTimer(this.onCountDown, this, 60000);
			}
			var attr: number[] = GameCommon.getInstance().getAttributeAry();
			attr[ATTR_TYPE.HP] = modelTitle.hp * titleData.lv;
			attr[ATTR_TYPE.ATTACK] = modelTitle.attack * titleData.lv;
			attr[ATTR_TYPE.PHYDEF] = modelTitle.phyDef * titleData.lv;
			attr[ATTR_TYPE.MAGICDEF] = modelTitle.magicDef * titleData.lv;
			var powerbar: PowerBar;
			powerbar = (this["powerbar0"] as PowerBar);
			powerbar.power = GameCommon.calculationFighting(attr);
		}
		else {
			this.timeLabel.text = '未拥有';
			var attr: number[] = GameCommon.getInstance().getAttributeAry();
			attr[ATTR_TYPE.HP] = modelTitle.hp;
			attr[ATTR_TYPE.ATTACK] = modelTitle.attack;
			attr[ATTR_TYPE.PHYDEF] = modelTitle.phyDef;
			attr[ATTR_TYPE.MAGICDEF] = modelTitle.magicDef;
			var powerbar: PowerBar;
			powerbar = (this["powerbar0"] as PowerBar);
			powerbar.power = GameCommon.calculationFighting(attr);
		}

		if (!this.anim) {
			this.anim = new TitleBody(modelTitle);
			this.anim.scaleX = 0.7;
			this.anim.scaleY = 0.7;
			this.ani.addChild(this.anim);
		} else {
			this.anim.onupdate(modelTitle);
		}
		if(modelTitle.cost.id&&modelTitle.time <0)
			{
				var limitThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(modelTitle.cost.id,modelTitle.cost.type);
				var _hasitemNum: number = limitThing ? limitThing.num : 0;
				this.newPoint.visible = _hasitemNum>0;
			}
	}
	private onCountDown(): void {
		var time: number = DataManager.getInstance().titleManager.getTitleCountDown(this.titleId);
		if (time > 0) {
			this.timeLabel.text = "期限：" + Tool.getDayHourMinuteTimeStr(time);
		} else {
			Tool.removeTimer(this.onCountDown, this);
		}
	}


	private onTitleUpLv(): void {
		DataManager.getInstance().titleManager.curTitleId = this.titleId;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TitleUpLvPanel", this.titleId));
	}
	public updateWeared(selected: number): void {
		if (selected == 0) {
			this.titleWeared.visible = false;
			// this.chuandaiBtn['iconDisplay'].source = 'title_button_chuandai_png';
		}
		else if (selected == 1) {

			this.titleWeared.visible = true;
		}
	}
}
