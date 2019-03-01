class SevenDayCarnivalManager {
	public today: number = 0;
	public sevDayLogin;
	public sevDayObjective;
	public endTime: string;
	private startTime;
	private totalTime;
	public constructor() {
	}
	public getCurrDayInfo(currDay: number) {
		var ret = [[], [], [], []];
		// var model: ModelSevDayObjective;
		// var data = ModelManager.getInstance().modelSevDayObjective;
		// for (var key in data) {
		// 	model = data[key];
		// 	if (model.day == currDay) {
		// 		ret[model.tab - 1].push(model);
		// 	}
		// }
		return ret;
	}
	public parseSevDayInfo(msg: Message) {
		var i: number;
		this.sevDayLogin = {};
		this.sevDayObjective = {};
		var login: SevDayLoginBase;
		var objective: SevDayObjectivebase;
		this.endTime = msg.getString();
		this.today = msg.getShort();//当前为第几天
		for (i = 0; i < this.today; i++) {
			login = new SevDayLoginBase(i + 1);
			login.parseInfo(msg);
			this.sevDayLogin[login.day] = login;
		}
		var len: number = msg.getShort();
		for (i = 0; i < len; i++) {
			objective = new SevDayObjectivebase();
			objective.parseInfo(msg);
			this.sevDayObjective[objective.id] = objective;
		}
		this.startTime = egret.getTimer();
		var createTime = DataManager.getInstance().playerManager.player.createTime;
		var currTime = DataManager.getInstance().playerManager.player.currentTime;
		this.totalTime = Tool.toInt((86400000 * 7 - (currTime - Tool.formatZeroDate(new Date(createTime)).getTime())) / 1000);
		var cd = this.getCountDown();
		if (cd <= 0) {
		//	DataManager.getInstance().activityManager._activityInfoList[1].isOpen = false;
		}
    }
	public getCountDown(): number {
        return this.totalTime - Tool.toInt((egret.getTimer() - this.startTime) / 1000);
    }
	public parseSevDayLoginReceive(msg: Message) {
		var day: number = msg.getByte();
		if (this.sevDayLogin[day]) {
			this.sevDayLogin[day].state = 2;
		}
	}
	public parseSevDayObjectiveReceive(msg: Message) {
		var i: number;
		var objective: SevDayObjectivebase;
		var len: number = msg.getShort();
		for (i = 0; i < len; i++) {
			objective = new SevDayObjectivebase();
			objective.parseInfo(msg);
			this.sevDayObjective[objective.id] = objective;
		}
	}

	//获取是否有奖品可领取
	public getHasAwardGain(): boolean {
		if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainLogin()) {
			return true;
		}
		if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainDay()) {
			return true;
		}
		return false;
	}
	//获取某天时候有奖品可领取
	public getHasAwardGainDay(): boolean {
		for (var i: number = 1; i <= 7; i++) {
			if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainOneDay(i)) {
				return true;
			}
		}
		return false;
	}
	//获取某天时候有奖品可领取
	public getHasAwardGainOneDay(day: number): boolean {
		if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainLoginByDay(day)) {
			return true;
		}
		var info = DataManager.getInstance().sevenDayCarnivalManager.getCurrDayInfo(day);
		for (var i: number = 0; i < info.length; i++) {
			if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainOneDayByTab(info[i], day)) {
				return true;
			}
		}
		return false;
	}

	//获取某天时候有奖品可领取
	public getHasAwardGainOneDayByTab(info, day): boolean {
		var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
		if (day > today) return false;
		// var data: ModelSevDayObjective;
		// for (var i: number = 0; i < info.length; i++) {
		// 	data = info[i];
		// 	if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainOneDayObjective(data.key, data.level)) {
		// 		return true;
		// 	}
		// }
		return false;
	}
	//获取某天时候有奖品可领取
	public getHasAwardGainOneDayObjective(id, level) {
		// var model: ModelSevDayObjective = ModelManager.getInstance().modelSevDayObjective[id + "_" + level];
		// var base: SevDayObjectivebase = DataManager.getInstance().sevenDayCarnivalManager.sevDayObjective[id];
        // if (base) {
        //     if (!GameCommon.getInstance().getBit2BooleanValue(base.getNum, level)) {
		// 		if (base.currNum >= model.param) {
		// 			return true;
        //         }
        //     }
        // }
		return false;
	}
	//获取登录奖励是否可领取
	public getHasAwardGainLogin(): boolean {
		for (var i: number = 1; i <= 7; i++) {
			if (DataManager.getInstance().sevenDayCarnivalManager.getHasAwardGainLoginByDay(i)) {
				return true;
			}
		}
		return false;
	}
	//获取登录奖励是否可领取
	public getHasAwardGainLoginByDay(day: number): boolean {
		var today: number = DataManager.getInstance().sevenDayCarnivalManager.today;
		if (day > today) return false;
		var award: AwardItem;
        var base: SevDayLoginBase = DataManager.getInstance().sevenDayCarnivalManager.sevDayLogin[day];
        if (base) {
            if (base.state != 2) {//已领取
				return true;
            }
        }
		return false;
	}
}