import request from "@/utils/request";

// 登录
export const login = (data) =>
  request("/api/user/login", {
    method: "post",
    body: data,
    default_url: true
  });

// 工序列表
export const getOperateList = (data) =>
  request("/api/working-procedure/list", {
    method: "get",
    params: data,
    default_url: true
  });

// 不良代码
export const getBadCodeGroupList = (data) =>
  request("/api/bad-code-group/list", {
    method: "get",
    params: data,
    default_url: true
  });

// 不良代码
export const getBadCodeList = (data) =>
  request("/api/bad-code/list", {
    method: "get",
    params: data,
    default_url: true
  });

// 获取点检单列表
export const getCheckOrderList = (params) =>
  request("/api/check/order", {
    method: "get",
    params
  });

//获取点检单点检项列表
export const getCheckOrderItemList = (params) =>
  request('/api/check/order/item', {
    method: 'get',
    params
  });
//提交
export const submitCheckOrderItemList = (data) =>
  request("/api/check/order/item", {
    method: "post",
    body: data,
  });

//工单接收列表
export const workOrderList = (data) =>
  request("/api/work-order/list", {
    method: "get",
    body: data,
  });
  //工单接收确认
export const workOrderEstimateConfirm = (data) =>
  request("/api/work-order/estimate/confirm", {
    method: "post",
    body: data,
  });
//获取工单估工列表
export const workOrderEstimateList = (data) =>
  request("/api/work-order/estimate/list", {
    method: "get",
    body: data,
  });

  //工序上机列表
  export const workOrderExecList = (params) =>
    request("/api/work-order-exec/list", {
      method: "get",
      params
    });
  // 上下机
  export const workOrderExecOperation = (data) =>
    request("/api/work-order-exec/execOperation", {
      method: "post",
      body: data,
    });

    // 获取状态机
  export const workOrderStateMachine = (params) =>
    request("/api/work-order/state-machine", {
      method: "get",
      params,
    });

  // 按工单，工艺，工序查询可以送检的内容
export const quantityGetCheckList = (params) =>
  request("/api/quantity/getCheckList", {
    method: "get",
    params,
  });

  // 送检
export const quantityCreate = (data) =>
request("/api/quantity/create", {
  method: "post",
  body: data,
});

// 按天查询检验记录
export const quantityGetCheckHistory = (params) =>
  request("/api/quantity/getCheckHistory/page", {
    method: "get",
    params,
  });

  // 按天查询检验不良记录
export const quantityGetDefectCheckHistory = (params) =>
request("/api/quantity/getDefectCheckHistory/page", {
  method: "get",
  params,
});

// 所有的待检项
export const quantityGetNeedCheck = (params) =>
  request("/api/quantity/getNeedCheck/page", {
    method: "get",
    params,
  });

// 检验通过
export const quantityNg = (data) =>
  request("/api/quantity/ng", {
    method: "post",
    body: data,
  });

// 检验不通过
export const quantityPass = (data) =>
  request("/api/quantity/pass", {
    method: "post",
    body: data,
  });

// 根据routeId获取route-step
export const routeStepListAll = (params) =>
  request("/api/route-step/list/all", {
    method: "get",
    params,
  });

// 
export const getDetailById = (params) =>
  request("/api/quantity", {
    method: "get",
    params,
  });
