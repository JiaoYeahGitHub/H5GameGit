/**
 *
 * @author 
 *
 */
class GameLoadingUIByGroup extends eui.Component {
    private callback;
    private thisObject;
    private imgs: string[];
    private urlImgs: string[];
    private imgIdx;
    private imgMax;
    private groupSize;
    private loadtext: eui.Label;
    private enter_name_grp: eui.Group;
    public bar: eui.ProgressBar;
    private groupName: string;
    // private barw;
    public constructor() {
        super();
        this.skinName = skins.GameLoadingBar;//GameSkin.getGameLoadingBar();
        this.bar.skinName = skins.GameLoadingProBar;//GameSkin.getGameLoadingProBar();
        this.bar.slideDuration = 0;
        this.bar.maximum = 100;

        if (!DataManager.IS_PC_Game) {
            this.width = size.width;
        }
        this.height = size.height;
        this.initPard();
    }

    private static instance: GameLoadingUIByGroup;
    public static getInstance(): GameLoadingUIByGroup {
        if (!this.instance)
            this.instance = new GameLoadingUIByGroup();
        return this.instance;
    }
    //设置说明文字
    public onInputLoadText(desc: string): void {
        this.loadtext.text = desc;
    }
    //开始加载
    private startPro: number = 50;//百分比
    private endPro: number = 100;
    public onstartLoad(groupName, callback, thisObject, imgs: string[] = null, urlImgs: string[] = null, startPro = 0, endPro = 100): void {
        this.groupName = groupName;
        this.callback = callback;
        this.thisObject = thisObject;

        this.imgs = imgs;
        this.urlImgs = urlImgs;
        this.imgMax = imgs ? imgs.length : 0;
        this.imgMax = urlImgs ? this.imgMax + urlImgs.length : this.imgMax;
        this.imgIdx = 0;
        this.groupSize = 0;
        this.startPro = startPro;
        this.endPro = endPro;

        this.initPard();
    }
    //添加到舞台
    public onShow(param: egret.DisplayObjectContainer): void {
        if (DataManager.IS_PC_Game) {
            this.x = Globar_Pos.x;
        }
        param.addChild(this);
    }
    private initPard() {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadGroupFinish, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        if (this.groupName) {
            RES.loadGroup(this.groupName);
        }
    }
    public onResourceProgress(event: RES.ResourceEvent): void {
        this.groupSize = event.itemsTotal;
        this.loadData(event.itemsLoaded + this.imgIdx, this.groupSize + this.imgMax);
    }
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    private loadData(value, total) {
        let loadPro: number = Math.round((value / total) * Math.max(1, (this.endPro - this.startPro)));
        this.bar.value = Math.min(loadPro + this.startPro, 100);
    }

    private loadGroupFinish() {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadGroupFinish, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        if (this.imgs) {
            this.imgIdx = 0;
            this.loadImgs();
        } else {
            this.loadFinish();
        }
    }

    private loadImgs() {
        if (this.imgIdx < this.imgs.length) {
            this.loadData(this.groupSize + this.imgIdx, this.groupSize + this.imgMax);
            this.imgIdx++;
            let reskeyStr: string = this.imgs.shift();
            if (RES.hasRes(reskeyStr)) {
                RES.getResAsync(reskeyStr, this.loadImgs, this);
            } else {
                this.loadImgs();
            }
        } else if (this.urlImgs && this.imgIdx < this.imgs.length + this.urlImgs.length) {
            this.loadData(this.groupSize + this.imgIdx, this.groupSize + this.imgMax);
            this.imgIdx++;
            let reskeyStr: string = this.urlImgs.shift();
            LoadManager.getInstance().loadModelByName(reskeyStr, this.loadImgs, this);
        } else {
            this.loadFinish();
        }
    }

    private loadFinish() {
        Tool.callback(this.callback, this.thisObject);
    }

    public close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    /**进入游戏滚动**/
    public playRoleEnter(): void {
        //初始化进入游戏玩家列表
        let leng: number = 15;
        let names: string[] = [];
        while (leng > names.length) {
            let sex: SEX_TYPE = Math.round(Math.random() * 1);
            let name: string = NameDefine.getRandomPlayerName(false, sex);
            if (names.indexOf(name) >= 0) {
                continue;
            }
            names.push(name);
            let label: eui.Label = this.createEnterPlayerLab(name);
            label.y = names.length * 20;
            this.enter_name_grp.addChild(label);
        }
        this.addEventListener(egret.Event.ENTER_FRAME, this.onTimeDown, this);
    }
    public destoryPlayerEnter(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onTimeDown, this);
        this.enter_name_grp.removeChildren();
    }
    private createEnterPlayerLab(randonName: string): eui.Label {
        let label: eui.Label = GameCommon.getInstance().createNormalLabel(18, 0x191919, 0, 0, egret.HorizontalAlign.CENTER);
        label.width = 250;
        let playerName: Array<egret.ITextElement> = new Array<egret.ITextElement>(
            { text: "玩家  " },
            { text: randonName, style: { textColor: 0x28C1FC } },
            { text: "  进入游戏" }
        );
        label.textFlow = playerName;
        return label;
    }
    private onTimeDown(): void {
        for (let i: number = 0; i < this.enter_name_grp.numChildren; i++) {
            let label: eui.Label = this.enter_name_grp.getChildAt(i) as eui.Label;
            if (label.y > -100) {
                label.y--;
                if (label.y < -70) {
                    label.alpha = Math.max(0, label.alpha - 0.05);
                }
            }
            if (i == this.enter_name_grp.numChildren - 1 && label.y <= -100) {
                for (let n: number = 0; n < this.enter_name_grp.numChildren; n++) {
                    let label2: eui.Label = this.enter_name_grp.getChildAt(n) as eui.Label;
                    label2.y = n * 20;
                    label2.alpha = 1;
                }
            }
        }
    }
    //The end
}