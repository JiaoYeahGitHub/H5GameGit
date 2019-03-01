/**
 * 押镖数据
 */
class EscortData {

    public static MAX_ESCORT_COUNT: number = 3;
    public static MAX_REFRESH_COUNT: number = 3;
    public static MAX_ROB_COUNT: number = 5;
    public static MAX_SHOW_COUNT: number = 7;

    //品质
    public _quality: number;

    //当日押镖次数
    public count: number;

    //镖车上是否有货物0--没有  1--有货
    public cargo: number;

    //本趟镖车剩余时间
    public leftTime: number;

    //本趟镖车被劫次数
    public hurted: number;

    //本趟镖车被劫信息
    public hurtedList: string;

    //当日劫镖次数
    public rob: number;

    //刷新次数
    public refresh: number;

    //加速次数
    public addSpeed: number;
    public set quality(param) {
        this._quality = param;
        if (this._quality == 0) {
            this._quality = 1;
        }
    }
    public get quality() {
        return this._quality;
    }

}