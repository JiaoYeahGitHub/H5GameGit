/**
 * 
 * @author	lzn
 * 百倍返利
 * 
 * **/
class RebateManager {
	public record = {};
	public qianbei_record = {};
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.record = {};
		var id: number;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			id = msg.getByte();
			this.record[id] = id;
		}
	}
	public parseQianbeiMessage(msg: Message): void {
		this.qianbei_record = {};
		var id: number;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			id = msg.getByte();
			this.qianbei_record[id] = id;
		}
	}
	public parseBuyMessage(msg: Message) {
		var id: number = msg.getByte();
		var activityType: number = msg.getInt();
		// if (activityType == ACTIVITY_BRANCH_TYPE.REBATE) {
		// 	this.record[id] = id;
		// 	if (id == RebatePanel.REBATE_MAX_GEARS) {
		// 		DataManager.getInstance().activityManager.delActivity(ACTIVITY_BRANCH_TYPE.REBATE);
		// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ACTIVITI_HALL_OVER));
		// 	}
		// } else if (activityType == ACTIVITY_BRANCH_TYPE.REBATE2) {
		// 	this.qianbei_record[id] = id;
		// 	if (id == ThousandFoldPanel.REBATE_MAX_GEARS) {
		// 		DataManager.getInstance().activityManager.delActivity(ACTIVITY_BRANCH_TYPE.REBATE2);
		// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ACTIVITI_HALL_OVER));
		// 	}
		// }
	}
}