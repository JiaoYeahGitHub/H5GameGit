// TypeScript file
class XianDanRollData {
    public UID:number;
    public chouquNum: number;//使用次数
    
    public constructor() {
    }

    public onParseXianDanInitMsg(id:number,msg: Message): void {
        this.UID = id;
        this.chouquNum= msg.getInt();
        
        // this.allpill= msg.getInt();
    }
    //The end
}