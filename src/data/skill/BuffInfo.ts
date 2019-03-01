class BuffInfo {
	public level: number;
	public model: Modelbuff;
	public attributes: number[];
	private addAttrRates: number[];
	private _startTime: number = 0;//buff启用时间 

	public constructor(id: number, level: number) {
		this.model = JsonModelManager.instance.getModelbuff()[id];
		this.level = level;
		this.attributes = DataManager.getInstance().skillManager.getBuffAttr(this.model.id);
		this._startTime = this.model.time * 1000 + egret.getTimer();
	}
	public get isOver(): boolean {
		return this._startTime <= egret.getTimer();
	}
}
enum BUFF_TYPE {
	ADD_ATTR = 1,//加属性的BUFF
}