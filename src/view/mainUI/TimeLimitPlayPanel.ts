class TimeLimitPlayPanel extends BaseWindowPanel {
    private item_group: eui.Group;
    private item_list: Array<TimeLimitPlayItem> = [];

    public constructor(owner) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.TimeLimitPlayPanelSkin;
    }

    protected onInit(): void {
        var diShiModelDataMap: Modeldingshihuodong[] = JsonModelManager.instance.getModeldingshihuodong();
        for (var key in diShiModelDataMap) {
            var diShiModel: Modeldingshihuodong = diShiModelDataMap[key];
            var item: TimeLimitPlayItem = new TimeLimitPlayItem();
            item.onUpdate(diShiModel);
            this.item_list.push(item);
        }
        this.showpanel();
        super.onInit();
    }

    protected onRefresh(): void {
        super.onRefresh();
        this.showpanel();
    }

    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < this.item_list.length; i++) {
            var item: TimeLimitPlayItem = this.item_list[i];
            item.go_to_panel.addEventListener(egret.TouchEvent.TOUCH_TAP, item.jumpTO, item);
        }
    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < this.item_list.length; i++) {
            var item: TimeLimitPlayItem = this.item_list[i];
            item.go_to_panel.removeEventListener(egret.TouchEvent.TOUCH_TAP, item.jumpTO, item);
        }
    }

    private showpanel() {
        this.item_group.removeChildren();
        var diShiModelDataMap: Modeldingshihuodong[] = JsonModelManager.instance.getModeldingshihuodong();
        for (var i = 0; i < this.item_list.length; i++) {
            this.item_list[i].onUpdate(diShiModelDataMap[this.item_list[i].idx])
        }
        this.item_list = this.item_list.sort((n1, n2) => this.itemSort(n1, n2));
        for (var i = 0; i < this.item_list.length; i++) {
            this.item_group.addChild(this.item_list[i]);
        }
    }

    private itemSort(n1: TimeLimitPlayItem, n2: TimeLimitPlayItem) {
        if (n1.isOpen > n2.isOpen) {
            return -1;
        } else if (n1.isOpen == n2.isOpen) {
            if (n1.order < n2.order) {
                return -1;
            }
        }
        return 1;
    }
}

class TimeLimitPlayItem extends eui.ItemRenderer {
    private day: string[] = ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    private bg: string[] = ["tmlt_ttjjc_bg", "tmlt_jjzx_bg", "tmlt_xmmj_bg", "tmlt_xmz_bg"];
    private title: string[] = ["tmlt_ttjjc", "tmlt_jjzx", "tmlt_xmmj", "tmlt_xmz"];
    private item_name: eui.Image;
    public go_to_panel: eui.Button;
    private item_time: eui.Label;
    private item_bg: eui.Image;

    public idx: number;
    public order: number;
    public isOpen: number = 0;
    private goType: number;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onInit, this);
        this.skinName = skins.TimeLimitItemSkin;
    }

    private onInit(): void {
    }

    public onUpdate(diShiModel: Modeldingshihuodong) {
        this.idx = diShiModel.id;
        this.order = diShiModel.order;
        this.isOpen = 0;

        this.item_name.source = this.title[this.idx] + "_png";
        this.item_bg.source = this.bg[this.idx] + "_jpg";
        var str1 = diShiModel.startTime;
        var str2 = diShiModel.endTime;
        this.goType = diShiModel.goType;

        var today = parseInt(str1.split("#")[1]);
        var startTime = str1.split("#")[0];
        var endTime = str2.split("#")[0];

        this.isOpen = this.isOpenMthon(today, startTime, endTime);
        if (this.isOpen) {
            this.go_to_panel.enabled = true;
        } else {
            this.go_to_panel.enabled = false;
        }
        if (today < 0) {
            this.item_time.text = "每天" + startTime + "--" + endTime;
        } else {
            this.item_time.text = "每" + this.day[today] + startTime + "--" + endTime;
        }
    }

    public jumpTO(event: egret.TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.goType);
    }

    public isOpenMthon(today, startTime: string, endTime: string): number {
        var curServerTime: number = DataManager.getInstance().playerManager.player.curServerTime;
        var dateBegin = new Date();
        var dateOver = new Date();
        var startArray = startTime.split(":");
        var endArray = endTime.split(":");
        dateBegin.setHours(parseInt(startArray[0]));
        dateBegin.setMinutes(parseInt(startArray[1]));
        dateOver.setHours(parseInt(endArray[0]))
        dateOver.setMinutes(parseInt(endArray[1]));


        if (curServerTime < dateOver.getTime() && curServerTime > dateBegin.getTime()) {
            if (today < 0) {
                return 1;
            } else if (today >= 0 && (today - 1) == new Date().getDay()) {
                return 1;
            }
        }
        return 0;
    }
}