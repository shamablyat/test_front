import ApiService from '../api.service'
const UserService = {
  GetList (data: Object) {
    return ApiService.post('/User/GetList', data)
  },
  Get (id:Number|String) {
    if (!id || id == 0) {
      return ApiService.get('/User/Get')
    } else {
      return ApiService.get(`/User/Get/${id}`)
    }
  },
  GetAsSelectList (data: Object) {
    return ApiService.post('/User/GetAsSelectList', data)
  },
  Delete (id:Number|String) {
    return ApiService.post(`/User/Delete/${id}`, {})
  },

  Update (data: any) {
    if (data.id) {
      return ApiService.post('/User/Update', data)
    } else {
      return ApiService.post('/User/Create', data)
    }
  },
  GetByPassportData(Seria:string,Number : string,DateOfBirth:string,DateOfBirthAsString:string){
    return ApiService.get(`/User/GetByPassportData?Seria=${Seria}&Number=${Number}&DateOfBirth=${DateOfBirth}&DateOfBirthAsString=${DateOfBirthAsString}`)
  }
}
export default UserService