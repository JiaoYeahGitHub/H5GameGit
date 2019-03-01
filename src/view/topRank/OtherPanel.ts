class OtherPanel extends BaseSystemPanel {
    // private tabkeyAry: string[] = ["skill", "chengzhuang", "jingmai", "shentong", "coatard", "chenghao"];

    // private showHeroBody: PlayerBody;

    // private powerbar: PowerBar;

    // public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        var sysQueue = [];
        var param = new RegisterSystemParam();
        param.sysName = "OtherplayerDate";
        param.btnRes = "角色";
        // param.redP = new redPoint(RADPOINT_TYPE.MASTER_EQUIP, RADPOINT_PRIORITY.PRIORITY_SYS_BRANCH, "role", "skill");
        sysQueue.push(param);


        // param = new RegisterSystemParam();
        // param.sysName = "OtherjingmaiPanel";
        // param.btnRes = "juese_tab_jingmai_png";
        // sysQueue.push(param);


        this.registerPage(sysQueue, "roleGrp");
        super.onInit();
        this.onRefresh();

    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onRefresh(): void {
        switch (this.index) {
            case 0:
                this.setTitle("角色");
                break;
            case 1:
                this.setTitle("");
                break;
            case 2:
                this.setTitle("pulse_title_png");
                break;
            case 3:
                this.setTitle("pulse_title_png");
                break;
        }
        super.onRefresh();
    }

    protected onRegist(): void {
        super.onRegist();

        //this[btntabkey].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
        // this.btn_horse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHorse, this);
        // this.btn_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnforge, this);
        // this.btn_legend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnLegend, this);
        // this.btn_psych.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPsych, this);
    }
    protected onRemove(): void {
        super.onRemove();

        //  this[btntabkey].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTabBtn, this);
        // this.btn_horse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHorse, this);
        // this.btn_forge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnforge, this);
        // this.btn_legend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnLegend, this);
        // this.btn_psych.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPsych, this);
    }

    private onTouchTabBtn(event: egret.Event): void {
        var tabname: string = event.currentTarget.name;
        // switch (tabname) {
        //     case this.tabkeyAry[0]:
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherSkillPanel");
        //         break;
        //     case this.tabkeyAry[1]:
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherOrangePanel");
        //         break;
        //     case this.tabkeyAry[2]:
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherPulsePanel");
        //         break;
        //     case this.tabkeyAry[3]:
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherSTMainPanel");
        //         break;
        //     case this.tabkeyAry[4]:
        //         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "OtherCoatardPanel");
        //         break;
        //     case this.tabkeyAry[5]:
        //         GameCommon.getInstance().addAlert("功能暂未开启，敬请期待");
        //         break;
        // }
    }
}