import { ISetPassportData } from "@/components/setPassportData/types";
import { ISelectList } from "@/models/basic";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import ElderlyReasonService from "@/services/info/elderlyreason.service";
import AdmManualService from "@/services/others/admmanual.service";
import ManualService from "@/services/others/manual.service";
import PersonService from "@/services/others/person.service";
import { AxiosError } from "axios";
import { defineStore } from "pinia";

interface IUseElderlyRegister {
  data: any;
  dataLoadingStatus: boolean;

  districtList: ISelectList[];
  districtPersonList: ISelectList[];
  districtActualList: ISelectList[];

  mfyList: ISelectList[];
  mfyPersonList: ISelectList[];
  mfyActualList: ISelectList[];

  regionsList: ISelectList[];

  searchLoading: boolean;
  temporaryResidenceTypeList: ISelectList[];
  elderlyCategoryList: ISelectList[];
  photo: string;
  inTabrow: any;
  outTabrow: any;
  activeTab: number;
  isReasonRequired: boolean;

  InElderlyReasonList: ISelectList[];
  outElderlyReasonList: ISelectList[];
  editedIndex1: number;
  editedIndex2: number;
  refreshLoading: boolean;

  pensionTypeList: ISelectList[];
  elderlyReasonList: ISelectList[];
  unregisterOutPersonImg: string;
  managePhoto: string;
  assistantPhoto: string;
}

interface IPassportBody extends ISetPassportData {
  includePension: boolean;
  includeDisabilityGroup: boolean;
  includeAddress: boolean;
  includePhoto: boolean;
}

export const useElderlyRegister = defineStore("elderylRegister", {
  state: (): IUseElderlyRegister => ({
    data: {},
    dataLoadingStatus: false,

    districtList: [],
    districtPersonList: [],
    districtActualList: [],

    mfyList: [],
    mfyPersonList: [],
    mfyActualList: [],

    searchLoading: false,

    regionsList: [],
    temporaryResidenceTypeList: [],

    elderlyCategoryList: [],
    elderlyReasonList: [],
    pensionTypeList: [],
    photo: "",
    inTabrow: {
      personId: 0,
      mfy: "",
      elderlyCategory: "",
      elderlyReason: "",
      pensionType: "",
      livingRegion: "",
      temporaryResidenceType: "",
      disabilityDiagnosis: "",
      compensationType: "",
      icd10: "",
      files: [],
      responsiblePerson: {},
      person: null,
      livingMfy: "",
      livingDistrict: "",
      elderlyReasonId: 0,
      elderlyCategoryId: 0,
      phoneNumber: "",
      mfyId: 0,
      id: 0,
      disabilityDiagnosisId: 0,
      compensationTypeId: 0,
      icd10Id: 0,
      pensionAmount: 0,
      pensionTypeId: 0,
      elderlyManageId: 0,
      livingAddress: "",
      livingMfyId: 0,
      livingDistrictId: 0,
      livingRegionId: 0,
      temporaryResidenceTypeId: null,
      isTemporary: false,
      temporaryRegionId: null,
      temporaryDistrictId: null,
      temporaryMfyId: null,
      temporaryAddressId: null,
      Status: 1,
      isCategoryMismatch: false,
      categoryMismatchReason: "",
      fullName: null,
      isInSxv: false
    },
    outTabrow: {
      id: 0,
      elderlyManageId: 0,
      elderlyReasonId: 0,
      person: {},
      personId: null
    },
    activeTab: 1,
    isReasonRequired: false,
    InElderlyReasonList: [],
    outElderlyReasonList: [],
    editedIndex1: -1,
    editedIndex2: -1,
    refreshLoading: false,
    managePhoto: "",
    assistantPhoto: "",
    unregisterOutPersonImg: ""
  }),
  getters: {
    getManagePhoto(): string {
      return this.managePhoto;
    },
    getData(): any {
      return this.data;
    },
    getDataLoadingStatus(): boolean {
      return this.dataLoadingStatus;
    },
    getDistrictList(): ISelectList[] {
      return this.districtList;
    },
    getDistrictPersonList(): ISelectList[] {
      return this.districtPersonList;
    },
    getDistrictActualList(): ISelectList[] {
      return this.districtActualList;
    },
    getRegionsList(): ISelectList[] {
      return this.regionsList;
    },
    getMfyPersonList(): ISelectList[] {
      return this.mfyPersonList;
    },
    getTemporaryResidenceTypeList(): ISelectList[] {
      return this.temporaryResidenceTypeList;
    },
    getSearchLoading(): boolean {
      return this.searchLoading;
    },
    getElderlyCategoryList(): ISelectList[] {
      return this.elderlyCategoryList;
    },
    getPhoto(): string {
      return this.photo;
    },
    getIntabRow(): any {
      return this.inTabrow;
    },
    getOutTabRow(): any {
      return this.outTabrow;
    },
    getActiveTab(): number {
      return this.activeTab;
    },
    getInElderlyReasonList(): ISelectList[] {
      return this.InElderlyReasonList;
    },
    getOutElderlyReasonList(): ISelectList[] {
      return this.outElderlyReasonList;
    },
    getIsReasonRequired(): boolean {
      return this.isReasonRequired;
    },
    getEditIndex1(): number {
      return this.editedIndex1;
    },
    getEditIndex2(): number {
      return this.editedIndex2;
    },
    getRefreshLoading(): boolean {
      return this.refreshLoading;
    },
    getElderlyReasonList(): ISelectList[] {
      return this.elderlyReasonList;
    },
    getPensionTypeList(): ISelectList[] {
      return this.pensionTypeList;
    },
    getUnregisterOutPersonImg(): string {
      return this.unregisterOutPersonImg;
    }
  },
  actions: {
    setData({
      id,
      err,
      cb,
      verificationId,
      unregisterId
    }: {
      id: number | string;
      err: (e: any) => void;
      cb?: (res: any) => void;
      verificationId?: string | number;
      unregisterId?: string | number;
    }) {
      this.dataLoadingStatus = true;
      let api = verificationId ? "GetByElderlyVerificationId" : unregisterId ? "UnregisterGetByManageId" : "Get";
      // @ts-ignore
      ElderlyRegisterService[api](verificationId ? verificationId : unregisterId ? unregisterId : id)
        .then((res: any) => {
          this.data = res.data;
          if (id == 0 && !verificationId) {
            this.data.decisionDocOn = null;
          }

          this.getDistrict(this.data.regionId, "");
          this.getMfyList(this.data.regionId, this.data.districtId, "");

          if (res.data.person) {
            this.data.pinfl = res.data.person?.pinfl;
            // this.searchPerson();
            this.getDistrict(this.data.livingRegionId, "actual");
            this.getMfyList(this.data.livingRegionId, this.data.livingDistrictId, "actual");
            if (res.data.person.id) {
              this.setPhoto(res.data.person.id);
            }
          }

          if (res.data.temporaryRegionId) {
            this.getDistrict(this.data.temporaryRegionId, "person");
          }
          if (res.data.temporaryDistrictId) {
            this.getMfyList(this.data.temporaryRegionId, this.data.temporaryDistrictId, "live");
          }

          if (cb) {
            cb(res.data);
          }

          if (unregisterId) {
            this.setUnregisterPersonImg(res.data.outTables[0].personId);
          }

          this.dataLoadingStatus = false;
        })
        .catch((e: any) => {
          err(e);
          this.dataLoadingStatus = false;
        });
    },
    setTemporaryResidenceTypeList() {
      AdmManualService.GetTemporaryResidenceTypeSelectList().then((res) => {
        this.temporaryResidenceTypeList = res.data;
      });
    },
    setElderlyReason() {
      ElderlyReasonService.GetAsSelectList(1).then((res) => {
        this.InElderlyReasonList = res.data;
      });
      ElderlyReasonService.GetAsSelectList(2).then((res) => {
        this.outElderlyReasonList = res.data;
      });
    },
    resetElderlyReason() {
      this.inTabrow.elderlyReasonId = null;
    },
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
    setPhoto(id: number, type?: "manage" | "assistant") {
      PersonService.GetPhotoFromGSP(id).then((res) => {
        if (type === "manage") {
          this.managePhoto = `data:image/jpeg;base64,${res.data.base64String}`;
        } else {
          this.photo = `data:image/png;base64, ${res.data.base64String}`;
        }
      });
    },

    setUnregisterPersonImg(id: any) {
      PersonService.GetPhotoFromGSP(id).then((res) => {
        this.unregisterOutPersonImg = `data:image/png;base64, ${res.data.base64String}`;
      });
    },

    previewFiles(formData: FormData, type?: string) {
      if (!type) {
        ElderlyRegisterService.UploadFile(formData).then((res) => {
          this.data.files = [
            {
              id: res.data[0].fileId,
              fileName: res.data[0].fileName
            }
          ];
        });
      }
      if (type == "in") {
        ElderlyRegisterService.UploadInTableFile(formData).then((res) => {
          this.inTabrow.files = [
            {
              id: res.data[0].fileId,
              fileName: res.data[0].fileName,
              columnName: "OWNER_ID"
            }
          ];
        });
      }
    },
    setActiveTab(value: number) {
      this.activeTab = value;
      this.clearTabRow(value);
    },
    removeFile(type?: string) {
      if (!type) {
        this.data.files = [];
      }
      if (type == "in") {
        this.inTabrow.files = [];
      }
    },
    setElderlyCategoryList(parentId: number | string | boolean) {
      ManualService.GetElderlyCategorySelectList("", parentId).then((res) => {
        this.elderlyCategoryList = res.data;
        if (this.inTabrow.elderlyCategoryId) {
          this.elderlyCategorySelected(this.inTabrow.elderlyCategoryId);
        }
      });
    },
    elderlyCategorySelected(id: number) {
      if (this.inTabrow.elderlyCategoryId) {
        this.inTabrow.elderlyCategory = this.elderlyCategoryList.filter((el: any) => el.value == this.inTabrow.elderlyCategoryId)[0].text;
      } else {
        this.inTabrow.elderlyCategory = "";
      }

      const obj: any = this.elderlyCategoryList.find((el: any) => el.value === id);

      if (obj) {
        this.isReasonRequired = obj.isReasonRequired;
      }
    },
    outElderlyCategorySelected(id: number) {
      if (id) {
        this.outTabrow.elderlyReason = this.outElderlyReasonList.filter((el: any) => el.value == id)[0].text;
      } else {
        this.inTabrow.elderlyReason = "";
      }
    },
    searchPerson({ filter, err }: { err?: (e: AxiosError) => void; filter: ISetPassportData }) {
      this.searchLoading = true;

      PersonService.GetByPassportData(filter)
        .then((res) => {
          this.inTabrow.person = JSON.parse(JSON.stringify(res.data));
          this.inTabrow.livingRegionId = res.data.livingAddress.regionId;
          this.inTabrow.livingDistrictId = res.data.livingAddress.districtId;
          this.inTabrow.livingRegion = res.data.livingAddress.region;
          this.inTabrow.livingDistrict = res.data.livingAddress.district;
          this.inTabrow.livingAddress = res.data.livingAddress.address;
          this.inTabrow.pensionTypeId = res.data.pension.pensionTypeId;
          this.inTabrow.pensionType = res.data.pension.pensionType;
          this.inTabrow.pensionAmount = res.data.pension.summa;
          this.inTabrow.disabilityGroup = res.data.disabilityGroup;
          this.inTabrow.livingMfyId = 0;
          this.inTabrow.person.photo = null;
          this.photo = `data:image/png;base64,${res.data.photo}`;

          this.getDistrict(this.inTabrow.livingRegionId, "actual");
          this.getMfyList(this.inTabrow.livingRegionId, this.inTabrow.livingDistrictId, "actual");
          this.setElderlyCategoryList(res.data.disabilityGroup == null ? false : true);

          this.searchLoading = false;
        })
        .catch((e: AxiosError) => {
          this.searchLoading = false;
          if (err) {
            err(e);
          }
        });
    },
    changeTemporaryRegion() {
      this.inTabrow.temporaryMfyId = 0;
      this.inTabrow.temporaryDistrictId = 0;
      this.getDistrict(this.inTabrow.temporaryRegionId, "person");
    },
    changeTemporaryDistrict() {
      this.inTabrow.temporaryMfyId = 0;
      this.getMfyList(this.inTabrow.temporaryRegionId, this.inTabrow.temporaryDistrictId, "live");
    },
    clearTabRow(value: number) {
      if (value == 1) {
        this.inTabrow = {
          personId: 0,
          mfy: "",
          elderlyCategory: "",
          elderlyReason: "",
          pensionType: "",
          livingRegion: "",
          temporaryResidenceType: "",
          disabilityDiagnosis: "",
          compensationType: "",
          icd10: "",
          files: [],
          responsiblePerson: {},
          person: null,
          livingMfy: "",
          livingDistrict: "",
          elderlyReasonId: 0,
          elderlyCategoryId: 0,
          phoneNumber: "",
          mfyId: 0,
          id: 0,
          disabilityDiagnosisId: 0,
          compensationTypeId: 0,
          icd10Id: 0,
          pensionAmount: 0,
          pensionTypeId: 0,
          elderlyManageId: 0,
          livingAddress: "",
          livingMfyId: 0,
          livingDistrictId: 0,
          livingRegionId: 0,
          temporaryResidenceTypeId: null,
          isTemporary: false,
          temporaryRegionId: null,
          temporaryDistrictId: null,
          temporaryMfyId: null,
          temporaryAddressId: null,
          Status: 1,
          isCategoryMismatch: false,
          categoryMismatchReason: "",
          fullName: null,
          isInSxv: false
        };
        this.editedIndex1 = -1;
      } else {
        this.outTabrow = {
          id: 0,
          elderlyManageId: 0,
          elderlyReasonId: 0,
          person: {}
        };

        this.editedIndex2 = -1;
      }

      this.photo = "";
    },
    addInTableRow(err: () => void) {
      let s = 0;
      this.data.inTables.forEach((item: any) => {
        if (item.person.pinfl == this.inTabrow.person.pinfl && item.Status == 2) {
        } else {
          if (item.person.pinfl == this.inTabrow.person.pinfl) {
            s++;
          }
        }
      });
      if (s > 0) {
        err();
        return false;
      }

      if (this.editedIndex1 > -1) {
        Object.assign(this.data.inTables[this.editedIndex1], JSON.parse(JSON.stringify(this.inTabrow)));
      } else {
        this.data.inTables.push(JSON.parse(JSON.stringify(this.inTabrow)));
      }

      this.clearTabRow(1);
      this.isReasonRequired = false;
    },
    addOutTableRow({ err }: { err: (e: string) => void }) {
      if (this.editedIndex2 > -1) {
        Object.assign(this.data.outTables[this.editedIndex2], JSON.parse(JSON.stringify(this.outTabrow)));
      } else {
        if (this.data.outTables.some((el: any) => el.personId === this.outTabrow.personId)) {
          err("alreadyExistPerson");
          return;
        }
        this.data.outTables.push(JSON.parse(JSON.stringify(this.outTabrow)));
      }

      this.clearTabRow(2);
      this.isReasonRequired = false;
    },
    edit(item: any, type: "in" | "out") {
      if (type == "in") {
        this.inTabrow = item;
        this.inTabrow.Status = 2;
        item.Status = 2;

        this.editedIndex1 = this.data.inTables.indexOf(item);
        this.inTabrow = Object.assign({}, item);
        this.getDistrict(this.inTabrow.livingRegionId, "actual");

        this.getMfyList(this.inTabrow.livingRegionId, this.inTabrow.livingDistrictId, "actual");
        this.setElderlyCategoryList(this.inTabrow.disabilityGroup == null ? false : true);

        if (this.inTabrow.isTemporary) {
          this.getDistrict(this.inTabrow.temporaryRegionId, "person");
          this.getMfyList(this.inTabrow.temporaryRegionId, this.inTabrow.temporaryDistrictId, "live");
        }

        if (this.inTabrow.personId) {
          this.setPhoto(this.inTabrow.personId);
        }
      } else {
        this.outTabrow = item;
        this.outTabrow.Status = 2;
        item.Status = 2;
        this.editedIndex2 = this.data.outTables.indexOf(item);
        this.outTabrow = Object.assign({}, item);
        if (this.outTabrow.personId) {
          this.setPhoto(this.outTabrow.personId, "manage");
        }
      }
    },

    deleteTable(index: number, type: "in" | "out") {
      if (type === "in") {
        this.data.inTables.splice(index, 1);
      } else {
        this.data.outTables.splice(index, 1);
      }
    },
    saveData({ cb, err }: { cb: () => void; err: (e: any) => void }) {
      this.data.decisionDocOn = this.data.docOn;
      this.data.decisionDocNumber = this.data.docNumber;
      ElderlyRegisterService.Update(this.data)
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        });
    },
    refreshPassportData() {
      this.refreshLoading = true;
      this.data.inTables.forEach((item: any) => {
        const passportData: IPassportBody = {
          dateOfBirth: item.person.birthOn,
          documentTypeId: item.person.documentTypeId,
          number: item.person.docNumber,
          seria: item.person.docSeria,
          pinfl: item.person.pnfl,
          includeAddress: true,
          includeDisabilityGroup: true,
          includePension: true,
          includePhoto: true
        };
        PersonService.GetByPassportData(passportData)
          .then((res) => {
            item.person = JSON.parse(JSON.stringify(res.data));
            item.livingRegionId = res.data.livingAddress.regionId;
            item.livingDistrictId = res.data.livingAddress.districtId;
            item.livingRegion = res.data.livingAddress.region;
            item.livingDistrict = res.data.livingAddress.district;
            item.livingAddress = res.data.livingAddress.address;
            item.pensionTypeId = res.data.pension.pensionTypeId;
            item.pensionType = res.data.pension.pensionType;
            item.pensionAmount = res.data.pension.summa;
            item.disabilityGroup = res.data.disabilityGroup;
            item.livingMfyId = 0;
            item.person.photo = null;
            item.livingMfyId = 0;
            item.person.photo = null;
          })
          .finally(() => {
            this.refreshLoading = false;
          });
      });

      this.data.outTables.forEach((element: any) => {
        element.person = JSON.parse(JSON.stringify(element));
        element.person.photo = null;
      });
    }
  }
});
