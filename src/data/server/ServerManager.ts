/**
 *
 * @author 
 *
 */
class ServerManager {

    public serverLoginedArray: Array<Server>;
    public serverArray: Array<Server>;

    public constructor() {
    }

    public parseServerList(message: Message): void {
        var loginInfo = window['gamesdk'];

        this.serverArray = new Array<Server>();
        if (message.getBoolean()) {
            var openNum: number = message.getShort();
            var hotNum: number = message.getShort();
            var state: number = message.getByte();
            var list: Array<Number> = new Array<Number>();
            var size = message.getShort();
            for (var i = 0; i < size; ++i) {
                list.push(message.getShort());
            }
            for (var i = 1; i <= openNum; ++i) {
                var serverState: SERVER_STATE;
                if (state == 2) {
                    serverState = SERVER_STATE.MAINTAIN;
                } else {
                    var isNormal = true;
                    for (var j = 0; j < list.length; ++j) {
                        if (list[j] == i) {
                            serverState = SERVER_STATE.MAINTAIN;
                            isNormal = false;
                        }
                    }
                    if (isNormal) {
                        if (i > hotNum) {
                            serverState = SERVER_STATE.NEW;
                        } else {
                            serverState = SERVER_STATE.HOT;
                        }
                    }
                }
                this.serverArray.push(this.createServer(i, loginInfo.serverName + i + '服', serverState));
            }
        } else {
            var size = message.getShort();
            for (var i = 0; i < size; ++i) {
                this.serverArray.push(this.parseServer(message));
            }
        }
        this.serverLoginedArray = new Array<Server>();
        var size = message.getByte();
        for (var i = 0; i < size; ++i) {
            var loginedServer: Server = this.getServerById(message.getShort());
            if (loginedServer) {
                this.serverLoginedArray.push(loginedServer);
            }
        }
    }

    private parseServer(message: Message): Server {
        var server: Server = new Server();
        server.id = message.getShort();
        server.name = message.getString();
        var isNew = message.getBoolean();
        if (isNew) {
            server.state = SERVER_STATE.NEW;
        } else {
            server.state = SERVER_STATE.HOT;
        }
        return server;
    }

    private createServer(id: number, name: string, state: SERVER_STATE): Server {
        var server: Server = new Server();
        server.id = id;
        server.name = name;
        server.state = state;
        return server;
    }

    private getServerById(id: number): Server {
        for (var index in this.serverArray) {
            if (id == this.serverArray[index].id) {
                return this.serverArray[index];
            }
        }
        return null;
    }

    /** 创角OR登录统计 **/
    public isCreateRole: boolean;
    public onLoginSDKStatistics(): void {
        if (this.isCreateRole) {
            SDKManager.onCreateRole(DataManager.getInstance().playerManager.player);
        }
        SDKManager.onEnterGame(DataManager.getInstance().playerManager.player);
    }
}
