// DependenceService.ts
import axios from 'axios';

const DependenceService = {
    async getAllDependences(page:any, page_size:any=null) {
        return axios.get(`/api/administration/dependences/?page=${page}&page_size=${page_size}&searched_value=`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    async getParentDependences() {
        return axios.get('/api/administration/dependences/?all_parent_dependencies=parent')
            .then(response=> response.data.response)
            .catch ((error: any) => { throw error })
    },
    async searchDependences(searched_value:any = "", page:any = 1, page_size:any = null) {
        /* return axios.get(`api/administration/dependences?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response=> response.data.response)
            .catch ((error: any) =>{ throw error }) */
    },
    async getUsersDependences(idDependence:number|string, value:string="") {
        return axios.get(`/api/administration/users?dependence=${idDependence}&searched_value=${value}`)
            .then(response=> response.data.response)
            .catch ((error: any) => { throw error })
    },
    async createDependence(data: any) {
        return axios.post('/api/administration/dependences/', data)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async updateDependence(name: any,code:string) {
        return axios.put(`/api/administration/dependences/${code}/`, name)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async deleteDependence(id: any) {
        return axios.delete(`/api/administration/dependences/${id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
};

export default DependenceService;
