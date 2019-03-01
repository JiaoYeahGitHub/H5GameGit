/**
 *
 * @author 
 */
class RequestManager {

    private gameWorld: GameWorld;
    private list: Message[];

    public constructor(world: GameWorld) {
        this.gameWorld = world;
        this.list = [];
    }

    public start() {
        Tool.addTimer(this.gameRequestTimer, this, 200);
    }

    public addMessage(message: Message) {
        if (message.isCheckRepeat && this.list.length > 0) {
            var last = this.list[this.list.length - 1];
            if (last && last.getCmdId() == message.getCmdId()) {
                return;
            }
        }
        this.list.push(message);
    }

    public gameRequestTimer(dt) {
        if (this.list.length > 0) {
            var message = this.list.shift();
            message.inputData();
            message.setPlayerId(DataManager.getInstance().playerManager.player.id);
            message.setLoginCode(DataManager.getInstance().playerManager.player.loginCode);
            this.gameWorld.httpManager.sendMessage(message);
        }
    }
}
