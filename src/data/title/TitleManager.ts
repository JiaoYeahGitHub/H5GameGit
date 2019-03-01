/**
 * 
 */
class TitleManager {

	public titleMap = {};
	public titleViewArray: Array<Modelchenghao>;
	public titleView4EverArray: Array<Modelchenghao>;
	public titleViewLimitArray: Array<Modelchenghao>;

	private isInit: boolean = false;
	public curTitleId:number = 0;
	public constructor() {
		this.titleViewArray = new Array();
		for (var key in JsonModelManager.instance.getModelchenghao()) {
			var titleModel:Modelchenghao=JsonModelManager.instance.getModelchenghao()[key];
			this.titleViewArray.push(titleModel);
		}

	}

	public getTitleArray(tab:number):Array<Modelchenghao>{
		this.sortTitle();
		if(tab==0){
			return this.titleViewLimitArray.concat(this.titleView4EverArray);
		}else{
			return this.titleView4EverArray;
		}
	}

	public parseList(message: Message): void {
		var size: number = message.getByte();
		for (var i: number = 0; i < size; ++i) {
			var titleData = new TitleData();
			titleData.id = message.getShort();
			titleData.time = message.getInt();
			titleData.stamp = egret.getTimer();
			titleData.lv = message.getShort();
			this.titleMap[titleData.id] = titleData;
		}
		if (this.isInit) {
			DataManager.getInstance().playerManager.player.updataAttribute();
		}
		this.isInit = true;
	}

	public parseWear(message: Message): void {
		var idx: number = message.getByte();
		var titleId: number = message.getShort();
		this.takeOffTitle(titleId);
		DataManager.getInstance().playerManager.player.playerDatas[idx].titleId = titleId;
	}
	public parseWear1(message: Message): void {
		var titleData = new TitleData();
		titleData.id = message.getShort();
		titleData.time = message.getInt();
		titleData.stamp = egret.getTimer();
		titleData.lv = message.getShort();
		
		this.titleMap[titleData.id] = titleData;
	}
	public getTitlePoint(tp:number=4): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_TITLE)) return false;
	 	for (let k in this.getModelLv()) {
			var titleData: Modelchenghao = this.getModelLv()[k];
			if(tp==4||titleData.type==tp)
			{
				if(titleData.cost.id)
				{
					var limitThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(titleData.cost.id,titleData.cost.type);
					var _hasitemNum: number = limitThing ? limitThing.num : 0;
					if(_hasitemNum>0)
					return true;
				}
			}
				
		}
		return false;
	}
	private allLvTitleCfgs:Modelchenghao[]
	public getModelLv():Modelchenghao[]{
		if(!this.allLvTitleCfgs)
		{
			this.allLvTitleCfgs = [];
			for (var k in JsonModelManager.instance.getModelchenghao()) {
				if(JsonModelManager.instance.getModelchenghao()[k].time == -1)
				{
					this.allLvTitleCfgs.push(JsonModelManager.instance.getModelchenghao()[k])
				}
			}
		}
		return this.allLvTitleCfgs;
	}
	public isTitleActive(titleId: number): boolean {
		if (this.titleMap[titleId]) {
			return true;
		}
		return false;
	}

	public sortTitle(){
		this.titleView4EverArray = new Array();
		this.titleViewLimitArray = new Array();	
		for (var i=0;i<this.titleViewArray.length;i++) {
			if(this.isTitleActive(this.titleViewArray[i].id)){
				this.titleViewLimitArray.push(this.titleViewArray[i]);
			}else{
				this.titleView4EverArray.push(this.titleViewArray[i]);
			}
		}
	}

	public getTitleData(titleId: number): TitleData {
		return this.titleMap[titleId];
	}

	public getTitleCountDown(titleId: number): number {
		var titleData: TitleData = this.getTitleData(titleId);
		if (titleData && titleData.time >= 0) {
			var time: number = titleData.time - (egret.getTimer() - titleData.stamp) / 1000;
			var modelTitle: Modelchenghao = JsonModelManager.instance.getModelchenghao()[titleId];
			if (time > 0||modelTitle.time==-1) {
				return time;
			}
			this.removeTitleData(titleId);
		}
		return 0;
	}
	/**检测称号是否到期**/
	public onCheckTitleTimeOut(): void {
		for (var titleId in this.titleMap) {
			this.getTitleCountDown(parseInt(titleId));
		}
	}

	private removeTitleData(titleId: number): void {
		this.takeOffTitle(titleId);
		delete this.titleMap[titleId];
	}

	private takeOffTitle(titleId: number): void {
		for (var i = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; ++i) {
			if (DataManager.getInstance().playerManager.player.playerDatas[i].titleId == titleId) {
				DataManager.getInstance().playerManager.player.playerDatas[i].titleId = 0;
			}
		}
	}
}