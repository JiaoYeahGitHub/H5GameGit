/**
 * 
 * @author 
 * 
 */
class GameMessageEvent extends egret.Event {

	public message: any;

	public constructor(type: string, response: any) {
		super(type, false, false);
		this.message = response;
	}
}