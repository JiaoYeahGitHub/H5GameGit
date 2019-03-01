// TypeScript file
class RobotData extends PlayerData {
    public constructor(id, type = BODY_TYPE.ROBOT) {
        super(id, type);
        this.level = DataManager.getInstance().playerManager.player.level;
    }
    protected onRefreshProp(): void {
    }
    public onupdateLevel(level: number): void {
    }
    //仅仅是个外表
    public onUpdateOnlyAppear(playerAppear: AppearPlayerData): void {
        this.attributes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.titleId = playerAppear.titleId;
        this.sex = playerAppear.sex;
        this.setAppear(playerAppear);
    }
    //服务器发我什么属性就是什么属性
    public onUpdateRobotInfo(attributes: number[]): void {
        this.attributes = attributes;
        //外形算法
        this.sex = Math.round(Math.random() * 1);
        var player: Player = DataManager.getInstance().playerManager.player;
        var playerdata: PlayerData = player.getPlayerData();
        var robotGrade: number = this.figthPower / player.playerTotalPower;
        var minRDValue: number = 0;
        var maxRDValue: number = 0;
        if (robotGrade < 0.6) {//-2 至 -3
            minRDValue = -2;
            maxRDValue = -1;
        } else if (robotGrade < 0.85) {//-1 至 -2
            minRDValue = -1;
            maxRDValue = -1;
        } else if (robotGrade < 0.95) {//0 至 -1
            minRDValue = 0;
            maxRDValue = -1;
        } else if (robotGrade <= 1.05) {//不变
            minRDValue = 0;
            maxRDValue = 0;
        } else {//1至2的变化
            minRDValue = 1;
            maxRDValue = 1;
        }
        for (let blesstype: number = 0; blesstype < BLESS_TYPE.SIZE; blesstype++) {
            let showRDValue: number = Math.round(Math.random() * maxRDValue) + minRDValue;
            let robotFashionId: number = 0;
            let heroAvatar: number = playerdata.fashionSkils[blesstype];
            if (heroAvatar) {
                let fashionIds: number[] = DataManager.getInstance().playerManager.getFashionIDsByType(blesstype);
                let heroIndex: number = fashionIds.indexOf(heroAvatar);
                robotFashionId = heroIndex + showRDValue;
                if (robotFashionId > 0) {
                    robotFashionId = fashionIds[Math.min(fashionIds.length - 1, robotFashionId)];
                }
            }

            if (robotFashionId > 0) {
                let fashion_model: Modelfashion = JsonModelManager.instance.getModelfashion()[robotFashionId];
                this._appears[blesstype] = fashion_model ? fashion_model.waixing1 : GameDefine.PLAYER_DEFUALT_AVATAR[blesstype];
            } else {
                this._appears[blesstype] = GameDefine.PLAYER_DEFUALT_AVATAR[blesstype];
            }
        }
    }
    //The end
}