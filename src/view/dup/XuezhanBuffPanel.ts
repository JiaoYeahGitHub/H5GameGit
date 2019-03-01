// TypeScript file
class XuezhanBuffPanel extends BaseWindowPanel {
    private Buff_Consume_List: number[] = [3, 6, 9];

    private curr_star_num: eui.Label;
    private xuezhan_buff_attr: eui.Label;
    private btn_buff_seleted: eui.Button;
    private currSeletedIndex: number = 0;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        super.onInit();
        // if (this.basic["closeBtn1"])
        //     this.basic["closeBtn1"].visible = false;
        // this.setTitle("xuezhan_buff_title_png");
        for (var i: number = 0; i < this.Buff_Consume_List.length; i++) {
            var xuezhanBuffItem: XuezhanBuffItem = this["buff_item" + i];
            xuezhanBuffItem.consumestar = this.Buff_Consume_List[i];
            xuezhanBuffItem.name = i + "";
        }
        this.onRefresh();
    }
    protected onRefresh(): void {
        if (this.currSeletedIndex > 0) {
            var xuezhanBuffItem: XuezhanBuffItem = this["buff_item" + (this.currSeletedIndex - 1)];
            // xuezhanBuffItem.onSelected(false);
        }

        this.currSeletedIndex = 0;
        var xuezhaninfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        this.curr_star_num.text = '' + xuezhaninfo.xuezhanStar;
        this.xuezhan_buff_attr.text = "";
        let buffNum: number = 0;
        for (var i: number = 0; i < xuezhaninfo.attrAddRates.length; i++) {
            var addRateVaule: number = xuezhaninfo.attrAddRates[i];

            if (addRateVaule > 0) {
                if (i > ATTR_TYPE.MAGICDEF) {

                    buffNum = buffNum + 1;
                    if (buffNum == 5) {
                        this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "   \n";
                    }
                    else
                        this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "  ";
                } else {
                    buffNum = buffNum + 1;
                    this.xuezhan_buff_attr.text += GameDefine.Attr_FontName[i] + "+" + addRateVaule + "%  ";
                }

            }
        }
        for (var i: number = 0; i < xuezhaninfo.selectbuffList.length; i++) {
            var xuezhanBuffItem: XuezhanBuffItem = this["buff_item" + i];
            xuezhanBuffItem.data = xuezhaninfo.selectbuffList[i];
        }
    }
    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < this.Buff_Consume_List.length; i++) {
            var xuezhanBuffItem: XuezhanBuffItem = this["buff_item" + i];
            xuezhanBuffItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuffItem, this);
        }
        // this.btn_buff_seleted.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBuff, this);
    }
    private onTouchBuffItem(event: egret.Event): void {
        var xuezhanBuffItem: XuezhanBuffItem = event.currentTarget as XuezhanBuffItem;
        var itemIndex: number = parseInt(xuezhanBuffItem.name);
        if (itemIndex + 1 != this.currSeletedIndex) {
            if (this.currSeletedIndex > 0) {
                // (this["buff_item" + (this.currSeletedIndex - 1)] as XuezhanBuffItem).onSelected(false);
            }
            this.currSeletedIndex = itemIndex + 1;
            // xuezhanBuffItem.onSelected(true);
        }
        var xuezhaninfo: XuezhanInfo = DataManager.getInstance().dupManager.xuezhanInfo;
        if (xuezhaninfo.xuezhanStar < this.Buff_Consume_List[this.currSeletedIndex - 1]) {
            GameCommon.getInstance().addAlert("星数不足无法选择此BUFF");
            return;
        }
        var xuezhanbuffMsg: Message = new Message(MESSAGE_ID.XUEZHAN_BUFF_MESSAGE);
        xuezhanbuffMsg.setByte(this.currSeletedIndex);
        GameCommon.getInstance().sendMsgToServer(xuezhanbuffMsg);
        this.onHide();

    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < this.Buff_Consume_List.length; i++) {
            var xuezhanBuffItem: XuezhanBuffItem = this["buff_item" + i];
            xuezhanBuffItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuffItem, this);
        }
        // this.btn_buff_seleted.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeletedBuff, this);
    }
    // private onSeletedBuff(): void {
    //     if (this.currSeletedIndex == 0) {
    //         GameCommon.getInstance().addAlert("请选择一个加成属性");
    //         return;
    //     }

    // }
    public onHide(): void {
        if (this.currSeletedIndex == 0) {
            GameCommon.getInstance().addAlert("请选择一个加成属性");
            return;
        }
        super.onHide();
    }
    protected onSkinName(): void {
        this.skinName = skins.XuezhanBuffPanelSkin;
    }
    //The end
}
class XuezhanBuffItem extends BaseComp {
    private consume_num_label: eui.Label;
    private buff_txt_icon: eui.Image;
    private attr_desc_label: eui.Label;
    private item_back_img: eui.Image;
    private proName: eui.Label;

    public constructor() {
        super();
        // this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        // this.skinName = skins.XuezhanBuffItemSkin;
    }
    protected onInit(): void {
        if (Tool.isNumber(this._consumeNum)) {
            this.consumestar(this._consumeNum);
        }
    }
    private _consumeNum: number;
    public set consumestar(value) {
        this._consumeNum = value;
        if (this.isLoaded) {
            this.consume_num_label.text = "X" + value;
        }
    }
    // private onTouch(): void {
    //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LIEMING_DOWN));
    // }
    protected dataChanged(): void {
        var buffid: number = this._data;
        var xuezhanbuffModel: Modeldifubuff = JsonModelManager.instance.getModeldifubuff()[buffid];
        var attrobj: string[] = String(xuezhanbuffModel.effect).split(",");
        var attrType: number = parseInt(attrobj[0]);
        var attrValue: number = parseInt(attrobj[1]);
        this.buff_txt_icon.source = "difu_buff" + attrType + "_png";
        if (attrType > ATTR_TYPE.MAGICDEF) {
            this.attr_desc_label.text = attrValue + "";
        } else {
            this.attr_desc_label.text = attrValue + "%";
        }

        this.proName.text = xuezhanbuffModel.name + '+';
    }
    //The end
}