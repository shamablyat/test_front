import ApiService from '../api.service'
const CountryService = {
  GetList (data: Object) {
    return ApiService.post('/Country/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/Country/Get')
    } else {
      return ApiService.get(`/Country/Get/${id}`)
    }
  },
  GetAsSelectList (data: Object) {
    return ApiService.post('/Country/GetAsSelectList', data)
  },
  Delete (id:Number|String) {
    return ApiService.post(`/Country/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/Country/Update', data)
    } else {
      return ApiService.post('/Country/Create', data)
    }
  }
}
export default CountryService