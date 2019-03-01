/**
 * 
 * 红点管理
 * @author	lzn	
 * 
 * 
*/
class RedPointManager {
    public constructor() {
    }
    public static createPoint(param: number): redPoint[] {
        var points: redPoint[] = [];
        var point: redPoint;
        for (var i: number = 0; i < param; i++) {
            point = new redPoint();
            points.push(point);
        }
        return points;
    }
    public onCheck(cmdID) {
        switch (cmdID) {
            case MESSAGE_ID.GAME_FIGHT_START_MSG:
            case MESSAGE_ID.GAME_FIGHT_RESULT_MSG:
            case MESSAGE_ID.GAME_TICK_MESSAGE:
                break;
            default:
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(null));
                break;
        }
    }
    //The end
}
class redPoint {
    public id: number = (new egret.HashObject()).hashCode;
    public type: number;
    public func;
    public param: any[];
    public x: number = 0;
    public y: number = 0;
    public point: eui.Image;
    public target;
    public redName: string;
    public redPointChild: redPoint[];
    /** 
     * 红点信息构造方法
     * systemID  绑定的红点系统ID
     * type    触发类型
     * id      系统ID
     * ...param     参数
    */
    public constructor() {
    }
    public register(addPointTg, pos: egret.Point, target, func: string = null, ...param) {
        if (addPointTg) {
            this.addRedPointImg(addPointTg, pos);
        }
        this.target = target;
        if (func) {
            this.addTriggerFuc(target, func, ...param);
        }
    }
    public addTriggerFuc(target, fuc: string, ...param) {
        this.target = target;
        this.func = fuc;
        this.param = param;
        this.checkPoint();
    }
    public addRedPointImg(target, pos: egret.Point) {
        if (!target.getChildByName("redPoint")) {
            this.point = new eui.Image();
            this.point.x = pos.x;
            this.point.y = pos.y;
            this.point.source = "public_redPoint_png";
            this.point.name = "redPoint";
            this.point.touchEnabled = false;
            this.point.visible = false;
            target.addChild(this.point);
        } else {
            if (this.point != target.getChildByName("redPoint")) {
                this.point = target.getChildByName("redPoint");
            }
            this.point.x = pos.x;
            this.point.y = pos.y;
            this.point.visible = false;
        }
    }
    public checkPointAll(): boolean {
        if (this.redPointChild) {
            let bl: boolean = false;
            for (let i = 0; i < this.redPointChild.length; ++i) {
                if (this.redPointChild[i].checkPointAll()) {
                    bl = true;
                }
            }
            this.point.visible = bl;
            return bl;
        }
        return this.checkPoint();
    }
    /**红点触发函数
     * @param dynamic   是否动态传参
     * @param   param   参数
     * **/
    public checkPoint(dynamic: boolean = false, ...param) {
        if (!this.target || !this.func) return false;
        var bl: boolean = false;
        if (dynamic) {
            if (this.target[this.func]) {
                bl = this.target[this.func](...param);
            }
        } else {
            if (this.target[this.func]) {
                var len: number = this.param.length;
                switch (len) {
                    case 0:
                        bl = this.target[this.func]();
                        break;
                    case 1:
                        bl = this.target[this.func](this.param[0]);
                        break;
                    case 2:
                        bl = this.target[this.func](this.param[0], this.param[1]);
                        break;
                    case 3:
                        bl = this.target[this.func](this.param[0], this.param[1], this.param[2]);
                        break;
                    case 4:
                        bl = this.target[this.func](this.param[0], this.param[1], this.param[2], this.param[3]);
                        break;
                    case 5:
                        bl = this.target[this.func](this.param[0], this.param[1], this.param[2], this.param[3], this.param[4]);
                        break;
                    case 6:
                        bl = this.target[this.func](this.param[0], this.param[1], this.param[2], this.param[3], this.param[4], this.param[5]);
                        break;
                    default:
                        throw "传参个数超界";
                }
            }
        }
        if (this.point) {
            this.point.visible = bl;
        }
        return bl;
    }
    public delRedPoint() {
        if (this.target.contains(this.point)) {
            this.target.removeChild(this.point);
            this.point = null;
        }
        this.func = null;
    }
}
class redPointTrigger {
    public systemID: string;
    public redpoint_type: number;
    public constructor(systemID: string, redpoint_type: number = -1) {
        this.systemID = systemID;
        this.redpoint_type = redpoint_type;
    }
}