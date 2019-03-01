class ModelMapNode extends ModelBase {
    public nodeId;//格子编号
    public nodeType;//格子类型
    public areaIndex = 0;//对应区域
    public colIndex: number;
    public rowIndex: number;
    public findnode: FindNode;//寻路用父节点

    public constructor() {
        super();
        this.findnode = new FindNode();
    }
    public parseXML(result: egret.XML) {
        this.id = this.getXmlValueNumber(result, "id");
        this.nodeId = this.getXmlValueNumber(result, "id");
        this.nodeType = this.getXmlValueNumber(result, "type");
        this.areaIndex = this.getXmlValue(result, "area");
    }

    public get isCanWalk(): boolean {
        return this.nodeType != MAP_GRID_TYPE.COLLSION;
    }

    public get isCover(): boolean {
        return this.nodeType == MAP_GRID_TYPE.COVER;
    }

    public get isJump(): boolean {
        if (this.nodeType == MAP_GRID_TYPE.JUMP) {
            return true;
        }
        return false;
    }
}
class FindNode {
    public parentnodeId;
    public gValue;
    public hValue;
    public onreset(): void {
        this.parentnodeId = null;
        this.gValue = null;
        this.hValue = null;
    }
}