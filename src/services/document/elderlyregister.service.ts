import ApiService from "../api.service";
import { AxiosRequestConfig } from "axios";
const ElderlyRegisterService = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyRegister/GetList", data, config);
  },
  GetSentList(data: Object) {
    return ApiService.post("/ElderlyRegister/GetSentList", data);
  },
  Get(id: Number | String) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyRegister/Get");
    } else {
      return ApiService.get(`/ElderlyRegister/Get/${id}`);
    }
  },
  GetByElderlyVerificationId(id: Number | String) {
    return ApiService.get(`/ElderlyRegister/GetByElderlyVerificationId/${id}`);
  },
  UnregisterGetByManageId(id: Number | String) {
    return ApiService.get(`/ElderlyRegister/UnregisterGetByManageId/${id}`);
  },
  Delete(id: Number | String) {
    return ApiService.post(`/ElderlyRegister/Delete/${id}`, {});
  },
  Accept(data: Object) {
    return ApiService.post("/ElderlyRegister/Accept", data);
  },
  Cancel(data: Object) {
    return ApiService.post("/ElderlyRegister/Cancel", data);
  },
  Reject(data: Object) {
    return ApiService.post("/ElderlyRegister/Reject", data);
  },
  Sent(data: Object) {
    return ApiService.post("/ElderlyRegister/Sent", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/ElderlyRegister/Update", data);
    } else {
      return ApiService.post("/ElderlyRegister/Create", data);
    }
  },
  CreateCorrection(data: any) {
    return ApiService.post("/ElderlyRegister/CreateCorrection", data);
  },
  DownloadFile(fileId: any, config?: AxiosRequestConfig) {
    return ApiService.print(`/ElderlyRegister/DownloadFile/${fileId}`, config);
  },
  UploadFile(data: any, config?: AxiosRequestConfig) {
    return ApiService.post(`/ElderlyRegister/UploadFile`, data, config);
  },
  DeleteFile(fileId: any) {
    return ApiService.post(`/ElderlyRegister/DeleteFile/${fileId}`, {});
  },
  DownloadInTableFile(fileId: any) {
    return ApiService.print(`/ElderlyRegister/DownloadInTableFile/${fileId}`);
  },
  UploadInTableFile(data: any) {
    return ApiService.post(`/ElderlyRegister/UploadInTableFile`, data);
  },
  DeleteInTableFile(fileId: any) {
    return ApiService.post(`/ElderlyRegister/DeleteInTableFile/${fileId}`, {});
  },
  ExportElderlyRegisterInAndOut(data: any) {
    return ApiService.printTemp("ElderlyRegister/ExportElderlyRegisterList", data);
  }
};
export default ElderlyRegisterService;
