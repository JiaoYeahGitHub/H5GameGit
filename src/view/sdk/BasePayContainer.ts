class BasePayContainer implements ISDKPayContainer {
    private owner;
    constructor(owner){
        this.owner = owner;
    }

    public showTips(msg: string): void {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), 
            new WindowParam("AlertDescUI", msg)
        );
    }

}