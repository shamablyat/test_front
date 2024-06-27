import ApiService from "../api.service";
export const SurveyResultAlgorithmService = {
  GetList(data: any) {
    return ApiService.post("EldSurveyResultAlgorithm/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/EldSurveyResultAlgorithm/Get");
    } else {
      return ApiService.get(`/EldSurveyResultAlgorithm/Get/${id}`);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/EldSurveyResultAlgorithm/Delete/${id}`);
  },
  Sent(id: number | string) {
    return ApiService.post(`/EldSurveyResultAlgorithm/Sent/${id}`);
  },
  CloneAlgorithmsByQuestionnaireId(query: string) {
    return ApiService.post(`/EldSurveyResultAlgorithm/CloneAlgorithmsByQuestionnaireId${query}`);
  },
  Accept(data: any) {
    return ApiService.post("/EldSurveyResultAlgorithm/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/EldSurveyResultAlgorithm/Cancel", data);
  },

  Update(data: any) {
    if (data.id) {
      return ApiService.post("/EldSurveyResultAlgorithm/Update", data);
    } else {
      return ApiService.post("/EldSurveyResultAlgorithm/Create", data);
    }
  }
};
