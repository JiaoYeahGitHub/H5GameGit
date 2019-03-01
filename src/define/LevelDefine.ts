/**
 * 
 */
class LevelDefine {
	/**
	 * 转生开启等级
	 */
	public static ZS_ORIGIN_LEVEL: number = 80;
	/**
	 * 炼化最高等级
	 */
	public static MAX_LEVEL_LIANHUA: number = 10;

	public static getLevelByCoatardlv(jingjie: number): number {
		if (jingjie == 0) return 0;
		// let model: Modellevel2coatardLv = JsonModelManager.instance.getModellevel2coatardLv()[jingjie];
		// return model.minLevel;
	}
	/**通过开启天数转换成等级**/
	private static DAY_TO_LEVEL: number[] = [0, 0, 100, 150, 170, 190, 210, 230, 250, 270, 275];
	public static getLevelByOpenDay(day: number): number {
		return day < this.DAY_TO_LEVEL.length ? this.DAY_TO_LEVEL[day] : this.DAY_TO_LEVEL[this.DAY_TO_LEVEL.length - 1];
	}
}