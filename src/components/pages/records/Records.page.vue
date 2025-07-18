<template>
    <RecordsTemplate :dataRecords="dataRecords" @emitDocSelected="openDocSelected"
        @emitDocRecordSelected="openDocSelected"
    />
</template>

<script setup lang="ts">

// Import vue libraries
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

// Import components
import RecordsTemplate from '../../templates/records/Records.template.vue';

// Import services
import { accessStore } from '../../../store';
import RecordsServices from '../../../services/RecordsServices';
import TrdServices from '../../../services/TrdServices';
import FilesServices from '../../../services/FilesServices';
import FormValidators from '../../../validators/FormValidators';
import UtilsServices from '../../../services/UtilsServices';

// Define props, emit and configuration
const store: any = accessStore();
const router = useRouter();
const { t } = useI18n();

// Define constants and variables
const searchQuery: any = ref('');
const idRecord: any = ref('');   //State for be used globaly - selected code filing  by functions modal assignated - review 

const dataRecords: any = reactive({
    stateFormRecords: false,
    stateLoadData: true,
    stateResponseLoad: false,
    filterSelected: '',
    list: [],
    form: {
        observations: '',
    },
    dataButtonNewRecord: {
        className: 'blue',
        text: 'new',
        alt: 'new',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => { setForm() }
    },
    dataInputSearch: {
        dataInput: {
            id: '',
            name: '',
            classInputEmail: '',
            model: '',
            type: '',
            placeholder: 'search',
            disabled: false,
            required: false,
            onClick: () => { },
            onChange: (value: any) => {
                searchRecordsList(value, 1)
            }
        },
        dataImg: {
            id: '',
            name: '',
            class: ' icon',
            src: '/icon-lupa-general.svg',
            type: '',
            alt: '',
            onClick: () => { }
        }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'create',
        alt: 'create',
        url: '/Buttons/icon-create.svg',
        iconSize: 'large',
        reverse: true,
        disabled: false,
        onClick: () => { createNewRecord() }
    },
    dataButtonBack: {
        className: '',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        disabled: false,
        onClick: () => { 
            refreshData();
            resetForm();
        }
    },
    dataInputName: {
        id: '',
        name: 'name',
        classInput: 'form',
        model: '',
        type: 'text',
        placeholder: 'record_name',
        disabled: false,
        required: false,
        title: '',
        onClick: () => { },
        handleBlur: () => { },
        onChange: () => { }
    },
    dataSelectSerie: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {
            getSubseries(data.target.value)
        },
        onClick: () => { },
        placeholder: 'select_serie',
        model: '',
        required: true,
        multiple: false,
        options: []
    },
    dataSelectSubserie: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_subserie',
        model: '',
        required: true,
        multiple: false,
        options: []
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'close',
            disabled: false,
            onClick: () => { closeModalAlert() }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'continue',
            disabled: false,
            onClick: () => { closeModalConfirmation() }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataPaginator: {
        page: 1,
        page_size: 10,
        total_pages: '',
        pagination_options: [
            {
                number: 10,
                active: false
            },
            {
                number: 20,
                active: false
            },
            {
                number: 30,
                active: false
            },
            {
                number: 50,
                active: false
            },
        ],
        getService: (value: any) => {
            searchRecordsList(dataRecords.dataInputSearch.dataInput.model, value)
        }
    },
    dataInputFiles: {
        counterFiles: 0,
        openModalDocs: () => {
            openModalListDocuments()
        },
        dataModalListDocuments: {
            isActive: false,
            closeModal: () => {
                closeModalListDocuments()
            },
        }
    },
    dataModalPdfViewer: {
        isActive: '',
        dataPdfViewer: {
            urlPdf: '',
            toolbar: {
                toolbar: {
                    toolbarViewerLeft: false
                }
            },
            onClose: () => {
            }
        }
    },
    dataModalListDocuments: {
        isActive: false,
        onlyView: true,
        closeModal: () => {
            closeModalListDocumentsRecord();
        },
    },
    dataFilters: [
        { //First Filter
            id: 0,
            isOpen: false,
            type: 'text',
            isActive: false,
            options: [
            ],
        },
        { //second Filter
            id: 1,
            isOpen: false,
            type: 'text',
            isActive: false,
            options: [
            ],
        },
        { //third Filter
            id: 2,
            isOpen: false,
            type: 'text',
            isActive: false,
            options: [
            ],
        },
        { //fourth Filter
            id: 3,
            isOpen: false,
            type: 'number',
            isActive: false,
            options: [
            ],
        }
    ],
    dataTooltipIcons: [
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("record")}`),
            src: '/Buttons/icon-summary.svg',
            color: 'blue',
            alt: 'summary',
            show: ({data = [] as any[]}) => { return data.includes('see_record') },
            onClick: ({data = {}}) => { actionsMenu('see_record', data) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("files")}`),
            src: '/Buttons/icon-view.svg',
            color: 'blue',
            alt: 'view',
            show: ({data = [] as any[]}) => { return data.includes('see_documents') },
            onClick: ({data = {}}) => { actionsMenu('see_documents', data) },
        },
    ],
    openFilter: (index: number) => {
        dataRecords.dataFilters.forEach((filter: any) => {
            filter.isOpen = false;
        })
        dataRecords.dataFilters[index].isOpen = !dataRecords.dataFilters[index].isOpen;
    }
})


/**
 * todo  -------------------------- FUNCTIONS --------------------------
 */

onMounted(() => {
    callServices();
});

watch(() => dataRecords.dataPaginator.page_size, () => {
    searchRecordsList(dataRecords.dataInputSearch.dataInput.model, 1);
});

function callServices() {
    searchRecordsList("", 1);
    getSeries();
}

function searchRecordsList(searched_value: any, page: any) {
    resetModalListArchive()
    dataRecords.stateLoadData = true;
    RecordsServices.searchRecords(searched_value, page, dataRecords.dataPaginator.page_size)
        .then((response: any) => {
            dataRecords.stateLoadData = false;
            dataRecords.dataPaginator.page = page
            dataRecords.dataPaginator.total_pages = response.total_pages
            dataRecords.list = response.results.map((value: any) => ({
                ...value,
                user_actions:
                    value.data.documents.record == undefined ? ['see_record', 'see_documents'] : ['see_record'],
            }));
            dataRecords.stateLoadData = false;
        })
        .catch((error: any) => {
            dataRecords.stateLoadData = false;
            console.error("Error fetching data:", error);
            openModalAlert('something_happened_try_later');
        });
}

function setForm() {
    dataRecords.stateFormRecords = true;
}

function validateActionToFiling(action: any, record: any) {
    switch (action) {
        case 'see_documents':
            record.data.documents.map((value: any) => {
                store.addUploadedFile({
                    name: value.name,
                    url: value.document,
                    remove: false,
                })

            }
            );
            openModalListDocumentsRecord();

            break;
        case 'see_record':
            redirectToRecord(idRecord.value, record.type)
            break;
        default:
            break;
    }
}

function createNewRecord() {
    dataRecords.stateResponseLoad = true;
    if (FormValidators.getValidationForm("records--form__content")) {
        const formData: any = new FormData();
        formData.append("name", dataRecords.dataInputName.model);
        formData.append("subserie", dataRecords.dataSelectSubserie.model);
        formData.append("serie", dataRecords.dataSelectSerie.model);

        let base64Files: Array<{ name: string; type: string; content: string }> = [];

        const readFileAsBase64 = (file: File): Promise<any> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Content = reader.result?.toString().split(",")[1] || "";
                    resolve({
                        document_name: file.name,
                        document: base64Content,
                    });
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        };

        const processFiles = async () => {
            try {
                for (const file of store.uploadedFiles) {
                    const base64File = await readFileAsBase64(file);
                    base64Files.push(base64File);
                }

                formData.append("data", JSON.stringify(base64Files));

                RecordsServices.createRecord(formData)
                    .then((response: any) => {
                        dataRecords.stateResponseLoad = false;
                        openModalConfirmation("the_record_was_successfully_created");
                        resetForm();
                    })
                    .catch((error: any) => {
                        console.error(error);
                        dataRecords.stateResponseLoad = false;
                        openModalAlert(error.response.data.error.details[0]);
                    });
            } catch (error) {
                console.error("Error al procesar los archivos:", error);
                dataRecords.stateResponseLoad = false;
                openModalAlert("Error processing files");
            }
        };

        // Ejecutar procesamiento de archivos
        processFiles();
    } else {
        dataRecords.stateResponseLoad = false;
        openModalAlert("empty_inputs");
    }
}

function getSeries() {
    TrdServices.getSeries()
        .then((response: any) => {
            //Validate if is more than 0 to be iterate, in another way generate error
            (response.results.length > 0) && (dataRecords.dataSelectSerie.options = response.results.map((value: any) => (({
                value: value.id,
                label: value.name,
                subseries: value.subseries.map((dataSubserie: any) => ({
                    value: dataSubserie.id,
                    label: dataSubserie.name,
                }))
            }))))
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0]);
        })
}

function getSubseries(id: number) {
    const selectedSerie = dataRecords.dataSelectSerie.options.find((option: any) => option.value == id);
    if (selectedSerie && selectedSerie.subseries && selectedSerie.subseries.length > 0) {
        dataRecords.dataSelectSubserie.options = selectedSerie.subseries;
    } else {
        dataRecords.dataSelectSubserie.options = [];
        openModalAlert("No hay subseries disponibles para la serie seleccionada.");
    }
}

function refreshData() {
    searchRecordsList("", 1);
    dataRecords.stateLoadData = false;
    dataRecords.stateFormRecords = false;
    dataRecords.stateResponseLoad = false;
}

function closeModalAlert() {
    dataRecords.dataModalAlert.isActive = 'hidde';
}

function openModalAlert(text: string): void {
    dataRecords.dataModalAlert.isActive = 'show';
    dataRecords.dataModalAlert.dataText.text = text;
}

function closeModalConfirmation() {
    dataRecords.dataModalConfirmation.isActive = 'hidde';
    refreshData();
}

function openModalConfirmation(text: string): void {
    dataRecords.dataModalConfirmation.isActive = 'show';
    dataRecords.dataModalConfirmation.dataText.text = text;
}

function redirectToRecord(id: string | number, typeOfRecord:any): void {
    router.push('/home/record/' + id + `?isRecord=${typeOfRecord === 'record' ? true : false}`);
}

function closeModalListDocuments() {
    dataRecords.dataInputFiles.dataModalListDocuments.isActive = false;
}

function closeModalListDocumentsRecord() {
    dataRecords.dataModalListDocuments.isActive = false;
    resetModalListArchive()
}

function openModalListDocuments() {
    dataRecords.dataInputFiles.dataModalListDocuments.isActive = true;
}

function openModalListDocumentsRecord() {
    dataRecords.dataModalListDocuments.isActive = true;
}

function resetModalListArchive() {
    store.clearUploadedFiles()
}

function openDocSelected(index: number | string): void {


    if (!store.uploadedFiles[index].url) { //Validate if is a route or file
        const reader = new FileReader();
        reader.readAsDataURL(store.uploadedFiles[index]);//File
        reader.onload = () => {
            const base64String = reader.result as string;
            openModalPdfViewer(base64String);
        };
    } else {
        FilesServices.getDocumentContent(store.uploadedFiles[index].url)
            .then((response: any) => {

                openModalPdfViewer(response);//route
            })
            .catch((error: any) => {
                console.error(error);
            })
    }
}

function openModalPdfViewer(url: string): void {
    dataRecords.dataModalPdfViewer = {
        isActive: 'show',
        dataPdfViewer: {
            urlPdf: url,
            toolbar: { toolbar: false },
            onClose: () => { }
        }
    }
}

function resetForm() {
    dataRecords.dataInputName.model = '';
    dataRecords.dataSelectSerie.model = '';
    dataRecords.dataSelectSubserie.model = '';
    dataRecords.dataInputFiles.counterFiles = 0;
    store.clearUploadedFiles();
}

function actionsMenu(action: any, record: any) {
    idRecord.value = record.id;
    validateActionToFiling(action, record);
}

</script>