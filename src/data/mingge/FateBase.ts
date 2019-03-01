/**
 * 
 * 命格基础类
 * @author 	lzh	
 * 
 */
class FateBase {
	public UID = 0;
	public modelID = 0;
	public lv: number = 0;
	public exp: number = 0;
	public slot;
	public constructor(base: Modelyuanshen = null) {
		if (base) {
			this.modelID = base.id;
		}
	}
	public parseInit(uid:number,msg: Message) {
		this.UID = uid;
		this.modelID = msg.getShort();
		this.lv = msg.getShort();
		this.exp = msg.getInt();
		this.slot = msg.getByte()+1;
	}
	public parseFate(msg: Message) {
		this.UID = msg.getInt();
		this.modelID = msg.getShort();
	}
	public parseFateLv(msg: Message) {
		this.parseFate(msg);
		this.lv = msg.getShort();
	}
	public parseByModel(model: Modelmingge) {
		this.modelID = model.id;
	}

	public onUpdate(uid) {
		this.UID = uid;
	}
	public get model(): Modelmingge {
		var model = JsonModelManager.instance.getModelmingge()[this.modelID];
		return model;
	}
	public get fightValue(): number {
		return GameCommon.calculationFighting(this.model.attrAry);
	}
	public parseInit1(uid:number,msg: Message) {
		this.UID = uid;
		this.modelID = msg.getShort();
		this.lv = msg.getShort();
		this.exp = msg.getInt();
		this.slot = msg.getByte()+1;
	}
}