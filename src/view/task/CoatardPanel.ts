class CoatardPanel extends BaseTabView {
    private curr_coatard_lv: eui.BitmapLabel;
    private anim_grp: eui.Group;
    // private next_coatard_lv: eui.BitmapLabel;
    private curr_coatard_name: eui.Image;
    // private next_coatard_name: eui.Image;
    // private next_grade_grp: eui.Group;
    private coatard_exp_pro: eui.ProgressBar;
    private func_btn_grp: eui.Group;
    private scroll: eui.Scroller;
    private itemsGrp: eui.Group;
    private btn_coatard: eui.Button;
    private next_open_desc: eui.Label;
    // private curr_attr_grp: eui.Group;
    // private next_attr_grp: eui.Group;

    private itemsDict;
    private curr_coatardLv: number;
    private coatardlvDict;
    protected points: redPoint[] = RedPointManager.createPoint(1);

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.CoatardPanelSkin;
    }
    protected onInit(): void {
        this.itemsDict = {};
        // this.coatardlvDict = JsonModelManager.instance.getModellevel2coatardLv();
        this.points[0].register(this.btn_coatard, GameDefine.RED_BTN_POS, this, "onCheckPoint1");

        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_coatard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCoatard, this);
        GameDispatcher.getInstance().addEventListener(MESSAGE_ID.REBIRTH_TASK_INIT_MSG.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onReciveStateMsg, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onReciveStateMsg, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_coatard.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCoatard, this);
        GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.REBIRTH_TASK_INIT_MSG.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG.toString(), this.onReciveStateMsg, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onReciveStateMsg, this);
    }
    protected onRefresh(): void {
        if (this.curr_coatardLv != this.playerData.coatardLv) {
            this.curr_coatardLv = this.playerData.coatardLv;
            this.onInitTaskList();
        } else {
            this.onUpdateTaskList();
        }

        this.updateCoatardLv();
    }
    /**更新境界等级进度**/
    private updateCoatardLv(): void {
        let item: AttributesText;
        this.curr_coatard_lv.text = `${Tool.toChineseNum(this.curr_coatardLv)}`;
        this.curr_coatard_name.source = `coatard_tier_${this.curr_coatardLv}_png`;
        this.coatard_exp_pro.value = this.finishCount;
        this.btn_coatard.enabled = this.coatard_exp_pro.value == this.coatard_exp_pro.maximum;
    }
    /**获取任务完成数量**/
    private get finishCount(): number {
        let count: number = 0;
        let tasks = DataManager.getInstance().taskManager.coatardTasks;
        for (let taskid in tasks) {
            let taskData: TaskChainData = tasks[taskid];
            count += taskData.count;
        }
        return count;
    }
    /**更新开启功能**/
    private updateOpenFunc(): void {
        // this.func_btn_grp.removeChildren();
        // let _nextModel: Modellevel2coatardLv = this.coatardlvDict[this.curr_coatardLv];
        // if (!_nextModel) {
        //     this.next_open_desc.text = Language.instance.getText("full_level_3");
        // } else {
        //     this.next_open_desc.text = Language.instance.getText("xiajieduankaiqi");
        //     let openfunParam: string[] = _nextModel.gongneng.split('#');
        //     for (let i: number = 0; i < openfunParam.length; i++) {
        //         let param: string[] = openfunParam[i].split(',');
        //         let funcbar: eui.Component = new eui.Component();
        //         funcbar.skinName = skins.CoatardFuncSkin;
        //         (funcbar['icon'] as eui.Image).source = param[0];
        //         (funcbar['desc_lab'] as eui.Label).text = param[1];
        //         this.func_btn_grp.addChild(funcbar);
        //     }
        // }
    }
    /**初始化任务列表**/
    private onInitTaskList(): void {
        // let _currmodel: Modellevel2coatardLv = this.coatardlvDict[this.curr_coatardLv - 1];
        // if (!_currmodel) {
        //     return;
        // }
        // for (let tasktype in this.tasksDict) {
        //     let tasksAry: number[] = this.tasksDict[tasktype];
        //     tasksAry.sort(function (n1, n2) {
        //         if (n1 < n2) {
        //             return 1;
        //         }
        //         return -1;
        //     });
        // }
        // this.coatard_exp_pro.maximum = DataManager.getInstance().taskManager.currTaskCount;
        // //移除之前的
        // this.itemsDict = {};
        // this.itemsGrp.removeChildren();

        // let taskDatas = DataManager.getInstance().taskManager.coatardTasks;
        // for (let taskId in taskDatas) {
        //     let taskData: TaskChainData = taskDatas[taskId];
        //     if (taskData.maxnum > 0) {
        //         let taskItem: CoatardTaskItem = new CoatardTaskItem();
        //         taskItem.update(taskData);
        //         this.itemsDict[taskData.taskId] = taskItem;
        //         if (taskData.maxnum <= taskData.progress) {
        //             this.itemsGrp.addChildAt(taskItem, 0);
        //         } else {
        //             this.itemsGrp.addChild(taskItem);
        //         }
        //     }
        // }
        // for (let i: number = 0; i < this.itemsGrp.numChildren; i++) {
        //     let taskItem: CoatardTaskItem = this.itemsGrp.getChildAt(i) as CoatardTaskItem;
        //     taskItem.onShow((i + 1) * 200);
        // }
        // this.updateOpenFunc();

        // this.anim_grp.removeChildren();
        // GameCommon.getInstance().addAnimation(`jingjie${this.curr_coatardLv - 1}_big_effect`, null, this.anim_grp, -1);
    }
    /**更新任务状态**/
    private onReciveStateMsg(event: GameMessageEvent): void {
        let taskId: number = event.message as number;
        let taskData: TaskChainData = DataManager.getInstance().taskManager.coatardTasks[taskId];
        if (!taskData) return;
        let taskItem: CoatardTaskItem = this.itemsDict[taskData.taskId];
        if (!taskItem) return;

        taskItem.onComplete();
        if (taskData.maxnum > 0) {
            // Tool.callbackTime(function (taskItem: CoatardTaskItem, data: TaskChainData) {
            taskItem.update(taskData);
            if (taskData.maxnum <= taskData.progress) {
                this.itemsGrp.addChildAt(taskItem, 0);
            } else {
                this.itemsGrp.addChild(taskItem);
            }
            taskItem.onShow();
            // }, this, 550, taskItem, taskData);
        } else {
            delete this.itemsDict[taskData.taskId];
        }
        this.updateCoatardLv();
    }
    /**列表更新**/
    private onUpdateTaskList(): void {
        for (let taskid in this.itemsDict) {
            let taskItem: CoatardTaskItem = this.itemsDict[taskid];
            let taskData: TaskChainData = DataManager.getInstance().taskManager.coatardTasks[taskid];
            if (taskData) {
                if (taskData.maxnum > 0) {
                    taskItem.update(taskData);
                } else {
                    taskItem.onComplete();
                    delete this.itemsDict[taskData.taskId];
                }
            }
        }
    }
    /**境界提升处理**/
    private onTouchBtnCoatard(): void {
        let upcoatardlvMsg: Message = new Message(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(upcoatardlvMsg);
    }
    private onGetBtn(): void {
        GameCommon.getInstance().onShowFastBuy(0, GOODS_TYPE.VIGOUR);
    }
    private get playerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    public trigger(): void {
        this.points[0].checkPoint();
    }
    private onCheckPoint1(): boolean {
        return this.btn_coatard.enabled;
    }
    //The end
}
class CoatardTaskItem extends eui.Component {
    private task_name_lab: eui.Label;
    // private award_desc_lab: eui.Label;
    private task_probar: eui.ProgressBar;
    private button: eui.Button;
    private anim_grp: eui.Group;
    private task_pro_lab: eui.Label;
    private task_icon: eui.Image;

    private _taskdata: TaskChainData;
    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onInit, this);
        this.skinName = skins.CoatardItemSkin;
    }
    private onInit(): void {
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }
    public update(data: TaskChainData): void {
        this._taskdata = data;
        this.task_icon.source = data.model.icon;
        this.task_name_lab.text = Language.instance.parseInsertText(this._taskdata.model.name, this._taskdata.maxnum);
        // let itemaward: AwardItem = this._taskdata.model.rewards[0];
        // let modelthing: ModelThing = GameCommon.getInstance().getThingModel(itemaward.type, itemaward.id);
        // this.award_desc_lab.text = `(${modelthing.name}*${itemaward.num})`;
        if (this._taskdata.model.eventType == 1000) {
            this.task_probar.visible = false;
            // this.task_pro_lab.text = name_param[1].replace('{arenaRank}', '' + DataManager.getInstance().localArenaManager.localArenaData.rank);
        } else {
            this.task_probar.visible = true;
            this.task_probar.maximum = this._taskdata.maxnum;
            this.task_probar.value = this._taskdata.progress;
        }
        if (this._taskdata.maxnum <= this._taskdata.progress) {
            this.button.skinName = skins.Common_ButtonBlue2Skin;
            this.button.label = Language.instance.getText('wancheng');
        } else {
            this.button.skinName = skins.Common_ButtonYellow;
            this.button.label = Language.instance.getText('qianwang');
        }
    }
    private _touchStamp: number = 0;
    private onTouchButton(): void {
        if (this._taskdata.maxnum <= this._taskdata.progress) {
            if (this._touchStamp > egret.getTimer()) {
                return;
            }
            this._touchStamp = egret.getTimer() + 1000;
            let rewardMsg: Message = new Message(MESSAGE_ID.REBIRTH_TASK_UPDATE_MSG);
            rewardMsg.setShort(this._taskdata.taskId);
            GameCommon.getInstance().sendMsgToServer(rewardMsg);
        } else {
            if (this._taskdata.model.eventType == 36) {
                let param: ChatPanelParam = new ChatPanelParam(CHANNEL.CURRENT, null);
                let shortword: string = ChatDefine.DEFAULT_SHORT_CHAT[Math.floor(Math.random() * ChatDefine.DEFAULT_SHORT_CHAT.length)];
                param.content = Language.instance.getText(shortword);
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatMainPanel", param));
            } else {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this._taskdata.model.goType);
            }
        }
    }
    public onShow(delay: number = 500): void {
        this.anim_grp.x = this.anim_grp.width;
        egret.Tween.removeTweens(this.anim_grp);
        egret.Tween.get(this.anim_grp).to({ x: 0 }, delay, egret.Ease.sineIn);
    }
    public onComplete(): void {
        // egret.Tween.get(this.anim_grp).to({ x: 0 - this.anim_grp.width - 100 }, 500, egret.Ease.sineIn)
        //     .call(function () {
        if (this.parent) {
            egret.Tween.removeTweens(this.anim_grp);
            this.parent.removeChild(this);
        }
        // }, this);
    }
    //The end
}