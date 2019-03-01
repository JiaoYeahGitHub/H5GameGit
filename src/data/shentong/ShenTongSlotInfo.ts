class ShenTongSlotInfo {
	public slotID: number;//槽位id
	public modelID: number;//模板ID
	public level: number;
	public grade: number;
	public exp: number;

	public constructor(index: number) {
		this.slotID = index;
	}

	public parseInfo(msg: Message): void {
		this.modelID = msg.getShort();
		this.level = msg.getShort();
		this.exp = msg.getShort();
		this.grade = msg.getShort();
	}
	//实际的属性加成
	// public get attribute(): number[] {
	// 	if (!this.model)
	// 		return null;
	// 	var attributes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	// 	var shentongLvModel: ModelShentongLv = ModelManager.getInstance().modelShentongLv[this.level];
	// 	var shentongGradeModel: ModelShentongGrade = ModelManager.getInstance().modelShentongGrade[this.grade];
	// 	for (var i: number = 0; i < this.model.attribute.length; i++) {
	// 		if (this.model.attribute[i] > 0) {
	// 			var attrValue: number = this.model.attribute[i];
	// 			if (shentongLvModel) {
	// 				var levelRate: number = shentongLvModel.xishus[this.model.quality];
	// 				attrValue = Tool.toInt(attrValue * levelRate / 10000);
	// 			}
	// 			if (shentongGradeModel) {
	// 				var gradeRate: number = shentongGradeModel.effect;
	// 				attrValue = attrValue + Tool.toInt(this.model.attribute[i] * gradeRate / 10000);
	// 			}
	// 			attributes[i] = attrValue;
	// 		}
	// 	}
	// 	return attributes;
	// }

	// public get model(): ModelShentong {
		// return ModelManager.getInstance().modelShentong[this.modelID];
	// }
}
class ShenTongItem {
	public id: number;//背包id
	public shentongID: number;//模板ID

	public parseInfo(msg: Message): void {
		this.id = msg.getShort();
		this.shentongID = msg.getShort();
	}

	// public get model(): ModelShentong {
		// return ModelManager.getInstance().modelShentong[this.shentongID];
	// }
}