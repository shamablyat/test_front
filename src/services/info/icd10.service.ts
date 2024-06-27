import ApiService from '../api.service'
const Icd10Service = {
  GetList (data: Object) {
    return ApiService.post('/Icd10/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/Icd10/Get')
    } else {
      return ApiService.get(`/Icd10/Get/${id}`)
    }
  },
  GetAsSelectList (parentId:Number|String) {
    if (!parentId || parentId == 0 ) {
      return ApiService.get('/Icd10/GetAsSelectList')
    } else {
      return ApiService.get(`/Icd10/GetAsSelectList?parentId=${parentId}`)
    }
  },
  
  Delete (id:Number|String) {
    return ApiService.post(`/Icd10/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/Icd10/Update', data)
    } else {
      return ApiService.post('/Icd10/Create', data)
    }
  }
}
export default Icd10Service