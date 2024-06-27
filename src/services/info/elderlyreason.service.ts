import ApiService from '../api.service'
const ElderlyReasonService = {
  GetList (data: Object) {
    return ApiService.post('/ElderlyReason/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/ElderlyReason/Get')
    } else {
      return ApiService.get(`/ElderlyReason/Get/${id}`)
    }
  },
  GetAsSelectList (decisionType?:number | string) {
    if (!decisionType || decisionType == 0) {
      return ApiService.get('/ElderlyReason/GetAsSelectList')
    } else {
      return ApiService.get(`/ElderlyReason/GetAsSelectList?decisionType=${decisionType}`)
    }
  },
  
  Delete (id:Number|String) {
    return ApiService.post(`/ElderlyReason/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/ElderlyReason/Update', data)
    } else {
      return ApiService.post('/ElderlyReason/Create', data)
    }
  }
}
export default ElderlyReasonService