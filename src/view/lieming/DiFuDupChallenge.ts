// TypeScript file
class DiFuDupChallenge extends BaseWindowPanel {
    private Xuezhan_Difficulty:XueZhanDifficultySelect[];
    private challengePop:eui.Group;
    private closeDiffBtn:eui.Button;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.XueZhanDupChallengeSkin;
    }
    protected onInit(): void {
        this.Xuezhan_Difficulty = [];
        for (var i: number = 0; i < 3; i++) {
           this.Xuezhan_Difficulty.push(new XueZhanDifficultySelect())
           this.Xuezhan_Difficulty[i].x = i*195;
           this.Xuezhan_Difficulty[i].y = 30;
           this.challengePop.addChild(this.Xuezhan_Difficulty[i]);
        }
        this.onRefresh();
    }
    private curBossCfg:Modeldifu;
    
    public onRefresh(): void {
        this.updateAwardBoxStatus();
        this.onRegist();
    }
    
    public onShowWithParam(param): void {
        this.curBossCfg = param;
        super.onShowWithParam(param);
    }
    private updateAwardBoxStatus(): void {
      let powers: string[] = this.curBossCfg.power.split(",");
        for (var i: number = 0; i < 3; i++) {
            var xuezhanChallengeItem: XueZhanDifficultySelect = new XueZhanDifficultySelect();
            let awards:AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.curBossCfg['reward'+(i+1)]);
            var model = GameCommon.getInstance().getThingModel(awards[0].type, awards[0].id, awards[0].quality);
            if(model)
            {
                this.Xuezhan_Difficulty[i].onUpdateItem(model.name,awards[0].num,i+1,powers[i],this.onChallengeDup)
            }
        }
    }
    protected onRegist(): void {
        this.closeDiffBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE.toString(), this.onHide, this)
    }
    protected onRemove(): void {
        this.closeDiffBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE.toString(), this.onHide, this);
    }
    private onChallengeDup(idx:number):void
    {
        GameFight.getInstance().onSendXuezhanFightMsg(idx);
    }
      
}
class XueZhanDifficultySelect extends eui.Component {
    private consume_num_label: eui.Label;
    private buff_txt_icon: eui.Image;
    private attr_desc_label: eui.Label;
    private item_back_img: eui.Image;
    private proName:eui.Label;
    public btnChallenge:eui.Button;
    private award2:eui.Label;
    private award1:eui.Label;
    private power:eui.Label;
    private idx:number = 1;
    private callfuc:Function;
    private titleName:eui.Image;
    private icon:eui.Image;
    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.XueZhanDifficultySelectSkin;
    }
    private onLoadComplete(): void {
        this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    public set consumestar(value) {
        // this.consume_num_label.text =value;
        
    }
    public onUpdateItem(name:string,num:number,idx:number,power:string,callFunc)
    {
        this.callfuc = callFunc;
        this.idx = idx;
        switch(idx)
        {
            case 1:
            this.icon.x = 47;
            this.icon.y = 57;
            break;

            case 2:
            this.icon.x = 38;
            this.icon.y = 57;
            break;
            case 3:
            this.icon.x = 38;
            this.icon.y = 48;
            break;
        }
        this.power.text = '战斗力:'+ power;
        this.award1.text = name+'X'+num;
        this.award2.text = idx.toString();
        
        this.titleName.source = 'difuTitle'+idx+'_png';
        this.icon.source = 'difuicon'+idx+'_png';
    }
    private onTouch():void
    {
        if(this.callfuc)
        {
            this.callfuc(this.idx)
        }
    }
    public onUpdateAttr(buffid: number): void {
        // var xuezhanbuffModel: ModelXuezhanBuff = ModelManager.getInstance().modelXuezhanBuff[buffid];
        // var attrobj: string[] = String(xuezhanbuffModel.effect).split(",");
        // var attrType: number = parseInt(attrobj[0]);
        // var attrValue: number = parseInt(attrobj[1]);
        // this.buff_txt_icon.source = "xuezhan_buff_" + GameDefine.Xuezhan_Attr_Icons[attrType] + "_png";
        // this.attr_desc_label.text = attrValue + "%";
        // this.proName.text = GameDefine.Attr_Name[attrType];
    }
    //The end
}