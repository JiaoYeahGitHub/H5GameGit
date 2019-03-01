class BaseBody extends egret.DisplayObjectContainer {
    protected _movePaths: Array<egret.Point>;
    protected _moveTarget: egret.Point;
    public moveSpeed: number = GameDefine.Define_Move_Speed;
    public constructor() {
        super();
    }
    //设置行走路径
    public setMovePoint(pointPaths: Array<egret.Point>) {
        this._movePaths = pointPaths;
        if (this._movePaths && this._movePaths.length > 0) {
            this._moveTarget = this._movePaths.shift();
            this.onChangeDir();
        } else {
            this._moveTarget = null;
        }
    }
    public get movePaths() {
        return this._movePaths;
    }
    public get moveTarget() {
        return this._moveTarget;
    }
    private _slefPos: egret.Point;
    private setMePositon(x: number, y: number) {
        if (!this._slefPos) {
            this._slefPos = new egret.Point();
        }
        this.x = x;
        this.y = y;
        this._slefPos.setTo(this.x, this.y);
    }
    public get selfPoint(): egret.Point {
        if (!this._slefPos) {
            this._slefPos = new egret.Point();
        }
        this._slefPos.setTo(this.x, this.y);
        return this._slefPos;
    }
    //检查是不是在走
    protected isMove() {
        if (this._moveTarget) {
            return true;
        }
        return false;
    }
    //终止移动
    protected stopMove() {
        this._moveTarget = null;
        this._movePaths = null;
    }
    //移动计算
    public logicMove(dt, removeDist = 0): boolean {
        if (this._moveTarget) {
            var totalDis = egret.Point.distance(this.selfPoint, this._moveTarget);
            var moveDis = dt * this.moveSpeed / 1000;
            if (moveDis < totalDis + removeDist) {
                var pc = moveDis / totalDis;
                this.moveRun(Math.round((this._moveTarget.x - this.x) * pc), Math.round((this._moveTarget.y - this.y) * pc));
            } else {
                this.moveFinish();
            }
        } else {
            this.stopMove();
        }
        return false;//是否执行屏幕重绘
    }

    private moveRun(disx, disy): void {
        this.setMePositon(this.x + disx, this.y + disy);
    }

    private moveFinish(): void {
        this.setMePositon(this._moveTarget.x, this._moveTarget.y);
        if (this._movePaths && this._movePaths.length > 0) {
            this._moveTarget = this._movePaths.shift();
            this.onChangeDir();
        } else {
            this.stopMove();
        }
    }
    //改变方向
    protected onChangeDir(): void {
    }
    //计算自身与目标距离
    public distanceToSelf(display: BaseBody): number {
        return egret.Point.distance(this.selfPoint, display.selfPoint);
    }
    //计算自身与目标移动点的距离
    public getDistToTarget(): number {
        if (this._moveTarget) {
            return egret.Point.distance(this.selfPoint, this._moveTarget);
        }
        return 0;
    }
    //这个是重置对象
    public onReset(): void {
        this.stopMove();
    }
    //这个是完全删除
    public onDestroy(): void {
    }
    //The end
} 