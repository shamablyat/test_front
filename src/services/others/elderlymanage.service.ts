import ApiService from '../api.service'
const ElderlyManageService = {
  GetList (data:any) {
    return ApiService.post('/ElderlyManage/GetList',data)
  },
  

}
export default ElderlyManageService