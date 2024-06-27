import ApiService from "../api.service";
export const SurveyService = {
  GetList(data: any) {
    return ApiService.post("EldSurvey/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/EldSurvey/Get");
    } else {
      return ApiService.get(`/EldSurvey/Get/${id}`);
    }
  },
  GetByElderlyVerificationId(id: number | string | null | undefined, questionnaireTypeId?: number | string | null) {
    return ApiService.get(`/EldSurvey/GetByElderlyVerificationId/${id}/${questionnaireTypeId}`);
  },
  StartSurvey(surveyId: number | string) {
    return ApiService.get(`/EldSurvey/StartEldSurvey/${surveyId}`);
  },
  SaveResults(data: any) {
    return ApiService.post(`/EldSurvey/SaveResults`, data);
  },
  SaveAnswers(data: any) {
    return ApiService.post(`/EldSurvey/SaveAnswers`, data);
  },
  CompleteSurveyAndGetInfo(data: any) {
    return ApiService.post(`/EldSurvey/CompleteEldSurveyAndGetInfo`, data);
  },
  GetSurveyAnswers(data: any) {
    return ApiService.post(`/EldSurvey/GetEldSurveyAnswers`, data);
  },
  Delete(id: number | string) {
    return ApiService.post(`/EldSurvey/Delete/${id}`);
  },
  Sent(id: number | string) {
    return ApiService.post(`/EldSurvey/Sent/${id}`);
  },
  Accept(data: any) {
    return ApiService.post("/EldSurvey/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/EldSurvey/Cancel", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/EldSurvey/Update", data);
    } else {
      return ApiService.post("/EldSurvey/Create", data);
    }
  }
};
