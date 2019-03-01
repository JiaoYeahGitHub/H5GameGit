class MagicGodZhuangPanel extends BaseTabView {
    public basicPanel: MagicBasicPanel;
    public animLayer: eui.Group;

    private animRecords: MagicPosInfo[];
    private data: EquipSlotThing;
    private modeled: Modelqianghua;
    private okAnim: Animation;
    protected points: redPoint[] = RedPointManager.createPoint(1);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.MagicGodZhuangPanelSkin;
    }
    protected onInit(): void {
        this.animRecords = [];
        var _record: MagicPosInfo;
        var infySlot: MagicSlot;
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            infySlot = (this.basicPanel[`star${i}`] as MagicSlot);
            infySlot.slotType = i;
            _record = new MagicPosInfo(infySlot.x, infySlot.y, infySlot.scaleX, infySlot.parent.getChildIndex(infySlot));
            this.animRecords.push(_record);
        }

        let manager: BlessManager = DataManager.getInstance().blessManager;
        this._BlessData = manager.getPlayerBlessData(this.owner.tab);
        // this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        super.onInit();
        this.resetPos();
        this.onRefresh();
    }
    private index = 0;
    private get blessFuncType(): FUN_TYPE {
        switch (this.owner.tab) {
            case BLESS_TAB_TYPE.LINGSHOU:
                return FUN_TYPE.FUN_MOUNT;
            case BLESS_TAB_TYPE.SHENZHUANG:
                return FUN_TYPE.FUN_SHENZHUANG;
            case BLESS_TAB_TYPE.SHENGBING:
                return FUN_TYPE.FUN_SHENBING;
            case BLESS_TAB_TYPE.XIANYU:
                return FUN_TYPE.FUN_XIANYU;
            case BLESS_TAB_TYPE.GUANGHUAN:
                return FUN_TYPE.FUN_FABAO;
        }
        return 0;
    }
    protected onRegist(): void {
        super.onRegist();
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);

    }
    protected onRemove(): void {
        super.onRemove();
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_ACTIVE_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.upHandler, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_UPLEVEL_MESSAGE.toString(), this.upHandler, this);
    }
    protected onRefresh(): void {
        this.onRefreshUpGrade();
    }
    public trigger(): void {
        super.trigger();
        if (this.basicPanel) {
            this.basicPanel.trigger();
        }
    }
    private onAnimPlayEnd(): void {
        if (this.okAnim) {
            this.okAnim.visible = false;
        }
    }
    private resetPos() {
        var recordInfo: MagicPosInfo;
        var infySlot: MagicSlot;
        var curr = this._BlessData.level;
        var param = GameDefine.Equip_Slot_Num + curr;
        for (var i = curr; i < param; i++) {
            infySlot = (this.basicPanel[`star${i >= GameDefine.Equip_Slot_Num ? i - GameDefine.Equip_Slot_Num : i}`] as MagicSlot);
            infySlot.currCircleIndex = i - curr;
            recordInfo = this.animRecords[infySlot.currCircleIndex];
            infySlot.x = recordInfo.posX;
            infySlot.y = recordInfo.posY;
            infySlot.scaleX = recordInfo.scale;
            infySlot.scaleY = recordInfo.scale;
            infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
            if (i == curr) {
                infySlot.selected = true;
            } else {
                infySlot.selected = false;
            }
        }
    }
    private isPlay: boolean = false;
    private playedNum: number = 0;
    private play(): void {
        this.isPlay = true;
        let curr = this._BlessData.level;
        let currIndex: number = this.getNowIntensifyEquip();
        let offset: number = 1;
        let recordInfo: MagicPosInfo;
        let param = GameDefine.Equip_Slot_Num + currIndex;
        let infySlot: MagicSlot;
        this.playedNum = 0;

        for (let j = currIndex; j < param; j++) {
            infySlot = (this.basicPanel[`star${j >= GameDefine.Equip_Slot_Num ? j - GameDefine.Equip_Slot_Num : j}`] as MagicSlot);
            infySlot.currCircleIndex = j - currIndex - offset >= 0 ? j - currIndex - offset : GameDefine.Equip_Slot_Num - offset - (j - currIndex);
            recordInfo = this.animRecords[infySlot.currCircleIndex];
            infySlot.selected = false;
            egret.Tween.get(infySlot).to({}, 100).to({ x: recordInfo.posX, y: recordInfo.posY, scaleX: recordInfo.scale, scaleY: recordInfo.scale }, 150, egret.Ease.sineIn).call(this.playDone, this);
            infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
        }
    }
    private playDone() {
        this.playedNum += 1;
        if (this.playedNum == GameDefine.Equip_Slot_Num) {//一轮搞定
            var currIndex: number = this.getNowIntensifyEquip();
            if (currIndex == this._BlessData.level) {//移动完成
                this.isPlay = false;
                this.data = this.getPlayerData().getEquipSlotThings(this._BlessData.level);
                for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
                    var equip: MagicSlot = (this.basicPanel[`star${i}`] as MagicSlot);
                    if (equip.currCircleIndex == 0) {//找到现在培养位置装备
                        equip.selected = true;
                        break;
                    }
                }

                this.basicPanel['avatar_grp'].parent.setChildIndex(this.basicPanel['avatar_grp'], 9)
                // this.showIntensify(this.getPlayerData().currIntensify.slot);
            } else {
                this.play();
            }
        }
    }
    private getNowIntensifyEquip(): number {
        var equip: MagicSlot;
        var currIndex: number = 0;
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this.basicPanel[`star${i}`] as MagicSlot);
            if (equip.currCircleIndex == 0) {//找到现在培养位置装备
                currIndex = i;
                break;
            }
        }
        return currIndex;
    }
    private upHandler(event: GameMessageEvent): void {
        var before: number = this._BlessData.level - 1;
        if (before == -1) {
            before = GameDefine.Equip_Slot_Num - 1;
        }
        var currIndex: number = this.getNowIntensifyEquip();
        if (currIndex != this._BlessData.level) {
            if (!this.okAnim) {
                this.okAnim = new Animation("zhuangbeiqianghua", 1, false);
                this.okAnim.x = 308;
                this.okAnim.y = 415;
                this.animLayer.addChild(this.okAnim);
            } else {
                this.okAnim.visible = true;
                this.okAnim.playNum = 1;
            }
            this.okAnim.playFinishCallBack(this.onAnimPlayEnd, this);

            if (!this.isPlay) {
                this.play();
            }
        }
        this.onRefreshUpGrade();
    }
    private _BlessData: BlessData;
    protected onRefreshUpGrade(): void {
        this.basicPanel.onUpdate(this.owner.tab, this.blessFuncType)
        this.basicPanel.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.owner.tab);
    }
    private get manager(): PlayerManager {
        return DataManager.getInstance().playerManager;
    }
    private getPlayerData(): PlayerData {
        return this.manager.player.getPlayerData();
    }

    private updateGoodsADD() {
        this.basicPanel.updateGoodsADD();
    }
}



class MagicSlot extends eui.Component {
    private slot_icon_img: eui.Image;
    private selectLayer: eui.Group;
    /**通用**/
    public currCircleIndex: number;
    /**自用**/
    private _slottype: MASTER_EQUIP_TYPE;
    private selectedAnim: Animation;
    private slotName: eui.Label;
    public constructor() {
        super();
    }
    public set slotType(value: number) {
        if (this._slottype != value) {
            this._slottype = value;
            this.slot_icon_img.source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this._slottype] + "_png";
        }
    }


    public set labName(bl: string) {
        this.slotName.text = bl;
    }
    public set selected(bl: boolean) {
        this.selectLayer.visible = bl;
        if (bl) {
            if (!this.selectedAnim) {
                this.selectedAnim = new Animation("gonghuijineng_1", -1);
                this.selectedAnim.scaleX = 0.85;
                this.selectedAnim.scaleY = 0.85;
                this.selectedAnim.y = -30;
                this.selectLayer.addChild(this.selectedAnim);
            }
            this.selectedAnim.onPlay();
        } else {
            if (this.selectedAnim) {
                this.selectedAnim.onStop();
            }
        }
    }
    //The end
}
class MagicPosInfo {
    public posX: number;//X位置
    public posY: number;//Y位置
    public scale: number;//缩放
    public childNum: number;//层级
    public constructor(x: number, y: number, scale: number, childNum: number = -1) {
        this.posX = x;
        this.posY = y;
        this.scale = scale;
        this.childNum = childNum;
    }
}