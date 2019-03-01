class OpenServerLeiChongManager {
    public allMoney: number[];
	public record = {};
    public todayMoney=0;
	public constructor() {
	}
	public onParseMessage(msg: Message): void {
		this.record = {};
        this.allMoney = [];
        this.todayMoney = msg.getInt();
        var len:number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			this.allMoney.push(msg.getByte());
		}
	}
	public getAllMoney(gold: number){
		let idx = 0;
		switch(gold){
			case 100:
				idx = 0;
				break;
			case 300:
				idx = 1;
				break;
			default:
				idx = 2;
				break;
		}
		return this.allMoney[idx];
	}
}
