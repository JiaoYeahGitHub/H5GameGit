// ∑TypeScript file
class SkillInfo {
    public id;//技能id
    public model: Modelskill;
    public attackCount: number = 1;//攻击分为多少段
    public styleNum: number = 0;

    private stampTime: number = 0;//上次释放时间
    private type: number = 0;
    private _index: number;
    private _lvAddDamage: number = null;
    private _lvEwaiDamage: number = null;

    public constructor(id, index, type = 0) {
        this.id = id;
        this._index = index;
        this.model = JsonModelManager.instance.getModelskill()[this.id];
        if (!this.model) {
            Tool.throwException("缺少技能数据！");
        }
        this.type = type;
        this.addDamage = this.model.ewai;
    }
    /**更新等级阶段**/
    private _level: number = 0;//等级
    public set level(value: number) {
        if (this._level != value) {
            this._level = value;
        }
    }
    public get level(): number {
        return this._level;
    }

    private _grade: number = 1;//品阶
    public set grade(value: number) {
        if (this._grade != value) {
            this._grade = value;
        }
    }
    public get grade(): number {
        return this._grade;
    }

    public get index(): number {
        return this._index;
    }
    /**获取技能名称**/
    public getName(grade: number = 0): string {
        var _grade: number = grade > 0 ? grade : this._grade;
        return Language.instance.getText(`skillname_${this.id}_${_grade}`);
    }
    /**获取技能图标**/
    public getIcon(grade: number = 0): string {
        var _grade: number = grade > 0 ? grade : this._grade;
        return `skillicon_${this.id}_${1}_png`;
    }
    /**获取技能图标**/
    public getSkillNameIcon(grade: number = 0): string {
        return `zi_skill_${this.id}_png`;
    }

    public get isSkillCD(): boolean {
        return this.stampTime >= egret.getTimer();
    }

    public usestart() {
        this.stampTime = egret.getTimer() + this.model.cd;
    }

    public reset() {
        this.stampTime = 0;
    }

    public setSkillCD(cd: number): void {
        this.stampTime = egret.getTimer() + cd;
    }

    public isDist(dist) {// 检测距离是否够
        return dist <= this.model.dist;
    }

    public getBaseDamage() {
        return (this.model.valueBase + (this._lvEwaiDamage ? this._lvEwaiDamage : 0)) / 10000;
    }

    public getExtraDamage() {
        return this._lvAddDamage ? this._lvAddDamage : 0;
    }
    //额外增加绝对值的伤害
    public set addDamage(add: number) {
        this._lvAddDamage = add;
    }
    //额外增加百分比的伤害
    public set ratioDamage(value) {
        this._lvEwaiDamage = value;
    }
    private _eftclass: string = null;
    public get effectClass(): string {
        if (this._eftclass == null) {
            this._eftclass = "";
            let matchStrAry: RegExpMatchArray = this.model.effect2.match(/\[#.*?]/g);
            if (matchStrAry && matchStrAry.length > 0) {
                this._eftclass = matchStrAry[0].slice(2, matchStrAry[0].length - 1);
            }
        }
        return this._eftclass;
    }
    // public getDuoduanRate(): number {
    //     var duoduanValue: number = null;
    //     if (this.countDuoduan < this.duoduanTotal) {
    //         duoduanValue = 1 / this.duoduanTotal;
    //         this.countDuoduan++;
    //     }
    //     return duoduanValue;
    // }
    //The end
}
enum SKILL_HURT_TYPE {
    PHY_HURT = 0,
    MAGIC_HURT = 1,
}
