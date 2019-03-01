/**
 * @author Keith Zhang
 * @description 相思互助
 * @date 2018年11月15日
 * @version 1.0
 */   
class MarryCooperationPanel extends BaseWindowPanel {
	
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    protected points: redPoint[] = RedPointManager.createPoint(1);

    private descLabel:eui.Label
    private accessBtn:eui.Button

	public constructor(owner) {
        super(owner);
    }

	protected onSkinName(): void {
        this.skinName = skins.MarryCooperationPanelSkin;
    }

    protected onRegist(){
        this.accessBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.accessBtnClick,this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this)
    }

    protected onRemove(){   
        this.accessBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.accessBtnClick,this)
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHide,this)
    }

    protected onInit(){
        super.onInit()
        this.onRefresh()

        this.points[0].register(this.accessBtn, GameDefine.RED_BTN_POS, DataManager.getInstance().marryManager, "checkMarryCooperationPoint");
    }

    protected onRefresh(){
        if(this.player.marriedTreeExp>0){
            this.descLabel.text = `您的伴侣为您提供了${this.player.marriedTreeExp}点相思树经验，为您的相思树浇注升级带来了满满的爱意，快快领取吧，不要忘记回馈对方，相扶到老不容易！`
            this.accessBtn.label = '领取'

        }else{
            this.descLabel.text = '目前您的伴侣还未对您的相思树提供经验，也许是他（她）忘记了，快先去用铜婚精华、银婚精华或者金婚精华为他的相思树带去满满爱意吧！'
            this.accessBtn.label = '关闭'
        }
        this.trigger()
    }

    private accessBtnClick(){
        if(this.player.marriedTreeExp>0){
            GameCommon.getInstance().sendMsgToServer(new Message(MESSAGE_ID.MARRIAGE_TREE_EXP_RECEIVE_MESSAGE))
        }
        this.onHide()
    }

    private get player():Player{
        return DataManager.getInstance().playerManager.player
    }
}