/**
 * 
 * 获取道具提示管理
 * @author	lzn	
 * 
 * 
 * 
 */
class HintManager {
	private isCoolDown: boolean = false;
	private storageKey: string = "HintManager";
	public constructor() {
		GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.levelUpdate, this);
	}
	private levelUpdate(even: egret.Event): void {
		var isLevel: boolean = even.data as boolean;
		if (isLevel) {
			for (var i in JsonModelManager.instance.getModelfunctionLv()) {
				var funcModel = JsonModelManager.instance.getModelfunctionLv()[i];
				if (funcModel.level == DataManager.getInstance().playerManager.player.level && funcModel.functionType == 2) {
					GameDispatcher.getInstance().dispatchEvent(
						new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
						new WindowParam("FunOpenPanel", funcModel)
					);
					break;
				}
			}
		}
	}
	public getHintSystemByPriority() {
		if (this.getIsNeedHintSystem()) return;
		var priority: number[] = GameDefine.HINT_PRIORITY;
		for (var i = 0; i < priority.length; i++) {
			if (this.getIsCanHint(priority[i])) {
				this.showObtainHintPanel(priority[i]);
				return;
			}
		}
	}
	public changeCDstate(bl: boolean) {
		this.isCoolDown = bl;
	}
	public getIsNeedHintSystem() {
		this.isCoolDown = false;
		var str: string = egret.localStorage.getItem(this.storageKey);
		if (str) {//存在缓存
			var old = Tool.formatZeroDate(new Date(Date.parse(str))).getTime();
			var now = Tool.formatZeroDate(new Date()).getTime();
			var day = (now - old) / 86400000;
			if (day == 0) {//同一天
				this.isCoolDown = true;
			} else {
				egret.localStorage.removeItem(this.storageKey);
			}
		}
		return this.isCoolDown;
	}
	/*隐藏提示框*/
	public shieldObtainHint() {
		var date = new Date();
		egret.localStorage.setItem(this.storageKey, date.toString());
		this.isCoolDown = true;
	}
	public getHintSystemByType(panelID) {
		if (this.getIsNeedHintSystem()) return;
		if (this.getIsCanHint(panelID)) {
			this.showObtainHintPanel(panelID);
		}
	}
	public showObtainHintPanel(panelID) {
		// var boxThing: BoxThing = new BoxThing();
		// boxThing.modelId = 1;
		// boxThing.type = 3;
		// boxThing.num = 100;
		// boxThing.onupdate(1, 1, 100);
		// GameDispatcher.getInstance().dispatchEvent(
		// 	new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
		// 	new WindowParam("ObtainHintSys", new ObtainHintParam(panelID, null))
		// );
	}
	public getIsCanHint(panelID): boolean {
		var currentLevel: number;
		var currentModelBless;
		var nextLevel: number;
		switch (panelID) {
			case 13://坐骑面板
				if (!FunDefine.funOpenLevel(13)) {
					return false;
				}
				// currentLevel = DataManager.getInstance().playerManager.player.horseLevel;
				// nextLevel = currentLevel + 1;
				// currentModelBless = ModelManager.getInstance().modelHorse[currentLevel];
				// if (nextLevel > LevelDefine.MAX_LEVEL_HORSE || nextLevel == 1) {
				// 	return false;
				// }
				break;
			case 14://神兵面板
				if (!FunDefine.funOpenLevel(14)) {
					return false;
				}
				// currentLevel = DataManager.getInstance().playerManager.player.weaponLevel;
				// nextLevel = currentLevel + 1;
				// currentModelBless = ModelManager.getInstance().modelWeapon[currentLevel];
				// if (nextLevel > LevelDefine.MAX_LEVEL_HORSE || nextLevel == 1) {
				// 	return false;
				// }
				break;
			case 15://神装面板
				if (!FunDefine.funOpenLevel(15)) {
					return false;
				}
				// currentLevel = DataManager.getInstance().playerManager.player.clothesLevel;
				// nextLevel = currentLevel + 1;
				// currentModelBless = ModelManager.getInstance().modelClothes[currentLevel];
				// if (nextLevel > LevelDefine.MAX_LEVEL_HORSE || nextLevel == 1) {
				// 	return false;
				// }
				break;
			case 16://仙羽面板
				if (!FunDefine.funOpenLevel(16)) {
					return false;
				}
				// currentLevel = DataManager.getInstance().playerManager.player.wingLevel;
				// nextLevel = currentLevel + 1;
				// currentModelBless = ModelManager.getInstance().modelWing[currentLevel];
				// if (nextLevel > LevelDefine.MAX_LEVEL_HORSE || nextLevel == 1) {
				// 	return false;
				// }
				break;
			case 17://法宝面板
				if (!FunDefine.funOpenLevel(17)) {
					return false;
				}
				// currentLevel = DataManager.getInstance().playerManager.player.magicLevel;
				// nextLevel = currentLevel + 1;
				// currentModelBless = ModelManager.getInstance().modelMagic[currentLevel];
				// if (nextLevel > LevelDefine.MAX_LEVEL_HORSE || nextLevel == 1) {
				// 	return false;
				// }
				break;
		}
		if (!currentModelBless) {
			return false;
		}

		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(currentModelBless.costId);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		if (_hasitemNum >= currentModelBless.costNum) {
			return true;
		}
		return false;
	}
}