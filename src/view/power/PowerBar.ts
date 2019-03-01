// TypeScript file
class PowerBar extends eui.Component {
    private _powerValue: number = 0;
    private isLoaded: boolean;
    private power_num: eui.Label;
    private fightpowerEffect: Animation;
    private animLayer: eui.Group;
    private zhan: eui.Image;
    private w: number = 351;
    public power_bg: eui.Image;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onInit, this);
        // this.skinName = skins.PowerBarSkin;
    }
    private onLoadComplete(): void {
        this.isLoaded = true;
        this.power = this._powerValue;
    }
    private onInit() {
        // if (!this.fightpowerEffect) {
        //     this.fightpowerEffect = new Animation("zhandoulihuoyan", -1);
        //     var scale = this.width / this.w;
        //     this.fightpowerEffect.scaleX = scale;
        //     this.fightpowerEffect.y = -8;
        //     this.animLayer.addChildAt(this.fightpowerEffect, 0);
        // }
    }
    public set power(value) {
        if(!(value > 0)){
            value = 0;
        }
        this._powerValue = value;
        if (this.isLoaded) {
            this.power_num.text = this._powerValue + "";
        }
        // if(this.fightpowerEffect){
        //     this.fightpowerEffect.onPlay();
        // }
    }
    public set imageSource(source: string) {
        this.zhan.source = source;
    }
    //The end
}