class UnionBattleMemberCangKuPanel extends BaseWindowPanel {
	private member_list: eui.Group;
	private scroll: eui.Scroller;
	private depotItem: UnionBattleWarehouseItem;
	private memberItems: eui.Component[];
	private allotParam: UnionAllotParam1;
	private cacheitemAry: UnionBattleWarehouseItem[];//缓存的仓库格子
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh()
		this.setTitle("unionck_png");

	}
	public onShowWithParam(param): void {
		this.allotParam = param as UnionAllotParam1;
		this.onShow();
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleAllotBarSkin;
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.onUpdate();

	}
	private onUpdate(): void {
		this.onReqMemberListMsg();
	}
	protected onRegist(): void {
		super.onRegist();

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
		this.onCleanMemberList();
		// this.allotBar.onHide();
	}
	//请求公会成员列表
	private onReqMemberListMsg(): void {
		DataManager.getInstance().unionManager.onReqUnionMember();
	}
	private onResUnionDepotInfoMsg(): void {
		var unionbattleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
		for (var i: number = 0; i < unionbattleInfo.depotThings.length; i++) {
			if (unionbattleInfo.depotThings[i].id == this.allotParam.awardItem.id) {
				this.allotParam.awardItem.num = unionbattleInfo.depotThings[i].num;
				// this.onResMemberListMsg();
				this.onReqMemberListMsg();
			}

		}
	}
	//返回成员列表信息
	private onResMemberListMsg(): void {
		this.onCleanMemberList();
		var rewardArr: Array<UnionMemberInfo> = new Array<UnionMemberInfo>();
		var myunionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		for (var i: number = 0; i < myunionInfo.unionMemberList.length; i++) {
			var memberInfo: UnionMemberInfo = myunionInfo.unionMemberList[i];
			rewardArr.push(memberInfo)
			var memberItem: UnionBattleHead = new UnionBattleHead();
			memberItem.onUpdate(this.allotParam.awardItem, memberInfo, this.models);
			this.member_list.addChild(memberItem);
		}
		//   this.awardList.dataProvider = new eui.ArrayCollection(rewardArr);
	}
	//获取对应标签的数据结构
	private rewardMaxArr: AwardItem[];
	private get models(): AwardItem[] {
		if (!this.rewardMaxArr) {
			var models: Modelguildreward = JsonModelManager.instance.getModelguildreward()[1];
			this.rewardMaxArr = GameCommon.getInstance().onParseAwardItemstr(models.max);
		}
		return this.rewardMaxArr;
	}
	private onCleanMemberList(): void {
		if (this.member_list.numChildren > 0) {
			for (var i: number = this.member_list.numChildren - 1; i >= 0; i--) {
				var depotitem: UnionBattleHead = this.member_list.getChildAt(i) as UnionBattleHead;
				if (depotitem) {
					this.member_list.removeChild(depotitem);
				}
			}
		}
	}
	// private onOpenAllotAlert(event: egret.Event): void {
	// 	var memberInfo: UnionMemberInfo = event.currentTarget["member_data"];
	// 	if (memberInfo)
	// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAllotAlertPanel", new UnionAllotParam(this.depotItem.awardItem, memberInfo.playerdata)));
	// }
}
class UnionBattleHead extends eui.Component {
	public awardItem: AwardItem;
	public playerdata: SimplePlayerData;
	private memberInfo: UnionMemberInfo;
	// private hadeIcon:eui.Image;
	private playerHead: PlayerHeadPanel;
	private userName: eui.Label;
	private userPower: eui.Label;
	private userGongXian: eui.Label;
	private btn_fenpei: eui.Button;
	private awardMax: AwardItem[];
	protected dataChanged(): void {

	}
	public onUpdate(award: AwardItem, membaerInfo: UnionMemberInfo, awardMax: AwardItem[]): void {
		this.awardItem = award;
		this.awardMax = awardMax;
		this.memberInfo = membaerInfo;
		var myunionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		// this.hadeIcon.source = GameCommon.getInstance().getHeadIconByIndex(membaerInfo.playerdata.headindex);
		this.playerHead.setHead(membaerInfo.playerdata.headindex, membaerInfo.playerdata.headFrame);
		if (membaerInfo.playerdata.rebirthLv > 1) {
			this.userName.text = GameCommon.getInstance().getOutServerName(membaerInfo.playerdata.name) + '  ' + membaerInfo.playerdata.rebirthLv + '阶' + membaerInfo.playerdata.level + '级';
		} else {
			this.userName.text = GameCommon.getInstance().getOutServerName(membaerInfo.playerdata.name) + '  ' + membaerInfo.playerdata.level + '级';
		}
		this.userPower.text = '战力' + membaerInfo.playerdata.fightvalue + '';
		this.userGongXian.text = '贡献' + membaerInfo.donate + '';
		this.refresh();
	}
	constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.UnionBattleHeadSkin;
	}
	private onLoadComplete(): void {
		this.btn_fenpei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.refresh();
	}
	private onTouch() {
		var rewardArr: Array<UnionMemberInfo> = new Array<UnionMemberInfo>();
		var myunionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		for (var i: number = 0; i < myunionInfo.unionMemberList.length; i++) {
			var memberInfo: UnionMemberInfo = myunionInfo.unionMemberList[i];
			if (memberInfo.playerdata.id == this.memberInfo.playerdata.id) {
				this.memberInfo = memberInfo;
				break;
			}
		}


		var num: number = 0;
		for (var i: number = 0; i < this.awardMax.length; i++) {
			if (this.awardMax[i].id == this.awardItem.id) {
				if (this.memberInfo.receiveSize > 0 && this.memberInfo.receiveNum[this.awardItem.id])
					num = this.awardMax[i].num - this.memberInfo.receiveNum[this.awardItem.id];
				else
					num = this.awardMax[i].num;
			}
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAllotAlertPanel", new UnionAllotParam(this.awardItem, this.memberInfo.playerdata, num)));
	}
	protected refresh() {

	}
}
class UnionAllotParam1 {
	public awardItem: AwardItem;
	public playerdata: SimplePlayerData;

	public constructor(awardItem: AwardItem) {
		this.awardItem = awardItem;
		// this.playerdata = playerdata;
	}
}