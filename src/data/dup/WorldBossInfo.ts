class WorldBossInfo {
	public bossId: number;//标识id
	public modelId: number;//模板id
	public currHp: number;//当前血量
	public maxHp: number;//最大血量
	public lefttime: number;//剩余时间
	public caller: SimplePlayerData;//召唤者
	public isKilled: boolean;
	public killer: SimplePlayerData;//击杀者
	public worldBossBuyNum: number = 0;

	public constructor() {
	}
	public parseBossMsg(msg: Message): void {
		this.bossId = msg.getInt();
		this.modelId = msg.getShort();
		this.currHp = msg.getInt();
		this.maxHp = msg.getInt();
		this.lefttime = msg.getInt();
		this.lefttime = egret.getTimer() + this.lefttime * 1000;
		var hasCaller: boolean = msg.getByte() != 0;
		if (hasCaller) {
			this.caller = new SimplePlayerData();
			this.caller.parseMsg(msg)
		}
		this.isKilled = msg.getByte() != 0;
		if (this.isKilled) {
			this.killer = new SimplePlayerData();
			this.killer.parseMsg(msg);
		}
		this.worldBossBuyNum = msg.getInt();
	}
}