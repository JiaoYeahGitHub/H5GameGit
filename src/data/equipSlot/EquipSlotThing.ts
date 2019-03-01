class EquipSlotThing {
    public slot;//槽位索引
    public infuseLv = 0;//注灵
    public infuseExp = 0;//注灵经验
    public intensifyLv = 0;//强化
    public gemLv = 0;//宝石
    public zhLv = 0;// 淬炼
    //淬炼
    public quenchingLv = 0;
    public quenchingExp = 0;

    public constructor() {
    }

    public parseEquipMessage(msg: Message): void {
        this.infuseLv = msg.getInt();//注灵
        this.infuseExp = msg.getInt();//注灵经验
        this.intensifyLv = msg.getInt();//强化
        this.gemLv = msg.getInt();//宝石
        this.zhLv = msg.getByte();//淬炼
        this.quenchingLv = msg.getByte();
        this.quenchingExp = msg.getInt();
    }
    /**根据宝石的槽位Index 获取宝石等级**/
    public getGemLvByGemSlot(gemslot: number): number {
        var _gemlv: number = Tool.toInt(this.gemLv / GameDefine.GEM_SLOT_NUM);
        if (this.gemLv % GameDefine.GEM_SLOT_NUM > gemslot) {
            _gemlv++;
        }
        return _gemlv;
    }
}