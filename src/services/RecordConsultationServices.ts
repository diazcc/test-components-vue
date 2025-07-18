// ConsultationRecordService.ts
import axios from 'axios';

const ConsultationRecordService = {
    getInfoFiling(numberFiling:number,userId:any, email:string) {
        // 12024200000093
        return axios.get('/api/correspondence/filings/?filing_code='+numberFiling+'&identification_number='+userId+'&email='+email)
        .then(response => response.data.response)
        .catch((error: any) => error)
    },
};

export default ConsultationRecordService;
