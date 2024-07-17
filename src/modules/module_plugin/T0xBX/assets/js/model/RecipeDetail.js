import RecipeMaterial from './RecipeMaterial';

const MikeMenuDifficulty = {
  Easy: {
    name: "入门",
    type: "1,2",
  },
  Medium: {
    name: "中级",
    type: "3,4",
  },
  Professional: {
    name: "专家级",
    type: "5",
  },
};

class RecipeDetail {
  constructor({
    abstruct,
    costTimeHour,
    costTimeMin,
    costTimeSec,
    id,
    menuCode,
    level,
    materials,
    name,
    picUrl,
    person,
    steps
  }) {
    this.abstruct = abstruct;
    this.costTimeHour = costTimeHour;
    this.costTimeMin = costTimeMin;
    this.costTimeSec = costTimeSec;
    this.costTime = this.costTime();
    this.id = id;
    this.menuCode = menuCode;
    this.level = level;
    this.level = this.difficulty();
    this.materials = this._getMaterial(materials);
    this.name = name;
    this.person = person;
    this.picUrl = picUrl;
    this.steps = steps;
  }

  costTime() {
    let hour = parseInt(this.costTimeHour);
    let minute = parseInt(this.costTimeMin);
    let second = parseInt(this.costTimeSec);

    return (hour && hour > 0 ? hour + "小时" : "") + (minute && minute > 0 ? minute + "分钟" : "") + (second && second > 0 ? second + "秒" : "");
  }

  difficulty() {
    if (!this.level || this.level.length <= 0) {
      return;
    }

    let level = Number(this.level).toString();

    let str = "";
    Object.keys(MikeMenuDifficulty).forEach((key) => {
      let includedTypes = MikeMenuDifficulty[key].type;
      if (includedTypes.indexOf(level) >= 0) {
        str = MikeMenuDifficulty[key].name;
      }

      // if (MikeMenuDetailDifficulty[key].type === level) {
      //   str = MikeMenuDetailDifficulty[key].name;
      // }
    });

    return str;
  }

  _getMaterial(materials) {
    return materials && materials.length > 0 ?
    materials.map((item) => {
        return new RecipeMaterial(item);
      })
    : materials;
  }

  getMaterial() {
    return this.materials && this.materials.length > 0 ?
    this.materials.filter((item) => {
        return item.mainFood === 1;
      })
    : [];
  }
}

export default RecipeDetail;