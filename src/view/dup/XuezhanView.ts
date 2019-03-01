// TypeScript file
class XuezhanView extends BaseTabView {
    private Xuezhan_Difficulty: string[] = ["easy", "normal", "hard"];
    private xuezhanItemPos: egret.Point[];
    private AwardMaxNum: number = 2;
    // private isRegist: boolean
    // private isInit: boolean;
    private currLayerNum: number;

    private btnSweep:eui.Button;
    private btnChallenge:eui.Button;
    private killNum1:eui.Label;
    private killNum2:eui.Label;
    private killNum3:eui.Label;
    private starNum:eui.Label;
    private curStar:eui.Label;

    private xuezhan_layernum: eui.Label;
    // private xuezhan_monster_name: eui.Label;
    // private xuezhan_buff_attr: eui.Label;
    // private xuezhan_baoxiang: eui.Image;
    // private xuezhan_shop_btn: eui.Button;
    private xuezhan_lefttimes: eui.Label;
    // private xuezhan_leixing: eui.Label;
    // private figttingEff: Animation;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.XueZhanDupPanelSkin;
    }
    protected onInit(): void {
        for (var i: number = 0; i < this.Xuezhan_Difficulty.length; i++) {
            var difficultyStr: string = this.Xuezhan_Difficulty[i];
            // (this._owner["btn_xuezhan_" + difficultyStr] as eui.Button).name = difficultyStr;
        }
        this.xuezhanItemPos = [];
        for (var i: number = 0; i < GameDefine.Xuezhan_LayerWaveNum; i++) {
            // var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + i] as XuezhanItem;
            // var itemPoint: egret.Point = new egret.Point();
            // itemPoint.x = xuezhanitem.x;
            // itemPoint.y = xuezhanitem.y;
            // this.xuezhanItemPos.push(itemPoint);
        }
    }
    public onRefresh(): void {
        // if (!this.isInit) {
        //     this.isInit = true;
            this.onInit();
        // }
        var xuezhanInfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        var updatelayer: boolean = this.currLayerNum != DataManager.getInstance().dupManager.xuezhanLayerNum;
        this.currLayerNum = DataManager.getInstance().dupManager.xuezhanLayerNum;
        this.xuezhan_layernum.text = `第${this.currLayerNum}层`;
        var itemIndex: number = 0;
        var currstartWavenum: number = Math.max(1, (this.currLayerNum - 1) * GameDefine.Xuezhan_LayerWaveNum + 1);
        for (var i: number = currstartWavenum; i < currstartWavenum + GameDefine.Xuezhan_LayerWaveNum; i++) {
            // var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + itemIndex] as XuezhanItem;
            // var currwaveModel: ModelXuezhan = ModelManager.getInstance().modelXuezhan[i];
            // if (currwaveModel) {
            //     var monsterFightter: Modelfighter = JsonModelManager.instance.getModelfighter()[currwaveModel.xuezhanWave.monsterId];
            //     if (updatelayer) {
            //         xuezhanitem.onsetMonsterBody(monsterFightter.avata);
            //     }
            //     var waveStarNum: number = xuezhanInfo.layerStars.length >= i ? xuezhanInfo.layerStars[i - 1] : 0;
            //     xuezhanitem.onUpdateStar(waveStarNum);
            //     xuezhanitem.updateWaveLabel(i);
            //     if (xuezhanInfo.xuezhanWaveNum == i) {
            //         this.xuezhan_monster_name.text = monsterFightter.name;
            //         this.xuezhan_leixing.text = currwaveModel.shuxing == "0" ? "" : currwaveModel.shuxing;
            //         if (!this.figttingEff) {
            //             this.figttingEff = new Animation("zhandouzhuangtai", -1, false);
            //             xuezhanitem.parent.addChild(this.figttingEff);
            //         }
            //         this.onupdateaward(currwaveModel.reward, currwaveModel.fightvalues);
            //         this.figttingEff.x = xuezhanitem.x + 70;
            //         this.figttingEff.y = xuezhanitem.y - Tool.toInt(monsterFightter.high * 0.8);
            //         this.figttingEff.onPlay();
            //     }
            // } else {
                // xuezhanitem.onreset();
                this.onupdateaward([], []);
            // }
            itemIndex++;
        }
        // this.xuezhan_buff_attr.text = "";
        // for (var i: number = 0; i < xuezhanInfo.attrAddRates.length; i++) {
        //     var addRateVaule: number = xuezhanInfo.attrAddRates[i];
        //     if (addRateVaule > 0) {
        //         this.xuezhan_buff_attr.text += GameDefine.Attr_Name[i] + "+" + addRateVaule + "%  ";
        //     }
        // }
        // if (this.xuezhan_buff_attr.text == "") {
        //     this.xuezhan_buff_attr.text = "无BUFF加成";
        // }
        this.xuezhan_lefttimes.text = "剩余复活次数：" + xuezhanInfo.reviveNum;
        //切换了新关卡
        // if (this.currWaveIndex != xuezhanInfo.xuezhanWaveNum) {
        //     if (this.currWaveIndex > 0) {
        //         this.onSildeItemHandler();
        //     } else {
        //         this.currWaveIndex = xuezhanInfo.xuezhanWaveNum;
        //         var curitemIndex: number = (this.currWaveIndex - 1) % GameDefine.Xuezhan_LayerWaveNum;
        //         for (var i: number = 0; i < this.xuezhanItemPos.length; i++) {
        //             curitemIndex = curitemIndex >= GameDefine.Xuezhan_LayerWaveNum ? 0 : curitemIndex;
        //             var xuezhanitem: XuezhanItem = this._owner["xuezhan_waveitem" + curitemIndex] as XuezhanItem;
        //             xuezhanitem.x = this.xuezhanItemPos[i].x;
        //             xuezhanitem.y = this.xuezhanItemPos[i].y;
        //             xuezhanitem.scaleX = i == 0 ? 1 : 0.6;
        //             xuezhanitem.scaleY = i == 0 ? 1 : 0.6;
        //             if (i == 0) {
        //                 (xuezhanitem.parent as egret.DisplayObjectContainer).setChildIndex(xuezhanitem, xuezhanitem.parent.numChildren);
        //             }
        //             curitemIndex++;
        //         }
        //     }
        // }

        this.updateAwardBoxStatus();
        this.onRegist();
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
        for (var i: number = 0; i < this.Xuezhan_Difficulty.length; i++) {
            var difficultyStr: string = this.Xuezhan_Difficulty[i];
            // GameCommon.getInstance().onButtonEnable((this._owner["btn_xuezhan_" + difficultyStr] as eui.Button), this.baoxiangStatus == 0);
        }
        // this.xuezhan_baoxiang.source = this.baoxiangStatus == 2 ? "" : "";
        // this.xuezhan_baoxiang.filters = this.baoxiangStatus == 0 ? [GameDefine.GaryColorFlilter] : null;
        if (this.baoxiangStatus == 2) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XuezhanBuffPanel");
        } else if (this.baoxiangStatus == 1) {
            var sweepAwardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
            sweepAwardNoticeParam.desc = `恭喜通关无量试练第${this.currLayerNum}层`;
            sweepAwardNoticeParam.titleSource = "";
            sweepAwardNoticeParam.btnlabel = "领取";
            sweepAwardNoticeParam.callFunc = this.onTouchBaoxiang;
            sweepAwardNoticeParam.callObj = this;
            // sweepAwardNoticeParam.itemAwards = ModelManager.getInstance().modelXuezhan[this.currLayerNum * GameDefine.Xuezhan_LayerWaveNum].clearReward;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", sweepAwardNoticeParam));
        }
    }
    private onupdateaward(wavereward: Array<AwardItem[]>, fightvalues: number[]): void {
        for (var i: number = 0; i < this.Xuezhan_Difficulty.length; i++) {
            var difficultyStr: string = this.Xuezhan_Difficulty[i];
            var awarditems: AwardItem[] = wavereward.length > i ? wavereward[i] : null;
            for (var awardIndex: number = 1; awardIndex <= this.AwardMaxNum; awardIndex++) {
                if (awarditems && awarditems.length >= awardIndex) {
                    var awarditem: AwardItem = awarditems[awardIndex - 1];
                    var thingModel: ModelThing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id);
                    // (this._owner["xuezhan_" + difficultyStr + "_awdname" + awardIndex] as eui.Label).text = thingModel.name;
                    // (this._owner["xuezhan_" + difficultyStr + "_awdicon" + awardIndex] as eui.Image).source = thingModel.dropicon;
                    // (this._owner["xuezhan_" + difficultyStr + "_awdnum" + awardIndex] as eui.Label).text = awarditem.num + "";
                } else {
                    // (this._owner["xuezhan_" + difficultyStr + "_awdname" + awardIndex] as eui.Label).text = "";
                    // (this._owner["xuezhan_" + difficultyStr + "_awdicon" + awardIndex] as eui.Image).source = null;
                    // (this._owner["xuezhan_" + difficultyStr + "_awdnum" + awardIndex] as eui.Label).text = "";
                }
                // if (fightvalues.length > i)
                    // (this._owner["xuezhan_zhanli_" + difficultyStr] as eui.Label).text = "推荐战力：" + (Tool.isNumber(fightvalues[i]) ? fightvalues[i] : 0);
                // else
                    // (this._owner["xuezhan_zhanli_" + difficultyStr] as eui.Label).text = "";
            }
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
        for (var i: number = 0; i < this.Xuezhan_Difficulty.length; i++) {
            var difficultyStr: string = this.Xuezhan_Difficulty[i];
            // (this._owner["btn_xuezhan_" + difficultyStr] as eui.Button).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeHandler, this);
        }
        // this.xuezhan_baoxiang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBaoxiang, this);
        this.btnSweep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodangHandler, this);
        // this.xuezhan_shop_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_REWARD_MESSAGE.toString(), this.updateAwardBoxStatus, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_BUFF_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE.toString(), this.onResDupSweepMsg, this);
    }
    protected onRemove(): void {
        // this.isRegist = false;
        for (var i: number = 0; i < this.Xuezhan_Difficulty.length; i++) {
            var difficultyStr: string = this.Xuezhan_Difficulty[i];
            // (this._owner["btn_xuezhan_" + difficultyStr] as eui.Button).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeHandler, this);
        }
        // this.xuezhan_baoxiang.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBaoxiang, this);
        this.btnSweep.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaodangHandler, this);
        // this.xuezhan_shop_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_REWARD_MESSAGE.toString(), this.updateAwardBoxStatus, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_BUFF_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XUEZHAN_SAODANG_MESSAGE.toString(), this.onResDupSweepMsg, this);
    }
    private onChallengeHandler(event: egret.Event): void {
        // var difficultyStr: string = event.currentTarget.name;
        // var difficultyIndex: number = this.Xuezhan_Difficulty.indexOf(difficultyStr) + 1;
        // GameFight.getInstance().onSendXuezhanFightMsg(difficultyIndex);
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
    private onResDupSweepMsg(msgEvent: GameMessageEvent = null): void {
        // this.onRefresh();
        var sweepAwardNoticeParam: AwardNoticeParam = new AwardNoticeParam();
        sweepAwardNoticeParam.desc = "扫荡成功获得以下奖励";
        sweepAwardNoticeParam.titleSource = "";
        sweepAwardNoticeParam.itemAwards = [];
        sweepAwardNoticeParam.callFunc = this.onRefresh;
        sweepAwardNoticeParam.callObj = this;
        var beforeWaveNum: number = this.currLayerNum * GameDefine.Xuezhan_LayerWaveNum;
        // var clearRewards: AwardItem[] = ModelManager.getInstance().modelXuezhan[beforeWaveNum].clearReward;
        // for (var n: number = 0; n < clearRewards.length; n++) {
        //     var awarditemobj: AwardItem = clearRewards[n];
        //     sweepAwardNoticeParam.itemAwards.push(awarditemobj);
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AwardNoticePanel", sweepAwardNoticeParam));
    }
    //The end
}
// class XuezhanItem extends eui.Component {
//     private monsterbody_group: eui.Group;
//     private monsterbody: Animation;
//     private wave_name_label: eui.Label;
//     public starnum: number;
//     public constructor() {
//         super();
//         this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
//         this.skinName = skins.XuezhanDupItemSkin;
//     }
//     private onLoadComplete(): void {
//     }
//     public onsetMonsterBody(monsterAvata): void {
//         if (!this.monsterbody) {
//             this.monsterbody = new Animation(monsterAvata + "_stand_1", -1, false, "1");
//             this.monsterbody.scaleX = 1.4;
//             this.monsterbody.scaleY = 1.4;
//             this.monsterbody_group.addChild(this.monsterbody);
//         } else {
//             this.monsterbody.onUpdateRes(monsterAvata + "_stand_1", -1);
//         }
//     }
//     public onUpdateStar(starnum: number): void {
//         this.starnum = starnum;
//         for (var i: number = 0; i < 3; i++) {
//             if (starnum > i)
//                 (this["star" + i] as eui.Image).source = "arene_star_open_png";
//             else
//                 (this["star" + i] as eui.Image).source = "arene_star_unopen_png";
//         }
//         if (this.monsterbody)
//             this.monsterbody.onPlay();
//     }
//     public updateWaveLabel(wavenum: number): void {
//         this.wave_name_label.text = `第${wavenum}关`;
//     }
//     public onreset(): void {
//         this.monsterbody.onDestroy();
//         this.monsterbody = null;
//         this.onUpdateStar(0);
//     }
//     //The end
// }