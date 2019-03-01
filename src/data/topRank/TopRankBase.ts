class TopRankBase extends SimplePlayerData {
	public rank;
	public info1;
	public info2;
	public constructor() {
		super();
	}
	public parseMessage(msg: Message) {
		this.parseMsg(msg);
		this.rank = msg.getInt();
		this.info1 = GameCommon.getInstance().getFormatNumberShow(msg.getLong());
		this.info2 = GameCommon.getInstance().getFormatNumberShow(msg.getInt());
	}
}