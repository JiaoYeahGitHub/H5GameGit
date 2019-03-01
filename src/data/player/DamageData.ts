class DamageData {
    public attacker: ActionBody;
    public value: number = 0;
    public pojia: number = 0;
    public xishou: number = 0;
    public judge: number = -1;//闪避暴击类型见FightDefine
    public fromDire: Direction;//伤害方向来源
    public floatingRD: number = 100;
    public isDmgFalse: boolean = false;//是否为假伤害
    public damageFnt: string = "herohpDown_fnt";//受伤播放字体
    public skill: SkillInfo;//输出的技能ID
    public scenetype: FIGHT_SCENE;
}