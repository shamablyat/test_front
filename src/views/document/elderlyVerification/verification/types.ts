import { IAddress } from "@/features/Questions/types";
import { DefaultGetData, IFileConfig, IPerson } from "@/models/basic";
import { Component } from "vue";

export type IMenu = {
  id: number;
  label: string;
  icon: string;
  color: string;
  component: Component;
  isView?: boolean;
  key: string;
  disabled: boolean;
};

export type IApplication = {
  id: number;
  id2: string;
  tableId: number;
  organizationId: number;
  docNumber: string;
  docOn: string;
  details: string | null;
  applicationTypeId: number;
  serviceRecipientPhoneNumber: string | null;
  serviceRecipientPhoneNumberAlt: string | null;
  email: string | null;
  forSelf: boolean;
  applicantPhoneNumber: string | null;
  applicantPhoneNumberAlt: string | null;
  surveyResultTableId: number | null;
  kinshipDegreeId: null;
  serviceRecipient: IPerson | null;
  applicantPerson: null;
  address: IAddress;
  statusId: number;
  status: string;
  applicationType: string;
  applicationTypeCode: string;
  applicationCreationType: string;
  regionId: number;
  region: string;
  districtId: number;
  district: string;
  kinshipDegree: string | null;
};

export interface ElderlyVerification extends DefaultGetData {
  docNumber: string;
  docOn: string;
  applicantAddress?: string | null;
  applicantPhoneNumber?: string | null;
  applicantPerson: IPerson | null;
  regionId: number | null;
  districtId: number | null;
  mfyId: number | null;
  details: string;
  expireOn: string;
  conclusion: string;
  pensionType: string;
  elderlyCategory: string;
  elderlyCategoryId: number | null;
  pensionAmount: number;
  disabilityGroup: number | null;
  applicationId: number | null;
  application: IApplication | null;
  bartelSurveyId: number | null;
  lautonSurveyId: number | null;
  livingConditionSurveyId: number | null;
  canAgree?: boolean;
  isKadastr?: boolean;
  canSentToAgree?: boolean;
  canEdit?: boolean;
  canViewFile?: boolean;
  statusId: number;
  data: number;
  files: ICustomVerificationFileConfig[];
  longitude?: number | null;
  latitude?: number | null;
}
export interface ICustomVerificationFileConfig extends IFileConfig {
  documentId: number;
  tableId: number;
  fileShortName: string;
}

/** UpdateElderlyVerificationComission */
export type IComissions = {
  id: number;
  mfyAttachedMemberTableId: number | null;
  mfyAttachedMemberTypeId: number;
  mfyAttachedMemberType: string;
  person: IPerson | null;
  phoneNumber: string;
  phoneNumberAlt: string;
  canEdit: boolean;
};

export type IMember = {
  id: number;
  kinshipDegreeId: number | null;
  isCareRegularly: boolean;

  pensionTypeId: number | null;
  pensionAmount: number | null;
  disabilityGroup: string | null;
  personDocumentTypeId: number | null;
  personDocSeria: string | null;
  personDocNumber: string | null;
  personBirthOn: string;
  personGenderId: number | null;
  personGender: string | null;
  personPinfl: string | null;
  personFullName: string | null;
  phoneNumber: string | null;
  kinshipDegree: string;
  elderlyFamilyMemberPlace: string;

  returnOn: string;
  notComplete?: boolean | null;
  elderlyFamilyMemberPlaceId: number | null;

  isLivingTogether: boolean;
  notLivingTogether: string;
};
/** UpdateElderlyVerificationWithFamily */
export type IFamily = {
  id: number;
  isCareRegularly: boolean;
  hasHeir: boolean;
  canEdit: boolean;
  heirCount: number | null;
  members: IMember[];
};

export type IHealthStatus = {
  id: number;
  icd10Id: number;
  icd10: string;
  lastPolyclinic: string;
  lastPolyclinicOn: string;
  disabilityGroupId: number | null;
  checkDisabilityOn: string;
  recheckDisabilityOn: string;
};

/** UpdateElderlyVerificationWithHealth */
export type IHealth = {
  id: number;
  polyclinic: string;
  polyclinicAddress: string;
  polyclinicPhoneNumber: string;
  doctor: IPerson | null;
  isPsix: boolean;
  canEdit: boolean;

  // doctorPhoneNumber: string;
  medicament: string;
  canBuyForSelf: boolean;
  complaints: string;
  mainIcd10Id: number | null;
  infectiousDiseaseIcd10Id: number | null;
  mainIcd10: string;
  infectiousDiseaseIcd10: string;
  secondaryIcd10Id: number | null;
  patrianashNursePeriodTypeId: number | null;
  secondaryIcd10: string;
  patrianashNurseWeeklyCommute: number | null | string;
  inDepthMedicalExaminationOn: string;
  disabilityGroupRecheckOn: string;
  dateOfLastDispensaryInspectionOn: string;
  treatmentTypeId: number | null;
  preferentialMnnIds: number[];
  alwaysConsumeMnnIds: number[];
  privilegeMnnsIds: number[];
  hasNotComplaints: boolean;
  hasPrivilegeMnn: boolean;
};

/** UpdateElderlyVerificationWithIndividualProgram */
export type IIndividualProgram = {
  id: number;
  individualProgramId: number | null;
  individualProgram: string;
  organizationId: number | null;
  organization: string;
  deadlineOnDay: number | null;
};

export interface GetElderlyVerificationTableHasValue {
  id: number;
  bartelSurvey: boolean;
  comissions: boolean;
  family: boolean;
  health: boolean;
  index: 6;
  lautenSurvey: boolean;
  livingCondition: boolean;
  srResultService: boolean;
  verificationConclusion: boolean;
  verificationResult: boolean;
  // family: boolean;
  // health: boolean;
  // livingCondition: boolean;
  // measure: boolean;
  // pension: boolean;
  // comissions: boolean;
  // individualProgram: boolean;
  // verificationConclusion: boolean;
  // protection: boolean;
  // relax: boolean;
  // touch: boolean;
}

/*    CONCLUSION */
export interface ISrService {
  id: number | null;
  eldSurveyId: number | null;
  eldSurveyQuestionnaireType: string | null;
  tables: ISrServiceTables[];
}

export interface ISrServiceTables {
  elderlyService: string;
  id: number | null;
  elderlyServiceId: number | null;
  logs: ISrServiceLogs[];
}

export interface IVerificationConclusion {
  services: ISrService[];
  members: IVerificationConclusionMembers[];
  files: any[];
  tables: ISrService[];
  dateOn: string;
  elderlyCategoryId: null | number;
  isAccept: boolean;
  tableId: number;
  totalBall: number;
  id: number | null;
}

export interface IVerificationConclusionMembers {
  elderlyVerificationComission: ElderlyVerificationCommission;
  elderlyVerificationComissionId: number | null;
  id: number | null;
  isAgree: boolean;
}

export interface ElderlyVerificationCommission {
  mfyAttachedMemberType: string;
  id: number | null;
  mfyAttachedMemberTableId: number | null;
  mfyAttachedMemberTypeId: number | null;
  phoneNumber: string;
  phoneNumberAlt: string;
  person: IPerson;
  elderlyVerificationComissionId: number | null;
  isAgree: boolean;
}
export interface ISrServiceLogs {
  eldQuestionnaireGroup: string;
  eldQuestionnaireQuestion: string;
  eldQuestionnaireAnswer: string;
  id: number | null;
  eldQuestionnaireGroupId: number | null;
  eldQuestionnaireQuestionId: number | null;
  eldQuestionnaireAnswerId: number | null;
  eldSurveyResultAlgorithmResultServiceId: number | null;
}

/* VERIFICATION RESULT */

export interface IVerificationResultDto {
  id: number | null;
  services: IVerificationResultServices[];
  tables: IVerificationResultTables[];
  totalBall: number;
  canEdit: boolean;
}

export interface IVerificationResultServices {
  id: number | null;
  elderlyServiceId: number | null;

  elderlyService: string;
  executeOrganizationName: string;
  executePeriod: number | null;
  isExecuteAsistent: boolean;
}
export interface IVerificationResultTables {
  id: number | null;
  eldSrTypeId: number | null;
  eldSurveyResultAlgorithmTableId: number | null;
  dailyHour: number | null;
  dayCount: number | null;
}

export type VerificationResultTabs = "services" | "tables";
