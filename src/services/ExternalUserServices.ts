// ExternalUserService.ts
import axios from 'axios';

const ExternalUserServices = {
    async sendExternalUser(data: any) {
        return await axios.post('/api/administration/external_users/', data)
            .then(response => response)
            .catch((error: any) => { throw error.response.data });
    },
};

export default ExternalUserServices;
