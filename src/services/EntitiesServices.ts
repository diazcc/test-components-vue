// EntitiesService.ts
import axios from 'axios';

const EntitiesService = {
    async searchEntities(searched_value:any = "", page:any = 1, page_size:any = null) {
        return await axios.get(`/auth/tenants?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    getEntity(id:string|number):any{
        return axios.get(`/auth/tenants/${id}`)
            .then(response => response.data.response)
            .catch((error: any)=>{ throw error });
    },
    updateEntity(formData: FormData, id:number |string){
        return axios.put(`/auth/tenants/${id}/`, formData)
            .then(response => response)
            .catch((error: any)=>{ throw error });
    },
    createEntity(data: any) {
        return axios.post('/auth/tenants/', data)
            .then(response => response)
            .catch((error: any)=>{ throw error });
    },
    enableEntity(id: any,formData:FormData) {
        return axios.patch(`/auth/tenants/${id}/`, formData)
            .then(response => response)
            .catch((error: any)=>{ throw error });
    },
    getUserCorrespondence():any{
        return axios.get('/api/administration/users/?module=correspondence')
            .then(response => response.data.response)
            .catch((error: any)=>{ throw error });
    },
    deleteEntity(id:number|string):any{
        return axios.delete(`/auth/tenants/${id}/`)
            .then(response => response.data.response)
            .catch((error: any)=>{ throw error });
    }
};

export default EntitiesService;
