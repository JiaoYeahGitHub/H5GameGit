/**
 * 角色技能面板
 */
class SkillRolePanel extends BaseTabView {
    public bar: eui.Scroller;
    public list_grp: eui.List;
    public consume: eui.Group;
    public img_icon: eui.Image;
    public label_r: eui.Label;
    public cur_cury_lab: eui.Label;
    public btnUpAll: eui.Button;

    private currSkillsLv: number[];
    private currSkillsGd: number[];
    private items: SkillInfo[];
    protected points: redPoint[] = RedPointManager.createPoint(1);

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SkillRolePanelSkin;
    }
    protected onInit(): void {
        this.currSkillsLv = [];
        this.currSkillsGd = [];

        this.infoReset();
        this.list_grp.itemRenderer = SkillUpgradeItem;
        this.list_grp.itemRendererSkinName = skins.SkillTupoItemSkin;
        this.list_grp.useVirtualLayout = true;
        this.bar.viewport = this.list_grp;

        var skills: Array<SkillInfo> = this.playerData.skills;
        // for (var i: number = 0; i < SkillDefine.SKILL_NUM; i++) {
        //     let fashions: number[] = this.playerData.fashionActive[i];
        //     let modelFashion: Modelfashion
        //     for (let fIdx in fashions) {
        //         let fashionId: number = fashions[fIdx];
        //         if (this.playerData.fashionLevel[fIdx] > 0) {
        //             modelFashion = JsonModelManager.instance.getModelfashion()[fashionId];
        //         }
        //     }
        //     if (!modelFashion) {
        //         modelFashion = JsonModelManager.instance.getModelfashion()[i + 1];
        //     }
        //     this['skillIcon' + i].source = JsonModelManager.instance.getModelskill()[modelFashion.skill].icon;
        //     this['skill_name_lab' + i].text = JsonModelManager.instance.getModelskill()[modelFashion.skill].name;
        //     this['skillIcon' + i].name = JsonModelManager.instance.getModelskill()[modelFashion.skill].id;
        //     this['skillIcon' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowTips, this);
        // }

        this.onRefresh();
        this.points[0].register(this.btnUpAll, GameDefine.RED_BTN_POS, this, "checkSkillUpBtn");
    }
    private onShowTips(event: egret.Event): void {
        var name: number = Number(event.target.name);

        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar",
                new IntroduceBarParam(7, 7, JsonModelManager.instance.getModelskill()[name], 0)
            )
        );
    }
    private checkSkillUpBtn(): boolean {
        for (var i = 0; i < this.playerData.skills.length; ++i) {
            let skillinfo: SkillInfo = this.playerData.skills[i];
            if (DataManager.getInstance().skillManager.checkSkillUp(skillinfo.id)) {
                return true;
            }
        }
        return false;
    }
    protected onRefresh(): void {
        var needMoneyAll: number = 0;
        var skills: Array<SkillInfo> = this.playerData.skills;
        this.items = [];
        for (var i: number = 0; i < SkillDefine.SKILL_NUM; i++) {
            var skillinfo: SkillInfo = skills[i];
            var model: Modelskill = skillinfo.model;
            //升级消耗
            var canMaxLevel: number = DataManager.getInstance().skillManager.getSkillUpLevelMax(skillinfo);
            for (var j = skillinfo.level + 1; j <= canMaxLevel; j++) {
                var costmodel: Modelskilldmg = JsonModelManager.instance.getModelskilldmg()[j - 1];
                needMoneyAll += costmodel.cost.num;
            }
            //更新突破
            this.items.push(skills[i])
        }
        this.label_r.text = needMoneyAll + '';
        this.cur_cury_lab.text = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.YUELI) + '';
        this.list_grp.dataProvider = new eui.ArrayCollection(this.items);
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILL_UP_MESSAGE.toString(), this.skillUpHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILL_UP_AUTO_MESSAGE.toString(), this.skillUpHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SKILL_UPGRADE_MESSAGE.toString(), this.skillUpHandler, this);
        // this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillUp, this);
        this.btnUpAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillUpAll, this);
        // for (var i: number = 0; i < this.items.length; i++) {
        //     this.items[i].onRegist();
        // }
    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILL_UP_MESSAGE.toString(), this.skillUpHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILL_UP_AUTO_MESSAGE.toString(), this.skillUpHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.SKILL_UPGRADE_MESSAGE.toString(), this.skillUpHandler, this);
        // this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillUp, this);
        this.btnUpAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillUpAll, this);
        // for (let i: number = 0; i < this.items.length; i++) {
        //     this.items[i].onRemove();
        // }
    }
    private onSkillUpAll(e: egret.TouchEvent): void {
        let message: Message = new Message(MESSAGE_ID.SKILL_UP_AUTO_MESSAGE);
        message.setByte(0);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private skillUpHandler(event: GameMessageEvent): void {
        // for (var i: number = 0; i < this.items.length; i++) {
        //     let item: SkillUpgradeItem = this.items[i];
        //     let info: SkillInfo = this.playerData.skills[i];
        //     let oldLv: number = this.currSkillsLv[i];
        //     let oldGrade: number = this.currSkillsGd[i];
        //     if (info.level > oldLv) {
        //         item.onplayUplevelAnim();
        //     }
        //     if (info.grade > oldGrade) {
        //         item.onplayUpGradeAnim();
        //     }
        // }
        this.infoReset();
        this.onRefresh();
        this.trigger();
    }
    private infoReset(): void {
        for (var i: number = 0; i < this.playerData.skills.length; i++) {
            let skillinfo: SkillInfo = this.playerData.skills[i];
            this.currSkillsLv[i] = skillinfo.level;
            this.currSkillsGd[i] = skillinfo.grade;
        }
    }
    private get playerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
}
class SkillUpgradeItem extends BaseListItem {
    public open_level_desc: eui.Label;
    public skill_name_Icon: eui.Image;
    public frame_img: eui.Image;
    public skill_icon: eui.Image;
    public skill_lv_lab: eui.Label;
    public desc_lab: eui.Label;
    public open_desc_grp: eui.Group;
    public tupo_desc_lab: eui.Label;
    public max_desc_grp: eui.Group;
    public tupo_max: eui.Label;
    public consume: ConsumeBar;
    public upgrade_btn: eui.Button;

    private _cost: AwardItem;
    private points: redPoint[] = RedPointManager.createPoint(1);
    public constructor() {
        super();
    }
    protected onInit(): void {
        this.consume.nameColor = 0xf3f3f3;
        this.upgrade_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        this.points[0].register(this.upgrade_btn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().skillManager, "checkSkillUpGrade");
    }
    protected onRemove(): void {
        this.upgrade_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
    }
    protected onUpdate(): void {
        let info = this.data;
        // this.skill_bg_img.source = `skill_item_bg${info.id}_png`;
        var model: Modelskill = info.model;
        this.skill_lv_lab.text = 'Lv.' + info.level;
        var _color: number = GameCommon.getInstance().CreateNameColer(info.grade - 1);
        this.skill_icon.source = info.getIcon();
        this.skill_name_Icon.source = info.getSkillNameIcon();
        if (model.lv > DataManager.getInstance().playerManager.player.level) {
            this.currentState = "unopen";
            this.open_level_desc.text = Language.instance.getText(model.lv, 'level', 'open');
        } else {
            this.currentState = "open";
            if (info.grade == SkillDefine.SKILL_GRADE_MAX) {
                this.upgrade_btn.visible = false;
                this.max_desc_grp.visible = true;
                this.tupo_max.text = Language.instance.getText(`jinengfumozuigao`);
                this.desc_lab.textFlow = (new egret.HtmlTextParser).parse('  ' + DataManager.getInstance().skillManager.getDesc(info));
                this.consume.visible = false;
                this.open_desc_grp.visible = false;
            } else {
                this.upgrade_btn.visible = true;
                this.desc_lab.textFlow = (new egret.HtmlTextParser).parse('  ' + DataManager.getInstance().skillManager.getDesc(info));
                var tupomodel: Modelskilltupo;
                var skillTupos = JsonModelManager.instance.getModelskilltupo()[info.id];
                for (var idx in skillTupos) {
                    var tupomodel: Modelskilltupo = skillTupos[idx];
                    if (tupomodel.tupoLv == info.grade + 1) {
                        break;
                    }
                }
                if (tupomodel.jingjie > DataManager.getInstance().playerManager.player.coatardLv) {
                    this.upgrade_btn.enabled = false;
                    this.open_desc_grp.visible = true;
                    this.consume.visible = false;
                    this.tupo_desc_lab.text ='  ' + Language.instance.getText(tupomodel.jingjie, 'grade', 'kefumo');
                } else {
                    this.upgrade_btn.enabled = true;
                    this.open_desc_grp.visible = false;
                    this._cost = tupomodel.cost;
                    if (this._cost && this._cost.type) {
                        this.consume.visible = true;
                        this.consume.setCostByAwardItem(this._cost);
                    } else {
                        this.consume.visible = false;
                    }
                }
            }
        }
        //检查红点
        this.points[0].checkPoint(true, info.id);
    }
    /**打开附魔面板**/
    private onUpgrade(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("SkillUpgradeView", this.data));
    }
    /**播放升级动画**/
    public onplayUplevelAnim(): void {
        GameCommon.getInstance().addAnimation("jinengshengji", new egret.Point(68, 55), this);
    }
    /**播放附魔动画**/
    public onplayUpGradeAnim(): void {
        GameCommon.getInstance().addAnimation("jinengfumo", new egret.Point(290, 66), this);
    }
    //The end
}