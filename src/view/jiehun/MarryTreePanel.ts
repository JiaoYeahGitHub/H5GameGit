/**
 * @author Keith Zhang
 * @description 相思树
 * @date 2018年11月13日
 * @version 1.0
 */
class MarryTreePanel extends BaseTabView {

    //战斗力
    private powerbar: PowerBar
    //相思树名称
    private treeNameLabel: eui.Label
    //经验条
    private expBar: eui.ProgressBar
    //离婚按钮
    private divorceBtn: eui.Button
    //相思互助按钮
    private cooperationBtn: eui.Button
    //浇注按钮
    private upBtn: eui.Button
    //消耗控件
    private consumeBar: ConsumeBar
    //消耗物品容器
    private itemGroup: eui.List
    //升级动画位置
    private upAnimPos: egret.Point = new egret.Point(310, 500)
    //消耗物索引
    private index: number = 0
    //获取途径
    private accessLabel: eui.Label
    //属性文本左
    private attrLeftLabel: eui.Label
    //属性文本右
    private attrRightLabel: eui.Label
    //道具描述
    private descLabel: eui.Label
    //左边组
    private leftGroup: eui.Group
    //右边组
    private rightGroup: eui.Group
    //左边名称
    private leftNameLabel: eui.Label
    //右边名称
    private rightNameLabel: eui.Label
    //红心
    private marryHeart: eui.Image
    //当前等级
    private currentLv = 0
    //展示消耗物品
    private exhibitionItem: ExhibitionItem[];
    //红点
    protected points: redPoint[] = RedPointManager.createPoint(7);
    //消耗物
    private static _costItem
    //伴侣头像
    private partnerHead

    public static get costItem() {
        if (!MarryTreePanel._costItem) {
            MarryTreePanel._costItem = []
            let modelconstant: Modelconstant = JsonModelManager.instance.getModelconstant()['XIANGSISHU_COST_EXP']
            let costStr = modelconstant.value.split("#")
            for (let i = 0; i < costStr.length; ++i) {
                let cost = costStr[i].split(",")
                this.costItem.push(cost[0])
            }
        }
        return MarryTreePanel._costItem
    }

    public constructor(owner) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.MarryTreePanelSkin;
    }

    protected onInit(): void {
        super.onInit();

        // this.powerbar.power_bg.visible = false;

        GameCommon.getInstance().addUnderlineStr(this.accessLabel);
        this.accessLabel.touchEnabled = true;

        this.exhibitionItem = [];

        let modelconstant: Modelconstant = JsonModelManager.instance.getModelconstant()['XIANGSISHU_COST_EXP']
        let costStr = modelconstant.value.split("#")
        for (let i = 0; i < MarryTreePanel.costItem.length; ++i) {
            let item: ExhibitionItem = new ExhibitionItem();
            item.data = MarryTreePanel.costItem[i]
            if (i == 0) {
                item.select = true
            } else {
                item.select = false
            }
            item.x = ((item.width + 30) * i);
            item.name = i + '';
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectItem, this);

            this.itemGroup.addChild(item);
            this.exhibitionItem.push(item);

            this.points[i].register(item, new egret.Point(75, 15), DataManager.getInstance().marryManager, "checkMarryTreeItemPoint", MarryTreePanel.costItem[i]);
        }

        this.points[4].register(this.divorceBtn, GameDefine.RED_CRICLE_STAGE_PRO, DataManager.getInstance().marryManager, 'divorcePoint');
        this.points[5].register(this.cooperationBtn, new egret.Point(75, 15), DataManager.getInstance().marryManager, "checkMarryCooperationPoint");
        this.points[6].register(this.upBtn, GameDefine.RED_BTN_POS, DataManager.getInstance().marryManager, "checkMarryTreeItemPoint", MarryTreePanel.costItem[this.index]);

        this.leftNameLabel.text = this.player.name

        let head = new PlayerHeadPanel()
        head.setHead(this.player.headIndex);//,this.player.headFrameIndex)
        head.x = 15
        head.y = 20
        this.leftGroup.addChild(head)

        var tw = egret.Tween.get(this.marryHeart, { loop: true });
        tw.set({ y: 400, scaleX: 0.1, scaleY: 0.1, alpha: 0 })
        tw.to({ y: 250, scaleX: 1.2, scaleY: 1.2, alpha: 1 }, 1500)
            .wait(500)

        this.refreshDesc()

        this.onRefresh();
    }

    protected onRegist(): void {
        super.onRegist();

        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_UP_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_EXP_RECEIVE_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_EXP_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_PARTNER_INFO_MESSAGE.toString(), this.updatePartner, this);

        this.accessLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this);
        this.divorceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.divorceBtnClick, this);
        this.cooperationBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cooperationBtnClick, this)
        this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.upBtnClick, this);
    }

    protected onRemove(): void {
        super.onRemove();

        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_UP_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_EXP_RECEIVE_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_TREE_EXP_MESSAGE.toString(), this.onUpMessage, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_PARTNER_INFO_MESSAGE.toString(), this.updatePartner, this);

        this.accessLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this);
        this.divorceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.divorceBtnClick, this);
        this.cooperationBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cooperationBtnClick, this)
        this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.upBtnClick, this);
    }

    private onSelectItem(event: egret.Event): void {
        var item: ExhibitionItem = event.currentTarget as ExhibitionItem;
        for (let i = 0; i < this.exhibitionItem.length; ++i) {
            this.exhibitionItem[i].select = false
        }
        this.index = parseInt(item.name)
        this.exhibitionItem[this.index].select = true
        this.consume = MarryTreePanel.costItem[this.index]

        this.refreshDesc()

        this.points[6].param[0] = MarryTreePanel.costItem[this.index]
        this.points[6].checkPoint()
    }

    protected onRefresh(): void {
        super.onRefresh();

        if (this.player.treeLv == 0) {
            let model: Modelxiangsishu = JsonModelManager.instance.getModelxiangsishu()[0]
            //设置经验        
            this.expBar.maximum = model.exp
            //战斗力设置
            this.powerbar.power = 0
            //属性值显示
            this.attrLeftLabel.text = GameDefine.Attr_FontName[ATTR_TYPE.HP] + ":0 \n" + GameDefine.Attr_FontName[ATTR_TYPE.ATTACK] + ":0 \n"
            this.attrRightLabel.text = GameDefine.Attr_FontName[ATTR_TYPE.PHYDEF] + ":0 \n" + GameDefine.Attr_FontName[ATTR_TYPE.MAGICDEF] + ":0 \n"
        } else {

            let currentModel = JsonModelManager.instance.getModelxiangsishu()[this.player.treeLv - 1]
            let nextModel = JsonModelManager.instance.getModelxiangsishu()[this.player.treeLv]
            if (nextModel) {
                //设置经验        
                this.expBar.maximum = nextModel.exp
            } else {
                this.expBar.maximum = 0
            }

            //战斗力设置
            this.powerbar.power = GameCommon.calculationFighting(currentModel.attrAry)
            //属性值显示
            let attrLeftStr: string = ''
            let attrRightStr: string = ''
            let value = 0
            for (let i = 0; i < currentModel.attrAry.length; ++i) {
                value = currentModel.attrAry[i]
                if (value > 0) {
                    if (i > ATTR_TYPE.ATTACK) {
                        attrRightStr += GameDefine.Attr_FontName[i] + "：" + value + '\n'
                    } else {
                        attrLeftStr += GameDefine.Attr_FontName[i] + "：" + value + '\n'
                    }
                }
            }
            this.attrLeftLabel.text = attrLeftStr
            this.attrRightLabel.text = attrRightStr
        }

        //设置相思树名字
        this.treeNameLabel.text = `相思树${this.player.treeLv}级`
        //设置消耗
        this.consume = MarryTreePanel.costItem[this.index]
        //设置经验  
        this.expBar.value = this.player.treeExp

        this.currentLv = this.player.treeLv

        this.trigger()

        if (DataManager.getInstance().marryManager.partnerId != DataManager.getInstance().playerManager.player.marriId) {
            GameCommon.getInstance().sendMsgToServer(new Message(MESSAGE_ID.MARRIAGE_PARTNER_INFO_MESSAGE))
        }
    }

    private onUpMessage() {
        //升级动画
        if (this.player.treeLv > this.currentLv) {
            this.playUpAnimation()
        }
        this.onRefresh()
    }

    private playUpAnimation() {
        GameCommon.getInstance().addAnimation("shengjichenggong", this.upAnimPos, this);
        this.onRefresh();
    }

    private divorceBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MarryDivorcePanel");
        this.points[4].checkPoint();
    }

    private cooperationBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MarryCooperationPanel");
    }
    private upBtnClick() {
        if (DataManager.getInstance().bagManager.getGoodsThingNumById(MarryTreePanel.costItem[this.index]) > 0) {
            let message: Message = new Message(MESSAGE_ID.MARRIAGE_TREE_UP_MESSAGE);
            message.setByte(this.index + 1);
            GameCommon.getInstance().sendMsgToServer(message);
        } else {
            GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(3))
            //this.onAccessClick()
        }
    }

    private onAccessClick() {
        let item = JsonModelManager.instance.getModelitem()[MarryTreePanel.costItem[this.index]]
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), item.gotype);
    }

    private set consume(id) {
        this.consumeBar.setConsume(GOODS_TYPE.ITEM, id);
    }

    private refreshDesc() {
        let model: Modelitem = JsonModelManager.instance.getModelitem()[MarryTreePanel.costItem[this.index]]
        this.descLabel.text = model.des
    }

    private get player(): Player {
        return DataManager.getInstance().playerManager.player
    }

    private updatePartner() {
        if (!this.partnerHead) {
            this.partnerHead = new PlayerHeadPanel()
            this.partnerHead.x = 15
            this.partnerHead.y = 20
            this.rightGroup.addChild(this.partnerHead)
        }
        this.partnerHead.setHead(DataManager.getInstance().marryManager.partnerHead, DataManager.getInstance().marryManager.partnerHeadIndex)
        this.rightNameLabel.text = DataManager.getInstance().marryManager.partnerName
    }

}

class ExhibitionItem extends eui.Component {

    private selectImg: eui.Image
    private name_lab: eui.Label
    private itemImg: eui.Image

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.FuLingItemSkin;
    }
    private onLoadComplete(): void {
        this.selectImg.source = 'item_select_state_png'
        this.selectImg.scaleX = 1.3
        this.selectImg.scaleY = 1.3
        this.selectImg.x = -5
        this.selectImg.y = -20
    }
    public set data(id) {
        let model = JsonModelManager.instance.getModelitem()[id]
        this.name_lab.text = model.name

        if (!this.itemImg) {
            this.itemImg = new eui.Image()
            this.itemImg.x = 5
            this.itemImg.y = 0
            this.addChild(this.itemImg)
        }
        this.itemImg.source = model.icon
    }
    public set select(boolean) {
        this.selectImg.visible = boolean
    }
}