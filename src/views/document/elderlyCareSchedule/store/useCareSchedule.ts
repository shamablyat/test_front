import { ISetPassportData } from "@/components/setPassportData/types";
import { ISelectList } from "@/models/basic";
import ElderlyCareScheduleService from "@/services/document/elderySchedule.service";
import ElderlyService from "@/services/info/elderlyService.service";
import AdmManualService from "@/services/others/admmanual.service";
import ManualService from "@/services/others/manual.service";
import PersonService from "@/services/others/person.service";
import { usePhoneFormatter } from "@/utils/helpers/phoneFormatter";
import { AxiosError } from "axios";
import { defineStore } from "pinia";
import { IElderlyScheduleTabRow, TabRowView } from "../types";
import { nextTick } from "vue";
import NotAttachAssistantReasonService from "@/services/info/notAttachAssistantReason.service";

const { set } = usePhoneFormatter();

interface IUseElderlySchedule {
  elderlyManageList: any[];
  data: any;
  loading: boolean;
  searchLoading: boolean;
  elderlyManageLoading: boolean;
  elderlyCategoryList: ISelectList[];
  elderlyReasonList: ISelectList[];
  pensionTypeList: ISelectList[];
  attachAssistantReasonList: ISelectList[];
  endElderlyReasonList: ISelectList[];
  tabRow: IElderlyScheduleTabRow;
  tabRowList: any[];
  tables: TabRowView;
  filterPerson: ISetPassportData;
  elderlyServiceList: ISelectList[];
  editIndex: number;
  saveLoading: boolean;
  managePhoto: string;
  assistantPhoto: string;
  isSelectedPerson: boolean;
  assistantPerson: any;
}
interface IPassportBody extends ISetPassportData {
  includePension: boolean;
  includeDisabilityGroup: boolean;
  includeAddress: boolean;
  includePhoto: boolean;
}

export const useElderlySchedule = defineStore("elderlySchedule", {
  state: (): IUseElderlySchedule => ({
    elderlyManageList: [],
    data: null,
    loading: false,
    searchLoading: false,
    elderlyManageLoading: false,
    elderlyCategoryList: [],
    elderlyReasonList: [],
    endElderlyReasonList: [],
    pensionTypeList: [],
    attachAssistantReasonList: [],
    tabRow: {
      beginAt: "",
      details: "",
      endAt: "",
      elderlyServiceId: "",
      weekDayOn: null,
      orderNumber: 1
    },
    tabRowList: [],
    tables: {},
    filterPerson: {
      documentTypeId: null,
      dateOfBirth: "",
      number: "",
      seria: "",
      pinfl: null
    },
    elderlyServiceList: [],
    editIndex: -1,
    saveLoading: false,
    managePhoto: "",
    assistantPhoto: "",
    isSelectedPerson: false,
    assistantPerson: {}
  }),
  getters: {
    getManagePhoto(): string {
      return this.managePhoto;
    },
    getAssistantPhoto(): string {
      return this.assistantPhoto;
    },
    getElderlyManageList(): any[] {
      return this.elderlyManageList;
    },
    getData(): any {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getElderlyManageLoading(): boolean {
      return this.elderlyManageLoading;
    },

    getSearchLoading(): boolean {
      return this.searchLoading;
    },
    getElderlyCategoryList(): ISelectList[] {
      return this.elderlyCategoryList;
    },
    getElderlyReasonList(): ISelectList[] {
      return this.elderlyReasonList;
    },
    getPensionTypeList(): ISelectList[] {
      return this.pensionTypeList;
    },
    getAttachAssistantReasonList(): ISelectList[] {
      return this.attachAssistantReasonList;
    },
    getFilterPerson(): ISetPassportData {
      return this.filterPerson;
    },
    getElderlyServiceList(): ISelectList[] {
      return this.elderlyServiceList;
    },
    getTabRow(): IElderlyScheduleTabRow {
      return this.tabRow;
    },
    getEditIndex(): number {
      return this.editIndex;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    getIsSelectedPerson(): boolean {
      return this.isSelectedPerson;
    },
    getAssistantPerson(): any {
      return this.assistantPerson;
    },
    getTables(): any {
      return this.tables;
    }
  },
  actions: {
    setElderlyServiceList() {
      if (this.data && this.data.elderlyVerificationId) {
        ElderlyCareScheduleService.ElderlyServiceAsSelectList(`?verificationId=${this.data.elderlyVerificationId}`).then((res) => {
          this.elderlyServiceList = res.data;
        });
      } else {
        ElderlyService.GetAsSelectList().then((res) => {
          this.elderlyServiceList = res.data;
        });
      }
    },
    setData({ id, cb, err, isClone }: { cb: (data: any) => void; err: (e: AxiosError) => void; id: number | string; isClone?: string }) {
      this.loading = true;
      const api = isClone ? "GetCloneById" : "Get";
      ElderlyCareScheduleService[api](id)
        .then((res) => {
          this.data = res.data;
          cb(res.data);
          this.loading = false;
          if (id == 0) {
            this.data.assistantPerson.birthOn = null;
            this.data.attachAssitant = true;
          }

          if (res.data.elderlyManage?.elderlyId) {
            this.setPhoto(res.data.elderlyManage?.elderlyId, "manage");
          }

          if (res.data.assistantPersonId) {
            this.setPhoto(res.data.assistantPersonId, "assistant");
            this.setIsSelectedPerson(true);
          }

          for (const item of res.data.tables) {
            this.setTables(item);
          }
        })
        .catch((e) => {
          err(e);

          this.loading = false;
        });
    },
    setElderlyCategoryList() {
      ManualService.GetElderlyCategorySelectList("", true).then((res) => {
        this.elderlyCategoryList.push(...res.data);
      });
      ManualService.GetElderlyCategorySelectList("", false).then((res) => {
        this.elderlyCategoryList.push(...res.data);
      });
    },
    setElderlyReasonList() {
      AdmManualService.GetTemporaryResidenceTypeSelectList().then((res) => {
        this.elderlyReasonList = res.data;
      });
    },
    setPensionTypeList() {
      ManualService.GetPensionTypeSelectList().then((res) => {
        this.pensionTypeList = res.data;
      });
    },
    setAttachAssistantReasonList() {
      NotAttachAssistantReasonService.GetAsSelectList().then((res) => {
        this.attachAssistantReasonList = res.data;
      });
    },
    setTables(values: any) {
      if (values.elderlyServiceId in this.tables) {
        for (const item of this.tables[+values.elderlyServiceId]) {
          if (item.weekDayOn === values.weekDayOn) {
            Object.assign(item, JSON.parse(JSON.stringify(values)));
            return;
          }
        }
        this.tables = {
          ...this.tables,
          [values.elderlyServiceId]: [...this.tables[values.elderlyServiceId], ...[JSON.parse(JSON.stringify(values))]]
        };
      } else {
        this.tables = {
          ...this.tables,
          [values.elderlyServiceId]: [values]
        };
      }
    },
    setManage(item: any) {
      this.data.elderlyManage.elderlyBirhtOn = item.elderlyBirtOn;
      this.data.elderlyManage.elderlyCategory = item.elderlyCategory;
      this.data.elderlyManage.elderlyDistrict = item.elderlyDistrict;
      this.data.elderlyManage.elderlyFullName = item.fullName;
      this.data.elderlyManage.elderlyGender = item.elderlyGender;
      this.data.elderlyManage.elderlyMfy = item.elderlyMfy;
      this.data.elderlyManage.elderlyPensionType = item.pensionType;
      this.data.elderlyManage.elderlyRegion = item.elderlyRegion;
      this.data.elderlyManage.elderlyId = item.personId;
      this.data.elderlyManage.elderlyManageId = item.id;
      this.data.elderlyManageId = item.id;

      if (item.personId) {
        this.setPhoto(item.personId, "manage");
      }
    },
    setPhoto(id: number, type: "manage" | "assistant") {
      PersonService.GetPhotoFromGSP(id).then((res) => {
        if (type === "manage") {
          this.managePhoto = `data:image/jpeg;base64,${res.data.base64String}`;
        } else {
          this.assistantPhoto = `data:image/jpeg;base64,${res.data.base64String}`;
        }
      });
    },
    searchPerson({ filter, err }: { err: (e: AxiosError) => void; filter: ISetPassportData }) {
      this.searchLoading = true;
      const innerFilter: IPassportBody = {
        ...filter,
        includeAddress: true,
        includeDisabilityGroup: true,
        includePension: true,
        includePhoto: true
      };
      PersonService.GetByPassportData(innerFilter)
        .then((res) => {
          this.assistantPerson = res.data;
          this.assistantPhoto = `data:image/jpeg;base64,${res.data.photo}`;
          this.data.assistantPerson.photo = "";
          this.searchLoading = false;
        })
        .catch((er: AxiosError) => {
          err(er);
          this.searchLoading = false;
        });
    },
    deleteTabRow(item: number, index: number) {
      this.tables[+item].splice(index, 1);

      if (this.tables[item].length === 0) {
        delete this.tables[item];
      }
    },

    setTabRow(service: number, item: IElderlyScheduleTabRow) {
      this.editIndex = this.tables[service].indexOf(item);
      this.tabRow = Object.assign({}, item);
    },
    clearTabRow() {
      this.tabRow = {
        orderNumber: Object.keys(this.data.tables).length + 1,
        beginAt: "",
        details: "",
        endAt: "",
        elderlyServiceId: "",
        weekDayOn: null
      };
      this.editIndex = -1;
    },
    updateDataTables() {
      for (const item in this.tables) {
        this.data.tables.push(...this.tables[item]);
      }
    },
    async saveData({ cb, err }: { cb: (data: any) => void; err: (e: AxiosError) => void }) {
      this.saveLoading = true;
      if (this.data.attachAssitant) {
        this.data.assistantPhoneNumber = set(this.data.assistantPhoneNumber);
        this.data.assistantPerson.photo = "";
      } else {
        this.data.assistantPerson = null;
      }
      let list: any[] = [];

      for (const item in this.tables) {
        list.push(...this.tables[item]);
        list.forEach((element: IElderlyScheduleTabRow, index: number) => {
          element.orderNumber = index + 1;
        });
      }

      this.data.tables = [...new Map(list.map((el) => [el["orderNumber"], el])).values()];

      await nextTick();
      ElderlyCareScheduleService.Update(this.data)
        .then((res) => {
          cb(res);
          this.saveLoading = false;
        })
        .catch((error: AxiosError) => {
          err(error);
          this.saveLoading = false;
        });
    },
    setIsSelectedPerson(value: boolean) {
      this.isSelectedPerson = value;
    },
    clearAssisTantPerson() {
      this.assistantPerson = {};
    },
    setDataAssistantPerson(value: any) {
      this.data.assistantPerson = value;
    },
    removeFile() {
      this.data.files = [];
    }
  }
});
