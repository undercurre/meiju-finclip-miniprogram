const quickDev = {
  quickDevJson2Local(quickDevJson) {
    let local_json = {
      model: quickDevJson.productName,
      subType: parseInt(quickDevJson.productModelNumber),
      functions: {},
      properties: {},
    }

    if (quickDevJson.properties && quickDevJson.properties.length > 0) {
      local_json.properties = {}
      quickDevJson.properties.forEach((propertyItem) => {
        if (propertyItem.settings && propertyItem.settings.length > 0) {
          local_json.properties[propertyItem.settings[0].apiKey] = propertyItem.settings[0].properties.value
        }
      })
    }

    if (quickDevJson.functions && quickDevJson.functions.length > 0) {
      local_json.functions = {}
      quickDevJson.functions.forEach((functionItem) => {
        if (functionItem.settings && functionItem.settings.length > 0) {
          functionItem.settings.forEach((settingItem) => {
            if (!local_json.functions[settingItem.apiKey]) {
              local_json.functions[settingItem.apiKey] = []
            }
            local_json.functions[settingItem.apiKey].push({
              bindValue: settingItem.properties.bindValue,
              defaultValue: settingItem.properties.defaultValue,
              list: settingItem.properties.list,
            })
          })
        }
      })
    }

    return local_json
  },
}
export default quickDev
