class UnionSkillPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private selectedIdx: number = 0;

	private group1: eui.Group;
	private group2: eui.Group;
	private group3: eui.Group;
	private group4: eui.Group;
	private group5: eui.Group;
	// private skillImg: eui.Image;
	private nameLabel: eui.Label;
	private levelLabel: eui.Label;
	private progressBar: eui.ProgressBar;
	private attrLabel1: eui.Label;
	private attrLabel2: eui.Label;
	private consume1: CurrencyBar;
	private consume2: CurrencyBar;
	private currencyBar1: CurrencyBar;
	private currencyBar2: CurrencyBar;
	private btnUp: eui.Button;

	private selectedAnim: Animation;
	private selectedAnim2: Animation;
	private currentSelect: number = 1;
	private lastSelect: number = 1;
	protected points: redPoint[] = RedPointManager.createPoint(5);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionSkillSkin;
	}
	protected onInit(): void {
		super.onInit();
		// this.setTitle("union_skill_title_png");
		this.setTitle("修炼阁");
		// this.basic["basic_tip_bg"].visible = false;

		// this.points[0].register(this.btnUp, GameDefine.RED_BTN_POS, DataManager.getInstance().unionManager, "checkUnionSkillOneAllPoint");
		for (var i: number = 0; i < UnionDefine.Union_Skill_Max; i++) {
			if(i<3){
				this.points[i].register(this[`group${(i + 1)}`], GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().unionManager, "checkUnionSkillOnePoint",0,(i+1));
			}else{
				this.points[i].register(this[`group${(i + 1)}`], new egret.Point(100, 25), DataManager.getInstance().unionManager, "checkUnionSkillOnePoint",0,(i+1));
			}
		}

		this.selectedAnim = new Animation("gonghuijineng_1", -1);
		this.selectedAnim.x = 58;
		this.selectedAnim.y = 58;
		this.selectedAnim.onPlay();
		this.group1.addChildAt(this.selectedAnim, 2);

		this.selectedAnim2 = new Animation("gonghuijineng_2", -1);
		this.selectedAnim2.x = 70;
		this.selectedAnim2.y = 94;
		this.selectedAnim2.onPlay();		

		this.group1["data"] = 1;
		this.group2["data"] = 2;
		this.group3["data"] = 3;
		this.group4["data"] = 4;
		this.group5["data"] = 5;

		this.onRefresh();
	}
	protected onRefresh(): void {		
		var skillId: number = this.currentSelect;
		var unionSkill2: UnionSkill2 = this.getPlayerData().getUnionSkill2(skillId);
		var currentLevel: number = 0;
		var nextLevel: number = 1;
		if (unionSkill2) {
			currentLevel = unionSkill2.level;
			nextLevel = currentLevel + 1;
		}
		var currentSkill2: ModelguildSkill = JsonModelManager.instance.getModelguildSkill()[skillId][currentLevel-1];
		var nextSkill2: ModelguildSkill = JsonModelManager.instance.getModelguildSkill()[skillId][nextLevel-1];
		this.levelLabel.text =  currentLevel + "级";
		var skill:ModelguildSkill = currentSkill2||nextSkill2;
		this.nameLabel.text = skill.name;
		if(skill.type == 1){
			this.progressBar.visible = false;
		}else{
			if (nextSkill2) {
				this.progressBar.visible = true;
				this.progressBar.maximum = nextSkill2.expMax;
			} else {
				this.progressBar.visible = false;			
			}
			if (unionSkill2) {
				this.progressBar.value = unionSkill2.exp;
			} else {
				this.progressBar.value = 0;
			}
		}

		if (currentSkill2) {
			var attrTxt1: string = "";
			for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
				if (currentSkill2.attrAry[i] > 0) {
					if(attrTxt1.length > 0){
						attrTxt1 += "\n";
					}
					attrTxt1 += Language.instance.getAttrName(i) + "+" + currentSkill2.attrAry[i];
				}
			}
			if (currentSkill2.attPlus > 0) {
				if(attrTxt1.length > 0){
					attrTxt1 += "\n";
				}
				attrTxt1 += "攻击加成：+" + (currentSkill2.attPlus / 100) + "%";
			}
			if (currentSkill2.hpPlus > 0) {
				if(attrTxt1.length > 0){
					attrTxt1 += "\n";
				}
				attrTxt1 += "生命加成：+" + (currentSkill2.hpPlus / 100) + "%";
			}
			this.attrLabel1.text = attrTxt1;
		} else {
			this.attrLabel1.text = "";
		}
		var attrTxt2: string = "";
		for (var i = 0; i < ATTR_TYPE.SIZE; ++i) {
			if (nextSkill2.attrAry[i] > 0) {
				if(attrTxt2.length > 0){
					attrTxt2 += "\n";
				}
				attrTxt2 += Language.instance.getAttrName(i) + "+" + nextSkill2.attrAry[i];
			}
		}
		if (nextSkill2.attPlus > 0) {
			if(attrTxt2.length > 0){
				attrTxt2 += "\n";
			}
			attrTxt2 += "攻击加成：+" + (nextSkill2.attPlus / 100) + "%";
		}
		if (nextSkill2.hpPlus > 0) {
			if(attrTxt2.length > 0){
				attrTxt2 += "\n";
			}
			attrTxt2 += "生命加成：+" + (nextSkill2.hpPlus / 100) + "%";
		}
		this.attrLabel2.text = attrTxt2;

		// this.consume1.data = new CurrencyParam("", new ThingBase(nextSkill2.costList[0].type, 0, nextSkill2.costList[0].num));
		this.consume1.setLabel(nextSkill2.costList[0].type, 0, DataManager.getInstance().playerManager.player.donate, nextSkill2.costList[0].num);
		this.consume2.data = new CurrencyParam("", new ThingBase(nextSkill2.costList[1].type, 0, nextSkill2.costList[1].num));		
		// this.currencyBar1.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.DONATE, 0, DataManager.getInstance().playerManager.player.donate));
		// this.currencyBar2.data = new CurrencyParam("", new ThingBase(GOODS_TYPE.GOLD, 0, DataManager.getInstance().playerManager.player.money));
		
		this.trigger();
	}
	protected onRegist(): void {
		super.onRegist();

		this.group1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnUp, this);

		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_SKILL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_SKILL2_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();

		this.group1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.group5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSkill, this);
		this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnUp, this);

		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_SKILL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_SKILL2_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
	}
	private onSelectSkill(event: egret.Event): void {
		var group: eui.Group = event.currentTarget;
		this.currentSelect = group["data"];
		this.clearAnim();
		if(this.currentSelect<=3){
			group.addChildAt(this.selectedAnim, 2);		
		}else{
			group.addChildAt(this.selectedAnim2, 2);		
		}
		this.lastSelect = this.currentSelect;
		this.onRefresh();
	}
	private clearAnim(){
		if(this.lastSelect==1){
			this.group1.removeChildAt(2);
		}
		if(this.lastSelect==2){
			this.group2.removeChildAt(2);
		}
		if(this.lastSelect==3){
			this.group3.removeChildAt(2);
		}
		if(this.lastSelect==4){
			this.group4.removeChildAt(2);
		}
		if(this.lastSelect==5){
			this.group5.removeChildAt(2);
		}		
	}
	public onChangeRole(): void {
		this.progressBar.value = 0;
		this.onRefresh();
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(this.selectedIdx);
	}
	private onBtnUp(): void {
		// if (this.currentSelect < 4) {
		// 	var message: Message = new Message(MESSAGE_ID.UNION_SKILL_UPGRADE_MESSAGE);
		// 	message.setByte(this.roleSelectBar.index);
		// 	message.setByte(this.currentSelect);
		// 	GameCommon.getInstance().sendMsgToServer(message);
		// } else {
			var message: Message = new Message(MESSAGE_ID.UNION_SKILL2_UPGRADE_MESSAGE);
			message.setByte(this.selectedIdx);
			message.setByte(this.currentSelect);
			GameCommon.getInstance().sendMsgToServer(message);
		// }
	}
	public trigger(): void {
		for (var i: number = 0; i < UnionDefine.Union_Skill_Max; i++) {
			this.points[i].checkPoint(true, 0,(i+1));
		}
	}
}