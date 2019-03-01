class TianGongManager {
	public constructor() {
	}

	public getMainBtnRedShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_JINGJIE)) return false;
		if (this.getTabCoatardTaskPoint()) return true;
		if (this.getTabJianChiRedShow()) return true;
		if (DataManager.getInstance().dragonSoulManager.checkRedPoint()) return true;
		if (DataManager.getInstance().legendManager.oncheckAllVipActifactRedP()) return true;
		if (DataManager.getInstance().playerManager.onCheckXinfaRedPoint()) return true;
		return false;
	}

	public getTabCoatardTaskPoint(): boolean {
		let count: number = 0;
		let tasks = DataManager.getInstance().taskManager.coatardTasks;
		for (let taskid in tasks) {
			let taskData: TaskChainData = tasks[taskid];
			if (taskData.progress >= taskData.maxnum && taskData.maxnum != 0) {
				return true;
			}
			count += taskData.count;
		}
		let coatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
		// let _currmodel: Modellevel2coatardLv = JsonModelManager.instance.getModellevel2coatardLv()[coatardLv - 1];
		// if (_currmodel) {
		// 	let tasksParam: string[] = _currmodel.tasks.split("#");
		// 	if (count == tasksParam.length) {
		// 		return true;
		// 	}
		// }

		return false;
	}

	public getTabJianChiRedShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_JIANCHI)) return false;
		let list = JsonModelManager.instance.getModeljianchi();
		var player: Player = DataManager.getInstance().playerManager.player;
		var exp = player.jianchiExp;
		var rewId = player.jianchiLevel;
		let idx = 0;
		for(let key in list){
			let model: Modeljianchi = list[key];
			if(rewId <= idx && exp >= model.exp){
				return true;
			}
			++idx;
		}
		return false;
	}

	public getTabLegendRedShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SHENQI)) return false;
		let legend = DataManager.getInstance().legendManager;
		for (let i = 1; i <= LegendDefine.Legend_Num; i++) {
			if (legend.getCanLegendAdvance(i)) return true;
		}
		return false;
	}
	//The end
}