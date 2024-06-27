import { DefaultGetData, ILogList } from "@/models/basic";

export interface GetSurveyResultAlgorithm extends DefaultGetData {
  docNumber: string;
  docOn: string;
  details: string;
  eldQuestionnaire: string;
  eldQuestionnaireId: number | null;
  statusId: number | null;
  organizationId: number | null;
  bartelEldQuestionnaireId: number | null;
  lautonEldQuestionnaireId: number | null;
  weeklyHour: number | null;
  organization: string;
  questionnaire: string;
  bartelEldQuestionnaire: string;
  lautonEldQuestionnaire: string;
  tables: SurveyResultAlgorithmTables[];
  resultServices: SurveyResultAlgorithmResultServices[];
  logList: ILogList[];
  isForBall: boolean;
  status: string;
}

export interface SurveyResultAlgorithmResultServices {
  id: number;
  eldQuestionnaireGroupId: number | null;
  eldQuestionnaireQuestionId: number | null;
  eldQuestionnaireAnswerId: number | null;
  eldServiceId: number | null;

  eldQuestionnaireGroup: string;
  eldQuestionnaireQuestion: string;
  eldQuestionnaireAnswer: string;
  eldService: string;
}

export interface SurveyResultAlgorithmTables {
  id: number;
  eldSurveyResultTypeId: number | null;
  eldSurveyResultType: string;
  fromBall: number | null;
  toBall: number | null;
  dailyHour: number | null;
  dayCount: number | null;
}

export interface SurveyResultAlgorithmQuestionnaireGroups {
  id: number | null;
  title: string;
}
export interface SurveyResultAlgorithmQuestionnaireQuestions {
  id: number | null;
  questionText: string;
}
export interface SurveyResultAlgorithmQuestionnaireAnswer {
  id: number | null;
  answerText: string;
}

export type TypeTables = "tables" | "resultServices";
