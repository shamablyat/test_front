import ApiService from '../api.service'
const CompensationTypeService = {
  GetList (data: Object) {
    return ApiService.post('/CompensationType/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/CompensationType/Get')
    } else {
      return ApiService.get(`/CompensationType/Get/${id}`)
    }
  },
  GetAsSelectList () {
    return ApiService.get('/CompensationType/GetAsSelectList')
  },
  Delete (id:Number|String) {
    return ApiService.post(`/CompensationType/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/CompensationType/Update', data)
    } else {
      return ApiService.post('/CompensationType/Create', data)
    }
  }
}
export default CompensationTypeService