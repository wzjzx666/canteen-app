"use strict";
const common_vendor = require("../common/vendor.js");
const api_common = require("./common.js");
const Config = {
  domain: api_common.common.getBaseUrl(),
  token: void 0,
  tenantId: "000000",
  appid: "saber",
  appkey: "saber_secret"
};
const stringToBase64 = function(str) {
  return base64_encode(str);
};
function base64_encode(str) {
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var i = 0, len = str.length, string = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 255;
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt((c1 & 3) << 4);
      string += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
      string += base64EncodeChars.charAt((c2 & 15) << 2);
      string += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    string += base64EncodeChars.charAt(c1 >> 2);
    string += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
    string += base64EncodeChars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6);
    string += base64EncodeChars.charAt(c3 & 63);
  }
  return string;
}
async function apiReq(url, data, options = {}) {
  const {
    showLoading = true,
    loadingText = "加载中...",
    method = "POST",
    type = 0
  } = options;
  if (showLoading) {
    common_vendor.index.showLoading({
      title: loadingText,
      mask: true
    });
  }
  const auth = stringToBase64(`${Config.appid}:${Config.appkey}`);
  try {
    const response = await common_vendor.index.request({
      url: url.startsWith("http") ? url : Config.domain + url,
      data,
      header: {
        "Blade-Auth": common_vendor.index.getStorageSync("token") || "",
        "Authorization": "Basic " + auth,
        "Tenant-Id": Config.tenantId,
        "content-type": type === 0 ? "application/json" : "application/x-www-form-urlencoded"
      },
      method
    });
    console.log("denglu", response);
    const responseData = response.data;
    if (responseData.error) {
      console.log("400错误", responseData.error);
      if (responseData.error_description == "Bad credentials") {
        common_vendor.index.showToast({
          icon: "none",
          title: "账号或密码错误，请联系管理员",
          duration: 1500
        });
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: responseData.error_description,
          duration: 1500
        });
      }
      return;
    }
    if (responseData.access_token && responseData.token_type) {
      common_vendor.index.setStorageSync("token", `${responseData.token_type} ${responseData.access_token}`);
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
      return responseData;
    }
    if (responseData.code === 200 || responseData.code === 400) {
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
      return responseData;
    } else if (responseData.code === 401) {
      console.log("401进来了", responseData);
      common_vendor.index.setStorageSync("token", "");
      common_vendor.index.setStorageSync("roleName", "");
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
    } else if (responseData.code === 500) {
      common_vendor.index.showToast({
        icon: "none",
        title: responseData.msg,
        duration: 1500
      });
    } else {
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
    }
  } catch (error) {
    console.error(error);
    if (showLoading) {
      common_vendor.index.hideLoading();
    }
  }
}
async function apiReqFile(url, data, options = {}) {
  const {
    showLoading = true,
    loadingText = "加载中...",
    method = "POST",
    type = 0
  } = options;
  if (showLoading) {
    common_vendor.index.showLoading({
      title: loadingText,
      mask: true
    });
  }
  const auth = stringToBase64(`${Config.appid}:${Config.appkey}`);
  try {
    const response = await common_vendor.index.downloadFile({
      url: url.startsWith("http") ? url : Config.domain + url,
      data,
      header: {
        "Blade-Auth": common_vendor.index.getStorageSync("token") || "",
        "Authorization": "Basic " + auth,
        "Tenant-Id": Config.tenantId,
        "content-type": type === 0 ? "application/json" : "application/x-www-form-urlencoded"
      },
      method
    });
    console.log(response, "测试");
    if (response.statusCode == 200) {
      common_vendor.index.hideLoading();
      return response;
    }
    const responseData = response.data;
    if (responseData.error) {
      common_vendor.index.showToast({
        icon: "none",
        title: responseData.error_description
      });
      return;
    }
    if (responseData.access_token && responseData.token_type) {
      common_vendor.index.setStorageSync("token", `${responseData.token_type} ${responseData.access_token}`);
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
      return responseData;
    }
    if (responseData.code === 200 || responseData.code === 400) {
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
      return responseData;
    } else if (responseData.code === 401) {
      common_vendor.index.setStorageSync("token", "");
      common_vendor.index.navigateTo({
        url: "/pages/login1/login"
      });
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
    } else {
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
    }
  } catch (error) {
    console.error(error);
    if (showLoading) {
      common_vendor.index.hideLoading();
    }
  }
}
const api = {
  config: Config,
  /*登录接口*/
  login(data) {
    return apiReq("/rs-app/app/login", data);
  },
  loginProd(data) {
    return apiReq("/blade-auth/oauth/token", data, {
      method: "POST",
      type: 1
    });
  },
  //获取openid
  wxgetopenid(data) {
    return apiReq("/blade-meshing/wx/get/openid", data, {
      method: "GET",
      type: 1
    });
  },
  // 发起案件审批
  // caseAudit(data){
  // 	return apiReq('/rs-app/mediationHouse/publish', data);
  // },
  //案件列表,已通
  caseList(data) {
    return apiReq("/rs-app/simpleDispute/page", data, {
      method: "GET",
      type: 1
    });
  },
  //管理员审核列表,已通
  examine(data) {
    return apiReq("/rs-app/simpleDispute/getAllSimpleDispute", data, {
      method: "GET",
      type: 1
    });
  },
  //案件数量比率用户，已通
  caseNumAdmin(data) {
    return apiReq("/rs-app/simpleDispute/count/admin", data, {
      method: "GET",
      type: 1
    });
  },
  //案件数量比率用户，已通
  caseNumUser(data) {
    return apiReq("/rs-app/simpleDispute/count/user", data, {
      method: "GET",
      type: 1
    });
  },
  //新增调解人员，已通
  addPerson(data) {
    return apiReq("/rs-app/mediators/submit", data, {
      method: "POST",
      type: 0
    });
  },
  //获取组织列表，已通
  parentList(data) {
    return apiReq("/rs-app/blade-unit/parentList", data, {
      method: "GET",
      type: 1
    });
  },
  //获取部门列表，已通
  department(data) {
    return apiReq("/rs-app/blade-unit/parent", data, {
      method: "GET",
      type: 1
    });
  },
  //新增案件,已通
  addCase(data) {
    return apiReq("/rs-app/mediationHouse/publish", data, {
      method: "POST",
      type: 0
    });
  },
  //消息列表,已通
  message(data) {
    return apiReq("/rs-app/message/page", data, {
      type: 1
    });
  },
  //消息监听
  listenMessage(data) {
    return apiReq("/rs-app/message/new", data, {
      method: "POST",
      type: 1,
      showLoading: false
    });
  },
  //获取某个部门里面的人员列表,已通
  people(data) {
    return apiReq("/rs-app/mediators/deptList", data, {
      method: "GET",
      type: 1
    });
  },
  //删除人员,已通
  delectPerson(data) {
    return apiReq("/rs-app/mediators/remove", data, {
      method: "POST",
      type: 1
    });
  },
  //调解人员列表,已通
  mediatorsList(data) {
    return apiReq("/rs-app/mediators/list", data, {
      method: "POST",
      type: 1
    });
  },
  // 批量导入人员，已通
  import(data) {
    return apiReq("/blade-system/user/import-user", data, {
      method: "POST",
      type: 0
    });
  },
  //我的案件-用户，已通
  mycaseUser(data) {
    return apiReq("/rs-app/simpleDispute/getPartSimpleDispute", data, {
      method: "GET",
      type: 1
    });
  },
  //删除已发布案件，500
  delCase(data) {
    return apiReq("/rs-app/simpleDispute", data, {
      method: "DELETE",
      type: 1
    });
  },
  //编辑案件
  edite(data) {
    return apiReq("/rs-app/simpleDispute", data, {
      method: "PUT",
      type: 0
    });
  },
  //指定调解员
  updateCase(data) {
    return apiReq("/rs-app/simpleDispute", data, {
      method: "PUT",
      type: 0
    });
  },
  //结案申请，
  endCase(data) {
    return apiReq("/rs-app/simpleDisputeHandel/closeCase", data, {
      method: "POST",
      type: 0
    });
  },
  //接案，已通，
  getCase(data) {
    return apiReq("/rs-app/simpleDispute/accept", data, {
      method: "GET",
      type: 1
    });
  },
  //通过id查询人员的详细信息,已通
  personInfo(data) {
    return apiReq("/rs-app/mediators/info", data, {
      method: "GET",
      type: 1
    });
  },
  //已接单案件详情,已通
  caseDetail(data) {
    return apiReq("/rs-app/simpleDispute/show-handel", data, {
      method: "GET",
      type: 1
    });
  },
  //案件已发布列表
  publishedCasePage(data) {
    return apiReq("/rs-app/simpleDispute/published-case-page", data, {
      method: "GET",
      type: 1
    });
  },
  //案件管理-全部案件
  publishedCase(data) {
    return apiReq("/rs-app/simpleDispute/published-case", data, {
      method: "GET",
      type: 0
    });
  },
  //保存为草稿,已通
  saveDraft(data) {
    return apiReq("/rs-app/mediationHouse/saveDraft", data, {
      method: "POST",
      type: 0
    });
  },
  //管理员审核，暂未开始
  check(data) {
    return apiReq("/process/completeTask", data, {
      method: "POST",
      type: 1
    });
  },
  //局长列表
  Director(data) {
    return apiReq("/rs-app/mediators/getDirector", data, {
      method: "GET",
      type: 1
    });
  },
  //下载文件
  downloadFile(data) {
    return apiReq("/blade-resource/oss/endpoint/download", data, {
      method: "GET",
      type: 1
    });
  },
  //查看全部审核
  AllCase(data) {
    return apiReq("/blade-workflow/process/myAllCase", data, {
      method: "GET",
      type: 1
    });
  },
  //我的待审核
  todoList(data) {
    return apiReq("/blade-workflow/process/todoList", data, {
      method: "GET",
      type: 1
    });
  },
  //我的已通过
  myPassList(data) {
    return apiReq("/blade-workflow/process/myPassList", data, {
      method: "GET",
      type: 1
    });
  },
  //我的已驳回
  myRejectList(data) {
    return apiReq("/blade-workflow/process/myRejectList", data, {
      method: "GET",
      type: 1
    });
  },
  //增加协助调解员
  addFacilitator(data) {
    return apiReq("/rs-app/mediators/addFacilitator", data, {
      method: "POST",
      type: 1
    });
  },
  //同意驳回（协助调解员和结案申请）
  addFacilitatorAgree(data) {
    return apiReq("/blade-workflow/process/completeTask", data, {
      method: "POST",
      type: 0
    });
  },
  //申请置换调解书
  applyChangeBook(data) {
    return apiReq("/rs-app/simpleDisputeHandel/conciliationStatement", data, {
      method: "POST",
      type: 1
    });
  },
  //申请置换调解书
  approveConciliationStatement(data) {
    return apiReq("/rs-app/simpleDisputeHandel/approveConciliationStatement", data, {
      method: "POST",
      type: 0
    });
  },
  //待审核撤回 以前备注：/blade-workflow/process/withdraw
  withdraw(data) {
    return apiReq("/rs-app/simpleDispute/withdraw", data, {
      method: "POST",
      type: 1
    });
  },
  //待审核撤回2
  withdraw2(data) {
    return apiReq("/simpleDispute/withdraw", data, {
      method: "POST",
      type: 1
    });
  },
  //我的待审核（管理员）
  approvalList(data) {
    return apiReq("/blade-workflow/process/approvalList", data, {
      method: "GET",
      type: 1
    });
  },
  //已发布案件撤回/mediationHouse/withdrawDraft
  withdrawDraft(data) {
    return apiReq("/blade-workflow/mediationHouse/withdrawDraft", data, {
      method: "POST",
      type: 1
    });
  },
  //判断是否可以进行结案
  omittingProcess(data) {
    return apiReq("/blade-workflow/process/omittingProcess", data, {
      method: "GET",
      type: 1
    });
  },
  //管理调解人员
  contactsConciliation(data) {
    return apiReq("/rs-app/contacts/conciliation", data, {
      method: "GET",
      type: 1
    });
  },
  //通过名字或者组织进行查询
  contacts(data) {
    return apiReq("/rs-app/contacts", data, {
      method: "GET",
      type: 1
    });
  },
  //通过组织或者人员进行查询(通讯录部分)
  contactsQuery(data) {
    return apiReq("/rs-app/contacts/query", data, {
      method: "GET",
      type: 1
    });
  },
  //通过id查询下面的部门或人员
  contactsQueryId(data) {
    return apiReq("/rs-app/contacts/queryId", data, {
      method: "GET",
      type: 1
    });
  },
  //查询输入部门下面的人员列表
  contactsShowWorker(data) {
    return apiReq("/rs-app/contacts/show-worker", data, {
      method: "GET",
      type: 1
    });
  },
  // 发布通知
  postNotice(data) {
    return apiReq("/rs-app/message/insert-list", data, {
      method: "POST",
      type: 0
    });
  },
  getDownloadUrl(data) {
    return apiReq("/blade-resource/oss/endpoint/template?templateEnum=RS_CASE_ADD_TEMPLATE", data, {
      method: "GET",
      type: 1
    });
  },
  //获取统计分析数据
  getTongJiFenxiList(data) {
    return apiReq("/rs-app/stats-rs/merge", data, {
      method: "POST",
      type: 0
    });
  },
  //获取下载链接 /blade-resource/oss/endpoint/preview
  getDownloadUrlProd(data) {
    return apiReq("/blade-resource/oss/endpoint/preview", data, {
      method: "GET",
      type: 1
    });
  },
  //修改密码 *
  updatePassword(data) {
    return apiReq("/blade-system/user/update-password", data, {
      method: "POST",
      type: 1
    });
  },
  ///////////////////////////////矛调新版prod//////////////////////////////////////////////
  // 查询所有日程 *
  scheduleList(data) {
    return apiReq("/rs-app/schedule/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 新增日程 *
  scheduleAdd(data) {
    return apiReq("/rs-app/schedule", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改日程
  scheduleEdit(data) {
    return apiReq("/rs-app/schedule", data, {
      method: "PUT",
      type: 0
    });
  },
  // 删除日程
  scheduleDelete(data) {
    return apiReq("/rs-app/schedule", data, {
      method: "DELETE",
      type: 1
    });
  },
  // 日程详情 *
  scheduleDetail(data) {
    return apiReq("/rs-app/schedule", data, {
      method: "GET",
      type: 1
    });
  },
  // 关联纠纷 *
  dispute(data) {
    return apiReq("/rs-app/contradiction/related-disputes", data, {
      method: "GET",
      type: 0
    });
  },
  // 一日双训tab切换 *
  yiRiTaskList(data) {
    return apiReq("/blade-meshing/task/app-double-list", data, {
      method: "GET",
      type: 1
    });
  },
  // 治安巡防tab切换 *
  zhiAnTaskList(data) {
    return apiReq("/blade-meshing/task/app-security-list", data, {
      method: "GET",
      type: 1
    });
  },
  // 新增任务
  // addPatrol(data) {
  // 	return apiReq('/blade-meshing/task', data, {
  // 		method: 'POST',
  // 		type: 0
  // 	})
  // },
  // 添加巡防任务 *
  addPatrol(data) {
    return apiReq("/blade-meshing/task/app", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改巡防 *
  alterPatrol(data) {
    return apiReq("/blade-meshing/task", data, {
      method: "PUT",
      type: 0
    });
  },
  // 更新巡逻轨迹经纬度
  continuePosition(data) {
    return apiReq("/blade-meshing/task/edit/location", data, {
      method: "PUT",
      type: 0,
      showLoading: false
    });
  },
  //-------------------------------巡防详情接口------------------------------
  // 获取巡防详情 *
  securityInfo(id) {
    return apiReq("/blade-meshing/task/Wx/" + id, {}, {
      showLoading: false,
      method: "GET",
      type: 1
    });
  },
  //获取巡防事件列表 *
  GetIssueList(data) {
    console.log({
      data
    });
    return apiReq("/blade-meshing/task/getIssueS", data, {
      method: "GET",
      type: 1
    });
  },
  //获取巡防动态列表 *
  GetTrackList(data) {
    return apiReq("/blade-meshing/track/list", data, {
      method: "GET",
      type: 1
    });
  },
  //获取事件类型标签 *
  GetTagList(data) {
    return apiReq("/blade-meshing/tag/list", data, {
      method: "GET",
      type: 1
    });
  },
  //获取事件类型标签 *
  GetTagDetail(data) {
    return apiReq("/blade-meshing/tag/" + data, {}, {
      method: "GET",
      type: 1
    });
  },
  //添加事件 *
  AddTask(data) {
    return apiReq("/blade-meshing/issue", data, {
      method: "POST",
      type: 0
    });
  },
  //上传附件
  uploadAccessory(data) {
    return apiReq("/blade-meshing/task_attach_file/upload_files", data, {
      method: "POST",
      type: 0
    });
  },
  //新增动态 *
  addTrack(data) {
    return apiReq("/blade-meshing/track", data, {
      method: "POST",
      type: 0
    });
  },
  // 巡逻组列表 *
  GetGroupList(data) {
    return apiReq("/blade-meshing/group/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取巡逻队员
  getGroupPeople(data) {
    return apiReq("/blade-meshing/member/getMyPatrolTeammate", data, {
      method: "GET",
      type: 1
    });
  },
  // 常用功能列表
  getFunctionList(data) {
    return apiReq("/rs-app/mt-self-function/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 常用功能列表 *
  getMPFunctionList(data) {
    return apiReq("/blade-system/menu/buttons", data, {
      method: "GET",
      type: 1
    });
  },
  // 用户信息 *
  getUserInfo(data) {
    return apiReq("/blade-system/user/info", data, {
      method: "GET",
      type: 1
    });
  },
  // 单位场所列表获取 *
  getPlaceList(data) {
    return apiReq("/blade-meshing/sg_unit_premises/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 单位和场所详情获取 *
  getPlaceOrUnitDetail(id) {
    return apiReq("/blade-meshing/sg_unit_premises/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 单位场所新增 *
  postPlaceOrUnit(data) {
    return apiReq("/blade-meshing/sg_unit_premises", data, {
      method: "POST",
      type: 0
    });
  },
  // 单位场所修改 *
  PUTPlaceOrUnit(data) {
    return apiReq("/blade-meshing/sg_unit_premises", data, {
      method: "PUT",
      type: 0
    });
  },
  // 单位场所删除 *
  DeletePlaceOrUnit(id) {
    return apiReq("/blade-meshing/sg_unit_premises/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 单位场所删除 *
  todoComplete(data) {
    return apiReq("/blade-meshing/todo/gather/complete", data, {
      method: "POST",
      type: 1
    });
  },
  // 人口筛选 *
  populationFilter(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 根据网格查人口列表
  getDeptPopList(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/deptPop", data, {
      method: "GET",
      type: 1
    });
  },
  // 人口详情 *
  getPopulationDetail(id) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 新增人口 *
  PostPopulation(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改人口信息 *
  PutPopulationDetail(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info", data, {
      method: "PUT",
      type: 0
    });
  },
  // 删除与人口关联的房屋地址
  delHouseForPop(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/tombstone", data, {
      method: "DELETE",
      type: 1
    });
  },
  // 新增房屋 *
  PostHouse(data) {
    return apiReq("/blade-meshing/wg-base-house-rent-info", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改实有人口房屋
  houseRel(data) {
    return apiReq("/blade-meshing/wg-base-house-rel", data, {
      method: "PUT",
      type: 0
    });
  },
  // 新增房屋关联 *
  PostHouseRel(data) {
    return apiReq("/blade-meshing/wg-base-house-rel", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改房屋信息 *
  Puthouse(data) {
    return apiReq("/blade-meshing/wg-base-house-rent-info", data, {
      method: "PUT",
      type: 0
    });
  },
  // 房屋筛选 *
  houseFilter(data) {
    return apiReq("/blade-meshing/wg-base-house-rent-info/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 房屋详情获取 *
  getHouseDetail(id) {
    return apiReq("/blade-meshing/wg-base-house-rent-info/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 获取与房屋关联的人口信息 *
  getHosuePopInfo(id) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/house-pop-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 根据地址ID获取实有人口信息
  getHousePopInfoByAddressId(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/list/addr/id", data, {
      method: "GET",
      type: 1
    });
  },
  // 一日双训计数 *
  getNumberYiRi(data) {
    return apiReq("/blade-meshing/task/app-count-double", data, {
      method: "GET",
      type: 1
    });
  },
  // 治安巡防计数 *
  getNumberZhiAn(data) {
    return apiReq("/blade-meshing/task/app-count-security", data, {
      method: "GET",
      type: 1
    });
  },
  // 标准地址列表获取(获取对应的楼栋下的户数据) || 也用于获取其他地址 *
  getStandardAddressList(data) {
    return apiReq("/blade-meshing/standard-addr-info/list", data, {
      method: "GET",
      type: 1
    });
  },
  //删除小区、组数据
  countrysideremove(id) {
    return apiReq("/blade-meshing/sa/v2/countryside/remove/" + id, {}, {
      method: "DELETE",
      type: 1
    });
  },
  //逻辑删除地址
  sav2(id) {
    return apiReq("/blade-meshing/sa/v2/" + id, {}, {
      method: "DELETE",
      type: 1
    });
  },
  //编辑其它地址
  editotheraddress(data) {
    return apiReq("/blade-meshing/sa/v2/edit/other/address", data, {
      method: "PUT",
      type: 0
    });
  },
  getStandardAddressDetailList(data) {
    return apiReq("/blade-meshing/standard-addr-info/detail/list", data, {
      method: "GET",
      type: 1
    });
  },
  //-新增小区其它地址
  createcommunity(data) {
    return apiReq("/blade-meshing/sa/v2/create/community", data, {
      method: "POST",
      type: 0
    });
  },
  //根据小区ID查询小区其它地址总数
  othercount(id) {
    return apiReq("/blade-meshing/standard-addr-info/community/other/count/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  //小区楼栋或组统计
  getstandardaddrinfosta(data) {
    return apiReq("/blade-meshing/standard-addr-info/sta", data, {
      method: "GET",
      type: 1
    });
  },
  // 标准地址详情获取 || 也用于获取其他地址详情 *
  getOtherAddressDetail(id) {
    return apiReq("/blade-meshing/standard-addr-info/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // // 标准地址列表获取(获取对应的楼栋下的户数据)
  // getStandardAddressList(data) {
  //   return apiReq('/blade-meshing/standard-addr-info/list', data, {
  //     method: 'GET',
  //     type: 1
  //   })
  // },
  // 标准地址列表获取（分为小区、组）*
  getStandardAddressListXiaoQu(data) {
    return apiReq("/blade-meshing/wg_addr_res_qus/list", data, {
      method: "GET",
      type: 1
    });
  },
  //标准地址列表获取新版2025（分为小区、组）
  getwgaddrquspage(data) {
    return apiReq("/blade-meshing/wg_addr_res_qus/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取小区组的详情（分为小区、组）*
  getXiaoQuDetail(id) {
    return apiReq("/blade-meshing/wg_addr_res_qus/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 修改小区组的详情（分为小区、组）*
  putXiaoQuDetail(data) {
    return apiReq("/blade-meshing/wg_addr_res_qus", data, {
      method: "PUT",
      type: 0
    });
  },
  // 标准地址其他地址修改 *
  putOtherDetail(data) {
    return apiReq("/blade-meshing/standard-addr-info", data, {
      method: "PUT",
      type: 0
    });
  },
  // 标准地址详细信息获取(获取小区楼栋信息) *
  getStandardAddressDetail(data) {
    return apiReq("/blade-meshing/wg_sg_addr_building/list", data, {
      method: "GET",
      type: 1
    });
  },
  //获取组下的标准地址
  getZuStandardAddress(data) {
    return apiReq("/blade-meshing/standard-addr-info/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取楼栋的详情 *
  getLouDongDetail(id) {
    return apiReq("/blade-meshing/wg_sg_addr_building/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 标准地址其他地址新增 *
  postOtherStandardAddress(data) {
    return apiReq("/blade-meshing/standard-addr-info", data, {
      method: "POST",
      type: 0
    });
  },
  // 标准地址城镇地址新增 *
  postCityStandardAddress(data) {
    return apiReq("/blade-meshing/standard-addr-info/city", data, {
      method: "POST",
      type: 0
    });
  },
  // 标准地址农村地址新增 *
  postCountrysideStandardAddress(data) {
    return apiReq("/blade-meshing/standard-addr-info/countryside", data, {
      method: "POST",
      type: 0
    });
  },
  // 组织机构树（根据parentId获取）*
  getDeptLazyTreeZZ(data) {
    return apiReq("/blade-system/dept/lazy-tree-zz", data, {
      method: "GET",
      type: 1
    });
  },
  //通过组织机构获取巡逻组列表  /blade-meshing/group/pc-list
  groupList(data) {
    return apiReq("/blade-meshing/group/pc-list", data, {
      method: "GET",
      type: 1
    });
  },
  // 标准地址修改
  PutStandardAddress(data) {
    return apiReq("/blade-meshing/standard-addr-info", data, {
      method: "PUT",
      type: 0
    });
  },
  // 标准地址删除
  DeleteStandardAddress(id) {
    return apiReq("/blade-meshing/standard-addr-info/" + id, {}, {
      method: "DELETE",
      type: 1
    });
  },
  // 获取限制条件 - 一日双巡 *
  getOneLimitList(data) {
    return apiReq("/blade-meshing/task-params/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取限制条件 - 治安巡防 *
  getZhiAnLimitList(data) {
    return apiReq("/blade-meshing/task-params/list", data, {
      method: "GET",
      type: 1
    });
  },
  // 字典查询 *
  getDictionary(data) {
    return apiReq("/blade-system/dict-biz/dictionary", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取所有字典码 *
  getAllDictionary(data) {
    return apiReq("/blade-system/dict-biz/select-zz-dict", data, {
      method: "GET",
      type: 1
    });
  },
  // 图片上传地址
  postImage(data) {
    return apiReq("/blade-resource/oss/endpoint/put-file-attach", data, {
      method: "POST",
      type: 1
    });
  },
  // 图片获取地址
  getImage(url) {
    return apiReq("/blade-resource/oss/endpoint/file-preview?fileUrl=" + url, {}, {
      method: "GET",
      type: 1
    });
  },
  // 从标准地址跳转到房屋详情接口，传承为标准地址当前的id == address_id *
  detailBzToHouse(address_id) {
    return apiReq("/blade-meshing/wg-base-house-rent-info/from-bz-addr/" + address_id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 获取该实有人口关联的特殊人群信息
  getSecailForPop(id) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/specialPopInfo/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 特殊人群 -- 刑释人员新增 -- post
  postXsPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_positive", data, {
      method: "POST",
      type: 0
    });
  },
  // 特殊人群 -- 刑释人员修改 -- put
  putXsPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_positive", data, {
      method: "PUT",
      type: 0
    });
  },
  // 特殊人群 -- 刑释人员删除 -- delete
  delXsPop(id) {
    return apiReq("/blade-meshing/wg_sy_pop_positive/tombstone/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 特殊人群 -- 社区矫正人员人员新增 -- post
  postSqPop(data) {
    return apiReq("/blade-meshing/meshing-pop-rect", data, {
      method: "POST",
      type: 0
    });
  },
  // 特殊人群 -- 社区矫正人员修改 -- post
  putSqPop(data) {
    return apiReq("/blade-meshing/meshing-pop-rect", data, {
      method: "PUT",
      type: 0
    });
  },
  // 特殊人群 -- 社区矫正人员删除 -- delete
  delSqPop(id) {
    return apiReq("/blade-meshing/meshing-pop-rect/tombstone/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 特殊人群 -- 吸毒人员新增 -- post *
  postXdPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_druggy", data, {
      method: "POST",
      type: 0
    });
  },
  // 特殊人群 -- 吸毒人员修改 -- post *
  putXdPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_druggy", data, {
      method: "PUT",
      type: 0
    });
  },
  // 特殊人群 -- 吸毒人员删除 -- delete
  delXdPop(id) {
    return apiReq("/blade-meshing/wg_sy_pop_druggy/tombstone/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 特殊人群 -- 精神障碍患者新增 -- post *
  postJsPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_mental_patient", data, {
      method: "POST",
      type: 0
    });
  },
  // 特殊人群 -- 精神障碍患者修改 -- put *
  putJsPop(data) {
    return apiReq("/blade-meshing/wg_sy_pop_mental_patient", data, {
      method: "PUT",
      type: 0
    });
  },
  // 特殊人群 -- 精神障碍患者删除 -- delete
  delJsPop(id) {
    return apiReq("/blade-meshing/wg_sy_pop_mental_patient/tombstone/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 特殊人群 -- 见义勇为新增 -- post
  postJyPop(data) {
    return apiReq("/blade-meshing/sg-good-samaritan", data, {
      method: "POST",
      type: 0
    });
  },
  // 特殊人群 -- 见义勇为修改 -- put
  putJyPop(data) {
    return apiReq("/blade-meshing/sg-good-samaritan", data, {
      method: "PUT",
      type: 0
    });
  },
  // 特殊人群 -- 见义勇为删除 -- delete
  delJyPop(id) {
    return apiReq("/blade-meshing/sg-good-samaritan/tombstone/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  //待办走访任务 -- 统计
  gettodostacount(data) {
    return apiReq("/blade-meshing/todo/sta", data, {
      method: "GET",
      type: 1
    });
  },
  // 待办走访任务 -- 获取列表 -- get *
  getTaskList(data) {
    return apiReq("/blade-meshing/todo/tasks", data, {
      method: "GET",
      type: 1
    });
  },
  getTaskList1(data) {
    return apiReq("/blade-meshing/todo/my/tasks", data, {
      method: "GET",
      type: 1
    });
  },
  // 待办走访任务 -- 获取走访详细数据 -- get *
  getTaskDetail(id) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit/get-by-todo-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 待办走访任务 -- 修改走访详细数据 -- put
  putTaskList(id) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit", {}, {
      method: "PUT",
      type: 0
    });
  },
  // 待办走访任务 -- 新增走访详细数据 -- post
  postTaskList(data) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  // --------------------------------------- 待办走访各类人群post接口----------------------
  // 严重精神人群走访post *
  postJsTask(data) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  // 吸毒人员走访post *
  postXdTask(data) {
    return apiReq("/blade-meshing/meshing_pop_drug_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  //重点未成年走访
  postZdwcnTask(data) {
    return apiReq("/blade-meshing/wg_key_underage_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  // 刑满释放走访post *
  postXmTask(data) {
    return apiReq("/blade-meshing/meshing_pop_positive_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  // 社区矫正走访post *
  postSqTask(data) {
    return apiReq("/blade-meshing/meshing_pop_rect_visit/from-todo", data, {
      method: "POST",
      type: 0
    });
  },
  // --------------------------------------- 待办走访各类人群get接口获取详情----------------------
  // 严重精神人群走访get *
  getJsTaskDetail(id) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit/get-by-todo-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 吸毒人员走访get *
  getXdTaskDetail(id) {
    return apiReq("/blade-meshing/meshing_pop_drug_visit/by-todo-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  //重点青少走访
  getZdqsnTaskDetail(id) {
    return apiReq("/blade-meshing/wg_key_underage_visit/detail/by/task/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 刑满释放走访get *
  getXmTaskDetail(id) {
    return apiReq("/blade-meshing/meshing_pop_positive_visit/by-todo-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 社区矫正走访get *
  getSqTaskDetail(id) {
    return apiReq("/blade-meshing/meshing_pop_rect_visit/by-todo-list/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // --------------------------------------- 待办走访各类人群put接口休息信息----------------------
  // 严重精神人群走访put *
  putJsTaskDetail(data) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit", data, {
      method: "PUT",
      type: 0
    });
  },
  // 严重精神人群走访put *
  putXdTaskDetail(data) {
    return apiReq("/blade-meshing/meshing_pop_drug_visit", data, {
      method: "PUT",
      type: 0
    });
  },
  //重点未成年走访
  putZdwcnTaskDetail(data) {
    return apiReq("/blade-meshing/meshing_pop_rect_visit", data, {
      method: "PUT",
      type: 0
    });
  },
  // 严重精神人群走访put *
  putXmTaskDetail(data) {
    return apiReq("/blade-meshing/meshing_pop_positive_visit", data, {
      method: "PUT",
      type: 0
    });
  },
  // 社区矫正走访put *
  putSqTaskDetail(data) {
    return apiReq("/blade-meshing/meshing_pop_rect_visit", data, {
      method: "PUT",
      type: 0
    });
  },
  // ---------------------------------------- 网格地图边界接口 ------------------------------------
  // 获取网格边界数据 *
  getByOrgId(data) {
    return apiReq("/blade-meshing/wg-gis-info/getByOrgId", data, {
      method: "GET",
      type: 1
    });
  },
  //一日双寻获取定位
  depttowndetail(id) {
    return apiReq("/blade-system/dept/town/detail/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 新增网格边界信息
  postWgGisInfo(data) {
    return apiReq("/blade-meshing/wg-gis-info/saveWgGisInfo", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改网格边界信息
  putWgGisInfo(data) {
    return apiReq("/blade-meshing/wg-gis-info/updateWgGisInfo", data, {
      method: "PUT",
      type: 0
    });
  },
  // 查询风险预警统计
  getWaringSta(data) {
    return apiReq("/rs-app/mt-statistics/close-date", data, {
      method: "GET",
      type: 1
    });
  },
  // 查询数据简报
  getSituationSta(data) {
    return apiReq("/rs-app/mt-statistics/situation", data, {
      method: "GET",
      type: 1
    });
  },
  // 区域统计
  getRegionalSta(data) {
    return apiReq("/rs-app/mt-statistics/regional-statistics", data, {
      method: "GET",
      type: 1
    });
  },
  //待办事项统计
  getMTFlowTodo(data) {
    return apiReq("/rs-app/mt-flow/todo", data, {
      method: "GET",
      type: 1
    });
  },
  // ----------------------------------- 消息页面使用 ---------------------------------
  //执法局 -- 首页发布管理查询详情 *
  releaseMmanagement(data) {
    return apiReq("/zfj-app/release-management", data, {
      method: "GET",
      type: 0
    });
  },
  //消息列表 *
  messageGetData(data, showLoading = true) {
    return apiReq("/zfj-app/message/list", data, {
      method: "GET",
      type: 0,
      showLoading
    });
  },
  //消息修改
  messageUpdate(data) {
    return apiReq("/zfj-app/message/update-read", data, {
      method: "PUT",
      type: 0
    });
  },
  // 综治网格消息获取
  messageGetWangGe(data) {
    return apiReq("/rs-app/message/message-polling", data, {
      method: "GET",
      type: 1
    });
  },
  // --------------------------- 事件相关 ------------------------
  // 事件上报推送
  postEvent(data) {
    return apiReq("/blade-meshing/issue/push-to-upper", data, {
      method: "POST",
      type: 0
    });
  },
  // 事件无效标记
  postEventInvalid(data) {
    return apiReq("/blade-meshing/issue/event/update", data, {
      method: "POST",
      type: 0
    });
  },
  // 群众事件上报-事件报送网格员操作
  postEventByWg(data) {
    return apiReq("/blade-meshing/mass/issue/grid/operation", data, {
      method: "POST",
      type: 1
    });
  },
  //修改办件事件并重新上报
  updateEvent(data) {
    return apiReq("/blade-meshing/issue/modify/and/report", data, {
      method: "PUT",
      type: 0
    });
  },
  // 阅件事件新增
  postReadEvent(data) {
    return apiReq("/blade-meshing/issue-reading/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 事件关联人员删除
  deletePopFormEvent(id) {
    return apiReq(`/blade-meshing/issue-pop-rel/logical-delete/${id}`, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 获取事件中心列表
  getEventCenterList(data) {
    return apiReq("/blade-meshing/issue/issue-list-app", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取事件中心列表
  getIssueList(data) {
    return apiReq("/blade-meshing/issue/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取事件详情
  getEventCenterDetail(id) {
    return apiReq("/blade-meshing/issue/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 获取阅件事件详情
  getReadingDetail(id) {
    return apiReq("/blade-meshing/issue-reading/detail/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 草稿列表
  getDraftPage(data) {
    return apiReq("/blade-meshing/issue/draft/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 草稿新增
  postDraft(data) {
    return apiReq("/blade-meshing/issue/draft/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 草稿删除
  deleteDraft(data) {
    return apiReq("/blade-meshing/issue/draft/remove", data, {
      method: "DELETE",
      type: 1
    });
  },
  // 修改草稿
  putDraft(data) {
    return apiReq("/blade-meshing/issue/draft/modify", data, {
      method: "POST",
      type: 0
    });
  },
  // 重精筛查登记 -- post
  postMentalScreening(data) {
    return apiReq("/blade-meshing/mental/screen/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 获取重精筛查详情
  getMentalScreeningDetail(data) {
    return apiReq("/blade-meshing/mental/screen/detail", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取重精筛查登记列表
  getMentalScreeningList(data) {
    return apiReq("/blade-meshing/mental/screen/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 法治教育和其他工作列表-法制专干
  getEducationList(data) {
    return apiReq("/blade-meshing/legal/education/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 法治教育和其他工作列表-法制副校长
  getDeputyList(data) {
    return apiReq("/blade-meshing/legal/education/deputy/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 法治宣传或学校填报 - 副校长查看列表
  getPrincipalList(data) {
    return apiReq("/blade-meshing/school/vice/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 获取当前登录用户所属学校列表
  getLoginSchool(data) {
    return apiReq("/blade-meshing/school/list/by/login", data, {
      method: "GET",
      type: 1
    });
  },
  // 创建法治宣传或其他工作
  createEducation(data) {
    return apiReq("/blade-meshing/legal/education/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 修改法治宣传或其他工作
  modifyEducation(data) {
    return apiReq("/blade-meshing/legal/education/modify", data, {
      method: "PUT",
      type: 0
    });
  },
  // 法治宣传或其他工作详细详情
  getEducationDetail(id) {
    return apiReq("/blade-meshing/legal/education/detail/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 法治宣传或其他工作详细删除
  getEducationRemove(id) {
    return apiReq("/blade-meshing/legal/education/remove/" + id, {}, {
      method: "DELETE",
      type: 1
    });
  },
  // 学校列表
  getSchoolList(data) {
    return apiReq("/blade-meshing/school/search", data, {
      method: "GET",
      type: 1
    });
  },
  //学校列表--无权限
  getSchoolListv2(data) {
    return apiReq("/blade-meshing/school/search/v2", data, {
      method: "GET",
      type: 1
    });
  },
  // 重点青少年新增
  createUnderage(data) {
    return apiReq("/blade-meshing/key/underage/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 重点青少年编辑
  modifyUnderage(data) {
    return apiReq("/blade-meshing/key/underage/modify", data, {
      method: "PUT",
      type: 0
    });
  },
  // 根据实有人口ID获取 重点未成年详情
  getUnderagedetail(data) {
    return apiReq("/blade-meshing/key/underage/detail", data, {
      method: "GET",
      type: 1
    });
  },
  // 人房关联删除
  deletePlaceOrUnit(id) {
    return apiReq("/blade-meshing/wg-base-house-rel/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 获取当天是否有草稿
  getTodayDraft(id) {
    return apiReq("/blade-meshing/work/log/today/draft", {}, {
      method: "GET",
      type: 1
    });
  },
  // 获取当天工作成效
  getTodayResult(date) {
    return apiReq("/blade-meshing/work/log/today/result", date, {
      method: "GET",
      type: 1
    });
  },
  //工作日志列表
  myLogPage(data) {
    return apiReq("/blade-meshing/work/log/my/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 修改工作日志
  editModify(data) {
    return apiReq("/blade-meshing/work/log/modify", data, {
      method: "POST",
      type: 0
    });
  },
  // 添加工作日志
  addModify(data) {
    return apiReq("/blade-meshing/work/log/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 通过当前登录用户获取考勤打卡列表
  getClockList(data) {
    return apiReq("/blade-meshing/clock/in/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 考勤打卡
  getClockApi() {
    return apiReq("/blade-meshing/clock/in/confirm", {}, {
      method: "GET",
      type: 1
    });
  },
  postClockApi() {
    return apiReq("/blade-meshing/clock/in/confirm", {}, {
      method: "POST",
      type: 0
    });
  },
  // 查询当前登录部门详情
  getProfileInfo() {
    return apiReq("/blade-meshing/dept-profile-info/detail", {}, {
      method: "GET",
      type: 1
    });
  },
  // 单位场所消防设施新增
  createXFBaseInfo(data) {
    return apiReq("/blade-meshing/xf/base/info/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 单位场所消防设施修改
  modifyXFBaseInfo(data) {
    return apiReq("/blade-meshing/xf/base/info/modify", data, {
      method: "PUT",
      type: 0
    });
  },
  // 单位场所消防设施详情
  getXFDetail(id) {
    return apiReq("/blade-meshing/xf/base/info/by/unit/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 单位场所消防设施删除
  deleteFireControl(id) {
    return apiReq("/blade-meshing/xf/base/info/remove/" + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  // 省市区
  getRegion(data) {
    return apiReq("/blade-system/region/lazy-tree", data, {
      method: "GET",
      type: 1
    });
  },
  // 校验标准地址是否被绑定
  verifyHouse(id) {
    return apiReq("/blade-meshing/wg-base-house-rent-info/verify/" + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 根据身份证号查人口列表
  getBaseUsers(data) {
    return apiReq("/blade-meshing/meshing-sy-pop-info/base/users", data, {
      method: "GET",
      type: 1
    });
  },
  // 通过出租房屋ID查询走访列表信息
  getHouseVisit(data) {
    return apiReq("/blade-meshing/base/house/rent/visit/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 创建出租房屋走访
  createHouseVisit(data) {
    return apiReq("/blade-meshing/base/house/rent/visit/create", data, {
      method: "POST",
      type: 0
    });
  },
  // 查询阅件事件列表
  getAccessList(data) {
    return apiReq("/blade-meshing/issue-reading/page", data, {
      method: "GET",
      type: 1
    });
  },
  // 网格员操作
  gridOperate(data) {
    return apiReq("/blade-meshing/issue/grid/event/update", data, {
      method: "POST",
      type: 0
    });
  },
  // 查询事件办理日志列表
  getIssuelogsList(data) {
    return apiReq("/blade-meshing/issue-logs/page", data, {
      method: "GET",
      type: 1
    });
  },
  //案件列表
  publicityEducatepage(data) {
    return apiReq("/blade-meshing/publicityEducate/page", data, {
      method: "GET",
      type: 1
    });
  },
  //新增案件
  publicityEducatesave(data) {
    return apiReq("/blade-meshing/publicityEducate/save", data, {
      method: "POST",
      type: 0
    });
  },
  //删除事件
  publicityEducateremove(ids) {
    return apiReq(`/blade-meshing/publicityEducate/remove?ids=${ids}`, {}, {
      method: "DELETE",
      type: 0
    });
  },
  //编辑事件
  publicityEducateupdate(data) {
    return apiReq("/blade-meshing/publicityEducate/update", data, {
      method: "PUT",
      type: 0
    });
  },
  //巡逻任务列表
  getTaskPcList(data) {
    return apiReq("/blade-meshing/task/pc/list", data, {
      method: "GET",
      type: 0
    });
  },
  //获取全部巡防树状结构
  getAppTabList(data) {
    return apiReq("/blade-meshing/task/totalTaskTree", data, {
      method: "GET",
      type: 0
    });
  },
  //常用功能列表
  selfFunctionlist(data) {
    return apiReq("/blade-meshing/blade-selfFunction/selfFunction/list", data, {
      method: "GET",
      type: 1
    });
  },
  //批量新增自定义功能
  selfFunctionsavebatch(data) {
    return apiReq("/blade-meshing/blade-selfFunction/selfFunction/save-batch", data, {
      method: "PUT",
      type: 0
    });
  },
  //重点人员统计信息
  keyusersta(data) {
    return apiReq("/blade-meshing/key/user/sta", data, {
      method: "GET",
      type: 1
    });
  },
  //重点人员列表信息
  keyuserpaget(data) {
    return apiReq("/blade-meshing/key/user/page", data, {
      method: "GET",
      type: 1
    });
  },
  //单位场所地址库分页查询
  unitLocationAddrPage(data) {
    return apiReq("/blade-meshing/blade-unitLocationAddr/unitLocationAddr/page", data, {
      method: "GET",
      type: 1
    });
  },
  //网格信息统计
  //新增楼栋其它地址
  createbuilding(data) {
    return apiReq("/blade-meshing/sa/v2/create/building", data, {
      method: "POST",
      type: 0
    });
  },
  //V2-新增组其它地址
  creategroup(data) {
    return apiReq("/blade-meshing/sa/v2/create/group", data, {
      method: "POST",
      type: 0
    });
  },
  //新增楼栋信息
  addv2create(data) {
    return apiReq("/blade-meshing/sa/v2/create", data, {
      method: "POST",
      type: 0
    });
  },
  //新增楼栋信息
  addv2other(data) {
    return apiReq("/blade-meshing/sa/v2/create/normal", data, {
      method: "POST",
      type: 0
    });
  },
  //修改楼栋信息
  sav2modify(data) {
    return apiReq("/blade-meshing/sa/v2/modify", data, {
      method: "PUT",
      type: 0
    });
  },
  //删除楼栋信息
  sav2remove(id) {
    return apiReq(`/blade-meshing/sa/v2/remove/` + id, {}, {
      method: "DELETE",
      type: 0
    });
  },
  //单位场所地址库新增
  unitLocationAddrAdd(data) {
    return apiReq("/blade-meshing/blade-unitLocationAddr/unitLocationAddr", data, {
      method: "POST",
      type: 0
    });
  },
  //网格信息统计
  gridInformationStatistics(data) {
    return apiReq("/blade-meshing/wg/sta/grid-information-statistics", data, {
      method: "GET",
      type: 1
    });
  },
  //网格员本月工作统计
  getSummary(data) {
    return apiReq("/blade-meshing/wg/sta/grid/work/summary", data, {
      method: "GET",
      type: 1
    });
  },
  // 吸毒人员通过主键查询单条数据
  druggyId(id) {
    return apiReq(`/blade-meshing/wg_sy_pop_druggy/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 矫正社区人员通过主键查询单条数据
  poprectId(id) {
    return apiReq(`/blade-meshing/meshing-pop-rect/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 刑满释放人员通过主键查询单条数据
  positiveId(id) {
    return apiReq(`/blade-meshing/wg_sy_pop_positive/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 精神障碍患者通过主键查询单条数据
  patientId(id) {
    return apiReq(`/blade-meshing/wg_sy_pop_mental_patient/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  // 吸毒人员走访历史列表-单个人
  visitBaseDrug(data) {
    return apiReq("/blade-meshing/meshing_pop_drug_visit/page/by/base/id", data, {
      method: "GET",
      type: 1
    });
  },
  // 重点青少年人员走访历史列表-单个人
  visitBaseUnderage(data) {
    return apiReq(`/blade-meshing/wg_key_underage_visit/page/by/base/id`, data, {
      method: "GET",
      type: 1
    });
  },
  // 精神障碍患者走访历史列表-单个人
  visitBaseMent(data) {
    return apiReq("/blade-meshing/meshing_pop_ment_visit/page/by/base/id", data, {
      method: "GET",
      type: 1
    });
  },
  // 刑释人员走访历史列表-单个人
  visitBasePositive(data) {
    return apiReq(`/blade-meshing/meshing_pop_positive_visit/page/by/base/id`, data, {
      method: "GET",
      type: 1
    });
  },
  // 社区矫正人员走访历史列表-单个人
  visitBaseRect(data) {
    return apiReq(`/blade-meshing/meshing_pop_rect_visit/page/by/base/id`, data, {
      method: "GET",
      type: 1
    });
  },
  // 身份证查询人员
  idCarInfo(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/idCar`, data, {
      method: "GET",
      type: 1
    });
  },
  // 实有人口核实
  popInfoCheck(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/check`, data, {
      method: "POST",
      type: 1
    });
  },
  // 批量核实实有人口
  popInfoCheckAll(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/batch/check`, data, {
      method: "POST",
      type: 1
    });
  },
  // 单位场所核实
  unitInfoCheck(data) {
    return apiReq(`/blade-meshing/sg_unit_premises/check`, data, {
      method: "POST",
      type: 1
    });
  },
  // 房屋信息核实
  rentInfoCheck(data) {
    return apiReq(`/blade-meshing/wg-base-house-rent-info/check`, data, {
      method: "POST",
      type: 1
    });
  },
  //代办事项统计列表-APP端
  todostatasks(data) {
    return apiReq(`/blade-meshing/todo/sta/app/tasks`, data, {
      method: "GET",
      type: 1
    });
  },
  //获取待办列表 - APP
  todoapptasks(data) {
    return apiReq(`/blade-meshing/todo/app/tasks`, data, {
      method: "GET",
      type: 1
    });
  },
  //关爱帮扶列表
  carePage(data) {
    return apiReq(`/blade-meshing/care/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //法院协执列表
  enforcementPage(data) {
    return apiReq(`/blade-meshing/enforcement-courts/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //法院协执详情
  enforcementDetail(data) {
    return apiReq(`/blade-meshing/enforcement-courts`, data, {
      method: "GET",
      type: 1
    });
  },
  //法院协执新增
  enforcementAdd(data) {
    return apiReq(`/blade-meshing/enforcement-courts`, data, {
      method: "POST",
      type: 1
    });
  },
  //法院协执删除
  enforcementDelete(data) {
    return apiReq(`/blade-meshing/enforcement-courts`, data, {
      method: "DELETE",
      type: 1
    });
  },
  //法院协执修改
  enforcementEdit(data) {
    return apiReq(`/blade-meshing/enforcement-courts`, data, {
      method: "PUT",
      type: 1
    });
  },
  //获取默认信息
  houseriskdefaultinfo(id) {
    return apiReq(`/blade-meshing/house/risk/default/info/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  //法院协执日志分页
  enforcementLogPage(data) {
    return apiReq(`/blade-meshing/enforcement-courts-log/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //法院协执执行内容分页
  enforcementContentPage(data) {
    return apiReq(`/blade-meshing/enforcement-courts-content/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //法院协执执行操作
  enforcementActionAdd(data) {
    return apiReq(`/blade-meshing/enforcement-courts/action`, data, {
      method: "POST",
      type: 0
    });
  },
  //创建风险排查
  houseriskcreate(data) {
    return apiReq(`/blade-meshing/house/risk/create`, data, {
      method: "POST",
      type: 0
    });
  },
  //出租屋出租记录
  wgrentrecordsworksummary(data) {
    return apiReq(`/blade-meshing/wg/rent/records/work/summary`, data, {
      method: "GET",
      type: 1
    });
  },
  //消防-隐患排查接口 查询排查历史列表
  hazardList(data) {
    return apiReq(`/blade-meshing/xf/hazard/list`, data, {
      method: "GET",
      type: 1
    });
  },
  //消防-隐患排查接口 创建
  hazardCreate(data) {
    return apiReq(`/blade-meshing/xf/hazard/create`, data, {
      method: "POST",
      type: 0
    });
  },
  //消防-隐患排查接口 详情
  hazardDetail(id) {
    return apiReq(`/blade-meshing/xf/hazard/detail/` + id, {}, {
      method: "GET",
      type: 1
    });
  },
  //得分记录列表
  examinepage(data) {
    return apiReq(`/blade-meshing/patrol/examine/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //新增打分
  examinecreate(data) {
    return apiReq(`/blade-meshing/patrol/examine/create`, data, {
      method: "POST",
      type: 0
    });
  },
  //分析记录
  analysisrecord(data) {
    return apiReq(`/blade-meshing/patrol/examine/analysis/record`, data, {
      method: "GET",
      type: 1
    });
  },
  //标记为无效
  invalidtag(ids) {
    return apiReq(`/blade-meshing/patrol/examine/invalid/tag?ids=${ids}`, {}, {
      method: "POST",
      type: 0
    });
  },
  //专项扣除分数
  specialdeduction(data) {
    return apiReq(`/blade-meshing/patrol/examine/special/deduction`, data, {
      method: "POST",
      type: 0
    });
  },
  // 在线网格员轮询
  getGridStaffList(data) {
    return apiReq(`/blade-meshing/account/ping`, data, {
      method: "PUT",
      type: 0
    });
  },
  //事件评价列表
  evaluationpage(data) {
    return apiReq(`/blade-meshing/issue/evaluation/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //电力隐患排查办理导出
  issueexport(data) {
    return apiReqFile(`/blade-meshing/issue/export?id=${data.id}`, data, {
      method: "GET",
      type: 1
    });
  },
  //事件报送网格员操作
  gridoperation(data) {
    return apiReq(`/blade-meshing/mass/issue/grid/operation`, data, {
      method: "POST",
      type: 1
    });
  },
  // 线索上报
  reportCreate(data) {
    return apiReq(`/blade-meshing/xf/report/clue/create`, data, {
      method: "POST",
      type: 0
    });
  },
  // 获取天阙token
  getTianToken(data) {
    return apiReq(`/blade-meshing/push/get-business-token`, data, {
      method: "GET",
      type: 1
    });
  },
  //房屋信息实有人口关联
  wgbasehouserellist(data) {
    return apiReq(`/blade-meshing/wg-base-house-rel/list`, data, {
      method: "GET",
      type: 1
    });
  },
  // 账号详情
  accountDetail(data) {
    return apiReq(`/blade-meshing/account/update/apply/detail`, data, {
      method: "GET",
      type: 1
    });
  },
  // 账号变更申请
  accountUpdate(data) {
    return apiReq(`/blade-meshing/account/update/apply`, data, {
      method: "POST",
      type: 0
    });
  },
  // 账号变更纪录列表
  ApplyRecord(data) {
    return apiReq(`/blade-meshing/account/update/apply/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 账号变更申请-同意
  ApplyAgree(data) {
    return apiReq(`/blade-meshing/account/update/apply/accept`, data, {
      method: "POST",
      type: 0
    });
  },
  // 账号变更申请-拒绝
  ApplyRefuse(data) {
    return apiReq(`/blade-meshing/account/update/apply/reject`, data, {
      method: "POST",
      type: 0
    });
  },
  // 账号变更-是否存在审核中
  ApplyExist(data) {
    return apiReq(`/blade-meshing/account/update/apply/check`, data, {
      method: "GET",
      type: 1
    });
  },
  //修改信息 -- 重精人员走访信息
  meshingpopmentvisit(data) {
    return apiReq(`/blade-meshing/meshing_pop_ment_visit`, data, {
      method: "PUT",
      type: 0
    });
  },
  //修改信息 -- 刑满释放人员走访
  meshingpoppositivevisit(data) {
    return apiReq(`/blade-meshing/meshing_pop_positive_visit`, data, {
      method: "PUT",
      type: 0
    });
  },
  //修改信息 -- 吸毒人员走访信息
  meshingpopdrugvisit(data) {
    return apiReq(`/blade-meshing/meshing_pop_drug_visit`, data, {
      method: "PUT",
      type: 0
    });
  },
  //修改信息 -- 社区矫正人员走访
  meshingpoprectvisit(data) {
    return apiReq(`/blade-meshing/meshing_pop_rect_visit`, data, {
      method: "PUT",
      type: 0
    });
  },
  //通过任务ID获取社区矫正走访记录列表
  visitlistbyid(id) {
    return apiReq(`/blade-meshing/meshing_pop_rect_visit/list/by/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //通过任务ID获取刑释人员走访记录列表
  meshingpoppositivevisitlistbyid(id) {
    return apiReq(`/blade-meshing/meshing_pop_positive_visit/list/by/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //通过任务ID获取重精走访记录列表
  meshingpopmentvisitlistbyid(id) {
    return apiReq(`/blade-meshing/meshing_pop_ment_visit/list/by/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //通过任务ID获取吸毒走访记录列表
  meshingpopdrugvisitlistbyid(id) {
    return apiReq(`/blade-meshing/meshing_pop_drug_visit/list/by/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //获取任务详情
  todotaskdetail(data) {
    return apiReq(`/blade-meshing/todo/task/detail`, data, {
      method: "GET",
      type: 1
    });
  },
  // 爱心妈妈列表
  loveMomList(data) {
    return apiReq(`/blade-meshing/member/list`, data, {
      method: "GET",
      type: 1
    });
  },
  // 爱心妈妈详情
  loveMomDetail(id) {
    return apiReq(`/blade-meshing/member/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  // 爱心妈妈走访记录
  loveMomVisitRecord(id) {
    return apiReq(`/blade-meshing/help/records/page/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  // 爱心妈妈帮扶记录
  loveMomHelpRecord(data) {
    return apiReq(`/blade-meshing/help/records/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 新增帮扶记录
  addHelpRecord(data) {
    return apiReq(`/blade-meshing/help/records/create`, data, {
      method: "POST",
      type: 0
    });
  },
  // 爱心妈妈结对列表
  loveMomPairList(data) {
    return apiReq(`/blade-meshing/love/pairing/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 重点妇女列表
  keyWomenList(data) {
    return apiReq(`/blade-meshing/blade-keyWomen/keyWomen/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 通过用户id查询详情
  keyWomenDetail(id) {
    return apiReq(`/blade-meshing/member/user/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //重点妇女人员走 详细详情
  wgkeywomenvisit(id) {
    return apiReq(`/blade-meshing/wg_key_women_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //重点妇女人员走 编辑
  wgkeywomenvisitEdit(data) {
    return apiReq(`/blade-meshing/wg_key_women_visit`, data, {
      method: "PUT",
      type: 1
    });
  },
  //获取当前任务的走访详情
  wgkeywomenvisitdetail(assignId) {
    return apiReq(`/blade-meshing/wg_key_women_visit/detail/by/task/${assignId}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //重点妇女表--详情
  keyWomendetails(data) {
    return apiReq(`/blade-meshing/blade-keyWomen/keyWomen/details`, data, {
      method: "GET",
      type: 1
    });
  },
  // 重点妇女实有人口分页
  wgkeywomenrellist(data) {
    return apiReq(`/blade-meshing/blade-keyWomen/keyWomen/not-bound-page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 新增妇女走访记录
  wgkeywomenvisitcreate(data) {
    return apiReq(`/blade-meshing/wg_key_women_visit/from-todo`, data, {
      method: "POST",
      type: 0
    });
  },
  // 核实绑定是有人口
  wgkeywomenrelcheck(data) {
    return apiReq(`/blade-meshing/blade-keyWomen/keyWomen/update`, data, {
      method: "PUT",
      type: 0
    });
  },
  // 爱心妈妈统计
  loveMomStatistics(data) {
    return apiReq(`/blade-meshing/love/sta`, data, {
      method: "GET",
      type: 1
    });
  },
  // 上级帮扶协助回馈
  helpFeedback(data) {
    return apiReq(`/blade-meshing/help/records/reply`, data, {
      method: "POST",
      type: 0
    });
  },
  // 维权上报列表
  protectList(data) {
    return apiReq(`/blade-meshing/protect/report/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 当前登录用户维权上报列表
  protectListByUser(data) {
    return apiReq(`/blade-meshing/protect/report/login/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 创建维权
  createProtectReport(data) {
    return apiReq(`/blade-meshing/protect/report/create`, data, {
      method: "POST",
      type: 0
    });
  },
  // 妇女儿童维权统计
  protectStatistics(data) {
    return apiReq(`/blade-meshing/protect/report/sta`, data, {
      method: "GET",
      type: 1
    });
  },
  // 妇女儿童维权处理情况
  protectStatisticsDetail(data) {
    return apiReq(`/blade-meshing/protect/logs/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 创建维权上报
  createViolation(data) {
    return apiReq(`/blade-meshing/protect/report/create/report`, data, {
      method: "POST",
      type: 0
    });
  },
  // 创建维权交办
  createAssign(data) {
    return apiReq(`/blade-meshing/protect/report/create/assign`, data, {
      method: "POST",
      type: 0
    });
  },
  // 创建维权下发
  createViolationDispatch(data) {
    return apiReq(`/blade-meshing/protect/report/create/issue`, data, {
      method: "POST",
      type: 0
    });
  },
  // 妇女儿童维权操作
  protectOperation(data) {
    return apiReq(`/blade-meshing/protect/report/opera`, data, {
      method: "POST",
      type: 0
    });
  },
  // 修改维权上报
  updateProtectReport(data) {
    return apiReq(`/blade-meshing/protect/report/modify`, data, {
      method: "PUT",
      type: 0
    });
  },
  // 获取区域remark
  getAreaRemark(data) {
    return apiReq(`/blade-system/dept/detail`, data, {
      method: "GET",
      type: 1
    });
  },
  //获取实有人口走访记录
  wgkeywomenvisitlistbyid(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/visit/page`, data, {
      method: "GET",
      type: 1
    });
  },
  //通过主键ID获取详情
  //重精人员走访信息
  meshingpopmentvisitdetail(id) {
    return apiReq(`/blade-meshing/meshing_pop_ment_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //刑满释放人员走访
  wgkeywomenpositivevisitdetail(id) {
    return apiReq(`/blade-meshing/meshing_pop_positive_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //区矫正走访
  meshingpoprectvisitdetail(id) {
    return apiReq(`/blade-meshing/meshing_pop_rect_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //吸毒
  meshingpopdrugvisitdetail(id) {
    return apiReq(`/blade-meshing/meshing_pop_drug_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //重点青少年人员走访
  meshingpoppositivevisitdetail(id) {
    return apiReq(`/blade-meshing/wg_key_underage_visit/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  // 查询县
  getCountyList(data) {
    return apiReq(`/blade-system/dept/get-township-dept`, data, {
      method: "GET",
      type: 1
    });
  },
  // 查询角色
  getRoleList(data) {
    return apiReq(`/blade-meshing/protect/report/user`, data, {
      method: "GET",
      type: 1
    });
  },
  // 儿童之家列表
  childHomeList(data) {
    return apiReq(`/blade-meshing/group/children-home-list`, data, {
      method: "GET",
      type: 1
    });
  },
  //妇联工作清单
  womworkloginpage(data) {
    return apiReq(`/blade-meshing/wom/work/login/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 通过身份证查询人口详情
  getPopInfoByCard(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/get-idCar`, data, {
      method: "GET",
      type: 1
    });
  },
  // 重点妇女签收
  wgkeywomenreceive(data) {
    return apiReq(`/blade-meshing/wg_key_women_visit/exception/sign`, data, {
      method: "POST",
      type: 0
    });
  },
  // 重点青少年签收
  wgkeyunderagerecieve(data) {
    return apiReq(`/blade-meshing/wg_key_underage_visit/exception/sign`, data, {
      method: "POST",
      type: 0
    });
  },
  // 获取签收地址列表
  getSignAddressList(data) {
    return apiReq(`/blade-meshing/wg-base-house-rent-info/sign/address/list`, data, {
      method: "GET",
      type: 1
    });
  },
  // 重点妇女走访
  wgkeywomenvisitlist(data) {
    return apiReq(`/blade-meshing/wg_key_women_visit/page`, data, {
      method: "GET",
      type: 1
    });
  },
  // 是否有权限
  tokencheck(data) {
    return apiReq(`/blade-system/temporary-token/check`, data, {
      method: "GET",
      type: 1
    });
  },
  // 脱敏
  tokengenerate(data) {
    return apiReq(`/blade-system/temporary-token/generate`, data, {
      method: "POST",
      type: 0
    });
  },
  // 维权详情
  protectDetail(data) {
    return apiReq(`/blade-meshing//protect/report/detail`, data, {
      method: "GET",
      type: 1
    });
  },
  // 重精筛查登记详情
  meshingpopmentcheckdetail(id) {
    return apiReq(`/blade-meshing/mental/detail/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //根据实有人口ID修改失联、死亡、出国、流出状态
  modifystatus(data) {
    return apiReq(`/blade-meshing/meshing-sy-pop-info/modify/status`, data, {
      method: "PUT",
      type: 0
    });
  },
  //更新巡逻轨迹经纬度
  taskeditlocations(data) {
    return apiReq(`/blade-meshing/task/edit/locations`, data, {
      method: "PUT",
      type: 0
    });
  },
  //出租屋走访详情
  wgkeyrentvisitdetail(id) {
    return apiReq(`/blade-meshing/base/house/rent/visit/detail/by/task/${id}`, {}, {
      method: "GET",
      type: 1
    });
  },
  //删除单个任务轨迹点位
  deleteTaskLocation(id) {
    return apiReq(`/blade-meshing/track/remove/${id}`, {}, {
      method: "DELETE",
      type: 1
    });
  }
};
exports.api = api;
