import axios from "axios";

const ActionServices = {
  sendAssingData(recordId: any, data: any) {
		return doFilingAction('assign_user_record', recordId, data);
  },
  returnFiling(id: number | string) {
		return doFilingAction('revert_assignment_record', id);
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