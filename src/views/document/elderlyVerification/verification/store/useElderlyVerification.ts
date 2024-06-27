import { ISelectList } from "@/models/basic";
import ManualService from "@/services/others/manual.service";
import { defineStore } from "pinia";
import { ElderlyVerification, GetElderlyVerificationTableHasValue } from "../types";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import ElderlyService from "@/services/info/elderlyService.service";
import AdmManualService from "@/services/others/admmanual.service";

interface IUseElderlyVerification {
  data: ElderlyVerification;
  cachedData: ElderlyVerification;
  dataLoading: boolean;
  pageLoading: boolean;
  pensionTypeList: ISelectList[];
  elderlyServiceList: ISelectList[];
  organizationList: ISelectList[];
  individualProgramTypeList: ISelectList[];
  elderlyVerificationTableHasValue: GetElderlyVerificationTableHasValue | null;
  elderlyCategory: ISelectList | null;
}

const dataDef: ElderlyVerification = {
  id: 0,
  docNumber: "",
  docOn: "",
  applicationId: null,
  applicantPerson: null,
  regionId: null,
  districtId: null,
  mfyId: null,
  details: "",
  expireOn: "",
  conclusion: "",
  application: null,
  bartelSurveyId: null,
  lautonSurveyId: null,
  livingConditionSurveyId: null,
  pensionAmount: 0,
  pensionType: "",
  disabilityGroup: null,
  elderlyCategory: "",
  elderlyCategoryId: null,
  statusId: 0,
  data: 0,
  files: []
};

let timeout_of_loading: ReturnType<typeof setTimeout>;

export const useElderlyVerification = defineStore("ElderlyVerification", {
  state: (): IUseElderlyVerification => ({
    data: dataDef,
    cachedData: dataDef,
    dataLoading: false,
    pageLoading: false,
    pensionTypeList: [],
    individualProgramTypeList: [],
    organizationList: [],
    elderlyServiceList: [],
    elderlyVerificationTableHasValue: null,
    elderlyCategory: null
  }),
  getters: {
    getPensionTypeList(): ISelectList[] {
      return this.pensionTypeList;
    },
    getData(): ElderlyVerification {
      return this.data;
    },
    getElderlyVerificationTableHasValue(): GetElderlyVerificationTableHasValue | null {
      return this.elderlyVerificationTableHasValue;
    },
    getElderlyCategory(): ISelectList | null {
      return this.elderlyCategory;
    }
  },
  actions: {
    setElderlyServiceList() {
      ElderlyService.GetAsSelectList("?isGroup=false").then((res) => {
        this.elderlyServiceList = res.data;
      });
    },
    setData({
      id,
      applicationId,
      err,
      cb,
      manageId,
      final
    }: {
      id: number | string;
      applicationId?: number | string;
      manageId?: number | string;
      err: (e: any) => void;
      cb?: (res: any) => void;
      final?: () => void;
    }) {
      if (applicationId) {
        ElderlyVerificationService.GetByApplicationId(applicationId)
          .then((res) => {
            this.data = res.data;
            this.cachedData = JSON.parse(JSON.stringify(res.data));
            if (cb) {
              cb(res.data);
            }
          })
          .catch((e) => {
            err(e);
          })
          .finally(() => {
            if (final) {
              final();
            }
          });
      } else if (manageId) {
        ElderlyVerificationService.GetByElderlyManageId(manageId)
          .then((res) => {
            this.data = res.data;
            this.cachedData = JSON.parse(JSON.stringify(res.data));
            if (cb) {
              cb(res.data);
            }
          })
          .catch((e) => {
            err(e);
          })
          .finally(() => {
            if (final) {
              final();
            }
          });
      } else {
        ElderlyVerificationService.Get(id)
          .then((res) => {
            this.data = res.data;
            if (cb) {
              cb(res.data);
            }
          })
          .catch((e) => {
            err(e);
          })
          .finally(() => {
            if (final) {
              final();
            }
          });
      }
    },
    setElderlyVerificationTableHasValue(id: number | string, cb?: (e: GetElderlyVerificationTableHasValue) => void) {
      this.dataLoading = true;
      ElderlyVerificationService.ElderlyVerificationTableHasValue(id)
        .then((res) => {
          this.elderlyVerificationTableHasValue = res.data;
          if (cb) {
            cb(res.data);
          }
        })
        .finally(() => {
          if (timeout_of_loading) {
            clearTimeout(timeout_of_loading);
          }
          timeout_of_loading = setTimeout(() => {
            this.dataLoading = false;
          }, 1000);
        });
    },
    setPensionTypeList() {
      if (this.pensionTypeList.length == 0) {
        ManualService.GetPensionTypeSelectList().then((res) => {
          this.pensionTypeList = res.data;
        });
      }
    },
    setElderlyCategory(cb?: (e: any) => void) {
      ElderlyVerificationService.GetElderlyCategoryIdByElderlyVerificationId(this.data.id).then((res) => {
        this.elderlyCategory = res.data;
        if (res.data) {
          this.data.elderlyCategory = res.data.text;
          this.data.elderlyCategoryId = res.data.value;
        }
        if (cb) {
          cb(res.data);
        }
      });
    },
    fetchIndividualProgramTypeList() {
      if (this.individualProgramTypeList.length > 0) return;
      ManualService.GetIndividualProgramTypeSelectList().then((res) => {
        this.individualProgramTypeList = res.data;
      });
    },
    fetchOrganizationSelectList() {
      if (this.organizationList.length > 0) return;
      AdmManualService.OrganizationSelectList().then((res) => {
        this.organizationList = res.data;
      });
    },
    flushData() {
      this.data = dataDef;
    }
  }
});
