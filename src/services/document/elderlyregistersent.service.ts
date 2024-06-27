import ApiService from "../api.service";
const ElderlyRegisterSentService = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyRegister/GetSentList", data, config);
  },
  Get(id: Number | String) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyRegister/GetSent");
    } else {
      return ApiService.get(`/ElderlyRegister/GetSent/${id}`);
    }
  },
};
export default ElderlyRegisterSentService;
