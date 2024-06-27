import ApiService from "../api.service";
export const QuestionAnswerTemplateService = {
  GetList(data: any) {
    return ApiService.post("EldQuestionAnswerTemplate/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/EldQuestionAnswerTemplate/Get");
    } else {
      return ApiService.get(`/EldQuestionAnswerTemplate/Get/${id}`);
    }
  },
  GetAsSelectList() {
    return ApiService.get("/EldQuestionAnswerTemplate/GetAsSelectList");
  },
  AsTableSelectList(id: number | string) {
    return ApiService.get(`/EldQuestionAnswerTemplate/AsTableSelectList/${id}`);
  },
  Delete(id: number | string) {
    return ApiService.post(`/EldQuestionAnswerTemplate/Delete/${id}`);
  },
  Accept(data: any) {
    return ApiService.post("/EldQuestionAnswerTemplate/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/EldQuestionAnswerTemplate/Cancel", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/EldQuestionAnswerTemplate/Update", data);
    } else {
      return ApiService.post("/EldQuestionAnswerTemplate/Create", data);
    }
  },
};
