import { defineStore } from "pinia";
import {
  GetQuestionnaire,
  GetQuestionnaireAnswers,
  GetQuestionnaireGroups,
  GetQuestionnaireQuestions,
  IUseQuestionnaireAlgorithm,
  IUseQuestionnaireAlgorithmTables
} from "../types";
import { AxiosError } from "axios";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import { ISelectList } from "@/models/basic";
import ManualService from "@/services/others/manual.service";
import { QuestionAnswerTemplateService } from "@/services/info/QuestionAnswerTemplate.service";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import { useGlobal } from "@/composables/useGlobal";
const { makeGuid } = useGlobal();

interface IUseQuestionnaire {
  data: GetQuestionnaire | null;
  loading: boolean;
  saveLoading: boolean;
  answerTypeSelectList: ISelectList[];
  filteredAnswerTypeSelectList: ISelectList[];
  questionnaireTypeSelectList: ISelectList[];
  questionAnswerTemplate: ISelectList[];
  questionAnswerTemplateSelectList: ISelectList[];

  questionTabRow: GetQuestionnaireGroups;
  eldQuestionnaireQuestions: GetQuestionnaireQuestions;
  questionsAnswers: GetQuestionnaireAnswers;
  algorithm: IUseQuestionnaireAlgorithm;
  algorithmQuestion: GetQuestionnaireQuestions[];
  algorithmAnswers: GetQuestionnaireAnswers[];
  algorithmTables: IUseQuestionnaireAlgorithmTables;
  selectedQuestionId2Str: string;
}

export const useQuestionnaire = defineStore("questionnaire", {
  state: (): IUseQuestionnaire => ({
    data: null,
    loading: false,
    saveLoading: false,
    answerTypeSelectList: [],
    filteredAnswerTypeSelectList: [],
    questionnaireTypeSelectList: [],
    questionAnswerTemplate: [],
    questionAnswerTemplateSelectList: [],
    questionTabRow: {
      id: 0,
      orderNumber: 1,
      questionGroupId: 0,
      eldQuestionnaireQuestions: [],
      title: "",
      translates: []
    },
    eldQuestionnaireQuestions: {
      answerTypeId: 0,
      hint: "",
      id: 0,
      orderNumber: 1,
      questionAnswerTemplateId: null,
      questionId: 0,
      eldQuestionnaireAnswers: [],
      questionText: "",
      translates: [],
      isRequired: false,
      id2Str: makeGuid(),
      constraints: []
    },
    questionsAnswers: {
      answerId: 0,
      answerText: "",
      id: 0,
      orderNumber: 1,
      questionAnswerTemplateTableId: null,
      translates: [],
      id2Str: makeGuid(),
      ball: 0
    },
    algorithm: {
      id: 0,
      isAny: false,
      eldQuestionnaireQuestionId2Str: "",
      tables: []
    },
    algorithmTables: {
      id: 0,
      isEqual: false,
      eldQuestionnaireAnswerId2Str: "",
      eldQuestionnaireQuestionId2Str: "",
      eldQuestionnaireAnswer: "",
      eldQuestionnaireQuestion: ""
    },
    algorithmQuestion: [],
    algorithmAnswers: [],
    selectedQuestionId2Str: ""
  }),
  getters: {
    getData(): GetQuestionnaire | null {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    GetAnswerTypeSelectList(): ISelectList[] {
      return this.answerTypeSelectList;
    },
    GetFilteredAnswerTypeSelectList(): ISelectList[] {
      return this.filteredAnswerTypeSelectList;
    },
    GetQuestionnaireTypeSelectList(): ISelectList[] {
      return this.questionnaireTypeSelectList;
    },
    getQuestionTabRow(): GetQuestionnaireGroups {
      return this.questionTabRow;
    },
    geteldQuestionnaireQuestions(): GetQuestionnaireQuestions {
      return this.eldQuestionnaireQuestions;
    },
    getQuestionAnswers(): GetQuestionnaireAnswers {
      return this.questionsAnswers;
    },
    getQuestionAnswerTemplate(): ISelectList[] {
      return this.questionAnswerTemplate;
    },
    getQuestionAnswerTemplateSelectList(): ISelectList[] {
      return this.questionAnswerTemplateSelectList;
    },
    getAlgorithm(): IUseQuestionnaireAlgorithm {
      return this.algorithm;
    },
    getAlgorithmQuestion(): GetQuestionnaireQuestions[] {
      return this.algorithmQuestion;
    },
    getAlgorithmAnswers(): GetQuestionnaireAnswers[] {
      return this.algorithmAnswers;
    },
    getSelectQuestionId2Str(): string {
      return this.selectedQuestionId2Str;
    },
    getAlgorithmTables(): IUseQuestionnaireAlgorithmTables {
      return this.algorithmTables;
    }
  },
  actions: {
    setData({ id, isClone, err, cb }: { err: (e: AxiosError<unknown>) => void; cb: () => void; isClone?: string; id: number | string }) {
      this.loading = true;
      const api = isClone ? "GetCloneById" : "Get";
      QuestionnaireService[api](id)
        .then((res) => {
          this.data = res.data;

          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    setAnswerTypeSelectList() {
      ManualService.GetAnswerTypeSelectList().then((res) => {
        this.answerTypeSelectList = res.data;
        this.filteredAnswerTypeSelectList = res.data;
      });
    },
    setQuestionTypeList() {
      ManualService.GetQuestionnaireTypeSelectList().then((res) => {
        this.questionnaireTypeSelectList = res.data;
      });
    },
    setQuestionTemplate() {
      QuestionAnswerTemplateService.GetAsSelectList().then((res) => {
        this.questionAnswerTemplate = res.data;
      });
    },
    acceptAnswersFromTemplate(groupIndex: number, questionIndex: number, value: number) {
      if (this.data) {
        const question = this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions[questionIndex];

        if (!question.answerTypeId) {
          question.questionAnswerTemplateId = null;
          notify({
            // @ts-ignore
            text: i18n.global.t("selectAnswerType"),
            type: "warn"
          });
          return;
        }

        QuestionAnswerTemplateService.Get(value).then((res) => {
          question.eldQuestionnaireAnswers = [];

          res.data.tables.forEach((element: GetQuestionnaireAnswers) => {
            question.eldQuestionnaireAnswers.push({
              answerText: element.answerText,
              translates: element.translates,
              questionAnswerTemplateTableId: element.id,
              orderNumber: element.orderNumber,
              id2Str: makeGuid(),
              ball: 0
            });
          });
        });
      }
    },

    /* QUESTIONS */

    addGroup() {
      this.data?.eldQuestionnaireGroups.push(JSON.parse(JSON.stringify(this.questionTabRow)));
    },
    deleteGroup(index: number) {
      if (this.data) {
        this.data.eldQuestionnaireGroups.splice(index, 1);
      }
    },
    addQuestionBeforeAfter(groupIndex: number, index: number) {
      if (this.data) {
        let question = Object.assign({}, { ...this.eldQuestionnaireQuestions, eldQuestionnaireAnswers: [] });

        this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions.splice(index, 0, question);
      }
    },
    addQuestion(groupIndex: number) {
      if (this.data) {
        const group = this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions;
        let convertedQuestion = {
          ...this.eldQuestionnaireQuestions,
          id2Str: makeGuid()
        };

        group.push(Object.assign({}, { ...convertedQuestion, eldQuestionnaireAnswers: [] }));
      }
    },

    deleteQuestion(groupIndex: number, questionIndex: number) {
      if (this.data) {
        this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions.splice(questionIndex, 1);
      }
    },

    addAnswer(groupIndex: number, questionIndex: number) {
      if (this.data) {
        const question = this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions[questionIndex];

        const convertedAnswer = {
          ...this.questionsAnswers,
          id2Str: makeGuid()
        };

        question.eldQuestionnaireAnswers.push(Object.assign({}, convertedAnswer));
      }
    },
    deleteAnswer(groupIndex: number, questionIndex: number, answerIndex: number) {
      if (!this.data) return;
      const question = this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions[questionIndex];

      question.eldQuestionnaireAnswers.splice(answerIndex, 1);
    },
    selectAnswerType(groupIndex: number, questionIndex: number, answerType: ISelectList) {
      if (this.data) {
        const question = this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions[questionIndex];
        if (answerType.value === 3 && question.questionAnswerTemplateId) {
          return;
        }

        if (answerType.value === 3) {
          question.eldQuestionnaireAnswers = [];
        }

        this.data.eldQuestionnaireGroups[groupIndex].eldQuestionnaireQuestions.splice(questionIndex, 1, {
          ...question,
          answerTypeId: answerType.value
        });
      }
    },

    // CONSTRAINTS

    /* flush */
    clearQuestion() {
      if (this.data) {
        this.eldQuestionnaireQuestions = {
          answerTypeId: null,
          hint: "",
          id: 0,
          orderNumber: 1,
          questionAnswerTemplateId: null,
          questionId: null,
          questionText: "",
          translates: [],
          eldQuestionnaireAnswers: [],
          isRequired: false,
          id2Str: makeGuid()
        };
      }
    },
    clearQuestionGroup() {
      if (this.data) {
        this.questionTabRow = {
          id: 0,
          orderNumber: this.data?.eldQuestionnaireGroups.length + 1,
          questionGroupId: 0,
          eldQuestionnaireQuestions: [],
          title: "",
          translates: []
        };
      }
    },
    flushAlgorithm() {
      this.algorithm = {
        id: 0,
        isAny: false,
        eldQuestionnaireQuestionId2Str: "",
        tables: []
      };
    },
    flushAlgorithmTables() {
      this.algorithmTables = {
        id: 0,
        isEqual: false,
        eldQuestionnaireQuestionId2Str: "",
        eldQuestionnaireAnswerId2Str: "",
        eldQuestionnaireAnswer: "",
        eldQuestionnaireQuestion: ""
      };
    },
    saveData({ cb, err }: { cb: () => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (this.data) {
        this.data.logList = [];
      }
      QuestionnaireService.Update(this.data)
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    }
  }
});
