/**
 *
 * @author 
 *
 */
class MainVIew_btnBar extends BaseComp {
    public heroHp_probar: eui.ProgressBar;
    public btn_role: eui.RadioButton;
    public btn_forge: eui.RadioButton;
    public btn_bag: eui.RadioButton;
    public btn_xianlv: eui.RadioButton;
    public btn_huanling: eui.RadioButton;
    public btn_fenZheng: eui.RadioButton;
    public btnsbarGrp: eui.Group;
    public have_gift_img: eui.Group;
    public img_exr: eui.Image;

    constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.Main_BtnsPro;
    }
    public addToLayer(container: egret.DisplayObjectContainer): void {
        container.addChild(this);
    }
    public resize(): void {
        if (!DataManager.IS_PC_Game) {
            this.width = size.width;
        }
    }
    private onRegistGameEvent(): void {
        this.btn_role.addEventListener(egret.Event.CHANGE, this.onTouchRole, this);
        this.btn_bag.addEventListener(egret.Event.CHANGE, this.onTouchBag, this);
        this.btn_xianlv.addEventListener(egret.Event.CHANGE, this.onTouchRetinue, this);
        this.btn_forge.addEventListener(egret.Event.CHANGE, this.onTouchBtnforge, this);
        this.btn_huanling.addEventListener(egret.Event.CHANGE, this.onTouchBtnBless, this);
        this.btn_fenZheng.addEventListener(egret.Event.CHANGE, this.onShowFenZheng, this);

        GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onupdateExp, this);
        DataManager.getInstance().bagManager.onShowEquipBagIsFullTips();
    }
    private getHeroData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    //主界面初始化 当重新登录时 外部调用
    protected onInit(): void {
        this.onRegistGameEvent();
        //战斗力动画
        this.onupdateExp();
        this.addRedPoint();
        this.trigger();
    }
    protected points: redPoint[];// = RedPointManager.createPoint(6);
    private addRedPoint(): void {
        this.points = RedPointManager.createPoint(6);
        //角色红点
        this.points[0].register(this.btn_role, GameDefine.RED_MAIN_POS, this, "checkBtnRolePoint");
        this.points[1].register(this.btn_forge, GameDefine.RED_MAIN_POS, this, "getForgePointShow");
        this.points[2].register(this.btn_huanling, GameDefine.RED_MAIN_POS, this, "checkBtnBlessPoint");
        this.points[3].register(this.btn_xianlv, GameDefine.RED_MAIN_POS, this, "checkBtnRetinueBlessPoint");
        this.points[4].register(this.btn_bag, GameDefine.RED_MAIN_POS, this, "checkBtnBagPoint");
        this.points[5].register(this.btn_fenZheng, GameDefine.RED_MAIN_POS, this, "checkBtnFenZheng");
        // this.points[5].register(this.btn_jingjie, new egret.Point(110, 50), DataManager.getInstance().tianGongManager, "getMainBtnRedShow");
    }
    public trigger(): void {
        if(this.points){
            for (var i: number = 0; i < this.points.length; i++) {
                this.points[i].checkPoint();
            }
        }
    }
    private onTouchRole(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RolePanel");
    }
    private onTouchRetinue(e: egret.Event): void {
        if (FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_PET_LEVEL)) {
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PetMainPanel");
    }
    private onShowFenZheng(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "YewaiPVPPanel");
    }
    private onTouchBtnforge(e: egret.Event): void {
        if (FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_QIANGHUA)) {
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ForgePanel");
    }
    private onTouchBtnBless(e: egret.Event): void {
        if (FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_MOUNT)) {
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MagicMainViewPanel");
    }
    private onTouchBag(e: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "BagPanel");
    }
    //更新经验 人物等级
    private onupdateExp(event: egret.Event = null): void {
        var _isLevelUp: boolean;
        if (event == null) {
            _isLevelUp = true;
        } else {
            _isLevelUp = event.data;
        }

        if (_isLevelUp) {
            this.heroHp_probar.maximum = this.getHeroData().expMax;
        }
        this.heroHp_probar.value = this.getHeroData().exp;
    }
    private checkBtnRolePoint(): boolean {
        if (FunDefine.getTabRolePoint()) return true;
        if (DataManager.getInstance().skillManager.checkMainSkillUp()) return true;
        if (DataManager.getInstance().pulseManager.getCanPulseUpgrade()) return true;
        if (FunDefine.checkSixiangPoint()) return true;
        if (FunDefine.getWuxingRedPoint()) return true;
        if (FunDefine.checkTujianRedPointAll()) return true;
        if (FunDefine.getPsychPoint()) return true;
        return false;
    }
    private getForgePointShow():boolean{
        if(DataManager.getInstance().forgeManager.getForgePointShow())return true;
        if(DataManager.getInstance().magicManager, "checkMainXyPoint") return true;
        if(DataManager.getInstance().bagManager, "getAllRnuesPoint")return true;
        if(DataManager.getInstance().playerManager, "oncheckTianshuRP")return true;
        if(DataManager.getInstance().yuanjieManager, "checkRedPoint")return true;
        if(DataManager.getInstance().xiandanManager, "getXianShanAllPoint")return true;
        return false;
    }
    private checkBtnBlessPoint(): boolean {
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.HORSE)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.CLOTHES)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.WEAPON)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.WING)) return true;
        if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.MAGIC)) return true;
        return false;
    }
    private checkBtnRetinueBlessPoint(): boolean {
        // 锻造
        // if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.RETINUE_HORSE)) return true;
        // if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.RETINUE_CLOTHES)) return true;
        // if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.RETINUE_WEAPON)) return true;
        // if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.RETINUE_WING)) return true;
        // if (DataManager.getInstance().playerManager.checkBlessUPMain(BLESS_TYPE.MAGIC)) return true;
        	if (DataManager.getInstance().petManager.onCheckPetRedPoint()) return true;
        return false;
    }
    private checkBtnBagPoint(): boolean {
        if (DataManager.getInstance().bagManager.getEquipSmeltPointShow()) return true;
        if (DataManager.getInstance().bagManager.getItemCanUsePointShow()) return true;
        return false;
    }
    private checkBtnFenZheng(): boolean {
        if (DataManager.getInstance().yewaipvpManager.checkEncounterPoint()) return true;
        if (DataManager.getInstance().localArenaManager.getRedPointShow()) return true;
        if (DataManager.getInstance().arenaManager.getLadderPointShow()) return true;
        if (DataManager.getInstance().escortManager.getShowSysRedpoint()) return true;
        return false;
    }
    public resetButtonsStatus(): void {
        if (this.isLoaded) {
            for (let i: number = 0; i < this.btnsbarGrp.numChildren; i++) {
                let radiobtn: eui.RadioButton = this.btnsbarGrp.getChildAt(i) as eui.RadioButton;
                if (radiobtn) {
                    radiobtn.selected = false;
                }
            }
        }
    }
    //THE END
}