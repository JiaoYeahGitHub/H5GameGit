/**
 *
 * @author 
 *
 */
class GameErrorTip {
    private static instance: GameErrorTip;
    public static ERROR_ID_ARENA_CHANGE: number = 62;
    public static ERROR_ID_PLUSE_FAIL: number = 136;
    public static ERROR_ID_SAMSARA_REBORN: number = 103;
    public static ERROR_ID_LADDER_END: number = 21;

    public static getInstance(): GameErrorTip {
        if (this.instance == null) {
            this.instance = new GameErrorTip();
        }
        return this.instance;
    }
    public getGameErrorTip(errorCode): string {
        return Language.instance.getText(`error_tips_${errorCode}`);
    }
}

class ErrorTip {
    public index: number;
    public tip: string;
}
