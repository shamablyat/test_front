export interface ISelectList {
  orderCode?: string;
  text: string;
  value: number;
}

export interface IFilter {
  search: string;
  sortBy?: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;
  totalRows?: number;
}

export interface IFields {
  key: string;
  label: string;
  sort?: boolean;
  isAmount?: boolean;
  tableList?: any[];
  type?: "input" | "selector" | "checkbox";
  itemNameValue?: string | "value";
  itemName?: string | "text";

  tdRowSpan?: number | string;
  tdColSpan?: number | string;
  thRowSpan?: number | string;
  thColSpan?: number | string;

  thClass?: number | string;
  tdClass?: number | string;
  removeChildParent?: boolean;
  children?: IFields[];
}

export interface IBreadCrumbs {
  text: string;
  disabled?: boolean;
  href: string;
}

export interface IBasicRequest {
  page: number;
  pageSize: number;
  total: number;
}

export interface IPagination {
  title: string;
  totalRows: number;
  firstNumber: number;
  lastNumber: number;
}

export interface ILanguageList {
  code: string;
  shortName: string;
  fullName: string;
  value: number;
  text: string;
  orderCode: string | null | number;
}

export interface ITableActions {
  isView?: boolean;
  isEdit?: boolean;
  isClone?: boolean;
  isDelete?: boolean;
  isHistory?: boolean;
  canAccept?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
  canSent?: boolean;
  canReject?: boolean;
  canRevoke?: boolean;
}

export interface IPerson {
  birthDateAsString?: null | string;
  birthOn?: string;
  citizenshipId?: null | number;
  citizenshipName?: string | null;
  docExpireOn?: string | number;
  docIssueOn?: string | number;
  docIssueOrganization?: string | null;
  docNumber?: string | null;
  docSeria?: string | null;
  documentType?: string | null;
  documentTypeId?: number | null;
  firstName?: string | null;
  fullName?: string | null;
  genderId?: number | null;
  genderName?: string | null;
  id: number | null;
  lastName?: string | null;
  livingAddress?: {
    regionId: number | null;
    region: string | null;
    districtId: number | null;
    district: string | null;
    address: string | null;
  };
  middleName?: string | null;
  nameOrder?: number | null;
  nationalityId?: number | null;
  nationalityName?: string | null;
  pension?: {
    amount: number | null;
    experience: string | null;
    pensOn: string | null;
    pensionTypeId: number | null;
    pensionType: string | null;
    rows: unknown | null;
  };
  photo?: string | null;
  pinfl?: string | null;
  shortName?: string | null;
  state?: string | null;
  stateId?: number | null;
  disabilityGroup?: string | null;
  isDivorce?: boolean;
  hasSalary?: boolean;
  isMarried?: boolean;
  isKadastr?: boolean;
  hasDiploma?: boolean;
  isAliment?: boolean;
  isWomanNotebook?: boolean;
  hasDebt?: boolean;
  isDeath?: boolean;
  disabilityExtenal?: {
    id: number;
    name: string;
  };
  positionInfo?: {
    organization: string | null;
    position: string | null;
  };
  notComplete?: boolean | null
}

export interface IGetPassportData {
  districtId: number | null;
  email: string | null;
  id: number | null;
  languageId: number | null;
  organizationId: number | null;
  password: string | null;
  personId: number | null;
  phoneNumber: null;
  regionId: null;
  roles: number[];
  stateId: number | null;
  userName: string | null;
  person: IPerson | null;
}

export interface IGetAuthInfo {
  fullName: string | null;
  organizationName: string | null;
  permissions: string[];
  shortName: string | null;
  userName: string | null;
}

export interface ITranslates {
  language?: string;
  columnName: string;
  languageId: number;
  translateText: string;
}

export interface ILogList {
  id: 0;
  dateAt: string;
  userInfo: string;
  tableId: number | null;
  userId: number | null;
  statusId: number | null;
  table: string;
  status: string;
  ipAddress: string;
  userAgent: string;
  message: string;
}

export interface IModalProps {
  title: string;
  id: number | null;
  cb: string;
}

export interface DefaultGetData extends ITableActions {
  id: number;
}

export interface IFileConfigBody {
  tableId: number;
  docOn: string;
  code?: string;
}

export interface IFileConfig {
  id: number | null;
  columnName: string;
  shortName: string;
  fullName: string;
  maxSize: number;
  isRequired: boolean;
  isMultiple: boolean;
  tables: IFileConfigTables[];
}

export interface IFileConfigTables {
  id: number | null;
  fileTypeId: number;
  fileType: string;
  extension: string;
}
