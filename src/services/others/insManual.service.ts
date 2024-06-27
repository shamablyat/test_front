import ApiService from "../api.service";
const InsManualService = {
  GetAreaSocialEmployeePersonList(data: any) {
    return ApiService.post("/InsManual/GetAreaSocialEmployeePersonList", data);
  }
};
export default InsManualService;
