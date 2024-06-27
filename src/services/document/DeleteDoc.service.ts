import ApiService from "../api.service";
export const DeleteDocService = {
  GetList(data: any) {
    return ApiService.post("DeleteDoc/GetList", data);
  },
  Get(id: number | string) {
    if (!!id && id != 0) {
      return ApiService.get(`DeleteDoc/Get/${id}`);
    } else {
      return ApiService.get(`DeleteDoc/Get`);
    }
  },
  Delete(id: Number | String) {
    return ApiService.post(`/DeleteDoc/Delete/${id}`, {});
  },
  Accept(data: Object) {
    return ApiService.post("/DeleteDoc/Accept", data);
  },
  Cancel(data: Object) {
    return ApiService.post("/DeleteDoc/Cancel", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/DeleteDoc/Update", data);
    } else {
      return ApiService.post("/DeleteDoc/Create", data);
    }
  }
};
