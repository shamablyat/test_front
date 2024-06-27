import ApiService from "../api.service";
export const DocumentFileService = {
  UploadFile(tableId: number | undefined, data: any) {
    return ApiService.post(`/DocumentFile/UploadFile/${tableId}`, data);
  },
  DownloadFile(fileId: string | number | undefined, tableId: number | undefined, documentId?: number | string) {
    return ApiService.print(`/DocumentFile/DownloadFile/${fileId}/${tableId}/${documentId ? documentId : 0}`);
  },
  DeleteFile(fileId: string | undefined, tableId: number | undefined) {
    return ApiService.post(`/DocumentFile/DeleteFile/${fileId}/${tableId}`);
  }
};
