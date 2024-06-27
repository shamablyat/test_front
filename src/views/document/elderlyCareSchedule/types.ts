export interface IElderlyScheduleTabRow {
  orderNumber: number;
  details: string;
  weekDayOn: number | null;
  elderlyServiceId: number | string;
  beginAt: string;
  endAt: string;
}
export interface TabRowView {
  [key: number | string]: IElderlyScheduleTabRow[];
}

export interface ElderlyManageFilter {
  personId: null | number;
  elderlyCategoryId: null | number;
  elderlyReasonId: null | number;
  pensionTypeId: null | number;
  endElderlyReasonId: null | number;
  isOnlyActual: boolean;
  
  search: string;
  sortBy: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;

  regionId: number | null;
  districtId: number | null;
  region: string;
  district: string;
}
