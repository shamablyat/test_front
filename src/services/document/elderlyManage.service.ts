import ApiService from "../api.service";
const ElderlyManageService = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyManage/GetList", data, config);
  },
  RefreshChildrenCount(data: Object, config?: any) {
    return ApiService.post("/ElderlyManage/RefreshChildrenCount", data, config);
  }
};
export default ElderlyManageService;
