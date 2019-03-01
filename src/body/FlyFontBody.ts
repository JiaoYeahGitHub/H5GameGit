/**
 *
 * @author 
 *
 */
class FlyFontBody extends egret.DisplayObjectContainer {
    private typeBmptxt: egret.BitmapText;
    private bitmapText: egret.BitmapText;
    private damage: DamageData;
    private moveY: number;
    private targetScale: number;
    private cusFlyInTime: number = 0;
    private flyDir: number = 1;
    private playFunc;

    private isMove: number = 0;
    public isFinish: boolean = false;

    public constructor() {// type:0-无，1-暴击，2-闪避
        super();
        this.typeBmptxt = new egret.BitmapText();
        this.bitmapText = new egret.BitmapText();
        this.bitmapText.letterSpacing = -5;
        this.bitmapText.scaleX = 0.5;
        this.bitmapText.scaleY = 0.5;
    }
    public initFont(damage: DamageData) {
        this.damage = damage;
        let value: number = -damage.value;
        let type: number = damage.judge;
        let typeText: string = FightDefine.JUDEGE_TXT.length > type && type >= 0 ? FightDefine.JUDEGE_TXT[type] : null;
        if (typeText) {
            switch (type) {
                case FightDefine.JUDGE_POJIA:
                case FightDefine.JUDGE_XISHOU:
                    this.typeBmptxt.anchorOffsetY = 15;
                    this.typeBmptxt.anchorOffsetX = -70;
                    this.typeBmptxt.scaleX = 0.6;
                    this.typeBmptxt.scaleY = 0.6;
                    if (type == FightDefine.JUDGE_POJIA) {
                        value = -damage.pojia;
                    } else if (type == FightDefine.JUDGE_XISHOU) {
                        value = -damage.xishou;
                    }
                    break;
                case FightDefine.JUDGE_MABI:
                case FightDefine.JUDGE_CHENMO:
                    this.typeBmptxt.anchorOffsetY = 80;
                    this.typeBmptxt.anchorOffsetX = 40;
                    this.typeBmptxt.scaleX = 1;
                    this.typeBmptxt.scaleY = 1;
                    value = 0;
                    break;
                case FightDefine.JUDGE_FUHUO:
                    this.typeBmptxt.anchorOffsetX = 50;
                    this.typeBmptxt.anchorOffsetY = 0;
                    this.typeBmptxt.scaleX = 1;
                    this.typeBmptxt.scaleY = 1;
                    value = 0;
                    break;
                default:
                    this.typeBmptxt.anchorOffsetX = 0;
                    this.typeBmptxt.anchorOffsetY = 40;
                    this.typeBmptxt.scaleX = 1;
                    this.typeBmptxt.scaleY = 1;
                    break;
            }

            this.typeBmptxt.font = RES.getRes("font_fight_green_fnt");
            this.typeBmptxt.text = typeText;
            this.addChild(this.typeBmptxt);
        }

        let fntPosX: number = 50;
        if (value != 0) {
            let text: string = "";
            if (value >= 0) {
                text += "+" + value;
                this.bitmapText.font = RES.getRes("font_fight_green_fnt");
            } else {
                if (type == FightDefine.JUDGE_XISHOU) {
                    text += -value.toString();
                } else {
                    text += value.toString();
                }

                this.bitmapText.font = RES.getRes(damage.damageFnt);
            }
            this.bitmapText.text = text;

            fntPosX = -(this.bitmapText.width / 2 * this.bitmapText.scaleX);
            this.bitmapText.x = fntPosX;

            this.addChild(this.bitmapText);
        }
        if (this.typeBmptxt) {
            this.typeBmptxt.x = fntPosX - 100;
        }

        if (type == FightDefine.JUDGE_MABI || type == FightDefine.JUDGE_CHENMO) {
            this.scaleX = 2;
            this.scaleY = 2;
            this.alpha = 1;
            this.targetScale = 1;
            this.playFunc = this.onplaystyle2;
        } else if (type == FightDefine.JUDGE_FUHUO) {
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.moveY = this.y - 300;
            this.playFunc = this.onplaystyle3;
        } else {
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.targetScale = type == FightDefine.JUDGE_CRIT ? 4 : 3;
            this.moveY = damage.damageFnt == "hero_damage_fnt2_fnt" ? this.y + 10 : this.y - 300;
            this.playFunc = this.onplaystyle1;
        }

        this.cusFlyInTime = egret.getTimer() + 1000;
    }
    public play() {
        if (this.cusFlyInTime < egret.getTimer()) {
            this.isFinish = true;
        }

        Tool.callback(this.playFunc, this);
    }
    private onplaystyle1(): void {
        if (this.isMove == 2) {
            if (this.y > this.moveY) {
                this.y -= 2;
            }
            this.alpha -= 0.01;
        }

        if (this.isMove == 0) {
            if (this.scaleX < this.targetScale) {
                this.scaleX += 0.4;
                this.scaleY += 0.4;
            } else {
                this.isMove = 1;
            }
        } else {
            if (this.scaleX >= 1.4) {
                this.scaleX -= 0.2;
                this.scaleY -= 0.2;
            } else {
                this.isMove = 2;
            }
        }
    }
    private onplaystyle2(): void {
        if (this.scaleX > this.targetScale) {
            this.scaleX -= 0.2;
            this.scaleY -= 0.2;
        } else {
            this.alpha -= 0.02;
        }
    }
    private onplaystyle3(): void {
        if (this.y > this.moveY) {
            this.y -= 6;
            this.alpha -= 0.01;
        }
    }
    public floatGC() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.removeChildren();
        this.isFinish = false;
        this.isMove = 0;
        this.damage = null;
    }
    //The end
}
