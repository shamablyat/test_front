import ApiService from '../api.service';
const OrganizationService = {
    GetList(data: any) {
        return ApiService.post(`/Organization/GetList`, data);
    },
    Get(id: number | string) {
        if (id == 0 || id === null || id === undefined) {
            return ApiService.get(`/Organization/Get`);
        } else {
            return ApiService.get(`/Organization/Get/${id}`);
        }
    },
    Update(data: any) {
        if (data.id == 0) {
            return ApiService.post(`/Organization/Create`, data);
        } else {
            return ApiService.post('/Organization/Update', data);
        }
    },
    Delete(id: number | string) {
        return ApiService.post(`/Organization/Delete/${id}`, {});
    },
    GetAsSelectList(
        parentId: number | string,
        authorizedOnly: string,
        inspectionOnly: string
    ) {
        var params: any = {};
        if (parentId !== undefined && parentId !== null) {
            params['parentId'] = parentId;
        }
        if (authorizedOnly !== undefined) {
            params['authorizedOnly'] = authorizedOnly;
        }
        if (inspectionOnly !== undefined) {
            params['inspectionOnly'] = inspectionOnly;
        }
        let url = `/Organization/GetAsSelectList`;
        var joinSymbol = '?';
        if (Object.keys(params).length == 0) {
            return ApiService.get(url);
        } else {
            Object.keys(params).forEach((e) => {
                url = `${url}${joinSymbol}${e}=${params[e]}`;
                joinSymbol = '&';
            });
            return ApiService.get(url);
        }
    },
    GetByInn(inn: string | number) {
        return ApiService.get(`/Organization/GetByInn/${inn}`);
    },
};
export default OrganizationService;
