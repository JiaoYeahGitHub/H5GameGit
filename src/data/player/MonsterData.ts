// TypeScript file
class MonsterData extends BodyData {
    private _yewaiStageNum: number;
    private canShowAnimation: boolean;//是否可以播放出场动画
    private patrolTime: number = 0;
    private randomPlTime: number = 0;

    public patrolPoint: egret.Point;//巡逻定点
    public warnDist: number = 0;//大于0即主动攻击怪物
    public hasStory: boolean;
    public groupId: number = 0;//一个标识是否为同一组的怪ID 用于当攻击列表内出现多组怪时的区分  例如主角攻击了其中一个怪 怪只会告诉同一id组的兄弟进行还手

    public constructor(id, type) {
        super(id, type);
    }

    public get avatar(): string {
        return this.model.avata;
    }

    public updateData(id, type) {
        this._yewaiStageNum = 0;
        if (id > FightDefine.PVE_BOSS_COMID && id <= FightDefine.PVE_BOSS_COMID + FightDefine.PVE_BOSS_TOTALMODEL) {
            this._yewaiStageNum = GameFight.getInstance().yewai_waveIndex;
        }
        this.bodyType = type;
        this.modelid = id;
        this.model = ModelManager.getInstance().getModelFigher(this.modelid);
        if (!this.model) {
            Tool.throwException("缺少fightter数据！::::" + this.modelid);
        }
        if (this.skills) {
            for (var i: number = this.skills.length - 1; i >= 0; i--) {
                var _skillInfo: SkillInfo = this.skills[i];
                _skillInfo = null;
                this.skills.splice(i, 1);
            }
        } else {
            this.skills = [];
        }
        var _skillParams: string[] = this.model.skill.split(",");
        for (var i: number = 0; i < _skillParams.length; i++) {
            var skillId: number = parseInt(_skillParams[i]);
            if (skillId) {
                var _skillInfo: SkillInfo = new SkillInfo(skillId, i);
                this.skills.push(_skillInfo);
            }
        }

        this.onRefreshProp();
        this.onRebirth();
    }
    //更新属性
    protected onRefreshProp(): void {
        if (this._yewaiStageNum > 0) {
            if (this._yewaiStageNum > FightDefine.PVE_BOSS_TOTALMODEL) {
                let curDiff: number = this._yewaiStageNum - FightDefine.PVE_BOSS_TOTALMODEL;
                let lastmodel: Modelfighter = ModelManager.getInstance().getModelFigher(FightDefine.PVE_BOSS_COMID + FightDefine.PVE_BOSS_TOTALMODEL);
                this.attributes[ATTR_TYPE.ATTACK] = Tool.toInt(lastmodel.attack + 0.78 * Math.pow(curDiff, 2) + 570 * curDiff);
                this.attributes[ATTR_TYPE.HP] = Tool.toInt(lastmodel.hp + 50 * Math.pow(curDiff, 2) + 37969 * curDiff);
            } else {
                this.attributes[ATTR_TYPE.ATTACK] = this.model.attack;
                this.attributes[ATTR_TYPE.HP] = this.model.hp;
            }

            this.attributes[ATTR_TYPE.PHYDEF] = this.model.phyDef;
            this.attributes[ATTR_TYPE.MAGICDEF] = this.model.magicDef;
            this.attributes[ATTR_TYPE.HIT] = this.model.hit;
            this.attributes[ATTR_TYPE.DODGE] = this.model.dodge;
            this.attributes[ATTR_TYPE.BLOCK] = this.model.block;
            this.attributes[ATTR_TYPE.BREAK] = this.model.counter;
            this.attributes[ATTR_TYPE.CRIT] = this.model.crit;
            this.attributes[ATTR_TYPE.DUCT] = this.model.duct;
        } else {
            this.attributes[ATTR_TYPE.ATTACK] = this.model.attack;
            this.attributes[ATTR_TYPE.PHYDEF] = this.model.phyDef;
            this.attributes[ATTR_TYPE.MAGICDEF] = this.model.magicDef;
            this.attributes[ATTR_TYPE.HP] = this.model.hp;
            this.attributes[ATTR_TYPE.HIT] = this.model.hit;
            this.attributes[ATTR_TYPE.DODGE] = this.model.dodge;
            this.attributes[ATTR_TYPE.BLOCK] = this.model.block;
            this.attributes[ATTR_TYPE.BREAK] = this.model.counter;
            this.attributes[ATTR_TYPE.CRIT] = this.model.crit;
            this.attributes[ATTR_TYPE.DUCT] = this.model.duct;
        }

        super.onRefreshProp();
    }

    public onRebirth(): void {
        super.onRebirth();
        this.level = this.model.level;
        for (var i: number = 0; i < this.skills.length; i++) {
            this.skills[i].level = 1;//怪物的技能初始值1级
        }
        this.resetAllSkillCD(GameFight.getInstance().enemy_randomIndex);
        // if (this.model.showAnimation)
        //     this.canShowAnimation = true;
        // else
        //     this.canShowAnimation = false;
        this.patrolPoint = null;
        this.warnDist = 0;
        // this.hasStory = this.model.storyList && this.model.storyList.length > 0;
    }

    public get showAnimation(): string {
        var animationRes: string;
        if (this.canShowAnimation) {
            this.canShowAnimation = false;
            // animationRes = this.model.showAnimation;
        }
        return animationRes;
    }

    public get canPatrol(): boolean {
        if (this.bodyType != BODY_TYPE.MONSTER)
            return false;
        if (!GameFight.getInstance().canPatrol) {
            return false;
        }
        if (this.randomPlTime == 0)
            this.randomPlTime = Math.random() * 2000;
        else if (egret.getTimer() - this.patrolTime < this.randomPlTime) {
            return false;
        }
        this.patrolTime = egret.getTimer();
        var _random = Math.random() * 10;
        if (_random < 2) {
            return true;
        }
        return false;
    }
    //The end
}