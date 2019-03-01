/**
 * 妖怪图鉴面板
 */
class TuJianPanel extends BaseTabView {
	public groupName: eui.Label;
	public powerbar: PowerBar;
	public tujianName: eui.Label;
	public bar1: eui.Scroller;
	public tujianGroup: eui.List;
	public strengthenMasterBtn: eui.Button;

	private tujianList: TuJianData[];
	protected points: redPoint[];
	private qianghuaPro: eui.ProgressBar;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TuJianPanelSkin;
	}
	protected onInit(): void {
		this.tujianGroup.itemRenderer = TuJianItem;
		this.tujianGroup.itemRendererSkinName = skins.TuJianItemSkin;
		this.tujianGroup.useVirtualLayout = true;
		this.bar1.viewport = this.tujianGroup;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		super.onRegist();

		this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSuitBtnClick, this)
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		super.onRemove();

		this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSuitBtnClick, this)
	}
	protected onRefresh(): void {
		this.onUpdate();
		// this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_TUJIAN_SUIT);
		// this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_TUJIAN_SUIT);
	}
	private onUpdate(): void {
		//获取角色图鉴数据
		let tujianDataDict = DataManager.getInstance().playerManager.player.getPlayerData().tujianDataDict;
		//生成图鉴
		let attr: number[] = GameCommon.getInstance().getAttributeAry();
		let tianshi_tujian_puls: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.TUJIAN);
		this.tujianList = [];
		for (let tujianId in tujianDataDict) {
			let tujianData: TuJianData = tujianDataDict[tujianId];
			let tujianModel: Modeltujian = tujianData.model;
			if (this.curType != tujianModel.type) continue;
			//计算战斗力
			if (tujianData.level > 0) {
				for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
					if (tujianData.attrAry[j] > 0) {
						attr[j] += tujianData.attrAry[j] + Tool.toInt(tujianData.attrAry[j] * tianshi_tujian_puls / GameDefine.GAME_ADD_RATIO);
					}
				}
			}
			this.tujianList.push(tujianData);
			this.tujianName.text = tujianModel.typeName;
		}

		this.powerbar.power = (GameCommon.calculationFighting(attr)).toString();
		this.tujianGroup.dataProvider = new eui.ArrayCollection(this.tujianList);
	}
	private onSuitBtnClick() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", [STRONGER_MONSTER_TYPE.STRONGER_TUJIAN_SUIT, this.curType]))
	}
	public get curType(): number {
		return this.owner.subTab;
	}
}
class TuJianItem extends BaseListItem {
	private img_head: eui.Image;
	private jihuo: eui.Image;
	private tujiam_cover: eui.Image;
	private btn: eui.RadioButton;
	private point: eui.Image;
	private tujianData: TuJianData;
	private tujian_name: eui.Label;
	private tujianModel: Modeltujian;
	private powerbar: PowerBar;
	private animation: eui.Image;
	private attr: number[];
	private btnGroup: eui.Group;
	protected points: redPoint[] = RedPointManager.createPoint(1);

	constructor() {
		super();
	}
	protected onInit(): void {
		this.btnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
	}
	private onTouchItem(e: egret.Event): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("TuJianUpGrade", this.data));
	}
	protected onUpdate(): void {
		let data: TuJianData = this.data;
		if (data) {
			this.attr = data.attrAry;

			//具体属性使用数据库数据
			if (data.level > 0) {
				this.jihuo.visible = false;
				this.tujian_name.text = data.model.name + data.level + "级";
				this.tujiam_cover.source = `tujian_kuang_di${data.model.pinzhi}_png`;
			} else {
				this.jihuo.visible = true;
				this.tujian_name.text = data.model.name;
				this.tujiam_cover.source = `tujian_weijihuo_png`;
			}

			//加载动画,获取外形、战斗力，使用模型数据
			this.powerbar.power = (GameCommon.calculationFighting(this.attr)).toString();
			this.animation.source = data.model.waixing1 + "_png";

			this.points[0].register(this, GameDefine.RED_TUJIAN_SLOT, FunDefine, "checkTujianRedPointByClass", data.id);
		}
	}
}