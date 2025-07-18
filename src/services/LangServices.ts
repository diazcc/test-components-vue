// LangServices.ts
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const axios_instance = axios.create()

const LangServices = {
    async getLangEsCo() {
        return axios_instance.get('/lang/es_CO.json')
            .then(response => { return response.data; })
            .catch(error => { throw error.response.data; });
    },
    async getLangEnUs() {
        return axios_instance.get('/lang/en_US.json')
            .then(response => { return response.data; })
            .catch(error => { throw error.response.data; });
    },
    async getLangEsMex() {
        return axios_instance.get('/lang/es_MEX.json')
            .then(response => { return response.data; })
            .catch(error => { throw error.response.data; });
    },
    validateTranslation(word: string) {
        const { t, te } = useI18n();
        return te(word) ? t(word) : word;
    }
};

export default LangServices;