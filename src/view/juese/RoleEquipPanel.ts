// TypeScript file
class RoleEquipPanel extends BaseTabView {
    public powerbar: PowerBar;
    public role_avatar_img: eui.Image;
    public btn_loopAttr: eui.Image;
    public btn_clothAll: eui.Button;
    public sqBtn: eui.Button;
    public roleEquip_point: eui.Image;

    // protected points: redPoint[] = RedPointManager.createPoint(4);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.RoleEquipPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.createRedPoint().register(this.sqBtn, new egret.Point(70, 0), DataManager.getInstance().legendManager, "getAllCanLegendAdvance");
        this.onRefresh();
    }
    protected onRefresh(): void {
        //界面外形更新
        this.updateAvatarAnim();

        var equip: EquipInstance;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equipThing: EquipThing = this.getPlayerData().getEquipBySlot(i);
            equip = (this["equip_bar" + i] as EquipInstance);
            equip.onUpdate(equipThing, this.getPlayerData().getEquipSlotThings(i).quenchingLv);
            equip.forgeInfo = this.getPlayerData().getEquipSlotThings(i);
        }
        this.onupdateFightPower();
        this.onCheckEquipRedPoint();
        this.trigger();
    }
    private onupdateFightPower(): void {
        this.powerbar.power = this.getPlayerData().figthPower;
    }
    private updateAvatarAnim(): void {
        this.role_avatar_img.source = `login_create_preview${this.getPlayerData().sex}_png`;
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.updateAvatarAnim, this);
        GameDispatcher.getInstance().addEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.clothMsgUpdate, this);
        this.btn_loopAttr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLoopAttributes, this);
        this.btn_clothAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clothAllBestEquip, this);
        this.sqBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowSq, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_POWER_UPDATE, this.onupdateFightPower, this);
    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHION_SHOW_MESSAGE.toString(), this.updateAvatarAnim, this);
        GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.clothMsgUpdate, this);
        this.btn_clothAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clothAllBestEquip, this);
        this.btn_loopAttr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLoopAttributes, this);
        this.sqBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowSq, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.PLAYER_POWER_UPDATE, this.onupdateFightPower, this);
    }
    private clothMsgUpdate(event: egret.Event): void {
        var slotNum: number = event.data;
        var equipThing: EquipThing = this.getPlayerData().getEquipBySlot(slotNum);
        var equip: EquipInstance;
        equip = (this["equip_bar" + slotNum] as EquipInstance);
        equip.onUpdate(equipThing, this.getPlayerData().getEquipSlotThings(slotNum).quenchingLv);
        equip.forgeInfo = this.getPlayerData().getEquipSlotThings(slotNum);
        equip.onPlayClothAnim();

        this.onCheckEquipRedPoint();
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    //查看属性
    private onTouchLoopAttributes(e: egret.TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "AttributesPanel");
    }
    //刷新一下可穿戴列表
    private onCheckEquipRedPoint(): void {
        let _canClothEquips: EquipThing[] = DataManager.getInstance().bagManager.getJobClothEquips(0);
        for (let i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this["role_point" + i].visible = false;
        }
        for (let idx in _canClothEquips) {
            let equip: EquipThing = _canClothEquips[idx];
            if (this["role_point" + equip.model.part]) {
                this["role_point" + equip.model.part].visible = true;
            }
        }
        this.roleEquip_point.visible = _canClothEquips.length > 0;
    }
    public clothAllBestEquip(e: egret.TouchEvent) {
        DataManager.getInstance().bagManager.onClothEquipAll();
    }
    private onShowSq(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LegendMainView");
    }
    //The end
}