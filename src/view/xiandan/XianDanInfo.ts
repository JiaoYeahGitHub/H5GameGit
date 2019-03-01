// TypeScript file
class XianDanInfo {
    public UID:number;
    public shiyongNum: number;//使用次数
    public havepill: number;//当前持有仙丹
    public allpill:number;//一共掉落了多少
    public constructor() {
    }

    public onParseXianDanInitMsg(id:number,msg: Message): void {
        this.UID = id;
        this.shiyongNum= msg.getInt();
        this.havepill= msg.getInt();
        // this.allpill= msg.getInt();
    }
    //The end
}