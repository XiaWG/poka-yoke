import request from "@/utils/request";

// 登录
export const test = (data) =>
  request("/proofing/test/test", {
    method: "post",
    body: data,
  })

// 权限
export const getPdaRoleMenu = (params) =>
  request("/pda/pdaRoleMenu/list", {
    method: "get",
    params,
  })

export const savePdaRoleMenu = (data) =>
  request("/pda/pdaRoleMenu", {
    method: "post",
    body: data,
  })

// 检验权限
export const checkRole = (data) =>
  request("/pda/pdaLogin/checkRole", {
    method: "post",
    body: data,
  })

// 获取仓库数据
export const getWarehouseList = (data) =>
  request("/pda/pdaOperation/warehouseList", {
    method: "post",
    body: data,
  })

  // 信息采集料站表 校验登陆人
export const checkGrant = (data) =>
  request("/pda/pdaLogin/checkGrant", {
    method: "post",
    body: data,
  })

export const partDataDetailByPartNo = (data) =>
  request("/pda/pdaOperation/partDataDetailByPartNo", {
    method: "post",
    body: data,
  })

  //
export const programCollection = (data) =>
  request("/pda/pdaOperation/programCollection", {
    method: "post",
    body: data,
  })

  
export const checkProgramExist = (data) =>
  request("/pda/pdaOperation/checkProgramExist", {
    method: "post",
    body: data,
  })

export const materialInspectScan = (data) =>
  request("/pda/pdaOperation/materialInspectScan", {
    method: "post",
    body: data,
  })
  
export const materialInspectIPQCScan = (data) =>
  request("/pda/pdaOperation/materialInspectIPQCScan", {
    method: "post",
    body: data,
  })

export const checkGrantIsEngineer = (data) =>
  request("/pda/pdaLogin/checkGrantIsEngineer", {
    method: "post",
    body: data,
  })

export const checkGrantIsIPQC = (data) =>
  request("/pda/pdaLogin/checkGrantIsIPQC", {
    method: "post",
    body: data,
  })

export const pdaScanHistoryList = (data) =>
  request("/pda/pdaOperation/pdaScanHistoryList", {
    method: "post",
    body: data,
  })

export const pdaScanConfirmList = (data) =>
  request("/pda/pdaOperation/pdaScanConfirmList", {
    method: "post",
    body: data,
  })
  
  
export const materialScanCheckStation = (data) =>
  request("/pda/pdaOperation/materialScanCheckStation", {
    method: "post",
    body: data,
  })

  // 
export const pdaProgramList = (data) =>
  request("/pda/pdaOperation/programListByLike", {
    method: "post",
    body: data,
  })

export const pdaProgramDetailList = (data) =>
  request("/pda/pdaOperation/programDetailListByProgramId", {
    method: "post",
    body: data,
  })

// IPQC巡检
export const materialInspectIPQCPatrol = (data) =>
  request("/pda/pdaOperation/materialInspectIPQCPatrol", {
    method: "post",
    body: data,
  })

export const deleteProgramById = (data) =>
  request("/pda/pdaOperation/deleteProgramById", {
    method: "post",
    body: data,
  })

  
export const deleteProgramDetailById = (data) =>
  request("/pda/pdaOperation/deleteProgramDetailById", {
    method: "post",
    body: data,
  })

// 
export const insertPdaScanConfirm = (data) =>
  request("/pda/pdaOperation/insertPdaScanConfirm", {
    method: "post",
    body: data,
  })

export const updatePdaScanConfirm = (data) =>
  request("/pda/pdaOperation/updatePdaScanConfirm", {
    method: "post",
    body: data,
  })

  
export const selectPdaScanConfirmInfo = (data) =>
  request("/pda/pdaOperation/selectPdaScanConfirmInfo", {
    method: "post",
    body: data,
  })
