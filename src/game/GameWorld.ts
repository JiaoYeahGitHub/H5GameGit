/**
 * 
 * @author 
 * 
 */
class GameWorld extends egret.DisplayObjectContainer {
    public stage: egret.Stage;

    private state: GAME_STATE = GAME_STATE.GAME_STATE_LOGIN;

    public httpManager: HttpManager;

    private messageReceive: MessageReceive;
    private requestManager: RequestManager;

    private gamescene: MainScene;

    private sceneLayer: egret.DisplayObjectContainer;
    private promptLayer: egret.DisplayObjectContainer;

    private LoginSuccsess: boolean = false;//登录成功
    private isloginin: boolean = false;

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.onRegistEvent();
        this.init();
    }

    private onRegistEvent(): void {
        this.addEventListener(GameEvent.NET_EVENT_ERROR, this.netErrorHandler, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SDK_LOGIN_OK, this.onSDKLoginSuccess, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_SDK_LOGIN_FAIL, this.onSDKLoginFail, this);

        this.startLoadingConfig();
    }

    private init(): void {
        //初始化SDK
        SDKManager.init();

        this.httpManager = new HttpManager(this);
        let infoUrl: string = SDKManager.loginInfo.url;
        this.httpManager.setUrl(infoUrl + '/');
        SDKManager.loginInfo.url = ChannelDefine.getUrl(SDKManager.loginInfo.channel);

        this.messageReceive = new MessageReceive(this);
        this.requestManager = new RequestManager(this);
        this.requestManager.start();
        this.gamescene = new MainScene(this);

        GameCommon.getInstance().setGameWorld(this);

        //场景层
        this.sceneLayer = new egret.DisplayObjectContainer();
        //提示层
        this.promptLayer = new egret.DisplayObjectContainer();
        this.addChild(this.sceneLayer);
        this.addChild(this.promptLayer);
        this.promptLayer.addChild(PromptPanel.getInstance());
        this.onResize();
    }
    /**舞台尺寸发生变化**/
    public onResize(): void {
        this.promptLayer.x = Globar_Pos.x;
        if (DataManager.IS_PC_Game) {
            try {
                this.gamescene.getModuleLayer().onStageResize();
                this.gamescene.getMapLayer().onResizeLayer();
            } catch (e) {
            }
        }
    }

    private onAddToStage(event: egret.Event): void {
        if (this.state == GAME_STATE.GAME_STATE_LOGIN) {
            this.startGame();
        } else {
            this.enterGame();
        }
    }

    public startGame() {
        this.state = GAME_STATE.GAME_STATE_LOGIN;
        this.createGameScene();
    }
    public loginServer(): void {
        this.state = GAME_STATE.GAME_STATE_SERVER;
        this.createGameScene();
    }
    public createRole(): void {
        this.state = GAME_STATE.GAME_STATE_CREATE;
        this.createGameScene();
    }
    public enterGame(): void {
        if (this.LoginSuccsess) {
            this.sendEnterGameMsg();
        } else {
            this.state = GAME_STATE.GAME_STATE_PLAY;
            this.createGameScene();
        }
    }
    public reciveEnterGameMsg(): void {
        this.isloginin = false;
        if (this.LoginSuccsess) {
            this.gamescene.onReloadMainScene();
            if (!this.gamescene.parent) {
                this.sceneLayer.removeChildren();
                this.sceneLayer.addChild(this.gamescene);
            }
        } else {
            this.onGameloadGroupLoading();
        }
    }

    public loginRecord(player: Player) {
        if (SDKManager.loginInfo.channel == EChannel.CHANNEL_WXGAMEBOX) {
            var info = SDKManager.loginInfo;
            var data = {
                account: info.account,
                channelId: info.channel,
                subChannel: info.subChannel,
                platform: info.platform,
                createTime: player.createTime,
                playerId: player.id,
                serverId: info.serverId
            }
            SDKManager.loginInfo.url
            var checkUserUrl = SDKManager.loginInfo.url + "/LOGIN";
            HttpUtil.sendPostStringRequest(checkUserUrl, null, this, JSON.stringify(data));
        }
    }

    public sendEnterGameMsg(): void {
        var info = SDKManager.loginInfo;

        let message: Message = new Message(MESSAGE_ID.ENTER_GAME_MESSAGE);
        message.setShort(info.channel);
        message.setShort(info.subChannel);
        message.setString(info.account);
        message.setShort(info.serverId);
        message.setByte(info.platform);
        message.setString(info.adFrom ? info.adFrom.adFrom : "");
        message.setString(info.adFrom ? info.adFrom.spid : "");

        this.requestManager.addMessage(message);
    }
    // public onShowFakerLoadBar(text: string = "", proNum: number = 0): void {
    //     if (this.LoginSuccsess) {
    //         return;
    //     }
    //     GameLoadingUIByGroup.getInstance().onInputLoadText(text);
    //     GameLoadingUIByGroup.getInstance().onShow(this.sceneLayer);
    //     GameLoadingUIByGroup.getInstance().bar.value = proNum;
    // }
    //启动进度条假跑动画
    private loadingFakerPro: number = 0;
    private onStartLoadFakerAction(): void {
        this.loadingFakerPro = 0;
        GameLoadingUIByGroup.getInstance().bar.value = 0;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onLoadingEnterFrame, this);
    }
    private onLoadingEnterFrame(e: egret.Event): void {
        if (this.loadingFakerPro < 95) {
            this.loadingFakerPro += 10;
        } else {
            this.loadingFakerPro += 0;
        }
        GameLoadingUIByGroup.getInstance().bar.value = this.loadingFakerPro;
    }
    //关闭进度条假跑
    private onCloseLoadFakerAction(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onLoadingEnterFrame, this);
    }

    private createGameScene(): void {
        this.sceneLayer.removeChildren();
        switch (this.state) {
            case GAME_STATE.GAME_STATE_LOGIN:
                var gameLogin = new GameLogin(this);
                if (DataManager.IS_PC_Game) {
                    gameLogin.x = Globar_Pos.x;
                }
                this.sceneLayer.addChild(gameLogin);
                break;
            case GAME_STATE.GAME_STATE_SERVER:
                var selectServer = new SelectServer(this);
                if (DataManager.IS_PC_Game) {
                    selectServer.x = Globar_Pos.x;
                }
                this.sceneLayer.addChild(selectServer);
                SDKManager.onCompleteSDK();
                break;
            case GAME_STATE.GAME_STATE_CREATE:
                var createRole = new CreateRole(this);
                if (DataManager.IS_PC_Game) {
                    createRole.x = Globar_Pos.x;
                }
                this.sceneLayer.addChild(createRole);
                break;
            case GAME_STATE.GAME_STATE_PLAY:
                this.promptLayer.visible = false;
                GameLoadingUIByGroup.getInstance().onShow(this.sceneLayer);
                GameLoadingUIByGroup.getInstance().playRoleEnter();

                this.onReadConfigZip();
                GameDispatcher.getInstance().addEventListener(GameEvent.GAME_JSON_PARSE_OK, this.readConfigZipComplete, this);
                this.onStartLoadFakerAction();
                break;
        }
    }

    public onGameloadGroupLoading(): void {
        // SDKEgretadsa.getInstance().loadingSetAccount(GAMECOUNT_TYPE.LOAD_RESGROUP, `加载主界面`);
        //预加载资源
        let initloadImgs: string[] = [];
        let initResUrls: string[] = this.getInitLoadURLList();
        GameLoadingUIByGroup.getInstance().onInputLoadText("正在努力载入游戏资源，快给程序哥哥加个鸡腿！");
        GameLoadingUIByGroup.getInstance().onstartLoad("gameload", this.onGameloadGroupLoaded, this, initloadImgs, initResUrls, 0, 100);
    }
    public onGameloadGroupLoaded(): void {
        // this.gameloadgroupLoaded = true;
        GameLoadingUIByGroup.getInstance().onInputLoadText("资源载入成功！载入游戏场景中，为您开启全新仙侠世界！");
        GameDispatcher.getInstance().addEventListener(GameEvent.SCENE_ENTER_SUCCESS, this.onEnterMainScene, this);
        this.gamescene.onStarGame();
    }

    private onEnterMainScene(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.SCENE_ENTER_SUCCESS, this.onEnterMainScene, this);
        this.sceneLayer.addChild(this.gamescene);
        GameLoadingUIByGroup.getInstance().close();
        this.LoginSuccsess = true;
        this.promptLayer.visible = true;
        GameLoadingUIByGroup.getInstance().destoryPlayerEnter();
        LoadManager.getInstance().removeloadAllUIImage();
        this.gamescene.onInitRequestMsg();
    }

    public sendMessage(message: Message): void {
        if (!this.isloginin) {
            this.requestManager.addMessage(message);
        }
    }

    public receiveMessage(message: Message): void {
        this.messageReceive.receiveMessage(message);
    }

    public dispatchGameEvent(event: egret.Event): void {
        super.dispatchEvent(event);
    }

    public setUrl(host: string, post: number) {
        let urlStr: string = "";
        if (platform.isLocalTest()) {
            urlStr = host + ":" + post;
            if (Tool.isIPUrl(host)) {
                urlStr = "http://" + urlStr;
            } else {
                urlStr = "https://" + urlStr;
            }
        } else {
            urlStr = 'https://jpsx-login.szfyhd.com/port/' + host + ":" + post;
        }

        this.httpManager.setUrl(urlStr);
    }
    //人物模型资源列表
    private getInitLoadURLList(): string[] {
        var info = SDKManager.loginInfo;

        var resList: string[] = [];
        // try {
        //     let sex: number = DataManager.getInstance().playerManager.player.sex;
        //     let role_avatar: string = DataManager.getInstance().playerManager.player.getPlayerData().cloth_res;
        //     if (info['iscreate'] != -1) {//新号
        //         resList[0] = LoadManager.getInstance().getNpcResUrl('npc0', "stand");
        //         resList[1] = LoadManager.getInstance().getNpcResUrl('npc1', "stand");
        //         resList[2] = LoadManager.getInstance().getNpcResUrl('npc3', "stand");
        //         resList[3] = LoadManager.getInstance().getMountResUrl('mount11', "stand", "3");
        //         resList[4] = LoadManager.getInstance().getMountResUrl('mount11', "stand", "2");
        //         resList[5] = LoadManager.getInstance().getClothResUrl(role_avatar, "ride_stand", "3");
        //         resList[6] = LoadManager.getInstance().getClothResUrl(role_avatar, "ride_stand", "2");
        //         resList[7] = LoadManager.getInstance().getMonsterResUrl('boss7', "stand", "1");
        //         resList[8] = LoadManager.getInstance().getMonsterResUrl('boss7', "stand", "3");
        //         resList[9] = LoadManager.getInstance().getMonsterResUrl('boss7', "attack1", "3");
        //     }
        //     let allAction: string[] = ['ride_stand', 'ride_walk', 'attack1', 'attack2', 'attack3'];
        //     for (let aIdx: number = 0; aIdx < allAction.length; aIdx++) {
        //         let actionName: string = allAction[aIdx];
        //         for (let d: number = Direction.DOWN; d < Direction.UP; d++) {
        //             resList.push(LoadManager.getInstance().getClothResUrl(role_avatar, actionName, d + ""));
        //         }
        //     }
        // } catch (e) {
        // }

        return resList;
    }

    private warnAlterView: AlertDisconnect;
    public setAlertDisconnect(text: string): void {
        if (!this.warnAlterView) {
            this.warnAlterView = new AlertDisconnect();
        }
        if (!this.warnAlterView.parent) {
            if (DataManager.IS_PC_Game) {
                this.warnAlterView.x = Globar_Pos.x;
            }
            this.warnAlterView.onShowAlert(text);
            this.addChild(this.warnAlterView);
        }
        this.gamescene.stopFightRun();
    }

    private _reloadView: AlertReLogin;
    public reloadingOpen(): void {
        if (!this._reloadView) {
            this._reloadView = new AlertReLogin(this);
        }
        this._reloadView.onShow(this);
    }
    public reloadingClose(): void {
        if (this._reloadView) {
            this._reloadView.onClose();
        }
    }

    private netErrorHandler(event: egret.Event): void {
        var message: Message = event.data as Message;
        var msg_error: MESSAGE_ERROR = MessageErrorManager.getInstance().errorMsgHandler(message.getCmdId());
        if (msg_error == MESSAGE_ERROR.CLOSE) {
            this.setAlertDisconnect(Language.ALERT_DISCONNECT_1);
        } else if (msg_error == MESSAGE_ERROR.AGAIN) {
            if (MessageErrorManager.getInstance().requsetFailTimes >= GameDefine.MASSAGE_FAIL_MAX) {
                this.setAlertDisconnect(Language.ALERT_DISCONNECT_3);
            } else {
                MessageErrorManager.getInstance().requsetFailTimes++;
                this.sendMessage(message);
            }
        }
        message = null;
    }
    //登录消息相关
    public async sendLogin() {
        this.isloginin = true;
        var launchOption = await platform.getOption();
        var queryObj = launchOption && launchOption.query ? launchOption.query : null;
        var info = SDKManager.loginInfo;

        var message: Message = new Message(MESSAGE_ID.GAME_LOGON_MESSAGE, false);
        message.setShort(info.channel);
        message.setShort(info.subChannel);
        message.setString(info.account);
        message.setByte(info.platform);
        message.setString(info.adFrom ? info.adFrom.adFrom : '');
        if (platform.isLocalTest()) {
            message.setString("0");
        } else {
            message.setString(DataManager.isRelease ? "0" : "1");
        }

        if (queryObj && queryObj.inviteSrever && Tool.isNumber(parseInt(queryObj.inviteSrever))) {
            message.setShort(parseInt(queryObj.inviteSrever));
        } else {
            message.setShort(0);
        }

        this.requestManager.addMessage(message);
    }

    public sendSelectServer(serverId: number): void {
        var info = SDKManager.loginInfo;
        info.serverId = serverId;

        var message: Message = new Message(MESSAGE_ID.SELECT_SERVER_MESSAGE, false);
        message.setShort(info.channel);
        message.setShort(info.subChannel);
        message.setString(info.account);
        message.setShort(info.serverId);
        message.setByte(info.platform);
        if (platform.isLocalTest()) {
            message.setString("0");
        } else {
            message.setString(DataManager.isRelease ? "0" : "1");
        }

        this.requestManager.addMessage(message);
    }

    public sendLoginServerMsg(): void {
        var info = SDKManager.loginInfo;

        var message: Message = new Message(MESSAGE_ID.LOGIN_SERVER_MESSAGE);
        message.setShort(info.channel);
        message.setShort(info.subChannel);
        message.setString(info.account);
        message.setShort(info.serverId);
        message.setByte(info.platform);
        this.requestManager.addMessage(message);

        Tool.log("登录游戏成功");
    }

    public async sendCreateRoleMsg(rolename: string, selectIdx: number) {
        var launchOption = await platform.getOption();
        var queryObj = launchOption && launchOption.query ? launchOption.query : null;
        var info = SDKManager.loginInfo;

        var message: Message = new Message(MESSAGE_ID.CREATE_ROLE_MESSAGE);
        message.setShort(info.channel);
        message.setShort(info.subChannel);
        message.setString(info.account);
        message.setShort(info.serverId);
        message.setByte(info.platform);
        message.setString(rolename);
        message.setByte(0);
        message.setByte(selectIdx);
        message.setString(info.adFrom ? info.adFrom.adFrom : "");
        message.setString(info.adFrom ? info.adFrom.spid : "");
        message.setInt(queryObj && queryObj.invitePlayerID ? queryObj.invitePlayerID : 0);

        this.requestManager.addMessage(message);
    }
    //SDK登录成功
    private onSDKLoginSuccess(): void {
        if (!this.isloginin) {
            this.sendLogin();
            GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SDK_LOGIN_OK, this.onSDKLoginSuccess, this);
            GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SDK_LOGIN_FAIL, this.onSDKLoginFail, this);
        }
    }
    //SDK登录失败
    private onSDKLoginFail(event: egret.Event): void {
        if (!this.isloginin) {
            GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SDK_LOGIN_OK, this.onSDKLoginSuccess, this);
            GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_SDK_LOGIN_FAIL, this.onSDKLoginFail, this);
            this.setAlertDisconnect(event.data);
        }
    }
    /**
     * 加载游戏数据 解压缩游戏数据
     */
    private _configIsLoaded: boolean;
    private startLoadingConfig() {
        if (!this._configIsLoaded) {
            Tool.getResAsync('config_bin', function () {
                this._configIsLoaded = true;
                if (this.state == GAME_STATE.GAME_STATE_PLAY) {
                    this.onReadConfigZip();
                }
            }, this);
        }
    }
    //游戏数据下载完成
    private onReadConfigZip(): void {
        if (!this._configIsLoaded) {
            return;
        }
        if (ModelManager.getInstance().configJson) {
            return;
        }

        ModelManager.getInstance().configJson = {};
        window['jsonfileCount'] = 0;
        let _jsZip = new JSZip();
        try {
            _jsZip['loadAsync'](RES.getRes("config_bin"), { checkCRC32: true }).then(function (jszip: JSZip) {
                for (let filename in jszip['files']) {
                    window['jsonfileCount']++;
                }
                for (let filename in jszip['files']) {
                    jszip['files'][filename].async("string").then(function (jsonFile) {
                        ModelManager.getInstance().configJson[filename] = JSON.parse(jsonFile);
                        window['jsonfileCount']--;
                        if (window['jsonfileCount'] == 0) {
                            GameDispatcher.getInstance().dispatchEventWith(GameEvent.GAME_JSON_PARSE_OK);
                        }
                    });
                }
            }, this);
        } catch (e) {
            alert("zip read fail!!!!! ");
        }
        _jsZip = null;
        RES.destroyRes('config_bin');
    }
    //解析数据完成
    private readConfigZipComplete(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_JSON_PARSE_OK, this.readConfigZipComplete, this);
        this.sendEnterGameMsg();
    }

    public getGameScene(): MainScene {
        return this.gamescene;
    }
}

enum GAME_STATE {
    GAME_STATE_LOGIN,//登录
    GAME_STATE_SERVER,//选服
    GAME_STATE_CREATE,//创角
    GAME_STATE_PLAY//开始游戏
}