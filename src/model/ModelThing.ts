// TypeScript file
class ModelThing {
    private _model: ModelJsonBase;
    private _type: GOODS_TYPE.MASTER_EQUIP;
    public constructor(model: ModelJsonBase, type: GOODS_TYPE.MASTER_EQUIP) {
        this._model = model;
        this._type = type;
    }

    /**--------新JSON数据----------**/
    public get id(): number {
        return this._model["id"];
    }
    //物品类型
    public get type(): number {
        return this._type;
    }
    //物品基础属性
    public get attrAry(): number[] {
        return this._model['attrAry'];
    }
    //物品名
    public get name(): string {
        return this._model["name"];
    }
    //物品icon
    public get icon(): string {
        return this._model["icon"];
    }
    //物品掉落icon
    public get dropicon(): string {
        return this._model["Dropicon"];
    }
    //BOX开出物品
    public get rewards(): AwardItem[] {
        return this._model["rewards"];
    }
    //物品品质
    private _quality: number = 0;
    public set quality(value: number) {
        this._quality = value;
    }
    public get quality(): number {
        if (this._model["quality"]) {
            return this._model["quality"];
        } else if (this._model["pinzhi"]) {
            return this._model["pinzhi"];
        } else {
            return this._quality;
        }
    }
    //物品等级
    public get level(): number {
        return this._model["level"];
    }
    //等级对应的修真等级
    public get coatardLv(): number {
        return this._model["coatardLv"] || this._model["jieduan"];
    }
    //物品描述
    public get des(): string {
        return this._model["des"];
    }
    //
    public get useful(): number {
        return this._model['useful'];
    }
    //前往类型
    public get gotype(): number {
        return this._model['gotype'];
    }
    //获取途径
    private _fromTujings: number[];
    public get tujing(): number[] {
        if (!this._fromTujings && String(this._model['tujing']) != '') {
            this._fromTujings = [];
            var tujings: string[] = String(this._model['tujing']).split(",");
            for (var i: number = 0; i < tujings.length; i++) {
                var gotype: number = parseInt(tujings[i]);
                if (gotype > 0) {
                    this._fromTujings.push(gotype);
                }
            }
        }
        return this._fromTujings;
    }
    //物品装备位
    public get part(): number {
        return this._model['position'];
    }
    //装备对应职业，-1代表全职业
    private _occupation: number = -1;
    public get occupation(): number {
        if (!isNaN(this._model['occupation'])){
            return this._model['occupation'];
        }else{
            return this._occupation;
        }
    }
    //外形
    public get appearance(): number {
        return this._model['Appearance'];
    }
    //装备属性
    public get equipAttr(): number[] {
        let _equipAttrAry: number[] = [];
        if (this.type == GOODS_TYPE.MASTER_EQUIP) {
            // if (this.quality == GoodsQuality.Gold) {
            //     _equipAttrAry = GameCommon.getInstance().mergeAry([this.effct, this.addEffect]);
            // } else {
                var qualityAddRate: number = GoodsDefine.EQUIP_QUALITY_ADDRATE[this.quality];
                for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
                    var attrValue: number = Math.floor(this.attrAry[i] * qualityAddRate);
                    _equipAttrAry[i] = attrValue;
                }
            // }
        } else {
            for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
                _equipAttrAry[i] = this.attrAry[i];
            }
        }
        return _equipAttrAry;
    }
    //装备评分
    public get pingfenValue(): number {
        return GameCommon.calculationFighting(this.equipAttr);
    }
    //暗金属性
    public get effct(): number[] {
        return GameCommon.getInstance().onParseAttributeStr(this._model['effct']);
    }
    //属性加成
    public get addEffect(): number[] {
        return GameCommon.getInstance().onParseAttributeStr(this._model['addEffect']);
    }
    //红装下一阶段ID
    public get next(): number {
        return this._model['next'];
    }
    //消耗
    public get cost(): AwardItem {
        return this._model['cost'];
    }
    //消耗数量
    public get costNum(): number {
        return this._model['costNum'];
    }
    //限时道具时间
    public get limitTime(): number {
        return this._model['lastTime'];
    }
    //祝福值装备阶段
    public get jieduan(): number {
        return this._model['jieduan'];
    }
    //祝福值装备类型
    public get blesstype(): number {
        return this._model['type'];
    }
    //祝福值装备星级
    public get starNum(): number {
        return this._model["star"];
    }
    //The end
}

class AwardItem {
    public type: number;
    public id: number;
    public num: number = -1;
    public quality: number;
    public lv: number = 0;
    public uid: number = 0;
    public constructor(type = 0, id = 0, num = -1, quality = -1, lv = 0) {
        this.type = type;
        this.id = id;
        this.num = num;
        this.quality = quality;
        this.lv = lv;
    }
    public parseMessage(msg: Message) {
        this.type = msg.getByte();
        this.id = msg.getShort();
        this.quality = msg.getByte();
        this.num = msg.getInt();
    }
    public get idKey(): string {
        return this.type + "_" + this.id;
    }
    public get thingbase() {
        return new ThingBase(this.type, this.id, this.num);
    }
    public get thingmodel(): ModelThing {
        return null;
    }
}