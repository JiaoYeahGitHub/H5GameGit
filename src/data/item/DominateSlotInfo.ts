class DominateSlotInfo {
	public slot: number;
	public lv: number;//等级
	public tier: number;//阶段
	public constructor() {
	}
	public parseEquipMessage(msg: Message): void {
		this.lv = msg.getShort();
		this.tier = msg.getShort();
	}
}