class ChatChannelCD {
	public id: number;
	public cd: number;
	public isCanDo: boolean = true;
	public constructor(id: number, cd: number) {
		this.reset(id, cd);
	}
	public reset(id: number, cd: number): void {
		this.id = id;
		this.cd = cd;
	}
	public setCanDo(bl: boolean): void {
		this.isCanDo = bl;
	}
	protected onRun(param): void {
		this.isCanDo = true;
	}
	public getCanDo(param = null): boolean {
		var ret: boolean = this.isCanDo;
		if (this.isCanDo) {
			this.isCanDo = false;
			setTimeout(this.onRun.bind(this), this.cd, param);
		}
		return ret;
	}
}