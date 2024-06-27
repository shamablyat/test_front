import { IPerson, ISelectList } from "@/models/basic";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import AdmManualService from "@/services/others/admmanual.service";
import PersonService from "@/services/others/person.service";
import { AxiosError } from "axios";
import { defineStore } from "pinia";
import { InOutTypes } from "../types";

export const useSentElderlyRegister = defineStore("sent-register", {
  state: () => ({
    data: null as any,
    loading: false as boolean,
    saveLoading: false as any,

    districtList: [] as ISelectList[],
    districtPersonList: [] as ISelectList[],
    districtActualList: [] as ISelectList[],

    mfyList: [] as ISelectList[],
    mfyPersonList: [] as ISelectList[],
    mfyActualList: [] as ISelectList[],

    regionsList: [] as ISelectList[],

    searchLoading: false as boolean,
    inTables: {
      person: null as IPerson | null
    } as any,
    outTables: {
      person: null as IPerson | null
    } as any,

    editedIndex: -1 as number,
    activeTab: "inTables" as InOutTypes,
    photo: "" as string,
    elderlyManageId: null as number | null
  }),
  getters: {
    getData(): any {
      return this.data;
    },

    getEditIndex(): number {
      return this.editedIndex;
    },
    getActiveTab(): InOutTypes {
      return this.activeTab;
    }
  },
  actions: {
    setData({ id, err, cb }: { id: number | string; err: (e: any) => void; cb?: (res: any) => void }) {
      this.loading = true;
      ElderlyRegisterService.Get(id)
        .then((res) => {
          this.data = {
            ...res.data,
            correctionElderlyManageInIds: [],
            CorrectionElderlyManageOutIds: []
          };
          if (id == "0") {
            this.data.decisionDocOn = null;
          }
          if (this.data.regionId) {
            this.getDistrict(this.data.regionId, "");
          }
          if (res.data.person) {
            this.data.pinfl = res.data.person?.pinfl;
          }

          if (cb) {
            cb(res.data);
          }
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    searchPerson({ filter, cb, error }: { filter: any; cb: (e: IPerson) => void; error: (e: AxiosError) => void }) {
      this.searchLoading = true;

      PersonService.GetByPassportData(filter)
        .then((res) => {
          cb(res.data);
        })
        .catch((e) => {
          error(e);
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },

    /* REGION MFY DISTRICTS */

    setRegions() {
      AdmManualService.RegionSelectlist().then((res) => {
        this.regionsList = res.data;
      });
    },
    getDistrict(regionId: number, type: string) {
      if (regionId) {
        AdmManualService.DistrictSelectList(regionId).then((res) => {
          if (type == "person") {
            this.districtPersonList = res.data;
          }
          if (type == "actual") {
            this.districtActualList = res.data;
          }
          if (!type || type.length === 0) {
            this.districtList = res.data;
          }
        });
      }
    },
    getMfyList(regionId: number | string, districtId: number | string, type: string) {
      AdmManualService.MfySelectList(regionId, districtId).then((res) => {
        if (type == "live") {
          this.mfyPersonList = res.data;
        }
        if (type == "actual") {
          this.mfyActualList = res.data;
        } else {
          this.mfyList = res.data;
        }
      });
    },

    /* FILE ATTACH */

    removeFile(type?: string) {
      if (!type) {
        this.data.files = [];
      }
      if (type == "in") {
        this.inTables.files = [];
      }
    },

    /* TABLE */
    setActiveTab(value: InOutTypes) {
      this.activeTab = value;
    },
    addRow(err: () => void, type: InOutTypes) {
      let s = 0;

      this.data[type].forEach((item: any) => {
        if (item.person.pinfl == this[type].person.pinfl && item.Status == 2) {
        } else {
          if (item.person.pinfl == this[type].person.pinfl) {
            s++;
          }
        }
      });
      if (s > 0) {
        err();
        return false;
      }

      this.data[type].push(JSON.parse(JSON.stringify(this[type])));

      if (type === "inTables") {
        this.data.correctionElderlyManageInIds.push(this.elderlyManageId);
      } else {
        this.data.CorrectionElderlyManageOutIds.push(this.elderlyManageId);
      }

      this.clearInTabRow(type);
    },
    deleteRow(index: number, type: InOutTypes) {
      this.data[type].splice(index, 1);

      if (type === "inTables") {
        const exist = this.data.correctionElderlyManageInIds.find((el: any) => el == this.elderlyManageId);

        if (exist) {
          const indexM = this.data.correctionElderlyManageInIds.indexOf(exist);

          this.data.correctionElderlyManageInIds.splice(indexM, 1);
        }
      } else {
        const exist = this.data.CorrectionElderlyManageOutIds.find((el: any) => el == this.elderlyManageId);

        if (exist) {
          const indexM = this.data.CorrectionElderlyManageOutIds.indexOf(exist);

          this.data.CorrectionElderlyManageOutIds.splice(indexM, 1);
        }
      }
    },

    clearInTabRow(type: InOutTypes) {
      this[type] = {
        person: null
      };
      this.editedIndex = -1;
    }
  }
});
