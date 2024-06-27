import ApiService from "../api.service";
const ManualService = {
  GetPermissionSelectList() {
    return ApiService.get(`/Manual/GetPermissionSelectList`);
  },
  GetQuestionnaireTypeSelectList() {
    return ApiService.get(`/Manual/GetQuestionnaireTypeSelectList`);
  },
  GetAnswerTypeSelectList() {
    return ApiService.get(`/Manual/GetEldAnswerTypeSelectList`);
  },
  GetSurveyResultTypeSelectList() {
    return ApiService.get(`/Manual/GetSurveyResultTypeSelectList`);
  },
  GetElderlyCategorySelectList(parentId: any, isDisability: any) {
    return ApiService.get(`/Manual/GetElderlyCategorySelectList?parentId=${parentId}&isDisability=${isDisability}`);
  },
  GetDecisionTypeSelectList() {
    return ApiService.get("/Manual/GetDecisionTypeSelectList");
  },
  GetPensionTypeSelectList() {
    return ApiService.get("/Manual/GetPensionTypeSelectList");
  },
  GetIndividualProgramTypeSelectList() {
    return ApiService.get("/Manual/GetIndividualProgramTypeSelectList");
  },
  GetDangerousTypeSelectList() {
    return ApiService.get("/Manual/GetDangerousTypeSelectList");
  },
  GetSatisfactionTypeSelectList() {
    return ApiService.get("/Manual/GetSatisfactionTypeSelectList");
  },
  GetProtectionMeasureSelectList() {
    return ApiService.get("/Manual/GetProtectionMeasureSelectList");
  },
  GetElderlyFamilyMemberPlaceSelectList() {
    return ApiService.get("/Manual/GetElderlyFamilyMemberPlaceSelectList");
  },
  GetDocDeleteTypeSelectList() {
    return ApiService.get(`/Manual/GetDocDeleteTypeSelectList`);
  }
};
export default ManualService;
