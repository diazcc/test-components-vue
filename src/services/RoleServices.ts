// RoleService.ts
import axios from 'axios';


const RoleService = {
    async getAllRolesByPage(page: number | string) {
        return axios.get('/api/administration/roles/?page=' + page + '&page_size=10')
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async getAllRoles(onlyRoles: boolean = false) {
        return axios.get('/api/administration/roles/', {
            params: {
                simple_roles: onlyRoles
            }})
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async getAllPermissions() {
        return axios.get('/api/administration/permissions/')
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async getRole(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/roles?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async createRole(data: any) {
        return axios.post('/api/administration/roles/', data)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    async deleteRole(id: any) {
        return axios.delete(`/api/administration/roles/${id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    getRolById(id: string | number) {
        return axios.get(`/api/administration/roles/${id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data });
    },
    updateRol(formData:FormData,id: string | number) {
        return axios.put(`/api/administration/roles/${id}/`, formData)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
};

export default RoleService;
