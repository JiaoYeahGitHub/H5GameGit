class VIPTeamBossView extends BaseTabView {
	private call_boss_btn: eui.Button;
	private boss_name: eui.Label;
	private boss_model_grp: eui.Group;
	private call_awd_grp: eui.Group;
	private canyu_awd_grp: eui.Group;
	private lefttime_lab: eui.Label;

	private DUPS: number[] = [28, 29, 30, 31];
	private selectIdx: number = 0;
	private bossAnim: BodyAnimation;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.VipTeamBossViewSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResVIPBossInfoMsg, this);
		this.call_boss_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCallBtn, this);
		for (let i: number = 0; i < this.DUPS.length; i++) {
			let item: VIPTeamBossBar = this['vipboss_item' + i];
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		}

		DataManager.getInstance().dupManager.onRequestDupInofMsg(DUP_TYPE.DUP_VIP_TEAM);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResVIPBossInfoMsg, this);
		this.call_boss_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCallBtn, this);
		for (let i: number = 0; i < this.DUPS.length; i++) {
			let item: VIPTeamBossBar = this['vipboss_item' + i];
			item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		}
	}
	protected onInit(): void {
		for (let i: number = 0; i < this.DUPS.length; i++) {
			let dupid: number = this.DUPS[i];
			let dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupid];
			let modelzudui: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[dupid];
			let item: VIPTeamBossBar = this['vipboss_item' + i];
			this._bossNames.push(dupmodel.name);
			item.name = i + '';
			item.data = dupid;
		}
		this.onChangeItem();
		super.onInit();
		this.onRefresh();
	}
	public onRefresh(): void {
	}
	private _bossNames:string[]=[];
	//选中事件
	private onTouchItem(e: egret.Event): void {
		let selectIndex: number = parseInt(e.currentTarget.name);
		if (selectIndex != this.selectIdx) {
			let item: VIPTeamBossBar = this['vipboss_item' + this.selectIdx];
			//item['selected_img'].visible = false;
			item.setItemSelect(false);
			this.selectIdx = selectIndex;
			this.onChangeItem();
		}
	}
	//选中处理
	private onChangeItem(): void {
		let item: VIPTeamBossBar = this['vipboss_item' + this.selectIdx];
		item.setItemSelect(true);
		//item['selected_img'].visible = true;

		let dupid: number = this.DUPS[this.selectIdx];
		let modelzudui: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[dupid];
		this.boss_name.text = this._bossNames[this.selectIdx];// `vipboss_title_txt${this.selectIdx + 1}_png`;
		
		//更新怪物的形象

		this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, parseInt(modelzudui.bossId));
		if (!this.bossAnim.parent) {
			this.boss_model_grp.addChild(this.bossAnim);
		}
		//奖励
		let awarditem: AwardItem;
		let goodsinstance: GoodsInstance;
		let callawditems: AwardItem[];
		//更新召唤奖励
		this.call_awd_grp.removeChildren();
		callawditems = GameCommon.getInstance().onParseAwardItemstr(modelzudui.viprewards);
		for (let i: number = 0; i < callawditems.length; i++) {
			awarditem = callawditems[i];
			goodsinstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.call_awd_grp.addChild(goodsinstance);
		}
		//更新参与奖励
		this.canyu_awd_grp.removeChildren();
		callawditems = GameCommon.getInstance().onParseAwardItemstr(modelzudui.canyurewards);
		for (let i: number = 0; i < callawditems.length; i++) {
			awarditem = callawditems[i];
			goodsinstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.canyu_awd_grp.addChild(goodsinstance);
		}

		this.onRefreshCallTimes();
	}
	//更新召唤次数
	private onRefreshCallTimes(): void {
		let pVipLevel: number = DataManager.getInstance().playerManager.player.viplevel;
		let coatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
		//更新召唤次数
		let dupid: number = this.DUPS[this.selectIdx];
		let dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupid];
		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_VIP_TEAM, dupmodel.subType);
		if (dupinfo.lefttimes > 0 && dupmodel.viplimit <= pVipLevel && dupmodel.lvlimit <= coatardLv) {
			this.call_boss_btn.enabled = true;
			this.call_boss_btn.label = Language.instance.getText('dianjizhaohuan');
		} else {
			this.call_boss_btn.enabled = false;
			if (pVipLevel < dupmodel.viplimit) {
				this.call_boss_btn.label = Language.instance.getText('error_tips_5');
			} else if (coatardLv < dupmodel.lvlimit) {
				this.call_boss_btn.label = Language.instance.getText('error_tips_10005');
			} else {
				this.call_boss_btn.label = Language.instance.getText('yizhaohuan');
			}
		}
	}
	//更新副本信息
	private onResVIPBossInfoMsg(): void {
		this.onRefreshCallTimes();

		let pVipLevel: number = DataManager.getInstance().playerManager.player.viplevel;
		//更新参与次数
		let maxtimes: number = DataManager.getInstance().dupManager.getDupMaxTimesById(this.DUPS[0]);
		let timedesc: string = `${DataManager.getInstance().dupManager.vipteamLeftjoinTimes}/${maxtimes}`;
		if (pVipLevel > 0) {
			this.lefttime_lab.text = Language.instance.parseInsertText('vipteamdup_cishu2', timedesc);
		} else {
			this.lefttime_lab.text = Language.instance.parseInsertText('vipteamdup_cishu1', timedesc);
		}
	}
	//召唤BOSS
	private onTouchCallBtn(): void {
		let dupid: number = this.DUPS[this.selectIdx];
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfoByID(dupid);
		GameFight.getInstance().onSendCreateTeamDupRoomMsg(dupinfo.dupModel.id);
	}
	//The end
}
class VIPTeamBossBar extends BaseComp {
	public imgItemBG: eui.Image;
	public monsterIcon_img: eui.Image;
	public imgTitleBG: eui.Image;
	public lbName: eui.Label;
	public imgNameBG: eui.Image;
	public monster_name_lab: eui.Label;
	public viplimit_lab: eui.Label;

	public constructor() {
		super();
	}
	protected setSkinName(): void {
	}
	protected onInit(): void {
		this.onchangeStatus();
	}
	protected dataChanged() {
		let dupid: number = this._data;
		let dupmodel: Modelcopy = JsonModelManager.instance.getModelcopy()[dupid];
		let modelzudui: Modelzuduifuben = JsonModelManager.instance.getModelzuduifuben()[dupid];
		let modelfightter: Modelfighter = ModelManager.getInstance().getModelFigher(parseInt(modelzudui.bossId));
		let headiconRes: string = modelfightter.avata + "_icon_png";
		this.monsterIcon_img.source = headiconRes;
		this.monster_name_lab.text = modelfightter.name;
		this.lbName.text = dupmodel.name;
		this.viplimit_lab.text = 'VIP' + GameCommon.getInstance().getVipName(dupmodel.viplimit) + Language.instance.getText('kezhaohuan');
	} 

	private _seleted: boolean;
	public setItemSelect(isSelect: boolean): void {
		this._seleted = isSelect;
		this.onchangeStatus();
	}
	private onchangeStatus(): void {
		if (!this.isLoaded) return;
		this.imgItemBG.source = this._seleted ? "xianzun_item_bg1_png" : "xianzun_item_bg0_png";
		this.imgTitleBG.source = this._seleted ? "xianzun_title_bg1_png" : "xianzun_title_bg0_png";
		this.imgNameBG.source = this._seleted ? "xianzun_name_bg1_png" : "public_name_bg2_png";
	}
}