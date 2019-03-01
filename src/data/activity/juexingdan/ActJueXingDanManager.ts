class ActJueXingDanManager {
	public round: number;
	public payNum: number;
	public payMax: number;
	public model;
	public constructor() {
	}

	public parseInit(message: Message): void{
		this.round = message.getByte();
		this.payNum = message.getInt();
		this.payMax = message.getInt();
		this.checkModel();
	}
	public checkModel(){
		this.model = this.getModel(this.round);
		return this.model;
	}
	private getModel(round: number): Modelactivityjuexingdan{
		let list = JsonModelManager.instance.getModelactivityjuexingdan();
		for(let key in list){
			if(list[key].round == round){
				return list[key];
			}
		}
		return null;
	}
	public isPayFull(){
		return this.payNum >= this.payMax;
	}
}