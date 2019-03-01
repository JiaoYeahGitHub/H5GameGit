class LianXuLeiChongManager {
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
}
