class SystemOptPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private scroller: eui.Scroller;
    private groupList: eui.Group;
    private hero_headIcon:PlayerHeadPanel;
    private powerbar: PowerBar;
    private currency: ConsumeBar;
    private currProTitle: eui.Label;
    private currPro: eui.Label;
    private nextProTitle: eui.Label;
    private nextPro: eui.Label;
    private btn_change:eui.Button;
    private btn_up: eui.Button;
    private groupNext: eui.Group;
    private itemList: PlayerIconItem[];
    private currItem: PlayerIconItem;
    private lbLevel: eui.Label;

    private basicerji: eui.Component;
    private erjiPanel: eui.Group;
	private curProerji: eui.Label;
	private nextProerji: eui.Label;
    // private currAttrLayer: eui.Group;
    // private nextAttrLayer: eui.Group;
    private playerHeadEJ: PlayerHeadPanel;
    private jihuoBtn: eui.Button;
    private closeerji: eui.Button;
    private consumItemEJ: ConsumeBar;
    private lbLevelEJ: eui.Label;
    private need: eui.Label;
    private upItem: PlayerIconItem;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PlayerHeadOptSkin;
	}
	protected onInit(): void {
		this.setTitle("更换头像");
        this.setTitleErji("头像");
		super.onInit();
		GameCommon.getInstance().addUnderlineStr(this.need);
        this.onInitHead();
		this.onRefresh();
        let redPo = this.createRedPoint();
        redPo.register(this.btn_up, new egret.Point(150, -5), DataManager.getInstance().playerManager, "checkRedPointHeadUp");
	}
    public setTitleErji(title: string){
        this.basicerji["label_title"].text = title;
    }
    private onInitHead(){
        let player = DataManager.getInstance().playerManager.player;
        this.itemList = [];
        let list = JsonModelManager.instance.getModeltouxiang();
        for(let k in list){
            let model: Modeltouxiang = list[k];
            if(model.sex == player.sex || model.sex == 2){
                let item = new PlayerIconItem(this, model);
                this.itemList.push(item);
                item.update();
            }
        }
        this.itemList.sort(function (a: PlayerIconItem, b: PlayerIconItem): number {
			return a.model.order - b.model.order;
		});
        for (let i = 0; i < this.itemList.length; i++) {
            this.groupList.addChild(this.itemList[i]);
        }
        // this.scroller.verticalScrollBar.autoVisibility = false;
		this.scroller.verticalScrollBar.visible = false;
    }
    protected onRegist(): void {
		super.onRegist();
        this.erjiPanel.visible = false;
		this.need.addEventListener(egret.TouchEvent.TOUCH_TAP, this.omTouchHQTJ, this);
		this.jihuoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jihuoMethod, this);
		this.closeerji.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeErJiPanel, this);
		this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChange, this);
        this.btn_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUp, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE.toString(), this.onRefresh, this); 
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE.toString(), this.onCallbackUp, this); 
	}
	protected onRemove(): void {
		super.onRemove();
        this.need.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.omTouchHQTJ, this);
		this.jihuoBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jihuoMethod, this);
		this.closeerji.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeErJiPanel, this);
		this.btn_change.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChange, this);
        this.btn_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUp, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE.toString(), this.onRefresh, this); 
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE.toString(), this.onCallbackUp, this); 
	}
    private onTouchUp(){
        let level = DataManager.getInstance().playerManager.player.getHeadLevel(0);
        let modelNext: Modeltouxiangshengji = JsonModelManager.instance.getModeltouxiangshengji()[level];
        if(modelNext){
            let rew = modelNext.cost;
            if(GameCommon.getInstance().onCheckItemConsume(rew.id, rew.num)){
                this.upItem = null;
                var message: Message = new Message(MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE);
                message.setByte(0);
                GameCommon.getInstance().sendMsgToServer(message);
            }
        }
    }
    private onTouchChange() {
        if(this.currItem){
            let player = DataManager.getInstance().playerManager.player;
            if(player.headIndex != this.currItem.model.id){
                var message: Message = new Message(MESSAGE_ID.OPT_PLAYER_HEAD_MESSAGE);
                message.setByte(this.currItem.model.id);
                GameCommon.getInstance().sendMsgToServer(message);
            }
        }
    }
    private onCallbackUp(){
        this.onRefresh();
        if(this.upItem){
            this.updateUpPanel(this.upItem);
            GameCommon.getInstance().addAnimation('tujianshengji', new egret.Point(300, 410), this.erjiPanel, 1);
        }
    }
    private updateUpPanel(upItem: PlayerIconItem){
        let model: Modeltouxiang = upItem.model;

        this.playerHeadEJ.setHead(model.id);
        let level = SystemOptPanel.getLevel(model.id);
        this.lbLevelEJ.text = level.toString();
        if(level > 0){
            this.jihuoBtn.labelDisplay.text = "进阶";
        } else {
            this.jihuoBtn.labelDisplay.text = "激活";
        }

        this.consumItemEJ.setConsume(model.cost.type, model.cost.id, model.cost.num);

        // this.currAttrLayer.removeChildren();
		// this.nextAttrLayer.removeChildren();
        let strCurr = "";
        let strNext = "";
        let attrAry: number[] = model.attrAry;
        for (let i = 0; i < 4; i++) {
            // let item = new AttributesText();
            // item.updateAttr(i, attrAry[i] * level);
            // this.currAttrLayer.addChild(item);
            if(strCurr.length > 0){
                strCurr += "\n";
            }
            strCurr += GameDefine.Attr_FontName[i] + "：+" + attrAry[i] * level;
            if(strNext.length > 0){
                strNext += "\n";
            }
            strNext += GameDefine.Attr_FontName[i] + "：+" + attrAry[i] * (level + 1);
            // let itemNext = new AttributesText();
            // itemNext.updateAttr(i, attrAry[i] * (level + 1), GameDefine.Attr_After_Color);
            // this.nextAttrLayer.addChild(itemNext);
        }
        this.curProerji.text = strCurr;
        this.nextProerji.text = strNext;
    }
    public setUpItem(upItem: PlayerIconItem){
        this.upItem = upItem;
        this.updateUpPanel(upItem);
        this.erjiPanel.visible = true;
    }
    private closeErJiPanel(){
        this.erjiPanel.visible = false;
    }
    private jihuoMethod(){
        if(this.upItem){
            let player = DataManager.getInstance().playerManager.player;
            let model: Modeltouxiang = this.upItem.model;
            if(player.coatardLv < model.tiaojian){
                GameCommon.getInstance().addAlert("error_tips_99");
                return;
            }
            // 判断消耗
            let rew: AwardItem = model.cost;
            if(!GameCommon.getInstance().onCheckItemConsume(rew.id, rew.num)){
                return;
            }
            // 升级
            var message: Message = new Message(MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE);
            message.setByte(model.id)
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }
    private omTouchHQTJ(){
        if(this.upItem){
		    GameCommon.getInstance().onShowFastBuy(this.upItem.model.cost.id);
        }
    }
    public static getLevel(id){
        return DataManager.getInstance().playerManager.player.getHeadLevel(id);
    }
    protected onRefresh(): void {
        super.onRefresh();
        let player = DataManager.getInstance().playerManager.player;
        this.hero_headIcon.setHead();
        this.onUpdateHead(player);
        this.updateAttri(player);
        // this.hero_headIcon.source = GameCommon.getInstance().getHeadIconByIndex(DataManager.getInstance().playerManager.player.headIndex);
	}
    private updateAttri(player: Player){
        var tempAttribute: number[] = player.getHeadAttribute();
        this.powerbar.power = GameCommon.calculationFighting(tempAttribute);

        let attLeft = "";
        for (let i = 0; i < 4; i++) {
            attLeft += GameDefine.Attr_FontName[i] + "：+" + tempAttribute[i] + "\n";
        }
        this.currPro.text = attLeft;

        let level = player.getHeadLevel(0);
        // this.lbLevel.text = level.toString();
        this.currProTitle.text = level + "级属性";
        this.nextProTitle.text = (level + 1) + "级属性";
        let modelNext: Modeltouxiangshengji = JsonModelManager.instance.getModeltouxiangshengji()[level];
        if(modelNext){
            var tempAttributeNext: number[] = player.getHeadAttribute(modelNext);
            let attRight = "";
            for (let i = 0; i < 4; i++) {
                attRight += GameDefine.Attr_FontName[i] + "：+" + tempAttributeNext[i] + "\n";
            }
            this.nextPro.text = attRight;
            this.groupNext.visible = true;

            let rew = modelNext.cost;
            this.currency.setConsume(rew.type, rew.id, rew.num);
            this.currency.visible = true;
        } else {
            this.groupNext.visible = false;
            this.currency.visible = false;
            this.btn_up.visible = false;
            this.btn_change.horizontalCenter = "0";
        }
    }
    private onUpdateHead(player: Player){
        for(let i = 0; i < this.itemList.length; ++i){
            this.itemList[i].update();
            if(this.itemList[i].model.id == player.headIndex){
                this.setCurrItem(this.itemList[i]);
            }
        }
    }
    public setCurrItem(item: PlayerIconItem){
        if(this.currItem){
            this.currItem.setSelect(false);
            this.currItem = null;
        }
        if(item){
            this.currItem = item;
            this.currItem.setSelect(true);
        }
    }
	//The end
}
class PlayerIconItem extends eui.Component {
    private systemOptPanel: SystemOptPanel;
    private playerHead:PlayerHeadPanel;
    private btn: eui.Button;
    private suo: eui.Image;
    private currency: ConsumeBar;
    private selectEffct:eui.Image;
    private lbCount: eui.Label;
    private imgLevel: eui.Image;
    private lbLevel: eui.Label;
    public model: Modeltouxiang;
    private isJingJie: boolean;
    private isCost: boolean;
    constructor(systemOptPanel: SystemOptPanel, model: Modeltouxiang) {
        super();
        this.systemOptPanel = systemOptPanel;
        this.model = model;
        this.skinName = skins.IconSettingSkin;
        this.selectEffct.visible = this.suo.visible = false;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
        this.playerHead.addClickListener(this.onTouchIcon, this);
        let redPo = systemOptPanel.createRedPoint();
        redPo.register(this.btn, new egret.Point(150, -5), DataManager.getInstance().playerManager, "checkRedPointHeadModel", model);
    }
    public update(){
        let player: Player = DataManager.getInstance().playerManager.player;
        this.playerHead.setHead(this.model.id);
        this.currency.visible = this.lbCount.visible = false;
        this.isJingJie = this.isCost = true;
        let level = SystemOptPanel.getLevel(this.model.id);
        this.lbLevel.text = level.toString();
        let rew: AwardItem = this.model.cost;
        if(rew){
            this.currency.setConsume(rew.type, rew.id, rew.num);
            this.currency.visible = true;
            this.isCost = DataManager.getInstance().bagManager.getGoodsThingNumById(rew.id) >= rew.num;
            if(level > 0){
                this.btn.labelDisplay.text = "进阶";
            } else {
                this.btn.labelDisplay.text = "激活";
            }
            this.btn.visible = true;
        } else {
            this.imgLevel.visible = this.lbLevel.visible = false;
            this.btn.visible = false;
            this.isJingJie = player.coatardLv >= this.model.tiaojian;
            if(!this.isJingJie){
                this.lbCount.text = Language.instance.getText("jingjie") + "：" + player.coatardLv + "/" + this.model.tiaojian;
                this.lbCount.visible = true;
            }
        }
       
        this.suo.visible = level == 0 && !this.isJingJie;
    }
    private onEventBtn(): void {
        // // 判断境界
        // if (!this.isJingJie) {
        //     GameCommon.getInstance().addAlert("error_tips_99");
        //     return;
        // }
        // // 判断消耗
        // let rew: AwardItem = this.model.cost;
        // if(!GameCommon.getInstance().onCheckItemConsume(rew.id, rew.num)){
        //     return;
        // }
        this.systemOptPanel.setUpItem(this);
        // // 升级
        // var message: Message = new Message(MESSAGE_ID.OPT_PLAYER_HEAD_UP_MESSAGE);
        // message.setByte(this.model.id)
        // GameCommon.getInstance().sendMsgToServer(message);
    }
    public setSelect(isSelect: boolean){
        this.selectEffct.visible = isSelect;
    }
    private onTouchIcon(){
        if(DataManager.getInstance().playerManager.player.getHeadLevel(this.model.id) > 0 || !this.model.cost){
            this.systemOptPanel.setCurrItem(this);
        } else {
            GameCommon.getInstance().addAlert("头像未激活！");
        }
    }
}