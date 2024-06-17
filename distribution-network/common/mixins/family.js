const paths = require("../../../utils/distribution-network/paths")

const app = getApp()
module.exports = Behavior({
	properties: {},
	options: {
		pureDataPattern: /^_/
	},
	data: {
		_familyPermissionText: {
			addDevice: {
				title: '普通成员不支持添加设备',
				content: '您为当前家庭的普通成员，暂不支持添加设备。请家庭管理员添加设备~',
				confirmText: '我知道了',
			},
			deleteDevice: {
				title: '普通成员不支持删除设备',
				content: '您为当前家庭的普通成员，暂不支持删除设备。请家庭管理员更改角色权限后再试~',
				confirmText: '我知道了',
			},
			updateDevice: {
				title: '普通成员不支持修改名称',
				content: '您为当前家庭的普通成员，暂不支持修改名称。请家庭管理员更改角色权限后再试~',
				confirmText: '我知道了',
			},
      distributionNetwork: {
        title: '普通成员不支持添加设备',
        content: '您为当前家庭的普通成员，暂不支持添加设备。请家庭管理员更改角色权限后再试~',
        confirmText: '返回首页',
      },
		}
	},
	methods: {
		/**
		 * @description 校验用户在此家庭的权限
		 * @param {Object} params （对家庭/设备进行的）操作
		 */
		checkFamilyPermission(params = 'addDevice') {
			const { currentHomeInfo } = app.globalData
      const permissionText = this.data._familyPermissionText[params]
			if (!currentHomeInfo) {
				// wx.navigateTo({
        //   url: paths.index,
        // })
        wx.showToast({
          title: '家庭信息获取失败',
          icon: 'none'
        })
				return false
			}
			// 1001是创建者
			// 1002是管理员
			// 1003是普通成员
			if (currentHomeInfo.roleId === '1003') {
        this.dialog_fail = () => {
          wx.reLaunch({
            url: paths.index,
          })
        }
				this.setData({
          customDialog: {
            isShow: true,
            mainTitle: permissionText.title,
            subTitle: permissionText.content,
            cancelTxt: params == 'distributionNetwork' ? '返回首页' : '我知道了',
            confirmBtnType: 'none',
            defaultClose: !(params == 'distributionNetwork')
          }
				})
				return false
			}
			return true
		}
	}
})
