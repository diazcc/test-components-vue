// DependenceService.ts
import axios from 'axios';
import FilesServices from './FilesServices';

const PortfolioService = {
    async getPortfolios(searched_value:any = "", page:any = 1, page_size:any = null) {
        let data: any = [];
        data = [
            {
                id: 1,
                name: 'Portfolio 1',
                documents: [],
                creation_date: '2023-10-01',
                creation_hour: '10:00 am',
            },
            {
                id: 2,
                name: 'Portfolio 2',
                documents: [],
                creation_date: '2025-4-07',
                creation_hour: '7:00 pm'
            },
                {
                id: 3,
                name: 'Portfolio 3',
                documents: [],
                creation_date: '2022-12-21',
                creation_hour: '8:52 am',
            },
            {
                id: 4,
                name: 'Portfolio 4',
                documents: [],
                creation_date: '2025-4-07',
                creation_hour: '5:32 pm',
            },
                {
                id: 5,
                name: 'Portfolio 5',
                documents: [],
                creation_date: '2024-8-17',
                creation_hour: '10:00 am',
            },
            {
                id: 6,
                name: 'Portfolio 6',
                documents: [],
                creation_date: '2023-4-07',
                creation_hour: '7:34 pm',
            }
        ];
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            data: data,
            total_pages: 1,
            page: 1,
            page_size: page_size,
        }
        // return axios.get(`/api/administration/portfolios/?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
        //     .then(response => response.data.response)
        //     .catch((error: any) => { throw error });
    },
    async createPortfolio(data: any, /*delete this when backend endpoint is activated*/ dataArray: any = []) {
        let name = data.get('name');
        let newId = dataArray.length + 1;
        let toDay = new Date();
        let creation_date = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}`;
        let creation_hour = `${toDay.getHours()}:${toDay.getMinutes()} ${toDay.getHours() >= 12 ? 'pm' : 'am'}`;
        dataArray.push({
            id: newId,
            name: name,
            documents: [],
            creation_date: creation_date,
            creation_hour: creation_hour,
        })
        return {
            data: dataArray
        };
        // return axios.post('/api/administration/portfolios/', data)
        //     .then(response => response.data.response)
        //     .catch((error: any) => { throw error });
    },
    async updatePortfolio(data: any, id: string, /*delete this when backend endpoint is activated*/ dataArray: any = []) {
        let index = dataArray.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            dataArray[index].name = data.get('name');
        }
        return {
            data: dataArray,
            total_pages: 1,
            page: 1,
            page_size: 10,
        }
        // return axios.put(`/api/administration/portfolios/${code}/`, name)
        //     .then(response => response.data.response)
        //     .catch((error: any) => { throw error });
    },
    async deletePortfolio(id: any /*delete this when backend endpoint is activated*/ ,data: any = []) {
        let index = data.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            data.splice(index, 1);
        }
        // return axios.delete(`/api/administration/portfolios/${id}`)
        //     .then(response => response.data.response)
        //     .catch((error: any) => { throw error });
        return {
            data: data,
            total_pages: 1,
            page: 1,
            page_size: 10,
        }
    },
    async getFilesPortfolio(id: any, searched_value: any = "", page: any = 1, page_size: any = null) {
        let response: any = await FilesServices.getFiles(searched_value, page, page_size);
        return response
        // return await axios.get(`/api/administration/portfolios/${id}/documents/?searched_value=${searched_value}&page=${page}&page_size=${page_size}`)
        //     .then(async (response) => response.data.response)
        //     .catch((error: any) => { throw error });
    }
};

export default PortfolioService;
