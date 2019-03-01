/**
 * 
 * 聊天信息单条
 * @author	lzn	
 * 
 * 
 */
class ChatBase {
	// 玩家ID	Int
	// 名字	String
	// Vip	Byte
	// 聊天内容	String
	public content;
	public type;
	public sendID: number;
	public receiveID: number;
	public player: SimplePlayerData;
	public job: number = 5;
	public param: string = "";//参数
	public time: number;

	public constructor(type: number) {
		this.type = type;
		this.player = new SimplePlayerData();
	}
	public onParseMsg(msg: Message) {
		if (this.type == CHANNEL.WHISPER) {
			this.sendID = msg.getInt();
			this.receiveID = msg.getInt();
		}
		this.player.parseMsg(msg);
		// this.content = msg.getString();
		this.onParseContent(msg);
		if (this.type == CHANNEL.GUILD) {
			this.job = msg.getByte();
		}
	}
	private onParseContent(msg: Message): void {
		this.content = msg.getString();
		var matchStrAry: RegExpMatchArray = this.content.match(/\{\w+#\w[\w,]*}/g);
		if (matchStrAry) {
			var matchstr: string = matchStrAry[0];
			this.param = matchstr.slice(1, matchstr.length - 1);
			this.content = ChatDefine.getChatParamText(this);
		}
	}
	//The end
}