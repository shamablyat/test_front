import { defineStore } from "pinia";
import { GetSurvey, ICompleteResult, ICompleteResultTables, QuestionsSelectList } from "../types";
import { AxiosError } from "axios";
import { ISelectList } from "@/models/basic";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import ManualService from "@/services/others/manual.service";
import { SurveyService } from "@/services/document/Survey.service";

interface IUseSurvey {
  data: GetSurvey | null;
  loading: boolean;
  saveLoading: boolean;
  searchLoading: boolean;
  questionnaireList: QuestionsSelectList[];

  surveyResultActionList: ISelectList[];
  questionnaireTypeList: ISelectList[];

  result: ICompleteResult;
  resultData: ICompleteResultTables | null;
  completeSurveyLoading: boolean;
}

export const useSurvey = defineStore("survey", {
  state: (): IUseSurvey => ({
    data: null,
    loading: false,
    saveLoading: false,
    searchLoading: false,

    questionnaireList: [],
    surveyResultActionList: [],
    questionnaireTypeList: [],
    result: {
      surveyId: null,
      surveyAnswers: {},
      surveyResultAlgorithms: []
    },
    resultData: null,
    completeSurveyLoading: false
  }),
  getters: {
    getData(): GetSurvey | null {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    getQuestionnaireList(): QuestionsSelectList[] {
      return this.questionnaireList;
    },
    getSurveyResultActionList(): ISelectList[] {
      return this.surveyResultActionList;
    },
    getQuestionnaireTypeList(): ISelectList[] {
      return this.questionnaireTypeList;
    },
    getResult(): ICompleteResult {
      return this.result;
    },
    getResultData(): ICompleteResultTables | null {
      return this.resultData;
    }
  },
  actions: {
    setData({
      id,
      err,
      cb,
      elderlyVerificationId,
      questionnaireType
    }: {
      id: number | string;
      elderlyVerificationId?: number | string;
      questionnaireType?: string | number;
      err: (e: AxiosError<unknown>) => void;
      cb: () => void;
    }) {
      this.data = null;
      this.loading = false;

      if (id != 0) {
        this.loading = true;
        SurveyService.Get(id)
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
      } else if (elderlyVerificationId) {
        this.loading = true;
        const questionnaireTypeId =
          questionnaireType === "bartelSurvey" ? 1 : questionnaireType == "lautonSurvey" ? 2 : questionnaireType === "livingConditionSurvey" ? 3 : "";
        SurveyService.GetByElderlyVerificationId(elderlyVerificationId, questionnaireTypeId)
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
      }
    },
    saveData({ cb, err }: { cb: (e: any) => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (this.data) {
        this.data.logList = [];
      }

      SurveyService.Update(this.data)
        .then((res) => {
          cb(res.data);
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    setSurveyResultActionList() {
      ManualService.GetSurveyResultTypeSelectList().then((res) => {
        this.surveyResultActionList = res.data;
      });
    },
    setQuestionnaireTypeList() {
      ManualService.GetQuestionnaireTypeSelectList().then((res) => {
        this.questionnaireTypeList = res.data;
      });
    },
    setQuestionnaires() {
      QuestionnaireService.GetQuestionnaireSelectList(`?questionnaireTypeId=${this.data?.eldQuestionnaireTypeId}`).then((res) => {
        this.questionnaireList = res.data;
      });
    },
    startSurvey(cbId: number | string) {
      SurveyService.StartSurvey(cbId).then(() => {
        if (this.data) {
          this.setData({
            id: cbId,
            err() {},
            cb() {}
          });
        }
      });
    },

    completeSurvey(cb: () => void, err: (e: any) => void, final: () => void) {
      if (!this.data) return;

      SurveyService.CompleteSurveyAndGetInfo({
        id: this.data.id,
        eldSurveyGroups: this.data.eldSurveyGroups
      })
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          final();
        });
    }
  }
});
