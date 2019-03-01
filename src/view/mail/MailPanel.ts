// TypeScript file
class MailPanel extends BaseSystemPanel {
    public sysQueue: RegisterSystemParam[];
    protected points: redPoint[] = RedPointManager.createPoint(3);
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        var param = new RegisterSystemParam();
        param.sysName = "MailTypePanel";
        param.btnRes = "邮件";
        param.title = "mail_title_png";
        param.redP = this.points[0];
        sysQueue.push(param);

        var param = new RegisterSystemParam();
        param.sysName = "FriendListPanel";
        param.btnRes = "好友";
        param.title = "friend_title_png";
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "FriendApplyPanel";
        param.btnRes = "查找";
        param.title = "friend_title_png";
        param.redP = this.points[1];
        param.redP.addTriggerFuc(DataManager.getInstance().friendManager, "checkFriendRedPoint");
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "FriendBlackList";
        param.btnRes = "黑名单";
        param.title = "friend_title_png";
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "FriendListChatPanel";
        param.btnRes = "私聊";
        param.title = "friend_title_png";
        param.redP = this.points[2];
        param.redP.addTriggerFuc(DataManager.getInstance().chatManager, "onCheckPrivateChatRedPoint");
        sysQueue.push(param);
        this.sysQueue = sysQueue;
        this.registerPage(sysQueue, "bagGrp", GameDefine.RED_TAB_POS);
        super.onInit();

        this.onRefresh();
    }
    protected onRefresh(): void {
        super.onRefresh();
        this.setTitle(this.sysQueue[this.index].btnRes);
    }
    protected onRegist(): void {
        super.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    //The end
}
