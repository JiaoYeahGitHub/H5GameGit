class LieMingUpLvPop extends BaseWindowPanel {
    private pop: eui.Group;
    private popBtn: eui.Button;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private btn3: eui.Button;
    private btn4: eui.Button;
    private btn5: eui.Button;
    private curFateData: FateBase;
    private curLv: number;
    private pinzhi1: number = 0;
    private pinzhi2: number = 0;
    private pinzhi3: number = 0;
    private pinzhi4: number = 0;
    private pinzhi5: number = 0;
    private curPinZhi: number = 0;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LieMingUpPopSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.popBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        for (var i: number = 1; i < 6; i++) {
            this['btn' + i].name = i;
            this['btn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTunShi, this);
        }

    }
    public onShowWithParam(param): void {
        this.curFateData = param;
        super.onShowWithParam(param);
    }
    protected onRemove(): void {
        super.onRemove();
        this.popBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        for (var i: number = 1; i < 6; i++) {
            this['btn' + i].name = i;
            this['btn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTunShi, this);
        }
    }
    protected onRefresh(): void {

        for (var h: number = 1; h < 6; h++) {
            this['pinzhi' + h] = 0;
        }
        this.upDatamodels();

    }
    private curMingGe: MingGeItem;
    private onTunShi(event: egret.Event): void {
        var name: string = (<eui.Button>event.target).name;
        if (this['pinzhi' + name] > 0) {
            this.curPinZhi = Number(name);
            if (Number(name) >= 3) {
                var quitNotice = [{ text: `紫色以上品质是否用来升级` }];
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                    new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onConfirm1, this))
                );
            }
            else {
                var allotMsg: Message = new Message(MESSAGE_ID.FATE_UPGRADE_MESSAGE);
                if (this.getPlayer().fates[this.curFateData.UID] && this.getPlayer().fates[this.curFateData.UID].exp == this.curFateData.exp && this.getPlayer().fates[this.curFateData.UID].lv == this.curFateData.lv && this.getPlayer().fates[this.curFateData.UID].slot == this.curFateData.slot) {
                    allotMsg.setByte(-1);
                    allotMsg.setInt(this.curFateData.UID)
                    DataManager.getInstance().fateManager.idEquip = false;
                }
                else {
                    allotMsg.setByte(0);
                    allotMsg.setInt(this.curFateData.slot-1);
                    DataManager.getInstance().fateManager.idEquip = true;
                }
                var ids: number[] = DataManager.getInstance().playerManager.player.onGetFatelvUp(this.curFateData, this.curPinZhi);
                allotMsg.setShort(ids.length)
                for (var i: number = 0; i < ids.length; i++) {
                    allotMsg.setInt(ids[i])
                }
                GameCommon.getInstance().sendMsgToServer(allotMsg);
            }
            this.onHide();

        }
    }
    private onConfirm1(): void {
        var allotMsg: Message = new Message(MESSAGE_ID.FATE_UPGRADE_MESSAGE);
        if (this.getPlayer().fates[this.curFateData.UID] && this.getPlayer().fates[this.curFateData.UID].exp == this.curFateData.exp && this.getPlayer().fates[this.curFateData.UID].lv == this.curFateData.lv && this.getPlayer().fates[this.curFateData.UID].slot == this.curFateData.slot) {

            allotMsg.setByte(-1);
            allotMsg.setInt(this.curFateData.UID)
            DataManager.getInstance().fateManager.idEquip = false;
        }
        else {
            allotMsg.setByte(0);
            allotMsg.setInt(this.curFateData.slot-1);
            DataManager.getInstance().fateManager.idEquip = true;
        }
        var ids: number[] = DataManager.getInstance().playerManager.player.onGetFatelvUp(this.curFateData, this.curPinZhi);
        allotMsg.setShort(ids.length)
        for (var i: number = 0; i < ids.length; i++) {
            allotMsg.setInt(ids[i])
        }
        GameCommon.getInstance().sendMsgToServer(allotMsg);
        this.onHide();
    }
    private upDatamodels(): void {
        var models: Modelmingge[];
        models = JsonModelManager.instance.getModelmingge()
        var i = 0;
        var fates: FateBase[] = DataManager.getInstance().playerManager.player.fates;
        for (let k in fates) {
            if (fates[k].modelID != this.curFateData.modelID) {
                switch (models[fates[k].modelID].pinzhi) {
                    case 1:
                        this.pinzhi1 = this.pinzhi1 + 1;
                        break;

                    case 2:
                        this.pinzhi2 = this.pinzhi2 + 1;
                        break;
                    case 3:
                        this.pinzhi3 = this.pinzhi3 + 1;
                        break;
                    case 4:
                        this.pinzhi4 = this.pinzhi4 + 1;
                        break;
                    case 5:
                        this.pinzhi5 = this.pinzhi5 + 1;
                        break;
                }
                i = i + 1;
            }
            else if (fates[k] && fates[k].exp != this.curFateData.exp || fates[k].lv != this.curFateData.lv || this.curFateData.slot != fates[k].slot) {
                switch (models[fates[k].modelID].pinzhi) {
                    case 1:
                        this.pinzhi1 = this.pinzhi1 + 1;
                        break;

                    case 2:
                        this.pinzhi2 = this.pinzhi2 + 1;
                        break;
                    case 3:
                        this.pinzhi3 = this.pinzhi3 + 1;
                        break;
                    case 4:
                        this.pinzhi4 = this.pinzhi4 + 1;
                        break;
                    case 5:
                        this.pinzhi5 = this.pinzhi5 + 1;
                        break;
                }
                i = i + 1;
            }
        }
        for (var h: number = 1; h < 6; h++) {
            this['btn' + h].label = 'X' + this['pinzhi' + h];
        }
    }
    private getPlayer() {
        return DataManager.getInstance().playerManager.player;
    }
}