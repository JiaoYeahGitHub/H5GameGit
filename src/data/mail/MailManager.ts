/**
 * 邮件管理类
 * @author	lzn
 * 
 * 
 */
class MailManager {
	public mail;
	public constructor() {
		this.mail = {};
	}
	public parseMail(msg: Message) {
		var len = msg.getShort();
		for (var i = 0; i < len; i++) {
			this.parseMailNew(msg);
		}
	}
	public parseMailRead(msg: Message) {
		var id = msg.getInt();
		var mail: Mailbase = this.getMailByID(id);
		if (mail) {
			mail.isOpen = true;
		}
	}
	public parseMailAccessory(msg: Message) {
		var id = msg.getInt();
		var mail: Mailbase = this.getMailByID(id);
		if (mail) {
			mail.isReceived = true;
			mail.isOpen = true;
		}
	}
	public parseMailAccessoryAll(msg: Message) {
		var len = msg.getShort();
		var id;
		var mail: Mailbase;
		for (var i = 0; i < len; i++) {
			id = msg.getInt();
			mail = this.getMailByID(id);
			if (mail) {
				mail.isReceived = true;
				mail.isOpen = true;
			}
		}
	}
	public parseMailNew(msg: Message) {
		var m: Mailbase = new Mailbase();
		m.parseMail(msg);
		this.mail[m.id] = m;
	}
	public sortMail() {
		var arr: Mailbase[] = [];
		for (var key in this.mail) {
			arr.push(this.mail[key]);
		}
		arr = arr.sort((n1, n2) => {
			if (n1.date > n2.date) {
				return -1;
			} else {
				return 1;
			}
			// if (n1.state < n2.state) {
			// 	return -1;
			// } else if (n1.state > n2.state) {
			// 	return 1;
			// } else {
			// 	if (n1.date > n2.date) {
			// 		return -1;
			// 	} else {
			// 		return 1;
			// 	}
			// }
		});
		return arr;
	}
	public getMailByID(id: number) {
		return this.mail[id];
	}
	public getMailList() {
		return this.sortMail();
	}
	public getCanShowMail(): boolean {
		var base: Mailbase;
		var mail: Mailbase[] = DataManager.getInstance().mailManager.mail;
		for (var key in mail) {
			base = mail[key];
			if (!base.isOpen || !base.isReceived) {
				return true;
			}
		}
		return false;
	}
}