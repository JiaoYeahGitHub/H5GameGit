/**
 *
 * @author 
 *
 */
class BaseTabButton extends eui.RadioButton {
    private resName: string;
    private labName: string;
    private tab_name: eui.Label;
    private btnImg: eui.Image;
    public constructor(resName: string, labName: string) {
        super();
        this.resName = resName;
        this.labName = labName;
        this.skinName = skins.Common_TabButtonSkin;
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.onLoadComplete();
    }
    private onLoadComplete(): void {
        this.tab_name.text = this.labName;
    }
    public invalidateState(): void {
        super.invalidateState();
        // if (this.resName) {
        //     if (this.currentState == 'up' || this.currentState == 'disabled') {
        //         this.btnImg.source = `${this.resName}_png`;
        //     } else {
        //         this.btnImg.source = `${this.resName}_selected_png`;
        //     }
        // } else {
        //     if (this.currentState == 'up') {
        //         this.btnImg.source = `button_02_png`;
        //     } else {
        //         this.btnImg.source = `button_02_selected_png`;
        //     }
        // }
    }
}
class BaseTabButton2 extends eui.RadioButton {
    private resName: string;
    private labName: string;
    private tab_icon: eui.Image;
    private btnImg: eui.Image;
    private tab_name: eui.Label;
    public constructor(resName: string, labName?: string) {
        super();
        this.resName = resName;
        this.labName = labName;
        this.skinName = skins.Common_TabButtonSkin2;
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.onLoadComplete();
    }
    private onLoadComplete(): void {
        this.tab_name.text = this.labName;
    }
    public invalidateState(): void {
        super.invalidateState();
        // if (this.currentState == 'up' || this.currentState == 'disabled') {
        //     this.btnImg.source = `${this.resName}_png`;
        // }
        // else {
        //     this.btnImg.source = `${this.resName}_selected_png`;
        // }
    }
}
class ActivityButton extends eui.Button {
    private resName: string;
    private tab_icon: eui.Image;

    public constructor(resName: string) {
        super();
        this.resName = resName;
        this.skinName = skins.Common_TabButtonSkin4;
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.onLoadComplete();
    }
    private onLoadComplete(): void {
        this.tab_icon.source = this.resName;
    }
    public invalidateState(): void {
        super.invalidateState();
    }
}
// class GameSkin {
//     public constructor() {
//     }
    // public static getFightWavePromptBar() {
    //     let exmlText: string = `<?xml version="1.0" encoding="utf-8"?>
    //         <e:Skin class="skins.FightWavePromptBarSkin" xmlns:e="http://ns.egret.com/eui" width="350" height="68">
    //             <e:Group>
    //                 <e:Image x="-3" source="login_server_bg3_png" scale9Grid="32,12,155,18"/>
    //                 <e:Label id="part_num_lab" text="1" y="6" fontFamily="SimHei" size="28" stroke="2" horizontalCenter="-10" strokeColor="0x540000" textColor="0xf7f78c"/>
    //             </e:Group>
    //         </e:Skin>`;
    //     return exmlText;
    // }

    // public static getGameLoadingBar(): string {
    //     var exmlText: string = `<?xml version="1.0" encoding="utf-8"?>
    //         <e:Skin class="skins.GameLoadingBar" width="600" height="1080" xmlns:e="http://ns.egret.com/eui"
    //                 xmlns:w="http://ns.egret.com/wing">
    //             <e:Image source="login_bg_jpg" horizontalCenter="0" width="100%"/>
    //             <e:Image source="logo_png" />
	// 			<e:Image source="z_meishuzi_png" horizontalCenter="0" bottom="300"/>
    //             <e:Group horizontalCenter="0" bottom="160">
    //                 <e:Label text="首次加载游戏时间较长，请耐心等待…" fontFamily="Microsoft YaHei" size="22" horizontalCenter="0"
    //                         stroke="1" textColor="0x00fcfc"/>
    //                 <e:Label id="loadtext" text="正在连接服务器.." y="35" fontFamily="Microsoft YaHei" size="22" horizontalCenter="0"
    //                          textColor="0x00fcfc" stroke="1"/>
    //                 <e:ProgressBar id="bar" y="80" horizontalCenter="0" />
    //             </e:Group>
    //             <e:Group bottom="10" horizontalCenter="0" width="270" height="100">
    //                 <e:Scroller width="260" height="90" y="5" horizontalCenter="0">
    //                     <e:Group>
    //                         <e:Group id="enter_name_grp" y="90" horizontalCenter="0">
    //                         </e:Group>
    //                     </e:Group>
    //                 </e:Scroller>
    //             </e:Group>
    //         </e:Skin>`;
    //     return exmlText;
    // }
    // public static getGameLoadingProBar(): string {
    //     var exmlText: string = `<?xml version="1.0" encoding="utf-8"?>
    //         <e:Skin class="skins.GameLoadingProBar" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
    //             <e:Image source="progress_style_preload_png" scale9Grid="77,5,462,37"/>
    //             <e:Image id="thumb" source="progress_thumb_preload_png" scale9Grid="13,10,27,2" verticalCenter="-2" width="520" horizontalCenter="0"/>
    //             <e:Group id="animLayer" touchChildren="false" touchEnabled="false" width="580" horizontalCenter="0" verticalCenter="0"/>
    //         </e:Skin>`;
    //     return exmlText;
    // }
    /**过场动画皮肤**/
    // public static getLoadingMapView(): string {
    //     var exmlText: string = `<?xml version="1.0" encoding="utf-8"?>
    //         <e:Skin class="skins.GuochangView" width="600" height="1080" xmlns:e="http://ns.egret.com/eui"
    //                 xmlns:w="http://ns.egret.com/wing">
    //             <e:Group id="loading_bar" left="0" right="0" top="0" bottom="0">
	// 								<e:Rect strokeColor="0x000000" strokeAlpha="0" left="0" right="0" top="0" bottom="0" fillAlpha="0.6"/>
    //                 <e:Image source="logo_png" y="200" horizontalCenter="0"/>
    //                 <e:Label text="正在载入场景..." y="620" fontFamily="SimHei" size="26" horizontalCenter="0"/>
    //             </e:Group>
    //         </e:Skin>`;
    //     return exmlText;
    // }
    /**头像框皮肤**/
    // private static HeadIconSkin: string;
    // public static getHeadIconBar(): string {
    //     if (!this.HeadIconSkin) {
    //         this.HeadIconSkin = `<?xml version="1.0" encoding="utf-8"?>
    //         <e:Skin class="skins.HeadIconItemSkin" xmlns:e="http://ns.egret.com/eui" width="140" height="130">
    //             <e:Image id="head_icon" horizontalCenter="0"  source="mainview_hero_head0_png" verticalCenter="-20"/>
    //             <e:Image id="head_Frame" horizontalCenter="0" width="90" height="90" source="head_frame_1_png" verticalCenter="-20"/>
    //             <e:Image source="" horizontalCenter="0" scale9Grid="10,10,64,64" width="90" height="90" locked="true" />
    //             <e:Group y="100" horizontalCenter="0">
    //                 <e:Label id="name_label" text="玩家名称" fontFamily="SimHei" size="22" textColor="0x28e828" />
    //                 <e:layout>
    //                     <e:HorizontalLayout/>
    //                 </e:layout>
    //             </e:Group>
    //         </e:Skin>`;
    //     }
    //     return this.HeadIconSkin;
    // }

    // public static getServerButtonSkin1(): string {
    //     var exmlText: string = `<?xml version="1.0" encoding="utf-8" ?>
    //     <e:Skin class="skins.serverBtn" states="up,down" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
	//             <e:Image source="login_server_btn_png" source.down="login_server_btn_up_png" y.down="1"/>
	// 			<e:Label id="labelDisplay" size="22" fontFamily="SimHei" horizontalCenter="0" verticalCenter="0" textColor="0x4c3030"/>
    //     </e:Skin>`;
    //     return exmlText;
    // }
// }
