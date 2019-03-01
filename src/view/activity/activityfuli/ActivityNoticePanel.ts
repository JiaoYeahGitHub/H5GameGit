class ActivityNoticePanel extends BaseTabView {

    private notice_label: eui.Label;
    private notice_scroller: eui.Scroller

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ActivityNoticeSkin;
    }
    protected onInit(): void {
        this.notice_scroller.verticalScrollBar.autoVisibility = false;
        this.notice_scroller.verticalScrollBar.visible = false;
        this.onLoadingNotice();
        this.onRegist();
        this.onRefresh();

    }
    private onLoadingNotice() {
        //创建 URLLoader 对象
        var loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        //添加加载完成侦听
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadNoticeComplete, this);
        //添加加载失败侦听
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
        var url: string = "";
        var noticeVersion: number = Math.random();
        if (SDKManager.getChannel() == EChannel.CHANNEL_WXGAMEBOX) {
			url = ChannelDefine.cdnUrl + "resource/assets/notice/fangkuaiwan.txt?v=" + noticeVersion;
		}
        // if (SDKManager.getChannel() == EChannel.CHANNEL_CRAZY) {
        //     url = "resource/assets/notice/fengkuangyoulechang.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_AWY) {
        //     url = "resource/assets/notice/aiweiyou.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_YYBQUICK) {
        //     url = "resource/assets/notice/yingyongbao.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
        //     url = "resource/assets/notice/localnotice.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_WANBA) {
        //     url = "resource/assets/notice/wanba.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_EGRET) {
        //     url = "resource/assets/notice/bailu.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_360) {
        //     url = "resource/assets/notice/360.txt?v=" + noticeVersion;
        // } else if (SDKManager.getChannel() == EChannel.CHANNEL_QUICK) {
        //     url = "resource/assets/notice/hunfu.txt?v=" + noticeVersion;
        // }else if (SDKManager.getChannel() == EChannel.CHANNEL_QUNHEI) {
		// 	url = "resource/assets/notice/qunhei.txt?v=" + noticeVersion;
		// }else if (SDKManager.getChannel() == EChannel.CHANNEL_SOEZ) {
		// 	url = "resource/assets/notice/soeasy.txt?v=" + noticeVersion;
		// }
        if (url != "") {
            this.setGameNotice("<font color='#FFFF00' size='26'>公告正在加载中...</font>");
            var request: egret.URLRequest = new egret.URLRequest(url);
            //开始加载
            loader.load(request);
        } else {
            this.onHide();
        }
    }
    private onLoadNoticeComplete(event: egret.Event): void {
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var noticeTips: string = <string>loader.data;
        this.setGameNotice(GameCommon.getInstance().readStringToHtml(noticeTips));
    }
    private onLoadError(): void {
        this.setGameNotice("公告内容暂无！");
    }
    private setGameNotice(str: string): void {
        this.notice_label.lineSpacing = 5;
        this.notice_label.textFlow = new egret.HtmlTextParser().parser(str);
    }
    protected onRefresh(): void {
    }
    protected onRegist(): void {
        super.onRegist();//添加事件

    }
    protected onRemove(): void {
        super.onRemove();//移除事件

    }
}