import ApiService from "../api.service";
const IndividualProgramService = {
  GetList(data: Object) {
    return ApiService.post("/IndividualProgram/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/IndividualProgram/Get");
    } else {
      return ApiService.get(`/IndividualProgram/Get/${id}`);
    }
  },
  GetAsSelectList(type?: number | string) {
    if (!type || type == 0) {
      return ApiService.get("/IndividualProgram/GetAsSelectList");
    } else {
      return ApiService.get(`/IndividualProgram/GetAsSelectList?individualProgramType=${type}`);
    }
  },

  Delete(id: number | string) {
    return ApiService.post(`/IndividualProgram/Delete/${id}`, {});
  },

  Update(data: any) {
    if (data.id) {
      return ApiService.post("/IndividualProgram/Update", data);
    } else {
      return ApiService.post("/IndividualProgram/Create", data);
    }
  }
};
export default IndividualProgramService;
