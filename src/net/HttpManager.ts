/**
 *
 * @author  
 * 
 */
class HttpManager {

    private gameWorld: GameWorld;
    private recvMsg: Message;
    private url: string;
    public constructor(world: GameWorld) {
        this.gameWorld = world;
        this.recvMsg = new Message();
        // this.url = SDKManager.loginInfo.url;
    }

    public reLogin(): void {
        this.url = SDKManager.loginInfo.url;//重置回登录服
        this.gameWorld.sendLogin();
    }

    public sendMessage(message: Message): void {
        if (message.getCmdId() != 100) {
            Tool.log("发送消息：" + message.getCmdId());
        }
        if (message.isCheckLoading) {
            // this.gameWorld.openLoading();
        }
        var request = new egret.HttpRequest();
        request["Message"] = message;
        request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
        request.open(this.url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "text/plain");
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        //request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
        message.pack();
        request.send(message.getMsg());
    }

    private onGetComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        this.recvMsg.recvData(request.response);
        var goodsAddMessage: Message = null;
        var goodsAddNum: number = 0;
        for (var i = 0; i < this.recvMsg.getMessageSize(); ++i) {
            var message: Message = new Message();
            var recvAryBuffer: ArrayBuffer = this.recvMsg.getMessage();
            if (!recvAryBuffer) break;
            message.unpack(recvAryBuffer);
            if (message.getCmdId() != 100) {
                Tool.log("接收消息：" + message.getCmdId());
            }
            //连续的物品增加的消息打包
            if (message.getCmdId() == MESSAGE_ID.GOODS_LIST_ADD_MESSAGE) {
                if (goodsAddMessage == null) {
                    goodsAddMessage = message;
                    goodsAddMessage.newGoodsMessage();
                } else {
                    goodsAddMessage.joinMessage(message);
                }
                ++goodsAddNum;
            }
            //非物品增加的消息时，立即处理
            else {
                if (goodsAddMessage != null) {
                    goodsAddMessage.setGoodsSize(goodsAddNum);
                    goodsAddMessage.readPos();
                    this.gameWorld.receiveMessage(goodsAddMessage);
                    goodsAddNum = 0;
                    goodsAddMessage = null;
                }
                this.gameWorld.receiveMessage(message);
            }
            // this.gameWorld.closeLoading(message);
        }
        //将未处理的物品增加的消息分发
        if (goodsAddMessage != null) {
            goodsAddMessage.setGoodsSize(goodsAddNum);
            goodsAddMessage.readPos();
            this.gameWorld.receiveMessage(goodsAddMessage);
            goodsAddNum = 0;
            goodsAddMessage = null;
        }
        this.onDestroyRequsetObj(request);
    }

    private onGetIOError(event: egret.IOErrorEvent): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var errorMsg: Message = request["Message"];
        if (errorMsg) {
            var errorEvent: egret.Event = new egret.Event(GameEvent.NET_EVENT_ERROR);
            errorEvent.data = errorMsg;
            this.gameWorld.dispatchGameEvent(errorEvent);
            egret.log("get error msgID: " + errorMsg.getCmdId());
        }
        // this.gameWorld.closeLoading();
        this.onDestroyRequsetObj(request);
    }

    private onDestroyRequsetObj(request: egret.HttpRequest): void {
        request.removeEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        request.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request = null;
    }

    private onGetProgress(event: egret.ProgressEvent): void {
        Tool.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }

    public setUrl(url: string) {
        this.url = url;
    }

    public sendRequest(url, message: Message) {
        //        request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
        //        request.open(this.url,egret.HttpMethod.POST);
        //        request.setRequestHeader("Content-Type","text/plain");
        //        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        //        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        //        message.pack();
        //        request.send(message.getMsg());
        var xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "text/plain");
        //        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                if (response) {
                    Tool.log(response);
                } else {
                    Tool.log("response str is null");
                }
            } else {
                Tool.log("xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207) is false ");
                Tool.log("xhr.readyState: " + xhr.readyState);
                Tool.log("xhr.status: " + xhr.status);
                Tool.log("param: " + message.getCmdId());
                Tool.log("=========================================");
            }
        }
        message.pack();
        xhr.send(message.getMsg());
    }
}
