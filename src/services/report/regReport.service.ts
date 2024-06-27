import ApiService from "../api.service";

const ReportService = {
  GetElderlyRegistry(data: any) {
    return ApiService.post("RegReport/GetElderlyRegistry", data);
  },
  ExportElderlyRegisterInAndOut(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyRegisterInAndOut", data);
  },
  GetRegisteredElderly(data: any) {
    return ApiService.post("RegReport/GetRegisteredElderly", data);
  },
  ExportElderlyRegisterByRegion(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyRegisterByRegion", data);
  },
  GetRegisteredElderlyWithAssistant(data: any) {
    return ApiService.post("RegReport/GetRegisteredElderlyWithAssistant", data);
  },
  ExportElderlyRegisterByRegionWithAssistant(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyRegisterByRegionWithAssistant", data);
  },
  ExportGetServices(data: any) {
    return ApiService.printTemp("RegReport/ExportGetServices", data);
  },
  ExportElderlyRegisterOut(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyRegisterOut", data);
  },
  ExportElderlyRegisterIn(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyRegisterIn", data);
  },
  GetAssistantServices(data: any) {
    return ApiService.post("RegReport/GetAssistantServices", data);
  },
  ExportAssistantServices(data: any) {
    return ApiService.printTemp("RegReport/ExportAssistantServices", data);
  },
  GetElderlyManageOutReasonsCount(data: any) {
    return ApiService.post("RegReport/GetElderlyManageOutReasonsCount", data);
  },
  ExportElderlyManageOutReasonsCount(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyManageOutReasonsCount", data);
  },
  GetAssistantWorkingProcessCount(data: any) {
    return ApiService.post("RegReport/GetAssistantWorkingProcessCount", data);
  },
  ExportAssistantWorkingProcessCount(data: any) {
    return ApiService.printTemp("RegReport/ExportAssistantWorkingProcessCount", data);
  },
  GetElderlyVerificationCount(data: any) {
    return ApiService.post("RegReport/GetElderlyVerificationCount", data);
  },
  ExportElderlyVerificationCount(data: any) {
    return ApiService.printTemp("RegReport/ExportElderlyVerificationCount", data);
  },
  GetVerificationMonitoringCount(data: any) {
    return ApiService.post("RegReport/GetVerificationMonitoringCount", data);
  },
  ExportVerificationMonitoringCount(data: any) {
    return ApiService.printTemp("RegReport/ExportVerificationMonitoringCount", data);
  },
  GetEldApplication(data: any) {
    return ApiService.post("RegReport/GetEldApplication", data);
  },
  ExportEldApplication(data: any) {
    return ApiService.printTemp("RegReport/ExportEldApplication", data);
  },
  GetApplicationCountByStep(data: any) {
    return ApiService.post("RegReport/GetApplicationCountByStep", data);
  },
  ExportGetApplicationCountByStep(data: any) {
    return ApiService.printTemp("RegReport/ExportGetApplicationCountByStep", data);
  },
  GetNotWorkedAssistants(data: any) {
    return ApiService.post("RegReport/GetNotWorkedAssistants", data);
  },
  ExportNotWorkedAssitants(data: any) {
    return ApiService.printTemp("RegReport/ExportNotWorkedAssitants", data);
  },
  GetAssistantWeeklyReport(data: any) {
    return ApiService.post("RegReport/GetAssistantWeeklyReport", data);
  },
  GetServicesReport(data: any) {
    return ApiService.post("RegReport/GetServicesReport", data);
  },
  ExportAssistantWeeklyReport(data: any) {
    return ApiService.printTemp("RegReport/ExportAssistantWeeklyReport", data);
  }
};

export default ReportService;
