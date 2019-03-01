class ModelYewaiWave extends ModelBase {
    public monterFightNodes: number[];
    // public bossFightNode: number;
    public constructor() {
        super();
        this.monterFightNodes = [];
    }
    public parseXML(result: egret.XML) {
        this.id = this.getXmlValueNumber(result, "id");
        var pointList: string[] = String(this.getXmlValue(result, "point")).split(",");
        for (var i: number = 0; i < pointList.length; i++) {
            // if (i == pointList.length - 1)
            //     this.bossFightNode = parseInt(pointList[i]);
            // else
            this.monterFightNodes.push(parseInt(pointList[i]));
        }
    }
}