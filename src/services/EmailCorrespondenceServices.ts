// LoginService.ts
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();

const EmailCorrespondenceServices = {
    createFilingEmail(formData:any) {
        return axios.post('/api/correspondence/email_record/', formData)
            .then(response => response.data.response)
            .catch((error: any)=>{ throw error.response.data });
    },
    getEmails(page:number|string, page_size:number|string = 10) {
        return axios.get(`/api/administration/email_service/?page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error; });
    },
    deleteEmails(formData:FormData) {
        return axios.post('/api/administration/email_service/', formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error; });
    },
    getEmail(id:number|string) {
        return axios.get(`/api/administration/email_service/${id}`)
            .then(response => response.data.response)
            .catch(error => { throw error; });
    },
    async getEmailConnection() {
        return await axios.get(`/api/administration/email_connection/`)
            .then(response => response.data.response[0])
            .catch((error: any) => { throw error; });
    },
    async createEmailConnection(data: any) {
        return await axios.post(`/api/administration/email_connection/`, data)
            .then((response: any) => response.response)
            .catch((error: any) => { throw error; });
    }
};

export default EmailCorrespondenceServices;
