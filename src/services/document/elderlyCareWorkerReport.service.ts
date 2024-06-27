import ApiService from "../api.service";
import { AxiosRequestConfig } from "axios"
const ElderlyCareWorkerReportService = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyCareWorkerReport/GetList", data, config);
  },
  GetAssistantReportDaily(data: Object, config?: any) {
    return ApiService.post(
      "/ElderlyCareWorkerReport/GetAssistantReportDayly",
      data,
      config
    );
  },
  GetAssistantReportWeekly() {
    return ApiService.get(
      "/ElderlyCareWorkerReport/GetAssistantReportWeeklyWithoutById"
    );
  },
  GetSentList(data: Object) {
    return ApiService.post("/ElderlyCareWorkerReport/GetSentList", data);
  },
  Get(id: Number | String) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyCareWorkerReport/Get");
    } else {
      return ApiService.get(`/ElderlyCareWorkerReport/Get/${id}`);
    }
  },
  DownloadFile(fileId: any, config?: AxiosRequestConfig) {
    return ApiService.print(`/ElderlyCareWorkerReport/DownloadFile/${fileId}`, config);
  },
  UploadFile(data: any, config?: AxiosRequestConfig) {
    return ApiService.post(`/ElderlyCareWorkerReport/UploadFile`, data, config);
  },
  DeleteFile(fileId: any) {
    return ApiService.post(`/ElderlyCareWorkerReport/DeleteFile/${fileId}`, {});
  },
  Delete(id: Number | String) {
    return ApiService.post(`/ElderlyCareWorkerReport/Delete/${id}`, {});
  },
  Accept(data: Object) {
    return ApiService.post("/ElderlyCareWorkerReport/Accept", data);
  },
  Cancel(data: Object) {
    return ApiService.post("/ElderlyCareWorkerReport/Cancel", data);
  },
  GetAssistantReportByDay(data: any) {
    return ApiService.post(
      "/ElderlyCareWorkerReport/GetAssistantReportByDay",
      data
    );
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/ElderlyCareWorkerReport/Update", data);
    } else {
      return ApiService.post("/ElderlyCareWorkerReport/Create", data);
    }
  },
  GetElderlyCareWorkerReportCoordinates(id: Number | String) {
    return ApiService.get(`/ElderlyCareWorkerReport/GetElderlyCareWorkerReportCoordinates/${id}`);
  },
  GetAssistantReportWeeklyGet(id: Number | String) {
    return ApiService.get(`/ElderlyCareWorkerReport/GetAssistantReportWeekly/${id}`);
  }

};
export default ElderlyCareWorkerReportService;
