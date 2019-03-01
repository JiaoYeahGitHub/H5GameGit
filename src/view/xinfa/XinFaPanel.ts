/**
 * 心法 面板
 * 
 * -------------- LYJ  2018.06.18-------------
 * **/
class XinFaPanel extends BaseTabView {
	private powerbar: PowerBar;
	private grade_name_lab: eui.Label;
	private curr_addattr_lab: eui.Label;
	private addexp_probar: eui.ProgressBar;
	private scroller: eui.Scroller;
	private xinfaList: eui.List;
	private btnGrps: eui.Group;

	private currTabId: number;

	protected points: redPoint[];
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XinfaPanelSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XINFA_TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		for (let i: number = 0; i < 4; i++) {
			this['tab' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
	}
	public onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XINFA_TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		for (let i: number = 0; i < 4; i++) {
			this['tab' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
	}
	private get manager(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	private btnNames: string[] = ['z_btn_xf_zi_png', 'z_btn_xf_cheng_png', 'z_btn_xf_hong_png', 'z_btn_xf_jin_png']
	protected onInit(): void {
		this.scroller.verticalScrollBar.autoVisibility = false;
		this.scroller.verticalScrollBar.visible = false;
		this.xinfaList.itemRenderer = XinfaItem;
		this.xinfaList.itemRendererSkinName = skins.XinfaItemSkin;
		this.xinfaList.useVirtualLayout = true;
		this.scroller.viewport = this.xinfaList;

		this.points = [];
		let pos = new egret.Point(60, 5);
		for (let i: number = 0; i < 4; i++) {
			this.points[i] = new redPoint();
			(this['tab' + i]['iconDisplay'] as eui.Image).source = this.btnNames[i];
			this.points[i].register(this['tab' + i], pos, this, 'onCheckRPointForQuality', this['tab' + i].value);
		}
		this.currTabId = this['tab' + 0].value;
		this['tab0'].selected = true;

		super.onInit();
		this.onRefresh();
	}
	private onChangeBtn(): void {

		for (var i = 0; i < 4; i++) {
			if (this.currTabId == this['tab' + i].value) {
				(this['tab' + i]['iconFrame'] as eui.Image).visible = true;
			}
			else {
				(this['tab' + i]['iconFrame'] as eui.Image).visible = false;
			}
		}
	}
	protected onRefresh(): void {
		this.onChangeBtn();
		let xinfaLevel: number = this.manager.xinfaAddLevel;
		let xinfaAddRatio: number = this.manager.xinfaAddRatio;
		let xinfaAttrAry: number[] = this.manager.getAllXinfaAttrAry();
		xinfaAddRatio += this.manager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.XINFA);
		//更新战斗力
		if (xinfaAddRatio > 0) {
			for (var i = 0; i <= ATTR_TYPE.MAGICDEF; ++i) {
				xinfaAttrAry[i] += Tool.toInt(xinfaAttrAry[i] * xinfaAddRatio / GameDefine.GAME_ADD_RATIO);
			}
		}
		let powerNum: number = GameCommon.calculationFighting(xinfaAttrAry);
		this.powerbar.power = powerNum;
		//更新心法加成阶数
		if (xinfaLevel > 0) {
			this.grade_name_lab.text = `法器${xinfaLevel}阶`;
		} else {
			this.grade_name_lab.text = `法器未激活`;
		}
		//更新心法加成属性
		let atr_add_desc: string = '';
		for (let i: number = 0; i <= ATTR_TYPE.MAGICDEF; i++) {
			atr_add_desc += Language.instance.getAttrName(i) + Language.instance.getText('shuxingjiacheng') + ":" + (xinfaAddRatio / 100).toFixed(1) + "%";
			if (i < ATTR_TYPE.MAGICDEF) {
				atr_add_desc += '\n';
			}
		}
		this.curr_addattr_lab.text = atr_add_desc;
		//更新心法经验条
		let cur_pro_value: number = this.manager.xinfaAddTotalExp;
		let cur_pro_max: number = this.manager.xinfaUpExp;
		if (cur_pro_max > 0) {
			this.addexp_probar.slideDuration = 500;
			this.addexp_probar.maximum = cur_pro_max;
			this.addexp_probar.value = cur_pro_value;
		} else {
			this.addexp_probar.slideDuration = 0;
			this.addexp_probar.maximum = 1;
			this.addexp_probar.value = 1;
			this.addexp_probar['labelDisplay'].text = 'MAX';
		}

		this.onTabHanlder();
	}
	/**切换页签**/
	private onTouchTab(event: egret.TouchEvent): void {
		let button = event.currentTarget;
		if (this.currTabId != button.value) {
			this.currTabId = button.value;
			this.onTabHanlder();
		}
		this.onChangeBtn();
	}
	/**切换标签对应的逻辑处理**/
	private onTabHanlder(): void {
		let xinfamodels: Modeltujian2[] = [];
		for (let xinfaID in JsonModelManager.instance.getModeltujian2()) {
			let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[xinfaID];
			if (model.pinzhi == this.currTabId) {
				xinfamodels.push(model);
			}
		}
		this.xinfaList.dataProvider = new eui.ArrayCollection(xinfamodels);
	}
	//检查一类品质的心法是否可以升级
	public onCheckRPointForQuality(pinzhi: number): boolean {
		for (let xinfaID in JsonModelManager.instance.getModeltujian2()) {
			let model: Modeltujian2 = JsonModelManager.instance.getModeltujian2()[xinfaID];
			if (model.pinzhi == pinzhi) {
				if (this.manager.onCheckOneXinfaRedPoint(model.id)) return true;
			}
		}
		return false;
	}
	//The end
}
/**心法单元格组件**/
class XinfaItem extends eui.ItemRenderer {
	private name_label: eui.Label;
	private icon_img: eui.Image;
	private frame_img: eui.Image;
	private nameframe_img: eui.Image;
	private redponit_img: eui.Image;
	private level_label: eui.Label;
	private consume_probar: eui.ProgressBar;
	private _level: number;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected dataChanged(): void {
		let mananger: PlayerManager = DataManager.getInstance().playerManager;
		let model: Modeltujian2 = this.data as Modeltujian2;
		let xinfaData: PlayerXinfaData = mananger.getXinfaDataByID(model.id);
		this.name_label.text = model.name;
		this.icon_img.source = model.waixing1;
		this.frame_img.source = `xinfa_border_${model.pinzhi}_png`;
		this.nameframe_img.source = `xinfa_namebg_${model.pinzhi}_png`;
		this.level_label.text = xinfaData.level + Language.instance.getText('level');

		let costNum: number = mananger.getoneXinfaUpCostByID(model.id);
		this.consume_probar.maximum = costNum;
		let hascostNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id);
		this.consume_probar.value = hascostNum;
		this.redponit_img.visible = hascostNum >= costNum;
		this._level = xinfaData.level;
		if (xinfaData.level >= 500) {
			this.redponit_img.visible = false;
			this.consume_probar.visible = false;
		}
	}
	private onTouch(): void {
		if (this._level >= 500)
			return;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("XinfaUpgradePanel", this.data));
	}
}