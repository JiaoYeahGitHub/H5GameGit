// TypeScript file
class BagManager {
    //装备包容量上限
    private _equipMax: number;
    private _bagThingsTypeList;
    private _bagThingAllList;
    private betterEquipAry;//按照配置数量保存最优的装备且带好排序
    private _useLimit;
    private rnuesList;
    public constructor() {
        this._bagThingsTypeList = {};
        this._bagThingAllList = {};
        this.betterEquipAry = {};
        this._useLimit = {};
        this.rnuesList = {};
        for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
            this.betterEquipAry[i] = {};
        }
    }
    //初始化背包的协议
    public parseInitBag(msg: Message): void {
        this._equipMax = msg.getShort();
        var playerEquipSize: number = msg.getShort();
        for (var i: number = 0; i < playerEquipSize; i++) {
            var equipThing: EquipThing = new EquipThing();
            equipThing.parseEquipMessage(msg);
            this.addBagThing(equipThing);
            // this.cheakEquipbagIsFull();
        }
        var mountEquipSize: number = msg.getShort();
        for (var i: number = 0; i < mountEquipSize; i++) {
            var mountEquipThing: ServantEquipThing = new ServantEquipThing();
            mountEquipThing.parseMessage(msg);
            this.addBagThing(mountEquipThing);
            // this.cheakEquipbagIsFull();
        }
        var itemsSize: number = msg.getShort();
        for (var i: number = 0; i < itemsSize; i++) {
            var itemThing: ItemThing = new ItemThing();
            itemThing.parseItem1(msg);
            this.addBagThing(itemThing);
        }
        var itemboxsSize: number = msg.getShort();
        for (var i: number = 0; i < itemboxsSize; i++) {
            var boxThing: BoxThing = new BoxThing();
            boxThing.parseItem1(msg);
            this.addBagThing(boxThing);
        }
        // var itemgemSize: number = 0;
        // for (var i: number = 0; i < itemgemSize; i++) {
        //     var gemThing: GemThing = new GemThing();
        //     gemThing.parseItem1(msg);
        //     this.addBagThing(gemThing);
        // }
        var runeSize: number = msg.getShort();
        for (var i: number = 0; i < runeSize; i++) {
            var gemThing1: RnuesThing = new RnuesThing();
            gemThing1.parseItem1(msg);
            this.rnuesList[gemThing1.modelId] = gemThing1;
        }
        this.onupdateBestEquips();
        // var gemThing: GemThing = new GemThing();
        // gemThing.onupdate(1, -1, 10);
        // this.addBagThing(gemThing);
    }
    //入包协议
    public parseAddBag(msg: Message): void {
        var goodsSize = msg.getByte();
        for (var i = 0; i < goodsSize; ++i) {
            var thingType: number = msg.getByte();
            var addThing: ModelThing;
            var oldThing: ThingBase;
            var thingNum: number = 1;
            if (thingType == GOODS_TYPE.MASTER_EQUIP) {
                var equipThing: EquipThing = new EquipThing();
                equipThing.parseEquipMessage(msg);
                this.addBagThing(equipThing);
                this.sortOnEquipList(equipThing);
                addThing = equipThing.model;
                addThing.quality = equipThing.quality;
                this.onShowEquipBagIsFullTips();
                this.onCheckObtainHintEquip();
            } else if (thingType == GOODS_TYPE.SERVANT_EQUIP) {
                var mountEquipThing: ServantEquipThing = new ServantEquipThing();
                mountEquipThing.parseMessage(msg);
                this.addBagThing(mountEquipThing);
                addThing = mountEquipThing.model;
                addThing.quality = mountEquipThing.quality;
                this.onShowEquipBagIsFullTips();
            } else if (thingType == GOODS_TYPE.BOX) {
                var boxThing: BoxThing = new BoxThing();
                boxThing.parseItem1(msg);
                oldThing = this._bagThingAllList[boxThing.idKey];
                this.addBagThing(boxThing);
                addThing = boxThing.model;
                thingNum = oldThing ? boxThing.num - oldThing.num : boxThing.num;
                if (boxThing.model.useful > 0) {//触发获得提示
                    // GameDispatcher.getInstance().dispatchEvent(
                    //     new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    //     new WindowParam("ObtainHintUseGoods", new ObtainHintParam(0, boxThing))
                    // );
                }
            } else if (thingType == GOODS_TYPE.ITEM) {
                var itemThing: ItemThing = new ItemThing();
                itemThing.parseItem1(msg);
                oldThing = this._bagThingAllList[itemThing.idKey];
                this.addBagThing(itemThing);
                addThing = itemThing.model;
                thingNum = oldThing ? itemThing.num - oldThing.num : itemThing.num;
                if (itemThing.model.useful > 0 && GameDefine.HINT_PRIORITY.indexOf(itemThing.model.gotype) != -1) {//触发获得提示
                    DataManager.getInstance().hintManager.getHintSystemByType(itemThing.model.gotype);
                }
            } else if (thingType == GOODS_TYPE.GEM) {
                var gemThing: GemThing = new GemThing();
                gemThing.parseItem1(msg);
                this.addBagThing(gemThing);
                addThing = gemThing.model;
                addThing.quality = gemThing.quality;
            } else if (thingType == GOODS_TYPE.RNUES) {
                var gemThing1: RnuesThing = new RnuesThing();
                // gemThing1.modelId= msg.getShort();
                // gemThing1.num = msg.getInt();
                gemThing1.parseItem1(msg);
                addThing = gemThing1.model;//new ModelThing(JsonModelManager.instance.getModelzhanwen()[gemThing1.modelId],26)
                // gemThing1.quality = gemThing1.model.quality;
                oldThing = this.rnuesList[gemThing1.modelId];
                this.rnuesList[gemThing1.modelId] = gemThing1;
                thingNum = oldThing ? gemThing1.num - oldThing.num : gemThing1.num;
            }
            var thingFrom: number = msg.getShort();
            GameCommon.getInstance().onGetThingAlert(addThing, thingNum, thingFrom);
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), thingType);
    }
    //出包协议
    public praseRemoveBag(msg: Message): void {
        let thingType: number = msg.getByte();
        let thingId: number = msg.getShort();
        let thingNum: number = msg.getInt();
        this.removeBagThing(thingType, thingId, thingNum);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), thingType);
    }
    //出包协议
    public removeBag(thingType: number, thingId: number, thingNum: number): void {
        this.removeBagThing(thingType, thingId, thingNum);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), thingType);
    }
    //添加物品
    private addBagThing(thing: ThingBase): void {
        var oldThing: ThingBase = this._bagThingAllList[thing.idKey];
        var bagTypeAry: ThingBase[];
        if (!this._bagThingsTypeList[thing.type]) {
            this._bagThingsTypeList[thing.type] = [];
        }
        bagTypeAry = this._bagThingsTypeList[thing.type];
        if (!oldThing) {
            bagTypeAry.push(thing);
        } else {
            var thingAryIndex: number = bagTypeAry.indexOf(oldThing);
            if (thingAryIndex < 0) {
                bagTypeAry.push(thing);
            } else {
                bagTypeAry.splice(thingAryIndex, 1, thing);
            }
        }
        this._bagThingAllList[thing.idKey] = thing;
        oldThing = null;
    }
    //使用移除物品
    private removeBagThing(type, id, num): void {
        var thingIdKey: string = type + "_" + id;
        var oldThing: ThingBase = this._bagThingAllList[thingIdKey];
        if (type == 26) {
            var gemThing1: RnuesThing = new RnuesThing();
            gemThing1.modelId = id;
            gemThing1.num = num;
            gemThing1.quality = gemThing1.model.quality;
            this.rnuesList[gemThing1.modelId] = gemThing1;
        }
        if (!oldThing)
            return;
        if (oldThing.type == GOODS_TYPE.MASTER_EQUIP) {
            this.sortOnEquipList(<EquipThing>oldThing, false);
            this.onShowEquipBagIsFullTips();
        } else if (oldThing.type == GOODS_TYPE.SERVANT_EQUIP) {
            this.onShowEquipBagIsFullTips();
        } else if (oldThing.type == GOODS_TYPE.BOX && oldThing.num > num) {
            if (oldThing.model && oldThing.model.rewards && oldThing.model.rewards[0] && oldThing.model.rewards[0].type == GOODS_TYPE.EXP) {
                let expThing: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.EXP, 0);
                let usenum: number = oldThing.num - num;
                GameCommon.getInstance().onGetThingAlert(expThing, oldThing.model.rewards[0].num * usenum, GOODS_CHANGE_TYPE.GOODS_USE_ADD);
            }
        }
        var isRemove: boolean = num == 0;

        var bagTypeAry: ThingBase[] = this._bagThingsTypeList[type];
        if (isRemove) {
            if (bagTypeAry) {
                Tool.removeArrayObj(bagTypeAry, oldThing);
            }
            delete this._bagThingAllList[thingIdKey];
            oldThing = null;
        } else {
            oldThing.num = num;
        }
    }
    public getRnuesList(idx: number): number {
        if (this.rnuesList[idx])
            return this.rnuesList[idx].num;
        else
            return 0;
    }
    private _zhanwenCfgs: Modelzhanwen[] = JsonModelManager.instance.getModelzhanwen();
    public getRnuesLvPoint(idx: number = -1): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_RNUES)) {
            return false;
        }
        if (idx >= 0) {
            for (let k in this._zhanwenCfgs) {
                if (this.getRnuesList(this._zhanwenCfgs[k].id) >= 2 && this._zhanwenCfgs[k].type == idx) {
                    if (this._zhanwenCfgs[Number(k) + 1 + ''] && this._zhanwenCfgs[Number(k) + 1 + ''].type == this._zhanwenCfgs[k].type)
                        return true;
                }
            }
        }
        else {
            for (let k in this._zhanwenCfgs) {
                if (this.getRnuesList(this._zhanwenCfgs[k].id) >= 2) {
                    if (this._zhanwenCfgs[Number(k) + 1 + ''] && this._zhanwenCfgs[Number(k) + 1 + ''].type == this._zhanwenCfgs[k].type)
                        return true;
                }
            }
        }
        return false;
    }
    public getEquipRnuesPoint(idx: number = -1): boolean {
        if (idx >= 0) {
            var num: number = 0;
            for (var i: number = idx * 5 - 5; i < idx * 5; i++) {
                var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];

                if (modelId == 0) {
                    for (let k in this._zhanwenCfgs) {
                        if (this.getRnuesList(this._zhanwenCfgs[k].id) > 0 && this._zhanwenCfgs[k].type == num) {
                            return true;
                        }
                    }
                }
                else {
                    for (let k in this._zhanwenCfgs) {
                        if (this.getRnuesList(this._zhanwenCfgs[k].id) > 0 && this._zhanwenCfgs[k].type == num && this._zhanwenCfgs[k].id > modelId) {
                            return true;
                        }
                    }
                }
                num = num + 1;
            }
        }
        else {
            var num: number = 0;
            for (var i: number = 0; i < 50; i++) {
                var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
                if (modelId == 0) {
                    for (let k in this._zhanwenCfgs) {
                        if (this.getRnuesList(this._zhanwenCfgs[k].id) > 0 && this._zhanwenCfgs[k].type == num) {
                            return true;
                        }
                    }
                }
                else {
                    for (let k in this._zhanwenCfgs) {
                        if (this.getRnuesList(this._zhanwenCfgs[k].id) > 0 && this._zhanwenCfgs[k].type == num && this._zhanwenCfgs[k].id > modelId) {
                            return true;
                        }
                    }
                }
                num = num + 1;
                if (num >= 5) {
                    num = 0;
                }
            }
        }
        return false;
    }
    public onGetEquipLvUpPoint(idx: number = -1): boolean {
        if (idx >= 0) {
            for (var i: number = idx * 5 - 5; i < idx * 5; i++) {
                var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
                if (modelId > 0) {
                    var cfg = JsonModelManager.instance.getModelzhanwen()[modelId];
                    var nextCfg = JsonModelManager.instance.getModelzhanwen()[modelId + 1];
                    if (nextCfg && nextCfg.type == cfg.type) {
                        if (DataManager.getInstance().bagManager.getRnuesList(modelId) > 0) {
                            return true;
                        }
                    }
                }
            }
        }
        else {
            for (var i: number = 0; i < 50; i++) {
                var modelId: number = DataManager.getInstance().playerManager.player.getPlayerData().rnuesList[i];
                if (modelId > 0) {
                    var cfg = JsonModelManager.instance.getModelzhanwen()[modelId];
                    var nextCfg = JsonModelManager.instance.getModelzhanwen()[modelId + 1];
                    if (nextCfg && nextCfg.type == cfg.type) {
                        if (DataManager.getInstance().bagManager.getRnuesList(modelId) > 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    public getAllRnuesPoint(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_RNUES)) {
            return false;
        }
        if (this.getRnuesLvPoint()) return true;
        if (this.checkAllEquipPointPoint()) return true;
        return false;
    }
    public checkAllEquipPointPoint(idx: number = -1): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_RNUES)) {
            return false;
        }
        if (idx >= 0) {
            if (this.getEquipRnuesPoint(idx)) return true;
            if (this.onGetEquipLvUpPoint(idx)) return true;
        }
        else {
            if (this.getEquipRnuesPoint()) return true;
            if (this.onGetEquipLvUpPoint()) return true;
        }

        return false;
    }
    //一键装备
    public onClothEquipAll(equipType: number = 0): void {
        var _canClothEquips = this.getJobClothEquips(equipType);
        if (_canClothEquips.length > 0) {
            var clothEquipMsg: Message = new Message(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE);
            clothEquipMsg.setByte(0);
            clothEquipMsg.setByte(_canClothEquips.length);
            for (var idx in _canClothEquips) {
                var equip: EquipThing = _canClothEquips[idx];
                clothEquipMsg.setByte(equip.model.part);
                clothEquipMsg.setShort(equip.equipId);
                this.onRemoveClothhEquips(equip);
            }
            GameCommon.getInstance().sendMsgToServer(clothEquipMsg);
        }
    }
    //将装备列表进行排序
    private sortOnEquipList(equip: EquipThing, isAdd: boolean = true): void {
        if (isAdd) {
            var euqipModel = equip.model;
            var zhuanshengLv: number = Math.max(1, DataManager.getInstance().playerManager.player.coatardLv);
            if (equip.model.coatardLv <= zhuanshengLv) {
                this.onSaveCanClothEquips(equip);//euqipModel.occupation
            }
        } else {
            this.onRemoveClothhEquips(equip);
        }
    }
    //缓存能穿的装备 按照配置的个数
    private onSaveCanClothEquips(equip: EquipThing, occIndex: number = 0): void {
        var position: MASTER_EQUIP_TYPE = equip.model.part;
        var compareEquip: EquipThing = this.betterEquipAry[occIndex][position];
        if (compareEquip) {
            if (compareEquip.idKey == equip.idKey) return;
            compareEquip = GameCommon.getInstance().compareEquip(compareEquip, equip, true);
            if (compareEquip.idKey == equip.idKey) {
                this.betterEquipAry[occIndex][position] = equip;
            }
        } else {
            var playerData = DataManager.getInstance().playerManager.player.getPlayerDataByOccp(occIndex);
            var bodyClothEquip: EquipThing = playerData.getEquipBySlot(position);
            if (bodyClothEquip.idKey == equip.idKey) return;//如果是刚从身上脱下来的装备不用比较了
            compareEquip = GameCommon.getInstance().compareEquip(bodyClothEquip, equip, true);
            if (compareEquip.idKey == equip.idKey) {
                this.betterEquipAry[occIndex][position] = equip;
            }
        }
    }
    //从可穿戴列表中移除
    public onRemoveClothhEquips(equip: EquipThing): void {
        var euqipModel: ModelThing = equip.model;
        for (var occIdx: number = 0; occIdx < GameDefine.Max_Role_Num; occIdx++) {
            var equips = this.betterEquipAry[occIdx];
            var oldEquip: EquipThing = equips[euqipModel.part];
            if (oldEquip && oldEquip.idKey == equip.idKey) {
                delete this.betterEquipAry[occIdx][euqipModel.part];
                break;
            }
        }
    }
    //获取对应职业的可穿戴列表
    public getJobClothEquips(equipType: number, job: number = 0): EquipThing[] {
        let equipDict = this.betterEquipAry[job];
        let _canClothEquips = [];
        for (let pos in equipDict) {
            let equipthing: EquipThing = equipDict[pos];
            if ((equipType == 0 && equipthing.model.part < GameDefine.Equip_Slot_Num) ||
                (equipType == 1 && equipthing.model.part >= GameDefine.Equip_Slot_Num && equipthing.model.part < GameDefine.Equip_Slot_Num * 2) ||
                (equipType == 2 && equipthing.model.part >= GameDefine.Equip_Slot_Num * 2)) {
                _canClothEquips.push(equipthing);
            }
        }
        return _canClothEquips;
    }
    //检查一下是否有能穿的装备
    private onCheckObtainHintEquip(): void {
        var canClothEquipThing: EquipThing = this.onCheckHasBestEquip();
        if (canClothEquipThing) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_OBTAINHINT_SHOW), new ObtainHintParam(HINT_TIPS_TYPE.EQUIP, canClothEquipThing));
        }
    }
    public onCheckHasBestEquip(): EquipThing {
        for (var i: number = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; i++) {
            var _playerData: PlayerData = DataManager.getInstance().playerManager.player.playerDatas[i];
            for (var slotIdx: number = 0; slotIdx < GoodsDefine.EQUIP_SLOT_TYPE.length; slotIdx++) {
                var position: MASTER_EQUIP_TYPE = GoodsDefine.EQUIP_SLOT_TYPE[slotIdx];
                var canClothEquip: EquipThing = this.betterEquipAry[i][position];
                if (canClothEquip) {
                    return canClothEquip;
                }
            }
        }
        return null;
    }
    //更新缓存的最好的装备
    public onupdateBestEquips(): void {
        var bagEquips: EquipThing[] = <EquipThing[]>this.getGoodsListByType(GOODS_TYPE.MASTER_EQUIP);
        for (var i: number = 0; i < bagEquips.length; i++) {
            this.sortOnEquipList(bagEquips[i]);
        }
    }
    //根据物品类型获取对应物品列表
    public getGoodsListByType(type): ThingBase[] {
        var arr: ThingBase[] = this._bagThingsTypeList[type];
        if (arr) {
            for (var i: number = arr.length - 1; i >= 0; i--) {
                if (arr[i].num <= 0 && arr[i].type != GOODS_TYPE.MASTER_EQUIP && arr[i].type != GOODS_TYPE.SERVANT_EQUIP) {
                    arr.splice(i, 1);
                }
            }
        } else {
            arr = [];
        }
        return arr;//返回为空是无此类道具
    }

    /**
     * 根据类型数组分类背包显示
     * 
     * **/
    public getGoodsListByTypes(types: number[]): ThingBase[] {
        var ret: ThingBase[] = [];
        var curr: ThingBase[];
        for (var i: number = 0; i < types.length; i++) {
            curr = this._bagThingsTypeList[types[i]];
            if (curr) {
                for (var j: number = 0; j < curr.length; j++) {
                    ret.push(curr[j]);
                }
            }
        }
        if (types[0] == 1) {
            while (ret.length > this._equipMax) {
                ret.shift();
            }
        }
        return ret;
    }
    public getAllRunes(): ThingBase[] {
        var ret: ThingBase[] = [];
        var curr: ThingBase;
        for (var idx in this.rnuesList) {
            curr = this.rnuesList[idx];
            if (curr && curr.num > 0) {
                ret.push(this.rnuesList[idx]);
            }
        }
        while (ret.length > this._equipMax) {
            ret.shift();
        }
        return ret;
    }
    public getIsFullBag(): boolean {
        var ret = this.getGoodsListByTypes(BagTypePanel.types[0]);
        return ret.length == this._equipMax;
    }

    //根据物品id返回物品 如果没有返回null 只针对物品 （因为类型之前写死的改地方过多 所以保留）
    public getGoodsThingById(modelId: number, type: number = GOODS_TYPE.ITEM): ItemThing {
        return this._bagThingAllList[type + "_" + modelId];
    }
    public getGoodsThingNumById(modelId: number, type: number = GOODS_TYPE.ITEM): number {
        var _hasitemNum: number = 0;
        var _itemThing: ItemThing = this.getGoodsThingById(modelId, type);
        _hasitemNum = _itemThing ? _itemThing.num : 0;
        return _hasitemNum;
    }
    public parseUpdateBag(msg: Message): void {
        var len = msg.getShort();
        for (var i = 0; i < len; i++) {
            var thingId: number = msg.getShort();
            this.removeBagThing(GOODS_TYPE.MASTER_EQUIP, thingId, 0);
        }
        len = msg.getShort();
        for (var i = 0; i < len; i++) {
            var thingId: number = msg.getShort();
            this.removeBagThing(GOODS_TYPE.SERVANT_EQUIP, thingId, 0);
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), GOODS_TYPE.MASTER_EQUIP);
    }
    public parseUpdateMasterBag(msg: Message): void {
        var len = msg.getShort();
        for (var i = 0; i < len; i++) {
            var thingId: number = msg.getInt();
            this.removeBagThing(GOODS_TYPE.MASTER_EQUIP, thingId, 0);
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), GOODS_TYPE.MASTER_EQUIP);
    }
    public parseUpperlimit(msg: Message): void {
        var type: number = msg.getByte();
        this._equipMax = msg.getShort();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public parseUselimit(msg: Message) {
        var len: number = msg.getShort();
        var base: UseLimit;
        for (var i: number = 0; i < len; i++) {
            base = new UseLimit();
            base.parseMessage(msg);
            this._useLimit[base.id] = base;
        }
    }

    /*获取可熔炼装备*/
    public getEquipListCanSmelt(): EquipThing[] {
        let cacheBagBestEquips = [];
        let smeltEquips: EquipThing[] = [];
        let bagEquips: EquipThing[] = <EquipThing[]>this.getGoodsListByType(GOODS_TYPE.MASTER_EQUIP);
        if (!bagEquips)
            return smeltEquips;
        let notRonglianEquip = {};//key:等级_职业_装备类型 装备内容个数通过equiptypeSaveNum配置
        let compareEquip: EquipThing;
        for (let i: number = 0; i < bagEquips.length; i++) {
            let bagequipThing: EquipThing = bagEquips[i];
            if (bagequipThing.quality > GoodsQuality.Orange)
                continue;
            let modelequip: ModelThing = bagequipThing.model;
            let canClothEquip: EquipThing = this.betterEquipAry[0][modelequip.part];
            if (canClothEquip && canClothEquip.idKey == bagequipThing.idKey) {
                continue;
            }
            let bodyClothEquip: EquipThing = DataManager.getInstance().playerManager.player.getPlayerData().getEquipBySlot(bagequipThing.model.part);
            if (bodyClothEquip) {
                compareEquip = GameCommon.getInstance().compareEquip(bodyClothEquip, bagequipThing, false);
                if (compareEquip.idKey == bodyClothEquip.idKey) {
                    smeltEquips.push(bagequipThing);
                    continue;
                }
            }

            let saveKey: string = modelequip.level + "_" + modelequip.part;
            if (!notRonglianEquip[saveKey]) {
                notRonglianEquip[saveKey] = bagequipThing;
                continue;
            }
            let cacheEquip: EquipThing = notRonglianEquip[saveKey];
            compareEquip = GameCommon.getInstance().compareEquip(cacheEquip, bagequipThing, false);
            if (compareEquip.idKey == bagequipThing.idKey) {
                notRonglianEquip[saveKey] = bagequipThing;
                smeltEquips.push(cacheEquip);
            } else {
                smeltEquips.push(bagequipThing);
            }
        }


        // var compares = {};
        // var currEquip: ServantEquipThing;
        // var currModel: ModelThing;
        // var clothEquip: ServantEquipThing;
        // var modelID: number = 0;
        // var mountEquips: ServantEquipThing[] = <ServantEquipThing[]>this.getGoodsListByType(GOODS_TYPE.SERVANT_EQUIP);
        // if (!mountEquips) return smeltEquips;
        // for (var i: number = 0; i < mountEquips.length; i++) {
        //     currEquip = mountEquips[i];
        //     currModel = mountEquips[i].model;
        //     if (currEquip.issmelt)
        //         continue;
        //     clothEquip = DataManager.getInstance().playerManager.player.getPlayerData().getBlessEquip(currModel.blesstype, currModel.part);
        //     //1.比身上差的装备都熔炼掉
        //     if (clothEquip) {
        //         if (clothEquip.pingfenValue >= currEquip.pingfenValue) {
        //             smeltEquips.push(currEquip);
        //             continue;
        //         }
        //     }
        //     //2.比身上好的去和同阶段的比较保存一个
        //     var bestkey: string = `${currModel.blesstype}_${currModel.part}`;
        //     var mountEquip: ServantEquipThing = compares[bestkey];
        //     if (!mountEquip) {
        //         compares[bestkey] = currEquip;
        //     } else {
        //         if (mountEquip.pingfenValue >= currEquip.pingfenValue) {
        //             smeltEquips.push(currEquip);
        //         } else {
        //             compares[bestkey] = currEquip;
        //             smeltEquips.push(mountEquip);
        //         }
        //     }
        // }
        return smeltEquips;
    }
    public removeEquipByArr(arr: EquipThing[]) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var thingId: number = arr[i].equipId;
            this.removeBagThing(GOODS_TYPE.MASTER_EQUIP, thingId, 0);
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_BAG_UPDATE), GOODS_TYPE.MASTER_EQUIP);
    }
    public get equipMax() {
        return this._equipMax;
    }
    public cheakEquipbagIsFull(leftnum: number = 0): boolean {
        var bagEquips: EquipThing[] = <EquipThing[]>this.getGoodsListByTypes([GOODS_TYPE.MASTER_EQUIP, GOODS_TYPE.SERVANT_EQUIP]);
        if (!bagEquips)
            return false;
        return bagEquips.length >= this.equipMax - leftnum;
    }
    public onShowEquipBagIsFullTips(): void {
        if (this.cheakEquipbagIsFull(11)) {
            GameCommon.getInstance().onShowFuncTipsBar(FUNCTIP_TYPE.BAGFULL, "背包容量不足，请回收");
        } else {
            GameCommon.getInstance().onHideFuncTipsBar(FUNCTIP_TYPE.BAGFULL);
        }
    }
    public getCanOpenBox() {
        var boxThing: BoxThing;
        var data = DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.BOX);
        for (var key in data) {
            boxThing = data[key] as BoxThing;
            if (boxThing) {
                return true;
            }
        }
        return false;
    }
    public isOwnThis(awards: AwardItem[]): boolean {
        var data = DataManager.getInstance().bagManager;
        var isHas: boolean = true;
        var award: AwardItem;
        var item: ItemThing;
        for (var i: number = 0; i < awards.length; i++) {
            award = awards[i];
            item = data._bagThingAllList[award.idKey];
            if (!item || item.num < award.num) {
                return false;
            }
        }
        return isHas;
    }
    public getOneSeriesGemByGemType(gemType: number) {
        var gem;
        var ret: GemThing[] = [];
        var arr: ThingBase[] = this._bagThingsTypeList[GOODS_TYPE.GEM];
        if (arr) {
            for (var key in arr) {
                gem = arr[key];
                if (gem.model.type == gemType) {
                    ret.push(gem);
                }
            }
            ret = ret.sort((n1: GemThing, n2: GemThing) => {
                if (n1.model.level > n2.model.level) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
        return ret;//返回为空是无此类道具
    }
    public getOneSeriesOBJGemByGemType(gemType: number) {
        var gem;
        var ret = {};
        var arr: ThingBase[] = this._bagThingsTypeList[GOODS_TYPE.GEM];
        if (arr) {
            for (var key in arr) {
                gem = arr[key];
                if (gem.model.type == gemType) {
                    ret[gem.modelId] = gem;
                }
            }
        }
        return ret;//返回为空是无此类道具
    }
    public getDomInateEquip() {
        var ret: ItemThing[] = [];
        var thing: ItemThing;
        for (var i: number = 0; i < GameDefine.Domiante_IDs.length; i++) {
            thing = this.getGoodsThingById(GameDefine.Domiante_IDs[i], GOODS_TYPE.ITEM);
            if (thing) {
                ret.push(thing);
            }
        }
        return ret;
    }
    public getSmeltEquipNormal() {
        // var thing;
        // thing = this.getEquipListCanSmelt();
        // var len: number = thing.length;
        // for (var i: number = 0; i < len; i++) {
        //     if (i < 9) {
        //         thing[i].selected = true;
        //         thing[i].smeltSot = i;
        //     } else {
        //         thing[i].selected = false;
        //     }
        // }
        // return thing;
        return this.getEquipListCanSmelt();
    }
    //获得可熔炼坐骑装备
    public getSmeltEquipSpecial(blesstype: BLESS_TYPE = -1): Array<ServantEquipThing> {
        var power;
        var ret: ServantEquipThing[] = [];
        var compares = {};
        var currEquip: ServantEquipThing;
        var currModel: ModelThing;
        var clothEquip: ServantEquipThing;
        var modelID: number = 0;
        var bagEquips: ServantEquipThing[] = <ServantEquipThing[]>this.getGoodsListByType(GOODS_TYPE.SERVANT_EQUIP);
        if (!bagEquips) return ret;
        for (var i: number = 0; i < bagEquips.length; i++) {
            currEquip = bagEquips[i];
            currModel = bagEquips[i].model;
            if (currEquip.issmelt)
                continue;
            if (blesstype >= 0 && currModel.blesstype != blesstype)
                continue;
            clothEquip = DataManager.getInstance().playerManager.player.getPlayerData().getBlessEquip(currModel.blesstype, currModel.part);
            //1.比身上差的装备都熔炼掉
            if (clothEquip) {
                if (clothEquip.pingfenValue >= currEquip.pingfenValue) {
                    ret.push(currEquip);
                    continue;
                }
            }
            //2.比身上好的去和同阶段的比较保存一个
            var bestkey: string = `${currModel.blesstype}_${currModel.part}`;
            var compareEquip: ServantEquipThing = compares[bestkey];
            if (!compareEquip) {
                compares[bestkey] = currEquip;
            } else {
                if (compareEquip.pingfenValue >= currEquip.pingfenValue) {
                    ret.push(currEquip);
                } else {
                    compares[bestkey] = currEquip;
                    ret.push(compareEquip);
                }
            }
        }
        return ret;
    }

    public getUseLimitNumByID(id: number): number {
        if (this._useLimit[id]) {
            return this._useLimit[id].useTime;
        } else {
            return 0;
        }
    }

    public getEquipSmeltPointShow(): boolean {
        if (this.getSmeltEquipCommonPoint()) return true;
        if (this.getSmeltEquipSpecialPointShow()) return true;
        return false;
    }

    public getSmeltEquipCommonPoint(): boolean {
        var arr = this.getEquipListCanSmelt();
        if (arr.length >= GameDefine.SMELT_EQUIPS_NUM) return true;
        return false;
    }

    public getSmeltEquipSpecialPointShow(): boolean {
        if (!FunDefine.isFunOpen(FUN_TYPE.FUN_BLESS_SMELT)) return false;
        var list = this.getSmeltEquipSpecial();
        if (list && list.length > 0) {
            return true;
        }
        return false;
    }
    //宝箱的红点判断
    private _openVipBoxIds: number[];
    public recordVipBoxOpenId(id: number) {
        if (!this._openVipBoxIds) {
            this._openVipBoxIds = [];
        }
        if (this._openVipBoxIds.indexOf(id) < 0) {
            this._openVipBoxIds.push(id);
        }
    }

    public getItemCanUsePointShow(): boolean {
        var arr = this.getGoodsListByType(GOODS_TYPE.BOX);
        if (!arr) return false;
        for (var i: number = 0; i < arr.length; i++) {
            if (this.getItemCanUsePointShowByUID(arr[i].modelId)) return true;
        }
        return false;
    }
    public getItemCanUsePointShowByUID(modelID: number): boolean {
        if (this._openVipBoxIds && this._openVipBoxIds.indexOf(modelID) >= 0) return false;
        var has = this.getGoodsThingNumById(modelID);
        var box = JsonModelManager.instance.getModelbox()[modelID];
        var useTime = this.getUseLimitNumByID(modelID);
        if (box.useMax == -1) return true;
        var remain = box.useMax - useTime;
        if (0 < has && remain > 0) return true;
        return false;
    }
    public getAllRedEquip(): EquipThing[] {
        var ret: EquipThing[] = [];
        var bagEquips: EquipThing[] = <EquipThing[]>DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.MASTER_EQUIP);
        if (bagEquips) {
            for (var i: number = 0; i < bagEquips.length; i++) {
                var equip: EquipThing = bagEquips[i];
                let canClothEquip: EquipThing = this.betterEquipAry[0][equip.model.part];
                if (canClothEquip && canClothEquip.idKey == equip.idKey) {
                    continue;
                }
                if (equip.quality != GoodsQuality.Red)
                    continue;
                ret.push(equip);
            }
        }
        return ret;
    }

    public getAllGoldEquip(): EquipThing[] {
        var ret: EquipThing[] = [];
        var bagEquips: EquipThing[] = <EquipThing[]>DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.MASTER_EQUIP);
        if (bagEquips) {
            for (var i: number = 0; i < bagEquips.length; i++) {
                var equip: EquipThing = bagEquips[i];
                let canClothEquip: EquipThing = this.betterEquipAry[0][equip.model.part];
                if (canClothEquip && canClothEquip.idKey == equip.idKey) {
                    continue;
                }
                if (equip.quality != GoodsQuality.Gold)
                    continue;
                ret.push(equip);
            }
        }
        return ret;
    }
    //背包红点
    //  THE END
}
class UseLimit {
    public id: number;
    public useTime: number;
    public constructor(id: number = 0, useTime: number = 0) {
        this.id = id;
        this.useTime = useTime;
    }
    public parseMessage(msg: Message): void {
        this.id = msg.getShort();
        this.useTime = msg.getInt();
    }
}