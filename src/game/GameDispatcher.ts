class GameDispatcher extends egret.DisplayObjectContainer {
    private static instance: GameDispatcher;
    private eventDispatcher: egret.EventDispatcher;
    public constructor() {
        super();
        this.eventDispatcher = new egret.EventDispatcher(null);
    }

    public static getInstance(): GameDispatcher {
        if (this.instance == null) {
            this.instance = new GameDispatcher();
        }
        return this.instance;
    }

    public dispatchEvent(event: egret.Event, data = null): boolean {
        event.data = data;
        return (this.eventDispatcher.dispatchEvent(event));
    }

    public hasEventListener(eventType: string): boolean {
        return (this.eventDispatcher.hasEventListener(eventType));
    }

    public willTrigger(eventType: string): boolean {
        return (this.eventDispatcher.willTrigger(eventType));
    }

    public removeEventListener(type: string, listener: Function, thisObject, useCapture: boolean = false) {
        this.eventDispatcher.removeEventListener(type, listener, thisObject, useCapture);
    }

    public addEventListener(type: string, listener: Function, thisObject, useCapture: boolean = false, priority: number = 0) {
        this.eventDispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
    }
    //The end
}