class LegendDefine {
    public static Legend_Num: number = 5;

    //获取特殊技能效果
    public static getLegendRatio(index: number, lv: number): number {
        let eft_ratio: number = 0;
        let model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][lv - 1];
        if (model) {
            eft_ratio = model.gailv;
        }
        return eft_ratio;
    }

    //获取特殊技能效果时间
    public static getLegendEffect(index: number, lv: number): number {
        let effect_time: number = 0;
        let model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][lv - 1];
        if (model) {
            effect_time = model.xiaoguo;
        }
        return effect_time;
    }
    public static getLegendDesc(index: number, lv: number, next: boolean): Object {
        let desc: Array<egret.ITextElement> = new Array<egret.ITextElement>();
        let model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][lv];
        if (next) {
            if (!model) return desc;
            switch (index) {
                case 1:
                    desc.push({ text: '每一次攻击有' })
                    desc.push({ text: Tool.toInt(model.gailv / 100).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '%的概率造成对方眩晕，持续' })
                    desc.push({ text: (model.xiaoguo / 1000).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '秒' })
                    break;
                case 2:
                    desc.push({ text: '死亡后自动复活，恢复最大生命值的' })
                    desc.push({ text: Tool.toInt(model.xiaoguo / 100).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '%' })
                    break;
                case 3:
                    desc.push({ text: '直接忽视对方防御，对其额外造成自身攻击力' })
                    desc.push({ text: (model.xiaoguo / 100).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '%的伤害' })
                    break;
                case 4:
                    desc.push({ text: '增加一层护盾状态，有效吸收对方' })
                    desc.push({ text: (model.xiaoguo / 100).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '%的伤害' })
                    break;
                case 5:
                    desc.push({ text: '每一次攻击有' })
                    desc.push({ text: Tool.toInt(model.gailv / 100).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '%的概率造成对方沉默，只能释放基础剑法持续' })
                    desc.push({ text: (model.xiaoguo / 1000).toString(), style: { textColor: 0x00FF00 } })
                    desc.push({ text: '秒' })
                    break;
            }
        }
        else {
            let str = '';
            let xiaoguo: number;
            let gailv: number;
            if (!model) {
                model = JsonModelManager.instance.getModelshenqi()[index][0];
                xiaoguo = 0;
                gailv = 0;
            }
            else {
                xiaoguo = model.xiaoguo;
                gailv = model.gailv;
            }
            if (model) {
                switch (index) {
                    case 1:
                        str = '每一次攻击有' + Tool.toInt(gailv / 100) + '%的概率造成对方眩晕，持续' + (xiaoguo / 1000) + '秒';
                        break;
                    case 2:
                        str = '死亡后自动复活，恢复最大生命值的' + Tool.toInt(xiaoguo / 100) + '%';
                        break;
                    case 3:
                        str = '直接忽视对方防御，对其额外造成自身攻击力' + xiaoguo / 100 + '%的伤害';
                        break;
                    case 4:
                        str = '增加一层护盾状态，有效吸收对方' + xiaoguo / 100 + '%的伤害';
                        break;
                    case 5:
                        str = '每一次攻击有' + Tool.toInt(gailv / 100) + '%的概率造成对方沉默，只能释放基础剑法持续' + (xiaoguo / 1000) + '秒';
                        break;
                }
            }
            desc.push({ text: str })
        }

        return desc;
    }
    public static getLegendDescByType(type: number, gailv: number, xiaoguo: number, xiaoguo2: number = 0): string{
        let str = "";
        switch (type) {
            case 1:
                str = '每一次攻击有' + Tool.toInt(gailv / 100) + '%的概率造成对方眩晕，持续' + (xiaoguo / 1000) + '秒';
                break;
            case 2:
                str = '死亡后自动复活，恢复最大生命值的' + Tool.toInt(xiaoguo / 100) + '%';
                break;
            case 3:
                str = '直接忽视对方防御，对其额外造成自身攻击力' + xiaoguo / 100 + '%的伤害';
                break;
            case 4:
                str = '增加一层护盾状态，有效吸收对方' + xiaoguo / 100 + '%的伤害';
                break;
            case 5:
                str = '每一次攻击有' + Tool.toInt(gailv / 100) + '%的概率造成对方沉默，只能释放基础剑法持续' + (xiaoguo / 1000) + '秒';
                break;
            case 6:
                str = '战斗开启时，会瞬间降低目标' + (xiaoguo / 100) + '%生命值';
                break;
            case 7:
                str = '仙侣幻化镜像同时释放技能，对目标造成攻击力' + (xiaoguo2 / 100) + '%的伤害';
                break;
            case 8:
                str = '仙侣开启嗜血状态，瞬间提高' + (xiaoguo2 / 100) + '%攻击力造成大幅度伤害';
                break;
            case 9:
                str = '仙侣有' + (xiaoguo / 100) + '%概率造成对方眩晕，同时会降低对方眩晕' + (xiaoguo2 / 100) + '%概率';
                break;
            case 10:
                str = '永久提高' + (xiaoguo / 100) + '%经验和' + (xiaoguo2 / 100) + '%金币产出';
                break;
        }
        return str;
    }
}
//神器类型
enum ARTIFACT_TYPE {
    ARTIFACT_MB = 1,//麻痹
    ARTIFACT_FH = 2,//复活
    ARTIFACT_PJ = 3,//破甲
    ARTIFACT_HD = 4,//护盾
    ARTIFACT_CM = 5,//沉默
    ARTIFACT_KX = 6,//扣血
    ARTIFACT_FS = 7,//分身
    ARTIFACT_SX = 8,//嗜血
    ARTIFACT_KY = 9,//抗晕
    ARTIFACT_JY = 10,//经验和金币加成
}