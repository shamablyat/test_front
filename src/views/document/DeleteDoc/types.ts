import { DefaultGetData, ILogList } from "@/models/basic";

export interface DeleteDocDTO extends DefaultGetData {
  status: string;
  statusId: number | null;
  docDeleteType: string;
  logList: ILogList[];
  docId: number | null;
  docNumber: string;
  docOn: string;
  docDeleteTypeId: number | null;
  details: string;
}
