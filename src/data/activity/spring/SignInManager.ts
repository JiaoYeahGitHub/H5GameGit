class SignInManager {
	public day: number;
	public signed: boolean = true;
	public constructor() {
	}
	public get data() {
		// var ret: ModelSignIn[] = [];
		// var model: ModelSignIn;
		// var models = ModelManager.getInstance().modelSignIn;
		// var data = DataManager.getInstance().signInManager;
		// for (var key in models) {
		// 	model = models[key];
		// 	model.sortKey = parseInt(model.id);
		// 	if (!data.signed) {
		// 		if (model.id < (data.day + 1)) {//签到的天数
		// 			model.sortKey += 100;
		// 		}
		// 	} else {
		// 		if (model.id <= (data.day)) {//签到的天数
		// 			model.sortKey += 100;
		// 		}
		// 	}
		// 	ret.push(model);
		// }
		// ret = ret.sort((n1: ModelSignIn, n2: ModelSignIn) => {
		//     if (n1.sortKey < n2.sortKey) {
		//         return -1;
		//     } else {
		//         return 1;
		//     }
		// });
		// return ret;
		return null;
	}
	public parseMessage(msg: Message) {
		this.day = msg.getShort();
		this.signed = msg.getBoolean();
	}
	public onSendSignMessage(msg: Message) {
		// var message = new Message(MESSAGE_ID.SIGNIN_SIGN_MESSAGE);
		// GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseSignMessage(msg: Message) {
		this.day = msg.getShort();
		this.signed = true;
	}
	public getCanShowRedPoint(): boolean {
		return !DataManager.getInstance().signInManager.signed;
	}
}