// RecordsServices.ts
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const RecordsServices = {
  async searchRecords(
    searched_value: any = "",
    page: any = 1,
    page_size: any = null
  ) {
    return axios
      .get(
        `/api/archive/folder?searched_value=${searched_value}&page=${page}&page_size=${page_size}&sample=""`
      )
      .then((response) => response.data.response)
      .catch((error: any) => { throw error.response.data; });
  },
  async searchRecordsAssignTable(
    searched_value: any = "",
    page: any = 1,
    page_size: any = null
  ) {
    return axios
      .get(
        `/api/archive/folder?searched_value=${searched_value}&page=${page}&page_size=${page_size}&to_assign_record="true"`
      )
      .then(response => response.data.response)
      .catch((error: any) => { throw error.response.data; });
  },
  async createRecord(data: any) {
    return axios
      .post("/api/archive/folder/", data)
      .then((response) => response.data.response)
      .catch((error) => { throw error.response.data; });
  },
  async searchRecordsStatic() {
    return axios
      .get(`/api/correspondence/records?record_data_dashboard_pie_chart=true`)
      .then((response) => response.data.response)
      .catch((error) => { throw error.response.data; });
  },
  async getRecord(id: any, new_data: any = "", is_record: any = null) {
    return await axios.get(`/api/correspondence/records/${id}?new_data=${new_data}&is_record=${is_record}`)
      .then(response => response.data)
      .catch((error: any) => { throw error })
  },
  getTrazabilityRecord(id: any) {
    return axios.get(`/api/correspondence/traceability_records/?record_traceability=${id}`)
      .then(response => response.data.response)
      .catch((error: any) => { throw error });
  },
  async  searchFilings(searched_value:any = "", page:any = 1, page_size:any = null) {
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
      `/requests?searched_value=${searched_value}&page=${page}&page_size=${page_size}`,
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
,
};

export default RecordsServices;
