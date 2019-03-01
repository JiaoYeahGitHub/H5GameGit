class VipManager {
	public zhuanpanNum: number = 0;
	public curDayzhuanpanNum: number = 0;
    public treasureAwdIdx:number;
    public treasureTimes:number;
    private _treasureAwdIdx: number = 0;//每周领奖进度
    private _treasuretimes: number = 0;//每一周抽奖次数
    public zhuanpanId:number = 0;
	public zhuanpanType:number = 0;
	public zhuanpanAwardNum:number = 0;
	public constructor() {

	}
	public onParseZhuanPanMessage(msg: Message): void {
		this.curDayzhuanpanNum = msg.getShort();
		this.zhuanpanNum = msg.getInt();
		this.zhuanpanType = msg.getByte(); 
		this.zhuanpanId = msg.getShort();
		this.zhuanpanAwardNum = msg.getInt();
	}
	public onParseZhuanPanGetAwardNum(msg:Message):void{
		this.treasureAwdIdx = msg.getShort();
	}
	public onParseInit(msg:Message):void{
		this.curDayzhuanpanNum = msg.getShort();
		this.zhuanpanNum = msg.getInt();
		this.treasureAwdIdx = msg.getShort();
	}
	private _vipNum:number = 0;
	public getZhuanPanPoint():boolean{
		if(this.getXiangZiPoint()) return true;
		if(DataManager.getInstance().playerManager.player.viplevel==0)
		{
		return false;
		}
		else
		{
		var vipCfg:Modelvip	= JsonModelManager.instance.getModelvip()[DataManager.getInstance().playerManager.player.viplevel-1]
		var arr = vipCfg.weals.split("#");
		for (var i:number = 0; i < arr.length; i++) {
			var tps = arr[i].split(',');
			if(Number(tps[0]) == 11)
			{
			this._vipNum = Number(tps[1]);
			if(this._vipNum-DataManager.getInstance().vipManager.curDayzhuanpanNum>0)
			return true;
			}
		}
		}
		return false;
	}
	public getXiangZiPoint():boolean{
        let manager:VipManager = DataManager.getInstance().vipManager;
        let model: Modelzhuanpanvip = JsonModelManager.instance.getModelzhuanpanvip()[1];
        let weekAwdParams: string[] = model.box.split("#");
        for (let i: number = 0; i < 5; i++) {
            let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
            if (!params) break;
            let times: number = parseInt(params[0]);
            if (manager.treasureAwdIdx < times) {
                if (manager.zhuanpanNum >= times) {
                    return true;
                }
            }
        }
		return false;
	}
}
class VipData {
	public id;
	public time;
	public isCanReceive;
	public parseMessage(msg: Message) {
		this.id = msg.getByte();
		this.time = msg.getInt();
		this.isCanReceive = (msg.getByte() == 1);
	}
}