import { defineStore } from "pinia";
import { ILanguageList, ISelectList } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import ManualService from "@/services/others/manual.service";

export const useManualStore = defineStore({
  id: "Manual",
  state: () => ({
    LanguageList: [] as ILanguageList[],
    LanguageListLoading: false,
    organizations: [] as ISelectList[],
    regions: [] as ISelectList[],
    documentTypeList: [] as ISelectList[],
    DangerousTypeList: [] as ISelectList[],
    DangerousTypeListLoading: false,
    SatisfactionTypeSelectList: [] as ISelectList[],
    SatisfactionTypeSelectListLoading: false,
    ProtectionMeasureSelectList: [] as ISelectList[],
    ProtectionMeasureSelectListLoading: false,

    stateSelectList: [] as ISelectList[],
    elderlyFamilyMemberPlaceSelectList: [] as ISelectList[],
    DeleteDocTypeSelectList: [] as ISelectList[],
    periodTypeSelectList: [] as ISelectList[]
  }),
  getters: {
    getOrganizations(): ISelectList[] {
      return this.organizations;
    },

    getRegions(): ISelectList[] {
      return this.regions;
    },
    getDocumentTypeList(): ISelectList[] {
      return this.documentTypeList;
    }
  },
  actions: {
    fetchLanguageList() {
      if (this.LanguageList.length == 0) {
        this.LanguageListLoading = true;
        AdmManualService.LanguageSelectList()
          .then((res) => {
            this.LanguageList = res.data;
          })
          .finally(() => {
            this.LanguageListLoading = false;
          });
      }
    },
    fetchPeriodTypeSelectList() {
      if (this.periodTypeSelectList.length == 0) {
        AdmManualService.PeriodTypeSelectList()
          .then((res) => {
            this.periodTypeSelectList = res.data;
          })
      }
    },
    setOrganizations() {
      AdmManualService.OrganizationSelectList().then((res) => {
        this.organizations = res.data;
      });
    },

    setRegions() {
      if (this.regions && this.regions.length > 0) {
        return;
      }
      AdmManualService.RegionSelectlist().then((res) => {
        this.regions = res.data;
      });
    },
    setDocumentTypeList() {
      if (this.documentTypeList && this.documentTypeList.length > 0) {
        return;
      }

      AdmManualService.DocumentTypeSelectList().then((res) => {
        this.documentTypeList = res.data;
      });
    },
    fetchDangerousTypeList() {
      if (this.DangerousTypeList.length == 0) {
        this.DangerousTypeListLoading = true;
        ManualService.GetDangerousTypeSelectList()
          .then((res) => {
            this.DangerousTypeList = res.data;
          })
          .finally(() => {
            this.DangerousTypeListLoading = false;
          });
      }
    },
    fetchSatisfactionTypeSelectList() {
      if (this.SatisfactionTypeSelectList.length == 0) {
        this.SatisfactionTypeSelectListLoading = true;
        ManualService.GetSatisfactionTypeSelectList()
          .then((res) => {
            this.SatisfactionTypeSelectList = res.data;
          })
          .finally(() => {
            this.SatisfactionTypeSelectListLoading = false;
          });
      }
    },
    fetchProtectionMeasureSelectList() {
      if (this.ProtectionMeasureSelectList.length == 0) {
        this.ProtectionMeasureSelectListLoading = true;
        ManualService.GetProtectionMeasureSelectList()
          .then((res) => {
            this.ProtectionMeasureSelectList = res.data;
          })
          .finally(() => {
            this.ProtectionMeasureSelectListLoading = false;
          });
      }
    },
    setStateSelectList() {
      if (this.stateSelectList && this.stateSelectList.length > 0) return;

      AdmManualService.StateSelectList().then((res) => {
        this.stateSelectList = res.data;
      });
    },
    fetchElderlyFamilyMemberPlaceSelectList() {
      if (this.elderlyFamilyMemberPlaceSelectList && this.elderlyFamilyMemberPlaceSelectList.length) return;

      ManualService.GetElderlyFamilyMemberPlaceSelectList().then((res) => {
        this.elderlyFamilyMemberPlaceSelectList = res.data;
      });
    },
    fetchDocDeleteTypeSelectList() {
      if (this.DeleteDocTypeSelectList && this.DeleteDocTypeSelectList.length > 0) return;

      ManualService.GetDocDeleteTypeSelectList().then((res) => {
        this.DeleteDocTypeSelectList = res.data;
      });
    }
  }
});
