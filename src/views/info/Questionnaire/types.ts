import { DefaultGetData, ILogList, ITranslates } from "@/models/basic";

export interface GetQuestionnaire extends DefaultGetData {
  tableId: number | null;
  statusId: number | null;
  organizationId: number | null;
  status: string;
  organizationName: string;
  eldQuestionnaireType: string;
  eldQuestionnaireGroups: GetQuestionnaireGroups[];
  translates: ITranslates[];
  logList: ILogList[];
  canAccept: true;
  canEdit: true;
  canCancel: true;
  canDelete: true;
  canSent: true;
  docNumber: string;
  docOn: string;
  title: string;
  details: string;
  eldQuestionnaireTypeId: number | null;
  message: string;
  eldAlgorithms: IUseQuestionnaireAlgorithm[];
}

export interface GetQuestionnaireGroups {
  eldQuestionnaireQuestions: GetQuestionnaireQuestions[];
  id: number | null;
  questionGroupId: number | null;
  orderNumber: number | null;
  title: string;
  translates: ITranslates[];
}
export interface GetQuestionnaireQuestions {
  id: number | null;
  questionId: number | null;
  questionAnswerTemplateId: number | null;
  orderNumber: number | null;
  questionText: string;
  hint: string;
  answerTypeId: number | null;
  translates: ITranslates[];
  eldQuestionnaireAnswers: GetQuestionnaireAnswers[];
  isRequired: boolean;
  id2Str: string;
  constraints?: IConstrains[];
}
export interface GetQuestionnaireAnswers {
  id?: number | null;
  answerId?: number | null;
  questionAnswerTemplateTableId?: number | null;
  orderNumber?: number | null;
  answerText: string;
  translates: ITranslates[];
  id2Str: string;
  ball: number;
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

export interface IConstrains {
  id: number;
  isAny: boolean;
  conditionedTables: IConstrainsTablesEqual[];
  selectedTables: IConstrainsTablesEqual[];
}

export interface IConstrainsTables {
  id: number;
  eldQuestionnaireAnswerId2Str: string;
  eldQuestionnaireAnswer: string;
}
export interface IConstrainsTablesEqual extends IConstrainsTables {
  isEqual: boolean;
}
