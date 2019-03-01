abstract class SkillEffectBase implements ISkillEffect {
	public id: number;
	public attackCount: number = 1;
	public param: SkillEffParam;
	public skinNum: number = 0;
	protected isplaying: boolean;
	protected isdestory: boolean;

	public constructor(param: SkillEffParam) {
		this.id = new egret.HashObject().hashCode;
		this.param = param;
	}
	public play(): void {
		this.isplaying = true;
	}
	public end(): void {
		if (this.isplaying) {
			SkillEffectManager.getInstance().onPlayFinishHanlde(this.id);
		}
	}
	public dispose(): void {
		this.isplaying = false;
	}
	public onDestory(): void {
		this.isdestory = true;
		this.dispose();
	}
}