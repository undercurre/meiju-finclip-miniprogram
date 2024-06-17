import mytab from './mytab'
import home from './home'
import scanDevices from './scanDevices/scanDevices'
import scanHelp from './scanDevices/scanHelp'
import wetChatMiddlePage from './scanDevices/wetChatMiddlePage'
import mideaService from './midea-service/mideaService'
import installation from './midea-service/installation' //安装
import maintenance from './midea-service/maintenance' //维修
import upkeep from './midea-service/upkeep' //保养
import orderList from './midea-service/orderList' //进度查询
import orderDetail from './midea-service/orderDetail' //进度查询
import faultCheck from './midea-service/faultCheck' //故障自查
import serviceCharge from './midea-service/serviceCharge' //收费标准
import serviceChargeTypes from './midea-service/serviceChargeTypes' //收费标准
import serviceWarranty from './midea-service/serviceWarranty' //保修政策
import branchList from './midea-service/branchList' //保修政策
import mideaVirtualPlugin from './mideaVirtualPlugin/mideaVirtualPlugin' //非智原生页面
import myArticleDetails from './packageDiscover/myArticleDetails' //文章富文本
import graphicDetail from './packageDiscover/graphicDetail' //文章视频

import {
  plugin_T0xBX_page_index,
  plugin_T0xBX_page_recipeHome,
  plugin_T0xBX_page_recipeSearch,
  plugin_T0xBX_page_recipeDetail,
  plugin_T0xBX_page_webview,
} from '../config/plugin/T0xBX/entrance'
const trackConfig = [
  mytab,
  home,
  scanDevices,
  mideaService,
  installation, //安装
  maintenance, //维修
  upkeep, //保养
  orderList, //进度查询
  orderDetail, //进度详情
  faultCheck, //故障自查
  serviceCharge, //收费标准
  serviceChargeTypes, //收费标准
  serviceWarranty, //保修政策
  branchList, //网点查询首页
  mideaVirtualPlugin, //非智原生页面
  myArticleDetails,
  graphicDetail,
  scanHelp,
  wetChatMiddlePage,
  plugin_T0xBX_page_index,
  plugin_T0xBX_page_recipeHome,
  plugin_T0xBX_page_recipeSearch,
  plugin_T0xBX_page_recipeDetail,
  plugin_T0xBX_page_webview,
]

export default trackConfig
