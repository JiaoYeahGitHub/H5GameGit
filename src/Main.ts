//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    protected createChildren(): void {
        super.createChildren();
        //引擎基础配置
        egret.ImageLoader.crossOrigin = "anonymous";//跨域加载
        egret.TextField.default_fontFamily = GameCommon.getFontFamily();//系统默认字体
        eui.Label.default_fontFamily = GameCommon.getFontFamily();//eui默认字体
        RES.setMaxLoadingThread(6);//最大加载线程
        this.stage.maxTouches = 1;//最大触摸点

        this.initialGame();
    }

    private initialGame(): void {
        if ("Windows PC" == egret.Capabilities.os || "Mac OS" == egret.Capabilities.os) {
            DataManager.IS_PC_Game = true;
            this.stage.orientation = egret.OrientationMode.AUTO;
        } else {
            this.stage.orientation = egret.OrientationMode.PORTRAIT;
        }
        this.stage.scaleMode = egret.StageScaleMode.FIXED_NARROW;
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //闪屏
        this.showSplashView();

        this.runGame().catch(e => {
            console.log(e);
        });
    }
    /**
     * 闪屏
     */
    private shanpingImg: egret.Bitmap;
    private async showSplashView() {
        if (!this.shanpingImg) {
            let imageTexture: egret.Texture = await platform.loadImage('resource/game_splash.jpg');
            this.shanpingImg = new egret.Bitmap();
            this.shanpingImg.texture = imageTexture;
            this.shanpingImg.width = this.stage.stageWidth;
            this.shanpingImg.height = this.stage.stageHeight;
            this.addChild(this.shanpingImg);
        }
    }
    private removeSplashView(): void {
        if (this.shanpingImg) {
            if (this.shanpingImg.parent) {
                this.shanpingImg.parent.removeChild(this.shanpingImg);
            }
            this.shanpingImg = null;
        }
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
    }

    private async loadResource() {
        try {
            let resjson: string = platform.isLocalTest() ? "default.res.json" : "ui.res.json";
            let loadError = await RES.loadConfig(resjson, LoadManager.resourceRootUrl);
            if (loadError) {
                this.onLoadConfigError();
            }
            await this.loadTheme();
        } catch (e) {
            this.onLoadConfigError();
        }
    }

    private onLoadConfigError(): void {
        let onComplete = function (): void {
            platform.exit();
        }
        platform.showAlert({
            title: '网络错误',
            content: '网络错误，游戏配置文件加载失败！请重新登录游戏。',
            showCancel: false,
            callback: onComplete
        });
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }
    /**
     * 创建游戏世界
     * Create a game scene
     */
    private gameWorld: GameWorld;
    private createGameScene(): void {
        this.onStageResize();

        this.removeSplashView();
        this.gameWorld = new GameWorld();
        this.gameWorld.stage = this.stage;
        this.addChildAt(this.gameWorld, 0);

        if (window["Egert_Main_Status"] != "Egert_Main_RemoveLoaded") {
            window["Egert_Main_Status"] = "Egert_Main_RemoveLoaded";
        }

        if (DataManager.IS_PC_Game) {
            this.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
        }
    }

    private onStageResize(): void {
        size.width = Math.max(this.stage.stageWidth, GameDefine.GAME_STAGE_WIDTH);
        size.height = Math.max(this.stage.stageHeight, GameDefine.GAME_STAGE_HEIGHT);

        Globar_Pos.x = (size.width - GameDefine.GAME_STAGE_WIDTH) / 2;
        if (this.gameWorld) {
            this.gameWorld.onResize();
        }
    }
}

var size = { width: 0, height: 0 };
var Globar_Pos = { x: 0, y: 0 };