import { baseImgApi } from '../../../../api'
const app = getApp()
function getIcon(device, iconArr, currApplianceList) {
	let defaultImg = baseImgApi.url + 'scene/sence_img_lack.png';
  let imgPath = '';
  let sn8 = ''
  let deviceModelNumber = ''
  let { applianceType, modelNum, applianceCode } = device;
  applianceType = applianceType || device['type']
	currApplianceList.forEach((item, index) => {
		if(item.applianceCode == applianceCode){
      sn8 = item.sn8 || ''
      deviceModelNumber = item.modelNumber
    }
  });
  if (applianceType == '0x21' && deviceModelNumber) {
    sn8 = deviceModelNumber
  }
  if(applianceType == '0x16'){
    return baseImgApi.url + 'scene/sence_img_light_group.png'
  }
  applianceType = applianceType.split('0x')[1];
  if (iconArr.length === 0) {
    iconArr = app.globalData.dcpDeviceImgList
  }
	let list = iconArr[applianceType] || '';
	let keyName = sn8;
  if(!list){
    return defaultImg
  }
	imgPath = Object.keys(list).includes(keyName) ? list[keyName]['icon'] : list.common.icon;
	return imgPath || defaultImg;
}
function checkEnvironment() {
	return new Promise((resolve, reject) => {
		wx.getNetworkType({
			success(res) {
				console.log('getNetworkType======', res.networkType);
				resolve(res.networkType);
			}
		});
	});
}
module.exports = {
  getIcon,
  checkEnvironment
};
