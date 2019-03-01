// TypeScript file
class TaskManager {
    public guideTaskData: GuideTaskData;//主线任务
    public coatardTasks;//服务器给的任务状态
    private taskmodelsDict;//当前境界的所有任务
    private _currTaskCount: number = 0;
    private lvTasks: ModelchengjiuMubiao[];
    private powerTasks: ModelchengjiuMubiao[];

    public constructor() {
        this.coatardTasks = {};
        this.taskmodelsDict = {};
        this.lvTasks = [];
        this.powerTasks = [];
    }
    /**初始化当前境界所有任务**/
    public getCurTask(type, count): ModelchengjiuMubiao {
        var allLvModel = JsonModelManager.instance.getModelchengjiuMubiao()[type];
        var idx: number = 0;
        for (let k in allLvModel) {
            if (idx == count) {
                return allLvModel[k]
            }
            idx = idx + 1;
        }
    }
    /**解析 初始化 境界任务消息**/
    public parseInitCoatardTaskMsg(msg: Message): void {
        // this.onInitCurrModels();
        this.coatardTasks = {};
        let tasksize: number = msg.getByte();
        for (var i: number = 0; i < tasksize; i++) {
            var taskData: TaskChainData = new TaskChainData();
            taskData.parseMsg(msg);
            this.coatardTasks[taskData.taskId] = taskData;
            var mubiaoCfg: ModelchengjiuMubiao = DataManager.getInstance().taskManager.getCurTask(taskData.model.id, taskData.count)
            if (mubiaoCfg) {
                taskData.maxnum = mubiaoCfg.mubiao;
            } else {
                taskData.maxnum = 0;
            }
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(MESSAGE_ID.REBIRTH_TASK_INIT_MSG.toString()));
    }
    /**获取当前境界阶段总任务数量**/
    public get currTaskCount(): number {
        return this._currTaskCount;
    }
    /**解析 更新 境界任务消息**/
    public parseUpdateCoatardTaskMsg(msg: Message): void {
        let tasksize: number = msg.getByte();
        for (let i: number = 0; i < tasksize; i++) {
            let taskdata: TaskChainData;
            let newTaskData: TaskChainData = new TaskChainData();
            newTaskData.parseMsg(msg);
            if (this.coatardTasks[newTaskData.model.id]) {
                taskdata = this.coatardTasks[newTaskData.model.id];
                taskdata.progress = newTaskData.progress;
                // let oldProCount: number = taskdata.count;
                taskdata.count = newTaskData.count;
                // if (!hascomplete && oldProCount < taskdata.count) {
                //     hascomplete = true;
                // }
                var mubiaoCfg: ModelchengjiuMubiao = DataManager.getInstance().taskManager.getCurTask(taskdata.model.id, taskdata.count)
                if (mubiaoCfg) {
                    taskdata.maxnum = mubiaoCfg.mubiao;
                } else {
                    taskdata.maxnum = 0;
                }
            }
        }
        DataManager.getInstance().playerManager.player.chengjiuExp = msg.getInt();
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    /**日常任务列表初始化**/
    public parseTaskDailyInitMsg(msg: Message): void {
        var taskdailyDict = JsonModelManager.instance.getModeltaskDaily();
        var taskSize: number = msg.getByte();
        for (var id in taskdailyDict) {
            if (taskSize == 0) {
                break;
            }
            var model: ModeltaskDaily = taskdailyDict[id];
            model.dailytaskPro = msg.getShort();
            taskSize--;
        }
    }
    /**日常任务更新**/
    public parseTaskDailyUpdateMsg(msg: Message): void {
        var taskid: number = msg.getByte();
        var model: ModeltaskDaily = JsonModelManager.instance.getModeltaskDaily()[taskid];
        if (model) {
            model.dailytaskPro = msg.getShort();
        }
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    private _chengjius: Modelchengjiu[] = JsonModelManager.instance.getModelchengjiu()
    public getChengJiuPoint(): boolean {
        for (let k in this._chengjius) {
            let taskData: TaskChainData = DataManager.getInstance().taskManager.coatardTasks[this._chengjius[k].id];
            var mubiaoCfg: ModelchengjiuMubiao = DataManager.getInstance().taskManager.getCurTask(taskData.model.id, taskData.count);
            if (mubiaoCfg) {
                if (taskData.progress >= mubiaoCfg.mubiao) {
                    return true;
                }
            }
        }
        if (this.getChengJiuLvPoint()) return true;
        return false;
    }
    private _chengjiuLvs: ModelchengjiuLv[] = JsonModelManager.instance.getModelchengjiuLv()
    public getChengJiuLvPoint(): boolean {
        for (let k in this._chengjiuLvs) {
            if (this._chengjiuLvs[k].exp <= DataManager.getInstance().playerManager.player.chengjiuExp) {
                if (!DataManager.getInstance().playerManager.player.chengjiuLvDict[this._chengjiuLvs[k].lv])
                    return true;
            }
        }
        return false;
    }
    public getchengjiuLevel(exp: number): number {
        var lv: number = 0;
        var model: ModelchengjiuLv;
        var data = JsonModelManager.instance.getModelchengjiuLv();
        model = data[0];
        if (exp < model.exp) return 0;
        for (let k in data) {
            if (exp >= data[k].exp) {
                model = data[k]
            }
        }
        return model.lv;
    }
    /**新手任务**/
    public parseTaskChainMsg(msg: Message): void {
        if (!this.guideTaskData) {
            this.guideTaskData = new GuideTaskData();
        }
        this.guideTaskData.onParseMsg(msg);
        GameCommon.getInstance().receiveMsgToClient(msg);
    }
    public sendTaskChainCompleteMsg(): void {
        if (this.guideTaskData && this.guideTaskData.model) {
            var rewardMsg: Message = new Message(MESSAGE_ID.TASK_CHAIN_REWARD_MESSAGE);
            GameCommon.getInstance().sendMsgToServer(rewardMsg);
        }
    }
}
class TaskChainData {
    public taskId: number;
    public progress: number;//进度
    public count: number;//同类型的第几个 或 0未完成 1完成 2已领奖
    public maxnum: number;//当前最大进度 0为已完成
    public isAct:number = 0;
    private _model: Modelchengjiu;

    public constructor() {
    }
    public parseMsg(msg: Message): void {
        this.taskId = msg.getShort();
        this.progress = msg.getLong();
        this.count = msg.getByte();

        this._model = JsonModelManager.instance.getModelchengjiu()[this.taskId];
    }

    public get model(): Modelchengjiu {
        return this._model;
    }
    //The end
}

class TaskEvnetData {
    public eventId: number;//事件id
    public param: number;//参数
    public option: number;//选项
}

class GuideTaskData {
    private _model: Modelxinshourenwu;
    private _progress: number = 0;//当前进度
    private status: number;// 0未完成 1完成 2已领奖

    public constructor() {
    }
    public onParseMsg(message: Message): void {
        let taskId: number = message.getShort();
        this._progress = message.getLong();
        this.status = message.getByte();
        if (this.status != 2) {
            this._model = JsonModelManager.instance.getModelxinshourenwu()[taskId];
        } else {
            this._model = null;
        }
    }
    public get model(): Modelxinshourenwu {
        return this._model;
    }
    public get progress(): number {
        return this._progress;
    }
    public get isFinish(): boolean {
        return this._model ? this._progress >= this._model.param : false;
    }
    //The end
}