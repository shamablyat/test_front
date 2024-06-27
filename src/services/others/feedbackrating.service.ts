import ApiService from "../api.service";
const FeedBackRatingService = {
    GetList(data:any){
        return ApiService.post(`/FeedbackRating/GetList`,data)
    },
    Get(id:any,){
        return ApiService.get(`/FeedbackRating/Get/${id}`)
    },
    GetAssistantReting(assistantPersonId : any){
        return ApiService.get(`/FeedbackRating/GetAssistantReting/${assistantPersonId}`)
    }
}
export default FeedBackRatingService