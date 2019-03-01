class FuLingManager {
	public lingxingCfg:Modellingxing;
    public nextlingxingCfg:Modellingxing;
    public myDamageNum: number = 0;//我当前的输出值
	public constructor() {

	}
    private allLingxingCfg:Modellingxing[] = JsonModelManager.instance.getModellingxing();
    public onGetLingXingCfg():Modellingxing{
        var idx:string = '';
        for (let k in this.allLingxingCfg) {
                if (this.allLingxingCfg[k].max>DataManager.getInstance().playerManager.player.getPlayerData().fuling[6]) {
                    this.nextlingxingCfg = this.allLingxingCfg[k]
                    this.lingxingCfg = this.allLingxingCfg[idx];
                    if(idx=='') return JsonModelManager.instance.getModellingxing()[1];
                    return this.lingxingCfg;
                }
                idx = k;
        }
        return this.allLingxingCfg[idx];
    }
    public getFulingpoint():boolean{
        let player: Player = DataManager.getInstance().playerManager.player;
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FULINGBOSS)) {
			return false;
		}
        
        if(FunDefine.DupFulingbossPoint()) return true;
        if(this.getFulingDanPoint()) return true;
        return false;
    }
    public getFulingDanPoint():boolean{
            var cfgs = JsonModelManager.instance.getModelfuling();
			for(let k in cfgs){  
                let costModel: ModelThing = GameCommon.getInstance().getThingModel(cfgs[k].cost.type, cfgs[k].cost.id);
                var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(costModel.id);
                var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
                if(_hasitemNum>=cfgs[k].cost.num)
                {
                    return true;
                }
			}  
        return false;
    }
    public getFulingDupPoint():boolean{
        var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_LINGXING, 1);
        if( dupinfo&&dupinfo.lefttimes>0)
        {
            return true;
        }
        return false;
    }
}