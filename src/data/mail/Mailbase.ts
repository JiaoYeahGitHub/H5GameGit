/**
 * 
 * 邮件信息
 * @author	lzn	
 * 
 * 
 */
class Mailbase {
	// Id	Int
	// sendTime	String
	// Title	String
	// Content	String
	// State	Byte
	// 附件长度	Byte
	// 类型	Byte
	// 物品id	Short
	// 品质	Byte
	// 数量	Int

	public id;
	public sendTime;
	public date: Date
	public title;
	public content;
	public state;
	public isOpen: boolean = true;
    public isReceived: boolean = true;
	public accessory = [];

	public constructor() {
	}
	public parseMail(msg: Message) {
		var acc: accessorybase;
		this.id = msg.getInt();
		this.sendTime = msg.getString().split(".")[0];
		this.title = msg.getString();
		this.content = msg.getString();
		this.state = msg.getByte();
		var len: number = msg.getByte();
		for (var i = 0; i < len; i++) {
			acc = new accessorybase();
			acc.parseAccessory(msg);
			this.accessory.push(acc);
		}
		var param;
		if (this.state > 10) {
            param = Math.floor(this.state / 10);
            this.isReceived = param != 1;
            param = this.state % 10;
            this.isOpen = param != 1;
			
        } else {
            this.isOpen = true;
            this.isReceived = true;
        }
		this.date = new Date(Date.parse(this.sendTime));
	}
}
class accessorybase {
	public type;
	public id;
	public quality: number = -1;
	public count;
	public lv;
	public constructor() {
	}
	public parseAccessory(msg: Message) {
		this.type = msg.getByte();
		this.id = msg.getShort();
		if (this.type == GOODS_TYPE.YUANSHEN) {
			this.lv = msg.getByte();
		} else {
			this.quality = msg.getByte();
		}
		this.count = msg.getInt();
	}

}