export interface ISetPassportData {
  documentTypeId: number | null | undefined;
  seria: string;
  number: string | null;
  dateOfBirth: string | null;
  pinfl: string | null;
}
export interface IPassportIncludes {
  includePhoto?: boolean;
  includePension?: boolean;
  includeDisabilityGroup?: boolean;
  includeAddress?: boolean;
  includeNeurologicInfo?: boolean;
  includeDivorceInfo?: boolean;
  includeMariageInfo?: boolean;
  includeSalaryInfo?: boolean;
  includePositionInfo?: boolean;
  includeKadastrInfo?: boolean;
  includeDiplomaInfo?: boolean;
  includeWomenNotebookInfo?: boolean;
  includeAlimentInfo?: boolean;
  includeDebtInfo?: boolean;
}

export interface INotHasDoc{
  firstName: string | null;
  genderId: number | null;
  documentTypeId: number | null;
  genderName: string | null;
  lastName: string | null;
  middleName: string | null;
  birthOn?: string;
}
