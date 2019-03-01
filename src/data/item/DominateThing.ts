class DominateThing extends ItemThing {
	public slot: number;
	public lv: number = 0;//等级
	public tier: number = 0;//阶段
	public own: number = 0;
	public constructor(type: GOODS_TYPE = GOODS_TYPE.ITEM) {
		super(type);
	}
	public parseEquipMessage(msg: Message): void {
		this.lv = msg.getShort();
		this.tier = msg.getShort();
	}
}