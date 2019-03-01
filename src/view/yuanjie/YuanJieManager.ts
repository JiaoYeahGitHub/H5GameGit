class YuanJieManager {
	public yuanJie: Modelyuanjie[];
	public yuanJieLevel: Modelyuanjielv[];
	public yjExp: number = 0;
	public constructor() {
	}
	public checkRedPoint(): boolean{
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_YUANJIE)) {
            return false;
        }
		let list:Modelyuanjie[] = this.getModelYuanJie();
		for(let i = 0; i < list.length; ++i){
			if(this.checkRedPointItem(list[i])){
				return true;
			}
		}
		return false;
	}

    public checkRedPointItem(model: Modelyuanjie){
          if (!FunDefine.isFunOpen(FUN_TYPE.FUN_YUANJIE)) {
            return false;
        }
        if(model){
            let item: AwardItem = model.cost;
            if(item){
                return DataManager.getInstance().bagManager.getGoodsThingNumById(item.id, item.type) >= item.num;
            }
        }
        return false;
    }
	public getModelYuanJie():Modelyuanjie[]{
		if(!this.yuanJie){
			this.yuanJie = [];
			let list = JsonModelManager.instance.getModelyuanjie();
			for(let key in list){
				let item: Modelyuanjie = list[key];
				this.yuanJie[item.id - 1] = item;
			}
		}
		return this.yuanJie;
	}
	public getModelYuanJieLv():Modelyuanjielv[]{
		if(!this.yuanJieLevel){
			this.yuanJieLevel = [];
			let list = JsonModelManager.instance.getModelyuanjielv();
			for(let key in list){
				let item: Modelyuanjielv = list[key];
				this.yuanJieLevel[item.id - 1] = item;
			}
		}
		return this.yuanJieLevel;
	}
	
    public getAttributePlus(modelYuanJie: Modelyuanjielv): number[]{
        var yuanjieProPlus: number[] = GameCommon.getInstance().getAttributeAry();
        if(modelYuanJie){
            for (var i: number = 0; i < GameDefine.YUANJIE_ATTR.length; i++) {
                let attType = GameDefine.YUANJIE_ATTR[i];
                let attKey: string = GameDefine.ATTR_OBJ_KEYS[attType] + 'plus';
                if(modelYuanJie[attKey] > 0){
                    yuanjieProPlus[attType] = modelYuanJie[attKey];
                }
            }
        }
        return yuanjieProPlus;
    }
    public getYuanJieModelCurr(): Modelyuanjielv{
        let list: Modelyuanjielv[] = DataManager.getInstance().yuanjieManager.getModelYuanJieLv();
        let exp = this.yjExp;
		if(exp >= list[0].max){
            if(exp >= list[list.length - 1].max){
                return list[list.length - 1];
            }
            for(let i = 1; i < list.length; ++i){
                if(exp < list[i].max && exp >= list[i - 1].max){
                    return list[i - 1];
                }
            }
        }
        return null;
    }
	public getYuanJieModelNext(): Modelyuanjielv{
        let list: Modelyuanjielv[] = DataManager.getInstance().yuanjieManager.getModelYuanJieLv();
        let exp = this.yjExp;
		if(exp >= list[0].max){
            if(exp >= list[list.length - 1].max){
                return list[list.length - 1];
            }
            for(let i = 1; i < list.length; ++i){
                if(exp < list[i].max && exp >= list[i - 1].max){
                    return list[i];
                }
            }
        }
        return list[0];
    }
}