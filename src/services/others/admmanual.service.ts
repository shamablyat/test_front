import ApiService from "../api.service";
const AdmManualService = {
  StateSelectList() {
    return ApiService.get("/AdmManual/StateSelectList");
  },
  StatusSelectList() {
    return ApiService.get("/AdmManual/StatusSelectList");
  },
  RegionSelectlist() {
    return ApiService.get("/AdmManual/RegionSelectlist");
  },
  MfySelectList(regionId: string | number, districtId: string | number) {
    return ApiService.get(`/AdmManual/MfySelectList?regionId=${regionId}&districtId=${districtId}`);
  },
  DistrictSelectList(regionId: number | string) {
    return ApiService.get(`/AdmManual/DistrictSelectList/${regionId}`);
  },
  DocumentTypeSelectList() {
    return ApiService.get(`/AdmManual/DocumentTypeSelectList`);
  },
  PeriodTypeSelectList() {
    return ApiService.get(`/AdmManual/PeriodTypeSelectList`);
  },
  OrganizationSelectList() {
    return ApiService.get(`/AdmManual/OrganizationSelectList`);
  },
  LanguageSelectList() {
    return ApiService.get(`/AdmManual/LanguageSelectList`);
  },
  GetTemporaryResidenceTypeSelectList() {
    return ApiService.get("/AdmManual/GetTemporaryResidenceTypeSelectList");
  },
  GenderSelectList() {
    return ApiService.get(`/AdmManual/GenderSelectList`);
  },
  TableSelectList() {
    return ApiService.get(`/AdmManual/TableSelectList`);
  },
  KinshipDegreeSelectList(degree?: number | string) {
    if (degree) {
      return ApiService.get(`/AdmManual/KinshipDegreeSelectList?degreeId=${degree}`);
    }
    return ApiService.get(`/AdmManual/KinshipDegreeSelectList`);
  },
  GetMfyAttachedMember(data: Object) {
    return ApiService.post("/AdmManual/GetMfyAttachedMember", data);
  },
  GetUserRoles(data: Object) {
    return ApiService.post("/AdmManual/GetUserRoles", data);
  },
  MfyAttachedMemberTypeSelectList() {
    return ApiService.get("/AdmManual/MfyAttachedMemberTypeSelectList");
  },
  Icd10SelectList(parentId?: number | string) {
    if (parentId) {
      return ApiService.get(`/AdmManual/Icd10SelectList?parentId=${parentId}`);
    }
    return ApiService.get("/AdmManual/Icd10SelectList");
  },
  TreatmentTypeSelectList() {
    return ApiService.get("/AdmManual/TreatmentTypeSelectList");
  },
  MnnSelectList(queary?: string) {
    if (queary) {
      return ApiService.get(`/AdmManual/MnnSelectList${queary}`);
    } else {
      return ApiService.get("/AdmManual/MnnSelectList");
    }
  },
  ExportUserRoles(data: any) {
    return ApiService.printTemp("AdmManual/ExportUserRoles", data);
  },
};
export default AdmManualService;
