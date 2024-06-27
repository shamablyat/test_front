import ApiService from "../api.service";
const DocumentChangeLogService = {
    GetListByDocumentId(tableId:any,docId : any){
        return ApiService.get(`/DocumentChangeLog/GetListByDocumentId/${tableId}/${docId}`)
    }
}
export default DocumentChangeLogService