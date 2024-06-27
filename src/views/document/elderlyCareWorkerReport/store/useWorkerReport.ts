import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import { defineStore } from "pinia";
import { IReportByDayBody } from "../types";

interface IUseWorkerReport {
  reportByDay: any;
  loading: boolean;
  reportByDayBody: IReportByDayBody;
  saveLoading: boolean;
  isView: boolean;
}

export const useWorkerReport = defineStore("worker-report", {
  state: (): IUseWorkerReport => ({
    reportByDay: {},
    loading: false,
    saveLoading: false,
    reportByDayBody: {
      elderlyManageId: null,
      dateOn: ""
    },
    isView: false
  }),
  getters: {
    getReportByDay(): any {
      return this.reportByDay;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    getReportByDayBody(): IReportByDayBody {
      return this.reportByDay;
    },
    getIsView(): boolean {
      return this.isView;
    }
  },

  actions: {
    setReportByDay({ err }: { err: (e: any) => void }) {
      this.loading = true;
      ElderlyCareWorkerReportService.GetAssistantReportByDay(this.reportByDayBody)
        .then((res) => {
          this.reportByDay = res.data;
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setReportByBody(value: IReportByDayBody) {
      this.reportByDayBody = value;
    },
    getReport({ err, id }: { err: (e: any) => void; id: number | string }) {
      this.loading = true;
      ElderlyCareWorkerReportService.Get(id)
        .then((res) => {
          this.reportByDay = res.data;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              res.data.longitude = position.coords.longitude;
              res.data.latitude = position.coords.latitude;
            });
          }
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    saveReportByDay({ cb, err }: { cb: () => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.reportByDay.longitude = position.coords.longitude;
          this.reportByDay.latitude = position.coords.latitude;
        });
      }
      for (const item of this.reportByDay.tables) {
        delete item["id"];
      }
      ElderlyCareWorkerReportService.Update(this.reportByDay)
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
    setIsView(value: boolean) {
      this.isView = value;
    },
    refreshReportByDay() {
      this.reportByDay = null;
      this.reportByDayBody = {
        dateOn: "",
        elderlyManageId: null
      };
    }
  }
});
