class BaseGiftContainer implements ISDKGiftContainer {
    //private owner;
    constructor(){
        //this.owner = owner;
    }

    public showTips(gift): void {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), 
            new WindowParam("WanbaGiftPanel", gift)
        );
    }

}