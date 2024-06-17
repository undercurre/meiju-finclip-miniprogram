const mockData = {
  getUserProductPageList: {
    code: 0,
    msg: '操作成功',
    data: {
      endRow: 0,
      firstPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      isFirstPage: true,
      isLastPage: true,
      lastPage: 1,
      list: [
        {
          productModel: '', //	string	产品型号
          productImgUrl: '', //	string	非必须 产品图片
          productBrand: '', //		string	非必须 产品品牌名称
          buyDate: '', //number	  非必须 产品购买日期
          isRead: '', //string	 非必须 是否已读（1 是 0 否）
          cardNo: '', //string	非必须 金卡号
          productName: '', //	string 非必须 iot-家电名称
          userTypeCode: '', //	string 非必须产品大类
          expiryDate: '', //	number  非必须          金卡有效结束日期
          outerOrderId: '', //	string 非必须          订单号
          warrantyPeriod: '', //	number  非必须          质保年限
          streetName: '', //	string  非必须
          street: '', //	string  非必须  安装地址乡镇编码
          electronicCertificateFlag: '', //string 非必须 包修凭证标识
          canYb: '', //	boolean 非必须  是否可以延保
          brand: '', //	number  非必须  用户品牌(1美的，2小天鹅，4布谷)
          productType: '', //	string 非必须  产品品类名称
          productDes: '', //	string  非必须  iot-家电描述
          brandCode: '', //	string 非必须 产品品牌编码
          buyPrice: '', //	number 非必须  产品购买价格
          isIntelligent: '', //	string	  非必须  是否只能产品（1 是 0 否）
          warrantyEndTime: '', //	number	  非必须   包修结束日期
          productId: '', //	number   非必须  产品id
          invoiceImgUrl: '', //	string	 非必须   发票图片(多个用逗号分隔)
          vouchers: {
            //	object []	   非必须   item 类型: object
            voucherName: '', //	string 非必须   订单的商家名称 或 发票开票项目
            productId: '', //	number 非必须  产品id
            voucherType: '', //	string 非必须 凭证类型：1订单、2发票
            voucherId: '', //	string 非必须  订单id或发票id
            voucherAmount: '', //	number 非必须    订单的购买金额或 发票开票金额
            comeFrom: '', //	string 非必须   手用手动关联的还是同步历史产品自动关联的凭证， SELF_MODIFY：手动关联的，系统自动关联显示
            voucherDate: '', //	number  非必须   订单的购买时间或 发票开票日期
            source: '', //	string 非必须  订单来源系统编码 ECM ：电商 O2O ：O2O STOREINVENTORY:线下旗舰店
            voucherCode: '', //  string 非必须    订单号或发票号码
          },
          applianceCode: '', //	number	  非必须  iot-设备id
          userId: '', //	number 非必须   用户id
          productTypeId: '', //	string 非必须  产品品类编码
          serialNo: '', //	string   非必须   sn码
          productAlias: '', //	string 非必须   家电别名
          productCode: '', //	string	 非必须    产品编码
          sourceSys: '', //	string 非必须  来源系统
          userTypeName: '', //	string	  非必须  产品大类名称
          detailAddress: '', //	string  非必须  安装地址详情
          warrantyStandardDesc: '', //	string  非必须  包修标准描述
          warrantyStartTime: '', //	number  非必须  包修开始日期
          effectiveDate: '', //	number  非必须 金卡有效开始日期
          elecWarrantyCardNo: '', //	string  非必须 包修凭证卡号
          warrantyStatus: '', //	number 非必须  保修状态 0未激活包修卡，1保期内，2已过保
          warrantyDay: '', //	number  非必须   保修结束天数
        },
      ],
      navigatePages: 8,
      navigatepageNums: [1],
      nextPage: 0,
      orderBy: '',
      pageNum: 1,
      pageSize: 20,
      pages: 0,
      prePage: 0,
      size: 0,
      startRow: 0,
      total: 0,
    },
  },
}
export { mockData }
