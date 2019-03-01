class XianDanDupPanel extends BaseTabView {
    private progress: eui.ProgressBar;
    private bg: eui.Image;
    private dupGroup: eui.Group;
    private bossBtn: eui.Button;
    private promptPanel: eui.Image;
    private curDanLuProgress: eui.ProgressBar;
    private curGroup: eui.Group;
    private curDanLuPro: eui.Label;
    private btnchallenge: eui.Button;
    private btnPanels: eui.Group[];
    private btnListY: number[];
    private cupShanId: number;
    private scroller: eui.Scroller;
    private caoYaoPro: eui.Label;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.XianDanDupPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        var cfgs: Modelxianshan[] = DataManager.getInstance().xiandanManager.allCfg;
        this.progress.minimum = 0;
        this.progress.maximum = 30;
        this.curDanLuProgress.slideDuration = 0;
        // this.progress.labelDisplay.visible = false;
        this.caoYaoPro.visible = false;
        this.curDanLuProgress.minimum = 0;
        // this.promptPanel.visible = false;
        this.curGroup.visible = false;

        this.btnPanels = [];
        this.btnListY = [];
        for (var i = 0; i < 6; ++i) {
            let idx = i + 1;
            this.btnPanels[i] = this['btnPanel' + idx];
            this.btnListY[i] = this.btnPanels[i].y;
            if(cfgs[i]){
                (this['lbTitle' + idx] as eui.Label).text = cfgs[i].name;
                this.btnPanels[i].name = i.toString();
                this.btnPanels[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeDup, this);
            } else {
                this.btnPanels[i].visible = false;
            }
        }
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.onRefreshXianShan();
        let idx = this.cupShanId;
        let xianDanRolls: XianDanRollData[] = this.getPlayer().xianDanRolls;
        var cfgs: Modelxianshan[] = DataManager.getInstance().xiandanManager.allCfg;
        if(xianDanRolls[idx] && idx < 5 && xianDanRolls[idx].chouquNum >= cfgs[idx].times * cfgs[idx].max){
            idx += 1;
        }
        let mapPos = 2410 - this.scroller.height;
        let y = 0;
        switch (idx) {
            case 0:
                y = 0;
                break;
            case 1:
                y = 100;
                break;
            case 2:
                y = 780;
                break;
            case 3:
                y = 900;
                break;
            default:
                y = mapPos;
                break;
        }
        y = y > mapPos ? mapPos : y;
        this.scroller.viewport.scrollV = y;

        this.curDanLuProgress.slideDuration = 0;
        if(this.curGroup.parent != this.btnPanels[this.cupShanId]){
            this.curGroup.parent.removeChild(this.curGroup);
            this.btnPanels[this.cupShanId].addChild(this.curGroup);
        }
        this.curGroup.x = this.btnPanels[this.cupShanId].width / 2 - 100;
        this.curGroup.y = this.btnPanels[this.cupShanId].height - 50;
        
        this.onRefreshenergy();
        this.onRefreshBoss();
    }
    protected onRegist(): void {
        super.onRegist();
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.bossBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBossView, this);
        this.btnchallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBossView, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefresh, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefresh, this);
        //  GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_ROLL_MESSAGE.toString(), this.onRefreshXianShan, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PILL_HIDE_BOSS_MESSAGE.toString(), this.onRefreshBoss, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefreshenergy, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.XIANSHAN_REFRESH.toString(), this.onRefreshXianShan, this);
        for (var i = 0; i < this.btnPanels.length; ++i) {
            let disY = Tool.randomInt(0, 100) / 100;
            let time = 3000;
            let tw = egret.Tween.get(this.btnPanels[i], { loop: true });
            this.btnPanels[i].y = this.btnListY[i] - 40 * disY;
            if(Tool.randomInt(0, 100) > 50){
                tw.to({ y: this.btnListY[i] - 40 }, time * (1 - disY));
                tw.to({ y: this.btnListY[i] }, time);
                tw.to({ y: this.btnListY[i] - 40 * disY }, time * disY);
            } else {
                tw.to({ y: this.btnListY[i] }, time * disY);
                tw.to({ y: this.btnListY[i] - 40 }, time);
                tw.to({ y: this.btnListY[i] - 40 * disY }, time * (1 - disY));
            }
        }
    }
    protected onRemove(): void {
        super.onRemove();
        // this.bg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.bossBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBossView, this);
        this.btnchallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowBossView, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefresh, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_MESSAGE.toString(), this.onRefresh, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_ROLL_MESSAGE.toString(), this.onRefreshXianShan, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PILL_HIDE_BOSS_MESSAGE.toString(), this.onRefreshBoss, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ENERGY_MESSAGE.toString(), this.onRefreshenergy, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.XIANSHAN_REFRESH.toString(), this.onRefreshXianShan, this);
        for (var i = 0; i < this.btnPanels.length; ++i) {
            egret.Tween.removeTweens(this.btnPanels[i]);
        }
    }
    private onRefreshenergy(): void {
        this.progress.value = DataManager.getInstance().xiandanManager.energy;
        this.caoYaoPro.text = DataManager.getInstance().xiandanManager.energy + '/' + 30;
    }
    private onRefreshBoss(): void {
        // var cfgs: Modelxianshan[] = DataManager.getInstance().xiandanManager.allCfg;
        // var layer: number = DataManager.getInstance().xiandanManager.curLayer;
        // if (this.getPlayer().xianDanRolls[layer - 1]) {
        //     if (this.getPlayer().xianDanRolls[layer - 1].chouquNum >= (cfgs[layer - 1].times * cfgs[layer - 1].max)) {
        //         // this.promptPanel.visible = true;
        //     }
        // }
        // if (DataManager.getInstance().dupManager.allpeoplebossData.xianshanInfos.length > 0
        //     || DataManager.getInstance().xiandanManager.bossState > 0
        //     || DataManager.getInstance().xiandanManager.bossSize > 0) {
        //     this.bossBtn.visible = true;
        // } else {
        //     this.bossBtn.visible = false;
        // }
        this.bossBtn.visible = false;
    }
    private onChallenge(): void {
        // this.challengeDup(this.cupShanId);
    }
    private onShowBossView(): void {
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "XianShanBossView");
    }
    private onRefreshXianShan(): void {
        var cfgs: Modelxianshan[] = DataManager.getInstance().xiandanManager.allCfg;
        // this.promptPanel.visible = false;
        this.curGroup.visible = false
        let curLayer = DataManager.getInstance().xiandanManager.curLayer;
        let xianDanRolls: XianDanRollData[] = this.getPlayer().xianDanRolls;
        this.cupShanId = 0;
        if(curLayer > 0){
            this.cupShanId = curLayer - 1;
        }
        let openIdx = 0;
        for (var i: number = 0; i < 6; ++i) {
            if (this.cupShanId > i) {
                this.setShanState(i, 1);
            } else if (this.cupShanId == i){
                openIdx = i;
                this.setShanState(i, 2);
                this.curGroup.visible = true;
                this.curDanLuProgress.maximum = cfgs[i].times;
                if(xianDanRolls[i]){
                    if(xianDanRolls[i].chouquNum >= cfgs[i].times * cfgs[i].max){
                        openIdx = i + 1;
                        this.curDanLuPro.text = '悟性:Lv' + Math.floor(xianDanRolls[i].chouquNum / cfgs[i].times);// + '(' + this.getPlayer().xianDanRolls[i].chouquNum % cfgs[i].times + '/' + cfgs[i].max + ')';
                    } else {
                        this.curDanLuPro.text = '悟性:Lv' + Math.floor(xianDanRolls[i].chouquNum / cfgs[i].times);
                    }
                    this.curDanLuProgress.value = xianDanRolls[i].chouquNum % cfgs[i].times;
                } else {
                    this.curDanLuPro.text = '悟性:Lv0';
                    this.curDanLuProgress.value = 0;
                }
            } else {
                this.setShanState(i, i == openIdx ? 1 : 0);
            }
        }
    }
    private setShanState(idx: number, type: number){// 0-关闭，1-开启，2-炼丹
        Tool.setDisplayGray(this.btnPanels[idx], type == 0);
    }
    private startX: number = 0;
    private startY: number = 0;
    private isDrag: boolean = true;
    private touchBeginHandler(event: egret.TouchEvent) {
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchEndHandler, this)
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEndHandler, this);
        this.isDrag = true;
        this.startX = event.localX;
        this.startY = event.localY;
    }
    private touchMoveHandler(event: egret.TouchEvent) {
        var stepX: number = event.localX - this.startX;
        if (event.localX - this.startX > 4 || event.localX - this.startX < -4) {
            this.isDrag = false;
        }
        if (event.localY - this.startY > 4 || event.localY - this.startY < -4) {
            this.isDrag = false;
        }
    }
    private touchEndHandler(event: egret.TouchEvent) {
        this.startX = event.localX;
        if (this.startX != event.localX || this.startY != event.localY)
            return;
        this.isDrag = true;
    }
    private challengeDup(event: egret.Event): void {
        this.isDrag = false;
        var idx: number = Number(event.target.name);
        if (DataManager.getInstance().xiandanManager.curLayer > idx) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("XianDanDupView", idx));
        } else if (idx == DataManager.getInstance().xiandanManager.curLayer) {
            if (this.getPlayer().xianDanRolls[idx - 1]) {
                if (this.getPlayer().xianDanRolls[idx - 1].chouquNum >= (DataManager.getInstance().xiandanManager.allCfg[idx - 1].times * DataManager.getInstance().xiandanManager.allCfg[idx - 1].max)) {
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("XianDanDupView", idx));
                    return;
                }else {
                    GameCommon.getInstance().addAlert("上一仙炉未炼制到满级!");
                    return;
                }

            }
            // else if (idx - 1 == 0) {
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("XianDanDupView", idx));
            //     return;
            // }
            GameCommon.getInstance().addAlert("上一仙炉未炼制到满级!");
            return;

        }
        else {
            GameCommon.getInstance().addAlert("上一仙炉未炼制到满级!");
            return;
        }
    }
    private getPlayer() {
        return DataManager.getInstance().playerManager.player;
    }
    //The end
}