/**
 *
 * @author 
 *
 */
class CreateRole extends eui.Component {
	private gameWorld: GameWorld;
	private imgBG: eui.Image;
	private s_btns: eui.Group[];
	private sex_selecteds: eui.Image[];
	private groups: eui.Group[];

	private enter_name_grp: eui.Group;
	private nameLabel: eui.Label;
	private startBtn: eui.Button;
	private randomBtn: eui.Button;
	private selectHeroIndex: number;//选择的角色编号 0男 1女

	public constructor(world: GameWorld) {
		super();
		this.gameWorld = world;
		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoveToStage, this);
	}

	private onAddToStage(event: egret.Event): void {
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}
		this.height = size.height;
		this.skinName = skins.CreateRoleSkin;
	}

	private onComplete() {
		this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
		this.randomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.randomClick, this);
		this.addEventListener(egret.Event.ENTER_FRAME, this.onTimeDown, this);
		Tool.addTimer(this.onTimeDown, this, 100);

		let _len: number = 2;
		this.s_btns = [];
		this.sex_selecteds = [];
		this.groups = [];
		for (let i: number = 0; i < _len; i++) {
			this.sex_selecteds[i] = this["sex_selected_" + i];
			this.groups[i] = this["group" + i];
			this.s_btns[i] = this['s_btn' + i];
			this.s_btns[i].name = "" + i;
			this.s_btns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHeroBtn, this);
		}

		//初始化进入游戏玩家列表
		let leng: number = 15;
		let names: string[] = [];
		while (leng > names.length) {
			let sex: SEX_TYPE = Math.round(Math.random() * 1);
			let name: string = NameDefine.getRandomPlayerName(false, sex);
			if (names.indexOf(name) >= 0 || this.nameLabel.text == name) {
				continue;
			}
			names.push(name);
			let label: eui.Label = this.createEnterPlayerLab(name);
			label.y = names.length * 20;
			this.enter_name_grp.addChild(label);
		}

		this.onChangeHeroHandler(Tool.randomInt(0, 100) % 2);
		let nickName = SDKManager.loginInfo.nickName;
		if (nickName) {
			this.nameLabel.text = nickName;
		} else {
			this.randomName();
		}
	}
	/**选择人物相关**/
	//点击BTN处理
	private onTouchHeroBtn(event: egret.Event): void {
		let index: number = parseInt(event.currentTarget.name);
		if (this.selectHeroIndex != index) {
			this.onChangeHeroHandler(index);
			this.randomName();
		}
	}
	//切换角色处理
	private onChangeHeroHandler(index: number): void {
		this.selectHeroIndex = index;
		this.imgBG.source = "login_create_bg_" + index + "_jpg";
		for (let i: number = 0; i < 2; i++) {
			this.groups[i].visible = i == index;
			this.sex_selecteds[i].source = "create_sex_bg" + i + (i == index ? "" : "_dis") + "_png";
		}
	}
	/**选择人物END**/
	private randomClick(event: egret.TouchEvent): void {
		this.randomName();
	}
	/**计时器**/
	// private _cloudStamp: number;
	private onTimeDown(): void {
		for (let i: number = 0; i < this.enter_name_grp.numChildren; i++) {
			let label: eui.Label = this.enter_name_grp.getChildAt(i) as eui.Label;
			if (label.y > -100) {
				label.y--;
				if (label.y < -70) {
					label.alpha = Math.max(0, label.alpha - 0.05);
				}
			}
			if (i == this.enter_name_grp.numChildren - 1 && label.y <= -100) {
				for (let n: number = 0; n < this.enter_name_grp.numChildren; n++) {
					let label2: eui.Label = this.enter_name_grp.getChildAt(n) as eui.Label;
					label2.y = n * 20;
					label2.alpha = 1;
				}
			}
		}
	}
	/**更新当前进入游戏的玩家列表**/
	private createEnterPlayerLab(randonName: string): eui.Label {
		let label: eui.Label = GameCommon.getInstance().createNormalLabel(18, 0x665f5c, 0, 0, egret.HorizontalAlign.CENTER);
		label.width = 250;
		let playerName: Array<egret.ITextElement> = new Array<egret.ITextElement>(
			{ text: "玩家  " },
			{ text: randonName, style: { textColor: 0x57aeff } },// sex == SEX_TYPE.MALE ? 0x8CFFFA : 0xFF60FC
			{ text: "  进入游戏" }
		);
		label.textFlow = playerName;
		return label;
	}

	private btnClick(event: egret.TouchEvent): void {
		var info = SDKManager.loginInfo;
		info['iscreate'] = this.selectHeroIndex;

		this.gameWorld.sendCreateRoleMsg(this.nameLabel.text, this.selectHeroIndex);
		DataManager.getInstance().playerManager.player.name = this.nameLabel.text;
		// SDKEgretsa.getInstance().newUsersGuideAccount(`点击创角按钮`);
	}

	private randomName(): void {
		this.nameLabel.text = NameDefine.getRandomPlayerName(false, this.selectHeroIndex);
	}

	private onRemoveToStage(event: egret.Event): void {
		this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
		this.randomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.randomClick, this);
		this.s_btns[0].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHeroBtn, this);
		this.s_btns[1].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHeroBtn, this);
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onTimeDown, this);
		this.enter_name_grp.removeChildren();
	}
}