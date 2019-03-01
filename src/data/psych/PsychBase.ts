/**
 * 
 * 元神基础类
 * @author 	lzn	
 * 
 */
class PsychBase {
	public UID = 0;
	public modelID = 0;
	public slot;
	public currLv: number = 0;
	public lock: number = 0;
	public currLvUp: number;
	public seletced: boolean = false;
	public constructor(base: Modelyuanshen = null) {
		if (base) {
			this.modelID = base.id;
		}
	}
	public parseInit(msg: Message) {
		this.slot = msg.getByte();
		this.modelID = msg.getShort();
	}
	public parsePsych(msg: Message) {
		this.UID = msg.getInt();
		this.modelID = msg.getShort();
	}
	public parsePsychUpgrade(msg: Message) {
		this.parsePsych(msg);
		this.currLvUp = msg.getShort();
	}
	public parseByModel(model: Modelyuanshen) {
		this.modelID = model.id;
	}

	public onUpdate(base: PsychBase) {
		this.UID = base.UID;
		this.modelID = base.modelID;
		this.slot = base.slot;
	}
	public get model(): Modelyuanshen {
		var model = JsonModelManager.instance.getModelyuanshen()[this.modelID];
		return model;
	}
	public get fightValue(): number {
		return GameCommon.calculationFighting(this.model.attrAry);
	}
}