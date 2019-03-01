class SoundFactory {
	public static sounds = {};
	public static soundChannels = {};
	public constructor() {
	}
	/** 音效 **/
	public static playSound(res: string, startTime?: number, loops?: number, backFnc: Function = null): SoundBase {
		if (GameSetting.getLocalSetting(GameSetting.SOUND_MUTE)) return;
		var base: SoundBase = this.getSoundByRes(res);
		if (!base.loaded) {
			base.load(function (base: SoundBase) {
				try {
					base.play(startTime, 1, backFnc);
				} catch (e) { };
			})
		} else {
			base.play(startTime, 1, backFnc);
		}
		return base;
	}
	/** 音乐 **/
	public static playMusic(res: string, startTime?: number): SoundBase {
		var base: SoundBase = this.getSoundByRes(res);
		if (!base.loaded) {
			base.load(function (base: SoundBase) {
				if (SoundFactory.soundOpen) {
					base.play(startTime, -1);
				}
				base.volume = 0.4;
			})
		} else {
			if (SoundFactory.soundOpen)
				base.play(startTime, -1);
			else
				base.stop();
		}
		return base;
	}
	/** 停止音乐 **/
	public static stopMusic(res: string): void {
		var base: SoundBase = this.getSoundByRes(res);
		if (base) {
			base.stop();
		}
	}
	private static getSoundByRes(res: string): SoundBase {
		if (this.sounds[res]) {
			return this.sounds[res];
		} else {
			return this.onBuidOneSound(res);
		}
	}
	private static onBuidOneSound(res: string): SoundBase {
		var base = new SoundBase(res);
		this.sounds[res] = base;
		return base;
	}
	/**获取音乐是否可以播放**/
	public static get soundOpen(): boolean {
		return !GameSetting.getLocalSetting(GameSetting.SOUND_MUTE);
	}
}
class SoundBase {
	private _res: string;
	private _sound: egret.Sound;
	private _volume: number = 1;
	private _channel: egret.SoundChannel;

	public loaded: boolean = false;
	public constructor(res: string) {
		this._res = res;
	}
	//加载
	public load(backFnc: Function): void {
		var sound: egret.Sound = this._sound = new egret.Sound();
		//sound 加载完成监听
		sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
			this.loaded = true;
			backFnc.bind(this)(this);
		}, this);
		sound.load(ChannelDefine.cdnUrl + `${SoundDefine.SOUND_RES}${this._res}`);
	}

	//播放
	public play(startTime?: number, loops?: number, backFnc: Function = null): egret.SoundChannel {
		//sound 播放会返回一个 SoundChannel 对象，暂停、音量等操作请控制此对象
		if (!this._channel) {
			this._channel = this._sound.play(startTime, loops);
			this.volume = this._volume;
			this._channel.addEventListener(egret.Event.SOUND_COMPLETE, function (e: egret.Event) {
				if (backFnc) {
					backFnc.bind(this)(this._channel);
				}
			}, this);
		}
		return this._channel;
	}
	//停止
	public stop(): void {
		if (this._channel) {
			this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);

			this._channel.stop();
			this._channel = null;
		}
	}
	//播放完成
	private onComplete(e: egret.Event): void {
		this.stop();
	}
	//调整音量
	public set volume(value) {
		this._volume = value;
		if (this._channel) {
			this._channel.volume = this._volume;
		}
	}
}