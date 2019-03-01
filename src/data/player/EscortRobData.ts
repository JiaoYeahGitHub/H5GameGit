/**
 * 
 * 劫杀玩家列表信息
 * 
 * 
 * **/
class EscortRobData extends SimplePlayerData {
	public quality: number = 1;
	public remainTime: number = 0;
	public isbeRob: boolean = false;
	private startTime: number;
	public face;
	public constructor() {
		super();
	}
	public parseMsg(msg: Message) {
		super.parseMsg(msg);
		this.quality = msg.getByte();
		this.remainTime = msg.getInt();
		// var AppearData: PlayerAppears = new PlayerAppears();
		// AppearData.parseMsg(msg);
		if (this.id > 0) {//真实玩家
			this.face = new PlayerData(1, BODY_TYPE.PLAYER);
			// this.face.setAppear(AppearData);
		} else {//假人
			this.face = new RobotData(1, BODY_TYPE.ROBOT);
			var attributes = GameCommon.powerChangeAttribute(this.fightvalue);
			this.face.onUpdateRobotInfo(<number[]>attributes);
		}
		if (this.remainTime <= 0) {
			var model: Modeldujie = JsonModelManager.instance.getModeldujie()[this.quality];
			this.remainTime = Tool.toInt(model.keeptime * Math.random() / 2);
		}
		this.startTime = egret.getTimer();
	}
	public getCountDown(): number {
		return this.remainTime - Tool.toInt((egret.getTimer() - this.startTime) / 1000);
	}
}