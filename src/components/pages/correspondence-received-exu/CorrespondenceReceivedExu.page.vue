<template>
    <CorrespondenceReceivedExu :dataCorrespondenceReceivedExu="dataCorrespondenceReceivedExu"
        @emitDocSelected="getFileFilingForm" @applyFilters="applyFilters"/>
</template>
<script setup lang="ts">
import CorrespondenceReceivedExu from '../../templates/correspondence-received-exu/CorrespondenceReceivedExu.template.vue';
import UserServices from '../../../services/UserServices.ts';
import RecordsServices from '../../../services/RecordsServices.ts';
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import FilingServices from '../../../services/FilingServices.ts';
import { accessStore } from '../../../store';
import FormValidators from '../../../validators/FormValidators';

const store = accessStore();
const idRemitter: any = ref('');
const url_pdf: any = ref('');//State for be user globaly
const filesArrayFilingForm = ref(store.uploadedFiles);
let formData = new FormData();
const router = useRouter();
const fileFilingForm: any = ref(null);
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataCorrespondenceReceivedExu : any = reactive({
    stateChooseFiling: false,
    stateCreateFiling: false,
    stateLoadData: false,
    list: [],
    dataFilingForm: {
        stateLoadResponse: false,
        stateResponse: false,
        anonymousFiling: false,
        form: {
            subject: '',
            confidential_document: 'false',
            response_mode: '',
        },
        response: {
            dataImgQR: {
                id: '',
                name: '',
                class: '',
                src: '',
                type: 'png',
                alt: '',
                onClick: () => { }
            },
            filing_code: '',
            document: '',
            filing_date: '',
            remitter: '',
            type_of_filing: '',

        },
        dataInputFiles: {
            counterFiles: filesArrayFilingForm.value.length,
            openModalDocs: () => {
                openModalListDocuments()
            },
            dataModalListDocuments: {
                isActive: false,
                closeModal: () => {
                    closeModalListDocuments();
                },
            }
        },
    },
    dataButtonNew: {
        className: 'blue',
        text: 'filing_new',
        disabled: false,
        onClick: () => { setStateChooseFiling() }
    },
    dataButtonBack: {
        className: '',
        text: 'back',
        disabled: false,
        onClick: () => { setStatesBack() }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'filing_new',
        disabled: false,
        onClick: () => { validateTypeFiling() }
    },
    dataButtonAnonymousFiling: {
        className: 'gray-blue',
        text: 'anonymous_filing',
        disabled: false,
        onClick: () => { setAnonymousFiling() }
    },
    dataButtonFiling: {
        className: 'gray-mouse-blue',
        text: 'filing_new',
        disabled: false,
        onClick: () => { setFiling() }
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
            onClick: () => { }
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
    dataMultiSelect: {
        title: "filters",
        model: [],
        options: filters.value.map((value: any) => ({
            text: value,
            value: value,
            checked: false
        }))
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => { closeModalAlert() }
        },
        dataText: {
            classText: '',
            text: 'Esta es la descripcion',
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
            text: 'Esta es la descripcion',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalPdfViewer: {
        isActive: '',
        dataPdfViewer: {
            urlPdf: '',
            toolbar: { toolbar: false },
            onClose: () => { }
        }

    },
    openFiling: (value: any): void => { openFiling(value.id)/* <--- Get directly porperty data */ },
    setAnonymousFiling: () => { setAnonymousFiling() },
    setFiling: () => { setFiling() },
});


onMounted(() => {
    getListRad();
    getIdUserExtern();
})


/**
 * TODO WATCHS
 */
watch(store.uploadedFiles, (newFiles: any, oldFiles) => {
    filesArrayFilingForm.value = [...newFiles];
    dataCorrespondenceReceivedExu.dataFilingForm.dataInputFiles.counterFiles = filesArrayFilingForm.value.length
});


function getListRad() {
    dataCorrespondenceReceivedExu.stateLoadData = true;
    RecordsServices.getRecord(1)
        .then((response: any) => {
            const filings :any =  response.response.results.map((data: any) => ({
                ...data,
                isMenuOpen: false
            }));
            dataCorrespondenceReceivedExu.list = filings;
            dataCorrespondenceReceivedExu.stateLoadData = false;
        })
        .catch((error: any) => {
            dataCorrespondenceReceivedExu.stateLoadData = false;
            console.error(error);
        })
}

function getIdUserExtern() {

    UserServices.getIdUserExtern()
        .then((response: any) => {
            idRemitter.value = response;
        })
        .catch((error: any) => {
            console.error(error);
        });
}

const openFiling = (data: string | {}): void => { router.push('/home/filing/' + data) };

function closeModalListDocuments(): void {
    dataCorrespondenceReceivedExu.dataFilingForm.dataInputFiles.dataModalListDocuments.isActive = false;
}

function openModalAlert(text: string): void {
    dataCorrespondenceReceivedExu.dataModalAlert.isActive = 'show';
    dataCorrespondenceReceivedExu.dataModalAlert.dataText.text = text;
}

function closeModalAlert() {
    dataCorrespondenceReceivedExu.dataModalAlert.isActive = 'hidde';
}

function openModalListDocuments(): void {
    dataCorrespondenceReceivedExu.dataFilingForm.dataInputFiles.dataModalListDocuments.isActive = true;

}
function openModalPdfViewer(data: any) {
    dataCorrespondenceReceivedExu.dataModalPdfViewer.isActive = 'show';
    dataCorrespondenceReceivedExu.dataModalPdfViewer.dataPdfViewer.urlPdf = data;
}

function setStateChooseFiling(): void {
    dataCorrespondenceReceivedExu.stateChooseFiling = true;
    dataCorrespondenceReceivedExu.stateCreateFiling = false;
}

function setStatesBack() {
    dataCorrespondenceReceivedExu.dataFilingForm.anonymousFiling = false;
    dataCorrespondenceReceivedExu.dataFilingForm.stateResponse = false;
    dataCorrespondenceReceivedExu.stateCreateFiling = false;
    dataCorrespondenceReceivedExu.stateChooseFiling = false;
    dataCorrespondenceReceivedExu.dataFilingForm.form.subject = '';
    dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document = '';
    store.clearUploadedFiles();
    getListRad(); // <----- Refresh endpoint .
    formData = new FormData();
}

function setAnonymousFiling(): void {
    dataCorrespondenceReceivedExu.dataFilingForm.anonymousFiling = true;
    dataCorrespondenceReceivedExu.stateCreateFiling = true;
    dataCorrespondenceReceivedExu.stateChooseFiling = false;
}
function setFiling(): void {
    dataCorrespondenceReceivedExu.dataFilingForm.anonymousFiling = false;
    dataCorrespondenceReceivedExu.stateCreateFiling = true;
    dataCorrespondenceReceivedExu.stateChooseFiling = false;
}


function getFileFilingForm(index: any) {
    fileFilingForm.value = index;

    const reader = new FileReader();
    reader.readAsDataURL(filesArrayFilingForm.value[index]);
    reader.onload = () => {
        const base64String = reader.result as string;
        openModalPdfViewer(base64String);
    };
}

function validateTypeFiling(): void {
    if (FormValidators.getValidationForm('filing-form__form__container')) {
        switch (dataCorrespondenceReceivedExu.dataFilingForm.anonymousFiling) {
            case true:
                sendDataAnonymousFiling()
                break;
            case false:
                sendDataFiling()
                break;
            default:
                break;
        }
    } else {

        openModalAlert('all_inputs_empy')
    }

}


function sendDataFiling() {
    dataCorrespondenceReceivedExu.dataFilingForm.stateLoadResponse = true;
    dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document = dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document.toString() == 'true' ? dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document : 'false';
    formData.append('remitter_id', idRemitter.value);
    formData.append('remitter_validation', '001');
    formData.append('folio_number', '1');
    formData.append('presentation_mode', '001');
    formData.append('subject', dataCorrespondenceReceivedExu.dataFilingForm.form.subject);
    formData.append('confidential_document', dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document);
    formData.append('response_mode', '002');
    formData.append('type_of_filing', '1');//THIS FLOW IS ABOUT INPUT FILING
    filesArrayFilingForm.value.forEach((file: any) => {
        formData.append('document', file);
    });
    FilingServices.createFiling(formData)
        .then((response: any) => {
            dataCorrespondenceReceivedExu.dataModalConfirmation.dataText.text = 'filing_successfully_created';
            dataCorrespondenceReceivedExu.dataFilingForm.response = {
                dataImgQR: {
                    id: '',
                    name: '',
                    class: '',
                    src: response.sticker_qr,
                    type: 'png',
                    alt: '',
                    onClick: () => { }
                },
                filing_code: response.filing_code,
                document: '',
                filing_date: response.filing_date,
                remitter: response.remitter ? (response.remitter.contact_name ? response.remitter.contact_name : (response.remitter.first_name ? (response.remitter.first_name + ' ' + response.remitter.last_name) : (response.remitter.email))) : 'Persona anonima',
                type_of_filing: response.type_of_filing.label,
            }

            dataCorrespondenceReceivedExu.dataModalConfirmation.isActive = 'show';

        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0]);
        });
}

function sendDataAnonymousFiling() {
    dataCorrespondenceReceivedExu.dataFilingForm.stateLoadResponse = true;
    dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document = dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document.toString() == 'true' ? dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document : 'false';
    formData.append('remitter_validation', '002');
    formData.append('remitter', idRemitter.value);
    formData.append('subject', dataCorrespondenceReceivedExu.dataFilingForm.form.subject);
    formData.append('folio_number', '1');
    formData.append('presentation_mode', '004');//PRESENTATION ELECTRONIC MEDIA
    formData.append('subject', dataCorrespondenceReceivedExu.dataFilingForm.form.subject);
    formData.append('confidential_document', dataCorrespondenceReceivedExu.dataFilingForm.form.confidential_document);
    formData.append('response_mode', dataCorrespondenceReceivedExu.dataFilingForm.form.response_mode);
    formData.append('address', 'empty');
    formData.append('phone_number', '0000000');
    formData.append('email', 'userextern@suntic.com');
    formData.append('type_of_filing', '1');//THIS FLOW IS ABOUT INPUT FILING

    filesArrayFilingForm.value.forEach((file: any) => {
        formData.append('document', file);
    });
    FilingServices.createFiling(formData)
        .then((response: any) => {
            dataCorrespondenceReceivedExu.dataModalConfirmation.dataText.text = 'filing_successfully_created';
            dataCorrespondenceReceivedExu.dataFilingForm.response = {
                dataImgQR: {
                    id: '',
                    name: '',
                    class: '',
                    src: response.filings[0].sticker_qr,
                    type: 'png',
                    alt: '',
                    onClick: () => { }
                },
                filing_code: response.filings[0].filing_code,
                document: '',
                filing_date: response.filings[0].filing_date,
                remitter: response.remitter ? (response.remitter.contact_name ? response.remitter.contact_name : (response.remitter.first_name ? (response.remitter.first_name + ' ' + response.remitter.last_name) : (response.remitter.email))) : 'Persona anonima',
                type_of_filing: response.remitter_validation.label,
            }
            dataCorrespondenceReceivedExu.dataModalConfirmation.isActive = 'show';
        })
        .catch((error: any) => {
            console.error(error);
        });
}

function closeModalConfirmation() {
    dataCorrespondenceReceivedExu.dataModalConfirmation.isActive = 'hidde';
    dataCorrespondenceReceivedExu.dataFilingForm.stateResponse = true;
    dataCorrespondenceReceivedExu.dataFilingForm.stateLoadResponse = false;
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>

<style src="./CorrespondenceReceivedExu.page.scss" scoped></style>