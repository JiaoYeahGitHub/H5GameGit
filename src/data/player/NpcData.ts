// TypeScript file
class NpcData extends BodyData {
    public eventType: NPC_BODY_TYPE;
    public eventParam;//Npc事件对象

    public constructor(id, type) {
        super(id, type);
    }

    public get modelId(): string {
        return this.model.avata;
    }
    public updateData(id, type) {
        super.updateData(id, type);
        this.name = this.model.name;
    }
    //更新属性
    protected onRefreshProp(): void {
        // this.attributes[ATTR_TYPE.ATTACK] = this.model.attack;
        // this.attributes[ATTR_TYPE.PHYDEF] = this.model.phydef;
        this.attributes[ATTR_TYPE.HP] = this.model.hp;
        // this.attributes[ATTR_TYPE.HIT] = this.model.hit;
        // this.attributes[ATTR_TYPE.DODGE] = this.model.dodge;
        // this.attributes[ATTR_TYPE.BLOCK] = this.model.block;
        // this.attributes[ATTR_TYPE.BREAK] = this.model.counter;
        // this.attributes[ATTR_TYPE.CRIT] = this.model.crit;
        // this.attributes[ATTR_TYPE.DUCT] = this.model.duct;
        super.onRefreshProp();
    }
    //The end
}