// LoginService.ts
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const FilingServices = {
    getFilingsCreatedByUser(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/correspondence/filings/?searched_value=${searched_value}&page=${page}&page_size=${page_size}&filing_search=true`) // record_search=true reestructurar en el backend
            .then(response => response.data.response)
            .catch(error => { throw error.response.data });
    },
    async createAndGetAnonimousRemitter(formData: any): Promise<string | number> {
        return axios.post('/api/correspondence/remitters/', formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data.error });
    },
    async createFiling(formData: any) {
          try {
              const auth = getAuth();
              const user = auth.currentUser;
              if (!user) throw new Error("Usuario no autenticado");
        
              const idToken = await user.getIdToken(); // 👈 Token JWT real
        
              const response = await axios.post('/request', formData,
                {
                  headers: {
                    "Authorization": idToken, // 👈 Enviamos el token al backend
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log("sssssss:", response);
        
              return response.data;
            } catch (error) {
              console.error("❌ Error al obtener remitters:", error);
              throw error;
            }
    },
    async createOutFiling(formData: any, id: number | string) {
        return axios.post(`/api/correspondence/records/${id}/salida`, formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    async createFilingWeb(formData: any) {
        return axios.post('/api/correspondence/web_filing/', formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data.error });
    },
    async createAnonimousFiling(formData: any) {
        return axios.post('/api/correspondence/filings/', formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    async createFilingEmail(formData: any) {
        return axios.post('/api/correspondence/email_record/', formData)
            .then(response => response.data.response)
            .catch((error: any) => { throw error });
    },
    async getResponseModes() {
        return await axios.get('/api/correspondence/response_modes/')
            .then(response => response.data)
            .catch((error: any) => { throw error })
    },
    async getIdentificationTypes() {
        return axios.get('/api/correspondence/identification_types/')
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data })
    },
    async getPersonTypes() {
        return axios.get('/api/correspondence/person_types/')
            .then(response => response.data.response)
            .catch((error: any) => { throw error.response.data })
    },
    async getUsersDependence(id_dependece: any) { //review
        try {
            const response = await axios.get('/api/administration/dependences/?code_dependence=' + id_dependece)
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async getHistoricalFilingData(
        searched_value: any = "",
        page: any = 1,
        page_size: any = null
    ) {
        return await axios
        .get(
          `/api/correspondence/actions_history/?searched_value=${searched_value}&page=${page}&page_size=${page_size}`
        )
        .then(response => response.data.response)
        .catch((error: any) => { throw error.response.data; }); 
    },
    async getMinEntryFilings() {
        return await axios.get('/api/correspondence/filings/?page=1&page_size=5&incoming_filing=true')
            .then(response=>response.data.response)
            .catch((error:any)=>{throw error})
    },
    async getMinInternalFilings() {
        return await axios.get('/api/correspondence/filings/?page=1&page_size=5&internal_filing=true')
            .then(response=>response.data.response)
            .catch((error:any)=>{throw error})
    },

    async  getFilesSent(searched_value:any = "", page:any = 1, page_size:any = 10) {
        try {
            const auth = getAuth();

            // Esperar hasta que Firebase determine el estado del usuario
            const user :any= await new Promise((resolve) => {
            const unsub = onAuthStateChanged(auth, (user) => {
                unsub();
                resolve(user);
            });
            });

            if (!user) throw new Error("Usuario no autenticado");

            const idToken = await user.getIdToken();

            const response = await axios.get(
            `/requests-sent?searched_value=${searched_value}&page=${page}&page_size=${page_size}`,
            {
                headers: {
                "Authorization": idToken,
                "Content-Type": "application/json",
                },
            }
            );

            return response.data.response;
        } catch (error) {
            console.error("❌ Error al obtener filings:", error);
            throw error;
        }
        }
};

export default FilingServices;
