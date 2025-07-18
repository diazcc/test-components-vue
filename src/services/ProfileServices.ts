// ProfileService.ts
import axios from 'axios';
import { ref } from 'vue';

const ProfileService = {
    profile_data: ref([]),
    async getAllProfiles() {
        return await axios.get('/api/administration/profiles/')
            .then(response => response.data.response)
            .catch()
    },
    async createProfile(data: any) {
        return await axios.post('/api/administration/profiles/', data)
            .then(response => response)
            .catch((error: any) => { throw error });
    },
};

export default ProfileService;
