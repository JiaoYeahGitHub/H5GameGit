class TeamDupData {
	public damageNum: number;//总伤害
	public playerdata: PlayerData;
	public constructor(body: PlayerData) {
		this.playerdata = body;
	}

	public get playerId(): number {
		return this.playerdata.playerId;
	}

	public get playerName(): string {
		return this.playerdata.name;
	}

	public parseDamageMsg(msg: Message): void {
		this.damageNum = msg.getLong();
	}
	//The end
}