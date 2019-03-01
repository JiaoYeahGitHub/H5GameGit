/***
 * 动画效果管理
 * LYJ.
*/
class TweenLiteUtil {
    //直线运动效果
    public static onBelineTween(body: ActionBody, tPoint: egret.Point, time: number, ease = null, callFunc: Function = null, callObj = null) {
        var _belineTween = egret.Tween.get(body);
        _belineTween.to({ x: tPoint.x, y: tPoint.y }, time, ease)
            .call(function (body: ActionBody) {
                _belineTween = null;
                egret.Tween.removeTweens(body);
                if (callFunc != null && callObj != null) {
                    Tool.callback(callFunc, callObj, body);
                }
            }, this, [body]);
    }
    //渐隐
    public static onHideTween(body: egret.DisplayObject, callFunc: Function = null, callObj = null, time: number = 500): void {
        var _hideTween = egret.Tween.get(body);
        _hideTween.to({ alpha: 0 }, time, egret.Ease.circIn)
            .call(function (body: egret.DisplayObject) {
                egret.Tween.removeTweens(body);
                _hideTween = null;
                if (callFunc != null && callObj != null) {
                    Tool.callback(callFunc, callObj, body);
                }
            }, this, [body]);
    }
    //人物跳跃
    public static bodyJumpFly(body: ActionBody, callFunc: Function, callObj, downPoint: egret.Point, cusFlyInTime: number) {
        var _flyHigh: number = -(80 + cusFlyInTime * 0.05);
        var _tween2 = egret.Tween.get(body);
        _tween2.to({ x: downPoint.x, y: downPoint.y }, cusFlyInTime * 0.9, egret.Ease.circOut);
        var _tween1 = egret.Tween.get(body);
        _tween1.to({ childOffY: _flyHigh }, cusFlyInTime * 0.5, egret.Ease.circOut)
            .to({ childOffY: 0 }, cusFlyInTime * 0.5, egret.Ease.quartIn)
            .call(function () {
                egret.Tween.removeTweens(body);
                _tween2 = null;
                _tween1 = null;
                body.childOffY = 0;
                if (callFunc != null && callObj != null) {
                    Tool.callback(callFunc, callObj, body);
                }
            });
    }
    //物品掉落
    public static dropbodyFly1(body: DropBody, dropPoint: egret.Point): void {
        let _flyHigh: number = -(30 + this.getRD(60));
        let _tween1 = egret.Tween.get(body);
        _tween1.to({ childOffY: _flyHigh }, 100, egret.Ease.circOut).to({ childOffY: 0 }, 300, egret.Ease.quartIn);
        let _tween2 = egret.Tween.get(body);
        _tween2.to({ x: dropPoint.x, y: dropPoint.y }, 410, egret.Ease.circOut)
            .call(function (body: DropBody) {
                _tween2 = null;
                _tween1 = null;
                egret.Tween.removeTweens(body);
                body.onShowDropEffect();
            }, this, [body]);
    }
    /**两点直线运动**/
    public static beelineTween(body: egret.DisplayObject, callFunc: Function, callObj, targetPoint: egret.Point, tweentime: number = 600, ease = egret.Ease.circOut): void {
        var _tween2 = egret.Tween.get(body);
        _tween2.to({ x: targetPoint.x, y: targetPoint.y }, tweentime, ease)
            .call(function (body: egret.DisplayObject) {
                egret.Tween.removeTweens(body);
                _tween2 = null;
                if (callFunc != null && callObj != null) {
                    Tool.callback(callFunc, callObj, body);
                }
            }, this, [body]);
    }
    //面板打开效果
    public static openWindowEffect(window: eui.Component): void {
        window.anchorOffsetX = GameDefine.GAME_STAGE_WIDTH / 2;
        window.anchorOffsetY = GameDefine.GAME_STAGE_HEIGHT / 2;
        window.x = window.anchorOffsetX;
        window.y = window.anchorOffsetY;
        window.scaleX = 0.6;
        window.scaleY = 0.6;
        var _windowTween = egret.Tween.get(window);
        _windowTween.to({ scaleX: 1, scaleY: 1 }, 2000, egret.Ease.backInOut)
            .call(this.openWindowAnimEnd, this, [window]);
    }
    private static openWindowAnimEnd(window: eui.Component): void {
        window.anchorOffsetX = 0;
        window.anchorOffsetY = 0;
        window.x = 0;
        window.y = 0;
        egret.Tween.removeTweens(window);
    }
    //怪物死亡被打飞
    public static onDeathFly(body: ActionBody, callFunc: Function, callObj, downPoint: egret.Point) {
        var cusFlyInTime: number = 600;
        var _flyHigh: number = -(50 + this.getRD(50));
        // var _offY: number = _flyHigh * 0.3;

        var _tween2 = egret.Tween.get(body);
        _tween2.to({ x: downPoint.x, y: downPoint.y }, cusFlyInTime)//, egret.Ease.circOut
            .call(function () {
                egret.Tween.removeTweens(body);
                _tween1 = null;
                _tween2 = null;
                body.childOffY = 0;
                if (callFunc != null && callObj != null) {
                    Tool.callback(callFunc, callObj, body);
                }
            });
        var _tween1 = egret.Tween.get(body);
        _tween1.to({ childOffY: _flyHigh }, cusFlyInTime * 0.2, egret.Ease.circOut)
            .to({ childOffY: 0 }, cusFlyInTime * 0.3, egret.Ease.quartIn)
        // .to({ childOffY: _offY }, 100, egret.Ease.circOut)
        // .to({ childOffY: 0 }, 200, egret.Ease.quartIn)
    }
    private static getRD(value: number): number {
        return Math.round((value * Math.random()));
    }
    //The end
}