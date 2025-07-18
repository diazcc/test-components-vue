// SearchServices.ts
import axios from 'axios';

const SearchServices = {
    getResponse(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/search/?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
        .then(response => response.data.response)
        .catch(error => { throw error.response.data });
    },
  /*   sendFiles( ) {
        return axios.post('',  ).then(response => response).catch((error:any)=>{throw error});
    },
   
    updateFile(id:string|number, formData: any) {
        return axios.put(`/api/archive/archive/${id}/update_archive`, formData)
            .then(response => response.data.response)
            .catch((error:any)=>{throw error});
    }, */
};

export default SearchServices;
