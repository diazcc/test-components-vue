// DependenceService.ts
import axios from 'axios';

const IdentificationTypesService = {
    async getAllIdentificationTypes() {
        return axios.get('/api/correspondence/identification_types/')
            .then(response => response.data.response)
            .catch(error => { throw error });
    }
};

export default IdentificationTypesService;
