class DupguankaxiaolvPanel extends BaseComp {
	private expLab1: eui.Label;
	private expLab2: eui.Label;
	private qian1: eui.Label;
	private qian2: eui.Label;
	private timer: egret.Timer;
	private num: number = 0;
	private exp: eui.Image;
	private qian: eui.Image;
	private jiantou1: eui.Image;
	private jiantou2: eui.Image;
	private lab1: eui.Label;
	private lab2: eui.Label;
	private expbox: eui.Group;
	private qianbox: eui.Group;
	public constructor(owner: ModuleLayer) {
		super();
	}
	protected setSkinName(): void {
		this.skinName = skins.GuankaxiaolvPanel;
	}
	public onRefresh() {
		this.showdate();
	}
	private showdate() {
		//this.yewai_waveindex_label.text = `第${GameFight.getInstance().yewai_waveIndex}关`;
		if (this.timer == null) {
			this.timer = new egret.Timer(50, 60);
		}
		this.alpha = 1;
		this.num = 0;
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		this.timer.start();
		this.qianbox.x = this.expbox.x;
		if (GameFight.getInstance().yewai_waveIndex >= 2) {
			this.expLab1.text = GameFight.getInstance().getYewaiExp(GameFight.getInstance().yewai_waveIndex - 1) * 720 + "";
			this.qian1.text = GameFight.getInstance().getYewaiGold(GameFight.getInstance().yewai_waveIndex - 1) * 720 + "";

			this.expLab2.text = GameFight.getInstance().getYewaiExp() * 720 + "";
			this.qian2.text = GameFight.getInstance().getYewaiGold() * 720 + "";
		} else {
			this.expLab1.text = 0 + "";
			this.qian1.text = 0 * 720 + "";

			this.expLab2.text = GameFight.getInstance().getYewaiExp() * 720 + "";
			this.qian2.text = GameFight.getInstance().getYewaiGold() * 720 + "";
		}

	}
	private timerFunc(e: egret.TimerEvent) {
		this.num++;
		if (this.num > 50) {
			this.alpha -= 0.2;
		}
	}
	private timerComFunc() {
		if (this.timer) {
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
			this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
			this.timer = null;
		}

		this.onDestory();
	}
	public onDestory(): void {
		super.onDestory();
		if (this.timer) {
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
			this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
			this.timer = null;
		}
	}
	//The end
}