import { ElderlyManageRoutes } from "./ElderlyManage/Routes";
import { ElderlyReasonRoutes } from "./ElderlyReason/Routes";
import { ElderlyServiceRoutes } from "./elderlyService/Routes";
import { IndividualProgramRoutes } from "./IndividualProgram/Routes";
import { LivingConditionRoutes } from "./livingcondition/Routes";
import { NotAttachAssistantReasonRoutes } from "./NotAttachAssistantReason/Routes";
import { NotProtectionReasonRoutes } from "./NotProtectionReason/Routes";
import { QuestionnaireRoutes } from "./Questionnaire/Routes";
import { RouteRecordRaw } from "vue-router";
import { SurveyResultAlgorithmRoutes } from "./SurveyResultAlgorithm/Routes";

export const InfoRoutes: RouteRecordRaw[] = [
    ...ElderlyManageRoutes,
    ...ElderlyServiceRoutes,
    ...QuestionnaireRoutes,
    ...SurveyResultAlgorithmRoutes,
    ...IndividualProgramRoutes,
    ...LivingConditionRoutes,
    ...NotProtectionReasonRoutes,
    ...NotAttachAssistantReasonRoutes,
    ...ElderlyReasonRoutes
]