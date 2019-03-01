// TypeScript file
class DupPanel extends BaseSystemPanel {
    protected funcID: number = FUN_TYPE.FUN_DUP_CAILIAO;

    protected points: redPoint[] = RedPointManager.createPoint(5);
    private sysQueues: RegisterSystemParam[];
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        var param = new RegisterSystemParam();
        param.sysName = "CailiaoDupView";
        param.btnRes = "材料";
        param.funcID = FUN_TYPE.FUN_DUP_CAILIAO;
        param.subFuncIDs = [FUN_TYPE.FUN_BAOSHIFUBEN, FUN_TYPE.FUN_JINGMAIFUBEN, FUN_TYPE.FUN_CUILIANFUBEN, FUN_TYPE.FUN_CHONGFUBEN];
        param.redP = this.points[0];
        param.redP.addTriggerFuc(FunDefine, "DupCailiaoHasTimes");
        sysQueue.push(param);

        var param = new RegisterSystemParam();
        param.sysName = "ChallengeDupView";
        param.btnRes = "挑战";
        param.funcID = FUN_TYPE.FUN_DUP_TIAOZHAN;
        param.redP = this.points[1];
        param.redP.addTriggerFuc(FunDefine, "DupChallengeHasTimes");
        sysQueue.push(param);

        var param = new RegisterSystemParam();
        param.sysName = "BlessDupView";
        param.btnRes = "法宝";
        param.funcID = FUN_TYPE.FUN_DUP_ZHUFU;
        param.redP = this.points[2];
        param.redP.addTriggerFuc(FunDefine, "BlessDupRedPoint");
        sysQueue.push(param);

        var param = new RegisterSystemParam();
        param.sysName = "TeamDupView";
        param.btnRes = "组队";
        param.funcID = FUN_TYPE.FUN_DUP_ZUDUI;
        param.redP = this.points[3];
        param.redP.addTriggerFuc(FunDefine, "getDupHasTimes", DUP_TYPE.DUP_TEAM);
        sysQueue.push(param);

        var param = new RegisterSystemParam();
        param.sysName = "SixiangDupView";
        param.btnRes = "四象";
        param.funcID = FUN_TYPE.FUN_DUP_SIXIANG;
        param.redP = this.points[4];
        param.redP.addTriggerFuc(FunDefine, "SixiangDupRedPoint");
        sysQueue.push(param);

        this.registerPage(sysQueue, "dupGrp", GameDefine.RED_TAB_POS);
        this.sysQueues = sysQueue;
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        //this.setTitle(this.sysQueues[this.index].btnRes + "副本");
        switch (this.index) {
            case 0:
                this.setTitle("材料本");
                break;
            case 1:
                this.setTitle("挑战本");
                break;
            case 2:
                this.setTitle("法宝本");
                break;
            case 3:
                this.setTitle("组队本");
                break;
            case 4:
                this.setTitle("四象本");
                break;
        }
        super.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    //请求副本的信息
    public onRequestDupInofMsg(duptype: DUP_TYPE): void {
        DataManager.getInstance().dupManager.onRequestDupInofMsg(duptype);
    }
    //The end
}