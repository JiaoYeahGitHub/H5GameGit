// TypeScript file
class StoryPanel extends eui.Component {
    private body_anim_grp: eui.Group;
    private body_name_lab: eui.Label;
    private talk_content_lab: eui.Label;
    private contiune_btn: eui.Button;
    private back_img: eui.Image;

    private storyTalks: Modelstory[];
    private targetData: BodyData;
    private hero_X: number = 0;
    private targetBody: BodyAnimation;
    private selfBody: Animation;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.StoryPanelSkin;
    }
    private onLoadComplete(): void {
        // this.width = size.width;
        this.height = size.height;
    }
    private get player(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    /**开始出现剧情 talks是对话id的列表**/
    public onshowStroy(talks: Modelstory[], bodydata: BodyData = null): void {
        this.onResize();
        this.storyTalks = talks;
        this.targetData = bodydata;

        let sex: string = this.player.sex == SEX_TYPE.MALE ? "nan" : "nv";
        let manager: BlessManager = DataManager.getInstance().blessManager;
        let blessData: BlessData = manager.getPlayerBlessData(BLESS_TYPE.CLOTHES);
        let model: Modelmount = manager.getBlessModelByData(blessData);
        // this.selfBody = new Animation(`shenzhuang_${sex}_${model.waixing1}`, -1);
        // this.selfBody.scaleX = 0.8;
        // this.selfBody.scaleY = 0.8;
        // this.selfBody.x = 60;
        if (bodydata) {
            let figttermodel: Modelfighter = ModelManager.getInstance().getModelFigher(bodydata.modelid);
            if (bodydata.bodyType == BODY_TYPE.NPC) {
                var _npcResUrl: string = LoadManager.getInstance().getNpcResUrl(figttermodel.avata, "stand", Direction.DOWN + "");
                if (this.targetBody) {
                    this.targetBody.onUpdateRes(_npcResUrl, -1, Direction.DOWN);
                } else {
                    this.targetBody = new BodyAnimation(_npcResUrl, -1, Direction.DOWN);
                }
            } else {
                this.targetBody = GameCommon.getInstance().getMonsterBody(this.targetBody, bodydata.modelid, Direction.DOWN, "stand");
            }

            this.targetBody.x = figttermodel.width / 2;
        }
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueHandler, this);
        this.contiune_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFinish, this);
        this.startPlayTalk();
    }
    private bodyTalkStr: string;
    private currContIdx: number;
    private startPlayTalk(): void {
        this.body_anim_grp.removeChildren();
        if (this.storyTalks.length == 0) {
            this.onFinish();
            return;
        }
        let storymodel: Modelstory = this.storyTalks.shift();
        if (storymodel) {
            this.bodyTalkStr = storymodel.talkwords;
            if (storymodel.self == 0 && this.targetData) {//对手说
                this.body_anim_grp.addChild(this.targetBody);
                this.targetBody.playNum = -1;
                this.body_name_lab.text = this.targetData.model.name + "：";
            } else {//我说
                this.body_anim_grp.addChild(this.selfBody);
                this.selfBody.playNum = -1;
                this.body_name_lab.text = Language.instance.getText("I") + "：";
            }
            this.body_anim_grp.alpha = 0;
            egret.Tween.get(this.body_anim_grp).to({ alpha: 1 }, 300);
            this.currContIdx = 0;
            this.autoContiune = null;
            this.talk_content_lab.text = "";
            Tool.addTimer(this.storytextTimer, this, 10);
        } else {
            this.startPlayTalk();
        }
    }
    private autoContiune: number;
    private storytextTimer(): void {
        if (Tool.isNumber(this.autoContiune)) {
            this.autoContiune--;
            if (this.autoContiune <= 0) {
                Tool.removeTimer(this.storytextTimer, this, 10);
                this.startPlayTalk();
            }
        } else {
            if (this.currContIdx == this.bodyTalkStr.length) {
                this.autoContiune = 500;
            } else {
                this.talk_content_lab.text += this.bodyTalkStr.slice(this.currContIdx++, this.currContIdx);
            }
        }
    }
    private continueHandler(): void {
        Tool.removeTimer(this.storytextTimer, this, 10);
        this.autoContiune = null;
        if (this.currContIdx < this.bodyTalkStr.length) {
            this.talk_content_lab.text = this.bodyTalkStr;
            this.currContIdx = this.bodyTalkStr.length;
        } else {
            this.startPlayTalk();
        }
    }
    public onHide(): void {
        if (this.targetBody) {
            this.targetBody.onDestroy();
            this.targetBody = null;
        }
        if (this.selfBody) {
            this.selfBody.onDestroy();
            this.selfBody = null;
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.continueHandler, this);
        this.contiune_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFinish, this);
        Tool.removeTimer(this.storytextTimer, this, 10);
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    private onFinish(): void {
        GameFight.getInstance().onRemoveStory();
    }
    private onResize(): void {
        this.back_img.width = size.width + 10;
    }
    //The end
}
//剧情类型
enum STORY_TYPE {
    MONSTER = 0,//小怪剧情
    BOSS = 1,//BOSS剧情
    FINISH = 2,//结束剧情
}