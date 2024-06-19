const quickDev = {
  quickDevJson2Local(quickDevJson) {
    const { productName, productModelNumber, functions, properties } = quickDevJson;
    const object = {};
    object.model = productName;
    object.subType = productModelNumber;
    object.para = functions.map(({ settings }) => {
      const [{ properties }] = settings;
      if (properties.valueList) {
        properties.valueList = properties.valueList.map((item) => item.item);
        if (properties.valueList[0] == "") {
          properties.valueList = null;
        }
      }
      if (properties.displayList) {
        properties.displayList = properties.displayList.map(
          (item) => item.item
        );
        if (properties.displayList[0] == "") {
          properties.displayList = null;
        }
      }
      if (properties.valueListBind) {
        properties.valueListBind = properties.valueListBind.map(
          (item) => item.item
        );
        if (properties.valueListBind[0] == "") {
          properties.valueListBind = null;
        }
      }
      if (properties.displayListBind) {
        properties.displayListBind = properties.displayListBind.map(
          (item) => item.item
        );
        if (properties.displayListBind[0] == "") {
          properties.displayListBind = null;
        }
      }
      if (settings.length == 1) {
        return properties;
      } else {
        settings.shift();
        settings.forEach((item, index) => {
          // 还是不用循环去判断了
          if (
            item.properties.list &&
            item.properties.list[0].title &&
            item.properties.list[0].img
          ) {
            properties[item.properties.distKey] = item.properties.list;
          } else if (item.properties.array && item.properties.array[0].item) {
            properties[item.properties.distKey] = item.properties.array.map(
              (item) => {
                return item.item.split(",");
              }
            );
          } else if (
            item.properties.FDBindControl &&
            item.properties.FDBindControl[0].control
          ) {
            properties[item.properties.distKey] =
              item.properties.FDBindControl;
          }
        });
        return properties;
      }
    });
    properties && properties.forEach(p=>{
      if (p && p.settings && p.settings[0] && p.settings[0].apiKey == 'hasMainPic') {
        object.hasMainPic = p.settings[0].properties.value
      } else if (p && p.settings && p.settings[0] && p.settings[0].apiKey == 'hasTank') {
        object.hasTank = p.settings[0].properties.value
      } else if (p && p.settings && p.settings[0] && p.settings[0].apiKey == 'hasAIAdjust') {
        object.hasAIAdjust = p.settings[0].properties.value
      } else if (p && p.settings && p.settings[0] && p.settings[0].apiKey == 'wetCurtainBuyLink') {
        object.wetCurtainBuyLink = p.settings[0].properties.value
      }
    })
    return object;
  },
}
export default quickDev
