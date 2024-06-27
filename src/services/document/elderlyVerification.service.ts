import { IComissions, IFamily, IHealth, IIndividualProgram } from "@/views/document/elderlyVerification/verification/types";
import ApiService from "../api.service";
const ElderlyVerificationService = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyVerification/GetList", data, config);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyVerification/Get");
    } else {
      return ApiService.get(`/ElderlyVerification/Get/${id}`);
    }
  },
  GetElderlyCategoryIdByElderlyVerificationId(id: number | string) {
    return ApiService.get(`/ElderlyVerification/GetElderlyCategoryIdByElderlyVerificationId/${id}`);
  },
  GetByElderlyManageId(id: number | string) {
    return ApiService.get(`/ElderlyVerification/GetByElderlyManageId/${id}`);
  },

  GetVitekvtekInfoByVerificationId(id: number | string) {
    return ApiService.post(`/ElderlyVerification/GetVitekvtekInfoByVerificationId?id=${id}`);
  },
  GetPsychoNeurologicInfobyVerificationId(id: number | string) {
    return ApiService.post(`/ElderlyVerification/GetPsychoNeurologicInfobyVerificationId?id=${id}`);
  },

  GetConclusionFile(data: any) {
    return ApiService.printTemp("ElderlyVerification/GetConclusionFile", data);
  },
  GetYaTDFile(data: any) {
    return ApiService.printTemp("ElderlyVerification/GetYaTDFile", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/ElderlyVerification/Update", data);
    } else {
      return ApiService.post("/ElderlyVerification/Create", data);
    }
  },
  GetByApplicationId(applicationId: number | string) {
    return ApiService.get(`/ElderlyVerification/GetByApplicationId/${applicationId}`);
  },
  Delete(id: Number | String) {
    return ApiService.post(`/ElderlyVerification/Delete/${id}`, {});
  },
  Accept(data: Object) {
    return ApiService.post("/ElderlyVerification/Accept", data);
  },
  AcceptAfterSign(data: Object) {
    return ApiService.post("/ElderlyVerification/AcceptAfterSign", data);
  },
  Sent(data: Object) {
    return ApiService.post("/ElderlyVerification/Sent", data);
  },
  Cancel(data: Object) {
    return ApiService.post("/ElderlyVerification/Cancel", data);
  },
  Reject(data: Object) {
    return ApiService.post("/ElderlyVerification/Reject", data);
  },
  Complete(data: Object) {
    return ApiService.post(`/ElderlyVerification/Complete/${data}`, {});
  },
  SentToAgree(data: Object) {
    return ApiService.post("/ElderlyVerification/SentToAgree", data);
  },
  Agree(data: Object) {
    return ApiService.post("/ElderlyVerification/Agree", data);
  },
  GetIncludes(data: Object) {
    return ApiService.post("/ElderlyVerification/GetIncludes", data);
  },
  ElderlyVerificationTableHasValue(ElderlyVerificationTableHasValue: number | string) {
    return ApiService.get(`/ElderlyVerification/ElderlyVerificationTableHasValue/${ElderlyVerificationTableHasValue}`);
  },
  UpdateElderlyVerificationWithComissions(data: { id: number; comissions: IComissions[] }) {
    return ApiService.post("/ElderlyVerification/UpdateElderlyVerificationWithComissions", data);
  },
  UpdateElderlyVerificationWithFamily(data: { id: number; family: IFamily }) {
    return ApiService.post("/ElderlyVerification/UpdateElderlyVerificationWithFamily", data);
  },
  UpdateElderlyVerificationWithHealth(data: { id: number; health: IHealth }) {
    return ApiService.post("/ElderlyVerification/UpdateElderlyVerificationWithHealth", data);
  },
  UpdateElderlyVerificationWithIndividualProgram(data: { id: number; individualPrograms: IIndividualProgram[] }) {
    return ApiService.post("/ElderlyVerification/UpdateElderlyVerificationWithIndividualProgram", data);
  },
  UpdateElderlyVerificationWithResult(data: { id: number; verificationResult: any }) {
    return ApiService.post("/ElderlyVerification/UpdateElderlyVerificationWithResult", data);
  },
  GetElderlyVerifications(data: any) {
    return ApiService.post("/ElderlyVerification/GetElderlyVerifications", data);
  },
  ExportElderlyVerifications(data: any) {
    return ApiService.printTemp("/ElderlyVerification/ExportElderlyVerifications", data);
  }
};
export default ElderlyVerificationService;
