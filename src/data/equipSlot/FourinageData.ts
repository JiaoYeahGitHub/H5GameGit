/**四象槽位的信息**/
class FourinageData {
	public type: Fourinages_Type;
	public level: number = 0;//等级
	public grade: number = 0;//阶段

	public constructor(type: Fourinages_Type) {
		this.type = type;
	}

	public parseMsg(msg: Message): void {
		this.level = msg.getShort();
		this.grade = msg.getShort();
	}

	public get power(): number {
		var attributes: number[] = GameCommon.getInstance().getAttributeAry();
		if (this.level > 0) {
			var _Ratio: number = 1;
			if (this.grade > 0) {
				var grademodel: Modelsixiangjinjie = JsonModelManager.instance.getModelsixiangjinjie()[this.type][this.grade - 1];
				_Ratio += grademodel.effect / GameDefine.GAME_ADD_RATIO;
			}
			var levelmodel: Modelsixiang = JsonModelManager.instance.getModelsixiang()[this.type][this.level - 1];
			for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
				if (levelmodel.attrAry[i] > 0) {
					attributes[i] += Math.floor(levelmodel.attrAry[i] * _Ratio);
				}
			}
			return GameCommon.calculationFighting(attributes);
		}else{
			return 0;
		}
	
	}
	//The end
}