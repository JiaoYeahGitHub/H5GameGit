/**
 * 曲线运动物体 根据实时修改factor值来实现曲线运动
 * ptEnd终点 pt0点是计算曲线运动的点 percent横向的比重
 * */
class CurvilinearBody extends egret.DisplayObjectContainer {
	private ptTop: egret.Point;
	private ptEnd: egret.Point;
	public constructor(thing: egret.DisplayObject, startPos: egret.Point, endPos: egret.Point, percent, high: number) {
		super();
		this.addChild(thing);
		this.x = startPos.x;
		this.y = startPos.y;
		this.ptEnd = endPos;
		this.ptTop = new egret.Point();
		percent = (percent > 100 ? 100 : percent) < 0 ? 0 : percent;
		// this.ptTop.x = startPos.x + Math.ceil(egret.Point.distance(this.ptEnd, new egret.Point(this.x, this.y)) * percent / 100);
		this.ptTop.x = startPos.x + ((this.ptEnd.x - this.x) * percent / 100);
		this.ptTop.y = startPos.y - high;
	}

	public get factor(): number {
		return 0;
	}

	public set factor(value: number) {
		this.x = (1 - value) * (1 - value) * this.x + 2 * value * (1 - value) * this.ptTop.x + value * value * this.ptEnd.x;
		this.y = (1 - value) * (1 - value) * this.y + 2 * value * (1 - value) * this.ptTop.y + value * value * this.ptEnd.y;
	}

	public onDestroy(): void {
		this.ptTop = null;
		this.ptEnd = null;
		this.removeChildren();
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}