import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
// LoginService.ts
import { auth } from '../firebaseConfig.ts';
import axios from 'axios';
import { accessStore } from '../store/index.ts'; // Importa el store como un export nombrado
import constants from '../constants/index.js'
import { useRouter } from "vue-router";
const router: any = useRouter();

import { ref } from 'vue';

const UserService = {
    user_data: ref([]),
    tenants_list: ref([]),

    async uploadFile(formData:FormData){
        return await axios.post('/upload-pdf',formData)
            .then(response => response.data)
            .catch((error: any) => { throw error; }); 
    },

    getConectionData() {
        return axios.get('/users')
            .then(response => response.data)
            .catch((error: any) => { throw error; });   
    },
    async  login(email: string, password: string): Promise<boolean> {
    try {

        // 1️⃣ Loguearse con Firebase JS SDK
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // 2️⃣ Obtener el ID token del usuario
        const idToken = await userCredential.user.getIdToken();

        // 3️⃣ Guardar token localmente si quieres (opcional)
        localStorage.setItem("idToken", idToken);
        const store = accessStore();
        store.setIdToken(idToken);
        // 4️⃣ Enviar el token al backend para validar y obtener datos
        const response = await axios.post("/verify_token", {
            id_token: idToken
        });

        console.log("Usuario verificado:", response.data);

        // 5️⃣ Opcional: configurar axios para futuras peticiones con el token
        axios.defaults.headers.common["Authorization"] = "Bearer " + idToken;

        return true;

    } catch (error) {
        console.error("Error en el login:", error);
        return false;
    }
},

    getIdUserExtern(){
        return axios.get('/api/administration/external_users/')
            .then(response => response.data.response)
            .catch((error: any) => { throw error; });
    },
    checkLoggedIn(): boolean {
        const access = localStorage.getItem('access');
        return !!access;
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
    async registerExternalUser(data: any): Promise<boolean> {
        const userData :any = {
            username: data.userName,
            email: data.email,
            password: data.password
        }
        try {
            const response = await
                axios
                    .post('/administration/external_users/', userData);
            
            return true;
        } catch (error) {
            console.error(error)
            return false;
        }
    },
        async logOut() {
        const store = accessStore();

        // Limpiar token
        store.clearIdToken();

        // Limpiar datos de usuario si los guardas
        // store.userData = null;
        store.uploadedFiles.value = [];

        // Opcional: si quieres redirigir al login
        router.push("/login");

        return true;
        },
    async getMe() {
        try {
            const access = localStorage.getItem('access');
            if (access) {
                const response = await axios.get('/auth/users/me');
                return response.data; // Devolver todos los datos del usuario
            } else {
                return null;
            }
        } catch (error:any) {
            throw error;
        }
    },
    async getUserLogged() {
        try {
            const user_info = await UserService.getMe()

            const response = await UserService.getUser(user_info.id || null)

            return response

        } catch (error:any) {
            throw error;
        }
    },
    getIdType() {
        return axios.get('/api/correspondence/identification_types/')
        .then((response:any)=>response.data.response)
        .catch((error:any)=>{throw error})
    },
    createRemitter(data:any){
        return axios.post('/api/correspondence/remitters/', data)
         .then(response=>response)
         .catch((error:any)=>{throw error})
    },
    async getRemitters() {
        return await axios.get('/api/correspondence/remitters/')
            .then(response => response.data)
            .catch((error: any) => { throw error });
    },
    async getMyTenants() {
        try {
            const access = localStorage.getItem('access');

            if (access) {
                const formData = {
                    token: access
                }

                const response = await axios
                    .post('/auth/login_jwt', formData)
                    .then(response => {
                        this.tenants_list.value = response.data.tenants
                        return this.tenants_list.value;
                    })
                    .catch(() => {

                    })

                return response;
            } else {
                return null;
            }
        } catch (error) {

            return null;
        }
    },
    setUserTenant(tenant: any) {
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

                        this.getMe();
                    }
                })
                .catch((error: any) => {
                    console.error(error)

                })
        }
    },
    getAccess() {
        const store = accessStore();
        const access = store.access;
        if (access) {

            axios.defaults.headers.common['Authorization'] = 'JWT ' + access
        } else {
            axios.defaults.headers.common['Authorization'] = ''
        }

        function getAccess() {
            const accessData: any = ref({
                refresh: store.refresh
            });

            if (store.tenantData && store.tenantData !== constants['DEFAULT_TENANT']) {

                accessData.value.tenant = store.tenantData;

            }

            if (store.tenantData === constants['DEFAULT_TENANT']) {

                delete accessData.value.tenant;

            }

            if (accessData.value.refresh) {

                axios
                    .post('/auth/jwt/refresh/', accessData)
                    .then(response => {

                        const access = response.data.access

                        localStorage.setItem('access', access)
                        store.setAccess(access)
                    })
                    .catch((error: any) => {
                        console.error(error)
                    })
            }
        }

        setInterval(() => {
            getAccess();
            const access = accessStore();
            access.initializeStore();
        }, constants['REFRESH_TOKEN_INTERVAL_MS'])
    },
    async getAllUsers(page:any = 1, page_size:any = "") {
        return axios.get('/api/administration/users/?page=' + page + '&page_size=' + page_size)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data;
            });
    },
    async createUser(data: any) {
        return axios.post('/api/administration/users/', data)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data;
            });
    },
    async saveData(formData:FormData, id:number|string) {
        return axios.patch('/api/administration/users/'+id+'/', formData)
            .then(response => response.data)
            .catch(error => { throw error.response.data;});
    },
    async getPaths() {
        return axios.get('/api/administration/module_path/')
            .then((response: any) => response.data.response)
            .catch(error => {
                throw error.response.data;
            });
    },
    /* async getPermissions(searched_value:any = "", page:any = 1, page_size:any = null) {
        return axios.get(`/api/administration/permits?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response=>response.data.response)
            .catch(error=>{throw error})
    }, */
    async resetPassword(email:any, verification_code:any, new_password:any, confirmation_password:any) {
        return axios.get(`/api/administration/users?reset_user_password=true&email=${email}&new_password=${new_password}&confirmation_password=${confirmation_password}&verification_code=${verification_code}`)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data
            });
    },
    async sendVerificationCode(email:any, domain:any, domain_reset_user_password:any) {
        return axios.get(`/api/administration/users?send_verification_code=true&email=${email}&domain=${domain}&domain_reset_user_password=${domain_reset_user_password}`)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data
            });
    },
    async sendSearchUsers(dependence:any, searched_value:any) {
        return axios.get(`api/administration/users?user_search=true&dependence=${dependence}&searched_value=${searched_value}`)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data
            });
    },
    async searchUsers(searched_value:any, page:any = 1, page_size:any = null) {
        return axios.get(`api/administration/users?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
            .then(response => response.data.response)
            .catch(error => {
                throw error.response.data
            });
    },
    getUser(id:number|string) {
        return axios.get('/api/administration/users/'+id)
            .then(response => response.data.response)
            .catch(error => {throw error});
    },
    async deleteUser( id:number|string) {
        return axios.delete('/api/administration/users/'+id)
            .then(response => response.data.response)
            .catch(error => {throw error});
    },
    async updateUserStatus(userId: number, newState: boolean) {
        try {
            const response = await axios.patch(`/api/administration/users/${userId}/status/`, { is_active: newState });
            console.log('Estado del usuario actualizado:', response.data);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    },      
};

export default UserService;
