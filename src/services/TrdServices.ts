// LoginService.ts
import axios from 'axios';
import { ref } from 'vue';

const TrdServices = {
    // Getters
    getSeries(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/series?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch(error => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getSubseries(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/subseries?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch(error => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getMaterialType() {
        return axios.get('/api/administration/material_type')
            .then(response => response.data.response)
            .catch(error => {
                console.error('Error al obtener tipo de material:', error);
                throw error;
            });
    },
    getDocumentaryType(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/documentary_type?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch(error => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getRelationshipMatrix(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/relationship_matrix?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch((error: any) => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getMRSeries(type:number=1, dependency:any=null) {
        return axios.get(`/api/administration/relationship_matrix/?getseries_trd=true&type_filing=${type}&dependency=${dependency}`)
            .then(response => response.data.response)
            .catch((error: any) => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getMRSubseries(id: number,type:number=1, dependency:any=null){
        return axios.get(`/api/administration/relationship_matrix/?getsubseries_trd=${id}&type_filing=${type}&dependency=${dependency}`)
            .then(response => response.data.response)
            .catch((error: any) => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },
    getMRDocumentaryType(seriesId: number, subseriesId: number,type:number=1, dependency:any=null) {
        return axios.get(`/api/administration/relationship_matrix/?getseries_trd=${seriesId}&getsubseries_trd=${subseriesId}&getdocumentary_type_trd=true&type_filing=${type}&dependency=${dependency}`)
            .then(response => response.data.response)
            .catch((error: any) => {
                console.error('Error al obtener series:', error);
                throw error;
            });
    },

    // Setters
    sendSubserie(data: any) {
        return axios.post('/api/administration/subseries/', data)
            .then(response => response.data.response);
    },
    sendSerie(data: any) {
        return axios.post('/api/administration/series/', data)
            .then(response => response.data.response);
    },
    sendDocumentaryType(data: any) {
        return axios.post('/api/administration/documentary_type/', data)
            .then(response => response.data.response);
    },
    sendRelationshipMatrix(data: any) {
        return axios.post('/api/administration/relationship_matrix/', data)
            .then(response => response.data.response);
    },

    // Methods
    assignTRdToFiling(id: number, data: any) {
        return axios.put(`/api/correspondence/filings/${id}`,data)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },

    // Delete
    async deleteSerie(id: any) {
        return axios.delete(`/api/administration/series/${id}`)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
    async deleteSubserie(id: any) {
        return axios.delete(`/api/administration/subseries/${id}`)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
    async deleteDocumentaryType(id: any) {
        return axios.delete(`/api/administration/documentary_type/${id}`)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
    async deleteTrd(id: any) {
        return axios.delete(`/api/administration/relationship_matrix/${id}`)
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
};

export default TrdServices;
