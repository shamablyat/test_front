import ApiService from '../api.service'
const DisabilityDiagnosisService = {
  GetList (data: Object) {
    return ApiService.post('/DisabilityDiagnosis/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/DisabilityDiagnosis/Get')
    } else {
      return ApiService.get(`/DisabilityDiagnosis/Get/${id}`)
    }
  },
  GetAsSelectList () {
    return ApiService.get('/DisabilityDiagnosis/GetAsSelectList')
  },
  Delete (id:Number|String) {
    return ApiService.post(`/DisabilityDiagnosis/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/DisabilityDiagnosis/Update', data)
    } else {
      return ApiService.post('/DisabilityDiagnosis/Create', data)
    }
  }
}
export default DisabilityDiagnosisService