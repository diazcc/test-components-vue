<!--
    TODO COMPONENT CORRESPONDENCE RECEIVED PAGE
    ?This component has all logic and develop of correspondence on only section 'received'.
-->

<template>
    <CorrespondenceSentTemplate :dataCorrespondenceSent="dataCorrespondenceSent" @codeFiling="showMenuTableFilings"
        @user="getUser" @fileFiling="getDocumentFiling" @emitDocSelected="getFileFilingForm"
        @sendDataEditor="getValueEditor" />
</template>

<script setup lang="ts">

// IMPORTS

import CorrespondenceSentTemplate from "../../templates/correspondence-sent/CorrespondenceSent.template.vue";
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, reactive, ref, watch } from "vue";
import UserServices from '../../../services/UserServices';
import { accessStore } from "../../../store";
import FilingServices from "../../../services/FilingServices";
import FormValidators from "../../../validators/FormValidators";
import DependenceServices from "../../../services/DependenceServices";
import DataFlowServices from "../../../services/DataFlowServices";

const store = accessStore();

// VARIABLES OR STATES
/**
 * TODO HERE DEFINE VALUES DEFAULT
 */
const urlPdfSticker: any = ref('');
const valueEditor: any = ref();
const urlPdfCertificated: any = ref('');
const filing_code_filing: any = ref('');//State for be used globaly
const ref_pdf: any = ref('');//State for be user globaly
const filesArrayFilingForm = ref(store.uploadedFiles);
const fileFilingForm: any = ref(null);
const fileReaderBase64: any = ref(null);
const dataListRad: any = ref('');
const idRecord: any = ref('');
let formData: FormData = new FormData(); //Formdata used for be send to endpoits
const dataCorrespondenceSent: any = reactive(getDataCorrespondenceSent());

/**
 * todo METHODS
 * 
 * ?LIFE CICLES
 */


// Ciclos de vida del componente
onBeforeMount(() => { });

onMounted(() => {
    callServices();
});

onBeforeUpdate(() => { });

onUpdated(() => { });

onBeforeUnmount(() => { });

onUnmounted(() => { });

watch(() => dataCorrespondenceSent.dataPaginator.page_size, () => {
    searchFilingsRequestList(dataCorrespondenceSent.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model, 1);
});

watch(store.uploadedFiles, (newFiles: any, oldFiles) => {
    filesArrayFilingForm.value = [...newFiles];
    dataCorrespondenceSent.dataFilingForm.dataInputFiles.counterFiles = filesArrayFilingForm.value.length
});

function callServices() {
    searchFilingsRequestList("", 1);
    getParentDependences();
}

/**
 * TODO FUNCTIONS SET AND GET
 */

function getDataCorrespondenceSent() {
    return reactive({//Structure of all components data
        id_addresse: 'id_remitter',
        state: '',//First state for show first view : viewNewFile (hidde first view and : viewNewFile show options selects)
        stateViewFile: '', // (show for steps)
        typeOfFiling: '',
        subject: '',
        contentDocument: '',
        title: 'welcome_to_the_filing_module',
        stateCreateRemmiter: true,
        stateCreatedFilin: true,
        stateEditorText: false,
        stateViewFileAnonimous: false,
        stateResponseFiling: false,
        stateFlow: '',
        dataButtonNewFile: {
            className: 'blue',
            text: 'new',
            alt: "new",
            url: "/Buttons/icon-add.svg",
            reverse: true,
            disabled: false,
            onClick: () => { redirectNeWFiling() }
        },
        dataButtonCreateInternalFiling: {
            className: 'gray-blue',
            text: 'create_internal_filing',
            disabled: false,
            onClick: () => {
                setStateCreateInternalFiling();
            }
        },
        dataButtonCreateOutputFiling: {
            className: 'gray-mouse-blue',
            text: 'create_output_filing',
            disabled: false,
            onClick: () => {
                setStateCreateOutputFiling();
            }
        },
        dataButtonRedirectToSearchRemitter: {
            className: 'gray-blue',
            text: 'search_recipient',
            disabled: false,
            onClick: () => {
                setStateSearchRemitters()
            }
        },
        dataButtonRedirectToCreateRemitter: {
            className: 'gray-mouse-blue',
            text: 'create_recipient',
            disabled: false,
            onClick: () => {
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step12345', 'outgoing_filing_module');
            }
        },
        dataButtonGoToNext: {
            className: 'blue',
            text: 'continue',
            alt: 'continue',
            url: '/Buttons/right-arrow.svg',
            reverse: true,
            disabled: false,
            onClick: () => { validateNavegationButtonNext() }
        },
        dataButtonGoToBack: {
            className: 'gray',
            text: 'back',
            alt: 'left-arrow',
            url: '/Buttons/left-arrow.svg',
            disabled: false,
            reverse: false,
            fontSize: '',
            onClick: () => { validateNavegationButtonBack() }
        },
        dataImgGoToBack: {
            id: '',
            name: 'back',
            class: 'icon-back',
            src: '/arrow-left.svg',
            type: 'svg',
            alt: '',
            isActive: () => { }, // optional, currently used to add activate and deactivate the active class
            onClick: () => {
                validateNavegationImgBack();
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
        dataTableRemitters: {
            data: [],
            dataButton:
            {
                className: 'blue',
                text: 'new',
                alt: 'new',
                url: "/Buttons/icon-add.svg",
                reverse: true,
                disabled: false,
                onClick: () => { redirectCreateRemitter() }
            },
            dataInputSearch: {
                dataInput: {
                    id: '',
                    name: '',
                    classInputEmail: '',
                    model: '',
                    type: '',
                    placeholder: 'search_recipients',
                    disabled: false,
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

            }

        },
        dataModalConfirmation: {
            isActive: '',
            dataText: {
                classText: '',
                text: '',
                disabled: false,
                onClick: () => { }
            },
            dataButton: {
                className: '',
                text: 'close',
                disabled: false,
                onClick: () => {
                    closeModalConfirmation()
                }
            },

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
                text: 'Esta es la descripcion',
                disabled: false,
                onClick: () => { }
            }
        },
        //This modal is a temporary solution for all the actions that dont require to cancel the current operation
        dataModalAlertTemp: {
            isActive: '',
            dataButton: {
                className: 'blue',
                text: 'close',
                alt: 'close',
                url: '/Buttons/decline.svg',
                iconSize: 'short',
                disabled: false,
                onClick: () => { dataCorrespondenceSent.dataModalAlertTemp.isActive = 'hidde'; }
            },
            dataText: {
                classText: '',
                text: 'Esta es la descripcion',
                disabled: false,
                onClick: () => { }
            }
        },
        dataDocumentCreator: {
            setDataPage: () => { },
        },
        dataSelectListActionUsers: {
            typeOfFinalAction: '',
            notShowOptions: true,
            stateEditorText: false,
            usersSelecteds: [],
            users: [],
        },
        dataResumeFiling: {
            url: '',
            subject: '',
            filing_number: '',
            creation_date: '',
            email: '',
            response_mode: '',
            downloadPdfQR: () => {
                downloadFilingPdfSticker()
            },
            downloadPdfCertificated: () => {
                downloadFilingPdfCertificated()
            },
        },
        dataCreateRemitterForm: {
            form: {
                first_name: '',
                middle_name: '',
                last_name: '',
                second_last_name: '',
                identification_type: '',
                identification_number: '',
                contact_name: '',
                social_reason: '',
                nit_number: '',
                personType: '',
                country: '',
                department: '',
                city: '',
                address: '',
                phone_number: '',
                email: ''
            }
        },
        dataFormTrd: {
            serie: '',
            subserie: '',
            documentary_type: '',
        },
        dataTableCorrespondenceReceived: {
            stateLoadData: false, //True is about loading data end. 
            validateSubmenu: false,
            data: [],
            dataInputSearch: {
                dataInput: {
                    id: '',
                    name: '',
                    classInputEmail: '',
                    model: '',
                    type: 'text',
                    placeholder: 'search_filing',
                    disabled: false,
                    required: false,
                    onClick: () => { },
                    onChange: (value: any) => {
                        searchFilingsRequestList(value, 1)
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
            optionsMenu: {
                moveFiling: () => { },
                assignFiling: (id_record: any) => {
                    idRecord.value = id_record;
                },
                responseFiling: (data: any) => {

                },
            },
            actionsMenu: (action: any) => {
            },
            openFiling: () => {

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
                searchFilingsRequestList( dataCorrespondenceSent.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model, value)
            }
        },
        redirectToSearchRemitter: () => {
            dataCorrespondenceSent.stateViewFile = 'step12';
        },
        redirectToCreateRemitter: () => {
            assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123', 'outgoing_filing_module');
        },
        redirectToCreateFileAnonimous: () => {  },
    })
}

function setStateSearchUsers() {
    dataCorrespondenceSent.stateViewFile = 'step123';
    formData.append("type_of_filing", "3");
    getUsers();
}

function setStateSearchRemitters() {
    dataCorrespondenceSent.stateViewFile = 'step123';
    formData.append("type_of_filing", "3");
    dataCorrespondenceSent.title = 'outgoing_filing_module'
}

function setStateCreateOutputFiling() {
    dataCorrespondenceSent.dataFormTrd.typeFlow = 2;
    dataCorrespondenceSent.stateViewFile = 'step12';
    dataCorrespondenceSent.typeOfFiling = '2';
    dataCorrespondenceSent.title = 'outgoing_filing_module';
    dataCorrespondenceSent.stateFlow = 'outgoing';
}

function setStateCreateInternalFiling() {
    dataCorrespondenceSent.dataFormTrd.typeFlow = 3;
    dataCorrespondenceSent.typeOfFiling = '3';
    dataCorrespondenceSent.stateFlow = 'internal';
    assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step1234', 'internal_filing_module');
}

async function getParentDependences() {
    await DependenceServices.getParentDependences()
        .then(async (response: any) => {
            dataCorrespondenceSent.dataModalResponseFiling.dataSelectDependence.options = 
            response.map((element: any) => { 
            return {
                value: element.code,
                label: element.name
            }});
        })
        .catch((error: any) => {
            console.error(error)
        });
}

function getUsers() {
    UserServices.getAllUsers()
        .then((response: any) => {
            dataCorrespondenceSent.dataTableRemitters.data = response;

        })
        .catch((error: any) => {
            console.error(error);
        })
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

function getDocumentFiling(file: any) {
    formData.append('document', file);
}

function downloadFilingPdfCertificated() {
    DataFlowServices.downloadPdf(urlPdfCertificated.value)
        .catch((error: any) => {
            console.error('Error al descargar el PDF:', error);
            openModalAlert('something_happened_try_later')
        })
}

function downloadFilingPdfSticker() {
    DataFlowServices.downloadPdf(urlPdfSticker.value)
        .catch((error: any) => {
            console.error('Error al descargar el PDF:', error);
            openModalAlert('something_happened_try_later')
        })
}

watch(() => dataCorrespondenceSent.stateViewFile, (newValue: boolean, oldValue: boolean) => {
});

function openModalAlert(text: string): void {
    dataCorrespondenceSent.dataModalAlert.isActive = 'show';
    dataCorrespondenceSent.dataModalAlert.dataText.text = text;
}

function getUser(user: any) {
    dataCorrespondenceSent.id_addresse = user.email;
    assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123456', dataCorrespondenceSent.title);
}

function closeModalAlert() {
    dataCorrespondenceSent.dataModalAlert.isActive = 'hidde';
}

async function searchFilingsRequestList(searched_value: any, page: any) {
    dataCorrespondenceSent.dataTableCorrespondenceReceived.data = [];
    dataCorrespondenceSent.dataTableCorrespondenceReceived.stateLoadData = true;
    FilingServices.getFilingsCreatedByUser(searched_value, page, dataCorrespondenceSent.dataPaginator.page_size)
        .then((response: any) => {
            dataCorrespondenceSent.dataPaginator.page = page;
            dataCorrespondenceSent.dataPaginator.total_pages = response.total_pages
            dataCorrespondenceSent.dataTableCorrespondenceReceived.data = response.results.map((data: any) => ({
                ...data,
                isMenuOpen: false
            }));
            dataCorrespondenceSent.dataTableCorrespondenceReceived.stateLoadData = false;
        })
        .catch((error: any) => {
            dataCorrespondenceSent.dataTableCorrespondenceReceived.stateLoadData = false;
            console.error('Error fetching data:', error);
        });
}


/**
 * TODO FUNCTIONS SEND
 */





/**
* TODO FUNCTIONS VALIDATIONS
*/

function openModalPdfViewer(data: any) {
    dataCorrespondenceSent.dataModalPdfViewer = {
        isActive: 'show',
        dataPdfViewer: {
            urlPdf: data,
            toolbar: { toolbar: false },
            onClose: () => { }
        }

    }
}

function openModalConfirmation(text: string): void {
    dataCorrespondenceSent.dataModalConfirmation.isActive = 'show';
    dataCorrespondenceSent.dataModalConfirmation.dataText.text = text;
}

function closeModalConfirmation() {
    dataCorrespondenceSent.dataModalConfirmation.isActive = 'hidde';
    dataCorrespondenceSent.stateResponseFiling = false;
}

function closeModalResponseFiling() {
    dataCorrespondenceSent.dataModalResponseFiling.isActive = false
}

function defineActionToFiling(action: string) {
    switch ('key') {
        case 'key':

            break;

        default:
            break;
    }
}

function validateNavegationImgBack() {
    switch (dataCorrespondenceSent.stateViewFile) {
        case 'step1':
            statesBack()
            break;
        case 'step12':
            assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step1', 'welcome_to_the_filing_module');
            dataCorrespondenceSent.id_addresse = 0;
            resetForm();
            break;
        case 'step123':
            assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step12', 'outgoing_filing_module');
            break;
        case 'step12345678':
            statesBack()
            break;
        default:
            break;
    }
}

function validateNavegationButtonBack() {
    switch (dataCorrespondenceSent.stateViewFile) {
        case 'step1234':
            assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step1', 'welcome_to_the_filing_module');
            dataCorrespondenceSent.dataSelectListActionUsers.usersSelecteds = [];
            resetForm();
            break;
        case 'step12345':
            assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123', 'outgoing_filing_module');
            resetRemitterForm();
            break;
        case 'step123456':
            dataCorrespondenceSent.stateFlow === 'internal' ?
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step1234', 'internal_filing_module') :
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123', 'outgoing_filing_module')
            break;
        case 'step1234567':
            dataCorrespondenceSent.stateFlow === 'internal' ?
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123456', 'internal_filing_module') :
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123456', 'outgoing_filing_module')
            break;
        default:
            break;
    }

}

function validateNavegationButtonNext() {
    switch (dataCorrespondenceSent.stateViewFile) {
        case 'step1234':
            if (getValidationFormActionUsers()) {
                assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123456', dataCorrespondenceSent.title);
            }
            break;

        case 'step12345':
            createRemitter();
            break;
        case 'step123456':
            if (FormValidators.getValidationForm('trd-container__form-trd')) {
                assignButtonNextData('create_filing', '/Buttons/icon-create.svg', 'step1234567', dataCorrespondenceSent.title);
            }

            break;
        case 'step1234567':
            if (FormValidators.getValidationForm('correspondence-sent-file__container__editor-container__header')) {
                if(!dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText && dataCorrespondenceSent.contentDocument === ''){
                    openModalAlert('a_file_has_not_been_loaded');
                } else {
                    dataCorrespondenceSent.dataDocumentCreator.setDataPage();
                    createFiling()
                }
            }
            break;
        default:
            break;
    }
}

function getValidationFormActionUsers() {
    let ans = true;
    if (dataCorrespondenceSent.dataSelectListActionUsers.usersSelecteds.length == 0) {
        dataCorrespondenceSent.dataModalAlertTemp.isActive = 'show';
        dataCorrespondenceSent.dataModalAlertTemp.dataText.text = 'at_least_one_user_must_be_selected';
        ans = false;
    }
    else if (!FormValidators.getValidationForm('table__row__cell')) {
        dataCorrespondenceSent.dataModalAlertTemp.isActive = 'show';
        dataCorrespondenceSent.dataModalAlertTemp.dataText.text = 'all_inputs_empy';
        ans = false;
    }
    return ans;
}

function getValueEditor(value: any) {
    valueEditor.value = value.map(({ page, dataDocumentCreatorPageBody }: any) => ({
        page,
        content: store.escapeHtmlContent(dataDocumentCreatorPageBody.dataEditor.content)
    }));//This gonna be string for optimized process but could be modify
}

function createFiling() {
    dataCorrespondenceSent.stateResponseFiling = true;
    const usersReview: any[] = dataCorrespondenceSent.dataSelectListActionUsers.usersSelecteds.filter((data: any) => data.action === 'review').map((data: any) => data.email);
    const usersAprove: any[] = dataCorrespondenceSent.dataSelectListActionUsers.usersSelecteds.filter((data: any) => data.action === 'aprove').map((data: any) => data.email);
    const usersSign: any[] = dataCorrespondenceSent.dataSelectListActionUsers.usersSelecteds.filter((data: any) => data.action === 'sign').map((data: any) => data.email);
    let formData = new FormData();
    formData.append("type_of_filing", dataCorrespondenceSent.typeOfFiling);
    formData.append("subject", dataCorrespondenceSent.subject);
    formData.append("type_response", dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText ? '001' : '002'); // editor or pdf
    formData.append("response_sent", !dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText ? dataCorrespondenceSent.contentDocument : JSON.stringify(valueEditor.value));

    if (usersReview.length > 0 || usersAprove.length > 0 || usersSign.length > 0) {
        if (usersReview.length > 0) {
            formData.append("addressee", usersReview[usersReview.length - 1]);
        } else if (usersAprove.length > 0) {
            formData.append("addressee", usersAprove[usersAprove.length - 1]);
        } else if (usersSign.length > 0) {
            formData.append("addressee", usersSign[usersSign.length - 1]);
        }
    } else {
        formData.append("addressee", dataCorrespondenceSent.id_addresse);
    }

    (dataCorrespondenceSent.dataFormTrd.serie != '' && dataCorrespondenceSent.dataFormTrd.serie != null) && formData.append('serie', dataCorrespondenceSent.dataFormTrd.serie);
    (dataCorrespondenceSent.dataFormTrd.subserie != '' && dataCorrespondenceSent.dataFormTrd.subserie != null) && formData.append('subserie', dataCorrespondenceSent.dataFormTrd.subserie);
    (dataCorrespondenceSent.dataFormTrd.documentary_type != '' && dataCorrespondenceSent.dataFormTrd.documentary_type != null) && formData.append('documentary_type', dataCorrespondenceSent.dataFormTrd.documentary_type);


    usersReview.length > 0 && formData.append("review_users", JSON.stringify(usersReview));
    usersAprove.length > 0 && formData.append("approver_users ", JSON.stringify(usersAprove));
    usersSign.length > 0 && formData.append("signer_users ", JSON.stringify(usersSign));
    formData.append("conclusion_type", "002"); //aprove
    FilingServices.createFiling(formData)
        .then((response: any) => {
            console.error(response);
            console.error(response.filing_qr);
            dataCorrespondenceSent.dataResumeFiling.url = response.filing_qr;
            dataCorrespondenceSent.dataResumeFiling.subject = response.subject;
            dataCorrespondenceSent.dataResumeFiling.filing_number = response.filing_code;
            dataCorrespondenceSent.dataResumeFiling.creation_date = response.filing_date;
            dataCorrespondenceSent.dataResumeFiling.email = response.assigned_user.email;
            dataCorrespondenceSent.dataResumeFiling.response_mode = response.response_mode?.label ?? 'null';
            urlPdfCertificated.value = response.filing_certificate;
            urlPdfSticker.value = response.filing_sticker;

            openModalConfirmation('your_filing_was_sent_successfully');
            dataCorrespondenceSent.stateViewFile = 'step12345678';
            dataCorrespondenceSent.title = 'filing_sent'
            dataCorrespondenceSent.stateResponseFiling = true;
        })
        .catch((error: any) => {
            openModalAlert('an_error_has_occurred_please_try_again_later');
            dataCorrespondenceSent.stateResponseFiling = true;
            console.error(error);
        })

}

async function createRemitter() {
    const data: any = {};
    if (FormValidators.getValidationForm('create-remitter-form__content__form')) {
        dataCorrespondenceSent.stateCreateRemmiter = false;

        (dataCorrespondenceSent.dataCreateRemitterForm.form.personType != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.personType != null) &&
            Object.assign(data, { person_type: dataCorrespondenceSent.dataCreateRemitterForm.form.personType });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.first_name != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.first_name != null) &&
            Object.assign(data, { first_name: dataCorrespondenceSent.dataCreateRemitterForm.form.first_name });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.middle_name != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.middle_name != null) &&
            Object.assign(data, { middle_name: dataCorrespondenceSent.dataCreateRemitterForm.form.middle_name });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.last_name != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.last_name != null) &&
            Object.assign(data, { last_name: dataCorrespondenceSent.dataCreateRemitterForm.form.last_name });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.second_last_name != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.second_last_name != null) &&
            Object.assign(data, { second_last_name: dataCorrespondenceSent.dataCreateRemitterForm.form.second_last_name });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.identification_type != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.identification_type != null) &&
            Object.assign(data, { identification_type: dataCorrespondenceSent.dataCreateRemitterForm.form.identification_type });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.identification_number != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.identification_number != null) &&
            Object.assign(data, { identification_number: dataCorrespondenceSent.dataCreateRemitterForm.form.identification_number });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.contact_name != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.contact_name != null) &&
            Object.assign(data, { contact_name: dataCorrespondenceSent.dataCreateRemitterForm.form.contact_name });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.social_reason != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.social_reason != null) &&
            Object.assign(data, { social_reason: dataCorrespondenceSent.dataCreateRemitterForm.form.social_reason });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.nit_number != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.nit_number != null) &&
            Object.assign(data, { nit_number: dataCorrespondenceSent.dataCreateRemitterForm.form.nit_number });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.country != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.country != null) &&
            Object.assign(data, { country: dataCorrespondenceSent.dataCreateRemitterForm.form.country });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.department != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.department != null) &&
            Object.assign(data, { department: dataCorrespondenceSent.dataCreateRemitterForm.form.department });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.city != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.city != null) &&
            Object.assign(data, { city: dataCorrespondenceSent.dataCreateRemitterForm.form.city });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.address != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.address != null) &&
            Object.assign(data, { address: dataCorrespondenceSent.dataCreateRemitterForm.form.address });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.phone_number != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.phone_number != null) &&
            Object.assign(data, { phone_number: dataCorrespondenceSent.dataCreateRemitterForm.form.phone_number });

        (dataCorrespondenceSent.dataCreateRemitterForm.form.email != '' && dataCorrespondenceSent.dataCreateRemitterForm.form.email != null) &&
            Object.assign(data, { email: dataCorrespondenceSent.dataCreateRemitterForm.form.email });

        UserServices.createRemitter(data).then((response: any) => {
            dataCorrespondenceSent.id_remitter = response.data.response.id;
            resetRemitterForm();
            dataCorrespondenceSent.dataModalConfirmation = {
                isActive: 'show',
                dataText: {
                    classText: 'big',
                    text: 'the_remitter_was_created',
                    disabled: false,
                    onClick: () => { }
                },
                dataButton: {
                    className: 'blue',
                    text: 'continue',
                    alt: 'continue',
                    url: '/Buttons/right-arrow.svg',
                    reverse: true,
                    disabled: false,
                    onClick: () => {
                        dataCorrespondenceSent.dataModalConfirmation.isActive = 'hidde';
                        assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step123456', dataCorrespondenceSent.title);

                    }
                },

            }
            dataCorrespondenceSent.stateCreateRemmiter = true;

        })
            .catch(error => {
                dataCorrespondenceSent.dataModalConfirmation.isActive = 'hidde';

                dataCorrespondenceSent.dataModalAlertTemp = {
                    isActive: 'show',
                    dataText: {
                        classText: 'center',
                        text: error.response.data.error.details[0] ?? 'an_error_has_occurred_please_try_again_later',
                        disabled: false,
                        onClick: () => { }
                    },
                    dataButton: {
                        className: 'blue',
                        text: 'close',
                        alt: 'close',
                        url: '/Buttons/decline.svg',
                        iconSize: 'short',
                        reverse: false,
                        disabled: false,
                        onClick: () => {
                            dataCorrespondenceSent.dataModalAlertTemp.isActive = 'hidde';
                        }
                    },

                }
                dataCorrespondenceSent.stateCreateRemmiter = true;
            })
    } else {
        dataCorrespondenceSent.dataModalAlertTemp = {
            isActive: 'show',
            dataText: {
                classText: 'center',
                text: 'all_inputs_empy',
                disabled: false,
                onClick: () => { }
            },
            dataButton: {
                className: 'blue',
                text: 'close',
                alt: 'close',
                url: '/Buttons/decline.svg',
                iconSize: 'short',
                reverse: false,
                disabled: false,
                onClick: () => {
                    dataCorrespondenceSent.dataModalAlertTemp.isActive = 'hidde';
                }
            },

        }
    }
}

const showMenuTableFilings = (code: any) => filing_code_filing.value = code;

/**
 * TODO FUNCTIONS REDIRECTS AND NAVEGATIONS
 */

function redirectCreateRemitter() {
    assignButtonNextData('continue', '/Buttons/right-arrow.svg', 'step12345', 'outgoing_filing_module');
}

function redirectNeWFiling() {
    dataCorrespondenceSent.state = 'viewNewFile';
    dataCorrespondenceSent.stateViewFile = 'step1';
    dataCorrespondenceSent.title = 'welcome_to_the_filing_module'; 
}

function statesBack() { //This functions is for get initial data and update
    Object.assign(dataCorrespondenceSent, getDataCorrespondenceSent());
    callServices();
    dataCorrespondenceSent.stateViewFile = '';
}

function assignButtonNextData(text: any, url: any, step: any, title: any, iconSize?: any) {
    dataCorrespondenceSent.dataButtonGoToNext.text = text;
    dataCorrespondenceSent.dataButtonGoToNext.url = url;
    dataCorrespondenceSent.stateViewFile = step;
    dataCorrespondenceSent.title = title;
    switch (iconSize) {
        case 'large':
            dataCorrespondenceSent.dataButtonGoToNext.iconSize = 'large';
            break;
        case 'short':
            dataCorrespondenceSent.dataButtonGoToNext.iconSize = 'short';
            break;
        default:
            dataCorrespondenceSent.dataButtonGoToNext.iconSize = null;
            break;
    }
}

function resetForm() {
    dataCorrespondenceSent.stateFlow = '';
    dataCorrespondenceSent.contentDocument = '';
    dataCorrespondenceSent.subject = '';
    dataCorrespondenceSent.dataFormTrd = {
            serie: '',
            subserie: '',
            documentary_type: '',
        };
}

function resetRemitterForm() {
    dataCorrespondenceSent.dataCreateRemitterForm.form = {
        personType: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        second_last_name: '',
        identification_type: '',
        identification_number: '',
        contact_name: '',
        social_reason: '',
        nit_number: '',
        country: '',
        department: '',
        city: '',
        address: '',
        phone_number: '',
        email: '',
    }
}

</script>

<style scoped src="./CorrespondenceSent.page.scss"></style>