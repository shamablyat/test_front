export interface WorkerReportTabRowView {
  [key: number | string]: IWorkerReportTabRow[];
}
export interface IWorkerReportTabRow {
  details: string;
  id: number | null;
  elderlyServiceId: number | string;
  elderlyCareScheduleTableId: number | string;
  elderlyService: string;
  beginAt: string;
  endAt: string;
  done: boolean;
}
export interface IWorkerColumns {
  [key: string]: string;
}

export interface IReportByDayBody {
  elderlyManageId: number | string | null;
  dateOn: string;
}
