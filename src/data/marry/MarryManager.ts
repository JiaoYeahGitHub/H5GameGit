/**
 * 
 * 经脉管理器
 * @author	lzn	
 * 
 * 
 */
class MarryManager {
    public marryDatas:MarryData[];

    public partnerId = 0
    public partnerName = ''
    public partnerHead = 0
    public partnerHeadIndex = 0

	public constructor() {
       
	}
    public marryId:number = 0;
    public divorceTime:number = 0;
     public parseMsg(msg: Message): void {
         let len = msg.getShort();
         this.marryDatas = [];
         for (var i = 0; i < len; i++) {
			var marryData:MarryData = new MarryData();
            marryData.parseMsg(msg);
            marryData.idx = i;
            this.marryDatas.push(marryData);
		}
     }
     public parseMsgDivorce(msg: Message):void{
         this.marryId = msg.getInt();
         this.divorceTime = msg.getByte();
         DataManager.getInstance().playerManager.player.marriId = this.marryId;
     }
     public parseMsgAgreeDivorce(msg: Message):void{
         this.marryId = msg.getInt();
         DataManager.getInstance().playerManager.player.marriId = this.marryId;
     }
    
    //相思树红点
    public checkMarryTreePoint(){
        if(DataManager.getInstance().playerManager.player.marriId>0){
            if(this.checkMarryCooperationPoint()){
                return true
            }
            for(let i=0;i<MarryTreePanel.costItem.length;++i){
                if(this.checkMarryTreeItemPoint(MarryTreePanel.costItem[i])){
                    return true
                }
            }
        }
        return false
    }

    //相思树消耗品红点
    public checkMarryTreeItemPoint(id){
        let item = DataManager.getInstance().bagManager.getGoodsThingById(id);
        if(item && item.num > 0){
            return true
        }
        return false
    }

    //相思互助红点
    public checkMarryCooperationPoint(){
        if(DataManager.getInstance().playerManager.player.marriedTreeExp>0){
            return true
        }
        return false
    }

     public divorcePoint():boolean
     {
         if(this.divorceTime>0||DataManager.getInstance().playerManager.player.marry_divorce>0)
         {
             return true;
         }
         return false;
     }
     
	//The end
}
class MarryData {
    public userdata:SimplePlayerData;
    public desc: string;
    public cailiId: number;
    public idx:number;
    public lastTime:number;
    public parseMsg(msg: Message): void {
        this.userdata = new SimplePlayerData();
        this.userdata.parseMsg(msg);
        this.desc = msg.getString();
        this.cailiId = msg.getByte();
        this.lastTime = msg.getLong();
    }
}
