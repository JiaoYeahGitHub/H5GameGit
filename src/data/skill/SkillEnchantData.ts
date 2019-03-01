/** 
 * 技能附魔数据对象
 * BY 2018.10.09
*/
class SkillEnchantData {
	public id: number = 0;
	public level: number = 0;
	public grade: number = 0;

	public constructor() {
	}

	public paraseMsg(msg: Message): void {
		this.id = msg.getByte();
		this.level = msg.getInt();
		this.grade = msg.getInt();
	}
}