import axios from "axios";

const LocalizationServices = {
    async getCountries() {
        return await axios.get('/api/administration/countries/')
            .then(async (response) => response.data)
            .catch((error) => {throw error.response.data});
    },
    async getCountriesStates(id_country: any) {
        return await axios.get('/api/administration/countries/?country=' + id_country)
            .then(async (response) => response.data)
            .catch((error) => {throw error.response.data});
    },
    async getStatesCities(id_state: any) {
        return await axios.get('/api/administration/countries/?state=' + id_state)
            .then(async (response) => response.data)
            .catch((error) => {throw error.response.data});
    },
}

export default LocalizationServices