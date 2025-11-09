import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ActionServices = {
  sendAssingData(recordId: any, data: any) {
		return doFilingAction('assign_user_record', recordId, data);
  },
  returnFiling(id: number | string) {
		return doFilingAction('revert_assignment_record', id);
  },
// CORREGIDO: Envía el body y los headers correctamente
async actionFile(requestId: string,action:string) {
    try {
        const auth = getAuth();
        // Lógica de autenticación...
        const user: any = await new Promise((resolve) => {
            const unsub = onAuthStateChanged(auth, (user) => {
                unsub();
                resolve(user);
            });
        });

        if (!user) throw new Error("Usuario no autenticado");

        const idToken = await user.getIdToken();
        
        // 1. Define el nuevo estado (lo que espera el backend)
        const newStatus = "answered"; 

        // 2. Realiza el PATCH: URL, BODY, HEADERS
        const response = await axios.patch(
            `/request/${requestId}/status`, // URL
            { status: action }, // 🎯 BODY: El objeto JSON que tu backend espera
            { // 🔑 HEADERS: Configuración de la solicitud
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
},
	actionFiling(id: number | string, action :string, data: any={}){
		return doFilingAction(action, id, data);
	},
	responseFiling(id: number | string, data:any) {
		return doFilingAction('add_record_outbound_filing', id, data);
	},
}

async function doFilingAction(action: string, id: number|string, data: any={}){
	return await axios.put(`api/correspondence/records/${id}/${action}`, data)
		.then(response => response)
    .catch((error: any) => { throw error });
}

export default ActionServices