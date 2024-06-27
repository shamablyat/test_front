import ApiService from '../api.service'
const AccountService = {
    GetAuthInfo(){
        return ApiService.get(`/Account/GetAuthInfo`)
    }
}
export default AccountService