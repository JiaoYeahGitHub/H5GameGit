// TypeScript file
class DiFuDupPanel extends BaseTabView {
    private xuezhanItemPos: egret.Point[];
    private AwardMaxNum: number = 2;
    // private isRegist: boolean
    // private isInit: boolean;
    private currLayerNum: number;
    // private challengePop:eui.Group;
    private btnSweep: eui.Button;
    private btnChallenge: eui.Button;
    private starNum: eui.Label;
    private curStar: eui.Label;
    private maxStar: eui.Label;
    private xuezhan_layernum: eui.Label;
    // private xuezhan_monster_name: eui.Label;
    // private xuezhan_baoxiang: eui.Image;
    // private xuezhan_shop_btn: eui.Button;
    private xuezhan_lefttimes: eui.Label;
    private xuezhan_leixing: eui.Label;
    private bossPanel: eui.Group;
    private xuezhan_buff_attr: eui.Label;
    // private figttingEff: Animation;
    private curFight: eui.Image;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.XueZhanDupPanelSkin;
    }
    protected onInit(): void {
        this.xuezhanItemPos = [];
        for (var i: number = 0; i < GameDefine.Xuezhan_LayerWaveNum; i++) {
            // var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + i] as XuezhanItem;
            // var itemPoint: egret.Point = new egret.Point();
            // itemPoint.x = xuezhanitem.x;
            // itemPoint.y = xuezhanitem.y;
            // this.xuezhanItemPos.push(itemPoint);
        }

        this.onRefresh();
    }
    private curBossCfg: Modeldifu;

    public onRefresh(): void {
        // if (!this.isInit) {
        //     this.isInit = true;
        // this.onInit();
        // }
        this.onRequestDupInfo();

    }
    private onUpDateInfo(): void {
        while (this.bossPanel.numChildren > 0) {
            let display = this.bossPanel.getChildAt(0);
            this.bossPanel.removeChild(display);
        }

        var xuezhanInfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        if (xuezhanInfo.xuezhanStar == undefined)
            return;
        var updatelayer: boolean = this.currLayerNum != DataManager.getInstance().dupManager.xuezhanLayerNum;
        this.currLayerNum = DataManager.getInstance().dupManager.xuezhanLayerNum;
        this.xuezhan_layernum.text = `第${this.currLayerNum}层`;
        var itemIndex: number = 0;
        var currstartWavenum: number = Math.max(1, (this.currLayerNum - 1) * GameDefine.Xuezhan_LayerWaveNum + 1);
        this.starNum.text = xuezhanInfo.xuezhanStar.toString();
        var starNum = 0;
        this.curStar.text = xuezhanInfo.addStar.toString();
        for (var i: number = 0; i < xuezhanInfo.layerStars.length; i++) {
            starNum = starNum + xuezhanInfo.layerStars[i];
        }
        this.maxStar.text = starNum.toString();
        //  for (var i: number = 0; i < xuezhanInfo.attrAddRates.length; i++) {
        //     var addRateVaule: number = xuezhanInfo.attrAddRates[i];
        //     if (addRateVaule > 0) {
        //         this.xuezhan_buff_attr.text += GameDefine.Attr_Name[i] + "+" + addRateVaule + "%  ";
        //     }
        // }
        let idx = 0;
        for (var i: number = currstartWavenum; i < currstartWavenum + GameDefine.Xuezhan_LayerWaveNum; i++) {
            var xuezhanitem: XuezhanItem = new XuezhanItem();
            var currwaveModel: Modeldifu = JsonModelManager.instance.getModeldifu()[i];
            xuezhanitem.onsetMonsterBody(currwaveModel.fightId);
            var waveStarNum: number = xuezhanInfo.layerStars.length >= i ? xuezhanInfo.layerStars[i - 1] : 0;
            xuezhanitem.onUpdateStar(waveStarNum.toString(), i);
            if (xuezhanInfo.xuezhanWaveNum == i) {
                this.curBossCfg = currwaveModel;
                idx = currstartWavenum + GameDefine.Xuezhan_LayerWaveNum - i;
            }
            itemIndex++;
            this.bossPanel.addChild(xuezhanitem);
        }
        this.xuezhan_buff_attr.text = "";
        let buffNum: number = 0;
        for (var i: number = 0; i < xuezhanInfo.attrAddRates.length; i++) {
            var addRateVaule: number = xuezhanInfo.attrAddRates[i];
            if (addRateVaule > 0) {
                if (i > ATTR_TYPE.MAGICDEF) {
                    buffNum = buffNum + 1;
                    if (buffNum == 5) {
                        this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "   \n";
                    }
                    else
                        this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "   ";
                } else {
                    buffNum = buffNum + 1;
                    this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "%  ";
                }

            }
        }
        if (this.xuezhan_buff_attr.text == "") {
            this.xuezhan_buff_attr.text = "无BUFF加成";
        }
        this.xuezhan_lefttimes.text = '' + xuezhanInfo.reviveNum;
        if (xuezhanInfo.reviveNum <= 0) {
            this.xuezhan_lefttimes.text = '0';
        }

        switch (idx) {
            case 1: this.curFight.x = 460;
                break;
            case 2: this.curFight.x = 250;
                break;
            case 3: this.curFight.x = 50;
                break;
        }
        this.updateAwardBoxStatus();
        this.onRegist();
    }
    private onRequestDupInfo(): void {
        (this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_DIFU);
    }

    private baoxiangStatus: number = 0;//0不可领取,1可领取,2已领取
    private updateAwardBoxStatus(): void {
        var xuezhanInfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        if (xuezhanInfo.isRewardBox) {
            this.baoxiangStatus = 1;
        } else {
            if (xuezhanInfo.isSelectBuff)
                this.baoxiangStatus = 2;
            else
                this.baoxiangStatus = 0;
        }

        // this.xuezhan_baoxiang.source = this.baoxiangStatus == 2 ? "" : "";
        // this.xuezhan_baoxiang.filters = this.baoxiangStatus == 0 ? [GameDefine.GaryColorFlilter] : null;
        if (this.baoxiangStatus == 2) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XuezhanBuffPanel");
        } else if (this.baoxiangStatus == 1) {
            var sweepAwardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
            sweepAwardNoticeParam.desc = `恭喜通关地府第${this.currLayerNum}层`;
            sweepAwardNoticeParam.titleSource = "txt_jiangliyulan_png";
            sweepAwardNoticeParam.btnlabel = "领取";
            sweepAwardNoticeParam.callFunc = this.onTouchBaoxiang;
            sweepAwardNoticeParam.callObj = this;
            let awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.curBossCfg.reward4);
            sweepAwardNoticeParam.itemAwards = awards;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", sweepAwardNoticeParam));
        }
    }
    // private sildeitemnum: number;
    // private onSildeItemHandler(): void {
    //     if (this.sildeitemnum > 0)
    //         return;
    //     this.sildeitemnum = GameDefine.Xuezhan_LayerWaveNum;
    //     var _item2PosX: number = this._owner["xuezhan_waveitem" + 2].x;
    //     var _item2PosY: number = this._owner["xuezhan_waveitem" + 2].y;
    //     this.currWaveIndex++;
    //     var curitemIndex: number = (this.currWaveIndex - 1) % GameDefine.Xuezhan_LayerWaveNum;
    //     for (var i: number = GameDefine.Xuezhan_LayerWaveNum - 1; i >= 0; i--) {
    //         var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + i] as XuezhanItem;
    //         var targetPosX: number = i == 0 ? _item2PosX : this._owner["xuezhan_waveitem" + (i - 1)].x;
    //         var targetPosY: number = i == 0 ? _item2PosY : this._owner["xuezhan_waveitem" + (i - 1)].y;
    //         var scaleValue: number = i == curitemIndex ? 1 : 0.6;
    //         var tween: egret.Tween = egret.Tween.get(xuezhanitem);
    //         tween.to({ x: targetPosX, y: targetPosY, scaleX: scaleValue, scaleY: scaleValue }, 300)
    //             .call(function (index: number) {
    //                 this.sildeitemnum--;
    //                 if (this.sildeitemnum == 0) {
    //                     var xuezhanInfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
    //                     if (xuezhanInfo.xuezhanWaveNum > this.currWaveIndex) {
    //                         this.onSildeItemHandler();
    //                     }
    //                 }
    //             }, this);
    //     }
    // }
    protected onRegist(): void {
        // if (this.isRegist)
        //     return;
        // this.isRegist = true;
        // this.xuezhan_baoxiang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBaoxiang, this);

        // for (var i: number = 0; i < 3; i++) {
        //     var xuezhanChallengeItem: XueZhanDifficultySelect = this["challenge_item" + i];
        //     xuezhanChallengeItem.name = i + "";
        //     xuezhanChallengeItem.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeItem, this);
        // }
        this.btnSweep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodangHandler, this);
        this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChallenge, this);
        // this.closeDiffBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseTips, this);
        // this.xuezhan_shop_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE.toString(), this.onCloseTips, this)
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_INIT_MESSAGE.toString(), this.onUpDateInfo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_REWARD_MESSAGE.toString(), this.updateAwardBoxStatus, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_BUFF_MESSAGE.toString(), this.onUpDateInfo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE.toString(), this.onResDupSweepMsg, this);
    }

    protected onRemove(): void {
        // this.isRegist = false;
        // this.xuezhan_baoxiang.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBaoxiang, this);
        this.btnSweep.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodangHandler, this);
        this.btnChallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChallenge, this);
        // this.xuezhan_shop_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        // for (var i: number = 0; i < 3; i++) {
        //     var xuezhanChallengeItem: XueZhanDifficultySelect = this["challenge_item" + i];
        //     xuezhanChallengeItem.btnChallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeItem, this);
        // }

        // this.closeDiffBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseTips, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_FIGHT_MESSAGE.toString(), this.onCloseTips, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_INIT_MESSAGE.toString(), this.onUpDateInfo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_REWARD_MESSAGE.toString(), this.updateAwardBoxStatus, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_BUFF_MESSAGE.toString(), this.onUpDateInfo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE.toString(), this.onResDupSweepMsg, this);
    }
    private onTouchChallengeItem(event: egret.Event): void {
        // var xuezhanChallengeItem: XueZhanDifficultySelect = event.currentTarget as XueZhanDifficultySelect;
        // var itemIndex: number = parseInt(xuezhanChallengeItem.name);
        // var difficultyStr: string = event.currentTarget.name;
        // var difficultyIndex: number = itemIndex;


    }
    private onCloseTips(): void {
        // this.challengePop.visible = false;
        // this.tips_mask.visible = false;
    }
    private onChallengeDup(idx: number): void {

        GameFight.getInstance().onSendXuezhanFightMsg(idx);
    }
    private onShowChallenge(): void {
        // if(DataManager.getInstance().dupManager.xuezhanInfo.reviveNum<=0)
        // {
        //     GameCommon.getInstance().addAlert("挑战次数不足!");
        //     return;
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("DiFuDupChallenge", this.curBossCfg));

        //   let powers: string[] = this.curBossCfg.power.split(",");
        //     for (var i: number = 0; i < 3; i++) {
        //         var xuezhanChallengeItem: XueZhanDifficultySelect = new XueZhanDifficultySelect();
        //         let awards:AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.curBossCfg['reward'+(i+1)]);
        //         var model = GameCommon.getInstance().getThingModel(awards[0].type, awards[0].id, awards[0].quality);
        //     }
        // this.challengePop.visible = true;
        // this.tips_mask.visible = true;
    }
    private onTouchBaoxiang(): void {
        if (this.baoxiangStatus == 0) {
            this.onShowPassAwardPanel();
        } else if (this.baoxiangStatus == 2) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XuezhanBuffPanel");
        } else if (this.baoxiangStatus == 1) {
            var rewardxuezhanBoxMsg: Message = new Message(MESSAGE_ID.XUEZHAN_REWARD_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(rewardxuezhanBoxMsg);
        }
    }
    private onSaodangHandler(evnet: egret.Event): void {
        for (var i: number = 0; i < GameDefine.Xuezhan_LayerWaveNum; i++) {
            // var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + i] as XuezhanItem;
            // if (xuezhanitem.starnum < 3) {
            //     GameCommon.getInstance().addAlert("所有关卡达到三星才能开启扫荡功能");
            //     return;
            // }
        }
        var rewardxuezhanBoxMsg: Message = new Message(MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(rewardxuezhanBoxMsg);
    }
    //血战商城
    private onShopHandler(evnet: egret.Event): void {
        var types: number[] = [2];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ShopPanel", types));
    }
    //查看通关奖励
    private onShowPassAwardPanel(): void {
        var passAwardParam: AwardNoticeParam = new AwardNoticeParam();
        passAwardParam.desc = "通关本层即可获得如下奖励";
        passAwardParam.titleSource = "jiangli_title_txt_png";
        passAwardParam.itemAwards = [];
        passAwardParam.autocloseTime = 0;
        var currWaveNum: number = this.currLayerNum * GameDefine.Xuezhan_LayerWaveNum;
        // var passRewards: AwardItem[] = ModelManager.getInstance().modelXuezhan[currWaveNum].clearReward;
        // for (var n: number = 0; n < passRewards.length; n++) {
        //     var awarditemobj: AwardItem = passRewards[n];
        //     passAwardParam.itemAwards.push(awarditemobj);
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", passAwardParam));
    }
    //更新扫荡状态
    private onResDupSweepMsg(msgEvent: Message): void {
        this.onRefresh();

        // var msg1 = msgEvent.getShort();
        // var msg2 = msgEvent.getShort();
        // var msg3 = msgEvent.getByte();
        // var msg4 = msgEvent.getBoolean();
        // var msg5 = msgEvent.getBoolean();
        // var sweepAwardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
        // sweepAwardNoticeParam.desc = "扫荡成功获得以下奖励";
        // sweepAwardNoticeParam.titleSource = "";
        // sweepAwardNoticeParam.itemAwards = [];
        // sweepAwardNoticeParam.callFunc = this.onRefresh;
        // sweepAwardNoticeParam.callObj = this;
        // sweepAwardNoticeParam.titleSource = "txt_jiangliyulan_png";
        // sweepAwardNoticeParam.btnlabel = "领取";
        // var beforeWaveNum: number = this.currLayerNum * GameDefine.Xuezhan_LayerWaveNum;
        // var xuezhanInfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        //  for (var i: number = 1; i <= xuezhanInfo.layerStars.length; i++) {
        //         if(xuezhanInfo.layerStars[i]>2)
        //         {
        //              var clearReward1:AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(JsonModelManager.instance.getModeldifu()[i].reward3)
        //              sweepAwardNoticeParam.itemAwards.push(clearReward1[0]);
        //              if(JsonModelManager.instance.getModeldifu()[i].reward4)
        //              {
        //                 var clearRewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(JsonModelManager.instance.getModeldifu()[i].reward4)
        //                  for (var n: number = 0; n < clearRewards.length; n++) {
        //                 var awarditemobj: AwardItem = clearRewards[n];
        //                 sweepAwardNoticeParam.itemAwards.push(awarditemobj)
        //                 }
        //              }
        //         }
        //  }
        // for (var n: number = 0; n < clearRewards.length; n++) {
        //     var awarditemobj: AwardItem = clearRewards[n];
        //     sweepAwardNoticeParam.itemAwards.push(awarditemobj);
        // }
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", sweepAwardNoticeParam));
    }
    //The end
}
// class XueZhanDifficultySelect extends eui.Component {
//     private consume_num_label: eui.Label;
//     private buff_txt_icon: eui.Image;
//     private attr_desc_label: eui.Label;
//     private item_back_img: eui.Image;
//     private proName:eui.Label;
//     public btnChallenge:eui.Button;
//     private award2:eui.Label;
//     private award1:eui.Label;
//     private power:eui.Label;
//     private idx:number = 1;
//     private callfuc:Function;
//     private titleName:eui.Image;
//     private icon:eui.Image;
//     public constructor() {
//         super();
//         this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
//         this.skinName = skins.XueZhanDifficultySelectSkin;
//     }
//     private onLoadComplete(): void {
//         this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
//     }

//     public set consumestar(value) {
//         // this.consume_num_label.text =value;

//     }
//     public onUpdateItem(name:string,num:number,idx:number,power:string,callFunc)
//     {
//         this.callfuc = callFunc;
//         this.idx = idx;
//         switch(idx)
//         {
//             case 1:
//             this.icon.x = 47;
//             this.icon.y = 57;
//             break;

//             case 2:
//             this.icon.x = 38;
//             this.icon.y = 57;
//             break;
//             case 3:
//             this.icon.x = 38;
//             this.icon.y = 48;
//             break;
//         }
//         this.power.text = '战斗力:'+ power;
//         this.award1.text = name+'X'+num;
//         this.award2.text = idx.toString();

//         this.titleName.source = 'difuTitle'+idx+'_png';
//         this.icon.source = 'difuicon'+idx+'_png';
//     }
//     private onTouch():void
//     {
//         if(this.callfuc)
//         {
//             this.callfuc(this.idx)
//         }
//     }
//     public onUpdateAttr(buffid: number): void {
//         // var xuezhanbuffModel: ModelXuezhanBuff = ModelManager.getInstance().modelXuezhanBuff[buffid];
//         // var attrobj: string[] = String(xuezhanbuffModel.effect).split(",");
//         // var attrType: number = parseInt(attrobj[0]);
//         // var attrValue: number = parseInt(attrobj[1]);
//         // this.buff_txt_icon.source = "xuezhan_buff_" + GameDefine.Xuezhan_Attr_Icons[attrType] + "_png";
//         // this.attr_desc_label.text = attrValue + "%";
//         // this.proName.text = GameDefine.Attr_Name[attrType];
//     }
//     //The end
// }
class XuezhanItem extends BaseComp {
    private monsterbody_group: eui.Group;
    private monsterbody: BodyAnimation;
    private star1: eui.Image;
    private star2: eui.Image;
    private star3: eui.Image;
    private killNum: eui.Label;

    private starnum: string;
    private num: number;
    private monsterAvata: number;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.XuezhanDupItemSkin;
    }
    protected onInit(): void {
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        if (Tool.isNumber(this.monsterAvata)) {
            this.onsetMonsterBody(this.monsterAvata);
        }
        if (this.starnum) {
            this.onUpdateStar(this.starnum, this.num);
        }
    }
    public onsetMonsterBody(monsterAvata: number): void {
        this.monsterAvata = monsterAvata;
        if (!this.isLoaded) return;
        // this.onUpdateStar('0');
        this.monsterbody = GameCommon.getInstance().getMonsterBody(this.monsterbody, monsterAvata);
        if (!this.monsterbody.parent) {
            this.monsterbody.scaleX = 0.8;
            this.monsterbody.scaleY = 0.8;
            this.monsterbody_group.addChild(this.monsterbody);
        }
        // this.callFunc = callFunc;
    }
    public onUpdateStar(starnum: string, num: number): void {
        this.starnum = starnum;
        this.num = num;
        if (!this.isLoaded) return;
        this.killNum.text = '第' + num + '关';
        for (var i: number = 1; i < 4; i++) {
            if (Number(starnum) > (i - 1))
                this["star" + i].source = "star_png";
            else
                this["star" + i].source = "starGrey_png";
        }
        if (this.monsterbody)
            this.monsterbody.onPlay();
    }
    // private onTouch(): void {
    //     if (this.callFunc) {
    //         this.callFunc(1);
    //     }
    // }
    public onreset(): void {
        if (this.monsterbody) {
            this.monsterbody.onDestroy();
            this.monsterbody = null;
        }
    }
    //The end
}