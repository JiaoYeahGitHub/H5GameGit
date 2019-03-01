// TypeScript file
class GameSetting {
    public static LOGIN_ACCOUNTS: string = "GAME_LOGIN_ACCOUNT";//登录帐号
    public static YEWAI_AUTO_FIGHT: string = "GAME_YEWAI_AUTOFIGHT_SET";//野外自动挂机设置
    public static SOUND_MUTE: string = "GAME_SOUND_MUTE";//游戏静音
    public static WX_OPENID: string = "WX_OPENID";//微信logincode
    public static WX_SESSION_KEY: string = "WX_SESSION_KEY";//微信小游戏的session_key
    public static WX_SHARE_RANDOMSTR: string = "WX_SHARE_RANDOMSTR";//微信小游戏分享的随机码 用于核对是否为当前分享
    
    public static setLocalSave(key: string, value: any): void {
        let savedata: string = "";
        switch (typeof (value)) {
            case "boolean":
                savedata = value ? "$TRUE" : "$FALSE";
                break;
            case "number":
                savedata = value.tostring();
                break;
            case "string":
                savedata = value;
                break;
        }
        if (savedata) {
            window.localStorage.setItem(GameSetting.getLoaclKey(key), savedata);
        }
    }

    public static getLocalSetting(key: string): any {
        if (!key) return "";
        let savedata: string = window.localStorage.getItem(GameSetting.getLoaclKey(key));
        if (savedata) {
            if (savedata == "$TRUE") {
                return true;
            } else if (savedata == "$FALSE") {
                return false;
            } else if (Tool.isNumber(parseInt(savedata)) && savedata[0] != '0') {//^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$
                return parseInt(savedata);
            } else {
                return savedata;
            }
        }
        return "";
    }

    private static getLoaclKey(key: string): any {
        return DataManager.getInstance().playerManager.player.id + ":" + key;
    }
}