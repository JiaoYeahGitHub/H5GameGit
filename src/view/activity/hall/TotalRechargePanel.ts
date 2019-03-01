// class TotalRechargePanel extends BaseWindowPanel {
//     private awardLayer: eui.Group;
//     private bmt_total: eui.BitmapLabel;
//     private label_endTime: eui.Label;
//     public constructor(owner: ModuleLayer) {
//         super(owner);
//     }
//     protected onSkinName(): void {
//         this.skinName = skins.TotalRechargePanelSkin;
//     }
//     protected onInit(): void {
//         super.onInit();
//         this.onRefresh();
//     }
//     protected onRegist(): void {
//         super.onRegist();
//         GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
//         this.examineCD(true);
//     }
//     protected onRemove(): void {
//         super.onRemove();
//         GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
//         this.examineCD(false);
//     }
//     public examineCD(open: boolean) {
//         if (open) {
//             Tool.addTimer(this.onCountDown, this, 1000);
//         } else {
//             Tool.removeTimer(this.onCountDown, this, 1000);
//         }
//     }
//     public onCountDown() {
//         // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TOTALRECHARGE);
//         // if (time > 0) {
//         // } else {
//         //     time = 0;
//         //     this.examineCD(false);
//         // }
//         // this.onShowCD(time);
//     }
//     public onShowCD(time: number) {
//         this.label_endTime.text = "活动结束剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
//     }
//     protected onRefresh(): void {
//         this.examineCD(true);
//         var item: TotalRechargeItem;
//         var keys;
//         var type: number;
//         this.awardLayer.removeChildren();
//         var data = JsonModelManager.instance.getModelleijichongzhi();
//         var round: number = DataManager.getInstance().totalRechargeManager.round;
//         for (var key in data) {
//             keys = key.split("_");
//             type = parseInt(keys[0]);
//             if (round == type) {
//                 item = new TotalRechargeItem();
//                 item.onUpdate(data[key]);
//                 this.awardLayer.addChild(item);
//             }

//         }
//         this.bmt_total.text = DataManager.getInstance().totalRechargeManager.total.toString();
//     }
//     private onTouchTab(e: egret.Event): void {
//         var tab: number = parseInt(e.target.value);
//     }
// }
// class TotalRechargeItem extends eui.Component {
//     public awardLayer: eui.Group;
//     private label_progress: eui.Label;
//     public constructor() {
//         super();
//         // this.skinName = skins.TotalRechargeItemSkin;
//     }
//     public onUpdate(model: ModelTotalRecharge) {
//         var award: AwardItem;
//         var goods: GoodsInstance;
//         this.awardLayer.removeChildren();
//         var data = model.goods;
//         for (var i: number = 0; i < data.length; i++) {
//             award = data[i];
//             goods = new GoodsInstance();
//             goods.scaleX = goods.scaleY = 0.8;
//             goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
//             this.awardLayer.addChild(goods);
//         }
//         var total: number = DataManager.getInstance().totalRechargeManager.total;
//         if (total >= parseInt(model.key)) {
//             this.label_progress.text = "已发放";
//         } else {
//             this.label_progress.text = "累计充值￥" + model.key;
//         }

//     }
// }