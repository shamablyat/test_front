import ApiService from "../api.service";
const EldApplicationService = {
  GetList(data: any) {
    return ApiService.post("EldApplication/GetList", data);
  },
  Get(id: number | string) {
    return ApiService.get(`EldApplication/Get/${id}`);
  },
  SetSocialEmployee(data: any) {
    return ApiService.post(`EldApplication/SetSocialEmployee`, data);
  },
  Receive(data: any) {
    return ApiService.post(`EldApplication/Receive`, data);
  },
  Reject(data: any) {
    return ApiService.post(`EldApplication/Reject`, data);
  },
};
export default EldApplicationService;
