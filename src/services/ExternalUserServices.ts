// ExternalUserService.ts
import axios from 'axios';

const ExternalUserServices = {
    async sendExternalUser(data: any) {
        return await axios.post('/signup', data)
            .then(response => response)
            .catch((error: any) => { throw error.response.data });
    },
};

export default ExternalUserServices;
