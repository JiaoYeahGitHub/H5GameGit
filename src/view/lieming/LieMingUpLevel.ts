class LieMingUpLevel extends BaseTabView {
    private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private progress: eui.ProgressBar;
    private currency: ConsumeBar;
    private btn_Quick: eui.Button;
    private itemGroup: eui.List;
    private pop :eui.Group;
    private popBtn:eui.Button;
    private btn1:eui.Button;
    private btn2:eui.Button;
    private btn3:eui.Button;
    private btn4:eui.Button;
    private btn5:eui.Button;
    private itemIcon:eui.Image;
    private curId:number;
    private curLv:number;
    private curExp:number;
    private curSlot:number = 0;
    private curPinZhi :number =0;
    private avatar_grp:eui.Group;
    private curProPanel:eui.Group;
    private nextProPanel:eui.Group;
    private tips_mask:eui.Group;
    private viewmask: egret.Shape;
    private fateName:eui.Label;
    private fateLv:eui.Label;
    private effectImg:eui.Image;
    private lvUpEffect:eui.Group;
    private biaoqian:eui.Image;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingUpLevelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.effectImg.source = ''
        this.viewmask = new egret.Shape();
        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.6);
        this.viewmask.graphics.drawRect(0, 0, this.parent.width, this.parent.height);
        this.viewmask.graphics.endFill();
        this.tips_mask.addChild(this.viewmask);
        this.curId = 0;
        this.onRefresh();
        this.itemGroup.itemRenderer = LieMingItemRenderer;
        this.itemGroup.itemRendererSkinName = skins.LieMingItemSkin;
        this.itemGroup.useVirtualLayout = true;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_Quick.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.itemIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBag, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_DOWN.toString(), this.onUpdateIcon, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_LVUP.toString(), this.onUpLvUp, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_REWARD_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_UPGRADE_MESSAGE.toString(), this.onAdvanceBack, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_Quick.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.itemIcon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBag, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_DOWN.toString(), this.onUpdateIcon, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_LVUP.toString(), this.onUpLvUp, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FATE_UPGRADE_MESSAGE.toString(), this.onAdvanceBack, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FATE_REWARD_MESSAGE.toString(), this.onRefresh, this);
        
    }
    protected onRefresh(): void {
        if(DataManager.getInstance().fateManager.isPackage)
        {
            DataManager.getInstance().fateManager.isPackage = false;
               this.onInitFate();
        }
        for(var h :number = 1;h<6;h++)
                    {
                        this['pinzhi'+h] = 0;
                    }
        this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
    }
    private onInitFate():void{
                this.ftData = null;
                this.itemIcon.source = 'liemingjiahao_png';
                this.curId = 0;
                this.curLv = 0;
                this.biaoqian.visible = false;
                this.fateName.text ='';
                this.fateLv.text = '';
                while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
                if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                    (display as Animation).onDestroy();
                } else {
                    this.avatar_grp.removeChild(display);
                }
                }
                this.effectImg.source = '';
                this.currLayer.removeChildren();
		this.nextLayer.removeChildren();
        this.curProPanel.visible = false;
        this.nextProPanel.visible = false;
        this.progress.minimum = 0;
        this.progress.maximum = 0;
        this.progress.value = 0;
        
    }
    private onUpLvUp(event: egret.Event):void
    {   this.progress.slideDuration = 0;
        this.ftData = event.data;
        this.biaoqian.visible = true;
        if(this.getPlayer().fates[this.ftData.UID]&&this.getPlayer().fates[this.ftData.UID].exp == this.ftData.exp&&this.getPlayer().fates[this.ftData.UID].lv == this.ftData.lv&&this.getPlayer().fates[this.ftData.UID].slot == this.ftData.slot)
        {
           this.biaoqian.visible = false;
        }
        var modelCfg = JsonModelManager.instance.getModelmingge()[this.ftData.modelID];
        this.itemIcon.source = modelCfg.icon;
        this.fateName.text = modelCfg.name;
        this.fateLv.text = 'Lv.'+ this.ftData.lv;
                this.curId = this.ftData.UID;
                this.curLv = this.ftData.lv;
                var lvCfg : Modelminggelv =JsonModelManager.instance.getModelminggelv()[this.ftData.lv-1];
                var nextCfg : Modelminggelv =JsonModelManager.instance.getModelminggelv()[this.ftData.lv];
                switch(modelCfg.pinzhi)
                {
                    case 1:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlv/100;
                    break;
                    case 2:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlan/100;
                    break;
                    case 3:
                    this.progress.maximum = lvCfg.exp*lvCfg.eXzi/100;
                    break;
                    case 4:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXcheng/100;  
                    break;
                    case 5:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXhong/100;
                     break;
                }
                this.progress.minimum = this.ftData.exp;
                this.progress.value = this.ftData.exp;
                if(modelCfg.pinzhi>2)
                {
                    this.effectImg.source = ''
                    while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
                if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                    (display as Animation).onDestroy();
                } else {
                    this.avatar_grp.removeChild(display);
                }
		        }
                let _mountBody: Animation = new Animation('yuanhun'+modelCfg.pinzhi);
                    this.avatar_grp.addChild(_mountBody);
                }
                else
                {   
                    while (this.avatar_grp.numChildren > 0) {
                let display = this.avatar_grp.getChildAt(0);
                    if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                        (display as Animation).onDestroy();
                    } else {
                        this.avatar_grp.removeChild(display);
                    }
                    }
                    this.effectImg.source = 'liemingEffect'+modelCfg.pinzhi+'_png';
                }
                
                
        
        this.currLayer.removeChildren();
		this.nextLayer.removeChildren();
        this.curProPanel.visible = false;
        this.nextProPanel.visible = false;
		var add: number = 0;
		var item: AttributesText;
        
        var attr:number[] = this.getProp(modelCfg,lvCfg);
        var nextAttr:number[]=[];
        if(nextCfg)
         nextAttr = this.getProp(modelCfg,nextCfg);

		for (var key in modelCfg.attrAry) {
			if (modelCfg.attrAry[key] > 0) {
				item = new AttributesText();
                // attributes[n] += lvCfg.attrAry[n];
				add = attr ? attr[key] : 0;
				// item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, 0];
				item.updateAttr(key, modelCfg ? add : 0);
				this.currLayer.addChild(item);

				item = new AttributesText();
				add = nextAttr ? nextAttr[key] : 0;
				// item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, add];
				item.updateAttr(key, modelCfg ? add : 0);
				this.nextLayer.addChild(item);
			}
		}
        if(this.nextLayer.numChildren>0)
        {
        this.nextProPanel.visible = true;
        }
        if(this.currLayer.numChildren>0)
        {
        this.curProPanel.visible = true;
        }
                this.onRefresh();
    }
    private onShowBag():void{
        
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingPackagePanel",new LieMingData(4,this.curId,'lvUp')) );
    }
    private ftData:FateBase;
    private onUpdateIcon(event: egret.Event):void{
        if(event.data)
        {
            
            if(this.curId!=0 && event.data.lmData.from!='lvUp' && event.data.lmData.tp!=3)
            {
                if(event.data.lmData.from =='isEquip')
                {
                    GameCommon.getInstance().addAlert("已装备的不能被消耗!");
                    return;
                }

                // if(DataManager.getInstance().fateManager.getCurExp(this.curId))
                // {
                //     if(event.data.ftData.lv> DataManager.getInstance().fateManager.getCurExp(this.curId).lv)
                //     {
                //         GameCommon.getInstance().addAlert("不能消耗等级大于本身的魂魄!");
                //         return;
                //     }   
                // }
                
                if (JsonModelManager.instance.getModelmingge()[event.data.ftData.modelID].pinzhi>=3)
                {

                    this.curMingGe = event.data;
                    var quitNotice = [{ text: `紫色以上品质是否用来升级` }];
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                        new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onConfirm, this))
                    );
                
                }
                else
                {
                    var allotMsg: Message = new Message(MESSAGE_ID.FATE_UPGRADE_MESSAGE);
                 if(!this.biaoqian.visible)
                 {    allotMsg.setByte(-1);
                     allotMsg.setInt(this.curId)
                     DataManager.getInstance().fateManager.idEquip = false;
                 }
                 else
                 {
                      allotMsg.setByte(0);
                      allotMsg.setInt(this.ftData.slot-1);
                      DataManager.getInstance().fateManager.idEquip = true;
                 }
                
                 
                 allotMsg.setShort(1);
                 allotMsg.setInt(event.data.ftData.UID)
                //  DataManager.getInstance().fateManager.deleteFate(event.data.ftData.UID)
                 
                 GameCommon.getInstance().sendMsgToServer(allotMsg);
                }
            }
            else
            {

                this.progress.slideDuration = 0;
                this.ftData = event.data.ftData;
                this.itemIcon.source = event.data.cfg.icon;
                this.curId = event.data.ftData.UID;
                this.curLv = event.data.ftData.lv;
                this.biaoqian.visible = true;
                if(this.getPlayer().fates[this.curId]&&this.getPlayer().fates[this.curId].exp == this.ftData.exp&&this.getPlayer().fates[this.curId].lv == this.ftData.lv&&this.getPlayer().fates[this.curId].slot == this.ftData.slot)
                {
                    this.biaoqian.visible = false;
                }
                
                this.fateName.text = event.data.cfg.name;
                this.fateLv.text = 'Lv.'+event.data.ftData.lv;
                var lvCfg : Modelminggelv =JsonModelManager.instance.getModelminggelv()[event.data.ftData.lv-1];
                var nextCfg : Modelminggelv =JsonModelManager.instance.getModelminggelv()[event.data.ftData.lv];
                
                switch(event.data.cfg.pinzhi)
                {
                    case 1:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlv/100;
                    break;
                    case 2:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlan/100;
                    break;
                    case 3:
                    this.progress.maximum = lvCfg.exp*lvCfg.eXzi/100;
                    break;
                    case 4:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXcheng/100;  
                    break;
                    case 5:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXhong/100;
                     break;
                }
                this.progress.minimum = 0;
                this.progress.value = event.data.ftData.exp;
                
             
                    if(event.data.cfg.pinzhi>2)
                {
                    this.effectImg.source = '';
                    while (this.avatar_grp.numChildren > 0) {
                    let display = this.avatar_grp.getChildAt(0);
                    if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                        (display as Animation).onDestroy();
                    } else {
                        this.avatar_grp.removeChild(display);
                    }
                    }
                    let _mountBody: Animation = new Animation('yuanhun'+event.data.cfg.pinzhi);
                        this.avatar_grp.addChild(_mountBody);
                }
                else
                {
                    while (this.avatar_grp.numChildren > 0) {
                let display = this.avatar_grp.getChildAt(0);
                    if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                        (display as Animation).onDestroy();
                    } else {
                        this.avatar_grp.removeChild(display);
                    }
                    }
                this.effectImg.source = 'liemingEffect'+event.data.cfg.pinzhi+'_png';
                }

                    this.currLayer.removeChildren();
		this.nextLayer.removeChildren();
		var item: AttributesText;
        this.nextProPanel.visible =false;
        this.curProPanel.visible =false;

        var add: number = 0;
        
        
		var item: AttributesText;
        var attr:number[] = this.getProp(event.data.cfg,lvCfg);
        var nextAttr:number[]=[];
        if(nextCfg)
         nextAttr = this.getProp(event.data.cfg,nextCfg);

		for (var key in event.data.cfg.attrAry) {
			if (event.data.cfg.attrAry[key] > 0) {
				item = new AttributesText();
                // attributes[n] += lvCfg.attrAry[n];
				add = attr ? attr[key] : 0;
				// item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, 0];
				item.updateAttr(key, event.data.cfg ? add : 0);
				this.currLayer.addChild(item);

				item = new AttributesText();
				add = nextAttr ? nextAttr[key] : 0;
				// item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, add];
				item.updateAttr(key, event.data.cfg ? add : 0);
				this.nextLayer.addChild(item);
			}
		}
         if(this.nextLayer.numChildren>0)
        {
        this.nextProPanel.visible = true;
        }
        if(this.currLayer.numChildren>0)
        {
        this.curProPanel.visible = true;
        }
            }
                this.onRefresh();
            // }
            
        }
        
    }
    private getProp(cfg:Modelmingge,lvCfg):number[]{
        var attr: number[] = [];
        for(let k in cfg.attrAry){  
            if(cfg.attrAry[k]>0)
            {
                switch(cfg.pinzhi)
                {
                    case 1:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lv  / 100))  
                    break;
                    case 2:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.lan  / 100)) 
                    break;
                    case 3:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.zi  / 100))  
                    break;
                    case 4:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.cheng  / 100)) 
                    break;
                    case 5:
                     attr.push(Tool.toInt(lvCfg.attrAry[k] * lvCfg.hong  / 100))  
                    break;
                }
            }
            else
            {
            attr.push(0)
            }
        }
        return attr;
    }
    private curMingGe:MingGeItem;
    private onConfirm():void
    {
        var allotMsg: Message = new Message(MESSAGE_ID.FATE_UPGRADE_MESSAGE);
                 if(!this.biaoqian.visible)
                 {
                     
                     allotMsg.setByte(-1);
                     allotMsg.setInt(this.curId);
                     DataManager.getInstance().fateManager.idEquip = false;
                 }
                 
                 else
                 {
                     DataManager.getInstance().fateManager.idEquip = true;
                     allotMsg.setByte(0);
                     allotMsg.setInt(this.ftData.slot-1);
                 }
                //  allotMsg.setInt(this.curId)
                 
                 allotMsg.setShort(1);
                 allotMsg.setInt(this.curMingGe.ftData.UID)
                //  DataManager.getInstance().fateManager.deleteFate(this.curMingGe.ftData.UID)
                 
                 GameCommon.getInstance().sendMsgToServer(allotMsg);
    }
    
    private onAdvanceBack(): void {
        var ftData :FateBase
        this.progress.slideDuration = 500;
        if(this.ftData.slot>0)
        {
            ftData = DataManager.getInstance().playerManager.player.getPlayerData().getFateSlotIdx(this.ftData.slot-1);
        }
        else
        {
            ftData = DataManager.getInstance().fateManager.getCurExp(this.biaoqian.visible,this.curId);
        }
        
        
      if(ftData)
      {
          if(ftData.lv>this.curLv)
            {
                this.curLv = ftData.lv;
                while (this.lvUpEffect.numChildren > 0) {
                let display = this.lvUpEffect.getChildAt(0);
                    if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                        (display as Animation).onDestroy();
                    } else {
                        this.lvUpEffect.removeChild(display);
                    }
                    }
                    var animPos: egret.Point = new egret.Point(25, 50);
                    let _mountBody: Animation = GameCommon.getInstance().addAnimation("qihunshengji", animPos, this.lvUpEffect);
                    _mountBody.scaleX = 0.5;
                    _mountBody.scaleY = 0.5;
            }
          this.ftData = ftData;
          this.fateLv.text = 'Lv.'+ftData.lv;
          let model :Modelmingge = JsonModelManager.instance.getModelmingge()[ftData.modelID]; 
          let lvCfg : Modelminggelv =JsonModelManager.instance.getModelminggelv()[ftData.lv-1]; 
          let nextCfg: Modelminggelv =JsonModelManager.instance.getModelminggelv()[ftData.lv]; 
         switch(model.pinzhi)
                {
                    case 1:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlv/100;
                    break;
                    case 2:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXlan/100;
                    break;
                    case 3:
                    this.progress.maximum = lvCfg.exp*lvCfg.eXzi/100;
                    break;
                    case 4:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXcheng/100;  
                    break;
                    case 5:
                     this.progress.maximum = lvCfg.exp*lvCfg.eXhong/100;
                     break;
                }
        this.progress.minimum = ftData.exp;
        this.progress.value = ftData.exp;

        this.currLayer.removeChildren();
		this.nextLayer.removeChildren();
		let add: number = 0;
		let item: AttributesText;

        var attr:number[] = this.getProp(model,lvCfg);
        var nextAttr:number[]=[];
        if(nextCfg)
         nextAttr = this.getProp(model,nextCfg);

        this.nextProPanel.visible =false;
        this.curProPanel.visible =false;
		for (var key in model.attrAry) {
			if (model.attrAry[key] > 0) {
				item = new AttributesText();
				add = attr? attr[key] : 0;
				item.updateAttr(key, model ? add : 0);
				this.currLayer.addChild(item);

				item = new AttributesText();
				add = nextAttr ? nextAttr[key] : 0;
				item.updateAttr(key, model ? add : 0);
				this.nextLayer.addChild(item);
			}
		}
         if(this.nextLayer.numChildren>0)
        {
        this.nextProPanel.visible = true;
        }
        if(this.currLayer.numChildren>0)
        {
        this.curProPanel.visible = true;
        }
      }
    //   this.onRefresh();
    }
    //更新人物战斗力
    private onUpdatePower(): void {

    }
    private onShowInfo(): void {
        // if (next) {
        // 	let costModel: ModelThing = GameCommon.getInstance().getThingModel(next.cost.type, next.cost.id);
        // 	this.currency.visible = true;
        // 	this.currency.setConsumeModel(costModel, next.cost.num);
        // }
    }
    
    //获取对应标签的数据结构
    private  rewardArr:Array<MingGeItem> = new Array<MingGeItem>();
	private get models():MingGeItem[] {
        this.rewardArr = [];
		var models: Modelmingge[];
			models =  JsonModelManager.instance.getModelmingge()
            var i =0;
            var fates :FateBase[]= DataManager.getInstance().playerManager.player.fates;
  
			for(let k in fates){  
                if(!this.ftData||this.curId != Number(k))
                {
                        this.rewardArr[i] = new MingGeItem( models[fates[k].modelID],new LieMingData(4,this.curId,'noEquip'),fates[k])
                        i =i+1;
                }
                else if (fates[k]&&fates[k].exp !=this.ftData.exp || fates[k].lv != this.ftData.lv|| fates[k].slot!= this.ftData.slot  || fates[k].model.id!=this.ftData.model.id )
                {
                    this.rewardArr[i] = new MingGeItem( models[fates[k].modelID],new LieMingData(4,this.curId,'noEquip'),fates[k])
                        i =i+1;
                }
			}   
            // var fateThings :FateBase[] = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
            // for(let k in fateThings){  
            //     if(this.curId != fateThings[k].UID && fateThings[k].modelID>0 )
            //     {
            //         this.rewardArr[i] = new MingGeItem( models[fateThings[k].modelID],new LieMingData(4,this.curId,'isEquip'),fateThings[k])
            //         i =i+1;
            //     }
			// } 
            for ( i;i<28;i++)
            {
                this.rewardArr[i] = new MingGeItem(null,new LieMingData(1,0,''),null);

            }
		return this.rewardArr;
	}
    private onTouch(): void {
        if(this.curId ==0 )
        {
            GameCommon.getInstance().addAlert("请先选择要升级的命格!");
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingUpLvPop", this.ftData));
    }
    private getPlayer() {
        return DataManager.getInstance().playerManager.player;
    }
}