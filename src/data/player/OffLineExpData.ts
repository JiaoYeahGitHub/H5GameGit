class OffLineExpData {
	public offTime:number;
	public exp:number;
	public moneyRongLian: number;//熔炼获得的钱
	public costNum:number;//消耗多少道具
	public anima:number;//灵气
	public equinum:number;//装备件数
	public moneynum:number;//钱
	public equinumdele:number;      //背包满自动熔炼装备数量 
	public oldLevel:number;//上线前等级
}
/**
 *  离线经验分享获得数据 
 **/
class OffLineExpShareAwd {
	public exp: number;//离线积攒的经验值
	public offexpMix: number;//离线经验值上限

	public parseMsg(msg: Message): void {
		this.exp = msg.getInt();
		this.offexpMix = msg.getInt();
	}
}