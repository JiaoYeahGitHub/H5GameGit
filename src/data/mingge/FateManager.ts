/**
 * 
 * 元魂管理器
 * @author	lzn	
 * 
 * 
 */
class FateManager {
	public fateQueue = {};
	public currGain: FateBase[] = [];
	public isPackage:boolean = false;
	public curDataId :number = -1;
	public constructor() {
	}
	public parseFate(msg: Message) {
		var base: FateBase;
		var len = msg.getShort();
		for (var i = 0; i < len; i++) {
			this.parseOnefate(msg);
		}
	}

	// 683  背包中元神变化
	// byte   0--消耗  1--增加
	// byte  长度
	// 循环读取    int   uid
	// short  modelId
	public parseFateGain(msg: Message) {
		// var from: number = 0;
		var from: number = msg.getInt();
		var type: number = msg.getByte();
		var base: FateBase;
		if (type == 1) {
				base = this.parseOnefate(msg);
				GameCommon.getInstance().onGetFateAlert(base.model,from);
				base.slot = 0;
				DataManager.getInstance().playerManager.player.fates[base.UID] =base;
			} else if (type == 0) {
				this.delOneFate(msg);
			}
	}
	private parseOnefate(msg: Message): FateBase {
		var base: FateBase = new FateBase();
		var id = msg.getInt();
		base.parseInit(id,msg);
		
		DataManager.getInstance().playerManager.player.fates[id] =base;
		// if (this.fateQueue[base.UID]) {
		// 	this.fateQueue[base.UID].onUpdate(base);
		// } else {
		// 	this.fateQueue[base.UID] = base;
		// }
		return base;
	}
	private delOneFate(msg: Message): void {
		var base: FateBase = new FateBase();
		var id = msg.getInt();
		base.parseInit(id,msg);
		this.deleteFate(base.UID);
	}
	public delOnePsychByUID(uid: number) {
		delete this.fateQueue[uid];
	}

	public onSendPsychUpgrade(roleID: number, slot: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_UPGRADE_MESSAGE);
		message.setByte(roleID);
		message.setByte(slot);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onSendPsychEquip(roleID: number, slot: number, uid: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_EQUIP_MESSAGE);
		message.setByte(roleID);
		message.setByte(slot);
		message.setInt(uid);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendDecomposeMessage(info: PsychBase[]): void {
		var len: number = info.length;
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_DECOMPOSE_MESSAGE);
		message.setShort(len);
		for (var i: number = 0; i < len; i++) {
			message.setInt(info[i].UID);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public getJobFatePower(): number {
		var add: number = 0;
		for (var i: number = 0; i < GameDefine.Fate_Slot_Num; i++) {
			var slotThing: FateBase = this.getFateBySlot(0, i);
			if (slotThing.modelID > 0) {
				add += this.getOnePsychByID(slotThing.modelID,slotThing.lv);
			}
		}
		return add;
	}
	public getOnePsychByID(modelID: number,lv:number): number {
		var add: number = 0;
		var model: Modelmingge = JsonModelManager.instance.getModelmingge()[modelID];
		if (model) {
			var lvCfg :Modelminggelv = JsonModelManager.instance.getModelminggelv()[lv-1];
			var attr: number[] = [];
        for(let k in model.attrAry){  
            if(model.attrAry[k]>0)
            {
                switch(model.pinzhi)
                {
                    case 1:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lv  / 100))  
                    break;
                    case 2:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lan  / 100))  
                    break;
                    case 3:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.zi  / 100))  
                    break;
                    case 4:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.cheng  / 100))  
                    break;
                    case 5:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.hong  / 100))  
                    break;
                }
               
                // attr[Number(k)] = this.model.attrAry[k];
            }
            else
            {
                attr.push(0)
            }
		}
			add =  GameCommon.calculationFighting(attr);
		}
		return add;
	}

	/*获得装备槽信息*/
	public getFateBySlot(playerIndex: number, index: number): FateBase {
		return this.getPlayer().getPlayerData(playerIndex).getFateSlot(index);
	}
	public getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}

	public getOneLvAllPsych(): Modelyuanshen[] {
		var ret: Modelyuanshen[] = [];
		var models = JsonModelManager.instance.getModelyuanshen();
		var base: Modelyuanshen;
		for (var key in models) {
			base = models[key];
			if (base.lv == 1) {
				ret.push(base);
			}
		}
		return ret;
	}
	public getNextModel(id: number): Modelyuanshen {
		var model: Modelyuanshen = JsonModelManager.instance.getModelyuanshen()[id];
		if (!model) return null;
		var lv = model.lv + 1;
		var models = JsonModelManager.instance.getModelyuanshen();
		for (var key in models) {
			if (models[key].lv == lv && models[key].type == model.type && models[key].pinzhi == model.pinzhi) {
				return models[key];
			}
		}
		return null;
	}

	public getFatePoint(): boolean {
		if(DataManager.getInstance().dupManager.difuDupredPoint()) return true;
		if (this.getObtainPoint()) return true;
		if (this.getFatePackage()) return true;
		return false;
	}
	public getFatePackage():boolean{
		if (this.getFateEquipPoint(-1)) return false

		var fates :FateBase[]= DataManager.getInstance().playerManager.player.fates;
		let num:number = 0;
                for(let k in fates){  
					if(fates[k]&&fates[k].modelID>0)
					{
						num = num+1;
					}
                } 
	    if(num>=2)
		{
			return true;
		}
		return false
	}
	public getObtainPoint(): boolean {
		var cfg = JsonModelManager.instance.getModelchouqian()[DataManager.getInstance().playerManager.player.fateIndex+1];
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(153);
            var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
			if(_hasitemNum>=cfg.costNum)return true;
		return false;
	}
	public getFateEquipPoint(idx:number):boolean
	{
		if(idx&&idx>=0)
		{
			for (var i: number = idx; i < idx+8; i++) {
			if(DataManager.getInstance().dupManager.getXueZhanHistoryNum>=GoodsDefine.FATE_UNLOCK[i])
			{
					if(this.getFateEquipPowerPoint(this.getPlayer().getPlayerData(0).fateThings[i],idx))
					{
						return true;
					}
			}
			else
			return false;
		}	
		}
		else 
		{
			for (var i: number = 0; i < this.getPlayer().getPlayerData(0).fateThings.length; i++) {
			if(DataManager.getInstance().dupManager.getXueZhanHistoryNum>=GoodsDefine.FATE_UNLOCK[i])
			{
					if(this.getFateEquipPowerPoint(this.getPlayer().getPlayerData(0).fateThings[i],Tool.toInt(i/7)))
					{
						return true;
					}
			}
			else
			return false;
		}
		}
		
		return false;
	}
	//检测是否有同属性的
	public checkFateEquipProp(index:number,id:number,slot:number):boolean
	{
        var fateThings :FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
         var curCfg = JsonModelManager.instance.getModelmingge()[id];
        switch(index)
        {
            case 0:  
                for(var i = 0;i<7;i++)
                {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i].modelID]
                    if(cfg)
                    {
                        for(let k in curCfg.attrAry){  
                        if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
                        {
                            return false;
                        }
                        }
                    }
                }

            break;

            case 1: 
                    for(var i = 0;i<7;i++)
                    {
                        var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i+7].modelID]
                            if(cfg)
                            {
                                for(let k in curCfg.attrAry){  
                                if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
                                {
                                    return false;
                                }
                                }
                            }
                     }

            break;

            case 2: 
                for(var i = 0;i<7;i++)
                {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i+14].modelID]
                    if(cfg)
                    {
                        for(let k in curCfg.attrAry){  
                        if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
                        {
                            return false;
                        }
                        }
                    }
                }

            break;
        }

		return true;
	}
	public getFateEquipPowerPoint(fateData:FateBase,index:number):boolean
	{
		// let curPower = this.getOnePsychByID(fateData.modelID,fateData.lv)
		
		var fates :FateBase[]= this.getPlayer().fates;
		if(DataManager.getInstance().dupManager.getXueZhanHistoryNum<GoodsDefine.FATE_UNLOCK[fateData.slot-1])
		return false;
		for(let k in fates){  
			// this.getOnePsychByID(fates[k].modelID,fates[k].lv)>curPower &&
		if(this.isEquip(index,fates[k].modelID,fateData.slot-1))
		 {
			 return true;
		 }
		}
		return false;
	}
	public isEquip(index:number,id:number,slot:number):Boolean{
        var fateThings :FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
         var curCfg = JsonModelManager.instance.getModelmingge()[id];
        switch(index)
        {
            case 0:  
                for(var i = 0;i<7;i++)
                {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i].modelID]
                    if(cfg&&i!=slot)
                    {
                        for(let k in curCfg.attrAry){  
							if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
							{
								return false;
							}
                        }
                    }
                }

            break;

            case 1: 
                    for(var i = 0;i<7;i++)
                    {
                        var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i+7].modelID]
                            if(cfg&&i+7!=slot)
                            {
                                for(let k in curCfg.attrAry){  
                                if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
                                {
                                    return false;
                                }
                                }
                            }
                     }

            break;

            case 2: 
                for(var i = 0;i<7;i++)
                {
                    var cfg = JsonModelManager.instance.getModelmingge()[fateThings[i+14].modelID]
                    if(cfg&&i+14!=slot)
                    {
                        for(let k in curCfg.attrAry){  
                        if(curCfg.attrAry[k]>0&&cfg.attrAry[k] ==curCfg.attrAry[k])
                        {
                            return false;
                        }
                        }
                    }
                }

            break;
        }
        return true;
    }
	public getCanChangeOrUpdateBySlot(index: number, slot: number): boolean {
		if (this.getCanChangePsychBySlot(index, slot)) return true;
		return false;
	}

	public getCanChangePsychBySlot(index: number, slot: number) {
		var playerData = this.getPlayer().getPlayerData(index);
		if (!playerData) return false;
		if (!this.getPlayer().getPsychIsUnlockBySlot(slot)) return false;
		var types: number[] = [];
		var base: PsychBase;
		var curr: PsychBase;
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			base = playerData.getPsychBySlot(i);
			if (base.modelID > 0) {
				if (i == slot) {
					curr = base;
				}
				if (types.indexOf(base.model.type) == -1) {
					types.push(base.model.type);
				}
			}
		}
		var data = DataManager.getInstance().psychManager.psychQueue;
		for (var key in data) {
			base = data[key];
			if (!base.model) continue;
			if (types.indexOf(base.model.type) == -1 && !curr) return true;
			if (types.indexOf(base.model.type) == -1 && curr && curr.fightValue < base.fightValue) return true;
			if (curr && curr.model.type == base.model.type && curr.fightValue < base.fightValue) return true;
		}
		return false;
	}

	public getIsEquip(id:number):boolean{
		if(DataManager.getInstance().playerManager.player.fates[id])
		return false;
	return true;
	}
	public getCurExp(bo:boolean,id:number):FateBase{
		if(bo)
		{
			if(this.getPlayer().getPlayerData().onGetFate(id))
			return this.getPlayer().getPlayerData().onGetFate(id);
		}
		else
		{	
			return DataManager.getInstance().playerManager.player.fates[id];
		}
		return null;
	}
	public idEquip:boolean = false;
	public deleteFate(id:number):void
	{
			if(this.getIsEquip(id))
			{
				this.getPlayer().getPlayerData().onCleanFate(id);
			}
			else
			{	
				DataManager.getInstance().playerManager.player.onCleanFate(id);
			}
	}
}