// LoginService.ts
import axios from 'axios';
import { accessStore } from '../store/index.ts'; // Importa el store como un export nombrado

import constants from '../constants/index.js'

import { ref } from 'vue';
import { UserData } from '../interfaces/UserData.interface.ts';

interface AccessStore {
  refresh: string;
  tenantData?: string;
}

const loginService = {
  user_data: ref([]),
  tenants_list: ref([]),

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Realizar la solicitud de inicio de sesión
      const response = await axios.post('/auth/jwt/create/', { email, password });

      // Extraer tokens de la respuesta
      const access = response.data.access;
      const refresh = response.data.refresh;

      // Guardar tokens en el almacenamiento local
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Establecer el token de acceso en las cabeceras de autorización para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = 'JWT ' + access;

      return true; // Indicar que el inicio de sesión fue exitoso
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error; // Lanzar el error para que el componente pueda manejarlo
    }
  },

  checkLoggedIn(): boolean {
    // Verificar si el token de acceso está presente en el almacenamiento local
    const access = localStorage.getItem('access');
    return !!access; // Devolver true si el token de acceso existe, false de lo contrario
  },

  async register(data: any): Promise<boolean> {

    const userData = {
      username: data.userName,
      email: data.email,
      password: data.password
    }

    try {
      const response = await
        axios
          .post('/auth/users/', userData);
      

      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  },

  async logOut() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('idToken')

    return true;

  },
  
  
  

  async getMyTenants() {

    try {
      const access = localStorage.getItem('access');
      const store = accessStore();

      if (access) {
        const formData = {
          token: access
        }

        const response = await axios
          .post('/auth/login_jwt', formData)
          .then(response => {
            store.tenants_list = response.data.tenants;
            return store.tenants_list;
          })
          .catch((error: any) => {

          })

        return response;
      } else {
        return null;
      }
    } catch (error) {

      return null;
    }
  },

  async setUserTenant(tenant: any) {
    const access = localStorage.getItem('access')
    const store = accessStore();
    

    if (access) {
      const formData = {
        token: access,
        tenant: tenant
      }

      axios
        .post('/auth/tenant_login_jwt', formData)
        .then(response => {
          const access = response.data.access
          const refresh = response.data.refresh

          if (access) {
            store.setAccess(access)
            store.setRefresh(refresh)

            axios.defaults.headers.common['Authorization'] = 'JWT ' + access

            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)

            store.setTenant(tenant)

          }
        })
        .catch((error: any) => {
          console.error(error)

        })
    }
  },

  async get_filing(code: String) {

    try {

      return await axios
        .get('/api/correspondence/filings/' + code)
        .then(response => {
          return response.data
        })
        .catch((error: any) => {
        })



    } catch (error) {
      return null;
    }
  },

  async delete_filing_file_on_media(ref_document: String) {
    return await axios.get('/api/correspondence/filings/?document=' + ref_document);
  },

  async getAccess() {
    const store = accessStore();

    const accessData: { refresh: string; tenant?: string } = {
      refresh: store.refresh
    };
  
    if (store.tenantData && store.tenantData !== constants['DEFAULT_TENANT']) {
      accessData.tenant = store.tenantData;
    }
  
    if (store.tenantData === constants['DEFAULT_TENANT']) {
      delete accessData.tenant;
    }
  
    if(accessData.refresh) {
      axios
        .post('/auth/jwt/refresh/', accessData)
        .then(response => {
          const access = response.data.access
  
          localStorage.setItem('access', access)
          store.setAccess(access)
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
};

export default loginService;
