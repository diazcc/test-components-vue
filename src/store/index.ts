import { Ref, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import constants from "../constants/index.js";
import { FileUploaded } from "../interfaces/FileUploaded.interface.js";
import { colorThemes } from "../assets/styles/colorThemes.js";
import { UserData } from "../interfaces/UserData.interface.js";

interface UserDataConfig {
  tenant?: string | null;
  key?: string; // Permitir cualquier otra propiedad adicional
}
const idToken = ref<string | null>(localStorage.getItem("idToken"));
export const accessStore = defineStore("global", () => {
  // state varaibles
  const access: any = ref("");
  const refresh: any = ref("");
  const tenantData = ref("auth");
  const userRol: string | null = null;
  const domain = window.location.origin;
  const domain_reset_user_password = domain + "/new-password";
  const userName: any = ref("");
  const userId: any = ref("");
  const uploadedFiles: any = ref<File[] | string[]>([]); // Get files pdfs or structure {name:'na7777777777777777me', url:'url'}
  const user_data = ref<UserDataConfig>({});
  const userData : Ref<UserData>  |  null = ref({
    id:'',
    name:'',
    email:'',
    role: '',
    tenant: '',
    key: ''
  });
  const tenants_list = ref([]);
  const colorPage: any = ref(colorThemes);
  const userPermit: any = ref([]);
  // Methods
  // setters

  /**  
   * Geters
  */ 
  const getEmailUser = () => userName.value;
  const getIdUser = () => userId.value;
  const getColor = () => colorPage.value;
  const getUploadedFiles = () => uploadedFiles.value;

  /**
   * Seters
  */
  function setEmailUser(name: string) {
    userName.value = name;
  };
  async function setAccess(accessData: any) {
    access.value = accessData;
  };
  async function setRefresh(refreshData: any) {
    refresh.value = refreshData;
  };
  function setTenant(data: any) {
    tenantData.value = data;
    axios.defaults.baseURL = formatString(
      constants["DEFAULT_BASE_URL"],
      tenantData.value
    );
  };
  function setIdUser(id: any): void {
    userId.value = id;
  };

  // File setters
  function addUploadedFile(file: any) {
    uploadedFiles.value.push(file);
  };
  function removeUploadedFile(index: any) {
    uploadedFiles.value.splice(index, 1);
  };
  function clearUploadedFiles() {
    uploadedFiles.value = [];
  };

  // others

  const formatString = (template: any, ...args: any) => {
    return template.replace(/{([0-9]+)}/g, function (match: any, index: any) {
      return typeof args[index] === "undefined" ? match : args[index];
    });
  };

function initializeStore() {
  // Configura siempre la URL base con la constante
  axios.defaults.baseURL = constants["DEFAULT_BASE_URL"];

  // Recupera token si existe
  const idToken = localStorage.getItem("idToken");
  if (idToken) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + idToken;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
  }
}

  function escapeHtmlContent(content: string): string {
    return content.replace(/"/g, "'");
  }

  // Enviar archivos al servidor
  async function uploadFiles() {
    const formData = new FormData();
    uploadedFiles.value.forEach((file: any) => {
      formData.append("files", file);
    });

    // Envía formData a través de Axios
    try {
      const response = await axios.post("/upload", formData);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  }

  function isPdfUrl(url: string) {
    const pdfRegex = /\.pdf(\?.*|#.*)?$/i;
    return pdfRegex.test(url);
  }

  function base64ToFile(
    base64String: string,
    fileName: string,
    fileType: string
  ): File {
    const byteString = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  }
  function setIdToken(token: string) {
    idToken.value = token;
    localStorage.setItem("idToken", token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  function clearIdToken() {
    idToken.value = null;
    localStorage.removeItem("idToken");
    axios.defaults.headers.common["Authorization"] = "";
  }

  async function isAuthenticated() {
    return !!idToken.value;
  }
  return {
    access,
    refresh,
    tenantData,
    uploadedFiles,
    userData,
    userRol,
    tenants_list,
    domain,
    domain_reset_user_password,
    initializeStore,
    setAccess,
    setRefresh,
    setTenant,
    isAuthenticated,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    uploadFiles,
    setEmailUser,
    getEmailUser,
    getIdUser,
    setIdUser,
    getColor,
    base64ToFile,
    escapeHtmlContent,
    getUploadedFiles,
    isPdfUrl,
    setIdToken,
    clearIdToken,
  };
});

// Auxiliar functions

