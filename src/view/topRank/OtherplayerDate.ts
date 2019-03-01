class OtherplayerDate extends BaseWindowPanel {
    public powerbar: PowerBar;
    private userId:eui.Label;
    private userLv:eui.Label;
    private curPro:eui.Group;
    private nextPro:eui.Group;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private closeBtn1:eui.Button;
    private vip:eui.Label;
    private userName:eui.Label;
    private zhangong:eui.Label;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.OtherSkin;
    }
    protected onInit(): void {
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equip: EquipInstance = (this["equip_bar" + i] as EquipInstance);
            equip.shieldTip = true;
            equip.pos = i;
        }
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh() {
        let zhuanshengID: number = DataManager.getInstance().topRankManager.otherindexdate().otherzhuan;
        let zhuanshengCfg: Modelzhuansheng = JsonModelManager.instance.getModelzhuansheng()[zhuanshengID];

        var equip: EquipInstance;
        var data: Otherindex = DataManager.getInstance().topRankManager.otherindexdate();
        this.userName.text = data.othername+'';
        var otherPlayerData: Otherplayer = data.Otherplayerarr[0];
        this.userId.text = data.otherid+'';
        this.userLv.text = data.otherzhuan+'转'+data.otherlv+'级';
        let vip:number = GameCommon.getInstance().getVipLevel(data.othervip)
        this.vip.text = 'VIP'+  GameCommon.getInstance().getVipName(vip);

        let desc1: Array<egret.ITextElement> = new Array<egret.ITextElement>();
            desc1.push({ text:  '战功Lv：' ,style: { textColor: 0xFFDA6B,stroke:2,strokeColor:0x280606 } })
            desc1.push({ text:  data.zhangongLv+''})
        this.zhangong.textFlow = desc1 ;
        for (var i = 0; i < data.attributes.length; i++) {
                let desc: Array<egret.ITextElement> = new Array<egret.ITextElement>();
                desc.push({ text:  GameDefine.Attr_FontName[i]+'：' ,style: { textColor: 0xFFDA6B,stroke:2,strokeColor:0x280606 } })
                desc.push({ text:  data.attributes[i]+''})
                this['attPro'+i].textFlow = desc;
		}


        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equipThing: EquipThing = otherPlayerData ? otherPlayerData.equipdatearr[i] : null;
            equip = (this["equip_bar" + i] as EquipInstance);
            if (equipThing && equipThing.model) {
                var quenchingLv = 0;
                if (otherPlayerData) {
                    quenchingLv = otherPlayerData.equipgroovearr[i].quenchingLv;
                }
                equip.onUpdate(equipThing, quenchingLv);
            } else {
                equip.pos = i;
                equip.onUpdate(equipThing, 0);
            }
            var zhuangbeikeng: EquipSlotThing = new EquipSlotThing();
            if (otherPlayerData) {
                zhuangbeikeng.infuseLv = otherPlayerData.equipgroovearr[i].zhuling;
                zhuangbeikeng.intensifyLv = otherPlayerData.equipgroovearr[i].qianghua;
                zhuangbeikeng.gemLv = otherPlayerData.equipgroovearr[i].baoshi;
                zhuangbeikeng.zhLv = otherPlayerData.equipgroovearr[i].zhuhun;
                zhuangbeikeng.quenchingLv = otherPlayerData.equipgroovearr[i].quenchingLv;
                zhuangbeikeng.quenchingExp = otherPlayerData.equipgroovearr[i].quenchingExp;
            }
            equip.showSoulFrame(zhuangbeikeng.zhLv > 0);
            equip.forgeInfo = zhuangbeikeng;
        }


        for (var i = 0; i < BLESS_TYPE.SIZE; i++) {
            let desc: Array<egret.ITextElement> = new Array<egret.ITextElement>();
            desc.push({ text:  Language.instance.getText("bless" + i + "_name")+'：' ,style: { textColor: 0xFFDA6B,stroke:2,strokeColor:0x280606 } })
            desc.push({ text:  otherPlayerData.blessstagedata[i]+'级'})
            this["bless_txt" + i].textFlow =desc;
            let desc1: Array<egret.ITextElement> = new Array<egret.ITextElement>();
            desc1.push({ text:  '战力：' ,style: { textColor: 0xFFDA6B,stroke:2,strokeColor:0x280606 } })
            desc1.push({ text:  otherPlayerData.blessPowerdata[i]+''})
            this['power'+i].textFlow =desc1;
        }

        this.onupdateFightPower();
        this.onUpdateAvata();
    }
    private onupdateFightPower(): void {
        this.powerbar.power = this.getPlayerData().figthPower;
    }
    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equip: EquipInstance = (this["equip_bar" + i] as EquipInstance);
            equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        }
    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equip: EquipInstance = (this["equip_bar" + i] as EquipInstance);
            equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        }
    }
    public onTouch(event: egret.TouchEvent): void {
        if (!this.getPlayerData())
            return;
        var equipInstance: EquipInstance = event.currentTarget as EquipInstance;
        var equipThing: EquipThing = equipInstance.getEquipThing();
        if (!(equipThing && equipThing.model))
            return;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar",
                new IntroduceBarParam(INTRODUCE_TYPE.OTHER_CLOHT, GOODS_TYPE.MASTER_EQUIP, this.getPlayerData(), 0, equipInstance.pos, this.getPlayerData().occupation)
            ));
    }
    //更新外形
    private onUpdateAvata(): void {
        // this.role_avatar_img.source = `login_create_preview${this.getPlayerData().sex}_png`;
    }
    private getPlayerData(): Otherplayer {
        return DataManager.getInstance().topRankManager.otherindexdate().Otherplayerarr[0];
    }
    //The end
}