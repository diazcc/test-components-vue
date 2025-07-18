import axios from "axios";

const DataFlowServices = {
  async downloadPdf(url: string) {
    return axios.get('/api/correspondence/see_document/?document_url=' + url)
      .then((response: any) => {
          const documentUrl = response.data.response;
          if (!documentUrl) {
              throw new Error('No se pudo obtener la URL del documento.');
          }
          return fetch(documentUrl).then((responseFetch) => {
              if (!responseFetch.ok) {
                  throw new Error('No se pudo descargar el archivo.');
              }
              return responseFetch.blob();
          });
      })
      .then((blob: any) => {
          // Extraer el nombre del archivo de la URL
          const urlParts = url.split('/');
          const fileName = urlParts[urlParts.length - 1] || 'documento.pdf'; // Usar 'documento.pdf' como fallback si no se encuentra un nombre
          // Crear la URL del archivo y forzar la descarga
          const fileURL = window.URL.createObjectURL(blob);
          const fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.setAttribute('download', fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
          fileLink.remove();
      })
      .catch((error: any) => { throw error; });
  },
  async downloadDocument(file : {
    name: string,
    url: string
  }) {
    try {
        const response = await fetch(file.url);
        if (!response.ok) {
            throw new Error("No se pudo descargar el archivo.");
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.setAttribute('download', file.name); // Nombre con el que se descargará el archivo
        document.body.appendChild(link);
        link.click();
        
        // Limpiar recursos
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
    }
  },

  // Getters PDF's
  async getListPdfSeries() {
    return await getPdf('/api/administration/series/?download_series=true', "serie.pdf");
  },
  async getListPdfSubseries() {
    return await getPdf('/api/administration/subseries?download_subserie=true', "subserie.pdf");
  },
  async getListPdfDocumentaryType() {
    return await getPdf('/api/administration/documentary_type?download_documentary_type=true', 'documentary_type.pdf');
  },
  async getListPdfRelationMatrix() {
    return await getPdf('/api/administration/relationship_matrix?download_relationship_matrix=true', 'trd_relationship_matrix.pdf');
  },
  async getFileResume(id:string|number) {
    return await getPdf(`/api/archive/archive/${1}?resume=true`, 'resume.pdf');
  },

  // Getters CSV's
  async getListCSVSeries() {
    return await getCsv('/api/administration/bulk_upload/?csv_series_template=true', 'serie.csv');
  },
  async getListCSVSubseries() {
    return await getCsv('/api/administration/bulk_upload/?csv_subseries_template=true', 'subserie.csv');
  },

  // Setters
  async bulkUploadSeries(formData: any){
    return await bulkUpload('/api/administration/bulk_upload/?csv_series_template=true', formData);
  },
  async bulkUploadSubSeries(formData: any){
    return await bulkUpload('/api/administration/bulk_upload/?csv_subseries_template=true', formData);
  },
  async bulkUploadUsers(formData: any) {
    try {
        const response = await axios.post(
            "/api/administration/bulk_upload/?csv_users_template=true", 
            formData, 
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        // Si la respuesta es exitosa, devolvemos los datos con un mensaje de éxito
        return {
            success: true,
            data: response.data,
            message: "Importación exitosa", 
        };
    } catch (error) {
        console.error('Error en importación:', error);
        
        // Verificamos si es un error de Axios
        if (axios.isAxiosError(error) && error.response) {
            // Si hay un error en la respuesta (por ejemplo, un error 4xx o 5xx)
            const backendErrors = error.response?.data?.errors || ["Error inesperado en el servidor"];
            const errorsEmail = error.response.data.errors_email || [];

            return {
                success: false,
                data: null,
                message: "Falló la importación",
                errors: backendErrors,
                errors_email: errorsEmail,
            };
        }
        // Si no es un error de Axios, es un error desconocido
        return {
            success: false,
            data: null,
            message: "Falló la importación",
            errors: ["Ocurrió un error desconocido."],
            errors_email: [],        
        };
    }
  },
};

/**
 * Fetches a PDF file from the specified backend route and triggers its download.
 *
 * This function makes an HTTP GET request to a backend route to retrieve a PDF file. The server response is expected 
 * to be in the form of a binary `blob`. Once the response is received, the function uses the `create_document` function 
 * to initiate the download of the PDF file. If the request fails, the function throws an error.
 *
 * @param {string} url - The backend route (URL) from which to fetch the PDF file.
 * @param {string} [pdf_name='default.pdf'] - The name of the PDF file to save. Defaults to 'default.pdf' if not provided.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been downloaded successfully or throws an error if the request fails.
*/
async function getPdf(url: string, pdf_name:string = "default.pdf"){
  return await axios.get(url, {
    responseType: 'blob',
  })
    .then(response => {
      create_document(response, pdf_name)
    })
    .catch(error => { throw error });
};

/**
 * Fetches a CSV file from the specified backend route and triggers its download.
 *
 * This function makes an HTTP GET request to a backend route to retrieve a CSV file. The server's response is expected 
 * to be in the form of a binary `blob`. Once the response is received, the function uses the `create_document` function 
 * to trigger the download of the CSV file. If the request fails, the function throws an error.
 *
 * @param {string} url - The backend route (URL) from which to fetch the CSV file.
 * @param {string} [csv_name='default.csv'] - The name of the CSV file to save. Defaults to 'default.csv' if not provided.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been downloaded successfully or throws an error if the request fails.
*/
async function getCsv(url: string, csv_name:string = "default.csv"){
  return await  axios.get(url, {
    responseType: 'blob',
  })
    .then(response => {
      create_document(response, csv_name, "text/csv")
    })
    .catch(error => { throw error; });
};

/**
 * Uploads a large amount of data (bulk upload) to the specified backend route.
 *
 * This function sends a `POST` request to a backend route with the provided `formData`. The data is sent as `multipart/form-data`,
 * which is commonly used for uploading files. If the request is successful, it returns the response data. If the request fails,
 * it throws an error.
 *
 * @param {string} url - The backend route (URL) where the form data will be uploaded.
 * @param {FormData} formData - The form data to be uploaded, typically containing files or large data.
 *
 * @returns {Promise<any>} A promise that resolves to the response data from the server if the upload is successful, 
 *                         or throws an error if the request fails.
*/
async function bulkUpload(url: string, formData: any){
  return await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(response => response.data.response)
    .catch((error: any) => { throw error });
};

/**
 * Creates and downloads a document from an HTTP response.
 *
 * This function creates a temporary link to download a file obtained from the response of an HTTP request,
 * using the 'Content-Disposition' header to determine the file name. If this header is not found,
 * it defaults to the provided filename.
 *
 * The function generates an object URL in the browser pointing to the binary data of the file and simulates
 * a click on a link to trigger the file download.
 *
 * @param {Object} response - The HTTP response object, which should contain the binary file data in the `data` 
 *                            property and the HTTP headers in the `headers` property.
 * @param {string} default_filename - The default filename to be used if the file name cannot be retrieved 
 *                                    from the 'Content-Disposition' header.
 * @param {string} [type='application/pdf'] - The MIME type of the file to be downloaded. The default value is 
 *                                            'application/pdf'. This parameter is optional.
 *
 * @returns {void} This function does not return any value. It triggers a file download in the browser.
*/
function create_document(response: any, default_filename: any, type:any = 'application/pdf') {
  const contentDisposition = response.headers['content-disposition']; 
  let filename = default_filename; // Nombre por defecto 
  if (contentDisposition) { 
      const match = contentDisposition.match(/filename="(.+)"/); 
      if (match.length === 2) { 
          filename = match[1]; 
      } 
  }
  
  const url = window.URL.createObjectURL(new Blob([response.data], { type: type}));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default DataFlowServices;