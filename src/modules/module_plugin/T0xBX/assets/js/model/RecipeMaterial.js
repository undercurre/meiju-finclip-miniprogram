class RecipeMaterial {
  constructor({
    id,
    flag,
    createTime,
    updateTime,
    menuId,
    foodtypeId,
    name,
    mainFood,
    weight,
    share,
    materialFoodId,
    materialFoodGram,
    accurateWeight,
    accurateUnit,
    accuratePercent,
    generalWeight,
    generalUnit,
    sort,
  }) {
    this.id = id;
    this.flag = flag;
    this.createTime = createTime;
    this.updateTime = updateTime;
    this.menuId = menuId;
    this.foodtypeId = foodtypeId;
    this.name = name;
    this.mainFood = mainFood;
    this.weight = weight;
    this.share = share;
    this.materialFoodId = materialFoodId;
    this.materialFoodGram = materialFoodGram;
    this.accurateWeight = accurateWeight;
    this.accurateUnit = accurateUnit;
    this.accuratePercent = accuratePercent;
    this.generalWeight = generalWeight;
    this.generalUnit = generalUnit;
    this.sort = sort;
    this.displayWeight = this._displayWeight()
  }

  //仅显示标准单位
  displayAccurateWeight() {
    if (this.accurateWeight && this.accurateWeight.length > 0 && this.accurateUnit && this.accurateUnit.length > 0) {
      let unit = parseInt(this.accurateUnit);

      let suffix = "";
      switch (unit) {
        case 1:
          suffix = "克";
          break;
        case 2:
          suffix = "毫升";
          break;
      }
      return this.accurateWeight + suffix;
    }

    return;
  }

  //仅显示通俗单位

  displayGeneralWeight() {
    // if (this.weight && this.weight.length > 0) {
    //   return this.weight;
    // }

    // get general Unit

    if (this.generalWeight && this.generalWeight.length > 0 && this.generalUnit && this.generalUnit.length > 0) {
      let unit = parseInt(this.generalUnit);

      let suffix = "";
      switch (unit) {
        case 1:
          suffix = "克";
          break;
        case 2:
          suffix = "毫升";
          break;
        case 3:
          suffix = "个";
          break;
        case 4:
          suffix = "根";
          break;
        case 5:
          suffix = "片";
          break;
        case 6:
          suffix = "块";
          break;
        case 7:
          suffix = "颗";
          break;
        case 8:
          suffix = "瓣";
          break;
        case 9:
          suffix = "朵";
          break;
        case 10:
          suffix = "只";
          break;
        case 11:
          suffix = "条";
          break;
        case 12:
          suffix = "包";
          break;
        case 13:
          suffix = "张";
          break;
        case 14:
          suffix = "粒";
          break;
        case 15:
          suffix = "杯";
          break;

        case 16:
          suffix = "茶匙";
          break;

        case 17:
          suffix = "汤匙";
          break;
      }
      return this.generalWeight + suffix;
    }

    return "";
  }

  //一般性单位显示（优先显示通俗单位）
  _displayWeight() {
    if (this.weight && this.weight.length > 0) {
      return this.weight;
    }

    // get general Unit

    if (this.generalWeight && this.generalWeight.length > 0 && this.generalUnit && this.generalUnit.length > 0) {
      let unit = parseInt(this.generalUnit);

      let suffix = "";
      switch (unit) {
        case 1:
          suffix = "克";
          break;
        case 2:
          suffix = "毫升";
          break;
        case 3:
          suffix = "个";
          break;
        case 4:
          suffix = "根";
          break;
        case 5:
          suffix = "片";
          break;
        case 6:
          suffix = "块";
          break;
        case 7:
          suffix = "颗";
          break;
        case 8:
          suffix = "瓣";
          break;
        case 9:
          suffix = "朵";
          break;
        case 10:
          suffix = "只";
          break;
        case 11:
          suffix = "条";
          break;
        case 12:
          suffix = "包";
          break;
        case 13:
          suffix = "张";
          break;
        case 14:
          suffix = "粒";
          break;
        case 15:
          suffix = "杯";
          break;

        case 16:
          suffix = "茶匙";
          break;

        case 17:
          suffix = "汤匙";
          break;
      }
      return this.generalWeight + suffix;
    }

    // get accurate weight

    if (this.accurateWeight && this.accurateWeight.length > 0 && this.accurateUnit && this.accurateUnit.length > 0) {
      let unit = parseInt(this.accurateUnit);

      let suffix = "";
      switch (unit) {
        case 1:
          suffix = "克";
          break;
        case 2:
          suffix = "毫升";
          break;
      }
      return this.accurateWeight + suffix;
    }

    return "";
  }
}

export default RecipeMaterial;
