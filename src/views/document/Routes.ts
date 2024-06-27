import { RouteRecordRaw } from "vue-router";
import { ElderlyRegisterRoutes } from "./elderlyRegister/Routes";
import { ElderlyCareScheduleRoutes } from "./elderlyCareSchedule/Routes";
import { ElderlyCareWorkerReportRoutes } from "./elderlyCareWorkerReport/Routes";
// import { SurveyRoutes } from "./Survey/Routes";
import { EldApplicationRoutes } from "./eldApplication/Routes";
import { ElderlyVerificationRoutes } from "./elderlyVerification/Routes";
import { AgreedVerification } from "./AgreedVerification/Routes";
import { SentElderlyRegisterRoutes } from "./CorrectElderlyRegister/Routes";
import { DeleteDocRoutes } from "./DeleteDoc/Routes";

export const DocumentRoutes: RouteRecordRaw[] = [
  ...ElderlyRegisterRoutes,
  ...ElderlyCareScheduleRoutes,
  ...ElderlyCareWorkerReportRoutes,
  ...EldApplicationRoutes,
  ...ElderlyVerificationRoutes,
  ...AgreedVerification,
  ...SentElderlyRegisterRoutes,
  ...DeleteDocRoutes
  // ...SurveyRoutes,
];
