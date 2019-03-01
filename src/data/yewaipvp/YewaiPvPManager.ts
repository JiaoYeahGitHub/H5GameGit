class YewaiPvPManager {
	public prestige: number;//声望
	public myrankNum: number;//我的排名
	private _resetTime: number;//次数恢复剩余时间
	public pvpfightterInfos: OtherFightData[];//附近玩家信息列表

	public constructor() {
		this.pvpfightterInfos = [];
	}
	//解析周围可挑战的玩家列表
	public onParsePVPOhterInfoMsg(msg: Message): void {
		this.prestige = msg.getInt();
		this.myrankNum = msg.getShort();
		this._resetTime = msg.getInt() + egret.getTimer();
		this.pvpfightterInfos = [];
		var fightterSize: number = msg.getByte();
		for (var i: number = 0; i < fightterSize; i++) {
			this.pvpfightterInfos[i] = new OtherFightData();
			this.pvpfightterInfos[i].parseYewaiPVPMsg(msg);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//获取当前剩余的复活时间
	public get resetTime(): number {
		return Math.max(0, Math.ceil((this._resetTime - egret.getTimer()) / 1000));
	}
	public checkEncounterPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_YEWAIPVP)) {
            return false;
        }
		if (!this.pvpfightterInfos) return false;
		if (this.pvpfightterInfos.length > 0) return true;
		return false;
	}
	//The end
}