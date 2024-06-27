import ApiService from "../api.service";
const ElderlyService = {
  GetList(data: Object) {
    return ApiService.post("/ElderlyService/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyService/Get");
    } else {
      return ApiService.get(`/ElderlyService/Get/${id}`);
    }
  },
  GetAsSelectList(query?: string | unknown) {
    if (query) {
      return ApiService.get(`/ElderlyService/GetAsSelectList${query}`);
    }
    return ApiService.get(`/ElderlyService/GetAsSelectList`);
  },

  Delete(id: number | string) {
    return ApiService.post(`/ElderlyService/Delete/${id}`, {});
  },

  Update(data: any) {
    if (data.id) {
      return ApiService.post("/ElderlyService/Update", data);
    } else {
      return ApiService.post("/ElderlyService/Create", data);
    }
  }
};
export default ElderlyService;
