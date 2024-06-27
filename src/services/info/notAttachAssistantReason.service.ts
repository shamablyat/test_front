import ApiService from "../api.service";
const NotAttachAssistantReasonService = {
  GetList(data: Object) {
    return ApiService.post("/NotAttachAssistantReason/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/NotAttachAssistantReason/Get");
    } else {
      return ApiService.get(`/NotAttachAssistantReason/Get/${id}`);
    }
  },
  GetAsSelectList() {
    return ApiService.get(`/NotAttachAssistantReason/GetAsSelectList`);
  },
  Delete(id: number | string) {
    return ApiService.post(`/NotAttachAssistantReason/Delete/${id}`, {});
  },

  Update(data: any) {
    if (data.id) {
      return ApiService.post("/NotAttachAssistantReason/Update", data);
    } else {
      return ApiService.post("/NotAttachAssistantReason/Create", data);
    }
  }
};
export default NotAttachAssistantReasonService;
