// DependenceService.ts
import axios from 'axios';

const FilesServices = {
    getFiles(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/archive/archive?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
        .then(response => response.data.response)
        .catch((error: any) => { throw error.response.data });
    },
    async getFile(id:string|number) {
        return await axios.get(`/api/archive/archive/${id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    getFilesJson(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/archive/archive?json_search=true&searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
        .then(response => response.data.response)
        .catch((error: any) => { throw error.response.data });
    },
    sendFiles(data: any) {
        return axios.post('/api/archive/archive/', data)
            .then(response => response)
            .catch((error: any) => { throw error });
    },
    async sendClassifyFiles(formData: FormData) {
        return await axios.post(
            '/api/administration/trd/classify-file/',
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        )
        .then(async (response) =>  response.data.response) 
        .catch((error: any) => { throw error})
    },
    async getDocumentContent(url: any) {
        return await axios.get(`/api/correspondence/see_document/?document_url=${url}`)
            .then(response => response.data.response)
            .catch((error:  any) => { throw error.response.statusText });
    },
    updateFile(id:string|number, formData: any) {
        return axios.put(`/api/archive/archive/${id}/update_archive`, formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    moveFileToRecord(id:string|number, action: any, record_id: any) {
        return axios.put(`/api/archive/archive/${id}/${action}?record_id=${record_id}`)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    assignDependences(id:string|number, dependenceList:any) {
        return axios.put(`/api/archive/archive/${id}/share_file`, { dependences: dependenceList })
            .then(() => "the_dependencies_have_been_successfully_assigned")
            .catch((error: any) => { throw error });
    },
};

export default FilesServices;
