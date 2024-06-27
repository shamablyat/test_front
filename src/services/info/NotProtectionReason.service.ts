import ApiService from '../api.service'
const NotProtectionReasonService = {
    GetList(data: Object) {
        return ApiService.post('/NotProtectionReason/GetList', data)
    },
    Get(id: Number | String) {
        if (!id || id == 0) {
            return ApiService.get('/NotProtectionReason/Get')
        } else {
            return ApiService.get(`/NotProtectionReason/Get/${id}`)
        }
    },
    GetAsSelectList() {
        return ApiService.get('/NotProtectionReason/GetAsSelectList')
    },

    Delete(id: Number | String) {
        return ApiService.post(`/NotProtectionReason/Delete/${id}`, {})
    },

    Update(data: any) {
        if (data.id) {
            return ApiService.post('/NotProtectionReason/Update', data)
        } else {
            return ApiService.post('/NotProtectionReason/Create', data)
        }
    }
}
export default NotProtectionReasonService