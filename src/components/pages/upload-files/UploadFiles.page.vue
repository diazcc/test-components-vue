<template>
    <UploadFilesTemplate :dataUploadFiles="dataUploadFiles" :multiSelectDependenceDefault="multiSelectDependenceDefault" :apiResponse="dataUploadFiles.apiResponse" />
</template>

<script setup lang="ts">

// Import vue libraries
import { onMounted, ref, reactive, onBeforeMount, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import UploadFilesTemplate from '../../templates/upload-files/UploadFiles.template.vue'

// Import services
import FilesServices from '../../../services/FilesServices.ts';
import UserService from '../../../services/UserServices.ts';
import TrdServices from '../../../services/TrdServices.ts';
import DependenceServices from '../../../services/DependenceServices';
import FormValidators from '../../../validators/FormValidators.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import { accessStore } from '../../../store';

// Define emit and props and configuration
const { t} = useI18n();
const store = accessStore();

// Define variables and constants
const documentContent: any = ref();
const userId: any = ref("");
const userDependece: any = ref("");
const dataUploadFiles: any = reactive({
    dataManyFiles: [],
    dataMultiSelectManyFiles: [],
    stateFormCreate: false,
    stateFormUniqueFile: false,
    stateFormManyFiles: false,
    stateLoad: false,
    stateObtainData: true,
    counterFiles: 1,
    apiResponse: null,
    dataForm: {
        code: '',
        name: '',
        serie: '',
        time_file_management: '',
        time_file_central: '',
        final_disposition: '',
    },
    dataButtonUploadFile: {
        className: 'gray-blue',
        text: 'upload_file',
        disabled: false,
        onClick: () => {
            setStateFormUniqueFile()
        }
    },
    dataButtonUploadManyFiles: {
        className: 'gray-mouse-blue',
        text: 'upload_many_files',
        disabled: false,
        onClick: () => {
            setStateFormManyFiles()
        }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'upload',
        alt: 'upload',
        url: '/Buttons/upload-file.svg',
        disabled: false,
        reverse: true,
        onClick: () => {
            try {
                validateForm();
            } catch (error) {
                console.error("Error during form validation:", error);
            }
        }
    },
    dataButtonBack: {
        className: 'gray',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        reverse: false,
        disabled: false,
        onClick: () => {
            setStatesBack();
            refreshStateData();

        }
    },
    dataButtonAddManyFiles: {
        className: 'gray',
        text: 'add',
        alt: 'add',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => {}
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'Cerrar',
            disabled: false,
            onClick: () => {
                closeModalAlert();

            }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataInputName: {
        id: '',
        name: '',
        classInput: '',
        model: '',
        type: 'text',
        placeholder: 'name',
        disabled: false,
        required: true,
        onClick: () => { }
    },
    dataSelectDocumentaryType: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_documentary_type',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'continue',
            disabled: false,
            onClick: () => {

            }
        },
        dataText: {
            classText: '',
            text: 'Error, intentalo mas tarde.',
            disabled: false,
            onClick: () => { }
        }
    },
    handleFileChange: async (event: Event)=> {
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement.files || inputElement.files.length === 0) {
            return;
        }
        getContentFile(inputElement);

        const file = inputElement.files[0]; 
        documentContent.value = file; 

        try {
            const response = await sendFileToAPI(file);
            console.log("API Response:", response);
            
            // Store the API response in `dataUploadFiles`
            dataUploadFiles.apiResponse = response;

            // Show response in modal
            dataUploadFiles.dataModalAlert.isActive = 'show';
            dataUploadFiles.dataModalAlert.dataText.text = response.message || "Archivo procesado exitosamente!";
        
        } catch (error) {
            console.error("Error sending file to API:", error);
            dataUploadFiles.apiResponse = { error: "Error procesando archivo!" };

            dataUploadFiles.dataModalAlert.isActive = 'show';
            dataUploadFiles.dataModalAlert.dataText.text = "Error procesando archivo!";
        }
    },
    dataMultiSelect: {
        title: "select_dependency",
        model: [],
        options: []
    },
    dataTooltipIcons: [
        {
            text: `${UtilsServices.capitalizeFirstLetter(t("delete") + " " + t("file"))}`,
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: () => { return true },
            onClick: ({ index = -1,}) => { removeFile(index) },
        },
    ]
});

// Define functions
async function sendFileToAPI(file: File) {
    const formData = new FormData();
    formData.append('file', file);  // Ensure the API expects a "file" field

    try {
        const response = await FilesServices.sendClassifyFiles(formData);
        console.log(typeof response);
        return response;
    } catch (error) {
        console.error("API Upload Error:", error);
        throw error;
    }
}

const multiSelectDependenceDefault: any = reactive({value: {}});

onMounted(() => {
    getDocumentaryType();
    getDependence();
});

onBeforeMount(() => {
    store.clearUploadedFiles();
});


/**
 * todo GET & SET
 */


function getDocumentaryType() {
    TrdServices.getDocumentaryType()
        .then((response: any) => {
            dataUploadFiles.data = response;
            dataUploadFiles.dataSelectDocumentaryType.options = response.results.map((value: any) => ({
                value: value.id,
                label: value.name_document_type
            }))
        });
}

async function getDependence() {
    await getUserId();
    await UserService.getUser(userId.value)
        .then(async (response: any) => userDependece.value = response.dependence.code )
        .catch((error: any) => console.error(error));   
    DependenceServices.searchDependences("", 1)
        .then(response => {
            multiSelectDependenceDefault.value = {
                key: 0,      
                title: "select_dependency",
                model: [userDependece.value],
                options: response.results.map((value: any) => ({
                            checked: userDependece.value == value.code ? true : false,
                            value: value.code,
                            text: value.name
                         }))
            }
            dataUploadFiles.stateObtainData = false;
        })
        .catch((error: any) => console.error(error));
}

async function getUserId() {
    await UserService.getMe()
        .then(async (response: any) => userId.value = response.id )
        .catch((error: any) => console.error(error) );
}

function sendNewFile() {
    if (FormValidators.getValidationForm('upload-files__content')) {
        dataUploadFiles.stateLoad = true;

        const data: any[] =
            [{
                document_name: dataUploadFiles.dataInputName.model,
                documentary_type: dataUploadFiles.dataSelectDocumentaryType.model,
                document: '',
                dependences: dataUploadFiles.dataMultiSelect.model
            }]
        getDataFile(data)
            .then((response: any) => {
                FilesServices.sendFiles(response).then((response: any) => {
                    dataUploadFiles.stateLoad = false;
                    
                    dataUploadFiles.dataModalConfirmation.isActive = 'show';
                    dataUploadFiles.dataModalConfirmation.dataText.text = 'El archivo fue subido exitosamente';
                    dataUploadFiles.dataModalConfirmation.dataButton.onClick = () => {
                        dataUploadFiles.stateFormCreate = false;
                        hiddeModalConfirmation();
                        refreshStateData();
                    }

                })
                    .catch((error: any) => {
                        console.error(error.response.data.error.details);
                        dataUploadFiles.dataModalAlert.isActive = 'show';
                        dataUploadFiles.dataModalAlert.dataText.text = error?.response.data.error.details?.code;
                    });
            })
            .catch(); 
    } else {
        dataUploadFiles.dataModalAlert.isActive = 'show';
        dataUploadFiles.dataModalAlert.dataText.text = 'empty_inputs';
    }
}

function sendNewManyFiles() {
    dataUploadFiles.stateLoad =true;
    if (FormValidators.getValidationForm('table')) {
        getDataFiles('table')
            .then((formData: any) => {
                FilesServices.sendFiles(formData)
                    .then((response: any) => {
                        
                        dataUploadFiles.dataModalConfirmation.isActive = 'show';
                        dataUploadFiles.dataModalConfirmation.dataText.text = 'El archivo fue subido exitosamente';
                        dataUploadFiles.dataModalConfirmation.dataButton.onClick = () => {
                            dataUploadFiles.stateFormCreate = false;
                            hiddeModalConfirmation();
                            refreshStateData();
                            setStatesBack()
                        }
                    })
                    .catch((error: any) => {
                        console.error(error.response.data.error.details);
                        dataUploadFiles.dataModalAlert.isActive = 'show';
                        dataUploadFiles.dataModalAlert.dataText.text = error?.response.data.error.details[0] || error?.response.data.error.details?.data;
                    });
            })
            .catch((error: any) => {
                console.error('Error al leer el archivo:', error);
            });

    } else {
        dataUploadFiles.stateLoad = false;
        dataUploadFiles.dataModalAlert.isActive = 'show';
        dataUploadFiles.dataModalAlert.dataText.text = 'empty_inputs';
    }
}

const removeFile = (index: any) => {
    store.removeUploadedFile(index);
    dataUploadFiles.dataManyFiles.splice(index,1);
    dataUploadFiles.dataMultiSelectManyFiles.splice(index,1);
    for(let i:any = 0; i < dataUploadFiles.dataMultiSelectManyFiles.length; ++i){
        dataUploadFiles.dataMultiSelectManyFiles[i].key = i;
    }
};

function refreshStateData() {
    dataUploadFiles.dataInputName.model = '';
    dataUploadFiles.dataSelectDocumentaryType.model = '';
    dataUploadFiles.stateLoad = false;
    dataUploadFiles.dataMultiSelect.model = [];
    store.clearUploadedFiles();
    dataUploadFiles.dataManyFiles = [];
    dataUploadFiles.dataMultiSelectManyFiles = [];
}

function setStateFormCreate() {
    dataUploadFiles.stateFormCreate = true;
}

function setStatesBack() {
    dataUploadFiles.stateFormUniqueFile = false;
    dataUploadFiles.stateFormManyFiles = false;
}

function setStateFormUniqueFile() {
    dataUploadFiles.stateFormUniqueFile = true;
    dataUploadFiles.stateFormManyFiles = false;
    dataUploadFiles.dataMultiSelect = Object.assign({}, multiSelectDependenceDefault.value);
}

function setStateFormManyFiles() {
    dataUploadFiles.stateFormManyFiles = true;
    dataUploadFiles.stateFormUniqueFile = false;
}

function closeModalAlert() {
    dataUploadFiles.dataModalAlert.isActive = '';
    dataUploadFiles.stateLoad = false;
}

function hiddeModalConfirmation() {
    dataUploadFiles.dataModalConfirmation.isActive = 'hidde';
    dataUploadFiles.stateLoad = false;
    setStatesBack();
}

function showModalConfirmation() {
    dataUploadFiles.dataModalConfirmation.isActive = 'show';
}

function getContentFile(file: any) {
    documentContent.value = file.files[0];
}

function getDataFiles(className: any): Promise<FormData> {
    return new Promise((resolve, reject) => {
        const data: any[] = [];
        const formData = new FormData(); // como variable local
        const reader = new FileReader();
        const fieldsContainers: any = document.querySelectorAll("." + className);

        fieldsContainers.forEach((fieldsContainer: any) => {
            const inputs = fieldsContainer.querySelectorAll("input");
            const selects = fieldsContainer.querySelectorAll("select");
            inputs.forEach((input: any, index: any) => {
                const select = selects[index];
                if (select) {
                    data.push({
                        document_name: input.value.replace(/[ ]/g, "_"),
                        documentary_type: select.value,
                        document:'',
                        dependences: dataUploadFiles.dataMultiSelectManyFiles[index].model
                    });
                }
            });
        });        

        const readFilesSequentially = (index: number) => {
            if (index >= store.uploadedFiles.length) {
                const dataString = JSON.stringify(data);
                formData.append('data', dataString);
                return resolve(formData);
            }

            const file = store.uploadedFiles[index];
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result as ArrayBuffer;
                const base64String = btoa(
                    new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                data[index].document = base64String;
                readFilesSequentially(index + 1); // Leer el siguiente archivo
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        };

        // Iniciar la lectura de archivos
        readFilesSequentially(0);
    });
}

function getDataFile(dataForm: any[]): Promise<FormData> {
    return new Promise((resolve, reject) => {
        const formData = new FormData(); // como variable local
        const reader = new FileReader();


        reader.onload = () => {
            const fileContent: any = reader.result;
            const base64String = btoa(
                new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const updatedData = dataForm.map((item: any) => ({
                ...item,
                document: base64String
            }));
            const dataString = JSON.stringify(updatedData);

            formData.append('data', dataString);

            resolve(formData);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(documentContent.value);
    });
}

function validateForm() {
    dataUploadFiles.stateFormUniqueFile ? sendNewFile() : sendNewManyFiles();
}

</script>

<style scoped src="./UploadFiles.page.scss"></style>
