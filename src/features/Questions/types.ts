import { DefaultGetData, ILogList, IPerson, ISelectList } from "@/models/basic";
export interface QuestionsSelectList extends ISelectList {
  isChecked: boolean;
}
export interface GetSurvey extends DefaultGetData {
  region: string;
  eldSurveyGroups: GetGroup[];
  logList: ILogList[];
  tableId: number | null;
  statusId: number | null;
  organizationId: number | null;
  status: string;
  organization: string;
  eldQuestionnaire: string;
  docNumber: string;
  docOn: string;
  details: string;
  eldQuestionnaireId: number | null;
  startAt: string | null;
  endAt: string | null;
  realStartAt: string | null;
  realEndAt: string | null;
  eldAlgorithms: IUseQuestionnaireAlgorithm[];
  eldQuestionnaireTypeId: number;
  forDocId: number;
  forTableId: number;
}
export interface IUseQuestionnaireAlgorithm {
  id: number | null;
  eldQuestionnaireQuestionId2Str: string;
  isAny: boolean;
  tables: IUseQuestionnaireAlgorithmTables[];
}

export interface IUseQuestionnaireAlgorithmTables {
  id: number | null;
  eldQuestionnaireQuestionId2Str: string;
  eldQuestionnaireQuestion: string;
  eldQuestionnaireAnswerId2Str: string;
  eldQuestionnaireAnswer: string;
  isEqual: boolean;
}

export interface GetGroup {
  eldSurveyQuestions: GetQuestions[];
  id: number;
  eldQuestionnaireGroupId: number | null;
  title: string;
}
export interface GetQuestions {
  answerType: string;
  answerTypeId: number;
  isAnswered: boolean;
  eldQuestionAnswerTemplateId: number | null;
  questionText: string;
  id: number;
  eldQuestionnaireQuestionId: number | null;
  eldSurveyAnswers: GetAnswers[];
  isRequired?: boolean;
  isVisible?: boolean;
  eldQuestionnaireQuestionId2: string;
  constraints: ISurveyConstrains[];
}
export interface GetAnswers {
  answerText?: string | null;
  id: number | null;
  isChecked?: boolean;
  eldQuestionAnswerTemplateTableId?: number | null;
  eldQuestionnaireAnswerId?: number | null;
  textAnswer: string | null;
  eldQuestionnaireAnswerId2: string;
  isDisabled: boolean;
  ball: number;
}

export interface GetAgreeLetterSelectList {
  agreeLetterId: number | null;
  orderCode?: number | string | null;
  person: IPerson;
  socialEmployee: IPerson;
  text?: string | null;
  value?: number | string;
}

export interface ICompleteResult {
  surveyId: number | null;
  surveyAnswers: any;
  surveyResultAlgorithms: any[];
}
export interface IAddress {
  id: number;
  isTemporary: boolean;
  livingAddress: string;
  livingDistrict: string;
  livingDistrictId: number;
  livingMfy: string;
  livingMfyId: number;
  livingRegion: string;
  livingRegionId: number | null;
  temporaryAddress: string | null;
  temporaryDistrict: string | null;
  temporaryDistrictId: number | null;
  temporaryMfy: string | null;
  temporaryMfyId: number | null;
  temporaryRegion: string | null;
  temporaryRegionId: number | null;
  temporaryResidenceType: string | null;
  temporaryResidenceTypeId: number | null;
}

export interface ICompleteResultTables {
  id: number | null;
  canEdit: boolean;
  canAccept: boolean;
  canCancel: boolean;
  canDelete: boolean;
  docNumber: string;
  docOn: string;
  details: string;
  surveyId: number;
  tables: ICompleteResultGetInfoTables[];
}

export interface ICompleteResultGetInfoTables {
  person: string;
  surveyResultAction: string;
  questionnaireType: string;
  applicationType: string;
  id: number;
  personId: number | null;
  surveyResultActionId: number | null;
  questionnaireTypeId: number | null;
  applicationTypeId: number | null;
  feedback: string;
  nextSurveyId: number | null;
  nextApplicationId: number | null;
}

export interface ISurveyConstrains {
  id: number;
  isAny: boolean;
  conditionedTables: ISurveyTablesEqual[];
  selectedTables: ISurveyTablesEqual[];
}

export interface ISurveyConstrainsTables {
  id: number;
  eldQuestionnaireAnswerId2Str: string;
  eldQuestionnaireAnswer: string;
}
export interface ISurveyTablesEqual extends ISurveyConstrainsTables {
  isEqual: boolean;
}
