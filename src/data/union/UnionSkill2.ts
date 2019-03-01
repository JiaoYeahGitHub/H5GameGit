class UnionSkill2 {
	
	public id:number;
	public level:number;
	public exp:number;

	public constructor() {
	}

	public parseMessage(message:Message){
		this.id=message.getByte();
		this.level=message.getShort();
		this.exp=message.getInt();
	}
}