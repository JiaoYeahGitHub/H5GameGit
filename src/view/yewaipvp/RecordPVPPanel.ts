class RecordPVPPanel extends BaseTabView {
	private lbDesc: eui.Label;
	private lbLevel: eui.BitmapLabel;
	private lbMax: eui.Label;
	// private lbLevelNext: eui.Label;
	private btnShop: eui.Button;
	private groupInfo: eui.Group;
	private groupLevel: eui.Group;
	private reward: GoodsInstance;
	private barExp: eui.ProgressBar;
	private scrollerGroup: eui.Group;
	private recordPVPItems: RecordPVPItem[];
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.RecordPVPPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.recordPVPItems = [];
		let list: FUN_TYPE[] = this.pvpManager.funcList;
		for (let i = 0; i < list.length; ++i) {
			let item: RecordPVPItem = new RecordPVPItem(list[i], this.pvpManager.PVPDataMap[list[i]]);
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.recordPVPItems.push(item);
		}
		this.recordPVPItems.sort(function onSort(a: RecordPVPItem, b: RecordPVPItem): number {
            return a.model.pvpLv - b.model.pvpLv;
        });
		for (let i = 0; i < this.recordPVPItems.length; ++i) {
			this.scrollerGroup.addChild(this.recordPVPItems[i]);
		}
	}
	protected onRegist(): void {
		this.btnShop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventShop, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ZHANGONG_INFO_GET_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onRefresh, this);
		// this.loop_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		// this.fight_log_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
		this.pvpManager.sendPVPInfo();
	}
	protected onRemove(): void {
		this.btnShop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventShop, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ZHANGONG_INFO_GET_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onRefresh, this);
		// this.loop_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openRankView, this);
		// this.fight_log_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openLogView, this);
	}
	private onTouchItem(event: egret.TouchEvent) {
		let item = event.target;
		let idx = 0;
		let tab = 0;
		switch (item.funType) {
			case FUN_TYPE.FUN_ARENA:// 竞技场
				idx = 1;
				tab = 1;
				break;
			case FUN_TYPE.FUN_LADDER:// 天梯
				idx = 1;
				tab = 2;
				break;
			case FUN_TYPE.FUN_YEWAIPVP:// 遭遇战
				idx = 1;
				tab = 0;
				break;
			case FUN_TYPE.FUN_DUJIE:// 护送
				idx = 1;
				tab = 3;
				break;
			case FUN_TYPE.FUN_SERVERFIGHT_ARENA:// 跨服竞技场
				idx = 2;
				tab = 0;
				break;
			case FUN_TYPE.FUN_WUTAN:// 武坛
				idx = 4;
				tab = 0;
				break;
		}
		if(idx > 0){
			this.owner.setPageTab(idx, tab);
		}
	}
	protected onRefresh(): void {
		super.onRefresh();
		if(this.pvpManager.getModelNext()){
			// this.lbLevelNext.text = this.pvpManager.getModelNext().name;
			let str = this.pvpManager.getModelNext().miaoshu;
			if(str){
				this.lbDesc.text = str;
			} else {
				this.lbDesc.text = "";
			}
			this.barExp.maximum = this.pvpManager.getModelNext().zhangong;
			this.barExp.value = this.pvpManager.pvpExp;
			this.lbMax.text = "";
			this.lbLevel.text = this.pvpManager.getModelCurr().lv.toString();

			let rews = this.pvpManager.getModelNext().rewards;
			if(rews){
				this.reward.updateByAward(rews[0]);
			}
		} else {
			// this.lbLevelNext.text = "已达满级";
			this.lbDesc.text = "敬请期待";
			this.barExp.maximum = this.pvpManager.getModelCurr().zhangong;
			this.barExp.value = this.pvpManager.pvpExp;
			this.groupLevel.horizontalCenter = "0";
			this.groupInfo.visible = false;
			this.lbLevel.text = "";
			this.lbMax.text = "已满级";
		}
		this.barExp.labelDisplay.size = 22;
		this.barExp.labelDisplay.visible = true;
		for (let i = 0; i < this.recordPVPItems.length; ++i) {
			this.recordPVPItems[i].update();
		}
	}
	private onEventShop(){
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PvPShopPanel");
	}
	private get pvpManager() {
		return DataManager.getInstance().pvpManager;
	}
}
class RecordPVPItem extends eui.Button {
	private group: eui.Group;
	public imgLogo: eui.Image;
	public lbTitle: eui.Label;//竞技场
	// public lbLog: eui.Label;//4战3胜
	public lbGet: eui.Label;//已获得200战功
	public lbRank: eui.Label;//当前排名：20
	public lbUnget: eui.Label;//凌晨结算科获得:20000战功
	public funType: FUN_TYPE;
	public model: ModelfunctionLv;
	public pvpData: PVPData;
	public constructor(_funType: FUN_TYPE, pvpData: PVPData) {
		super();
		this.skinName = skins.RecordPVPItemSkin;
		this.funType = _funType;
		this.pvpData = pvpData;
		this.onInit();
		this.update();
	}
	private onInit() {
		this.model = JsonModelManager.instance.getModelfunctionLv()[this.funType];
		let name = this.model.desc;
		if (name.length == 2) {
			name = name[0] + "\n\n" + name[1];
		}
		this.lbTitle.text = name;
		// this.group.touchEnabled = true;
		// this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.initLogo();
	}
	private initLogo() {
		switch (this.funType) {
			case FUN_TYPE.FUN_ARENA:// 竞技场
				this.imgLogo.source = "z_pvp_logo_jingjichang_png";
				break;
			case FUN_TYPE.FUN_LADDER:// 天梯
				this.imgLogo.source = "z_pvp_logo_tianti_png";
				break;
			case FUN_TYPE.FUN_YEWAIPVP:// 遭遇战
				this.imgLogo.source = "z_pvp_logo_zaoyuzhan_png";
				break;
			case FUN_TYPE.FUN_DUJIE:// 护送
				this.imgLogo.source = "z_pvp_logo_husong_png";
				break;
			case FUN_TYPE.FUN_SERVERFIGHT_ARENA:// 跨服竞技场
				this.imgLogo.source = "z_pvp_logo_kuafujingji_png";
				break;
			case FUN_TYPE.FUN_WUTAN:// 武坛
				this.imgLogo.source = "z_pvp_logo_wutan_png";
				break;
		}
	}
	public update() {
		if(FunDefine.isFunOpen(this.funType)){
			this.updateValueDay();
			Tool.setDisplayGray(this.group, false);
		} else {
			this.setClose();
			this.lbRank.text = "战功" + this.model.pvpLv + "级开启";
			Tool.setDisplayGray(this.group);
		}
	}
	private setClose(){
		this.lbGet.text = this.lbUnget.text = "";
	}
	// private onTouch(){
	// 	Tool.log("onEvent: " + this.funType);
	// }
	private updateValueDay() {
		this.lbGet.text = "已获得" + this.pvpData.zhangong + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
		if (this.pvpData.isHasRank()) {
			this.lbRank.text = "当前排名：" + this.pvpData.getRank();
		} else {
			this.lbRank.text = "未上榜";
		}
		switch (this.funType) {
			case FUN_TYPE.FUN_ARENA:// 竞技场
				this.lbUnget.text = "凌晨结算可获得:\n" + this.getZGArane() + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
				break;
			case FUN_TYPE.FUN_LADDER:// 天梯
				this.updateTianTi();
				break;
			case FUN_TYPE.FUN_YEWAIPVP:// 遭遇战
				this.lbUnget.text = "凌晨结算可获得:\n" + this.getZGZY() + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
				break;
			case FUN_TYPE.FUN_DUJIE:// 护送
				this.updateHuSong();
				break;
			case FUN_TYPE.FUN_SERVERFIGHT_ARENA:// 跨服竞技场
				this.lbUnget.text = "凌晨结算可获得:\n" + this.getZGKFJJC() + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
				break;
			case FUN_TYPE.FUN_WUTAN:// 武坛
				this.getZGWT();
				break;
		}
	}
	private get pvpManager() {
		return DataManager.getInstance().pvpManager;
	}
	private getZGArane(): number {
		if(this.pvpData.isHasRank()){
			let rank: number = this.pvpData.getRank();
			let models = JsonModelManager.instance.getModelarenaRankReward();
			let model: ModelarenaRankReward;
			let maxModel: ModelarenaRankReward;
			for (let key in models) {
				model = models[key];
				if (model.highRank >= rank && model.lowRank <= rank) {
					return this.pvpManager.getCostZhanGongByStr(model.rate);
				}
				if (!maxModel || model.level > maxModel.level) {
					maxModel = model;
				}
			}
			if (maxModel) {
				return this.pvpManager.getCostZhanGongByStr(maxModel.rate);
			}
		}
		return 0;
	}
	private updateTianTi() {
		let zhangong = 0;
		if (this.pvpData.isHasRank()) {
			let datas = this.pvpData.value.split('_');
			let rank = parseInt(datas[0]);
			let jifen = parseInt(datas[1]);

			let zgjf = 0;
			if(jifen > 0){
				let models = JsonModelManager.instance.getModelttre();
				let modelMax: Modelttre = null;
				for(let k in models){
					let model: Modelttre = models[k];
					if(jifen <= model.maxjifen){
						zgjf = model.type;
						break;
					}
					if(!modelMax || model.maxjifen > modelMax.maxjifen){
						modelMax = model;
					}
				}
				if(zgjf == 0){
					zgjf = modelMax.type;
				}
			}
			let models = JsonModelManager.instance.getModelttjjc();
			for(let k in models){
				let model: Modelttjjc = models[k];
				if(zgjf == 4 && rank > 0 && rank >= model.min && rank < model.max){
					zhangong += this.pvpManager.getCostZhanGong(model.rewards);
				}
				if(zgjf == model.lv){
					zhangong += this.pvpManager.getCostZhanGong(model.rewards);
				}
			}
			if(rank > 0){
				this.lbRank.text = "当前排名：" + rank;
			} else {
				this.lbRank.text = "未上榜";
			}
		}
		this.lbUnget.text = "凌晨结算可获得:\n" + zhangong + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
	}
	private getZGZY(): number {
		if(this.pvpData.isHasRank()){
			let rank = this.pvpData.getRank();
			let models = JsonModelManager.instance.getModelzaoyubang();
			let model: Modelzaoyubang;
			let maxModel: Modelzaoyubang;
			for (let key in models) {
				model = models[key];
				if (model.rankMax >= rank && model.rankMin <= rank) {
					return this.pvpManager.getCostZhanGong(model.rewards);
				}
				if (!maxModel || model.id > maxModel.id) {
					maxModel = model;
				}
			}
			if (maxModel) {
				this.lbRank.text = "未上榜";
				return this.pvpManager.getCostZhanGong(maxModel.rewards);
			}
		}
		return 0;
	}
	private updateHuSong() {
		let quality = this.pvpData.getRank();
		var model: Modeldujie = JsonModelManager.instance.getModeldujie()[quality];
		if (model) {
			this.lbRank.text = model.name;
			this.lbUnget.text = "护送完成可获得:\n" + this.pvpManager.getCostZhanGongByStr(model.jiangli) + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
		} else {
			this.lbRank.text = "未护送";
			this.lbUnget.text = "当前没有护送中";
		}
	}
	private getZGKFJJC(): number {
		let rank = this.pvpData.getRank();
		let models = JsonModelManager.instance.getModelkuafujingjichang();
		let model: Modelkuafujingjichang;
		for (let key in models) {
			model = models[key];
			if (model.max >= rank && model.min <= rank) {
				return this.pvpManager.getCostZhanGong(model.rewards);
			}
		}
		return 0;
	}
	private getZGWT() {
		if (this.pvpData.isHasRank()) {
			let datas = this.pvpData.value.split('_');
			let type = parseInt(datas[0]);
			let idx = parseInt(datas[1]);
			idx = idx > 4 ? 4 : idx;
			let model: Modelwutan = DataManager.getInstance().wuTanManager.getModel(type, idx);
			if (model) {
				this.lbRank.text = model.name + "：第" + (idx + 1) + "位";
				this.lbUnget.text = "守坛完成可获得：\n" + this.pvpManager.getCostZhanGong(model.rewards) + Language.instance.getText("currency" + GOODS_TYPE.ZHANGONG);
				return;
			}
		}
		this.lbRank.text = "未上坛";
		this.lbUnget.text = "当前未上坛位";
	}
}