import ApiService from "../api.service";
export const QuestionnaireService = {
  GetList(data: any) {
    return ApiService.post("EldQuestionnaire/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/EldQuestionnaire/Get");
    } else {
      return ApiService.get(`/EldQuestionnaire/Get/${id}`);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/EldQuestionnaire/Delete/${id}`);
  },
  GetQuestionnaireTemplates(id: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetQuestionnaireTemplates/${id}`);
  },
  GetCloneById(id: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetCloneById/${id}`);
  },
  GetQuestionnaireSelectList(query?: string) {
    if (query) {
      return ApiService.get(`/EldQuestionnaire/GetQuestionnaireSelectList${query}`);
    }
    // if (questionnaireTypeId) {
    //   return ApiService.get(
    //     `/EldQuestionnaire/GetQuestionnaireSelectList?questionnaireTypeId=${questionnaireTypeId}`
    //   );
    // }
    return ApiService.get(`/EldQuestionnaire/GetQuestionnaireSelectList`);
  },
  Sent(id: number | string) {
    return ApiService.post(`/EldQuestionnaire/Sent/${id}`);
  },
  Accept(data: any) {
    return ApiService.post("/EldQuestionnaire/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/EldQuestionnaire/Cancel", data);
  },
  GetByIdForSurvey(id: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetByIdForSurvey/${id}`);
  },
  GetQuestionnaireGroups(questionnaireId: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetQuestionnaireGroups/${questionnaireId}`);
  },
  GetQuestionnaireQuestions(questionnaireId: number | string, questionnaireGroupId: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetQuestionnaireQuestions/${questionnaireId}/${questionnaireGroupId}`);
  },
  GetQuestionnaireAnswers(questionnaireId: number | string, questionnaireGroupId: number | string, questionnaireQuestionId: number | string) {
    return ApiService.get(`/EldQuestionnaire/GetQuestionnaireAnswers/${questionnaireId}/${questionnaireGroupId}/${questionnaireQuestionId}`);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/EldQuestionnaire/Update", data);
    } else {
      return ApiService.post("/EldQuestionnaire/Create", data);
    }
  }
};
