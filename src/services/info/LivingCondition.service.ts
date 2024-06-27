import ApiService from '../api.service'
const LivingConditionService = {
    GetList(data: Object) {
        return ApiService.post('/LivingCondition/GetList', data)
    },
    Get(id: Number | String) {
        if (!id || id == 0) {
            return ApiService.get('/LivingCondition/Get')
        } else {
            return ApiService.get(`/LivingCondition/Get/${id}`)
        }
    },
    GetAsSelectList() {
        return ApiService.get('/LivingCondition/GetAsSelectList')
    },

    Delete(id: Number | String) {
        return ApiService.post(`/LivingCondition/Delete/${id}`, {})
    },

    Update(data: any) {
        if (data.id) {
            return ApiService.post('/LivingCondition/Update', data)
        } else {
            return ApiService.post('/LivingCondition/Create', data)
        }
    }
}
export default LivingConditionService