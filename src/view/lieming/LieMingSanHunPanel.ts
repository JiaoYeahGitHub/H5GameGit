class LieMingSanHunPanel extends BaseTabView {
    private btn_Quick:eui.Button;
    private itemIcon1:eui.Image;
    private itemIcon2:eui.Image;
    private itemIcon3:eui.Image;
    private itemIcon4:eui.Image;
    private itemIcon5:eui.Image;
    private itemIcon6:eui.Image;
    private itemIcon7:eui.Image;
    private name_label1:eui.Label;
    private name_label2:eui.Label;
    private name_label3:eui.Label;
    private name_label4:eui.Label;
    private name_label5:eui.Label;
    private name_label6:eui.Label;
    private name_label7:eui.Label;

    private lv_label1:eui.Label;
    private lv_label2:eui.Label;
    private lv_label3:eui.Label;
    private lv_label4:eui.Label;
    private lv_label5:eui.Label;
    private lv_label6:eui.Label;
    private lv_label7:eui.Label;

    private avatar_grp:eui.Group;
    private powerBar:PowerBar;
    private tabBtn1:eui.Image;
    private tabBtn2:eui.Image;
    private tabBtn3:eui.Image;
    private effect1:eui.Image;
    private effect2:eui.Image;
    private effect3:eui.Image;
    private index:number;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingSanHunSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.index = 0;
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_Quick.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
         for (var i: number = 1; i < 8; i++) {
            this['itemIcon'+i].name = i;
            this['itemIcon'+i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowPackage, this);
        }
        for(i = 1;i<4;i++)
        {
            this['tabBtn'+i].name = i-1;
            this['tabBtn'+i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        }
        
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FATE_ACTIVE_MESSAGE.toString(), this.onRefreshEquip, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_Quick.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        for (var i: number = 1; i < 8; i++) {
            this['itemIcon'+i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowPackage, this);
        }
        this.tabBtn3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FATE_ACTIVE_MESSAGE.toString(), this.onRefreshEquip, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
    }
    protected onRefresh(): void {
        this.onUpData();
    }
    private onRefreshEquip():void
    {
        DataManager.getInstance().fateManager.isPackage = true;
        this.onRefresh();
    }
    private onUpData():void
    {
        
        this.powerBar.power =   DataManager.getInstance().fateManager.getJobFatePower() + "";
        while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
                if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
                    (display as Animation).onDestroy();
                } else {
                    this.avatar_grp.removeChild(display);
                }
		        }
        for(var i :number = 1;i<4;i++)
        {
            this['tabNew'+i].visible = false;
            if(this.getTabNew((i-1)*7))
            {
                this['tabNew'+i].visible = true;
            }
        }       
        switch(this.index)
        {
            case 0:  
                this.onUpDataItemSlot(0)
            break;
            case 1: 
                   this.onUpDataItemSlot(7)
            break;
            case 2: 
                this.onUpDataItemSlot(14)
            break;
        }
       


    }
    private  _fateThings:FateBase[];
    private getTabNew(idx:number):boolean{
        this._fateThings = DataManager.getInstance().playerManager.player.getPlayerData().fateThings;
        for(var i = 0;i<7;i++)
         {
           if(DataManager.getInstance().dupManager.getXueZhanHistoryNum<GoodsDefine.FATE_UNLOCK[idx/7+1])
           {
               return;
           }
               var cfg = JsonModelManager.instance.getModelmingge()[this._fateThings[idx+i].modelID]
                if(cfg)
                {
                                if(DataManager.getInstance().fateManager.getFateEquipPowerPoint(this._fateThings[idx+i],Tool.toInt(idx/7)))
                                    {
                                        return true;
                                    }
                }
                else
                 {
                                    // DataManager.getInstance().dupManager.getXueZhanHistoryNum>=GoodsDefine.FATE_UNLOCK[idx+i] &&
                    // if(DataManager.getInstance().fateManager.getFateEquipPoint(idx))
                    //  {
                         if(DataManager.getInstance().fateManager.getFateEquipPowerPoint(this._fateThings[idx+i],Tool.toInt(idx/7)))
                                    {
                                        return true;
                                        // this['redNew'+(i+1)].visible = true;
                                    }

                        // var fates :FateBase[]= this.getPlayer().fates;
                        //  for(let k in fates){  
                        //         if(this.isEquip(this.index,fates[k].modelID,idx+i))
                        //         {
                        //             // this['redNew'+(i+1)].visible = true;
                        //         return true;
                        //         }
                        //     }

                    //  }
                  }
                }
           
           
          return false;
    }
    private onUpDataItemSlot(idx:number):void{
        for(var i = 0;i<7;i++)
        {
                        this['redNew'+(i+1)].visible = false;
                        this['itemIcon'+(i+1)].source = 'liemingjiahao_png';
                        this['lv_label'+(i+1)].text ='';
                        this['name_label'+(i+1)].text ='';
                        this['effectImg'+(i+1)].source = '';
                        if( DataManager.getInstance().dupManager.getXueZhanHistoryNum<GoodsDefine.FATE_UNLOCK[idx+i])
                        {
                            this['itemIcon'+(i+1)].source = 'public_fun_lock3_png';
                        }
                        else
                        {
                            var cfg = JsonModelManager.instance.getModelmingge()[this._fateThings[idx+i].modelID]
                            if(cfg)
                            {
                                if(DataManager.getInstance().fateManager.getFateEquipPowerPoint(this._fateThings[idx+i],this.index))
                                {
                                    this['redNew'+(i+1)].visible = true;
                                }
                            this['itemIcon'+(i+1)].source = cfg.icon;
                            this['lv_label'+(i+1)].text ='Lv.'+this._fateThings[idx+i].lv;
                            this['name_label'+(i+1)].text =cfg.name;
                            if(cfg.pinzhi>2)
                                {
                                    let _mountBody: Animation = new Animation('yuanhun'+cfg.pinzhi);
                                    _mountBody.x = this['itemIcon'+(i+1)].parent.x+35;
                                    _mountBody.y = this['itemIcon'+(i+1)].parent.y+35;
                                    this.avatar_grp.addChild(_mountBody);
                                }
                                else
                                this['effectImg'+(i+1)].source = 'liemingEffect'+cfg.pinzhi+'_png';
                            }
                            else
                            {
                            
                                        if(DataManager.getInstance().fateManager.getFateEquipPowerPoint(this._fateThings[idx+i],this.index))
                                        {
                                            this['redNew'+(i+1)].visible = true;
                                        }
                            }
                        }
                        // var name: number = 0;
         }
    }
     
    private onTab(event:egret.Event): void {
        var name: number =Number(event.target.name);
        if(this.index == name)
        return;

        if(DataManager.getInstance().dupManager.getXueZhanHistoryNum<GoodsDefine.FATE_UNLOCK[name*7])
        {
            GameCommon.getInstance().addAlert('地府'+GoodsDefine.FATE_UNLOCK[name*7]+'层开启!');
                        return;
        }


        this.index = name;
        for(var i :number = 1;i<4;i++)
        {
            this['effect'+i].visible = false;
        }
        this['effect'+(this.index+1)].visible = true;
        this.onRefreshEquip();
    }
    private onEquipSend(event: egret.Event):void{
        if(event.data)
        {
            if(DataManager.getInstance().fateManager.isEquip(this.index,event.data.ftData.modelID,event.data.lmData.solt))
            {
                
                var allotMsg: Message = new Message(MESSAGE_ID.FATE_ACTIVE_MESSAGE);
                                allotMsg.setByte(0);
                                allotMsg.setInt(event.data.ftData.UID)
                                allotMsg.setByte(event.data.lmData.solt); 
                                GameCommon.getInstance().sendMsgToServer(allotMsg);
            }
            else
            {
                GameCommon.getInstance().addAlert('同属性命格已上限');
            }
                
        }
    }
    private onShowPackage(event:egret.Event): void {
        var name: number =Number(event.target.name);
        name =  this.index*7 +name-1;
        if(DataManager.getInstance().dupManager.getXueZhanHistoryNum<GoodsDefine.FATE_UNLOCK[name])
        {
            GameCommon.getInstance().addAlert('地府'+GoodsDefine.FATE_UNLOCK[name]+'层开启!');
                        return;
        }
        var fateData :FateBase = DataManager.getInstance().playerManager.player.getPlayerData().fateThings[name];
        if(fateData.modelID>0)
        {
            var cfg = JsonModelManager.instance.getModelmingge()[fateData.modelID]
            if(cfg)
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("LieMingIntroducebar",new LieMingIntroducebarParam(fateData)));
            else
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingPackagePanel",new LieMingData(1,name,'equip')));
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LieMingPackagePanel",new LieMingData(1,name,'equip')));
    }
    private onAdvanceBack(): void {

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
    private onTouch(): void {
        
    }
    private getPlayer() {
        return DataManager.getInstance().playerManager.player;
    }
}