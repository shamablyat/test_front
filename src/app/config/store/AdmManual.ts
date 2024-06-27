import { defineStore } from "pinia";
import AdmManualService from "@/services/others/admmanual.service";
import { ILanguageList, ISelectList } from "@/models/basic";

export const useAdmManualStore = defineStore({
  id: "AdmManual",
  state: () => ({
    StateList: [] as ISelectList[],
    StateListLoading: false,
    LanguageList: [] as ILanguageList[],
    LanguageListLoading: false,
    GenderList: [] as ISelectList[],
    GenderListLoading: false,
    TableList: [] as ISelectList[],
    TableListLoading: false,
    KinshipDegreeList: [] as ISelectList[],
    KinshipDegreeListLoading: false,
    MfyAttachedMemberTypeList: [] as ISelectList[],
    MfyAttachedMemberTypeListLoading: false,
    Icd10List: [] as ISelectList[],
    Icd10ListLoading: false,

    mnnSelectList: [] as ISelectList[],
    mnnSelectListWithoutPrivilege: [] as ISelectList[],
    treatmentTypeSelectList: [] as ISelectList[]
  }),
  actions: {
    fetchStateList() {
      if (this.StateList.length == 0) {
        this.StateListLoading = true;
        AdmManualService.StateSelectList()
          .then((res) => {
            this.StateList = res.data;
          })
          .finally(() => {
            this.StateListLoading = false;
          });
      }
    },
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
    fetchGenderList() {
      if (this.GenderList.length == 0) {
        this.GenderListLoading = true;
        AdmManualService.GenderSelectList()
          .then((res) => {
            this.GenderList = res.data;
          })
          .finally(() => {
            this.GenderListLoading = false;
          });
      }
    },
    fetchTableList() {
      if (this.TableList.length == 0) {
        this.TableListLoading = true;
        AdmManualService.TableSelectList()
          .then((res) => {
            this.TableList = res.data;
          })
          .finally(() => {
            this.TableListLoading = false;
          });
      }
    },
    fetchKinshipDegreeList(degree?: number) {
      if (this.KinshipDegreeList.length == 0) {
        this.KinshipDegreeListLoading = true;
        AdmManualService.KinshipDegreeSelectList(degree)
          .then((res) => {
            this.KinshipDegreeList = res.data;
          })
          .finally(() => {
            this.KinshipDegreeListLoading = false;
          });
      }
    },
    fetchIcd10List() {
      if (this.Icd10List.length == 0) {
        this.Icd10ListLoading = true;
        AdmManualService.Icd10SelectList()
          .then((res) => {
            this.Icd10List = res.data.slice(0, 10);
          })
          .finally(() => {
            this.Icd10ListLoading = false;
          });
      }
    },
    fetchMfyAttachedMemberTypeList() {
      if (this.MfyAttachedMemberTypeList.length == 0) {
        this.MfyAttachedMemberTypeListLoading = true;
        AdmManualService.MfyAttachedMemberTypeSelectList()
          .then((res) => {
            this.MfyAttachedMemberTypeList = res.data;
          })
          .finally(() => {
            this.MfyAttachedMemberTypeListLoading = false;
          });
      }
    },

    fetchMnnSelectList(query?:string) {
      if (this.mnnSelectList && this.mnnSelectList.length) return;

      AdmManualService.MnnSelectList(query).then((res) => {
        this.mnnSelectList = res.data;
      });
    },

    fetchMnnSelectListWithoutPrivilege(query?:string) {
      if (this.mnnSelectListWithoutPrivilege && this.mnnSelectListWithoutPrivilege.length) return;

      AdmManualService.MnnSelectList(query).then((res) => {
        this.mnnSelectListWithoutPrivilege = res.data;
      });
    },

    refreshMnnSelectList() {
      this.mnnSelectList = []
    },
    refreshMnnSelectListWithoutPrivilege() {
      this.mnnSelectListWithoutPrivilege = []
    },
    fetchTreatmentTypeSelectList() {
      if (this.treatmentTypeSelectList && this.treatmentTypeSelectList.length) return;

      AdmManualService.TreatmentTypeSelectList().then((res) => {
        this.treatmentTypeSelectList = res.data;
      });
    }
  }
});
