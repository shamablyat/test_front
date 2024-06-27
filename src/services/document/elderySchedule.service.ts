import { AxiosRequestConfig } from "axios";
import ApiService from "../api.service";
const ElderlyCareSchedule = {
  GetList(data: Object, config?: any) {
    return ApiService.post("/ElderlyCareSchedule/GetList", data, config);
  },
  GetSentList(data: Object) {
    return ApiService.post("/ElderlyCareSchedule/GetSentList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyCareSchedule/Get");
    } else {
      return ApiService.get(`/ElderlyCareSchedule/Get/${id}`);
    }
  },
  GetSent(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/ElderlyCareSchedule/Get");
    } else {
      return ApiService.get(`/ElderlyCareSchedule/Get/${id}`);
    }
  },
  GetCloneById(id: number | string) {
    return ApiService.get(`/ElderlyCareSchedule/GetCloneById/${id}`);
  },
  Delete(id: Number | String) {
    return ApiService.post(`/ElderlyCareSchedule/Delete/${id}`, {});
  },
  Approve(data: Object) {
    return ApiService.post("/ElderlyCareSchedule/Approve", data);
  },
  ElderlyServiceAsSelectList(query?: string | unknown) {
    if (query) {
      return ApiService.get(`/ElderlyCareSchedule/ElderlyServiceAsSelectList${query}`);
    }
    return ApiService.get(`/ElderlyCareSchedule/ElderlyServiceAsSelectList`);
  },
  ExportAssistantInfoList(data: Object) {
    return ApiService.printTemp("/ElderlyCareSchedule/ExportAssistantInfoList", data);
  },
  ExportAssistentWeeklyInfo(data: Object) {
    return ApiService.printTemp("/ElderlyCareSchedule/ExportAssistentWeeklyInfo", data);
  },
  ExportAssistentWeeklyInfo2(data: Object) {
    return ApiService.printTemp("/ElderlyCareSchedule/ExportAssistentWeeklyInfo2", data);
  },
  ExportElderlyCareScheduleInfoReports(data: Object) {
    return ApiService.printTemp("/ElderlyCareSchedule/ExportElderlyCareScheduleInfoReports", data);
  },
  Cancel(data: Object) {
    return ApiService.post("/ElderlyCareSchedule/Cancel", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/ElderlyCareSchedule/Update", data);
    } else {
      return ApiService.post("/ElderlyCareSchedule/Create", data);
    }
  },
  GetAsistentList(data: Object) {
    return ApiService.post("/ElderlyCareSchedule/GetAsistentList", data);
  },
  GetAsistent(assistentId: Number) {
    return ApiService.get(`/ElderlyCareSchedule/GetAssistent/${assistentId}`);
  },
  AddFeedback(data: Object) {
    return ApiService.post("/ElderlyCareSchedule/AddFeedback", data);
  },
  GetElderly(elderlyId: number | string) {
    return ApiService.get(`/ElderlyCareSchedule/GetElderly/${elderlyId}`);
  },
  UploadFile(data: any, config?: AxiosRequestConfig) {
    return ApiService.post(`/ElderlyCareSchedule/UploadFile`, data, config);
  },
};
export default ElderlyCareSchedule;
