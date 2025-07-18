// TypeFilingService.ts
import axios from 'axios';


const TypeFilingService = {
    async getAllTypesFiling(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/correspondence/type_of_filing?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async getTypeFiling() {
        return axios.get('/api/administration/groups?user_group=true')
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async createTypeFiling(data: any) {
        return axios.post('/api/correspondence/type_of_filing/', data)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async deleteTypeFiling(id: any) {
        return axios.delete(`/api/correspondence/type_of_filing/${id}` )
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    getTypeFilingById(id: string | number) {
        return axios.get(`/api/correspondence/type_of_filing/${id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    updateTypeFiling(formData:FormData,id: string | number) {
        return axios.put(`/api/correspondence/type_of_filing/${id}/`, formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
};

export default TypeFilingService;
