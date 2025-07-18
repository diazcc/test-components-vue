<template>
    <CorrespondenceWebTemplate :dataCorrespondenceWeb="dataCorrespondenceWeb" @emitDocSelected="openDocSelected" />
</template>
<script setup lang="ts">

import CorrespondenceWebTemplate from '../../templates/correspondence-web/CorrespondenceWeb.template.vue';
import { reactive, onMounted, onBeforeMount, ref, watch } from 'vue';
import FilingServices from '../../../services/FilingServices.ts'
import LocalizationServices from '../../../services/LocalizationServices.ts';
import { accessStore } from '../../../store';
import { useRouter } from "vue-router";
import FormValidators from '../../../validators/FormValidators';
import DataFlowServices from "../../../services/DataFlowServices";

const router = useRouter();
const urlPdfCertificated: any = ref('');
const urlPdfSticker: any = ref('');
const store: any = accessStore();
const dataCorrespondenceWeb: any = reactive(getDataCorrespondenceWeb())

onBeforeMount(() => {
    getDataCorrespondenceWeb();
}),

    onMounted(() => {
        callServices();
    })

function callServices() {
    getPersonTypes();
    getIdentificationTypes();
    getCountries();
    getResponseModes();

}

function getDataCorrespondenceWeb(): {} {
    return reactive({
        stateFormRemitter: false,
        stateFormFiling: false,
        stateFormResponse: false,
        stateFormLoad: false,
        types_person: [],
        listIdTypes: [],
        type_of_person: '',
        form: {
            person_type: '',
            address: '',
            email: '',
            first_name: '',
            second_name: '',
            last_name: '',
            second_last_name: '',
            identification_type: '',
            phone_number: '',
            identification_number: '',
            country: '',
            department: '',
            city: '',
            nit_number: '',
            contact_name: '',
            social_reason: '',
            type_of_filing: '',
            subject: '',
            response_mode: '',
            folio_number: '',
            presentation_mode: '001',
            confidential_document: '',
            description: ''
        },
        response: {
            url: '',
            subject: '',
            filing_number: '',
            creation_date: '',
            email: '',
            response_mode: '',
        },
        dataModalAlert: {
            isActive: '',
            dataButton: {
                className: '',
                text: '',
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
                className: '',
                text: 'close',
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
        dataButtonBack:
        {
            className: 'gray-dark',
            text: 'back',
            alt: 'back',
            url: '/Buttons/left-arrow.svg',
            reverse: false,
            disabled: false,
            onClick: () => { validateNavigationBack(); }
        },
        dataButtonNext:
        {
            className: 'blue',
            text: 'continue',
            alt: 'continue',
            url: '/Buttons/right-arrow.svg',
            reverse: true,
            disabled: false,
            onClick: () => { validateNavigationNext() }
        },
        dataSelectIdType: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => { },
            onClick: () => { },
            placeholder: 'select_identification_type',
            model: '',
            required: false,
            options: []
        },
        dataInputFiles: {
            counterFiles: 0,
            openModalDocs: () => {
                dataCorrespondenceWeb.dataInputFiles.dataModalListDocuments.isActive = true;
            },
            dataModalListDocuments: {
                isActive: false,
                closeModal: () => { dataCorrespondenceWeb.dataInputFiles.dataModalListDocuments.isActive = false; },
            }
        },
        dataSelectCountry: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {
                getDepartments(data.target.value, data.target.options[data.target.selectedIndex].label)
            },
            onClick: () => { },
            placeholder: 'select_country',
            model: '',
            required: true,
            options: []
        },
        dataSelectDepartment: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {
                getCity(data.target.value, data.target.options[data.target.selectedIndex].label)
            },
            onClick: () => { },
            placeholder: 'select_department',
            model: '',
            required: true,
            options: []
        },
        dataSelectCity: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => { setCityOnForm(data.target.options[data.target.selectedIndex].label) },
            onClick: () => { },
            placeholder: 'select_city',
            model: '',
            required: true,
            options: []
        },
        dataSelectResponseMode: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => { setResponseMode(data.target.options[data.target.selectedIndex].label) },
            onClick: () => { },
            placeholder: 'select_response_mode',
            model: '',
            required: true,
            options: []
        },
        dataModalPdfViewer: {
            isActive: '',
            dataPdfViewer: {
                urlPdf: '',
                toolbar: {
                    toolbar: false
                },
                onClose: () => { }
            }
        },
        setForm: (code: number | string) => {
            setForm(code);
        },
        downloadPdfCertificated: () => {
            downloadFilingPdfCertificated();
        },
        downloadPdfQR: () => {
            downloadFilingPdfSticker();
        },
    });
}


const setCityOnForm = (label: string) => {
    dataCorrespondenceWeb.form.city = label;
}
const setResponseMode = (label: string) => {
    dataCorrespondenceWeb.form.response_mode = label;
}
function sendDataFiling() {
    dataCorrespondenceWeb.stateFormLoad = true;
    let formData = new FormData();
    (dataCorrespondenceWeb.type_of_person != '' && dataCorrespondenceWeb.type_of_person != null) && formData.append('person_type', dataCorrespondenceWeb.type_of_person);
    (dataCorrespondenceWeb.form.address != '' && dataCorrespondenceWeb.form.address != null) && formData.append("address", dataCorrespondenceWeb.form.address);
    (dataCorrespondenceWeb.form.email != '' && dataCorrespondenceWeb.form.email != null) && formData.append("email", dataCorrespondenceWeb.form.email);
    (dataCorrespondenceWeb.form.first_name != '' && dataCorrespondenceWeb.form.first_name != null) && formData.append("first_name", dataCorrespondenceWeb.form.first_name);
    (dataCorrespondenceWeb.form.second_name != '' && dataCorrespondenceWeb.form.second_name != null) && formData.append("second_name", dataCorrespondenceWeb.form.second_name);
    (dataCorrespondenceWeb.form.last_name != '' && dataCorrespondenceWeb.form.last_name != null) && formData.append("last_name", dataCorrespondenceWeb.form.last_name);
    (dataCorrespondenceWeb.form.second_last_name != '' && dataCorrespondenceWeb.form.second_last_name != null) && formData.append("second_last_name", dataCorrespondenceWeb.form.second_last_name);
    (dataCorrespondenceWeb.dataSelectIdType.model != '' && dataCorrespondenceWeb.dataSelectIdType.model != null) && formData.append("identification_type", dataCorrespondenceWeb.dataSelectIdType.model);
    (dataCorrespondenceWeb.form.phone_number != '' && dataCorrespondenceWeb.form.phone_number != null) && formData.append("phone_number", dataCorrespondenceWeb.form.phone_number);
    (dataCorrespondenceWeb.form.identification_number != '' && dataCorrespondenceWeb.form.identification_number != null) && formData.append("identification_number", dataCorrespondenceWeb.form.identification_number);
    (dataCorrespondenceWeb.form.country != '' && dataCorrespondenceWeb.form.country != null) && formData.append("country", dataCorrespondenceWeb.form.country);
    (dataCorrespondenceWeb.form.department != '' && dataCorrespondenceWeb.form.department != null) && formData.append("department", dataCorrespondenceWeb.form.department);
    (dataCorrespondenceWeb.form.city != '' && dataCorrespondenceWeb.form.city != null) && formData.append("city", dataCorrespondenceWeb.form.city);
    (dataCorrespondenceWeb.form.nit_number != '' && dataCorrespondenceWeb.form.nit_number != null) && formData.append("nit_number", dataCorrespondenceWeb.form.nit_number);
    (dataCorrespondenceWeb.form.contact_name != '' && dataCorrespondenceWeb.form.contact_name != null) && formData.append("contact_name", dataCorrespondenceWeb.form.contact_name);
    (dataCorrespondenceWeb.form.social_reason != '' && dataCorrespondenceWeb.form.social_reason != null) && formData.append("social_reason", dataCorrespondenceWeb.form.social_reason);
    (dataCorrespondenceWeb.form.subject != '' && dataCorrespondenceWeb.form.subject != null) && formData.append("subject", dataCorrespondenceWeb.form.subject);
    (dataCorrespondenceWeb.dataSelectResponseMode.model != '' && dataCorrespondenceWeb.dataSelectResponseMode.model != null) && formData.append("response_mode", dataCorrespondenceWeb.dataSelectResponseMode.model);
    (dataCorrespondenceWeb.form.folio_number != '' && dataCorrespondenceWeb.form.folio_number != null) && formData.append("folio_number", dataCorrespondenceWeb.form.folio_number);
    (dataCorrespondenceWeb.form.confidential_document != '' && dataCorrespondenceWeb.form.confidential_document != null) && formData.append('confidential_document', dataCorrespondenceWeb.form.confidential_document);
    (dataCorrespondenceWeb.form.description != '' && dataCorrespondenceWeb.form.description != null) && formData.append('description', dataCorrespondenceWeb.form.description);
    formData.append("presentation_mode", '004');
    formData.append("type_of_filing", "1");
    store.uploadedFiles.forEach((response: any) => {
        formData.append('document', response);
    });
    FilingServices.createFilingWeb(formData)
        .then((response: any) => {
            dataCorrespondenceWeb.stateFormLoad = false;
            dataCorrespondenceWeb.stateFormResponse = true;
            dataCorrespondenceWeb.stateFormFiling = false;
            dataCorrespondenceWeb.stateFormRemitter = false;
            openModalConfirmation('the_filing_was_created');
            dataCorrespondenceWeb.response = {
                url: response.filing_qr,
                subject: response.subject,
                filing_number: response.filing_code,
                creation_date: response.filing_date,
                email: response.remitter.email,
                response_mode: response.response_mode.label,
            }
            urlPdfCertificated.value = response.filing_certificate;
            urlPdfSticker.value = response.filing_sticker;
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.details[0]);
        })
}
function getResponseModes() {
    FilingServices.getResponseModes()
        .then((response: any) => {
            dataCorrespondenceWeb.dataSelectResponseMode.options = response.response.map((data: any) => ({
                value: data.code,
                label: data.label
            }))
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later')
        })
}
async function getCountries() {
    LocalizationServices.getCountries()
        .then(async (response: any) => {
            dataCorrespondenceWeb.dataSelectCountry.options = response.response.map((data: any) => ({
                value: data.id,
                label: data.name
            }))
        })
        .catch((error: any) => {
            console.error(error)
            openModalAlert('something_happened_try_later')
        })
};

async function getDepartments(value: number | string, label: string) {
    dataCorrespondenceWeb.form.country = label;
    LocalizationServices.getCountriesStates(value)
        .then(async (response: any) => {
            dataCorrespondenceWeb.dataSelectDepartment.options = response.response.map((data: any) => ({
                value: data.id,
                label: data.name
            }))
        })
        .catch((error: any) => {
            console.error(error)
            openModalAlert('something_happened_try_later')
        })
};

async function getCity(value: number | string, label: string) {
    dataCorrespondenceWeb.form.department = label;
    LocalizationServices.getStatesCities(value)
        .then(async (response: any) => {
            dataCorrespondenceWeb.dataSelectCity.options = response.response.map((data: any) => ({
                value: data.id,
                label: data.name
            }))
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later')
        })
}

function getPersonTypes() {
    FilingServices.getPersonTypes()
        .then((response: any) => {
            dataCorrespondenceWeb.types_person = response.map((value: any) => ({
                ...value,
                state: false
            }))
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later')
        })
}
function downloadFilingPdfCertificated() {
    DataFlowServices.downloadPdf(urlPdfCertificated.value)
        .catch((error:any)=>{
            console.error('Error al descargar el PDF:', error);
            openModalAlert('something_happened_try_later')
        });
}
function downloadFilingPdfSticker(){
    DataFlowServices.downloadPdf(urlPdfSticker.value)
        .catch((error:any) => {
            console.error('Error al descargar el PDF:', error);
            openModalAlert('something_happened_try_later')
        });
}
function getIdentificationTypes() {
    FilingServices.getIdentificationTypes()
        .then((response: any) => {
            dataCorrespondenceWeb.dataSelectIdType.options = response.map((data: any) => ({
                value: data.code,
                label: data.label
            }));
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later')
        })
}
function setForm(code: number | string) {
    dataCorrespondenceWeb.type_of_person = code;
    getIdentificationTypes();
}

function openModalConfirmation(text: string): void {
    dataCorrespondenceWeb.dataModalConfirmation.isActive = 'show';
    dataCorrespondenceWeb.dataModalConfirmation.dataText.text = text;
}
function closeModalConfirmation() {
    dataCorrespondenceWeb.dataModalConfirmation.isActive = 'hidde';
}

function openModalAlert(text: string): void {
    dataCorrespondenceWeb.dataModalAlert.isActive = 'show';
    dataCorrespondenceWeb.dataModalAlert.dataText.text = text;
}
function closeModalAlert() {
    dataCorrespondenceWeb.dataModalAlert.isActive = 'hidde';
    setStatesBack()

}

function openDocSelected(index: number | string): void {
    const reader = new FileReader();
    reader.readAsDataURL(store.uploadedFiles[index]);//File
    reader.onload = () => {
        const base64String = reader.result as string;
        openModalPdfViewer(base64String);
    };
}

function validateNavigationNext() {//This navigation is conditionate by function template component with the same states.
    if (FormValidators.getValidationForm('correspondence-web__content__bk__form')) {
        if (dataCorrespondenceWeb.stateFormRemitter) {
            dataCorrespondenceWeb.stateFormRemitter = false;
            dataCorrespondenceWeb.stateFormFiling = true;
        } else if (dataCorrespondenceWeb.stateFormFiling) {
            sendDataFiling()
        }
    }
}
function validateNavigationBack() {//This navigation is conditionate by function template component with the same states.

    if (dataCorrespondenceWeb.stateFormFiling) {
        dataCorrespondenceWeb.stateFormRemitter = true;
        dataCorrespondenceWeb.stateFormFiling = false;
        dataCorrespondenceWeb.stateFormResponse = false;
    }
    if (dataCorrespondenceWeb.stateFormResponse) {
        setStatesBack();
    }
    if (dataCorrespondenceWeb.stateFormRemitter) {
        router.back();
    }

}

function openModalPdfViewer(pdf: any) {
    dataCorrespondenceWeb.dataModalPdfViewer.isActive = 'show';
    dataCorrespondenceWeb.dataModalPdfViewer.dataPdfViewer.urlPdf = pdf;
}

function setStatesBack() {
    Object.assign(dataCorrespondenceWeb, getDataCorrespondenceWeb());
    callServices();
    router.back()
}
watch(() => dataCorrespondenceWeb.type_of_person, (newValue: any, oldValue: any) => {
    if (newValue != '') dataCorrespondenceWeb.stateFormRemitter = true;
});
</script>
<style scoped src="./CorrespondenceWeb.page.scss"></style>