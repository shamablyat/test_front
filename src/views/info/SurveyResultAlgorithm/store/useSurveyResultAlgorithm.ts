import { defineStore } from "pinia";
import {
  GetSurveyResultAlgorithm,
  SurveyResultAlgorithmQuestionnaireAnswer,
  SurveyResultAlgorithmQuestionnaireGroups,
  SurveyResultAlgorithmQuestionnaireQuestions,
  SurveyResultAlgorithmResultServices,
  SurveyResultAlgorithmTables
} from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { SurveyResultAlgorithmService } from "@/services/info/SurveyResultAlgorithm.service";
import { ISelectList } from "@/models/basic";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import ManualService from "@/services/others/manual.service";
import ElderlyService from "@/services/info/elderlyService.service";

type AddRowType = "tables" | "resultServices";

interface IUseSurveyResultAlgorithm {
  data: GetSurveyResultAlgorithm | null;
  loading: boolean;
  saveLoading: boolean;
  isPersistentTabRow: boolean;

  questionnaireList: ISelectList[];
  questionnaireTypeList: ISelectList[];
  eldSurveyResultTypeList: ISelectList[];
  bartelQuestions: ISelectList[];
  lautonQuestions: ISelectList[];
  tables: SurveyResultAlgorithmTables;
  editIndex: number;
  resultServices: SurveyResultAlgorithmResultServices;

  /* questionnaire */

  groupsList: SurveyResultAlgorithmQuestionnaireGroups[];
  questionsList: SurveyResultAlgorithmQuestionnaireQuestions[];
  answersList: SurveyResultAlgorithmQuestionnaireAnswer[];
  elderlyServices: ISelectList[];
}

export const useSurveyResultAlgorithm = defineStore("useSurveyResultAlgorithm", {
  state: (): IUseSurveyResultAlgorithm => ({
    data: null,
    loading: false,
    saveLoading: false,
    isPersistentTabRow: false,

    questionnaireList: [],
    bartelQuestions: [],
    lautonQuestions: [],
    questionnaireTypeList: [],
    eldSurveyResultTypeList: [],
    tables: {
      id: 0,
      eldSurveyResultTypeId: null,
      eldSurveyResultType: "",
      fromBall: null,
      toBall: null,
      dailyHour: null,
      dayCount: null
    },
    resultServices: {
      eldQuestionnaireAnswer: "",
      eldQuestionnaireAnswerId: null,
      eldQuestionnaireGroup: "",
      eldQuestionnaireGroupId: null,
      eldQuestionnaireQuestion: "",
      eldQuestionnaireQuestionId: null,
      eldService: "",
      eldServiceId: null,
      id: 0
    },
    editIndex: -1,

    answersList: [],
    groupsList: [],
    questionsList: [],
    elderlyServices: []
  }),
  getters: {
    getData(): GetSurveyResultAlgorithm | null {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getIsPersistentTabRow(): boolean {
      return this.isPersistentTabRow;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    getQuestionnaireList(): ISelectList[] {
      return this.questionnaireList;
    },
    getQuestionnaireTypeList(): ISelectList[] {
      return this.questionnaireTypeList;
    },
    getEldSurveyResultTypeList(): ISelectList[] {
      return this.eldSurveyResultTypeList;
    },

    getTables(): SurveyResultAlgorithmTables {
      return this.tables;
    },
    getEditIndex(): number {
      return this.editIndex;
    }
  },
  actions: {
    setData({ id, err, cb }: { err: (e: AxiosError<unknown>) => void; cb: () => void; id: number | string }) {
      this.loading = true;
      SurveyResultAlgorithmService.Get(id)
        .then((res: AxiosResponse<GetSurveyResultAlgorithm>) => {
          this.data = res.data;
          if (res.data.eldQuestionnaireId) {
            this.setQuestionnaireGroups(res.data.eldQuestionnaireId);
          }
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    saveData({ cb, err }: { cb: () => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (this.data) {
        this.data.logList = [];
      }

      SurveyResultAlgorithmService.Update(this.data)
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    setQuestionnaireTypeList() {
      ManualService.GetQuestionnaireTypeSelectList().then((res) => {
        this.questionnaireTypeList = res.data;
      });
    },
    setBartelAndLautonQuestions() {
      if (this.bartelQuestions && this.bartelQuestions.length === 0) {
        QuestionnaireService.GetQuestionnaireSelectList(`?questionnaireTypeId=1`).then((res) => {
          this.bartelQuestions = res.data;
        });
      }
      if (this.bartelQuestions && this.lautonQuestions.length === 0) {
        QuestionnaireService.GetQuestionnaireSelectList(`?questionnaireTypeId=1`).then((res) => {
          this.lautonQuestions = res.data;
        });
      }
    },
    setQuestionnaireList() {
      QuestionnaireService.GetQuestionnaireSelectList().then((res) => {
        this.questionnaireList = res.data;
      });
    },
    setSurveyResultTypeSelectList() {
      ManualService.GetSurveyResultTypeSelectList().then((res) => {
        this.eldSurveyResultTypeList = res.data;
      });
    },

    /* QUESTIONNAIRE */
    setQuestionnaireGroups(questionnaireId: number | string) {
      QuestionnaireService.GetQuestionnaireGroups(questionnaireId).then((res) => {
        this.groupsList = res.data;
      });
    },
    setQuestionnaireQuestions(groupId: number | string) {
      if (this.data && this.data.eldQuestionnaireId) {
        QuestionnaireService.GetQuestionnaireQuestions(this.data.eldQuestionnaireId, groupId).then((res) => {
          this.questionsList = res.data;
        });
      }
    },
    setQuestionnaireAnswers(questionId: number | string) {
      if (this.data && this.data.eldQuestionnaireId && this.resultServices.eldQuestionnaireGroupId) {
        QuestionnaireService.GetQuestionnaireAnswers(this.data.eldQuestionnaireId, this.resultServices.eldQuestionnaireGroupId, questionId).then(
          (res) => {
            this.answersList = res.data;
          }
        );
      }
    },
    setElderServicesSelectList() {
      if (this.elderlyServices && this.elderlyServices.length > 0) return;

      ElderlyService.GetAsSelectList('?isGroup=false').then((res) => {
        this.elderlyServices = res.data;
      });
    },

    addRow(type: AddRowType) {
      if (this.data) {
        if (this.editIndex > -1) {
          Object.assign(
            this.data[type][this.editIndex],
            // @ts-ignore
            JSON.parse(JSON.stringify(this[type]))
          );
        } else {
          this.data[type].push(
            JSON.parse(
              JSON.stringify(
                // @ts-ignore
                this[type]
              )
            )
          );
        }
        this.editIndex = -1;
        this.clearTables();
        this.clearResultServices();
      }
    },
    editRow(item: any, type: AddRowType) {
      if (this.data) {
        this.editIndex = this.data[type].indexOf(item);
        // @ts-ignore
        this[type] = JSON.parse(JSON.stringify(item));

        if (type === "resultServices" && this.data.eldQuestionnaireId) {
          this.setQuestionnaireGroups(this.data.eldQuestionnaireId);
          if (item.eldQuestionnaireGroupId) {
            this.setQuestionnaireQuestions(item.eldQuestionnaireGroupId);
            if (item.eldQuestionnaireQuestionId) {
              this.setQuestionnaireAnswers(item.eldQuestionnaireQuestionId);
            }
          }
        }
      }
    },
    deleteRow(index: number, type: AddRowType) {
      if (this.data) {
        this.data[type].splice(index, 1);
      }
    },
    clearTables() {
      this.tables = {
        eldSurveyResultTypeId: null,
        eldSurveyResultType: "",
        fromBall: null,
        id: 0,
        toBall: 0,
        dailyHour: null,
        dayCount: null
      };
    },
    clearResultServices() {
      this.resultServices = {
        eldQuestionnaireAnswer: "",
        eldQuestionnaireAnswerId: null,
        eldQuestionnaireGroup: "",
        eldQuestionnaireGroupId: null,
        eldQuestionnaireQuestion: "",
        eldQuestionnaireQuestionId: null,
        eldService: "",
        eldServiceId: null,
        id: 0
      };
    }
  }
});
